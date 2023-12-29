import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  private readonly BASE_URL = `${environment.thingsManagementApiUrl}/management`;

  private headers = { Authorization: `Basic ${environment.Authorization()}` };

  constructor(private http: HttpClient) {}

  get() {
    return this.http
      .get(`${this.BASE_URL}/admin/email`, {
        headers: this.headers,
      })
      .pipe(take(1));
  }
}
