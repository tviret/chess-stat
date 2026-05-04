// ─────────────────────────────────────────
//  Chess Stats — FiltersBar component
// ─────────────────────────────────────────

import React from 'react';
import type { ActiveFilters } from '../types';

interface FilterDef {
  key: keyof ActiveFilters;
  label: string;
}

const FILTER_DEFS: FilterDef[] = [
  { key: 'pays',    label: 'Pays : Tous'    },
  { key: 'elo',     label: 'Élo : Tous'     },
  { key: 'tournoi', label: 'Tournoi : Tous' },
  { key: 'periode', label: 'Période'        },
];

const Chevron: React.FC = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

interface FiltersBarProps {
  activeFilters: ActiveFilters;
  onToggle: (key: string) => void;
  onReset: () => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({ activeFilters, onToggle, onReset }) => {
  return (
    <div style={{
      background: 'var(--c2)', borderBottom: '1px solid var(--c4)',
      padding: '12px 48px', display: 'flex', gap: 10,
      alignItems: 'center', flexWrap: 'wrap',
    }}>
      <span style={{
        fontSize: 11, color: 'var(--c7)', textTransform: 'uppercase',
        letterSpacing: '.08em', fontWeight: 600, marginRight: 4, flexShrink: 0,
      }}>
        Filtres
      </span>

      {FILTER_DEFS.map((f) => {
        const isActive = !!activeFilters[f.key];
        return (
          <button
            key={f.key}
            onClick={() => onToggle(f.key)}
            style={{
              border: isActive ? '1.5px solid var(--c8)' : '1.5px solid var(--c5)',
              borderRadius: 20,
              background: isActive ? 'var(--c3)' : 'white',
              padding: '5px 14px', fontSize: 13, fontWeight: 500,
              fontFamily: 'var(--sans)',
              color: isActive ? 'var(--c9)' : 'var(--c11)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            {f.label}
            <Chevron />
          </button>
        );
      })}

      <button
        onClick={onReset}
        style={{
          marginLeft: 'auto', border: 'none', background: 'transparent',
          color: 'var(--c7)', fontSize: 13, fontFamily: 'var(--sans)',
          cursor: 'pointer', fontWeight: 500,
        }}
      >
        ✕ Réinitialiser
      </button>
    </div>
  );
};
