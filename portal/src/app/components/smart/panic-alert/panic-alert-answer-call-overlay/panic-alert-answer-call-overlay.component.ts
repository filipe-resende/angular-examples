import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MapApplicationIdToMiddleware } from '../../../../core/constants/application-to-middleware';
import { HttpStatusCodes } from '../../../../core/constants/http-status-codes.enum';
import { PanicAlertService } from '../../../../stores/panic-alert/panic-alert.service';
import { CachePanicAlert } from '../../../../stores/panic-alert/panic-alert.state';
import { NotificationService } from '../../../presentational/notification';

@Component({
  selector: 'app-panic-alert-answer-call-overlay',
  templateUrl: 'panic-alert-answer-call-overlay.component.html',
  styleUrls: ['panic-alert-answer-call-overlay.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PanicAlertAnswerCallOverlay implements OnInit {
  public alert: CachePanicAlert;

  public isSettingAlertAsAttended = false;

  public messageAlreadyAttendedPanicAlert: string;

  public onClose = (): void => {
    //
  };

  public middlewareName: string;

  constructor(
    private dialogRef: MatDialogRef<PanicAlertAnswerCallOverlay>,
    @Inject(MAT_DIALOG_DATA)
    public data: { alert: CachePanicAlert; onClose?: () => void },
    private panicAlertService: PanicAlertService,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {
    this.alert = this.data.alert;

    if (this.data.onClose) {
      this.onClose = this.data.onClose;
    }

    this.translateService
      .get('PANIC_BUTTON')
      .subscribe(({ ALERT_ALREADY_BEEING_ATTENDED }) => {
        this.messageAlreadyAttendedPanicAlert = ALERT_ALREADY_BEEING_ATTENDED;
      });
  }

  ngOnInit(): void {
    this.setMiddlewareName();
  }

  public async confirm(): Promise<void> {
    this.isSettingAlertAsAttended = true;

    try {
      await this.panicAlertService.setAlertAsAttended(this.alert);

      this.close();
    } catch (err) {
      if (
        err instanceof HttpErrorResponse &&
        err.status === HttpStatusCodes.Conflict
      ) {
        this.notificationService.warning(
          this.messageAlreadyAttendedPanicAlert,
          false,
          3000
        );

        this.close();
      }
    } finally {
      this.isSettingAlertAsAttended = false;
    }
  }

  public close(): void {
    this.dialogRef.close();
    this.onClose();
  }

  private setMiddlewareName() {
    this.middlewareName =
      MapApplicationIdToMiddleware[this.alert?.sourceApplicationId];
  }
}
