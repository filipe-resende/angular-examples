import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { share, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SapPlantAll, SapPlant } from '../../model/sap-plant-interfaces';

@Injectable({
  providedIn: 'root',
})
export class SapPlantService {
  private readonly BFF_URL = `${environment.thingsManagementBffUrl}`;

  private headers = { Authorization: `Basic ${environment.Authorization()}` };

  constructor(private service: HttpClient) {}

  getSapPlantById(id: string) {
    return this.service
      .get<SapPlant>(`${this.BFF_URL}/sap-plant/${id}`)
      .pipe(take(1), share());
  }

  getSapPlant() {
    return this.service
      .get<SapPlantAll>(`${this.BFF_URL}/sap-plant/GetAll?count=9999`)
      .pipe(take(1), share());
  }

  postSapPlant(object) {
    return this.service.post(`${this.BFF_URL}/sap-plant`, object).pipe(take(1));
  }
}
