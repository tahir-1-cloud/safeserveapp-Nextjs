"use client";

import { useEffect, useMemo, useState } from "react";
import { getStaffApplication } from "@/services/staffsideservices";
import { StaffLeaveApplication } from "@/types/staffSidedto";
import { StaffAuth } from "@/hooks/StaffAuth";
import { useRouter } from "next/navigation";
import { DatePicker, Button } from "antd";
import dayjs from "dayjs";

import CustomLoader from '@/components/CustomerLoader';

const ITEMS_PER_PAGE = 12;

export default function StaffApplicationsPage() {
  const router = useRouter();
  const { user } = StaffAuth();

  const [applications, setApplications] = useState<StaffLeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const [startFilter, setStartFilter] = useState("");
  const [endFilter, setEndFilter] = useState("");
  const [appliedFilter, setAppliedFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStaffApplication();
        setApplications(data);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  // 🔎 Apply Filter Only When Search Clicked
 const filteredApplications = useMemo(() => {
  if (!appliedFilter) return applications;

  return applications.filter((app) => {
    const created = dayjs(app.createdDate);

    if (startFilter) {
      const start = dayjs(startFilter, "DD-MM-YYYY").startOf("day");
      if (created.isBefore(start)) return false;
    }

    if (endFilter) {
      const end = dayjs(endFilter, "DD-MM-YYYY").endOf("day");
      if (created.isAfter(end)) return false;
    }

    return true;
  });
}, [applications, startFilter, endFilter, appliedFilter]);

  // 📄 Pagination Logic
  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const paginatedData = filteredApplications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case 1:
        return "bg-green-100 text-green-700 border-green-300";
      case 2:
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  return (
    <div className="p-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">
          Leave Applications
        </h1>

        <button
          onClick={() => router.back()}
          className="border border-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-black hover:text-white transition"
        >
          Back
        </button>
      </div>

     {/* Filter Section */}
      <div className="bg-white rounded-xl p-6 mb-10 shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">

        {/* Date From */}
        <div className="md:col-span-2">
          <label className="block mb-2 text-black font-medium text-sm">
            Date From
          </label>

          <DatePicker
            className="w-full ant-custom"
            value={startFilter ? dayjs(startFilter, "DD-MM-YYYY") : null}
            format="DD-MM-YYYY"
            onChange={(date) => {
              setStartFilter(date ? date.format("DD-MM-YYYY") : "");
            }}
          />
        </div>

        {/* Date To */}
        <div className="md:col-span-2">
          <label className="block mb-2 text-black font-medium text-sm">
            Date To
          </label>

          <DatePicker
            className="w-full ant-custom"
            value={endFilter ? dayjs(endFilter, "DD-MM-YYYY") : null}
            format="DD-MM-YYYY"
            disabledDate={(current) => {
              if (!startFilter) return false;
              const startDate = dayjs(startFilter, "DD-MM-YYYY");
              return current && current < startDate.startOf("day");
            }}
            onChange={(date) => {
              setEndFilter(date ? date.format("DD-MM-YYYY") : "");
            }}
          />
        </div>

        {/* Search Button */}
        <div>
          <Button
            type="primary"
            className="!h-[48px] w-full !rounded-[10px] !bg-[#5d5fef] hover:!bg-[#4b4ddc] border-none flex items-center justify-center"
            onClick={() => {
              setAppliedFilter(true);
              setCurrentPage(1);
            }}
          >
            Search
          </Button>
        </div>

        {/* Reset Button */}
        <div>
          <Button
            className="!h-[48px] w-full !rounded-[10px] border-black text-black hover:!border-black hover:!text-white hover:!bg-black flex items-center justify-center"
            onClick={() => {
              setStartFilter("");
              setEndFilter("");
              setAppliedFilter(false);
              setCurrentPage(1);
            }}
          >
            Reset
          </Button>
        </div>

      </div>
     </div>
    <hr className="my-4 border-t border-gray-300" />

      {/* Loading */}
      {loading && (
        <div className="text-center py-10 text-gray-500">   <CustomLoader /></div>
      )}

      {/* Empty */}
      {!CustomLoader && paginatedData.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No applications found.
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedData.map((app, index) => (
          <div
            key={index}
            className="bg-white border border-[#5d5fef] rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-black">
                {app.leaveType}
              </h2>

              <span
                className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusBadge(
                  app.status
                )}`}
              >
                {app.status === 0
                  ? "Pending"
                  : app.status === 1
                  ? "Approved"
                  : "Rejected"}
              </span>
            </div>

            {/* Body */}
            <div className="space-y-2 text-sm text-black">
              <p><strong>Department:</strong> {app.department}</p>
              <p><strong>Policy:</strong> {app.companyPolicy}</p>
              <p>
                <strong>From:</strong>{" "}
                {new Date(app.startdate).toLocaleDateString()}
              </p>
              <p>
                <strong>To:</strong>{" "}
                {new Date(app.enddate).toLocaleDateString()}
              </p>
              <p className="line-clamp-2">
                <strong>Reason:</strong> {app.reasonAbsence}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-5 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {new Date(app.createdDate).toLocaleDateString()}
              </span>

              <button
                onClick={() =>
                  router.push(`/staff/applications/${index}`)
                }
                className="bg-[#5d5fef] text-white px-3 py-1 rounded-lg text-xs hover:opacity-90 transition"
              >
                View Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 border border-black rounded-lg disabled:opacity-40 hover:bg-black hover:text-white transition"
          >
            Prev
          </button>

          <span className="text-black font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 border border-black rounded-lg disabled:opacity-40 hover:bg-black hover:text-white transition"
          >
            Next
          </button>
        </div>
      )}
           {/* FIX ANT SIZE */}
      <style jsx global>{`
        .ant-custom.ant-picker {
          width: 100% !important;
          height: 48px !important;
          border: 1px solid #c0c2c5 !important;
          border-radius: 10px !important;
          padding: 0 16px !important;
        }
      `}</style>
    </div>
  );
}