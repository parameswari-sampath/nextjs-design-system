"use client";

import React, { useState } from "react";
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Alert from "@/components/ui/alert";
import { LoadingButton } from "@/components/ui/spinner";

type SignupFormData = {
  email: string;
  name: string;
  role: "TEACHER" | "STUDENT";
  password: string;
  password_confirm: string;
};

type FieldErrors = {
  [key in keyof SignupFormData]?: string[];
};

type ApiError = {
  code: string;
  message: string;
  details: FieldErrors;
};

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    name: "",
    role: "STUDENT",
    password: "",
    password_confirm: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
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
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          email: "",
          name: "",
          role: "STUDENT",
          password: "",
          password_confirm: "",
        });
      } else if (data.error && data.error.code === "VALIDATION_ERROR") {
        setErrors(data.error.details || {});
      } else {
        setGeneralError(data.error?.message || "An unexpected error occurred");
      }
    } catch (error) {
      setGeneralError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field: keyof SignupFormData): string | undefined => {
    return errors[field]?.[0];
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-[var(--color-success)]">
              Registration Successful!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="success">
              Your account has been created successfully.
            </Alert>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => window.location.href = '/login'}
            >
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Create Account</CardTitle>
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
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={!!getFieldError("name")}
                errorMessage={getFieldError("name")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Role
              </label>
              <Select
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value as "TEACHER" | "STUDENT")}
                error={!!getFieldError("role")}
                errorMessage={getFieldError("role")}
                required
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
              </Select>
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

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="Confirm your password"
                value={formData.password_confirm}
                onChange={(e) => handleInputChange("password_confirm", e.target.value)}
                error={!!getFieldError("password_confirm")}
                errorMessage={getFieldError("password_confirm")}
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
              {loading ? "Creating Account..." : "Create Account"}
            </LoadingButton>
            
            <p className="text-sm text-center text-[var(--color-muted-foreground)]">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => window.location.href = '/login'}
                className="text-[var(--color-primary)] hover:underline font-medium cursor-pointer"
              >
                Login here
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}