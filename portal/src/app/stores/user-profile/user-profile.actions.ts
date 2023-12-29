import { UserProfile } from "../../shared/models/user-profile";


export class SetUserProfileState {
    public static readonly type = '[USER_PROFILE] SetUserProfileState';
    constructor(public userProfile: Partial<UserProfile>) { }
}

export class ClearUserStore {
  public static readonly type = '[USER_PROFILE] ClearUserStore';
}

export class UpdateAccessLog {
  public static readonly type = '[USER_PROFILE] UpdateAccessLog';

  constructor(public accessLog: boolean) {}
}
