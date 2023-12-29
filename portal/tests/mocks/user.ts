import { AccountInfo } from "@azure/msal-browser";

export const ACCESS_TOKEN_MOCK_USER_EMAIL = "C0@teste.com";
export const ACCESS_TOKEN_MOCK_USER_NAME = "Usuario de teste";

export const DEFAULT_USER_MOCK : AccountInfo = {
  username: ACCESS_TOKEN_MOCK_USER_NAME,
  homeAccountId: "",
  environment: "test enviroment",
  tenantId: "5ed7bfc3-8289-4e06-95e1-2d4cb92e8749",
  localAccountId: "test enviroment",
  idTokenClaims: {
    roles: [
      "site_br_es_all",
      "paebm"
    ],
    email: ACCESS_TOKEN_MOCK_USER_EMAIL
  }
};
