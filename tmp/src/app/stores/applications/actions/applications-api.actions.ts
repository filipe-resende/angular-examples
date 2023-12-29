import {
  ApplicationItem,
  ApplicationRequest,
  ApplicationsListResponse,
} from '../../../model/applications-interfaces';

export class GetAllApplications {
  public static readonly type = '[APPLICATIONS_API] Get ALL Applications';
}

export class GetAllApplicationsSuccess {
  public static readonly type =
    '[APPLICATIONS_API] Get ALL Applications Success';

  constructor(public applicationsPayload: ApplicationsListResponse) {}
}

export class GetApplications {
  public static readonly type = '[APPLICATIONS_API] Get Applications';

  constructor(public skip: number, public count?: number) {}
}

export class GetApplicationsSuccess {
  public static readonly type = '[APPLICATIONS_API] Get Applications Success';

  constructor(public applicationsPayload: ApplicationsListResponse) {}
}

export class GetApplicationById {
  public static readonly type = '[APPLICATIONS_API] Get Application By ID';

  constructor(public id: string) {}
}

export class GetApplicationByIdSuccess {
  public static readonly type =
    '[APPLICATIONS_API] Get Application By ID SUCCESS';

  constructor(public application: ApplicationItem) {}
}

export class CreateApplication {
  public static readonly type = '[APPLICATIONS_API] Create Application';

  constructor(public application: ApplicationRequest) {}
}

export class CreateApplicationSuccess {
  public static readonly type = '[APPLICATIONS_API] Create Application Success';

  constructor(public application: ApplicationItem) {}
}

export class UpdateApplication {
  public static readonly type = '[APPLICATIONS_API] Update Application';

  constructor(public id: string, public application: ApplicationRequest) {}
}

export class UpdateApplicationSuccess {
  public static readonly type = '[APPLICATIONS_API] Update Application Success';

  constructor(public updatedApplication: ApplicationItem) {}
}

export class UpdateErrorState {
  public static readonly type = '[APPLICATIONS_API] UPDATE ERROR STATE';

  constructor(public error: Error) {}
}
