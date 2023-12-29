import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Detector } from '../../shared/models/Detector';
import { PerimeterAccessControl } from '../../shared/models/primeter-access-control';
import { DetectorView } from '../../shared/models/DetectorView';
import { GeometryInput } from '../../shared/models/geometryInput';
import { HttpStatusCodeResponse } from '../../shared/interfaces/http-response.interface';
import { DetectorEditModel } from '../../shared/models/DetectorEditModel';

@Injectable({
  providedIn: 'root'
})
export class DetectorsRepository {
  constructor(private http: HttpClient) {}

  public getAllDetectorsOnRadius(
    latitude: number,
    longitude: number,
    radius: number
  ): Observable<Detector[]> {
    const uri = `${environment.locationSuiteBff}/api/v1/detectors/get-all-detectors-on-radius`;

    const params = new HttpParams()
      .append('latitude', latitude.toString())
      .append('longitude', longitude.toString())
      .append('radius', radius.toString());

    return this.http.get<Detector[]>(uri, { params });
  }

  public getAllDetectorsOnVirtualFence(
    coordinates: number[][]
  ): Observable<Detector[]> {
    const uri = `${environment.locationSuiteBff}/api/v1/detectors/get-all-detectors-on-polygon`;
    const body = {
      coordinates
    };

    return this.http.post<Detector[]>(uri, body);
  }

  public createPerimeterAccessControlAssociation(
    perimeterAccessControl: PerimeterAccessControl
  ): Observable<any> {
    const uri = `${environment.locationSuiteBff}/api/v1/perimeterAccessControl`;
    return this.http.post<PerimeterAccessControl>(uri, perimeterAccessControl);
  }

  public getDetectorsOnFence(perimeterId: string): Observable<DetectorView[]> {
    const uri = `${environment.locationSuiteBff}/api/v1/perimeteraccesscontrol/perimeters/${perimeterId}/detectors`;
    return this.http.get<DetectorView[]>(uri).pipe(take(1));
  }

  public getDetectorsOnFencePolygon(
    perimeterId: string,
    geometry: GeometryInput
  ): Observable<DetectorView[]> {
    const uri = `${environment.locationSuiteBff}/api/v1/perimeteraccesscontrol/associations/perimeter/${perimeterId}/detectors/by-polygon`;
    return this.http.post<DetectorView[]>(uri, geometry).pipe(take(1));
  }

  public EditDetectorsOnFence(
    detectorEditModel: DetectorEditModel
  ): Observable<HttpStatusCodeResponse> {
    const uri = `${environment.locationSuiteBff}/api/v1/perimeteraccesscontrol/associations/detectors/edit`;
    return this.http
      .patch<HttpStatusCodeResponse>(uri, detectorEditModel)
      .pipe(take(1));
  }
}
