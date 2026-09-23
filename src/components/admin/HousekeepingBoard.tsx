import React, { useState } from 'react';
import { PhysicalRoom, RoomType, RoomStatus } from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Wrench,
  Edit2,
  Smartphone,
  Check,
} from 'lucide-react';

interface HousekeepingBoardProps {
  physicalRooms: PhysicalRoom[];
  roomTypes: RoomType[];
}

const CLEANERS = ['Sophie M.', 'Elena R.', 'Marc D.', 'Antoine B.'];

const COLUMNS: { status: RoomStatus; label: string; bg: string; border: string; text: string }[] = [
  { status: 'DIRTY', label: 'Dirty / Turnover', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
  { status: 'IN_PROGRESS', label: 'In Progress', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
  { status: 'INSPECTED', label: 'Inspected', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
  { status: 'AVAILABLE', label: 'Clean & Available', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
  { status: 'OUT_OF_ORDER', label: 'Out of Order', bg: 'bg-neutral-100', border: 'border-neutral-300', text: 'text-neutral-700' },
];

export const HousekeepingBoard: React.FC<HousekeepingBoardProps> = ({
  physicalRooms,
  roomTypes,
}) => {
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [tabletMode, setTabletMode] = useState(false);

  const getRoomTypeName = (typeId: string) => {
    return roomTypes.find((r) => r.id === typeId)?.name || 'Suite';
  };

  const handleStatusChange = (roomId: string, newStatus: RoomStatus) => {
    hotelStore.updateRoomStatus(roomId, newStatus);
  };

  const handleAssignCleaner = (roomId: string, cleaner: string) => {
    hotelStore.updateRoomStatus(roomId, physicalRooms.find((r) => r.id === roomId)?.status || 'AVAILABLE', cleaner);
  };

  const handleSaveNote = (roomId: string) => {
    hotelStore.updateRoomStatus(
      roomId,
      physicalRooms.find((r) => r.id === roomId)?.status || 'AVAILABLE',
      undefined,
      noteText
    );
    setEditingRoomId(null);
  };

  // Quick count metrics
  const cleanCount = physicalRooms.filter((r) => r.status === 'AVAILABLE' || r.status === 'INSPECTED').length;
  const dirtyCount = physicalRooms.filter((r) => r.status === 'DIRTY').length;
  const progressCount = physicalRooms.filter((r) => r.status === 'IN_PROGRESS').length;

  return (
    <div className="space-y-4">
      {/* Top Controls & KPI Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-luxury text-base font-bold text-neutral-900">
            Housekeeping Management Board
          </h3>
          <p className="text-xs text-neutral-500">
            Real-time room sanitation tracking and turnaround dispatch
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ready: {cleanCount}</span>
          </div>

          <div className="flex items-center gap-1.5 text-red-800 bg-red-50 px-2.5 py-1 rounded border border-red-200 font-medium">
            <Clock className="w-3.5 h-3.5 text-red-600" />
            <span>Turnover Required: {dirtyCount}</span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Cleaning Active: {progressCount}</span>
          </div>

          <button
            onClick={() => setTabletMode(!tabletMode)}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border ${
              tabletMode
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{tabletMode ? 'Standard Mode' : 'Floor Tablet View'}</span>
          </button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div
        className={`grid gap-4 ${
          tabletMode ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5'
        }`}
      >
        {COLUMNS.map((col) => {
          const colRooms = physicalRooms.filter((r) => r.status === col.status);

          return (
            <div
              key={col.status}
              className={`rounded-xl border ${col.border} ${col.bg} p-3 flex flex-col min-h-[500px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${col.text}`}>
                  {col.label}
                </span>
                <span className="w-5 h-5 rounded-full bg-white/80 border border-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-700">
                  {colRooms.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5 flex-1">
                {colRooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white p-3.5 rounded-lg border border-neutral-200 shadow-xs hover:shadow-sm transition-shadow space-y-2"
                  >
                    {/* Top Row: Room # & Tier */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono-nums font-extrabold text-base text-neutral-900 block">
                          Room #{room.roomNumber}
                        </span>
                        <span className="text-[10px] text-neutral-500 truncate block">
                          Floor {room.floor} · {getRoomTypeName(room.roomTypeId)}
                        </span>
                      </div>

                      {/* Quick Move Dropdown */}
                      <select
                        value={room.status}
                        onChange={(e) =>
                          handleStatusChange(room.id, e.target.value as RoomStatus)
                        }
                        className="text-[10px] font-semibold bg-neutral-50 border border-neutral-200 rounded px-1.5 py-1 text-neutral-700 cursor-pointer"
                      >
                        <option value="DIRTY">Mark Dirty</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="INSPECTED">Inspected</option>
                        <option value="AVAILABLE">Available</option>
                        <option value="OUT_OF_ORDER">Out of Order</option>
                      </select>
                    </div>

                    {/* Housekeeper Assignment */}
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <span className="text-neutral-400 text-[10px] flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Attendant:
                      </span>
                      <select
                        value={room.assignedHousekeeper || ''}
                        onChange={(e) => handleAssignCleaner(room.id, e.target.value)}
                        className="text-[11px] bg-transparent font-medium text-neutral-700 cursor-pointer hover:underline"
                      >
                        <option value="">Unassigned</option>
                        {CLEANERS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Room Notes / Special Instructions */}
                    <div className="pt-1.5 border-t border-neutral-100 text-xs">
                      {editingRoomId === room.id ? (
                        <div className="space-y-1.5 mt-1">
                          <textarea
                            rows={2}
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Add sanitation or guest preferences..."
                            className="w-full text-xs p-1.5 border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-600 bg-neutral-50"
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setEditingRoomId(null)}
                              className="px-2 py-0.5 text-[10px] text-neutral-500 hover:text-neutral-800"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNote(room.id)}
                              className="px-2 py-0.5 text-[10px] bg-neutral-900 text-white rounded font-medium"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingRoomId(room.id);
                            setNoteText(room.notes || '');
                          }}
                          className="cursor-pointer group flex items-start justify-between gap-1 text-[11px] text-neutral-600 hover:text-neutral-900"
                        >
                          <span className="italic line-clamp-2">
                            {room.notes || '+ Click to add housekeeping note'}
                          </span>
                          <Edit2 className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 shrink-0 mt-0.5" />
                        </div>
                      )}
                    </div>

                    {/* Last Cleaned Timestamp */}
                    {room.lastCleaned && (
                      <div className="text-[9px] text-neutral-400 font-mono-nums pt-1">
                        Sanitized: {room.lastCleaned}
                      </div>
                    )}
                  </div>
                ))}

                {colRooms.length === 0 && (
                  <div className="h-28 border border-dashed border-neutral-300/80 rounded-lg flex items-center justify-center text-xs text-neutral-400 italic">
                    No rooms
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
