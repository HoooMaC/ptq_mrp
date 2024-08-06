'use client'
import React, {startTransition, useState, useTransition} from 'react'
import zod, {util, z} from 'zod';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Form,
  FormControl, FormDescription,
  FormField,
  FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form";
import { format } from 'date-fns';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {User} from "@/model/user";
import { Calendar } from '@/components/ui/calendar';
import {CalendarIcon, Check, ChevronsUpDown} from "lucide-react";
import {cn} from "@/lib/utils";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {surahs} from "@/model/quran";
import {
  Command,
  CommandEmpty, CommandGroup,
  CommandInput, CommandItem,
  CommandList
} from "@/components/ui/command";
import {all} from "axios";
import {LoginSchema} from "@/schemas/auth-schema";
import {RecordZiyaadahByPage, ZiyaadahData} from "@/model/ziyaadah";


const ZiyaadahByPageSchema = zod.object({
  reviewer_name: z.string(),
  page_start: z.preprocess((a) => parseInt(z.string().parse(a), 10),
      z.number().gte(1, 'Must be 1 and above')),
  page_end: z.preprocess((a) => parseInt(z.string().parse(a), 10),
      z.number().lte(604, 'Must be 604 and below')),
  date: z.date(),
})

const MemorizationByVerseForm = ({user, all_reviewers}: { user: User, all_reviewers: User[] }) => {
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState<Response | undefined>({
    error: '',
    success: ''
  })
  const form = useForm<z.infer<typeof ZiyaadahByPageSchema>>({
    resolver: zodResolver(ZiyaadahByPageSchema),
    // defaultValues: {}
  });

  function onSubmit(values: z.infer<typeof ZiyaadahByPageSchema>) {
    startTransition(() => {
      console.log({values})

      const validatedFields = LoginSchema.safeParse(values);

      if (!validatedFields.success)
      {
        // return {response: {error: 'Invalid Fields'}};
        console.log('Validation Error');
      }

      const data :ZiyaadahData = {
        UserID: user.id,
        ReviewerID: all_reviewers.find(reviewer => reviewer.name === values.reviewer_name)?.id,
        StartPage: values.page_start,
        EndPage: values.page_end,
        ZiyaadahDate: values.date
      }

      // send values to api
      RecordZiyaadahByPage(data).then(data => console.log({data}));

    });
  }

  return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>

            <FormField
                control={form.control}
                name="reviewer_name"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Reviewer</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                    "w-[200px] justify-between",
                                    !field.value && "text-muted-foreground"
                                )}
                            >
                              {field.value
                                  ? all_reviewers.find(reviewer => reviewer.name === field.value)?.name
                                  : "Select Reviewer"}
                              <ChevronsUpDown
                                  className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search reviewer..." />
                            <CommandList>
                              <CommandEmpty>No reviewer found.</CommandEmpty>
                              <CommandGroup>
                                {all_reviewers.map(reviewer => (
                                    <CommandItem
                                        value={reviewer.name}
                                        key={reviewer.id} // Use id here instead of name for uniqueness
                                        onSelect={() => {
                                          form.setValue("reviewer_name", reviewer.name);
                                          field.onChange(reviewer.name); // Update the field value with reviewer id
                                        }}
                                    >
                                      <Check
                                          className={cn(
                                              "mr-2 h-4 w-4",
                                              reviewer.name === field.value ? "opacity-100" : "opacity-0"
                                          )}
                                      />
                                      {reviewer.name}
                                    </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                )}
            />


            <FormField
                control={form.control}
                name='page_start'
                render={({field}) => {
                  return (
                      <FormItem>
                        <FormLabel>Page Start</FormLabel>
                        <FormControl>
                          <Input {...field} type='number' placeholder='1'
                                 min={1}
                                 max={604}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  );
                }}
            />


            <FormField
                control={form.control}
                name="page_end"
                render={({field}) => (
                    <FormItem>
                      <FormLabel>Page end</FormLabel>
                      <FormControl>
                        <Input
                            placeholder="1"
                            type="number"
                            {...field}
                            min={form.getValues('page_start')}
                            disabled={!form.getValues('page_start')}
                            max={604}
                            {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                    <FormItem className='form_item flex h-full basis-1/2 flex-col'>
                      <FormLabel>Select Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                                variant={'outline'}
                                className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                )}
                            >
                              {field.value ? (
                                  format(field.value, 'PPPP')
                              ) : (
                                  <span>Pick a date</span>
                              )}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                              mode='single'
                              selected={field.value}
                              onSelect={field.onChange}
                              // disabled={date => {
                              //   const maxDate = new Date();
                              //   maxDate.setDate(maxDate.getDate() + 14);
                              //   const today = new Date();
                              //   today.setDate(today.getDate() - 1);
                              //   return date < today || date > maxDate;
                              // }}
                              initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage></FormMessage>
                    </FormItem>
                )}
            />


            <Button disabled={isPending} type='submit' variant='default'
                    className='w-full'>
              Submit Record
            </Button>
          </form>
        </Form>
      </>
  )
}
export default MemorizationByVerseForm
