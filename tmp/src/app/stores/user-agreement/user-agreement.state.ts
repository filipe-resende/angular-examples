import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { UserAgreementRepository } from 'src/app/core/repositories/user-agreement.repository';
import { catchError, tap, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UserAgreementDocument } from '../../model/user-agreement-document';
import { UserAgreement } from '../../model/user-agreement';
import {
  ResetAcceptance,
  GetCurrentUserAgreementDocument,
  UpdateUserAgreementAcceptance,
  GetLastUserAcceptance,
} from './user-agreement.actions';

export interface UserAgreementStateModel {
  document: UserAgreementDocument;
  userAgreement: UserAgreement;
  accepted: boolean;
}

const INITIAL_STATE: UserAgreementStateModel = {
  document: undefined,
  userAgreement: undefined,
  accepted: false,
};

type Context = StateContext<UserAgreementStateModel>;

@State<UserAgreementStateModel>({
  name: 'userAgreement',
  defaults: INITIAL_STATE,
})
@Injectable()
export class UserAgreementState {
  // #region selectors
  @Selector()
  public static document({
    document,
  }: UserAgreementStateModel): UserAgreementDocument {
    return document;
  }

  @Selector()
  public static userAgreement({
    userAgreement,
  }: UserAgreementStateModel): UserAgreement {
    return userAgreement;
  }

  @Selector()
  public static accepted({ accepted }: UserAgreementStateModel): boolean {
    return accepted;
  }
  // #endregion

  constructor(private userAgreementRepository: UserAgreementRepository) {}

  @Action(GetCurrentUserAgreementDocument)
  public getCurrentUserAgreementDocument({
    patchState,
  }: Context): Observable<UserAgreementDocument> {
    return this.userAgreementRepository.getCurrentAgreementDocument().pipe(
      take(1),
      tap(document => patchState({ document })),
    );
  }

  @Action(GetLastUserAcceptance)
  public getLastUserAcceptance(
    { patchState }: Context,
    { documentId, userId }: GetLastUserAcceptance,
  ) {
    return this.userAgreementRepository
      .getLastUserAcceptance(documentId, userId)
      .pipe(
        take(1),
        tap(userAgreement => patchState({ userAgreement })),
        catchError(() => of(patchState({ userAgreement: null }))),
      );
  }

  @Action(UpdateUserAgreementAcceptance)
  public updateUserAgreementAcceptance(
    { patchState }: Context,
    { documentId, userId }: UpdateUserAgreementAcceptance,
  ): Observable<UserAgreement | UserAgreementStateModel> {
    return this.userAgreementRepository
      .acceptUserAgreement(documentId, userId)
      .pipe(
        take(1),
        tap(userAgreement => patchState({ userAgreement, accepted: true })),
        catchError(() => of(patchState({ accepted: false }))),
      );
  }

  @Action(ResetAcceptance)
  public clearError({ patchState }: Context): void {
    patchState({ accepted: false });
  }
}
