import { Site } from '../../shared/models/site';
import { SelectedSiteModel, SitesModel } from './sites.state';

export class UpdateSitesModel {
  public static readonly type = '[SITES] UpdateSitesModel';

  constructor(public sites: SitesModel[]) {}
}

export class UpdateSelectedSiteModel {
  public static readonly type = '[SITES] UpdateSelectedSiteModel';

  constructor(public selectedSiteModel: SelectedSiteModel) {}
}

export class UpdateSelectedState {
  public static readonly type = '[SITES] UpdateSelectedState';

  constructor(public selectedState: Site) {}
}

export class ClearSitesStore {
  public static readonly type = '[SITES] ClearSitesStore';
}
