import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-remove-member-modal-component.html',
  styleUrls: ['./confirmation-remove-member-modal-component.scss'],
})
export class ConfirmationRemoveMemberModalComponent implements OnInit {
  public title = '';

  public memberName = '';

  public message = '';

  constructor(
    public translate: TranslateService,
    public dialogRef: MatDialogRef<ConfirmationRemoveMemberModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      message: string;
      memberName: string;
    },
  ) {}

  public ngOnInit(): void {
    this.title = this.data.title;
    this.message = this.data.message;
    this.memberName = this.data.memberName;
  }

  public onConfirm(): void {
    this.dialogRef.close(true);
  }

  public onClose(): void {
    this.dialogRef.close();
  }
}
