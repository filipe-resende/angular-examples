import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { Roles } from 'src/app/shared/enums/iam.enums';
import {
  IUserInfoIamResponse,
  IUserInfoWithRole,
} from 'src/app/shared/interfaces/iam.interfaces';
import { userInfoIamResponseMock } from 'src/app/tests/auth-service-mocks';
import { Spied, timeout } from 'src/app/tests/test-helper';
import { AuthService } from './auth.service';

let oAuthServiceSpy: Spied<OAuthService>;
const mockWindow = { location: { href: '' } };

let service: AuthService;
const oAuthServiceSpyMethodsMock = {
  tryLogin: Promise.resolve(false),
  configure: null,
  setupAutomaticSilentRefresh: null,
  hasValidAccessToken: false,
  loadUserProfile: Promise.resolve(userInfoIamResponseMock),
  initCodeFlow: null,
  logOut: null,
};

describe('AuthService', () => {
  beforeEach(() => {
    oAuthServiceSpy = jasmine.createSpyObj(
      'OAuthService',
      oAuthServiceSpyMethodsMock,
    );
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OAuthModule.forRoot()],
      providers: [
        { provide: OAuthService, useValue: oAuthServiceSpy },
        { provide: Window, useValue: mockWindow },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should call oAuthService logout method when #logout is called', () => {
    service.logout();
    expect(oAuthServiceSpy.logOut.calls.count()).toBe(1);
  });
});

describe("AuthService when IAM returns 'Admin'", () => {
  const userInfoMock = {
    info: {
      ...userInfoIamResponseMock.info,
      groupMembership: ['cn=Admin,ou=TMP,ou=Groups,o=vale'],
    },
  } as IUserInfoIamResponse;

  beforeEach(() => {
    const oAuthServiceMock = {
      ...oAuthServiceSpyMethodsMock,
      tryLogin: Promise.resolve(true),
      hasValidAccessToken: true,
      loadUserProfile: Promise.resolve(userInfoMock),
    };
    oAuthServiceSpy = jasmine.createSpyObj('OAuthService', oAuthServiceMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OAuthModule.forRoot()],
      providers: [
        { provide: OAuthService, useValue: oAuthServiceSpy },
        { provide: Window, useValue: mockWindow },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should emit user observable with role Administrador', done => {
    service.login().then(() => {
      service.userInfo$.subscribe(u => {
        expect(u.role).toBe(Roles.Administrador);
        done();
      });
    });
  });
});

describe("AuthService when IAM returns 'ADMIN'", () => {
  const userInfoMock = {
    info: {
      ...userInfoIamResponseMock.info,
      groupMembership: ['cn=ADMIN,ou=TMP,ou=Groups,o=vale'],
    },
  } as IUserInfoIamResponse;

  beforeEach(() => {
    const oAuthServiceMock = {
      ...oAuthServiceSpyMethodsMock,
      tryLogin: Promise.resolve(true),
      hasValidAccessToken: true,
      loadUserProfile: Promise.resolve(userInfoMock),
    };
    oAuthServiceSpy = jasmine.createSpyObj('OAuthService', oAuthServiceMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OAuthModule.forRoot()],
      providers: [
        { provide: OAuthService, useValue: oAuthServiceSpy },
        { provide: Window, useValue: mockWindow },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should emit user observable with role Administrador', done => {
    service.login().then(() => {
      service.userInfo$.subscribe(u => {
        expect(u.role).toBe(Roles.Administrador);
        done();
      });
    });
  });
});

describe("AuthService when IAM returns 'paebm'", () => {
  const userInfoMock = {
    info: {
      ...userInfoIamResponseMock.info,
      groupMembership: ['cn=paebm,ou=TMP,ou=Groups,o=vale'],
    },
  } as IUserInfoIamResponse;

  beforeEach(() => {
    const oAuthServiceMock = {
      ...oAuthServiceSpyMethodsMock,
      tryLogin: Promise.resolve(true),
      hasValidAccessToken: true,
      loadUserProfile: Promise.resolve(userInfoMock),
    };
    oAuthServiceSpy = jasmine.createSpyObj('OAuthService', oAuthServiceMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OAuthModule.forRoot()],
      providers: [
        { provide: OAuthService, useValue: oAuthServiceSpy },
        { provide: Window, useValue: mockWindow },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should emit user observable with role Paebm', done => {
    service.login().then(() => {
      service.userInfo$.subscribe(u => {
        expect(u.role).toBe(Roles.Paebm);
        done();
      });
    });
  });
});

describe("AuthService when IAM returns 'PAEBM'", () => {
  const userInfoMock = {
    info: {
      ...userInfoIamResponseMock.info,
      groupMembership: ['cn=PAEBM,ou=TMP,ou=Groups,o=vale'],
    },
  } as IUserInfoIamResponse;

  beforeEach(() => {
    const oAuthServiceMock = {
      ...oAuthServiceSpyMethodsMock,
      tryLogin: Promise.resolve(true),
      hasValidAccessToken: true,
      loadUserProfile: Promise.resolve(userInfoMock),
    };
    oAuthServiceSpy = jasmine.createSpyObj('OAuthService', oAuthServiceMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OAuthModule.forRoot()],
      providers: [
        { provide: OAuthService, useValue: oAuthServiceSpy },
        { provide: Window, useValue: mockWindow },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should emit user observable with role Paebm', done => {
    service.login().then(() => {
      service.userInfo$.subscribe(user => {
        expect(user.role).toBe(Roles.Paebm);
        done();
      });
    });
  });
});
