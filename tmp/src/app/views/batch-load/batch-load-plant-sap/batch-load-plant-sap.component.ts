import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { SapPlantService } from 'src/app/services/factories/sap-plant.service';
import { BatchLoadComponent } from '../batch-load.component';
import { PlantSapConfirmComponent } from './plant-sap-confirm/plant-sap-confirm.component';

@Component({
  selector: 'app-batch-load-plant-sap',
  templateUrl: './batch-load-plant-sap.component.html',
  styleUrls: ['./batch-load-plant-sap.component.scss'],
})
export class BatchLoadPlantSapComponent {
  public codSap = '';

  public descriptionSap = '';

  public objectSapPlant;

  public dataSapPlant;

  private text: any = {};

  public disabledButton = false;

  private modalCreateConfirm:
    | MatDialogRef<PlantSapConfirmComponent, any>
    | undefined;

  constructor(
    public matDialog: MatDialog,
    public sapPlantService: SapPlantService,
    public AlertModal: AlertModalService,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<BatchLoadComponent, any>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
  ) {
    this.codSap = data.sapPlantName;
    this.dataSapPlant = data.dataSapPlant;

    this.translate
      .get('BATCH_LOAD_PLANT_SAP.PLANT_SAP_ERRO')
      .subscribe(alertInfo => {
        this.text.alert = alertInfo;
      });
  }

  public mountObjectSapPlant(codeSap, descriptionSap) {
    this.objectSapPlant = {
      code: codeSap,
      description: descriptionSap,
    };
    return this.objectSapPlant;
  }

  public addInfoSapPlant() {
    this.sapPlantService
      .postSapPlant(this.mountObjectSapPlant(this.codSap, this.descriptionSap))
      .subscribe(
        success => {
          this.dialogRef.close(true);
          this.openCreateConfirmModal();
        },
        error => {
          this.AlertModal.showAlertDanger(this.text.alert);
          this.dialogRef.close(true);
        },
      );
  }

  public addSapPlant() {
    this.disabledButton = true;
    this.addInfoSapPlant();
  }

  public checkDatacode(): boolean {
    const code = parseInt(this.codSap, 10);
    return this.dataSapPlant.sapPlants.some(plant => plant.code === code);
  }

  public checkDataDescription(): boolean {
    return this.dataSapPlant.sapPlants.some(
      plant => plant.description === this.descriptionSap,
    );
  }

  public enabledButton() {
    if (
      this.checkDatacode() ||
      this.checkDataDescription() ||
      !this.descriptionSap ||
      this.codSap.length !== 4 ||
      !this.codSap.match(/^\d+$/)
    ) {
      return true;
    }
    return false;
  }

  public closeModal() {
    this.dialogRef.close(false);
  }

  public openCreateConfirmModal() {
    this.modalCreateConfirm = this.matDialog.open(PlantSapConfirmComponent, {
      height: '179px',
      width: '437px',
      disableClose: true,
    });
    this.modalCreateConfirm.afterClosed().subscribe();
  }
}
