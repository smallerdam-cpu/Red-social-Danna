import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../config/firebase';

interface LoginScreenProps {
  onLogin: (username: string) => void;
  onCreateAccount: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onCreateAccount }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Credenciales de respaldo (demo)
  const DEMO_USERNAME = 'admin';
  const DEMO_PASSWORD = '1998';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Chequear demo primero (instantáneo)
      if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
        onLogin(username);
        return;
      }

      // Si no es demo, consultar Firebase
      const usersRef = ref(database, 'users');
      const usernameQuery = query(usersRef, orderByChild('username'), equalTo(username));
      
      // Timeout de 5 segundos para Firebase
      const firebasePromise = get(usernameQuery);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firebase timeout')), 5000)
      );

      let snapshot;
      try {
        snapshot = await Promise.race([firebasePromise, timeoutPromise]);
      } catch (err) {
        setError('Error de conexión. Intenta de nuevo.');
        setPassword('');
        setIsLoading(false);
        return;
      }

      if ((snapshot as any).exists?.()) {
        const userData = Object.values((snapshot as any).val())[0] as any;
        if (userData.password === password) {
          onLogin(username);
        } else {
          setError('Usuario o contraseña incorrectos');
          setPassword('');
        }
      } else {
        setError('Usuario o contraseña incorrectos');
        setPassword('');
      }
    } catch (err) {
      setError('Error al conectar. Intenta de nuevo.');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center overflow-hidden relative p-4 sm:p-0">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        {/* Logo/Title */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-4xl sm:text-5xl mb-4">✨</div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Red Social
          </h1>
          <p className="text-pink-300/60 text-xs sm:text-sm">Un espacio especial para ti</p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          onSubmit={handleLogin}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10
            hover:border-pink-500/30 transition-all duration-300 shadow-2xl">
            
            {/* Username Input */}
            <div className="mb-5 sm:mb-6">
              <label className="block text-pink-200 text-xs sm:text-sm font-semibold mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Ej: danna"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 sm:py-2.5 text-base sm:text-sm text-white
                  placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20
                  transition-all duration-200"
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div className="mb-4 sm:mb-2">
              <label className="block text-pink-200 text-xs sm:text-sm font-semibold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 sm:py-2.5 text-base sm:text-sm text-white
                  placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20
                  transition-all duration-200"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs sm:text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !username || !password}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600
                disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-2.5 rounded-lg text-base sm:text-sm
                transition-all duration-200 shadow-lg hover:shadow-xl touch-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </span>
              ) : (
                'Ingresar'
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* Footer Hint */}
        <motion.div
          className="text-center mt-6 sm:mt-8 text-xs sm:text-sm text-pink-300/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="mb-4">💝 Acceso exclusivo</p>
          <button
            onClick={onCreateAccount}
            className="text-pink-400 hover:text-pink-300 font-semibold transition-colors duration-200 underline"
          >
            ¿No tienes cuenta? Crear aquí
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
