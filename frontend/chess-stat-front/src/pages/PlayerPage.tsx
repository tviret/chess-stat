// ─────────────────────────────────────────
//  Chess Stats — PlayerPage (données API)
// ─────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import type { ApiJoueurStats, ApiOuverture } from '../types';
import { fetchJoueurStats, fetchJoueurOuvertures } from '../api';

interface PlayerPageProps {
  nom: string;
  onBack: () => void;
}

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

export const PlayerPage: React.FC<PlayerPageProps> = ({ nom, onBack }) => {
  const [stats, setStats]           = useState<ApiJoueurStats | null>(null);
  const [ouvertures, setOuvertures] = useState<ApiOuverture[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      fetchJoueurStats(nom),
      fetchJoueurOuvertures(nom).catch(() => [] as ApiOuverture[]),
    ])
      .then(([s, ouv]) => {
        setStats(s);
        setOuvertures(ouv);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [nom]);

  const initial = nom.charAt(0).toUpperCase();

  return (
    <div style={{ background: 'var(--c1)', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{
        padding: '14px 40px', display: 'flex', alignItems: 'center',
        gap: 8, fontSize: 13, color: 'var(--c7)',
        background: 'var(--c0)', borderBottom: '1px solid var(--c3)',
      }}>
        <span
          onClick={onBack}
          style={{ color: 'var(--c8)', cursor: 'pointer' }}
        >
          ← Retour aux résultats
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
            display: 'flex', alignItems: 'center', gap: 32,
            position: 'relative', overflow: 'hidden',
          }}>
            <div aria-hidden style={{
              position: 'absolute', right: 40, top: 10,
              fontSize: 200, opacity: .04, color: 'white',
              lineHeight: 1, pointerEvents: 'none',
            }}>♟</div>

            {/* Avatar */}
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

          {/* Stats grid */}
          <div style={{ padding: '28px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 14,
            }}>
              <StatCard label="Parties"        value={stats.nbParties}   />
              <StatCard label="Victoires"       value={stats.nbVictoires} accent />
              <StatCard label="Nulles"          value={stats.nbNulles}    />
              <StatCard label="Défaites"        value={stats.nbDefaites}  />
              {stats.tauxVictoire != null && (
                <StatCard
                  label="Taux de victoire"
                  value={stats.tauxVictoire.toFixed(1) + ' %'}
                  accent
                />
              )}
              {stats.eloMoyen != null && (
                <StatCard label="ELO moyen" value={stats.eloMoyen} />
              )}
            </div>

            {/* Ouvertures */}
            {ouvertures.length > 0 && (
              <div style={{
                background: 'var(--c0)', border: '1px solid var(--c3)',
                borderRadius: 10, overflow: 'hidden',
              }}>
                <div style={{
                  padding: '16px 22px', borderBottom: '1px solid var(--c3)',
                  fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 600, color: 'var(--c11)',
                }}>
                  Ouvertures jouées
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
                    {ouvertures.map((o, i) => (
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
