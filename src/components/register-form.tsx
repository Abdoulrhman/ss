import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerAccount } from "@/api/adminApis"; // Import the API call function
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Schema to validate the registration form
const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  birthDate: z.string().refine(
    (data) => {
      const date = new Date(data);
      return date instanceof Date && !isNaN(date.getTime());
    },
    {
      message: "Please enter a valid date.",
    }
  ),
  gender: z.enum(["0", "1"]), // 0 for Male, 1 for Female
});

interface RegisterFormProps {
  setIsLogin?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function RegisterForm({ setIsLogin }: RegisterFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      birthDate: "",
      gender: "0", // Default to Male
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true); // Set loading state to true when submission starts
    try {
      // Call the registerAccount API function
      const response = await registerAccount({
        name: data.name,
        phone: data.phone,
        email: data.email,
        birthDate: new Date(data.birthDate).toISOString(), // Ensure correct date format
        gender: Number(data.gender),
      });

      console.log("Registration successful", response);
      navigate("/dashboard");
      setError(null); // Clear any previous errors
      setIsLogin(true); // Switch to login form after successful registration
    } catch (err: any) {
      console.error("Registration failed", err);
      setError(err.message || "Registration failed"); // Set the error message
    } finally {
      setIsLoading(false); // Set loading state to false when submission is complete
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
          className="space-y-6 w-full max-w-md"
        >
          {/* Name field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
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
                  <Input placeholder="Enter your phone number" {...field} />
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
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-4">
            {/* Birth Date field */}
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel className="block">Birth Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) =>
                        form.setValue(
                          "birthDate",
                          date ? date.toISOString() : ""
                        )
                      }
                      placeholderText={new Date().toLocaleDateString()}
                      className="w-full border rounded p-2 bg-gray-100 text-gray-900 mt-1"
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
                <FormItem className="w-1/2">
                  <FormLabel className="block">Gender</FormLabel>
                  <FormControl>
                    <select
                      className="w-full border rounded p-2 bg-gray-100 text-gray-900 mt-1"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="0">Male</option>
                      <option value="1">Female</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Adding New User..." : "Add User"}{" "}
            {/* Change button text when loading */}
          </Button>
        </form>
      </Form>
    </div>
  );
}
