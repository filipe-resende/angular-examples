import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { AuditLogStatus } from 'src/app/shared/enums/auditLogStatus';
import { IamRolesEnum, Roles } from 'src/app/shared/enums/iam.enums';
import { skip } from 'rxjs/operators';
import {
  IUserInfo,
  IUserInfoWithRole,
} from 'src/app/shared/interfaces/iam.interfaces';
import { environment } from 'src/environments/environment';
import { UserProfileService } from 'src/app/stores/user-profile/user-profile.service';
import { UserAgreementService } from 'src/app/stores/user-agreement/user-agreement.service';
import { MatDialog } from '@angular/material/dialog';
import { UserAgreementModalComponent } from 'src/app/components/smart/user-agreement-modal/user-agreement-modal.component';
import { AuditLogService } from '../audit-log/audit-log.service';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { DeviceStatusService } from '../factories/device-status.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userInfoBehaviorSubject = new BehaviorSubject<IUserInfoWithRole>(
    null,
  );

  public isUserLoggedInBehaviorSubject = new BehaviorSubject<boolean>(null);

  public readonly userInfo$ = this.userInfoBehaviorSubject.asObservable();

  public readonly isUserLoggedIn$ = this.isUserLoggedInBehaviorSubject.asObservable();

  constructor(
    private oauthService: OAuthService,
    private windowInstance: Window,
    private auditLogService: AuditLogService,
    private userProfileService: UserProfileService,
    private userAgreementService: UserAgreementService,
    private featureFlagService: FeatureFlagsService,
    private deviceStatusService: DeviceStatusService,
    private dialog: MatDialog,
  ) {}

  public async login(): Promise<void> {
    try {
      this.isUserLoggedInBehaviorSubject.next(true);
      const userInfoIamResponse = await this.userProfileService.getUserInfo();
      this.handleUserInfoLoaded(userInfoIamResponse);
      this.setupUserFeatures();
    } catch (error) {
      window.top.location.href = environment.auth.logoutUrl;
    }
  }

  private setupUserFeatures() {
    this.featureFlagService.setStateFeatureFlags();
    this.deviceStatusService.setStateDeviceStatus();
    this.setupUserAgreementDocument();
    this.sendLoginAuditLog();
  }

  private sendLoginAuditLog() {
    this.auditLogService.createAuditLog(AuditLogStatus.Success);
  }

  public logout(): void {
    this.oauthService.logOut();
    this.windowInstance.location.href = environment.auth.logoutUrl;
  }

  public getUserInfo(): IUserInfoWithRole {
    return this.userInfoBehaviorSubject.value;
  }

  public handleUserInfoLoaded(userInfo: IUserInfo): void {
    const userRole = this.mapUserRole(userInfo);
    const userInfoWithRole: IUserInfoWithRole = {
      ...userInfo,
      role: userRole,
    };

    this.userInfoBehaviorSubject.next(userInfoWithRole);
  }

  public isUserAllowedToSeeCPF(): boolean {
    return this.getUserInfo().role !== Roles.AnalistaOperacional;
  }

  public isUserAllowedToEditDevicesGroups(): boolean {
    return (
      this.getUserInfo().role === Roles.AnalistaSegurancaEmpresarial ||
      this.getUserInfo().role === Roles.Administrador ||
      this.getUserInfo().role === Roles.Euc
    );
  }

  public isUserAllowedToEditDeviceGroupNames(): boolean {
    return (
      this.getUserInfo().role === Roles.Administrador ||
      this.getUserInfo().role === Roles.Euc
    );
  }

  private setupUserAgreementDocument(): void {
    this.userAgreementService.getCurrentUserAgreementDocument();
    this.userAgreementService.document$.subscribe(document => {
      if (document) {
        this.userAgreementService.getLastUserAcceptance(document.id);
        this.userAgreementService.userAgreement$
          .pipe(skip(1))
          .subscribe(agreed => {
            if (!agreed) {
              this.openUserAgreementModal();
            }
          });
      }
    });
  }

  private openUserAgreementModal() {
    this.dialog.open(UserAgreementModalComponent, {
      disableClose: true,
      panelClass: 'modal-user-agreement',
      backdropClass: 'modal-user-agreement-backdrop',
      closeOnNavigation: false,
    });
  }

  private mapUserRole(userInfo: IUserInfo): Roles {
    const thingsManagementGroupMembership = userInfo?.groupMembership[0];
    return Roles[Roles[IamRolesEnum[thingsManagementGroupMembership]]];
  }
}
