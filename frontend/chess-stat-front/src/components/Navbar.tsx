// ─────────────────────────────────────────
//  Chess Stats — Navbar component
// ─────────────────────────────────────────

import React from 'react';
import type { NavLink, PageType } from '../types';

interface NavbarProps {
  onNavigate: (page: PageType) => void;
  currentPage: PageType;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Joueurs',     href: '#' },
  { label: 'Tournois',    href: '#' },
  { label: 'Classements', href: '#' },
  { label: 'À propos',    href: '#' },
];

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--c11)',
      padding: '0 48px', display: 'flex', alignItems: 'center',
      height: 62, gap: 32,
    }}>
      {/* Logo */}
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
        style={{
          fontFamily: 'var(--serif)', fontSize: 21, fontWeight: 700,
          color: 'white', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: 10,
        }}
      >
        <div style={{
          width: 32, height: 32, background: 'var(--c8)', borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: 'white', flexShrink: 0,
        }}>♟</div>
        Chess Stats
      </a>

      {/* Links */}
      <div style={{ display: 'flex', gap: 28, marginLeft: 'auto' }}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => e.preventDefault()}
            style={{
              color: 'var(--c6)', fontSize: 14, fontWeight: 500,
              textDecoration: 'none', transition: 'color .2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--c6)')}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <button
        style={{
          background: 'var(--c8)', color: 'white', border: 'none', borderRadius: 6,
          padding: '7px 18px', fontSize: 14, fontWeight: 600,
          fontFamily: 'var(--sans)', cursor: 'pointer', marginLeft: 16,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--c9)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--c8)')}
      >
        Connexion
      </button>
    </nav>
  );
};
