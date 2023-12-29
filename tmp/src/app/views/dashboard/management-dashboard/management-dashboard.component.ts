import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { ExportListDashComponent } from 'src/app/components/export-list-dash/export-list-dash.component';
import { ExportationDoneModalComponent } from 'src/app/components/exportation-done-modal/exportation-done-modal.component';
import { ExportationRecipientModalComponent } from 'src/app/components/exportation-recipient-modal/exportation-recipient-modal.component';
import { VariationCharts } from 'src/app/core/constants/Charts/variation-charts';
import { Labels } from 'src/app/core/constants/Charts/date-label-charts';
import { ApplicationId } from 'src/app/core/constants/applicationsId.const';
import { ApplicationsName } from 'src/app/core/constants/applicationsName.const';
import { ChartExport } from 'src/app/model/charts/chart-export-interface';
import { ChartsListModel } from 'src/app/model/charts/chart-list-model-interface';
import { ChartModelIdentify } from 'src/app/model/charts/chart-modal-identify-interface';
import { ChartModel } from 'src/app/model/charts/chart-model-interface';
import { ChartSummary } from 'src/app/model/charts/summary-interfaces/chart-summary-interface';
import { DeviceStatus } from 'src/app/model/device-status';
import { SapPlant, SapPlantAll } from 'src/app/model/sap-plant-interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard-service';
import { SapPlantService } from 'src/app/services/factories/sap-plant.service';
import { PeriodDateEnum } from 'src/app/shared/enums/periodDate.enum';
import { DeviceStatusStateService } from 'src/app/stores/device-status/device-status-state.service';
import { LabelsCharts } from 'src/app/core/constants/Charts/label-charts';
import { ThingCompanyComponent } from 'src/app/components/thing-company/thing-company.component';
import { ChartsEnableExportation } from 'src/app/model/charts/chart-enable-exportation-interface';
import { ExportParametersRequest } from 'src/app/model/charts/export-parameters-request-interface';
import { ChartsFilterRequest } from 'src/app/model/charts/charts-filter-request-interface';
import { GraphicsSelectedForExport } from 'src/app/model/charts/graphics-selected-for-export-interface';
import { chartModelList } from 'src/app/model/charts/chart-model-list-interface';
import { ThingEmailComponent } from 'src/app/components/thing-email/thing-email.component';
import { ChartsVariation } from 'src/app/model/charts/summary-interfaces/chart-variation-interface';
import { ChartsFilterExportValidation } from 'src/app/model/device-group-management/charts-filter-export-validation';

@Component({
  selector: 'app-management-dashboard',
  templateUrl: './management-dashboard.component.html',
  styleUrls: ['./management-dashboard.component.scss'],
})
export class ManagementDashboardComponent implements OnInit {
  @ViewChild('companies') companyComponent: ThingCompanyComponent;

  @ViewChild('thingEmail') emailComponent: ThingEmailComponent;

  @Output()
  buttonIsEnabled: EventEmitter<boolean> = new EventEmitter<boolean>();

  public canExportAssociate = false;

  public canExportDeviceStatus = false;

  public canExportSapPlant = false;

  public canExportOverallInUse = false;

  public canExportCompany = false;

  public canExportLocationTransmission = false;

  public canExportDeviceManager = false;

  public enableExportByAssociate = false;

  public enableExportByDeviceStatus = false;

  public enableExportBySapPlant = false;

  public enableExportByCompany = false;

  public enableExportByOverallInUse = false;

  public enableExportByLocationTransmission = false;

  public enableExportByDeviceManager = false;

  public date = new Date();

  public applicationId = ApplicationId;

  public typeDevice = this.applicationId.SMARTBADGE;

  public variationResume = VariationCharts;

  public deviceStatusOptions: DeviceStatus[] = [];

  public deviceStatusByType: DeviceStatus[] = [];

  public spotStatusId = [1, 5, 8, 9, 10];

  public smartStatusId = [1, 4, 5, 6, 7, 10];

  public dataSapPlant: SapPlantAll;

  public filterDataSapPlants = [];

  public sapPlantLoading: boolean;

  public sapPlant = '';

  public sapPlantId = '';

  public managerId = '';

  public managerEmail = '';

  public exportManagerEmail: string;

  public exportCompanyName: string;

  public datePeriod = PeriodDateEnum.MonthNow;

  public associationStatus = '';

  public deviceStatus = '';

  public companyCollaborator = '';

