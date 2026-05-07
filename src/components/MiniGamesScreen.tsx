import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MiniGamesScreenProps {
  onBack: () => void;
}

export const MiniGamesScreen: React.FC<MiniGamesScreenProps> = ({ onBack }) => {
  const [activeGame, setActiveGame] = useState<'memory' | 'flappy' | null>(null);

  const games = [
    {
      id: 'memory',
      title: '🧠 Memory Game',
      description: 'Encuentra las parejas de emojis',
      icon: '🎮',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20'
    },
    {
      id: 'flappy',
      title: '🐦 Flappy Bird',
      description: 'Evita los obstáculos volando',
      icon: '🚀',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10 hover:bg-yellow-500/20'
    }
  ];

  if (activeGame === 'memory') {
    return <MemoryGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'flappy') {
    return <FlappyBirdGame onBack={() => setActiveGame(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black">
      {/* Header */}
      <div className="relative z-10 border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center gap-4">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-black/50 hover:bg-black/70 text-pink-300 hover:text-pink-200
              border border-pink-500/30 transition-all duration-300 text-xs sm:text-sm font-semibold touch-none min-h-[44px] sm:min-h-auto"
          >
            ← Volver
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex-1">Mis Mini Juegos</h1>
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              onClick={() => setActiveGame(game.id as 'memory' | 'flappy')}
              className="group cursor-pointer relative overflow-hidden rounded-2xl transition-all duration-300
                hover:shadow-2xl active:scale-95"
            >
              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${game.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              {/* Card */}
              <div className={`relative backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 
                ${game.bgColor} transition-all duration-300 h-full flex flex-col justify-between min-h-[280px]`}
              >
                {/* Top - Icon */}
                <div className="text-5xl sm:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {game.icon}
                </div>

                {/* Middle - Text */}
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                    {game.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">{game.description}</p>
                </div>

                {/* Bottom - CTA */}
                <div className="flex items-center gap-2 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
                  <span className="text-xs sm:text-sm font-semibold text-cyan-300 group-hover:text-cyan-200">
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
          ))}
        </div>
      </div>
    </div>
  );
};

// Memory Game Component
interface MemoryGameProps {
  onBack: () => void;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
  const emojis = ['🌟', '🎈', '🎁', '🎀', '💖', '✨', '🌸', '🎵'];
  const [cards, setCards] = useState<Array<{ id: number; emoji: string; flipped: boolean; matched: boolean }>>([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  useEffect(() => {
    // Initialize game
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false
      }));
    setCards(shuffled);
  }, []);

  useEffect(() => {
    if (matched === emojis.length) {
      setGameWon(true);
    }
  }, [matched]);

  const handleCardClick = (id: number) => {
    if (selectedCards.length === 2 || cards[id].matched || selectedCards.includes(id)) return;

    const newSelected = [...selectedCards, id];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves(moves + 1);
      
      const [first, second] = newSelected;
      if (cards[first].emoji === cards[second].emoji) {
        // Match!
        setMatched(matched + 1);
        setCards(cards.map((card, idx) =>
          idx === first || idx === second ? { ...card, matched: true } : card
        ));
        setSelectedCards([]);
      } else {
        // No match
        setTimeout(() => setSelectedCards([]), 1000);
      }
    }
  };

  if (gameWon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">¡Ganaste!</h2>
          <p className="text-gray-400 text-sm sm:text-base mb-6">Completado en {moves} movimientos</p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 
                border border-blue-500/30 transition-all duration-300 text-sm font-semibold min-h-[44px]"
            >
              Jugar de Nuevo
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300
                border border-pink-500/30 transition-all duration-300 text-sm font-semibold min-h-[44px]"
            >
              Volver
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black">
      {/* Header */}
      <div className="relative z-10 border-b border-white/10 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-black/50 hover:bg-black/70 text-pink-300 hover:text-pink-200
              border border-pink-500/30 transition-all duration-300 text-xs sm:text-sm font-semibold min-h-[44px]"
          >
            ← Volver
          </button>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Memory Game</h2>
            <p className="text-gray-400 text-xs sm:text-sm">Movimientos: {moves}</p>
          </div>
          <div className="text-sm font-bold text-cyan-300 min-h-[44px] flex items-center">
            {matched}/{emojis.length}
          </div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {cards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square rounded-lg font-bold text-2xl sm:text-4xl transition-all duration-300
                border-2 flex items-center justify-center cursor-pointer min-h-[60px] sm:min-h-[80px]
                ${card.matched
                  ? 'bg-green-500/20 border-green-500/50 text-gray-300'
                  : selectedCards.includes(card.id)
                  ? 'bg-blue-500/30 border-blue-500/70 text-white'
                  : 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-white'
                }`}
            >
              {selectedCards.includes(card.id) || card.matched ? card.emoji : '?'}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Flappy Bird Game Component
interface FlappyBirdGameProps {
  onBack: () => void;
}

const FlappyBirdGame: React.FC<FlappyBirdGameProps> = ({ onBack }) => {
  const [birdY, setBirdY] = useState(250);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [obstacles, setObstacles] = useState<Array<{ x: number; passed: boolean }>>([]);
  const gravity = 6;
  const jumpPower = -15;
  const obstacleGap = 120;

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      // Apply gravity
      setBirdY(prev => {
        const newY = prev + gravity;
        if (newY > 500) {
          setGameOver(true);
          return prev;
        }
        return newY;
      });

      // Generate obstacles
      setObstacles(prev => {
        let updated = prev.map(obs => ({ ...obs, x: obs.x - 7 })).filter(obs => obs.x > -50);

        if (updated.length === 0 || updated[updated.length - 1].x < 200) {
          updated.push({ x: 400, passed: false });
        }

        return updated;
      });

      // Check collisions
      setObstacles(prev => {
        return prev.map((obs, idx) => {
          const birdX = 50;
          const birdSize = 30;
          
          // Check if bird passed the obstacle
          if (obs.x < birdX && !obs.passed) {
            setScore(s => s + 1);
            return { ...obs, passed: true };
          }

          // Check collision
          if (birdX + birdSize > obs.x && birdX < obs.x + 50) {
            if (birdY < 100 || birdY + birdSize > 300) {
              setGameOver(true);
            }
          }

          return obs;
        });
      });
    }, 20);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver]);

  const handleJump = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setScore(0);
      setGameOver(false);
      setObstacles([]);
      setBirdY(250);
    } else if (!gameOver) {
      setBirdY(prev => prev + jumpPower);
    }
  };

  if (gameOver && gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-900/10 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">💥</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">¡Game Over!</h2>
          <p className="text-gray-400 text-sm sm:text-base mb-6">Puntuación: {score}</p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300
                border border-yellow-500/30 transition-all duration-300 text-sm font-semibold min-h-[44px]"
            >
              Intentar de Nuevo
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300
                border border-pink-500/30 transition-all duration-300 text-sm font-semibold min-h-[44px]"
            >
              Volver
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      onClick={handleJump}
      className="min-h-screen bg-gradient-to-b from-cyan-400/20 to-blue-600/20 flex flex-col items-center justify-center p-4 cursor-pointer"
    >
      {/* Score Display */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBack();
          }}
          className="px-4 py-2 rounded-lg bg-black/50 hover:bg-black/70 text-pink-300 hover:text-pink-200
            border border-pink-500/30 transition-all duration-300 text-xs sm:text-sm font-semibold min-h-[44px]"
        >
          ← Volver
        </button>
      </div>

      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-50 text-white font-bold text-lg sm:text-2xl">
        Score: {score}
      </div>

      {/* Game Container */}
      <div className="relative w-full max-w-md h-96 bg-gradient-to-b from-cyan-300/10 to-blue-400/10 border-2 border-white/30 rounded-lg overflow-hidden shadow-2xl">
        {/* Bird */}
        <motion.div
          animate={{ y: birdY }}
          transition={{ type: 'tween', duration: 0 }}
          className="absolute left-12 w-8 h-8 text-2xl z-10"
        >
          🐦
        </motion.div>

        {/* Obstacles */}
        {obstacles.map((obs, idx) => (
          <div key={idx} className="absolute top-0 h-40 w-12 bg-green-500/30 border-2 border-green-500" style={{ left: obs.x }}>
            <div className="h-full bg-green-500/10" />
          </div>
        ))}
        {obstacles.map((obs, idx) => (
          <div key={`bottom-${idx}`} className="absolute bottom-0 h-40 w-12 bg-green-500/30 border-2 border-green-500" style={{ left: obs.x }}>
            <div className="h-full bg-green-500/10" />
          </div>
        ))}

        {/* Instructions */}
        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            <div className="text-center">
              <p className="text-white font-bold text-lg sm:text-xl mb-4">Tap para empezar</p>
              <p className="text-gray-300 text-xs sm:text-sm">Evita los obstáculos</p>
            </div>
          </div>
        )}
      </div>

      {gameStarted && !gameOver && (
        <p className="text-gray-400 text-xs sm:text-sm mt-4">Toca la pantalla para saltar</p>
      )}
    </div>
  );
};
