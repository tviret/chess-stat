// ─────────────────────────────────────────
//  Chess Stats — Sidebar (filtres réels)
// ─────────────────────────────────────────

import React from 'react';
import type { FilterState, ApiPays, ApiTournoi } from '../types';

interface SidebarProps {
  filters: FilterState;
  paysList: ApiPays[];
  tournoiList: ApiTournoi[];
  onChange: (f: FilterState) => void;
  onApply: (f?: FilterState) => void;
  onReset: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--c1)',
  border: '1.5px solid var(--c4)',
  borderRadius: 6,
  color: 'var(--c11)',
  padding: '8px 10px',
  fontFamily: 'var(--sans)',
  fontSize: 13,
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '.08em',
  textTransform: 'uppercase' as const,
  color: 'var(--c7)',
  display: 'block',
  marginBottom: 6,
};

export const Sidebar: React.FC<SidebarProps> = ({
  filters, paysList, tournoiList, onChange, onApply, onReset,
}) => {
  function set(key: keyof FilterState, value: string) {
    onChange({ ...filters, [key]: value });
  }

  function handleSelectChange(key: keyof FilterState, value: string) {
    const next = { ...filters, [key]: value };
    onApply(next); // selects apply immediately
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = 'var(--c8)';
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = 'var(--c4)';
  }

  return (
    <aside style={{
      background: 'var(--c0)',
      borderRight: '1px solid var(--c3)',
      padding: '24px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 22,
      position: 'sticky',
      top: 62,
      height: 'calc(100vh - 62px)',
      overflowY: 'auto',
    }}>

      {/* Joueur */}
      <div>
        <label style={labelStyle}>Joueur</label>
        <input
          type="text"
          value={filters.joueur}
          placeholder="Nom..."
          style={inputStyle}
          onChange={e => set('joueur', e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onApply()}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {/* Pays */}
      <div>
        <label style={labelStyle}>Pays</label>
        <select
          value={filters.pays}
          style={inputStyle}
          onChange={e => handleSelectChange('pays', e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <option value="">Tous</option>
          {paysList.map(p => (
            <option key={p.code} value={p.code}>{p.nom}</option>
          ))}
        </select>
      </div>

      {/* Tournoi */}
      <div>
        <label style={labelStyle}>Tournoi</label>
        <select
          value={filters.tournoi}
          style={inputStyle}
          onChange={e => handleSelectChange('tournoi', e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <option value="">Tous</option>
          {tournoiList.map(t => (
            <option key={t.id} value={String(t.id)}>{t.nom}</option>
          ))}
        </select>
      </div>

      {/* ELO */}
      <div>
        <label style={labelStyle}>ELO</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input
            type="number"
            value={filters.eloMin}
            placeholder="Min"
            style={inputStyle}
            onChange={e => set('eloMin', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onApply()}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <input
            type="number"
            value={filters.eloMax}
            placeholder="Max"
            style={inputStyle}
            onChange={e => set('eloMax', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onApply()}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      </div>

      {/* Période */}
      <div>
        <label style={labelStyle}>Période</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            type="date"
            value={filters.dateDebut}
            style={inputStyle}
            onChange={e => set('dateDebut', e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <input
            type="date"
            value={filters.dateFin}
            style={inputStyle}
            onChange={e => set('dateFin', e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
        <button
          onClick={() => onApply()}
          style={{
            background: 'var(--c8)', color: 'white', border: 'none',
            borderRadius: 6, padding: '10px', fontFamily: 'var(--sans)',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--c9)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--c8)')}
        >
          Rechercher
        </button>
        <button
          onClick={onReset}
          style={{
            background: 'transparent', color: 'var(--c7)',
            border: '1.5px solid var(--c4)', borderRadius: 6,
            padding: '10px', fontFamily: 'var(--sans)',
            fontSize: 14, fontWeight: 500, cursor: 'pointer', width: '100%',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--c11)';
            e.currentTarget.style.borderColor = 'var(--c8)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--c7)';
            e.currentTarget.style.borderColor = 'var(--c4)';
          }}
        >
          Réinitialiser
        </button>
      </div>
    </aside>
  );
};
