import React, { useState } from 'react';
import { AuditLog, Booking, PhysicalRoom, RoomType } from '../../types/hotel';
import {
  TrendingUp,
  ShieldCheck,
  Activity,
  Filter,
  DollarSign,
  BedDouble,
  Users,
} from 'lucide-react';

interface AuditAndAnalyticsProps {
  auditLogs: AuditLog[];
  bookings: Booking[];
  physicalRooms: PhysicalRoom[];
  roomTypes: RoomType[];
}

export const AuditAndAnalytics: React.FC<AuditAndAnalyticsProps> = ({
  auditLogs,
  bookings,
  physicalRooms,
  roomTypes,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  // Operational metrics
  const totalRooms = physicalRooms.length; // e.g. 9 rooms
  const occupiedRooms = physicalRooms.filter((r) => r.status === 'OCCUPIED').length;
  const occupancyPct = Math.round((occupiedRooms / totalRooms) * 100);

  // Financial calculations
  const confirmedBookings = bookings.filter(
    (b) => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN' || b.status === 'CHECKED_OUT'
  );
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalNights = confirmedBookings.reduce((sum, b) => sum + b.nightsCount, 0);
  const adr = totalNights > 0 ? Math.round(totalRevenue / totalNights) : 0;
  const revPar = Math.round((adr * occupancyPct) / 100);

  const filteredLogs = auditLogs.filter((log) => {
    if (filterType !== 'ALL' && log.type !== filterType) return false;
    return true;
  });

  const getLogBadge = (type: AuditLog['type']) => {
    switch (type) {
      case 'CONCURRENCY':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'BOOKING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ROOM':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'RATE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CRON':
        return 'bg-neutral-200 text-neutral-800 border-neutral-300';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 uppercase tracking-wider block">
              Occupancy Rate
            </span>
            <div className="font-mono-nums text-2xl font-bold text-neutral-900 mt-1">
              {occupancyPct}%
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              {occupiedRooms} of {totalRooms} rooms occupied
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <BedDouble className="w-5 h-5" />
          </div>
        </div>

        {/* ADR (Average Daily Rate) */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 uppercase tracking-wider block">
              ADR (Avg Daily Rate)
            </span>
            <div className="font-mono-nums text-2xl font-bold text-neutral-900 mt-1">
              ${adr}
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              Across {totalNights} billed room nights
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* RevPAR */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 uppercase tracking-wider block">
              RevPAR (Yield)
            </span>
            <div className="font-mono-nums text-2xl font-bold text-neutral-900 mt-1">
              ${revPar}
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              Revenue per available room
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Total Gross Volume */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 uppercase tracking-wider block">
              Gross Bookings Total
            </span>
            <div className="font-mono-nums text-2xl font-bold text-neutral-900 mt-1">
              ${totalRevenue}
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              {confirmedBookings.length} confirmed stays
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
          <div>
            <h3 className="font-serif-luxury text-base font-bold text-neutral-900">
              System Audit Trail & Concurrency Ledger
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Immutable logs for distributed locks, room allocations, rate changes, and cron reconciliations
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg text-xs overflow-x-auto">
            {['ALL', 'CONCURRENCY', 'BOOKING', 'ROOM', 'RATE', 'CRON'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filterType === type
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Log Entries List */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/60 hover:bg-neutral-100/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-start sm:items-center gap-2.5 flex-1">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider shrink-0 ${getLogBadge(
                    log.type
                  )}`}
                >
                  {log.type}
                </span>

                <div>
                  <span className="font-semibold text-neutral-900 mr-2">
                    {log.action}
                  </span>
                  <span className="text-neutral-600 leading-relaxed">
                    {log.details}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-neutral-400 font-mono-nums text-[11px] shrink-0 sm:text-right">
                <span className="text-neutral-600 font-medium">{log.actor}</span>
                <span>·</span>
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="py-8 text-center text-xs text-neutral-400">
              No audit logs found for category '{filterType}'.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
