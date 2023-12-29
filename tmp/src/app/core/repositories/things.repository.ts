import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThingItem, ThingsListResponse } from 'src/app/model/things-interfaces';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ThingsRepository {
  private readonly BASE_URL = `${environment.thingsManagementApiUrl}/things`;

  constructor(private http: HttpClient) {}

  private headers = { Authorization: `Basic ${environment.Authorization()}` };

  private readonly BFF_URL = `${environment.thingsManagementBffUrl}/things`;

  public getThings(
    skip?: number,
    count?: number,
  ): Observable<ThingsListResponse> {
    let params: HttpParams = new HttpParams();

    if (skip) params = params.append('skip', `${skip}`);
    if (count) params = params.append('count', `${count}`);

    return this.http.get<ThingsListResponse>(this.BFF_URL, {
      params,
    });
  }

  public createThing(thing: ThingItem): Observable<ThingItem> {
    return this.http.post<ThingItem>(`${this.BFF_URL}`, thing);
  }

  public getThingId(id: string): Observable<ThingItem> {
    return this.http.get<ThingItem>(`${this.BFF_URL}/${id}`);
  }

  public update(id: string, thing: ThingItem): Observable<ThingItem> {
    return this.http.put<ThingItem>(`${this.BASE_URL}/${id}`, thing, {
      headers: this.headers,
    });
  }

  public getThingByName(
    name: string,
    skip = 0,
    count = 15,
  ): Observable<ThingsListResponse> {
    const params: HttpParams = new HttpParams()
      .append('skip', `${skip}`)
      .append('count', `${count}`);

    return this.http.get<ThingsListResponse>(`${this.BFF_URL}/byName/${name}`, {
      params,
    });
  }

  public getBySourceInfo(type: string, value: string): Observable<ThingItem> {
    return this.http.get<ThingItem>(
      `${this.BFF_URL}/bySourceInfo/${type}/${value}`,
    );
  }
}
