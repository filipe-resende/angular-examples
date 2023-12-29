import { Injectable } from '@angular/core';
import { FeatureFlagsRepository } from 'src/app/core/repositories/feature-flags/feature-flags.repository';
import { FeatureFlagsStateService } from 'src/app/stores/feature-flags/feature-flags-state.service';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagsService {
  constructor(
    private featureFlagsRepository: FeatureFlagsRepository,
    private featureFlagsStateService: FeatureFlagsStateService,
  ) {}

  public setStateFeatureFlags(): void {
    this.featureFlagsRepository
      .getFeatureFlags()
      .toPromise()
      .then(result => {
        this.featureFlagsStateService.setFeatureFlags(result);
      });
  }
}
