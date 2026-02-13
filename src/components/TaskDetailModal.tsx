'use client';

import React, { useEffect, useState } from 'react';
import { getTaskDetailByScheduleId } from '@/services/scheduleservices';
import { TaskDetailDto } from '@/types/scheduledto';

interface Props {
  scheduleId: number | null;
  onClose: () => void;
}

export default function TaskDetailModal({ scheduleId, onClose }: Props) {
  const [data, setData] = useState<TaskDetailDto | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!scheduleId) return;

    const loadDetail = async () => {
      setLoading(true);
      try {
        const res = await getTaskDetailByScheduleId(scheduleId);
        setData(res);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [scheduleId]);

  if (!scheduleId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-4xl rounded-xl bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold text-[#5D5FEF]">Schedule Task Details</h2>
          <button onClick={onClose} className="text-black font-bold hover:opacity-80">✕</button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          {loading && <p className="text-center">Loading details…</p>}

          {!loading && data && (
            <>
              {/* Top Info */}
              <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3 text-sm">
               <div className="flex items-center mb-2">
                {/* Label */}
                <div className="text-sm font-semibold  mr-1">Task Title:</div>

                {/* Checkbox + Task Title */}
                <div className="flex items-center">
                    <input
                    type="checkbox"
                    checked={data.occurrences.every(o => o.status === 1)}
                    disabled
                    className="h-5 w-5 accent-[#5D5FEF] mr-1"
                    />
                    <span className="font-semibold text-black">{data.taskTitle}</span>
                </div>
                </div>


                <div>
                  <span className="font-semibold text-black">Time:</span> {data.startTime} – {data.endTime}
                </div>
                <div>
                  <span className="font-semibold text-black">Type:</span> {data.scheduleType}
                </div>
              </div>

              {/* Occurrences */}
              <div className="space-y-4">
                {data.occurrences.map(occ => (
                  <div key={occ.taskOccurrenceId} className="rounded-lg border border-gray-200 p-4">
                    {/* Occurrence Date */}
                    <div className="mb-2 text-sm font-semibold">
                          <div className="text-sm font-semibold"> <h6>Subtask & Schedule Date: </h6></div>
                      {new Date(occ.occurrenceDate).toLocaleDateString()}
                    </div>

                    {/* Subtasks */}
                    <div className="space-y-2">
                      {occ.subTasks.map(sub => (
                        <label
                          key={sub.subTaskOccurrenceId}
                          className="flex items-center gap-3 rounded-md border px-3 py-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={sub.status === 1}
                            disabled
                              style={{ accentColor: '#5D5FEF' }}
                            className="h-5 w-5  mr-1"
                          />
                          <div>
                            <div className="text-black font-medium">{sub.subTaskName}</div>
                            
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-3">
          <button
            onClick={onClose}
            className="rounded-md bg-[#5D5FEF] px-5 py-2 text-sm text-white hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
