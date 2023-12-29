import { Component, OnInit, Input } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Role } from '../../../shared/enums/role';
import { UserProfile } from '../../../shared/models/user-profile';
import { UserProfileService } from '../../../stores/user-profile/user-profile.service';

@Component({
  selector: 'app-auth',
  templateUrl: 'auth.component.html',
  styleUrls: ['auth.component.scss']
})
export class AuthComponent implements OnInit {
  @Input()
  public authorizedRoles: Role[] = [];

  public shouldRenderContent = false;

  constructor(private userProfile: UserProfileService) {}

  public ngOnInit() {
    this.userProfile.userProfile$
      .pipe(
        filter(
          userProfile =>
            !!userProfile && userProfile.roles && userProfile.roles.length > 0
        )
      )
      .subscribe(userProfile => {
        this.shouldRenderContent =
          this.verifyIfShouldRenderContent(userProfile);
      });
  }

  private verifyIfShouldRenderContent(userProfile: UserProfile): boolean {
    let shouldRenderContent = false;

    const userRoles = userProfile.roles;

    userRoles.forEach(userRole => {
      if (
        this.authorizedRoles.find(
          element => element.toLocaleLowerCase() === userRole
        )
      ) {
        shouldRenderContent = true;
      }
    });

    return shouldRenderContent;
  }
}
