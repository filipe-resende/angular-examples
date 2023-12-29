import { Injectable } from '@angular/core';
import { Action, State, StateContext, Selector } from '@ngxs/store';

import { ApplicationItem } from 'src/app/model/applications-interfaces';
import { ApplicationsRepository } from 'src/app/core/repositories/applications.repository';
import { Paginator } from 'src/app/model/paginator';

import _ from 'lodash';

import {
  ClearNewApplication,
  FilterApplicationById,
  UpdatePaginator,
} from './actions/applications-page.actions';
import {
  GetAllApplicationsSuccess,
  GetApplicationsSuccess,
  GetApplicationByIdSuccess,
  CreateApplicationSuccess,
  UpdateApplicationSuccess,
  UpdateErrorState,
} from './actions/applications-api.actions';

export class ApplicationsStateModel {
  public allApplications: ApplicationItem[];

  public applicationsList: ApplicationItem[];

  public totalCount: number;

  public selectedApplication: ApplicationItem;

  public paginator: Paginator;

  public errorMsg: string;

  public error: Error;

  public applicationElement: ApplicationItem;
}

const initialState: ApplicationsStateModel = {
  allApplications: [],
  applicationsList: [],
  totalCount: null,
  selectedApplication: null,

  paginator: {
    skip: 0,
    currentPage: 1,
  },

  errorMsg: null,
  error: null,
  applicationElement: null,
};
@Injectable()
@State<ApplicationsStateModel>({
  name: 'applicationsState',
  defaults: initialState,
})
export class ApplicationsState {
  @Selector()
  public static allApplications(
    state: ApplicationsStateModel,
  ): ApplicationItem[] {
    return state.allApplications;
  }

  @Selector()
  public static applications(state: ApplicationsStateModel): ApplicationItem[] {
    return state.applicationsList;
  }

  @Selector()
  public static totalCount(state: ApplicationsStateModel): number {
    return state.totalCount;
  }

  @Selector()
  public static errorMsg(state: ApplicationsStateModel): string {
    return state.errorMsg;
  }

  @Selector()
  public static paginator(state: ApplicationsStateModel): Paginator {
    return state.paginator;
  }

  @Selector()
  public static applicationElement(
    state: ApplicationsStateModel,
  ): ApplicationItem {
    return state.applicationElement;
  }

  @Selector()
  public static selectedApplication(
    state: ApplicationsStateModel,
  ): ApplicationItem {
    return state.selectedApplication;
  }

  @Selector()
  public static error(state: ApplicationsStateModel): Error {
    return state.error;
  }

  constructor(public applicationsRepository: ApplicationsRepository) {}

  @Action(GetAllApplicationsSuccess)
  public getAllApplicationsSuccess(
    { patchState }: StateContext<ApplicationsStateModel>,
    { applicationsPayload }: GetApplicationsSuccess,
  ): void {
    const { applications, totalCount } = applicationsPayload;

    patchState({
      allApplications: applications,
      totalCount,
      errorMsg: null,
    });
  }

  @Action(GetApplicationsSuccess)
  public getApplicationsSuccess(
    { patchState }: StateContext<ApplicationsStateModel>,
    { applicationsPayload }: GetApplicationsSuccess,
  ): void {
    const { applications: applicationsList, totalCount } = applicationsPayload;
    patchState({ errorMsg: null, applicationsList, totalCount });
  }

  @Action(GetApplicationByIdSuccess)
  public getApplicationByIdSuccess(
    { patchState }: StateContext<ApplicationsStateModel>,
    { application }: GetApplicationByIdSuccess,
  ): void {
    patchState({
      selectedApplication: application,
      errorMsg: null,
    });
  }

  @Action(CreateApplicationSuccess)
  public createApplicationSuccess(
    { getState, patchState }: StateContext<ApplicationsStateModel>,
    { application }: CreateApplicationSuccess,
  ): void {
    const { allApplications } = getState();
    const allApplicationsUpdated = [...allApplications, application];

    // TODO: retornado no selector
    const allApplicationsOrdered = _.orderBy(
      allApplicationsUpdated,
      [({ name }: ApplicationItem) => name.toLowerCase()],
      ['asc'],
    );

    patchState({
      allApplications: allApplicationsOrdered,
      errorMsg: null,
      applicationElement: application,
    });
  }

  @Action(UpdateApplicationSuccess)
  public updateApplicationSuccess(
    { patchState, getState }: StateContext<ApplicationsStateModel>,
    { updatedApplication }: UpdateApplicationSuccess,
  ): void {
    const { applicationsList, allApplications } = getState();

    const newAllApplicationList = allApplications.map(application => {
      return updatedApplication.id === application.id
        ? updatedApplication
        : application;
    });

    const newApplicationsList = applicationsList.map(application => {
      return updatedApplication.id === application.id
        ? updatedApplication
        : application;
    });

    patchState({
      applicationsList: newApplicationsList,
      allApplications: newAllApplicationList,
      applicationElement: updatedApplication,
      selectedApplication: updatedApplication,
      errorMsg: null,
    });
  }

  @Action(UpdateErrorState)
  public updateErrorState(
    { patchState }: StateContext<ApplicationsStateModel>,
    { error }: UpdateErrorState,
  ): void {
    patchState({ error });
  }

  // eventos de pagina não tem nada a ver com effects
  @Action(FilterApplicationById)
  public filterApplicationById(
    { patchState, getState }: StateContext<ApplicationsStateModel>,
    { applicationId }: FilterApplicationById,
  ): void {
    const state = getState();

    const application = state.allApplications.find(
      ({ id }) => id === applicationId,
    );

    if (application) {
      patchState({ applicationsList: [application], errorMsg: null });
    }
  }

  @Action(UpdatePaginator)
  public updatePaginator(
    { patchState }: StateContext<ApplicationsStateModel>,
    { paginator }: UpdatePaginator,
  ): void {
    patchState({ paginator });
  }

  @Action(ClearNewApplication)
  public clearNewApplication({
    patchState,
  }: StateContext<ApplicationsStateModel>): void {
    patchState({ applicationElement: null, errorMsg: null });
  }
}
