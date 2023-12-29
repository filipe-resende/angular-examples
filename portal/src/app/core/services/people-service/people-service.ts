import { Injectable } from '@angular/core';
import { PeopleRepository } from '../../repositories/people/people.repository';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  constructor(private peopleRepository: PeopleRepository) {}

  public createPeopleLog(
    site: string,
    userEmail: string,
    status: number
  ): void {
    this.peopleRepository.createPeopleLog(site, userEmail, status);
  }
}
