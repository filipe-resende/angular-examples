import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApplicationItem,
  ApplicationRequest,
} from 'src/app/model/applications-interfaces';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { ApplicationsStateService } from 'src/app/stores/applications/applications-state.service';

@Component({
  selector: 'app-application-create',
  templateUrl: './application-create.component.html',
  styleUrls: ['./application-create.component.scss'],
})
export class ApplicationCreateComponent implements OnInit, OnDestroy {
  public applicationForm: FormGroup;

  public text: { [key: string]: string } = {};

  public transalteTerms$: Observable<{ [key: string]: string }>;

  private subscriptions: Subscription[] = [];

  constructor(
    private loggingService: LoggingService,
    private applicationsStateService: ApplicationsStateService,
    private alertService: AlertModalService,
    private router: Router,
    private translate: TranslateService,
    private fb: FormBuilder,
  ) {}

  public ngOnInit(): void {
    this.logUserNavigationToThisPage();
    this.applicationForm = this.setupForm();

    this.setupTranslateFilesResources();
    this.setupNewApplicationSubscription();
    this.setupErrorSubscription();
  }

  public ngOnDestroy(): void {
    this.applicationsStateService.onClearNewApplicationState();
    this.subscriptions.map(sub => sub.unsubscribe());
  }

  public onSubmit(): void {
    const createApplicationRequest = {
      ...this.applicationForm.value,
    } as ApplicationRequest;
    this.applicationsStateService.onCreateApplication(createApplicationRequest);
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

  private setupNewApplicationSubscription(): void {
    const newApplicationSub = this.applicationsStateService.applicationElement$.subscribe(
      (newApplication: ApplicationItem) => {
        if (newApplication) {
          this.alertService.showAlertSuccess(this.text.SUCCESS, '');
          this.router.navigateByUrl('applications');
        }
      },
    );

    this.subscriptions.push(newApplicationSub);
  }

  private setupErrorSubscription(): void {
    const errorMsgSub = this.applicationsStateService.errorMessage$.subscribe(
      errorMsg => {
        if (errorMsg && errorMsg.includes('already exist'))
          this.alertService.showAlertDanger(this.text.NAME_ALREADY_EXISTS, '');
      },
    );

    this.subscriptions.push(errorMsgSub);
  }

  private setupTranslateFilesResources(): void {
    const translateResources = this.translate
      .get('APPLICATION_CREATE.SAVE_RESPONSE')
      .pipe(
        map(({ NAME_ALREADY_EXISTS, SUCCESS }) => {
          return { NAME_ALREADY_EXISTS, SUCCESS };
        }),
      )
      .subscribe(resources => {
        this.text = resources;
      });

    this.subscriptions.push(translateResources);
  }

  private logUserNavigationToThisPage(): void {
    this.loggingService.logEventWithUserInfo(
      'Portal TM - Navegou para applications/create',
    );
  }
}
