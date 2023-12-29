import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.scss']
})
export class ModalConfirmationComponent implements OnInit {
  public message: string;

  constructor(
    public dialogRef: MatDialogRef<ModalConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      message: string;
    }
  ) {}

  public ngOnInit(): void {
    this.message = this.data.message;
  }

  public onConfirm() {
    this.dialogRef.close(true);
  }

  public onClose() {
    this.dialogRef.close();
  }
}
