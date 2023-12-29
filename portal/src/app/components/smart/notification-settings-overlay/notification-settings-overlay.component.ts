import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, throwError } from 'rxjs';
import {
  catchError,
  filter,
  finalize,
  map,
  mergeMap,
  take,
  tap
} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { NotificationSettingsService } from '../../../core/services/notification-settings/notification-settings.service';
import { SitesService } from '../../../stores/sites/sites.service';
import { SitesModel } from '../../../stores/sites/sites.state';
import { NotificationSettings } from '../../../shared/models/notificationSettings';
import { NotificationService } from '../../presentational/notification/notification.service';
import { UserProfileService } from '../../../stores/user-profile/user-profile.service';
import { UserProfile } from '../../../shared/models/user-profile';

@Component({
  selector: 'app-notification-settigns-overlay',
  templateUrl: './notification-settings-overlay.component.html',
  styleUrls: ['./notification-settings-overlay.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationSettingsOverlayComponent implements OnInit, OnDestroy {
  public settingsForm: FormGroup;

  public user$: Observable<NotificationSettings>;

  public sites$: Observable<SitesModel[]>;

  public isLoadingButton = false;

  private subscriptions: Subscription[] = [];

  private savedSuccessfullyMessage: string;

  private errorOnSaveMessage: string;

  private errorOnGetUserInfoMessage: string;

  constructor(
    private dialogRef: MatDialogRef<NotificationSettingsOverlayComponent>,
    private userProfileService: UserProfileService,
    private fb: FormBuilder,
    private sitesService: SitesService,
    private notificationSettingsService: NotificationSettingsService,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.settingsForm = this.setupSettingsForm();

    this.setupTranslateFilesResources();
    this.setupSitesSub();
    this.closeWhenClickedOutside();

    this.user$ = this.setupUserInfosObs();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  public close(): void {
    this.dialogRef.close();
  }

  public onToggleSmsInput({ checked }: MatSlideToggleChange): void {
    this.settingsForm.controls.sendSms.setValue(checked);
    this.isSmsToggleMarkedAndSmsFieldValid(checked);
  }

  public onToggleEmailInput(
    { checked }: MatSlideToggleChange,
    email?: string
  ): void {
    this.settingsForm.patchValue({ sendEmail: checked });

    const emailValidated = checked ? email : '';

    this.settingsForm.patchValue({ email: emailValidated });
  }

  public onSaveNotificationsPreferences(): void {
    const newNotificationSettings = this.getNotificationsSettings(
      this.settingsForm.value
    );

    this.isLoadingButton = true;

    this.notificationSettingsService
      .setNotificationsSettingsPreferences(newNotificationSettings)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoadingButton = false;
        })
      )
      .subscribe(
        () => {
          this.notificationService.success(this.savedSuccessfullyMessage);
          this.close();
        },
        () => {
          this.notificationService.error(this.errorOnSaveMessage);
        }
      );
  }

  private getNotificationsSettings(
    settingsForm: NotificationSettings
  ): NotificationSettings {
    const { phoneNumber } = settingsForm;

    const phone = phoneNumber ? `+55${phoneNumber}` : phoneNumber;

    return {
      ...settingsForm,
      phoneNumber: phone,
      isDisabled: false
    };
  }

  private getSitesListById(
    sistesModelList: SitesModel[]
  ): { [key: string]: string }[] {
    const statesList = sistesModelList?.map(
      ({ childrenSites }) => childrenSites
    );
    const sitesIdsList = statesList.map(state =>
      state.map(({ childrenSites }) =>
        childrenSites.map(site => ({ siteId: site.id }))
      )
    );

    return _.flattenDeep(sitesIdsList);
  }

  private setupSitesSub(): void {
    const sitesSub = this.sitesService.sites$.subscribe(sites => {
      const siteListById = this.getSitesListById(sites);
      this.settingsForm.get('sites').patchValue(siteListById);
    });

    this.subscriptions.push(sitesSub);
  }

  private setupSettingsForm(): FormGroup {
    return this.fb.group({
      sendEmail: [false],
      sendSms: [false],
      email: [''],
      phoneNumber: [''],
      sites: [null],
      panicAlert: [true],
      lowBattery: [true],
      iamId: ['']
    });
  }

  private setupUserInfosObs(): Observable<NotificationSettings> {
    return this.userProfileService.userProfile$.pipe(
      filter(x => !!x),
      mergeMap(user => this.toUserInfoWithDefaultEmail(user)),
      tap(userInfo => {
        this.setInitialUserValues(userInfo);
      }),
      catchError(error => {
        this.notificationService.error(this.errorOnGetUserInfoMessage);
        this.close();
        return throwError(error);
      })
    );
  }

  /**
   * For compatibility reasons with the notifications API, we've kept the iamId as the email username.
   */
  private toUserInfoWithDefaultEmail({
    iamId,
    email
  }: UserProfile): Observable<NotificationSettings> {
    return this.notificationSettingsService
      .getNotificationsSettingsPreferences(iamId)
      .pipe(map(infos => ({ ...infos, iamId, email })));
  }

  private setInitialUserValues(userInfo: NotificationSettings): void {
    const { phoneNumber } = userInfo;

    const phone = phoneNumber ? phoneNumber.replace('+55', '') : phoneNumber;

    this.settingsForm.patchValue({ ...userInfo, phoneNumber: phone });
    this.isSmsToggleMarkedAndSmsFieldValid(userInfo.sendSms);
  }

  private setupTranslateFilesResources(): void {
    const translateResources = this.translateService
      .get('NOTIFICATION.SETTINGS_OVERLAY')
      .subscribe(
        ({
          SAVE_TOAST_SUCCESS,
          SAVE_TOAST_FAILURE,
          FETCHING_PREFERENCES_FAILURE
        }) => {
          this.savedSuccessfullyMessage = SAVE_TOAST_SUCCESS;
          this.errorOnSaveMessage = SAVE_TOAST_FAILURE;
          this.errorOnGetUserInfoMessage = FETCHING_PREFERENCES_FAILURE;
        }
      );

    this.subscriptions.push(translateResources);
  }

  private isSmsToggleMarkedAndSmsFieldValid(smsToggle: boolean): void {
    const phoneControl = this.settingsForm.get('phoneNumber');

    if (smsToggle) {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }

    phoneControl.updateValueAndValidity();
  }

  private closeWhenClickedOutside() {
    const clckOutsideSub = this.dialogRef.backdropClick().subscribe(this.close);

    this.subscriptions.push(clckOutsideSub);
  }
}
