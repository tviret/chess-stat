// ─────────────────────────────────────────
//  Chess Stats — PlayerCard (API data)
// ─────────────────────────────────────────

import React, { useState } from 'react';
import type { ApiJoueur } from '../types';

interface PlayerCardProps {
  joueur: ApiJoueur;
  onClick: (nom: string) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ joueur, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const initial = joueur.nomComplet.charAt(0).toUpperCase();

  return (
    <div
      onClick={() => onClick(joueur.nomComplet)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--c0)',
        border: `1.5px solid ${hovered ? 'var(--c6)' : 'var(--c3)'}`,
        borderRadius: 12,
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        cursor: 'pointer',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 6px 24px rgba(61,99,221,.12)' : 'none',
        transition: 'box-shadow .2s, border-color .2s, transform .15s',
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--c4), var(--c6))',
        border: '2px solid var(--c5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--c11)',
        fontWeight: 700, flexShrink: 0,
      }}>
        {initial}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 600, color: 'var(--c11)', marginBottom: 3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {joueur.nomComplet}
        </div>
        {joueur.pays && (
          <span style={{
            display: 'inline-block',
            background: 'rgba(61,99,221,.08)',
            color: 'var(--c8)',
            borderRadius: 4,
            padding: '2px 8px',
            fontSize: 11,
            fontWeight: 600,
          }}>
            {joueur.pays.code.toUpperCase()}
          </span>
        )}
      </div>

      <span style={{ fontSize: 18, color: 'var(--c5)', flexShrink: 0 }}>→</span>
    </div>
  );
};
