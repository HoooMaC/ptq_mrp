'use client'
import React, {startTransition, useState, useTransition} from 'react'
import zod, {util, z} from 'zod';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginSchema} from "@/schemas/auth-schema";
import {
  Form,
  FormControl, FormDescription,
  FormField,
  FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {User} from "@/model/user";
import {surahs} from "@/model/quran";
import {Check, ChevronsUpDown} from "lucide-react";
import {cn} from "@/lib/utils";
import find = util.find;


const MemorizationSchema = zod.object({
  id: z.number(),
  hafiz_id: z.number(),  // 'حافظ' dalam bahasa Arab
  musyrif_id: z.number(),  // atau 'penguji'
  surah_start: z.string().nullable(),  // text? indicates that it can be null
  verse_start: z.number().int().nullable(),  // int? indicates that it can be null
  surah_end: z.string().nullable(),  // text? indicates that it can be null
  verse_end: z.number().int().nullable(),  // int? indicates that it can be null
  page_start: z.number().int().nullable(),  // int? indicates that it can be null
  page_end: z.number().int().nullable(),  // int? indicates that it can be null
  date: z.date(),
})

const MemorizationForm = ({user}: { user: User }) => {
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState<Response | undefined>({
    error: '',
    success: ''
  })
  const form = useForm<z.infer<typeof MemorizationSchema>>({
    resolver: zodResolver(MemorizationSchema),
    defaultValues: {
      id: parseInt(user.id, 10),
      hafiz_id: parseInt(user.name, 10),
    }
  });

  function onSubmit(values: z.infer<typeof MemorizationSchema>) {
    startTransition(() => {
      // LoginAction(values).then(data => setResponse(data?.response))
    });
  }

  return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
                control={form.control}
                name="surah_start"
                render={({field}) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Surah Start</FormLabel>
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
                                  ? surahs.find(surah => surah.name === field.value)?.name
                                  : "Select surah"}
                              <ChevronsUpDown
                                  className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search surah..."/>
                            <CommandList>
                              <CommandEmpty>No surah found.</CommandEmpty>
                              <CommandGroup>
                                {surahs.map(surah => (
                                    <CommandItem
                                        value={surah.name}
                                        key={surah.name}
                                        onSelect={() => {
                                          form.setValue("surah_start", surah.name);
                                          field.onChange(surah.name); // Make
                                          // sure to update the field value
                                        }}
                                    >
                                      <Check
                                          className={cn(
                                              "mr-2 h-4 w-4",
                                              surah.name === field.value ? "opacity-100" : "opacity-0"
                                          )}
                                      />
                                      {surah.name}
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
                name="verse_start"
                render={({field}) => (
                    <FormItem>
                      <FormLabel>Verse Start</FormLabel>
                      <FormControl>
                        <Input placeholder="1" type={'number'} {...field} />
                      </FormControl>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="surah_end"
                render={({field}) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Surah End</FormLabel>
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
                                  ? surahs.find(surah => surah.name === field.value)?.name
                                  : "Select surah"}
                              <ChevronsUpDown
                                  className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search surah..."/>
                            <CommandList>
                              <CommandEmpty>No surah found.</CommandEmpty>
                              <CommandGroup>
                                {surahs.map(surah => (
                                    <CommandItem
                                        value={surah.name}
                                        key={surah.name}
                                        onSelect={() => {
                                          form.setValue("surah_end", surah.name);
                                          field.onChange(surah.name); // Make
                                          // sure to update the field value
                                        }}
                                    >
                                      <Check
                                          className={cn(
                                              "mr-2 h-4 w-4",
                                              surah.name === field.value ? "opacity-100" : "opacity-0"
                                          )}
                                      />
                                      {surah.name}
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
                name="verse_end"
                render={({field}) => (
                    <FormItem>
                      <FormLabel>Verse Start</FormLabel>
                      <FormControl>
                        <Input
                            placeholder="1"
                            type="number"
                            min={1}
                            disabled={!form.getValues('surah_end')}
                            max={surahs.find(surah => surah.name === form.getValues('surah_end'))?.verse}
                            {...field}
                        />
                      </FormControl>
                    </FormItem>
                )}
            />


            <Button disabled={isPending} type='submit' variant='default'
                    className='w-full'>
              Login Now
            </Button>
          </form>
        </Form>
      </>
  )
}
export default MemorizationForm
