import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { filter, skip, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { Subject } from 'rxjs';
import defaultLanguage from '../assets/i18n/pt_br.json';
import { AuthService } from './services/auth/auth.service';
import { UserProfileService } from './stores/user-profile/user-profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'things-management-frontend-new';

  private readonly destroying$ = new Subject<void>();

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private msalBroadcastService: MsalBroadcastService,
    private msalService: MsalService,
    private userProfileService: UserProfileService,
    private router: Router,
  ) {
    this.translate.setTranslation('pt_br', defaultLanguage);
    this.translate.setDefaultLang('pt_br');
  }

  public ngOnInit(): void {
    this.setupUserProfile();
  }

  private setupUserProfile() {
    this.msalService.instance.enableAccountStorageEvents();

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.ACCOUNT_ADDED ||
            msg.eventType === EventType.ACCOUNT_REMOVED,
        ),
      )
      .subscribe((result: EventMessage) => {
        if (this.msalService.instance.getAllAccounts().length === 0) {
          this.router.navigate(['/']);
        } else {
          const payload = result.payload as AuthenticationResult;

          this.msalService.instance.setActiveAccount(payload.account);
          this.checkAndSetActiveAccount();
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None,
        ),
        takeUntil(this.destroying$),
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
      });
  }

  private checkAndSetActiveAccount() {
    const allAccounts = this.msalService.instance.getAllAccounts();
    const activeAccount =
      this.msalService.instance.getActiveAccount() ?? allAccounts[0];

    if (activeAccount) {
      this.userProfileService.setUserProfile(activeAccount);
      this.authService.login();
    } else {
      this.router.navigate(['/']);
    }
  }
}
