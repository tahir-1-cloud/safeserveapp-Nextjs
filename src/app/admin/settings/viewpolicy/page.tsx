'use client';

import { useEffect, useState, useMemo } from 'react';
import { Table, Input, Select, Button, Modal ,Popconfirm} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PolicyModel, JobDescModel } from '@/types/settingdto';
import { getPolicy, getpolicyById,deletePolicy } from '@/services/setting';
import CustomLoader from '@/components/CustomerLoader';
import { AdminAuth } from '@/hooks/AdminAuth';
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function ViewPolicyPage() {
  AdminAuth();
  const router = useRouter();

  const [policy, setPolicy] = useState<PolicyModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>('');

  useEffect(() => {
    getPolicy()
      .then(data => setPolicy(data))
      .catch(err => {
        console.error('Error fetching policy:', err);
        toast.error('Failed to fetch policy');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredData = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return policy.filter(p => (p.roleName ?? '').toLowerCase().includes(lower));
  }, [policy, searchTerm]);

  const handleViewDetails = async (record: PolicyModel) => {
    try {
      const content = await getpolicyById(record.policyId);
      setModalContent(content);
      setIsModalOpen(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data || 'Axios error fetching content');
      } else {
        toast.error('Unexpected error fetching content');
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePolicy(id);
      // Optionally, remove the item from your state list
      setPolicy(prev => prev.filter(p => p.policyId !== id));
    } catch (err) {
      console.error('Failed to delete policy:', err);
    }
  };


  const columns: ColumnsType<PolicyModel> = useMemo(() => [
    { title: 'Sr', key: 'index', width: 50, render: (_: any, __: any, index: number) => index + 1 },
    { title: 'Role Name', dataIndex: 'roleName', key: 'roleName', width: 200 },
    { title: 'Policy Type', dataIndex: 'policyType', key: 'policyType', width: 200 },
    { 
      title: 'Created Date', 
      dataIndex: 'policyDate', 
      key: 'policyDate', 
      width: 150,
      render: (val?: string) => val ? new Date(val).toLocaleDateString() : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: PolicyModel) => (
        <div className="flex gap-2">
          <Button type="primary" size="small" onClick={() => handleViewDetails(record)}>
            View Detail
          </Button>
         <Popconfirm
             title="Delete policy?"
            description="This will delete the Policy. Are you sure?"
            onConfirm={() => handleDelete(record.policyId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="default" danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    }
  ], []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-md p-6 overflow-x-hidden">

        {/* Top Row → Right-aligned buttons */}
        <div className="flex items-center justify-between mb-4">
          <div></div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push("/admin/dashboard")}
              className="rounded-md border border-stroke px-4 py-2 text-sm font-medium text-black hover:bg-gray-100"
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/settings/addpolicy")}
              className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <span className="flex w-4 justify-center">
                <PlusIcon className="h-4 w-4" />
              </span>
              <span className="ml-2">Add policy</span>
            </button>
          </div>
        </div>

        <br />

        {/* Header → Title + Show + Search */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800">📝 Policy Detail</h3>
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
            No policy found.
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={record => record.policyId} // ensures unique key
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

        {/* Modal for View Detail */}
        <Modal
          title={
            <div className="flex items-center gap-2 py-1">
              <div className="w-1 h-6 bg-blue-600 rounded-full" />
              <h3 className="text-xl font-semibold text-[#5D5FEF] m-0">
                Policy Description Detail
              </h3>
            </div>
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width={800}
          styles={{
            header: {
              borderBottom: '1px solid black',
              paddingBottom: '12px',
              marginBottom: '0',
            },
            body: {
              maxHeight: '500px',
              overflowY: 'auto',
              padding: '20px 24px',
            },
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: modalContent }} />
        </Modal>

      </div>
    </div>
  );
}
