import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IFeatureFlag } from '../../shared/interfaces/feature-flag.interface';
import { SetFeatureFlagsAction } from './feature-flags.actions';
import { FeatureFlagsState } from './feature-flags.state';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagsStateService {
  @Select(FeatureFlagsState.featureFlags)
  public featureFlags$: Observable<IFeatureFlag[]>;

  @Select(FeatureFlagsState.featureFlagsActive)
  public activeFeatureFlags$: Observable<IFeatureFlag[]>;

  @Dispatch()
  public set = (featureFlags: IFeatureFlag[]): SetFeatureFlagsAction =>
    new SetFeatureFlagsAction(featureFlags);
}
