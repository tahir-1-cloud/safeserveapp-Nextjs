"use client";
import React, { useEffect, useState } from "react";
import { getdashboardCount } from "@/services/setting";
import { DashboardModel } from "@/types/settingdto";
import { GroupIcon, BoxIconLine } from "@/icons";
import CalendarIcon from "@heroicons/react/24/solid/CalendarIcon";

export const EcommerceMetrics = () => {

   const [data, setData] = useState<DashboardModel | null>(null);

useEffect(() => {
  const fetchData = async () => {
    const result = await getdashboardCount();
    setData(result); // ✅ directly set object
  };
  fetchData();
}, []);

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 max-w-6xl mx-auto">

      {/* Total Staff */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#5d5fef]/10">
          <GroupIcon className="size-7 text-[#5d5fef]" />
        </div>

        <div className="mt-6">
          <span className="text-sm text-gray-500">
            Total Employees
          </span>
          <h4 className="mt-2 text-3xl font-bold text-[#5d5fef]">
            {data?.totalStaff ?? 0}
          </h4>
        </div>
      </div>

      {/* Pending Applications */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-yellow-100">
          <BoxIconLine className="size-7 text-yellow-600" />
        </div>

        <div className="mt-6">
          <span className="text-sm text-gray-500">
            Pending Applications
          </span>
          <h4 className="mt-2 text-3xl font-bold text-yellow-600">
            {data?.pendingApplications ?? 0}
          </h4>
        </div>
      </div>

      {/* Total Schedules */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-green-100">
          <CalendarIcon className="size-7 text-green-600" />
        </div>

        <div className="mt-6">
          <span className="text-sm text-gray-500">
            Total Schedules
          </span>
          <h4 className="mt-2 text-3xl font-bold text-green-600">
            {data?.totalSchedules ?? 0}
          </h4>
        </div>
      </div>

    </div>
  );
};
