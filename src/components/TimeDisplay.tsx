interface TimeDisplayProps {
  time: Date;
}

export function TimeDisplay({ time }: TimeDisplayProps) {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="mt-8 md:mt-12 text-center">
      <div className="flex items-baseline justify-center gap-1 md:gap-2">
        <span className="font-display text-4xl md:text-6xl lg:text-7xl text-[#e8e8f0] tracking-wider">
          {formatNumber(displayHours)}
        </span>
        <span className="font-display text-4xl md:text-6xl lg:text-7xl text-[#c9a227] animate-pulse">
          :
        </span>
        <span className="font-display text-4xl md:text-6xl lg:text-7xl text-[#e8e8f0] tracking-wider">
          {formatNumber(minutes)}
        </span>
        <span className="font-body text-lg md:text-xl text-[#8b8b9a] ml-2 md:ml-3 tracking-[0.2em]">
          {ampm}
        </span>
      </div>

      {/* Decorative underline */}
      <div className="flex items-center justify-center gap-2 mt-3 md:mt-4">
        <div className="w-2 h-2 rotate-45 border border-[#c9a227]/40" />
        <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-[#c9a227]/40 to-transparent" />
        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#c9a227]/60 rotate-45" />
        <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent via-[#c9a227]/40 to-transparent" />
        <div className="w-2 h-2 rotate-45 border border-[#c9a227]/40" />
      </div>

      {/* Jazz reminder */}
      <p className="mt-4 md:mt-6 font-body text-[10px] md:text-xs text-[#6a6a7a] tracking-[0.3em] uppercase">
        Jazz plays at :00 & :30
      </p>
    </div>
  );
}
