import React, { useState } from 'react';
import { hotelStore } from '../../services/hotelStore';
import { Booking } from '../../types/hotel';
import { Search, X, CheckCircle2, AlertCircle, Key, Calendar } from 'lucide-react';

interface BookingLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVoucher: (booking: Booking) => void;
}

export const BookingLookupModal: React.FC<BookingLookupModalProps> = ({
  isOpen,
  onClose,
  onOpenVoucher,
}) => {
  const [reference, setReference] = useState('');
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRef = reference.trim().toUpperCase();
    const allBookings = hotelStore.getData().bookings;
    const match = allBookings.find(
      (b) => b.bookingReference.toUpperCase() === cleanRef
    );
    setFoundBooking(match || null);
    setSearched(true);
  };

  const handleSampleClick = (code: string) => {
    setReference(code);
    const allBookings = hotelStore.getData().bookings;
    const match = allBookings.find((b) => b.bookingReference === code);
    setFoundBooking(match || null);
    setSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-serif-luxury font-bold text-neutral-900">
              Find Your Reservation
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Enter your booking reference to review itinerary & access key
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              required
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. AUR-9182"
              className="flex-1 px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 uppercase font-mono-nums"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Lookup</span>
            </button>
          </form>

          {/* Quick Click Samples */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <span>Try sample:</span>
            <button
              type="button"
              onClick={() => handleSampleClick('AUR-9182')}
              className="font-mono-nums text-amber-800 underline hover:text-amber-950 cursor-pointer"
            >
              AUR-9182
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => handleSampleClick('AUR-5520')}
              className="font-mono-nums text-amber-800 underline hover:text-amber-950 cursor-pointer"
            >
              AUR-5520
            </button>
          </div>

          {/* Search Result */}
          {searched && (
            <div className="mt-4">
              {foundBooking ? (
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                        Guest
                      </span>
                      <span className="font-bold text-neutral-900 text-sm">
                        {foundBooking.guestName}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        foundBooking.status === 'CONFIRMED'
                          ? 'bg-blue-100 text-blue-800'
                          : foundBooking.status === 'CHECKED_IN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : foundBooking.status === 'HOLD'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {foundBooking.status}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>
                        {foundBooking.checkIn} to {foundBooking.checkOut} ({foundBooking.nightsCount} nights)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-neutral-400" />
                      <span>
                        Room: {hotelStore.getPhysicalRoomNumber(foundBooking.assignedRoomId)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onOpenVoucher(foundBooking);
                      onClose();
                    }}
                    className="w-full mt-2 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Open Digital Voucher & Pass
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>No reservation found matching reference "{reference}".</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
