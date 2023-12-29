import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { IFeatureFlag } from '../../shared/interfaces/feature-flag.interface';
import { SetFeatureFlagsAction } from './feature-flags.actions';
import {
  FeatureFlagsState,
  IFeatureFlagsStateModel,
} from './feature-flags.state';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagsStateService {
  constructor(private store: Store) {}

  @Select(FeatureFlagsState.featureFlags)
  public featureFlags$: Observable<IFeatureFlag[]>;

  @Dispatch()
  public setFeatureFlags = (
    featureFlags: IFeatureFlag[],
  ): SetFeatureFlagsAction => new SetFeatureFlagsAction(featureFlags);

  getSnapshot = (): IFeatureFlagsStateModel =>
    this.store.snapshot().featureFlags as IFeatureFlagsStateModel;
}
