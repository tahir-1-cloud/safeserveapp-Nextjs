'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getStaffById } from "@/services/adminsiteprofileservices";
import { StaffdetailModel } from "@/types/adminsiteprofiledto";

export default function ViewProfilePage() {
  const params = useParams<{ profileid: string }>();
const profileid = params?.profileid;

  const [staff, setStaff] = useState<StaffdetailModel | null>(null);

  useEffect(() => {
    if (!profileid) return;

    const fetchStaff = async () => {
      try {
        const data = await getStaffById(Number(profileid));
        console.log("API DATA:", data);
        setStaff(data);
      } catch (error) {
        console.error("Failed to fetch staff", error);
      }
    };

    fetchStaff();
  }, [profileid]);

  return (
    <div>
      <h2>Staff Profile</h2>
      {staff ? (
        <div>
          <p>Name: {staff.firstName} {staff.lastName}</p>
          <p>Email: {staff.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}