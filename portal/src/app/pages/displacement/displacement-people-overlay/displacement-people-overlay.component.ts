import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { Trip } from '../../../shared/models/trip';
import { TripThing } from '../../../shared/models/trip-thing';
import { TransportsService } from '../../../stores/transports/transports.service';
import { UserProfileService } from '../../../stores/user-profile/user-profile.service';

@Component({
  selector: 'app-displacement-people-overlay',
  templateUrl: './displacement-people-overlay.component.html',
  styleUrls: ['./displacement-people-overlay.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DisplacementPeopleOverlayComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) public sort: MatSort;

  public dataSource: MatTableDataSource<TripThing>;

  public isFetchingTripThings$: Observable<boolean>;

  public skeletonArray = Array(10);

  public displayedColumns: string[] = [
    'cardId',
    'document',
    'name',
    'location',
    'eventDateTime',
    'company'
  ];

  public canViewSensitiveData: boolean;

  private subscriptions: Subscription[] = [];

  constructor(
    private dialogRef: MatDialogRef<DisplacementPeopleOverlayComponent>,
    private transportsService: TransportsService,
    @Inject(MAT_DIALOG_DATA)
    public dateData: {
      trip: Trip;
      from: string;
      till: string;
    },
    private userProfileService: UserProfileService
  ) {}

  public ngOnInit(): void {
    this.isFetchingTripThings$ =
      this.transportsService.isFetchingTripThingsList$;
    const { trip, from, till } = this.dateData;
    this.onFetchSelectedTrip(trip, from, till);

    this.setupTripThingsSub();
    this.closeWhenClickedOutside();

    this.canViewSensitiveData = this.userProfileService.canViewSensitiveData();

    if (!this.canViewSensitiveData)
      this.displayedColumns = this.displayedColumns.filter(
        displayedColumn => displayedColumn !== 'document'
      );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public close(): void {
    this.dialogRef.close();
  }

  private onFetchSelectedTrip(
    { code, line }: Trip,
    from: string,
    till: string
  ) {
    this.transportsService.updateSelectedTrip({
      code,
      name: line,
      from,
      till
    });
  }

  private setupTripThingsSub() {
    const tripThings$ = this.transportsService.tripThings$.subscribe(
      (tripThings: TripThing[]) => {
        if (!tripThings.length) {
          this.emptyTable();
        }

        this.dataSource = new MatTableDataSource(tripThings);
        this.dataSource.sort = this.sort;
      }
    );

    this.subscriptions.push(tripThings$);
  }

  private closeWhenClickedOutside() {
    const clckOutsideSub = this.dialogRef
      .backdropClick()
      .subscribe(() => this.close());

    this.subscriptions.push(clckOutsideSub);
  }

  private emptyTable() {
    this.dataSource = null;
    const emptyArray = Array(10);

    this.dataSource = new MatTableDataSource(
      emptyArray.fill('').map(() => ({
        tripCode: null,
        cardId: null,
        document: null,
        location: null,
        eventDateTime: null,
        company: null,
        type: null,
        name: null
      }))
    );
  }
}
