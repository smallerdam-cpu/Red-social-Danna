import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ref, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../config/firebase';

interface SignUpScreenProps {
  onSignUpSuccess: (username: string) => void;
  onBackToLogin: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUpSuccess, onBackToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (username.length < 3) {
      setError('El usuario debe tener al menos 3 caracteres');
      return;
    }
    if (!validateEmail(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      // Verificar si el usuario ya existe (con timeout agresivo)
      const usersRef = ref(database, 'users');
      const usernameQuery = query(usersRef, orderByChild('username'), equalTo(username));
      
      const checkPromise = get(usernameQuery);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      );

      let snapshot;
      try {
        snapshot = await Promise.race([checkPromise, timeoutPromise]);
        
        if ((snapshot as any).exists?.() || ((snapshot as any).val && Object.values((snapshot as any).val() || {}).some((u: any) => u.username === username))) {
          setError('Este usuario ya está registrado');
          setIsLoading(false);
          return;
        }
      } catch (err) {
        // Si timeout, continuar de todas formas (mejor UX)
        // El servidor rechazará si el usuario ya existe
      }

      // Crear nuevo usuario en Firebase
      const newUserRef = ref(database, `users/${Date.now()}`);
      await set(newUserRef, {
        username: username,
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
        avatar: '👤'
      });

      setSuccess(true);
      setTimeout(() => {
        onSignUpSuccess(username);
      }, 500); // Auto-login rápido
    } catch (err) {
      setError('Error al crear la cuenta. Intenta de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-screen min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center overflow-hidden relative p-4 sm:p-0">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="z-10 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            ✨
          </motion.div>
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text mb-2">
            ¡Bienvenida!
          </h1>
          <p className="text-pink-300 text-sm">Tu cuenta ha sido creada exitosamente</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center overflow-hidden relative p-4 sm:p-0">
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
          <div className="text-4xl sm:text-5xl mb-4">🎁</div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Crear Cuenta
          </h1>
          <p className="text-pink-300/60 text-xs sm:text-sm">Únete a nuestra galaxia especial</p>
        </motion.div>

        {/* Sign Up Form */}
        <motion.form
          onSubmit={handleSignUp}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10
            hover:border-pink-500/30 transition-all duration-300 shadow-2xl space-y-4 sm:space-y-5">
            
            {/* Username Input */}
            <div>
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
                placeholder="Tu usuario único"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 sm:py-2.5 text-base sm:text-sm text-white
                  placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20
                  transition-all duration-200"
                disabled={isLoading}
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-pink-200 text-xs sm:text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="tu@email.com"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 sm:py-2.5 text-base sm:text-sm text-white
                  placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20
                  transition-all duration-200"
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div>
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

            {/* Confirm Password Input */}
            <div>
              <label className="block text-pink-200 text-xs sm:text-sm font-semibold mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
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
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs sm:text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !username || !email || !password || !confirmPassword}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600
                disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-2.5 rounded-lg text-base sm:text-sm
                transition-all duration-200 shadow-lg hover:shadow-xl touch-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando cuenta...
                </span>
              ) : (
                'Crear Cuenta'
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* Back to Login */}
        <motion.div
          className="text-center mt-6 sm:mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-pink-300/60 text-xs sm:text-sm mb-3">
            ¿Ya tienes cuenta?
          </p>
          <button
            onClick={onBackToLogin}
            disabled={isLoading}
            className="text-pink-400 hover:text-pink-300 text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50"
          >
            Ingresar aquí
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
