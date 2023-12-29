/* eslint-disable prettier/prettier */
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SidenavService } from '../main/sidenav/sidenav.service';
import { Role } from '../../../shared/enums/role';
import { UserProfileService } from '../../../stores/user-profile/user-profile.service';
import { UserProfile } from '../../../shared/models/user-profile';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public userProfile: UserProfile;

  public loading = false;

  public language = this.translateService.currentLang;

  public CONTROL_CENTER = '';

  public OPERATIONAL_ANALYST = '';

  public BUSINESS_SECURITY_ANALYST = '';

  public CONSULT = '';

  public TRANSPORT = '';

  public PAEBM = '';

  public FACILITES = '';

  public OTHER_AREAS = '';

  constructor(
    public translateService: TranslateService,
    private sidenav: SidenavService,
    private userProfileService: UserProfileService,
    private dialogRef: MatDialogRef<SettingsComponent>
  ) {}

  public ngOnInit() {
    this.userProfileService.userProfile$
      .pipe(filter(userProfile => !!userProfile))
      .subscribe(userProfile => {
        this.userProfile = userProfile;
      });

    this.translateService
      .get(['ROLES'])
      .toPromise()
      .then(
        ({
          ROLES: {
            CONTROL_CENTER,
            OPERATIONAL_ANALYST,
            BUSINESS_SECURITY_ANALYST,
            CONSULT,
            TRANSPORT,
            PAEBM,
            FACILITES,
            OTHER_AREAS
          }
        }) => {
          this.CONTROL_CENTER = CONTROL_CENTER;
          this.OPERATIONAL_ANALYST = OPERATIONAL_ANALYST;
          this.BUSINESS_SECURITY_ANALYST = BUSINESS_SECURITY_ANALYST;
          this.CONSULT = CONSULT;
          this.TRANSPORT = TRANSPORT;
          this.PAEBM = PAEBM;
          this.FACILITES = FACILITES;
          this.OTHER_AREAS = OTHER_AREAS;
        }
      );
  }

  get user() {
    const { userName, email } = this.userProfile;
    return `${userName} (${email})`;
  }

  get userEmail() {
    const { email } = this.userProfile;
    return email;
  }

  get userPermissions() {
    const { roles } = this.userProfile;
    let permissions = '';

    roles.forEach(role => {
      switch (role) {
        case Role.ControlCenter:
          permissions = `${permissions}${permissions.length > 0 ? ' / ' : ''}${
            this.CONTROL_CENTER
          }`;
          break;
        case Role.Consult:
          permissions = `${permissions}${permissions.length > 0 ? ' / ' : ''}${
            this.CONSULT
          }`;
          break;
        case Role.BusinessSecurityAnalyst:
          permissions = `${permissions}${permissions.length > 0 ? ' / ' : ''}${
            this.BUSINESS_SECURITY_ANALYST
          }`;
          break;
        case Role.OperationalAnalyst:
          permissions = `${permissions}${permissions.length > 0 ? ' / ' : ''}${
            this.OPERATIONAL_ANALYST
          }`;
          break;
        case Role.Transport:
          permissions = `${permissions}${permissions.length > 0 ? ' / ' : ''}${
            this.TRANSPORT
          }`;
          break;
        case Role.Paebm:
          permissions = `${permissions}${permissions.length > 0 ? ' / ' : ''}${
            this.PAEBM
          }`;
          break;
        case Role.Facilities:
          permissions = `${permissions}${permissions.length > 0 ? ' / ' : ''}${
            this.FACILITES
          }`;
          break;
        case Role.OtherAreas:
          permissions = `${permissions}${permissions.length > 0 ? ' / ' : ''}${
            this.OTHER_AREAS
          }`;
          break;
      }
    });

    return permissions;
  }

  get version() {
    return environment.version;
  }

  get configuration() {
    return environment.configuration;
  }

  public cancel() {
    this.dialogRef.close();
  }

  public async submit() {
    this.translateService.use(this.language);
    localStorage.setItem('_culture', this.language);
    this.sidenav.generateMenu('');
    this.dialogRef.close();
  }
}
