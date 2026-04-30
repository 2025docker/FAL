interface CapitalCardProps {
  value: string;
}

export function CapitalCard({ value }: CapitalCardProps) {
  return (
    <div className="kpi-card bg-gradient-to-br from-primary-600 to-primary-700 text-white text-center">
      <div className="w-9 h-9 rounded-lg mx-auto mb-2 flex items-center justify-center text-lg bg-white/20 text-white">
        💎
      </div>
      <div className="text-[11px] text-white/80 font-medium text-center mb-1">Total Capital</div>
      <div className="text-2xl md:text-3xl font-bold text-center text-white">{value}</div>
      <div className="text-[11px] text-white/70 mt-1 text-center">Balance + Locked + Assets</div>
    </div>
  );
}
