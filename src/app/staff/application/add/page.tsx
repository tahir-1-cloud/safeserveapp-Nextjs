"use client";

import { useEffect, useState } from "react";
import { DatePicker, TimePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { AddApplicationdto } from "@/types/staffApplication";
import { addLeaveApplication } from "@/services/application";
import { StaffAuth } from "@/hooks/StaffAuth";
import { toast } from "sonner";

type TabType = "late" | "absence"  | "halfday";

export default function LeavePage() {
  const { user } = StaffAuth();

  const [activeTab, setActiveTab] = useState<TabType>("late");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<AddApplicationdto>({
    name: "",
    department: "",
    userId: 0,
    companyPolicy: "late",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName,
        department: user.roleName,
        userId: user.userId,
      }));
    }
  }, [user]);

  const handleChange = (key: keyof AddApplicationdto, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ✅ Disable invalid end dates
  const disableEndDate = (current: Dayjs) => {
    if (!formData.startdate) return false;
    return current.isBefore(dayjs(formData.startdate), "day");
  };

  // ✅ Validation
  const validateForm = () => {
    if (!formData.startdate) {
      toast.error("Please select start date");
      return false;
    }

    if (
      formData.enddate &&
      dayjs(formData.enddate).isBefore(dayjs(formData.startdate))
    ) {
      toast.error("Return date cannot be before start date");
      return false;
    }

    if (activeTab === "late") {
      if (!formData.starttime || !formData.endTime) {
        toast.error("Please select start and end time");
        return false;
      }

      if (
        dayjs(formData.endTime, "HH:mm").isBefore(
          dayjs(formData.starttime, "HH:mm")
        )
      ) {
        toast.error("End time cannot be before start time");
        return false;
      }
    }

    if (!formData.reasonAbsence) {
      toast.error("Please enter reason");
      return false;
    }

    return true;
  };

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    setLoading(true);

    await addLeaveApplication({
      ...formData,
      companyPolicy: activeTab,
    });

    toast.success("Application submitted successfully ✅");

    // ✅ Reset form after submit (keep user info)
    setFormData((prev) => ({
      name: prev.name,
      department: prev.department,
      userId: prev.userId,
      companyPolicy: activeTab,
      startdate: "",
      enddate: "",
      starttime: "",
      endTime: "",
      leaveType: "",
      reasonAbsence: "",
      furtherOccurence: "",
      morningShift: false,
      eveningShift: false,
    }));

  } catch {
    toast.error("Something went wrong ❌");
  } finally {
    setLoading(false);
  }
};

  const leaveTypes = [
    "Select Title",
    "Sick Leave",
    "Authorised Leave",
    "UnAuthorised Leave",
    "Holiday"
  ];
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default p-6.5 mt-6">

      <div className="mb-6">
        <h3 className="font-medium text-[#5D5FEF] text-xl">
          Leave Application
        </h3>
        <p className="text-sm text-body mt-1">
          Submit your leave request.
        </p>
      </div>

      <hr className="my-4 border-t border-gray-300" />

      {/* Name + Department */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="mb-2 block text-black">Name</label>
          <input
            value={formData.name || ""}
            readOnly
            className="w-full rounded-[10px] border border-[#c0c2c5] px-5 py-3 bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-black">Department</label>
          <input
            value={formData.department || ""}
            readOnly
            className="w-full rounded-[10px] border border-[#c0c2c5] px-5 py-3 bg-gray-100"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {(["late", "absence", "halfday"] as TabType[]).map(
          (tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg capitalize font-medium transition ${
                activeTab === tab
                  ? "bg-[#5D5FEF] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Late TAB */}
      {activeTab === "late" && (
        <>
         {/* Start Date */}
        <div className="mb-4">
          <label className="mb-2 block text-black">Start Date</label>

          <DatePicker
            format="DD/MM/YYYY"
            className="w-full ant-custom"
            value={formData.startdate ? dayjs(formData.startdate) : null}

            // ❌ Disable previous dates
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }

            onChange={(date) =>
              handleChange(
                "startdate",
                date ? date.format("YYYY-MM-DD") : ""
              )
            }
          />
        </div>

         <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="mb-2 block text-black">Start Time</label>
            <TimePicker
              format="hh:mm A"   // ✅ 12-hour format
              use12Hours         // ✅ Enables AM/PM
              className="w-full ant-custom"
              value={
                formData.starttime
                  ? dayjs(formData.starttime, "hh:mm A")
                  : null
              }
              onChange={(time) =>
                handleChange(
                  "starttime",
                  time ? time.format("hh:mm A") : ""
                )
              }
            />
          </div>

           <div>
            <label className="mb-2 block text-black">End Time</label>
            <TimePicker
              format="hh:mm A"
              use12Hours
              className="w-full ant-custom"
              value={
                formData.endTime
                  ? dayjs(formData.endTime, "hh:mm A")
                  : null
              }
              onChange={(time) =>
                handleChange(
                  "endTime",
                  time ? time.format("hh:mm A") : ""
                )
              }
            />
          </div>
      </div>
        </>
      )}

     {/* Absence */}
      {activeTab === "absence" && (
        <>
          {/* Row 1 → Dates */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">

            <div>
              <label className="mb-2 block text-black">Start Date</label>
              <DatePicker
                format="DD/MM/YYYY"
                className="w-full ant-custom"
                value={formData.startdate ? dayjs(formData.startdate) : null}
                onChange={(date) =>
                  handleChange(
                    "startdate",
                    date ? date.format("YYYY-MM-DD") : ""
                  )
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-black">Return Date</label>
              <DatePicker
                format="DD/MM/YYYY"
                disabledDate={disableEndDate}
                className="w-full ant-custom"
                value={formData.enddate ? dayjs(formData.enddate) : null}
                onChange={(date) =>
                  handleChange(
                    "enddate",
                    date ? date.format("YYYY-MM-DD") : ""
                  )
                }
              />
            </div>

          </div>

          {/* Row 2 → Dropdown */}
          <div className="mb-4">
            <label className="mb-2 block text-black">
              Leaves Types
            </label>

            <select
              value={formData.leaveType || ""}
              onChange={(e) =>
                handleChange("leaveType", e.target.value)
              }
              className="w-full rounded-[10px] border border-[#c0c2c5] px-5 py-3 outline-none focus:border-[#5D5FEF] transition"
              required
            >
              <option value="" disabled>
                Select Title
              </option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Authorised Leave">Authorised Leave</option>
              <option value="UnAuthorised Leave">UnAuthorised Leave</option>
              <option value="Holiday">Holiday</option>
            </select>
          </div>
        </>
      )}

      {/* ===== HALFDAY ===== */}
      {activeTab === "halfday" && (
        <>
        {/* Start Date */}
        <div className="mb-4">
          <label className="mb-2 block text-black">Start Date</label>

          <DatePicker
            format="DD/MM/YYYY"
            className="w-full ant-custom"
            value={formData.startdate ? dayjs(formData.startdate) : null}

            // ❌ Disable previous dates
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }

            onChange={(date) =>
              handleChange(
                "startdate",
                date ? date.format("YYYY-MM-DD") : ""
              )
            }
          />
        </div>

          <div className="flex gap-4 mb-4 mt-4">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  morningShift: true,
                  eveningShift: false,
                }))
              }
              className={`px-6 py-2 rounded-lg ${
                formData.morningShift
                  ? "bg-[#5D5FEF] text-white"
                  : "bg-gray-100"
              }`}
            >
              Morning
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  morningShift: false,
                  eveningShift: true,
                }))
              }
              className={`px-6 py-2 rounded-lg ${
                formData.eveningShift
                  ? "bg-[#5D5FEF] text-white"
                  : "bg-gray-100"
              }`}
            >
              Evening
            </button>
          </div>
        </>
      )}

      {/* Reason */}
      <textarea
        rows={4}
        placeholder="Reason"
        value={formData.reasonAbsence || ""}
        onChange={(e) =>
          handleChange("reasonAbsence", e.target.value)
        }
        className="w-full rounded-[10px] border border-[#c0c2c5] px-5 py-3 mb-6"
      />

      {/* Further Occurrence */}
      <div className="mb-6">
        <label className="mb-2 block text-black">
          Further Occurrence
        </label>
        <textarea
          rows={4}
          value={formData.furtherOccurence || ""}
          onChange={(e) =>
            handleChange("furtherOccurence", e.target.value)
          }
          className="w-full rounded-[10px] border border-[#c0c2c5] px-5 py-3"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-10 py-3 rounded-lg text-white font-semibold bg-[#5D5FEF] transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </div>

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