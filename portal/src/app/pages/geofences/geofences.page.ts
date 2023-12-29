import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MapTwoComponent } from '../../components/smart/map-two/map-two.component';
import GeofenceCategory from '../../shared/models/geofence-category';
import { Site } from '../../shared/models/site';
import { SitesService } from '../../stores/sites/sites.service';

@Component({
  selector: 'app-geofences-page',
  templateUrl: './geofences.page.html',
  styleUrls: ['./geofences.page.scss'],
})
export class GeofencesPage implements OnInit, AfterViewInit {
  @ViewChild(MapTwoComponent) public googleMapRef: MapTwoComponent;

  public selectedSite: Site;

  public subscriptions: Subscription[];

  public geofenceForm: FormGroup;

  public categories: GeofenceCategory[] = [
    { id: '23456787654', name: 'Categoria', status: true, typeEntitie: 'Area' },
  ];

  constructor(formBuilder: FormBuilder, private sitesService: SitesService) {
    this.geofenceForm = formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      color: ['', Validators.required],
      category: [null, Validators.required],
    });
  }

  public ngOnInit(): void {
    this.onSelectedSiteChangeHandler();
  }

  public ngAfterViewInit(): void {
    if (this.selectedSite) {
      this.setSiteOnMap(this.selectedSite);
    }
  }

  public onSelectColorChange(color: string): void {
    this.geofenceForm.controls.color.setValue(color);
  }

  private onSelectedSiteChangeHandler(): void {
    const selectedSite$ = this.sitesService.selectedSite$.subscribe(
      selectedSite => {
        this.selectedSite = selectedSite;

        if (this.isSiteValid(selectedSite)) {
          this.setSiteOnMap(selectedSite);
        }
      },
    );

    this.subscriptions.push(selectedSite$);
  }

  private isSiteValid(selectedSite: Site): boolean {
    return selectedSite && Object.keys(selectedSite).length > 0;
  }

  private tryExecuteCallbackOnMap(callback: () => void): void {
    if (this.googleMapRef) {
      callback();
    } else {
      const HALF_SECOND_IN_MILLISECONDS = 0.5 * 1000;

      setTimeout(
        () => this.tryExecuteCallbackOnMap(callback),
        HALF_SECOND_IN_MILLISECONDS,
      );
    }
  }

  private setSiteOnMap(site: Site): void {
    this.tryExecuteCallbackOnMap(() => {
      const { latitude: lat, longitude: lng, zoom } = site;

      const options: google.maps.MapOptions = { center: { lat, lng }, zoom };
      this.googleMapRef.setMap(options);
    });
  }
}
