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
import { Wavier } from "./ShowWavier";
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
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { ShowSizeChart } from "./ShowShirtSizeChart";
import { FormSkeleton } from "@/components/FormSkeleton";

const raceFormSchema = z
  .object({
    firstName: z.string().nonempty({ message: "First name is required" }),
    lastName: z.string().nonempty({ message: "Last name is required" }),
    email: z
      .string()
      .nonempty({ message: "Email is required" })
      .email({ message: "Invalid Email" })
      .toLowerCase(),
    race: z.string().nonempty({ message: "Select race" }),
    phone: z
      .string()
      .nonempty({ message: "Phone number is required" })
      .refine(
        (v) => /^(?:\+1)?(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/.test(v),
        {
          message: "Enter valid phone number",
        }
      ),
    gender: z.enum(["Male", "Femal"]),
    birthYear: z
      .string()
      .regex(new RegExp(`^[0-9]{4}$`), { message: "Enter 4 digits birth year" })
      .length(4, { message: "Must be 4 digits" }),
    team: z
      .string()
      .min(2, { message: "Team name is required!" })
      .toLowerCase(),
    teamPassword: z.string().min(1, { message: "Team password is required!" }),
    emergencyName: z
      .string()
      .min(2, { message: "Emergency contact name is required" }),
    emergencyPhone: z
      .string()
      .nonempty({ message: "Emgergency phone number is required" })
      .refine(
        (v) => /^(?:\+?1)?(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/.test(v),
        {
          message: "Enter valid phone number",
        }
      ),
    accepted: z
      .boolean()
      .refine((v) => v, { message: "You must accept race wavier" }),
    size: z.string().nonempty({ message: "Select your shirt size" }),
    wechatId: z.string(),
    personalBest: z.string(),
    isActive: z.boolean().default(true),
    preferName: z.string().optional(),
  })
  .passthrough()
  .superRefine((arg, ctx) => {
    const errors = registerStore.validateForm(arg);
    if (errors.firstName) {
      ctx.addIssue({
        path: ["firstName"],
        code: z.ZodIssueCode.custom,
        message: errors.firstName,
      });
    }
    if (errors.lastName) {
      ctx.addIssue({
        path: ["lastName"],
        code: z.ZodIssueCode.custom,
        message: errors.lastName,
      });
    }
    if (errors.email) {
      ctx.addIssue({
        path: ["email"],
        code: z.ZodIssueCode.custom,
        message: errors.email,
      });
    }
    if (errors.birthYear) {
      ctx.addIssue({
        path: ["birthYear"],
        code: z.ZodIssueCode.custom,
        message: errors.birthYear,
      });
    }
    return z.NEVER;
  });

type RaceFormValues = z.infer<typeof raceFormSchema>;

function RegisterForm({ team }: { team?: Team }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [initForm, setInitForm] = useState(registerStore.isLoading);

  const fromUrl = searchParams?.get("from") || "/account";

  const defaultValues = registerStore.initRaceEntryForm(team);

  console.log(`defaultValues`, { ...defaultValues });
  const form = useForm<RaceFormValues>({
    resolver: zodResolver(raceFormSchema),
    defaultValues: { ...defaultValues },
  });

  useEffect(() => {
    if (!registerStore.isLoading) {
      setInitForm(false);
    }
  }, [registerStore.isLoading]);

  useEffect(() => {
    console.log(`team changed`);
    const race = registerStore.getRaceByTeam(form.getValues("team"));
    if (race && race !== form.getValues().race) {
      form.setValue("race", race);
      form.clearErrors("race");
    }
  }, [form.watch("team")]);

  const onSubmit = async (values) => {
    console.log(`Register Form data`, { values });
    const form = { ...values };
    if (!registerStore.teamValidated) {
      registerStore.setForm(form);
      if (
        !(await registerStore.validateTeamPassword(
          values.team,
          values.teamPassword
        ))
      ) {
        return;
      }
    }
    registerStore.setState("FORM_SUBMITTED");
  };

  const onDelete = async () => {
    await registerStore.deleteRaceEntry();
    registerStore.setState("INIT");
  };

  const onCancel = () => {
    registerStore.reset();
    router.push("/account");
  };

  console.log(`form values`, {
    defaultValues,
    values: form.getValues(),
    state: form.formState,
  });
  return (
    <div className="w-full md:w-[1024px] container mx-auto">
      <DashboardHeader
        heading="Race Registration Form"
        text="Fill in the form below to register a new race entry"
      ></DashboardHeader>
      {initForm ? (
        <div>
          <FormSkeleton items={2} />
          <FormSkeleton items={5} />
          <FormSkeleton items={1} />
        </div>
      ) : (
        <Form {...form}>
          <form className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Select your team and enter team password</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="team"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Your team</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                disabled={team ? true : false}
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[300px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? registerStore.teams
                                      .map((t) => ({
                                        value: t.name,
                                        label: t.displayName,
                                      }))
                                      .find(
                                        (race) =>
                                          race.value.toLowerCase() ===
                                          field.value.toLowerCase()
                                      )?.label
                                  : "Select Team"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0">
                            <Command>
                              {/* <CommandInput placeholder="Search language..." /> */}
                              {/* <CommandEmpty>No Race</CommandEmpty> */}
                              <CommandGroup>
                                {registerStore.teams
                                  .map((t) => ({
                                    value: t.name,
                                    label: t.displayName,
                                  }))
                                  .map((race) => (
                                    <CommandItem
                                      value={race.value}
                                      key={race.value}
                                      onSelect={(value) => {
                                        console.log(
                                          `setting value to ${value}`
                                        );
                                        form.setValue("team", value);
                                        form.clearErrors("team");
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          race.value.toLowerCase() ===
                                            field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {race.label}
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Select your team from the list
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem
                    className={cn(
                      "opacity-0",
                      "my-2",
                      form.getValues().race && "opacity-100"
                    )}
                  >
                    <FormLabel>
                      Race:{" "}
                      {form.getValues().race
                        ? registerStore.raceOptions.find(
                            (race) =>
                              race.value.toLowerCase() ===
                              form.getValues().race.toLowerCase()
                          )?.label
                        : ""}
                    </FormLabel>
                    <FormDescription className="font-semibold">
                      Race entry fee:{" "}
                      {form.getValues().race
                        ? registerStore.raceOptions.find(
                            (race) =>
                              race.value.toLowerCase() ===
                              form.getValues().race.toLowerCase()
                          )?.entryFee
                        : ""}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </div>
                <FormField
                  control={form.control}
                  name="teamPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team password</FormLabel>
                      <FormControl>
                        <Input placeholder="Team password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Team password is required to register for a team
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Participant Information</CardTitle>
                <CardDescription>
                  Enter the participant information below. If you register for
                  other people or your kids, you must use their personal
                  information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Participant Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormDescription>
                        Email for the participant
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid md:grid-cols-2 gap-2 mt-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input placeholder="First Name" {...field} />
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
                          <Input placeholder="Last Name" {...field} />
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
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem className="flex flex-col mt-2">
                          <FormLabel>Size</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-[200px] md:w-[300px] justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? registerStore.shirtSizeOptions.find(
                                        (race) =>
                                          race.value.toLowerCase() ===
                                          field.value.toLowerCase()
                                      )?.label
                                    : "Size of shirt"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] md:w-[300px] p-0">
                              <Command>
                                {/* <CommandInput placeholder="Search language..." /> */}
                                {/* <CommandEmpty>No Race</CommandEmpty> */}
                                <CommandGroup>
                                  {registerStore.shirtSizeOptions.map(
                                    (race) => (
                                      <CommandItem
                                        value={race.value}
                                        key={race.value}
                                        onSelect={(value) => {
                                          form.setValue("size", value);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            race.value.toLowerCase() ===
                                              field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {race.label}
                                      </CommandItem>
                                    )
                                  )}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
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
            <FormField
              control={form.control}
              name="accepted"
              render={({ field }) => (
                <FormItem className="flex flex-row space-x-3 space-y-0 items-center px-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange as (checked) => void}
                    />
                  </FormControl>
                  <div className="">
                    <FormLabel>
                      Accept our <Wavier />
                    </FormLabel>
                    <FormDescription>
                      Click above to review the race wavier. You must accepet
                      the wavier before you can register a race.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <CardFooter className="grid grid-cols-2 gap-5">
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={
                  form.getValues().accepted === false || registerStore.isLoading
                    ? true
                    : false
                }
              >
                {registerStore.isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Next
              </Button>
              <Button
                type="reset"
                variant="outline"
                disabled={registerStore.isLoading ? true : false}
                onClick={() => {
                  router.push(fromUrl);
                }}
              >
                Cancel
              </Button>
              {/* <Button
                   variant="destructive"
                   disabled={registerStore.isLoading ? true : false}
                 >
                   Delete
                 </Button> */}
            </CardFooter>
          </form>
        </Form>
      )}
    </div>
  );
}

export default observer(RegisterForm);
