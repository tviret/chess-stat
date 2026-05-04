// ─────────────────────────────────────────
//  Chess Stats — App.tsx
//  Root component / client-side router
// ─────────────────────────────────────────

import React, { useState, useCallback } from 'react';
import type { PageType, ActiveFilters, TabType } from './types';
import type { Player } from './types';
import { CARLSEN } from './data';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { PlayerPage } from './pages/PlayerPage';

const App: React.FC = () => {
  // ── Routing state ──────────────────────
  const [page, setPage]               = useState<PageType>('home');
  const [selectedPlayer, setSelected] = useState(CARLSEN); // default to Carlsen for demo

  // ── Filter state ───────────────────────
  const [activeFilters, setFilters]   = useState<ActiveFilters>({});

  // ── Handlers ──────────────────────────
  const handleNavigate = useCallback((p: PageType) => {
    setPage(p === 'home' ? 'home' : 'home'); // extend for multi-page routing
  }, []);

  const handlePlayerClick = useCallback((_player: Player) => {
    // In a real app: fetch player detail by id
    // Here we use the static CARLSEN mock for any player click
    setSelected(CARLSEN);
    setPage('player');
  }, []);

  const handleBack = useCallback(() => {
    setPage('home');
  }, []);

  const handleFilterToggle = useCallback((key: string) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters({});
  }, []);

  const handleQuickFilter = useCallback((key: string, tab: TabType) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    // If tab switch needed, HomePage handles it internally via ResultsTabs
  }, []);

  // ── Render ────────────────────────────
  return (
    <MainLayout currentPage={page} onNavigate={handleNavigate}>
      {page === 'player' ? (
        <PlayerPage player={selectedPlayer} onBack={handleBack} />
      ) : (
        <HomePage
          activeFilters={activeFilters}
          onFilterToggle={handleFilterToggle}
          onFilterReset={handleFilterReset}
          onQuickFilter={handleQuickFilter}
          onPlayerClick={handlePlayerClick}
        />
      )}
    </MainLayout>
  );
};

export default App;
