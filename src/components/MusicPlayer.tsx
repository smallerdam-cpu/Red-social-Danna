import React, { useEffect, useState } from 'react';

interface MusicPlayerProps {
  isVisible: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ isVisible, audioRef }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isSeeking, setIsSeeking] = useState(false);

  const artist = "Danna Paola";
  const songName = "Especial para ti 💕";

  // Update time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
      }
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [isSeeking]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-t border-pink-500/30">
      <div className="max-w-full px-2 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-3 min-h-[52px] sm:min-h-auto">
        
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="flex-shrink-0 w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 
            hover:from-pink-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105
            active:scale-95 flex items-center justify-center text-white touch-none"
        >
          {isPlaying ? (
            <svg className="w-5 h-5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 sm:w-4 sm:h-4 fill-current ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-semibold truncate">{songName}</p>
          <p className="text-pink-300/80 text-xs truncate">{artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="hidden sm:flex items-center gap-1 sm:gap-2 w-24 sm:w-32 flex-shrink-0">
          <span className="text-xs text-pink-200/60 flex-shrink-0">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            onMouseDown={() => setIsSeeking(true)}
            onMouseUp={() => setIsSeeking(false)}
            className="flex-1 h-0.5 bg-white/20 rounded-full cursor-pointer appearance-none touch-none
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-400 
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:rounded-full 
              [&::-moz-range-thumb]:bg-pink-400 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
            />
          <span className="text-xs text-pink-200/60 flex-shrink-0">{formatTime(duration)}</span>
        </div>

        {/* Volume Control */}
        <div className="hidden md:flex items-center gap-1 sm:gap-1.5 w-20 sm:w-24 flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-pink-300 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-0.5 bg-white/20 rounded-full cursor-pointer appearance-none touch-none
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-400 
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:h-2 [&::-moz-range-thumb]:w-2 [&::-moz-range-thumb]:rounded-full 
              [&::-moz-range-thumb]:bg-pink-400 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
            />
        </div>

        {/* Animated Equalizer */}
        <div className="flex items-center justify-center gap-0.5 h-6 w-8 sm:w-10 flex-shrink-0">
          {isPlaying && (
            <>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 bg-gradient-to-t from-pink-400 to-purple-400 rounded-full"
                  style={{
                    height: `${20 + Math.sin(Date.now() / 100 + i) * 10}%`,
                    animation: `pulse ${0.3 + i * 0.05}s infinite`
                  }}
                />
              ))}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
