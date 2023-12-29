import { Action, State, StateContext, Selector } from "@ngxs/store";
import { PanicAlert } from "../../shared/models/panic-alert";
import { UpdatePanicAlerts, UpdatePanicState, UpdatePanicAlertWithAccessControlError } from "./panic-alert.actions";

export interface CachePanicAlert extends PanicAlert {
  cacheId: number;
}

const INITIAL_STATE = {
  alerts: [],
  isSignalRConnected: null,
  amountTimesButtonWasPressedWhileOffline: 1,
  accessControlAPIError: false,
};

export class PanicAlertStateModel {
  public alerts: CachePanicAlert[];
  public isSignalRConnected?: boolean;
  public amountTimesButtonWasPressedWhileOffline: number;
  public accessControlAPIError: boolean;
}

@State<PanicAlertStateModel>({
  name: "panicAlert",
  defaults: INITIAL_STATE,
})
export class PanicAlertState {
  @Selector()
  public static alerts(state: PanicAlertStateModel): PanicAlert[] {
    return state.alerts;
  }

  @Selector()
  public static isSignalRConnected(state: PanicAlertStateModel): boolean {
    return state.isSignalRConnected;
  }

  @Selector()
  public static accessControlAPIError(state: PanicAlertStateModel): boolean {
    return state.accessControlAPIError;
  }

  @Action(UpdatePanicAlerts)
  public updatePanicAlerts({ patchState }: StateContext<PanicAlertStateModel>, { panicAlerts }: UpdatePanicAlerts) {
    patchState({ alerts: [...panicAlerts] });
  }

  @Action(UpdatePanicState)
  public updatePanicState(
    { patchState }: StateContext<PanicAlertStateModel>,
    { partialPanicAlertState }: UpdatePanicState
  ) {
    patchState(partialPanicAlertState);
  }

  @Action(UpdatePanicAlertWithAccessControlError)
  public updatePanicAlertWithAccessControlError(
    { patchState }: StateContext<PanicAlertStateModel>,
    { panicAlertWithAccessControlError }: UpdatePanicAlertWithAccessControlError
  ) {
    const error = panicAlertWithAccessControlError === null ? true : false;
    patchState({ accessControlAPIError: error });
  }
}
