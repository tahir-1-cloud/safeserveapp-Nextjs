"use client";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { StaffRegistration,RoleName } from "@/types/registrationdto";
import { registerStaff,getAllRoles } from '@/services/registrationservices';

import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import {PlusOutlined} from '@ant-design/icons';
import { AdminAuth } from '@/hooks/AdminAuth';

export default function StaffForm() {
  AdminAuth();
     const router = useRouter();
    const [roles, setRoles] = useState<RoleName[]>([]);
    const [loading, setLoading] = useState(false);
    
    const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<StaffRegistration>();

    /* ---------- Load Roles ---------- */
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await getAllRoles();
        setRoles(data);
      } catch {
        // toast handled in service
      }
    };
    loadRoles();
  }, []);

   /* ---------- Submit ---------- */
  const onSubmit: SubmitHandler<StaffRegistration> = async (data) => {
    try {
      setLoading(true);
      await registerStaff(data);
      toast.success("Staff registered successfully");
      reset();
      router.push("/admin/staff/list");
    } catch {
      // handled in service
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
 <div className="px-6.5 py-4">
  <div className="flex items-center justify-between">
    {/* Left side */}
    <div>
      <h3 className="font-medium text-black dark:text-white">
        Staff Member's Account
      </h3>
      <p className="text-sm text-body mt-1">
        Quickly add your employee by filling the form or clicking job role.
      </p>
    </div>

    {/* Right side buttons */}
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => router.push("/admin/dashboard")}
        className="rounded-md border border-stroke px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
      >
        Back
      </button>

      <button
        type="button"
        onClick={() => router.push("/admin/staff/addrole")}
        style={{ backgroundColor: "#5D5FEF" }}
        className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        <span className="flex w-4 justify-center">
          <PlusOutlined className="h-4 w-4 text-white" />
        </span>
        <span className="ml-2">Add Job Role</span>
      </button>
    </div>
  </div>
</div>

{/* Divider line */}
<hr className="my-4 border-t border-gray-300" />


      <form onSubmit={handleSubmit(onSubmit)} className="p-6.5">
        <div className="mb-6">
          <h4 className="mb-4 text-lg font-medium text-black dark:text-white">
            Create your Staff Member's Account
          </h4>

          {/* Row 1: Title, Gender, First Name, Last Name */}
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/4">
              <label className="mb-2.5 block text-black dark:text-white">
                Title
              </label>
              <select
                {...register("title")}
                 className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Select Title</option>
                <option value="Mr">Mr</option>
                <option value="Ms">Ms</option>
                <option value="Mrs">Mrs</option>
                <option value="Dr">Dr</option>
              </select>
            </div>

            <div className="w-full xl:w-1/4">
              <label className="mb-2.5 block text-black dark:text-white">
                Gender
              </label>
              <select
                {...register("gender")}
                 className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="w-full xl:w-1/4">
              <label className="mb-2.5 block text-black dark:text-white">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter Your First Name"
                {...register("firstName")}
                className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="w-full xl:w-1/4">
              <label className="mb-2.5 block text-black dark:text-white">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter Your Last Name"
                {...register("lastName")}
                 className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          {/* Row 2: Email Address */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              {...register("email")}
              className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Row 3: Password */}
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Password
            </label>
            <input
              type="password"
              placeholder="******"
              {...register("password")}
             className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"

            />
          </div>

          {/* Row 4: Job Role, Wage Per Hour, Contact Number */}

          

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/3">
              <label className="mb-2.5 block text-black dark:text-white">
                Job Role
              </label>
              <select
                {...register("jobRole")}
                onChange={(e) => {
                const selectedRole = roles.find(
                (r) => r.name === e.target.value
              );

              if (selectedRole) {
                setValue("roleId", selectedRole.id!);
                setValue("jobRoleId", selectedRole.id!);
                setValue("roleName", selectedRole.name);
                setValue("jobRole", selectedRole.name);
              }
            }}
                  className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Please Select a Job Role</option>

                {roles?.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>


            <div className="w-full xl:w-1/3">
              <label className="mb-2.5 block text-black dark:text-white">
                Wage Per Hour
              </label>
              <input
                type="number"
                placeholder="Please Enter Wage Per Hour"
                {...register("wagePerHour", { valueAsNumber: true })}
                className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="w-full xl:w-1/3">
              <label className="mb-2.5 block text-black dark:text-white">
                Contact Number <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                placeholder="(+923) 02572363"
                {...register("contact", { required: "Contact is required" })}
               className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.contact && (
                <p className="text-meta-1 text-sm mt-1">{errors.contact.message}</p>
              )}
            </div>
          </div>

          {/* Row 5: Address, City, Postcode */}
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/3">
              <label className="mb-2.5 block text-black dark:text-white">
                Address
              </label>
              <input
                type="text"
                placeholder="Please Enter your Address"
                {...register("address")}
                  className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="w-full xl:w-1/3">
              <label className="mb-2.5 block text-black dark:text-white">
                City
              </label>
              <input
                type="text"
                placeholder="Please Enter Your City"
                {...register("city")}
                  className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="w-full xl:w-1/3">
              <label className="mb-2.5 block text-black dark:text-white">
                Postcode
              </label>
              <input
                type="text"
                placeholder="Please Enter Your Postcode"
                {...register("postcode")}
                className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <input type="hidden" {...register("roleId", { valueAsNumber: true })} />
          <input type="hidden" {...register("jobRoleId", { valueAsNumber: true })} />
          <input type="hidden" {...register("roleName")} />


          {/* Submit Button */}
        <div className="col-span-1 md:col-span-2 flex justify-end mt-6">
            <button
                type="submit"
                style={{ backgroundColor: "#5D5FEF" }}
                className="text-white px-10 py-3 rounded-lg font-semibold transition duration-200"
                >
                Register
                </button>

            </div>

        </div>
      </form>
    </div>
  );
}