import React, { useState } from 'react';
import {
  PhysicalRoom,
  RoomType,
  Booking,
} from '../../types/hotel';
import { hotelStore, addDays, formatDate, getDatesBetween } from '../../services/hotelStore';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Key,
  User,
  Clock,
  Plus,
} from 'lucide-react';

interface TimelineMatrixProps {
  physicalRooms: PhysicalRoom[];
  roomTypes: RoomType[];
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onOpenWalkInForRoom: (roomId: string, date: string) => void;
}

export const TimelineMatrix: React.FC<TimelineMatrixProps> = ({
  physicalRooms,
  roomTypes,
  bookings,
  onSelectBooking,
  onOpenWalkInForRoom,
}) => {
  const todayStr = hotelStore.getTodayStr();
  // Start date of the 14-day window (starts 2 days prior to today for context)
  const [startDate, setStartDate] = useState<string>(addDays(todayStr, -2));

  // Generate 14 days
  const daysWindowCount = 14;
  const dates: string[] = [];
  let curr = startDate;
  for (let i = 0; i < daysWindowCount; i++) {
    dates.push(curr);
    curr = addDays(curr, 1);
  }

  const handlePrevWeek = () => {
    setStartDate(addDays(startDate, -7));
  };

  const handleNextWeek = () => {
    setStartDate(addDays(startDate, 7));
  };

  const handleJumpToday = () => {
    setStartDate(addDays(todayStr, -2));
  };

  // Group rooms by room type
  const roomsByType = roomTypes.map((rt) => ({
    type: rt,
    rooms: physicalRooms.filter((r) => r.roomTypeId === rt.id),
  }));

  // Find booking for a physical room that intersects the timeline window
  const getBookingsForRoom = (roomId: string) => {
    const windowStart = dates[0];
    const windowEnd = dates[dates.length - 1];

    return bookings.filter((b) => {
      if (b.assignedRoomId !== roomId) return false;
      if (b.status === 'CANCELLED') return false;
      // Overlap condition: b.checkIn <= windowEnd && b.checkOut > windowStart
      return b.checkIn <= windowEnd && b.checkOut > windowStart;
    });
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'CHECKED_IN':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700';
      case 'CONFIRMED':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700';
      case 'HOLD':
        return 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600';
      case 'CHECKED_OUT':
        return 'bg-neutral-500 hover:bg-neutral-600 text-white border-neutral-600';
      default:
        return 'bg-neutral-600 text-white';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
      {/* Top Controls Bar */}
      <div className="p-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 bg-neutral-50">
        <div className="flex items-center gap-2">
          <h3 className="font-serif-luxury text-base font-bold text-neutral-900">
            Room Allocation Matrix & Timeline
          </h3>
          <span className="text-xs text-neutral-500">
            (14-Day View · Interactive Gantt PMS)
          </span>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleJumpToday}
            className="px-2.5 py-1 text-xs font-semibold bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-neutral-700 transition-colors cursor-pointer"
          >
            Today
          </button>
          <div className="flex items-center border border-neutral-300 rounded overflow-hidden bg-white">
            <button
              onClick={handlePrevWeek}
              className="p-1.5 hover:bg-neutral-100 text-neutral-600 border-r border-neutral-200 cursor-pointer"
              title="Previous 7 Days"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-mono-nums font-medium text-neutral-700">
              {dates[0]} → {dates[dates.length - 1]}
            </span>
            <button
              onClick={handleNextWeek}
              className="p-1.5 hover:bg-neutral-100 text-neutral-600 cursor-pointer"
              title="Next 7 Days"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-3 text-[11px] text-neutral-600">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
            <span>Checked In</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
            <span>Hold (10m)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-neutral-400" />
            <span>Checked Out</span>
          </div>
        </div>
      </div>

      {/* Gantt Matrix Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[980px]">
          {/* Header Row: Dates */}
          <div className="flex border-b border-neutral-200 bg-neutral-100/70 text-xs font-medium text-neutral-700 sticky top-0 z-10">
            {/* Room Info Column Header */}
            <div className="w-48 shrink-0 p-2.5 border-r border-neutral-200 font-semibold text-neutral-800">
              Physical Room
            </div>

            {/* 14 Date Columns */}
            <div className="flex-1 grid grid-cols-14 divide-x divide-neutral-200">
              {dates.map((d) => {
                const isToday = d === todayStr;
                const [y, m, dayNum] = d.split('-').map(Number);
                const dateObj = new Date(y, m - 1, dayNum);
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

                return (
                  <div
                    key={d}
                    className={`text-center py-2 px-1 ${
                      isToday ? 'bg-amber-100/70 text-amber-950 font-bold' : ''
                    }`}
                  >
                    <div className="text-[10px] uppercase opacity-75">{dayName}</div>
                    <div className="text-xs font-mono-nums">{dayNum}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Matrix Rows grouped by Room Tier */}
          <div className="divide-y divide-neutral-200">
            {roomsByType.map(({ type, rooms }) => (
              <div key={type.id} className="bg-white">
                {/* Category Group Sub-header */}
                <div className="bg-neutral-50/80 px-4 py-1.5 border-b border-neutral-200/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-800">
                    {type.name}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono-nums">
                    ${type.basePrice}/night · {rooms.length} physical units
                  </span>
                </div>

                {/* Individual Room Rows */}
                {rooms.map((room) => {
                  const roomBookings = getBookingsForRoom(room.id);

                  return (
                    <div
                      key={room.id}
                      className="flex h-14 border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors relative"
                    >
                      {/* Left: Room Badge & Status */}
                      <div className="w-48 shrink-0 p-2.5 border-r border-neutral-200 flex items-center justify-between bg-white z-10">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-nums font-bold text-sm text-neutral-900">
                            #{room.roomNumber}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            Fl {room.floor}
                          </span>
                        </div>

                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wider ${
                            room.status === 'AVAILABLE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : room.status === 'OCCUPIED'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : room.status === 'DIRTY'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : room.status === 'IN_PROGRESS'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {room.status}
                        </span>
                      </div>

                      {/* Right: Date Grid Cells with clickable empty slots */}
                      <div className="flex-1 grid grid-cols-14 divide-x divide-neutral-100 relative h-full">
                        {/* Background Clickable Cells for Quick Walk-In */}
                        {dates.map((d) => (
                          <div
                            key={d}
                            onClick={() => onOpenWalkInForRoom(room.id, d)}
                            className="h-full hover:bg-amber-50/40 cursor-pointer transition-colors group flex items-center justify-center"
                            title={`Click to book Room ${room.roomNumber} for ${d}`}
                          >
                            <Plus className="w-3 h-3 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}

                        {/* Positioned Booking Blocks */}
                        {roomBookings.map((b) => {
                          // Calculate start index and span in the 14-day window
                          const windowStart = dates[0];
                          const startIndex = dates.indexOf(b.checkIn);
                          const endIndex = dates.indexOf(b.checkOut);

                          let leftCol = startIndex !== -1 ? startIndex : 0;
                          let spanCols =
                            endIndex !== -1
                              ? endIndex - leftCol
                              : dates.length - leftCol;

                          if (b.checkIn < windowStart) {
                            leftCol = 0;
                            spanCols = dates.indexOf(b.checkOut);
                            if (spanCols === -1) spanCols = dates.length;
                          }

                          spanCols = Math.max(1, spanCols);

                          // Calculate CSS percent
                          const leftPct = (leftCol / daysWindowCount) * 100;
                          const widthPct = (spanCols / daysWindowCount) * 100;

                          return (
                            <div
                              key={b.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectBooking(b);
                              }}
                              style={{
                                left: `${leftPct}%`,
                                width: `${widthPct}%`,
                              }}
                              className={`absolute top-2 bottom-2 rounded-md shadow-xs border text-xs px-2 py-1 flex items-center justify-between overflow-hidden cursor-pointer transition-transform hover:scale-[1.01] z-20 ${getStatusColor(
                                b.status
                              )}`}
                              title={`${b.guestName} (${b.bookingReference}) · ${b.checkIn} to ${b.checkOut} · Status: ${b.status}`}
                            >
                              <div className="truncate flex items-center gap-1 font-medium">
                                <User className="w-3 h-3 shrink-0 opacity-80" />
                                <span className="truncate">{b.guestName}</span>
                              </div>
                              <span className="text-[10px] opacity-90 font-mono-nums shrink-0 ml-1">
                                {b.nightsCount}n
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
