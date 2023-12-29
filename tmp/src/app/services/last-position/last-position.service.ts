/* eslint-disable array-callback-return */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LastPositionService {
  private readonly BASE_URL = `${environment.locationPlatformApiUrl}/geographic`;

  private headers = { Authorization: `Basic ${environment.Authorization()}` };

  constructor(private service: HttpClient) {}

  findLocationByLastEvent(data) {
    let requestArray = [];
    data.map(obj => {
      const request = this.service.get(
        `${this.BASE_URL}/device/${obj.device.id}/last`,
        { headers: this.headers },
      );
      requestArray = [...requestArray, request];
    });

    return forkJoin(requestArray).pipe(
      map((location: any) => {
        let dateTimeList = location.map(
          (element: any) => element.eventDateTime,
        );
        dateTimeList = dateTimeList.sort().reverse();
        const locationInfo = location.filter(
          (el: any) => el.eventDateTime === dateTimeList[0],
        );

        const { coordinates } = locationInfo[0].position.geographic;

        const dateTime = locationInfo[0].eventDateTime;
        const eventDateTime = `${new Date(
          dateTime,
        ).toLocaleDateString()} ${new Date(dateTime).toLocaleTimeString()}`;
        return { coordinates, eventDateTime, locationInfo };
      }),
      take(1),
    );
  }
}
