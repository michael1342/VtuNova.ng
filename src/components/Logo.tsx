import React from 'react';
import compactLogo from '../assets/img/new.png';
import type { LogoProps } from '../interface/components.interface';

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  collapsed = false,
}) => {
  // Size variants
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-[18px] leading-5',
    md: 'text-[24px] leading-6',
    lg: 'text-[28px] leading-7',
    xl: 'text-[32px] leading-8',
  };

  const taglineSizes = {
    sm: 'text-[6px] tracking-[1.5px]',
    md: 'text-[7px] tracking-[2px]',
    lg: 'text-[8px] tracking-[2.5px]',
    xl: 'text-[9px] tracking-[3px]',
  };

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={compactLogo}
        alt="VtuNova"
        className={`${iconSizes[size]} object-contain shrink-0`}
      />

      <div
        className={`overflow-hidden transition-all duration-300 ${
          collapsed ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100 ml-2.5'
        }`}
      >
        {/* Brand Name */}
        <p className={`font-medium tracking-tight whitespace-nowrap ${textSizes[size]}`}>
          <span className="text-slate-900 dark:text-white">Vtu</span>
          <span className="text-blue-600 dark:text-blue-500">Nova</span>
        </p>

        {/* Tagline */}
        {showTagline && (
          <p
            className={`font-bold whitespace-nowrap leading-3 text-slate-500 dark:text-white/70 ${taglineSizes[size]}`}
          >
            TOP UP. PAY FAST. LIVE SMART.
          </p>
        )}
      </div>
    </div>
  );
};

export default Logo;
