'use client'
import React, { startTransition, useState} from 'react'
import {
  Form, FormControl, FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {useForm} from "react-hook-form";

import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import {RegisterSchema} from "@/schemas/auth-schema";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {hashPassword} from "@/lib/utils/hash";
import {env} from "use-sidecar/dist/es5/env";
import assert from "assert";

interface MrpAccount {
  name: string;
  username: string;
  email: string;
  password: string;
  role_id: number;
}

const RegisterForm = ({salt}:{salt:string}) => {
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    // defaultValue: {}
  });

  function onSubmit(values: z.infer<typeof RegisterSchema>) {
    console.log(values)

    assert(salt);
    const hashedPassword = hashPassword(values.password, process.env.AUTH_SECRET);
    console.log("From register")
    console.log({hashedPassword})
    console.log(salt)

    const mrpValue: MrpAccount = {
      name: values.name,
      username: values.name,
      email: values.email,
      password: hashedPassword,
      role_id: 1,
    };

    startTransition(async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...mrpValue}),
        });

        if (!response.ok) {
          console.log(`response status: ${response.status}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log({response});

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          // Success case should enter this code
          const data = await response.json();
          setResponseMessage(JSON.stringify(data, null, 2));
          setError(''); // Reset error message if request is successful
        } else {
          const text = await response.text();
          console.error('Error: Expected JSON, got:', text);
          throw new Error('Expected JSON response but got text/HTML');
        }
      } catch (error) {
        console.error('Error posting data:', error);
        // @ts-ignore
        setError(error.message);
      }
    });
  }

  return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
                control={form.control}
                name='name'
                render={({field}) => {
                  return (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} type='text' placeholder='jhon doe'/>
                        </FormControl>
                        <FormDescription>Required</FormDescription>
                        <FormMessage/>
                      </FormItem>
                  );
                }}
            />

            <FormField
                control={form.control}
                name='username'
                render={({field}) => {
                  return (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} type='text' placeholder='jhon doe'/>
                        </FormControl>
                        <FormDescription>Username should
                          unique</FormDescription>
                        <FormMessage/>
                      </FormItem>
                  );
                }}
            />
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type='password'
                                 placeholder='********'/>
                        </FormControl>
                        <FormDescription>Minimum 8
                          characters</FormDescription>
                        <FormMessage/>
                      </FormItem>
                  );
                }}
            />
            <FormField
                control={form.control}
                name='password_confirmation'
                render={({field}) => {
                  return (
                      <FormItem>
                        <FormLabel>Password Confirmation</FormLabel>
                        <FormControl>
                          <Input {...field} type='password'
                                 placeholder='********'/>
                        </FormControl>
                        <FormDescription>Minimum 8 characters</FormDescription>
                        <FormMessage/>
                      </FormItem>
                  );
                }}
            />
            <Button type='submit'>Make new Account</Button>
          </form>
        </Form>
        <div>
          {error ? <pre>{JSON.stringify(error, null, 2)}</pre> : null}
          {responseMessage && <pre>{responseMessage}</pre>}
        </div>
      </>
  )
}
export default RegisterForm
