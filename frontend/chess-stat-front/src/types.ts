// ─────────────────────────────────────────
//  Chess Stats — TypeScript Interfaces
// ─────────────────────────────────────────

export interface Player {
  id: number;
  nom: string;
  prenom: string;
  pays: string;
  flag: string;
  elo: number;
  rank: number;
}

export interface Tournament {
  id: number;
  nom: string;
  lieu: string;
  date: string;
  nb: number;
  cat: string;
}

export interface Game {
  resultat: 'V' | 'N' | 'D';
  adversaire: string;
  couleur: 'Blancs' | 'Noirs';
  piece: '♔' | '♚';
  tournoi: string;
  date: string;
}

export interface RecentTournament {
  nom: string;
  lieu: string;
  date: string;
  rang: string;
  top: boolean;
}

export interface PlayerDetail {
  nom: string;
  initiale: string;
  flag: string;
  pays: string;
  titre: string;
  rang: string;
  elo: number;
  eloMax: number;
  naissance: string;
  fideTitre: string;
  fideId: string;
  stats: {
    parties: number;
    victoires: string;
    nulles: string;
    defaites: string;
    tournois: number;
  };
  parties: Game[];
  tournoiRecents: RecentTournament[];
}

export interface StatItem {
  value: string;
  label: string;
}

export type TabType = 'joueurs' | 'tournois';
export type SortType = 'elo' | 'nom' | 'pays';
export type PageType = 'home' | 'player';

export interface ActiveFilters {
  pays?: boolean;
  elo?: boolean;
  tournoi?: boolean;
  periode?: boolean;
  france?: boolean;
  norvege?: boolean;
  elo2700?: boolean;
  top10?: boolean;
  tournois2026?: boolean;
  [key: string]: boolean | undefined;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface QuickChip {
  label: string;
  key: string;
  tab: TabType;
}
