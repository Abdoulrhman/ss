import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { addFileStudent } from "@/api/adminApis"; // Import the API call function

// Validation schema using Zod
const FormSchema = z.object({
  gradeId: z.string().min(1, { message: "GradeId is required" }),
  schoolId: z.string().min(1, { message: "SchoolId is required" }),
  studentFile: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "A file must be selected" }),
});

// Sample Grade and School Data with fixed IDs
const gradeOptions = [
  { id: "d1ebe318-0a70-44ac-b244-768bdb3b974e", name: "Grade 1" },
];

const schoolOptions = [
  { id: "9a8c7dd1-f3fe-4de5-8d31-07e8bb64a3b7", name: "School 1 " },
];

export function AddFileStudentForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      gradeId: "",
      schoolId: "",
      studentFile: undefined,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await addFileStudent(
        data.gradeId,
        data.schoolId,
        data.studentFile
      );
      setSuccess(
        "File uploaded successfully!, new file with passwords already downloaded"
      );
      console.log(response);
    } catch (err: any) {
      setError(err.message || "File upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg">
      {error && (
        <Alert variant="destructive" className="w-full max-w-md mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="w-full max-w-md mb-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-md"
        >
          {/* GradeId dropdown */}
          <FormField
            control={form.control}
            name="gradeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SchoolId dropdown */}
          <FormField
            control={form.control}
            name="schoolId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select School" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolOptions.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Upload field */}
          <FormField
            control={form.control}
            name="studentFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files
                        ? e.target.files[0]
                        : undefined;
                      field.onChange(file);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload File"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
