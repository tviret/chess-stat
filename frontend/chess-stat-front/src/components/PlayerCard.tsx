// ─────────────────────────────────────────
//  Chess Stats — PlayerCard component
// ─────────────────────────────────────────

import React, { useState } from 'react';
import type { Player } from '../types';

interface PlayerCardProps {
  player: Player;
  onClick: (player: Player) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(player)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--c0)',
        border: `1.5px solid ${hovered ? 'var(--c6)' : 'var(--c3)'}`,
        borderRadius: 12,
        padding: '18px 20px',
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
        width: 48, height: 48, borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--c4), var(--c6))',
        border: '2px solid var(--c5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--c11)',
        fontWeight: 700, flexShrink: 0,
      }}>
        {player.nom[0]}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 600, color: 'var(--c11)', marginBottom: 3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {player.nom}, {player.prenom}
        </div>
        <div style={{ fontSize: 12, color: 'var(--c7)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>{player.flag} {player.pays}</span>
          <span style={{ fontSize: 11, color: 'var(--c6)' }}>· #{player.rank}</span>
        </div>
      </div>

      {/* Elo */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <span style={{
          fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700,
          color: 'var(--c8)', display: 'block', lineHeight: 1,
        }}>
          {player.elo}
        </span>
        <span style={{
          fontSize: 10, color: 'var(--c7)', textTransform: 'uppercase',
          letterSpacing: '.07em', marginTop: 2, display: 'block',
        }}>
          Élo
        </span>
      </div>
    </div>
  );
};
