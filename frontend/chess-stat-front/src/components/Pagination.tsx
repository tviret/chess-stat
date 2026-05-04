// ─────────────────────────────────────────
//  Chess Stats — Pagination component
// ─────────────────────────────────────────

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const BTN_BASE: React.CSSProperties = {
  width: 36, height: 36,
  borderRadius: 6,
  fontFamily: 'var(--sans)', fontSize: 14,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage, totalPages, onPageChange,
}) => {
  const shown = Math.min(3, totalPages);
  const hasMore = totalPages > 3;

  function pageBtn(p: number) {
    const active = p === currentPage;
    return (
      <button
        key={p}
        onClick={() => onPageChange(p)}
        style={{
          ...BTN_BASE,
          border: active ? '1.5px solid var(--c8)' : '1.5px solid var(--c4)',
          background: active ? 'var(--c8)' : 'white',
          color: active ? 'white' : 'var(--c11)',
          fontWeight: active ? 700 : 400,
        }}
      >
        {p}
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 32 }}>
      {/* Prev */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          ...BTN_BASE,
          border: '1.5px solid var(--c4)',
          background: 'white',
          color: currentPage === 1 ? 'var(--c5)' : 'var(--c11)',
          opacity: currentPage === 1 ? 0.5 : 1,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
        }}
      >
        ←
      </button>

      {/* Pages 1–3 */}
      {Array.from({ length: shown }, (_, i) => pageBtn(i + 1))}

      {/* Dropdown for pages 4+ */}
      {hasMore && (
        <select
          value={currentPage > 3 ? currentPage : ''}
          onChange={e => onPageChange(Number(e.target.value))}
          style={{
            height: 36,
            border: currentPage > 3 ? '1.5px solid var(--c8)' : '1.5px solid var(--c4)',
            borderRadius: 6,
            background: currentPage > 3 ? 'var(--c8)' : 'white',
            color: currentPage > 3 ? 'white' : 'var(--c7)',
            fontFamily: 'var(--sans)', fontSize: 13,
            cursor: 'pointer',
            padding: '0 6px',
            minWidth: 80,
          }}
        >
          {currentPage <= 3 && (
            <option value="" disabled>… / {totalPages}</option>
          )}
          {Array.from({ length: totalPages - 3 }, (_, i) => i + 4).map(p => (
            <option key={p} value={p}>Page {p} / {totalPages}</option>
          ))}
        </select>
      )}

      {/* Next */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          ...BTN_BASE,
          border: '1.5px solid var(--c4)',
          background: 'white',
          color: currentPage === totalPages ? 'var(--c5)' : 'var(--c11)',
          opacity: currentPage === totalPages ? 0.5 : 1,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
        }}
      >
        →
      </button>
    </div>
  );
};
