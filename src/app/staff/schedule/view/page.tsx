"use client";

import { useEffect, useMemo, useState } from "react";
import { DatePicker, Button, Pagination, Modal, Checkbox, Tag } from "antd";
import dayjs from "dayjs";
import { getStaffSchedule,getScheduleDetails  } from "@/services/staffsideservices";
import { StaffSchedule ,StaffScheduleDetail} from "@/types/staffSidedto";
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

const [detailOpen, setDetailOpen] = useState(false);
const [detailLoading, setDetailLoading] = useState(false);
const [scheduleDetail, setScheduleDetail] = useState<StaffScheduleDetail | null>(null);

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
                        className="px-2 py-1 bg-green-100 text-green-600 rounded-lg text-xs">
                        {d.day}
                      </span>
                    ))}
                </div>

                <Button
                  className="!mt-4 w-full !h-[33px] !rounded-[10px] !bg-[#5d5fef] !text-white"
                 onClick={async () => {
                try {
                  setDetailLoading(true);
                  const data = await getScheduleDetails(schedule.id);
                  setScheduleDetail(data);
                  setDetailOpen(true);
                } catch (error) {
                  console.error(error);
                } finally {
                  setDetailLoading(false);
                }
              }}> view details
                </Button>

            
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

 <Modal
  title="Schedule Details"
  open={detailOpen}
  onCancel={() => {
    setDetailOpen(false);
    setScheduleDetail(null);
  }}
  footer={null}
  width={900}
>
  {detailLoading ? (
    <div className="flex justify-center py-10">
      <CustomLoader />
    </div>
  ) : scheduleDetail ? (
    <div className="space-y-6">

      {/* Main Info */}
      <div className="border rounded-xl p-5 bg-gray-50">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
           Task Title: {scheduleDetail.taskTitle}
          </h2>
          <Tag color="blue">{scheduleDetail.scheduleType}</Tag>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          <strong>Time:</strong> {scheduleDetail.startTime} -{" "}
          {scheduleDetail.endTime}
        </p>
      </div>

      {/* Occurrences */}
      <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">

        {scheduleDetail.occurrences.map((occurrence) => {
          const occurrenceDate = dayjs(occurrence.occurrenceDate);
          const isToday = occurrenceDate.isSame(dayjs(), "day");
          const isPast = occurrenceDate.isBefore(dayjs(), "day");
          const disabled = !isToday; // Only today editable

          return (
            <div
              key={occurrence.taskOccurrenceId}
              className="border rounded-2xl p-5 bg-white shadow-sm">

              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-semibold text-gray-800 text-md">
                    {occurrenceDate.format("DD-MM-YYYY")}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {scheduleDetail.startTime} - {scheduleDetail.endTime}
                  </p>
                </div>

                <Tag
                  color={
                    occurrence.status === 1
                      ? "green"
                      : isPast
                      ? "red"
                      : "orange"
                  }
                >
                  {occurrence.status === 1
                    ? "Completed"
                    : isPast
                    ? "Missed"
                    : "Pending"}
                </Tag>
              </div>

              {/* Main Task Checkbox (Per Date) */}
              <div className="flex justify-between items-center bg-indigo-50 p-3 rounded-lg mb-3">
                <span className="font-medium text-gray-800">
                  Main Task Completion
                </span>

                <Checkbox
                  disabled={disabled}
                  checked={occurrence.status === 1}
                  onChange={(e) => {
                    const updated = { ...scheduleDetail };

                    const occ = updated.occurrences.find(
                      (o) =>
                        o.taskOccurrenceId ===
                        occurrence.taskOccurrenceId
                    );

                    if (!occ) return;

                    const newStatus = e.target.checked ? 1 : 0;

                    occ.status = newStatus;

                    // Sync all subtasks
                    occ.subTasks.forEach(
                      (s) => (s.status = newStatus)
                    );

                    setScheduleDetail(updated);
                  }}
                />
              </div>

              {/* Sub Tasks */}
              <div className="space-y-2">
                {occurrence.subTasks.map((sub) => (
                  <div
                    key={sub.subTaskOccurrenceId}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">
                      {sub.subTaskName}
                    </span>

                    <Checkbox
                      disabled={disabled}
                      checked={sub.status === 1}
                      onChange={(e) => {
                        const updated = { ...scheduleDetail };

                        const occ = updated.occurrences.find(
                          (o) =>
                            o.taskOccurrenceId ===
                            occurrence.taskOccurrenceId
                        );

                        if (!occ) return;

                        const target = occ.subTasks.find(
                          (s) =>
                            s.subTaskOccurrenceId ===
                            sub.subTaskOccurrenceId
                        );

                        if (target) {
                          target.status = e.target.checked ? 1 : 0;
                        }

                        // Auto update main task status
                        const allCompleted = occ.subTasks.every(
                          (s) => s.status === 1
                        );

                        occ.status = allCompleted ? 1 : 0;

                        setScheduleDetail(updated);
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Save Button Per Occurrence */}
              {isToday && (
                <div className="flex justify-end mt-4">
                  <Button
                    type="primary"
                    className="!bg-[#5d5fef]"
                    onClick={() => {
                      // 🔥 Call update API for THIS occurrence only
                      console.log("Saving Occurrence:", occurrence);
                    }}
                  >
                    Save This Date
                  </Button>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  ) : null}
</Modal>
    </div>
  );
}