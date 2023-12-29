import { PoisStateModel } from "./pois.state";

export class UpdatePoisState {
  public static readonly type = "[POIS] UpdatePoisState";
  constructor(public partialPoisStateModel: Partial<PoisStateModel>) {}
}

export class ClearPoisStore {
  public static readonly type = "[POIS] ClearPoisStore";
}
