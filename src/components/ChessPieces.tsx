import React from 'react';

export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

interface ChessPieceProps {
  type: PieceType;
  color: PieceColor;
  className?: string;
}

export const ChessPieceSvg: React.FC<ChessPieceProps> = ({
  type,
  color,
  className = 'w-full h-full',
}) => {
  const isWhite = color === 'w';
  const fill = isWhite ? '#F8FAFC' : '#18181B';
  const accentFill = isWhite ? '#E2E8F0' : '#27272A';
  const stroke = isWhite ? '#0F172A' : '#E2E8F0';
  const innerStroke = isWhite ? '#334155' : '#A1A1AA';

  return (
    <svg
      viewBox="0 0 45 45"
      className={`${className} select-none drop-shadow-[0_2px_3px_rgba(0,0,0,0.45)]`}
      aria-label={`${isWhite ? 'White' : 'Black'} ${type}`}
    >
      {type === 'p' && (
        <g
          fill={fill}
          stroke={stroke}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 22.5,9 C 19.5,9 17,11.5 17,14.5 C 17,16.4 18,18.1 19.5,19.1 C 16.8,20.5 15,23.4 15,26.8 C 15,29.2 16,31.3 17.5,32.7 L 13,37.5 L 32,37.5 L 27.5,32.7 C 29,31.3 30,29.2 30,26.8 C 30,23.4 28.2,20.5 25.5,19.1 C 27,18.1 28,16.4 28,14.5 C 28,11.5 25.5,9 22.5,9 z" />
          <path d="M 11.5,37.5 L 33.5,37.5 L 33.5,40.5 L 11.5,40.5 z" fill={accentFill} />
        </g>
      )}

      {type === 'r' && (
        <g
          fill={fill}
          stroke={stroke}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z" fill={accentFill} />
          <path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z" />
          <path d="M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z" />
          <path d="M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z" />
          <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14" />
          <path d="M 12.5,32 L 14,29.5 L 31,29.5 L 32.5,32 L 12.5,32 z" />
          <path d="M 15,20 L 30,20" stroke={innerStroke} strokeWidth="1" fill="none" />
        </g>
      )}

      {type === 'n' && (
        <g
          fill={fill}
          stroke={stroke}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" />
          <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" />
          <circle cx="15" cy="15.5" r="1.2" fill={stroke} stroke="none" />
          <path d="M 12,39 L 38,39 L 38,41 L 12,41 z" fill={accentFill} />
        </g>
      )}

      {type === 'b' && (
        <g
          fill={fill}
          stroke={stroke}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z" fill={accentFill} />
          <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" />
          <circle cx="22.5" cy="8" r="2.5" />
          <path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" stroke={innerStroke} strokeWidth="1.4" fill="none" />
        </g>
      )}

      {type === 'q' && (
        <g
          fill={fill}
          stroke={stroke}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="6" cy="12" r="2.2" />
          <circle cx="14" cy="9" r="2.2" />
          <circle cx="22.5" cy="8" r="2.2" />
          <circle cx="31" cy="9" r="2.2" />
          <circle cx="39" cy="12" r="2.2" />
          <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z" />
          <path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 10.5,36 10.5,36 C 9,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z" />
          <path d="M 11.5,30 C 15,29 30,29 33.5,30" stroke={innerStroke} strokeWidth="1.2" fill="none" />
          <path d="M 12,33.5 C 18,32.5 27,32.5 33,33.5" stroke={innerStroke} strokeWidth="1.2" fill="none" />
        </g>
      )}

      {type === 'k' && (
        <g
          fill={fill}
          stroke={stroke}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 22.5,11.63 L 22.5,6" stroke={stroke} strokeWidth="2" />
          <path d="M 20,8 L 25,8" stroke={stroke} strokeWidth="2" />
          <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" />
          <path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5 L 11.5,37 z" />
          <path d="M 11.5,30 C 17,27 27,27 32.5,30" stroke={innerStroke} strokeWidth="1.2" fill="none" />
          <path d="M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5" stroke={innerStroke} strokeWidth="1.2" fill="none" />
          <path d="M 11.5,37 C 17,34 27,34 32.5,37" stroke={innerStroke} strokeWidth="1.2" fill="none" />
        </g>
      )}
    </svg>
  );
};
