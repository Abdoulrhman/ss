import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { registerStudent } from "@/api/adminApis";
import { useSchoolSearch } from "@/hooks/useSchoolSearch"; // Import the custom hook

// Define options for dropdowns
const religionOptions = [
  { label: "Muslim", value: "1" },
  { label: "Christian", value: "2" },
  { label: "Another Religion", value: "3" },
];
const stateOfMindOptions = [
  { label: "Healthy", value: "1" },
  { label: "Sick", value: "2" },
];
const gradeOptions = [
  { label: "Grade 1", value: "d1ebe318-0a70-44ac-b244-768bdb3b974e" },
  { label: "Grade 2", value: "another-grade-id" },
];

// Schema to validate the student registration form
const FormSchema = z.object({
  studentCode: z.string().regex(/^[a-zA-Z0-9]+$/, { message: "Student Code must be alphanumeric." }).min(1, { message: "Student Code is required." }),
  Name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Name must contain only letters and numbers, no spaces or special characters.",
    }),
  studentName: z.string().min(2, { message: "Student Name must be at least 2 characters." }),
  email: z.string().optional(),
  religion: z.string().optional(),
  stateOfMind: z.string().optional(),
  gradeId: z.string().min(1, { message: "Please select a valid grade." }),
  schoolId: z.string().min(1, { message: "Please select a valid school." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  gender: z.enum(["0", "1"]), // 0 for Male, 1 for Female
  address: z.string().optional(),
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
  const { schools, isLoading: isLoadingSchools, error: schoolError } = useSchoolSearch();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      studentCode: studentData?.studentCode || "",
      Name: studentData?.Name || "",
      studentName: studentData?.studentName || "",
      email: studentData?.Email || "",
      religion: studentData?.Religion || "",
      stateOfMind: studentData?.StateOfMind || "",
      gradeId: studentData?.GradeId || "d1ebe318-0a70-44ac-b244-768bdb3b974e",
      schoolId: studentData?.SchoolId || "",
      password: studentData?.Password || "",
      gender: studentData?.Gender || "0",
      address: studentData?.Address || "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      const response = await registerStudent({
        StudentCode: data.studentCode,
        Name: data.Name,
        StudentName: data.studentName,
        Email: data.email || "",
        Phone: "", // Add default or actual phone value
        Religion: data.religion || "1",
        StateOfMind: data.stateOfMind || "1",
        GradeId: data.gradeId,
        SchoolId: data.schoolId,
        SchoolName: "", // Add default or actual school name value
        Password: data.password,
        Gender: Number(data.gender),
        Address: data.address || "",
      });
      console.log("Registration successful", response);
      navigate("/dashboard");
      setError(null);
      if (onClose) onClose();
    } catch (err: any) {
      setError(err.Message || "Registration failed");
      console.error("Registration failed", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-lg">
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
            name="studentCode"
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

          {/* Religion field */}
          <FormField
            control={form.control}
            name="religion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Religion</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded p-2 bg-gray-100"
                  >
                    <option value="">Select religion</option>
                    {religionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* State of Mind field */}
          <FormField
            control={form.control}
            name="stateOfMind"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State of Mind</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded p-2 bg-gray-100"
                  >
                    <option value="">Select state of mind</option>
                    {stateOfMindOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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
                  >
                    <option value="">Select grade</option>
                    {gradeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
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

          {/* Password field */}
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

          {/* Address field */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button */}
          <div className="col-span-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
