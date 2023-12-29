import { Component, OnInit } from '@angular/core';
import { LoggingEventsNames } from 'src/app/core/constants/logging-event-names.const';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { ManagementService } from 'src/app/services/management/management.service';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss'],
})
export class NotAuthorizedComponent implements OnInit {
  constructor(
    private loggingService: LoggingService,
    private managementService: ManagementService,
    private authService: AuthService,
  ) {}

  mailText: string;

  emails: string;

  ngOnInit(): void {
    this.managementService.get().subscribe((response: Array<string>) => {
      this.emails = response.join(', ');

      this.getMailText(response);
    });
  }

  private getMailText(response: string[]) {
    this.mailText = `mailto: ${response.slice(
      0,
      1,
    )}?subject=Acesso%20ao%20Things%20Management%20Portal&cc=${response
      .slice(1)
      .join(
        ';',
      )}&body=Olá.%0DSolicito, por favor, o acesso ao Things Management Portal.`;
  }

  logout(): void {
    this.loggingService.logEventWithUserInfo(LoggingEventsNames.Logout);
    this.authService.logout();
  }
}
