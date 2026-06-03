import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalaxyScreen } from './GalaxyScreen';
import { MiniGamesScreen } from './MiniGamesScreen';
import { MiaMemorial } from './MiaMemorial';
import { MiaPhotoModal } from './MiaPhotoModal';
import { MiaChat } from './MiaChat';

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ username, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'inicio' | 'regalos' | 'mini-games' | 'chat'>('inicio');
  const [activeGift, setActiveGift] = useState<'galaxy' | null>(null);
  const [testDate, setTestDate] = useState<Date | null>(null);
  const [showDevTools, setShowDevTools] = useState(false);
  const [showMiaMemorial, setShowMiaMemorial] = useState(false);
  const [showMiaPhoto, setShowMiaPhoto] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [achievements, setAchievements] = useState<string[]>(() => {
    const saved = localStorage.getItem('galaxia_achievements');
    return saved ? JSON.parse(saved) : [];
  });

  // Show memorial on first login
  useEffect(() => {
    const hasSeenMemorial = localStorage.getItem('galaxia_mia_memorial_seen');
    if (!hasSeenMemorial) {
      setShowMiaMemorial(true);
    }
  }, []);

  const handleUnlockAchievement = () => {
    if (!achievements.includes('mia_memorial')) {
      const newAchievements = [...achievements, 'mia_memorial'];
      setAchievements(newAchievements);
      localStorage.setItem('galaxia_achievements', JSON.stringify(newAchievements));
      localStorage.setItem('galaxia_mia_memorial_seen', 'true');
    }
  };

  // Check if today is April 9
  const isSpecialDay = () => {
    const today = testDate || new Date();
    return today.getMonth() === 3 && today.getDate() === 9;
  };

  const todayIsSpecial = isSpecialDay();

  // Calculate days until birthday
  const daysUntilBirthday = () => {
    const today = testDate || new Date();
    const currentYear = today.getFullYear();
    let birthday = new Date(currentYear, 3, 9);
    
    if (today > birthday) {
      birthday = new Date(currentYear + 1, 3, 9);
    }
    
    const diff = birthday.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleSetTestDate = (dateString: string) => {
    if (dateString) {
      setTestDate(new Date(dateString));
    } else {
      setTestDate(null);
    }
  };

  const handleResetAchievements = () => {
    setAchievements([]);
    localStorage.removeItem('galaxia_achievements');
    localStorage.removeItem('galaxia_mia_memorial_seen');
    setAdminMode(false);
    setShowDevTools(false);
    // Cierra sesión automáticamente para que no vea los cambios
    setTimeout(() => {
      handleLogout();
    }, 500);
  };

  const handleAdminPasswordSubmit = () => {
    if (adminPassword === '17081998') {
      setAdminMode(true);
      setShowAdminPassword(false);
      setAdminPassword('');
      setShowDevTools(true);
    } else {
      alert('Contraseña incorrecta');
      setAdminPassword('');
    }
  };

  const handleAdminLogout = () => {
    setAdminMode(false);
    setShowDevTools(false);
    setAdminPassword('');
  };

  const handleLogout = () => {
    setAdminMode(false);
    setShowDevTools(false);
    setAdminPassword('');
    onLogout();
  };

  // Regalos disponibles
  const gifts = [
    {
      id: 'galaxy',
      title: '🌌 Mi Galaxia',
      description: 'Un universo 3D interactivo creado especialmente para ti',
      icon: '✨',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10 hover:bg-purple-500/20'
    },
    {
      id: 'coming-soon',
      title: '💝 Más Sorpresas',
      description: 'Próximas interacciones especiales para ti',
      icon: '🎁',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
      disabled: true
    }
  ];

  // Si está viendo la galaxia
  if (activeGift === 'galaxy') {
    return (
      <div className="relative">
        <GalaxyScreen />
        <button
          onClick={() => setActiveGift(null)}
          className="fixed top-4 sm:top-6 left-4 sm:left-6 z-40 bg-black/50 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg
            text-pink-300 hover:text-pink-200 text-xs sm:text-sm font-semibold border border-pink-500/30
            hover:border-pink-500/60 transition-all duration-300 touch-none active:scale-95 min-h-[44px] sm:min-h-auto"
        >
          ← Volver
        </button>
      </div>
    );
  }

  // Si está viendo los mini juegos
  if (activeGift === 'mini-games') {
    return <MiniGamesScreen onBack={() => setActiveGift(null)} />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-black via-purple-900/10 to-black overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-black/20 flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {todayIsSpecial && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/50 rounded-lg px-4 py-2 mb-2 sm:mb-0"
            >
              <p className="text-pink-300 font-bold text-center sm:text-left text-sm">🎉 ¡Hoy es tu día especial! 🎂</p>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 w-full sm:w-auto"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
              👤
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-xs sm:text-sm">
                {todayIsSpecial ? '¡Felicidades,' : 'Bienvenida,'}
              </p>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent capitalize truncate">
                {username}
              </h1>
            </div>
          </motion.div>

          {/* Achievement Badge */}
          {achievements.includes('mia_memorial') && (
            <motion.button
              onClick={() => setShowMiaPhoto(true)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/50 rounded-xl px-2 sm:px-4 py-1.5 sm:py-3 flex items-center gap-2 sm:gap-3 cursor-pointer transition-all duration-300"
            >
              <span className="text-lg sm:text-2xl">🏆</span>
              <div className="hidden sm:block">
                <p className="font-bold text-yellow-300 text-xs sm:text-sm">Fuistes la mejor gracias</p>
                <p className="text-yellow-200 text-xs">En memoria de Mía 💚</p>
              </div>
            </motion.button>
          )}

          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200
              border border-red-500/30 hover:border-red-500/60 transition-all duration-300 text-xs sm:text-sm font-semibold touch-none min-h-[44px] sm:min-h-auto"
          >
            Cerrar Sesión
          </motion.button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="relative z-10 border-b border-white/10 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto">
            {[
              { id: 'inicio', label: '🏠 Inicio' },
              { id: 'regalos', label: '🎁 Tus Regalos' },
              { id: 'mini-games', label: '🎮 Mini Juegos' },
              { id: 'chat', label: '😺 Chat' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'inicio' | 'regalos' | 'mini-games' | 'chat')}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'text-pink-300 border-b-2 border-pink-500'
                    : 'text-gray-400 hover:text-gray-300 border-b-2 border-transparent'
                  } min-h-[44px] sm:min-h-auto flex items-center`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'inicio' ? (
            // Inicio Tab
            <motion.div
              key="inicio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">Bienvenida</h2>
              <p className="text-gray-400 text-sm sm:text-base mb-8">A tu espacio personal especial</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Próximo Cumpleaños */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6 sm:p-8"
                >
                  <div className="text-4xl sm:text-5xl mb-4">🎂</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Tu Próximo Cumpleaños</h3>
                  <p className="text-gray-400 text-sm mb-4">Faltan</p>
                  <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {daysUntilBirthday()}
                  </div>
                  <p className="text-pink-300 text-sm font-semibold mt-2">días para que llegue tu día especial ✨</p>
                </motion.div>

                {/* Quick Access */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6 sm:p-8"
                >
                  <div className="text-4xl sm:text-5xl mb-4">🎁</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Tus Regalos</h3>
                  <p className="text-gray-400 text-sm mb-4">Acceso a interacciones especiales</p>
                  <motion.button
                    onClick={() => setActiveTab('regalos')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 
                      border border-blue-500/30 transition-all duration-300 text-xs sm:text-sm font-semibold touch-none min-h-[44px] sm:min-h-auto"
                  >
                    Explorar Regalos →
                  </motion.button>
                </motion.div>
              </div>

              {/* Achievements Section */}
              {achievements.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/10">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">🏆 Logros Desbloqueados</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {achievements.map((achievement) => {
                      const achievementData = achievement === 'mia_memorial' && {
                        title: 'Fuistes la mejor gracias',
                        description: 'En memoria de Mía 💚',
                        icon: '🏆',
                        date: '2 de Junio, 2026'
                      };

                      return achievementData ? (
                        <motion.div
                          key={achievement}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-2xl p-6 sm:p-8"
                        >
                          <div className="text-4xl sm:text-5xl mb-4">{achievementData.icon}</div>
                          <h4 className="text-lg sm:text-xl font-bold text-yellow-300 mb-2">{achievementData.title}</h4>
                          <p className="text-gray-400 text-sm mb-3">{achievementData.description}</p>
                          <p className="text-yellow-200 text-xs font-semibold">{achievementData.date}</p>
                        </motion.div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          ) : activeTab === 'regalos' ? (
            // Regalos Tab
            <motion.div
              key="regalos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">Tus Regalos Especiales</h2>
              <p className="text-gray-400 text-sm sm:text-base mb-8">Interacciones creadas especialmente para ti</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {gifts.map((gift, index) => (
                  <motion.div
                    key={gift.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    onClick={() => {
                      if (gift.disabled) return;
                      if (gift.id === 'galaxy') {
                        setActiveGift('galaxy');
                      }
                    }}
                    className={`group cursor-pointer relative overflow-hidden rounded-2xl transition-all duration-300
                      ${!gift.disabled ? 'hover:shadow-2xl active:scale-95' : 'opacity-50 cursor-not-allowed'}`}
                  >
                    {/* Gradient Border Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${gift.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                    {/* Card */}
                    <div className={`relative backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 
                      ${gift.bgColor} transition-all duration-300 h-full flex flex-col justify-between min-h-[280px]`}
                    >
                      {/* Top - Icon */}
                      <div className="text-5xl sm:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {gift.icon}
                      </div>

                      {/* Middle - Text */}
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors duration-300">
                          {gift.title}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm">{gift.description}</p>
                      </div>

                      {/* Bottom - CTA */}
                      <div className="flex items-center gap-2 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
                        <span className="text-xs sm:text-sm font-semibold text-pink-300 group-hover:text-pink-200">
                          {gift.disabled ? 'Próximamente' : 'Abrir'}
                        </span>
                        {!gift.disabled && (
                          <motion.span
                            className="text-lg"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : activeTab === 'chat' ? (
            // Chat Tab
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)]"
            >
              <MiaChat />
            </motion.div>
          ) : (
            // Mini Games Tab
            <MiniGamesScreen onBack={() => setActiveTab('mini-games')} />
          )}
        </AnimatePresence>
      </div>

      {/* Dev Tools Button - hidden in corner */}
      <button
        onClick={() => {
          if (adminMode) {
            setShowDevTools(!showDevTools);
          } else {
            setShowAdminPassword(true);
          }
        }}
        className="fixed bottom-4 right-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white/30 hover:text-white/60 text-xs flex items-center justify-center transition-all z-50 cursor-pointer"
        title="Dev Tools"
      >
        ⚙️
      </button>

      {/* Dev Tools Panel */}
      {showDevTools && adminMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-16 right-4 bg-gradient-to-b from-black/90 to-purple-950/80 backdrop-blur-md border border-purple-500/50 rounded-lg p-4 z-40 min-w-[280px] shadow-xl"
        >
          <div className="mb-4 pb-3 border-b border-purple-500/30">
            <h4 className="text-purple-300 font-bold text-sm mb-1">🔧 Panel de Administrador</h4>
            <p className="text-purple-200 text-xs">Este apartado es para programadores únicamente</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-gray-400 text-xs block mb-1">Cambiar Fecha (test)</label>
              <input
                type="date"
                onChange={(e) => handleSetTestDate(e.target.value)}
                className="w-full bg-black/50 border border-purple-500/30 rounded px-2 py-1 text-xs text-purple-300"
              />
            </div>
            <button
              onClick={() => handleSetTestDate('')}
              className="w-full px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs rounded transition-all"
            >
              Resetear fecha
            </button>
            <button
              onClick={handleResetAchievements}
              className="w-full px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs rounded transition-all"
            >
              Resetear Achievements
            </button>
            <button
              onClick={handleAdminLogout}
              className="w-full px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs rounded transition-all font-semibold"
            >
              Cerrar Sesión Admin
            </button>
          </div>
        </motion.div>
      )}

      {/* Admin Password Modal */}
      <AnimatePresence>
        {showAdminPassword && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowAdminPassword(false);
                setAdminPassword('');
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            >
              <div className="bg-gradient-to-br from-purple-950 via-black to-black border border-purple-500/50 rounded-lg p-6 shadow-2xl w-[90vw] max-w-sm">
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                  🔐 Acceso de Programador
                </h2>
                <p className="text-purple-200 text-sm mb-4">
                  Este apartado es para programadores únicamente
                </p>
                
                <div className="mb-4">
                  <label className="text-purple-300 text-xs block mb-2">Contraseña:</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAdminPasswordSubmit();
                      }
                    }}
                    placeholder="Ingresa la contraseña"
                    className="w-full px-3 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-purple-300 placeholder-purple-500/50 focus:outline-none focus:border-purple-400 text-sm"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAdminPasswordSubmit}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold rounded-lg transition-all text-sm"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => {
                      setShowAdminPassword(false);
                      setAdminPassword('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg transition-all text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mia Memorial Modal */}
      <AnimatePresence>
        {showMiaMemorial && (
          <MiaMemorial 
            onClose={() => setShowMiaMemorial(false)}
            onUnlockAchievement={handleUnlockAchievement}
          />
        )}
      </AnimatePresence>

      {/* Mia Photo Modal */}
      <MiaPhotoModal 
        isOpen={showMiaPhoto}
        onClose={() => setShowMiaPhoto(false)}
        photoUrl="https://files.catbox.moe/n4vjff.jpg"
      />
    </div>
  );
};
