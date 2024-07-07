import Credentials from 'next-auth/providers/credentials';
import {CredentialsSignin, NextAuthConfig} from 'next-auth';

import assert from 'assert';

import {GetUserByEmail, User} from "@/model/user";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async credentials => {
        assert(
            process.env.AUTH_SECRET,
            'Need to provide some AUTH_SECRET in' + ' environment variable'
        );

        const {email, password} = credentials;

        if (!email || !password || typeof password !== 'string' || typeof email !== 'string') {
          // throw new Error('There is no valid email or password');
          throw new CredentialsSignin('Email or Password wrong');
        }

        const userDB = await GetUserByEmail(email);
        if (userDB.success) {
          const userPassword = userDB.user?.password || '';
          const checkPassword: boolean = password === userPassword;

          if (checkPassword) {
            return userDB.user as User;
          }
        }
        throw new CredentialsSignin('Email or Password wrong');
      },
    }),
  ],
} satisfies NextAuthConfig;
