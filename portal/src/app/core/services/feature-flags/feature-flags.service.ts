import { Injectable } from '@angular/core';
import { IFeatureFlag } from '../../../shared/interfaces/feature-flag.interface';
import { FeatureFlagsRepository } from '../../repositories/feature-flags/feature-flags.repository';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagsService {
  constructor(private featureFlagsRepository: FeatureFlagsRepository) {}

  public getFeatureFlags = (): Promise<IFeatureFlag[]> =>
    this.featureFlagsRepository.getFeatureFlags().toPromise();
}
