import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Driver } from "../../../shared/models/driver";
import { FocalPoint } from "../../../shared/models/focal";


@Injectable({
  providedIn: "root"
})
export class DriverService {

  constructor(private http: HttpClient) { }

  public listByArea(area): Observable<Driver> {
    const uri = `${environment.locationBff}Geographic/Drivers`;

    let params: HttpParams = new HttpParams();
    params = params.append("localityId", area);
    return this.http.get<Driver>(uri, {params});
  }

  public delete(driver): Observable<Driver> {
    const uri = `${environment.locationBff}Geographic/Drivers/${driver.id}`;
    return this.http.delete<Driver>(uri);
  }

  public create(driver): Observable<Driver> {
    const uri = `${environment.locationBff}Geographic/Drivers`;
    return this.http.post<Driver>(uri, driver);
  }

  public put(driver): Observable<Driver> {
    const uri = `${environment.locationBff}Geographic/Drivers/${driver.id}`;
    return this.http.put<Driver>(uri, driver);
  }
}
