// ─────────────────────────────────────────
//  Chess Stats — ResultsTabs component
// ─────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import type { Player, Tournament, TabType, SortType } from '../types';
import { PlayerCard } from './PlayerCard';
import { TournamentCard } from './TournamentCard';
import { Pagination } from './Pagination';

const PAGE_SIZE = 12;

const SORT_OPTIONS: { key: SortType; label: string }[] = [
  { key: 'elo',  label: 'Élo'  },
  { key: 'nom',  label: 'Nom'  },
  { key: 'pays', label: 'Pays' },
];

interface ResultsTabsProps {
  players: Player[];
  tournaments: Tournament[];
  onPlayerClick: (player: Player) => void;
}

export const ResultsTabs: React.FC<ResultsTabsProps> = ({
  players,
  tournaments,
  onPlayerClick,
}) => {
  const [tab, setTab]   = useState<TabType>('joueurs');
  const [sort, setSort] = useState<SortType>('elo');
  const [page, setPage] = useState(1);

  const sortedPlayers = useMemo(() => {
    const list = [...players];
    if (sort === 'nom')  list.sort((a, b) => a.nom.localeCompare(b.nom));
    else if (sort === 'pays') list.sort((a, b) => a.pays.localeCompare(b.pays));
    else list.sort((a, b) => b.elo - a.elo);
    return list;
  }, [players, sort]);

  const totalPages = Math.max(1, Math.ceil(
    (tab === 'joueurs' ? sortedPlayers : tournaments).length / PAGE_SIZE
  ));

  const pagedPlayers     = sortedPlayers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pagedTournaments = tournaments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function switchTab(t: TabType) {
    setTab(t);
    setPage(1);
  }

  return (
    <>
      {/* Tabs bar */}
      <div style={{
        padding: '0 48px', background: 'var(--c0)',
        borderBottom: '2px solid var(--c3)',
        display: 'flex', alignItems: 'flex-end',
      }}>
        {(['joueurs', 'tournois'] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            style={{
              padding: '14px 22px', border: 'none', background: 'transparent',
              fontFamily: 'var(--sans)', fontSize: 14,
              fontWeight: tab === t ? 600 : 500,
              color: tab === t ? 'var(--c11)' : 'var(--c7)',
              cursor: 'pointer',
              borderBottom: tab === t ? '3px solid var(--c8)' : '3px solid transparent',
              marginBottom: -2, transition: 'color .2s',
            }}
          >
            {t === 'joueurs' ? 'Joueurs' : 'Tournois'}
            <span style={{
              display: 'inline-block', background: 'var(--c3)', color: 'var(--c9)',
              borderRadius: 10, padding: '1px 7px', fontSize: 11,
              fontWeight: 600, marginLeft: 5,
            }}>
              {t === 'joueurs' ? players.length : tournaments.length}
            </span>
          </button>
        ))}

        {/* Sort (joueurs only) */}
        {tab === 'joueurs' && (
          <div style={{
            marginLeft: 'auto', display: 'flex', gap: 6,
            alignItems: 'center', paddingBottom: 8,
          }}>
            <span style={{ fontSize: 12, color: 'var(--c7)' }}>Trier par</span>
            {SORT_OPTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                style={{
                  border: sort === s.key ? '1px solid var(--c8)' : '1px solid var(--c4)',
                  borderRadius: 4,
                  background: sort === s.key ? 'var(--c3)' : 'white',
                  padding: '3px 10px', fontSize: 12,
                  fontFamily: 'var(--sans)', cursor: 'pointer',
                  color: sort === s.key ? 'var(--c9)' : 'var(--c11)',
                  fontWeight: 500,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results grid */}
      <div style={{ padding: '28px 48px 48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 14,
        }}>
          {tab === 'joueurs'
            ? pagedPlayers.map((p) => (
                <PlayerCard key={p.id} player={p} onClick={onPlayerClick} />
              ))
            : pagedTournaments.map((t) => (
                <TournamentCard key={t.id} tournament={t} />
              ))
          }
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </>
  );
};
