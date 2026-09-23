import React from 'react';
import { RoomType } from '../../types/hotel';
import { X, Check, Coffee, ShieldCheck, Sparkles } from 'lucide-react';

interface RoomDetailModalProps {
  roomType: RoomType | null;
  isOpen: boolean;
  onClose: () => void;
  onReserve: (roomType: RoomType) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  roomType,
  isOpen,
  onClose,
  onReserve,
}) => {
  if (!isOpen || !roomType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-200 my-8">
        <div className="relative h-72 w-full bg-neutral-100">
          <img
            src={roomType.image}
            alt={roomType.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-neutral-950/60 hover:bg-neutral-950/90 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Luxury Sanctuary
            </div>
            <h2 className="text-2xl font-serif-luxury font-bold text-neutral-900 mt-1">
              {roomType.name}
            </h2>
            <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
              <span>{roomType.sizeSqFt} sq ft</span>
              <span>·</span>
              <span>{roomType.bedConfig}</span>
              <span>·</span>
              <span>Maximum {roomType.capacity} Guests</span>
            </div>
          </div>

          <p className="text-sm text-neutral-700 leading-relaxed font-light">
            {roomType.description}
          </p>

          <div>
            <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3">
              Suite Features & Amenities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {roomType.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-neutral-700">
                  <Check className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs space-y-1.5 text-neutral-600">
            <div className="font-semibold text-neutral-900">Policies & Guarantees:</div>
            <div>• {roomType.cancellationPolicy}</div>
            <div>• Check-in from 15:00 CET · Check-out until 12:00 CET</div>
            <div>• 100% Non-Smoking suite</div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-400">Starting from</div>
              <div className="text-2xl font-bold font-mono-nums text-neutral-900">
                ${roomType.basePrice}
                <span className="text-xs font-normal text-neutral-500"> / night</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onReserve(roomType);
              }}
              className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Reserve This Suite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
