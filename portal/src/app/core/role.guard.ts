import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import {
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalService,
  MSAL_GUARD_CONFIG
} from '@azure/msal-angular';
import { MatDialog } from '@angular/material/dialog';
import { BaseGuard } from './base.guard';
import { ModalAgreementComponent } from '../components/smart/modal-agreement/modal-agreement.component';

@Injectable()
export class RoleGuard extends BaseGuard {
  constructor(
    @Inject(MSAL_GUARD_CONFIG)
    protected override msalGuardConfig: MsalGuardConfiguration,
    protected override msalBroadcastService: MsalBroadcastService,
    protected override authService: MsalService,
    protected override location: Location,
    protected override router: Router,
    private dialog: MatDialog
  ) {
    super(msalGuardConfig, msalBroadcastService, authService, location, router);
  }

  override activateHelper(
    state?: RouterStateSnapshot,
    route?: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> {
    const result = super.activateHelper(state, route);

    const expectedRoles: string[] = route ? route.data.expectedRoles : [];

    return result.pipe(
      concatMap(() => {
        let activeAccount = this.authService.instance.getActiveAccount();

        if (
          !activeAccount &&
          this.authService.instance.getAllAccounts().length === 0
        ) {
          return of(false);
        }

        if (
          !activeAccount &&
          this.authService.instance.getAllAccounts().length > 0
        ) {
          [activeAccount] = this.authService.instance.getAllAccounts();
        }

        if (!activeAccount?.idTokenClaims?.roles) {
          this.showConfirmationDialog('MSAL.MISSING_TOKEN_CLAIMS');
        }

        const roles = activeAccount?.idTokenClaims?.roles.map(role =>
          role.toLowerCase()
        );

        const hasRequiredRole = expectedRoles.some((role: string) =>
          roles.includes(role)
        );

        if (!hasRequiredRole) {
          this.showConfirmationDialog('MSAL.MISSING_REQUIRED_ROLES');
        }

        return of(hasRequiredRole);
      })
    );
  }

  private showConfirmationDialog(message: string) {
    const modal = this.dialog.open(ModalAgreementComponent, {
      data: {
        message
      }
    });

    modal
      .afterClosed()
      .subscribe(() => this.authService.instance.logoutRedirect());
  }
}
