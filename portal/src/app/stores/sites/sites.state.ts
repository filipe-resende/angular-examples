import { Action, State, StateContext, Selector } from '@ngxs/store';
import { Site } from '../../shared/models/site';
import {
  ClearSitesStore,
  UpdateSelectedSiteModel,
  UpdateSelectedState,
  UpdateSitesModel,
} from './sites.actions';

export interface SelectedSiteModel {
  country?: Site;
  state?: Site;
  site?: Site;
}

let LAST_SITE_MODEL_SELECTED = JSON.parse(
  localStorage.getItem('lastSiteModelSelected'),
) as SelectedSiteModel;

const getSiteValue = (selectedSiteStateModel: SelectedSiteModel): Site => {
  if (selectedSiteStateModel) {
    const { site, state, country } = selectedSiteStateModel;

    if (site) {
      return site;
    }

    if (state) {
      return state;
    }

    if (country) {
      return country;
    }
  }

  return null;
};

const INITIAL_STATE = {
  sites: undefined,
  selectedSite: getSiteValue(LAST_SITE_MODEL_SELECTED),
  selectedSiteModel: LAST_SITE_MODEL_SELECTED || {},
  selectedState: null,
};
export interface SitesModel extends Site {
  childrenSites?: SitesModel[];
}

export class SitesStateModel {
  public sites: SitesModel[];

  public selectedSite: Site;

  public selectedSiteModel: SelectedSiteModel;

  public selectedState: Site;
}

@State<SitesStateModel>({
  name: 'sites',
  defaults: INITIAL_STATE,
})
export class SitesState {
  @Selector()
  public static sites(state: SitesStateModel): SitesModel[] {
    return state.sites;
  }

  @Selector()
  public static selectedSite(state: SitesStateModel): Site {
    return state.selectedSite;
  }

  @Selector()
  public static selectedSiteModel(state: SitesStateModel): SelectedSiteModel {
    return state.selectedSiteModel;
  }

  @Selector()
  public static selectedState(state: SitesStateModel): Site {
    return state.selectedState;
  }

  @Action(UpdateSitesModel)
  public updateSitesModel(
    { patchState }: StateContext<SitesStateModel>,
    { sites }: UpdateSitesModel,
  ): void {
    patchState({ sites });
  }

  @Action(UpdateSelectedSiteModel)
  public updateSelectedSiteModel(
    { patchState }: StateContext<SitesStateModel>,
    { selectedSiteModel }: UpdateSelectedSiteModel,
  ): void {
    localStorage.setItem(
      'lastSiteModelSelected',
      JSON.stringify(selectedSiteModel),
    );

    const selectedSite = getSiteValue(selectedSiteModel);

    patchState({
      selectedSiteModel: { ...selectedSiteModel },
      selectedSite: { ...selectedSite },
    });
  }

  @Action(ClearSitesStore)
  public clearSitesStore({ setState }: StateContext<SitesStateModel>): void {
    LAST_SITE_MODEL_SELECTED = JSON.parse(
      localStorage.getItem('lastSiteModelSelected'),
    ) as SelectedSiteModel;

    setState(INITIAL_STATE);
  }

  @Action(UpdateSelectedState)
  public updateSelectedState(
    { patchState }: StateContext<SitesStateModel>,
    { selectedState }: UpdateSelectedState,
  ): void {
    patchState({ selectedState });
  }
}