  public checkTheSelectedDeviceSmart = true;

  public checkTheSelectedDeviceSpot = false;

  public sapPlantDataGraph: ChartModel[] = [];

  public employeesCompanyDataGraph: ChartModel[] = [];

  public managersDataGraph: ChartModel[] = [];

  public deviceStatusDataGraph: ChartsListModel;

  public evolutionDataGraph: ChartsListModel;

  public isLoadingSapPlant = true;

  public isLoadingCompany = true;

  public isLoadingManagers = true;

  public isYesterdayMessage = true;

  public associationStatusDataGraph: ChartModelIdentify[] = [];

  public notAssociationStatusDataGraph: ChartModelIdentify[] = [];

  public totalInUseDataGraphTotal: ChartModelIdentify[] = [];

  public totalInUseDataGraphInUse: ChartModelIdentify[] = [];

  public broadcastDataGraphBroadcast: ChartModelIdentify[] = [];

  public notBroadcastDataGraphBroadcast: ChartModelIdentify[] = [];

  public summaryDataGraph: ChartSummary;

  public nameChartSapPlantSelected = 'doughnut';

  public nameChartAssociationSelected = 'bar';

  public nameChartTotalInUseSelected = 'bar';

  public nameChartBroadcastSelected = 'bar';

  public isLoadingAssociate = true;

  public isLoadingTotalInUse = true;

  public isLoadingBroadcast = true;

  public isLoadingDeviceStatus = true;

  public isLoadingSummary = true;

  public isLoadingEvolutionCharts = true;

  public periodMessage = '';

  public selectedApplication = ApplicationsName.SMARTBADGE;

  public colorsToUsageDashboardAssociationStatus: string[] = [
    '#FCB400',
    '#E3E4E4',
  ];

  public colorsToUsageDashboardTotalInUse: string[] = ['#0ABB98', '#FF6700'];

  public colorsToUsageDashboardBroadcast: string[] = ['#AAF55D', '#2CB8F4'];

  public legendToUsageDashboardAssociationStatus: string[] = [];

  public legendToUsageDashboardTotalInUse: string[] = [];

  public legendToUsageDashboardBroadcast: string[] = [];

  public labelsAssociationStatus: string[] = [];

  public labelsDateTotalInUse: string[] = [];

  public labelsDateBroadcast: string[] = [];

  public associationStatusList: chartModelList[] = [];

  public totalInUseList: chartModelList[] = [];

  public broadCastList: chartModelList[] = [];

  public imageIconGraphTotalInUse = ['iconTotal.png', 'iconInUse.png'];

  public imageIconGraphAssociationStatus = [
    'iconAssociate.png',
    'iconNotAssociation.png',
  ];

  public imageIconGraphBroadCast = ['broadcast.png', 'not_broadcast.png'];

  private associationName = this.translate.instant(
    'DASHBOARD.ASSOCIATED.ASSOCIATION',
  );

  private notAssociationName = this.translate.instant(
    'DASHBOARD.ASSOCIATED.NOT_ASSOCIATION',
  );

  private totalName = this.translate.instant(
    'DASHBOARD.TOTAL_IN_USE_CHARTS.TOTAL',
  );

  private inUseName = this.translate.instant(
    'DASHBOARD.TOTAL_IN_USE_CHARTS.IN_USE',
  );

  private broadcastName = this.translate.instant('DASHBOARD.BROADCAST.ACTIVE');

  private notBroadcastName = this.translate.instant(
    'DASHBOARD.BROADCAST.DISABLED',
  );

  public yesterday = `${moment().subtract(1, 'days').format('DD/MMM/YY')}`;

  private dialogConfig = new MatDialogConfig();

  private emailUser: string;

  public dataExportList: ChartExport;

  public listEnabledExport: ChartsEnableExportation;

  public chartsFilter: ChartsFilterRequest;

  public chartsFilterExport: ChartsFilterExportValidation;

  private modalExportList:
    | MatDialogRef<ExportListDashComponent, any>
    | undefined;

  constructor(
    private deviceStatusStateService: DeviceStatusStateService,
    public sapPlantService: SapPlantService,
    public dashboardService: DashboardService,
    private translate: TranslateService,
    public matDialog: MatDialog,
    private authService: AuthService,
  ) {
    this.sapPlantDisplay();
    moment.locale('pt-br');
    this.legendToUsageDashboardAssociationStatus.push(
      this.associationName,
      this.notAssociationName,
    );

    this.legendToUsageDashboardTotalInUse.push(this.totalName, this.inUseName);
    this.legendToUsageDashboardBroadcast.push(
      this.broadcastName,
      this.notBroadcastName,
    );
  }

