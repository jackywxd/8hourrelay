"use client";
import { observer } from "mobx-react-lite";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Icons } from "@/components/icons";

const teamFormSchema = z.object({
  enabled: z.boolean().default(false).optional(),
  password: z.string().optional(),
  slogan: z.string().optional(),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

function TeamForm() {
  const { store } = useAuth();
  const team = store.userStore.myTeam;
  const defaultValues: Partial<TeamFormValues> = {
    enabled: team?.isOpen ?? false,
    password: team?.password ?? "",
    slogan: team?.slogan ?? "",
  };

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues,
  });

  const onSubmit = (data: TeamFormValues) => {
    const { password, slogan, enabled } = data;
    if (!password) {
      toast.error(`Team password cannot be blank`);
      return;
    }
    store.userStore.onUpdateTeam({ isOpen: enabled, password, slogan });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Team: {store.userStore.myTeam?.displayName}</CardTitle>
        <CardDescription>
          Race: {store.userStore.myTeam?.raceDisplayName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Open for registration?
                    </FormLabel>
                    <FormDescription>
                      {field.value
                        ? `Open for new members`
                        : `Closed for new members`}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                    <Input placeholder="Team password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your team password is required for new members to join your
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
                    <Input placeholder="Team password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your team slogan is displayed on the team page
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={store.userStore.isLoading ? true : false}
            >
              {store.userStore.isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Team Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default observer(TeamForm);
