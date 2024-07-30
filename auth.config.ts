import Credentials from 'next-auth/providers/credentials';
import {CredentialsSignin, NextAuthConfig} from 'next-auth';

import {GetUserByEmail, User} from "@/model/user";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      credentials: {
        id: {},
        name: {},
        username: {},
        password: {},
        email: {},
        phone_number: {},
        gender: {},
        birth_date: {},
        role_id: {},
        emailVerified: {},
        created_at: {},
        updated_at: {},
      },
      authorize: async credentials => {
        // please help destryct the object here
        const {
          id,
          name,
          username,
          password,
          email,
          phone_number,
          gender,
          birth_date,
          role_id,
          emailVerified,
          created_at,
          updated_at,
        } = credentials;

        // TODO: This is dangerous
        // @ts-ignore
        const user:User = {id, name, username, password, email, phone_number, gender, birth_date, role_id, emailVerified, created_at, updated_at};

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
