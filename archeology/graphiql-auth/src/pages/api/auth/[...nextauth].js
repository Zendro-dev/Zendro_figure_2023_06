import NextAuth from 'next-auth';
// import decode from 'jwt-decode';
import { decode } from 'next-auth/jwt';

const OAUTH2_ISSUER = String(process.env.OAUTH2_ISSUER ?? '');
const OAUTH2_TOKEN_URI = String(process.env.OAUTH2_TOKEN_URI ?? '');
const OAUTH2_AUTH_URI = String(process.env.OAUTH2_AUTH_URI ?? '');
const OAUTH2_CLIENT_ID = String(process.env.OAUTH2_CLIENT_ID ?? '');
const OAUTH2_CLIENT_SECRET = String(process.env.OAUTH2_CLIENT_SECRET ?? '');
const NEXTAUTH_SECRET = String(process.env.NEXTAUTH_SECRET ?? '');

if (!OAUTH2_TOKEN_URI || !OAUTH2_CLIENT_ID || !OAUTH2_CLIENT_SECRET) {
  throw new Error(
    'Some mandatory OAuth2 variables in your `.env` are not being set'
  );
}

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  try {
    const formParameters = new URLSearchParams({
      client_id: String(OAUTH2_CLIENT_ID ?? ''),
      client_secret: OAUTH2_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken ?? '',
    });

    const response = await fetch(OAUTH2_TOKEN_URI, {
      body: formParameters,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

// In case your oauth provider does _not_ support OIDC, you can use the
// OAUTH2_AUTH_URI instead of the OAUTH2_ISSUER environment variable to setup
// your provider. See
// https://next-auth.js.org/configuration/providers/oauth#using-a-custom-provider
// for more info and in case your provider needs some more configuration.
const defaultProvider =
  !OAUTH2_ISSUER && OAUTH2_AUTH_URI
    ? {
        id: 'zendro',
        name: 'zendro',
        type: 'oauth',
        authorization: OAUTH2_AUTH_URI,
        token: OAUTH2_TOKEN_URI,
      }
    : {
        id: 'zendro',
        name: 'zendro',
        type: 'oauth',
        wellKnown: `${OAUTH2_ISSUER}/.well-known/openid-configuration`, // for OpenID connect clients. If your OAuth provider
        // does not implement OpenID connect you need to manually configure your endpoints.
        // See https://next-auth.js.org/configuration/providers/oauth#using-a-custom-provider
        clientId: OAUTH2_CLIENT_ID,
        clientSecret: OAUTH2_CLIENT_SECRET,
        checks: ['state', 'pkce'],
        idToken: true,
        profile(profile) {
          return {
            id: profile.sub,
            name: profile.name ?? profile.preferred_username,
          };
        },
      };

export default NextAuth({
  secret: NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    defaultProvider,
  ],
  // debug: true,
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial login
      if (account && account?.access_token && user) {
        token.accessToken = account.access_token;
        token.acccessTokenExpires = Date.now() + account.expires_in * 1000;
        token.refreshToken = account.refresh_token;
        return token;
      }
      // Return previous token if the access token has not expired yet
      if (
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires - 60 * 5 * 1000
      ) {
        return token;
      }
      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.error = token.error;
      return session;
    },
  },
});
