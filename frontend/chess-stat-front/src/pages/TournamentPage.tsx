// ─────────────────────────────────────────
//  Chess Stats — TournamentPage (données API)
// ─────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import type { ApiTournoiStats, ApiParticipation } from '../types';
import { fetchTournoiStats, fetchTournoiParticipations } from '../api';

interface TournamentPageProps {
  id: number;
  nom: string;
  backLabel?: string;
  onBack: () => void;
  onPlayerClick:  (nom: string) => void;
  onTournoiClick: (id: number, nom: string) => void;
}

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode; bold?: boolean }> = ({
  onClick, children, bold,
}) => (
  <span
    onClick={onClick}
    style={{
      color: 'var(--c8)', cursor: 'pointer', fontWeight: bold ? 700 : 400,
      textDecoration: 'underline', textDecorationColor: 'transparent',
      transition: 'text-decoration-color .15s',
    }}
    onMouseEnter={e => (e.currentTarget.style.textDecorationColor = 'var(--c8)')}
    onMouseLeave={e => (e.currentTarget.style.textDecorationColor = 'transparent')}
  >
    {children}
  </span>
);

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div style={{
    background: 'var(--c0)', border: '1px solid var(--c3)',
    borderRadius: 10, padding: '20px 22px',
  }}>
    <div style={{
      fontSize: 11, color: 'var(--c7)', fontWeight: 600,
      letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6,
    }}>
      {label}
    </div>
    <div style={{
      fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 700, color: 'var(--c11)',
    }}>
      {value}
    </div>
  </div>
);

function medalColor(rank: number): string {
  if (rank === 1) return '#f59e0b';
  if (rank === 2) return '#94a3b8';
  if (rank === 3) return '#b45309';
  return 'transparent';
}

