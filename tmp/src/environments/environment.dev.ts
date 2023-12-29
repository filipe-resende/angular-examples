import { AuthConfig } from 'angular-oauth2-oidc';

export const environment = {
  production: false,
  detectorsApiUrl: 'https://app-detectors-api-dev.azurewebsites.net/api',
  chartsApiUrl: 'https://app-charts-api-001-dev.azurewebsites.net/api',
  thingsManagementApiUrl:
    'https://app-things-management-api-001-dev.azurewebsites.net/api',
  thingsManagementBffUrl:
    'https://app-things-management-bff-001-dev.azurewebsites.net/api',
  locationPlatformApiUrl:
    'https://location-platform-api-dev.azurewebsites.net/api',
  geometriesApiUrl: 'https://geometries-api-dev.valedigital.io/api',
  thingsManagementApiUsername: '#{thingsManagementApiUsernameDev}#',
  thingsManagementApiPassword: '#{thingsManagementApiPasswordDev}#',
  valeAreasManagementApiUrl:
    'https://vale-areas-management-api-dev.azurewebsites.net',
  Authorization() {
    return btoa(
      `${this.thingsManagementApiUsername}:${this.thingsManagementApiPassword}`,
    );
  },
  appInsights: {
    instrumentationKey: '6c04751f-3029-4f95-b896-62212a7ef3ba',
  },
  appInsightsApiKey: {
    'x-api-key': 'qh1m0fsrltinoyvlanfk78q8mkh7ky4ly3cibiu5',
  },
  applicationIdKey: '5e1e583c-d22e-4deb-b300-8cb87a4066a1',
  appInsightsApi() {
    return `https://api.applicationinsights.io/v1/apps/${this.applicationIdKey}`;
  },
  gapPortalUrl: 'https://gap-portal-dev.azurewebsites.net',

  userAgreementApiUrl:
    'https://app-useragreement-api-001-dev.azurewebsites.net/api',
  platformName: 'things_management_portal',
  azureAd: {
    clientId: '715f3f51-a5c8-4925-949c-cd20f984e331',
    authority:
      'https://login.microsoftonline.com/7893571b-6c2c-4cef-b4da-7d4b266a0626',
    scopes: {
      userImpersonation:
        'api://715f3f51-a5c8-4925-949c-cd20f984e331/user_impersonation',
    },
  },
  auth: {
    issuer: 'https://ids-dev.valeglobal.net/nidp/oauth/nam',
    loginUrl: 'https://ids-dev.valeglobal.net/nidp/oauth/nam/authz',
    tokenEndpoint: 'https://ids-dev.valeglobal.net/nidp/oauth/nam/token',
    userinfoEndpoint: 'https://ids-dev.valeglobal.net/nidp/oauth/nam/userinfo',
    logoutUrl: 'https://ids-dev.valeglobal.net/nidp/app/logout',
    redirectUri: `${window.location.origin}/`,
    dummyClientSecret: '#{iamClientSecretDev}#',
    clientId: '#{iamClientIdDev}#',
    responseType: 'code',
    scope: 'things-management-portal',
    oidc: false,
    timeoutFactor: 0.5,
    showDebugInformation: false,
    customQueryParams: {
      acr_values: 'uri/things-management-portal',
    },
    requireHttps: false,
  } as AuthConfig,
};
