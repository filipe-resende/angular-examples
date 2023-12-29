import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BatchLoadComponent } from '../batch-load.component';

@Component({
  selector: 'app-batch-load-replace-file',
  templateUrl: './batch-load-replace-file.component.html',
  styleUrls: ['./batch-load-replace-file.component.scss'],
})
export class BatchLoadReplaceFileComponent {
  constructor(private dialogRef: MatDialogRef<BatchLoadComponent, any>) {}

  public closeModal() {
    this.dialogRef.close(false);
  }

  public addFile() {
    this.dialogRef.close(true);
  }
}
