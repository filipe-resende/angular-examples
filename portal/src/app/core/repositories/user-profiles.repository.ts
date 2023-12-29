import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserProfileService } from '../../stores/user-profile/user-profile.service';

import { PORTAL_KEY } from '../constants/portal-key.const';

@Injectable({
  providedIn: 'root'
})
export class UserProfilesRepository {
  constructor(private http: HttpClient, private userProfileService: UserProfileService) {}

  public createOrUpdateUserProfile(): void {
    const user = this.userProfileService.getUserProfile();

    const formData = new FormData();
    formData.append('UserEmail', user.email);
    formData.append('UserName', user.userName);
    formData.append('PortalKey', PORTAL_KEY);

    this.http
      .post<void>(
        `${environment.locationSuiteBff}/api/v1/userprofiles`,
        formData
      )
      .subscribe(
        () => this.userProfileService.updateAccessLog(true),
        error => {
          // eslint-disable-next-line no-console
          console.error('HTTP Error', error);
        }
      );
  }
}
