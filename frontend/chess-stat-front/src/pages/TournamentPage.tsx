// ─────────────────────────────────────────
//  Chess Stats — TournamentPage (données API)
// ─────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import type { ApiTournoiStats } from '../types';
import { fetchTournoiStats } from '../api';

interface TournamentPageProps {
  id: number;
  nom: string;
  onBack: () => void;
}

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

export const TournamentPage: React.FC<TournamentPageProps> = ({ id, nom, onBack }) => {
  const [stats, setStats]   = useState<ApiTournoiStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchTournoiStats(id)
      .then(s => setStats(s))
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

          {/* Content */}
          <div style={{ padding: '28px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Stats grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 14,
            }}>
              <StatCard label="Total parties"     value={totalParties}                  />
              <StatCard label="Victoires blancs"  value={stats.nbVictoiresBlancs}       />
              <StatCard label="Victoires noirs"   value={stats.nbVictoiresNoirs}        />
              <StatCard label="Nulles"             value={stats.nbNulles}               />
              {stats.nbrJoueurs != null && (
                <StatCard label="Joueurs"          value={stats.nbrJoueurs}             />
              )}
              {stats.classementMoyen != null && (
                <StatCard label="ELO moyen"        value={stats.classementMoyen}        />
              )}
            </div>

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
