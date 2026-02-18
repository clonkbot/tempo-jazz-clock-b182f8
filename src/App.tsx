import { useState, useEffect, useRef, useCallback } from 'react';
import { Clock } from './components/Clock';
import { JazzPlayer } from './components/JazzPlayer';
import { TimeDisplay } from './components/TimeDisplay';

function App() {
  const [time, setTime] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [showJazzNotification, setShowJazzNotification] = useState(false);
  const lastPlayedRef = useRef<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check for 30-minute marks
  useEffect(() => {
    const minutes = time.getMinutes();
    const hours = time.getHours();
    const currentMark = hours * 60 + minutes;

    if ((minutes === 0 || minutes === 30) && lastPlayedRef.current !== currentMark) {
      lastPlayedRef.current = currentMark;
      setIsPlaying(true);
      setShowJazzNotification(true);

      // Hide notification after 5 seconds
      setTimeout(() => setShowJazzNotification(false), 5000);

      // Stop playing after 30 seconds (simulated)
      setTimeout(() => setIsPlaying(false), 30000);
    }
  }, [time]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
    if (!isPlaying) {
      setShowJazzNotification(true);
      setTimeout(() => setShowJazzNotification(false), 3000);
    }
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-[#0a0a12] relative overflow-hidden flex flex-col">
      {/* Art Deco Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0z' fill='none' stroke='%23c9a227' stroke-width='1'/%3E%3Cpath d='M30 10L50 30L30 50L10 30L30 10z' fill='none' stroke='%23c9a227' stroke-width='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />

      {/* Smoky Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/80 via-transparent to-[#0a0a12]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#c9a227]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1e3a5f]/20 rounded-full blur-[120px]" />

      {/* Jazz Notification */}
      <div className={`fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ${showJazzNotification ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
        <div className="bg-gradient-to-r from-[#c9a227]/20 via-[#c9a227]/30 to-[#c9a227]/20 backdrop-blur-xl border border-[#c9a227]/40 rounded-full px-5 py-2.5 md:px-8 md:py-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex gap-0.5 md:gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 md:w-1 bg-[#c9a227] rounded-full animate-pulse"
                  style={{
                    height: `${12 + Math.random() * 12}px`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '0.8s'
                  }}
                />
              ))}
            </div>
            <span className="font-display text-[#c9a227] text-sm md:text-base tracking-wider uppercase">Jazz Time</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12 relative z-10">
        {/* Header */}
        <header className="text-center mb-6 md:mb-12">
          <h1 className="font-display text-[#c9a227] text-3xl md:text-5xl lg:text-6xl tracking-[0.2em] md:tracking-[0.3em] uppercase mb-2 md:mb-3">
            Tempo
          </h1>
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <div className="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-[#c9a227]/60" />
            <span className="font-body text-[#8b8b9a] text-xs md:text-sm tracking-[0.4em] uppercase">Jazz Clock</span>
            <div className="h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-[#c9a227]/60" />
          </div>
        </header>

        {/* Clock */}
        <Clock time={time} />

        {/* Digital Time Display */}
        <TimeDisplay time={time} />

        {/* Jazz Player Control */}
        <JazzPlayer isPlaying={isPlaying} onToggle={togglePlay} />
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-4 md:pb-6 text-center">
        <p className="font-body text-[#4a4a5a] text-[10px] md:text-xs tracking-wider">
          Requested by <span className="text-[#6a6a7a]">@stringer_kade</span> · Built by <span className="text-[#6a6a7a]">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
