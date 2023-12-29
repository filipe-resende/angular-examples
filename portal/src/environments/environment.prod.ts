/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
export const environment = {
  production: true,
  version: require('../../package.json').version,
  authUri: 'https://dsjwtssoauth.api.valeglobal.net/v2/.auth/token',
  notificationApi: 'https://vale-notifications-api-prod.valedigital.io/api/',
  geographUri: 'https://geographic.api.valeglobal.net/api/',
  buMgmtUri: 'https://businessunitmgmt-api-prod.azurewebsites.net/',
  detectorsUri: 'https://detectors-api.valedigital.io/api',
  thingsManagementPortalUrl: 'https://things-management-portal.valedigital.io/',
  thingsManagmentUri: 'https://things-management-api.valedigital.io/api/',
  thingsManagmentUsername: 'ecca4782-19b9-4d05-8b2a-19b2cf979b06',
  thingsManagmentPassword: 'd8b36108-60c1-4893-aa62-22d61435bf5a',
  locationPanicEventSignalR: 'https://panic-alerts-signalr.valedigital.io/api',
  locationBff: 'https://location-bff-prod.valedigital.io/api/',
  locationSuiteBff: 'https://location-suite-gap-bff.valedigital.io',
  notifyAppId: '8,10',
  configuration: 'prod',
  azureAd: {
    clientId: 'ca54ccf6-b2e3-47c1-8d33-b1bfa4f1af33',
    authority:
      'https://login.microsoftonline.com/7893571b-6c2c-4cef-b4da-7d4b266a0626',
    scopes: {
      userImpersonation:
        'api://ca54ccf6-b2e3-47c1-8d33-b1bfa4f1af33/user_impersonation'
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
  azureSubscriptionKey: '#{AzureMapsSubscriptionKey}#'
};
