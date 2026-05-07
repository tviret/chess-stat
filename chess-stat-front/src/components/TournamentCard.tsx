// ─────────────────────────────────────────
//  Chess Stats — TournamentCard (API data)
// ─────────────────────────────────────────

import React, { useState } from 'react';
import type { ApiTournoi } from '../types';

interface TournamentCardProps {
  tournoi: ApiTournoi;
  onClick: (id: number, nom: string) => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournoi, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(tournoi.id, tournoi.nom)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--c0)',
        border: `1.5px solid ${hovered ? 'var(--c6)' : 'var(--c3)'}`,
        borderRadius: 12,
        padding: '18px 20px',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 6px 24px rgba(61,99,221,.12)' : 'none',
        transition: 'box-shadow .2s, border-color .2s, transform .15s',
      }}
    >
      {/* Name + country */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{
          fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 600,
          color: 'var(--c11)', flex: 1, marginRight: 10,
        }}>
          {tournoi.nom}
        </div>
        {tournoi.pays && (
          <span style={{
            background: 'rgba(61,99,221,.08)', color: 'var(--c8)',
            borderRadius: 4, padding: '2px 8px',
            fontSize: 11, fontWeight: 600, flexShrink: 0,
          }}>
            {tournoi.pays.code.toUpperCase()}
          </span>
        )}
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--c7)', flexWrap: 'wrap' }}>
        {tournoi.date && <span>📅 {tournoi.date}</span>}
        {tournoi.nbrJoueurs != null && <span>👥 {tournoi.nbrJoueurs} joueurs</span>}
        {tournoi.classementMoyen != null && <span>⭐ ELO moy. {tournoi.classementMoyen}</span>}
      </div>
    </div>
  );
};
