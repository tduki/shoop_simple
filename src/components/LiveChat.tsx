'use client';

import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, ChatBubbleLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import toast from 'react-hot-toast';

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

const predefinedResponses = [
  "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
  "Nous proposons un échange sous 30 jours pour tout article non porté.",
  "La livraison est gratuite à partir de 100€ d'achat.",
  "Nos articles sont authentiques et garantis.",
  "Vous pouvez suivre votre commande dans votre espace client.",
  "Nous avons bien reçu votre message et y répondrons dans les plus brefs délais.",
  "Merci pour votre question. Les tailles sont conformes aux standards européens.",
  "Votre satisfaction est notre priorité !",
];

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Simuler un premier message de bienvenue
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Bonjour ! Je suis Léa, votre assistante virtuelle. Comment puis-je vous aider aujourd'hui ?",
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);
  
  // Faire défiler vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Simuler une réponse automatique
  const simulateResponse = (userMessage: string) => {
    setIsTyping(true);
    
    // Délai aléatoire pour simuler la frappe
    setTimeout(() => {
      // Choisir une réponse aléatoire parmi les réponses prédéfinies
      const randomIndex = Math.floor(Math.random() * predefinedResponses.length);
      const responseText = predefinedResponses[randomIndex];
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: responseText,
          isUser: false,
          timestamp: new Date()
        }
      ]);
      
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Délai entre 1.5 et 2.5 secondes
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Ajouter le message de l'utilisateur
    const userMessage = {
      id: Date.now(),
      text: newMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simuler une réponse
    simulateResponse(newMessage);
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      toast.success('Service client connecté');
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Bouton chat */}
      <button
        onClick={toggleChat}
        className="fixed bottom-8 right-8 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
        aria-label="Chat avec le service client"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftIcon className="h-6 w-6" />
        )}
      </button>
      
      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 z-50 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out transform">
          {/* Entête */}
          <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 relative mr-2">
                <Image 
                  src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=200&auto=format&fit=crop" 
                  alt="Support Agent" 
                  fill 
                  className="rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-white"></span>
              </div>
              <div>
                <h3 className="font-semibold">Service Client</h3>
                <p className="text-xs opacity-75">En ligne</p>
              </div>
            </div>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[75%] rounded-lg px-4 py-2 shadow-sm ${
                    message.isUser 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p>{message.text}</p>
                  <span className={`text-xs block mt-1 ${message.isUser ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white text-gray-800 rounded-lg rounded-bl-none px-4 py-2 shadow-sm max-w-[75%]">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Formulaire */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex">
            <input
              type="text"
              placeholder="Écrivez votre message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md flex items-center justify-center"
              disabled={!newMessage.trim()}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
} 