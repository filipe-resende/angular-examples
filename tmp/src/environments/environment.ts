import { AuthConfig } from 'angular-oauth2-oidc';

export const environment = {
  production: false,
  detectorsApiUrl: 'https://detectors-api-qa.valedigital.io/api',
  chartsApiUrl: 'https://app-charts-api-001-qa.azurewebsites.net/api',
  thingsManagementApiUrl:
    'https://things-management-api-qa.azurewebsites.net/api',
  thingsManagementBffUrl:
    'https://things-management-bff-qa.azurewebsites.net/api',
  locationPlatformApiUrl:
    'https://location-platform-api-qa.azurewebsites.net/api',
  geometriesApiUrl: 'https://geometries-api-qa.valedigital.io/api',
  thingsManagementApiUsername: '#{usernamePortal}#',
  thingsManagementApiPassword: '#{passwordPortal}#',
  valeAreasManagementApiUrl:
    'https://vale-areas-management-api-qa.azurewebsites.net',
  Authorization() {
    return btoa(
      `${this.thingsManagementApiUsername}:${this.thingsManagementApiPassword}`,
    );
  },
  appInsights: {
    instrumentationKey: '#{instrumentationKeyDEV}#',
  },
  // criar variavel no Azure DevOps
  appInsightsApiKey: { 'x-api-key': '#{appInsightsApiKeyDEV}#' },
  applicationIdKey: '#{applicationIdKeyDEV}#',
  appInsightsApi() {
    return `https://api.applicationinsights.io/v1/apps/${this.applicationIdKey}`;
  },
  gapPortalUrl: 'https://gap-portal-dev.azurewebsites.net',
  userAgreementApiUrl: 'https://useragreement-api-dev.azurewebsites.net/api',
  platformName: 'things_management_portal',
  auth: {
    issuer: 'https://ids-dev.valeglobal.net/nidp/oauth/nam',
    loginUrl: 'https://ids-dev.valeglobal.net/nidp/oauth/nam/authz',
    tokenEndpoint: 'https://ids-dev.valeglobal.net/nidp/oauth/nam/token',
    userinfoEndpoint: 'https://ids-dev.valeglobal.net/nidp/oauth/nam/userinfo',
    logoutUrl: 'https://ids-dev.valeglobal.net/nidp/app/logout',
    redirectUri: window.location.origin,
    dummyClientSecret: '',
    clientId: 'f4185e46-fcf3-4902-8530-13e5401c5d4a',
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
