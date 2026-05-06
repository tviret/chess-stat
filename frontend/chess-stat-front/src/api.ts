// API service layer — mirrors ancien frontend's logic
// Vite proxies /api → http://localhost:3000 in dev

import type {
  ApiPays,
  ApiJoueur,
  ApiJoueurStats,
  ApiTournoi,
  ApiTournoiStats,
  ApiOuverture,
  ApiPartie,
  ApiParticipation,
} from './types';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json() as Promise<T>;
}

export function fetchPays(): Promise<ApiPays[]> {
  return get('/api/pays');
}

export function fetchTournois(params?: {
  pays?: string;
  debut?: string;
  fin?: string;
}): Promise<ApiTournoi[]> {
  const p: string[] = [];
  if (params?.pays)  p.push('pays='  + params.pays);
  if (params?.debut) p.push('debut=' + params.debut);
  if (params?.fin)   p.push('fin='   + params.fin);
  return get('/api/tournois' + (p.length ? '?' + p.join('&') : ''));
}

export function fetchJoueurs(params?: {
  nom?: string;
  pays?: string;
  tournoi?: string;
  eloMin?: string;
  eloMax?: string;
}): Promise<ApiJoueur[]> {
  const p: string[] = [];
  if (params?.nom)     p.push('nom='     + encodeURIComponent(params.nom));
  if (params?.pays)    p.push('pays='    + params.pays);
  if (params?.tournoi) p.push('tournoi=' + params.tournoi);
  if (params?.eloMin)  p.push('eloMin='  + params.eloMin);
  if (params?.eloMax)  p.push('eloMax='  + params.eloMax);
  return get('/api/joueurs' + (p.length ? '?' + p.join('&') : ''));
}

export function fetchJoueurStats(nom: string): Promise<ApiJoueurStats> {
  return get('/api/joueurs/' + encodeURIComponent(nom) + '/stats');
}

export function fetchJoueurOuvertures(nom: string): Promise<ApiOuverture[]> {
  return get('/api/joueurs/' + encodeURIComponent(nom) + '/ouvertures?detail=true');
}

export function fetchJoueurParties(nom: string): Promise<ApiPartie[]> {
  return get('/api/joueurs/' + encodeURIComponent(nom) + '/parties');
}

export function fetchJoueurTournois(nom: string): Promise<ApiTournoi[]> {
  return get('/api/joueurs/' + encodeURIComponent(nom) + '/tournois');
}

export function fetchTournoiStats(id: number): Promise<ApiTournoiStats> {
  return get('/api/tournois/' + id + '/stats');
}

export function fetchTournoiParticipations(id: number): Promise<ApiParticipation[]> {
  return get('/api/tournois/' + id + '/participations');
}

export function fetchOuvertures(): Promise<ApiOuverture[]> {
  return get('/api/ouvertures');
}

export function fetchOuverturesByPays(pays: string): Promise<ApiOuverture[]> {
  return get('/api/stats/ouvertures?pays=' + pays);
}
