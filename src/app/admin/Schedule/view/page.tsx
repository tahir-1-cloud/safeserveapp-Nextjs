'use client';

import React, { useEffect, useState } from 'react';
import { getAllSchedule } from '@/services/scheduleservices';
import { ViewScheduleDto } from '@/types/scheduledto';
import { useRouter } from 'next/navigation';
import TaskDetailModal from '@/components/TaskDetailModal';

import CustomLoader from '@/components/CustomerLoader';
export default function AdminSchedulesPage() {
 const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);

  const [schedules, setSchedules] = useState<ViewScheduleDto[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllSchedule();
        setSchedules(data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getEnabledDays = (schedule: ViewScheduleDto): string[] => {
    const days: { key: keyof ViewScheduleDto; label: string }[] = [
      { key: 'isMonday', label: 'Monday' },
      { key: 'isTuesday', label: 'Tuesday' },
      { key: 'isWednesday', label: 'Wednesday' },
      { key: 'isThursday', label: 'Thursday' },
      { key: 'isFriday', label: 'Friday' },
      { key: 'isSaturday', label: 'Saturday' },
      { key: 'isSunday', label: 'Sunday' },
    ];

    return days.filter(d => schedule[d.key] === true).map(d => d.label);
  };

  const filteredSchedules = schedules.filter(s =>
    s.staffName.toLowerCase().includes(search.toLowerCase()) ||
    s.taskTitle?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-6 text-center">   <CustomLoader /> </div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Title */}
      <h1 className="mb-4 text-2xl font-semibold text-[#5D5FEF]">
        All Schedules
      </h1>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by staff or task..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5D5FEF]"
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSchedules.map(schedule => {
          const enabledDays = getEnabledDays(schedule);

          return (
            <div
              key={schedule.id}
              className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              {/* Accent */}
              <div className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-[#5D5FEF]" />

              {/* Row 1 – Task & Staff INLINE */}
              <div className="flex flex-wrap gap-x-10 gap-y-1">
                <p className="text-sm text-black">
                  <span className="font-semibold">Task Title:</span>{' '}
                  {schedule.taskTitle ?? 'Untitled Task'}
                </p>

                <p className="text-sm text-black">
                  <span className="font-semibold">Staff Name:</span>{' '}
                  {schedule.staffName}
                </p>
              </div>

              {/* Row 2 – Details */}
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3 text-sm">
                <div>
                  <span className="font-semibold">Date Range:</span>{' '}
                  {new Date(schedule.startDate).toLocaleDateString()} →{' '}
                  {new Date(schedule.endDate).toLocaleDateString()}
                </div>

                <div>
                  <span className="font-semibold">Time:</span>{' '}
                  {schedule.startTime} – {schedule.endTime}
                </div>

                <div>
                  <span className="font-semibold">Schedule Type:</span>{' '}
                  {schedule.scheduleType}
                </div>
              </div>

              {/* Row 3 – Days */}
              <div className="mt-3">
                <span className="font-semibold text-sm">Active Days:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {enabledDays.map(day => (
                    <span
                      key={day}
                      className="rounded-full bg-[#5D5FEF]/10 px-2.5 py-0.5 text-xs font-medium text-[#5D5FEF]"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              {/* Row 4 – Button */}
              <div className="mt-3 flex justify-end">
                <button
                    onClick={() => setSelectedScheduleId(schedule.id)}
                    className="rounded-md bg-[#5D5FEF] px-5 py-2 text-sm font-medium text-white shadow hover:opacity-90"
                    >
                    Schedule Details
                    </button>

              </div>
            </div>
          );
        })}

        {filteredSchedules.length === 0 && (
          <div className="text-center text-gray-500">
            No schedules found.
          </div>
        )}
      </div>
      
        {selectedScheduleId !== null && (
      <TaskDetailModal
        scheduleId={selectedScheduleId}
        onClose={() => setSelectedScheduleId(null)}
      />
    )}
    </div>
  );
}
