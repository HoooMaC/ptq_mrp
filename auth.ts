import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import assert from 'assert';
import {GetUserById, User} from "@/model/user";

export const {
  handlers: {GET, POST},
  auth,
  signOut,
  signIn,
} = NextAuth({
  callbacks: {
    session: async ({token, session}) => {
      if (token.user && session.user) {
        session.user = token.user as User;
      }
      return session;
    },
    jwt: async ({token,user}) => {
      if (user) {
        const userDB = await GetUserById(user.id as string, undefined);
        if (userDB.success && userDB.user) {
          const {user} = userDB;
          token.user = user;
        }
      }
      return token;
    },
  },
  session: {strategy: 'jwt'},
  ...authConfig
});
