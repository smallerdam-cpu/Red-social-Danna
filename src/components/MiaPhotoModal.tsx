import { motion, AnimatePresence } from 'framer-motion';

interface MiaPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoUrl?: string;
}

export function MiaPhotoModal({ isOpen, onClose, photoUrl }: MiaPhotoModalProps) {
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
            <div className="bg-gradient-to-br from-pink-950 via-black to-purple-950 border border-pink-500/50 rounded-lg p-6 shadow-2xl max-w-sm w-[90vw]">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  🐱 Mía
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
                >
                  ✕
                </button>
              </div>

              {/* Photo */}
              <div className="mb-4 rounded-lg overflow-hidden border border-pink-500/30 bg-black/40">
                {photoUrl ? (
                  <img 
                    src={photoUrl} 
                    alt="Mía la gatita" 
                    className="w-full h-auto object-cover max-h-[300px]"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gradient-to-b from-pink-500/20 to-purple-500/20 text-2xl">
                    🐱
                  </div>
                )}
              </div>

              {/* Memorial Text */}
              <div className="text-center space-y-2">
                <p className="text-pink-300 font-semibold">En Memoria de Mía 💚</p>
                <p className="text-gray-400 text-sm">2 de Junio, 2026</p>
                <p className="text-pink-200 text-xs italic pt-2">
                  "Fuistes la mejor gatita del mundo, siempre estarás en nuestros corazones"
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-pink-500/30 to-purple-500/30 hover:from-pink-500/50 hover:to-purple-500/50 border border-pink-500/50 rounded-lg text-pink-300 font-medium transition-all text-sm"
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
