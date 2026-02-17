"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import { LoginResponse, JwtPayload } from "@/types/auth";

export const StaffAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<LoginResponse | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/signin");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      // Check expiration
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.replace("/signin");
        return;
      }

      // ✅ If you also saved user info in localStorage
      const userData = localStorage.getItem("userData");
      if (userData) {
        setUser(JSON.parse(userData) as LoginResponse);
      }
    } catch {
      localStorage.removeItem("token");
      router.replace("/signin");
    }
  }, []);

  return { user };
};
