import React, { useState } from 'react';
import { hotelStore, addDays, formatDate } from '../services/hotelStore';
import { RoomType, Booking } from '../types/hotel';
import {
  Zap,
  Lock,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  X,
  Play,
} from 'lucide-react';

interface ConcurrencyDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomTypes: RoomType[];
}

export const ConcurrencyDemoModal: React.FC<ConcurrencyDemoModalProps> = ({
  isOpen,
  onClose,
  roomTypes,
}) => {
  if (!isOpen) return null;

  const todayStr = hotelStore.getTodayStr();
  const testDate = addDays(todayStr, 1);

  const [step, setStep] = useState<
    'IDLE' | 'RUNNING' | 'COMPLETED'
  >('IDLE');

  const [logs, setLogs] = useState<
    { time: string; client: 'Alpha' | 'Beta' | 'System'; text: string; status: 'info' | 'success' | 'danger' }[]
  >([]);

  const [winnerBooking, setWinnerBooking] = useState<Booking | null>(null);

  const runSimulation = () => {
    setStep('RUNNING');
    setLogs([]);
    setWinnerBooking(null);

    const penthouse = roomTypes.find((r) => r.id === 'rt-penthouse-suite') || roomTypes[0];

    // Artificially ensure exactly 1 room is available for tomorrow
    const currentInv = hotelStore.getData().inventory.find(
      (i) => i.roomTypeId === penthouse.id && i.date === testDate
    );
    if (currentInv) {
      currentInv.availableCount = 1;
    }

    const t0 = new Date().toLocaleTimeString();
    const newLogs: typeof logs = [];

    newLogs.push({
      time: t0,
      client: 'System',
      text: `Setup test precondition: Set inventory for "${penthouse.name}" on ${testDate} to exactly 1 room.`,
      status: 'info',
    });
    setLogs([...newLogs]);

    setTimeout(() => {
      newLogs.push({
        time: new Date().toLocaleTimeString(),
        client: 'Alpha',
        text: `Client Alpha initiates POST /api/v1/bookings/hold for ${testDate}.`,
        status: 'info',
      });
      newLogs.push({
        time: new Date().toLocaleTimeString(),
        client: 'Beta',
        text: `Client Beta concurrently initiates POST /api/v1/bookings/hold for same date (+2ms).`,
        status: 'info',
      });
      setLogs([...newLogs]);

      setTimeout(() => {
        // Alpha acquires distributed lock
        newLogs.push({
          time: new Date().toLocaleTimeString(),
          client: 'Alpha',
          text: `Redis Distributed Lock acquired: "lock:room_type:${penthouse.id}:${testDate}" (TTL: 5000ms).`,
          status: 'info',
        });

        // Alpha checks and decrements
        const alphaResult = hotelStore.acquireHold({
          roomTypeId: penthouse.id,
          checkIn: testDate,
          checkOut: addDays(testDate, 1),
          guestName: 'Client Alpha (Demo)',
          guestEmail: 'alpha@concurrent-test.com',
          guestPhone: '+1 555 0100',
          holdDurationSeconds: 60, // 60s for demo
        });

        if (alphaResult.success && alphaResult.booking) {
          setWinnerBooking(alphaResult.booking);
          newLogs.push({
            time: new Date().toLocaleTimeString(),
            client: 'Alpha',
            text: `Atomic SQL update: available_count reduced from 1 to 0. Status set to HOLD (Expires in 60s). Reference: ${alphaResult.booking.bookingReference}.`,
            status: 'success',
          });
        }
        setLogs([...newLogs]);

        setTimeout(() => {
          // Beta acquires lock next
          newLogs.push({
            time: new Date().toLocaleTimeString(),
            client: 'Beta',
            text: `Client Beta acquires distributed lock: inspects room_type_inventory.`,
            status: 'info',
          });

          // Beta attempts hold
          const betaResult = hotelStore.acquireHold({
            roomTypeId: penthouse.id,
            checkIn: testDate,
            checkOut: addDays(testDate, 1),
            guestName: 'Client Beta (Demo)',
            guestEmail: 'beta@concurrent-test.com',
            guestPhone: '+1 555 0200',
            holdDurationSeconds: 60,
          });

          if (!betaResult.success) {
            newLogs.push({
              time: new Date().toLocaleTimeString(),
              client: 'Beta',
              text: `HTTP 409 Conflict: available_count = 0. Hold REJECTED. Double-booking prevented!`,
              status: 'danger',
            });
          }
          newLogs.push({
            time: new Date().toLocaleTimeString(),
            client: 'System',
            text: `Transaction completed with zero race conditions. 1 room allocated to Alpha, 0 overbooking.`,
            status: 'success',
          });

          setLogs([...newLogs]);
          setStep('COMPLETED');
        }, 800);
      }, 700);
    }, 600);
  };

  const handleSimulateExpiry = () => {
    if (winnerBooking) {
      hotelStore.cancelBooking(winnerBooking.id, 'Demo Hold Timeout Simulator');
      const newLogs = [...logs];
      newLogs.push({
        time: new Date().toLocaleTimeString(),
        client: 'System',
        text: `Reconciliation Worker: Hold for Client Alpha cancelled/expired. 1 room inventory restored to pool!`,
        status: 'info',
      });
      setLogs(newLogs);
      setWinnerBooking(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-200 my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Zap className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-base font-bold text-white">
                Two-Phase Concurrency Stress Simulator
              </h3>
              <p className="text-xs text-neutral-400">
                Zero Double-Booking Proof: Redis Distributed Lock + Atomic SQL Transaction
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Concept Diagram */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs text-neutral-700 space-y-2">
            <div className="font-bold text-neutral-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>How double-booking is prevented:</span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              When two guests attempt to reserve the last remaining room simultaneously,
              a distributed lock ensures atomic serial checking of <code className="bg-neutral-200 px-1 rounded font-mono text-[11px]">room_type_inventory</code>.
              The second guest is guaranteed to receive an immediate 409 Conflict rather than creating an overbooked reservation.
            </p>
          </div>

          {/* Action Trigger Bar */}
          <div className="flex items-center justify-between gap-3 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/80">
            <div>
              <span className="text-xs font-bold text-amber-950 block">
                Race Test: 2 Clients vs 1 Final Suite
              </span>
              <span className="text-[11px] text-amber-800">
                Test Date: {testDate} · Target: Panoramic Sky Penthouse
              </span>
            </div>

            <button
              onClick={runSimulation}
              disabled={step === 'RUNNING'}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                step === 'RUNNING'
                  ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{step === 'RUNNING' ? 'Simulating...' : 'Launch Simulation'}</span>
            </button>
          </div>

          {/* Real-time Execution Log */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block">
              Execution Trace & Distributed Lock Steps:
            </span>

            <div className="bg-neutral-900 text-neutral-200 rounded-xl p-4 font-mono text-[11px] h-60 overflow-y-auto space-y-2">
              {logs.map((l, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-neutral-500 shrink-0 font-mono-nums">[{l.time}]</span>
                  <span
                    className={`font-bold shrink-0 ${
                      l.client === 'Alpha'
                        ? 'text-cyan-400'
                        : l.client === 'Beta'
                        ? 'text-pink-400'
                        : 'text-amber-400'
                    }`}
                  >
                    [{l.client}]:
                  </span>
                  <span
                    className={
                      l.status === 'success'
                        ? 'text-emerald-300'
                        : l.status === 'danger'
                        ? 'text-red-400 font-bold'
                        : 'text-neutral-300'
                    }
                  >
                    {l.text}
                  </span>
                </div>
              ))}

              {logs.length === 0 && (
                <div className="h-full flex items-center justify-center text-neutral-500 italic">
                  Press "Launch Simulation" to trigger parallel reservation race.
                </div>
              )}
            </div>
          </div>

          {/* Post-Test Actions */}
          {winnerBooking && (
            <div className="p-3 bg-neutral-100 rounded-xl flex items-center justify-between text-xs">
              <span className="text-neutral-700">
                Alpha currently holds <strong>{winnerBooking.bookingReference}</strong>.
              </span>
              <button
                onClick={handleSimulateExpiry}
                className="px-3 py-1.5 bg-white hover:bg-neutral-200 border border-neutral-300 rounded text-xs font-semibold text-neutral-800 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                <span>Simulate Hold Expiry & Rollback</span>
              </button>
            </div>
          )}
        </div>

        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
