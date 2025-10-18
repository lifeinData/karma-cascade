import React from 'react';
import './matchEffects.css';

interface MatchEffectsProps {
  matches: Array<{ row: number; col: number }>;
  gemSize: number;
}

export const MatchEffects: React.FC<MatchEffectsProps> = ({ matches, gemSize }) => {
  return (
    <div className="match-effects-container">
      {matches.map((match, index) => (
        <div
          key={`match-${match.row}-${match.col}-${index}`}
          className="sparkle-effect"
          style={{
            position: 'absolute',
            left: `${match.col * gemSize}px`,
            top: `${match.row * gemSize}px`,
            width: `${gemSize}px`,
            height: `${gemSize}px`,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {/* Multiple sparkle particles */}
          <div className="sparkle sparkle-1" />
          <div className="sparkle sparkle-2" />
          <div className="sparkle sparkle-3" />
          <div className="sparkle sparkle-4" />
          <div className="sparkle sparkle-5" />
        </div>
      ))}
    </div>
  );
};