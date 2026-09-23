import React, { useState } from 'react';
import { RoomType, DailyInventory } from '../../types/hotel';
import { hotelStore, addDays, getDatesBetween } from '../../services/hotelStore';
import {
  DollarSign,
  TrendingUp,
  AlertOctagon,
  Calendar,
  Check,
  Zap,
} from 'lucide-react';

interface RatesInventoryGridProps {
  roomTypes: RoomType[];
  inventory: DailyInventory[];
}

export const RatesInventoryGrid: React.FC<RatesInventoryGridProps> = ({
  roomTypes,
  inventory,
}) => {
  const todayStr = hotelStore.getTodayStr();
  const [startDate, setStartDate] = useState(todayStr);

  // Generate 14 days
  const daysCount = 14;
  const dates: string[] = [];
  let curr = startDate;
  for (let i = 0; i < daysCount; i++) {
    dates.push(curr);
    curr = addDays(curr, 1);
  }

  // Batch Adjuster State
  const [targetType, setTargetType] = useState(roomTypes[0]?.id || '');
  const [batchStart, setBatchStart] = useState(todayStr);
  const [batchEnd, setBatchEnd] = useState(addDays(todayStr, 7));
  const [customPrice, setCustomPrice] = useState<string>('');
  const [percentageModifier, setPercentageModifier] = useState<string>('');
  const [stopSellToggle, setStopSellToggle] = useState<boolean>(false);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const handleApplyBatchRates = (e: React.FormEvent) => {
    e.preventDefault();
    const rt = roomTypes.find((r) => r.id === targetType);
    if (!rt) return;

    let finalPrice: number | undefined = undefined;
    if (customPrice && !isNaN(Number(customPrice))) {
      finalPrice = Number(customPrice);
    } else if (percentageModifier && !isNaN(Number(percentageModifier))) {
      const mult = 1 + Number(percentageModifier) / 100;
      finalPrice = Math.round(rt.basePrice * mult);
    }

    hotelStore.updateDailyRates(
      targetType,
      batchStart,
      batchEnd,
      finalPrice,
      stopSellToggle
    );

    setAppliedNotice(
      `Updated ${rt.name} from ${batchStart} to ${batchEnd}${
        finalPrice ? ` (New Rate: $${finalPrice})` : ''
      }${stopSellToggle ? ' [Stop-Sell Activated]' : ''}`
    );

    setTimeout(() => setAppliedNotice(null), 4000);
  };

  const handleToggleSingleStopSell = (roomTypeId: string, date: string, currentStopSell: boolean) => {
    hotelStore.updateDailyRates(roomTypeId, date, addDays(date, 1), undefined, !currentStopSell);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-luxury text-base font-bold text-neutral-900">
            Rates, Dynamic Pricing & Availability Grid
          </h3>
          <p className="text-xs text-neutral-500">
            Control daily inventory allotments, stop-sell channel closures, and demand pricing
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500">Starting from:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2.5 py-1 bg-neutral-50 border border-neutral-200 rounded font-mono-nums text-xs"
          />
        </div>
      </div>

      {appliedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{appliedNotice}</span>
        </div>
      )}

      {/* 14-Day Rates & Availability Matrix */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[960px]">
            {/* Table Header: Dates */}
            <div className="flex border-b border-neutral-200 bg-neutral-100/75 text-xs font-semibold text-neutral-700">
              <div className="w-56 shrink-0 p-3 border-r border-neutral-200">
                Suite Tier & Base Rate
              </div>
              <div className="flex-1 grid grid-cols-14 divide-x divide-neutral-200">
                {dates.map((d) => {
                  const isToday = d === todayStr;
                  const [y, m, dayNum] = d.split('-').map(Number);
                  const dateObj = new Date(y, m - 1, dayNum);
                  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                  return (
                    <div
                      key={d}
                      className={`text-center py-2 px-1 ${
                        isToday ? 'bg-amber-100/70 text-amber-950 font-bold' : ''
                      }`}
                    >
                      <div className="text-[10px] uppercase opacity-75">{dayName}</div>
                      <div className="text-xs font-mono-nums">{dayNum}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rows for each room type */}
            <div className="divide-y divide-neutral-200">
              {roomTypes.map((rt) => (
                <div key={rt.id} className="flex hover:bg-neutral-50/50 transition-colors">
                  {/* Left Column: Room Type Info */}
                  <div className="w-56 shrink-0 p-3 border-r border-neutral-200 bg-white">
                    <div className="font-bold text-sm text-neutral-900 font-serif-luxury">
                      {rt.name}
                    </div>
                    <div className="text-xs text-neutral-500 font-mono-nums mt-0.5">
                      Base: ${rt.basePrice} · Total: {rt.totalInventory} units
                    </div>
                  </div>

                  {/* 14 Date Columns */}
                  <div className="flex-1 grid grid-cols-14 divide-x divide-neutral-100 text-center">
                    {dates.map((date) => {
                      const inv = inventory.find(
                        (i) => i.roomTypeId === rt.id && i.date === date
                      );
                      const available = inv ? inv.availableCount : rt.totalInventory;
                      const activePrice = inv?.priceOverride ?? rt.basePrice;
                      const isStopSell = inv?.stopSell ?? false;

                      return (
                        <div
                          key={date}
                          className={`p-1.5 flex flex-col justify-between items-center text-xs h-20 ${
                            isStopSell
                              ? 'bg-red-50/60'
                              : available === 0
                              ? 'bg-neutral-100'
                              : available === 1
                              ? 'bg-amber-50/40'
                              : ''
                          }`}
                        >
                          {/* Available Rooms Pill */}
                          <span
                            className={`font-mono-nums text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isStopSell
                                ? 'bg-red-200 text-red-900'
                                : available === 0
                                ? 'bg-neutral-200 text-neutral-600'
                                : available === 1
                                ? 'bg-amber-200 text-amber-950'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {isStopSell ? 'STOP' : `${available}/${rt.totalInventory}`}
                          </span>

                          {/* Active Nightly Price */}
                          <span className="font-mono-nums font-bold text-xs text-neutral-900">
                            ${activePrice}
                          </span>

                          {/* Quick Stop Sell Toggle */}
                          <button
                            onClick={() =>
                              handleToggleSingleStopSell(rt.id, date, isStopSell)
                            }
                            className={`text-[9px] font-medium px-1 rounded transition-colors cursor-pointer ${
                              isStopSell
                                ? 'text-red-700 hover:underline'
                                : 'text-neutral-400 hover:text-neutral-700'
                            }`}
                            title="Toggle Stop-Sell for this day"
                          >
                            {isStopSell ? 'Closed' : 'Open'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Batch Rate & Inventory Modifier Form */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-700" />
          <h4 className="font-serif-luxury text-sm font-bold text-neutral-900">
            Batch Rate Modifier & Revenue Rules
          </h4>
        </div>

        <form onSubmit={handleApplyBatchRates} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Target Room Type */}
          <div className="lg:col-span-2">
            <label className="block text-xs text-neutral-500 mb-1">Target Category</label>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg cursor-pointer"
            >
              {roomTypes.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  {rt.name} (Base ${rt.basePrice})
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Start Date</label>
            <input
              type="date"
              value={batchStart}
              onChange={(e) => setBatchStart(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg font-mono-nums"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs text-neutral-500 mb-1">End Date</label>
            <input
              type="date"
              value={batchEnd}
              onChange={(e) => setBatchEnd(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg font-mono-nums"
            />
          </div>

          {/* Fixed Price Override */}
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Fixed Rate ($)</label>
            <input
              type="number"
              placeholder="e.g. 520"
              value={customPrice}
              onChange={(e) => {
                setCustomPrice(e.target.value);
                setPercentageModifier('');
              }}
              className="w-full px-2.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg font-mono-nums"
            />
          </div>

          {/* Surge % Modifier */}
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Or Surge (+/- %)</label>
            <input
              type="number"
              placeholder="e.g. 20"
              value={percentageModifier}
              onChange={(e) => {
                setPercentageModifier(e.target.value);
                setCustomPrice('');
              }}
              className="w-full px-2.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg font-mono-nums"
            />
          </div>

          {/* Stop Sell & Submit */}
          <div className="lg:col-span-6 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100">
            <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={stopSellToggle}
                onChange={(e) => setStopSellToggle(e.target.checked)}
                className="rounded border-neutral-300 text-amber-800 focus:ring-amber-600"
              />
              <span className="font-medium">
                Activate Stop-Sell (Close online guest booking channels for this date range)
              </span>
            </label>

            <button
              type="submit"
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Apply Rate Rules
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
