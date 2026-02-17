'use client';

import React, { useEffect, useState } from 'react';
import { DatePicker, TimePicker, Select, Button } from 'antd';
import dayjs from 'dayjs';
import { getStaffName, getTaskName, addschedule } from '@/services/scheduleservices';
import { StafNameModel, TaskNameModel, CreatScheduleModel } from '@/types/scheduledto';
import { toast } from 'sonner';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useRouter } from 'next/navigation';
import utc from 'dayjs/plugin/utc';
 
import { AdminAuth } from '@/hooks/AdminAuth';
dayjs.extend(customParseFormat);
dayjs.extend(utc);

const { Option } = Select;

const CreateSchedulePage: React.FC = () => {
     AdminAuth();
  
  const router = useRouter();
  const [staffList, setStaffList] = useState<StafNameModel[]>([]);
  const [taskList, setTaskList] = useState<TaskNameModel[]>([]);
  const [form, setForm] = useState<CreatScheduleModel>({
    id: 0,
    staffId: undefined,
    taskId: undefined,
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    scheduleType: '',
    isMonday: false,
    isTuesday: false,
    isWednesday: false,
    isThursday: false,
    isFriday: false,
    isSaturday: false,
    isSunday: false,
  });

  // Fetch Staff & Task names
  useEffect(() => {
    (async () => {
      try {
        const staff = await getStaffName();
        const tasks = await getTaskName();
        setStaffList(staff);
        setTaskList(tasks);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleChange = (name: keyof CreatScheduleModel, value: any) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleWeekday = (day: keyof CreatScheduleModel) => {
    setForm(prev => ({ ...prev, [day]: !prev[day] }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!form.staffId || !form.taskId || !form.startDate || !form.endDate || !form.startTime || !form.endTime || !form.scheduleType) {
    toast.error('Please fill all required fields');
    return;
  }

  // Parse dates in DD-MM-YYYY format
  const startDate = dayjs(form.startDate, 'DD-MM-YYYY');
  const endDate = dayjs(form.endDate, 'DD-MM-YYYY');
  
  if (endDate.isBefore(startDate)) {
    toast.error('End Date cannot be before Start Date');
    return;
  }

  try {
    // Find staff name from the list
    const selectedStaff = staffList.find(s => s.id === Number(form.staffId));

    // Format dates as ISO 8601 - FIX THE TIMEZONE ISSUE
    // Method 1: Use UTC to avoid timezone shifting
    const formattedStartDate = startDate.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const formattedEndDate = endDate.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    
    // OR Method 2: Set to midnight UTC
    // const formattedStartDate = startDate.utc().startOf('day').toISOString();
    // const formattedEndDate = endDate.utc().startOf('day').toISOString();

    // Format times to 24-hour format
    const startTimeObj = dayjs(form.startTime, 'hh:mm A');
    const endTimeObj = dayjs(form.endTime, 'hh:mm A');
    
    const formattedStartTime = startTimeObj.format('HH:mm:ss');
    const formattedEndTime = endTimeObj.format('HH:mm:ss');

    const payload: CreatScheduleModel = {
      id: 0,
      staffId: Number(form.staffId),
      staffName: selectedStaff?.name || '',
      taskId: Number(form.taskId),
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      scheduleType: form.scheduleType,
      isMonday: form.isMonday,
      isTuesday: form.isTuesday,
      isWednesday: form.isWednesday,
      isThursday: form.isThursday,
      isFriday: form.isFriday,
      isSaturday: form.isSaturday,
      isSunday: form.isSunday,
      createdAt: new Date().toISOString()
    };

    await addschedule(payload);
    toast.success('Schedule added successfully!');
    
    // Reset form
    setForm({
      id: 0,
      staffId: undefined,
      taskId: undefined,
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      scheduleType: '',
      isMonday: false,
      isTuesday: false,
      isWednesday: false,
      isThursday: false,
      isFriday: false,
      isSaturday: false,
      isSunday: false
    });
    
    router.push('/admin/Schedule/view');
  } catch (error) {
    console.error('Submit error:', error);
    toast.error('Failed to add schedule. Please check all fields and try again.');
  }
};

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5 max-w-8xl mx-auto mt-6">
       {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-medium text-black dark:text-white">Add Schedule</h3>
        <p className="text-sm text-body mt-1">
          Quickly add a new schedule 
        </p>
      </div>

      <button
        type="button"
        onClick={() => router.push("/admin/dashboard")}
        className="rounded-md border border-stroke px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
      >
        Back
      </button>
    </div>

    <hr className="my-4 border-t border-gray-300" />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT FORM */}
        <div className="col-span-7 space-y-4">
          {/* Staff */}
          <div >
            <label className="block mb-2.5 text-black dark:text-white">Select Staff</label>
            <Select
              placeholder="Please Select Staff"
              value={form.staffId}
              onChange={val => handleChange('staffId', val)}
              className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] bg-transparent px-5 py-3 text-black"
              allowClear
            >
              {staffList.map(staff => (
                <Option key={staff.id} value={staff.id}>
                  {staff.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Task */}
          <div>
            <label className="block mb-2.5 text-black dark:text-white">Select Task</label>
            <Select
              placeholder="Please Select Task"
              value={form.taskId}
              onChange={val => handleChange('taskId', val)}
              className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5]"
              allowClear
            >
              {taskList.map(task => (
                <Option key={task.id} value={task.id}>
                  {task.name}
                </Option>
              ))}
            </Select>
          </div>

       {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block mb-2.5 text-black dark:text-white">Date From</label>
            <DatePicker
            className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={form.startDate ? dayjs(form.startDate, 'DD-MM-YYYY') : null}
            format="DD-MM-YYYY"
            onChange={date => handleChange('startDate', date ? date.format('DD-MM-YYYY') : '')}
            />
        </div>
        <div>
            <label className="block mb-2.5 text-black dark:text-white">Date To</label>
            <DatePicker
            className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={form.endDate ? dayjs(form.endDate, 'DD-MM-YYYY') : null}
            format="DD-MM-YYYY"
            disabledDate={current => {
                if (!form.startDate) return false;
                const startDate = dayjs(form.startDate, 'DD-MM-YYYY');
                return current && current < startDate.startOf('day');
            }}
            onChange={date => handleChange('endDate', date ? date.format('DD-MM-YYYY') : '')}
            />
        </div>
        </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2.5 text-black dark:text-white">Start Time</label>
              <TimePicker
                className="w-full rounded-[10px]"
                value={form.startTime ? dayjs(form.startTime, 'hh:mm A') : null}
                onChange={time => handleChange('startTime', time ? time.format('hh:mm A') : '')}
                format="hh:mm A"
                use12Hours
              />
            </div>
            <div>
              <label className="block mb-2.5 text-black dark:text-white">End Time</label>
              <TimePicker
                className="w-full rounded-[10px]"
                value={form.endTime ? dayjs(form.endTime, 'hh:mm A') : null}
                onChange={time => handleChange('endTime', time ? time.format('hh:mm A') : '')}
                format="hh:mm A"
                use12Hours
              />
            </div>
          </div>

          {/* Schedule Type */}
          <div>
            <label className="block mb-2.5 text-black dark:text-white">Schedule Type</label>
            <Select
              placeholder="Select Type"
              value={form.scheduleType}
              onChange={val => handleChange('scheduleType', val)}
              className="w-full rounded-[10px]"
              allowClear
            >
              <Option value="One Time">One Time</Option>
              <Option value="Daily">Daily</Option>
              <Option value="Weekly">Weekly</Option>
              <Option value="Monthly">Monthly</Option>
            </Select>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[#5D5FEF] rounded-lg px-10 py-3 font-semibold hover:bg-blue-700 transition"
            >
              Save Schedule
            </Button>
          </div>
        </div>

        {/* RIGHT SIDE WEEKDAY BUTTONS */}
        <div className="col-span-5 flex flex-col gap-3 mt-4 lg:mt-0 mr-6 p-[40px]">
          {(['isMonday', 'isTuesday', 'isWednesday', 'isThursday', 'isFriday', 'isSaturday', 'isSunday'] as const).map(day => (
            <button
              key={day}
              type="button"
              onClick={() => toggleWeekday(day)}
              className={`py-2 rounded-lg font-medium transition ${
                form[day] ? 'bg-[#5D5FEF] text-white' : 'bg-gray-200 text-black dark:text-white'
              } hover:opacity-90`}
            >
              {day.replace('is', '')}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default CreateSchedulePage;
