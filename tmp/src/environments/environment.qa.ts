import { AuthConfig } from 'angular-oauth2-oidc';

export const environment = {
  production: false,
  detectorsApiUrl: 'https://app-detectors-api-qa.azurewebsites.net/api',
  chartsApiUrl: 'https://app-charts-api-001-qa.azurewebsites.net/api',
  thingsManagementApiUrl:
    'https://app-things-management-api-001-qa.azurewebsites.net/api',
  thingsManagementBffUrl:
    'https://app-things-management-bff-001-qa.azurewebsites.net/api',
  locationPlatformApiUrl:
    'https://location-platform-api-qa.azurewebsites.net/api',
  geometriesApiUrl: 'https://geometries-api-qa.azurewebsites.net/api',
  thingsManagementApiUsername: '#{usernamePortalQA}#',
  thingsManagementApiPassword: '#{passwordPortalQA}#',
  valeAreasManagementApiUrl:
    'https://vale-areas-management-api-qa.azurewebsites.net',
  Authorization() {
    return btoa(
      `${this.thingsManagementApiUsername}:${this.thingsManagementApiPassword}`,
    );
  },
  appInsights: {
    instrumentationKey: '#{instrumentationKeyQA}#',
  },
  // criar variavel no Azure DevOps
  appInsightsApiKey: { 'x-api-key': '#{appInsightsApiKeyQA}#' },
  applicationIdKey: '#{applicationIdKeyQA}#',
  appInsightsApi() {
    return `https://api.applicationinsights.io/v1/apps/${this.applicationIdKey}`;
  },
  gapPortalUrl: 'http://gap-portal-qa.valeglobal.net',
  userAgreementApiUrl:
    'https://app-useragreement-api-001-qa.azurewebsites.net/api',
  platformName: 'things_management_portal',
  azureAd: {
    clientId: '8a15eebd-215c-4e35-b9cb-9b0b9eb2dc1c',
    authority:
      'https://login.microsoftonline.com/7893571b-6c2c-4cef-b4da-7d4b266a0626',
    scopes: {
      userImpersonation:
        'api://8a15eebd-215c-4e35-b9cb-9b0b9eb2dc1c/user_impersonation',
    },
  },
  auth: {
    issuer: 'https://ids-qa.valeglobal.net/nidp/oauth/nam',
    loginUrl: 'https://ids-qa.valeglobal.net/nidp/oauth/nam/authz',
    tokenEndpoint: 'https://ids-qa.valeglobal.net/nidp/oauth/nam/token',
    userinfoEndpoint: 'https://ids-qa.valeglobal.net/nidp/oauth/nam/userinfo',
    logoutUrl: 'https://ids-qa.valeglobal.net/nidp/app/logout',
    redirectUri: `${window.location.origin}/`,
    dummyClientSecret: '#{iamClientSecretQa}#',
    clientId: '#{iamClientIdQa}#',
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
