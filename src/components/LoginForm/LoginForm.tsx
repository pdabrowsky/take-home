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
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {authMode === "login"
                ? "Sign in to your account"
                : "Create your account"}
            </h2>
            <p className="mt-3 text-gray-600">
              {authMode === "login"
                ? "Please sign in to access your dashboard"
                : "Join us today and get started"}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {authMode === "signup" && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500"
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              fullWidth
              className="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 py-3 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              {authMode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {authMode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={handleToggleMode}
                disabled={loading}
                className="font-medium text-indigo-600 hover:text-indigo-500 underline transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authMode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
