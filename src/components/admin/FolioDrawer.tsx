import React, { useState } from 'react';
import { Booking, PhysicalRoom, RoomType } from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import {
  X,
  Key,
  UserCheck,
  LogOut,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  Printer,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface FolioDrawerProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  physicalRooms: PhysicalRoom[];
  roomTypes: RoomType[];
}

export const FolioDrawer: React.FC<FolioDrawerProps> = ({
  booking,
  isOpen,
  onClose,
  physicalRooms,
  roomTypes,
}) => {
  if (!isOpen || !booking) return null;

  const [chargeDesc, setChargeDesc] = useState('');
  const [chargeAmount, setChargeAmount] = useState('');
  const [reassignError, setReassignError] = useState<string | null>(null);

  const roomType = roomTypes.find((r) => r.id === booking.roomTypeId);
  const eligibleRooms = physicalRooms.filter(
    (r) => r.roomTypeId === booking.roomTypeId
  );

  const handleReassign = (newRoomId: string) => {
    setReassignError(null);
    const res = hotelStore.reassignPhysicalRoom(booking.id, newRoomId);
    if (!res.success) {
      setReassignError(res.error || 'Failed to reassign room.');
    }
  };

  const handleCheckIn = () => {
    setReassignError(null);
    const res = hotelStore.checkInGuest(booking.id);
    if (!res.success) {
      setReassignError(res.error || 'Cannot check in guest.');
    }
  };

  const handleCheckOut = () => {
    setReassignError(null);
    const res = hotelStore.checkOutGuest(booking.id);
    if (!res.success) {
      setReassignError(res.error || 'Cannot check out guest.');
    }
  };

  const handleAddCharge = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(chargeAmount);
    if (!chargeDesc.trim() || isNaN(amount) || amount <= 0) return;

    hotelStore.addChargeToBooking(booking.id, chargeDesc.trim(), amount);
    setChargeDesc('');
    setChargeAmount('');
  };

  const handleCancelBooking = () => {
    if (confirm(`Cancel reservation ${booking.bookingReference} and return inventory?`)) {
      hotelStore.cancelBooking(booking.id, 'Front Desk Staff');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-neutral-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-neutral-200 bg-neutral-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-nums font-bold text-amber-400">
                {booking.bookingReference}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  booking.status === 'CONFIRMED'
                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                    : booking.status === 'CHECKED_IN'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : booking.status === 'CHECKED_OUT'
                    ? 'bg-neutral-800 text-neutral-300'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}
              >
                {booking.status}
              </span>
            </div>
            <h3 className="text-lg font-bold font-serif-luxury text-white mt-1">
              {booking.guestName}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert if any */}
        {reassignError && (
          <div className="p-3 bg-red-50 border-b border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{reassignError}</span>
          </div>
        )}

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Quick Front Desk Operations Bar */}
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center justify-between gap-2">
            <div className="text-xs">
              <span className="text-neutral-500 block text-[10px] uppercase">
                Quick Actions
              </span>
              <span className="font-semibold text-neutral-800">
                Status: {booking.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {booking.status === 'CONFIRMED' && (
                <button
                  onClick={handleCheckIn}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Check-In</span>
                </button>
              )}

              {booking.status === 'CHECKED_IN' && (
                <button
                  onClick={handleCheckOut}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Check-Out</span>
                </button>
              )}

              {booking.status !== 'CANCELLED' && booking.status !== 'CHECKED_OUT' && (
                <button
                  onClick={handleCancelBooking}
                  className="px-2.5 py-1.5 text-xs text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer"
                  title="Cancel reservation & release room"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Stay & Room Allocation Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Room & Dates
            </h4>
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Suite Category:</span>
                <span className="font-medium text-neutral-900">{roomType?.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Duration:</span>
                <span className="font-mono-nums text-neutral-900">
                  {booking.checkIn} → {booking.checkOut} ({booking.nightsCount} nights)
                </span>
              </div>

              {/* Physical Room Allocation Selector */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-neutral-700 font-medium flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-amber-700" />
                  Assigned Room:
                </span>
                <select
                  value={booking.assignedRoomId || ''}
                  onChange={(e) => handleReassign(e.target.value)}
                  className="px-2 py-1 bg-neutral-50 border border-neutral-300 rounded text-xs font-mono-nums font-semibold cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  {eligibleRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      Room {r.roomNumber} (Floor {r.floor} - {r.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Guest Profile & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Guest Profile
            </h4>
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Email:</span>
                <span className="font-mono-nums text-neutral-900">{booking.guestEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Phone:</span>
                <span className="font-mono-nums text-neutral-900">{booking.guestPhone}</span>
              </div>
              {booking.specialRequests && (
                <div className="pt-2 border-t border-neutral-100">
                  <span className="text-neutral-500 block text-[10px] uppercase">
                    Butler & Special Requests
                  </span>
                  <p className="text-neutral-700 italic mt-0.5">"{booking.specialRequests}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Billing Folio Ledger */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Itemized Folio Ledger
              </h4>
              <span className="text-xs font-bold text-amber-900 font-mono-nums">
                Total: ${booking.totalAmount}
              </span>
            </div>

            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-2 text-xs">
              {booking.charges.map((ch) => (
                <div
                  key={ch.id}
                  className="flex justify-between items-center py-1 border-b border-neutral-200/60 last:border-0"
                >
                  <div>
                    <span className="text-neutral-800 font-medium">{ch.description}</span>
                    <span className="block text-[10px] text-neutral-400 font-mono-nums">
                      {ch.date}
                    </span>
                  </div>
                  <span className="font-mono-nums font-bold text-neutral-900">
                    ${ch.amount}
                  </span>
                </div>
              ))}
            </div>

            {/* Post Charge Form */}
            <form onSubmit={handleAddCharge} className="bg-white p-3.5 rounded-xl border border-neutral-200 space-y-2">
              <span className="text-[11px] font-semibold text-neutral-700 block">
                Post Additional Incidentals / Room Service:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Minibar, Spa Massage, Laundry"
                  value={chargeDesc}
                  onChange={(e) => setChargeDesc(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
                <input
                  type="number"
                  placeholder="$ Amount"
                  value={chargeAmount}
                  onChange={(e) => setChargeAmount(e.target.value)}
                  className="w-24 px-2 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-amber-600 font-mono-nums"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-xs font-semibold text-neutral-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-500" />
            <span>Print Guest Folio</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded text-xs font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
