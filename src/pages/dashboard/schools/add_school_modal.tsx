/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Define the schema with character length constraints
const SchoolSchema = z.object({
  NameAr: z
    .string()
    .min(10, "Arabic Name must be at least 10 characters")
    .max(250, "Arabic Name cannot exceed 250 characters")
    .nonempty("Arabic Name is required"),
  NameEn: z
    .string()
    .min(10, "English Name must be at least 10 characters")
    .max(250, "English Name cannot exceed 250 characters")
    .nonempty("English Name is required"),
  CityId: z.string().optional(),
});

interface AddEditSchoolModalProps {
  isEdit?: boolean;
  schoolData?: any;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
}

export function AddEditSchoolModal({
  isEdit = false,
  schoolData = null,
  open,
  setOpen,
  onSubmit,
}: AddEditSchoolModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(SchoolSchema),
    defaultValues: {
      NameAr: schoolData?.NameAr || "",
      NameEn: schoolData?.NameEn || "",
      CityId: schoolData?.CityId || "",
    },
  });

  const handleSubmit = async (data: any) => {
    try {
      setServerError(null); // Reset server error before submission
      await onSubmit(data);
      setOpen(false); // Close modal on success
    } catch (error: any) {
      // Set server error message
      setServerError(error.Message || "An error occurred. Please try again.");
      // Optionally, display specific field errors if they are structured in a certain way
      if (error.Message) {
        const messages = error.Message.split(";");
        messages.forEach((message: any) => {
          if (message.includes("NameAr")) {
            form.setError("NameAr", { message: message.split(":")[1].trim() });
          }
          if (message.includes("NameEn")) {
            form.setError("NameEn", { message: message.split(":")[1].trim() });
          }
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit School" : "Add New School"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {serverError && <p className="text-red-500">{serverError}</p>}

          {/* Arabic Name Field */}
          <div>
            <label>Arabic Name</label>
            <Input
              {...form.register("NameAr")}
              placeholder="Enter Arabic Name"
            />
            {form.formState.errors.NameAr && (
              <p className="text-red-500">
                {form.formState.errors.NameAr?.message?.toString()}
              </p>
            )}
          </div>

          {/* English Name Field */}
          <div>
            <label>English Name</label>
            <Input
              {...form.register("NameEn")}
              placeholder="Enter English Name"
            />
            {form.formState.errors.NameEn && (
              <p className="text-red-500">
                {form.formState.errors.NameEn?.message?.toString()}
              </p>
            )}
          </div>

          {/* City ID Field */}
          <div>
            <label>City ID</label>
            <Input {...form.register("CityId")} placeholder="Enter City ID" />
            {form.formState.errors.CityId && (
              <p className="text-red-500">
                {form.formState.errors.CityId?.message?.toString()}
              </p>
            )}
          </div>

          <Button type="submit">
            {isEdit ? "Update School" : "Add School"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
