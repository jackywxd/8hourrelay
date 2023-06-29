"use client";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/icons";
import { FormSkeleton } from "@/components/FormSkeleton";

const profileFormSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    birthYear: z.string(),
    preferName: z.string().optional(),
  })
  .required();

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function ProfileForm() {
  const { store } = useAuth();
  const [initForm, setInitForm] = useState(store.userStore.isLoading);

  useEffect(() => {
    if (!store.userStore.isLoading) {
      setInitForm(false);
    }
  }, [store.userStore.isLoading]);

  const defaultValues: Partial<ProfileFormValues> = {
    firstName: store.userStore.user?.firstName ?? "",
    lastName: store.userStore.user?.lastName ?? "",
    preferName: store.userStore.user?.preferName ?? "",
    phone: store.userStore.user?.phone ?? "",
    birthYear: store.userStore.user?.birthYear ?? "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const onSubmit = (values: ProfileFormValues) => {
    console.log(`saveing new values`, values);
    store.userStore.onUpdateUser(values);
  };

  if (initForm) {
    return (
      <div>
        <FormSkeleton items={5} />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            This information is used to identify you and your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-2">
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
                        Your first name as it appears on your ID
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
                        Your last name as it appears on your ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                      You can set your prefer name will be used in the web
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
                      Your mobile number will be used to contact you
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
                      Your year of birth will be used to identify you
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
                Update Account
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

export default observer(ProfileForm);