  ngOnInit(): void {
    this.prepareChartsFilterToExport();
    this.getSapPlantData();
    this.getEmployeeCompanyData();
    this.getAssociationStatusData();
    this.getTotalInUseData();
    this.getDeviceStatus();
    this.getSummaryData();
    this.getEvolutionCharts();
    this.getManagersData();
    this.getBroadcastData();
    this.emailUser = this.authService.getUserInfo().mail;

    this.deviceStatusStateService.deviceStatus$.subscribe(
      deviceStatusResponse => {
        this.deviceStatusOptions = deviceStatusResponse;
      },
    );
    this.handleDeviceStatusByType();
  }

  public alterTypeDevice(value): void {
    this.typeDevice = value;
    this.resetFields();
    this.handleDeviceStatusByType();
    this.search();
  }

  public handleDeviceStatusByType(): void {
    if (this.typeDevice === this.applicationId.SPOT) {
      this.handleDeviceStatus(this.spotStatusId);
    } else {
      this.handleDeviceStatus(this.smartStatusId);
    }
  }

  public handleDeviceStatus(typeDevice: number[]): void {
    this.deviceStatusByType = this.deviceStatusOptions
      .filter(handleDeviceStatus => typeDevice.includes(handleDeviceStatus.id))
      .sort(function order(a, b) {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });
  }

  public sapPlantDisplay(): void {
    this.sapPlantService.getSapPlant().subscribe(data => {
      this.sapPlantLoading = false;
      this.dataSapPlant = data;
    });
  }

  public saveCompanyName(name: string): void {
    this.companyCollaborator = name;
  }

  public saveManagerId(thingId: string): void {
    this.managerId = thingId;
  }

  public saveManagerEmail(thingEmail: string): void {
    this.managerEmail = thingEmail;
  }

  private filterAndOrderSapPlant(value: string): SapPlant[] {
    return this.dataSapPlant.sapPlants
      .filter(item => item.code.toString().includes(value))
      .sort(function order(a, b) {
        if (a.code < b.code) return -1;
        if (a.code > b.code) return 1;
        return 0;
      });
  }

  public filterSapPlant(): void {
    if (this.dataSapPlant) {
      this.filterDataSapPlants = this.filterAndOrderSapPlant(this.sapPlant);
    } else {
      this.sapPlantDisplay();
      this.sapPlantLoading = true;
    }
  }

  public onFocusLostSapPlant(text: string): void {
    if (!text) {
      this.sapPlantId = '';
      this.sapPlant = '';
      return;
    }

    const firstSapPlant = this.filterAndOrderSapPlant(text)[0];

    if (firstSapPlant) {
      this.valueSapPlant(firstSapPlant);
    } else {
      this.sapPlantId = '';
      this.sapPlant = '';
    }
  }

  public valueSapPlant(sapPlant: SapPlant): void {
    this.sapPlantId = sapPlant.id;
    this.sapPlant = `${sapPlant.code} - ${sapPlant.description}`;
  }

  public resetFields(): void {
    this.sapPlant = '';
    this.sapPlantId = '';
    this.managerId = '';
    this.managerEmail = '';
    this.datePeriod = PeriodDateEnum.MonthNow;
    this.associationStatus = '';
    this.deviceStatus = '';
    this.companyCollaborator = '';
    this.companyComponent.resetCompanyField();
    this.emailComponent.resetEmailField();
  }

  public changeTypeGraph(name: string): void {
    this.nameChartSapPlantSelected = name;
  }

  public changeTypeAssociationGraph(name: string): void {
    this.nameChartAssociationSelected = name;
  }

  public changeTypeTotalInUseGraph(name: string): void {
    this.nameChartTotalInUseSelected = name;
  }

  public changeTypeBroadcastGraph(name: string): void {
    this.nameChartBroadcastSelected = name;
  }

  public search(): void {
    this.prepareChartsFilterToExport();
    this.resetExportationValidators();
    this.selectedApplication = this.setApplicationName();
    this.setPeriodMessageGraph();
    this.getSapPlantData();
    this.getEmployeeCompanyData();
    this.getAssociationStatusData();
    this.getDeviceStatus();
    this.getSummaryData();
    this.getEvolutionCharts();
    this.getTotalInUseData();
    this.getManagersData();
    this.getBroadcastData();
  }

