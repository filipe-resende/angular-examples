/* eslint-disable consistent-return */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private notificationUrl = `${environment.locationBff}Geographic/Applications/${environment.notifyAppId}/Notifications`;

  constructor(private http: HttpClient) {}

  public async sendNotification(notiTag: any) {
    // tslint:disable-next-line:prefer-for-of

    for (let i = 0; i < notiTag.length; i++) {
      const notificationData = {
        title: notiTag[i].title,
        message: notiTag[i].subTitle,
        sound: 'siren_alert',
        categories: notiTag[i].tag,
        ongoing: true,
        actions: [
          {
            title: 'Confirmar',
            callback: 'answer',
            foreground: true
          }
        ]
      };

      if (notificationData.title) {
        return this.http
          .post(this.notificationUrl, notificationData)
          .toPromise();
      }
    }
  }
}
