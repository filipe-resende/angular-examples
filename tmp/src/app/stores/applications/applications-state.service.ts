import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  ApplicationItem as Application,
  ApplicationRequest,
} from 'src/app/model/applications-interfaces';
import { Paginator } from 'src/app/model/paginator';
import {
  GetAllApplications,
  GetApplicationById,
  GetApplications,
  CreateApplication,
  UpdateApplication,
} from './actions/applications-api.actions';

import {
  UpdatePaginator,
  ClearNewApplication,
  FilterApplicationById,
} from './actions/applications-page.actions';
import {
  ApplicationsState,
  ApplicationsStateModel,
} from './applications.state';
import { AppState } from '../app-state.interface';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsStateService {
  @Select(ApplicationsState.allApplications)
  public allApplications$: Observable<Application[]>;

  @Select(ApplicationsState.applications)
  public applications$: Observable<Application[]>;

  @Select(ApplicationsState.totalCount)
  public totalCount$: Observable<number>;

  @Select(ApplicationsState.errorMsg)
  public errorMessage$: Observable<string>;

  @Select(ApplicationsState.error)
  public error$: Observable<Error>;

  @Select(ApplicationsState.paginator)
  public paginator$: Observable<Paginator>;

  @Select(ApplicationsState.applicationElement)
  public applicationElement$: Observable<Application>;

  @Select(ApplicationsState.selectedApplication)
  public selectedApplication$: Observable<Application>;

  constructor(private store: Store) {}

  @Dispatch()
  public getApplicationById(id: string): GetApplicationById {
    return new GetApplicationById(id);
  }

  @Dispatch()
  public updatePaginator(paginator: Paginator): UpdatePaginator {
    return new UpdatePaginator(paginator);
  }

  @Dispatch()
  public addApplicationToApplicationList(
    application: Application,
  ): CreateApplication {
    return new CreateApplication(application);
  }

  @Dispatch()
  public clearNewApplication(): ClearNewApplication {
    return new ClearNewApplication();
  }

  @Dispatch()
  public onFilterApplicationsById(id: string): FilterApplicationById {
    return new FilterApplicationById(id);
  }

  @Dispatch()
  public updateAllApplicationsList(): GetAllApplications {
    return new GetAllApplications();
  }

  @Dispatch()
  private updateApplicationsList(
    skip: number,
    count?: number,
  ): GetApplications {
    return new GetApplications(skip, count);
  }

  @Dispatch()
  private updateSelectedApplication(
    id: string,
    application: ApplicationRequest,
  ) {
    return new UpdateApplication(id, application);
  }

  public onPaginate(paginator: Paginator): void {
    this.updateApplicationsList(paginator.skip, 10);
    this.updatePaginator(paginator);
  }

  public getAllApplications(): void {
    const { allApplications } = this.getState();

    if (allApplications.length <= 1) {
      this.updateAllApplicationsList();
    }
  }

  public getApplications(skip: number, count?: number): void {
    const { applicationsList } = this.getState();

    if (!applicationsList.length) {
      this.updateApplicationsList(skip, count);
    }
  }

  public onCreateApplication(applicationBody: Application): void {
    this.addApplicationToApplicationList(applicationBody);
  }

  public onClearNewApplicationState(): void {
    this.clearNewApplication();
  }

  public onUpdateSelectedApplication(
    id: string,
    application: ApplicationRequest,
  ): void {
    this.updateSelectedApplication(id, application);
  }

  public getState(): ApplicationsStateModel {
    const { applicationsState } = this.store.snapshot() as AppState;
    return applicationsState;
  }
}
