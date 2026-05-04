// ─────────────────────────────────────────
//  Chess Stats — Pagination component
// ─────────────────────────────────────────

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 32 }}>
      {/* Prev */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          width: 36, height: 36,
          border: '1.5px solid var(--c4)', borderRadius: 6,
          background: 'white', fontFamily: 'var(--sans)', fontSize: 14,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: currentPage === 1 ? 'var(--c5)' : 'var(--c11)',
          opacity: currentPage === 1 ? 0.5 : 1,
        }}
      >
        ←
      </button>

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            width: 36, height: 36,
            border: page === currentPage ? '1.5px solid var(--c8)' : '1.5px solid var(--c4)',
            borderRadius: 6,
            background: page === currentPage ? 'var(--c8)' : 'white',
            fontFamily: 'var(--sans)', fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: page === currentPage ? 'white' : 'var(--c11)',
            fontWeight: page === currentPage ? 700 : 400,
          }}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          width: 36, height: 36,
          border: '1.5px solid var(--c4)', borderRadius: 6,
          background: 'white', fontFamily: 'var(--sans)', fontSize: 14,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: currentPage === totalPages ? 'var(--c5)' : 'var(--c11)',
          opacity: currentPage === totalPages ? 0.5 : 1,
        }}
      >
        →
      </button>
    </div>
  );
};
