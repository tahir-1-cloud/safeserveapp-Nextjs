'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { addPolicy, getAllRoles } from '@/services/setting';
import { CreatePolicyModel, RoleModel } from '@/types/settingdto';
import { AdminAuth } from '@/hooks/AdminAuth';

export default function AddPolicyPage() {
  AdminAuth();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<RoleModel[]>([]);

  const [formData, setFormData] = useState<CreatePolicyModel>({
    policyid: 0,
    roleId: 0,
    policyType: '',
    policyDetail: '',
  });

  // Load roles on mount
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

  const handleChange = (key: keyof CreatePolicyModel, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.roleId || !formData.policyType || !formData.policyDetail) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      await addPolicy(formData);
      toast.success('Policy added successfully');

      setFormData({
        policyid: 0,
        roleId: 0,
        policyType: '',
        policyDetail: '',
      });

      router.push('/admin/settings/viewpolicy');
    } catch {
      toast.error('Failed to add policy');
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
            Add Policy
          </h3>
          <p className="text-sm text-body mt-1">
            Create policy for selected role.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push('/admin/settings/viewpolicy')}
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

      {/* Policy Type */}
      <div className="mb-6">
        <label className="mb-2.5 block text-black dark:text-white">
          Policy Type
        </label>
        <input
          type="text"
          value={formData.policyType}
          onChange={(e) => handleChange('policyType', e.target.value)}
          placeholder="Enter policy type..."
          className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
      </div>

      {/* Policy Detail */}
      <div className="mb-6">
        <label className="mb-2.5 block text-black dark:text-white">
          Policy Detail
        </label>
        <textarea
          rows={8}
          value={formData.policyDetail}
          onChange={(e) => handleChange('policyDetail', e.target.value)}
          placeholder="Enter policy details..."
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
          {loading ? 'Adding...' : 'Add Policy'}
        </button>
      </div>

    </div>
  );
}