  private resetExportationValidators(): void {
    this.canExportAssociate = false;
    this.canExportCompany = false;
    this.canExportDeviceManager = false;
    this.canExportDeviceStatus = false;
    this.canExportLocationTransmission = false;
    this.canExportOverallInUse = false;
    this.canExportSapPlant = false;

    this.enableExportByAssociate = false;
    this.enableExportByCompany = false;
    this.enableExportByDeviceStatus = false;
    this.enableExportBySapPlant = false;
    this.enableExportByOverallInUse = false;
    this.enableExportByLocationTransmission = false;
    this.enableExportByDeviceManager = false;
    this.buttonIsEnabled.emit(this.verifyIfHasData());
  }

  private clearAssociationStatusFields(): void {
    this.labelsAssociationStatus = [];
    this.associationStatusDataGraph = [];
    this.notAssociationStatusDataGraph = [];
    this.associationStatusList = [];
  }

  private clearTotalInUseFields(): void {
    this.labelsDateTotalInUse = [];
    this.totalInUseDataGraphTotal = [];
    this.totalInUseDataGraphInUse = [];
    this.totalInUseList = [];
  }

  private clearBroadcastFields(): void {
    this.labelsDateBroadcast = [];
    this.broadcastDataGraphBroadcast = [];
    this.notBroadcastDataGraphBroadcast = [];
    this.broadCastList = [];
  }

  public setPeriodMessageGraph(): void {
    switch (Number(this.datePeriod)) {
      case PeriodDateEnum.LastTwoMonths:
        this.isYesterdayMessage = false;
        this.periodMessage = 'DASHBOARD.CHARTS.PERIOD.TWO_MONTHS_AGO';
        break;
      case PeriodDateEnum.LastMonth:
        this.isYesterdayMessage = false;
        this.periodMessage = 'DASHBOARD.CHARTS.PERIOD.ONE_MONTH_AGO';
        break;
      default:
        this.isYesterdayMessage = true;
        this.periodMessage = 'DASHBOARD.CHARTS.PERIOD.TODAY';
        break;
    }
  }

  public setApplicationName(): string {
    if (this.typeDevice === ApplicationId.SPOT) {
      return ApplicationsName.SPOT;
    }

    return ApplicationsName.SMARTBADGE;
  }

  public getEvolutionCharts(): void {
    this.isLoadingEvolutionCharts = true;
    this.dashboardService
      .getEvolutionPeriod(this.typeDevice)
      .subscribe(evolution => {
        this.evolutionDataGraph = evolution;
        this.isLoadingEvolutionCharts = false;
      });
  }

  public getDeviceStatus(): void {
    this.isLoadingDeviceStatus = true;

    this.dashboardService
      .getDeviceStatusGraphData(
        this.typeDevice,
        this.sapPlantId,
        this.managerId,
        this.datePeriod,
        this.associationStatus,
        this.deviceStatus,
        this.companyCollaborator,
      )
      .subscribe((data: ChartsListModel) => {
        if (this.validateChartsDataToExport(data)) {
          this.canExportDeviceStatus = true;
        }
        this.enableExportByDeviceStatus = true;
        this.buttonIsEnabled.emit(this.verifyIfHasData());
        this.deviceStatusDataGraph = data;
        this.isLoadingDeviceStatus = false;
      });
  }

  public getSapPlantData(): void {
    this.isLoadingSapPlant = true;

    this.dashboardService
      .getSapPlantGraphData(
        this.typeDevice,
        this.sapPlantId,
        this.managerId,
        PeriodDateEnum.MonthNow,
        this.associationStatus,
        this.deviceStatus,
        this.companyCollaborator,
      )
      .subscribe((data: ChartModel[]) => {
        if (data.length > 0) {
          this.canExportSapPlant = true;
        }
        this.enableExportBySapPlant = true;
        this.buttonIsEnabled.emit(this.verifyIfHasData());
        this.sapPlantDataGraph = data;
        this.isLoadingSapPlant = false;
      });
  }

