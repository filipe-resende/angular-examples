import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserPermissionConstant } from 'src/app/core/constants/user-permission.const';
import { environment } from 'src/environments/environment';
import { BypassLoginAuthService } from './bypass-login-auth.service';

@Component({
  selector: 'app-bypass-login',
  templateUrl: './bypass-login.component.html',
  styleUrls: ['./bypass-login.component.scss'],
})
export class BypassLoginComponent implements OnInit {
  public userForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    roles: new FormControl([], [Validators.required]),
    country: new FormControl('', [Validators.required]),
  });

  public countries = [
    { name: 'Brasil', code: 'BR' },
    { name: 'Canadá', code: 'CA' },
  ];

  public roles = [
    {
      name: 'EUC',
      code: `${UserPermissionConstant.EUC}`,
    },
    {
      name: 'PAEBM',
      code: `${UserPermissionConstant.PAEBM}`,
    },
    {
      name: 'Analista de Segurança Empresarial',
      code: `${UserPermissionConstant.ANALISTA_SEG_EMPRESARIAL}`,
    },
    {
      name: 'Analista Operacional',
      code: `${UserPermissionConstant.ANALISTA_OPERACIONAL}`,
    },
    {
      name: 'Administrador',
      code: `${UserPermissionConstant.ADMIN}`,
    },
  ];

  constructor(
    private router: Router,
    private bypassLoginAuthService: BypassLoginAuthService,
  ) {}

  ngOnInit() {
    this.userForm.get('code').setValue('C0609158');
    this.userForm.get('name').setValue('CLAUDIA RIBEIRO');
    this.userForm.get('email').setValue('C0609158@vale.com');
    this.userForm.get('country').setValue('BR');
    this.selectAll();
  }

  public selectAll() {
    const roles = [];
    this.roles.forEach(function (role: any) {
      roles.push(role.code);
    });
    this.userForm.get('roles').setValue(roles);
  }

  // eslint-disable-next-line consistent-return
  public async doLogin() {
    if (environment.production) {
      this.router.navigate(['/']);
      return false;
    }
    const { name, code, email, country, roles } = this.userForm.value;
    const userGroups = [];
    roles.forEach(role => {
      userGroups.push(`cn=${role},ou=TMP,ou=Groups,o=vale`);
    });
    const user = {
      'result.Country': country,
      'result.Email': email,
      'result.Groups': userGroups,
      'result.Name': name,
      'result.User': code,
      sub: '',
    };
    localStorage.setItem('bypass_login_user', JSON.stringify(user));
    localStorage.setItem('access_token', 'com alguma coisa');
    const threeDays = 259200000;
    const expiresAt = new Date().getTime() + threeDays;
    localStorage.setItem('expires_at', expiresAt.toString());
    await this.bypassLoginAuthService.updateLoggedBypassLoginUser(user);
    this.router.navigate(['/']);
  }
}
