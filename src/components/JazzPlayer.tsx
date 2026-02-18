import { useEffect, useRef, useCallback } from 'react';

interface JazzPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function JazzPlayer({ isPlaying, onToggle }: JazzPlayerProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainsRef = useRef<GainNode[]>([]);

  // Jazz-like ambient tones using Web Audio API
  const startJazz = useCallback(() => {
    if (audioContextRef.current) return;

    const ctx = new AudioContext();
    audioContextRef.current = ctx;

    // Create a jazzy chord progression feel with soft pads
    const frequencies = [
      196.00, // G3
      246.94, // B3
      293.66, // D4
      369.99, // F#4
    ];

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Add slight detuning for richness
      osc.detune.setValueAtTime((Math.random() - 0.5) * 10, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.Q.setValueAtTime(1, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2 + i * 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();

      oscillatorsRef.current.push(osc);
      gainsRef.current.push(gain);
    });

    // Add subtle tremolo effect
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.3, ctx.currentTime);
    lfoGain.gain.setValueAtTime(0.005, ctx.currentTime);
    lfo.connect(lfoGain);

    gainsRef.current.forEach(gain => {
      lfoGain.connect(gain.gain);
    });

    lfo.start();
    oscillatorsRef.current.push(lfo);
  }, []);

  const stopJazz = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Fade out gracefully
    gainsRef.current.forEach(gain => {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    });

    setTimeout(() => {
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch {
          // Oscillator might already be stopped
        }
      });
      oscillatorsRef.current = [];
      gainsRef.current = [];

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    }, 1200);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startJazz();
    } else {
      stopJazz();
    }

    return () => {
      stopJazz();
    };
  }, [isPlaying, startJazz, stopJazz]);

  return (
    <div className="mt-8 md:mt-12">
      {/* Play/Pause Button */}
      <button
        onClick={onToggle}
        className="group relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#0a0a12] border border-[#c9a227]/30 hover:border-[#c9a227]/60 transition-all duration-500 flex items-center justify-center overflow-hidden"
        aria-label={isPlaying ? 'Pause jazz' : 'Play jazz'}
      >
        {/* Animated rings when playing */}
        {isPlaying && (
          <>
            <span className="absolute inset-0 rounded-full border border-[#c9a227]/20 animate-ping" style={{ animationDuration: '2s' }} />
            <span className="absolute inset-2 rounded-full border border-[#c9a227]/15 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
          </>
        )}

        {/* Button content */}
        <div className="relative z-10 flex items-center justify-center">
          {isPlaying ? (
            // Pause icon with animated bars
            <div className="flex gap-1 md:gap-1.5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 md:w-1.5 bg-[#c9a227] rounded-full transition-all"
                  style={{
                    height: '16px',
                    animation: 'jazzBar 0.8s ease-in-out infinite',
                    animationDelay: `${i * 0.15}s`
                  }}
                />
              ))}
            </div>
          ) : (
            // Play icon
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 md:w-8 md:h-8 text-[#c9a227] ml-1 group-hover:scale-110 transition-transform duration-300"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-full bg-[#c9a227]/0 group-hover:bg-[#c9a227]/5 transition-colors duration-500" />
      </button>

      {/* Status text */}
      <p className="mt-3 md:mt-4 text-center font-body text-[10px] md:text-xs text-[#6a6a7a] tracking-[0.2em] uppercase">
        {isPlaying ? 'Now Playing' : 'Tap to Play'}
      </p>

      {/* Suno API note */}
      <p className="mt-1 md:mt-2 text-center font-body text-[8px] md:text-[10px] text-[#4a4a5a] tracking-wider">
        Ambient jazz tones · Suno API integration ready
      </p>

      {/* CSS for animated bars */}
      <style>{`
        @keyframes jazzBar {
          0%, 100% { height: 8px; }
          50% { height: 20px; }
        }
      `}</style>
    </div>
  );
}
