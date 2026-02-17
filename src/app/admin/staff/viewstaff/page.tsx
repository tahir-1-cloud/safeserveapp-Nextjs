'use client';

import { useEffect, useState, useMemo } from 'react';
import { Table, Input, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { StaffViewModel } from '@/types/registrationdto';
import { getAllRegisterStaff } from '@/services/registrationservices';
import CustomLoader from '@/components/CustomerLoader';
import { AdminAuth } from '@/hooks/AdminAuth';
export default function ViewStaffPage() {
  AdminAuth();
  const [staff, setStaff] = useState<StaffViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);

  /* 🔹 Load staff */
  useEffect(() => {
    getAllRegisterStaff()
      .then(data => setStaff(data))
      .finally(() => setLoading(false));
  }, []);

  /* 🔍 Filter */
  const filteredStaff = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return staff.filter(s =>
      s.fullName?.toLowerCase().includes(lower) ||
      s.email?.toLowerCase().includes(lower) ||
      s.jobRole?.toLowerCase().includes(lower) ||
      s.contact.toLowerCase().includes(lower) ||
      s.address?.toLowerCase().includes(lower)
    );
  }, [staff, searchTerm]);

  /* 📊 Columns */
  const columns: ColumnsType<StaffViewModel> = useMemo(() => [
    {
      title: '#',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: 'Name', dataIndex: 'fullName', key: 'fullName', width: 160 },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 200 },
    { title: 'Job Role', dataIndex: 'jobRole', key: 'jobRole', width: 120 },
    { title: 'Contact', dataIndex: 'contact', key: 'contact', width: 140 },
    { title: 'Address', dataIndex: 'address', key: 'address', ellipsis: true },
  ], []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-md p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            👨‍💼 Register Members
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">Show</span>
            <Select
              value={pageSize}
              onChange={setPageSize}
              options={[5, 10, 20, 50].map(n => ({ value: n, label: n.toString() }))}
              className="w-20"
            />
            <Input.Search
              placeholder="Search staff..."
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
        ) : filteredStaff.length === 0 ? (
          <div className="text-center py-20 text-gray-600 text-lg font-medium">
            No staff found.
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredStaff}
            rowKey="id"
            pagination={{
              pageSize,
              showSizeChanger: false,
              showTotal: total => `Total ${total} staff`,
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
