import { useMemo } from 'react';

interface ClockProps {
  time: Date;
}

export function Clock({ time }: ClockProps) {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Hour hand: short, moves smoothly with minutes
  const hourRotation = useMemo(() => {
    return (hours * 30) + (minutes * 0.5);
  }, [hours, minutes]);

  // Minute hand: long, moves slowly (eased) - updates every second but with smooth CSS transition
  const minuteRotation = useMemo(() => {
    return (minutes * 6) + (seconds * 0.1);
  }, [minutes, seconds]);

  // Generate hour markers
  const hourMarkers = useMemo(() => {
    return [...Array(12)].map((_, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const outerRadius = 45;
      const innerRadius = i % 3 === 0 ? 38 : 41;

      return {
        x1: 50 + Math.cos(angle) * innerRadius,
        y1: 50 + Math.sin(angle) * innerRadius,
        x2: 50 + Math.cos(angle) * outerRadius,
        y2: 50 + Math.sin(angle) * outerRadius,
        isMain: i % 3 === 0
      };
    });
  }, []);

  // Art Deco decorative elements
  const decorativeArcs = useMemo(() => {
    return [...Array(4)].map((_, i) => ({
      startAngle: i * 90,
      endAngle: i * 90 + 60
    }));
  }, []);

  return (
    <div className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px]">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-[#c9a227]/5 blur-3xl scale-110" />

      {/* Clock face */}
      <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
        <defs>
          {/* Metallic gradient for the frame */}
          <linearGradient id="brassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8d48a" />
            <stop offset="30%" stopColor="#c9a227" />
            <stop offset="50%" stopColor="#f4e5a3" />
            <stop offset="70%" stopColor="#c9a227" />
            <stop offset="100%" stopColor="#8b7017" />
          </linearGradient>

          {/* Dark face gradient */}
          <radialGradient id="faceGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0a0a12" />
          </radialGradient>

          {/* Hand shadow */}
          <filter id="handShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.5" floodColor="#000" floodOpacity="0.5" />
          </filter>

          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer decorative ring */}
        <circle cx="50" cy="50" r="49" fill="none" stroke="url(#brassGradient)" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="47.5" fill="none" stroke="#c9a227" strokeWidth="0.2" opacity="0.5" />

        {/* Art Deco corner decorations */}
        {decorativeArcs.map((arc, i) => (
          <path
            key={i}
            d={`M ${50 + 46 * Math.cos((arc.startAngle - 90) * Math.PI / 180)} ${50 + 46 * Math.sin((arc.startAngle - 90) * Math.PI / 180)}
                A 46 46 0 0 1 ${50 + 46 * Math.cos((arc.startAngle - 90 + 30) * Math.PI / 180)} ${50 + 46 * Math.sin((arc.startAngle - 90 + 30) * Math.PI / 180)}`}
            fill="none"
            stroke="#c9a227"
            strokeWidth="0.3"
            opacity="0.3"
          />
        ))}

        {/* Clock face background */}
        <circle cx="50" cy="50" r="46" fill="url(#faceGradient)" />

        {/* Inner decorative circles */}
        <circle cx="50" cy="50" r="44" fill="none" stroke="#c9a227" strokeWidth="0.15" opacity="0.3" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="#c9a227" strokeWidth="0.1" opacity="0.2" strokeDasharray="2 4" />

        {/* Hour markers */}
        {hourMarkers.map((marker, i) => (
          <line
            key={i}
            x1={marker.x1}
            y1={marker.y1}
            x2={marker.x2}
            y2={marker.y2}
            stroke={marker.isMain ? "#c9a227" : "#6a6a7a"}
            strokeWidth={marker.isMain ? "1.5" : "0.5"}
            strokeLinecap="round"
            filter={marker.isMain ? "url(#glow)" : undefined}
          />
        ))}

        {/* Hour numerals at 12, 3, 6, 9 */}
        <text x="50" y="16" textAnchor="middle" fill="#c9a227" fontSize="5" fontFamily="serif" className="font-display">XII</text>
        <text x="86" y="52" textAnchor="middle" fill="#c9a227" fontSize="5" fontFamily="serif" className="font-display">III</text>
        <text x="50" y="90" textAnchor="middle" fill="#c9a227" fontSize="5" fontFamily="serif" className="font-display">VI</text>
        <text x="14" y="52" textAnchor="middle" fill="#c9a227" fontSize="5" fontFamily="serif" className="font-display">IX</text>

        {/* Minute hand - LONG, moves slowly */}
        <g
          transform={`rotate(${minuteRotation} 50 50)`}
          style={{ transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          filter="url(#handShadow)"
        >
          {/* Minute hand - elegant long tapered design */}
          <path
            d="M 49 50 L 50 12 L 51 50 Z"
            fill="#e8e8f0"
            opacity="0.95"
          />
          <path
            d="M 49.5 50 L 50 14 L 50.5 50 Z"
            fill="#ffffff"
            opacity="0.8"
          />
          {/* Decorative element */}
          <circle cx="50" cy="20" r="1" fill="#c9a227" opacity="0.8" />
        </g>

        {/* Hour hand - SHORT */}
        <g
          transform={`rotate(${hourRotation} 50 50)`}
          style={{ transition: 'transform 0.5s ease-out' }}
          filter="url(#handShadow)"
        >
          {/* Hour hand - bold short design */}
          <path
            d="M 48 50 L 50 28 L 52 50 Z"
            fill="url(#brassGradient)"
          />
          {/* Decorative arrow tip */}
          <path
            d="M 48.5 32 L 50 26 L 51.5 32 Z"
            fill="#c9a227"
          />
        </g>

        {/* Center cap */}
        <circle cx="50" cy="50" r="3" fill="#1a1a2e" stroke="url(#brassGradient)" strokeWidth="1" />
        <circle cx="50" cy="50" r="1.5" fill="#c9a227" filter="url(#glow)" />
      </svg>

      {/* Reflection overlay */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
