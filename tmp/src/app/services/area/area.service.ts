import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { Area } from 'src/app/model/area';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private readonly BASE_URL = `${environment.geometriesApiUrl}/area`;

  private headers = { Authorization: `Basic ${environment.Authorization()}` };

  constructor(private http: HttpClient) {}

  getAreaById(areaId: string, active: boolean) {
    return this.http
      .get<Area>(`${this.BASE_URL}/areaId/${areaId}?=${active}=true`, {
        headers: this.headers,
      })
      .pipe(take(1));
  }
}
