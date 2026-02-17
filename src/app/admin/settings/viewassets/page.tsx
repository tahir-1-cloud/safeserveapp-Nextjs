'use client';

import { useEffect, useState, useMemo } from 'react';
import { Table, Input, Select, Switch, Space, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined } from '@ant-design/icons';
import { PlusIcon } from "@heroicons/react/24/solid";
import { FridgeTemp,FridgeStatus } from '@/types/settingdto';
import { GetFridgeTemp } from '@/services/setting';
import CustomLoader from '@/components/CustomerLoader';
import { useRouter } from 'next/navigation';
import { AdminAuth } from '@/hooks/AdminAuth';
export default function FridgeTemperaturePage() {
  AdminAuth();
  const [data, setData] = useState<FridgeTemp[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
 
  const router=useRouter();
  // Fetch data
  useEffect(() => {
    GetFridgeTemp()
      .then(res => setData(res))
      .catch(err => console.error('Error fetching fridge temperature:', err))
      .finally(() => setLoading(false));
  }, []);

  // Search filter
  const filteredData = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return data.filter(item =>
      (item.fridgeName ?? '').toLowerCase().includes(lower) ||
      (item.assetsTypes ?? '').toLowerCase().includes(lower) ||
      (item.assetsSubTypes ?? '').toLowerCase().includes(lower) ||
      (item.sid ?? '').toLowerCase().includes(lower)
    );
  }, [data, searchTerm]);

  // Columns
const columns: ColumnsType<FridgeTemp> = useMemo(() => [
  { title: '#', key: 'index', width: 40, render: (_: any, __: any, i) => i + 1 },

  { title: 'Asset Name', dataIndex: 'fridgeName', key: 'fridgeName' },

  { title: 'Asset Type', dataIndex: 'assetsTypes', key: 'assetsTypes' },

  { title: 'Asset Sub Type', dataIndex: 'assetsSubTypes', key: 'assetsSubTypes' },

  { title: 'Sensor ID', dataIndex: 'sid', key: 'sid', width: 110 },

  { title: 'Upper Limit', dataIndex: 'upperLimit', key: 'upperLimit', width: 100 },

  { title: 'Lower Limit', dataIndex: 'lowerLimit', key: 'lowerLimit', width: 100 },

  {
    title: 'Comments',
    dataIndex: 'comment',
    key: 'comment',
    ellipsis: true,
  },

  {
    title: 'Action',
    key: 'action',
    width: 120,
    render: (_, record) => (
      <Space>
           {/* Edit */}
          <Tooltip title="Edit">
            <EditOutlined
              className="text-blue-600 cursor-pointer text-lg"
              onClick={() => {
                console.log('Edit ID:', record.id);
              }}
            />
          </Tooltip>
          {/* Activate / Deactivate */}
          <Tooltip
            title={
              record.status === FridgeStatus.Activated
                ? 'Deactivate'
                : 'Activate'
            }
          >
            <Switch
              checked={record.status === FridgeStatus.Activated}
              onChange={checked => {
                console.log(
                  'Toggle ID:',
                  record.id,
                  'New Status:',
                  checked ? FridgeStatus.Activated : FridgeStatus.Deactivated
                );
              }}
            />
          </Tooltip>
      </Space>
    ),
  },
], []);


  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-md p-6 overflow-x-hidden">
      <div className="flex items-center justify-between ">
      {/* Left side */}
      <div>
      
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
          onClick={() => router.push("/admin/settings/addassets")}
          className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
          {/* Icon container with fixed width */}
          <span className="flex w-4 justify-center">
              <PlusIcon className="h-4 w-4" />
          </span>

          {/* Text */}
          <span className="ml-2">Add Assets</span>
          </button>

      </div>
    </div>
  <br>
  </br>
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            🧊 Fridge Temperature List
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">Show</span>
            <Select
              value={pageSize}
              onChange={value => setPageSize(value)}
              options={[5, 10, 20, 50].map(n => ({
                value: n,
                label: n.toString(),
              }))}
              className="w-20"
            />
            <Input.Search
              placeholder="Search..."
              allowClear
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <CustomLoader />
        ) : filteredData.length === 0 ? (
          <div className="text-center py-20 text-gray-600 text-lg font-medium">
            No fridge temperature records found.
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{
              pageSize,
              showSizeChanger: false,
              showTotal: total => `Total ${total} records`,
            }}
            bordered
            className="border border-gray-200 rounded-lg"
            rowClassName={() => 'hover:bg-gray-50'}
            onHeaderRow={() => ({
              style: {
                backgroundColor: '#5D5FEF',
                color: '#FFFFFF',
                fontWeight: 600,
              },
            })}
          />
        )}
      </div>
    </div>
  );
}
