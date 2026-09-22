import type { CSSProperties, ElementType, ReactNode } from 'react';

export interface ProtectedRouteProps {
  allowedRoles: string[];
  children: ReactNode;
}

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  collapsed?: boolean;
}

export interface NetworkIconProps {
  networkId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

export interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
  activeIcon: ReactNode;
  category?: string;
}

export interface TopbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  delay?: number;
}

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

export type RevealAnimation = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out' | 'flip-up';

export interface ScrollRevealProps {
  children: ReactNode;
  animation?: RevealAnimation;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
  once?: boolean;
}
