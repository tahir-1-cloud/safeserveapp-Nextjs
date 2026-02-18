"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { loginStaff } from "@/services/authservices"; // your API call
import { LoginModel, LoginResponse } from "@/types/auth";

export default function SignInForm() {
  const router = useRouter();
  const [username, setUsername] = useState(""); // like your other form
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const form: LoginModel = {
        email: username,
        password: password,
      };

      // 🔹 Call API
      const response: LoginResponse = await loginStaff(form);

      // 🔹 Save token
      localStorage.setItem("token", response.token);

      localStorage.setItem("userData", JSON.stringify(response));

      // 🔹 Role-based redirect
      const role = response.roleName.toLowerCase();
      if (role === "admin") {
        router.replace("/admin/dashboard");
        toast.success(response.message || "Login successfully");

      } else {
        router.replace("/staff/dashboard");
        toast.success(response.message || "Login successfully");

      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center relative z-10">
      <div className="w-full max-w-md px-8">
        <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <Label>Email</Label>
               <Input
                  placeholder="Enter your email"
                  defaultValue={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            {/* Password */}
            <div>
              <Label>Password</Label>
              <div className="relative">
               <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  defaultValue={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

              

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="w-5" />
                  ) : (
                    <EyeCloseIcon className="w-5" />
                  )}
                </span>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-3">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="text-sm">Keep me logged in</span>
            </div>

            {/* Submit button */}
            <Button className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            {/* Forgot password */}
            <div className="text-right">
              <Link
                href="/reset-password"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
