import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import assert from 'assert';
import {GetUserById} from "@/model/user";
import {query} from "@/lib/utils/db/mysql";

export const {
  handlers: {GET, POST},
  auth,
  signOut,
  signIn,
} = NextAuth({
  callbacks: {
    redirect: async ({url, baseUrl}) => {
      return baseUrl;
    },
    session: async ({token, session}) => {
      if (token.sub && session.user) {
        session.userId = token.sub;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
    jwt: async ({token}) => {
      if (!token.sub) return token;

      const user = await query({query:'SELECT * FROM users WHERE id = ?', values:token.sub});
      assert(user);
      token.role = user.role;

      return token;
    },
  },
  session: {strategy: 'jwt'},
  ...authConfig
});
