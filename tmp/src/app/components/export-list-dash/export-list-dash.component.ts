import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationId } from 'src/app/core/constants/applicationsId.const';
import { ApplicationsName } from 'src/app/core/constants/applicationsName.const';
import { ChartsEnableExportation } from 'src/app/model/charts/chart-enable-exportation-interface';
import { ChartExport } from 'src/app/model/charts/chart-export-interface';
import { ChartsFilterExportValidation } from 'src/app/model/device-group-management/charts-filter-export-validation';
import { DashboardComponent } from 'src/app/views/dashboard/dashboard.component';

@Component({
  selector: 'app-export-list-dash',
  templateUrl: './export-list-dash.component.html',
  styleUrls: ['./export-list-dash.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExportListDashComponent implements OnInit {
  public chartExport: ChartExport;

  public chartsEnabledToExport: ChartsEnableExportation;

  private applicationId = ApplicationId;

  public disableButton = true;

  private typeDevice: string;

  public typeDeviceName: string;

  public indeterminate = false;

  public allSelected = false;

  public disableAllSelectButton = false;

  public checkboxes = [];

  public chartsFilterExportation: ChartsFilterExportValidation;

  constructor(
    private translate: TranslateService,
    private dialogRef: MatDialogRef<DashboardComponent, any>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      typeDevice: string;
      enabledExportationOptions: ChartsEnableExportation;
      chartsFilterExportation: ChartsFilterExportValidation;
    },
  ) {
    this.typeDevice = data.typeDevice;
    this.chartsEnabledToExport = data.enabledExportationOptions;
    this.chartsFilterExportation = data.chartsFilterExportation;

    this.translate
      .get('DASHBOARD.EXPORT_MODAL.CHECKBOX_LABELS')
      .subscribe(labels => {
        const checkboxes = [
          {
            label: labels.ASSOCIATIONS,
            checked: false,
            canExport: this.chartsEnabledToExport.canExportAssociate,
          },
          {
            label: labels.DEVICE_STATUS,
            checked: false,
            canExport: this.chartsEnabledToExport.canExportDeviceStatus,
          },
          {
            label: labels.SAP_PLANT_DISTRIBUTION,
            checked: false,
            canExport: this.chartsEnabledToExport.canExportSapPlant,
          },
          {
            label: labels.TOTAL_VS_IN_USE,
            checked: false,
            canExport: this.chartsEnabledToExport.canExportOverallInUse,
          },
          {
            label: labels.EMPLOYEE_COMPANY,
            checked: false,
            canExport: this.chartsEnabledToExport.canExportCompany,
          },
          {
            label: labels.LOCATION_TRANSMISSION,
            checked: false,
            canExport: this.chartsEnabledToExport.canExportLocationTransmission,
          },
          {
            label: labels.DEVICE_MANAGER,
            checked: false,
            canExport: this.chartsEnabledToExport.canExportDeviceManager,
          },
        ];
        this.checkboxes = checkboxes;
        this.disableAllSelectButton = !this.checkboxes.find(c => c.canExport);
      });
  }

  ngOnInit(): void {
    this.verifyTypeDevice();
  }

  private verifyTypeDevice(): void {
    if (this.applicationId.SPOT === this.typeDevice) {
      this.typeDeviceName = ApplicationsName.SPOT;
    } else {
      this.typeDeviceName = ApplicationsName.SMARTBADGE;
    }
  }

  public selectAll(): void {
    this.checkboxes
      .filter(c => c.canExport)
      .forEach(checkbox => {
        checkbox.checked = this.allSelected;
      });
    this.updateAllSelected();
  }

  public updateAllSelected(): void {
    this.disableButton = !this.checkboxes
      .filter(c => c.canExport)
      .some(checkbox => checkbox.checked);
    this.allSelected = this.checkboxes
      .filter(c => c.canExport)
      .every(checkbox => checkbox.checked);
    this.indeterminate =
      this.checkboxes
        .filter(c => c.canExport)
        .some(checkbox => checkbox.checked) && !this.allSelected;
  }

  public closeModal(): void {
    this.dialogRef.close();
  }

  public ExportList(): void {
    this.chartExport = {
      ExportAssociate: this.checkboxes[0].checked,
      ExportDeviceStatus: this.checkboxes[1].checked,
      ExportSapPlant: this.checkboxes[2].checked,
      ExportOverallInUse: this.checkboxes[3].checked,
      ExportCompany: this.checkboxes[4].checked,
      ExportLocationTransmission: this.checkboxes[5].checked,
      ExportDeviceManager: this.checkboxes[6].checked,
    };
    this.dialogRef.close(this.chartExport);
  }
}
