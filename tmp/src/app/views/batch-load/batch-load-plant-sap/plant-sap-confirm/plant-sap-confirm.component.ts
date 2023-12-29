import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BatchLoadPlantSapComponent } from '../batch-load-plant-sap.component';

@Component({
  selector: 'app-plant-sap-confirm',
  templateUrl: './plant-sap-confirm.component.html',
  styleUrls: ['./plant-sap-confirm.component.scss'],
})
export class PlantSapConfirmComponent {
  constructor(
    private dialogRef: MatDialogRef<BatchLoadPlantSapComponent, any>,
  ) {}

  public closeModal() {
    this.dialogRef.close();
  }
}
