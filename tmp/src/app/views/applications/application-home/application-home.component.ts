import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { ApplicationItem } from '../../../model/applications-interfaces';
import { Paginator } from '../../../model/paginator';
import { ApplicationsStateService } from '../../../stores/applications/applications-state.service';

@Component({
  selector: 'app-application-home',
  templateUrl: './application-home.component.html',
  styleUrls: ['./application-home.component.scss'],
})
export class ApplicationHomeComponent implements OnInit, OnDestroy {
  public text: { [key: string]: string };

  public showSpinner = false;

  public subscriptions: Subscription[] = [];

  public paginator: Paginator = { skip: 0, currentPage: 1, pageSize: 10 };

  public applications$: Observable<ApplicationItem[]>;

  public allApplications$: Observable<ApplicationItem[]>;

  public totalCount$: Observable<number>;

  public paginator$: Observable<Paginator>;

  constructor(
    private applicationsStateService: ApplicationsStateService,
    private translate: TranslateService,
    private loggingService: LoggingService,
  ) {}

  public ngOnInit(): void {
    this.logUserNavigationToThisPage();
    this.setupTranslateFileResources();
    this.onGetAllApplications();

    this.allApplications$ = this.applicationsStateService.allApplications$;
    this.totalCount$ = this.applicationsStateService.totalCount$;
    this.paginator$ = this.setupPaginatiorObservable();
    this.applications$ = this.setupApplicationsObservable();
  }

  public ngOnDestroy(): void {
    this.subscriptions.map(sub => sub.unsubscribe());
  }

  public onPaginateApplications(page: number, pageSize?: number): void {
    this.applicationsStateService.getApplications(page, pageSize);
  }

  public onFilterApplicationsById(id: string): void {
    this.applicationsStateService.onFilterApplicationsById(id);

    this.loggingService.logEventWithUserInfo(
      'Portal TM - Buscou por uma aplicação na home de aplicações',
    );
  }

  public onPaginate(value: number): void {
    this.showSpinner = true;

    const paginator: Paginator = {
      ...this.paginator,
      skip: value > 1 ? (value - 1) * 10 : 0,
      currentPage: value,
    };

    this.applicationsStateService.onPaginate(paginator);
  }

  private onGetAllApplications(): void {
    this.applicationsStateService.getAllApplications();
  }

  private setupTranslateFileResources(): void {
    const translateResources = this.translate
      .get('APPLICATIONS_LIST')
      .pipe(map(({ NO_APPLICATION_INFO }) => NO_APPLICATION_INFO))
      .subscribe(resources => {
        this.text = resources;
      });

    this.subscriptions.push(translateResources);
  }

  private logUserNavigationToThisPage(): void {
    this.loggingService.logEventWithUserInfo(
      'Portal TM - Navegou para home de aplicações',
    );
  }

  private setupPaginatiorObservable(): Observable<Paginator> {
    return this.applicationsStateService.paginator$.pipe(
      tap((paginator: Paginator) =>
        this.onPaginateApplications(paginator.skip),
      ),
    );
  }

  private setupApplicationsObservable(): Observable<ApplicationItem[]> {
    return this.applicationsStateService.applications$.pipe(
      tap(() => {
        this.showSpinner = false;
      }),
    );
  }
}
