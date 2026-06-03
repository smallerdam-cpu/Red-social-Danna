import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface MiaPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoUrl?: string;
}

export function MiaPhotoModal({ isOpen, onClose, photoUrl }: MiaPhotoModalProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [isOpen]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-gradient-to-br from-pink-950 via-black to-purple-950 border border-pink-500/50 rounded-lg p-3 shadow-xl max-w-xs w-[85vw]">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  🐱 Mía
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors text-lg leading-none"
                >
                  ✕
                </button>
              </div>

              {/* Photo */}
              <div className="mb-3 rounded-lg overflow-hidden border border-pink-500/30 bg-black/40">
                {photoUrl ? (
                  <img 
                    src={photoUrl} 
                    alt="Mía la gatita" 
                    className="w-full h-auto object-cover max-h-[220px]"
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-gradient-to-b from-pink-500/20 to-purple-500/20 text-2xl">
                    🐱
                  </div>
                )}
              </div>

              {/* Memorial Text */}
              <div className="text-center space-y-1 mb-3">
                <p className="text-pink-300 font-semibold text-sm">En Memoria de Mía 💚</p>
                <p className="text-gray-400 text-xs">2 de Junio, 2026</p>
                <p className="text-pink-200 text-xs italic">
                  "Fuistes la mejor gatita del mundo"
                </p>
              </div>

              {/* Audio Player */}
              <audio
                ref={audioRef}
                src="https://files.catbox.moe/txf1si.mp3"
                loop
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
              />

              <div className="bg-black/40 border border-pink-500/30 rounded-lg p-2 mb-3">
                {/* Play/Pause Controls */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <button
                    onClick={handlePlayPause}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 flex items-center justify-center text-white font-bold transition-all text-sm"
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <div className="flex-1 text-center">
                    <p className="text-pink-300 text-xs font-semibold line-clamp-1">Julieta Venegas - A Dónde Va El Viento</p>
                  </div>
                </div>

                {/* Time Slider */}
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleTimeChange}
                  className="w-full h-0.5 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />

                {/* Time Display */}
                <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full px-3 py-1.5 bg-gradient-to-r from-pink-500/30 to-purple-500/30 hover:from-pink-500/50 hover:to-purple-500/50 border border-pink-500/50 rounded-lg text-pink-300 font-medium transition-all text-xs"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
