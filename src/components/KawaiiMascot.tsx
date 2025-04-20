
import React from 'react';
import { cn } from '@/lib/utils';

interface KawaiiMascotProps {
  mood?: 'happy' | 'sad' | 'excited' | 'sleeping';
  className?: string;
}

const KawaiiMascot: React.FC<KawaiiMascotProps> = ({ 
  mood = 'happy',
  className
}) => {
  return (
    <div className={cn("relative w-24 h-24", className)}>
      {/* Bunny face */}
      <div className="absolute inset-0 bg-white rounded-full shadow-md"></div>
      
      {/* Bunny ears */}
      <div className="absolute -top-14 left-2 w-6 h-14 bg-white rounded-full transform rotate-[-10deg]"></div>
      <div className="absolute -top-14 right-2 w-6 h-14 bg-white rounded-full transform rotate-[10deg]"></div>
      
      {/* Inner ears */}
      <div className="absolute -top-12 left-3 w-4 h-10 bg-kawaii-pink rounded-full transform rotate-[-10deg] opacity-60"></div>
      <div className="absolute -top-12 right-3 w-4 h-10 bg-kawaii-pink rounded-full transform rotate-[10deg] opacity-60"></div>
      
      {/* Blush */}
      <div className="absolute top-12 left-4 w-3 h-2 bg-kawaii-pink rounded-full opacity-50"></div>
      <div className="absolute top-12 right-4 w-3 h-2 bg-kawaii-pink rounded-full opacity-50"></div>
      
      {/* Eyes */}
      {mood === 'happy' && (
        <>
          <div className="absolute top-8 left-7 w-2 h-3 bg-black rounded-full"></div>
          <div className="absolute top-8 right-7 w-2 h-3 bg-black rounded-full"></div>
        </>
      )}
      
      {mood === 'excited' && (
        <>
          <div className="absolute top-8 left-7 w-2 h-3 bg-black rounded-full animate-bounce"></div>
          <div className="absolute top-8 right-7 w-2 h-3 bg-black rounded-full animate-bounce"></div>
        </>
      )}
      
      {mood === 'sleeping' && (
        <>
          <div className="absolute top-9 left-7 w-2 h-0.5 bg-black rounded-full"></div>
          <div className="absolute top-9 right-7 w-2 h-0.5 bg-black rounded-full"></div>
        </>
      )}
      
      {mood === 'sad' && (
        <>
          <div className="absolute top-9 left-7 w-2 h-2 bg-black rounded-full"></div>
          <div className="absolute top-9 right-7 w-2 h-2 bg-black rounded-full"></div>
          <div className="absolute top-11 left-[45%] w-2 h-0.5 bg-black rounded-full transform rotate-[20deg]"></div>
        </>
      )}
      
      {/* Mouth */}
      {mood === 'happy' && (
        <div className="absolute top-12 left-[45%] w-3 h-1.5 bg-black rounded-full"></div>
      )}
      
      {mood === 'excited' && (
        <div className="absolute top-12 left-[42%] w-4 h-2 bg-black rounded-full"></div>
      )}
      
      {mood === 'sleeping' && (
        <div className="absolute top-12 left-[45%] w-3 h-0.5 bg-black rounded-full"></div>
      )}
      
      {/* Small decorative elements */}
      <div className="absolute -top-2 left-10 w-1 h-1 bg-kawaii-pink rounded-full animate-bounce-slow"></div>
      <div className="absolute -top-4 right-8 w-1.5 h-1.5 bg-kawaii-lavender rounded-full animate-bounce-slow" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-2 right-2 w-1 h-1 bg-kawaii-mint rounded-full animate-bounce-slow" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default KawaiiMascot;
