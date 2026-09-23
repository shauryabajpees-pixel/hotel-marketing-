import React, { useState } from 'react';
import { PhysicalRoom, RoomType, Booking } from '../../types/hotel';
import { hotelStore, addDays } from '../../services/hotelStore';
import { X, UserPlus, Key, AlertCircle } from 'lucide-react';

interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  physicalRooms: PhysicalRoom[];
  roomTypes: RoomType[];
  initialRoomId?: string;
  initialDate?: string;
  onBookingCreated: (booking: Booking) => void;
}

export const WalkInModal: React.FC<WalkInModalProps> = ({
  isOpen,
  onClose,
  physicalRooms,
  roomTypes,
  initialRoomId,
  initialDate,
  onBookingCreated,
}) => {
  if (!isOpen) return null;

  const todayStr = hotelStore.getTodayStr();

  const [roomId, setRoomId] = useState<string>(
    initialRoomId || physicalRooms[0]?.id || ''
  );
  const [checkIn, setCheckIn] = useState<string>(initialDate || todayStr);
  const [checkOut, setCheckOut] = useState<string>(
    addDays(initialDate || todayStr, 1)
  );
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [customRate, setCustomRate] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedRoom = physicalRooms.find((r) => r.id === roomId);
  const selectedType = roomTypes.find((t) => t.id === selectedRoom?.roomTypeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedRoom || !selectedType) {
      setErrorMessage('Please select a valid room.');
      return;
    }

    if (!guestName.trim()) {
      setErrorMessage('Guest full name is required.');
      return;
    }

    const rate = customRate ? parseFloat(customRate) : selectedType.basePrice;

    const res = hotelStore.createWalkInBooking({
      roomTypeId: selectedType.id,
      physicalRoomId: selectedRoom.id,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim() || 'walkin@auragrand.com',
      guestPhone: guestPhone.trim() || '+33 6 00 00 00 00',
      checkIn,
      checkOut,
      customRatePerNight: rate,
      specialRequests: specialRequests.trim(),
    });

    if (res.success && res.booking) {
      onBookingCreated(res.booking);
      onClose();
    } else {
      setErrorMessage(res.error || 'Failed to create walk-in reservation.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold font-serif-luxury">
                Direct Walk-In Reservation
              </h3>
              <p className="text-xs text-neutral-400">
                Front desk express folio creation & physical room allocation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Room Selector */}
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              Select Physical Room
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer text-xs"
            >
              {physicalRooms.map((r) => {
                const rt = roomTypes.find((t) => t.id === r.roomTypeId);
                return (
                  <option key={r.id} value={r.id}>
                    Room #{r.roomNumber} (Floor {r.floor} · {rt?.name} · {r.status})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-600 mb-1">Check-In</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono-nums"
              />
            </div>
            <div>
              <label className="block text-neutral-600 mb-1">Check-Out</label>
              <input
                type="date"
                value={checkOut}
                min={addDays(checkIn, 1)}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono-nums"
              />
            </div>
          </div>

          {/* Guest Contact */}
          <div className="space-y-3 pt-2 border-t border-neutral-100">
            <div>
              <label className="block text-neutral-600 mb-1">
                Guest Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Robert Langdon"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="guest@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-1">Mobile</label>
                <input
                  type="tel"
                  placeholder="+33 6 00 00 00 00"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono-nums"
                />
              </div>
            </div>
          </div>

          {/* Rate & Special Notes */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100">
            <div>
              <label className="block text-neutral-600 mb-1">
                Nightly Rate ($)
              </label>
              <input
                type="number"
                placeholder={`Base: $${selectedType?.basePrice || 480}`}
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono-nums"
              />
            </div>
            <div>
              <label className="block text-neutral-600 mb-1">
                Front Desk Remarks
              </label>
              <input
                type="text"
                placeholder="e.g. VIP guest, cash deposit"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Confirm Walk-In Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
