"use client";

import { useState } from 'react';
import { useToast } from './ToastProvider';
import Confetti from './Confetti';

export default function FunInteractives() {
  const { showFunToast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const funMessages = [
    "🎵 Sorry, this feature is still warming up backstage!",
    "🏟️ The stadium doors aren't open yet, but they will be soon!",
    "🎪 This button is still practicing for the big show!",
    "🚀 Feature loading... estimated arrival: when it's ready!",
    "🎭 Coming soon to a screen near you!",
    "🍕 This button is out getting pizza. Try again later!",
    "🦄 This feature is as mythical as a unicorn... for now!",
    "🎨 Still putting the finishing touches on this masterpiece!"
  ];


  const handleComingSoonClick = () => {
    const message = funMessages[Math.floor(Math.random() * funMessages.length)];
    showFunToast(message);
    
    setClickCount(prev => prev + 1);
    
    if (clickCount === 4) {
      showFunToast("🤔 You're really persistent! I like that!");
    } else if (clickCount === 9) {
      showFunToast("🤪 Okay, you win the persistence award! 🏆");
      setShowConfetti(true);
    }
  };


  return (
    <>
      <Confetti 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      {/* Fun floating button */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={handleComingSoonClick}
          className="w-12 h-12 rounded-full transition-all duration-300 transform bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-110 hover:rotate-12 text-white font-bold text-lg shadow-lg hover:shadow-xl"
          title="Click me for surprises!"
        >
          ?
        </button>
      </div>

      {/* Hidden trigger for form submission celebration */}
      <div className="hidden" data-celebrate-form="true"></div>
    </>
  );
}