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

import {AuthError} from "next-auth";

import {LoginAction} from "@/actions/AuthAction";
import {hashPassword} from "@/lib/utils/hash";

const LoginForm = ({salt}: { salt: string }) => {
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

    const loginHashedPassword: string = hashPassword(password, salt);
    try {
      await LoginAction({email, password: loginHashedPassword})
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin" :
            setError(error.message);
            break;
          default:
            setError("Something went wrong");
            break;
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
