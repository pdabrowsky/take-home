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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              Admin Panel
            </h1>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-5">
            {userName && (
              <>
                {/* Mobile layout - two lines */}
                <div className="text-xs text-gray-600 sm:hidden">
                  <div>Welcome,</div>
                  <div className="font-medium">{userName}</div>
                </div>
                {/* Desktop layout - one line */}
                <span className="text-sm text-gray-600 hidden sm:block">
                  Welcome, <span className="font-medium">{userName}</span>
                </span>
              </>
            )}
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningOut ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-gray-600 mr-1 sm:mr-2"></div>
                  <span className="hidden sm:inline">Signing out...</span>
                  <span className="sm:hidden">...</span>
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
