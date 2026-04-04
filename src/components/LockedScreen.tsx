import React from 'react';
import { motion } from 'framer-motion';

interface LockedScreenProps {
  onBack: () => void;
}

export const LockedScreen: React.FC<LockedScreenProps> = ({ onBack }) => {
  const daysUntilBirthday = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    let birthday = new Date(currentYear, 3, 9); // Abril is month 3 (0-indexed)
    
    if (today > birthday) {
      birthday = new Date(currentYear + 1, 3, 9);
    }
    
    const diff = birthday.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-black via-purple-900/20 to-black overflow-hidden relative flex items-center justify-center">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [20, 0, 20] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="fixed top-4 sm:top-6 left-4 sm:left-6 z-40 bg-black/50 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg
          text-pink-300 hover:text-pink-200 text-xs sm:text-sm font-semibold border border-pink-500/30
          hover:border-pink-500/60 transition-all duration-300 touch-none active:scale-95 min-h-[44px] sm:min-h-auto"
      >
        ← Volver
      </button>

      {/* Countdown Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-3xl mx-auto px-4 text-center"
      >
        {/* Decorative Top Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="text-6xl mb-6 inline-block"
        >
          🎁
        </motion.div>

        {/* Main Countdown Box */}
        <motion.div
          className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-pink-500/40 mb-8 shadow-2xl"
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(236, 72, 153, 0.2)',
              '0 0 60px rgba(236, 72, 153, 0.4)',
              '0 0 20px rgba(236, 72, 153, 0.2)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {/* Subtitle */}
          <p className="text-pink-300 text-sm sm:text-base font-semibold mb-4 uppercase tracking-widest">
            ⏳ Cuenta Regresiva Especial
          </p>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black mb-3">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Tu Galaxia Llega
            </span>
          </h1>

          {/* Date */}
          <p className="text-xl sm:text-2xl text-pink-200 mb-8 font-bold">
            El 9 de Abril 🌌
          </p>

          {/* Big Countdown Number */}
          <motion.div
            key={daysUntilBirthday()}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="inline-block">
              <motion.p
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl sm:text-9xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
              >
                {daysUntilBirthday()}
              </motion.p>
              <p className="text-lg sm:text-xl text-pink-200 font-bold mt-2 -mt-4">
                {daysUntilBirthday() === 1 ? 'DÍA' : 'DÍAS'}
              </p>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full mb-8" />

          {/* Message */}
          <div className="space-y-3">
            <p className="text-pink-200 text-lg sm:text-xl font-semibold">
              🎉 ¡Algo especial está llegando!
            </p>
            <p className="text-gray-300 text-sm sm:text-base">
              Esta galaxia 3D fue creada exclusivamente para celebrar tu cumpleaños. Una experiencia única te espera.
            </p>
          </div>
        </motion.div>

        {/* Animated Stars */}
        <div className="flex justify-center gap-6 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ 
                duration: 2, 
                delay: i * 0.2, 
                repeat: Infinity 
              }}
              className="text-3xl"
            >
              {['✨', '🌟', '💫', '⭐', '🌠'][i]}
            </motion.div>
          ))}
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-md border border-pink-500/30 rounded-2xl p-4 sm:p-6"
        >
          <p className="text-gray-300 text-xs sm:text-sm">
            💝 Vuelve el 9 de abril para acceder a tu universo personalizado
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