export const TournamentPage: React.FC<TournamentPageProps> = ({
  id, nom, backLabel = '← Retour', onBack, onPlayerClick,
}) => {
  const [stats,          setStats]          = useState<ApiTournoiStats | null>(null);
  const [participations, setParticipations] = useState<ApiParticipation[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      fetchTournoiStats(id),
      fetchTournoiParticipations(id).catch(() => [] as ApiParticipation[]),
    ])
      .then(([s, p]) => {
        setStats(s);
        // tri décroissant par points marqués
        const sorted = [...p].sort((a, b) => (b.pointsMarques ?? 0) - (a.pointsMarques ?? 0));
        setParticipations(sorted);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const totalParties = stats
    ? (stats.nbVictoiresBlancs || 0) + (stats.nbVictoiresNoirs || 0) + (stats.nbNulles || 0)
    : 0;

  return (
    <div style={{ background: 'var(--c1)', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{
        padding: '14px 40px', display: 'flex', alignItems: 'center',
        gap: 8, fontSize: 13, color: 'var(--c7)',
        background: 'var(--c0)', borderBottom: '1px solid var(--c3)',
      }}>
        <span onClick={onBack} style={{ color: 'var(--c8)', cursor: 'pointer' }}>
          {backLabel}
        </span>
        <span>/</span>
        <span>{nom}</span>
      </div>

      {loading && (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--c7)' }}>Chargement…</div>
      )}

      {error && (
        <div style={{ padding: 48, textAlign: 'center', color: '#ef4444' }}>
          Erreur : {error}
        </div>
      )}

      {!loading && !error && stats && (
        <>
          {/* Hero */}
          <div style={{
            background: 'linear-gradient(160deg, var(--c11) 0%, #2a4490 60%, var(--c10) 100%)',
            padding: '40px 40px 36px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div aria-hidden style={{
              position: 'absolute', right: 40, top: 10,
              fontSize: 200, opacity: .04, color: 'white',
              lineHeight: 1, pointerEvents: 'none',
            }}>♟</div>
            <h1 style={{
              fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 700,
              color: 'white', marginBottom: 8,
            }}>
              {stats.nom}
            </h1>
          </div>

          <div style={{ padding: '28px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Stats grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 14,
            }}>
              <StatCard label="Total parties"    value={totalParties}            />
              <StatCard label="Victoires blancs" value={stats.nbVictoiresBlancs} />
              <StatCard label="Victoires noirs"  value={stats.nbVictoiresNoirs}  />
              <StatCard label="Nulles"           value={stats.nbNulles}          />
              {stats.nbrJoueurs != null && (
                <StatCard label="Joueurs"        value={stats.nbrJoueurs}        />
              )}
              {stats.classementMoyen != null && (
                <StatCard label="ELO moyen"      value={stats.classementMoyen}   />
              )}
            </div>

            {/* Classement */}
            {participations.length > 0 ? (
              <div style={{
                background: 'var(--c0)', border: '1px solid var(--c3)',
                borderRadius: 10, overflow: 'hidden',
              }}>
                <div style={{
                  padding: '16px 22px', borderBottom: '1px solid var(--c3)',
                  fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 600, color: 'var(--c11)',
                }}>
                  Classement
                  <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--c7)', marginLeft: 10 }}>
                    ({participations.length} joueurs)
                  </span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: 'var(--c1)' }}>
                      {['#', 'Joueur', 'Pays', 'ELO', 'Points'].map(h => (
                        <th key={h} style={{
                          padding: '11px 16px', textAlign: h === '#' || h === 'ELO' || h === 'Points' ? 'center' : 'left',
                          fontSize: 11, fontWeight: 600,
                          letterSpacing: '.06em', textTransform: 'uppercase',
                          color: 'var(--c7)', borderBottom: '1px solid var(--c3)',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {participations.map((p, i) => {
                      const rank  = i + 1;
                      const medal = medalColor(rank);
                      const isTop = rank <= 3;
                      return (
                        <tr
                          key={p.id}
                          style={{
                            borderBottom: '1px solid var(--c2)',
                            background: isTop ? medal + '0d' : undefined,
                          }}
                        >
                          <td style={{ padding: '11px 16px', textAlign: 'center', width: 48 }}>
                            {isTop ? (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: 26, height: 26, borderRadius: '50%',
                                background: medal, color: 'white',
                                fontSize: 12, fontWeight: 700,
                              }}>
                                {rank}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--c7)', fontWeight: 500 }}>{rank}</span>
                            )}
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            {p.joueur?.nomComplet
                              ? <NavLink onClick={() => onPlayerClick(p.joueur!.nomComplet!)} bold={isTop}>
                                  {p.joueur.nomComplet}
                                </NavLink>
                              : '—'}
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            {p.joueur?.pays?.code ? (
                              <span style={{
                                background: 'var(--c2)', color: 'var(--c7)',
                                borderRadius: 4, padding: '2px 7px',
                                fontSize: 11, fontWeight: 600, letterSpacing: '.04em',
                                textTransform: 'uppercase',
                              }}>
                                {p.joueur.pays.code}
                              </span>
                            ) : '—'}
                          </td>
                          <td style={{ padding: '11px 16px', color: 'var(--c7)', textAlign: 'center' }}>
                            {p.elo ?? '—'}
                          </td>
                          <td style={{ padding: '11px 16px', textAlign: 'center', fontWeight: 700 }}>
                            <span style={{
                              color: isTop ? medal : 'var(--c11)',
                              fontSize: isTop ? 15 : 14,
                            }}>
                              {p.pointsMarques != null ? Number(p.pointsMarques).toFixed(1) : '—'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{
                background: 'var(--c0)', border: '1px solid var(--c3)',
                borderRadius: 10, padding: '32px', textAlign: 'center',
                color: 'var(--c7)', fontSize: 14,
              }}>
                Aucune participation enregistrée pour ce tournoi.
              </div>
            )}

            {/* Top ouvertures */}
            {stats.topOuvertures && stats.topOuvertures.length > 0 && (
              <div style={{
                background: 'var(--c0)', border: '1px solid var(--c3)',
                borderRadius: 10, overflow: 'hidden',
              }}>
                <div style={{
                  padding: '16px 22px', borderBottom: '1px solid var(--c3)',
                  fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 600, color: 'var(--c11)',
                }}>
                  Ouvertures les plus jouées
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: 'var(--c1)' }}>
                      {['ECO', 'Ouverture', 'Parties', 'Victoires'].map(h => (
                        <th key={h} style={{
                          padding: '11px 16px', textAlign: 'left',
                          fontSize: 11, fontWeight: 600,
                          letterSpacing: '.06em', textTransform: 'uppercase',
                          color: 'var(--c7)', borderBottom: '1px solid var(--c3)',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topOuvertures.map((o, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--c2)' }}>
                        <td style={{ padding: '11px 16px' }}>
                          <span style={{
                            background: 'rgba(16,185,129,.1)', color: '#059669',
                            borderRadius: 4, padding: '2px 8px',
                            fontSize: 12, fontWeight: 600,
                          }}>{o.codeEco}</span>
                        </td>
                        <td style={{ padding: '11px 16px', color: 'var(--c11)', fontWeight: 500 }}>{o.libelle}</td>
                        <td style={{ padding: '11px 16px', color: 'var(--c7)' }}>{o.nbParties}</td>
                        <td style={{ padding: '11px 16px', color: 'var(--c7)' }}>{o.nbVictoires ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
};
