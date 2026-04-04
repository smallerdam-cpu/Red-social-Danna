import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface QuestionScreenProps {
  onNext: () => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({ onNext }) => {
  const [accepted, setAccepted] = useState(false);
  const [noStyle, setNoStyle] = useState<React.CSSProperties>({});
  const [isMoved, setIsMoved] = useState(false);

  const moveNoButton = () => {
    // Calculate boundaries to keep the button FULLY inside the screen
    const buttonWidth = 100;
    const buttonHeight = 50;
    const padding = 10;
    
    const maxX = Math.max(padding, window.innerWidth - buttonWidth - padding);
    const maxY = Math.max(padding, window.innerHeight - buttonHeight - padding);
    const minX = padding;
    const minY = padding;
    
    const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
    
    setNoStyle({
      position: 'fixed',
      top: `${randomY}px`,
      left: `${randomX}px`,
      zIndex: 50,
    });
    setIsMoved(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 text-pink-900 overflow-hidden relative w-full h-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-md w-[90%] text-center border border-pink-200"
      >
        {!accepted ? (
          <>
            <h1 className="text-4xl font-extrabold mb-10 text-pink-500 drop-shadow-sm">¿Te gusto? 🥺</h1>
            <div className="flex justify-center gap-6 relative min-h-[50px] w-full">
              <button 
                className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full transition-transform hover:scale-110 shadow-lg text-lg z-20"
                onClick={() => setAccepted(true)}
              >
                Sí
              </button>
              
              <button 
                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-full transition-all duration-200 shadow-md text-lg z-50"
                style={isMoved ? noStyle : {}}
                onMouseEnter={moveNoButton}
                onClick={moveNoButton}
                onTouchStart={moveNoButton}
              >
                No
              </button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-4 text-pink-500">¡Sabía que dirías que sí! ❤️</h1>
            <p className="text-lg mb-8 text-pink-800">Tengo algo especial para ti, mi amor...</p>
            <button 
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-full shadow-xl transform transition hover:scale-105 text-lg"
              onClick={onNext}
            >
              Siguiente ✨
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};