import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GalaxyScreen } from './GalaxyScreen';

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ username, onLogout }) => {
  const [activeScreen, setActiveScreen] = useState<'menu' | 'galaxy' | 'gallery'>('menu');
  const [showBlockedMessage, setShowBlockedMessage] = useState(false);
  const [testDate, setTestDate] = useState<Date | null>(null);
  const [showDevTools, setShowDevTools] = useState(false);

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

  const handleGalaxyClick = () => {
    if (!todayIsSpecial) {
      setShowBlockedMessage(true);
      setTimeout(() => setShowBlockedMessage(false), 4000);
    } else {
      setActiveScreen('galaxy');
    }
  };

  const handleSetTestDate = (dateString: string) => {
    if (dateString) {
      setTestDate(new Date(dateString));
    } else {
      setTestDate(null);
    }
  };

  const menuItems = [
    {
      id: 'galaxy',
      title: '🌌 Mi Galaxia',
      description: 'Universo 3D interactivo',
      icon: '✨',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10 hover:bg-purple-500/20'
    },
    {
      id: 'gallery',
      title: '📱 Galería',
      description: 'Mis fotos y momentos',
      icon: '🖼️',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
      disabled: true
    }
  ];

  if (activeScreen === 'galaxy') {
    return (
      <div className="relative">
        <GalaxyScreen />
        <button
          onClick={() => setActiveScreen('menu')}
          className="fixed top-4 sm:top-6 left-4 sm:left-6 z-40 bg-black/50 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg
            text-pink-300 hover:text-pink-200 text-xs sm:text-sm font-semibold border border-pink-500/30
            hover:border-pink-500/60 transition-all duration-300 touch-none active:scale-95 min-h-[44px] sm:min-h-auto"
        >
          ← Volver
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
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

          <motion.button
            onClick={onLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200
              border border-red-500/30 hover:border-red-500/60 transition-all duration-300 text-xs sm:text-sm font-semibold touch-none"
          >
            Cerrar Sesión
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">Mi Espacio Personal</h2>
          <p className="text-xs sm:text-base text-gray-400">Accede a tus experiencias interactivas personalizadas</p>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              onClick={() => {
                if (item.disabled) return;
                if (item.id === 'galaxy') {
                  handleGalaxyClick();
                } else {
                  setActiveScreen(item.id as 'galaxy' | 'gallery');
                }
              }}
              className={`group cursor-pointer relative overflow-hidden rounded-2xl transition-all duration-300
                ${!item.disabled ? 'hover:shadow-2xl active:scale-95' : 'opacity-50 cursor-not-allowed'}`}
            >
              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              {/* Card */}
              <div className={`relative backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 
                ${item.bgColor} transition-all duration-300 h-full flex flex-col justify-between`}
              >
                {/* Top - Icon */}
                <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>

                {/* Middle - Text */}
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-pink-300 transition-colors duration-300">
                    {item.title}
                  </h3>
                  {item.id === 'galaxy' && !todayIsSpecial ? (
                    <div className="text-center py-2">
                      <p className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                        {daysUntilBirthday()}
                      </p>
                      <p className="text-pink-300 text-xs sm:text-sm font-semibold mt-1">días</p>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-xs sm:text-sm">{item.description}</p>
                  )}
                </div>

                {/* Bottom - CTA */}
                <div className="flex items-center gap-2 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
                  <span className="text-xs sm:text-sm font-semibold text-pink-300 group-hover:text-pink-200">
                    {item.disabled ? 'Próximamente' : 'Ingresar'}
                  </span>
                  {!item.disabled && (
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

        {/* Blocked Message Toast */}
        {showBlockedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-pink-500/90 to-purple-500/90 backdrop-blur-xl rounded-2xl px-6 sm:px-8 py-4 sm:py-5 border border-pink-400/50 shadow-2xl max-w-md">
              <p className="text-white text-center font-semibold text-sm sm:text-base">
                🔐 Este apartado estará disponible el <span className="text-yellow-200">9 de Abril</span>
              </p>
              <p className="text-white/80 text-center text-xs sm:text-sm mt-2">
                ¡Una sorpresa especial te espera ese día! 🎁✨
              </p>
            </div>
          </motion.div>
        )}

        {/* Dev Tools Button - hidden in corner */}
        <button
          onClick={() => setShowDevTools(!showDevTools)}
          className="fixed bottom-4 right-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white/30 hover:text-white/60 text-xs flex items-center justify-center transition-all"
          title="Dev Tools"
        >
          ⚙️
        </button>

        {/* Dev Tools Panel */}
        {showDevTools && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-16 right-4 z-40 bg-black/90 backdrop-blur-xl border border-purple-500/50 rounded-xl p-4 min-w-64"
          >
            <p className="text-white font-bold text-sm mb-3">🛠️ Dev Tools</p>
            <p className="text-gray-300 text-xs mb-2">Cambiar fecha de prueba:</p>
            <input
              type="date"
              defaultValue={testDate?.toISOString().split('T')[0]}
              onChange={(e) => handleSetTestDate(e.target.value)}
              className="w-full px-2 py-1 rounded text-sm bg-white/10 border border-purple-500/30 text-white mb-2"
            />
            <button
              onClick={() => {
                setTestDate(null);
              }}
              className="w-full px-2 py-1 rounded text-xs bg-purple-500/30 hover:bg-purple-500/50 text-purple-200 transition-all"
            >
              Restaurar fecha actual
            </button>
            <p className="text-gray-400 text-xs mt-3">
              Fecha: {(testDate || new Date()).toLocaleDateString('es-ES')}
            </p>
            {todayIsSpecial && (
              <p className="text-green-400 text-xs mt-2 font-semibold">✓ ¡Es el cumpleaños!</p>
            )}
          </motion.div>
        )}

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 sm:mt-16 p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10 text-center"
        >
          <p className="text-gray-400 text-xs sm:text-sm">
            🚀 Pronto: Más experiencias interactivas personalizadas para ti
          </p>
        </motion.div>
      </div>
    </div>
  );
};
