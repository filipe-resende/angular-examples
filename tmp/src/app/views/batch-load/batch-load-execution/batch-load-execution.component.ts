import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImportDevicesValidation } from 'src/app/model/import-devices-validation';
import { BatchLoadComponent } from '../batch-load.component';

@Component({
  selector: 'app-batch-load-execution',
  templateUrl: './batch-load-execution.component.html',
  styleUrls: ['./batch-load-execution.component.scss'],
})
export class BatchLoadExecutionComponent {
  @Output() send = new EventEmitter<void>();

  public typeBatchLoad;

  public importDeviceFields: ImportDevicesValidation;

  constructor(
    private dialogRef: MatDialogRef<BatchLoadComponent, any>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
  ) {
    this.typeBatchLoad = data.typeBatchLoad;
    this.importDeviceFields = data.importDevices;
  }

  public closeModal() {
    this.dialogRef.close(false);
  }

  public sendLoad() {
    this.dialogRef.close(true);
  }
}
