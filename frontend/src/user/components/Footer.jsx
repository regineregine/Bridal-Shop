import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white text-center text-pink-950 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)] py-4 sm:py-5">
      <div className="animate-glow-slow px-4 align-middle text-xs sm:text-sm md:text-base">
        © 2025{' '}
        <span className="font-GreatVibes align-middle text-lg sm:text-xl md:text-2xl text-pink-900">
          Pro
        </span>
        <span className="font-GreatVibes text-lg sm:text-xl md:text-2xl text-pink-300">
          mise
        </span>{' '}
        | Designed for loving couple
      </div>
    </footer>
  );
}
