"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Separator,
  InputOTPSeparator,
} from "@/components/shared";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  personalInfoSchema,
  verificationSchema,
} from "@/zod-schemas/register/register-schema";
import { signUp } from "@/api/auth/sign-up";
import { verifyOtp } from "@/api/auth/verify-otp";
import { GoogleButton } from "../google-login/google-button";

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
type VerificationValues = z.infer<typeof verificationSchema>;

export function RegisterForm({
  className,
  onSwitchToLogin,
  ...props
}: React.ComponentProps<"div"> & {
  onSwitchToLogin?: () => void;
}) {
  const [step, setStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const personalInfoForm = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    },
  });

  // Form for Step 2: Verification
  const verificationForm = useForm<VerificationValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      otp: formData.otp,
    },
  });

  // Handle form submission for personal information and call signup API directly
  const onPersonalInfoSubmit = async (values: PersonalInfoValues) => {
    setIsLoading(true);
    try {
      setFormData((prev) => ({ ...prev, ...values }));
      
      // Generate a simple first and last name based on email
      const emailPrefix = values.email.split('@')[0];
      const firstName = emailPrefix || 'User';
      const lastName = 'Account';
      
      // Call our signup API function directly
      const result = await signUp({
        email: values.email,
        password: values.password,
        first_name: firstName,
        last_name: lastName,
        username: values.email // Using email as username
      });
      
      if (!result.success) {
        throw new Error(result.message || "Registration failed");
      }
      
      toast.success("Verification code sent", {
        description: `A 6-digit verification code has been sent to ${values.email}`,
        duration: 3000,
        position: "top-center",
      });
      setStep(2); // Go directly to verification step
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error 
          ? error.message 
          : "Failed to send verification code. Please try again.",
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onVerificationSubmit = async (values: VerificationValues) => {
    setIsLoading(true);
    try {
      // Generate a simple first and last name based on email
      const emailPrefix = formData.email.split('@')[0];
      const firstName = emailPrefix || 'User';
      const lastName = 'Account';
      
      // Prepare the OTP verification data according to our API requirements
      const verificationData = {
        email: formData.email,
        otp_code: values.otp,
        password: formData.password,
        first_name: firstName,
        last_name: lastName
      };

      const result = await verifyOtp(verificationData);
      
      if (!result.success) {
        const errorMessage = result.errors?.length > 0 
          ? result.errors[0].message 
          : result.message || "OTP verification failed";
        throw new Error(errorMessage);
      }
      
      toast.success("Registration successful", {
        description: `Your account has been created successfully.`,
        duration: 3000,
        position: "top-center",
      });

      window.location.href = "/signin";
    } catch (error) {
      toast.error("Registration failed", {
        description: error instanceof Error 
          ? error.message 
          : "There was an error creating your account. Please try again.",
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to go back to previous step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Function to reset form and start over
  const handleReset = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
    });
    setStep(1);
    personalInfoForm.reset();
    verificationForm.reset();
  };

  return (
    <div className={cn("", className)} {...props}>
      <Card className="overflow-hidden shadow-md">
        <CardContent className="p-6">
          {/* Form header */}
          <div className="flex flex-col items-center text-center mb-6">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-balance text-muted-foreground">
              Complete the steps below to register
            </p>

            {/* Progress indicator */}
            <div className="flex items-center justify-center w-full max-w-md mx-auto mt-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      step === i
                        ? "bg-primary text-primary-foreground"
                        : step > i
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step > i ? <Check className="h-3 w-3" /> : i}
                  </div>

                  {i < 2 && (
                    <div
                      className={cn(
                        "h-1 w-26 bg-muted",
                        step > i ? "bg-primary" : "bg-muted"
                      )}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <Form {...personalInfoForm}>
              <form
                onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={personalInfoForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder="john.doe@example.com"
                            type="email"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalInfoForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            className="pl-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-8 w-8 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalInfoForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Continue"} 
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </Form>
          )}

          {/* Step 2: Verification */}
          {step === 2 && (
            <Form {...verificationForm}>
              <form
                onSubmit={verificationForm.handleSubmit(onVerificationSubmit)}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium">
                    Enter verification code
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a 6-digit code to{" "}
                    <span className="font-medium">{formData.email}</span>
                  </p>
                </div>

                <FormField
                  control={verificationForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-center w-full">
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSeparator />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm"
                    onClick={() => {
                      toast.success("Verification code resent", {
                        description: `A new code has been sent to ${formData.email}`,
                        duration: 3000,
                        position: "top-center",
                      });
                    }}
                  >
                    Didn't receive the code? Resend
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Complete"}
                    {!isLoading && <Check className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* Footer with login link */}
          <div className="text-center mt-3">
            <div className="relative text-center text-sm after:absolute mb-3 after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <GoogleButton className="w-full" />
            <Separator className="my-4" />
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-black underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
