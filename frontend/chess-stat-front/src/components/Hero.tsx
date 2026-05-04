// ─────────────────────────────────────────
//  Chess Stats — Hero component
// ─────────────────────────────────────────

import React, { useState } from 'react';
import type { TabType, QuickChip } from '../types';

interface HeroProps {
  onSearch: (query: string, type: TabType) => void;
  onQuickFilter: (key: string, tab: TabType) => void;
}

const QUICK_CHIPS: QuickChip[] = [
  { label: 'Élo > 2700',     key: 'elo2700',      tab: 'joueurs'  },
  { label: '🇫🇷 France',     key: 'france',       tab: 'joueurs'  },
  { label: 'Tournois 2026',  key: 'tournois2026', tab: 'tournois' },
  { label: 'Top 10 mondial', key: 'top10',        tab: 'joueurs'  },
  { label: '🇳🇴 Norvège',    key: 'norvege',      tab: 'joueurs'  },
];

export const Hero: React.FC<HeroProps> = ({ onSearch, onQuickFilter }) => {
  const [query, setQuery] = useState('');
  const [type, setType]   = useState<TabType>('joueurs');

  const handleSearch = () => onSearch(query, type);

  return (
    <section style={{
      background: 'linear-gradient(160deg, var(--c11) 0%, #263e87 55%, var(--c10) 100%)',
      padding: '72px 48px 56px', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glyph */}
      <div aria-hidden style={{
        position: 'absolute', right: -20, top: -30,
        fontSize: 320, opacity: .04, color: 'white',
        lineHeight: 1, pointerEvents: 'none',
        transform: 'rotate(-12deg)', userSelect: 'none',
      }}>♟</div>

      {/* Eyebrow */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)',
        borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 500,
        color: 'var(--c5)', letterSpacing: '.06em', textTransform: 'uppercase',
        marginBottom: 20,
      }}>
        <span>♟</span> Base de données échecs
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily: 'var(--serif)', fontSize: 52, fontWeight: 700, color: 'white',
        lineHeight: 1.1, marginBottom: 14,
      }}>
        Explorez le monde<br />des échecs
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: 17, color: 'var(--c5)', maxWidth: 480, margin: '0 auto 36px',
        lineHeight: 1.6, fontWeight: 300,
      }}>
        Recherchez joueurs et tournois, consultez classements Élo, résultats et statistiques.
      </p>

      {/* Search bar */}
      <div style={{
        maxWidth: 580, margin: '0 auto', display: 'flex',
        background: 'white', borderRadius: 10, overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,.25)',
      }}>
        <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', color: 'var(--c7)', fontSize: 18 }}>
          ⌕
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Nom de joueur, tournoi, pays…"
          style={{
            flex: 1, border: 'none', outline: 'none', fontFamily: 'var(--sans)',
            fontSize: 15, color: 'var(--c11)', padding: '14px 0', background: 'transparent',
          }}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as TabType)}
          style={{
            border: 'none', borderLeft: '1px solid var(--c3)', outline: 'none',
            background: 'var(--c1)', fontFamily: 'var(--sans)', fontSize: 13,
            color: 'var(--c11)', padding: '0 14px', cursor: 'pointer', fontWeight: 500,
          }}
        >
          <option value="joueurs">Joueurs</option>
          <option value="tournois">Tournois</option>
        </select>
        <button
          onClick={handleSearch}
          style={{
            background: 'var(--c8)', color: 'white', border: 'none',
            padding: '0 28px', fontFamily: 'var(--sans)', fontSize: 15,
            fontWeight: 600, cursor: 'pointer', borderRadius: '0 10px 10px 0',
          }}
        >
          Rechercher
        </button>
      </div>

      {/* Quick chips */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap' }}>
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip.key}
            onClick={() => onQuickFilter(chip.key, chip.tab)}
            style={{
              border: '1px solid rgba(255,255,255,.2)', borderRadius: 20,
              background: 'rgba(255,255,255,.08)', color: 'var(--c4)',
              padding: '5px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </section>
  );
};
