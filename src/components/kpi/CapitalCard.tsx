interface CapitalCardProps {
  value: string;
  onNotepad?: () => void;
}

export function CapitalCard({ value, onNotepad }: CapitalCardProps) {
  return (
    <div className="kpi-card bg-gradient-to-br from-primary-600 to-primary-700 text-white text-center py-2 sm:py-3 relative">
      {onNotepad && (
        <button
          onClick={(e) => { e.stopPropagation(); onNotepad?.(); }}
          className="absolute top-1 right-1 text-[8px] sm:text-[10px] text-white/60 hover:text-white transition-colors"
          title="Notes"
        >
          📝
        </button>
      )}
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg mx-auto mb-1 flex items-center justify-center text-sm sm:text-base bg-white/20 text-white">
        💎
      </div>
      <div className="text-[8px] sm:text-[9px] md:text-[10px] text-white/80 font-medium text-center mb-0.5 sm:mb-1">Total Capital</div>
      <div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-center text-white leading-tight">{value}</div>
      <div className="text-[8px] sm:text-[9px] md:text-[10px] text-white/70 mt-0.5 text-center">Balance + Locked + Assets</div>
    </div>
  );
}
