'use client';

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { getAllScheduleCalendar } from '@/services/scheduleservices';
import { CalendarEventDto } from '@/types/scheduledto';
import TaskDetailModal from '@/components/TaskDetailModal';
import CustomLoader from '@/components/CustomerLoader';

export default function CalendarPage() {
    const [events, setEvents] = useState<CalendarEventDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);

    // Map staff name to color
    const staffColors: Record<string, string> = {};
    const colors = [
        '#1E90FF', '#32CD32', '#FF8C00', '#FF1493', '#8A2BE2', '#00CED1', '#FFD700'
    ];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data: CalendarEventDto[] = await getAllScheduleCalendar();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching calendar events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const getColorForStaff = (staffName: string): string => {
        if (!staffColors[staffName]) {
            const color = colors[Object.keys(staffColors).length % colors.length];
            staffColors[staffName] = color;
        }
        return staffColors[staffName];
    };

    const handleEventClick = (info: EventClickArg) => {
        const id = Number(info.event.extendedProps.originalId);
        setSelectedScheduleId(id);
    };

    return (
        <div className="p-6">
            {loading ? (
                <CustomLoader />
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <style jsx global>{`
                        .fc {
                            max-width: 100%;
                            font-family: system-ui, -apple-system, sans-serif;
                        }
                        
                        /* Header toolbar */
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
                        
                        .fc .fc-button:hover {
                            background-color: #f3f4f6;
                            border-color: #9ca3af;
                        }
                        
                        .fc .fc-button-active {
                            background-color: #3b82f6 !important;
                            border-color: #3b82f6 !important;
                            color: white !important;
                        }
                        
                        /* Calendar table */
                        .fc .fc-scrollgrid {
                            border: 1px solid #e5e7eb !important;
                            border-radius: 0.5rem;
                            overflow: hidden;
                        }
                        
                        .fc .fc-scrollgrid-section > * {
                            border-color: #e5e7eb !important;
                        }
                        
                        /* Day headers - compact size */
                        .fc .fc-col-header-cell {
                            padding: 0.5rem 0.25rem;
                            background-color: #f9fafb;
                            border-color: #e5e7eb !important;
                        }
                        
                        .fc .fc-col-header-cell-cushion {
                            font-size: 0.75rem;
                            font-weight: 600;
                            color: #6b7280;
                            text-transform: uppercase;
                            letter-spacing: 0.025em;
                        }
                        
                        /* Day cells - compact */
                        .fc .fc-daygrid-day {
                            min-height: 70px;
                            border-color: #e5e7eb !important;
                        }
                        
                        .fc .fc-daygrid-day-top {
                            padding: 0.25rem 0.5rem;
                        }
                        
                        .fc .fc-daygrid-day-number {
                            font-size: 0.875rem;
                            color: #374151;
                            font-weight: 500;
                            padding: 0.125rem;
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
                        
                        /* Events - compact */
                        .fc .fc-daygrid-event {
                            margin: 1px 2px;
                            padding: 2px 4px;
                            border-radius: 0.25rem;
                            font-size: 0.75rem;
                            cursor: pointer;
                            border: none !important;
                        }
                        
                        .fc .fc-daygrid-event:hover {
                            opacity: 0.85;
                            transform: translateY(-1px);
                        }
                        
                        .fc .fc-event-title {
                            font-weight: 500;
                        }
                        
                        /* More link */
                        .fc .fc-daygrid-more-link {
                            font-size: 0.7rem;
                            color: #6b7280;
                            margin-top: 2px;
                        }
                        
                        /* Remove borders for cleaner look */
                        .fc .fc-scrollgrid-sync-inner {
                            border-color: #e5e7eb !important;
                        }
                        
                        /* Responsive adjustments */
                        @media (max-width: 768px) {
                            .fc .fc-toolbar {
                                flex-direction: column;
                                gap: 0.75rem;
                            }
                            
                            .fc .fc-toolbar-title {
                                font-size: 1.125rem;
                            }
                            
                            .fc .fc-daygrid-day {
                                min-height: 60px;
                            }
                        }
                    `}</style>
                    
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events.map(e => ({
                            id: `${e.id}-${e.eventdate}`,
                            title: e.title,
                            start: e.eventdate,
                            allDay: true,
                            backgroundColor: getColorForStaff(e.title),
                            borderColor: getColorForStaff(e.title),
                            extendedProps: {
                                originalId: e.id,
                            }
                        }))}
                        eventClick={handleEventClick}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
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