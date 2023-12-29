import { UserAgreement } from '../../shared/models/UserAgreement';
import { UserAgreementDocument } from '../../shared/models/UserAgreementDocument';

export class UpdateCurrentAgreementDocument {
  public static readonly type = '[USERAGREEMENT] UpdateAgreementDocument';

  constructor(public userAgreementDocument: UserAgreementDocument) {}
}

export class UpdateUserAgreementAcceptance {
  public static readonly type = '[USERAGREEMENT] UpdateUserAgreementAcceptance';

  constructor(public userAgreement: UserAgreement) {}
}
