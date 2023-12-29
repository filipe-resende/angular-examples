import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  PanicAlertNotification,
  PanicAlertNotificationComment,
} from '../../../../shared/models/notification';
import {
  formatDateAsUTC,
  formatDate,
  getHoursString,
  getMinutesString,
} from '../../../../shared/utils/date';
import { NotificationsService } from '../../../../stores/notifications/notifications.service';
import { PanicAlertConfirmFalsyUpdateCallOverlay } from '../panic-alert-confirm-falsy-alert-update-overlay/panic-alert-confirm-falsy-alert-update-overlay.component';
import { PanicAlertConfirmTruthyUpdateCallOverlay } from '../panic-alert-confirm-truthy-alert-update-overlay/panic-alert-confirm-truthy-alert-update-overlay.component';
import { copyFromNonInputElement } from '../../../../shared/utils/copyToClipboard';
import { UserProfileService } from '../../../../stores/user-profile/user-profile.service';

@Component({
  selector: 'app-panic-alert-attendance-details-overlay',
  templateUrl: 'panic-alert-attendance-details-overlay.component.html',
  styleUrls: ['panic-alert-attendance-details-overlay.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PanicAlertAttendanceDetailsOverlay implements OnInit {
  @ViewChild('commentsSection', { static: true })
  public commentsSection: ElementRef;

  public alert: PanicAlertNotification;

  public attendedBy: string;

  public alarmType: boolean = null;

  public onClose = () => {
    //
  };

  public date: string;

  public hour: string;

  public isLoadingSaveButton = false;

  public isAttendanceCompleted: boolean;

  public inputCommentModel: string;

  public comments: Array<{
    text: string;
    date: Date;
    author: string;
    isNew: boolean;
  }> = [];

  public newComment: {
    text: string;
    date: Date;
    author: string;
    isNew: boolean;
  };

  public commentLength = 0;

  public commentMaxLength = 500;

  constructor(
    private dialogRef: MatDialogRef<PanicAlertAttendanceDetailsOverlay>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      alert: PanicAlertNotification;
      attendedBy: string;
      onClose?: () => void;
      isAttendanceCompleted: boolean;
    },
    private dialog: MatDialog,
    private notificationsService: NotificationsService,
    private userProfileService: UserProfileService,
  ) {}

  public ngOnInit() {
    this.alert = this.data.alert;
    this.attendedBy = this.data.attendedBy;
    this.onClose = this.data.onClose;

    if (this.data.alert.reason === 'Real') this.alarmType = true;
    if (this.data.alert.reason === 'Falsy') this.alarmType = false;

    if (this.data.alert.attendanceEndedDateTime) {
      const attendanceEndedDateTime = new Date(
        this.data.alert.attendanceEndedDateTime,
      );
      this.date = formatDateAsUTC(attendanceEndedDateTime);
      this.hour = `${getHoursString(
        attendanceEndedDateTime,
      )}:${getMinutesString(attendanceEndedDateTime)}`;
    }
    this.isAttendanceCompleted = this.data.isAttendanceCompleted;

    this.comments = this.mapPanicAlertNotificationCommentsToCommentSectionComponentArray(
      this.alert.comments,
    );
  }

  public addComment(comment: string) {
    if (comment.length > this.commentMaxLength) return;
    this.commentsSection.nativeElement.scrollTop = 0;

    const {
      userName
    } = this.userProfileService.getUserProfile();
    this.newComment = {
      text: comment,
      author: userName,
      date: new Date(),
      isNew: true,
    };

    this.comments = [this.newComment, ...this.comments.filter(f => !f.isNew)];
    this.commentLength = 0;
  }

  public confirm() {
    const attendanceEndedDateTime: string =
      this.date && this.date.length > 0
        ? formatDateAsUTC(formatDate(this.date), this.hour)
        : null;

    if (this.alarmType) {
      if (this.shouldDisplaySaveButtonAsFinishAttendanceButton()) {
        this.dialog.open(PanicAlertConfirmTruthyUpdateCallOverlay, {
          disableClose: true,
          data: {
            alert: this.alert,
            onConfirm: () => {
              this.close();
            },
            newComment: this.newComment,
            attendanceEndedDateTime,
          },
        });
      } else {
        this.isLoadingSaveButton = true;
        this.notificationsService
          .updatePanicAlertNotification(
            this.alert.id,
            true,
            attendanceEndedDateTime,
            this.newComment,
          )
          .finally(() => {
            this.isLoadingSaveButton = false;
            this.close();
          });
      }
    } else {
      this.dialog.open(PanicAlertConfirmFalsyUpdateCallOverlay, {
        disableClose: true,
        data: {
          alert: this.alert,
          onConfirm: () => {
            this.close();
          },
          newComment: this.newComment,
          attendanceEndedDateTime,
        },
      });
    }
  }

  public copyToClipboard(element: HTMLElement) {
    copyFromNonInputElement(element);
  }

  public close() {
    this.dialogRef.close();
    this.onClose();
  }

  public getSaveButtonStatus(): 'enabled' | string {
    const isAlarmTypeSelected = this.alarmType != null;
    const isDateFilled = this.date && this.date.length > 0;
    const isHourFilled = this.hour && this.hour.length > 0;
    const newCommentHasBeenMade = this.comments.findIndex(f => f.isNew) !== -1;

    if (!isAlarmTypeSelected) return 'PANIC_BUTTON.SELECT_ATTENDANCE_TYPE';

    if (isDateFilled && !isHourFilled) return 'PANIC_BUTTON.INSERT_HOUR_TOO';

    if (this.alarmType) {
      if (isDateFilled) {
        if (newCommentHasBeenMade) return 'enabled';
        return 'PANIC_BUTTON.PLEASE_FILL_A_COMMENT';
      }
      return 'enabled';
    }

    if (newCommentHasBeenMade) {
      return this.checkDayAndHour()
        ? 'enabled'
        : 'PANIC_BUTTON.INSERT_CLOSING_FULL_DATE';
    }
    return 'PANIC_BUTTON.PLEASE_FILL_A_COMMENT_FALSY_ALERT';
  }

  public onSelectClosureDate({ value: date }: { value: string }): void {
    this.date = formatDateAsUTC(date);
  }

  public onSelectClosureHour(hour: string): void {
    if (!this.date) this.date = formatDateAsUTC(new Date());
    this.hour = hour;
  }

  public shouldDisplaySaveButtonAsFinishAttendanceButton(): boolean {
    const isDateFilled =
      this.date && this.date.length > 0 && this.hour && this.hour.length > 0;

    if (this.alarmType == null) return false;

    if (this.alarmType) {
      if (isDateFilled) return true;
      return false;
    }
    return true;
  }

  private mapPanicAlertNotificationCommentsToCommentSectionComponentArray(
    comments: PanicAlertNotificationComment[],
  ) {
    if (!comments) return [];

    return comments.map(comment => ({
      text: comment.text,
      date: new Date(comment.dateTime),
      author: comment.nameThing,
      isNew: false,
    }));
  }

  private checkDayAndHour(): boolean {
    const isDateFilled = this.date && this.date.length > 0;
    const isHourFilled = this.hour && this.hour.length > 0;

    return (isDateFilled && isHourFilled) || false;
  }
}
