'use client';
import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import { StaffAuth } from "@/hooks/StaffAuth";



export default function Ecommerce() {
 const {user}=  StaffAuth();
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        {/* <EcommerceMetrics /> */}

        <MonthlySalesChart />
      </div>
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    Welcome Back : <span className="text-blue-600 font-bold">{user?.fullName}</span>
         </h3>
{/* 
      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div> */}
    </div>
  );
}
