import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Store } from '@ngxs/store';
import { ExportRepository } from '../../repositories/export.repository';
import { SitesService } from '../../../stores/sites/sites.service';
import { ExportDevicesParams } from '../../../shared/models/exportDevicesParams';
import { UserProfileService } from '../../../stores/user-profile/user-profile.service';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

interface ExportParamsObj {
  periodFrom: string;
  periodTo: string;
  line?: string;
  direction?: string;
  plate?: string;
  telemetry?: string;
}

@Injectable()
export class ExcelService {
  constructor(
    private exportRepository: ExportRepository,
    private userProfileService: UserProfileService,
    private siteService: SitesService,
    private store: Store
  ) {}

  public exportDisplacementsAsExcelToLoggedUserEmail(
    paramsObj: ExportParamsObj
  ): Promise<void> {
    const { email, userName } = this.userProfileService.getUserProfile();

    const { name: siteName } = this.siteService.getSelectedSite();

    return this.exportRepository
      .exportDisplacements({
        siteName,
        email,
        userName,
        siteType: 'Estado',
        ...paramsObj
      })
      .toPromise();
  }

  public exportFlightsAndGatesAsExcelToLoggedUserEmail(
    paramsObj: ExportParamsObj
  ): Promise<void> {
    const { email } = this.userProfileService.getUserProfile();

    const { periodFrom, periodTo } = paramsObj;

    return this.exportRepository
      .exportFlightsAndGates(email, periodFrom, periodTo)
      .toPromise();
  }

  public exportDevicesAsExcelToLoggedUserEmail({
    site,
    deviceType,
    periodFrom,
    periodTo,
    deviceNumber
  }: ExportDevicesParams): Promise<void> {
    const { email } = this.userProfileService.getUserProfile();

    return this.exportRepository
      .exportDevices({
        email,
        site,
        deviceType,
        periodFrom,
        periodTo,
        deviceNumber
      })
      .toPromise();
  }

  public exportPeopleByFlightsOrGatesAsExcelToLoggedUserEmail(
    paramsObj: ExportParamsObj
  ): Promise<void> {
    const { email } = this.userProfileService.getUserProfile();

    const { periodFrom, periodTo } = paramsObj;

    const {
      selectedFlight: { flight, direction, type }
    } = this.store.snapshot().flights;

    if (type === 'gate') {
      return this.exportRepository
        .exportPeopleByGate(direction, periodFrom, periodTo, email)
        .toPromise();
    }

    return this.exportRepository
      .exportPeopleByFlights(flight, direction, periodFrom, periodTo, email)
      .toPromise();
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`
    );
  }
}
