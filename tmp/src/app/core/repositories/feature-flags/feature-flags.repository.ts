import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IFeatureFlag } from '../../../shared/interfaces/feature-flag.interface';

export interface IFeatureFlagsRepository {
  getFeatureFlags: () => Observable<IFeatureFlag[]>;
}

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagsRepository implements IFeatureFlagsRepository {
  constructor(private http: HttpClient) {}

  getFeatureFlags(): Observable<IFeatureFlag[]> {
    return this.http.get<IFeatureFlag[]>(
      `${environment.thingsManagementBffUrl}/feature-flags`,
    );
  }
}
