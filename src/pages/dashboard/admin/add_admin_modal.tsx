import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RegisterForm } from "@/components/register-form"; // Import the RegisterForm

export function AddAdminModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New Admin</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Admin</DialogTitle>
        </DialogHeader>
        <RegisterForm />
      </DialogContent>
    </Dialog>
  );
}
