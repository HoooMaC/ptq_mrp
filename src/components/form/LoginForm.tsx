'use client'
import React, {useState} from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {LoginSchema} from "@/schemas/auth-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {signIn} from "@/auth";
import {AuthError} from "next-auth";
import {GetUserByEmail} from "@/model/user";
import {query} from '@/lib/utils/db/mysql'
import {LoginAction} from "@/app/action/server/AuthAction";
import {hashPassword} from "@/lib/utils/hash";

interface User {
  email: string;
  password: string;
}

const LoginForm = ({salt}:{salt:string}) => {
  // const [user, setUser] = useState<User | undefined>()
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    // defaultValue: {}
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    const validatedData = LoginSchema.safeParse(values);

    if (!validatedData.success) {
      setError("Invalid input format")
    }
    const {email, password} = validatedData.data as {
      email: string,
      password: string
    };

    const loginHashedPassword:string = hashPassword(password, salt);
    console.log("From login")
    console.log({loginHashedPassword})
    console.log(salt)

    try {
    // const user = await GetUserByEmail(email);

      // console.log("from client");
      // console.log("=====================");
      // console.log(user);
      // console.log("=====================");
      // if (user) {
        await LoginAction({email, password:loginHashedPassword})
      // }

    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin" :
            return {error: error.message};
          default:
            return {error: "Default block of error switch"}
        }
      }
      throw error;
    }


  }

  return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
                control={form.control}
                name='email'
                render={({field}) => {
                  return (
                      <FormItem>
                        <FormLabel>email</FormLabel>
                        <FormControl>
                          <Input
                              {...field}
                              type='email'
                              placeholder='example@example.com'
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  );
                }}
            />
            <FormField
                control={form.control}
                name='password'
                render={({field}) => {
                  return (
                      <FormItem>
                        <FormLabel>password</FormLabel>
                        <FormControl>
                          <Input {...field} type='password'
                                 placeholder='*******'/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  );
                }}
            />
            <Button type='submit' variant='default' className='w-full'>
              Login Now
            </Button>
          </form>
        </Form>
        <div>
          {error ? <pre>{JSON.stringify(error, null, 2)}</pre> : null}
          {responseMessage && <pre>{responseMessage}</pre>}
        </div>
      </>
  )
}
export default LoginForm
