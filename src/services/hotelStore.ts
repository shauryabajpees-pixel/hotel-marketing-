import {
  Hotel,
  RoomType,
  PhysicalRoom,
  DailyInventory,
  Booking,
  AuditLog,
  FolioCharge,
  RoomStatus,
  BookingStatus,
} from '../types/hotel';

// Initial Hotel Entity
export const INITIAL_HOTEL: Hotel = {
  id: 'hotel-monaco-01',
  name: 'Aura Grand Resort & Suites',
  city: 'Monaco · French Riviera',
  address: '14 Boulevard Princesse Charlotte, 98000 Monte Carlo',
  starRating: 5,
  heroImage: '/src/assets/images/hotel_hero_exterior_1790174508617.jpg',
  description:
    'Perched high above the Mediterranean Sea, Aura Grand pairs timeless French Riviera glamour with contemporary architectural serenity. Experience Michelin-star gastronomy, private seaside cabanas, and bespoke concierge attention.',
  amenities: [
    'Private Mediterranean Beach',
    'Michelin-Starred Dining',
    'Heated Infinity Pool',
    'L’Occitane Signature Spa',
    'Helipad Transfers',
    '24/7 Butler Service',
    'Valet & Chauffeur Fleet',
    'High-Speed Fiber Wi-Fi',
  ],
};

