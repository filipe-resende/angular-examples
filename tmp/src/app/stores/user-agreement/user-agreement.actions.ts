import { UserAgreement } from '../../model/user-agreement';

export class GetCurrentUserAgreementDocument {
  public static readonly type =
    '[USERAGREEMENT] GetCurrentUserAgreementDocument';

  constructor(public platformName?: string) {}
}

export class GetLastUserAcceptance {
  public static readonly type = '[USERAGREEMENT] GetLastUserAcceptance';

  constructor(public documentId: string, public userId: string) {}
}

export class UpdateUserAgreementAcceptance {
  public static readonly type = '[USERAGREEMENT] UpdateUserAgreementAcceptance';

  constructor(public documentId: string, public userId: string) {}
}
export class ResetAcceptance {
  public static readonly type = '[USERAGREEMENT] ResetAcceptance';
}
