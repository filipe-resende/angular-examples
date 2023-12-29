import { Action, Selector, State, StateContext } from '@ngxs/store';
import { UpdateAccessLog } from './actions/user.actions';

const INITIAL_STATE = {
  accessLog: false,
};
export class UserStateModel {
  public accessLog: boolean;
}
@State<UserStateModel>({
  name: 'userState',
  defaults: INITIAL_STATE,
})
export class UserState {
  @Selector()
  public static accessLog(state: UserStateModel): boolean {
    return state.accessLog;
  }

  @Action(UpdateAccessLog)
  public updateAccessLog(
    { patchState }: StateContext<UserStateModel>,
    { accessLog }: UpdateAccessLog,
  ): void {
    patchState({ accessLog });
  }
}
