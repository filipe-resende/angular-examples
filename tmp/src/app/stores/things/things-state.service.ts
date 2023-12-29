import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ThingItem as Thing, ThingItem } from 'src/app/model/things-interfaces';
import { Paginator } from 'src/app/model/paginator';
import {
  GetAllThings,
  GetThingById,
  GetThings,
  CreateThing,
  UpdateThing,
  GetThingByName,
  SelectThingByName,
  GetThingBySourceInfo,
  UpdateErrorState,
} from './actions/things-api.actions';

import {
  UpdatePaginator,
  ClearNewThing,
  ClearThingsPreviewList,
  UpdateNameFilter,
} from './actions/things-page.actions';
import { ThingsState, ThingsStateModel } from './things.state';
import { AppState } from '../app-state.interface';

@Injectable({
  providedIn: 'root',
})
export class ThingStateService {
  @Select(ThingsState.allThings)
  public allThings$: Observable<Thing[]>;

  @Select(ThingsState.things)
  public things$: Observable<Thing[]>;

  @Select(ThingsState.totalCount)
  public totalCount$: Observable<number>;

  @Select(ThingsState.error)
  public error$: Observable<Error>;

  @Select(ThingsState.paginator)
  public paginator$: Observable<Paginator>;

  @Select(ThingsState.thingElement)
  public thingElement$: Observable<Thing>;

  @Select(ThingsState.errorMsg)
  public errorMessage$: Observable<string>;

  @Select(ThingsState.selectedThing)
  public selectedThing$: Observable<Thing>;

  @Select(ThingsState.selectedThingByName)
  public selectedThingByName$: Observable<Thing[]>;

  @Select(ThingsState.thingsPreviewList)
  public thingsPreviewList$: Observable<ThingItem[]>;

  @Select(ThingsState.byNameFilter)
  public byNameFilter$: Observable<string>;

  constructor(private store: Store) {}

  @Dispatch()
  public getThingById(id: string): GetThingById {
    return new GetThingById(id);
  }

  @Dispatch()
  public updatePaginator(paginator: Paginator): UpdatePaginator {
    return new UpdatePaginator(paginator);
  }

  @Dispatch()
  public addThingToThingList(thing: Thing): CreateThing {
    return new CreateThing(thing);
  }

  @Dispatch()
  public clearNewThing(): ClearNewThing {
    return new ClearNewThing();
  }

  @Dispatch()
  public onGetThingByName(
    name: string,
    skip?: number,
    count?: number,
  ): GetThingByName {
    return new GetThingByName(name, skip, count);
  }

  @Dispatch()
  public onSelectThingByName(
    name: string,
    skip?: number,
    count?: number,
  ): SelectThingByName {
    return new SelectThingByName(name, skip, count);
  }

  @Dispatch()
  public onClearThingsPreviewList(): ClearThingsPreviewList {
    return new ClearThingsPreviewList();
  }

  @Dispatch()
  public updateNameFilter(name: string): UpdateNameFilter {
    return new UpdateNameFilter(name);
  }

  @Dispatch()
  private updateAllThingsList(): GetAllThings {
    return new GetAllThings();
  }

  @Dispatch()
  private updateThingsList(skip: number, count?: number): GetThings {
    return new GetThings(skip, count);
  }

  @Dispatch()
  private updateThing(id: string, thing: Thing) {
    return new UpdateThing(id, thing);
  }

  @Dispatch()
  private updateSelectedThing(id: string, thing: Thing) {
    return new UpdateThing(id, thing);
  }

  @Dispatch()
  public onGetThingBySourceInfo(
    type: string,
    value: string,
  ): GetThingBySourceInfo {
    return new GetThingBySourceInfo(type, value);
  }

  @Dispatch()
  public onClearError(): UpdateErrorState {
    return new UpdateErrorState(null);
  }

  public onPaginate(paginator: Paginator): void {
    this.updateThingsList(paginator.skip, 10);
    this.updatePaginator(paginator);
  }

  public getAllThings(): void {
    const { allThings } = this.getState();

    if (allThings.length <= 1) {
      this.updateAllThingsList();
    }
  }

  public getThings(skip: number, count?: number): void {
    const { thingsList } = this.getState();

    if (!thingsList.length) {
      this.updateThingsList(skip, count);
    }
  }

  public onCreateThing(thingBody: Thing): void {
    this.addThingToThingList(thingBody);
  }

  public onClearNewThingState(): void {
    this.clearNewThing();
  }

  public onUpdateThing(id: string, thing: Thing): void {
    this.updateThing(id, thing);
  }

  public onUpdateSelectedThing(id: string, thing: Thing): void {
    this.updateSelectedThing(id, thing);
  }

  private getState(): ThingsStateModel {
    const { thingsState } = this.store.snapshot() as AppState;
    return thingsState;
  }
}
