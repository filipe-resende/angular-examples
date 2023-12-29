import { AuthConfig } from 'angular-oauth2-oidc';

export const environment = {
  production: true,
  detectorsApiUrl: 'https://detectors-api.valedigital.io/api',
  chartsApiUrl:
    'https://things-management-charts-api-prd.azurewebsites.net/api',
  thingsManagementApiUrl: 'https://things-management-api.valedigital.io/api',
  thingsManagementBffUrl: 'https://things-management-bff.valedigital.io/api',
  locationPlatformApiUrl: 'https://location-platform-api.valedigital.io/api',
  geometriesApiUrl: 'https://geometries-api.valedigital.io/api',
  thingsManagementApiUsername: '#{usernamePortal}#',
  thingsManagementApiPassword: '#{passwordPortal}#',
  valeAreasManagementApiUrl:
    'https://vale-areas-management-api.azurewebsites.net',
  Authorization() {
    return btoa(
      `${this.thingsManagementApiUsername}:${this.thingsManagementApiPassword}`,
    );
  },
  appInsights: {
    instrumentationKey: '#{instrumentationKey}#',
  },
  appInsightsApiKey: { 'x-api-key': '#{appInsightsApiKey}#' },
  applicationIdKey: '#{applicationIdKey}#',
  appInsightsApi() {
    return `https://api.applicationinsights.io/v1/apps/${this.applicationIdKey}`;
  },
  gapPortalUrl: 'https://globalaccessportal.valeglobal.net',
  userAgreementApiUrl: 'https://useragreement-api.valedigital.io/api',
  platformName: 'things_management_portal',
  azureAd: {
    clientId: '2e8f9bf5-74bb-4c0f-844e-448ee1db26bc',
    authority:
      'https://login.microsoftonline.com/7893571b-6c2c-4cef-b4da-7d4b266a0626',
    scopes: {
      userImpersonation:
        'api://2e8f9bf5-74bb-4c0f-844e-448ee1db26bc/user_impersonation',
    },
  },
  auth: {
    issuer: 'https://ids-prd.valeglobal.net/nidp/oauth/nam',
    loginUrl: 'https://ids-prd.valeglobal.net/nidp/oauth/nam/authz',
    tokenEndpoint: 'https://ids-prd.valeglobal.net/nidp/oauth/nam/token',
    userinfoEndpoint: 'https://ids-prd.valeglobal.net/nidp/oauth/nam/userinfo',
    logoutUrl: 'https://ids-prd.valeglobal.net/nidp/app/logout',
    redirectUri: `${window.location.origin}/`,
    dummyClientSecret: '#{iamClientSecret}#',
    clientId: '#{iamClientId}#',
    responseType: 'code',
    scope: 'things-management-portal',
    oidc: false,
    timeoutFactor: 0.5,
    showDebugInformation: false,
    customQueryParams: {
      acr_values: 'uri/things-management-portal',
    },
  } as AuthConfig,
};
