"use client";
import { observer } from "mobx-react-lite";

import { teamStore } from "@8hourrelay/store/src/UIStore";
import { DashboardHeader } from "@/components/header";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Icons } from "@/components/icons";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

const confirmFormSchema = z.object({
  confirmed: z.boolean(),
});

type ConfirmFormValues = z.infer<typeof confirmFormSchema>;

function ConfirmForm() {
  const team = teamStore.form!;

  const form = useForm<ConfirmFormValues>({
    resolver: zodResolver(confirmFormSchema),
    defaultValues: { confirmed: false },
  });

  const onSubmit = async () => {
    await teamStore.createTeam();
  };
  const onEdit = () => {
    form.reset();
    teamStore.setState("RE_EDIT");
  };

  return (
    <>
      <DashboardHeader
        heading="Review"
        text="Please review your team information carefully. Team data cannot be changed after submitted"
      ></DashboardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Below is the new team information</CardTitle>

              <CardDescription></CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
              <div className="flex w-full justify-between border-b-2">
                <div>Race:</div>
                <div>{teamStore.raceDisplayName}</div>
              </div>
              <div className="flex w-full justify-between border-b-2">
                <div>Name:</div>
                <div>{team.name}</div>
              </div>
              <div className="flex w-full justify-between border-b-2">
                <div>Captain Name:</div>
                <div>{team.captainName}</div>
              </div>
              <div className="flex w-full justify-between border-b-2">
                <div>Password:</div>
                <div>{team.password}</div>
              </div>
              {team.slogan && (
                <div className="flex w-full justify-between border-b-2">
                  <div>Slogan:</div>
                  {team.slogan}
                </div>
              )}
            </CardContent>
          </Card>
          <FormField
            control={form.control}
            name="confirmed"
            render={({ field }) => (
              <FormItem className="flex flex-row space-x-3 space-y-0 items-center px-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange as (checked) => void}
                  />
                </FormControl>
                <div className="">
                  <FormLabel>Confirmed</FormLabel>
                  <FormDescription>
                    Select the confirm checkbox to enable create team button.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <CardFooter className="gap-5">
            <Button
              type="submit"
              className="w-1/2 md:w-1/4"
              disabled={
                form.getValues().confirmed === false || teamStore.isLoading
                  ? true
                  : false
              }
            >
              {teamStore.isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Team
            </Button>
            <Button
              variant="outline"
              className="w-1/2 md:w-1/4"
              disabled={teamStore.isLoading ? true : false}
              onClick={onEdit}
            >
              Edit
            </Button>
          </CardFooter>
        </form>
      </Form>
    </>
  );
}

export default observer(ConfirmForm);
