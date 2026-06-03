import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MiaMemorialProps {
  onClose: () => void;
  onUnlockAchievement: () => void;
}

export const MiaMemorial: React.FC<MiaMemorialProps> = ({ onClose, onUnlockAchievement }) => {
  const [showAchievement, setShowAchievement] = useState(false);

  const handleClose = () => {
    onUnlockAchievement();
    setShowAchievement(true);
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-pink-500/50 rounded-2xl p-4 sm:p-6 max-w-sm w-full backdrop-blur-xl"
        >
          {/* Header */}
          <div className="text-center mb-5">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-5xl sm:text-6xl mb-3"
            >
              🐱
            </motion.div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-1">
              En Memoria de Mía
            </h1>
            <p className="text-pink-300 text-sm font-semibold">2 de Junio de 2026</p>
          </div>

          {/* Memorial Message */}
          <div className="bg-black/40 border border-pink-500/30 rounded-lg p-4 mb-4">
            <div className="text-center mb-4">
              <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">
                Mía fue más que una gatita, fue parte de la familia. Sus ronroneos y su amor incondicional quedarán siempre en nuestros corazones. 💕
              </p>
            </div>

            {/* Cat representation */}
            <div className="flex justify-center gap-4 my-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-3xl"
              >
                😺
              </motion.div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl"
              >
                💚
              </motion.div>
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-3xl"
              >
                😺
              </motion.div>
            </div>

            <p className="text-pink-200 text-center italic text-xs sm:text-sm">
              "Gracias por todos los momentos juntos, Mía. Siempre en nuestras memorias." 🖤
            </p>
          </div>

          {/* Achievement Preview */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/50 rounded-lg p-3 mb-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-bold text-yellow-300 text-xs">Logro Desbloqueado</p>
                <p className="text-yellow-200 text-xs">"Fuistes la mejor gracias"</p>
              </div>
            </div>
          </motion.div>

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClose}
            className="w-full px-4 py-2 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 
              border border-pink-500/50 transition-all duration-300 font-semibold text-sm"
          >
            Cerrar ← Desbloquear Logro
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Achievement Unlock Animation */}
      {showAchievement && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/50 rounded-xl p-4 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="font-bold text-yellow-300">Logro Desbloqueado</p>
              <p className="text-yellow-200 text-sm">"Fuistes la mejor gracias"</p>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};
