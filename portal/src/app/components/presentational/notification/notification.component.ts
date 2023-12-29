import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationConfig } from './notification.config';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnDestroy {
  public message?: string | null;

  public title?: string;

  public config?;

  public notificationClasses = '';

  private timeout: any;

  private activate$: Subscription;

  private remove$: Subscription;

  constructor(
    /* public _noticationService: NotificationService, */
    public _notificationConfig: NotificationConfig
  ) {
    this.message = _notificationConfig.message;
    this.title = _notificationConfig.title;
    this.config = _notificationConfig.config;
    this.notificationClasses = `${_notificationConfig.type} ${_notificationConfig.config.notificationClass}`;

    this.activate$ = _notificationConfig.notificationRef
      .afterActivate()
      .subscribe(() => {
        this.activate();
      });
    this.remove$ = _notificationConfig.notificationRef
      .manualClosed()
      .subscribe(() => {
        this.remove();
      });
  }

  public ngOnDestroy() {
    this.activate$.unsubscribe();
    this.remove$.unsubscribe();
    clearTimeout(this.timeout);
  }

  public activate() {
    this.timeout = setTimeout(() => {
      this.remove();
    }, 2500);
  }

  public remove() {
    this._notificationConfig.notificationRef.close();
    // this._noticationService.remove(this._notificationConfig.id);
  }
}
