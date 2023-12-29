import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-agreement',
  templateUrl: './modal-agreement.component.html',
  styleUrls: ['./modal-agreement.component.scss']
})
export class ModalAgreementComponent implements OnInit {
  public message: string;

  constructor(
    public dialogRef: MatDialogRef<ModalAgreementComponent>,
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
}
