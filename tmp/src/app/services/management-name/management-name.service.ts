import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { share, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ManagementNameResponse } from '../../model/management-name-interfaces';

@Injectable({
  providedIn: 'root',
})
export class ManagementNameService {
  private readonly BFF_URL = `${environment.thingsManagementBffUrl}`;

  constructor(private http: HttpClient) {}

  getManagementName() {
    return this.http
      .get<ManagementNameResponse>(
        `${this.BFF_URL}/management/GetAll?count=9999`,
      )
      .pipe(take(1), share());
  }
}
