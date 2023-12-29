import { Injectable } from '@angular/core';
import { AccountInfo } from '@azure/msal-browser';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IUserInfo } from 'src/app/shared/interfaces/iam.interfaces';
import { Role } from 'src/app/shared/enums/role';
import { UserProfile } from '../../model/user-profile';
import { SetUserProfileState, UpdateAccessLog } from './user-profile.actions';
import { UserProfileState, UserProfileStateModel } from './user-profile.state';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  @Select(UserProfileState.userProfile)
  public userProfile$: Observable<UserProfile>;

  constructor(private store: Store) {}

  @Dispatch()
  public setUserProfile(account: Partial<AccountInfo>): SetUserProfileState {
    const userProfile: UserProfile = {};

    if (account) {
      userProfile.userName = `${account.name}`;
      userProfile.email = `${account.idTokenClaims.email}`;
      /**
       * For compatibility reasons with the notifications API, we've kept the iamId as the email username.
       */
      [userProfile.iamId] = userProfile.email.split('@');
      userProfile.roles = account.idTokenClaims.roles
        ?.filter(r => !r.startsWith('site'))
        .map(e => e.toLowerCase());
    }

    return new SetUserProfileState(userProfile);
  }

  @Dispatch()
  public updateAccessLog(accessLog: boolean): UpdateAccessLog {
    return new UpdateAccessLog(accessLog);
  }

  private getStore(): UserProfileStateModel {
    return this.store.snapshot().userProfile as UserProfileStateModel;
  }

  public getUserProfile(): UserProfile {
    return this.getStore()?.user;
  }

  public getUserInfo(): IUserInfo {
    const user = this.getStore()?.user;
    return {
      mail: user.email,
      UserFullName: user.userName,
      FirstName: user.userName,
      groupMembership: user.roles,
      cn: user.iamId,
    };
  }

  public getUserRoles(): string[] {
    const userProfile = this.getUserProfile();
    return userProfile.roles ?? [];
  }

  public doesUserHavePanicAlertPermission(): boolean {
    const userRoles = this.getUserRoles();
    return (
      userRoles?.findIndex(
        role => role === Role.OperationalAnalyst || role === Role.Paebm,
      ) >= 0
    );
  }

  public canViewSensitiveData(): boolean {
    const userRoles = this.getUserRoles();
    return (
      userRoles?.findIndex(
        role =>
          role === Role.BusinessSecurityAnalyst ||
          role === Role.Paebm ||
          role === Role.Facilities,
      ) >= 0
    );
  }

  public isControlCenterProfile(): boolean {
    const userRoles = this.getUserRoles();
    return userRoles?.includes(Role.ControlCenter);
  }

  public IsBusinessSecurityAnalyst(): boolean {
    const userRoles = this.getUserRoles();
    return userRoles?.includes(Role.BusinessSecurityAnalyst);
  }
}
