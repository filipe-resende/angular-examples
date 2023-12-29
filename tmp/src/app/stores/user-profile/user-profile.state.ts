import { Action, Selector, State, StateContext } from '@ngxs/store';
import { UserProfile } from '../../model/user-profile';
import { SetUserProfileState, UpdateAccessLog } from './user-profile.actions';

export class UserProfileStateModel {
  public user: UserProfile;

  public accessLog: boolean;
}

export const INITIAL_STATE: UserProfileStateModel = undefined;

@State({
  name: 'userProfile',
  defaults: INITIAL_STATE,
})
export class UserProfileState {
  @Selector()
  public static userProfile(state: UserProfileStateModel) {
    return state.user;
  }

  @Action(SetUserProfileState)
  public setUserProfile(
    { patchState }: StateContext<UserProfileStateModel>,
    { userProfile }: SetUserProfileState,
  ) {
    patchState({
      user: userProfile,
    });
  }

  @Action(UpdateAccessLog)
  public updateAccessLog(
    { patchState }: StateContext<UserProfileStateModel>,
    { accessLog }: UpdateAccessLog,
  ): void {
    patchState({ accessLog });
  }
}