  private getEmployeeCompanyData() {
    this.isLoadingCompany = true;

    this.dashboardService
      .getEmployeesCompanyGraphData(
        this.typeDevice,
        this.sapPlantId,
        this.managerId,
        PeriodDateEnum.MonthNow,
        this.associationStatus,
        this.deviceStatus,
        this.companyCollaborator,
      )
      .subscribe((data: ChartModel[]) => {
        if (data.length > 0) {
          this.canExportCompany = true;
        }
        this.enableExportByCompany = true;
        this.buttonIsEnabled.emit(this.verifyIfHasData());
        this.employeesCompanyDataGraph = data;
        this.isLoadingCompany = false;
      });
  }

  public getAssociationStatusData(): void {
    this.isLoadingAssociate = true;

    this.dashboardService
      .getAssociationStatusGraphData(
        this.typeDevice,
        this.sapPlantId,
        this.managerId,
        this.datePeriod,
        this.associationStatus,
        this.deviceStatus,
        this.companyCollaborator,
      )
      .subscribe((data: ChartsListModel) => {
        this.clearAssociationStatusFields();

        if (this.validateChartsDataToExport(data)) {
          this.canExportAssociate = true;
        }
        this.enableExportByAssociate = true;
        this.buttonIsEnabled.emit(this.verifyIfHasData());
        this.constructorGraphBarAndList(
          data,
          this.labelsAssociationStatus,
          this.associationStatusList,
          this.associationStatusDataGraph,
          this.notAssociationStatusDataGraph,
          this.associationName,
          this.notAssociationName,
        );
        this.isLoadingAssociate = false;
      });
  }

  public getTotalInUseData(): void {
    this.isLoadingTotalInUse = true;

    this.dashboardService
      .getTotalInUseGraphData(
        this.typeDevice,
        this.sapPlantId,
        this.managerId,
        this.datePeriod,
        this.associationStatus,
        this.deviceStatus,
        this.companyCollaborator,
      )
      .subscribe((data: ChartsListModel) => {
        if (this.validateChartsDataToExport(data)) {
          this.canExportOverallInUse = true;
        }
        this.clearTotalInUseFields();
        this.enableExportByOverallInUse = true;
        this.buttonIsEnabled.emit(this.verifyIfHasData());
        this.constructorGraphBarAndList(
          data,
          this.labelsDateTotalInUse,
          this.totalInUseList,
          this.totalInUseDataGraphTotal,
          this.totalInUseDataGraphInUse,
          this.totalName,
          this.inUseName,
        );
        this.isLoadingTotalInUse = false;
      });
  }

  public getBroadcastData(): void {
    this.isLoadingBroadcast = true;

    this.dashboardService
      .getBroadcastGraphData(
        this.typeDevice,
        this.sapPlantId,
        this.managerId,
        this.datePeriod,
        this.associationStatus,
        this.deviceStatus,
        this.companyCollaborator,
      )
      .subscribe((data: ChartsListModel) => {
        if (this.validateChartsDataToExport(data)) {
          this.canExportLocationTransmission = true;
        }
        this.clearBroadcastFields();
        this.enableExportByLocationTransmission = true;
        this.buttonIsEnabled.emit(this.verifyIfHasData());
        this.constructorGraphBarAndList(
          data,
          this.labelsDateBroadcast,
          this.broadCastList,
          this.broadcastDataGraphBroadcast,
          this.notBroadcastDataGraphBroadcast,
          this.broadcastName,
          this.notBroadcastName,
        );
        this.isLoadingBroadcast = false;
      });
  }

  public getSummaryData(): void {
    this.isLoadingSummary = true;

    this.dashboardService
      .getSummaryData(
        this.typeDevice,
        this.sapPlantId,
        this.managerId,
        this.datePeriod,
        this.associationStatus,
        this.deviceStatus,
        this.companyCollaborator,
      )
      .subscribe((data: ChartSummary) => {
        this.mapSummaryContent(data);
        this.summaryDataGraph = data;
        this.isLoadingSummary = false;
      });
  }

  public getManagersData(): void {
    this.isLoadingManagers = true;

    this.dashboardService
      .getManagersData(
        this.typeDevice,
        this.sapPlantId,
        this.managerId,
        PeriodDateEnum.MonthNow,
        this.associationStatus,
        this.deviceStatus,
        this.companyCollaborator,
      )
      .subscribe((data: ChartModel[]) => {
        if (data.length > 0) {
          this.canExportDeviceManager = true;
        }
        this.enableExportByDeviceManager = true;
        this.buttonIsEnabled.emit(this.verifyIfHasData());
        this.managersDataGraph = data;
        this.isLoadingManagers = false;
      });
  }

