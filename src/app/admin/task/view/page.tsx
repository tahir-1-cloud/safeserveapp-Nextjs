'use client';

import { useEffect, useState, useMemo } from 'react';
import { Table, Input, Select, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { TaskDetailsViewModel } from '@/types/taskManagement';
import { getAllTasks } from '@/services/taskservices';
import CustomLoader from '@/components/CustomerLoader';
import { AdminAuth } from '@/hooks/AdminAuth';

export default function TaskListPage() {
  
 AdminAuth();
  const [tasks, setTasks] = useState<TaskDetailsViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);

  /* 🔹 Load tasks */
useEffect(() => {
  getAllTasks()
    .then(data => {
      console.log('📦 API RESPONSE:', data);

      if (data?.length > 0) {
        console.log('🧩 First Task:', data[0]);
        console.log('🧵 SubTasks of First Task:', data[0].subTasks);
      }

      setTasks(data);
    })
    .catch(err => {
      console.error('❌ API ERROR:', err);
    })
    .finally(() => setLoading(false));
}, []);



  /* 🔍 Search */
  const filteredTasks = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return tasks.filter(t =>
      t.taskTitle?.toLowerCase().includes(lower) ||
      t.taskType?.toLowerCase().includes(lower) ||
      t.priority?.toLowerCase().includes(lower)
    );
  }, [tasks, searchTerm]);

  /* 📊 Columns */
  const columns: ColumnsType<TaskDetailsViewModel> = useMemo(() => [
    {
      title: '#',
      key: 'index',
      width: 40,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Task Title',
      dataIndex: 'taskTitle',
      key: 'taskTitle',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Type',
      dataIndex: 'taskType',
      key: 'taskType',
      width: 110,
    },
    
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (val?: string) => {
        if (!val) return '-';
        const color =
          val === 'High' ? 'red' :
          val === 'Medium' ? 'orange' : 'green';
        return <Tag color={color}>{val}</Tag>;
      },
    },
   {
  title: 'Sub Tasks',
  key: 'subTasks',
  width: 250,
  render: (_, record) => {
    if (!record.subTasks || record.subTasks.length === 0) {
      return <span>-</span>;
    }

    return (
      <div className="space-y-1">
        {record.subTasks.map((st, index) => (
          <div key={index} className="text-sm text-gray-700">
            • {st.subTaskName}
          </div>
        ))}
      </div>
    );
  },
 }

  ], []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-md p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            📋 Task List
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
              placeholder="Search tasks..."
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
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-20 text-gray-600 text-lg font-medium">
            No tasks found.
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredTasks}
            rowKey="taskId"
            pagination={{
              pageSize,
              showSizeChanger: false,
              showTotal: total => `Total ${total} tasks`,
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
