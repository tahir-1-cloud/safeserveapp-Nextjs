"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/types/auth";

export const AdminAuth = () => {
  const router = useRouter();

  useEffect(() => {
    try {
      // Get saved user data
      const userData = localStorage.getItem("userData");
      if (!userData) {
        router.replace("/signin");
        return;
      }

      const user: LoginResponse = JSON.parse(userData);

      // Check if role is admin
      if (user.roleName.toLowerCase() !== "admin") {
        router.replace("/signin");
      }
    } catch {
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      router.replace("/signin");
    }
  }, []);

  return null; // this hook does not render anything
};
