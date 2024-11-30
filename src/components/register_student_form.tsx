import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { registerStudent, updateStudent } from "@/api/adminApis";
import { useSchoolSearch } from "@/hooks/useSchoolSearch";
import { useGradeSearch } from "@/hooks/useGradesSearch";
import { useLevelSearch } from "@/hooks/usseLevelsSearch";

// Schema to validate the student form
const FormSchema = z.object({
  StudentCode: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, { message: "Student Code must be alphanumeric." })
    .min(1, { message: "Student Code is required." }),
  Name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .regex(/^[a-zA-Z0-9]+$/, {
      message:
        "Name must contain only letters and numbers, no spaces or special characters.",
    }),
  StudentName: z
    .string()
    .min(2, { message: "Student Name must be at least 2 characters." }),
  email: z.string().optional(),
  gradeId: z.string().min(1, { message: "Please select a valid grade." }),
  schoolId: z.string().min(1, { message: "Please select a valid school." }),
  levelId: z.string().min(1, { message: "Please select a valid level." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .optional(),
  gender: z.enum(["0", "1"]), // 0 for Male, 1 for Female
});

interface RegisterStudentFormProps {
  isEdit?: boolean;
  studentData?: any;
  onClose?: () => void;
}

export function RegisterStudentForm({
  isEdit = false,
  studentData = null,
  onClose,
}: RegisterStudentFormProps) {
  const {
    schools,
    isLoading: isLoadingSchools,
    error: schoolError,
  } = useSchoolSearch();

  const {
    grades,
    isLoading: isLoadingGrades,
    error: gradeError,
  } = useGradeSearch();

  const {
    levels,
    isLoading: isLoadingLevels,
    error: levelError,
  } = useLevelSearch();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      StudentCode: studentData?.studentCode || "",
      Name: studentData?.Name || "",
      StudentName: studentData?.StudentName || "",
      email: studentData?.Email || "",
      gradeId: studentData?.GradeId || "",
      schoolId: studentData?.SchoolId || "",
      levelId: studentData?.LevelId || "",
      password: isEdit ? undefined : studentData?.Password || "",
      gender: studentData?.Gender || "0",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      if (isEdit) {
        // Update student
        const response = await updateStudent({
          Id: studentData?.Id,
          StudentName: data.StudentName,
          StudentCode: data.StudentCode,
          Name: data.Name,
          Email: data.email || "",
          GenderId: Number(data.gender),
          GradeId: data.gradeId,
          LevelId: data.levelId,
          SchoolId: data.schoolId,
        });
        console.log("Student updated successfully:", response);
      } else {
        // Register student
        const response = await registerStudent({
          StudentCode: data.StudentCode,
          Name: data.Name,
          StudentName: data.StudentName,
          Email: data.email || "",
          Phone: "", // Add default or actual phone value
          Religion: "", // Add default or actual religion value
          StateOfMind: "", // Add default or actual state of mind value
          Address: "", // Add default or actual address value
          GradeId: data.gradeId,
          SchoolId: data.schoolId,
          LevelId: data.levelId,
          SchoolName: "", // Add default or actual school name value
          Password: data.password || "",
          Gender: Number(data.gender),
        });
        console.log("Student registered successfully:", response);
      }

      navigate("/dashboard/students");
      setError(null);
      if (onClose) onClose();
    } catch (err: any) {
      setError(err.Message || "Operation failed");
      console.error("Operation failed:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-[70rem]">
      {error && (
        <Alert variant="destructive" className="w-full max-w-md mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4 w-full"
        >
          {/* Student Code field */}
          <FormField
            control={form.control}
            name="StudentCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter student code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* User Name field */}
          <FormField
            control={form.control}
            name="Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter user name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Student Name field */}
          <FormField
            control={form.control}
            name="studentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter student name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Grade ID field */}
          <FormField
            control={form.control}
            name="gradeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded p-2 bg-gray-100"
                    disabled={isLoadingGrades}
                  >
                    <option value="">Select grade</option>
                    {grades.map((grade) => (
                      <option key={grade.Id} value={grade.Id}>
                        {grade.NameEn}
                      </option>
                    ))}
                  </select>
                </FormControl>
                {isLoadingGrades && <p>Loading grades...</p>}
                {gradeError && <p className="text-red-500">{gradeError}</p>}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Level ID field */}
          <FormField
            control={form.control}
            name="levelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded p-2 bg-gray-100"
                    disabled={isLoadingLevels}
                  >
                    <option value="">Select level</option>
                    {levels.map((level) => (
                      <option key={level.Id} value={level.Id}>
                        {level.NameEn}
                      </option>
                    ))}
                  </select>
                </FormControl>
                {isLoadingLevels && <p>Loading levels...</p>}
                {levelError && <p className="text-red-500">{levelError}</p>}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* School ID field */}
          <FormField
            control={form.control}
            name="schoolId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded p-2 bg-gray-100"
                    disabled={isLoadingSchools}
                  >
                    <option value="">Select school</option>
                    {schools.map((school) => (
                      <option key={school.Id} value={school.Id}>
                        {school.NameEn}
                      </option>
                    ))}
                  </select>
                </FormControl>
                {isLoadingSchools && <p>Loading schools...</p>}
                {schoolError && <p className="text-red-500">{schoolError}</p>}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password field (only for registration) */}
          {!isEdit && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Gender field */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded p-2 bg-gray-100"
                  >
                    <option value="0">Male</option>
                    <option value="1">Female</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button */}
          <div className="col-span-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : isEdit ? "Update" : "Register"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
