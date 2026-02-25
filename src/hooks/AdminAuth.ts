"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import { LoginResponse, JwtPayload } from "@/types/auth";

export const AdminAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<LoginResponse | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userData");

      if (!token || !userData) {
        router.replace("/signin");
        return;
      }

      const user: LoginResponse = JSON.parse(userData);

      if (user.roleName?.toLowerCase() !== "admin") {
        router.replace("/signin");
        return;
      }

      const decoded = jwtDecode<JwtPayload>(token);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.replace("/signin");
        return;
      }

      setUser(user);

    } catch {
      localStorage.clear();
      router.replace("/signin");
    }
  }, []);

  return { router, user };
};