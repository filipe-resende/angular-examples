import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PointOfInterest } from '../../shared/models/poi';

@Injectable({
  providedIn: 'root'
})
export class PoiRepository {
  constructor(private http: HttpClient) {}

  public listPoisByCoord(lat, lng, radius): Observable<PointOfInterest[]> {
    const uri = `${environment.locationSuiteBff}/api/v1/Geographic/PointOfInterest/${lat}/${lng}/${radius}`;
    return this.http.get<PointOfInterest[]>(uri);
  }

  public listByArea(area, category): Observable<PointOfInterest> {
    const uri = `${environment.locationBff}Geographic/PointOfInterest/${area}/${category}`;
    return this.http.get<PointOfInterest>(uri);
  }

  public listPoisCategorys(): Observable<any> {
    const uri = `${environment.locationBff}Geographic/Category/PointOfInterest`;
    return this.http.get<any>(uri);
  }

  public createPoi(poi): Observable<PointOfInterest> {
    const uri = `${environment.locationBff}Geographic/PointOfInterest`;
    return this.http.post<PointOfInterest>(uri, poi);
  }

  public deletePoi(poi): Observable<PointOfInterest> {
    const uri = `${environment.locationBff}Geographic/PointOfInterest/${poi.id}`;
    return this.http.delete<PointOfInterest>(uri);
  }
}
