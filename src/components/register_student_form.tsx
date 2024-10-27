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

// Define options for dropdowns
const religionOptions = ["Islam", "Christianity", "Hinduism", "Other"];
const stateOfMindOptions = ["Calm", "Stressed", "Focused", "Distracted"];
const gradeOptions = [
  { label: "Grade 1", value: "d1ebe318-0a70-44ac-b244-768bdb3b974e" },
  { label: "Grade 2", value: "another-grade-id" },
  // Add more grades as needed
];
const schoolOptions = [
  { label: "School A", value: "9a8c7dd1-f3fe-4de5-8d31-07e8bb64a3b7" },
  { label: "School B", value: "another-school-id" },
  // Add more schools as needed
];

// Schema to validate the student registration form
const FormSchema = z.object({
  userName: z.string().min(2, { message: "User Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  religion: z.string().optional(),
  stateOfMind: z.string().optional(),
  gradeId: z.string().min(1, { message: "Please select a valid grade." }),
  schoolId: z.string().min(1, { message: "Please select a valid school." }),
  nationalityId: z.string().optional(),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  gender: z.enum(["0", "1"]), // 0 for Male, 1 for Female
  address: z.string().optional(),
});

interface RegisterStudentFormProps {
  isEdit?: boolean; // true if editing, false if adding
  studentData?: any; // The data of the student being edited (optional)
  onClose?: () => void; // Callback to close the modal
}

export function RegisterStudentForm({
  isEdit = false,
  studentData = null,
  onClose,
}: RegisterStudentFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userName: studentData?.UserName || "",
      email: studentData?.Email || "",
      phone: studentData?.Phone || "",
      religion: studentData?.Religion || "",
      stateOfMind: studentData?.StateOfMind || "",
      gradeId: studentData?.GradeId || "d1ebe318-0a70-44ac-b244-768bdb3b974e",
      schoolId: studentData?.SchoolId || "9a8c7dd1-f3fe-4de5-8d31-07e8bb64a3b7",
      nationalityId: studentData?.NationalityId || "",
      password: studentData?.Password || "",
      gender: studentData?.Gender || "0", // Default to Male
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
        UserName: data.userName,
        Email: data.email,
        Phone: data.phone,
        Religion: data.religion || "",
        StateOfMind: data.stateOfMind || "",
        GradeId: data.gradeId,
        SchoolId: data.schoolId,
        SchoolName: "testSchool",
        NationalityId: data.nationalityId || "",
        Password: data.password,
        Gender: Number(data.gender),
        Address: data.address || "",
      });
      console.log("Registration successful", response);
      navigate("/dashboard");
      setError(null);
      if (onClose) onClose(); // Close the modal on success
    } catch (err: any) {
      setError(err.message || "Registration failed");
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
          {/* User Name field */}
          <FormField
            control={form.control}
            name="userName"
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

          {/* Phone field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
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
                  <select {...field} className="w-full border rounded p-2 bg-gray-100">
                    <option value="">Select religion</option>
                    {religionOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
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
                  <select {...field} className="w-full border rounded p-2 bg-gray-100">
                    <option value="">Select state of mind</option>
                    {stateOfMindOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
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
                  <select {...field} className="w-full border rounded p-2 bg-gray-100">
                    <option value="">Select grade</option>
                    {gradeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
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
                  <select {...field} className="w-full border rounded p-2 bg-gray-100" >
                    <option value="">Select school</option>
                    {schoolOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nationality ID field */}
          <FormField
            control={form.control}
            name="nationalityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nationality ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter nationality ID" {...field} />
                </FormControl>
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
                  <Input type="password" placeholder="Enter password" {...field} />
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
                  <select {...field} className="w-full border rounded p-2 bg-gray-100">
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
              {isLoading ? "Submitting..." : isEdit ? "Update Student" : "Register Student"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
