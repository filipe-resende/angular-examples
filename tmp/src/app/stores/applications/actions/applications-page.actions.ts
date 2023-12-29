import { Paginator } from 'src/app/model/paginator';

export class FilterApplicationById {
  public static type = '[APPLICATIONS_PAGE] Filter applications by id';

  constructor(public applicationId: string) {}
}

export class UpdatePaginator {
  public static type = '[APPLICATIONS_PAGE] Update pagination state';

  constructor(public paginator: Paginator) {}
}

export class ClearNewApplication {
  public static type = '[APPLICATIONS_PAGE] Clear new application state';
}
