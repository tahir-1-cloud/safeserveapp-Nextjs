'use client';

import { useEffect, useState, useMemo } from 'react';
import { Table, Input, Select, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { JobDescModel } from '@/types/settingdto';
import { getJobDescription } from '@/services/setting';
import CustomLoader from '@/components/CustomerLoader';
import { AdminAuth } from '@/hooks/AdminAuth';
import { toast } from 'sonner';

export default function ViewJDPage() {
  AdminAuth();

  const [jobDescriptions, setJobDescriptions] = useState<JobDescModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);

  // Fetch Job Descriptions
  useEffect(() => {
    getJobDescription()
      .then(data => setJobDescriptions(data))
      .catch(err => {
        console.error('Error fetching job descriptions:', err);
        toast.error('Failed to fetch job descriptions');
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtered data based on search
  const filteredData = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return jobDescriptions.filter(jd =>
      (jd.roleName ?? '').toLowerCase().includes(lower)
    );
  }, [jobDescriptions, searchTerm]);

  // Columns with View Details button
  const columns: ColumnsType<JobDescModel> = useMemo(() => [
    { title: '#', key: 'index', width: 50, render: (_: any, __: any, index: number) => index + 1 },
    { title: 'Role Name', dataIndex: 'roleName', key: 'roleName', width: 200 },
    { 
      title: 'Created Date', 
      dataIndex: 'createdDate', 
      key: 'createdDate', 
      width: 150,
      render: (val?: string) => val ? new Date(val).toLocaleDateString() : '-',
    },
 {
  title: 'Actions',
  key: 'actions',
  width: 200, // slightly wider to fit two buttons
  render: (_: any, record: JobDescModel) => (
    <div className="flex gap-2">
      <Button
        type="primary"
        size="small"
        onClick={() => handleViewDetails(record)}
      >
        View Detail
      </Button>
      <Button
        type="default"
        danger
        size="small"
        // onClick={() => handleDelete(record.id)}
      >
        Delete
      </Button>
    </div>
  ),
}

  ], []);

  // Action handler
  const handleViewDetails = (record: JobDescModel) => {
    toast.info(`Viewing details for: ${record.roleName}`);
    // Or navigate to a detail page: router.push(`/job-description/${record.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-md p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            📝 Job Descriptions
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
              placeholder="Search Role Name..."
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
            No job descriptions found.
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{
              pageSize,
              showSizeChanger: false,
              showTotal: total => `Total ${total} items`,
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
