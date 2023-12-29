import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { Site } from '../../../shared/models/site';
import { Thing } from '../../../shared/models/thing';
import { NotificationsService } from '../../../stores/notifications/notifications.service';
import { SitesService } from '../../../stores/sites/sites.service';
import { UserProfileService } from '../../../stores/user-profile/user-profile.service';

@Component({
  selector: 'app-expiration-notifications',
  templateUrl: './expiration-notifications.component.html',
  styleUrls: ['./expiration-notifications.component.scss']
})
export class ExpirationNotificationsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) public matSortRef: MatSort;

  public tableColumns: string[] = [
    'name',
    'documentId',
    'lastReport',
    'lastLocation',
    'middleware',
    'device',
    'companyName'
  ];

  public matTableDataSource: MatTableDataSource<Thing>;

  public skeletonArray = Array(10);

  public isFetchingNotifications: boolean;

  public currentPage = 1;

  public readonly PAGE_SIZE = 10;

  public expiredThings: Thing[] = [];

  private subscriptions: Subscription[] = [];

  public canViewSensitiveData: boolean;

  private EXPIRATION_TIME_IN_MINUTES = '720';

  private EXPIRATION_TIME_IN_HOURS = 12;

  constructor(
    private notificationsService: NotificationsService,
    private sitesService: SitesService,
    private userProfileService: UserProfileService
  ) {}

  public ngOnInit(): void {
    this.canViewSensitiveData = this.userProfileService.canViewSensitiveData();

    if (!this.canViewSensitiveData)
      this.tableColumns = this.tableColumns.filter(
        tableColumn => tableColumn !== 'documentId'
      );

    this.setupSite();
    this.setupExpiredThings();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private emptyTable(): void {
    this.matTableDataSource = null;
    this.isFetchingNotifications = false;
    this.currentPage = 1;

    const emptyArray = Array(10);

    this.matTableDataSource = new MatTableDataSource(
      emptyArray.fill('').map(() => {
        return {
          name: null,
          documentId: null,
          lastReport: null,
          lastLocation: null,
          middleware: null,
          deviceNumber: null,
          company: null
        };
      })
    );
  }

  private async fetchExpiredThings(selectedSite: Site): Promise<void> {
    const { name: site } = selectedSite;

    this.isFetchingNotifications = true;

    const currentDate: moment.Moment = moment();

    try {
      await this.notificationsService.fetchExpiredThings({
        site,
        initialDate: currentDate
          .subtract(this.EXPIRATION_TIME_IN_HOURS, 'hour')
          .toDate(),
        intervalInMinutes: this.EXPIRATION_TIME_IN_MINUTES
      });
    } catch (error) {
      this.emptyTable();
    } finally {
      this.isFetchingNotifications = false;
    }
  }

  private setupSite(): void {
    const siteSub = this.sitesService.selectedSite$.subscribe(site => {
      if (site) {
        this.fetchExpiredThings(site);
      } else {
        this.emptyTable();
      }
    });

    this.subscriptions.push(siteSub);
  }

  private setupExpiredThings(): void {
    const expiredThingsSub = this.notificationsService.expiredThings$
      .pipe(skip(1))
      .subscribe(things => {
        this.matTableDataSource = new MatTableDataSource(things);
      });

    this.subscriptions.push(expiredThingsSub);
  }
}
