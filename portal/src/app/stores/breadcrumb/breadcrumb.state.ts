import { Action, State, StateContext, Selector } from "@ngxs/store";
import {
  ClearBreadcrumbStore,
  PushBreadcrumbItem,
  PopBreadcrumbItem,
  UpdateBreadcrumbVisibility,
} from "./breadcrumb.actions";

export interface BreadcrumbItem {
  text: string;
  route: string;
}

const INITIAL_STATE = {
  stack: [
    {
      text: "Home",
      route: "/dashboard",
    },
  ],
  isVisible: false,
};

export class BreadcrumbStateModel {
  public stack: BreadcrumbItem[];
  public isVisible: boolean;
}

@State<BreadcrumbStateModel>({
  name: "breadcrumb",
  defaults: INITIAL_STATE,
})
export class BreadcrumbState {
  @Selector()
  public static stack(state: BreadcrumbStateModel): BreadcrumbItem[] {
    return state.stack;
  }

  @Selector()
  public static isVisible(state: BreadcrumbStateModel): boolean {
    return state.isVisible;
  }

  @Action(ClearBreadcrumbStore)
  public clearBreadcrumbStore({ setState, getState }: StateContext<BreadcrumbStateModel>) {
    setState(INITIAL_STATE);
  }

  @Action(PushBreadcrumbItem)
  public pushBreadcrumbItem(
    { patchState, getState }: StateContext<BreadcrumbStateModel>,
    { breadcrumbItem }: PushBreadcrumbItem
  ) {
    const { stack } = getState();
    const newStack = [...stack];

    newStack.push(breadcrumbItem);

    patchState({ stack: newStack });
  }

  @Action(PopBreadcrumbItem)
  public popBreadcrumbItem({ patchState, getState }: StateContext<BreadcrumbStateModel>) {
    const { stack } = getState();
    const newStack = [...stack];

    if (newStack.length > 1) {
      newStack.pop();
    }

    patchState({ stack: newStack });
  }

  @Action(UpdateBreadcrumbVisibility)
  public updateBreadcrumbVisibility(
    { patchState }: StateContext<BreadcrumbStateModel>,
    { isVisible }: UpdateBreadcrumbVisibility
  ) {
    patchState({ isVisible });
  }
}
