import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { EffectivenessBase } from 'src/app/model/effectiveness/effectiveness-base-interface';

@Injectable({
  providedIn: 'root',
})
export class EffectivenessDashboardService {
  private readonly CHARTS_URL = `${environment.chartsApiUrl}`;

  private readonly EFFECTIVENESS_URL = `${this.CHARTS_URL}/effectiveness-charts`;

  constructor(private http: HttpClient) {}

  public GetEffectivenessData(): Observable<EffectivenessBase> {
    return this.http
      .get<EffectivenessBase>(`${this.EFFECTIVENESS_URL}`)
      .pipe(take(1));
  }
}
