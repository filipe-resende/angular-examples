import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { DeviceLastLocation } from 'src/app/model/devices-interfaces';
@Injectable({
  providedIn: 'root',
})
export class DeviceLocationInfo {
  private readonly BASE_URL = `${environment.locationPlatformApiUrl}/geographic/device`;

  private readonly BASE_URL_BFF = `${environment.thingsManagementBffUrl}/device-last-location`;

  private headers = { Authorization: `Basic ${environment.Authorization()}` };

  constructor(private http: HttpClient) {}

  lastById(id: string) {
    return this.http
      .get(`${this.BASE_URL}/${id}/last`, { headers: this.headers })
      .pipe(take(1));
  }

  getSourceApplicationsById(sourceApplicationId: string, externalId: string) {
    return this.http
      .get<DeviceLastLocation>(
        `${this.BASE_URL_BFF}/last?sourceApplicationId=${sourceApplicationId}&externalId=${externalId}`,
      )
      .pipe(take(1));
  }

  lastBySourceInfo(data: any) {
    return this.http.get(
      `${this.BASE_URL}/${data.device.sourceInfos[0].type}/${data.device.sourceInfos[0].value}/last`,
      {
        headers: this.headers,
      },
    );
  }
}
