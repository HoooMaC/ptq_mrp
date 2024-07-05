import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';

import assert from 'assert';

import {GetUserByEmail} from "@/model/user";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async credentials => {
        const { email, password } = credentials;

        if(!email || !password || typeof password !== 'string' || typeof email !== 'string') {
          throw new Error('There is no valid email or password');

        }

        assert(
            process.env.AUTH_SECRET,
            'Need to provide some AUTH_SECRET in' + ' environment variable'
        );

        const userDB = await GetUserByEmail(email);

        if (!userDB.success) throw new Error('Login failed1');
        let userPassword:string = '';

        userPassword = userDB.user?.password || '';

        const checkPassword:boolean = password === userPassword;

        if (checkPassword) {
          return user;
        } else {
          throw new Error('Login failed2');
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
