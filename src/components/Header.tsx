import React from 'react';
import {
  Calendar,
  Building2,
  ShieldCheck,
  Clock,
  Search,
  Zap,
} from 'lucide-react';
import { Booking } from '../types/hotel';

interface HeaderProps {
  activeView: 'guest' | 'admin';
  setActiveView: (view: 'guest' | 'admin') => void;
  adminSubTab: string;
  setAdminSubTab: (tab: string) => void;
  activeHoldBooking: Booking | null;
  onResumeHold: () => void;
  onOpenLookup: () => void;
  onOpenConcurrencyDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  adminSubTab,
  setAdminSubTab,
  activeHoldBooking,
  onResumeHold,
  onOpenLookup,
  onOpenConcurrencyDemo,
}) => {
  // Calculate remaining hold seconds if active hold exists
  const [remainingSeconds, setRemainingSeconds] = React.useState<number>(0);

  React.useEffect(() => {
    if (!activeHoldBooking || !activeHoldBooking.holdExpiresAt) {
      setRemainingSeconds(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.floor(
          (new Date(activeHoldBooking.holdExpiresAt!).getTime() - Date.now()) / 1000
        )
      );
      setRemainingSeconds(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeHoldBooking]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('guest')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-serif-luxury text-xl font-bold tracking-wider text-neutral-900 group-hover:text-amber-700 transition-colors">
              AURA GRAND
            </span>
            <span className="hidden sm:inline text-xs tracking-widest text-amber-700 font-semibold ml-2">
              MONACO
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links / View Controls */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
          <button
            onClick={() => setActiveView('guest')}
            className={`transition-colors cursor-pointer ${
              activeView === 'guest'
                ? 'text-amber-800 font-semibold border-b-2 border-amber-700 pb-0.5'
                : 'hover:text-neutral-900'
            }`}
          >
            Suites & Booking
          </button>

          <button
            onClick={() => {
              setActiveView('admin');
              setAdminSubTab('timeline');
            }}
            className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeView === 'admin'
                ? 'text-amber-800 font-semibold border-b-2 border-amber-700 pb-0.5'
                : 'hover:text-neutral-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-neutral-400" />
            Hotel PMS Operations
          </button>

          <button
            onClick={onOpenLookup}
            className="hover:text-neutral-900 transition-colors cursor-pointer flex items-center gap-1 text-xs"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            Find Itinerary
          </button>

          <button
            onClick={onOpenConcurrencyDemo}
            className="text-xs text-amber-800 hover:text-amber-900 transition-colors cursor-pointer flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded border border-amber-200"
            title="Interactive test of Redis 2-phase lock preventing double-booking"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            Concurrency Test
          </button>
        </nav>

        {/* Zone 3: Actions & Active Hold Indicator */}
        <div className="flex items-center gap-3">
          {/* Active Hold Countdown Badge */}
          {activeHoldBooking && remainingSeconds > 0 && (
            <button
              onClick={onResumeHold}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-xs font-semibold shadow-sm transition-all animate-pulse"
              title="Click to resume checkout before lock expires"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Hold Active: {formatTimer(remainingSeconds)}</span>
            </button>
          )}

          {/* View Mode Switcher Button */}
          <button
            onClick={() => setActiveView(activeView === 'guest' ? 'admin' : 'guest')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors border cursor-pointer ${
              activeView === 'guest'
                ? 'bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800'
                : 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            {activeView === 'guest' ? 'Switch to Staff PMS' : 'Switch to Guest Booking'}
          </button>
        </div>
      </div>
    </header>
  );
};
