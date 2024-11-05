import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";

const SubjectSchema = z.object({
  NameAr: z.string().min(1, "Arabic Name is required"),
  NameEn: z.string().min(1, "English Name is required"),
});

interface AddEditSubjectModalProps {
  isEdit?: boolean;
  subjectData?: any;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
}

export function AddEditSubjectModal({
  isEdit = false,
  subjectData = null,
  open,
  setOpen,
  onSubmit,
}: AddEditSubjectModalProps) {
  const form = useForm({
    resolver: zodResolver(SubjectSchema),
    defaultValues: {
      NameAr: subjectData?.NameAr || "",
      NameEn: subjectData?.NameEn || "",
    },
  });

  const handleSubmit = async (data: any) => {
    await onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Subject" : "Add New Subject"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <label>Arabic Name</label>
            <Input {...form.register("NameAr")} placeholder="Enter Arabic Name" />
          </div>
          <div>
            <label>English Name</label>
            <Input {...form.register("NameEn")} placeholder="Enter English Name" />
          </div>
          <Button type="submit">
            {isEdit ? "Update Subject" : "Add Subject"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