  private validateVariation(chart: ChartsVariation): void {
    if (chart.variation !== this.variationResume.nullVariation) {
      chart.disableVariation = false;

      chart.isNegativeVariation = !!chart.variation.includes(
        this.variationResume.negativeVariation,
      );
    } else {
      chart.disableVariation = true;
    }
  }

  private mapSummaryContent(data: ChartSummary): void {
    data.active.charts.label = LabelsCharts.Active;

    this.validateVariation(data.overall);
    this.validateVariation(data.active);
    this.validateVariation(data.associates);
    this.validateVariation(data.transmitting);
    this.validateVariation(data.inUse);
  }

  private constructorGraphBarAndList(
    data: ChartsListModel,
    labelDate: string[],
    chartList: chartModelList[],
    firstBarChart: ChartModelIdentify[],
    secondBarChart: ChartModelIdentify[],
    firstNameChart: string,
    secondNameChart: string,
  ): void {
    const monthString = Labels();

    if (data.chartsTwoMonthsAgo[0] || data.chartsTwoMonthsAgo[1]) {
      this.validatorChartObject(
        data.chartsTwoMonthsAgo,
        firstNameChart,
        secondNameChart,
      );

      labelDate.push(monthString[0]);

      firstBarChart.push({
        identify: monthString[0],
        charts: data.chartsTwoMonthsAgo[0],
      });

      secondBarChart.push({
        identify: monthString[0],
        charts: data.chartsTwoMonthsAgo[1],
      });

      this.prepareDataList(monthString[0], data.chartsTwoMonthsAgo, chartList);
    }

    if (data.chartsMonthAgo[0] || data.chartsMonthAgo[1]) {
      this.validatorChartObject(
        data.chartsMonthAgo,
        firstNameChart,
        secondNameChart,
      );

      labelDate.push(monthString[1]);

      firstBarChart.push({
        identify: monthString[1],
        charts: data.chartsMonthAgo[0],
      });

      secondBarChart.push({
        identify: monthString[1],
        charts: data.chartsMonthAgo[1],
      });

      this.prepareDataList(monthString[1], data.chartsMonthAgo, chartList);
    }

    if (data.chartsActualMonth[0] || data.chartsActualMonth[1]) {
      this.validatorChartObject(
        data.chartsActualMonth,
        firstNameChart,
        secondNameChart,
      );

      labelDate.push(monthString[2]);

      firstBarChart.push({
        identify: monthString[2],
        charts: data.chartsActualMonth[0],
      });

      secondBarChart.push({
        identify: monthString[2],
        charts: data.chartsActualMonth[1],
      });

      this.prepareDataList(monthString[2], data.chartsActualMonth, chartList);
    }
  }

  private prepareDataList(
    identifyAssociate: string,
    charts: ChartModel[],
    chartlist: chartModelList[],
  ): void {
    const chartListIncludes: chartModelList = {
      identify: identifyAssociate,
      charts: [charts[0], charts[1]],
    };
    chartlist.push(chartListIncludes);
  }

  private ChartsEmpty(associationType: string): ChartModel {
    return {
      count: 0,
      label: associationType,
      percentage: null,
    };
  }

  private validatorChartObject(
    charts: ChartModel[],
    firstNameChart: string,
    secondNameChart: string,
  ): ChartModel[] {
    if (charts[0].label === firstNameChart && !charts[1]) {
      charts.push(this.ChartsEmpty(secondNameChart));
    }

    if (charts[0].label === secondNameChart) {
      charts.splice(0, 0, this.ChartsEmpty(firstNameChart));
    }

    return charts;
  }

  public openModalExport(): void {
    const enabledExportations: ChartsEnableExportation = {
      canExportAssociate: this.canExportAssociate,
      canExportCompany: this.canExportCompany,
      canExportDeviceManager: this.canExportDeviceManager,
      canExportDeviceStatus: this.canExportDeviceStatus,
      canExportLocationTransmission: this.canExportLocationTransmission,
      canExportOverallInUse: this.canExportOverallInUse,
      canExportSapPlant: this.canExportSapPlant,
    };

    this.modalExportList = this.matDialog.open(ExportListDashComponent, {
      panelClass: 'myExportListDash',
      disableClose: true,
      data: {
        typeDevice: this.typeDevice,
        enabledExportationOptions: enabledExportations,
        chartsFilterExportation: this.chartsFilterExport,
      },
    });
    this.modalExportList.afterClosed().subscribe(data => {
      if (data) {
        this.dataExportList = data;
        this.exportDashList();
      }
    });
  }

