// ─────────────────────────────────────────
//  Chess Stats — PlayerPage (données API)
// ─────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import type { ApiJoueurStats, ApiPartie, ApiOuverture, ApiTournoi } from '../types';
import { fetchJoueurStats, fetchJoueurParties, fetchJoueurOuvertures, fetchJoueurTournois } from '../api';

interface PlayerPageProps {
  nom: string;
  backLabel?: string;
  onBack: () => void;
  onPlayerClick:  (nom: string) => void;
  onTournoiClick: (id: number, nom: string) => void;
}

type PlayerTab = 'parties' | 'ouvertures' | 'tournois';

// ── Composants utilitaires ────────────────────────────────────────────────────

const StatCard: React.FC<{ label: string; value: string | number; accent?: boolean }> = ({
  label, value, accent,
}) => (
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
      fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 700,
      color: accent ? 'var(--c8)' : 'var(--c11)',
    }}>
      {value}
    </div>
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div style={{
    background: 'var(--c0)', border: '1px solid var(--c3)',
    borderRadius: 10, padding: '32px', textAlign: 'center',
    color: 'var(--c7)', fontSize: 14,
  }}>
    {message}
  </div>
);

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

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatResultat(partie: ApiPartie, nomJoueur: string): { label: string; color: string } {
  const estBlanc = partie.joueurBlancs?.nomComplet === nomJoueur;
  const estNoir  = partie.joueurNoirs?.nomComplet  === nomJoueur;

  if (partie.resultat === 0) return { label: 'Nulle',  color: '#94a3b8' };
  if (estBlanc) return partie.resultat === 1  ? { label: 'Victoire', color: '#10b981' } : { label: 'Défaite', color: '#ef4444' };
  if (estNoir)  return partie.resultat === -1 ? { label: 'Victoire', color: '#10b981' } : { label: 'Défaite', color: '#ef4444' };
  if (partie.resultat === 1)  return { label: 'Blancs gagnent', color: '#10b981' };
  if (partie.resultat === -1) return { label: 'Noirs gagnent',  color: '#10b981' };
  return { label: '—', color: '#94a3b8' };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export const PlayerPage: React.FC<PlayerPageProps> = ({
  nom, backLabel = '← Retour', onBack, onPlayerClick, onTournoiClick,
}) => {
  const [stats,      setStats]      = useState<ApiJoueurStats | null>(null);
  const [parties,    setParties]    = useState<ApiPartie[]>([]);
  const [ouvertures, setOuvertures] = useState<ApiOuverture[]>([]);
  const [tournois,   setTournois]   = useState<ApiTournoi[]>([]);
  const [tab,        setTab]        = useState<PlayerTab>('parties');
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    setTab('parties');
    Promise.all([
      fetchJoueurStats(nom),
      fetchJoueurParties(nom).catch(() => [] as ApiPartie[]),
      fetchJoueurOuvertures(nom).catch(() => [] as ApiOuverture[]),
      fetchJoueurTournois(nom).catch(() => [] as ApiTournoi[]),
    ])
      .then(([s, p, ouv, trn]) => {
        setStats(s);
        setParties(p);
        setOuvertures(ouv);
        setTournois(trn);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [nom]);

  const initial = nom.charAt(0).toUpperCase();

  const tabCounts: Record<PlayerTab, number> = {
    parties: parties.length, ouvertures: ouvertures.length, tournois: tournois.length,
  };
  const tabLabels: Record<PlayerTab, string> = {
    parties: 'Parties', ouvertures: 'Ouvertures', tournois: 'Tournois',
  };

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

      {loading && <div style={{ padding: 48, textAlign: 'center', color: 'var(--c7)' }}>Chargement…</div>}
      {error   && <div style={{ padding: 48, textAlign: 'center', color: '#ef4444' }}>Erreur : {error}</div>}

      {!loading && !error && stats && (
        <>
          {/* Hero */}
          <div style={{
            background: 'linear-gradient(160deg, var(--c11) 0%, #2a4490 60%, var(--c10) 100%)',
            padding: '40px 40px 36px',
            display: 'flex', alignItems: 'center', gap: 32,
            position: 'relative', overflow: 'hidden',
          }}>
            <div aria-hidden style={{
              position: 'absolute', right: 40, top: 10,
              fontSize: 200, opacity: .04, color: 'white',
              lineHeight: 1, pointerEvents: 'none',
            }}>♟</div>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--c5), var(--c7))',
              border: '4px solid rgba(255,255,255,.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--serif)', fontSize: 42, color: 'var(--c11)',
              fontWeight: 700, flexShrink: 0,
            }}>
              {initial}
            </div>
            <div>
              <h1 style={{
                fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 700,
                color: 'white', marginBottom: 8,
              }}>
                {stats.nomComplet}
              </h1>
              {stats.eloMoyen != null && (
                <div style={{ color: 'var(--c5)', fontSize: 15 }}>
                  ELO moyen : <strong style={{ color: 'white' }}>{stats.eloMoyen}</strong>
                </div>
              )}
            </div>
          </div>

          <div style={{ padding: '28px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
              <StatCard label="Parties"    value={stats.nbParties}   />
              <StatCard label="Victoires"  value={stats.nbVictoires} accent />
              <StatCard label="Nulles"     value={stats.nbNulles}    />
              <StatCard label="Défaites"   value={stats.nbDefaites}  />
              {stats.tauxVictoire != null && (
                <StatCard label="Taux de victoire" value={stats.tauxVictoire.toFixed(1) + ' %'} accent />
              )}
              {stats.eloMoyen != null && (
                <StatCard label="ELO moyen" value={stats.eloMoyen} />
              )}
            </div>

            {/* Tab bar */}
            <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--c3)' }}>
              {(['parties', 'ouvertures', 'tournois'] as PlayerTab[]).map(t => {
                const active = tab === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      padding: '10px 20px', border: 'none',
                      borderBottom: active ? '2px solid var(--c8)' : '2px solid transparent',
                      marginBottom: -2, background: 'transparent', cursor: 'pointer',
                      fontSize: 14, fontWeight: active ? 600 : 400,
                      color: active ? 'var(--c8)' : 'var(--c7)',
                      borderRadius: '6px 6px 0 0', transition: 'color .15s',
                    }}
                  >
                    {tabLabels[t]} ({tabCounts[t]})
                  </button>
                );
              })}
            </div>

            {/* ── Onglet Parties ── */}
            {tab === 'parties' && (
              parties.length > 0 ? (
                <div style={{ background: 'var(--c0)', border: '1px solid var(--c3)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                      <thead>
                        <tr style={{ background: 'var(--c1)' }}>
                          {['Date', 'Blancs', 'Noirs', 'Résultat', 'Ouverture', 'Tournoi', 'Ronde'].map(h => (
                            <th key={h} style={{
                              padding: '11px 16px', textAlign: 'left',
                              fontSize: 11, fontWeight: 600, letterSpacing: '.06em',
                              textTransform: 'uppercase', color: 'var(--c7)',
                              borderBottom: '1px solid var(--c3)', whiteSpace: 'nowrap',
                            }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parties.map(p => {
                          const res       = formatResultat(p, nom);
                          const nomBlancs = p.joueurBlancs?.nomComplet;
                          const nomNoirs  = p.joueurNoirs?.nomComplet;
                          return (
                            <tr key={p.id} style={{ borderBottom: '1px solid var(--c2)' }}>
                              <td style={{ padding: '11px 16px', color: 'var(--c7)', whiteSpace: 'nowrap' }}>
                                {p.datePartie ?? '—'}
                              </td>
                              <td style={{ padding: '11px 16px' }}>
                                {nomBlancs
                                  ? <NavLink onClick={() => onPlayerClick(nomBlancs)} bold={nomBlancs === nom}>{nomBlancs}</NavLink>
                                  : '—'}
                              </td>
                              <td style={{ padding: '11px 16px' }}>
                                {nomNoirs
                                  ? <NavLink onClick={() => onPlayerClick(nomNoirs)} bold={nomNoirs === nom}>{nomNoirs}</NavLink>
                                  : '—'}
                              </td>
                              <td style={{ padding: '11px 16px' }}>
                                <span style={{
                                  display: 'inline-block',
                                  background: res.color + '1a', color: res.color,
                                  borderRadius: 4, padding: '2px 8px',
                                  fontSize: 12, fontWeight: 600,
                                }}>
                                  {res.label}
                                </span>
                              </td>
                              <td style={{ padding: '11px 16px', color: 'var(--c7)' }}>
                                {p.ouverture
                                  ? <>
                                      <span style={{
                                        background: 'rgba(16,185,129,.1)', color: '#059669',
                                        borderRadius: 4, padding: '2px 6px',
                                        fontSize: 11, fontWeight: 600, marginRight: 6,
                                      }}>{p.ouverture.codeEco}</span>
                                      {p.ouverture.libelle}
                                    </>
                                  : '—'}
                              </td>
                              <td style={{ padding: '11px 16px' }}>
                                {p.tournoi
                                  ? <NavLink onClick={() => onTournoiClick(p.tournoi!.id, p.tournoi!.nom)}>{p.tournoi.nom}</NavLink>
                                  : '—'}
                              </td>
                              <td style={{ padding: '11px 16px', color: 'var(--c7)', textAlign: 'center' }}>
                                {p.ronde ?? '—'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <EmptyState message="Aucune partie enregistrée pour ce joueur." />
              )
            )}

            {/* ── Onglet Ouvertures ── */}
            {tab === 'ouvertures' && (
              ouvertures.length > 0 ? (
                <div style={{ background: 'var(--c0)', border: '1px solid var(--c3)', borderRadius: 10, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr style={{ background: 'var(--c1)' }}>
                        {['ECO', 'Ouverture', 'Parties jouées', 'Victoires'].map(h => (
                          <th key={h} style={{
                            padding: '11px 16px', textAlign: 'left',
                            fontSize: 11, fontWeight: 600, letterSpacing: '.06em',
                            textTransform: 'uppercase', color: 'var(--c7)',
                            borderBottom: '1px solid var(--c3)',
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ouvertures.map((o, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--c2)' }}>
                          <td style={{ padding: '11px 16px' }}>
                            <span style={{
                              background: 'rgba(16,185,129,.1)', color: '#059669',
                              borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600,
                            }}>{o.codeEco}</span>
                          </td>
                          <td style={{ padding: '11px 16px', color: 'var(--c11)', fontWeight: 500 }}>{o.libelle}</td>
                          <td style={{ padding: '11px 16px', color: 'var(--c11)', fontWeight: 600 }}>{o.nbParties}</td>
                          <td style={{ padding: '11px 16px', color: 'var(--c7)' }}>{o.nbVictoires ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState message="Aucune ouverture enregistrée pour ce joueur." />
              )
            )}

            {/* ── Onglet Tournois ── */}
            {tab === 'tournois' && (
              tournois.length > 0 ? (
                <div style={{ background: 'var(--c0)', border: '1px solid var(--c3)', borderRadius: 10, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr style={{ background: 'var(--c1)' }}>
                        {['Date', 'Tournoi', 'Pays', 'Joueurs', 'ELO moyen'].map(h => (
                          <th key={h} style={{
                            padding: '11px 16px', textAlign: 'left',
                            fontSize: 11, fontWeight: 600, letterSpacing: '.06em',
                            textTransform: 'uppercase', color: 'var(--c7)',
                            borderBottom: '1px solid var(--c3)', whiteSpace: 'nowrap',
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tournois.map(t => (
                        <tr key={t.id} style={{ borderBottom: '1px solid var(--c2)' }}>
                          <td style={{ padding: '11px 16px', color: 'var(--c7)', whiteSpace: 'nowrap' }}>
                            {t.date ?? '—'}
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            <NavLink onClick={() => onTournoiClick(t.id, t.nom)}>{t.nom}</NavLink>
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            {t.pays?.code ? (
                              <span style={{
                                background: 'var(--c2)', color: 'var(--c7)',
                                borderRadius: 4, padding: '2px 7px',
                                fontSize: 11, fontWeight: 600,
                                letterSpacing: '.04em', textTransform: 'uppercase',
                              }}>{t.pays.code}</span>
                            ) : '—'}
                          </td>
                          <td style={{ padding: '11px 16px', color: 'var(--c7)' }}>{t.nbrJoueurs ?? '—'}</td>
                          <td style={{ padding: '11px 16px', color: 'var(--c7)' }}>{t.classementMoyen ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState message="Aucun tournoi enregistré pour ce joueur." />
              )
            )}

          </div>
        </>
      )}
    </div>
  );
};
