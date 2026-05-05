// ─────────────────────────────────────────
//  Chess Stats — App.tsx
// ─────────────────────────────────────────

import React, { useState, useCallback } from 'react';
import type { FilterState } from './types';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { PlayerPage } from './pages/PlayerPage';
import { TournamentPage } from './pages/TournamentPage';

// ── Navigation stack ──────────────────────────────────────────────────────────
type NavFrame =
  | { page: 'home' }
  | { page: 'player'; nom: string }
  | { page: 'tournament'; id: number; nom: string };

function frameLabel(f: NavFrame): string {
  if (f.page === 'home')       return 'Résultats';
  if (f.page === 'player')     return f.nom;
  if (f.page === 'tournament') return f.nom;
  return '';
}

const EMPTY_FILTERS: FilterState = {
  joueur: '', pays: '', tournoi: '', eloMin: '', eloMax: '', dateDebut: '', dateFin: '',
};

const App: React.FC = () => {
  const [stack,   setStack]   = useState<NavFrame[]>([{ page: 'home' }]);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const current  = stack[stack.length - 1];
  const previous = stack.length > 1 ? stack[stack.length - 2] : null;

  const push = useCallback((frame: NavFrame) => {
    setStack(s => [...s, frame]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const pop = useCallback(() => {
    setStack(s => (s.length > 1 ? s.slice(0, -1) : s));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goHome = useCallback(() => {
    setStack([{ page: 'home' }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePlayerClick  = useCallback((nom: string) =>
    push({ page: 'player', nom }), [push]);

  const handleTournoiClick = useCallback((id: number, nom: string) =>
    push({ page: 'tournament', id, nom }), [push]);

  const handleSearch = useCallback((query: string) =>
    setFilters(f => ({ ...f, joueur: query })), []);

  const backLabel = previous ? `← ${frameLabel(previous)}` : '← Retour';

  return (
    <MainLayout
      currentPage={current.page}
      onNavigate={p => { if (p === 'home') goHome(); }}
    >
      {current.page === 'player' ? (
        <PlayerPage
          nom={current.nom}
          backLabel={backLabel}
          onBack={pop}
          onPlayerClick={handlePlayerClick}
          onTournoiClick={handleTournoiClick}
        />
      ) : current.page === 'tournament' ? (
        <TournamentPage
          id={current.id}
          nom={current.nom}
          backLabel={backLabel}
          onBack={pop}
          onPlayerClick={handlePlayerClick}
          onTournoiClick={handleTournoiClick}
        />
      ) : (
        <HomePage
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
          onPlayerClick={handlePlayerClick}
          onTournoiClick={handleTournoiClick}
        />
      )}
    </MainLayout>
  );
};

export default App;
