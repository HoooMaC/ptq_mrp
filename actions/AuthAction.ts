'use server'

// TEMPORARY
import {signIn} from "@/auth";
import {AuthError} from "next-auth";
import axios from "axios";
import {User} from "@/model/user";
import {redirect} from "next/navigation";
import zod from "zod";
import {LoginSchema} from "@/schemas/auth-schema";

const MRP_LINK = process.env.MRP_LINK;

interface RegisterProps {
  email: string;
  name: string;
  username: string;
  password: string;
  role_id: number;
}

export async function RegisterAction(props: RegisterProps) {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({...props}),
    });

    if (!response.ok) {
      console.log(`response status: ${response.status}`);
      return {error: `HTTP error! status: ${response.status}`};
    }

    console.log({response});

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      const data = await response.json();
      return {succes: true, data: data};
    } else {
      const text = await response.text();
      return {error: `Expected JSON response but got text/HTML ${text}`};
    }
  } catch (error) {
    // @ts-ignore
    console.log({error: `Error posting data:  ${error.message}`})
    // @ts-ignore
    return {error: `Error posting data:  ${error.message}`};

  }
}

export async function LoginAction(values: zod.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success)
    return {response: {error: 'Invalid Fields'}};
  const {email, password} = validatedFields.data;
  const response = await axios.post(`${MRP_LINK}/api/login`, {
        email,
        password,
      },
  );

  if (response.status !== 200) {
    return {response: {error: 'Login failed1.'}};
  }

  if (response.data.success) {
    const user: User = response.data.user;
    // console.log({user})
    try {
      await signIn('credentials', {...user})
      return {response: {success: 'Login Success'}};

    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return {response: {error: 'Invalid credentials'}};
          case 'JWTSessionError':
            return {response: {error: 'JWTSessionError'}};
          default:
            return {response: {error: 'Login failed2'}};
        }
      }
      throw error;
    }
  }
  return {response: {error: 'Login failed3.'}};
}