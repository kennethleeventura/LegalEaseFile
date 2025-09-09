import React from 'react';

interface GeometricIconProps {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
}

// Enhanced Compass Icon with geometric precision
export const EnhancedCompassIcon: React.FC<GeometricIconProps> = ({ 
  className = "w-16 h-16", 
  color = "#0b7189",
  width = 64,
  height = 64
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 64 64" className={className} fill="none" stroke={color} strokeWidth="2">
    <circle cx="32" cy="32" r="30" fill="none"/>
    <polygon points="32,12 40,32 32,52 24,32" fill="none"/>
    <circle cx="32" cy="32" r="4" fill={color}/>
  </svg>
);

// Enhanced Lighthouse Icon with clean geometric design
export const EnhancedLighthouseIcon: React.FC<GeometricIconProps> = ({ 
  className = "w-16 h-16", 
  color = "#322214",
  width = 64,
  height = 64
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 64 64" className={className} fill="none" stroke={color} strokeWidth="2">
    <rect x="28" y="20" width="8" height="20" fill="none"/>
    <polygon points="32,8 40,20 24,20" fill="none"/>
    <line x1="32" y1="40" x2="32" y2="56" stroke={color}/>
    <circle cx="32" cy="6" r="2" fill={color}/>
  </svg>
);

// Scale of Justice Icon
export const ScaleOfJusticeIcon: React.FC<GeometricIconProps> = ({ 
  className = "w-16 h-16", 
  color = "#92817a",
  width = 64,
  height = 64
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 64 64" className={className} fill="none" stroke={color} strokeWidth="2">
    <line x1="32" y1="8" x2="32" y2="56"/>
    <line x1="16" y1="20" x2="48" y2="20"/>
    <circle cx="16" cy="32" r="6"/>
    <circle cx="48" cy="32" r="6"/>
  </svg>
);

// Document Stack Icon
export const DocumentStackIcon: React.FC<GeometricIconProps> = ({ 
  className = "w-16 h-16", 
  color = "#0f0e0e",
  width = 64,
  height = 64
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 64 64" className={className} fill="none" stroke={color} strokeWidth="2">
    <rect x="14" y="14" width="36" height="36" rx="4"/>
    <line x1="20" y1="24" x2="44" y2="24"/>
    <line x1="20" y1="32" x2="44" y2="32"/>
    <line x1="20" y1="40" x2="36" y2="40"/>
  </svg>
);

// AI Circuit Chip Icon
export const AICircuitChipIcon: React.FC<GeometricIconProps> = ({ 
  className = "w-16 h-16", 
  color = "#0b7189",
  width = 64,
  height = 64
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 64 64" className={className} fill="none" stroke={color} strokeWidth="2">
    <rect x="16" y="16" width="32" height="32" rx="4"/>
    <text x="50%" y="50%" textAnchor="middle" dy=".35em" fontSize="10" fill={color}>AI</text>
    <line x1="32" y1="4" x2="32" y2="16"/>
    <line x1="32" y1="48" x2="32" y2="60"/>
    <line x1="4" y1="32" x2="16" y2="32"/>
    <line x1="48" y1="32" x2="60" y2="32"/>
  </svg>
);

// Wire Element Icon
export const WireElementIcon: React.FC<GeometricIconProps> = ({ 
  className = "w-16 h-16", 
  color = "#0b7189",
  width = 64,
  height = 64
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 64 64" className={className} fill="none" stroke="#fbf5f3" strokeWidth="3">
    <path d="M4 32 C16 12, 48 52, 60 32" stroke={color}/>
    <circle cx="4" cy="32" r="3" fill={color}/>
    <circle cx="60" cy="32" r="3" fill={color}/>
  </svg>
);

// Original Compass geometric design (keeping for backward compatibility)
export const CompassIcon: React.FC<GeometricIconProps> = ({ 
  className = "w-16 h-16", 
  color = "#0b7189" 
}) => (
  <svg 
    viewBox="0 0 800 800" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
    role="img" 
    aria-label="Compass symbolizing direction and guidance"
  >
    <defs>
      <linearGradient id="compassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.9" />
        <stop offset="50%" stopColor="#fbf5f3" stopOpacity="0.3" />
        <stop offset="100%" stopColor={color} stopOpacity="0.95" />
      </linearGradient>
      <filter id="compassGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Main compass circle */}
    <circle 
      cx="400" 
      cy="400" 
      r="160" 
      fill="none" 
      stroke="url(#compassGradient)" 
      strokeWidth="12" 
      filter="url(#compassGlow)"
    />
    
    {/* Compass needle - main direction */}
    <path 
      d="M400 240 L440 400 L400 400 L360 240 Z" 
      fill={color} 
      opacity="0.95"
      filter="url(#compassGlow)"
    />
    <path 
      d="M400 240 L380 400 L400 400 L420 240 Z" 
      fill="#fbf5f3"
    />
    
    {/* Curved path leading forward */}
    <path 
      d="M180 580 C260 480, 340 460, 400 400" 
      fill="none" 
      stroke="#322214" 
      strokeWidth="10" 
      strokeLinecap="round" 
      opacity="0.6"
    />
    <circle cx="180" cy="580" r="8" fill="#322214"/>
    
    {/* Direction markers */}
    <circle cx="400" cy="250" r="4" fill={color} opacity="0.8"/>
    <circle cx="400" cy="550" r="4" fill={color} opacity="0.6"/>
    <circle cx="250" cy="400" r="4" fill={color} opacity="0.6"/>
    <circle cx="550" cy="400" r="4" fill={color} opacity="0.6"/>
    
    {/* Center point */}
    <circle cx="400" cy="400" r="6" fill="#322214"/>
  </svg>
);

// Lighthouse geometric design
export const LighthouseIcon: React.FC<GeometricIconProps> = ({ 
  className = "w-16 h-16", 
  color = "#0b7189" 
}) => (
  <svg 
    viewBox="0 0 800 800" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
    role="img" 
    aria-label="Lighthouse guiding through legal complexities"
  >
    <defs>
      <linearGradient id="lighthouseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.9" />
        <stop offset="50%" stopColor="#fbf5f3" stopOpacity="0.2" />
        <stop offset="100%" stopColor={color} stopOpacity="0.95" />
      </linearGradient>
      <radialGradient id="beamGradient" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor={color} stopOpacity="0.15" />
        <stop offset="70%" stopColor={color} stopOpacity="0.08" />
        <stop offset="100%" stopColor={color} stopOpacity="0.02" />
      </radialGradient>
      <filter id="lighthouseGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Base foundation */}
    <rect 
      x="300" 
      y="580" 
      width="200" 
      height="120" 
      rx="8" 
      fill="#322214" 
      opacity="0.08"
    />
    
    {/* Tower structure */}
    <path 
      d="M400 580 L380 200 L420 200 L440 580 Z" 
      fill="none" 
      stroke="url(#lighthouseGradient)" 
      strokeWidth="12" 
      strokeLinejoin="round"
      filter="url(#lighthouseGlow)"
    />
    
    {/* Light house top */}
    <rect 
      x="375" 
      y="160" 
      width="50" 
      height="40" 
      rx="6" 
      fill={color}
      filter="url(#lighthouseGlow)"
    />
    
    {/* Guiding beam */}
    <path 
      d="M425 180 L640 120 L640 280 L425 220 Z" 
      fill="url(#beamGradient)"
    />
    
    {/* Additional beam lines for effect */}
    <path 
      d="M425 180 L600 140" 
      stroke={color} 
      strokeWidth="2" 
      opacity="0.3"
    />
    <path 
      d="M425 200 L580 170" 
      stroke={color} 
      strokeWidth="2" 
      opacity="0.2"
    />
    <path 
      d="M425 220 L600 240" 
      stroke={color} 
      strokeWidth="2" 
      opacity="0.3"
    />
    
    {/* Tower details */}
    <line 
      x1="380" 
      y1="320" 
      x2="420" 
      y2="320" 
      stroke={color} 
      strokeWidth="6" 
      strokeLinecap="round" 
      opacity="0.6"
    />
    <line 
      x1="385" 
      y1="400" 
      x2="415" 
      y2="400" 
      stroke={color} 
      strokeWidth="4" 
      strokeLinecap="round" 
      opacity="0.45"
    />
    <line 
      x1="390" 
      y1="480" 
      x2="410" 
      y2="480" 
      stroke={color} 
      strokeWidth="3" 
      strokeLinecap="round" 
      opacity="0.35"
    />
    
    {/* Decorative base elements */}
    <circle cx="350" cy="650" r="12" fill="#322214" opacity="0.3"/>
    <circle cx="450" cy="650" r="12" fill="#322214" opacity="0.3"/>
  </svg>
);

// Navigation/direction geometric design
export const NavigationIcon: React.FC<GeometricIconProps> = ({ 
  className = "w-8 h-8", 
  color = "#0b7189" 
}) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
    role="img" 
    aria-label="Navigation direction indicator"
  >
    <defs>
      <linearGradient id="navGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="#fbf5f3" />
      </linearGradient>
    </defs>
    
    <polygon 
      points="50,10 70,35 55,35 55,90 45,90 45,35 30,35" 
      fill="url(#navGradient)"
    />
    <circle cx="50" cy="50" r="3" fill="#322214"/>
  </svg>
);

// Geometric pattern for backgrounds
export const GeometricPattern: React.FC<{ className?: string; opacity?: number }> = ({ 
  className = "", 
  opacity = 0.1 
}) => (
  <svg 
    className={`absolute inset-0 w-full h-full ${className}`} 
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity }}
  >
    <defs>
      <pattern id="geometricGrid" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        {/* Compass-inspired circles */}
        <circle cx="60" cy="60" r="40" fill="none" stroke="#0b7189" strokeWidth="1" opacity="0.3"/>
        <circle cx="60" cy="60" r="20" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.4"/>
        <circle cx="60" cy="60" r="8" fill="#322214" opacity="0.2"/>
        
        {/* Navigation lines */}
        <line x1="60" y1="20" x2="60" y2="100" stroke="#0b7189" strokeWidth="1" opacity="0.2"/>
        <line x1="20" y1="60" x2="100" y2="60" stroke="#0b7189" strokeWidth="1" opacity="0.2"/>
        
        {/* Corner elements */}
        <polygon points="20,20 30,20 25,30" fill="#d97706" opacity="0.3"/>
        <polygon points="100,20 90,20 95,30" fill="#d97706" opacity="0.3"/>
        <polygon points="20,100 30,100 25,90" fill="#d97706" opacity="0.3"/>
        <polygon points="100,100 90,100 95,90" fill="#d97706" opacity="0.3"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#geometricGrid)" />
  </svg>
);

// Split path design for the split-screen section
export const SplitPathIcon: React.FC<GeometricIconProps> = ({ 
  className = "w-24 h-24", 
  color = "#0b7189" 
}) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
    role="img" 
    aria-label="Two paths diverging"
  >
    <defs>
      <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.8" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0.6" />
      </linearGradient>
    </defs>
    
    {/* Main path */}
    <path 
      d="M100 180 C100 140, 100 120, 100 100" 
      fill="none" 
      stroke="url(#pathGradient)" 
      strokeWidth="8" 
      strokeLinecap="round"
    />
    
    {/* Left path */}
    <path 
      d="M100 100 C80 80, 60 60, 40 20" 
      fill="none" 
      stroke={color} 
      strokeWidth="6" 
      strokeLinecap="round"
      opacity="0.7"
    />
    
    {/* Right path */}
    <path 
      d="M100 100 C120 80, 140 60, 160 20" 
      fill="none" 
      stroke="#d97706" 
      strokeWidth="6" 
      strokeLinecap="round"
      opacity="0.7"
    />
    
    {/* Decision point */}
    <circle cx="100" cy="100" r="8" fill="#322214"/>
    
    {/* End points */}
    <circle cx="40" cy="20" r="6" fill={color}/>
    <circle cx="160" cy="20" r="6" fill="#d97706"/>
    
    {/* Directional arrows */}
    <polygon points="35,25 40,15 45,25 40,22" fill={color}/>
    <polygon points="155,25 160,15 165,25 160,22" fill="#d97706"/>
  </svg>
);

// Enhanced compass for hero section
export const HeroCompass: React.FC<{ className?: string; animate?: boolean }> = ({ 
  className = "w-64 h-64", 
  animate = true 
}) => (
  <div className={`relative ${className} ${animate ? 'animate-spin-slow' : ''}`}>
    <svg 
      viewBox="0 0 800 800" 
      className="w-full h-full" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="heroCompassGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbf5f3" stopOpacity="0.1" />
          <stop offset="30%" stopColor="#d97706" stopOpacity="0.3" />
          <stop offset="70%" stopColor="#0b7189" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#322214" stopOpacity="0.8" />
        </radialGradient>
        <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer rings */}
      <circle cx="400" cy="400" r="200" fill="none" stroke="#0b7189" strokeWidth="3" opacity="0.3"/>
      <circle cx="400" cy="400" r="160" fill="none" stroke="#d97706" strokeWidth="4" opacity="0.5"/>
      <circle cx="400" cy="400" r="120" fill="none" stroke="#0b7189" strokeWidth="6" opacity="0.7"/>
      
      {/* Main compass body */}
      <circle cx="400" cy="400" r="80" fill="url(#heroCompassGradient)" filter="url(#heroGlow)"/>
      
      {/* Compass directions */}
      <path d="M400 320 L420 380 L400 400 L380 380 Z" fill="#0b7189" opacity="0.9"/>
      <path d="M400 480 L420 420 L400 400 L380 420 Z" fill="#322214" opacity="0.7"/>
      <path d="M320 400 L380 420 L400 400 L380 380 Z" fill="#d97706" opacity="0.6"/>
      <path d="M480 400 L420 420 L400 400 L420 380 Z" fill="#322214" opacity="0.5"/>
      
      {/* Center point */}
      <circle cx="400" cy="400" r="12" fill="#322214"/>
      
      {/* Directional markers */}
      <text x="400" y="300" textAnchor="middle" fill="#0b7189" fontSize="24" fontWeight="bold">N</text>
      <text x="500" y="410" textAnchor="middle" fill="#322214" fontSize="20" fontWeight="bold">E</text>
      <text x="400" y="520" textAnchor="middle" fill="#322214" fontSize="20" fontWeight="bold">S</text>
      <text x="300" y="410" textAnchor="middle" fill="#d97706" fontSize="20" fontWeight="bold">W</text>
    </svg>
  </div>
);