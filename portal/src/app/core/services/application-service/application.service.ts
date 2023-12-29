import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import Application from '../../../shared/models/application';
import { FACIAL_RECOGNITION } from '../../constants/facial-recognition.const';
import { Middlewares } from '../../constants/middleware.const';
import { ApplicationRepository } from '../../repositories/application.repository';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(private applicationRepository: ApplicationRepository) {}

  public getApplication(): Observable<Application[]> {
    return this.applicationRepository
      .listAllApplications()
      .pipe(map(applications => this.populateApplicationsArray(applications)));
  }

  public getApplicationForDevicesScreen(): Observable<Application[]> {
    return this.applicationRepository
    .listAllApplications()
    .pipe(
      map(applications =>
        this.populateApplicationsArray(applications).filter(
          application =>
            application.id !== FACIAL_RECOGNITION &&
            application.id !== Middlewares.SharingSafety
        )
      ),
      shareReplay(1)
    );
  }

  public getApplicationForSearchScreen(): Observable<Application[]> {
    return this.applicationRepository
    .listAllApplications()
    .pipe(
      map(applications =>
        this.populateApplicationsArray(applications).filter(
          application => application.id !== Middlewares.SharingSafety
        )
      ),
      shareReplay(1)
    );
  }

  private populateApplicationsArray(
    applications: Application[]
  ): Application[] {
    return applications.map(application => {
      return {
        id: application.middlewareAdapter,
        name: application.name
      };
    });
  }
}
