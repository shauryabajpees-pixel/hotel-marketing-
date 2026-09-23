import React, { useState, useEffect } from 'react';
import { hotelStore, HotelStoreData } from './services/hotelStore';
import { Booking, RoomType } from './types/hotel';
import { Header } from './components/Header';
import { GuestEngine } from './components/guest/GuestEngine';
import { HoldCheckoutModal } from './components/guest/HoldCheckoutModal';
import { BookingVoucherModal } from './components/guest/BookingVoucherModal';
import { RoomDetailModal } from './components/guest/RoomDetailModal';
import { BookingLookupModal } from './components/guest/BookingLookupModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { ConcurrencyDemoModal } from './components/ConcurrencyDemoModal';

export default function App() {
  const [storeData, setStoreData] = useState<HotelStoreData>(() =>
    hotelStore.getData()
  );

  // View routing
  const [activeView, setActiveView] = useState<'guest' | 'admin'>('guest');
  const [adminSubTab, setAdminSubTab] = useState<string>('timeline');

  // Modal states
  const [activeHoldBooking, setActiveHoldBooking] = useState<Booking | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [voucherBooking, setVoucherBooking] = useState<Booking | null>(null);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<RoomType | null>(null);
  const [isLookupOpen, setIsLookupOpen] = useState<boolean>(false);
  const [isConcurrencyDemoOpen, setIsConcurrencyDemoOpen] = useState<boolean>(false);

  // Subscribe to reactive store changes
  useEffect(() => {
    const unsubscribe = hotelStore.subscribe(() => {
      const data = hotelStore.getData();
      setStoreData({ ...data });

      // If our current hold booking was cancelled or expired by the cron, close checkout
      if (activeHoldBooking) {
        const refreshedHold = data.bookings.find((b) => b.id === activeHoldBooking.id);
        if (!refreshedHold || refreshedHold.status !== 'HOLD') {
          if (refreshedHold && refreshedHold.status === 'CONFIRMED') {
            setActiveHoldBooking(null);
          } else {
            setActiveHoldBooking(null);
            setIsCheckoutOpen(false);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [activeHoldBooking]);

  const handleStartHoldCheckout = (booking: Booking) => {
    setActiveHoldBooking(booking);
    setIsCheckoutOpen(true);
  };

  const handleBookingConfirmed = (confirmedBooking: Booking) => {
    setIsCheckoutOpen(false);
    setActiveHoldBooking(null);
    setVoucherBooking(confirmedBooking);
  };

  const handleInspectInAdmin = (bookingId: string) => {
    setVoucherBooking(null);
    setActiveView('admin');
    setAdminSubTab('timeline');
  };

  // Find RoomType for the active hold
  const holdRoomType = storeData.roomTypes.find(
    (r) => r.id === activeHoldBooking?.roomTypeId
  );

  // Find RoomType for voucher
  const voucherRoomType = storeData.roomTypes.find(
    (r) => r.id === voucherBooking?.roomTypeId
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navigation Bar with Strict 3-Zone Contract */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        adminSubTab={adminSubTab}
        setAdminSubTab={setAdminSubTab}
        activeHoldBooking={activeHoldBooking}
        onResumeHold={() => setIsCheckoutOpen(true)}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenConcurrencyDemo={() => setIsConcurrencyDemoOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeView === 'guest' ? (
          <GuestEngine
            hotel={storeData.hotel}
            roomTypes={storeData.roomTypes}
            onStartHoldCheckout={handleStartHoldCheckout}
            onSelectRoomDetails={(rt) => setSelectedRoomDetails(rt)}
          />
        ) : (
          <AdminPortal
            activeSubTab={adminSubTab}
            setActiveSubTab={setAdminSubTab}
            physicalRooms={storeData.physicalRooms}
            roomTypes={storeData.roomTypes}
            inventory={storeData.inventory}
            bookings={storeData.bookings}
            auditLogs={storeData.auditLogs}
          />
        )}
      </main>

      {/* Guest Checkout Modal with 10-minute hold lock */}
      {activeHoldBooking && holdRoomType && (
        <HoldCheckoutModal
          booking={activeHoldBooking}
          roomType={holdRoomType}
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}

      {/* Luxury Confirmation Voucher Modal */}
      {voucherBooking && (
        <BookingVoucherModal
          booking={voucherBooking}
          roomType={voucherRoomType}
          hotel={storeData.hotel}
          isOpen={Boolean(voucherBooking)}
          onClose={() => setVoucherBooking(null)}
          onOpenInAdmin={handleInspectInAdmin}
        />
      )}

      {/* Room Category Deep Dive Modal */}
      <RoomDetailModal
        roomType={selectedRoomDetails}
        isOpen={Boolean(selectedRoomDetails)}
        onClose={() => setSelectedRoomDetails(null)}
        onReserve={(rt) => {
          setSelectedRoomDetails(null);
          // Triggers hold check
          const res = hotelStore.acquireHold({
            roomTypeId: rt.id,
            checkIn: storeData.todayStr,
            checkOut: hotelStore.getTodayStr(),
            guestName: '',
            guestEmail: '',
            guestPhone: '',
          });
          if (res.success && res.booking) {
            handleStartHoldCheckout(res.booking);
          }
        }}
      />

      {/* Guest Reservation Self-Service Lookup Modal */}
      <BookingLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        onOpenVoucher={(b) => setVoucherBooking(b)}
      />

      {/* Concurrency Double-Booking Race Simulator Modal */}
      <ConcurrencyDemoModal
        isOpen={isConcurrencyDemoOpen}
        onClose={() => setIsConcurrencyDemoOpen(false)}
        roomTypes={storeData.roomTypes}
      />

      {/* Refined Domain-Appropriate Footer */}
      <footer className="bg-white border-t border-neutral-200 py-8 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-serif-luxury font-bold text-neutral-900">
              AURA GRAND MONACO
            </span>
            <span>·</span>
            <span>Hospitality Management & Concurrency-Safe Booking Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <span>PCI-DSS Tier 1 Ready</span>
            <span>·</span>
            <span>Two-Phase Atomic Inventory Lock</span>
            <span>·</span>
            <span>© 2026 Aura Grand Hotel Group</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
