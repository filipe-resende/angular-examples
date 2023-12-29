export class UpdateRules {
  public static readonly type = '[USER] Update Rules by User';

  constructor(public admin: boolean) {}
}

export class UpdateAccount {
  public static readonly type = '[USER] Update Validated Account by User';

  constructor(public validatedAccount: boolean) {}
}

export class UpdateAccessLog {
  public static readonly type = '[USER] Update Access Log';

  constructor(public accessLog: boolean) {}
}
