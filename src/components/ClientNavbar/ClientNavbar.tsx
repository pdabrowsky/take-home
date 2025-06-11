"use client";

import { useState } from "react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/Button";
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
            <Button
              onClick={handleSignOut}
              disabled={isSigningOut}
              loading={isSigningOut}
              variant="secondary"
              size="sm"
              className="px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Sign out</span>
              <span className="sm:hidden">Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