// Initial Room Types
export const INITIAL_ROOM_TYPES: RoomType[] = [
  {
    id: 'rt-deluxe-ocean',
    hotelId: 'hotel-monaco-01',
    name: 'Deluxe Ocean King',
    basePrice: 480,
    capacity: 2,
    totalInventory: 4,
    image: '/src/assets/images/room_deluxe_ocean_1790174522717.jpg',
    description:
      'Uninterrupted azure sea views from private teak loggias. Features custom French oak cabinetry, Italian marble soaking tub, and handcrafted king bed.',
    features: [
      'King-sized Simmons Beautyrest mattress',
      'Private teak balcony facing Mediterranean',
      'Carrara marble bathroom & soaking tub',
      'Complimentary Nespresso boutique bar',
      'Bose spatial sound system & 55" OLED',
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours prior to arrival',
    breakfastIncluded: true,
    sizeSqFt: 520,
    bedConfig: '1 King Bed',
  },
  {
    id: 'rt-executive-garden',
    hotelId: 'hotel-monaco-01',
    name: 'Executive Garden Villa',
    basePrice: 690,
    capacity: 3,
    totalInventory: 3,
    image: '/src/assets/images/room_executive_garden_1790174547668.jpg',
    description:
      'Nestled within secluded Mediterranean flora. Opens directly into private zen fountain courtyards with shaded daybeds and outdoor rain showers.',
    features: [
      'Private landscaped zen garden & daybed',
      'Double rain shower and freestanding stone bath',
      'Dedicated evening turndown & pillow menu',
      'Walk-in dressing closet with vanity',
      'Dyson supersonic grooming suite',
    ],
    cancellationPolicy: 'Free cancellation up to 72 hours prior to arrival',
    breakfastIncluded: true,
    sizeSqFt: 780,
    bedConfig: '1 Super King + 1 Daybed',
  },
  {
    id: 'rt-penthouse-suite',
    hotelId: 'hotel-monaco-01',
    name: 'Panoramic Sky Penthouse',
    basePrice: 1250,
    capacity: 4,
    totalInventory: 2,
    image: '/src/assets/images/room_penthouse_suite_1790174535245.jpg',
    description:
      'The pinnacle of Mediterranean luxury. A 1,400 sq ft wrap-around terrace, heated outdoor jacuzzi, full bar lounge, and dedicated butler throughout your stay.',
    features: [
      '1,400 sq ft wrap-around private terrace',
      'Outdoor heated jacuzzi with skyline views',
      'Dedicated private butler on 24h call',
      'Private bar, wine fridge & dining salon',
      'Chauffeured Maybach airport transfer included',
    ],
    cancellationPolicy: 'Free cancellation up to 7 days prior to arrival',
    breakfastIncluded: true,
    sizeSqFt: 1420,
    bedConfig: '2 Master King Suites',
  },
];

// Initial Physical Rooms
export const INITIAL_PHYSICAL_ROOMS: PhysicalRoom[] = [
  // Deluxe Ocean (Floor 1)
  {
    id: 'room-101',
    hotelId: 'hotel-monaco-01',
    roomTypeId: 'rt-deluxe-ocean',
    roomNumber: '101',
    floor: 1,
    status: 'AVAILABLE',
    assignedHousekeeper: 'Sophie M.',
    lastCleaned: '2026-09-23 06:45',
    notes: 'Ground level corner unit, quiet garden access.',
  },
  {
    id: 'room-102',
    hotelId: 'hotel-monaco-01',
    roomTypeId: 'rt-deluxe-ocean',
    roomNumber: '102',
    floor: 1,
    status: 'OCCUPIED',
    assignedHousekeeper: 'Sophie M.',
    lastCleaned: '2026-09-22 14:00',
    notes: 'Guest requested foam pillows.',
  },
  {
    id: 'room-103',
    hotelId: 'hotel-monaco-01',
    roomTypeId: 'rt-deluxe-ocean',
    roomNumber: '103',
    floor: 1,
    status: 'DIRTY',
    assignedHousekeeper: 'Marc D.',
    notes: 'Check-out completed 11:00. Priority turnover.',
  },
  {
    id: 'room-104',
    hotelId: 'hotel-monaco-01',
    roomTypeId: 'rt-deluxe-ocean',
    roomNumber: '104',
    floor: 1,
    status: 'AVAILABLE',
    assignedHousekeeper: 'Sophie M.',
    lastCleaned: '2026-09-23 07:15',
    notes: 'Deep cleaning completed yesterday.',
  },

  // Executive Garden (Floor 2)
  {
    id: 'room-201',
    hotelId: 'hotel-monaco-01',
    roomTypeId: 'rt-executive-garden',
    roomNumber: '201',
    floor: 2,
    status: 'IN_PROGRESS',
    assignedHousekeeper: 'Elena R.',
    notes: 'Turndown & fresh floral arrangement being placed.',
  },
  {
    id: 'room-202',
    hotelId: 'hotel-monaco-01',
    roomTypeId: 'rt-executive-garden',
    roomNumber: '202',
    floor: 2,
    status: 'AVAILABLE',
    assignedHousekeeper: 'Elena R.',
    lastCleaned: '2026-09-23 06:30',
    notes: 'Full garden patio sanitized.',
  },
  {
    id: 'room-203',
    hotelId: 'hotel-monaco-01',
    roomTypeId: 'rt-executive-garden',
    roomNumber: '203',
    floor: 2,
    status: 'OCCUPIED',
    assignedHousekeeper: 'Marc D.',
    notes: 'VIP guest - do not disturb before 11:00.',
  },

  // Sky Penthouse (Floor 3)
  {
    id: 'room-301',
    hotelId: 'hotel-monaco-01',
    roomTypeId: 'rt-penthouse-suite',
    roomNumber: '301',
    floor: 3,
    status: 'AVAILABLE',
    assignedHousekeeper: 'Elena R.',
    lastCleaned: '2026-09-23 05:45',
    notes: 'Terrace hot tub inspected and chemical balance verified.',
  },
  {
    id: 'room-302',
    hotelId: 'hotel-monaco-01',
    roomTypeId: 'rt-penthouse-suite',
    roomNumber: '302',
    floor: 3,
    status: 'INSPECTED',
    assignedHousekeeper: 'Sophie M.',
    notes: 'Manager pre-arrival walk-through passed.',
  },
];

// Helper to format date string YYYY-MM-DD
export function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

export function getDatesBetween(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  let current = startDate;
  while (current < endDate) {
    dates.push(current);
    current = addDays(current, 1);
  }
  return dates;
}

// Generate 30 days of inventory starting from today
export function generateInitialInventory(startDateStr: string): DailyInventory[] {
  const inventory: DailyInventory[] = [];
  INITIAL_ROOM_TYPES.forEach((rt) => {
    let curr = startDateStr;
    for (let i = 0; i < 30; i++) {
      // Add a slight weekend surge
      const [y, m, d] = curr.split('-').map(Number);
      const dayOfWeek = new Date(y, m - 1, d).getDay();
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Fri / Sat
      const weekendSurcharge = isWeekend ? Math.round(rt.basePrice * 0.15) : 0;

      // Deduct inventory for pre-seeded bookings
      let available = rt.totalInventory;
      if (rt.id === 'rt-deluxe-ocean' && (i === 0 || i === 1)) {
        available = rt.totalInventory - 2; // Rooms 102 & 103 booked
      } else if (rt.id === 'rt-executive-garden' && (i === 0 || i === 1 || i === 2)) {
        available = rt.totalInventory - 1; // Room 203 booked
      } else if (rt.id === 'rt-penthouse-suite' && i === 3) {
        available = rt.totalInventory - 1;
      }

      inventory.push({
        id: `inv-${rt.id}-${curr}`,
        roomTypeId: rt.id,
        date: curr,
        availableCount: Math.max(0, available),
        totalInventory: rt.totalInventory,
        priceOverride: isWeekend ? rt.basePrice + weekendSurcharge : undefined,
        stopSell: false,
      });
      curr = addDays(curr, 1);
    }
  });
  return inventory;
}

// Seed initial active bookings
export function generateInitialBookings(todayStr: string): Booking[] {
  return [
    {
      id: 'bk-seed-01',
      bookingReference: 'AUR-9182',
      guestName: 'Julian Sterling',
      guestEmail: 'julian.sterling@meridian-ventures.com',
      guestPhone: '+44 7911 123456',
      roomTypeId: 'rt-deluxe-ocean',
      assignedRoomId: 'room-102',
      checkIn: addDays(todayStr, -1),
      checkOut: addDays(todayStr, 2),
      nightsCount: 3,
      baseRatePerNight: 480,
      totalAmount: 1440,
      status: 'CHECKED_IN',
      createdAt: '2026-09-20T10:14:00Z',
      idempotencyKey: 'idem_seed_julian_9182',
      specialRequests: 'High floor, hypoallergenic pillows, sparkling water upon arrival.',
      charges: [
        { id: 'ch-1', description: 'Room Rate (3 nights)', amount: 1440, date: addDays(todayStr, -1) },
        { id: 'ch-2', description: 'Le Bar Américain Cocktails', amount: 86, date: addDays(todayStr, -1) },
      ],
    },
    {
      id: 'bk-seed-02',
      bookingReference: 'AUR-5520',
      guestName: 'Lady Catherine Vance',
      guestEmail: 'catherine.vance@vanceholdings.co.uk',
      guestPhone: '+33 6 12 34 56 78',
      roomTypeId: 'rt-executive-garden',
      assignedRoomId: 'room-203',
      checkIn: todayStr,
      checkOut: addDays(todayStr, 3),
      nightsCount: 3,
      baseRatePerNight: 690,
      totalAmount: 2070,
      status: 'CONFIRMED',
      createdAt: '2026-09-21T14:30:00Z',
      idempotencyKey: 'idem_seed_catherine_5520',
      specialRequests: 'Early check-in around 13:00, gluten-free breakfast basket.',
      charges: [
        { id: 'ch-3', description: 'Room Rate (3 nights)', amount: 2070, date: todayStr },
      ],
    },
    {
      id: 'bk-seed-03',
      bookingReference: 'AUR-3091',
      guestName: 'Dr. Henrik Lindqvist',
      guestEmail: 'h.lindqvist@karolinska.se',
      guestPhone: '+46 8 123 4567',
      roomTypeId: 'rt-deluxe-ocean',
      assignedRoomId: 'room-103',
      checkIn: addDays(todayStr, -3),
      checkOut: todayStr,
      nightsCount: 3,
      baseRatePerNight: 480,
      totalAmount: 1440,
      status: 'CHECKED_OUT',
      createdAt: '2026-09-18T09:00:00Z',
      idempotencyKey: 'idem_seed_henrik_3091',
      specialRequests: 'Quiet room for symposium preparation.',
      charges: [
        { id: 'ch-4', description: 'Room Rate (3 nights)', amount: 1440, date: addDays(todayStr, -3) },
        { id: 'ch-5', description: 'Spa Deep Tissue Massage', amount: 220, date: addDays(todayStr, -2) },
      ],
    },
    {
      id: 'bk-seed-04',
      bookingReference: 'AUR-7734',
      guestName: 'Beatriz Morales & Sofia Ramos',
      guestEmail: 'beatriz.m@morales-arch.es',
      guestPhone: '+34 600 000 000',
      roomTypeId: 'rt-penthouse-suite',
      assignedRoomId: 'room-302',
      checkIn: addDays(todayStr, 3),
      checkOut: addDays(todayStr, 6),
      nightsCount: 3,
      baseRatePerNight: 1250,
      totalAmount: 3750,
      status: 'CONFIRMED',
      createdAt: '2026-09-22T16:45:00Z',
      idempotencyKey: 'idem_seed_beatriz_7734',
      specialRequests: 'Anniversary celebration. Chilled Dom Pérignon 2013 on terrace arrival.',
      charges: [
        { id: 'ch-6', description: 'Room Rate (3 nights)', amount: 3750, date: addDays(todayStr, 3) },
      ],
    },
  ];
}

export function generateInitialAuditLogs(todayStr: string): AuditLog[] {
  return [
    {
      id: 'log-1',
      timestamp: `${todayStr} 07:15:22`,
      actor: 'Elena V. (Front Desk)',
      action: 'Room Assignment',
      details: 'Assigned physical Room 302 to confirmed booking AUR-7734 (Beatriz Morales).',
      type: 'ROOM',
    },
    {
      id: 'log-2',
      timestamp: `${todayStr} 06:30:10`,
      actor: 'Sophie M. (Housekeeping)',
      action: 'Status Change',
      details: 'Marked Room 104 as AVAILABLE after full sanitation.',
      type: 'ROOM',
    },
    {
      id: 'log-3',
      timestamp: `${todayStr} 04:00:00`,
      actor: 'Reconciliation Engine (Cron)',
      action: 'Inventory Audit',
      details: 'Night audit ran successfully. Zero expired holds found. Database integrity nominal.',
      type: 'CRON',
    },
    {
      id: 'log-4',
      timestamp: `${addDays(todayStr, -1)} 19:40:12`,
      actor: 'Guest Web Booking Engine',
      action: 'Atomic Reservation Hold',
      details: 'Two-phase commit acquired hold for Deluxe Ocean King. Idempotency token verified.',
      type: 'BOOKING',
    },
  ];
}

const STORAGE_KEY = 'aura_hotel_pms_data_v2';

export interface HotelStoreData {
  hotel: Hotel;
  roomTypes: RoomType[];
  physicalRooms: PhysicalRoom[];
  inventory: DailyInventory[];
  bookings: Booking[];
  auditLogs: AuditLog[];
  todayStr: string;
}

export class HotelStore {
  private data: HotelStoreData;
  private listeners: Set<() => void> = new Set();
  private reconciliationTimer: number | null = null;

  constructor() {
    const today = formatDate(new Date());
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.data = JSON.parse(saved);
        // Ensure todayStr matches current day
        if (this.data.todayStr !== today) {
          this.data.todayStr = today;
        }
      } catch (e) {
        console.error('Failed to parse saved state, seeding new state', e);
        this.data = this.createDefaultData(today);
      }
    } else {
      this.data = this.createDefaultData(today);
      this.persist();
    }

    // Start automated background reconciliation loop (runs every 10 seconds to auto-expire holds)
    this.startReconciliationWorker();
  }

  private createDefaultData(todayStr: string): HotelStoreData {
    return {
      hotel: INITIAL_HOTEL,
      roomTypes: INITIAL_ROOM_TYPES,
      physicalRooms: INITIAL_PHYSICAL_ROOMS,
      inventory: generateInitialInventory(todayStr),
      bookings: generateInitialBookings(todayStr),
      auditLogs: generateInitialAuditLogs(todayStr),
      todayStr,
    };
  }

  public resetToDefaults() {
    const today = formatDate(new Date());
    this.data = this.createDefaultData(today);
    this.persist();
    this.addAuditLog(
      'System Admin',
      'Database Reset',
      'Reset all hotel room inventory, physical rooms, and bookings to default demonstration baseline.',
      'SYSTEM'
    );
    this.notify();
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Storage quota exceeded or private mode', e);
    }
  }

  public getData(): HotelStoreData {
    return this.data;
  }

  public getTodayStr(): string {
    return this.data.todayStr;
  }

  public addAuditLog(
    actor: string,
    action: string,
    details: string,
    type: AuditLog['type']
  ) {
    const newLog: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      action,
      details,
      type,
    };
    this.data.auditLogs.unshift(newLog);
    // Keep max 100 logs
    if (this.data.auditLogs.length > 100) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 100);
    }
    this.persist();
    this.notify();
  }

  // Check inventory for room type across a date range
  public getRoomAvailability(
    roomTypeId: string,
    checkIn: string,
    checkOut: string
  ): { isAvailable: boolean; minAvailableCount: number; totalPrice: number; dailyRates: { date: string; rate: number }[] } {
    const dates = getDatesBetween(checkIn, checkOut);
    const rt = this.data.roomTypes.find((r) => r.id === roomTypeId);
    if (!rt || dates.length === 0) {
      return { isAvailable: false, minAvailableCount: 0, totalPrice: 0, dailyRates: [] };
    }

    let minCount = Infinity;
    let totalPrice = 0;
    const dailyRates: { date: string; rate: number }[] = [];

    for (const date of dates) {
      const inv = this.data.inventory.find(
        (item) => item.roomTypeId === roomTypeId && item.date === date
      );

      const count = inv ? inv.availableCount : rt.totalInventory;
      const rate = inv?.priceOverride ?? rt.basePrice;
      const isStopped = inv?.stopSell ?? false;

      if (isStopped || count <= 0) {
        minCount = 0;
      } else {
        minCount = Math.min(minCount, count);
      }

      totalPrice += rate;
      dailyRates.push({ date, rate });
    }

    if (minCount === Infinity) minCount = rt.totalInventory;

    return {
      isAvailable: minCount > 0,
      minAvailableCount: minCount,
      totalPrice,
      dailyRates,
    };
  }

  /**
   * ATOMIC HOLD RESERVATION (Zero Double Booking Two-Phase Commit)
   * Simulates Redis lock + Postgres atomic UPDATE room_type_inventory
   */
  public acquireHold(params: {
    roomTypeId: string;
    checkIn: string;
    checkOut: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    specialRequests?: string;
    holdDurationSeconds?: number; // default 600 (10 minutes)
  }): { success: boolean; booking?: Booking; error?: string } {
    const { roomTypeId, checkIn, checkOut, guestName, guestEmail, guestPhone, specialRequests, holdDurationSeconds = 600 } = params;

    const dates = getDatesBetween(checkIn, checkOut);
    if (dates.length === 0) {
      return { success: false, error: 'Check-out date must be after check-in date.' };
    }

    const rt = this.data.roomTypes.find((r) => r.id === roomTypeId);
    if (!rt) {
      return { success: false, error: 'Room type does not exist.' };
    }

    // Step 1: Distributed lock acquired on `lock:room_type:${roomTypeId}:${checkIn}:${checkOut}`
    // Step 2: Atomic inspection of all dates
    for (const date of dates) {
      const inv = this.data.inventory.find(
        (i) => i.roomTypeId === roomTypeId && i.date === date
      );
      const available = inv ? inv.availableCount : rt.totalInventory;
      const stopSell = inv?.stopSell ?? false;

      if (stopSell || available <= 0) {
        this.addAuditLog(
          'Lock Engine (Hold Rejected)',
          'Concurrency Conflict',
          `Hold failed for ${rt.name} (${checkIn} to ${checkOut}): zero rooms available on ${date}. Double-booking prevented.`,
          'CONCURRENCY'
        );
        return {
          success: false,
          error: `Sorry, ${rt.name} is no longer available on ${date}. Another guest is reserving the final room.`,
        };
      }
    }

    // Step 3: Deduct 1 from available_count atomically for each date
    let totalAmount = 0;
    for (const date of dates) {
      let inv = this.data.inventory.find(
        (i) => i.roomTypeId === roomTypeId && i.date === date
      );
      if (!inv) {
        inv = {
          id: `inv-${roomTypeId}-${date}`,
          roomTypeId,
          date,
          availableCount: rt.totalInventory,
          totalInventory: rt.totalInventory,
        };
        this.data.inventory.push(inv);
      }
      inv.availableCount -= 1;
      totalAmount += inv.priceOverride ?? rt.basePrice;
    }

    // Step 4: Create booking in HOLD status
    const refCode = 'AUR-' + Math.floor(1000 + Math.random() * 9000);
    const holdExpiresAt = new Date(Date.now() + holdDurationSeconds * 1000).toISOString();

    const newBooking: Booking = {
      id: 'bk-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      bookingReference: refCode,
      guestName,
      guestEmail,
      guestPhone,
      roomTypeId,
      assignedRoomId: null,
      checkIn,
      checkOut,
      nightsCount: dates.length,
      baseRatePerNight: Math.round(totalAmount / dates.length),
      totalAmount,
      status: 'HOLD',
      holdExpiresAt,
      idempotencyKey: 'idem_' + Math.random().toString(36).substring(2, 15),
      specialRequests,
      createdAt: new Date().toISOString(),
      charges: [
        {
          id: 'ch-rate-' + Date.now(),
          description: `Room Charge (${dates.length} night${dates.length > 1 ? 's' : ''})`,
          amount: totalAmount,
          date: checkIn,
        },
      ],
    };

    this.data.bookings.unshift(newBooking);
    this.addAuditLog(
      guestName ? `${guestName} (Guest)` : 'Guest Booking Engine',
      'Hold Acquired',
      `Locked 1 room of ${rt.name} for ${dates.length} nights (${checkIn} to ${checkOut}). Hold expires at ${holdExpiresAt.substring(11, 19)} UTC. Reference: ${refCode}.`,
      'BOOKING'
    );

    this.persist();
    this.notify();
    return { success: true, booking: newBooking };
  }

  /**
   * CONFIRM HOLD (Payment succeeded)
   */
  public confirmHold(
    bookingId: string,
    paymentDetails: { providerPaymentId: string; last4?: string; idempotencyKey: string }
  ): { success: boolean; booking?: Booking; error?: string } {
    const booking = this.data.bookings.find((b) => b.id === bookingId);
    if (!booking) {
      return { success: false, error: 'Booking record not found.' };
    }

    if (booking.status === 'CONFIRMED') {
      return { success: true, booking };
    }

    if (booking.status !== 'HOLD') {
      return { success: false, error: `Cannot confirm booking with status '${booking.status}'.` };
    }

    // Check if expired
    if (booking.holdExpiresAt && new Date(booking.holdExpiresAt).getTime() < Date.now()) {
      return {
        success: false,
        error: 'Your 10-minute reservation hold has expired. The inventory was released back to the room pool.',
      };
    }

    // Auto-allocate physical room if one is available and free during those dates
    const assignedRoom = this.findAvailablePhysicalRoom(booking.roomTypeId, booking.checkIn, booking.checkOut);
    if (assignedRoom) {
      booking.assignedRoomId = assignedRoom.id;
    }

    booking.status = 'CONFIRMED';
    booking.paymentId = paymentDetails.providerPaymentId;
    delete booking.holdExpiresAt;

    this.addAuditLog(
      'Payment Gateway / Stripe',
      'Booking Confirmed',
      `Payment confirmed for ${booking.bookingReference} ($${booking.totalAmount}). ${
        booking.assignedRoomId
          ? `Allocated physical room ${this.getPhysicalRoomNumber(booking.assignedRoomId)}.`
          : 'Pending physical room allocation.'
      }`,
      'BOOKING'
    );

    this.persist();
    this.notify();
    return { success: true, booking };
  }

  /**
   * Auto-assign physical room
   */
  public findAvailablePhysicalRoom(
    roomTypeId: string,
    checkIn: string,
    checkOut: string,
    excludeBookingId?: string
  ): PhysicalRoom | null {
    const matchingRooms = this.data.physicalRooms.filter(
      (r) => r.roomTypeId === roomTypeId && r.status !== 'OUT_OF_ORDER'
    );

    for (const room of matchingRooms) {
      const isOccupiedInDates = this.data.bookings.some((b) => {
        if (b.id === excludeBookingId) return false;
        if (b.assignedRoomId !== room.id) return false;
        if (b.status === 'CANCELLED' || b.status === 'CHECKED_OUT') return false;

        // Check date overlap [b.checkIn, b.checkOut) overlaps [checkIn, checkOut)
        const overlap = !(b.checkOut <= checkIn || b.checkIn >= checkOut);
        return overlap;
      });

      if (!isOccupiedInDates) {
        return room;
      }
    }
    return null;
  }

  public getPhysicalRoomNumber(roomId: string | null | undefined): string {
    if (!roomId) return 'Unassigned';
    const r = this.data.physicalRooms.find((x) => x.id === roomId);
    return r ? `Room ${r.roomNumber}` : 'Unassigned';
  }

  /**
   * CANCEL BOOKING
   */
  public cancelBooking(bookingId: string, actor: string = 'Staff Admin'): { success: boolean; error?: string } {
    const booking = this.data.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    if (booking.status === 'CANCELLED') {
      return { success: true };
    }

    const previousStatus = booking.status;
    booking.status = 'CANCELLED';

    // Restore inventory if it was on HOLD or CONFIRMED
    if (previousStatus === 'HOLD' || previousStatus === 'CONFIRMED') {
      const dates = getDatesBetween(booking.checkIn, booking.checkOut);
      dates.forEach((date) => {
        const inv = this.data.inventory.find(
          (i) => i.roomTypeId === booking.roomTypeId && i.date === date
        );
        if (inv) {
          inv.availableCount = Math.min(inv.totalInventory, inv.availableCount + 1);
        }
      });
    }

    this.addAuditLog(
      actor,
      'Booking Cancelled',
      `Cancelled booking ${booking.bookingReference} (${booking.guestName}). Restored inventory for ${booking.nightsCount} nights.`,
      'BOOKING'
    );

    this.persist();
    this.notify();
    return { success: true };
  }

  /**
   * CHECK IN GUEST
   */
  public checkInGuest(bookingId: string, actor: string = 'Front Desk'): { success: boolean; error?: string } {
    const booking = this.data.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    if (!booking.assignedRoomId) {
      const room = this.findAvailablePhysicalRoom(booking.roomTypeId, booking.checkIn, booking.checkOut, booking.id);
      if (!room) {
        return {
          success: false,
          error: 'No vacant physical room found for this room category. Please manually reassign a room first.',
        };
      }
      booking.assignedRoomId = room.id;
    }

    booking.status = 'CHECKED_IN';
    const room = this.data.physicalRooms.find((r) => r.id === booking.assignedRoomId);
    if (room) {
      room.status = 'OCCUPIED';
    }

    this.addAuditLog(
      actor,
      'Guest Check-In',
      `Checked in ${booking.guestName} (${booking.bookingReference}) into ${this.getPhysicalRoomNumber(booking.assignedRoomId)}. Keycard active.`,
      'ROOM'
    );

    this.persist();
    this.notify();
    return { success: true };
  }

  /**
   * CHECK OUT GUEST
   */
  public checkOutGuest(bookingId: string, actor: string = 'Front Desk'): { success: boolean; error?: string } {
    const booking = this.data.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    booking.status = 'CHECKED_OUT';
    if (booking.assignedRoomId) {
      const room = this.data.physicalRooms.find((r) => r.id === booking.assignedRoomId);
      if (room) {
        room.status = 'DIRTY';
        room.notes = `Checked out at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Ready for housekeeping.`;
      }
    }

    this.addAuditLog(
      actor,
      'Guest Check-Out',
      `Checked out ${booking.guestName} (${booking.bookingReference}). Set ${this.getPhysicalRoomNumber(booking.assignedRoomId)} to DIRTY.`,
      'ROOM'
    );

    this.persist();
    this.notify();
    return { success: true };
  }

  /**
   * REASSIGN PHYSICAL ROOM
   */
  public reassignPhysicalRoom(
    bookingId: string,
    newPhysicalRoomId: string,
    actor: string = 'Front Desk'
  ): { success: boolean; error?: string } {
    const booking = this.data.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    const targetRoom = this.data.physicalRooms.find((r) => r.id === newPhysicalRoomId);
    if (!targetRoom) return { success: false, error: 'Target physical room not found.' };

    if (targetRoom.status === 'OUT_OF_ORDER') {
      return { success: false, error: 'Target room is marked Out of Order for maintenance.' };
    }

    // Check if new room has date conflicts
    const conflict = this.data.bookings.some((b) => {
      if (b.id === bookingId) return false;
      if (b.assignedRoomId !== newPhysicalRoomId) return false;
      if (b.status === 'CANCELLED' || b.status === 'CHECKED_OUT') return false;
      const overlap = !(b.checkOut <= booking.checkIn || b.checkIn >= booking.checkOut);
      return overlap;
    });

    if (conflict) {
      return { success: false, error: `Room ${targetRoom.roomNumber} already has an active reservation during those dates.` };
    }

    const prevRoomNum = this.getPhysicalRoomNumber(booking.assignedRoomId);
    booking.assignedRoomId = newPhysicalRoomId;

    this.addAuditLog(
      actor,
      'Room Reallocation',
      `Reassigned ${booking.bookingReference} (${booking.guestName}) from ${prevRoomNum} to Room ${targetRoom.roomNumber}.`,
      'ROOM'
    );

    this.persist();
    this.notify();
    return { success: true };
  }

  /**
   * UPDATE PHYSICAL ROOM STATUS (Housekeeping)
   */
  public updateRoomStatus(
    roomId: string,
    status: RoomStatus,
    cleaner?: string,
    notes?: string,
    actor: string = 'Housekeeping Staff'
  ): boolean {
    const room = this.data.physicalRooms.find((r) => r.id === roomId);
    if (!room) return false;

    const prev = room.status;
    room.status = status;
    if (cleaner !== undefined) room.assignedHousekeeper = cleaner;
    if (notes !== undefined) room.notes = notes;
    if (status === 'AVAILABLE' || status === 'INSPECTED') {
      room.lastCleaned = new Date().toISOString().replace('T', ' ').substring(0, 16);
    }

    this.addAuditLog(
      actor,
      'Housekeeping Update',
      `Room ${room.roomNumber} status changed from ${prev} to ${status}.${cleaner ? ` Assigned to ${cleaner}.` : ''}`,
      'ROOM'
    );

    this.persist();
    this.notify();
    return true;
  }

  /**
   * UPDATE DAILY INVENTORY & RATES
   */
  public updateDailyRates(
    roomTypeId: string,
    startDate: string,
    endDate: string,
    newPrice?: number,
    stopSell?: boolean
  ): boolean {
    const dates = getDatesBetween(startDate, endDate);
    const rt = this.data.roomTypes.find((r) => r.id === roomTypeId);
    if (!rt || dates.length === 0) return false;

    dates.forEach((date) => {
      let inv = this.data.inventory.find(
        (i) => i.roomTypeId === roomTypeId && i.date === date
      );
      if (!inv) {
        inv = {
          id: `inv-${roomTypeId}-${date}`,
          roomTypeId,
          date,
          availableCount: rt.totalInventory,
          totalInventory: rt.totalInventory,
        };
        this.data.inventory.push(inv);
      }
      if (newPrice !== undefined) inv.priceOverride = newPrice;
      if (stopSell !== undefined) inv.stopSell = stopSell;
    });

    this.addAuditLog(
      'Revenue Management',
      'Rate/Availability Adjustment',
      `Updated ${rt.name} from ${startDate} to ${endDate}: ${newPrice !== undefined ? `New rate $${newPrice}` : ''} ${stopSell !== undefined ? `[StopSell=${stopSell}]` : ''}`,
      'RATE'
    );

    this.persist();
    this.notify();
    return true;
  }

  /**
   * ADD CHARGE TO FOLIO
   */
  public addChargeToBooking(
    bookingId: string,
    description: string,
    amount: number,
    actor: string = 'Concierge / POS'
  ): boolean {
    const booking = this.data.bookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    const charge: FolioCharge = {
      id: 'ch-' + Date.now(),
      description,
      amount,
      date: formatDate(new Date()),
    };
    booking.charges.push(charge);
    booking.totalAmount += amount;

    this.addAuditLog(
      actor,
      'Folio Charge Added',
      `Added charge "${description}" ($${amount}) to folio for ${booking.bookingReference} (${booking.guestName}).`,
      'BOOKING'
    );

    this.persist();
    this.notify();
    return true;
  }

  /**
   * CREATE WALK-IN DIRECT BOOKING (Front desk)
   */
  public createWalkInBooking(params: {
    roomTypeId: string;
    physicalRoomId: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    checkIn: string;
    checkOut: string;
    customRatePerNight?: number;
    specialRequests?: string;
  }): { success: boolean; booking?: Booking; error?: string } {
    const { roomTypeId, physicalRoomId, guestName, guestEmail, guestPhone, checkIn, checkOut, customRatePerNight, specialRequests } = params;

    const dates = getDatesBetween(checkIn, checkOut);
    if (dates.length === 0) return { success: false, error: 'Invalid dates.' };

    const rt = this.data.roomTypes.find((r) => r.id === roomTypeId);
    const room = this.data.physicalRooms.find((r) => r.id === physicalRoomId);
    if (!rt || !room) return { success: false, error: 'Room or room category not found.' };

    // Check conflict
    const conflict = this.data.bookings.some((b) => {
      if (b.assignedRoomId !== physicalRoomId) return false;
      if (b.status === 'CANCELLED' || b.status === 'CHECKED_OUT') return false;
      return !(b.checkOut <= checkIn || b.checkIn >= checkOut);
    });
    if (conflict) {
      return { success: false, error: `Room ${room.roomNumber} has a conflicting booking during those dates.` };
    }

    const rate = customRatePerNight ?? rt.basePrice;
    const totalAmount = rate * dates.length;
    const refCode = 'AUR-' + Math.floor(1000 + Math.random() * 9000);

    // Deduct inventory
    dates.forEach((date) => {
      let inv = this.data.inventory.find(
        (i) => i.roomTypeId === roomTypeId && i.date === date
      );
      if (!inv) {
        inv = {
          id: `inv-${roomTypeId}-${date}`,
          roomTypeId,
          date,
          availableCount: rt.totalInventory,
          totalInventory: rt.totalInventory,
        };
        this.data.inventory.push(inv);
      }
      inv.availableCount = Math.max(0, inv.availableCount - 1);
    });

    const newBooking: Booking = {
      id: 'bk-walkin-' + Date.now(),
      bookingReference: refCode,
      guestName,
      guestEmail: guestEmail || 'walkin@auragrand.com',
      guestPhone: guestPhone || '+1 555 000 0000',
      roomTypeId,
      assignedRoomId: physicalRoomId,
      checkIn,
      checkOut,
      nightsCount: dates.length,
      baseRatePerNight: rate,
      totalAmount,
      status: 'CONFIRMED',
      idempotencyKey: 'idem_walkin_' + Date.now(),
      specialRequests,
      createdAt: new Date().toISOString(),
      charges: [
        {
          id: 'ch-walkin-' + Date.now(),
          description: `Direct Walk-In (${dates.length} night${dates.length > 1 ? 's' : ''})`,
          amount: totalAmount,
          date: checkIn,
        },
      ],
    };

    this.data.bookings.unshift(newBooking);
    this.addAuditLog(
      'Front Desk Manager',
      'Walk-In Reservation Created',
      `Walk-in booked for ${guestName} in Room ${room.roomNumber} (${checkIn} to ${checkOut}) for $${totalAmount}. Reference: ${refCode}.`,
      'BOOKING'
    );

    this.persist();
    this.notify();
    return { success: true, booking: newBooking };
  }

  /**
   * RECONCILIATION CRON (Auto-expires abandoned holds)
   */
  public runReconciliationCron(): { expiredCount: number } {
    const now = Date.now();
    let expiredCount = 0;

    this.data.bookings.forEach((b) => {
      if (b.status === 'HOLD' && b.holdExpiresAt) {
        const expireTime = new Date(b.holdExpiresAt).getTime();
        if (now >= expireTime) {
          b.status = 'CANCELLED';
          expiredCount++;

          // Restore inventory for each night
          const dates = getDatesBetween(b.checkIn, b.checkOut);
          dates.forEach((date) => {
            const inv = this.data.inventory.find(
              (i) => i.roomTypeId === b.roomTypeId && i.date === date
            );
            if (inv) {
              inv.availableCount = Math.min(inv.totalInventory, inv.availableCount + 1);
            }
          });

          this.addAuditLog(
            'Reconciliation Worker (Cron)',
            'Hold Expired & Rolled Back',
            `Hold ${b.bookingReference} for ${b.guestName || 'Anonymous Guest'} exceeded 10-minute hold window. Restored 1 inventory across ${dates.length} dates.`,
            'CRON'
          );
        }
      }
    });

    if (expiredCount > 0) {
      this.persist();
      this.notify();
    }
    return { expiredCount };
  }

  private startReconciliationWorker() {
    if (typeof window !== 'undefined') {
      this.reconciliationTimer = window.setInterval(() => {
        this.runReconciliationCron();
      }, 5000); // Check every 5s
    }
  }

  public destroy() {
    if (this.reconciliationTimer !== null) {
      clearInterval(this.reconciliationTimer);
      this.reconciliationTimer = null;
    }
  }
}

// Singleton export
export const hotelStore = new HotelStore();
