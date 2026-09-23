import React, { useState } from 'react';
import {
  PhysicalRoom,
  RoomType,
  DailyInventory,
  Booking,
  AuditLog,
} from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import { TimelineMatrix } from './TimelineMatrix';
import { BookingTable } from './BookingTable';
import { HousekeepingBoard } from './HousekeepingBoard';
import { RatesInventoryGrid } from './RatesInventoryGrid';
import { AuditAndAnalytics } from './AuditAndAnalytics';
import { FolioDrawer } from './FolioDrawer';
import { WalkInModal } from './WalkInModal';
import {
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  Activity,
  UserPlus,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface AdminPortalProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  physicalRooms: PhysicalRoom[];
  roomTypes: RoomType[];
  inventory: DailyInventory[];
  bookings: Booking[];
  auditLogs: AuditLog[];
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  activeSubTab,
  setActiveSubTab,
  physicalRooms,
  roomTypes,
  inventory,
  bookings,
  auditLogs,
}) => {
  const [selectedBookingForDrawer, setSelectedBookingForDrawer] = useState<Booking | null>(null);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [walkInPreRoomId, setWalkInPreRoomId] = useState<string | undefined>();
  const [walkInPreDate, setWalkInPreDate] = useState<string | undefined>();
  const [cronNotice, setCronNotice] = useState<string | null>(null);

  const handleOpenWalkInForRoom = (roomId: string, date: string) => {
    setWalkInPreRoomId(roomId);
    setWalkInPreDate(date);
    setIsWalkInModalOpen(true);
  };

  const handleRunReconciliation = () => {
    const res = hotelStore.runReconciliationCron();
    setCronNotice(
      res.expiredCount > 0
        ? `Auto-reconciliation finished: ${res.expiredCount} expired hold(s) cancelled and inventory safely restored.`
        : 'Auto-reconciliation check finished: Zero expired holds detected. Database integrity 100% nominal.'
    );
    setTimeout(() => setCronNotice(null), 4000);
  };

  const handleResetData = () => {
    if (confirm('Reset PMS database and inventory back to original baseline?')) {
      hotelStore.resetToDefaults();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Operations Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
            <span>Property Management System</span>
            <span>·</span>
            <span>Front Desk & Operations Console</span>
          </div>
          <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-900 mt-0.5">
            Aura Grand Hotel PMS
          </h2>
        </div>

        {/* Global Operations Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setWalkInPreRoomId(undefined);
              setWalkInPreDate(undefined);
              setIsWalkInModalOpen(true);
            }}
            className="px-3.5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Walk-In Booking</span>
          </button>

          <button
            onClick={handleRunReconciliation}
            className="px-3 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Execute background cron to release any expired holds"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
            <span>Run Reconciliation Cron</span>
          </button>

          <button
            onClick={handleResetData}
            className="px-2.5 py-2 text-neutral-400 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs transition-colors cursor-pointer"
            title="Reset to default seed bookings & rooms"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {cronNotice && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{cronNotice}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-neutral-200/70 rounded-xl overflow-x-auto">
        {[
          { id: 'timeline', label: 'Room Matrix & Gantt', icon: Calendar },
          { id: 'bookings', label: 'Front Desk Reservations', icon: Layers },
          { id: 'housekeeping', label: 'Housekeeping Board', icon: Sparkles },
          { id: 'rates', label: 'Dynamic Rates & Allotments', icon: TrendingUp },
          { id: 'audit', label: 'Audit Logs & Analytics', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-700' : 'text-neutral-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeSubTab === 'timeline' && (
          <TimelineMatrix
            physicalRooms={physicalRooms}
            roomTypes={roomTypes}
            bookings={bookings}
            onSelectBooking={(b) => setSelectedBookingForDrawer(b)}
            onOpenWalkInForRoom={handleOpenWalkInForRoom}
          />
        )}

        {activeSubTab === 'bookings' && (
          <BookingTable
            bookings={bookings}
            physicalRooms={physicalRooms}
            roomTypes={roomTypes}
            onSelectBooking={(b) => setSelectedBookingForDrawer(b)}
          />
        )}

        {activeSubTab === 'housekeeping' && (
          <HousekeepingBoard
            physicalRooms={physicalRooms}
            roomTypes={roomTypes}
          />
        )}

        {activeSubTab === 'rates' && (
          <RatesInventoryGrid
            roomTypes={roomTypes}
            inventory={inventory}
          />
        )}

        {activeSubTab === 'audit' && (
          <AuditAndAnalytics
            auditLogs={auditLogs}
            bookings={bookings}
            physicalRooms={physicalRooms}
            roomTypes={roomTypes}
          />
        )}
      </div>

      {/* Slide-over Folio / Details Drawer */}
      <FolioDrawer
        booking={selectedBookingForDrawer}
        isOpen={Boolean(selectedBookingForDrawer)}
        onClose={() => setSelectedBookingForDrawer(null)}
        physicalRooms={physicalRooms}
        roomTypes={roomTypes}
      />

      {/* Walk-in reservation modal */}
      <WalkInModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        physicalRooms={physicalRooms}
        roomTypes={roomTypes}
        initialRoomId={walkInPreRoomId}
        initialDate={walkInPreDate}
        onBookingCreated={(newBk) => {
          setSelectedBookingForDrawer(newBk);
        }}
      />
    </div>
  );
};
