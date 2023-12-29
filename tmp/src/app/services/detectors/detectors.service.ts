import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { Detectors } from 'src/app/model/detectors-interface';

@Injectable({
  providedIn: 'root',
})
export class DetectorsService {
  private readonly BASE_URL = `${environment.thingsManagementBffUrl}/detectors`;

  private headers = { Authorization: `Basic ${environment.Authorization()}` };

  constructor(private http: HttpClient) {}

  getAll(
    applicationId?: string,
    type = '',
    isAreaAccessPoint = null,
    offset = 0,
    count = 0,
  ) {
    return this.http
      .get<Detectors>(
        `${this.BASE_URL}?applicationId=${applicationId}${
          type ? `&type=${type}` : ''
        }${
          isAreaAccessPoint ? `&isAreaAccessPoint=${isAreaAccessPoint}` : ''
        }&offset=${offset}&count=${count}`,
        {
          headers: this.headers,
        },
      )
      .pipe(take(1));
  }
}
