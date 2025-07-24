import GoogleProvider from 'next-auth/providers/google';

import { AuthOptions } from 'next-auth';

import SecretsManagerUtil from '@common/aws/SecretsManagerUtil';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: await SecretsManagerUtil.getSecretValue(process.env.PROJECT_SECRET!, 'GOOGLE_CLIENT_ID', true),
      clientSecret: await SecretsManagerUtil.getSecretValue(process.env.PROJECT_SECRET!, 'GOOGLE_CLIENT_SECRET', true),
    })
  ],
  secret: await SecretsManagerUtil.getSecretValue(process.env.PROJECT_SECRET!, 'NEXTAUTH_SECRET', true),
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        if (account.access_token) {
          token.tokens = token.tokens || [];
          token.tokens.push(
            {
              provider: account.provider,
              accessToken: account.access_token
            }
          );
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.tokens = token.tokens || [];
      return session;
    }
  }
}
