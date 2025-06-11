"use client";

import { useState } from "react";
import { auth } from "@/lib/auth";
import type { ClientNavbarProps } from "./ClientNavbar.types";

export const ClientNavbar = ({ userName }: ClientNavbarProps) => {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await auth.signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Admin Panel
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {userName && (
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{userName}</span>
              </span>
            )}
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningOut ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Signing out...
                </div>
              ) : (
                "Sign out"
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
