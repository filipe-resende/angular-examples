/* eslint-disable no-param-reassign */
import { Component, OnInit } from '@angular/core';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApplicationsIds } from 'src/app/core/constants/applications.const';
import {
  ApplicationItem,
  Applications,
} from 'src/app/model/applications-interfaces';
import { Area } from 'src/app/model/area';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { DetectorsService } from 'src/app/services/detectors/detectors.service';
import { ApplicationsService } from 'src/app/services/factories/applications.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { DetectorItem } from '../../model/detectors-interface';

@Component({
  selector: 'app-detectors',
  templateUrl: './detectors.component.html',
  styleUrls: ['./detectors.component.scss'],
})
export class DetectorsComponent implements OnInit {
  public applications$: Observable<any>;

  public applications: ApplicationItem[] = [];

  public selectedApplication = '';

  public currentPage = 1;

  public detectors$: Observable<any>;

  public detectors = [];

  public detectorsList: DetectorItem[] = [];

  public selectedDetectorListActive: DetectorItem[] = [];

  public selectedDetectorListInactive: DetectorItem[] = [];

  public showSpinner = false;

  public areaId = '';

  public areaName = '';

  public selectArea = '';

  public area: Area;

  public searchInput = '';

  public page = 10;

  public loadingError$ = new Subject<boolean>();

  public count: number;

  public offset = 0;

  public statusPerimeterFilter: boolean;

  public typeFilter = '';

  public type: string;

  public isAreaAccessPoint: boolean;

  public selectedApplicationForList: string;

  constructor(
    private http: DetectorsService,
    private loggingService: LoggingService,
    private applicationService: ApplicationsService,
    private detectorService: DetectorsService,
    private alertService: AlertModalService,
  ) {}

  ngOnInit(): void {
    this.loggingService.logEventWithUserInfo(
      'Portal TM - Navegou para home de equipamentos',
    );

    this.getApplications();
    this.selectApplication();
    this.selectedApplicationForList = 'Security Center';
  }

  getApplications(): void {
    this.applications$ = this.applicationService.getAll();
    this.applications$.subscribe(
      (data: Applications) => {
        this.applications = data.applications.filter(
          id => id.id === ApplicationsIds.SecurityCenter,
        );
      },
      error => this.loggingService.logException(error, SeverityLevel.Warning),
    );
  }

  selectApplication(): void {
    this.selectedApplication = ApplicationsIds.SecurityCenter;
    this.currentPage = 1;
    this.getSelectDetectors(this.selectedApplication, 0, this.count);
    this.resetAssociationList();
    this.typeFilter = '';
  }

  getSelectDetectors(applicationId, offset, count): void {
    this.detectors$ = this.http.getAll(
      applicationId,
      this.type,
      this.isAreaAccessPoint,
      offset,
      100000,
    );
    this.detectors$
      .pipe(
        catchError(() => {
          this.loadingError$.next(true);
          return of();
        }),
      )
      .subscribe(
        response => {
          this.detectors = response.detectors;
          this.count = response.count;
          this.resetAssociationList();
        },
        error => {
          this.loggingService.logException(error, SeverityLevel.Warning);
          this.alertService.showAlertDanger(
            'Equipamento não encontrado!',
            'Por favor verifique os dados fornecidos',
          );
        },
      );
  }

  getByType(type, offset = this.offset): void {
    this.currentPage = 1;
    this.typeFilter = type;
    this.resetAssociationList();
    this.filterByType(type, offset);
  }

  private filterByType(type, offset): void {
    this.detectors$ = this.detectorService.getAll(
      this.selectedApplication,
      type,
      this.isAreaAccessPoint,
      offset,
      100000,
    );
    this.detectors$.subscribe(response => {
      this.detectors = response.detectors;
      this.count = response.count;
    });
  }

  getByStatusPerimeter(isAreaAccessPoint, offset = this.offset): void {
    this.currentPage = 1;
    this.statusPerimeterFilter = isAreaAccessPoint;
    this.resetAssociationList();
    this.filterByPerimeter(isAreaAccessPoint, offset);
  }

  private filterByPerimeter(isAreaAccessPoint, offset): void {
    this.detectors$ = this.detectorService.getAll(
      this.selectedApplication,
      this.type,
      isAreaAccessPoint,
      offset,
      100000,
    );
    this.detectors$.subscribe(response => {
      this.count = response.count;
      this.detectors = response.detectors;
    });
  }

  resetAssociationList(): void {
    document
      .querySelectorAll('.checkbox')
      .forEach((element: HTMLInputElement) => {
        element.checked = false;
      });

    this.selectedDetectorListActive = [];
    this.selectedDetectorListInactive = [];
  }

  paginate(value: number): void {
    this.resetAssociationList();
    this.currentPage = value;

    if (this.typeFilter.length) {
      return value > 1
        ? this.filterByType((value - 1) * 10, this.typeFilter)
        : this.filterByType(0, this.typeFilter);
    }
    return value > 1
      ? this.getSelectDetectors(this.selectedApplication, 0, (value - 1) * 10)
      : this.getSelectDetectors(this.selectedApplication, 0, 10);
  }
}
