import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface IExportationRecipientModalComponentData {
  recipientEmailAddress: string;
}
@Component({
  selector: 'app-exportation-recipient-modal',
  templateUrl: './exportation-recipient-modal.component.html',
  styleUrls: ['./exportation-recipient-modal.component.scss'],
})
export class ExportationRecipientModalComponent {
  @Output() send = new EventEmitter<void>();

  constructor(
    private dialogRef: MatDialogRef<ExportationRecipientModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: IExportationRecipientModalComponentData,
  ) {}

  onClickHandle() {
    this.send.emit();
    this.dialogRef.close(true);
  }

  public onClose(): void {
    this.dialogRef.close(false);
  }
}
