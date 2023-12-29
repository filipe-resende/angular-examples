import { CachePanicAlert, PanicAlertStateModel } from "./panic-alert.state";

export class UpdatePanicAlerts {
  public static readonly type = "[PANICALERT] UpdatePanicAlerts";
  constructor(public panicAlerts: CachePanicAlert[]) {}
}

export class UpdatePanicState {
  public static readonly type = "[PANICALERT] UpdatePanicState";
  constructor(public partialPanicAlertState: Partial<PanicAlertStateModel>) {}
}

export class UpdatePanicAlertWithAccessControlError {
  public static readonly type = "[PANICALERT] UpdatePanicAlertSignalingAccessControlError";
  constructor(public panicAlertWithAccessControlError: boolean) {}
}
