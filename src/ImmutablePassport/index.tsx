import { config, passport } from '@imtbl/sdk';
import { CLIENT_ID } from 'constants/config';

const passportInstance = new passport.Passport({
  baseConfig: new config.ImmutableConfiguration({
    environment: config.Environment.SANDBOX,
  }),
  clientId: `${CLIENT_ID}`,
  redirectUri: 'http://localhost:3000/redirect',
  logoutRedirectUri: "http://localhost:3000/logout",
  audience: "platform_api",
  scope: "openid offline_access email transact",
});

const provider: any = passportInstance.connectEvm();

async function handleRedirect() {
  if (window.location.pathname === "/redirect") {
    await passportInstance.loginCallback();
  }
}

handleRedirect();

const main = { provider, passportInstance };

export default main;
