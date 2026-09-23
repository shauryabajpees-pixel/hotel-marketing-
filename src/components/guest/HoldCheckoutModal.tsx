import React, { useState, useEffect } from 'react';
import { Booking, RoomType } from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import {
  Clock,
  ShieldCheck,
  CreditCard,
  Lock,
  X,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface HoldCheckoutModalProps {
  booking: Booking;
  roomType: RoomType;
  isOpen: boolean;
  onClose: () => void;
  onBookingConfirmed: (confirmedBooking: Booking) => void;
}

export const HoldCheckoutModal: React.FC<HoldCheckoutModalProps> = ({
  booking,
  roomType,
  isOpen,
  onClose,
  onBookingConfirmed,
}) => {
  if (!isOpen) return null;

  // Countdown timer state
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (!booking.holdExpiresAt) return 600;
    return Math.max(
      0,
      Math.floor(
        (new Date(booking.holdExpiresAt).getTime() - Date.now()) / 1000
      )
    );
  });

  const [guestName, setGuestName] = useState(booking.guestName || '');
  const [guestEmail, setGuestEmail] = useState(booking.guestEmail || '');
  const [guestPhone, setGuestPhone] = useState(booking.guestPhone || '');
  const [specialRequests, setSpecialRequests] = useState(
    booking.specialRequests || ''
  );

  // Card details state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('888');
  const [postalCode, setPostalCode] = useState('98000');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tick countdown timer
  useEffect(() => {
    if (!booking.holdExpiresAt) return;

    const timer = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor(
          (new Date(booking.holdExpiresAt!).getTime() - Date.now()) / 1000
        )
      );
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        setErrorMessage(
          'Your 10-minute hold has expired. The room inventory has been returned to the pool.'
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [booking.holdExpiresAt]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleAutofillTestCard = () => {
    setGuestName('Alexandra Dupont');
    setGuestEmail('alexandra.dupont@elysee.fr');
    setGuestPhone('+33 6 88 12 34 56');
    setCardNumber('4242 •••• •••• 4242');
    setCardExpiry('12/28');
    setCardCvc('921');
    setPostalCode('98000');
    setSpecialRequests('High floor preference, late check-in at 19:00, still mineral water.');
  };

  const handleCancelHold = () => {
    hotelStore.cancelBooking(booking.id, 'Guest Checkout Release');
    onClose();
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (secondsLeft <= 0) {
      setErrorMessage('Hold has expired. Please choose your dates again.');
      return;
    }

    if (!guestName.trim() || !guestEmail.trim()) {
      setErrorMessage('Please provide your guest name and email address.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // Simulate Stripe payment processing latency and idempotency verification
    setTimeout(() => {
      // Update guest info on the booking object
      booking.guestName = guestName;
      booking.guestEmail = guestEmail;
      booking.guestPhone = guestPhone;
      booking.specialRequests = specialRequests;

      const result = hotelStore.confirmHold(booking.id, {
        providerPaymentId: 'pi_stripe_' + Math.random().toString(36).substring(2, 12),
        last4: '4242',
        idempotencyKey: booking.idempotencyKey,
      });

      setIsProcessing(false);

      if (result.success && result.booking) {
        onBookingConfirmed(result.booking);
      } else {
        setErrorMessage(result.error || 'Payment confirmation failed.');
      }
    }, 1200);
  };

  // Price calculation
  const taxesAndFees = Math.round(booking.totalAmount * 0.1);
  const grandTotal = booking.totalAmount + taxesAndFees;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Top Hold Timer Bar */}
        <div
          className={`px-6 py-3 flex items-center justify-between text-xs font-medium transition-colors ${
            secondsLeft > 120
              ? 'bg-amber-500 text-white'
              : secondsLeft > 0
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-neutral-800 text-neutral-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              {secondsLeft > 0 ? (
                <>
                  Active Reservation Hold: <strong>{formatTimer(secondsLeft)}</strong> remaining
                </>
              ) : (
                'Reservation Hold Expired'
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] opacity-90">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Atomic Lock Protected</span>
          </div>
        </div>

        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-100 flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Guaranteed Reservation
            </div>
            <h2 className="text-xl font-serif-luxury font-bold text-neutral-900 mt-0.5">
              Complete Your Stay: {roomType.name}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Reference: <span className="font-mono-nums font-semibold">{booking.bookingReference}</span> · {booking.checkIn} to {booking.checkOut} ({booking.nightsCount} {booking.nightsCount === 1 ? 'night' : 'nights'})
            </p>
          </div>

          <button
            onClick={handleCancelHold}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Cancel Hold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirmPayment} className="p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Guest Information Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Guest Contact Details
              </h3>
              <button
                type="button"
                onClick={handleAutofillTestCard}
                className="text-[11px] font-medium text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                Fill Test Guest & Card
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-neutral-600 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Alexandra Dupont"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-600 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="e.g. alexandra@example.com"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-neutral-600 mb-1">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+33 6 00 00 00 00"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 font-mono-nums"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-neutral-600 mb-1">
                  Special Requests / Butler Notes (Optional)
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Dietary preferences, arrival time, feather pillows"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Payment Details (Stripe-like UI) */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-neutral-400" />
                PCI-DSS Encrypted Payment (Stripe Sandbox)
              </h3>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-neutral-400 font-mono-nums">
                  Idempotency: {booking.idempotencyKey.substring(0, 10)}...
                </span>
              </div>
            </div>

            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 font-mono-nums pl-9"
                  />
                  <CreditCard className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Expiration</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 font-mono-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">CVC</label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 font-mono-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 font-mono-nums"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-neutral-50/70 p-4 rounded-xl border border-neutral-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>
                Room Fare ({booking.nightsCount} night{booking.nightsCount > 1 ? 's' : ''})
              </span>
              <span className="font-mono-nums font-medium">${booking.totalAmount}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Monaco Riviera Hospitality Tax (10%)</span>
              <span className="font-mono-nums font-medium">${taxesAndFees}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Private Beach & Valet Privileges</span>
              <span className="font-medium uppercase text-[10px]">Complimentary</span>
            </div>
            <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-sm text-neutral-900">
              <span>Total Due Now</span>
              <span className="font-mono-nums text-base text-amber-800">${grandTotal}</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancelHold}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Cancel Hold & Release Room
            </button>

            <button
              type="submit"
              disabled={isProcessing || secondsLeft <= 0}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                secondsLeft > 0 && !isProcessing
                  ? 'bg-amber-800 hover:bg-amber-900 text-white shadow-md hover:shadow-lg'
                  : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : secondsLeft <= 0 ? (
                'Hold Expired'
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize ${grandTotal} & Confirm Stay</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
