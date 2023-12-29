import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UserAgreement } from 'src/app/model/user-agreement';
import { UserAgreementDocument } from 'src/app/model/user-agreement-document';
import {
  GetCurrentUserAgreementDocument,
  GetLastUserAcceptance,
  ResetAcceptance,
  UpdateUserAgreementAcceptance,
} from './user-agreement.actions';
import { UserAgreementState } from './user-agreement.state';
import { UserProfileService } from '../user-profile/user-profile.service';

@Injectable({
  providedIn: 'root',
})
export class UserAgreementService {
  @Select(UserAgreementState.document)
  public document$: Observable<UserAgreementDocument>;

  @Select(UserAgreementState.userAgreement)
  public userAgreement$: Observable<UserAgreement>;

  @Select(UserAgreementState.accepted)
  public accepted$: Observable<boolean>;

  constructor(private userProfileService: UserProfileService) {}

  @Dispatch()
  public getCurrentUserAgreementDocument() {
    return new GetCurrentUserAgreementDocument();
  }

  @Dispatch()
  public updateUserAgreementAcceptance(documentId: string) {
    return new UpdateUserAgreementAcceptance(
      documentId,
      this.userProfileService.getUserInfo().cn,
    );
  }

  @Dispatch()
  public getLastUserAcceptance(documentId: string) {
    return new GetLastUserAcceptance(
      documentId,
      this.userProfileService.getUserInfo().cn,
    );
  }

  @Dispatch()
  public resetAcceptance(): ResetAcceptance {
    return new ResetAcceptance();
  }
}
