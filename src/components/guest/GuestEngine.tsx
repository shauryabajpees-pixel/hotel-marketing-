import React, { useState } from 'react';
import {
  Hotel,
  RoomType,
  SearchQuery,
  Booking,
} from '../../types/hotel';
import { hotelStore, addDays, formatDate } from '../../services/hotelStore';
import {
  Calendar,
  Users,
  Check,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Coffee,
  Maximize2,
  Info,
  Flame,
  AlertCircle,
} from 'lucide-react';

interface GuestEngineProps {
  hotel: Hotel;
  roomTypes: RoomType[];
  onStartHoldCheckout: (booking: Booking) => void;
  onSelectRoomDetails: (roomType: RoomType) => void;
}

export const GuestEngine: React.FC<GuestEngineProps> = ({
  hotel,
  roomTypes,
  onStartHoldCheckout,
  onSelectRoomDetails,
}) => {
  const todayStr = hotelStore.getTodayStr();

  // Search state
  const [search, setSearch] = useState<SearchQuery>({
    checkIn: todayStr,
    checkOut: addDays(todayStr, 2),
    guests: 2,
    roomTypeId: undefined,
  });

  const [reserveError, setReserveError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  // Calculate stay duration
  const nightsCount = Math.max(
    1,
    Math.round(
      (new Date(search.checkOut).getTime() - new Date(search.checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const handleReserve = (roomType: RoomType) => {
    setReserveError(null);
    setIsSubmitting(roomType.id);

    // Attempt atomic hold reservation (10-minute hold window)
    const result = hotelStore.acquireHold({
      roomTypeId: roomType.id,
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      guestName: '', // To be filled in checkout
      guestEmail: '',
      guestPhone: '',
      holdDurationSeconds: 600, // 10 minutes
    });

    setIsSubmitting(null);

    if (result.success && result.booking) {
      onStartHoldCheckout(result.booking);
    } else {
      setReserveError(result.error || 'Failed to acquire reservation hold.');
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Banner with Architectural Image */}
      <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200/80 shadow-md">
        <div className="relative h-[420px] w-full">
          <img
            src={hotel.heroImage}
            alt={hotel.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* Subtle contrast scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/40 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 text-white max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300 mb-2">
            <span>{hotel.city}</span>
            <span>·</span>
            <span>Five-Star Palace Destination</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3 text-balance">
            {hotel.name}
          </h1>
          <p className="text-sm sm:text-base text-neutral-200 font-light max-w-2xl leading-relaxed">
            {hotel.description}
          </p>
        </div>
      </div>

      {/* Floating Booking Search & Filter Console */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Check-In */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Check-In Date
            </label>
            <div className="relative">
              <input
                type="date"
                min={todayStr}
                value={search.checkIn}
                onChange={(e) => {
                  const newCheckIn = e.target.value;
                  setSearch((prev) => ({
                    ...prev,
                    checkIn: newCheckIn,
                    checkOut:
                      prev.checkOut <= newCheckIn ? addDays(newCheckIn, 1) : prev.checkOut,
                  }));
                }}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 font-mono-nums"
              />
            </div>
          </div>

          {/* Check-Out */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Check-Out Date
            </label>
            <div className="relative">
              <input
                type="date"
                min={addDays(search.checkIn, 1)}
                value={search.checkOut}
                onChange={(e) =>
                  setSearch((prev) => ({ ...prev, checkOut: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 font-mono-nums"
              />
            </div>
          </div>

          {/* Guests Count */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Guests
            </label>
            <select
              value={search.guests}
              onChange={(e) =>
                setSearch((prev) => ({ ...prev, guests: Number(e.target.value) }))
              }
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer"
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests (Standard)</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests (Family / Suite)</option>
            </select>
          </div>

          {/* Summary / Quick Action */}
          <div className="space-y-1 flex flex-col justify-end">
            <span className="block text-xs text-neutral-500">Duration</span>
            <div className="h-10 px-3 flex items-center justify-between bg-amber-50/60 border border-amber-200/80 rounded-lg text-xs font-medium text-amber-900">
              <span>{nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'}</span>
              <span className="text-amber-800">Guaranteed Best Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global reservation error alert (e.g. concurrency lock clash) */}
      {reserveError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-900 text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Reservation Hold Conflict</p>
            <p className="text-xs text-red-700 mt-0.5">{reserveError}</p>
          </div>
          <button
            onClick={() => setReserveError(null)}
            className="text-xs text-red-700 underline font-medium hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Available Suites & Room Selection */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-200 pb-3">
          <div>
            <h2 className="text-2xl font-serif-luxury font-bold text-neutral-900">
              Luxury Suites & Residences
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Select your preferred sanctuary for {search.checkIn} to {search.checkOut} ({nightsCount} nights)
            </p>
          </div>
          <div className="text-xs text-neutral-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero Double-Booking Guarantee via 10-Min Atomic Hold</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {roomTypes.map((rt) => {
            const avail = hotelStore.getRoomAvailability(
              rt.id,
              search.checkIn,
              search.checkOut
            );

            const isAvailable = avail.isAvailable;
            const minLeft = avail.minAvailableCount;
            const totalPrice = avail.totalPrice;
            const avgNightly = Math.round(totalPrice / nightsCount);

            return (
              <div
                key={rt.id}
                className="bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-sm flex flex-col hover:border-neutral-300 transition-all duration-200 group"
              >
                {/* Room Image Container */}
                <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
                  <img
                    src={rt.image}
                    alt={rt.name}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Scrim and badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {rt.breakfastIncluded && (
                      <span className="px-2.5 py-1 bg-neutral-900/80 backdrop-blur-md text-white text-[11px] font-medium rounded">
                        Breakfast Included
                      </span>
                    )}
                  </div>

                  {/* Availability badge */}
                  <div className="absolute bottom-3 right-3">
                    {isAvailable ? (
                      minLeft <= 2 ? (
                        <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-semibold rounded shadow-sm flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          Only {minLeft} left!
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-neutral-900/80 backdrop-blur-md text-emerald-300 text-[10px] font-medium rounded">
                          {minLeft} rooms available
                        </span>
                      )
                    ) : (
                      <span className="px-2.5 py-0.5 bg-red-600 text-white text-[10px] font-semibold rounded">
                        Sold Out for Dates
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif-luxury text-lg font-bold text-neutral-900">
                        {rt.name}
                      </h3>
                    </div>

                    {/* Metadata text */}
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                      <span>{rt.sizeSqFt} sq ft</span>
                      <span aria-hidden="true">·</span>
                      <span>{rt.bedConfig}</span>
                      <span aria-hidden="true">·</span>
                      <span>Up to {rt.capacity} Guests</span>
                    </div>

                    <p className="text-xs text-neutral-600 mt-2.5 line-clamp-2 leading-relaxed">
                      {rt.description}
                    </p>

                    {/* Key features bullets */}
                    <ul className="mt-3 space-y-1.5">
                      {rt.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-neutral-700">
                          <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing & Reservation CTA */}
                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono-nums text-xl font-bold text-neutral-900">
                          ${avgNightly}
                        </span>
                        <span className="text-xs text-neutral-500">/ night</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono-nums">
                        ${totalPrice} total for {nightsCount} nights
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectRoomDetails(rt)}
                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer text-xs"
                        title="View Full Suite Details"
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleReserve(rt)}
                        disabled={!isAvailable || isSubmitting === rt.id}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                          isAvailable
                            ? 'bg-amber-800 hover:bg-amber-900 text-white shadow-sm'
                            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                        }`}
                      >
                        {isSubmitting === rt.id
                          ? 'Securing Hold...'
                          : isAvailable
                          ? 'Reserve Suite'
                          : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hotel Amenities & World-Class Experience */}
      <section className="bg-neutral-900 text-white rounded-2xl p-8 sm:p-10">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Complimentary Privileges
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-1 mb-3">
            Crafted for Unrivaled Serenity
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            Every booking includes access to our private Mediterranean beach, chauffeur transfers,
            evening sommelier tastings, and around-the-clock bespoke butler assistance.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-neutral-800">
          {hotel.amenities.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-neutral-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
