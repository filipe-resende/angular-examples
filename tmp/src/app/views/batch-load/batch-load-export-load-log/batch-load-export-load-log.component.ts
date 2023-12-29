import { MatDialogRef } from '@angular/material/dialog';
import { Component, EventEmitter, Output } from '@angular/core';
import { BatchLoadComponent } from '../batch-load.component';

@Component({
  selector: 'app-batch-load-export-load-log',
  templateUrl: './batch-load-export-load-log.component.html',
  styleUrls: ['./batch-load-export-load-log.component.scss'],
})
export class BatchLoadExportLoadLogComponent {
  @Output() send = new EventEmitter<void>();

  @Output() next = new EventEmitter<void>();

  constructor(private dialogRef: MatDialogRef<BatchLoadComponent, any>) {}

  public closeModal() {
    this.dialogRef.close();
  }

  clickEmail() {
    this.send.emit();
    this.dialogRef.close();
  }

  clickDownload() {
    this.next.emit();
    this.dialogRef.close();
  }
}
