import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reactivate-subscription-confirmation',
  templateUrl: './reactivate-subscription-modal.component.html',
  styleUrls: ['./reactivate-subscription-modal.component.scss'],
})
export class ReactivateSubscriptionModalComponent implements OnInit {
  public message: string;

  constructor(
    public dialogRef: MatDialogRef<ReactivateSubscriptionModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      message: string;
    },
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
