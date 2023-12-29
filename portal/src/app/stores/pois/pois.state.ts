import { Action, State, StateContext, Selector } from "@ngxs/store";
import { Geofence } from "../../shared/models/geofence";
import { UpdatePoisState, ClearPoisStore } from "./pois.actions";
import { PointOfInterest } from "../../shared/models/poi";
import { PoiCategory } from "../../shared/models/poi-category";

const INITIAL_STATE = {
  pois: [],
  poisCategories: [],
};

export class PoisStateModel {
  public pois: PointOfInterest[];
  public poisCategories: PoiCategory[];
}

@State<PoisStateModel>({
  name: "pois",
  defaults: INITIAL_STATE,
})
export class PoisState {
  @Selector()
  public static pois(state: PoisStateModel): PointOfInterest[] {
    return state.pois;
  }

  @Selector()
  public static categories(state: PoisStateModel): PoiCategory[] {
    return state.poisCategories;
  }

  @Action(UpdatePoisState)
  public updatePoisState(
    { patchState }: StateContext<PoisStateModel>,
    { partialPoisStateModel }: UpdatePoisState
  ) {
    patchState(partialPoisStateModel);
  }

  @Action(ClearPoisStore)
  public clearPoisStore({ setState }: StateContext<PoisStateModel>) {
    setState(INITIAL_STATE);
  }
}
