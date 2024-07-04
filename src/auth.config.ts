import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';

import assert from 'assert';
import {LoginSchema} from "@/schemas/auth-schema";

import {GetUserByEmail} from "@/model/user";
import {hashPassword, verifyPassword} from "@/lib/utils/hash";
import {query} from "@/lib/utils/db/mysql";
import {env} from "use-sidecar/dist/es5/env";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async credentials => {
        // const validatedFields = LoginSchema.safeParse(credentials);
        // if (!validatedFields.success) {
        //   throw new Error('Invalid format type');
        // }
        const { email, password } = credentials;

        if(!email || !password || typeof password !== 'string' || typeof email !== 'string') {
          throw new Error('There is no valid email or password');

        }

        assert(
            process.env.AUTH_SECRET,
            'Need to provide some AUTH_SECRET in' + ' environment variable'
        );

        // const hashedPassword = hashPassword(password, process.env.AUTH_SECRET);
        // console.log("auth config")
        // console.log({hashedPassword})
        // console.log(process.env.AUTH_SECRET)
        const user = await query({query: `SELECT * FROM users where email = ?`, values:email});

        console.log({email});
        console.log({user});
        if (!user) throw new Error('Login failed1');
        let userPassword:string = '';

        if(Array.isArray(user))
        {
          userPassword = user[0].password;
          console.log({userPassword});
        }



        console.log({password});
        // const checkPassword: boolean = verifyPassword(
        //     password,
        //     userPassword,
        //     process.env.AUTH_SECRET
        // );

        const checkPassword:boolean = password === userPassword;

        console.log({ checkPassword });
        if (checkPassword) {
          return user;
        } else {
          throw new Error('Login failed2');
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
