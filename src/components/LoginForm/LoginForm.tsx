"use client";

import { useState } from "react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/Button";
import { loginSchema, signupSchema } from "@/lib/validations";
import type {
  LoginFormData,
  SignupFormData,
  AuthMode,
} from "./LoginForm.types";

export const LoginForm = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleToggleMode = () => {
    setAuthMode((prev) => (prev === "login" ? "signup" : "login"));
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      if (authMode === "login") {
        const loginData: LoginFormData = {
          email: formData.email,
          password: formData.password,
        };

        const result = loginSchema.safeParse(loginData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((error) => {
            if (error.path[0]) {
              fieldErrors[error.path[0] as string] = error.message;
            }
          });
          setErrors(fieldErrors);
          return;
        }

        const { error } = await auth.signIn(
          loginData.email,
          loginData.password
        );
        if (error) {
          setErrors({ general: error.message });
          return;
        }

        window.location.href = "/dashboard";
      } else {
        const result = signupSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((error) => {
            if (error.path[0]) {
              fieldErrors[error.path[0] as string] = error.message;
            }
          });
          setErrors(fieldErrors);
          return;
        }

        const { error } = await auth.signUp(formData.email, formData.password);
        if (error) {
          setErrors({ general: error.message });
          return;
        }

        window.location.href = "/dashboard";
      }
    } catch {
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {authMode === "login"
              ? "Sign in to your account"
              : "Create your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {authMode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <Button
              type="button"
              onClick={handleToggleMode}
              disabled={loading}
              variant="ghost"
              size="sm"
              className="font-medium text-indigo-600 hover:text-indigo-500 p-0 h-auto"
            >
              {authMode === "login" ? "Sign up" : "Sign in"}
            </Button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  authMode === "login" ? "current-password" : "new-password"
                }
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {authMode === "signup" && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              fullWidth
              className="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
            >
              {authMode === "login" ? "Sign in" : "Create account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
