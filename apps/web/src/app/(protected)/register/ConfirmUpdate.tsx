import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { registerStore } from "@8hourrelay/store";
import { useState } from "react";

export function ConfirmUpdateDialog({ onSubmit }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update Race Entry</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update your current race entry?</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            onClick={async () => {
              await onSubmit();
              setOpen(false);
            }}
            type="submit"
          >
            {registerStore.isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
