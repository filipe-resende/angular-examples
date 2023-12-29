import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { BatchLoadComponent } from '../batch-load.component';

@Component({
  selector: 'app-batch-load-execution-error',
  templateUrl: './batch-load-execution-error.component.html',
  styleUrls: ['./batch-load-execution-error.component.scss'],
})
export class BatchLoadExecutionErrorComponent {
  constructor(
    private dialogRef: MatDialogRef<BatchLoadComponent, any>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
  ) {}

  public closeModal() {
    this.dialogRef.close();
  }
}
