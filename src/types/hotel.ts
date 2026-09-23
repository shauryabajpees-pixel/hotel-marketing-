export type RoomStatus =
  | 'AVAILABLE'
  | 'OCCUPIED'
  | 'DIRTY'
  | 'IN_PROGRESS'
  | 'INSPECTED'
  | 'OUT_OF_ORDER';

export type BookingStatus =
  | 'HOLD'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED';

export interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
  starRating: number;
  heroImage: string;
  description: string;
  amenities: string[];
}

export interface RoomType {
  id: string;
  hotelId: string;
  name: string;
  basePrice: number;
  capacity: number;
  totalInventory: number;
  image: string;
  description: string;
  features: string[];
  cancellationPolicy: string;
  breakfastIncluded: boolean;
  sizeSqFt: number;
  bedConfig: string;
}

export interface PhysicalRoom {
  id: string;
  hotelId: string;
  roomTypeId: string;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  assignedHousekeeper?: string;
  notes?: string;
  lastCleaned?: string;
}

export interface DailyInventory {
  id: string;
  roomTypeId: string;
  date: string; // YYYY-MM-DD
  availableCount: number;
  totalInventory: number;
  priceOverride?: number;
  stopSell?: boolean;
}

export interface FolioCharge {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomTypeId: string;
  assignedRoomId?: string | null;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nightsCount: number;
  baseRatePerNight: number;
  totalAmount: number;
  status: BookingStatus;
  holdExpiresAt?: string; // ISO string for 10-minute hold
  paymentId?: string | null;
  idempotencyKey: string;
  specialRequests?: string;
  createdAt: string;
  charges: FolioCharge[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  type: 'BOOKING' | 'ROOM' | 'RATE' | 'CRON' | 'CONCURRENCY' | 'SYSTEM';
}

export interface SearchQuery {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomTypeId?: string;
}
