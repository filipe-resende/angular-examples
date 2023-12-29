import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class CompanyInfoService {
  private readonly BASE_URL = `${environment.thingsManagementBffUrl}`;

  private headers = { Authorization: `Basic ${environment.Authorization()}` };

  constructor(private http: HttpClient) {}

  getCompaniesFilteredList(): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.BASE_URL}/companies`, { headers: this.headers })
      .pipe(take(1));
  }
}
