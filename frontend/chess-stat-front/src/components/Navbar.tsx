// ─────────────────────────────────────────
//  Chess Stats — Navbar
// ─────────────────────────────────────────

import React from 'react';
import type { PageType } from '../types';

interface NavbarProps {
  onNavigate: (page: PageType) => void;
  currentPage: PageType;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => (
  <nav style={{
    position: 'sticky', top: 0, zIndex: 100,
    background: 'var(--c11)',
    padding: '0 48px', display: 'flex', alignItems: 'center',
    height: 62, gap: 32,
  }}>
    {/* Logo */}
    <a
      href="#"
      onClick={e => { e.preventDefault(); onNavigate('home'); }}
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
  </nav>
);
