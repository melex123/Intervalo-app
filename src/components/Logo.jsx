import React from 'react';

const Logo = ({ size = 'default' }) => {
  const height = size === 'small' ? 32 : 48;

  return (
    <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: size === 'small' ? 10 : 14 }}>
      <svg
        width={height * 0.75}
        height={height}
        viewBox="0 0 36 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="4" width="7" height="40" rx="3.5" fill="var(--color-accent, #c5e500)" />
        <polygon points="18,10 18,38 34,24" fill="var(--color-accent, #c5e500)" />
      </svg>
      <span
        style={{
          fontSize: size === 'small' ? 20 : 28,
          fontWeight: 800,
          letterSpacing: size === 'small' ? 2 : 3,
          color: 'var(--color-text, #ffffff)',
          fontFamily: "'Avenir Next', 'Nunito Sans', sans-serif",
        }}
      >
        INTERVALO
      </span>
    </div>
  );
};

export default Logo;
