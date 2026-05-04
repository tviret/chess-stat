// ─────────────────────────────────────────
//  Chess Stats — PlayerPage
// ─────────────────────────────────────────

import React, { useState } from 'react';
import type { PlayerDetail } from '../types';

interface PlayerPageProps {
  player: PlayerDetail;
  onBack: () => void;
}

const ELO_PERIODS = ['2 ans', '5 ans', 'Tout'] as const;
type EloPeriod = typeof ELO_PERIODS[number];

const STAT_LABELS: Record<string, string> = {
  parties:   'Parties jouées',
  victoires: 'Taux de victoire',
  nulles:    'Nulles',
  defaites:  'Défaites',
  tournois:  'Tournois',
};

const RESULT_STYLES: Record<string, { background: string; color: string }> = {
  V: { background: '#d4edda', color: '#1a6e33' },
  N: { background: 'var(--c3)', color: 'var(--c10)' },
  D: { background: '#fde0e0', color: '#b91c1c' },
};

export const PlayerPage: React.FC<PlayerPageProps> = ({ player, onBack }) => {
  const [period, setPeriod] = useState<EloPeriod>('2 ans');
  const stats = Object.entries(player.stats) as [string, string | number][];

  return (
    <div style={{ background: 'var(--c1)', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{
        padding: '16px 40px', display: 'flex', alignItems: 'center',
        gap: 8, fontSize: 13, color: 'var(--c7)',
      }}>
        <span
          onClick={onBack}
          style={{ color: 'var(--c8)', cursor: 'pointer', textDecoration: 'none' }}
        >
          ← Retour aux résultats
        </span>
        <span>/</span>
        <span>{player.nom}</span>
      </div>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, var(--c11) 0%, #2a4490 60%, var(--c9) 100%)',
        padding: '40px 40px 0', display: 'flex', alignItems: 'flex-end',
        gap: 40, position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden style={{
          position: 'absolute', right: 60, top: 20,
          fontSize: 180, opacity: .04, color: 'white', lineHeight: 1, pointerEvents: 'none',
        }}>♟</div>

        {/* Avatar */}
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--c5), var(--c7))',
          border: '4px solid rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--serif)', fontSize: 48, color: 'var(--c11)',
          fontWeight: 700, flexShrink: 0, marginBottom: -1,
        }}>
          {player.initiale}
        </div>

        {/* Info */}
        <div style={{ paddingBottom: 28 }}>
          <div style={{
            fontFamily: 'var(--serif)', fontSize: 38, fontWeight: 700,
            color: 'white', lineHeight: 1.1, marginBottom: 6,
          }}>
            {player.nom}
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            {[`${player.flag} ${player.pays}`, `· ${player.titre}`, `· ${player.rang}`].map((b, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--c5)' }}>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Elo */}
        <div style={{ marginLeft: 'auto', paddingBottom: 28, textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 56, fontWeight: 700, color: 'white', lineHeight: 1 }}>
            {player.elo}
          </div>
          <div style={{ fontSize: 12, color: 'var(--c6)', textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 2 }}>
            Élo FIDE
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        background: 'var(--c0)', borderBottom: '1px solid var(--c3)',
        padding: '0 40px', display: 'flex',
      }}>
        {stats.map(([key, val], i) => (
          <div key={key} style={{
            padding: '20px 32px',
            paddingLeft: i === 0 ? 0 : 32,
            borderRight: i < stats.length - 1 ? '1px solid var(--c3)' : 'none',
            textAlign: i === 0 ? 'left' : 'center',
            flex: 1,
          }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 700, color: 'var(--c11)' }}>
              {String(val)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--c7)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 2 }}>
              {STAT_LABELS[key]}
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{
        padding: '32px 40px',
        display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, maxWidth: 1100,
      }}>

        {/* Main column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Elo chart card */}
          <Card title="Évolution du classement Élo" action={
            <div style={{ display: 'flex', gap: 6 }}>
              {ELO_PERIODS.map((p) => (
                <button key={p} onClick={() => setPeriod(p)} style={{
                  border: '1px solid var(--c3)', borderRadius: 4,
                  background: period === p ? 'var(--c8)' : 'transparent',
                  color: period === p ? 'white' : 'var(--c7)',
                  padding: '3px 10px', fontSize: 12, fontFamily: 'var(--sans)', cursor: 'pointer',
                }}>{p}</button>
              ))}
            </div>
          }>
            <div style={{
              height: 120,
              background: 'repeating-linear-gradient(90deg, var(--c2) 0px, var(--c2) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(0deg, var(--c2) 0px, var(--c2) 1px, transparent 1px, transparent 30px)',
              borderRadius: 6, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 140,
                background: 'linear-gradient(to bottom, rgba(61,99,221,.18), transparent)',
                clipPath: 'polygon(0% 80%, 8% 60%, 16% 70%, 24% 40%, 32% 50%, 40% 30%, 48% 45%, 56% 20%, 64% 35%, 72% 15%, 80% 25%, 88% 10%, 100% 20%, 100% 100%, 0% 100%)',
              }} />
              <div style={{
                position: 'absolute', bottom: 20, left: 0, right: 0, height: 3,
                background: 'var(--c8)',
                clipPath: 'polygon(0% 80%, 8% 60%, 16% 70%, 24% 40%, 32% 50%, 40% 30%, 48% 45%, 56% 20%, 64% 35%, 72% 15%, 80% 25%, 88% 10%, 100% 20%, 100% 100%, 0% 100%)',
              }} />
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 11, color: 'var(--c7)', marginTop: 6, padding: '0 2px',
            }}>
              {['Jan 2024','Jul 2024','Jan 2025','Jul 2025','Jan 2026'].map(l => <span key={l}>{l}</span>)}
            </div>
          </Card>

          {/* Last games card */}
          <Card title="Dernières parties" action={
            <span style={{ fontSize: 13, color: 'var(--c8)', cursor: 'pointer' }}>Voir tout →</span>
          }>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  {['Résultat','Adversaire','Couleur','Tournoi','Date'].map(h => (
                    <th key={h} style={{
                      fontSize: 11, textTransform: 'uppercase', letterSpacing: '.07em',
                      color: 'var(--c7)', fontWeight: 600, padding: '0 12px 10px',
                      textAlign: 'left', borderBottom: '1px solid var(--c3)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {player.parties.map((g, i) => (
                  <tr key={i}>
                    <td style={{ padding: '11px 12px', borderBottom: '1px solid var(--c2)' }}>
                      <span style={{
                        display: 'inline-block', width: 22, height: 22, borderRadius: 4,
                        textAlign: 'center', lineHeight: '22px', fontSize: 12, fontWeight: 600,
                        ...RESULT_STYLES[g.resultat],
                      }}>{g.resultat}</span>
                    </td>
                    <td style={{ padding: '11px 12px', borderBottom: '1px solid var(--c2)', fontWeight: 600 }}>{g.adversaire}</td>
                    <td style={{ padding: '11px 12px', borderBottom: '1px solid var(--c2)' }}>
                      <span style={{ fontSize: 16 }}>{g.piece}</span> {g.couleur}
                    </td>
                    <td style={{ padding: '11px 12px', borderBottom: '1px solid var(--c2)' }}>
                      <span style={{
                        background: 'var(--c3)', color: 'var(--c10)', borderRadius: 4,
                        padding: '3px 8px', fontSize: 12, fontWeight: 500,
                      }}>{g.tournoi}</span>
                    </td>
                    <td style={{ padding: '11px 12px', borderBottom: '1px solid var(--c2)', color: 'var(--c7)' }}>{g.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Side column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Player info */}
          <Card title="Informations">
            {[
              ['Nationalité', `${player.flag} ${player.pays}`],
              ['Né le',       player.naissance],
              ['Titre FIDE',  player.fideTitre],
              ['Élo max.',    String(player.eloMax)],
              ['Classement',  player.rang],
              ['ID FIDE',     player.fideId],
            ].map(([k, v], i, arr) => (
              <div key={k} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < arr.length - 1 ? '1px solid var(--c2)' : 'none',
                fontSize: 14,
              }}>
                <span style={{ color: 'var(--c7)', fontWeight: 500 }}>{k}</span>
                <span style={{ color: 'var(--c11)', fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </Card>

          {/* Recent tournaments */}
          <Card title="Tournois récents">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {player.tournoiRecents.map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--c11)' }}>{t.nom}</div>
                    <div style={{ fontSize: 12, color: 'var(--c7)' }}>{t.lieu} · {t.date}</div>
                  </div>
                  <span style={{
                    background: t.top ? 'var(--c11)' : 'var(--c3)',
                    color: t.top ? 'white' : 'var(--c10)',
                    borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600,
                  }}>{t.rang}</span>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

// ── Shared Card sub-component ────────────

interface CardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, action, children }) => (
  <div style={{
    background: 'var(--c0)', border: '1px solid var(--c3)',
    borderRadius: 10, overflow: 'hidden',
  }}>
    <div style={{
      padding: '18px 22px', borderBottom: '1px solid var(--c3)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 600, color: 'var(--c11)' }}>
        {title}
      </span>
      {action}
    </div>
    <div style={{ padding: 22 }}>{children}</div>
  </div>
);
