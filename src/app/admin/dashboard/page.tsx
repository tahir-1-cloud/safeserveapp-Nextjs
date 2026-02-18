'use client';

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import { AdminAuth } from '@/hooks/AdminAuth';



export default function Ecommerce() {
  AdminAuth();
  return (
    <div className="grid grid-cols-10 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-11">
        <EcommerceMetrics />
        <MonthlyTarget />

      </div>

      <div className="col-span-12 xl:col-span-5">
        {/* <MonthlySalesChart /> */}
       
      </div>
    </div>
  );
}
