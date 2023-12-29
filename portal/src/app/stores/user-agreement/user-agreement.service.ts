import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UserAgreementRepository } from '../../core/repositories/user-agreement.repository';
import { UserAgreement } from '../../shared/models/UserAgreement';
import { UserAgreementDocument } from '../../shared/models/UserAgreementDocument';
import { UserProfileService } from '../user-profile/user-profile.service';
import {
  UpdateCurrentAgreementDocument,
  UpdateUserAgreementAcceptance,
} from './user-agreement.actions';
import {
  UserAgreementState,
  UserAgreementStateModel,
} from './user-agreement.state';

@Injectable({
  providedIn: 'root',
})
export class UserAgreementService {
  @Select(UserAgreementState.document)
  public document$: Observable<UserAgreementDocument>;

  @Select(UserAgreementState.userAgreement)
  public userAgreement$: Observable<UserAgreement>;

  constructor(
    private userAgreementRepository: UserAgreementRepository,
    private userProfileService: UserProfileService,
    private store: Store,
  ) {}

  @Dispatch()
  public updateUserAcceptance(userAgreement: UserAgreement) {
    return new UpdateUserAgreementAcceptance(userAgreement);
  }

  @Dispatch()
  public async updateCurrentAgreementDocument(): Promise<UpdateCurrentAgreementDocument> {
    const userAgreementDocument = await this.userAgreementRepository
      .getCurrentAgreementDocument()
      .toPromise();

    return new UpdateCurrentAgreementDocument(userAgreementDocument);
  }

  public async updateLastUserAcceptance(): Promise<void> {
    const {
      email
    } = this.userProfileService.getUserProfile();

    const { id: documentId } = this.getDocument();

    let userAgreement;

    try {
      userAgreement = await this.userAgreementRepository
        .getLastUserAcceptance(documentId, email)
        .toPromise();
    } catch {
      userAgreement = null;
    }

    this.updateUserAcceptance(userAgreement);
  }

  public getStore() {
    return this.store.snapshot().userAgreement as UserAgreementStateModel;
  }

  public async acceptUserAgreement(
    documentId: string,
    userId: string,
  ): Promise<void> {
    const userAgreement = await this.userAgreementRepository
      .acceptUserAgreement(documentId, userId)
      .toPromise();

    this.updateUserAcceptance(userAgreement);
  }

  private getDocument(): UserAgreementDocument {
    const { document } = this.getStore();

    return document;
  }
}
