import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DeviceLoadHistoryResponse } from 'src/app/model/device-load-history-response';

@Injectable({
  providedIn: 'root',
})
export class DeviceHistoryLoadService {
  private readonly BASE_URL = `${environment.thingsManagementBffUrl}/device-load-history`;

  constructor(private http: HttpClient) {}

  public getByDeviceHistoryLoad(request: string) {
    return this.http.get<DeviceLoadHistoryResponse>(
      `${this.BASE_URL}${request}`,
    );
  }

  public sendFileToMail(request: string, email: string) {
    return this.http.get(`${this.BASE_URL}/export${request}email=${email}`);
  }
}
