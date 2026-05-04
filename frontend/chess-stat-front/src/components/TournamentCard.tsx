// ─────────────────────────────────────────
//  Chess Stats — TournamentCard component
// ─────────────────────────────────────────

import React, { useState } from 'react';
import type { Tournament } from '../types';

interface TournamentCardProps {
  tournament: Tournament;
  onClick?: (tournament: Tournament) => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onClick?.(tournament)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--c0)',
        border: `1.5px solid ${hovered ? 'var(--c6)' : 'var(--c3)'}`,
        borderRadius: 12,
        padding: '20px 22px',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 6px 24px rgba(61,99,221,.12)' : 'none',
        transition: 'box-shadow .2s, border-color .2s, transform .15s',
      }}
    >
      {/* Top row: name + category badge */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 10,
      }}>
        <div style={{
          fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 600,
          color: 'var(--c11)', marginBottom: 4,
        }}>
          {tournament.nom}
        </div>
        <span style={{
          background: 'var(--c11)', color: 'white', borderRadius: 4,
          padding: '2px 8px', fontSize: 11, fontWeight: 600, flexShrink: 0,
        }}>
          {tournament.cat}
        </span>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--c7)', flexWrap: 'wrap' }}>
        <span>📍 {tournament.lieu}</span>
        <span>📅 {tournament.date}</span>
        <span>👥 {tournament.nb} joueurs</span>
      </div>
    </div>
  );
};
