// ─────────────────────────────────────────
//  Chess Stats — StatsStrip component
// ─────────────────────────────────────────

import React from 'react';
import type { StatItem } from '../types';
import { GLOBAL_STATS } from '../data';

interface StatsStripProps {
  stats?: StatItem[];
}

export const StatsStrip: React.FC<StatsStripProps> = ({ stats = GLOBAL_STATS }) => {
  return (
    <div style={{
      background: 'var(--c0)', borderBottom: '1px solid var(--c3)',
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{ display: 'flex', maxWidth: 800, width: '100%' }}>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              flex: 1, padding: '18px 24px', textAlign: 'center',
              borderRight: i < stats.length - 1 ? '1px solid var(--c3)' : 'none',
            }}
          >
            <div style={{
              fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 700, color: 'var(--c11)',
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: 11, color: 'var(--c7)', textTransform: 'uppercase',
              letterSpacing: '.08em', marginTop: 2,
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