  public exportDashList(): void {
    this.dialogConfig.id = 'app-exportation-recipient-modal';
    const dialogRef = this.matDialog.open(ExportationRecipientModalComponent, {
      data: {
        recipientEmailAddress: this.emailUser,
      },
    });
    dialogRef.componentInstance.send.subscribe(() => {
      this.sendExportationEmail();
      this.dialogConfig.id = 'app-exportation-done-modal';
      this.matDialog.open(ExportationDoneModalComponent);
    });
  }

  private prepareChartsFilterToExport(): void {
    const guidEmpty = '00000000-0000-0000-0000-000000000000';
    this.exportManagerEmail = this.managerEmail ? this.managerEmail : null;
    this.exportCompanyName = this.companyCollaborator
      ? this.companyCollaborator
      : null;

    this.chartsFilter = {
      applicationId: this.typeDevice,
      sapPlantId: this.sapPlantId ? this.sapPlantId : guidEmpty,
      managerDeviceId: this.managerId ? this.managerId : guidEmpty,
      associationStatus: this.associationStatus,
      periodSelect: this.datePeriod,
      companyName: this.exportCompanyName,
      deviceStatus: this.deviceStatus,
    };

    this.chartsFilterExportValidation();
  }

  private sendExportationEmail(): void {
    const graphicsSelected: GraphicsSelectedForExport = {
      exportCompany: this.dataExportList.ExportCompany,
      exportAssociate: this.dataExportList.ExportAssociate,
      exportSapPlant: this.dataExportList.ExportSapPlant,
      exportDeviceStatus: this.dataExportList.ExportDeviceStatus,
      exportOverallInUse: this.dataExportList.ExportOverallInUse,
      exportLocationTransmission: this.dataExportList
        .ExportLocationTransmission,
      exportDeviceManager: this.dataExportList.ExportDeviceManager,
    };

    const exportRequest: ExportParametersRequest = {
      chartsFilter: this.chartsFilter,
      graphicsSelected,
      emailUser: this.emailUser,
      managerName: this.exportManagerEmail,
    };

    this.dashboardService.exportSelectedCharts(exportRequest).subscribe();
  }

  private validateChartsDataToExport(data: ChartsListModel): boolean {
    return (
      data.chartsActualMonth.length > 0 ||
      data.chartsMonthAgo.length > 0 ||
      data.chartsTwoMonthsAgo.length > 0
    );
  }

  private chartsFilterExportValidation(): void {
    this.chartsFilterExport = {
      sapPlantName: this.sapPlant,
      managerDeviceName: this.managerEmail,
      periodSelectedName: this.translatePeriodSelected(this.datePeriod),
      associationStatusName: this.associationStatus
        ? this.translateAssociationStatus(this.associationStatus)
        : '',
      deviceStatusName: this.deviceStatus
        ? this.translateDeviceStatus(this.deviceStatus)
        : '',
      companyName: this.exportCompanyName,
    };
  }

  private translatePeriodSelected(periodSelected: PeriodDateEnum): string {
    switch (Number(periodSelected)) {
      case PeriodDateEnum.LastMonth:
        return this.translate.instant('DASHBOARD.CHARTS.PERIOD.ONE_MONTH_AGO');
      case PeriodDateEnum.LastTwoMonths:
        return this.translate.instant('DASHBOARD.CHARTS.PERIOD.TWO_MONTHS_AGO');
      default:
        return this.translate.instant('DASHBOARD.CHARTS.PERIOD.ACTUAL_MONTH');
    }
  }

  private translateAssociationStatus(associationStatus: string): string {
    if (associationStatus === '1') return this.associationName;
    return this.notAssociationName;
  }

  private translateDeviceStatus(deviceStatusId: string): string {
    return this.deviceStatusOptions.find(
      deviceStatus => deviceStatus.id === parseInt(deviceStatusId, 10),
    ).name;
  }

  public verifyIfHasData(): boolean {
    if (
      this.enableExportByDeviceStatus &&
      this.enableExportByAssociate &&
      this.enableExportBySapPlant &&
      this.enableExportByCompany &&
      this.enableExportByOverallInUse &&
      this.enableExportByLocationTransmission &&
      this.enableExportByDeviceManager
    ) {
      return true;
    }
    return false;
  }
}
