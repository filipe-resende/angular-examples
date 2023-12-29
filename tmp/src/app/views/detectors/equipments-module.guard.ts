import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Roles } from 'src/app/shared/enums/iam.enums';

const ALLOWED_ROLES: Roles[] = [
  Roles.Administrador,
  Roles.AnalistaSegurancaEmpresarial,
];
@Injectable({
  providedIn: 'root',
})
export class EquipmentsModuleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise(resolve => {
      this.authService.userInfo$.pipe(filter(x => !!x)).subscribe(userInfo => {
        if (ALLOWED_ROLES.includes(userInfo?.role)) {
          resolve(true);
          return;
        }
        this.router.navigateByUrl('devices');

        resolve(false);
      });
    });
  }
}
