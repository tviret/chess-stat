// ─────────────────────────────────────────
//  Chess Stats — Hero component
// ─────────────────────────────────────────

import React, { useState } from 'react';

interface HeroProps {
  onSearch: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  function handleSearch() {
    onSearch(query.trim());
  }

  return (
    <section style={{
      background: 'linear-gradient(160deg, var(--c11) 0%, #263e87 55%, var(--c10) 100%)',
      padding: '64px 48px 52px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
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
        fontFamily: 'var(--serif)', fontSize: 48, fontWeight: 700, color: 'white',
        lineHeight: 1.1, marginBottom: 12,
      }}>
        Explorez le monde<br />des échecs
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: 16, color: 'var(--c5)', maxWidth: 460, margin: '0 auto 32px',
        lineHeight: 1.6, fontWeight: 300,
      }}>
        Recherchez joueurs et tournois, consultez classements Élo, résultats et statistiques.
      </p>

      {/* Search bar */}
      <div style={{
        maxWidth: 520, margin: '0 auto', display: 'flex',
        background: 'white', borderRadius: 10, overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,.25)',
      }}>
        <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', color: 'var(--c7)', fontSize: 18 }}>
          ⌕
        </div>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Nom de joueur…"
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--c11)',
            padding: '14px 0', background: 'transparent',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            background: 'var(--c8)', color: 'white', border: 'none',
            padding: '0 28px', fontFamily: 'var(--sans)', fontSize: 15,
            fontWeight: 600, cursor: 'pointer', borderRadius: '0 10px 10px 0',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--c9)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--c8)')}
        >
          Rechercher
        </button>
      </div>
    </section>
  );
};
