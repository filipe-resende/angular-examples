import {
  LogLevel,
  Configuration,
  BrowserCacheLocation
} from '@azure/msal-browser';
import { environment } from '../../../environments/environment';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

export const msalConfig: Configuration = {
  auth: {
    clientId: environment.azureAd.clientId,
    authority: environment.azureAd.authority,
    redirectUri: '/auth',
    clientCapabilities: ['CP1'],
    postLogoutRedirectUri: '/'
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: isIE
  },
  system: {
    loggerOptions: {
      loggerCallback(logLevel: LogLevel, message: string) {
        console.log(message);
      },
      logLevel: LogLevel.Error,
      piiLoggingEnabled: false
    }
  }
};

export const protectedResources = {
  locationSuiteBff: {
    endpoint: environment.locationSuiteBff,
    scopes: {
      userImpersonation: environment.azureAd.scopes.userImpersonation
    }
  },
  locationBffLegacy: {
    endpoint: environment.locationBff,
    scopes: {
      userImpersonation: environment.azureAd.scopes.userImpersonation
    }
  }
};

export const loginRequest = {
  scopes: [environment.azureAd.scopes.userImpersonation]
};
