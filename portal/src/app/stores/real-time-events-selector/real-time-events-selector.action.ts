import { RealTimeSelectorModel } from './real-time-events-selector.state';

export class UpdateRealTimeSelectorState {
  public static readonly type =
    '[REAL_TIME_SELECTOR] UpdateRealTimeSelectorState';

  constructor(public realTimeSelectorState: RealTimeSelectorModel) {}
}
