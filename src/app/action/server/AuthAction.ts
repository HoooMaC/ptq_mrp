'use server'

// TEMPORARY
import {signIn} from "@/auth";
import {AuthError} from "next-auth";


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