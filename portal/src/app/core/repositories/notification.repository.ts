import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CachePanicAlert } from '../../stores/panic-alert/panic-alert.state';
import { environment } from '../../../environments/environment';
import { NotificationType } from '../../shared/enums/notificationType';
import { Coordinates } from '../../shared/models/coordinates';
import { Site } from '../../shared/models/site';
import { PaginatedModel } from '../../shared/models/paginatedModel';
import { PanicAlertNotificationComment } from '../../shared/models/notification';
import { HasAccessToSite } from '../../shared/models/hasAccessToSite';
import { HttpStatusCodeResponse } from '../../shared/interfaces/http-response.interface';

export interface NotificationModel {
  id: string;
  deviceId: string;
  deviceType: string;
  description: string;
  eventDate: string;
  eventLocation: Coordinates;
  seen: boolean;
  notificationType: NotificationType;
  batteryPercent: string;
  batteryState: string;
  totalSent: number;
  sourceApplicationId: string;
  sourceApplicationName: string;
  thing?: {
    name: string;
    iamId?: string;
    document?: string;
    passport?: string;
    company?: string;
  };
  areaName: string;
}

export interface NotificationApiGetModel {
  id: string;
  areaName?: string;
  attendedByThing?: string;
  attendedEndedByThing?: string;
  description: string;
  eventDateTime: string;
  latitude: number;
  longitude: number;
  listNotificationView: [
    {
      viewdDateTime: string;
      nameThing: string;
      matriculaThing: string;
      notificationID: string;
      id: string;
    }
  ];
  matriculaView: string;
  reason?: 'Other' | 'Real' | 'Falsy';
  siteId: number;
  sourceApplicationId: string;
  sourceIdentificator: string;
  sourceIdentificatorType: string;
  sourceApplicationName: string;
  status: string;
  attendanceDateTime?: string;
  attendanceEndedDateTime?: string;
  statusbattery: string;
  totalSent: number;
  typeNotification: NotificationType;
  comments: PanicAlertNotificationComment[];
  thing?: {
    name: string;
    iamId?: string;
    document?: string;
    passport?: string;
    company?: string;
  };
  middleware?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationRepository {
  constructor(private http: HttpClient) { }

  public markNotificationAsRead(
    alert: CachePanicAlert,
    userName: string,
    iamId: string
  ): Observable<void> {
    const uri = `${environment.locationSuiteBff}/api/v1/Notifications/PanicAlert/Aware`;
    const body = {
      sourceApplicationId: alert.sourceApplicationId,
      deviceInfoSource: {
        id: alert.deviceSourceInfoId,
        type: alert.deviceSourceInfoType
      },
      location: {
        latitude: alert.eventLocation.lat,
        longitude: alert.eventLocation.lng
      },
      eventDateTime: alert.eventDateTime,
      thingRegistration: iamId,
      thingName: userName
    };

    return this.http.post<void>(uri, body);
  }

  public markNotificationAsAttended(
    alert: CachePanicAlert,
    userName: string,
    iamId: string,
    attendanceDateTime: string
  ): Observable<void> {
    const uri = `${environment.locationSuiteBff}/api/v1/Notifications/PanicAlert/Aware`;
    const body = {
      sourceApplicationId: alert.sourceApplicationId,
      deviceInfoSource: {
        id: alert.deviceSourceInfoId,
        type: alert.deviceSourceInfoType
      },
      location: {
        latitude: alert.eventLocation.lat,
        longitude: alert.eventLocation.lng
      },
      eventDateTime: alert.eventDateTime,
      thingRegistration: iamId,
      thingName: userName,
      attendanceDateTime
    };

    return this.http.post<void>(uri, body);
  }

  public getNotificationsMadeBy(
    thingRegistration: string,
    site: Site,
    from: string,
    till: string,
    unreadOnly: boolean,
    notificationType?: NotificationType
  ): Observable<NotificationModel[]> {
    let params: HttpParams = new HttpParams();

    params = params.append('unreadOnly', (!!unreadOnly).toString());
    params = params.append('startDate', from);
    params = params.append('endDate', till);
    if (notificationType)
      params = params.append('notificationType', notificationType);
    if (site && site.name) params = params.append('siteName', site.name);

    const uri = `${environment.locationSuiteBff}/api/v1/Notifications/byDate`;

    return this.http.get<NotificationModel[]>(uri, { params });
  }

  public getPanicButtonNotifications(
    site: Site,
    page: number,
    pageSize: number,
    notificationStatus?: string
  ): Observable<PaginatedModel<NotificationApiGetModel[]>> {
    let params: HttpParams = new HttpParams();

    params = params
      .append('page', page.toString())
      .append('perPage', pageSize.toString())
      .append('notificationType', 'PanicButton');

    if (notificationStatus) {
      params = params.append('notificationStatus', notificationStatus);
    }

    if (site) {
      const siteCode = Number(site.code.valueOf());
      const uri = `${environment.locationSuiteBff}/api/v1/Notifications/bySite/${siteCode}`;
      return this.http.get<PaginatedModel<NotificationApiGetModel[]>>(uri, {
        params
      });
    }
    return null;
  }

  public updatePanicButtonNotification(
    notificationId: string,
    status: 'Attended' | 'InAttendance' | 'WaitingService',
    reason?: 'Other' | 'Real' | 'Falsy',
    attendedEndedByThing?: string,
    attendanceEndedDateTime?: string
  ): Observable<any> {
    const uri = `${environment.locationSuiteBff}/api/v1/Notifications/${notificationId}`;
    return this.http.put<any>(uri, {
      notificationId,
      attendedEndedByThing,
      attendanceEndedDateTime,
      status,
      reason
    });
  }

  public createNewPanicButtonNotificationComment(
    notificationId: string,
    text: string,
    author: string,
    date: string
  ): Observable<any> {
    const uri = `${environment.locationSuiteBff}/api/v1/Notifications/${notificationId}/Comment`;
    return this.http.post<any>(uri, {
      text,
      nameThing: author,
      dateTime: date
    });
  }

  public checkUserAccessByLatLong(
    latitude: number,
    longitude: number,
    deviceSourceInfo: string
  ): Observable<HasAccessToSite> {
    const uri = `${environment.locationSuiteBff}/api/v1/Notifications/hasAccess`;

    let params: HttpParams = new HttpParams();
    params = params.append('longitude', `${longitude}`);
    params = params.append('latitude', `${latitude}`);
    params = params.append('deviceSourceInfo', `${deviceSourceInfo}`);

    return this.http.get<HasAccessToSite>(uri, { params });
  }

  public setAllPanicEventsAsNotApplicable(userMatricula: string): Observable<HttpStatusCodeResponse> {
    const uri = `${environment.locationSuiteBff}/api/v1/notifications/PanicAlert/not-applicable/all-events`;
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

    return this.http.post<HttpStatusCodeResponse>(uri, `\"${userMatricula}\"`, {headers: headers, observe: 'response'})
  }
}
