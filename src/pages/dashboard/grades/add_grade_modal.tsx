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

const GradeSchema = z.object({
  NameAr: z
    .string()
    .min(10, "Arabic Name must be between 10 and 250 characters")
    .max(250),
  NameEn: z
    .string()
    .min(10, "English Name must be between 10 and 250 characters")
    .max(250),
});

interface AddEditGradeModalProps {
  isEdit?: boolean;
  gradeData?: any;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
}

export function AddEditGradeModal({
  isEdit = false,
  gradeData = null,
  open,
  setOpen,
  onSubmit,
}: AddEditGradeModalProps) {
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(GradeSchema),
    defaultValues: {
      NameAr: gradeData?.NameAr || "",
      NameEn: gradeData?.NameEn || "",
    },
  });

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      setOpen(false);
    } catch (err: any) {
      setError(err.Message || "Operation failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[70rem]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Grade" : "Add New Grade"}</DialogTitle>
        </DialogHeader>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <label>Arabic Name</label>
            <Input
              {...form.register("NameAr")}
              placeholder="Enter Arabic Name"
            />
            {form.formState.errors.NameAr && (
              <p className="text-red-500">
                {typeof form.formState.errors.NameAr?.message === "string" &&
                  form.formState.errors.NameAr.message}
              </p>
            )}
          </div>
          <div>
            <label>English Name</label>
            <Input
              {...form.register("NameEn")}
              placeholder="Enter English Name"
            />
            {form.formState.errors.NameEn && (
              <p className="text-red-500">
                {typeof form.formState.errors.NameEn?.message === "string" &&
                  form.formState.errors.NameEn.message}
              </p>
            )}
          </div>
          <Button type="submit">{isEdit ? "Update Grade" : "Add Grade"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
