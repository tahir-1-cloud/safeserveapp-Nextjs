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
import { AdminAuth } from '@/hooks/AdminAuth';
export default function CalendarPage() {
    AdminAuth();

    const [events, setEvents] = useState<CalendarEventDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);

    /* ===============================
       Color Mapping (Optimized)
    ================================ */
    const staffColorsRef = useRef<Record<string, string>>({});
    const colors = [
        '#1E90FF', '#32CD32', '#FF8C00',
        '#FF1493', '#8A2BE2', '#00CED1', '#FFD700'
    ];

    const getColorForStaff = (staffName: string): string => {
        if (!staffColorsRef.current[staffName]) {
            const index =
                Object.keys(staffColorsRef.current).length % colors.length;
            staffColorsRef.current[staffName] = colors[index];
        }
        return staffColorsRef.current[staffName];
    };

    /* ===============================
       Fetch Data (Fast Load)
    ================================ */
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data: CalendarEventDto[] =
                    await getAllScheduleCalendar();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching calendar events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    /* ===============================
       Memoized Events (Performance Boost)
    ================================ */
    const calendarEvents = useMemo(() => {
        return events.map((e) => ({
            id: `${e.id}-${e.eventdate}`,
            title: e.title,
            start: e.eventdate,
            allDay: true,
            backgroundColor: getColorForStaff(e.title),
            borderColor: getColorForStaff(e.title),
            extendedProps: {
                originalId: e.id,
            },
        }));
    }, [events]);

    const handleEventClick = (info: EventClickArg) => {
        const id = Number(info.event.extendedProps.originalId);
        setSelectedScheduleId(id);
    };

    return (
        <div className="p-6">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Schedule View
                </h2>
             </div>
            {loading ? (
                <CustomLoader />
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <style jsx global>{`
                        .fc {
                            max-width: 100%;
                            font-family: system-ui, -apple-system, sans-serif;
                        }

                        /* Toolbar */
                        .fc .fc-toolbar {
                            margin-bottom: 1.5rem;
                        }

                        .fc .fc-toolbar-title {
                            font-size: 1.25rem;
                            font-weight: 600;
                            color: #1f2937;
                        }

                        .fc .fc-button {
                            padding: 0.5rem 1rem;
                            font-size: 0.875rem;
                            border-radius: 0.375rem;
                            border: 1px solid #d1d5db;
                            background-color: white;
                            color: #374151;
                            transition: all 0.2s;
                        }

                        /* Hover buttons */
                        .fc .fc-button:hover {
                            background-color: #3b82f6;
                            border-color: #3b82f6;
                            color: white;
                        }

                        /* Active view button */
                        .fc .fc-button-active {
                            background-color: #3b82f6 !important;
                            border-color: #3b82f6 !important;
                            color: white !important;
                        }

                        /* Calendar Border */
                        .fc .fc-scrollgrid {
                            border: 1px solid #e5e7eb !important;
                            border-radius: 0.5rem;
                            overflow: hidden;
                        }

                        .fc .fc-scrollgrid-section > * {
                            border-color: #e5e7eb !important;
                        }

                        /* Day header */
                        .fc .fc-col-header-cell {
                            padding: 0.5rem 0.25rem;
                            background-color: #f9fafb;
                        }

                        .fc .fc-col-header-cell-cushion {
                            font-size: 0.75rem;
                            font-weight: 600;
                            color: #6b7280;
                            text-transform: uppercase;
                        }

                        /* Day cells */
                        .fc .fc-daygrid-day {
                            min-height: 75px;
                        }

                        .fc .fc-daygrid-day-number {
                            font-size: 0.875rem;
                            font-weight: 500;
                        }

                        /* Hide previous/next month dates */
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
                            width: 1.75rem;
                            height: 1.75rem;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                        }

                        /* Events */
                        .fc .fc-daygrid-event {
                            margin: 2px;
                            padding: 2px 6px;
                            border-radius: 0.25rem;
                            font-size: 0.75rem;
                            border: none !important;
                            cursor: pointer;
                        }

                        .fc .fc-daygrid-event:hover {
                            opacity: 0.85;
                            transform: translateY(-1px);
                        }

                        /* Responsive */
                        @media (max-width: 768px) {
                            .fc .fc-toolbar {
                                flex-direction: column;
                                gap: 0.75rem;
                            }

                            .fc .fc-daygrid-day {
                                min-height: 60px;
                            }
                        }
                    `}</style>

                    <FullCalendar
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                        ]}
                        initialView="dayGridMonth"
                        events={calendarEvents}
                        eventClick={handleEventClick}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right:
                                'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        showNonCurrentDates={false}
                        fixedWeekCount={false}
                        progressiveEventRendering={true}
                        height="auto"
                        dayMaxEvents={3}
                        eventMaxStack={3}
                    />
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
