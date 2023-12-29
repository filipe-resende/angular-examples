import { PerimetersStateModel, PerimetersPageModel } from './perimeters.state';

export class UpdatePerimetersState {
  public static readonly type = '[PERIMETERS] UpdatePerimetersState';

  constructor(
    public partialPerimetersStateModel: Partial<PerimetersStateModel>,
  ) {}
}

export class ClearPerimetersStore {
  public static readonly type = '[PERIMETERS] ClearPerimetersStore';
}

export class UpdatePerimetersPageModel {
  public static readonly type = '[PERIMETERS] UpdatePerimetersPageModel';

  constructor(
    public partialPerimetersPageModel: Partial<PerimetersPageModel>,
  ) {}
}

export class UpdatePerimeterClickability {
  public static readonly type = '[PERIMETERS] UpdatePerimeterClickability';

  constructor(public isClickable: boolean) {}
}
