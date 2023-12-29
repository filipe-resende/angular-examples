import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationsService } from '../../../../stores/notifications/notifications.service';

@Component({
  selector: 'app-header-notification-bell',
  templateUrl: 'header-notification-bell.component.html',
  styleUrls: ['header-notification-bell.component.scss']
})
export class HeaderNotificationBellComponent implements OnInit {
  public hasNotifications$: Observable<boolean>;

  constructor(
    private notificationsService: NotificationsService,
    private router: Router
  ) {}

  public ngOnInit() {
    this.hasNotifications$ = this.notificationsService.hasNotifications$;
  }

  public isActiveTab() {
    return document.location.pathname === '/notifications';
  }
}
