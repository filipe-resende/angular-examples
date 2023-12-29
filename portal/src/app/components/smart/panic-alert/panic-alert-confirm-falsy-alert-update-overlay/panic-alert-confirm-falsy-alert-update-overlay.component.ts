import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PanicAlertNotification } from "../../../../shared/models/notification";
import { NotificationsService } from "../../../../stores/notifications/notifications.service";

@Component({
  selector: "app-panic-alert-confirm-falsy-alert-update-overlay",
  templateUrl: "panic-alert-confirm-falsy-alert-update-overlay.component.html",
  styleUrls: ["panic-alert-confirm-falsy-alert-update-overlay.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PanicAlertConfirmFalsyUpdateCallOverlay implements OnInit {
  public alert: PanicAlertNotification;
  public isSettingAlertAsFalsy: boolean = false;
  public attendanceEndedDateTime: string;

  public onConfirm = () => {
    //
  };

  constructor(
    private dialogRef: MatDialogRef<PanicAlertConfirmFalsyUpdateCallOverlay>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      alert: PanicAlertNotification;
      onConfirm?: () => void;
      attendanceEndedDateTime?: string;
      newComment: any;
    },
    private notificationsService: NotificationsService
  ) {}

  public ngOnInit() {
    this.alert = this.data.alert;
    if (this.data.onConfirm) this.onConfirm = this.data.onConfirm;
    if (this.data.attendanceEndedDateTime) this.attendanceEndedDateTime = this.data.attendanceEndedDateTime;
  }

  public confirm() {
    this.isSettingAlertAsFalsy = true;
    this.notificationsService
      .updatePanicAlertNotification(this.alert.id, false, this.attendanceEndedDateTime, this.data.newComment)
      .then(() => {
        this.onConfirm();
      })
      .finally(() => {
        this.isSettingAlertAsFalsy = false;
        this.close();
      });
  }

  public close() {
    this.dialogRef.close();
  }
}
