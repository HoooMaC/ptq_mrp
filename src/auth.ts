import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import assert from 'assert';
import {GetUserById} from "@/model/user";

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
    session: async ({token, session, user}) => {

      if (token.user && session.user) {
        // TODO CHECK
        // @ts-ignore
        session.user = token.user;
      }
      // console.log({token, session});
      return session;
    },
    jwt: async ({token,user}) => {
      if (user) {
        token.userId = user[0].id;
      }
      // console.log({token});
      if (!token.userId) return token;

      const userDB = await GetUserById(token.userId);
      assert(userDB);

      if(userDB.success && userDB.user)
      {
        const {user} = userDB;
        token.user = user;
      }

      // console.log({user: userDB});

      return token;
    },
  },
  session: {strategy: 'jwt'},
  ...authConfig
});
