/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { share, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DropDownRelationType } from 'src/app/shared/enums/dropDownRelationType.enums';
import { ApplicationsIds } from 'src/app/core/constants/applications.const';
import { Origins } from 'src/app/views/things/things.const';
import { Observable } from 'rxjs/internal/Observable';
import { ThingEmail } from 'src/app/shared/interfaces/thing-email.interface';
import { ThingsRepository } from '../../core/repositories/things.repository';
import { ThingItem, Things } from '../../model/things-interfaces';

@Injectable({
  providedIn: 'root',
})
export class ThingsService {
  private headers = { Authorization: `Basic ${environment.Authorization()}` };

  constructor(
    private http: HttpClient,
    public thingsRepository: ThingsRepository,
  ) {}

  private readonly BFF_URL = `${environment.thingsManagementBffUrl}/things`;

  private readonly BFF_URL_LOCATION = `${environment.thingsManagementBffUrl}/location-events`;

  getAll(skip = 0, page = 0) {
    return this.http
      .get(`${this.BFF_URL}/?skip=${skip}&count=${page}`)
      .pipe(take(1), share());
  }

  createThings(thing: ThingItem) {
    return this.thingsRepository.createThing(thing).pipe(take(1));
  }

  getByName(name: string, skip = 0, count = 0) {
    return this.http
      .get<Things>(`${this.BFF_URL}/byName/${name}?skip=${skip}&count=${count}`)
      .pipe(take(1), share());
  }

  getById(id: string) {
    return this.http
      .get<ThingItem>(`${this.BFF_URL}/${id}`)
      .pipe(take(1), share());
  }

  update(thingId: string, body: ThingItem, isReactivation = false) {
    return this.http
      .put<ThingItem>(`${this.BFF_URL}/${thingId}/${isReactivation}`, body, {
        headers: this.headers,
      })
      .pipe(take(1));
  }

  reactivateThing(
    thingId: string,
    thingToBeUpdated: ThingItem,
  ): Observable<any> {
    thingToBeUpdated.status = true;
    thingToBeUpdated.relationType = 2;
    thingToBeUpdated.companyInfo = {
      companyName: ' ',
      relationType: DropDownRelationType.Visitante,
    };
    thingToBeUpdated.relationName = ' ';
    thingToBeUpdated.updatedBy = ApplicationsIds.ThingsManagement;
    thingToBeUpdated.origin = Origins.TMP;

    return this.http
      .put<ThingItem>(`${this.BFF_URL}/${thingId}/true`, thingToBeUpdated, {
        headers: this.headers,
      })
      .pipe(take(1));
  }

  getBySourceInfo(type: string, value: string) {
    return this.http
      .get(`${this.BFF_URL}/bySourceInfo/${type}/${value}`)
      .pipe(take(1), share());
  }

  lastLocationByThingId(id: string) {
    return this.http
      .get(`${this.BFF_URL_LOCATION}/thing/${id}`, { headers: this.headers })
      .pipe(take(1));
  }

  getThingsIdAndEmailByMemberType(
    memberType: string,
  ): Observable<ThingEmail[]> {
    return this.http
      .get<ThingEmail[]>(
        `${this.BFF_URL}/GetThingsIdAndEmailByMemberType?memberType=${memberType}`,
        { headers: this.headers },
      )
      .pipe(take(1));
  }
}
