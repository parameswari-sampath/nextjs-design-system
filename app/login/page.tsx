"use client";

import React, { useState } from "react";
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Alert from "@/components/ui/alert";
import { LoadingButton } from "@/components/ui/spinner";

type LoginFormData = {
  email: string;
  password: string;
};

type FieldErrors = {
  [key in keyof LoginFormData]?: string[];
};

type ApiError = {
  code: string;
  message: string;
  details: FieldErrors | { detail: string };
};

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (generalError) {
      setGeneralError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens in localStorage
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        // Set cookies for middleware authentication
        const setCookie = (name: string, value: string, days: number) => {
          const date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
        };
        
        setCookie('access_token', data.access, 7);
        setCookie('refresh_token', data.refresh, 30);
        
        // Check if there's a redirect URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect') || '/dashboard';
        
        // Redirect to dashboard or original destination
        window.location.href = redirectUrl;
      } else if (data.error) {
        if (data.error.code === "VALIDATION_ERROR") {
          // Handle field-specific validation errors
          setErrors(data.error.details || {});
        } else if (data.error.code === "AUTHENTICATION_ERROR") {
          // Handle authentication errors
          setGeneralError(data.error.details?.detail || data.error.message || "Authentication failed");
        } else {
          setGeneralError(data.error.message || "An unexpected error occurred");
        }
      } else {
        setGeneralError("An unexpected error occurred");
      }
    } catch (error) {
      setGeneralError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field: keyof LoginFormData): string | undefined => {
    return errors[field]?.[0];
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Welcome Back</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {generalError && (
              <Alert variant="destructive">
                {generalError}
              </Alert>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={!!getFieldError("email")}
                errorMessage={getFieldError("email")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                error={!!getFieldError("password")}
                errorMessage={getFieldError("password")}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex-col space-y-4">
            <LoadingButton
              type="submit"
              loading={loading}
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </LoadingButton>
            
            <p className="text-sm text-center text-[var(--color-muted-foreground)]">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => window.location.href = '/signup'}
                className="text-[var(--color-primary)] hover:underline font-medium cursor-pointer"
              >
                Sign up here
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}