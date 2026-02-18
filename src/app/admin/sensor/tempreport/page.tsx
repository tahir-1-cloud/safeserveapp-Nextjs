'use client';

import { useEffect, useState } from 'react';
import { Table, Input, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getAllTempCheckList } from '@/services/sensordata';
import { TempChecksModel } from '@/types/sensordto';
import CustomLoader from '@/components/CustomerLoader';
import { AdminAuth } from '@/hooks/AdminAuth';

export default function TempCheckListPage() {
  AdminAuth();

  const [data, setData] = useState<TempChecksModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    getAllTempCheckList()
      .then(res => setData(res || []))
      .finally(() => setLoading(false));
  }, []);

  // Fast filter + sort
  const tableData = data
    .filter(item => {
      const value = search.toLowerCase();
      return (
        item.fridgeName?.toLowerCase().includes(value) ||
        item.temperature?.toLowerCase().includes(value) ||
        item.notes?.toLowerCase().includes(value) ||
        item.doneBy?.toLowerCase().includes(value) ||
        item.checkDate?.toLowerCase().includes(value)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.checkDate).getTime() -
        new Date(a.checkDate).getTime()
    )
    .map((item, index) => ({
      ...item,
      sr: index + 1,
    }));

  const columns: ColumnsType<any> = [
    { title: 'Sr', dataIndex: 'sr', key: 'sr', width: 60 },
    { title: 'Fridge Name', dataIndex: 'fridgeName', key: 'fridgeName' },
    { title: 'Temperature', dataIndex: 'temperature', key: 'temperature' },
    { title: 'Notes', dataIndex: 'notes', key: 'notes' },
    {
      title: 'Check Date',
      dataIndex: 'checkDate',
      key: 'checkDate',
      render: (val: string) =>
        val ? new Date(val).toLocaleDateString() : '-',
    },
    { title: 'Done By', dataIndex: 'doneBy', key: 'doneBy' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-md p-6">

        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold">🌡️ Temperature Checklist</h1>

          <div className="flex gap-3">
            <Select
              value={pageSize}
              onChange={setPageSize}
              options={[5, 10, 20, 50].map(n => ({ value: n, label: n }))}
              className="w-20"
            />

            <Input.Search
              placeholder="Search..."
              allowClear
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        {loading ? (
          <CustomLoader />
        ) : (
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="tempId"
            pagination={{ pageSize }}
            bordered
          />
        )}
      </div>
    </div>
  );
}
