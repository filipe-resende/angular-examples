import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HttpStatusCodes } from '../../../core/constants/http-status-codes.enum';
import { HttpStatusCodeResponse } from '../../../shared/interfaces/http-response.interface';
import { PanicAlert } from '../../../shared/models/panic-alert';
import { PanicAlertService } from '../../../stores/panic-alert/panic-alert.service';
import { SitesService } from '../../../stores/sites/sites.service';
import { ModalService } from '../../presentational/modal';
import { NotificationService } from '../../presentational/notification';
import { ModalConfirmationComponent } from '../modal-confirmation/modal-confirmation.component';

@Component({
  selector: 'app-panic-alert',
  templateUrl: 'panic-alert.component.html',
  styleUrls: ['panic-alert.component.scss']
})
export class PanicAlertComponent implements OnInit, OnDestroy {
  public alerts: PanicAlert[] = [];

  private modalId = 'panic';

  private subscriptions: Subscription[] = [];

  constructor(
    private modalService: ModalService,
    private panicAlertService: PanicAlertService,
    private notify: NotificationService,
    private sites: SitesService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  public ngOnInit() {
    this.onPanicAlertsChangeHandler();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public onPanicAlertsChangeHandler() {
    this.subscriptions.push(
      this.panicAlertService.alerts$.subscribe(alerts => {
        this.sites.sites$.pipe(filter(x => !!x)).subscribe(resp => {
          if (alerts.length > 0) {
            this.modalService.open(this.modalId);
          } else {
            this.modalService.close(this.modalId);
          }
          this.alerts = alerts.map(alert => {
            return {
              ...alert,
              areaName: this.sites.getNameSite(resp, alert?.areaName)
            };
          });
        });
      })
    );
  }

  public setNotApplicableToAllPanicAlerts() {
    const modal = this.dialog.open(ModalConfirmationComponent, {
      data: {
        message: 'PANIC_BUTTON.ARE_YOU_SURE_TO_SET_NOT_APPLICABLE_ALL'
      }
    });

    modal.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.panicAlertService.setAllPanicEventsAsNotApplicable().subscribe(
          (res: HttpStatusCodeResponse) => {
            this.panicAlertService.updatePanicAlerts([]);
          },
          (error: HttpStatusCodeResponse) => {
            if (error.status === HttpStatusCodes.Forbidden) {
              this.translate
                .get('PANIC_BUTTON.HTTP_ERRORS.FORBIDDEN')
                .subscribe(msg => {
                  this.notify.error(msg);
                });
            } else if (error.status === HttpStatusCodes.BadRequest) {
              this.translate
                .get('PANIC_BUTTON.HTTP_ERRORS.BAD_REQUEST')
                .subscribe(msg => {
                  this.notify.error(msg);
                });
            } else {
              this.translate
                .get('PANIC_BUTTON.HTTP_ERRORS.SERVER_ERROR')
                .subscribe(msg => {
                  this.notify.error(msg);
                });
            }
          }
        );
      }
    });
  }
}
