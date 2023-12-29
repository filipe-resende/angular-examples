import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import {
  ApplicationItem,
  ApplicationRequest,
} from 'src/app/model/applications-interfaces';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { Roles } from 'src/app/shared/enums/iam.enums';
import { ApplicationsStateService } from 'src/app/stores/applications/applications-state.service';

@Component({
  selector: 'app-application-update',
  templateUrl: './application-update.component.html',
  styleUrls: ['./application-update.component.scss'],
})
export class ApplicationUpdateComponent implements OnInit, OnDestroy {
  public ngForm: FormGroup;

  public formData: ApplicationItem;

  public application$: Observable<ApplicationItem>;

  private subscription: Subscription[] = [];

  private TEXT_RESOURCES: { [key: string]: string } = {};

  public applicationId = '';

  public isEditingAllowed = false;

  constructor(
    private loggingService: LoggingService,
    private applicationsStateService: ApplicationsStateService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertModalService,
    private router: Router,
    private translate: TranslateService,
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  public ngOnInit(): void {
    this.loggingService.logEventWithUserInfo(
      'Portal TM - Navegou para applications/update',
    );
    const { id } = this.activatedRoute.snapshot.params;
    this.applicationId = id;
    this.setupTranslateFilesText();

    this.ngForm = this.setupForm();
    this.loadApplication();

    this.setupUpdatedApplicationSubscription();
    this.setupErrorSubscription();

    this.application$ = this.applicationsStateService.selectedApplication$.pipe(
      filter(application => !!application),
      tap(application => this.loadForm(application)),
    );

    this.authService.userInfo$
      .pipe(filter(x => !!x))
      .pipe(take(1))
      .subscribe(userInfo => {
        this.isEditingAllowed = userInfo.role === Roles.Administrador;

        if (!this.isEditingAllowed) {
          this.ngForm.get('name').disable();
          this.ngForm.get('description').disable();
        }
      });
  }

  public ngOnDestroy(): void {
    this.applicationsStateService.clearNewApplication();
    this.subscription.map(sub => sub.unsubscribe());
  }

  public update(): void {
    if (this.formUpdateValidation()) return;

    const updateApplicationPayload = {
      ...this.ngForm.value,
    } as ApplicationRequest;

    this.applicationsStateService.onUpdateSelectedApplication(
      this.applicationId,
      updateApplicationPayload,
    );
  }

  public onRouteUserToDevices(): void {
    this.router.navigate([
      'devices',
      {
        applicationId: this.applicationId,
        name: this.ngForm.controls.name.value,
      },
    ]);
  }

  private loadApplication(): void {
    this.applicationsStateService.getApplicationById(this.applicationId);
  }

  private setupForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      allowDeviceAssociation: [false],
      allowInclusionDeviceGroup: [false],
      showInDeviceTypesList: [false],
    });
  }

  private loadForm(application: ApplicationItem): void {
    this.ngForm.get('name').setValue(application.name);
    this.ngForm.get('description').setValue(application.description);
    this.ngForm
      .get('allowDeviceAssociation')
      .setValue(application.allowDeviceAssociation);
    this.ngForm
      .get('allowInclusionDeviceGroup')
      .setValue(application.allowInclusionDeviceGroup);
    this.ngForm
      .get('showInDeviceTypesList')
      .setValue(application.showInDeviceTypesList);
  }

  private setupUpdatedApplicationSubscription(): void {
    const updatedApplicationSub = this.applicationsStateService.applicationElement$
      .pipe(
        filter(updatedApplication => !!updatedApplication),
        tap((): void => {
          this.loggingService.logEventWithUserInfo(
            'Portal TM - Editou a aplicação',
          );
          this.alertService.showAlertSuccess(this.TEXT_RESOURCES.SUCCESS, '');
          this.router.navigateByUrl('applications');
        }),
      )
      .subscribe();

    this.subscription.push(updatedApplicationSub);
  }

  private setupErrorSubscription(): void {
    const errorSub = this.applicationsStateService.errorMessage$
      .pipe(
        filter(error => !!error),
        tap(() => {
          const error = new Error();
          this.alertService.showAlertDanger(
            this.TEXT_RESOURCES.NAME_ALREADY_EXIST,
            '',
          );
          this.loggingService.logException(error, SeverityLevel.Warning);
        }),
      )
      .subscribe();

    this.subscription.push(errorSub);
  }

  private formUpdateValidation(): boolean {
    if (!this.ngForm.get('name').value) {
      this.logException('Tentou editar uma aplicação sem informar um nome');
      this.alertService.showAlertDanger(this.TEXT_RESOURCES.NAME_EMPTY, '');
      return true;
    }

    if (!this.ngForm.get('description').value) {
      this.logException(
        'Tentou editar uma aplicação sem informar uma descriçào',
      );
      this.alertService.showAlertDanger(
        this.TEXT_RESOURCES.DESCRIPTION_EMPTY,
        '',
      );
      return true;
    }

    return false;
  }

  private setupTranslateFilesText(): void {
    const translateResources = this.translate
      .get('APPLICATION_UPDATE')
      .pipe(
        map(
          ({
            SAVE_RESPONSE: {
              SUCCESS,
              BAD_SERVER,
              NAME_ALREADY_EXIST,
              NAME_EMPTY,
              DESCRIPTION_EMPTY,
            },
          }) => {
            return {
              SUCCESS,
              BAD_SERVER,
              NAME_ALREADY_EXIST,
              NAME_EMPTY,
              DESCRIPTION_EMPTY,
            };
          },
        ),
      )
      .subscribe(resources => {
        this.TEXT_RESOURCES = resources;
      });

    this.subscription.push(translateResources);
  }

  private logException(term: string) {
    this.loggingService.logException(
      new Error(term),
      SeverityLevel.Information,
    );
  }
}
