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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { adminLogin } from "@/api/adminApis";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Update schema to include both username and password
const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

interface LoginFormProps {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export function LoginForm({ setIsLogin }: LoginFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true); // Set loading state to true when the request starts
    try {
      // Call the login function with the username and password
      const response = await adminLogin(data.username, data.password);
      console.log("Login successful", response);
      navigate("/dashboard"); // Redirect to dashboard on successful login
      setError(null); // Clear any previous errors
    } catch (error: any) {
      console.error("Login failed", error);
      setError(error.Message || "Login failed");
    } finally {
      setIsLoading(false); // Set loading state to false when the request is complete
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
          {/* Username field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
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
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <p className="text-sm text-blue-500">Forgot your password?</p>
          </div>

          {/* Submit button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"} {/* Show loading text */}
          </Button>
        </form>
      </Form>
    </div>
  );
}
