// ─────────────────────────────────────────
//  Chess Stats — HomePage
// ─────────────────────────────────────────

import React, { useEffect, useState, useCallback } from 'react';
import type { FilterState, ApiPays, ApiTournoi } from '../types';
import { fetchPays, fetchTournois } from '../api';
import { Hero } from '../components/Hero';
import { StatsStrip } from '../components/StatsStrip';
import { Sidebar } from '../components/Sidebar';
import { ResultsTabs } from '../components/ResultsTabs';

interface HomePageProps {
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  onSearch: (query: string) => void;
  onPlayerClick: (nom: string) => void;
  onTournoiClick: (id: number, nom: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  filters, onFiltersChange, onSearch, onPlayerClick, onTournoiClick,
}) => {
  const [paysList, setPaysList]       = useState<ApiPays[]>([]);
  const [tournoiList, setTournoiList] = useState<ApiTournoi[]>([]);
  const [applied, setApplied]         = useState<FilterState | null>(null);

  // Populate sidebar selects on mount
  useEffect(() => {
    fetchPays()
      .then(p => setPaysList(p.sort((a, b) => a.nom.localeCompare(b.nom))))
      .catch(console.warn);
    fetchTournois()
      .then(t => setTournoiList(t.sort((a, b) => a.nom.localeCompare(b.nom))))
      .catch(console.warn);
  }, []);

  const handleApply = useCallback((override?: FilterState) => {
    const toApply = override ?? { ...filters };
    if (override) onFiltersChange(override);
    setApplied(toApply);
  }, [filters, onFiltersChange]);

  const handleReset = useCallback(() => {
    const empty: FilterState = {
      joueur: '', pays: '', tournoi: '', eloMin: '', eloMax: '', dateDebut: '', dateFin: '',
    };
    onFiltersChange(empty);
    setApplied(null);
  }, [onFiltersChange]);

  function handleHeroSearch(query: string) {
    onSearch(query);
    const next = { ...filters, joueur: query };
    onFiltersChange(next);
    setApplied(next);
  }

  return (
    <>
      <Hero onSearch={handleHeroSearch} />
      <StatsStrip />
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        minHeight: 'calc(100vh - 240px)',
        alignItems: 'start',
      }}>
        <Sidebar
          filters={filters}
          paysList={paysList}
          tournoiList={tournoiList}
          onChange={onFiltersChange}
          onApply={handleApply}
          onReset={handleReset}
        />
        <ResultsTabs
          filters={applied}
          onPlayerClick={onPlayerClick}
          onTournoiClick={onTournoiClick}
        />
      </div>
    </>
  );
};
