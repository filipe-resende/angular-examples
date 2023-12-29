import { BreadcrumbItem } from "./breadcrumb.state";

export class PushBreadcrumbItem {
  public static readonly type = "[BREADCRUMB] PushBreadcrumbStack";
  constructor(public breadcrumbItem: BreadcrumbItem) {}
}

export class PopBreadcrumbItem {
  public static readonly type = "[BREADCRUMB] PopBreadcrumbStack";
}

export class UpdateBreadcrumbVisibility {
  public static readonly type = "[BREADCRUMB] UpdateBreadcrumbVisibility";
  constructor(public isVisible: boolean) {}
}

export class ClearBreadcrumbStore {
  public static readonly type = "[BREADCRUMB] ClearBreadcrumbStore";
}
