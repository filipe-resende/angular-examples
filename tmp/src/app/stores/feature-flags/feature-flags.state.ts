import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StoreOptions } from '@ngxs/store/src/symbols';
import { IFeatureFlag } from '../../shared/interfaces/feature-flag.interface';
import { SetFeatureFlagsAction } from './feature-flags.actions';

export interface IFeatureFlagsStateModel {
  featureFlags: IFeatureFlag[];
}

const INITIAL_STATE = {
  featureFlags: null,
};

type FeatureFlagsStateContext = StateContext<IFeatureFlagsStateModel>;

@Injectable({ providedIn: 'root' })
@State<IFeatureFlagsStateModel>({
  name: 'featureFlags',
  defaults: INITIAL_STATE,
} as StoreOptions<IFeatureFlagsStateModel>)
export class FeatureFlagsState {
  @Selector()
  public static featureFlags(state: IFeatureFlagsStateModel): IFeatureFlag[] {
    return state.featureFlags;
  }

  @Action(SetFeatureFlagsAction)
  public setFeatureFlags(
    { patchState }: FeatureFlagsStateContext,
    { featureFlags }: SetFeatureFlagsAction,
  ) {
    patchState({ featureFlags });
  }
}
