'use client';

import React, { useState } from 'react';
import {
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { toast } from 'sonner';

import { createTask } from '@/services/taskservices';
import { TaskCreatModel } from '@/types/taskManagement';
import { useRouter } from 'next/navigation';
 
import { AdminAuth } from '@/hooks/AdminAuth';

const TaskPage: React.FC = () => {
  
AdminAuth();
  /* ---------------- SINGLE MODEL STATE ---------------- */
    const router = useRouter();
  const [task, setTask] = useState<TaskCreatModel>({
    taskId: 0,
    taskTitle: '',
    taskType: undefined,
    category: undefined,
    priority: 'Normal',
    taskDescription: '',
    subtasks: [],
  });

  /* ---------------- GENERIC UPDATE ---------------- */
  const updateField = <K extends keyof TaskCreatModel>(
    key: K,
    value: TaskCreatModel[K]
  ) => {
    setTask(prev => ({ ...prev, [key]: value }));
  };

  /* ---------------- SUBTASK HANDLERS ---------------- */
  const addSubtask = () => {
    if (task.subtasks?.length && !task.subtasks[0]?.trim()) {
      toast.error('Please add first subtask before adding another');
      return;
    }
    setTask(prev => ({
      ...prev,
      subtasks: [...(prev.subtasks ?? []), ''],
    }));
  };

  const updateSubtask = (index: number, value: string) => {
    setTask(prev => {
      const updated = [...(prev.subtasks ?? [])];
      updated[index] = value;
      return { ...prev, subtasks: updated };
    });
  };

  const removeSubtask = (index: number) => {
    setTask(prev => ({
      ...prev,
      subtasks: prev.subtasks?.filter((_, i) => i !== index),
    }));
  };

  /* ---------------- VALIDATION ---------------- */
  const isValid = () => {
    if (!task.taskTitle?.trim()) {
      toast.error('Task title is required');
      return false;
    }
    if (!task.taskType) {
      toast.error('Task type is required');
      return false;
    }
    if (!task.category) {
      toast.error('Category is required');
      return false;
    }
    if (!task.subtasks?.length || !task.subtasks[0]?.trim()) {
      toast.error('At least one subtask is required');
      return false;
    }
    return true;
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    if (!isValid()) return;

    try {
      await createTask({
        ...task,
        subtasks: task.subtasks?.filter(s => s.trim() !== ''),
      });

      toast.success('Task created successfully');

     setTask({
      taskId: 0,
      taskTitle: '',
      taskType: undefined,
      category: undefined,
      priority: 'Normal',
      taskDescription: '',
      subtasks: [],
    });
    } catch {
      toast.error('Failed to create task');
    }
  };

return (
  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5 max-w-8xl mx-auto mt-6">
    
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-medium text-black dark:text-white">Create Task</h3>
        <p className="text-sm text-body mt-1">
          Quickly add a new task and subtasks using the form below.
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

    <form className="space-y-6">
      
   {/* Task Title & Add Subtask */}
    <div className="flex flex-col xl:flex-row xl:items-end gap-4">
      {/* Task Title */}
      <div className="flex-1">
        <label className="mb-2.5 block text-black dark:text-white">Task Title</label>
        <input
          type="text"
          placeholder="Enter Task Title"
          value={task.taskTitle}
          onChange={e => updateField('taskTitle', e.target.value)}
          className="w-full px-5 py-3 text-[#5D5FEF] rounded-[10px] outline-none bg-transparent"
        />
      </div>

      {/* Add Subtask Button */}
      <div>
        <button
          type="button"
          onClick={addSubtask}
          style={{ backgroundColor: "#5D5FEF" }}
          className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          <PlusOutlined className="h-4 w-4 text-white" />
          <span className="ml-2">Add Subtask</span>
        </button>
      </div>
    </div>


        {/* Subtasks */}
      {task.subtasks.length > 0 && (
        <div>
          <label className="mb-2.5 block text-black dark:text-white">Subtasks</label>
          <div className="space-y-3">
            {task.subtasks.map((subtask, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  placeholder={`Subtask ${index + 1}`}
                  value={subtask}
                  onChange={e => updateSubtask(index, e.target.value)}
                  className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => removeSubtask(index)}
                  className="px-4 py-3 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <DeleteOutlined />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
               <hr className="my-4 border-t border-gray-300" />

      {/* Type & Category */}
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="w-full xl:w-1/2">
          <label className="mb-2.5 block text-black dark:text-white">Type</label>
          <select
            value={task.taskType}
            onChange={v => updateField('taskType', v.target.value)}
            className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">Select Type</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        <div className="w-full xl:w-1/2">
          <label className="mb-2.5 block text-black dark:text-white">Category</label>
          <select
            value={task.category}
            onChange={v => updateField('category', v.target.value)}
            className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">Select Category</option>
            <option value="Fridge Cleaner">Fridge Cleaner</option>
            <option value="Bakery Cleaner">Bakery Cleaner</option>
            <option value="Dry Ice Blasting & Steam">Dry Ice Blasting & Steam</option>
          </select>
        </div>
      </div>

    

      {/* Priority */}
      <div>
        <label className="mb-2.5 block text-black dark:text-white">Priority</label>
        <div className="flex gap-3">
          {['Low', 'Normal', 'High'].map(p => (
            <button
              key={p}
              type="button"
              onClick={() => updateField('priority', p)}
              className={`px-6 py-2 rounded-lg font-medium ${
                task.priority === p ? 'bg-[#5D5FEF] text-white' : 'bg-gray-200 text-black dark:text-white'
              } transition`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>


      {/* Description */}
      <div>
        <label className="mb-2.5 block text-black dark:text-white">Task Description</label>
        <textarea
          rows={5}
          placeholder="Write task description (supports copy-paste from Word)"
          value={task.taskDescription}
          onChange={e => updateField('taskDescription', e.target.value)}
          className="w-full rounded-[10px] border-[1.5px] border-[#C0C2C5] px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          style={{ backgroundColor: "#5D5FEF" }}
          className="px-10 py-3 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-200"
        >
          Save Task
        </button>
      </div>

    </form>
  </div>
);


};

export default TaskPage;
