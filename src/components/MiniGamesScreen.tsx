import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MiniGamesScreenProps {
  onBack: () => void;
}

export const MiniGamesScreen: React.FC<MiniGamesScreenProps> = ({ onBack }) => {
  const [activeGame, setActiveGame] = useState<'hangman' | null>(null);

  if (activeGame === 'hangman') {
    return <HangmanGame onBack={() => setActiveGame(null)} />;
  }

  return (
    <motion.div
      key="mini-games"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">Mis Mini Juegos</h2>
      <p className="text-gray-400 text-sm sm:text-base mb-8">Diviértete con estos juegos interactivos</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => setActiveGame('hangman')}
          className="group cursor-pointer relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl active:scale-95"
        >
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

          {/* Card */}
          <div className="relative backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 
            bg-red-500/10 hover:bg-red-500/20 transition-all duration-300 h-full flex flex-col justify-between min-h-[280px]">
            {/* Top - Icon */}
            <div className="text-5xl sm:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
              💪
            </div>

            {/* Middle - Text */}
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors duration-300">
                Salva a tu Novio
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">Adivina palabras del gym y salva a Smith</p>
            </div>

            {/* Bottom - CTA */}
            <div className="flex items-center gap-2 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
              <span className="text-xs sm:text-sm font-semibold text-pink-300 group-hover:text-pink-200">
                Jugar
              </span>
              <motion.span
                className="text-lg"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                →
              </motion.span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Hangman Game Component
interface HangmanGameProps {
  onBack: () => void;
}

const HangmanGame: React.FC<HangmanGameProps> = ({ onBack }) => {
  const words = [
    // Máquinas de gym
    'TREADMILL',
    'MANCUERNA',
    'BARRA',
    'PRESS',
    'BANCO',
    'POLEA',
    'CINTA',
    'ELIPTICA',
    // Ejercicios
    'SENTADILLAS',
    'FLEXIONES',
    'ABDOMINALES',
    'DORSALES',
    'BICEPS',
    'TRICEPS',
    'HOMBROS',
    'PECHO',
    // Memes de gym
    'PUMP',
    'GAINZ',
    'SHRED',
    'BEAST',
    'GAINS',
    'JACKED',
    'SWOLE',
  ];

  const wordHints: { [key: string]: string } = {
    'TREADMILL': 'Máquina para correr sin moverte',
    'MANCUERNA': 'Peso que cabe en una mano',
    'BARRA': 'Lo que usas para dominadas',
    'PRESS': 'Ejercicio empujando peso hacia adelante',
    'BANCO': 'Donde te sientas para entrenar',
    'POLEA': 'Máquina con cable de tracción',
    'CINTA': 'Máquina caminadora',
    'ELIPTICA': 'Máquina parecida a un escalador',
    'SENTADILLAS': 'Ejercicio para las piernas',
    'FLEXIONES': 'Ejercicio clásico del pecho',
    'ABDOMINALES': 'Ejercicio para los abdos',
    'DORSALES': 'Músculos de la espalda',
    'BICEPS': 'Músculo del brazo frontal',
    'TRICEPS': 'Músculo trasero del brazo',
    'HOMBROS': 'Parte superior del torso',
    'PECHO': 'Parte frontal del torso',
    'PUMP': 'Hinchazón muscular después de entrenar',
    'GAINZ': 'Ganancias musculares en inglés',
    'SHRED': 'Estar muy marcado y definido',
    'BEAST': 'Una bestia en el gym',
    'GAINS': 'Ganancias de músculo',
    'JACKED': 'Estar muy musculoso',
    'SWOLE': 'Músculos hinchados y grandes',
  };

  const [word, setWord] = useState(() => words[Math.floor(Math.random() * words.length)]);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const maxWrongGuesses = 6;

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const displayWord = word
    .split('')
    .map(letter => (guessedLetters.has(letter) ? letter : '_'))
    .join(' ');

  const handleGuess = (letter: string) => {
    if (guessedLetters.has(letter) || gameWon || gameLost) return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!word.includes(letter)) {
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);

      if (newWrong >= maxWrongGuesses) {
        setGameLost(true);
      }
    }

    if (word.split('').every(l => newGuessed.has(l))) {
      setGameWon(true);
    }
  };

  const handleHint = () => {
    setUsedHint(true);
    setShowHint(true);
  };

  const resetGame = () => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setWord(newWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameWon(false);
    setGameLost(false);
    setUsedHint(false);
    setShowHint(false);
  };

  // Dibujar a Smith según errores
  const drawSmith = () => {
    const stages = [
      '😊', // 0 errores - cabeza feliz
      '😐', // 1 error - cabeza normal
      '😕', // 2 errores - preocupado
      '😟', // 3 errores - asustado
      '😢', // 4 errores - llorando
      '😵', // 5 errores - muy mal
      '💀', // 6 errores - Game Over
    ];
    return stages[Math.min(wrongGuesses, maxWrongGuesses)];
  };

  if (gameLost) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-black via-red-900/10 to-black flex items-center justify-center p-4 z-50 overflow-y-auto">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center my-auto"
        >
          <div className="text-5xl sm:text-6xl mb-4">💀</div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">¡Game Over!</h2>
          <p className="text-gray-400 text-sm sm:text-base mb-6">
            La palabra era: <span className="text-red-400 font-bold">{word}</span>
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <button
              onClick={resetGame}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300
                border border-red-500/30 transition-all duration-300 text-xs sm:text-sm font-semibold min-h-[44px]"
            >
              Intentar de Nuevo
            </button>
            <button
              onClick={onBack}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300
                border border-pink-500/30 transition-all duration-300 text-xs sm:text-sm font-semibold min-h-[44px]"
            >
              Volver
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameWon) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-black via-green-900/10 to-black flex items-center justify-center p-4 z-50 overflow-y-auto">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center my-auto"
        >
          <div className="text-5xl sm:text-6xl mb-4">🎉</div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">¡Ganaste!</h2>
          <p className="text-gray-400 text-sm sm:text-base mb-6">
            ¡Salvaste a Smith! Palabra: <span className="text-green-400 font-bold">{word}</span>
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <button
              onClick={resetGame}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 
                border border-green-500/30 transition-all duration-300 text-xs sm:text-sm font-semibold min-h-[44px]"
            >
              Jugar de Nuevo
            </button>
            <button
              onClick={onBack}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300
                border border-pink-500/30 transition-all duration-300 text-xs sm:text-sm font-semibold min-h-[44px]"
            >
              Volver
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-black via-red-900/10 to-black overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-black/20">
      {/* Header */}
      <div className="relative z-10 border-b border-white/10 backdrop-blur-md sticky top-0">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="px-3 py-2 rounded-lg bg-black/50 hover:bg-black/70 text-pink-300 hover:text-pink-200
              border border-pink-500/30 transition-all duration-300 text-xs sm:text-sm font-semibold min-h-[44px] whitespace-nowrap flex-shrink-0"
          >
            ← Volver
          </button>
          <div className="text-center flex-1 min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-white truncate">Salva a tu Novio</h2>
            <p className="text-gray-400 text-xs sm:text-sm">¡Tema: GYM LIFE! 💪</p>
          </div>
          <div className="text-xs sm:text-sm font-bold text-red-300 min-h-[44px] flex items-center flex-shrink-0">
            Errores: {wrongGuesses}/{maxWrongGuesses}
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="max-w-3xl mx-auto px-2 sm:px-6 py-6 sm:py-8 pb-12">
        {/* Smith Character */}
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl sm:text-9xl"
          >
            {drawSmith()}
          </motion.div>
        </div>

        {/* Word Display */}
        <div className="text-center mb-8">
          <div className="text-3xl sm:text-5xl font-bold text-cyan-300 font-mono mb-4 tracking-widest">
            {displayWord}
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            {wrongGuesses < maxWrongGuesses
              ? `Errores restantes: ${maxWrongGuesses - wrongGuesses}`
              : 'No quedan intentos'}
          </p>
        </div>

        {/* Hint Button */}
        <div className="flex justify-center mb-6">
          <motion.button
            onClick={handleHint}
            disabled={usedHint || gameWon || gameLost}
            whileHover={{ scale: usedHint ? 1 : 1.05 }}
            whileTap={{ scale: usedHint ? 1 : 0.95 }}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 min-h-[44px] ${
              usedHint
                ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30 cursor-not-allowed'
                : 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30'
            }`}
          >
            💡 Pista {usedHint ? '(usada)' : ''}
          </motion.button>
        </div>

        {/* Hint Display */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-yellow-500/20 border-l-4 border-yellow-500 rounded px-4 py-3 mb-6 max-w-2xl mx-auto"
            >
              <p className="text-yellow-200 font-semibold text-sm sm:text-base">
                🎯 Pregunta: {wordHints[word]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alphabet Buttons */}
        <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10 gap-1 sm:gap-2 mb-8">
          {alphabet.map((letter) => (
            <motion.button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.has(letter) || gameWon || gameLost}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 sm:p-3 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200
                ${guessedLetters.has(letter)
                  ? word.includes(letter)
                    ? 'bg-green-500/30 border border-green-500/50 text-green-300 cursor-default'
                    : 'bg-red-500/30 border border-red-500/50 text-red-300 cursor-default'
                  : 'bg-purple-500/20 border border-purple-500/50 text-white hover:bg-purple-500/30'
                }`}
            >
              {letter}
            </motion.button>
          ))}
        </div>

        {/* Stats */}
        <div className="text-center text-gray-400 text-sm sm:text-base">
          <p>Letras adivinadas: {guessedLetters.size}</p>
          <p>Tema: Máquinas, ejercicios y memes de gym 💪</p>
        </div>
      </div>
    </div>
  );
};
