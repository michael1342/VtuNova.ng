import React from 'react';
import type { NetworkIconProps } from '../interface/components.interface';

export const MtnLogo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="50" fill="#FFCC00" />
    <ellipse cx="50" cy="50" rx="36" ry="22" fill="#FFCC00" stroke="#000000" strokeWidth="6" />
    <text
      x="50"
      y="57"
      fontSize="21"
      fontWeight="900"
      fontFamily="'Space Grotesk', system-ui, -apple-system, sans-serif"
      fill="#000000"
      textAnchor="middle"
      letterSpacing="0.5"
    >
      MTN
    </text>
  </svg>
);

export const AirtelLogo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="50" fill="#ED1C24" />
    <path
      d="M 28 64 C 26 34, 52 24, 68 32 C 78 40, 74 58, 58 56 C 46 54, 42 45, 50 40 C 58 35, 68 42, 64 50 C 62 55, 55 56, 50 56"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="50"
      y="77"
      fontSize="13"
      fontWeight="800"
      fontFamily="system-ui, -apple-system, sans-serif"
      fill="#FFFFFF"
      textAnchor="middle"
      letterSpacing="-0.3"
    >
      airtel
    </text>
  </svg>
);

export const GloLogo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="50" fill="#00A859" />
    <circle cx="73" cy="36" r="6.5" fill="#84CC16" />
    <text
      x="46"
      y="62"
      fontSize="36"
      fontWeight="900"
      fontFamily="'Space Grotesk', system-ui, -apple-system, sans-serif"
      fill="#FFFFFF"
      textAnchor="middle"
      letterSpacing="-2"
    >
      glo
    </text>
  </svg>
);

export const NineMobileLogo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="50" fill="#005F36" />
    <path
      d="M 52 28 C 36 28, 32 42, 42 52 C 52 62, 58 50, 54 42 C 50 34, 38 38, 38 46 C 38 66, 52 72, 62 72"
      fill="none"
      stroke="#8DC63F"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <text
      x="50"
      y="80"
      fontSize="11"
      fontWeight="800"
      fontFamily="system-ui, -apple-system, sans-serif"
      fill="#FFFFFF"
      textAnchor="middle"
      letterSpacing="-0.2"
    >
      9mobile
    </text>
  </svg>
);

export const NetworkIcon: React.FC<NetworkIconProps> = ({
  networkId,
  size = 'md',
  className = '',
  showBorder = false,
}) => {
  const normalizedId = (networkId || '').toLowerCase().trim();

  const sizeClasses = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;
  const borderClass = showBorder ? 'ring-2 ring-white/20 shadow-md' : '';

  const renderLogo = () => {
    if (normalizedId.includes('mtn')) {
      return <MtnLogo />;
    }
    if (normalizedId.includes('airtel') || normalizedId === 'air') {
      return <AirtelLogo />;
    }
    if (normalizedId.includes('glo')) {
      return <GloLogo />;
    }
    if (normalizedId.includes('9mobile') || normalizedId.includes('etisalat') || normalizedId === '9m') {
      return <NineMobileLogo />;
    }
    // Fallback default icon
    return (
      <div className="w-full h-full rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-xs border border-blue-500/40">
        {(networkId || '?').substring(0, 2).toUpperCase()}
      </div>
    );
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden transition-transform duration-200 ${currentSize} ${borderClass} ${className}`}
    >
      {renderLogo()}
    </div>
  );
};

export default NetworkIcon;
