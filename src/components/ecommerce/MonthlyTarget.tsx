'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { getAllScheduleCalendar } from '@/services/scheduleservices';
import { CalendarEventDto } from '@/types/scheduledto';
import TaskDetailModal from '@/components/TaskDetailModal';
import CustomLoader from '@/components/CustomerLoader';

export default function MonthlyTarget() {
  const [events, setEvents] = useState<CalendarEventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);

  const staffColorsRef = useRef<Record<string, string>>({});
  const colors = ['#1E90FF', '#32CD32', '#FF8C00', '#FF1493', '#8A2BE2', '#00CED1', '#FFD700'];

  const getColorForStaff = (staffName: string) => {
    if (!staffColorsRef.current[staffName]) {
      const index = Object.keys(staffColorsRef.current).length % colors.length;
      staffColorsRef.current[staffName] = colors[index];
    }
    return staffColorsRef.current[staffName];
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllScheduleCalendar();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching calendar events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const calendarEvents = useMemo(
    () =>
      events.map((e) => ({
        id: `${e.id}-${e.eventdate}`,
        title: e.title,
        start: e.eventdate,
        allDay: true,
        backgroundColor: getColorForStaff(e.title),
        borderColor: getColorForStaff(e.title),
        extendedProps: { originalId: e.id },
      })),
    [events]
  );

  const handleEventClick = (info: EventClickArg) => {
    const id = Number(info.event.extendedProps.originalId);
    setSelectedScheduleId(id);
  };

  return (
    <div className="w-full">
      {loading ? (
        <CustomLoader />
      ) : (
        <div className="w-full bg-white rounded-lg shadow border border-gray-300 p-2">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            showNonCurrentDates={false}
            fixedWeekCount={false}
            progressiveEventRendering
            height="auto"
            contentHeight="auto"
            dayMaxEvents={3}
            eventMaxStack={3}
            dayCellClassNames={() => 'px-2 py-1'}
          />

          <style jsx global>{`
            .fc {
              width: 100%;
              font-family: system-ui, -apple-system, sans-serif;
            }

            /* Toolbar */
            .fc .fc-toolbar {
              margin-bottom: 0.5rem;
              padding: 0 1rem;
            }

            .fc .fc-button,
            .fc .fc-button-active {
              padding: 0.35rem 0.75rem;
              font-size: 0.85rem;
              border-radius: 0.375rem;
            }

            .fc .fc-scrollgrid {
              border: 1px solid #d1d5db !important; /* calendar border */
              border-radius: 0.5rem;
              overflow: hidden;
            }

            /* Day cells */
            .fc .fc-daygrid-day {
              min-height: 55px;
            }

            .fc .fc-day-other {
              display: none !important;
            }

            /* Today highlight */
            .fc .fc-day-today {
              background-color: #eff6ff !important;
            }

            .fc .fc-day-today .fc-daygrid-day-number {
              background-color: #3b82f6;
              color: white;
              border-radius: 50%;
              width: 1.6rem;
              height: 1.6rem;
              display: inline-flex;
              align-items: center;
              justify-content: center;
            }

            /* Events styling */
            .fc .fc-daygrid-event {
              margin: 1px 0;
              padding: 2px 4px;
              border-radius: 0.25rem;
              font-size: 0.75rem;
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
              .fc .fc-toolbar {
                flex-direction: column;
                gap: 0.5rem;
              }
              .fc .fc-daygrid-day {
                min-height: 50px;
              }
            }
          `}</style>
        </div>
      )}

      {selectedScheduleId !== null && (
        <TaskDetailModal
          scheduleId={selectedScheduleId}
          onClose={() => setSelectedScheduleId(null)}
        />
      )}
    </div>
  );
}
