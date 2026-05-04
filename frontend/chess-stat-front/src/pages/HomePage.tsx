// ─────────────────────────────────────────
//  Chess Stats — HomePage
// ─────────────────────────────────────────

import React, { useMemo } from 'react';
import type { Player, ActiveFilters, TabType } from '../types';
import { PLAYERS, TOURNAMENTS } from '../data';
import { Hero } from '../components/Hero';
import { StatsStrip } from '../components/StatsStrip';
import { FiltersBar } from '../components/FiltersBar';
import { ResultsTabs } from '../components/ResultsTabs';

interface HomePageProps {
  activeFilters: ActiveFilters;
  onFilterToggle: (key: string) => void;
  onFilterReset: () => void;
  onQuickFilter: (key: string, tab: TabType) => void;
  onPlayerClick: (player: Player) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  activeFilters,
  onFilterToggle,
  onFilterReset,
  onQuickFilter,
  onPlayerClick,
}) => {
  const filteredPlayers = useMemo(() => {
    let list = [...PLAYERS];
    if (activeFilters.france)  list = list.filter((p) => p.pays === 'France');
    if (activeFilters.norvege) list = list.filter((p) => p.pays === 'Norvège');
    if (activeFilters.elo2700) list = list.filter((p) => p.elo > 2700);
    if (activeFilters.top10)   list = list.filter((p) => p.rank <= 10);
    return list;
  }, [activeFilters]);

  const filteredTournaments = useMemo(() => {
    let list = [...TOURNAMENTS];
    if (activeFilters.tournois2026) list = list.filter((t) => t.date.includes('2026'));
    return list;
  }, [activeFilters]);

  function handleSearch(query: string, type: TabType) {
    // In a real app: dispatch a search action / update URL params
    console.log('Search:', query, type);
  }

  return (
    <>
      <Hero onSearch={handleSearch} onQuickFilter={onQuickFilter} />
      <StatsStrip />
      <FiltersBar
        activeFilters={activeFilters}
        onToggle={onFilterToggle}
        onReset={onFilterReset}
      />
      <ResultsTabs
        players={filteredPlayers}
        tournaments={filteredTournaments}
        onPlayerClick={onPlayerClick}
      />
    </>
  );
};
