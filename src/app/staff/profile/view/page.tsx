"use client";

import { useEffect, useState } from "react";
import { getStaffProfile } from "@/services/staffsideservices";
import { StaffProfile } from "@/types/staffSidedto";
import CustomLoader from "@/components/CustomerLoader";
import { Avatar } from "@mui/material";
import { StaffAuth } from "@/hooks/StaffAuth";

type TabType = "profile" | "applications" | "policy" | "job";

export default function StaffProfilePage() {
StaffAuth();

  const [staff, setStaff] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getStaffProfile();

        setStaff({
          ...data,
          policies: data?.policies ?? [],
          jobDescriptions: data?.jobDescriptions ?? [],
          leaveCounts: data?.leaveCounts ?? {
            pending: 0,
            approved: 0,
            cancelled: 0,
          },
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const tabClasses = (tab: TabType) =>
    `cursor-pointer px-5 py-2 font-medium transition ${
      activeTab === tab
        ? "text-white bg-[#5d5fef] rounded-lg shadow"
        : "text-gray-600 hover:text-[#5d5fef]"
    }`;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CustomLoader />
      </div>
    );
  }

  if (!staff) {
    return <div className="p-6 text-red-500">Profile not found</div>;
  }
  function DetailItem({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) {
    return (
      <div className="group">
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <div className="bg-gray-50 group-hover:bg-[#f4f5ff] transition rounded-lg px-4 py-3 border border-gray-100">
          <p className="text-black font-medium">{value}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= NAVIGATION ================= */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-black">
          My Profile
        </h1>

        <ul className="flex gap-4">
          <li className={tabClasses("profile")} onClick={() => setActiveTab("profile")}>Profile</li>
          <li className={tabClasses("applications")} onClick={() => setActiveTab("applications")}>Applications</li>
          <li className={tabClasses("policy")} onClick={() => setActiveTab("policy")}>Policies</li>
          <li className={tabClasses("job")} onClick={() => setActiveTab("job")}>Job Description</li>
        </ul>
      </nav>

      <div className="px-6 py-8 max-w-6xl">

        {/* ================= PROFILE HEADER (ALWAYS VISIBLE) ================= */}
        <div className="flex items-center gap-6 bg-[#5d5fef] rounded-xl shadow-lg p-8 mb-8 text-white">
          <Avatar
            sx={{ width: 90, height: 90, bgcolor: "#7a7cff", fontSize: 30 }}
          >
            {staff.firstName?.[0]}
            {staff.lastName?.[0]}
          </Avatar>

          <div>
            <h2 className="text-3xl font-semibold">
              {staff.firstName} {staff.lastName}
            </h2>
            <p className="mt-1 text-gray-100">{staff.email}</p>
            <p className="mt-1 text-gray-200 text-sm">
             Department: {staff?.jobRole ?? "Staff Member"}
              
            </p>
          </div>
        </div>

      {/* ================= PROFILE TAB ================= */}
{activeTab === "profile" && (
  <div className="space-y-8">

    {/* ===== Top Info Cards ===== */}
    <div className="grid md:grid-cols-3 gap-6">

      {/* Wage Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <p className="text-sm text-gray-500">Wage Per Hour</p>
        <h2 className="text-xl font-semibold mt-2 text-black">
          £{staff.wagePerHour}
        </h2>
        <p className="text-xs mt-1 opacity-70">Hourly Compensation</p>
      </div>

      {/* Job Role Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <p className="text-sm text-gray-500">Job Role</p>
        <h2 className="text-xl font-semibold mt-2 text-black">
          {staff.jobRole ?? "Staff Member"}
        </h2>
      </div>

      {/* Contact Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <p className="text-sm text-gray-500">Contact Number</p>
        <h2 className="text-xl font-semibold mt-2 text-black">
          {staff.contact}
        </h2>
      </div>
    </div>


    {/* ===== Detailed Information Section ===== */}
    <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">

      <h3 className="text-2xl font-semibold text-[#5d5fef] mb-8">
        Personal Information
      </h3>

      <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">

        <DetailItem label="Title" value={staff.title} />
        <DetailItem label="Gender" value={staff.gender} />
        <DetailItem label="Email Address" value={staff.email} />
        <DetailItem label="City" value={staff.city} />
        <DetailItem label="Postcode" value={staff.postcode} />
        <DetailItem label="Address" value={staff.address} />

      </div>
    </div>

  </div>
)}

        {/* ================= APPLICATIONS TAB ================= */}
        {activeTab === "applications" && (
          <div>
            <h3 className="text-xl font-semibold mb-6 text-[#5d5fef]">
              Leave Applications Summary
            </h3>

            <div className="grid md:grid-cols-3 gap-6">

              <LeaveCard
                label="Pending"
                value={staff.leaveCounts.pending}
                bg="bg-[#fff4f4]"
                text="text-[#ef4444]"
              />

              <LeaveCard
                label="Approved"
                value={staff.leaveCounts.approved}
                bg="bg-[#f0fff7]"
                text="text-[#16a34a]"
              />

              <LeaveCard
                label="Cancelled"
                value={staff.leaveCounts.cancelled}
                bg="bg-[#f0f4ff]"
                text="text-[#5d5fef]"
              />

            </div>
          </div>
        )}

        {/* ================= POLICIES TAB ================= */}
        {activeTab === "policy" && (
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-6 text-[#5d5fef]">
              Company Policies
            </h3>

            {staff.policies.map((policy, index) => (
              <div key={index} className="mb-6">
                <p className="font-semibold text-black">{policy.title}</p>
                <p className="text-gray-600 whitespace-pre-line mt-2">
                  {policy.details}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ================= JOB DESCRIPTION TAB ================= */}
        {activeTab === "job" && (
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-6 text-[#5d5fef]">
              Job Description
            </h3>

            {staff.jobDescriptions.map((job, index) => (
              <p key={index} className="text-gray-600 whitespace-pre-line mb-4">
                {job.description}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-black">{value}</p>
    </div>
  );
}

function LeaveCard({
  label,
  value,
  bg,
  text,
}: {
  label: string;
  value: number;
  bg: string;
  text: string;
}) {
  return (
    <div className={`${bg} shadow rounded-xl p-6 text-center`}>
      <p className="text-gray-600 font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-3 ${text}`}>
        {value}
      </p>
    </div>
  );
}