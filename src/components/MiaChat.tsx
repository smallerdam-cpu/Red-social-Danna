import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'mia' | 'user';
  text: string;
  timestamp: string;
}

interface ConversationNode {
  miaMessage: string;
  options: Array<{
    text: string;
    response: string;
  }>;
}

const CONVERSATIONS: Record<string, ConversationNode> = {
  start: {
    miaMessage: '¡Hola Paola! 😺 Soy Mía, tu gatita. ¿Cómo estás hoy?',
    options: [
      { text: '¡Hola Mía! Estoy bien 💕', response: 'Me encanta verte feliz. Eres la mejor 😻' },
      { text: 'Extraño tus ronroneos 🐱', response: 'Yo también te extraño mucho... Siempre estaré en tu corazón 💚' },
      { text: 'Hoy fue un día difícil', response: 'No te preocupes, estoy aquí para darte amor y compañía 🤍' },
    ],
  },
  chat2: {
    miaMessage: '¿Recuerdas cuando jugábamos juntas? 🎾',
    options: [
      { text: 'Claro, ¡eras muy traviesa! 😸', response: 'Jajaja, sí lo era. Esos fueron mis mejores días contigo 💛' },
      { text: 'Extraño esos momentos', response: 'Esos momentos siempre vivirán en nuestros corazones 🌟' },
      { text: 'Eras la gatita más linda', response: 'Gracias por darme tanto amor. Eres la mejor mamá 😻💚' },
    ],
  },
  chat3: {
    miaMessage: '¿Me prometes que siempre me recordarás? 💭',
    options: [
      { text: 'Prometo recordarte siempre ✨', response: 'Eso me hace muy feliz. Te amo infinito 💚' },
      { text: 'Nunca te olvidaré, Mía 🫂', response: 'Gracias por todo el amor que me diste. Fuiste lo mejor de mi vida 🐱💕' },
      { text: 'Estás en mi corazón para siempre', response: 'Y tú en el mío. Siempre juntas 💫' },
    ],
  },
};

export function MiaChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentNode, setCurrentNode] = useState<string>('start');
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Iniciar chat con primer mensaje de Mía
    if (messages.length === 0) {
      setTimeout(() => {
        const firstMessage: Message = {
          id: '1',
          sender: 'mia',
          text: CONVERSATIONS.start.miaMessage,
          timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([firstMessage]);
      }, 500);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleOptionClick = async (option: { text: string; response: string }) => {
    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: option.text,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowOptions(false);
    setIsTyping(true);

    // Simular que Mía está escribiendo
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Agregar respuesta de Mía
    const miaMessage: Message = {
      id: `mia-${Date.now()}`,
      sender: 'mia',
      text: option.response,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, miaMessage]);
    setIsTyping(false);

    // Cambiar a siguiente nodo de conversación
    const nextNode = Object.keys(CONVERSATIONS).find((key) => key !== currentNode);
    if (nextNode) {
      setCurrentNode(nextNode);

      // Mostrar siguiente mensaje de Mía después de un tiempo
      setTimeout(() => {
        const nextMiaMessage: Message = {
          id: `mia-${Date.now() + 1}`,
          sender: 'mia',
          text: CONVERSATIONS[nextNode].miaMessage,
          timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, nextMiaMessage]);
        setShowOptions(true);
      }, 1500);
    } else {
      setShowOptions(true);
    }
  };

  const currentConversation = CONVERSATIONS[currentNode];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-black/50 to-purple-900/10">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-pink-950/40 to-purple-950/40 border-b border-pink-500/30 p-4 flex items-center gap-3">
        <div className="text-3xl">🐱</div>
        <div>
          <h3 className="text-pink-300 font-bold">Mía 💚</h3>
          <p className="text-gray-400 text-xs">En memoria de nuestra gatita</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-black/20">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.sender === 'mia' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === 'mia'
                    ? 'bg-gray-700 text-gray-100 rounded-bl-none'
                    : 'bg-pink-600 text-white rounded-br-none'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-gray-700 px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-1">
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 bg-gray-400 rounded-full"
              />
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                className="w-2 h-2 bg-gray-400 rounded-full"
              />
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-gray-400 rounded-full"
              />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Options Area */}
      {showOptions && !isTyping && currentConversation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 border-t border-pink-500/30 p-4 space-y-2"
        >
          <p className="text-xs text-gray-400 mb-3">Elige tu respuesta:</p>
          {currentConversation.options.map((option, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOptionClick(option)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-purple-600/60 to-pink-600/60 hover:from-purple-500/80 hover:to-pink-500/80 text-pink-100 border border-pink-500/50 transition-all text-left"
            >
              💬 {option.text}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
