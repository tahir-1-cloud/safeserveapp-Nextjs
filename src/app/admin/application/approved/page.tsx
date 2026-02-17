'use client';

import { useEffect, useState, useMemo } from 'react';
import { Table, Input, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LeaveApplication } from '@/types/staffApplication';
import { getApprovdApplication } from '@/services/application';
import CustomLoader from '@/components/CustomerLoader';
import { AdminAuth } from '@/hooks/AdminAuth';
export default function ApprovedLeavePage() {
 AdminAuth();
  
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);

  // Fetch approved applications once
  useEffect(() => {
    getApprovdApplication()
      .then(data => setApplications(data))
      .catch(err => {
        console.error('Error fetching approved applications:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtered data
  const filteredData = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return applications.filter(app =>
      (app.name ?? '').toLowerCase().includes(lower) ||
      (app.department ?? '').toLowerCase().includes(lower) ||
      (app.leaveType ?? '').toLowerCase().includes(lower)
    );
  }, [applications, searchTerm]);

  // Columns (add Status column)
  const columns: ColumnsType<LeaveApplication> = useMemo(() => [
    { title: '#', key: 'index', width: 40, render: (_: any, __: any, index: number) => index + 1 },
    { title: 'Name', dataIndex: 'name', key: 'name', width: 120 },
    { title: 'Department', dataIndex: 'department', key: 'department', width: 100 },
    { title: 'Leave Type', dataIndex: 'leaveType', key: 'leaveType', width: 110 },
    { 
      title: 'Start Date', 
      dataIndex: 'startdate', 
      key: 'startdate', 
      width: 110,
      render: (val: string) => val ? new Date(val).toLocaleDateString() : '-',
    },
    { 
      title: 'End Date', 
      dataIndex: 'enddate', 
      key: 'enddate', 
      width: 110,
      render: (val: string) => val ? new Date(val).toLocaleDateString() : '-',
    },
    { title: 'Start Time', dataIndex: 'starttime', key: 'starttime', width: 95 },
    { title: 'End Time', dataIndex: 'endTime', key: 'endTime', width: 95 },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: () => <span className="text-blue-600 font-semibold">Approved</span>, // primary color
    },
  ], []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-md p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            ✅ Approved  Applications
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">Show</span>
            <Select
              value={pageSize}
              onChange={value => setPageSize(value)}
              options={[5, 10, 20, 50].map(n => ({ value: n, label: n.toString() }))}
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
        <CustomLoader />   // just the spinner, no text
        ) : filteredData.length === 0 ? (
          <div className="text-center py-20 text-gray-600 text-lg font-medium">
            No approved applications.
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="leaveId"
            pagination={{
              pageSize,
              showSizeChanger: false,
              showTotal: total => `Total ${total} applications`,
            }}
            bordered
            className="border border-gray-200 rounded-lg"
            rowClassName={() => 'hover:bg-gray-50'}
            onHeaderRow={() => ({
              style: { backgroundColor: '#5D5FEF', color: '#FFFFFF', fontWeight: 600 },
            })}
          />
        )}
      </div>
    </div>
  );
}
