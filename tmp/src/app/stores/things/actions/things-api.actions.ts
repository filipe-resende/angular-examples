import {
  ThingItem,
  ThingsListResponse,
} from '../../../model/things-interfaces';

export class GetAllThings {
  public static readonly type = '[THINGS_API] Get ALL Things';
}

export class GetAllThingsSuccess {
  public static readonly type = '[THINGS_API] Get ALL Things Success';

  constructor(public thingsPayload: ThingsListResponse) {}
}

export class GetThings {
  public static readonly type = '[THINGS_API] Get Things';

  constructor(public skip: number, public count?: number) {}
}

export class GetThingsSuccess {
  public static readonly type = '[THINGS_API] Get Things Success';

  constructor(public thingsPayload: ThingsListResponse) {}
}

export class GetThingById {
  public static readonly type = '[THINGS_API] Get Thing By ID';

  constructor(public id: string) {}
}

export class GetThingByIdSuccess {
  public static readonly type = '[THINGS_API] Get Thing By ID SUCCESS';

  constructor(public thing: ThingItem) {}
}

export class GetThingByName {
  public static readonly type = '[THINGS_API] Get Thing By NAME';

  constructor(
    public name: string,
    public skip?: number,
    public count?: number,
  ) {}
}

export class GetThingByNameSuccess {
  public static readonly type = '[THINGS_API] Get Thing By NAME SUCCESS';

  constructor(public things: ThingItem[]) {}
}
export class CreateThing {
  public static readonly type = '[THINGS_API] Create Thing';

  constructor(public thing: ThingItem) {}
}
export class CreateThingSuccess {
  public static readonly type = '[THINGS_API] Create a thing with success';

  constructor(public thing: ThingItem) {}
}
export class UpdateThing {
  public static readonly type = '[THINGS_API] Update Thing';

  constructor(public id: string, public thing: ThingItem) {}
}

export class UpdateThingSuccess {
  public static readonly type = '[THINGS_API] Update a thing with success';

  constructor(public updatedThing: ThingItem) {}
}

export class SelectThingByName {
  public static readonly type = '[THINGS_API] Select Thing by its name';

  constructor(
    public name: string,
    public skip?: number,
    public count?: number,
  ) {}
}
export class SelectThingByNameSuccess {
  public static readonly type = '[THINGS_API] Select Thing Success';

  constructor(public thing: ThingItem[], public totalCount: number) {}
}

export class UpdateErrorState {
  public static readonly type = '[THINGS_API] UPDATE ERROR STATE';

  constructor(public error: Error) {}
}

export class GetThingBySourceInfo {
  public static readonly type = '[THINGS_API] Get Thing By sourceInfo';

  constructor(public type: string, public value: string) {}
}

export class GetThingBySourceInfoSuccess {
  public static readonly type = '[THINGS_API] Get Thing By sourceInfo SUCCESS';

  constructor(public thing: ThingItem) {}
}
