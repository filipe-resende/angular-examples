import { HeaderSearchbar } from "./header.state";

export class UpdateSearchbar {
  public static readonly type = "[HEADER] UpdateSearchbar";
  constructor(public partialSearchbar: Partial<HeaderSearchbar>) {}
}

export class ClearHeaderStore {
  public static readonly type = "[HEADER] ClearHeaderStore";
}
