import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
} from '@azure/msal-browser';
import {
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
} from '@azure/msal-angular';
import { loginRequest, msalConfig, protectedResources } from './auth.config';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: loginRequest,
  };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string | null>>();
  protectedResourceMap.set(protectedResources.locationSuiteBff.endpoint, [
    protectedResources.locationSuiteBff.scopes.userImpersonation,
  ]);
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
    authRequest: (msalService, httpReq, originalAuthRequest) => {
      return {
        ...originalAuthRequest,
        claims: sessionStorage.getItem('claimsChallenge')
          ? window.atob(sessionStorage.getItem('claimsChallenge') as string)
          : undefined,
      };
    },
  };
}
