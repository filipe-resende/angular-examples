import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { UserAgreement } from '../../shared/models/UserAgreement';
import { UserAgreementDocument } from '../../shared/models/UserAgreementDocument';
import {
  UpdateCurrentAgreementDocument,
  UpdateUserAgreementAcceptance
} from './user-agreement.actions';

export interface UserAgreementStateModel {
  document: UserAgreementDocument;
  userAgreement: UserAgreement;
}

const INITIAL_STATE: UserAgreementStateModel = {
  document: undefined,
  userAgreement: undefined
};

@State<UserAgreementStateModel>({
  name: 'userAgreement',
  defaults: INITIAL_STATE
})
export class UserAgreementState {
  @Selector()
  public static document(
    state: UserAgreementStateModel
  ): UserAgreementDocument {
    return state.document;
  }

  @Selector()
  public static userAgreement(state: UserAgreementStateModel): UserAgreement {
    return state.userAgreement;
  }

  @Action(UpdateCurrentAgreementDocument)
  public updateCurrentAgreementDocument(
    { patchState }: StateContext<UserAgreementStateModel>,
    { userAgreementDocument }: UpdateCurrentAgreementDocument
  ) {
    patchState({ document: userAgreementDocument });
  }

  @Action(UpdateUserAgreementAcceptance)
  public updateUserAgreementAcceptance(
    { patchState }: StateContext<UserAgreementStateModel>,
    { userAgreement }: UpdateUserAgreementAcceptance
  ) {
    patchState({ userAgreement });
  }
}
