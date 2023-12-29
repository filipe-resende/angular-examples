import { Action, State, StateContext, Selector } from '@ngxs/store';
import { Perimeter } from '../../shared/models/perimeter';
import {
  UpdatePerimetersState,
  ClearPerimetersStore,
  UpdatePerimetersPageModel,
  UpdatePerimeterClickability,
} from './perimeters.actions';
import { OfficialPerimeter } from '../../shared/models/officialPerimeter';

const INITIAL_STATE = {
  perimeters: [],
  perimetersPageModel: {
    isFetchingPerimeters: false,
    perimetersForMap: [],
    editingPerimeter: null,
    perimetersForMapBackupForEdition: [],
    perimetersFromApi: [],
    drawedPerimeterPolygonMarkers: [],
    drawedPerimeterPolygonValidated: false,
  },
  isClickable: false,
};

export interface PerimeterPolygonCreationMarkerModel {
  lat: number;
  lng: number;
  label: string;
  labelIndex: number; // index converte em label. 0 -> A, 1 -> B
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  googleMapsMarkerRef: any;
}

export class PerimetersPageModel {
  public isFetchingPerimeters: boolean;

  public perimetersForMap: Perimeter[];

  public editingPerimeter: Perimeter;

  public perimetersForMapBackupForEdition: Perimeter[];

  public perimetersFromApi: OfficialPerimeter[];

  public drawedPerimeterPolygonMarkers: PerimeterPolygonCreationMarkerModel[];

  public drawedPerimeterPolygonValidated: boolean;
}

export class PerimetersStateModel {
  public perimeters: Perimeter[];

  public perimetersPageModel: PerimetersPageModel;

  public isClickable: boolean;
}

@State<PerimetersStateModel>({
  name: 'perimeters',
  defaults: INITIAL_STATE,
})
export class PerimetersState {
  @Selector()
  public static perimeters(state: PerimetersStateModel): Perimeter[] {
    return state.perimeters;
  }

  @Selector()
  public static perimetersPageModel(
    state: PerimetersStateModel,
  ): PerimetersPageModel {
    return state.perimetersPageModel;
  }

  @Selector()
  public static isFetchingPerimetersInPerimeterPageModel(
    state: PerimetersStateModel,
  ): boolean {
    return state.perimetersPageModel.isFetchingPerimeters;
  }

  @Selector()
  public static perimetersForMap(state: PerimetersStateModel): Perimeter[] {
    return state.perimetersPageModel.perimetersForMap;
  }

  @Selector()
  public static perimetersFromApi(
    state: PerimetersStateModel,
  ): OfficialPerimeter[] {
    return state.perimetersPageModel.perimetersFromApi;
  }

  @Selector()
  public static newPerimeterPolygonValidated(
    state: PerimetersStateModel,
  ): boolean {
    return state.perimetersPageModel.drawedPerimeterPolygonValidated;
  }

  @Selector()
  public static isClickable({ isClickable }: PerimetersStateModel): boolean {
    return isClickable;
  }

  @Action(ClearPerimetersStore)
  public clearPerimetersStore({
    setState,
  }: StateContext<PerimetersStateModel>): void {
    setState(INITIAL_STATE);
  }

  @Action(UpdatePerimetersState)
  public updatePerimetersState(
    { patchState }: StateContext<PerimetersStateModel>,
    { partialPerimetersStateModel }: UpdatePerimetersState,
  ): void {
    patchState(partialPerimetersStateModel);
  }

  @Action(UpdatePerimetersPageModel)
  public updatePerimetersPageModel(
    { patchState, getState }: StateContext<PerimetersStateModel>,
    { partialPerimetersPageModel }: UpdatePerimetersPageModel,
  ): void {
    const { perimetersPageModel } = getState();
    const newPerimetersPageModel = {
      ...perimetersPageModel,
      ...partialPerimetersPageModel,
    };

    patchState({ perimetersPageModel: newPerimetersPageModel });
  }

  @Action(UpdatePerimeterClickability)
  public updatePerimeterClickability(
    { patchState }: StateContext<PerimetersStateModel>,
    { isClickable }: UpdatePerimeterClickability,
  ): void {
    patchState({ isClickable });
  }
}
