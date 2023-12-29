/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
export const environment = {
  production: false,
  version: require('../../package.json').version,
  notificationApi: 'https://vale-notifications-api-dev.azurewebsites.net/api/',
  geographUri: 'https://geographic-api-dev.azurewebsites.net/api/',
  detectorsUri: 'https://app-detectors-api-dev.azurewebsites.net/api',
  thingsManagementPortalUrl:
    'https://things-management-portal-dev.valedigital.io/',
  thingsManagmentUri: 'https://things-management-api-dev.valedigital.io/api/',
  thingsManagmentUsername: '176b84ac-7ee5-49df-adc6-e2119b8a33ea',
  thingsManagmentPassword: 'e2d85dc3-db46-4465-8d0b-dd4337f0c3a4',
  locationPanicEventSignalR:
    'https://func-panic-alerts-signalr-dev.azurewebsites.net/api',
  locationBff: 'https://app-gap-bff-dev.azurewebsites.net/api/',
  locationSuiteBff: 'https://app-location-suite-gap-bff-dev.azurewebsites.net',
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
