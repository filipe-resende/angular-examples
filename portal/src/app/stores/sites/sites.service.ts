import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import {
  SitesState,
  SitesStateModel,
  SelectedSiteModel,
  SitesModel
} from './sites.state';
import { Site } from '../../shared/models/site';
import {
  ClearSitesStore,
  UpdateSelectedSiteModel,
  UpdateSelectedState,
  UpdateSitesModel
} from './sites.actions';
import { SiteRepository } from '../../core/repositories/site.repository';
import { PerimetersService } from '../perimeters/perimeters.service';
import { SiteAsCountry } from '../../shared/models/siteAsCountry';
import { ThingsService } from '../things/things.service';

@Injectable({
  providedIn: 'root'
})
export class SitesService {
  @Select(SitesState.sites)
  public sites$: Observable<SitesModel[]>;

  @Select(SitesState.selectedSite)
  public selectedSite$: Observable<Site>;

  @Select(SitesState.selectedSiteModel)
  public selectedSiteModel$: Observable<SelectedSiteModel>;

  @Select(SitesState.selectedState)
  public selectedState$: Observable<Site>;

  constructor(
    private store: Store,
    private siteRepository: SiteRepository,
    private thingsService: ThingsService,
    private perimetersService: PerimetersService
  ) {}

  public getStore(): SitesStateModel {
    return this.store.snapshot().sites as SitesStateModel;
  }

  /**
   * Atualiza o último site selecionado da aplicação, atualiza também seu valor no storage do browser
   * @param siteModel site que foi selecionado
   */
  @Dispatch()
  public updateSelectedSiteModel(
    siteModel: SelectedSiteModel
  ): UpdateSelectedSiteModel {
    this.thingsService.resetSubscriptionsAndStore();

    if (siteModel && siteModel.site && siteModel.site.name) {
      this.perimetersService.syncPerimetersBySite(siteModel.site);
    }

    return new UpdateSelectedSiteModel(siteModel);
  }

  @Dispatch()
  public updateSelectedState(state: Site): UpdateSelectedState {
    return new UpdateSelectedState(state);
  }

  /**
   * Limpa todo o STATE
   */
  @Dispatch()
  public clearSitesStore(): ClearSitesStore {
    return new ClearSitesStore();
  }

  /**
   * Atualiza as listas de sites no STATE.
   * @param sites Objeto com os sites (countries, states e sites) para ser listado no STATE.
   */
  @Dispatch()
  private updateSites(sites: SitesModel[]): UpdateSitesModel {
    return new UpdateSitesModel(sites);
  }

  /**
   * obtém o site selecionado
   */
  public getSelectedSite(): Site {
    const { selectedSite } = this.getStore();
    return selectedSite;
  }

  /**
   * obtém o pais, estado e site selecionado
   */
  public getSelectedSiteModel(): SelectedSiteModel {
    const { selectedSiteModel } = this.getStore();
    return selectedSiteModel;
  }

  /**
   * Atualiza todas as listas de sites do STATE
   */
  public syncSites(): Promise<SitesModel[]> {
    return new Promise((resolve, reject) => {
      const onSuccessCallback = (siteAsCountryList: SiteAsCountry[]) => {
        const sitesModelList = this.mapSiteAsCountryListToSitesModelList(
          siteAsCountryList
        );

        this.updateSites(sitesModelList);

        resolve(sitesModelList);
      };

      this.siteRepository
        .listAllSitesAsTree()
        .subscribe(onSuccessCallback, error => reject(error));
    });
  }

  public getNameSite(sitesModelList: SitesModel[], areaName: string): string {
    const siteCode = Number(areaName?.split('_')[0]);
    return (
      sitesModelList
        .flatMap(a => a.childrenSites.flatMap(b => b.childrenSites))
        .find(site => Number(site.code) === siteCode)?.name ?? areaName
    );
  }

  public mapSitesModelListToSitesIdList(
    sitesModelList: SitesModel[]
  ): { [key: string]: string }[] {
    const statesList = sitesModelList.map(({ childrenSites }) => childrenSites);
    const sitesIdsList = statesList.map(state =>
      state.map(({ childrenSites }) =>
        childrenSites.map(site => ({ siteId: site.id }))
      )
    );

    return _.flattenDeep(sitesIdsList);
  }

  private mapSiteAsCountryListToSitesModelList(
    siteAsCountryList: SiteAsCountry[]
  ): SitesModel[] {
    return siteAsCountryList.map(siteAsCountry => {
      const mappedCountry: SitesModel = {
        latitude: siteAsCountry.latitude,
        longitude: siteAsCountry.longitude,
        name: siteAsCountry.name,
        radius: siteAsCountry.radius,
        id: siteAsCountry.id,
        zoom: siteAsCountry.zoom,
        childrenSites: siteAsCountry.states.map(siteAsState => {
          const mappedState: SitesModel = {
            latitude: siteAsState.latitude,
            longitude: siteAsState.longitude,
            name: siteAsState.name,
            radius: siteAsState.radius,
            id: siteAsState.id,
            zoom: siteAsState.zoom,
            childrenSites: siteAsState.units.map(siteAsUnit => {
              const mappedUnit: SitesModel = {
                latitude: siteAsUnit.latitude,
                longitude: siteAsUnit.longitude,
                name: siteAsUnit.name,
                radius: siteAsUnit.radius,
                id: siteAsUnit.id,
                zoom: siteAsUnit.zoom,
                code: siteAsUnit.code
              };

              return mappedUnit;
            })
          };

          return mappedState;
        })
      };

      return mappedCountry;
    });
  }
}
