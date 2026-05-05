// ─────────────────────────────────────────
//  Chess Stats — TypeScript Interfaces
// ─────────────────────────────────────────

// API response shapes — match the Spring backend DTOs
export interface ApiPays {
  nom: string;
  code: string;
}

export interface ApiJoueur {
  nomComplet: string;
  pays: { code: string; nom?: string } | null;
}

export interface ApiJoueurStats {
  nomComplet: string;
  nbParties: number;
  nbVictoires: number;
  nbNulles: number;
  nbDefaites: number;
  tauxVictoire: number | null;
  eloMoyen: number | null;
}

export interface ApiTournoi {
  id: number;
  nom: string;
  date: string | null;
  pays: { code: string } | null;
  nbrJoueurs: number | null;
  classementMoyen: number | null;
}

export interface ApiTournoiStats {
  nom: string;
  nbVictoiresBlancs: number;
  nbVictoiresNoirs: number;
  nbNulles: number;
  nbrJoueurs: number | null;
  classementMoyen: number | null;
  topOuvertures: ApiOuverture[];
}

export interface ApiOuverture {
  codeEco: string;
  libelle: string;
  nbParties: number;
  nbVictoires: number | null;
}

export interface ApiParticipation {
  id: number;
  joueur: { nomComplet: string; pays?: { code: string; nom?: string } | null } | null;
  tournoi: { id: number; nom: string } | null;
  elo: number | null;
  pointsMarques: number | null;
}

export interface ApiPartie {
  id: number;
  joueurBlancs: { nomComplet: string; pays?: { code: string; nom?: string } | null } | null;
  joueurNoirs:  { nomComplet: string; pays?: { code: string; nom?: string } | null } | null;
  resultat: number | null;
  ouverture: { codeEco: string; libelle: string } | null;
  tournoi: { id: number; nom: string } | null;
  datePartie: string | null;
  ronde: number | null;
  numeroTable: number | null;
}

// UI state types
export interface FilterState {
  joueur: string;
  pays: string;
  tournoi: string;
  eloMin: string;
  eloMax: string;
  dateDebut: string;
  dateFin: string;
}

export type TabType = 'joueurs' | 'tournois' | 'ouvertures';
export type PageType = 'home' | 'player' | 'tournament';

export interface StatItem {
  value: string;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
}
