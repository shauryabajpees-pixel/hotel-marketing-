import React, { useState } from 'react';
import { Booking, PhysicalRoom, RoomType, BookingStatus } from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import {
  Search,
  Key,
  UserCheck,
  LogOut,
  ExternalLink,
  XCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface BookingTableProps {
  bookings: Booking[];
  physicalRooms: PhysicalRoom[];
  roomTypes: RoomType[];
  onSelectBooking: (booking: Booking) => void;
}

export const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  physicalRooms,
  roomTypes,
  onSelectBooking,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const getRoomTypeName = (typeId: string) => {
    return roomTypes.find((r) => r.id === typeId)?.name || 'Suite';
  };

  const filtered = bookings.filter((b) => {
    if (filterStatus !== 'ALL' && b.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.guestName.toLowerCase().includes(q);
      const matchRef = b.bookingReference.toLowerCase().includes(q);
      const matchEmail = b.guestEmail.toLowerCase().includes(q);
      if (!matchName && !matchRef && !matchEmail) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Reference', 'Guest Name', 'Email', 'Room Category', 'Assigned Room', 'Check In', 'Check Out', 'Nights', 'Total Amount', 'Status'];
    const rows = filtered.map((b) => [
      b.bookingReference,
      b.guestName,
      b.guestEmail,
      getRoomTypeName(b.roomTypeId),
      hotelStore.getPhysicalRoomNumber(b.assignedRoomId),
      b.checkIn,
      b.checkOut,
      b.nightsCount,
      b.totalAmount,
      b.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hotel_reservations_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col space-y-4 p-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Bookings' },
            { id: 'CONFIRMED', label: 'Confirmed' },
            { id: 'CHECKED_IN', label: 'In-House' },
            { id: 'HOLD', label: 'Holds (10m)' },
            { id: 'CHECKED_OUT', label: 'Checked Out' },
            { id: 'CANCELLED', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input & Export */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search guest or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 w-52 sm:w-64"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
          </div>

          <button
            onClick={handleExportCSV}
            className="p-1.5 text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
            title="Export Manifest to CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span className="hidden md:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto border border-neutral-200 rounded-lg">
        <table className="w-full text-left text-xs text-neutral-600">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-semibold text-neutral-700 uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Reference</th>
              <th className="py-2.5 px-3">Guest</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Physical Room</th>
              <th className="py-2.5 px-3">Stay Dates</th>
              <th className="py-2.5 px-3 text-right">Folio Total</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.map((b) => {
              const assignedNum = hotelStore.getPhysicalRoomNumber(b.assignedRoomId);

              return (
                <tr
                  key={b.id}
                  onClick={() => onSelectBooking(b)}
                  className="hover:bg-neutral-50/70 transition-colors cursor-pointer"
                >
                  {/* Reference */}
                  <td className="py-3 px-3 font-mono-nums font-bold text-neutral-900">
                    {b.bookingReference}
                  </td>

                  {/* Guest Info */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-neutral-900">
                      {b.guestName || 'Pending Checkout'}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono-nums truncate max-w-[180px]">
                      {b.guestEmail}
                    </div>
                  </td>

                  {/* Suite Tier */}
                  <td className="py-3 px-3 text-neutral-800">
                    {getRoomTypeName(b.roomTypeId)}
                  </td>

                  {/* Room Number */}
                  <td className="py-3 px-3">
                    {b.assignedRoomId ? (
                      <span className="inline-flex items-center gap-1 font-mono-nums font-medium text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
                        <Key className="w-3 h-3 text-amber-700" />
                        {assignedNum}
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-400 italic">
                        Unassigned
                      </span>
                    )}
                  </td>

                  {/* Stay Dates */}
                  <td className="py-3 px-3 font-mono-nums">
                    <div>
                      {b.checkIn} → {b.checkOut}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {b.nightsCount} {b.nightsCount === 1 ? 'night' : 'nights'}
                    </div>
                  </td>

                  {/* Folio Total */}
                  <td className="py-3 px-3 text-right font-mono-nums font-bold text-neutral-900">
                    ${b.totalAmount}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === 'CONFIRMED'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : b.status === 'CHECKED_IN'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : b.status === 'HOLD'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : b.status === 'CHECKED_OUT'
                          ? 'bg-neutral-100 text-neutral-700'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  {/* Quick Action Button */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBooking(b);
                      }}
                      className="px-2 py-1 text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                    >
                      Details & Folio →
                    </button>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-neutral-400">
                  No reservations match the specified filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
