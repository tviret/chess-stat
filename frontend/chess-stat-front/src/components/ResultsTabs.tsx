// ─────────────────────────────────────────
//  Chess Stats — ResultsTabs (3 onglets + API)
// ─────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import type { FilterState, TabType, ApiJoueur, ApiTournoi, ApiOuverture } from '../types';
import {
  fetchJoueurs, fetchTournois,
  fetchJoueurOuvertures, fetchTournoiStats, fetchOuverturesByPays, fetchOuvertures,
} from '../api';
import { PlayerCard } from './PlayerCard';
import { TournamentCard } from './TournamentCard';
import { Pagination } from './Pagination';

const PAGE_SIZE = 20;

interface ResultsTabsProps {
  filters: FilterState | null;  // null = pas encore recherché
  onPlayerClick: (nom: string) => void;
  onTournoiClick: (id: number, nom: string) => void;
}

type LoadState = 'idle' | 'loading' | 'error';

const Empty: React.FC<{ message: string }> = ({ message }) => (
  <div style={{ padding: '48px', textAlign: 'center', color: 'var(--c7)' }}>
    <div style={{ fontSize: 48, opacity: .4, marginBottom: 12 }}>♟</div>
    <div style={{ fontSize: 14 }}>{message}</div>
  </div>
);

const Spinner: React.FC = () => (
  <div style={{ padding: '48px', textAlign: 'center', color: 'var(--c7)' }}>
    <div style={{ fontSize: 14 }}>Chargement…</div>
  </div>
);

