import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* The thick '1' shape */}
      <path d="M3 10 H15 V26 H9 V16 H3 V10 Z" fill="white" />
      {/* The circle / dot */}
      <circle cx="21" cy="13" r="3.5" fill="white" />
      {/* The thick slash */}
      <path d="M22 26 L27 10 H32 L27 26 Z" fill="white" />
    </svg>
  );
};

export default Logo;
