import React from 'react';
import bg1 from '../../assets/img/bg10.png';

export default function Hero({ title, highlight, subtitle, extraClass = '' }) {
  return (
    <header
      className="pl-80 py-10 relative overflow-hidden bg-linear-to-b from-candy-cream via-candy-pink-light to-candy-lavender-light text-center min-h-80 sm:min-h-[420px] md:min-h-[520px]"
      style={{
        backgroundImage: `url(${bg1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="absolute inset-0 bg-linear-to-b from-candy-cream/80 via-candy-pink-light/70 to-candy-lavender-light/80"></div>
      <div className={`relative z-10 mx-auto max-w-4xl px-4 py-20 sm:max-w-5xl sm:py-28 md:py-32 ${extraClass}`}>
        <h1 className="font-Tinos text-center leading-none tracking-widest animate-glow text-4xl text-pink-300 sm:text-5xl md:text-7xl">
          {title}
          <span className="text-pink-600">{highlight}</span>
        </h1>
        {subtitle && (
          <p className="pt-20 font-Tinos mt-4 text-base text-white sm:text-lg md:text-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
