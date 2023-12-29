import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ThingLocationService {
  private readonly BASE_URL = `${environment.locationPlatformApiUrl}/geographic/thing`;

  private headers = { Authorization: `Basic ${environment.Authorization()}` };

  constructor(private http: HttpClient) {}

  lastById(id: string) {
    return this.http
      .get(`${this.BASE_URL}/${id}/last`, { headers: this.headers })
      .pipe(take(1));
  }
}
