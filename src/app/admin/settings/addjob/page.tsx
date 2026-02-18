'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { addJob, getAllRoles } from '@/services/setting';
import { CreateJobModel, RoleModel } from '@/types/settingdto';
import { AdminAuth } from '@/hooks/AdminAuth';

export default function AddJobDescription() {
  AdminAuth();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<RoleModel[]>([]);

  const [formData, setFormData] = useState<CreateJobModel>({
    roleId: 0,
    descriptionContent: '',
  });

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await getAllRoles();
        setRoles(data);
      } catch {
        toast.error('Failed to load roles');
      }
    };

    loadRoles();
  }, []);

  const handleChange = (key: keyof CreateJobModel, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.roleId || !formData.descriptionContent) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      await addJob(formData);
      toast.success('Job Description added successfully');

      setFormData({
        roleId: 0,
        descriptionContent: '',
      });

      router.push('/admin/settings/job');
    } catch {
      toast.error('Failed to add job description');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5 max-w-8xl mx-auto mt-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium text-[#5D5FEF]">
            Add Job Description
          </h3>
          <p className="text-sm text-body mt-1">
            Create job description for selected role.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push('/admin/settings/job')}
          className="rounded-md border border-stroke px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
        >
          Back
        </button>
      </div>

      <hr className="my-4 border-t border-gray-300" />

      {/* Role Dropdown */}
      <div className="mb-6">
        <label className="mb-2.5 block text-black dark:text-white">
          Role Name
        </label>
        <select
          value={formData.roleId}
          onChange={(e) => handleChange('roleId', Number(e.target.value))}
          className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        >
          <option value={0}>Select Role</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="mb-2.5 block text-black dark:text-white">
          Job Description
        </label>

        <textarea
          rows={8}
          value={formData.descriptionContent}
          onChange={(e) => handleChange('descriptionContent', e.target.value)}
          placeholder="Enter job description..."
          className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          style={{ backgroundColor: '#5D5FEF' }}
          className="px-10 py-3 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Job'}
        </button>
      </div>

    </div>
  );
}
