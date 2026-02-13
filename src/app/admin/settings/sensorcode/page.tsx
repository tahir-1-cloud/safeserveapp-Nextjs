'use client';

import { useEffect, useState } from 'react';
import { Table, Input, Button, Card, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DefineSenor } from '@/types/settingdto';
import { addSensorCode, getAllSensorCode } from '@/services/setting';
import CustomLoader from '@/components/CustomerLoader';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'sonner';

const SensorPage = () => {
  const [sensorCode, setSensorCode] = useState('');
  const [sensorList, setSensorList] = useState<DefineSenor[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchSensors = async () => {
    setLoading(true);
    try {
      const data = await getAllSensorCode();
      setSensorList(data);
    } catch (error) {
      toast.error('Failed to fetch sensor codes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  const handleAddSensor = async () => {
    if (!sensorCode.trim()) {
      toast.warning('Please enter a sensor code');
      return;
    }

    const sensorExists = sensorList.some(
      (sensor) => sensor.sensorCode.toLowerCase() === sensorCode.trim().toLowerCase()
    );

    if (sensorExists) {
      toast.error('This sensor code already exists!');
      return;
    }

    setSaving(true);
    try {
      await addSensorCode({ id: 0, sensorCode: sensorCode.trim() });
      toast.success('Sensor code added successfully!');
      setSensorCode('');
      await fetchSensors();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to add sensor code');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddSensor();
  };

  const filteredData = sensorList.filter((sensor) =>
    sensor.sensorCode.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<DefineSenor> = [
    {
      title: <span style={{ color: '#5d5fef' }}>ID</span>,
      dataIndex: 'id',
      key: 'id',
      width: 100,
      align: 'center',
      render: (id: number) => (
        <span className="font-medium text-gray-700 dark:text-gray-300">{id}</span>
      ),
    },
    {
      title: <span style={{ color: '#5d5fef' }}>Sensor Code</span>,
      dataIndex: 'sensorCode',
      key: 'sensorCode',
      render: (code: string) => (
        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
          {code}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-8 text-center">
          <h6 className="text-2xl sm:text-4xl font-bold mb-3" style={{ color: '#5d5fef' }}>
            Sensor Code Management
          </h6>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Define and manage sensor codes for your system
          </p>
        </div>

        {/* Add Sensor Card */}
        <Card
          className="mb-12 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-4xl mx-auto"
          styles={{ body: { padding: '32px 24px' } }}
        >
          <div className="mb-6 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2" style={{ color: '#5d5fef' }}>
              Add New Sensor Code
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Enter a unique sensor code to add to the system
            </p>
          </div>
       <div className="mb-6">
        <label className="mb-2.5 block text-black dark:text-white">Sensor Code</label>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="text"
            value={sensorCode}
            onChange={(e) => setSensorCode(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter sensor code (e.g., SENSOR-001)"
            disabled={saving}
            className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {/* Button */}
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleAddSensor}
            loading={saving}
            className="w-full sm:w-auto px-8 sm:px-10 text-base sm:text-lg rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#5D5FEF', height: '52px' }}
          >
            Add Sensor
          </Button>
        </div>
      </div>


        </Card>

        {/* Sensor List Section */}
        <div className="mt-16">
          <Card
            className="shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-4xl mx-auto"
            styles={{ body: { padding: '28px 24px' } }}
          >
            {/* Table Header */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-2" style={{ color: '#5d5fef' }}>
                List of Sensors
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Browse and search through all registered sensor codes
              </p>
            </div>

            {/* Search Bar */}
            <Space orientation="vertical" style={{ width: '100%' }} className="mb-5">
              <Input.Search
                placeholder="Search sensor code..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                enterButton
                size="large"
                className="w-full"
              />
            </Space>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <CustomLoader />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={filteredData}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} sensors`,
                    pageSizeOptions: ['10', '20', '50'],
                    responsive: true,
                  }}
                  bordered
                  className="rounded-lg overflow-hidden"
                  scroll={{ x: 'max-content' }}
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SensorPage;