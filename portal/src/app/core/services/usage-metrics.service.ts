import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { UsageMetricsServiceRepository } from '../repositories/usage-metrics.repository';
import { UsageMetrics } from '../../shared/models/usageMetrics';

@Injectable({
  providedIn: 'root'
})
export class UsageMetricsService {
  constructor(private usageMetricsRepository: UsageMetricsServiceRepository) {}

  public GetUsageMetrics(
    month?: number,
    year?: number
  ): Observable<UsageMetrics[]> {
    return this.usageMetricsRepository.GetUsageMetrics(month, year);
  }
}
