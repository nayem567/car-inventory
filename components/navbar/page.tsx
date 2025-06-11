"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabase";

const Navbar = () => {
  const { isLoggedIn, loading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleLogin = () => {
    window.location.href = "/auth/login";
  };

  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link href="/" className="text-lg font-bold text-gray-900">
          Car Inventory
        </Link>
        <div className="flex gap-2">
          {loading ? null : isLoggedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/cars/add">
                <Button variant="ghost">Add Car</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleLogin}>Login</Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
