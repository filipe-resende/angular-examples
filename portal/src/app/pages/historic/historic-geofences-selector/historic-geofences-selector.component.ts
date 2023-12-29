import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { skip } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Geofence } from '../../../shared/models/geofence';
import { GeofencesService } from '../../../stores/geofences/geofences.service';
import { SitesService } from '../../../stores/sites/sites.service';

@Component({
  selector: 'app-historic-geofences-selector',
  templateUrl: './historic-geofences-selector.component.html',
  styleUrls: ['./historic-geofences-selector.component.scss'],
})
export class HistoricGeofencesSelectorComponent implements OnInit, OnDestroy {
  @Input() items: Geofence[];

  @Input() placeholder: string;

  @Input() bindLabel: string;

  @Input() loading: boolean;

  @Output() onSelect = new EventEmitter<Geofence>();

  public geofences$: Observable<Geofence[]>;

  public selectedGeofence: string;

  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;

  private subscription: Subscription;

  constructor(
    private geofencesService: GeofencesService,
    private sitesService: SitesService,
  ) {}

  ngOnInit(): void {
    this.geofences$ = this.geofencesService.geofences$;
    this.subscription = this.sitesService.selectedSite$
      .pipe(skip(1))
      .subscribe(() => {
        this.ngSelectComponent.handleClearClick();
      });
  }

  public onChange(geofence: Geofence): void {
    this.onSelect.emit(geofence);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
