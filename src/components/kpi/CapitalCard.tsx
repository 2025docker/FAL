interface CapitalCardProps {
  value: string;
}

export function CapitalCard({ value }: CapitalCardProps) {
  return (
    <div className="kpi-card bg-gradient-to-br from-primary-600 to-primary-700 text-white text-center py-3">
      <div className="w-8 h-8 rounded-lg mx-auto mb-1 flex items-center justify-center text-base bg-white/20 text-white">
        💎
      </div>
      <div className="text-[10px] text-white/80 font-medium text-center mb-1">Total Capital</div>
      <div className="text-xl md:text-2xl font-bold text-center text-white leading-tight">{value}</div>
      <div className="text-[10px] text-white/70 mt-0.5 text-center">Balance + Locked + Assets</div>
    </div>
  );
}
