"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const AdminAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("__sa") === "a9f3e7c1b2";

    if (!isAdmin) {
      router.replace("/login");
    }
  }, []);
};
