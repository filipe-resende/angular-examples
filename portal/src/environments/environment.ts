/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
export const environment = {
  production: false,
  version: require('../../package.json').version,
  authUri: 'https://dsjwtssoauth.api.valeglobal.net/v2/.auth/token',
  notificationApi: 'https://vale-notifications-api-qa.azurewebsites.net/api/',
  geographUri: 'https://geographic-api-dev.azurewebsites.net/api/',
  buMgmtUri: 'https://businessunitmgmt-api-dev.azurewebsites.net/',
  detectorsUri: 'https://detectors-api-qa.valedigital.io/api',
  thingsManagementPortalUrl:
    'https://things-management-portal-dev.valedigital.io/',
  thingsManagmentUri: 'https://things-management-api-dev.valedigital.io/api/',
  thingsManagmentUsername: '0872c107-478c-4ef5-b08b-4a6ebf68baa0',
  thingsManagmentPassword: '11aacd15-4e35-48fb-a194-200789649780',
  locationPanicEventSignalR:
    'https://panic-alerts-signalr-qa.azurewebsites.net/api',
  locationBff: 'https://location-bff-qa.valeglobal.net/api/',
  locationSuiteBff: 'https://location-suite-gap-bff.valedigital.io',
  clientId: '00cdebc9-332c-4b85-beb4-5e295ce8bcc5',
  scope: 'bu_mgmt_api,op_insp_api',
  notifyAppId: '9',
  configuration: 'development',
  azureAd: {
    clientId: '46bb19aa-6dee-4174-a986-1977ddec2d03',
    authority:
      'https://login.microsoftonline.com/7893571b-6c2c-4cef-b4da-7d4b266a0626',
    scopes: {
      userImpersonation:
        'api://46bb19aa-6dee-4174-a986-1977ddec2d03/user_impersonation'
    }
  },
  auth: {
    issuer: 'https://ids-dev.valeglobal.net/nidp/oauth/nam',
    loginUrl: 'https://ids-dev.valeglobal.net/nidp/oauth/nam/authz',
    tokenEndpoint: 'https://ids-dev.valeglobal.net/nidp/oauth/nam/token',
    userinfoEndpoint: 'https://ids-dev.valeglobal.net/nidp/oauth/nam/userinfo',
    logoutUrl: 'https://ids-dev.valeglobal.net/nidp/app/logout',
    redirectUri: window.location.origin,
    dummyClientSecret:
      'o3ZYOmzescRYdF8ne12BFTRHfrWUWjrx63S-dfftGuBlLZyL46JVmiAmn8C_iERbwNil_H13Mi1whvSEB7qn3w',
    clientId: 'cff5ea49-b9ba-4e1a-9c37-fde778cf96eb',
    responseType: 'code',
    scope: 'Identity gap',
    oidc: false,
    timeoutFactor: 0.5,
    showDebugInformation: true,
    customQueryParams: {
      acr_values: 'uri/gap'
    }
  },
  apiSmsZenvia: {
    baseUri: 'https://api-rest.zenvia.com/services',
    username: 'vale.teste.apiurg',
    password: 'mqRxNFju9n'
  },
  corporateSms: {
    baseUri: 'https://corporatesms-api-prod.azurewebsites.net/api',
    clientId: 'ecab5f4d-729f-465d-b17b-d66b239e63a8',
    clientSecret:
      'ImshZBbkvIfi4ew+XQMlavJOx3ipfhb2yei8ayh/o9d3lGb3wlSXIdPNCwENtK' +
      'b5WM5Q38NnHn1pN49Wf217oOmYzOJXKQkuTApHF/4CCeXCexinx2hIrqiVpzkhxQ62' +
      'xT0c7n6dmXEx1o2exyJTbQjm66M9S3laIoY82tHHFZI=',
    appId: 'ecab5f4d-729f-465d-b17b-d66b239e63a8'
  },
  plataformName: 'global_access_portal',
  azureSubscriptionKey: ''
};
