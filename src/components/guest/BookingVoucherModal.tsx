import React from 'react';
import { Booking, RoomType, Hotel } from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import {
  CheckCircle2,
  Printer,
  X,
  MapPin,
  Calendar,
  Key,
  ShieldCheck,
  Download,
  Share2,
} from 'lucide-react';

interface BookingVoucherModalProps {
  booking: Booking | null;
  roomType: RoomType | undefined;
  hotel: Hotel;
  isOpen: boolean;
  onClose: () => void;
  onOpenInAdmin?: (bookingId: string) => void;
}

export const BookingVoucherModal: React.FC<BookingVoucherModalProps> = ({
  booking,
  roomType,
  hotel,
  isOpen,
  onClose,
  onOpenInAdmin,
}) => {
  if (!isOpen || !booking) return null;

  const roomNumberDisplay = hotelStore.getPhysicalRoomNumber(booking.assignedRoomId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 my-8 print:shadow-none print:border-none print:m-0 print:max-w-none">
        {/* Top Header Bar */}
        <div className="bg-neutral-900 text-white p-6 flex items-start justify-between print:bg-neutral-900 print:text-white">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Confirmed Reservation Voucher</span>
            </div>
            <h2 className="font-serif-luxury text-2xl font-bold mt-1">
              {hotel.name}
            </h2>
            <p className="text-xs text-neutral-300 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>{hotel.address}, {hotel.city}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors print:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voucher Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Reference Card */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider block">
                Booking Reference
              </span>
              <span className="font-mono-nums text-2xl font-extrabold text-amber-950 tracking-wider">
                {booking.bookingReference}
              </span>
              <div className="text-[11px] text-amber-800/80 mt-0.5">
                Issued {new Date(booking.createdAt).toLocaleDateString()} · Instant Confirmation
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                Allocated Room
              </span>
              <span className="text-lg font-bold text-neutral-900 flex items-center sm:justify-end gap-1.5">
                <Key className="w-4 h-4 text-amber-700" />
                {roomNumberDisplay}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">
                {booking.assignedRoomId ? 'Pre-allocated & Secured' : 'Assigned at Front Desk'}
              </span>
            </div>
          </div>

          {/* Guest & Dates Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-y border-neutral-100 text-xs">
            <div>
              <span className="text-neutral-400 uppercase tracking-wider block text-[10px]">
                Primary Guest
              </span>
              <span className="font-semibold text-neutral-900 block mt-0.5">
                {booking.guestName}
              </span>
              <span className="text-neutral-500 text-[11px] truncate block">
                {booking.guestEmail}
              </span>
            </div>

            <div>
              <span className="text-neutral-400 uppercase tracking-wider block text-[10px]">
                Check-In Date
              </span>
              <span className="font-semibold text-neutral-900 block mt-0.5 font-mono-nums">
                {booking.checkIn}
              </span>
              <span className="text-neutral-500 text-[11px]">From 15:00 CET</span>
            </div>

            <div>
              <span className="text-neutral-400 uppercase tracking-wider block text-[10px]">
                Check-Out Date
              </span>
              <span className="font-semibold text-neutral-900 block mt-0.5 font-mono-nums">
                {booking.checkOut}
              </span>
              <span className="text-neutral-500 text-[11px]">Until 12:00 CET</span>
            </div>

            <div>
              <span className="text-neutral-400 uppercase tracking-wider block text-[10px]">
                Length of Stay
              </span>
              <span className="font-semibold text-neutral-900 block mt-0.5">
                {booking.nightsCount} {booking.nightsCount === 1 ? 'Night' : 'Nights'}
              </span>
              <span className="text-neutral-500 text-[11px]">{roomType?.name || 'Luxury Room'}</span>
            </div>
          </div>

          {/* Special Requests / Notes if any */}
          {booking.specialRequests && (
            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-xs">
              <span className="font-semibold text-neutral-700 block mb-0.5">
                Guest Preferences & Requests:
              </span>
              <p className="text-neutral-600 italic">"{booking.specialRequests}"</p>
            </div>
          )}

          {/* Charges / Folio Overview */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Payment Folio Summary
            </h4>
            <div className="bg-neutral-50/70 p-4 rounded-xl border border-neutral-200/80 space-y-2 text-xs">
              {booking.charges.map((ch) => (
                <div key={ch.id} className="flex justify-between text-neutral-600">
                  <span>{ch.description}</span>
                  <span className="font-mono-nums font-medium">${ch.amount}</span>
                </div>
              ))}
              <div className="flex justify-between text-neutral-600">
                <span>Monaco Riviera Hospitality Tax (10%)</span>
                <span className="font-mono-nums font-medium">
                  ${Math.round(booking.totalAmount * 0.1)}
                </span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-sm text-neutral-900">
                <span>Total Paid (Stripe Auth)</span>
                <span className="font-mono-nums text-amber-800">
                  ${Math.round(booking.totalAmount * 1.1)}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code & Check-in instructions */}
          <div className="flex items-center gap-4 p-4 bg-neutral-900 text-white rounded-xl">
            {/* SVG QR Code Simulation */}
            <div className="w-16 h-16 bg-white p-1.5 rounded-lg shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-950">
                <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                <rect x="5" y="5" width="20" height="20" fill="white" />
                <rect x="10" y="10" width="10" height="10" fill="currentColor" />

                <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                <rect x="75" y="5" width="20" height="20" fill="white" />
                <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                <rect x="5" y="75" width="20" height="20" fill="white" />
                <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                <rect x="35" y="15" width="10" height="10" fill="currentColor" />
                <rect x="50" y="10" width="10" height="20" fill="currentColor" />
                <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                <rect x="70" y="45" width="15" height="15" fill="currentColor" />
                <rect x="25" y="65" width="15" height="15" fill="currentColor" />
                <rect x="55" y="75" width="25" height="15" fill="currentColor" />
              </svg>
            </div>

            <div className="text-xs text-neutral-300">
              <p className="font-semibold text-white">Express Digital Key Arrival</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-neutral-400">
                Present this voucher or QR pass at the concierge desk on arrival for your
                welcome champagne and NFC room key.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-neutral-500" />
            <span>Print Voucher</span>
          </button>

          <div className="flex items-center gap-2">
            {onOpenInAdmin && (
              <button
                onClick={() => onOpenInAdmin(booking.id)}
                className="px-3.5 py-2 text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer"
              >
                Inspect in Staff PMS
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
