import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UpdateRealTimeSelectorState } from './real-time-events-selector.action';
import {
  RealTimeSelectorModel,
  RealTimeSelectorState
} from './real-time-events-selector.state';

@Injectable({
  providedIn: 'root'
})
export class RealTimeSelectorService {
  constructor(private store: Store) {}

  public getStore(): RealTimeSelectorModel {
    return this.store.snapshot().things as RealTimeSelectorModel;
  }

  @Select(RealTimeSelectorState.isRealTimeSearch)
  public isRealTimeSearch$: Observable<boolean>;

  @Dispatch()
  public updateRealTimeSelectorState(
    realTimeSelectorState: RealTimeSelectorModel
  ): UpdateRealTimeSelectorState {
    return new UpdateRealTimeSelectorState(realTimeSelectorState);
  }
}
