// ─────────────────────────────────────────
//  Chess Stats — MainLayout
//  Wraps every page with Navbar
// ─────────────────────────────────────────

import React from 'react';
import type { PageType } from '../types';
import { Navbar } from '../components/Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentPage,
  onNavigate,
}) => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--c1)' }}>
      <Navbar currentPage={currentPage} onNavigate={onNavigate} />
      <main>{children}</main>
    </div>
  );
};