export const ResultsTabs: React.FC<ResultsTabsProps> = ({
  filters, onPlayerClick, onTournoiClick,
}) => {
  const [tab, setTab]           = useState<TabType>('joueurs');
  const [page, setPage]         = useState(1);

  const [joueurs, setJoueurs]           = useState<ApiJoueur[]>([]);
  const [tournois, setTournois]         = useState<ApiTournoi[]>([]);
  const [ouvertures, setOuvertures]     = useState<ApiOuverture[]>([]);

  const [joueurState, setJoueurState]       = useState<LoadState>('idle');
  const [tournoiState, setTournoiState]     = useState<LoadState>('idle');
  const [ouvertureState, setOuvertureState] = useState<LoadState>('idle');

  const [joueurError, setJoueurError]       = useState('');
  const [tournoiError, setTournoiError]     = useState('');
  const [ouvertureError, setOuvertureError] = useState('');

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [filters]);

  // Fetch joueurs on mount and whenever filters change
  useEffect(() => {
    if (filters === null) return;
    setJoueurState('loading');
    fetchJoueurs({
      nom:     filters.joueur   || undefined,
      pays:    filters.pays     || undefined,
      tournoi: filters.tournoi  || undefined,
      eloMin:  filters.eloMin   || undefined,
      eloMax:  filters.eloMax   || undefined,
    })
      .then(data => { setJoueurs(data); setJoueurState('idle'); })
      .catch(e => { setJoueurError(e.message); setJoueurState('error'); });
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch tournois on mount and whenever filters change
  useEffect(() => {
    if (filters === null) return;
    setTournoiState('loading');
    fetchTournois({
      pays:  filters.pays      || undefined,
      debut: filters.dateDebut || undefined,
      fin:   filters.dateFin   || undefined,
    })
      .then(data => {
        const filtered = filters.tournoi
          ? data.filter(t => String(t.id) === filters.tournoi)
          : data;
        setTournois(filtered);
        setTournoiState('idle');
      })
      .catch(e => { setTournoiError(e.message); setTournoiState('error'); });
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch ouvertures on mount and whenever filters change
  useEffect(() => {
    if (filters === null) return;
    setOuvertureState('loading');

    const promise = filters.joueur
      ? fetchJoueurOuvertures(filters.joueur)
      : filters.tournoi
        ? fetchTournoiStats(Number(filters.tournoi)).then(s => s.topOuvertures || [])
        : filters.pays
          ? fetchOuverturesByPays(filters.pays)
          : fetchOuvertures();

    promise
      .then(data => { setOuvertures(data); setOuvertureState('idle'); })
      .catch(e => { setOuvertureError(e.message); setOuvertureState('error'); });
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  function switchTab(t: TabType) {
    setTab(t);
    setPage(1);
  }

  const TAB_LABELS: Record<TabType, string> = {
    joueurs:    'Joueurs',
    tournois:   'Tournois',
    ouvertures: 'Ouvertures',
  };

  const tabCount: Record<TabType, number> = {
    joueurs:    joueurs.length,
    tournois:   tournois.length,
    ouvertures: ouvertures.length,
  };

  const totalPages = Math.max(1, Math.ceil(
    (tab === 'joueurs' ? joueurs.length : tab === 'tournois' ? tournois.length : ouvertures.length) / PAGE_SIZE
  ));

  const pagedJoueurs    = joueurs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pagedTournois   = tournois.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pagedOuvertures = ouvertures.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Tabs bar */}
      <div style={{
        background: 'var(--c0)',
        borderBottom: '2px solid var(--c3)',
        display: 'flex', alignItems: 'flex-end',
        padding: '0 28px',
      }}>
        {(['joueurs', 'tournois', 'ouvertures'] as TabType[]).map(t => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            style={{
              padding: '14px 20px',
              border: 'none',
              background: 'transparent',
              fontFamily: 'var(--sans)',
              fontSize: 14,
              fontWeight: tab === t ? 600 : 500,
              color: tab === t ? 'var(--c11)' : 'var(--c7)',
              cursor: 'pointer',
              borderBottom: tab === t ? '3px solid var(--c8)' : '3px solid transparent',
              marginBottom: -2,
              transition: 'color .2s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {TAB_LABELS[t]}
            {filters !== null && (
              <span style={{
                background: tab === t ? 'var(--c8)' : 'var(--c3)',
                color: tab === t ? 'white' : 'var(--c9)',
                borderRadius: 10, padding: '1px 7px',
                fontSize: 11, fontWeight: 600,
              }}>
                {tabCount[t]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div style={{ padding: '24px 28px 48px' }}>

        {/* JOUEURS */}
        {tab === 'joueurs' && (
          joueurState === 'loading' ? <Spinner /> :
          joueurState === 'error'   ? <Empty message={`Erreur : ${joueurError}`} /> :
          joueurs.length === 0      ? <Empty message="Aucun joueur trouvé" /> :
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
            }}>
              {pagedJoueurs.map(j => (
                <PlayerCard key={j.nomComplet} joueur={j} onClick={onPlayerClick} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            )}
          </>
        )}

        {/* TOURNOIS */}
        {tab === 'tournois' && (
          tournoiState === 'loading' ? <Spinner /> :
          tournoiState === 'error'   ? <Empty message={`Erreur : ${tournoiError}`} /> :
          tournois.length === 0      ? <Empty message="Aucun tournoi trouvé" /> :
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: 12,
            }}>
              {pagedTournois.map(t => (
                <TournamentCard key={t.id} tournoi={t} onClick={onTournoiClick} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            )}
          </>
        )}

        {/* OUVERTURES */}
        {tab === 'ouvertures' && (
          ouvertureState === 'loading' ? <Spinner /> :
          ouvertureState === 'error'   ? <Empty message={`Erreur : ${ouvertureError}`} /> :
          ouvertures.length === 0      ? <Empty message="Aucune ouverture trouvée" /> :
          <div style={{
            background: 'var(--c0)',
            border: '1px solid var(--c3)',
            borderRadius: 10,
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--c1)' }}>
                  {['ECO', 'Ouverture', 'Parties', 'Victoires'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left',
                      fontSize: 11, fontWeight: 600,
                      letterSpacing: '.06em', textTransform: 'uppercase',
                      color: 'var(--c7)', borderBottom: '1px solid var(--c3)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedOuvertures.map((o, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--c2)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        background: 'rgba(16,185,129,.1)', color: '#059669',
                        borderRadius: 4, padding: '2px 8px',
                        fontSize: 12, fontWeight: 600,
                      }}>{o.codeEco}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--c11)', fontWeight: 500 }}>{o.libelle}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--c7)' }}>{o.nbParties}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--c7)' }}>{o.nbVictoires ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div style={{ padding: '0 28px 20px' }}>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
