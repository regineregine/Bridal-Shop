import React from 'react';
import bg1 from '../../assets/img/bg10.png';

export default function Hero({ title, highlight, subtitle, extraClass = '' }) {
  return (
    <header
      className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-linear-to-b from-candy-cream via-candy-pink-light to-candy-lavender-light text-center min-h-64 sm:min-h-80 md:min-h-[420px] lg:min-h-[520px]"
      style={{
        backgroundImage: `url(${bg1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="absolute inset-0 bg-linear-to-b from-candy-cream/80 via-candy-pink-light/70 to-candy-lavender-light/80"></div>
      <div
        className={`relative z-10 mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-28 ${extraClass}`}
      >
        <h1 className="font-Tinos text-center leading-tight tracking-widest animate-glow text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-pink-300">
          {title}
          <span className="text-pink-600">{highlight}</span>
        </h1>
        {subtitle && (
          <p className="pt-6 sm:pt-12 md:pt-16 lg:pt-20 font-Tinos mt-2 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-2xl text-white leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
