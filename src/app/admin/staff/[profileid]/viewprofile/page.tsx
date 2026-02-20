'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getStaffById } from "@/services/adminsiteprofileservices";
import { StaffdetailModel } from "@/types/adminsiteprofiledto";
import { Avatar, CircularProgress } from "@mui/material";

export default function ViewProfilePage() {
  const params = useParams<{ profileid: string }>();
  const profileid = params?.profileid;

  const [staff, setStaff] = useState<StaffdetailModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("profile");

  useEffect(() => {
    if (!profileid) return;

    const fetchStaff = async () => {
      try {
        const data = await getStaffById(Number(profileid));
        console.log(data);

        // Normalize API response (prevents map crashes)
        setStaff({
          ...data,
          leaveApplications: data?.leaveApplications ?? [],
          schedules: data?.schedules ?? [],
          policies: data?.policies ?? [],
          jobDescriptions: data?.jobDescriptions ?? [],
          leaveCounts: data?.leaveCounts ?? {
            pending: 0,
            approved: 0,
            cancelled: 0,
          },
        });
      } catch (error) {
        console.error("Failed to fetch staff", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [profileid]);

  const tabClasses = (tab: string) =>
    `cursor-pointer px-4 py-2 font-medium ${
      activeTab === tab
        ? "text-white bg-[#5d5fef] rounded-lg shadow"
        : "text-gray-600 hover:text-[#5d5fef]"
    }`;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      {/* Top Navigation */}
      <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Staff Profile</h1>
        <ul className="flex gap-4">
          <li className={tabClasses("profile")} onClick={() => setActiveTab("profile")}>Profile</li>
          <li className={tabClasses("schedule")} onClick={() => setActiveTab("schedule")}>Schedule / Task</li>
          <li className={tabClasses("applications")} onClick={() => setActiveTab("applications")}>Applications</li>
          <li className={tabClasses("policy")} onClick={() => setActiveTab("policy")}>Policy</li>
          <li className={tabClasses("jobcontract")} onClick={() => setActiveTab("jobcontract")}>Job Description</li>
        </ul>
      </nav>

      <div className="px-6 py-8 max-w-6xl">
        {/* Profile Header */}
        <div className="flex items-center gap-6 bg-[#5d5fef] rounded-lg shadow-lg p-8 mb-6 text-white">
          <Avatar
            sx={{ width: 96, height: 96, bgcolor: "#7a7cff", fontSize: 32 }}
          >
            {staff?.firstName?.[0] ?? "A"}
            {staff?.lastName?.[0] ?? ""}
          </Avatar>

          <div>
            <h2 className="text-3xl font-semibold">
              {staff ? `${staff.firstName} ${staff.lastName}` : ""}
            </h2>
            <p className="text-gray-100 mt-1 text-lg">{staff?.email}</p>
            <p className="text-gray-200 mt-1 text-sm">
              Job Role: {staff?.jobRole ?? "Staff Member"}
            </p>
            <p className="text-gray-200 mt-1 text-sm">
              User ID: {staff?.id}
            </p>
          </div>
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Personal Info</h3>
              <div className="space-y-2 text-gray-600">
                <p><b>Title:</b> {staff?.title}</p>
                <p><b>Gender:</b> {staff?.gender}</p>
                <p><b>Contact:</b> {staff?.contact}</p>
                <p><b>Address:</b> {staff?.address}</p>
                <p><b>City:</b> {staff?.city}</p>
                <p><b>Postcode:</b> {staff?.postcode}</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Job & Salary Info</h3>
              <div className="space-y-2 text-gray-600">
                <p><b>Wage per Hour:</b> ${staff?.wagePerHour}</p>
                <p><b>Department:</b> {staff?.jobRole ?? "Staff Member"}</p>
                <p><b>User ID:</b> {staff?.id}</p>
              </div>
            </div>
          </div>
        )}

        {/* APPLICATIONS TAB */}
      {/* APPLICATIONS TAB */}
{activeTab === "applications" && (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-[#fff4f0] text-[#ef5d5f] shadow rounded-lg p-6">
        <h4 className="font-semibold mb-2">Pending</h4>
        <p>{staff?.leaveCounts?.pending ?? 0}</p>
      </div>
      <div className="bg-[#f0fff7] text-[#2ecc71] shadow rounded-lg p-6">
        <h4 className="font-semibold mb-2">Approved</h4>
        <p>{staff?.leaveCounts?.approved ?? 0}</p>
      </div>
      <div className="bg-[#f0f4ff] text-[#5d5fef] shadow rounded-lg p-6">
        <h4 className="font-semibold mb-2">Cancelled</h4>
        <p>{staff?.leaveCounts?.cancelled ?? 0}</p>
      </div>
    </div>

    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-6 text-[#5D5FEF]">
        Leave Applications
      </h3>

      <div className="space-y-5">
        {(staff?.leaveApplications ?? []).map((app) => (
          <div
            key={app.id}
            className="border rounded-xl p-5 bg-gray-50"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-black">
                Leave Type: {app.type ?? "N/A"}
              </h4>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    app.status === 0
                      ? "bg-[#fff4f0] text-[#ef5d5f]"
                      : app.status === 1
                      ? "bg-[#f0fff7] text-[#2ecc71]"
                      : "bg-[#f0f4ff] text-[#5d5fef]"
                  }`}
              >
                {app.status === 0
                  ? "Pending"
                  : app.status === 1
                  ? "Approved"
                  : "Cancelled"}
              </span>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

              <div>
                <span className="font-semibold text-black">
                  Company Policy:
                </span>{" "}
                {app.companyPolicy}
              </div>

              <div>
                <span className="font-semibold text-black">
                  Start Date:
                </span>{" "}
                {app.startdate
                  ? new Date(app.startdate).toLocaleDateString("en-GB")
                  : "N/A"}
              </div>

              <div>
                <span className="font-semibold text-black">
                  End Date:
                </span>{" "}
                {app.enddate
                  ? new Date(app.enddate).toLocaleDateString("en-GB")
                  : "N/A"}
              </div>

              <div>
                <span className="font-semibold text-black">
                  Application ID:
                </span>{" "}
                #{app.id}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  </>
)}

        {/* SCHEDULE TAB */}
{/* SCHEDULE TAB */}
{activeTab === "schedule" && (
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="text-xl font-semibold mb-6 text-[#5D5FEF]">
      Schedule & Tasks
    </h3>

    {(staff?.schedules ?? []).map((schedule) => (
      <div key={schedule.id} className="mb-8 border rounded-xl overflow-hidden">

        {/* Schedule Header */}
        <div className="bg-gray-50 px-5 py-4 border-b">
          <h4 className="font-bold text-lg text-black">
            Task Title: {schedule.tasktitle}
          </h4>
        </div>

        {/* Occurrence Section */}
        <div className="divide-y">

          {(schedule.occurrences ?? []).map((occ) => (
            <div key={occ.taskOccurrenceId} className="p-5">

              {/* Schedule Date */}
              <div className="mb-3 text-sm font-semibold text-[#5D5FEF]">
                Schedule Date:{" "}
                {new Date(occ.occurrenceDate).toLocaleDateString("en-GB")}
              </div>

              {/* Main Task */}
              <div className="flex items-center justify-between px-4 py-2 rounded-md mb-2 bg-gray-100 text-black">
                <span className="font-semibold">Task: {schedule.tasktitle}</span>
                {occ.status === 1 ? (
                  <span className="bg-[#5D5FEF] text-white rounded-full px-2 py-0.5 font-bold text-sm">
                    ✓
                  </span>
                ) : (
                  <span className="bg-gray-300 text-gray-700 rounded-full px-2 py-0.5 font-bold text-sm">
                    ⧗
                  </span>
                )}
              </div>

              {/* Sub Tasks */}
              <div className="space-y-2 pl-4">

                {(occ.subTasks ?? []).length === 0 && (
                  <p className="text-sm text-gray-400">No Sub Tasks</p>
                )}

                {(occ.subTasks ?? []).map((sub) => (
                  <div
                    key={sub.subTaskOccurrenceId}
                    className="flex items-center justify-between px-4 py-2 rounded-md text-sm bg-gray-50 text-black border"
                  >
                    <span>Sub Task: {sub.subTaskName}</span>
                    {sub.status === 1 ? (
                      <span className="bg-[#5D5FEF] text-white rounded-full px-2 py-0.5 font-bold text-sm">
                        ✓
                      </span>
                    ) : (
                      <span className="bg-gray-300 text-gray-700 rounded-full px-2 py-0.5 font-bold text-sm">
                        ⧗
                      </span>
                    )}
                  </div>
                ))}

              </div>

            </div>
          ))}

        </div>
      </div>
    ))}
  </div>
)}

        {/* POLICY TAB */}
        {activeTab === "policy" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Policies</h3>
            {(staff?.policies ?? []).map((policy, index) => (
              <div key={index} className="mb-4">
                <p className="font-medium">{policy.title}</p>
                <p className="text-gray-600 whitespace-pre-line">{policy.details}</p>
              </div>
            ))}
          </div>
        )}

        {/* JOB DESCRIPTION TAB */}
        {activeTab === "jobcontract" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Job Description</h3>
            {(staff?.jobDescriptions ?? []).map((job, index) => (
              <p key={index} className="text-gray-600 whitespace-pre-line">
                {job.description}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}