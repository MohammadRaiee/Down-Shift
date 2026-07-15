export default function Logo({
  width = 300,
  height = 200,
  className = "",
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="-20 -20 440 500"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Down Shift Performance Logo"
      role="img"
    >
      <defs>
        {/* Luxury Tech Gradients */}
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2A2A2A" />
          <stop offset="50%" stopColor="#111111" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF1E27" />
          <stop offset="50%" stopColor="#B3000C" />
          <stop offset="100%" stopColor="#5E0000" />
        </linearGradient>
        <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#A0A0A0" />
          <stop offset="100%" stopColor="#404040" />
        </linearGradient>
      </defs>

      {/* 1. Aero Wings (Background) */}
      <g strokeWidth="0">
        {/* Left Wing */}
        <path d="M150,150 L10,80 L0,110 L130,180 Z" fill="url(#bodyGrad)"/>
        <path d="M140,185 L30,140 L20,165 L145,215 Z" fill="url(#bodyGrad)"/>
        <path d="M145,225 L60,195 L50,215 L150,250 Z" fill="url(#bodyGrad)"/>
        {/* Left Accent Glow */}
        <path d="M130,180 L0,110 L15,130 L140,195 Z" fill="url(#redGrad)"/>
        <path d="M145,215 L20,165 L30,180 L145,225 Z" fill="url(#redGrad)"/>

        {/* Right Wing */}
        <path d="M250,150 L390,80 L400,110 L270,180 Z" fill="url(#bodyGrad)"/>
        <path d="M260,185 L370,140 L380,165 L255,215 Z" fill="url(#bodyGrad)"/>
        <path d="M255,225 L340,195 L350,215 L250,250 Z" fill="url(#bodyGrad)"/>
        {/* Right Accent Glow */}
        <path d="M270,180 L400,110 L385,130 L260,195 Z" fill="url(#redGrad)"/>
        <path d="M255,215 L380,165 L370,180 L255,225 Z" fill="url(#redGrad)"/>
      </g>

      {/* 2. Embedded Tech Spinner / Arc Core (Midground) */}
      <g transform="translate(200, 200)">
        {/* Outer Tech Housing */}
        <circle cx="0" cy="0" r="55" fill="#030303" stroke="url(#chrome)" strokeWidth="2" />
        <circle cx="0" cy="0" r="48" fill="none" stroke="#1a1a1a" strokeWidth="6" />

        {/* The Rotor (Static in Logo.tsx, Animated in Loader) */}
        <g>
          {/* Blades */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
             <path key={deg} transform={`rotate(${deg})`} d="M-6,-45 L6,-45 L10,-20 L-10,-20 Z" fill="url(#redGrad)"/>
          ))}
          {/* Core glowing ring */}
          <circle cx="0" cy="0" r="28" fill="url(#bodyGrad)" stroke="url(#redGrad)" strokeWidth="4" />
          {/* Central Mount */}
          <circle cx="0" cy="0" r="14" fill="url(#chrome)" />
          <circle cx="0" cy="0" r="6" fill="#000" />
        </g>
      </g>

      {/* 3. Skeleton Piston (Foreground) - Wraps around the core */}
      <g>
        {/* Piston Head */}
        <path d="M140,50 L260,50 L260,85 L240,110 L160,110 L140,85 Z" fill="url(#bodyGrad)"/>
        <path d="M140,50 L260,50 L260,60 L140,60 Z" fill="url(#chrome)"/>
        <rect x="145" y="68" width="110" height="3" fill="url(#chrome)"/>
        <rect x="150" y="78" width="100" height="3" fill="url(#chrome)"/>
        <rect x="155" y="88" width="90" height="3" fill="url(#redGrad)"/>

        {/* Left Rail / Shaft */}
        <rect x="165" y="110" width="15" height="190" fill="url(#bodyGrad)"/>
        <rect x="177" y="110" width="3" height="190" fill="url(#chrome)"/>
        
        {/* Right Rail / Shaft */}
        <rect x="220" y="110" width="15" height="190" fill="url(#bodyGrad)"/>
        <rect x="220" y="110" width="3" height="190" fill="url(#chrome)"/>

        {/* Piston Base Connector */}
        <path d="M150,290 L250,290 L260,330 L230,360 L170,360 L140,330 Z" fill="url(#bodyGrad)"/>
        <circle cx="200" cy="325" r="22" fill="url(#chrome)"/>
        <circle cx="200" cy="325" r="14" fill="#0d0d0d"/>
      </g>

      {/* Typography */}
      <text
        x="200"
        y="420"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontSize="36"
        fill="url(#chrome)"
        letterSpacing="0.25em"
      >
        DOWN SHIFT
      </text>
      <text
        x="200"
        y="450"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="12"
        fill="url(#redGrad)"
        letterSpacing="0.4em"
      >
        PERFORMANCE PARTS
      </text>
    </svg>
  );
}