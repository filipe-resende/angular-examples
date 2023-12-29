import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IUserInfo } from 'src/app/shared/interfaces/iam.interfaces';
import { environment } from 'src/environments/environment';

@Injectable()
export class BypassLoginAuthService {
  constructor(private authService: AuthService) {}

  public async updateLoggedBypassLoginUser(claim: any) {
    if (claim && !environment.production) {
      try {
        if (!claim['result.Groups']) {
          throw new Error('Not Allowed');
        }

        // obtém os dados do userinfo retornados pelo IAM e transforma as keys do objeto todas em lowercase
        const userObj = {
          userName: claim['result.Name'],
          userIamId: claim['result.User'],
          userEmail: claim['result.Email'],
          userCountry: claim['result.Country'],
          userGroups: claim['result.Groups'],
          sub: claim.sub,
          isBypassLogin: true,
        };
        const userInfo = this.setPropertiesUser(userObj);
        this.authService.isUserLoggedInBehaviorSubject.next(true);
        this.authService.handleUserInfoLoaded(userInfo);
      } catch (error) {
        console.log(error);
      }
    }
  }

  private setPropertiesUser(object: any): IUserInfo {
    return {
      mail: object.userEmail,
      UserFullName: object.userName,
      FirstName: object.userName,
      groupMembership: object.userGroups,
      cn: object.userGroups[0].cn,
    };
  }
}
