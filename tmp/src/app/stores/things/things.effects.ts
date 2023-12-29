import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ThingsListResponse, ThingItem } from '../../model/things-interfaces';
import { ThingsRepository } from '../../core/repositories/things.repository';
import { LoggingService } from '../../services/logging/logging.service';

import {
  CreateThing,
  CreateThingSuccess,
  GetAllThings,
  GetAllThingsSuccess,
  GetThingById,
  GetThingByIdSuccess,
  GetThingByName,
  GetThingByNameSuccess,
  GetThings,
  GetThingsSuccess,
  UpdateThing,
  UpdateThingSuccess,
  UpdateErrorState,
  SelectThingByName,
  SelectThingByNameSuccess,
  GetThingBySourceInfo,
  GetThingBySourceInfoSuccess,
} from './actions/things-api.actions';
import { ThingsStateModel } from './things.state';

@Injectable({ providedIn: 'root' })
@State({
  name: 'thingsEffects',
})
export class ThingsEffectService {
  constructor(
    public thingsRepository: ThingsRepository,
    public store: Store,
    public loggingService: LoggingService,
  ) {}

  @Action(GetAllThings)
  public getAllThings({
    dispatch,
  }: StateContext<ThingsStateModel>): Observable<void | Observable<void>> {
    return this.thingsRepository.getThings().pipe(
      map(payload => dispatch(new GetAllThingsSuccess(payload))),
      catchError(error => dispatch(new UpdateErrorState(error))),
    );
  }

  @Action(GetThings)
  public getThings(
    { dispatch }: StateContext<ThingsStateModel>,
    { skip }: GetThings,
  ): Observable<void | Observable<void>> {
    return this.thingsRepository.getThings(skip, 10).pipe(
      map(payload => dispatch(new GetThingsSuccess(payload))),
      catchError(error => dispatch(new UpdateErrorState(error))),
    );
  }

  @Action(GetThingById)
  public getThingById(
    { dispatch }: StateContext<ThingsStateModel>,
    { id }: GetThingById,
  ): Observable<void> {
    return this.thingsRepository.getThingId(id).pipe(
      mergeMap(thingPayload => dispatch(new GetThingByIdSuccess(thingPayload))),
      catchError(error => dispatch(new UpdateErrorState(error))),
    );
  }

  @Action(GetThingByName, { cancelUncompleted: true })
  public getThingByName(
    { dispatch }: StateContext<ThingsListResponse>,
    { name, skip, count }: GetThingByName,
  ): Observable<void> {
    return this.thingsRepository.getThingByName(name, skip, count).pipe(
      mergeMap(({ things }) => dispatch(new GetThingByNameSuccess(things))),
      catchError(error => dispatch(new UpdateErrorState(error))),
    );
  }

  @Action(SelectThingByName, { cancelUncompleted: true })
  public selectThingByName(
    { dispatch }: StateContext<ThingsListResponse>,
    { name, skip, count }: SelectThingByName,
  ): Observable<void> {
    return this.thingsRepository.getThingByName(name, skip, count).pipe(
      mergeMap(({ things, totalCount }) =>
        dispatch(new SelectThingByNameSuccess(things, totalCount)),
      ),
      catchError(error => dispatch(new UpdateErrorState(error))),
    );
  }

  @Action(CreateThing)
  public createThing(
    { dispatch }: StateContext<ThingsStateModel>,
    { thing }: CreateThing,
  ): Observable<ThingItem> {
    return this.thingsRepository.createThing(thing).pipe(
      mergeMap(payload => dispatch(new CreateThingSuccess(payload))),
      catchError(error => this.store.dispatch(new UpdateErrorState(error))),
    );
  }

  @Action(UpdateThing)
  public updateThing(
    { dispatch }: StateContext<ThingsStateModel>,
    { id, thing }: UpdateThing,
  ): Observable<void> {
    return this.thingsRepository.update(id, thing).pipe(
      mergeMap(() => dispatch(new UpdateThingSuccess(thing))),
      catchError(error => dispatch(new UpdateErrorState(error))),
    );
  }

  @Action(GetThingBySourceInfo)
  public getThingBySourceInfo(
    { dispatch }: StateContext<ThingsStateModel>,
    { type, value }: GetThingBySourceInfo,
  ): Observable<void> {
    return this.thingsRepository.getBySourceInfo(type, value).pipe(
      mergeMap(thing => dispatch(new GetThingBySourceInfoSuccess(thing))),
      catchError(error => dispatch(new UpdateErrorState(error))),
    );
  }
}
