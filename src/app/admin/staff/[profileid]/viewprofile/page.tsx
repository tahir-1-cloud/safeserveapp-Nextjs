'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getStaffById } from "@/services/adminsiteprofileservices";
import { StaffdetailModel } from "@/types/adminsiteprofiledto";

export default function ViewProfilePage() {
  const params = useParams<{ profileid: string }>();
  const profileid = params?.profileid;
  const [staff, setStaff] = useState<StaffdetailModel | null>(null);
  const [activeTab, setActiveTab] = useState<string>("profile");

  useEffect(() => {
    if (!profileid) return;

    const fetchStaff = async () => {
      try {
        const data = await getStaffById(Number(profileid));
        setStaff(data);
      } catch (error) {
        console.error("Failed to fetch staff", error);
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

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      {/* Top Navigation / Tabs */}
      <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Staff Profile</h1>
        <ul className="flex gap-4">
          <li className={tabClasses("profile")} onClick={() => setActiveTab("profile")}>Profile</li>
          <li className={tabClasses("schedule")} onClick={() => setActiveTab("schedule")}>Schedule / Task</li>
          <li className={tabClasses("applications")} onClick={() => setActiveTab("applications")}>Applications</li>
          <li className={tabClasses("policy")} onClick={() => setActiveTab("policy")}>Policy</li>
          <li className={tabClasses("jobcontract")} onClick={() => setActiveTab("jobcontract")}>Job Contract</li>
        </ul>
      </nav>

      <div className="px-6 py-8 max-w-6xl">
        {/* Profile Header */}
       <div className="flex items-center gap-6 bg-[#5d5fef] rounded-lg shadow-lg p-8 mb-6 text-white">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-[#7a7cff] flex items-center justify-center text-white text-3xl font-bold shadow-md">
                {staff ? staff.firstName[0] + staff.lastName[0] : "A"}
            </div>

            {/* Name and Info */}
            <div>
                <h2 className="text-3xl font-semibold">
                {staff ? `${staff.firstName} ${staff.lastName}` : "John Doe"}
                </h2>
                <p className="text-gray-100 mt-1 text-lg">{staff ? staff.email : "johndoe@example.com"}</p>
                <p className="text-gray-200 mt-1 text-sm">Job Role: {staff?.jobRole || "Staff Member"}</p>
                <p className="text-gray-200 mt-1 text-sm">User ID: {staff?.id || "43"}</p>
            </div>
            </div>

        {/* Tabs Content */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Personal Info</h3>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-medium text-gray-700">Title:</span> {staff?.title || "Mr"}</p>
                <p><span className="font-medium text-gray-700">Gender:</span> {staff?.gender || "Male"}</p>
                <p><span className="font-medium text-gray-700">Contact:</span> {staff?.contact || "1234567890"}</p>
                <p><span className="font-medium text-gray-700">Address:</span> {staff?.address || "123 Main Street"}</p>
                <p><span className="font-medium text-gray-700">City:</span> {staff?.city || "New York"}</p>
                <p><span className="font-medium text-gray-700">Postcode:</span> {staff?.postcode || "10001"}</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Job & Salary Info</h3>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-medium text-gray-700">Wage per Hour:</span> ${staff?.wagePerHour || 15}</p>
                <p><span className="font-medium text-gray-700">Department:</span> {staff?.jobRole || "Staff Member"}</p>
                <p><span className="font-medium text-gray-700">User ID:</span> {staff?.id || "43"}</p>
                <p><span className="font-medium text-gray-700">Contract Status:</span> Active</p>
                <p><span className="font-medium text-gray-700">Tasks Assigned:</span> 12</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "applications" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-[#fff4f0] text-[#ef5d5f] shadow rounded-lg p-6">
              <h4 className="font-semibold mb-2">Pending</h4>
              <p>3 applications</p>
            </div>
            <div className="bg-[#f0fff7] text-[#2ecc71] shadow rounded-lg p-6">
              <h4 className="font-semibold mb-2">Approved</h4>
              <p>5 applications</p>
            </div>
            <div className="bg-[#f0f4ff] text-[#5d5fef] shadow rounded-lg p-6">
              <h4 className="font-semibold mb-2">Cancelled</h4>
              <p>1 application</p>
            </div>
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Schedule & Tasks</h3>
            <div className="space-y-3">
              <div className="border p-4 rounded-lg">
                <p className="font-medium text-gray-700">Task 1: Complete Report</p>
                <p className="text-gray-500 ml-2">- Subtask A</p>
                <p className="text-gray-500 ml-2">- Subtask B</p>
              </div>
              <div className="border p-4 rounded-lg">
                <p className="font-medium text-gray-700">Task 2: Client Meeting</p>
                <p className="text-gray-500 ml-2">- Prepare slides</p>
                <p className="text-gray-500 ml-2">- Confirm attendance</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "policy" && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Policies</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Leave Policy: 14 days per year</li>
              <li>Overtime Policy: 1.5x hourly rate</li>
              <li>Work From Home Policy: 2 days/week</li>
            </ul>
          </div>
        )}

        {activeTab === "jobcontract" && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Job Contract</h3>
            <p className="text-gray-600">No contract details available.</p>
          </div>
        )}
      </div>
    </div>
  );
}