import React from 'react';

const Logo = ({ className = '', showText = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-14'
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        className={sizeClasses[size]}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wearifyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8BBD0" />
            <stop offset="50%" stopColor="#E91E63" />
            <stop offset="100%" stopColor="#D81B60" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Stylized W — hanger/ribbon shape */}
        <path
          d="M15 35 L35 75 L50 50 L65 75 L85 35"
          stroke="url(#wearifyGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />
        {/* Hanger hook */}
        <path
          d="M50 20 C50 10, 60 10, 60 15 C60 20, 50 20, 50 25 L50 35"
          stroke="url(#wearifyGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {showText && (
        <span
          className={`font-black uppercase tracking-tight ${textClasses[size]}`}
          style={{ fontFamily: 'Poppins, sans-serif', color: '#1F1F1F' }}
        >
          Wear<span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #E91E63, #D81B60)' }}
          >ify</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
