import { Injectable } from '@angular/core';
import { UserProfilesRepository } from '../repositories/user-profiles.repository';

@Injectable({
  providedIn: 'root'
})
export class UserProfilesService {
  constructor(private userProfilesRepository: UserProfilesRepository) {}

  public createOrUpdateUserProfile(): void {
    this.userProfilesRepository.createOrUpdateUserProfile();
  }
}
