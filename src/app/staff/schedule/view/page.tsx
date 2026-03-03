"use client";

import { useEffect, useMemo, useState } from "react";
import { DatePicker, Button, Pagination } from "antd";
import dayjs from "dayjs";
import { getStaffSchedule } from "@/services/staffsideservices";
import { StaffSchedule } from "@/types/staffSidedto";
import CustomLoader from "@/components/CustomerLoader";
import { useRouter } from "next/navigation";

export default function StaffSchedulePage() {
  const router = useRouter();

  const [schedules, setSchedules] = useState<StaffSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  // Filters
  const [startFilter, setStartFilter] = useState<string>("");
  const [endFilter, setEndFilter] = useState<string>("");
  const [appliedFilter, setAppliedFilter] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    getStaffSchedule()
      .then(setSchedules)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString: string) =>
    dayjs(dateString).format("DD-MM-YYYY");

  // ================= FILTER LOGIC =================
  const filteredSchedules = useMemo(() => {
    if (!appliedFilter) return schedules;

    return schedules.filter((schedule) => {
      const scheduleStart = dayjs(schedule.startDate);
      const scheduleEnd = dayjs(schedule.endDate);

      const filterStart = startFilter
        ? dayjs(startFilter, "DD-MM-YYYY")
        : null;

      const filterEnd = endFilter
        ? dayjs(endFilter, "DD-MM-YYYY")
        : null;

      if (filterStart && scheduleEnd.isBefore(filterStart, "day"))
        return false;

      if (filterEnd && scheduleStart.isAfter(filterEnd, "day"))
        return false;

      return true;
    });
  }, [schedules, appliedFilter, startFilter, endFilter]);

  // ================= PAGINATION LOGIC =================
  const paginatedSchedules = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredSchedules.slice(startIndex, startIndex + pageSize);
  }, [filteredSchedules, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CustomLoader />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-medium text-[#5D5FEF] text-xl">
          schedule & Tasks
        </h3>

        <button
          onClick={() => router.push("/staff/dashboard")}
          className="border border-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-black hover:text-white transition"
        >
          Back
        </button>
      </div>

      {/* ================= FILTER SECTION ================= */}
      <div className="bg-white rounded-xl p-6 mb-10 shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block mb-2 text-black font-medium text-sm">
              Date From
            </label>
            <DatePicker
              className="w-full"
              value={startFilter ? dayjs(startFilter, "DD-MM-YYYY") : null}
              format="DD-MM-YYYY"
              onChange={(date) =>
                setStartFilter(date ? date.format("DD-MM-YYYY") : "")
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-black font-medium text-sm">
              Date To
            </label>
            <DatePicker
              className="w-full"
              value={endFilter ? dayjs(endFilter, "DD-MM-YYYY") : null}
              format="DD-MM-YYYY"
              disabledDate={(current) => {
                if (!startFilter) return false;
                const startDate = dayjs(startFilter, "DD-MM-YYYY");
                return current && current < startDate.startOf("day");
              }}
              onChange={(date) =>
                setEndFilter(date ? date.format("DD-MM-YYYY") : "")
              }
            />
          </div>

          <div>
            <Button
              type="primary"
              className="!h-[33px] w-full !rounded-[10px] !bg-[#5d5fef]"
              onClick={() => {
                setAppliedFilter(true);
                setCurrentPage(1);
              }}
            >
              Search
            </Button>
          </div>

          <div>
            <Button
              className="!h-[33px] w-full !rounded-[10px]"
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

      {/* ================= CARDS ================= */}
      {paginatedSchedules.length === 0 ? (
        <div className="text-gray-500">No schedules found.</div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {paginatedSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white rounded-2xl shadow-md p-5 border hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {schedule.taskTitle}
                  </h2>
                  <span className="text-xs px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full">
                    {schedule.scheduleType}
                  </span>
                </div>

                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <p><strong>Name:</strong> {schedule.staffName}</p>
                  <p><strong>Start:</strong> {formatDate(schedule.startDate)} | {schedule.startTime}</p>
                  <p><strong>End:</strong> {formatDate(schedule.endDate)} | {schedule.endTime}</p>
                  <p><strong>Assigned Date:</strong> {formatDate(schedule.createdAt)}</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Active Days:
                  </p>
                  {[
                    { day: "Mon", value: schedule.isMonday },
                    { day: "Tue", value: schedule.isTuesday },
                    { day: "Wed", value: schedule.isWednesday },
                    { day: "Thu", value: schedule.isThursday },
                    { day: "Fri", value: schedule.isFriday },
                    { day: "Sat", value: schedule.isSaturday },
                    { day: "Sun", value: schedule.isSunday },
                  ]
                    .filter((d) => d.value)
                    .map((d) => (
                      <span
                        key={d.day}
                        className="px-2 py-1 bg-green-100 text-green-600 rounded-lg text-xs"
                      >
                        {d.day}
                      </span>
                    ))}
                </div>

                <Button
                  className="!mt-4 w-full !h-[33px] !rounded-[10px] !bg-[#5d5fef] !text-white"
                  onClick={() =>
                    setOpenId(openId === schedule.id ? null : schedule.id)
                  }
                >
                  {openId === schedule.id ? "Hide Details" : "View Details"}
                </Button>

                {openId === schedule.id && (
                  <div className="mt-4 border-t pt-4 text-sm text-gray-600">
                    Schedule detail API will load here...
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ================= PAGINATION ================= */}
          <div className="flex justify-center mt-10">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredSchedules.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
}