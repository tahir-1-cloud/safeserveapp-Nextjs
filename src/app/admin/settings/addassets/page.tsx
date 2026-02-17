'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { addFridgeassets, getSensorCode } from '@/services/setting';
import { CreatFridgeAsset, SensorModel } from '@/types/settingdto';
 
import { AdminAuth } from '@/hooks/AdminAuth';
const generateTempRange = () =>
  Array.from({ length: 41 }, (_, i) => {
    const v = i - 20;
    return { label: v >= 0 ? `+${v}` : `${v}`, value: `${v}` };
  });

const assetsTypeOptions = [
  'Refrigeration & Cold Storage',
  'Cooking & Hot Holding Equipment',
  'Food Display & Serving',
  'Transportation & Delivery',
  'Specialized Equipment',
  'Storage Areas',
  'Other',
];

const assetSubTypesData: Record<string, string[]> = {
  "Refrigeration & Cold Storage": [
    "Walk-in refrigerators/freezers",
    "Reach-in refrigerators/freezers",
    "Display refrigerators",
    "Blast chillers",
    "Other"
  ],
  "Cooking & Hot Holding Equipment": [
    "Ovens",
    "Grills/fryers",
    "Steam tables/warmers",
    "Sous-vide water baths",
    "Microwaves",
    "Other"
  ],
  "Food Display & Serving": [
    "Salad bars",
    "Hot food counters",
    "Bain-maries",
    "Other"
  ],
  "Transportation & Delivery": [
    "Refrigerated trucks/vans",
    "Insulated food delivery containers",
    "Cooler boxes",
    "Other"
  ],
  "Specialized Equipment": [
    "Thermalizers",
    "Proofing cabinets",
    "Wine/beverage coolers",
    "Other"
  ]
};

export default function AddFridgeFreezer() {
  
 AdminAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sensorCodes, setSensorCodes] = useState<SensorModel[]>([]);
  const [subTypes, setSubTypes] = useState<string[]>([]);
  const tempRange = generateTempRange();

  const [formData, setFormData] = useState<CreatFridgeAsset>({
    fridgeName: '',
    lowerLimit: '',
    upperLimit: '',
    sid: '',
    assetsTypes: '',
    assetsSubTypes: '',
  });

  useEffect(() => {
    const loadSensors = async () => {
      try {
        const data = await getSensorCode();
        setSensorCodes(data);
      } catch {
        toast.error('Failed to load sensor codes');
      }
    };
    loadSensors();
  }, []);

  const handleChange = (key: keyof CreatFridgeAsset, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
      ...(key === 'assetsTypes' ? { assetsSubTypes: '' } : {})
    }));

    if (key === 'assetsTypes') setSubTypes(assetSubTypesData[value] || []);
  };

  const handleSubmit = async () => {
    if (!formData.fridgeName || !formData.sid || !formData.lowerLimit || !formData.upperLimit) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      await addFridgeassets({ ...formData, defineDate: new Date().toISOString() });
      toast.success('Fridge asset added successfully');

      setFormData({
        fridgeName: '',
        lowerLimit: '',
        upperLimit: '',
        sid: '',
        assetsTypes: '',
        assetsSubTypes: '',
      });
      setSubTypes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5 max-w-8xl mx-auto mt-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium text-black dark:text-white">Add Fridge / Assets</h3>
          <p className="text-sm text-body mt-1">
            Add fridge or equipment assets with limits and sensors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push('/admin/settings/viewassets')}
          className="rounded-md border border-stroke px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
        >
          Back
        </button>
      </div>

      <hr className="my-4 border-t border-gray-300" />

      {/* Asset Name */}
      <div className="mb-6">
        <label className="mb-2.5 block text-black dark:text-white">Asset Name</label>
        <input
          type="text"
          value={formData.fridgeName}
          onChange={e => handleChange('fridgeName', e.target.value)}
          placeholder="Enter Asset Name"
          className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
      </div>

      {/* Sensor & Limits */}
      <div className="flex flex-col xl:flex-row gap-6 mb-6">
        <div className="w-full xl:w-1/3">
          <label className="mb-2.5 block text-black dark:text-white">Sensor Id</label>
          <select
            value={formData.sid}
            onChange={e => handleChange('sid', e.target.value)}
            className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">Select Sensor</option>
            {sensorCodes.map(s => (
              <option key={s.sid} value={s.sid}>{s.sid}</option>
            ))}
          </select>
        </div>

        <div className="w-full xl:w-1/3">
          <label className="mb-2.5 block text-black dark:text-white">Lower Limit</label>
          <select
            value={formData.lowerLimit}
            onChange={e => handleChange('lowerLimit', e.target.value)}
            className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">Select Lower Limit</option>
            {tempRange.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="w-full xl:w-1/3">
          <label className="mb-2.5 block text-black dark:text-white">Upper Limit</label>
          <select
            value={formData.upperLimit}
            onChange={e => handleChange('upperLimit', e.target.value)}
            className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">Select Upper Limit</option>
            {tempRange.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Asset Type & SubType */}
      <div className="flex flex-col xl:flex-row gap-6 mb-6">
        <div className="w-full xl:w-1/2">
          <label className="mb-2.5 block text-black dark:text-white">Asset Type</label>
          <select
            value={formData.assetsTypes}
            onChange={e => handleChange('assetsTypes', e.target.value)}
            className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">Select Type</option>
            {assetsTypeOptions.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {subTypes.length > 0 && (
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">Asset SubType</label>
            <select
              value={formData.assetsSubTypes}
              onChange={e => handleChange('assetsSubTypes', e.target.value)}
              className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value="">Select SubType</option>
              {subTypes.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          style={{ backgroundColor: '#5D5FEF' }}
          className="px-10 py-3 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

    </div>
  );
}