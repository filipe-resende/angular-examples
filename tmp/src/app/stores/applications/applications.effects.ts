import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ApplicationsRepository } from 'src/app/core/repositories/applications.repository';
import { LoggingService } from 'src/app/services/logging/logging.service';
import {
  CreateApplication,
  CreateApplicationSuccess,
  GetAllApplications,
  GetAllApplicationsSuccess,
  GetApplicationById,
  GetApplicationByIdSuccess,
  GetApplications,
  GetApplicationsSuccess,
  UpdateApplication,
  UpdateApplicationSuccess,
  UpdateErrorState,
} from './actions/applications-api.actions';
import { ApplicationsStateModel } from './applications.state';

@Injectable({ providedIn: 'root' })
@State({ name: 'applicationsEffects' })
export class ApplicationsEffectsService {
  constructor(
    public applicationsRepository: ApplicationsRepository,
    public loggingService: LoggingService,
  ) {}

  @Action(GetAllApplications)
  public getAllApplications({
    dispatch,
  }: StateContext<ApplicationsStateModel>): Observable<void | Observable<void>> {
    return this.applicationsRepository.getApplications().pipe(
      map(payload => dispatch(new GetAllApplicationsSuccess(payload))),
      catchError(error => dispatch(new UpdateErrorState(error))),
    );
  }

  @Action(GetApplications)
  public getApplications(
    { dispatch }: StateContext<ApplicationsStateModel>,
    { skip, count }: GetApplications,
  ): Observable<void | Observable<void>> {
    return this.applicationsRepository.getApplications(skip, 10).pipe(
      map(payload => dispatch(new GetApplicationsSuccess(payload))),
      catchError(error => dispatch(new UpdateErrorState(error))),
    );
  }

  @Action(GetApplicationById)
  public getApplicationById(
    { dispatch }: StateContext<ApplicationsStateModel>,
    { id }: GetApplicationById,
  ): Observable<void | Observable<void>> {
    return this.applicationsRepository.getApplicationById(id).pipe(
      mergeMap(payload => dispatch(new GetApplicationByIdSuccess(payload))),
      catchError(error => dispatch(new UpdateErrorState(error))),
    );
  }

  @Action(CreateApplication)
  public createApplication(
    { dispatch }: StateContext<ApplicationsStateModel>,
    { application }: CreateApplication,
  ): Observable<void | Observable<void>> {
    return this.applicationsRepository.create(application).pipe(
      mergeMap(payload => dispatch(new CreateApplicationSuccess(payload))),
      catchError(error => dispatch(new UpdateErrorState(error))),
    );
  }

  @Action(UpdateApplication)
  public updateApplication(
    { dispatch }: StateContext<ApplicationsStateModel>,
    { id, application }: UpdateApplication,
  ): Observable<void | Observable<void>> {
    return this.applicationsRepository.update(id, application).pipe(
      mergeMap(() => dispatch(new UpdateApplicationSuccess(application))),
      catchError(error => dispatch(new UpdateErrorState(error))),
    );
  }
}
