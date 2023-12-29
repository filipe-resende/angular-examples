import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import {
  UpdateAccessLog,
  UpdateAccount,
  UpdateRules,
} from './actions/user.actions';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  @Dispatch()
  public updateRules(admin: boolean): UpdateRules {
    return new UpdateRules(admin);
  }

  @Dispatch()
  public updateAccount(validatedAccount: boolean): UpdateAccount {
    return new UpdateAccount(validatedAccount);
  }

  @Dispatch()
  public updateAccessLog(accessLog: boolean) {
    return new UpdateAccessLog(accessLog);
  }
}
