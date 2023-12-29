import { Action, State, StateContext, Selector } from "@ngxs/store";
import { UpdateSearchbar, ClearHeaderStore } from "./header.actions";

export interface HeaderSearchbar {
  placeholder?: string;
  text?: string;
  isVisible: boolean;
}

const INITIAL_STATE = {
  searchbar: {
    isVisible: false,
    placeholder: "",
    text: "",
  },
};

export class HeaderStateModel {
  public searchbar: HeaderSearchbar;
}

@State<HeaderStateModel>({
  name: "header",
  defaults: INITIAL_STATE,
})
export class HeaderState {
  @Selector()
  public static searchbar(state: HeaderStateModel): HeaderSearchbar {
    return state.searchbar;
  }

  @Action(ClearHeaderStore)
  public clearHeaderStore({ setState }: StateContext<HeaderStateModel>) {
    setState(INITIAL_STATE);
  }

  @Action(UpdateSearchbar)
  public updateSearchbar(
    { patchState, getState }: StateContext<HeaderStateModel>,
    { partialSearchbar }: UpdateSearchbar
  ) {
    const { searchbar } = getState();

    patchState({
      searchbar: {
        ...searchbar,
        ...partialSearchbar,
      },
    });
  }
}
