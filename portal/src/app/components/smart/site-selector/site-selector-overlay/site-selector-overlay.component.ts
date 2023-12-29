/* eslint-disable no-extra-boolean-cast */
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import {
  SitesModel,
  SelectedSiteModel,
} from '../../../../stores/sites/sites.state';
import { SitesService } from '../../../../stores/sites/sites.service';
import { Site } from '../../../../shared/models/site';
import { cloneObject } from '../../../../shared/utils/clone';

@Component({
  selector: 'app-site-selector-overlay',
  templateUrl: 'site-selector-overlay.component.html',
  styleUrls: ['site-selector-overlay.component.scss'],
})
export class SiteSelectorOverlayComponent implements OnInit, OnDestroy {
  @Input()
  public overlayRef;

  @Output()
  public onSiteSelected = new EventEmitter();

  public selectedSiteModelToUpdate: SelectedSiteModel = {};

  public sites$: Observable<SitesModel[]>;

  public selectedSiteModel$: Observable<SelectedSiteModel>;

  public countries: SitesModel[] = [];

  public states: SitesModel[] = [];

  public sites: SitesModel[] = [];

  public loading = false;

  private subscriptions: Subscription[] = [];

  constructor(private sitesService: SitesService) {}

  public ngOnInit(): void {
    this.sites$ = this.sitesService.sites$;
    this.selectedSiteModelToUpdate = cloneObject(
      this.sitesService.getSelectedSiteModel(),
    );
    this.selectedSiteModel$ = this.sitesService.selectedSiteModel$;

    this.onSitesChangeHandler();
  }

  public ngOnDestroy(): void {
    this.reset();
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public isSaveButtonEnabled(): boolean {
    const areAllFieldsEmpty =
      !this.selectedSiteModelToUpdate ||
      (!this.selectedSiteModelToUpdate.country &&
        !this.selectedSiteModelToUpdate.state &&
        !this.selectedSiteModelToUpdate.site);

    const areAllFieldsFilled =
      !!this.selectedSiteModelToUpdate &&
      !!this.selectedSiteModelToUpdate.country &&
      !!this.selectedSiteModelToUpdate.country.name &&
      !!this.selectedSiteModelToUpdate.state &&
      !!this.selectedSiteModelToUpdate.state.name &&
      !!this.selectedSiteModelToUpdate.site &&
      !!this.selectedSiteModelToUpdate.site.name;

    return areAllFieldsEmpty || areAllFieldsFilled;
  }

  public onCancelButtonClick(): void {
    this.closeOverlay();
  }

  public onSelectCountry(selectedCountry: Site): void {
    this.selectedSiteModelToUpdate.country = selectedCountry;

    if (selectedCountry) {
      this.selectedSiteModelToUpdate.state = null;
      this.selectedSiteModelToUpdate.site = null;
      this.states = this.getStatesFromCountry(selectedCountry);
    } else {
      this.states = null;
      this.selectedSiteModelToUpdate.state = null;
      this.selectedSiteModelToUpdate.site = null;
    }
    this.sites = null;
  }

  public onSelectSite(selectedSite: Site): void {
    this.selectedSiteModelToUpdate.site = selectedSite;
  }

  public onSelectState(selectedState: Site): void {
    this.selectedSiteModelToUpdate.state = selectedState;

    if (selectedState) {
      this.selectedSiteModelToUpdate.site = null;
      this.sites = this.getSitesFromState(selectedState);
    } else {
      this.sites = null;
      this.selectedSiteModelToUpdate.site = null;
    }
  }

  public onSubmitButtonClick(): void {
    this.sitesService.updateSelectedSiteModel(this.selectedSiteModelToUpdate);
    this.closeOverlay();
    this.onSiteSelected.emit(this.selectedSiteModelToUpdate.site);
  }

  private closeOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }

  private getSitesFromState(state: Site): SitesModel[] {
    const [stateFiltered] = this.states.filter(f => f.id === state.id);

    return stateFiltered.childrenSites && stateFiltered.childrenSites.length > 0
      ? stateFiltered.childrenSites
      : [];
  }

  private getStatesFromCountry(country: Site): SitesModel[] {
    const [countryFiltered] = this.countries.filter(f => f.id === country.id);

    return countryFiltered.childrenSites &&
      countryFiltered.childrenSites.length > 0
      ? countryFiltered.childrenSites
      : [];
  }

  private onSitesChangeHandler(): void {
    this.loading = true;
    const sitesSubscription$ = this.sitesService.sites$.subscribe(sites => {
      this.countries = sites;

      const { country, state } = this.selectedSiteModelToUpdate;

      if (!!country) {
        this.states = this.getStatesFromCountry(country);
      } else {
        this.states = null;
      }

      if (!!state) {
        this.sites = this.getSitesFromState(state);
      } else {
        this.sites = null;
      }

      if (_.isArray(sites)) {
        this.loading = false;
      }
    });

    this.subscriptions.push(sitesSubscription$);
  }

  private reset(): void {
    this.selectedSiteModelToUpdate = cloneObject(
      this.sitesService.getSelectedSiteModel(),
    );
  }
}
