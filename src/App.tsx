import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { Dashboard } from './components/Dashboard';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    setIsAuthenticated(true);
  };

  const handleSignUpSuccess = (username: string) => {
    setShowSignUp(false);
    handleLogin(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-black font-sans">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          showSignUp ? (
            <SignUpScreen key="signup" onSignUpSuccess={handleSignUpSuccess} onBackToLogin={() => setShowSignUp(false)} />
          ) : (
            <LoginScreen key="login" onLogin={handleLogin} onCreateAccount={() => setShowSignUp(true)} />
          )
        ) : (
          <Dashboard key="dashboard" username={currentUser} onLogout={handleLogout} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;