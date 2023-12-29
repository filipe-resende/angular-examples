import { Injectable } from '@angular/core';
import { Action, State, StateContext, Selector, Store } from '@ngxs/store';

import { ThingItem } from 'src/app/model/things-interfaces';
import { ThingsRepository } from 'src/app/core/repositories/things.repository';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { Paginator } from 'src/app/model/paginator';
import _ from 'lodash';

import {
  ClearNewThing,
  ClearThingsPreviewList,
  UpdatePaginator,
  UpdateNameFilter,
} from './actions/things-page.actions';
import {
  GetAllThingsSuccess,
  GetThingByNameSuccess,
  GetThingsSuccess,
  GetThingByIdSuccess,
  CreateThingSuccess,
  UpdateErrorState,
  UpdateThingSuccess,
  SelectThingByNameSuccess,
  GetThingBySourceInfoSuccess,
} from './actions/things-api.actions';

export class ThingsStateModel {
  public allThings: ThingItem[];

  public thingsList: ThingItem[];

  public totalCount: number;

  public selectedThing: ThingItem;

  public paginator: Paginator;

  public errorMsg: string;

  public error: Error;

  public thingElement: ThingItem;

  public selectedThingByName: ThingItem;

  public thingsPreviewList: ThingItem[];

  public byNameFilter: string;
}

const INITIAL_STATE: ThingsStateModel = {
  allThings: [],
  thingsList: [],
  totalCount: null,
  selectedThing: null,
  paginator: {
    skip: 0,
    currentPage: 1,
  },
  errorMsg: null,
  error: null,
  thingElement: null,
  selectedThingByName: null,
  thingsPreviewList: [],
  byNameFilter: '',
};
@Injectable()
@State<ThingsStateModel>({
  name: 'thingsState',
  defaults: INITIAL_STATE,
})
export class ThingsState {
  // #region Selectors
  @Selector()
  public static allThings(state: ThingsStateModel): ThingItem[] {
    return state.allThings;
  }

  @Selector()
  public static things(state: ThingsStateModel): ThingItem[] {
    return state.thingsList;
  }

  @Selector()
  public static totalCount(state: ThingsStateModel): number {
    return state.totalCount;
  }

  @Selector()
  public static errorMsg(state: ThingsStateModel): string {
    return state.errorMsg;
  }

  @Selector()
  public static paginator(state: ThingsStateModel): Paginator {
    return state.paginator;
  }

  @Selector()
  public static thingElement(state: ThingsStateModel): ThingItem {
    return state.thingElement;
  }

  @Selector()
  public static selectedThing(state: Partial<ThingsStateModel>): ThingItem {
    return state.selectedThing;
  }

  @Selector()
  public static selectedThingByName(
    state: Partial<ThingsStateModel>,
  ): ThingItem {
    return state.selectedThingByName;
  }

  @Selector()
  public static error(state: Partial<ThingsStateModel>): Error {
    return state.error;
  }

  @Selector()
  public static thingsPreviewList(state: ThingsStateModel): ThingItem[] {
    return state.thingsPreviewList;
  }

  @Selector()
  public static byNameFilter(state: ThingsStateModel): string {
    return state.byNameFilter;
  }
  // #endregion

  constructor(
    public thingsRepository: ThingsRepository,
    public store: Store,
    public loggingService: LoggingService,
  ) {}

  @Action(GetAllThingsSuccess)
  public getAllThingsSuccess(
    { patchState }: StateContext<ThingsStateModel>,
    { thingsPayload }: GetThingsSuccess,
  ): void {
    const { things, totalCount } = thingsPayload;

    patchState({ allThings: things, totalCount, errorMsg: null });
  }

  @Action(GetThingsSuccess)
  public getThingsSuccess(
    { patchState }: StateContext<ThingsStateModel>,
    { thingsPayload }: GetThingsSuccess,
  ): void {
    const { things: thingsList, totalCount } = thingsPayload;

    patchState({ errorMsg: null, thingsList, totalCount });
  }

  @Action(GetThingByIdSuccess)
  public getThingByIdSuccess(
    { patchState }: StateContext<ThingsStateModel>,
    { thing }: GetThingByIdSuccess,
  ): void {
    patchState({ errorMsg: null, selectedThing: thing });
  }

  @Action(CreateThingSuccess)
  public createThingSuccess(
    { getState, patchState }: StateContext<ThingsStateModel>,
    { thing }: CreateThingSuccess,
  ): void {
    const { allThings } = getState();
    const allThingsUpdated = [...allThings, thing];

    const allThingsOrdered = _.orderBy(
      allThingsUpdated,
      [(app: ThingItem) => app.name.toLowerCase()],
      ['asc'],
    );

    patchState({
      allThings: allThingsOrdered,
      errorMsg: null,
      thingElement: thing,
    });
  }

  @Action(UpdateThingSuccess)
  public updateThingSuccess(
    { patchState, getState }: StateContext<ThingsStateModel>,
    { updatedThing }: UpdateThingSuccess,
  ): void {
    const { thingsList, allThings } = getState();

    const newAllThingList = allThings.map(thing => {
      return updatedThing.id === thing.id ? updatedThing : thing;
    });

    const newThingsList = thingsList.map(thingElement => {
      return updatedThing.id === thingElement.id ? updatedThing : thingElement;
    });

    patchState({
      thingsList: newThingsList,
      allThings: newAllThingList,
      thingElement: updatedThing,
      selectedThing: updatedThing,
      errorMsg: null,
    });
  }

  @Action(UpdateErrorState)
  public updateErrorState(
    { patchState }: StateContext<ThingsStateModel>,
    { error }: UpdateErrorState,
  ): void {
    patchState({ error });
  }

  @Action(GetThingByNameSuccess)
  public filterThingByName(
    { patchState }: StateContext<ThingsStateModel>,
    { things }: GetThingByNameSuccess,
  ): void {
    patchState({ thingsPreviewList: things, errorMsg: null });
  }

  @Action(SelectThingByNameSuccess)
  public selectThingByNameSuccess(
    { patchState }: StateContext<ThingsStateModel>,
    { thing, totalCount }: SelectThingByNameSuccess,
  ): void {
    patchState({ thingsList: thing, error: null, totalCount });
  }

  @Action(GetThingBySourceInfoSuccess)
  public getThingBySourceInfoSuccess(
    { patchState }: StateContext<ThingsStateModel>,
    { thing }: GetThingBySourceInfoSuccess,
  ): void {
    patchState({ thingsList: [thing], error: null });
  }

  // ------- PAGE ACTIONS ------- //
  @Action(UpdatePaginator)
  public updatePaginator(
    { patchState }: StateContext<ThingsStateModel>,
    { paginator }: UpdatePaginator,
  ): void {
    patchState({ paginator });
  }

  @Action(ClearNewThing)
  public clearNewThing({ patchState }: StateContext<ThingsStateModel>): void {
    patchState({ thingElement: null, errorMsg: null });
  }

  @Action(ClearThingsPreviewList)
  public clearThingsPreviewList({
    patchState,
  }: StateContext<ThingsStateModel>): void {
    const { thingsPreviewList, error, errorMsg } = INITIAL_STATE;
    patchState({ thingsPreviewList, error, errorMsg });
  }

  @Action(UpdateNameFilter)
  public updateNameFilter(
    { patchState }: StateContext<ThingsStateModel>,
    { name }: UpdateNameFilter,
  ): void {
    patchState({ byNameFilter: name });
  }
}
