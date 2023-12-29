import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Site } from '../../shared/models/site';
import { SiteAsCountry } from '../../shared/models/siteAsCountry';

@Injectable({
  providedIn: 'root'
})
export class SiteRepository {
  constructor(private http: HttpClient) {}

  public listAllSites(): Observable<any> {
    const uri = `${environment.locationBff}Site/All`;
    return this.http.get<any>(uri, { observe: 'response' });
  }

  public listSitesByFilter(type): Observable<Site[]> {
    const uri = `${environment.locationBff}Site/GetByFilter?type=${type}`;
    return this.http.get<Site[]>(uri);
  }

  public listSitesGeographicByCategory(category): Observable<any> {
    const uri = `${environment.locationBff}Site/GeographicByCategory/${category}`;
    return this.http.get<any>(uri, { observe: 'response' });
  }

  public listAllSitesAsTree(): Observable<SiteAsCountry[]> {
    const uri = `${environment.locationSuiteBff}/api/v1/ValeAreasSite/Tree/All`;
    return this.http.get<SiteAsCountry[]>(uri);
  }
}
