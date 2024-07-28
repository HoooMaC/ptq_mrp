  'use client'
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Form,
  FormControl, FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import {GetUserByEmail, GetUserById, User} from "@/model/user";

const GetUserByEmailId = z.object({id: z.string()});

const Page = () => {
  const [user, setUser] = useState<User>()
  const form = useForm<z.infer<typeof GetUserByEmailId>>({
    resolver: zodResolver(GetUserByEmailId),
    // defaultValue: {}
  });

  async function onSubmit(values: z.infer<typeof GetUserByEmailId>) {
    // console.log({values})
    // do fetching here to MRPLINK
    const result = await GetUserById(values.id, 'https://mrp-staging.alham-seva.com');
    console.log({result})
    if(result.success)
      setUser(result.user)
  }

  return (
      <div className='container p-10 space-y-10'>
        <h1>get helooo user by id</h1>
        <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col'>
            <FormField
                control={form.control}
                name='id'
                render={({field}) => {
                  return (
                      <FormItem>
                        <FormLabel>id</FormLabel>
                        <FormControl>
                          <Input
                              {...field}
                              type='text'
                              placeholder='example@example.com'
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  );
                }}
            />
            <Button type='submit'>Submit</Button>
          </form>
        </Form>
        {user &&
            <div>
                <p>name: {user.name}</p>
                <p>email: {user.email}</p>
                <p>role: {user.role_id}</p>
            </div>
        }
      </div>
  )
}
export default Page
