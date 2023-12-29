import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BatchLoadComponent } from 'src/app/views/batch-load/batch-load.component';

@Component({
  selector: 'app-want-create-modal',
  templateUrl: './want-create-modal.component.html',
  styleUrls: ['./want-create-modal.component.scss'],
})
export class WantCreateModalComponent {
  public label: string;

  public description: string;

  constructor(
    private dialogRef: MatDialogRef<BatchLoadComponent, any>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
  ) {
    this.label = data.label;
    this.description = data.description;
  }

  public closeModal() {
    this.dialogRef.close(false);
  }

  public sendCommand() {
    this.dialogRef.close(true);
  }
}
