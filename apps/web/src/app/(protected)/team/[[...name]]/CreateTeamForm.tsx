"use client";
import { observer } from "mobx-react-lite";
import { teamStore } from "@8hourrelay/store/src/UIStore";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardHeader } from "@/components/header";
import { TeamForm } from "@8hourrelay/store/src/TeamStore";

const teamFormSchema = z.object({
  name: z.string().nonempty({ message: "Team name is required" }),
  email: z.string().nonempty({ message: "Captain email is required" }),
  captainName: z.string().nonempty({ message: "Captain name is required" }),
  race: z.string().nonempty({ message: "Race is required" }),
  password: z.string().nonempty({ message: "Team password is required" }),
  slogan: z.string().optional(),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

function CreateTeamForm() {
  const router = useRouter();
  const defaultValues: Partial<TeamFormValues> = teamStore.initialTeamForm();

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: TeamForm) => {
    console.log(`Submitting team form`, { values });
    teamStore.setForm(values as TeamForm);
    teamStore.setState("CONFIRM");
  };
  const onCancel = () => {
    form.reset();
    teamStore.reset();
    router.push("/account/myteam");
  };

  const raceOptions = teamStore.event.races.map((race) => ({
    value: race.name,
    label: race.description,
    entryFee: race.entryFee,
  }));

  return (
    <>
      <DashboardHeader
        heading="Create your team"
        text="Fill out below form to create your team and start inviting your
            friends to join."
      >
        {/* <TeamCreateButton /> */}
      </DashboardHeader>

      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="race"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Race Catagory</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a race for your team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {raceOptions.map((r) => (
                            <SelectItem key={r.label} value={r.value}>
                              {r.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        8 Hour Relay for adult 18+, or 4 Hour Youth Relay for
                        youth between 10-18.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="captainName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Captain Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Captain Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        You can use your nick name. It will be used in the team
                        page
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team name</FormLabel>
                      <FormControl>
                        <Input placeholder="Team Name" {...field} />
                      </FormControl>
                      <FormDescription>The name of your team</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Team Password" {...field} />
                      </FormControl>
                      <FormDescription>
                        The password used to join your team, only share this
                        with your team members. Anyone with this password can
                        join your team.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slogan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Slogan</FormLabel>
                      <FormControl>
                        <Input placeholder="Team Slogan" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional slogan for your team. It will be used in your
                        team page.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <CardFooter className="gap-10">
                <Button type="submit" className="w-1/2 md:w-1/4">
                  Next
                </Button>
                <Button
                  type="reset"
                  variant="secondary"
                  className="w-1/2 md:w-1/4"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

export default observer(CreateTeamForm);
