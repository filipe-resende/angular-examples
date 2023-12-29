import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { OverlayRef } from '@angular/cdk/overlay';
import { SitesService } from '../../../stores/sites/sites.service';
import { SelectedSiteModel } from '../../../stores/sites/sites.state';
import { OverlayService } from '../../../core/services/overlay.service';
import { SiteSelectorOverlayComponent } from './site-selector-overlay/site-selector-overlay.component';

@Component({
  selector: 'app-site-selector',
  templateUrl: 'site-selector.component.html',
  styleUrls: ['./site-selector.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SiteSelectorComponent implements OnInit, OnDestroy {
  @Input()
  public disabled = false;

  @Input()
  public displayAsInput = false;

  @Input()
  public placeholder = 'MESSAGES.SELECT_A_SITE';

  @Output()
  public onSiteSelected = new EventEmitter();

  public selectText: string = null;

  public breadcrumbLeftItemText: string = null;

  public breadcrumbRightItemText: string = null;

  public get inputText(): string {
    let text = this.selectText;

    if (this.breadcrumbRightItemText) {
      text = `${this.breadcrumbRightItemText} > ${text}`;
    }

    if (this.breadcrumbLeftItemText) {
      text = `${this.breadcrumbLeftItemText} > ${text}`;
    }

    return text;
  }

  private subscriptions: Subscription[] = [];

  private siteSelectorOverlay: OverlayRef;

  constructor(
    private sitesService: SitesService,
    private overlayService: OverlayService,
  ) {}

  public ngOnInit(): void {
    this.onSelectedSiteModelChangeHandler();

    this.setupSiteSelectorOverlay();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public clear(): void {
    this.selectText = null;
    this.breadcrumbLeftItemText = null;
    this.breadcrumbRightItemText = null;
  }

  public onSelectedSiteModelChangeHandler(): void {
    const selectedSiteModelSubscription = this.sitesService.selectedSiteModel$.subscribe(
      selectedSiteModel => {
        if (selectedSiteModel)
          this.fillTextsWithSelectedSiteModel(selectedSiteModel);
      },
    );

    this.subscriptions.push(selectedSiteModelSubscription);
  }

  public openSiteSelectorOverlay(target: ElementRef): void {
    this.overlayService.open<SiteSelectorOverlayComponent>(
      this.siteSelectorOverlay,
      target,
      SiteSelectorOverlayComponent,
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: 36,
      },
      {
        onSiteSelected: this.onSiteSelected,
      },
    );
  }

  private fillTextsWithSelectedSiteModel({
    country,
    state,
    site,
  }: SelectedSiteModel): void {
    if (site) {
      this.selectText = site.name;
      this.breadcrumbLeftItemText = country.name;
      this.breadcrumbRightItemText = state.name;
    } else if (state) {
      this.selectText = state.name;
      this.breadcrumbLeftItemText = country.name;
      this.breadcrumbRightItemText = null;
    } else if (country) {
      this.selectText = country.name;
      this.breadcrumbLeftItemText = null;
      this.breadcrumbRightItemText = null;
    } else {
      this.clear();
    }
  }

  private setupSiteSelectorOverlay() {
    this.siteSelectorOverlay = this.overlayService.create();
  }
}
