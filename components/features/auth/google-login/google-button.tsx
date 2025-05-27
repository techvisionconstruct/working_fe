"use client";

import { Button } from "@/components/shared";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";

export function GoogleButton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsSubmitting(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(
          `${apiUrl}/api/accounts/auth/google/callback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: tokenResponse.code,
            }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          Cookie.set("auth-token", data.access, {
            expires: 7,
            secure: true,
            sameSite: "strict",
            path: "/",
          });

          router.push("/templates");
        } else {
          console.error("Login failed:", data.error);
        }
      } catch (error) {
        console.error("Error occurred while logging in:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
    flow: "auth-code",
  });

  return (
    <div className="w-full">
      <Button
        type="button"
        onClick={() => login()}
        variant="outline"
        className="w-full"
        disabled={isLoading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor"
          />
        </svg>
        {isLoading ? "Signing in..." : "Sign in with Google"}
      </Button>
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
}
