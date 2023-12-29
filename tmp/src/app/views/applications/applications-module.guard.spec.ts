import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Roles } from 'src/app/shared/enums/iam.enums';
import { IUserInfoWithRole } from 'src/app/shared/interfaces/iam.interfaces';
import { userInfoWithRoleMock } from 'src/app/tests/auth-service-mocks';

import { ApplicationsModuleGuard } from './applications-module.guard';

let guard: ApplicationsModuleGuard;
const routerMock: Partial<Router> = {
  navigateByUrl: _ => Promise.resolve(true),
};
describe('ApplicationsModuleGuard when user is logged in and is Administrator', () => {
  beforeEach(() => {
    const authServiceMock: Partial<AuthService> = {
      userInfo$: new BehaviorSubject<IUserInfoWithRole>(
        userInfoWithRoleMock,
      ).asObservable(),
    };
    TestBed.configureTestingModule({
      imports: [OAuthModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: Window, useValue: window },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
    guard = TestBed.inject(ApplicationsModuleGuard);
  });

  it('should return true', async () => {
    const canActivate = await guard.canActivate();
    expect(canActivate).toBeTrue();
  });
});

describe('ApplicationsModuleGuard when user is logged in and is Business Security Analyst', () => {
  beforeEach(() => {
    const authServiceMock: Partial<AuthService> = {
      userInfo$: new BehaviorSubject<IUserInfoWithRole>({
        ...userInfoWithRoleMock,
        role: Roles.AnalistaSegurancaEmpresarial,
      }).asObservable(),
    };
    TestBed.configureTestingModule({
      imports: [OAuthModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: Window, useValue: window },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
    guard = TestBed.inject(ApplicationsModuleGuard);
  });

  it('should return true', async () => {
    const canActivate = await guard.canActivate();
    expect(canActivate).toBeTrue();
  });
});

describe('ApplicationsModuleGuard when user is logged in and is PAEBM', () => {
  beforeEach(() => {
    const authServiceMock: Partial<AuthService> = {
      userInfo$: new BehaviorSubject<IUserInfoWithRole>({
        ...userInfoWithRoleMock,
        role: Roles.Paebm,
      }).asObservable(),
    };
    TestBed.configureTestingModule({
      imports: [OAuthModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: Window, useValue: window },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
    guard = TestBed.inject(ApplicationsModuleGuard);
  });

  it('should return false', async () => {
    const canActivate = await guard.canActivate();
    expect(canActivate).toBeFalse();
  });
});

describe('ApplicationsModuleGuard when user is logged in and is Operation Analyst', () => {
  beforeEach(() => {
    const authServiceMock: Partial<AuthService> = {
      userInfo$: new BehaviorSubject<IUserInfoWithRole>({
        ...userInfoWithRoleMock,
        role: Roles.AnalistaOperacional,
      }).asObservable(),
    };
    TestBed.configureTestingModule({
      imports: [OAuthModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: Window, useValue: window },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
    guard = TestBed.inject(ApplicationsModuleGuard);
  });

  it('should return false', async () => {
    const canActivate = await guard.canActivate();
    expect(canActivate).toBeFalse();
  });
});

describe('ApplicationsModuleGuard when user has null role', () => {
  beforeEach(() => {
    const authServiceMock: Partial<AuthService> = {
      userInfo$: new BehaviorSubject<IUserInfoWithRole>({
        ...userInfoWithRoleMock,
        role: null,
      }).asObservable(),
    };
    TestBed.configureTestingModule({
      imports: [OAuthModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: Window, useValue: window },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
    guard = TestBed.inject(ApplicationsModuleGuard);
  });

  it('should return false', async () => {
    const canActivate = await guard.canActivate();
    expect(canActivate).toBeFalse();
  });
});
