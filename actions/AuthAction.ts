'use server'

// TEMPORARY
import {signIn} from "@/auth";
import {AuthError} from "next-auth";

import fetch from "node-fetch";

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

export async function LoginAction({email, password}: {
  email: string,
  password: string
}) {
  try {
    await signIn('credentials', {
      email,
      password,
    });
    return {response: {succes: 'Login Sucessful'}};
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {response: {error: 'Invalid credentials'}};
        case 'JWTSessionError':
          return {response: {error: 'JWTSessionError'}};
        default:
          return {response: {error: 'Something went wrong'}};
      }
    }
    throw error;
  }
}