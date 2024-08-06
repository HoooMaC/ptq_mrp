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


const ZiyaadahByVerse = zod.object({
  surah_start: z.string(),  // text? indicates that it can be null
  verse_start: z.string(),  // int? indicates that it can be null
  surah_end: z.string(),  // text? indicates that it can be null
  verse_end: z.string(),  // int? indicates that it can be null
  date: z.date(),
})

const MemorizationByVerseForm = ({user}: { user: User }) => {
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState<Response | undefined>({
    error: '',
    success: ''
  })
  const form = useForm<z.infer<typeof ZiyaadahByVerse>>({
    resolver: zodResolver(ZiyaadahByVerse),
    // defaultValues: {}
  });

  function onSubmit(values: z.infer<typeof ZiyaadahByVerse>) {
    startTransition(() => {
      console.log({values})
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
                                  : "Select Surah"}
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
                name='verse_start'
                render={({field}) => {
                  return (
                      <FormItem>
                        <FormLabel>Verse Start</FormLabel>
                        <FormControl>
                          <Input {...field} type='number' placeholder='1'
                                 min={1}
                                 disabled={!form.getValues('surah_start')}
                                 max={surahs.find(surah => surah.name === form.getValues('surah_start'))?.verse}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  );
                }}
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
                                disabled={!form.getValues('surah_start')}
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
                                {surahs
                                    .slice(surahs.findIndex(surah => surah.name === form.getValues('surah_start')) || 0)
                                    .map(surah => (
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
                            {...field}
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
              Submit Record
            </Button>
          </form>
        </Form>
      </>
  )
}
export default MemorizationByVerseForm
