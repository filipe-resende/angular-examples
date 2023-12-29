import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { NotificationSettings } from '../../../shared/models/notificationSettings';
import { environment } from '../../../../environments/environment';
import { SitesService } from '../../../stores/sites/sites.service';
import { UserAccessControl } from '../../../shared/models/userAccessControl';

// TODO: Separar as chamadas deste serviço de access control em um repository
@Injectable({
  providedIn: 'root'
})
export class AccessControlService {
  constructor(private sitesService: SitesService, private http: HttpClient) {}

  public verifyAccess(iamId: string): Promise<any> {
    const uri = `${environment.locationBff}AccessControl/AccessControl/${iamId}`;
    return this.http.get<any>(uri, { observe: 'response' }).toPromise();
  }

  public verifyAccessFocalPoint(iamId: string): Promise<any> {
    const uri = `${environment.locationBff}AccessControl/FocalPoint/${iamId}`;
    return this.http.get<any>(uri, { observe: 'response' }).toPromise();
  }

  public setAccessPermissions(
    settings: NotificationSettings
  ): Observable<NotificationSettings> {
    const uri = `${environment.locationBff}AccessControl/Userpermissions`;
    return this.http.post<NotificationSettings>(uri, settings);
  }

  public getUserAccessPermissions(
    iamId: string
  ): Observable<NotificationSettings> {
    const uri = `${environment.locationBff}AccessControl/Userpermissions/${iamId}`;
    return this.http.get<NotificationSettings>(uri);
  }

  public getUserAccessInfo(iamId: string): Observable<UserAccessControl> {
    return this.getUserAccessPermissions(iamId).pipe(
      filter(userInfo => userInfo && !!userInfo.iamId)
    ) as Observable<UserAccessControl>;
  }

  /**
   * For compatibility reasons with the notifications API, we've kept the iamId as the email username.
   */
  public sendUserAccessPayload(iamId: string): void {
    this.setupUserAccessPayload(iamId).subscribe(
      (payload: UserAccessControl) => {
        this.setAccessPermissions(payload).pipe(take(1)).subscribe();
      }
    );
  }

  public setupUserAccessPayload(iamId: string): Observable<UserAccessControl> {
    return combineLatest([
      this.getSitesWhereUserHaveAccess().pipe(take(1)),
      this.getUserAccessInfo(iamId).pipe(take(1))
    ]).pipe(
      map(([sites, userInfo]) => {
        return {
          sites,
          ...userInfo,
          sendEmail: userInfo.sendEmail || false,
          sendSms: userInfo.sendSms || false,
          lowBattery: userInfo.lowBattery || false,
          panicAlert: userInfo.panicAlert || false
        } as UserAccessControl;
      })
    );
  }

  private getSitesWhereUserHaveAccess(): Observable<
    {
      [key: string]: string;
    }[]
  > {
    return this.sitesService.sites$.pipe(
      filter(list => !!list),
      map(this.sitesService.mapSitesModelListToSitesIdList)
    );
  }
}
