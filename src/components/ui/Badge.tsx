// import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  ping?: boolean;
  count?: number;
  maxCount?: number;
  ring?: boolean;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  dot = false,
  ping = false,
  count,
  maxCount = 99,
  ring = false,
  children,
  className = '',
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-blue-500 text-white shadow-sm shadow-blue-500/30',
    secondary: 'bg-bg-card border border-border text-text-gray',
    success: 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30',
    danger: 'bg-rose-500 text-white shadow-sm shadow-rose-500/30',
    warning: 'bg-amber-500 text-white shadow-sm shadow-amber-500/30',
    info: 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30',
    outline: 'border border-blue-500/40 text-blue-400 bg-blue-500/10',
  };

  const sizeStyles = {
    sm: 'text-[9px] px-1.5 py-0.5 rounded-full font-bold min-w-[16px] h-4 flex items-center justify-center',
    md: 'text-[10px] px-2 py-0.5 rounded-full font-bold min-w-[20px] h-5 flex items-center justify-center',
    lg: 'text-xs px-2.5 py-1 rounded-full font-bold min-w-[24px] h-6 flex items-center justify-center',
  };

  const dotSizeStyles = {
    sm: 'w-2 h-2 rounded-full inline-block',
    md: 'w-2.5 h-2.5 rounded-full inline-block',
    lg: 'w-3 h-3 rounded-full inline-block',
  };

  let displayValue = children;
  if (typeof count === 'number') {
    if (count <= 0 && !dot) return null;
    displayValue = count > maxCount ? `${maxCount}+` : count;
  }

  const ringStyle = ring ? 'ring-2 ring-bg-dark-secondary' : '';

  if (dot) {
    return (
      <span className={`relative inline-flex shrink-0 ${className}`} {...props}>
        {ping && (
          <span className={`absolute inset-0 rounded-full animate-ping opacity-75 ${variantStyles[variant].split(' ')[0]}`} />
        )}
        <span className={`${dotSizeStyles[size]} ${variantStyles[variant]} ${ringStyle}`} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center font-mono leading-none tracking-tight select-none transition-all ${sizeStyles[size]} ${variantStyles[variant]} ${ringStyle} ${className}`}
      {...props}
    >
      {ping && (
        <span className={`absolute -inset-0.5 rounded-full animate-ping opacity-40 ${variantStyles[variant].split(' ')[0]}`} />
      )}
      {displayValue}
    </span>
  );
};

export default Badge;
