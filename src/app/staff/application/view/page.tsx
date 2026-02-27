"use client";

import { useEffect, useState } from "react";
import { getStaffApplication, getLeaveApplicationById } from "@/services/staffsideservices";
import { StaffLeaveApplication } from "@/types/staffSidedto";
import { StaffAuth } from "@/hooks/StaffAuth";
import { useRouter } from "next/navigation";
import { DatePicker, Button, Modal } from "antd";
import dayjs from "dayjs";
import CustomLoader from "@/components/CustomerLoader";

export default function StaffApplicationsPage() {

  const ITEMS_PER_PAGE = 12;

  const router = useRouter();
  const { user } = StaffAuth();

  const [applications, setApplications] = useState<StaffLeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const [startFilter, setStartFilter] = useState("");
  const [endFilter, setEndFilter] = useState("");
  const [appliedFilter, setAppliedFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<StaffLeaveApplication | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const data = await getStaffApplication();
        setApplications(data);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // 🔎 Filter (without useMemo)
  const filteredApplications = appliedFilter
    ? applications.filter((app) => {
        const created = new Date(app.createdDate);

        if (startFilter) {
          const start = dayjs(startFilter, "DD-MM-YYYY").startOf("day").toDate();
          if (created < start) return false;
        }

        if (endFilter) {
          const end = dayjs(endFilter, "DD-MM-YYYY").endOf("day").toDate();
          if (created > end) return false;
        }

        return true;
      })
    : applications;

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

  const renderShift = (app: StaffLeaveApplication) => (
    <div className="mt-1 flex flex-wrap gap-2">
      {app.morningShift && (
        <span className="inline-flex items-center bg-[#5d5fef] text-white text-xs font-medium px-3 py-1 rounded-full">
          Morning
        </span>
      )}
      {app.eveningShift && (
        <span className="inline-flex items-center bg-[#5d5fef] text-white text-xs font-medium px-3 py-1 rounded-full">
          Evening
        </span>
      )}
      {!app.morningShift && !app.eveningShift && (
        <span className="text-gray-400 text-xs">—</span>
      )}
    </div>
  );

  const onViewDetail = async (leaveId: number) => {
    try {
      setDetailLoading(true);
      setDetailOpen(true);
      const data = await getLeaveApplicationById(leaveId);
      setDetailData(data);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-medium text-[#5D5FEF] text-xl">
          Leave Application
        </h3>

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

          <div className="md:col-span-2">
            <label className="block mb-2 text-black font-medium text-sm">
              Date From
            </label>

            <DatePicker
              className="w-full ant-custom"
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
              className="w-full ant-custom"
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

      <hr className="my-4 border-t border-gray-300" />

      {/* Loading */}
      {loading && (
        <div className="text-center py-10 text-gray-500">
          <CustomLoader />
        </div>
      )}

      {/* Empty */}
      {!loading && paginatedData.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No applications found.
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedData.map((app) => (
          <div
            key={app.leaveId}
            className="bg-white border border-[#5d5fef] rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-black">
                {app.morningShift || app.eveningShift
                  ? renderShift(app)
                  : app.leaveType}
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

            <div className="space-y-2 text-sm text-black">
              <p><strong>Department:</strong> {app.department}</p>
              <p><strong>Policy:</strong> {app.companyPolicy}</p>
              <p><strong>From:</strong> {new Date(app.startdate).toLocaleDateString()}</p>
              <p><strong>To:</strong> {app.enddate ? new Date(app.enddate).toLocaleDateString() : ""}</p>
              <p className="line-clamp-2"><strong>Reason:</strong> {app.reasonAbsence}</p>
            </div>

            <div className="mt-5 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                <strong>Applied Date:</strong> {new Date(app.createdDate).toLocaleDateString()}
              </span>

              <button
                onClick={() => onViewDetail(app.leaveId)}
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

      {/* Modal remains exactly same (no logic touched) */}
     
      <Modal
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        width={520}
        centered
        className="!p-0"
        style={{ padding: "16px", maxHeight: "65vh", overflowY: "auto" }}
      >
        {detailLoading && (
          <p className="text-center py-4 text-gray-500 text-sm">Loading...</p>
        )}

        {detailData && !detailLoading && (
          <div className="space-y-3 text-sm text-black">

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3 border-b pb-2">
              <p><strong>Name:</strong> {detailData.name || "-"}</p>
              <p><strong>Department:</strong> {detailData.department || "-"}</p>
              <p><strong>Leave Type:</strong> {detailData.leaveType || "-"}</p>
              <p><strong>Policy:</strong> {detailData.companyPolicy || "-"}</p>
            </div>

            {/* ✅ Half Day View */}
            {detailData.companyPolicy?.toLowerCase() === "halfday" ? (
              <div className="grid grid-cols-2 gap-3 border-b pb-2">

                {/* Shift */}
                {(detailData.morningShift || detailData.eveningShift) && (
                  <div>
                    <strong>Shift:</strong>
                    <div className="flex gap-2 mt-1">
                      {detailData.morningShift && (
                        <span className="bg-[#5d5fef] text-white text-xs px-2 py-0.5 rounded-full">
                          🌅 Morning
                        </span>
                      )}
                      {detailData.eveningShift && (
                        <span className="bg-[#5d5fef] text-white text-xs px-2 py-0.5 rounded-full">
                          🌙 Evening
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Start Date */}
                <p>
                  <strong>Date:</strong>{" "}
                  {detailData.startdate
                    ? dayjs(detailData.startdate).format("DD-MM-YYYY")
                    : "-"}
                </p>

          

              </div>
            ) : (
              /* ✅ Normal Full Day View */
              <div className="grid grid-cols-2 gap-3 border-b pb-2">

                {(detailData.morningShift || detailData.eveningShift) && (
                  <div>
                    <strong>Shift:</strong>
                    <div className="flex gap-2 mt-1">
                      {detailData.morningShift && (
                        <span className="bg-[#5d5fef] text-white text-xs px-2 py-0.5 rounded-full">
                          Morning
                        </span>
                      )}
                      {detailData.eveningShift && (
                        <span className="bg-[#5d5fef] text-white text-xs px-2 py-0.5 rounded-full">
                          Evening
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <p>
                  <strong>From:</strong>{" "}
                  {detailData.startdate
                    ? dayjs(detailData.startdate).format("DD-MM-YYYY")
                    : "-"}
                </p>

                <p>
                  <strong>To:</strong>{" "}
                  {detailData.enddate
                    ? dayjs(detailData.enddate).format("DD-MM-YYYY")
                    : "-"}
                </p>

              </div>
            )}

            {/* Reason */}
            <div className="border-b pb-2">
              <p className="font-semibold mb-1">Reason</p>
              <p className="text-gray-600 whitespace-pre-line text-sm">
                {detailData.reasonAbsence || "-"}
              </p>
            </div>

            {/* Further Occurrence */}
            <div className="border-b pb-2">
              <p className="font-semibold mb-1">Details</p>
              <p className="text-gray-600 whitespace-pre-line text-sm">
                {detailData.furtherOccurence || "-"}
              </p>
            </div>

            {/* Status */}
            <div>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`font-medium ${
                    detailData.status === 0
                      ? "text-yellow-600"
                      : detailData.status === 1
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {detailData.status === 0
                    ? "Pending"
                    : detailData.status === 1
                    ? "Approved"
                    : "Rejected"}
                </span>
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Applied:{" "}
                {detailData.createdDate
                  ? dayjs(detailData.createdDate).format("DD-MM-YYYY")
                  : "-"}
              </p>
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
}