"use client";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { registerStore } from "@8hourrelay/store";
import { RaceEntry, Team } from "@8hourrelay/models";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/header";

import { ShowSizeChart } from "./ShowShirtSizeChart";
import { FormSkeleton } from "@/components/FormSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmUpdateDialog } from "./ConfirmUpdate";

const raceFormSchema = z
  .object({
    firstName: z.string().nonempty({ message: "First name is required" }),
    lastName: z.string().nonempty({ message: "Last name is required" }),
    phone: z.string().nonempty({ message: "Phone number is required" }),
    gender: z.enum(["Male", "Female"]),
    birthYear: z
      .string()
      .regex(new RegExp(`^[0-9]{4}$`), { message: "Enter 4 digits birth year" })
      .length(4, { message: "Must be 4 digits" }),
    emergencyName: z
      .string()
      .min(2, { message: "Emergency contact name is required" }),
    emergencyPhone: z
      .string()
      .nonempty({ message: "Emgergency phone number is required" }),
    size: z.string().nonempty({ message: "Select your shirt size" }),
    wechatId: z.string(),
    personalBest: z.string(),
    preferName: z.string().optional(),
  })
  .passthrough();

type RaceFormValues = z.infer<typeof raceFormSchema>;

function EditRegisterForm({ race }: { race: RaceEntry }) {
  const router = useRouter();

  const defaultValues = race;

  console.log(`defaultValues`, { ...defaultValues });
  const form = useForm<RaceFormValues>({
    resolver: zodResolver(raceFormSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) =>
      console.log(`Something change`, value, name, type)
    );
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = async (values) => {
    console.log(`Updated Form data`, { values });
    const form = { ...values };
    await registerStore.updateRaceEntry(form as RaceEntry);
    router.push("/account/myrace");
  };

  return (
    <div className="w-full md:w-[1024px] container mx-auto">
      <DashboardHeader
        heading="Edit Race Registration"
        text="Update your current race entry"
      ></DashboardHeader>
      <Form {...form}>
        <form className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Participant Information</CardTitle>
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <CardDescription className="">
                  Update the participant information below.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-2 mt-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} disabled />
                      </FormControl>
                      <FormDescription>
                        Participant first name as it appears on the government
                        issued ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} disabled />
                      </FormControl>
                      <FormDescription>
                        Participant last name as it appears on the government
                        issued ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={
                          field.onChange as (value: string) => void
                        }
                        disabled
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Male", "Female"].map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Gender of the participant
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prefer name</FormLabel>
                      <FormControl>
                        <Input placeholder="Prefer Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Set the prefer name or nick name for the participant
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Participant mobile number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of birth</FormLabel>
                      <FormControl>
                        <Input placeholder="Year of birth" {...field} />
                      </FormControl>
                      <FormDescription>
                        Participant year of birth
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between pr-2">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem className="flex flex-col mt-2 w-1/2">
                        <FormLabel>Size</FormLabel>
                        <Select
                          onValueChange={
                            field.onChange as (value: string) => void
                          }
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {registerStore.shirtSizeOptions.map((r) => (
                              <SelectItem key={r.label} value={r.value}>
                                {r.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormDescription>
                          Size of shirt for the participant
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ShowSizeChart />
                </div>
                <FormField
                  control={form.control}
                  name="wechatId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WeChat ID</FormLabel>
                      <FormControl>
                        <Input placeholder="WeChat ID" {...field} />
                      </FormControl>
                      <FormDescription>Optional WeChat ID</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personalBest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal Best</FormLabel>
                      <FormControl>
                        <Input placeholder="Personal Best" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional peronal best time from the pervious race
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="emergencyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency contact name</FormLabel>
                      <FormControl>
                        <Input placeholder="Emergency Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Emergency contact name will be used to contact in case
                        of emergency
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency contact phone number</FormLabel>
                      <FormControl>
                        <Input placeholder="Emergency Phone" {...field} />
                      </FormControl>
                      <FormDescription>
                        Emergency contact phone number will be used to contact
                        in case of emergency
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <CardFooter className="grid grid-cols-2 gap-5">
            <ConfirmUpdateDialog onSubmit={form.handleSubmit(onSubmit)} />
            <Button
              type="reset"
              variant="outline"
              disabled={registerStore.isLoading ? true : false}
              onClick={() => {
                router.push("/account/myrace");
              }}
            >
              Cancel
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}

export default observer(EditRegisterForm);
