'use client'
import React, {useEffect, useState, useTransition} from 'react'
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
import {UserLogin} from "@/model/user";
import {signIn} from "@/auth";
import {useRouter} from "next/navigation";
import FormError from "@/components/form/FormError";

interface Response {
  error?: string;
  success?: string;
}

const LoginForm = ({salt}: { salt: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState<Response | undefined>({
      error: '',
      success: ''
  })

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // useEffect(() => {
  //   console.log('use effect')
  //   if (response?.success) {
  //     console.log('success')
  //     const timer = setTimeout(() => {
  //       console.log('timer')
  //       router.push('');
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [response?.success, router]);


  function onSubmit(values: z.infer<typeof LoginSchema>) {
    startTransition(() => {
      LoginAction(values).then(data => setResponse(data?.response))
    });
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
            <Button disabled={isPending} type='submit' variant='default'
                    className='w-full'>
              Login Now
            </Button>
          </form>
        </Form>
        <div>
          <FormError message={response?.success}/>
          <FormError message={response?.error}/>
        </div>
      </>
  )
}
export default LoginForm
