// ─────────────────────────────────────────
//  Chess Stats — Mock Data
// ─────────────────────────────────────────

import type { Player, Tournament, PlayerDetail, StatItem } from './types';

export const PLAYERS: Player[] = [
  { id:1,  nom:'Carlsen',         prenom:'Magnus',   pays:'Norvège',     flag:'🇳🇴', elo:2845, rank:1  },
  { id:2,  nom:'Caruana',         prenom:'Fabiano',  pays:'USA',         flag:'🇺🇸', elo:2812, rank:2  },
  { id:3,  nom:'Nepomniachtchi',  prenom:'Ian',      pays:'Russie',      flag:'🇷🇺', elo:2793, rank:3  },
  { id:4,  nom:'Firouzja',        prenom:'Alireza',  pays:'France',      flag:'🇫🇷', elo:2785, rank:4  },
  { id:5,  nom:'Gukesh',          prenom:'D.',       pays:'Inde',        flag:'🇮🇳', elo:2777, rank:5  },
  { id:6,  nom:'Nakamura',        prenom:'Hikaru',   pays:'USA',         flag:'🇺🇸', elo:2774, rank:6  },
  { id:7,  nom:'Praggnanandhaa',  prenom:'R.',       pays:'Inde',        flag:'🇮🇳', elo:2769, rank:7  },
  { id:8,  nom:'Vidit',           prenom:'S. G.',    pays:'Inde',        flag:'🇮🇳', elo:2758, rank:8  },
  { id:9,  nom:'Abdusattorov',    prenom:'Nodirbek', pays:'Ouzbékistan', flag:'🇺🇿', elo:2751, rank:9  },
  { id:10, nom:'Rapport',         prenom:'Richard',  pays:'Roumanie',    flag:'🇷🇴', elo:2748, rank:10 },
  { id:11, nom:'Vachier-Lagrave', prenom:'Maxime',   pays:'France',      flag:'🇫🇷', elo:2742, rank:11 },
  { id:12, nom:'Arjun',           prenom:'Erigaisi', pays:'Inde',        flag:'🇮🇳', elo:2739, rank:12 },
];

export const TOURNAMENTS: Tournament[] = [
  { id:1, nom:'Norway Chess 2026',       lieu:'Stavanger',    date:'Mai 2026',  nb:6,  cat:'Super-tournoi' },
  { id:2, nom:'Candidates 2026',         lieu:'Toronto',      date:'Avr. 2026', nb:8,  cat:'Élite'         },
  { id:3, nom:'Tata Steel 2026',         lieu:'Wijk aan Zee', date:'Jan. 2026', nb:14, cat:'Catégorie A'   },
  { id:4, nom:'Prague Masters 2026',     lieu:'Prague',       date:'Fév. 2026', nb:10, cat:'Catégorie A'   },
  { id:5, nom:'Shamkir Chess 2026',      lieu:'Shamkir',      date:'Mar. 2026', nb:10, cat:'Catégorie A'   },
  { id:6, nom:'Grand Prix FIDE Ronde 1', lieu:'Berlin',       date:'Jun. 2026', nb:16, cat:'Grand Prix'    },
  { id:7, nom:'London Classic 2025',     lieu:'Londres',      date:'Déc. 2025', nb:10, cat:'Catégorie A'   },
  { id:8, nom:'Sinquefield Cup 2025',    lieu:'Saint-Louis',  date:'Aoû. 2025', nb:10, cat:'Super-tournoi' },
];

export const GLOBAL_STATS: StatItem[] = [
  { value: '4 820',   label: 'Joueurs'   },
  { value: '1 340',   label: 'Tournois'  },
  { value: '218 000', label: 'Parties'   },
  { value: '96',      label: 'Pays'      },
];

export const CARLSEN: PlayerDetail = {
  nom: 'Magnus Carlsen',
  initiale: 'C',
  flag: '🇳🇴',
  pays: 'Norvège',
  titre: 'Grand Maître International',
  rang: '#1 mondial',
  elo: 2845,
  eloMax: 2882,
  naissance: '30 nov. 1990',
  fideTitre: 'Grand Maître',
  fideId: '1503014',
  stats: {
    parties: 847,
    victoires: '68%',
    nulles: '23%',
    defaites: '9%',
    tournois: 42,
  },
  parties: [
    { resultat:'V', adversaire:'Caruana, F.',        couleur:'Blancs', piece:'♔', tournoi:'Norway Chess', date:'12 mai 2026'  },
    { resultat:'N', adversaire:'Nepomniachtchi, I.', couleur:'Noirs',  piece:'♚', tournoi:'Norway Chess', date:'10 mai 2026'  },
    { resultat:'V', adversaire:'Gukesh, D.',         couleur:'Blancs', piece:'♔', tournoi:'Norway Chess', date:'8 mai 2026'   },
    { resultat:'D', adversaire:'Firouzja, A.',       couleur:'Noirs',  piece:'♚', tournoi:'Candidates',  date:'2 avr. 2026'  },
    { resultat:'V', adversaire:'Nakamura, H.',       couleur:'Blancs', piece:'♔', tournoi:'Candidates',  date:'30 mar. 2026' },
  ],
  tournoiRecents: [
    { nom:'Norway Chess 2026', lieu:'Stavanger',    date:'Mai 2026',  rang:'1er', top:true  },
    { nom:'Candidates 2026',   lieu:'Toronto',      date:'Avr. 2026', rang:'2e',  top:false },
    { nom:'Tata Steel 2026',   lieu:'Wijk aan Zee', date:'Jan. 2026', rang:'1er', top:true  },
  ],
};
