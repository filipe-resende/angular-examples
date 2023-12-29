import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { FocalPoint } from "../../../shared/models/focal";


@Injectable({
  providedIn: "root"
})
export class FocalService {

  constructor(private http: HttpClient) { }

  public listByArea(area): Observable<FocalPoint> {
    const uri = `${environment.locationBff}Geographic/FocalPoints`;

    let params: HttpParams = new HttpParams();
    params = params.append("localityId", area);
    return this.http.get<FocalPoint>(uri, {params});
  }

  public delete(focalPoi): Observable<FocalPoint> {
    const uri = `${environment.locationBff}Geographic/FocalPoints/${focalPoi.id}`;
    return this.http.delete<FocalPoint>(uri);
  }

  public create(focalPoi): Observable<FocalPoint> {
    const uri = `${environment.locationBff}Geographic/FocalPoints`;
    return this.http.post<FocalPoint>(uri, focalPoi);
  }

  public put(focalPoi): Observable<FocalPoint> {
    const uri = `${environment.locationBff}Geographic/FocalPoints/${focalPoi.id}`;
    return this.http.put<FocalPoint>(uri, focalPoi);
  }
}
