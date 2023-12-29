import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Geofence } from '../../shared/models/geofence';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../../shared/models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class GeofenceRepository {
  constructor(private http: HttpClient) {}

  public listAllGeofencesByCood(
    latitude: number,
    longitude: number,
    radius: number
  ): Observable<Geofence[]> {
    const uri = `${environment.locationBff}Geographic/Geofence/${latitude}/${longitude}/${radius}`;
    return this.http.get<Geofence[]>(uri);
  }

  public listGeofenceCategories(): Observable<any> {
    const uri = `${environment.locationSuiteBff}/api/v1/ValeAreasCategory`;
    return this.http.get<any>(uri);
  }

  public createGeofence(geoFence: Geofence): Observable<Geofence> {
    const uri = `${environment.locationSuiteBff}/api/v1/ValeAreasManagement`;
    return this.http.post<Geofence>(uri, geoFence);
  }

  public deleteGeofence(
    geoFence: Geofence,
    user?: UserProfile
  ): Observable<Geofence> {
    const uri = `${environment.locationSuiteBff}/api/v1/ValeAreasManagement/${geoFence.id}`;
    return this.http.request<Geofence>('delete', uri, { body: { user } });
  }

  public listAllGeofenceBySiteName(siteName: string): Observable<Geofence[]> {
    const uri = `${environment.locationSuiteBff}/api/v1/ValeAreasManagement/Site/${siteName}/Geofences`;
    return this.http.get<any>(uri);
  }
}
