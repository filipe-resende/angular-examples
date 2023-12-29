import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { UpdateRealTimeSelectorState } from './real-time-events-selector.action';

export class RealTimeSelectorModel {
  public isRealTimeSearch: boolean;
}

const INITIAL_STATE: RealTimeSelectorModel = {
  isRealTimeSearch: true
};

@State<RealTimeSelectorModel>({
  name: 'isRealTimeSearch',
  defaults: INITIAL_STATE
})
@Injectable()
export class RealTimeSelectorState {
  @Selector()
  public static isRealTimeSearch(state: RealTimeSelectorModel): boolean {
    return state.isRealTimeSearch;
  }

  @Action(UpdateRealTimeSelectorState)
  public updateRealTimeSelectorState(
    { patchState }: StateContext<RealTimeSelectorModel>,
    { realTimeSelectorState }: UpdateRealTimeSelectorState
  ): void {
    patchState(realTimeSelectorState);
  }
}
