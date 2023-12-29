import { Component } from '@angular/core';
import { LoggingEventsNames } from 'src/app/core/constants/logging-event-names.const';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoggingService } from '../../services/logging/logging.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  constructor(
    private loggerService: LoggingService,
    private authService: AuthService,
  ) {}

  public onLogout(): void {
    this.loggerService.logEventWithUserInfo(LoggingEventsNames.Logout);
    this.authService.logout();
  }
}
