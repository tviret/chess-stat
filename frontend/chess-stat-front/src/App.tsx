// ─────────────────────────────────────────
//  Chess Stats — App.tsx
// ─────────────────────────────────────────

import React, { useState, useCallback } from 'react';
import type { PageType, FilterState } from './types';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { PlayerPage } from './pages/PlayerPage';
import { TournamentPage } from './pages/TournamentPage';

const EMPTY_FILTERS: FilterState = {
  joueur: '', pays: '', tournoi: '', eloMin: '', eloMax: '', dateDebut: '', dateFin: '',
};

const App: React.FC = () => {
  const [page, setPage]             = useState<PageType>('home');
  const [playerNom, setPlayerNom]   = useState('');
  const [tournoiSel, setTournoiSel] = useState<{ id: number; nom: string } | null>(null);
  const [filters, setFilters]       = useState<FilterState>(EMPTY_FILTERS);

  const goHome = useCallback(() => setPage('home'), []);

  const handlePlayerClick = useCallback((nom: string) => {
    setPlayerNom(nom);
    setPage('player');
  }, []);

  const handleTournoiClick = useCallback((id: number, nom: string) => {
    setTournoiSel({ id, nom });
    setPage('tournament');
  }, []);

  const handleSearch = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, joueur: query }));
  }, []);

  return (
    <MainLayout currentPage={page} onNavigate={(p) => { if (p === 'home') goHome(); }}>
      {page === 'player' ? (
        <PlayerPage nom={playerNom} onBack={goHome} />
      ) : page === 'tournament' && tournoiSel ? (
        <TournamentPage id={tournoiSel.id} nom={tournoiSel.nom} onBack={goHome} />
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
