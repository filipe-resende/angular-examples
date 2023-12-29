import { ApplicationsStateModel } from './applications/applications.state';
import { ThingsStateModel } from './things/things.state';
import { UserStateModel } from './user/user.state';

export interface AppState {
  applicationsState: ApplicationsStateModel;
  thingsState: ThingsStateModel;
  userState: UserStateModel;
}
