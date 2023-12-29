import { Paginator } from '../../../model/paginator';

export class UpdatePaginator {
  public static readonly type = '[THINGS_PAGE] Update pagination state';

  constructor(public paginator: Paginator) {}
}

export class UpdateNameFilter {
  public static readonly type = '[THINGS_PAGE] Update name filter';

  constructor(public name: string) {}
}

export class ClearNewThing {
  public static readonly type = '[THINGS_PAGE] Clear new thing state';
}

export class ClearThingsPreviewList {
  public static readonly type = '[THINGS_PAGE] Clear things preview list';
}
