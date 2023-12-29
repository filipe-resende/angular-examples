import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ChartsListModel } from 'src/app/model/charts/chart-list-model-interface';
import { ChartModel } from 'src/app/model/charts/chart-model-interface';
import { ExportParametersRequest } from 'src/app/model/charts/export-parameters-request-interface';
import { ChartSummary } from 'src/app/model/charts/summary-interfaces/chart-summary-interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly CHARTS_URL = `${environment.chartsApiUrl}`;

  private readonly SAP_PLANT_URL = `${this.CHARTS_URL}/charts/sapplant`;

  private readonly ASSOCIATION_URL = `${this.CHARTS_URL}/charts/associationstatus`;

  private readonly EMPLOYEES_COMPANY_URL = `${this.CHARTS_URL}/charts/company`;

  private readonly DEVICE_STATUS_URL = `${this.CHARTS_URL}/charts/devicestatus`;

  private readonly BROADCAST_URL = `${this.CHARTS_URL}/charts/locationBroadcast`;

  private readonly SUMMARY_URL = `${this.CHARTS_URL}/charts/summary`;

  private readonly EVOLUTION_PERIOD_URL = `${this.CHARTS_URL}/charts/evolutionperiod`;

  private readonly EXPORT_URL = `${this.CHARTS_URL}/export-chart`;

  private readonly TOTAL_IN_USE_URL = `${this.CHARTS_URL}/charts/totalinuse`;

  private readonly MANAGERS_URL = `${this.CHARTS_URL}/charts/managers`;

  constructor(private http: HttpClient) {}

  private filterParameters(
    applicationId: string,
    period: number,
    sapPlantId: string,
    managerId: string,
    associationStatus: string,
    deviceStatus: string,
    companyName: string,
  ): HttpParams {
    let params = new HttpParams()
      .append('applicationId', applicationId)
      .append('PeriodSelect', period);

    if (sapPlantId) {
      params = params.append('sapPlantId', sapPlantId);
    }

    if (managerId) {
      params = params.append('ManagerDeviceId', managerId);
    }

    if (associationStatus) {
      params = params.append('associationStatus', associationStatus);
    }

    if (deviceStatus) {
      params = params.append('deviceStatus', deviceStatus);
    }

    if (companyName) {
      params = params.append('companyName', companyName);
    }
    return params;
  }

  public getSummaryData(
    applicationId: string,
    sapPlantId: string,
    managerId: string,
    period: number,
    associationStatus: string,
    deviceStatus: string,
    companyName: string,
  ): Observable<ChartSummary> {
    const params: HttpParams = this.filterParameters(
      applicationId,
      period,
      sapPlantId,
      managerId,
      associationStatus,
      deviceStatus,
      companyName,
    );

    return this.http
      .get<ChartSummary>(`${this.SUMMARY_URL}`, { params })
      .pipe(take(1));
  }

  public getSapPlantGraphData(
    applicationId: string,
    sapPlantId: string,
    managerId: string,
    period: number,
    associationStatus: string,
    deviceStatus: string,
    companyName: string,
  ): Observable<ChartModel[]> {
    const params: HttpParams = this.filterParameters(
      applicationId,
      period,
      sapPlantId,
      managerId,
      associationStatus,
      deviceStatus,
      companyName,
    );

    return this.http
      .get<ChartModel[]>(`${this.SAP_PLANT_URL}`, { params })
      .pipe(take(1));
  }

  public getAssociationStatusGraphData(
    applicationId: string,
    sapPlantId: string,
    managerId: string,
    period: number,
    associationStatus: string,
    deviceStatus: string,
    companyName: string,
  ): Observable<ChartsListModel> {
    const params: HttpParams = this.filterParameters(
      applicationId,
      period,
      sapPlantId,
      managerId,
      associationStatus,
      deviceStatus,
      companyName,
    );

    return this.http
      .get<ChartsListModel>(`${this.ASSOCIATION_URL}`, { params })
      .pipe(take(1));
  }

  public getTotalInUseGraphData(
    applicationId: string,
    sapPlantId: string,
    managerId: string,
    period: number,
    associationStatus: string,
    deviceStatus: string,
    companyName: string,
  ): Observable<ChartsListModel> {
    const params: HttpParams = this.filterParameters(
      applicationId,
      period,
      sapPlantId,
      managerId,
      associationStatus,
      deviceStatus,
      companyName,
    );

    return this.http
      .get<ChartsListModel>(`${this.TOTAL_IN_USE_URL}`, { params })
      .pipe(take(1));
  }

  public getEmployeesCompanyGraphData(
    applicationId: string,
    sapPlantId: string,
    managerId: string,
    period: number,
    associationStatus: string,
    deviceStatus: string,
    companyName: string,
  ): Observable<ChartModel[]> {
    const params: HttpParams = this.filterParameters(
      applicationId,
      period,
      sapPlantId,
      managerId,
      associationStatus,
      deviceStatus,
      companyName,
    );
    return this.http
      .get<ChartModel[]>(`${this.EMPLOYEES_COMPANY_URL}`, { params })
      .pipe(take(1));
  }

  public getDeviceStatusGraphData(
    applicationId: string,
    sapPlantId: string,
    managerId: string,
    period: number,
    associationStatus: string,
    deviceStatus: string,
    companyName: string,
  ): Observable<ChartsListModel> {
    const params: HttpParams = this.filterParameters(
      applicationId,
      period,
      sapPlantId,
      managerId,
      associationStatus,
      deviceStatus,
      companyName,
    );
    return this.http
      .get<ChartsListModel>(`${this.DEVICE_STATUS_URL}`, { params })
      .pipe(take(1));
  }

  public getEvolutionPeriod(
    applicationId: string,
  ): Observable<ChartsListModel> {
    return this.http
      .get<ChartsListModel>(
        `${this.EVOLUTION_PERIOD_URL}?applicationId=${applicationId}`,
      )
      .pipe(take(1));
  }

  public getManagersData(
    applicationId: string,
    sapPlantId: string,
    managerId: string,
    period: number,
    associationStatus: string,
    deviceStatus: string,
    companyName: string,
  ): Observable<ChartModel[]> {
    const params: HttpParams = this.filterParameters(
      applicationId,
      period,
      sapPlantId,
      managerId,
      associationStatus,
      deviceStatus,
      companyName,
    );

    return this.http
      .get<ChartModel[]>(`${this.MANAGERS_URL}`, { params })
      .pipe(take(1));
  }

  public exportSelectedCharts(
    exportRequest: ExportParametersRequest,
  ): Observable<void> {
    return this.http.post<void>(`${this.EXPORT_URL}`, exportRequest);
  }

  public getBroadcastGraphData(
    applicationId: string,
    sapPlantId: string,
    managerId: string,
    period: number,
    associationStatus: string,
    deviceStatus: string,
    companyName: string,
  ): Observable<ChartsListModel> {
    const params: HttpParams = this.filterParameters(
      applicationId,
      period,
      sapPlantId,
      managerId,
      associationStatus,
      deviceStatus,
      companyName,
    );
    return this.http
      .get<ChartsListModel>(`${this.BROADCAST_URL}`, { params })
      .pipe(take(1));
  }
}
