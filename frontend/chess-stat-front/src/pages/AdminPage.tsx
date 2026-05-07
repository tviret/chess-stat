// ─────────────────────────────────────────
//  Chess Stats — AdminPage
// ─────────────────────────────────────────

import React, { useEffect, useState, useCallback } from "react";
import type { ApiPays, ApiTournoi } from "../types";
import {
  createParticipationWithPlayer,
  createTournoi,
  fetchPays,
  fetchTournois,
} from "../api";

const sectionStyle: React.CSSProperties = {
  background: "var(--c0)",
  border: "1px solid var(--c3)",
  borderRadius: 16,
  padding: 24,
  marginBottom: 24,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--c1)",
  border: "1.5px solid var(--c4)",
  borderRadius: 10,
  color: "var(--c11)",
  padding: "12px 14px",
  fontFamily: "var(--sans)",
  fontSize: 14,
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: ".09em",
  textTransform: "uppercase" as const,
  color: "var(--c7)",
  display: "block",
  marginBottom: 8,
};

const buttonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 999,
  background: "var(--c8)",
  color: "white",
  padding: "12px 20px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 14,
};

const fieldRow: React.CSSProperties = {
  display: "grid",
  gap: 16,
  marginBottom: 20,
};

const smallText: React.CSSProperties = {
  fontSize: 13,
  color: "var(--c7)",
};

export const AdminPage: React.FC = () => {
  const [tournois, setTournois] = useState<ApiTournoi[]>([]);
  const [paysList, setPaysList] = useState<ApiPays[]>([]);
  const [selectedTournoi, setSelectedTournoi] = useState<ApiTournoi | null>(
    null,
  );

  const [tournoiForm, setTournoiForm] = useState({
    nom: "",
    date: "",
    pays: "",
    nbrJoueurs: "",
    nbrParties: "",
    classementMoyen: "",
  });

  const [participantForm, setParticipantForm] = useState({
    nomComplet: "",
    pays: "",
    elo: "",
    pointsMarques: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadMeta = useCallback(() => {
    fetchPays()
      .then(setPaysList)
      .catch(() => {});
    fetchTournois()
      .then(setTournois)
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  const formatDate = (value: string) => value;

  const handleTournoiChange = (
    key: keyof typeof tournoiForm,
    value: string,
  ) => {
    setTournoiForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleParticipantChange = (
    key: keyof typeof participantForm,
    value: string,
  ) => {
    setParticipantForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetMessages = () => {
    setMessage("");
    setError("");
  };

  const refreshTournois = useCallback(() => {
    fetchTournois()
      .then(setTournois)
      .catch(() => {});
  }, []);

  const handleCreateTournoi = async () => {
    resetMessages();
    if (!tournoiForm.nom.trim() || !tournoiForm.date.trim()) {
      setError("Le nom et la date du tournoi sont requis.");
      return;
    }

    setLoading(true);
    try {
      const created = await createTournoi({
        nom: tournoiForm.nom.trim(),
        date: tournoiForm.date ? formatDate(tournoiForm.date) : null,
        pays: tournoiForm.pays ? { code: tournoiForm.pays } : null,
        nbrJoueurs: tournoiForm.nbrJoueurs
          ? Number(tournoiForm.nbrJoueurs)
          : null,
        nbrParties: tournoiForm.nbrParties
          ? Number(tournoiForm.nbrParties)
          : null,
        classementMoyen: tournoiForm.classementMoyen
          ? Number(tournoiForm.classementMoyen)
          : null,
      });
      setSelectedTournoi(created);
      setMessage(`Tournoi créé : ${created.nom}`);
      refreshTournois();
    } catch (e) {
      setError((e as Error).message || "Impossible de créer le tournoi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTournoi = (id: string) => {
    setSelectedTournoi(tournois.find((t) => String(t.id) === id) || null);
    resetMessages();
  };

  const handleAddParticipant = async () => {
    resetMessages();
    if (!selectedTournoi) {
      setError("Sélectionne un tournoi avant d’ajouter un joueur.");
      return;
    }
    if (!participantForm.nomComplet.trim()) {
      setError("Le nom du joueur est requis.");
      return;
    }

    setLoading(true);
    try {
      await createParticipationWithPlayer(
        participantForm.nomComplet.trim(),
        participantForm.pays || null,
        selectedTournoi.id,
        participantForm.elo ? Number(participantForm.elo) : null,
        participantForm.pointsMarques
          ? Number(participantForm.pointsMarques)
          : null,
      );
      setMessage(
        `Participation ajoutée pour ${participantForm.nomComplet.trim()} au tournoi ${selectedTournoi.nom}.`,
      );
      setParticipantForm({
        nomComplet: "",
        pays: "",
        elo: "",
        pointsMarques: "",
      });
    } catch (e) {
      setError(
        (e as Error).message || "Impossible d’ajouter la participation.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "36px 40px", maxWidth: 1180, margin: "0 auto" }}>
      <header style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: ".18em",
                color: "var(--c7)",
                marginBottom: 10,
              }}
            >
              Administration
            </div>
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--serif)",
                fontSize: 42,
                fontWeight: 700,
                color: "var(--c11)",
              }}
            >
              Gestion des tournois et des joueurs
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ ...smallText, marginBottom: 6 }}>
              Mode administrateur
            </div>
            <div style={{ color: "var(--c8)", fontWeight: 700 }}>
              Pas de login requis
            </div>
          </div>
        </div>
      </header>

      <section style={sectionStyle}>
        <h2
          style={{
            marginTop: 0,
            fontSize: 22,
            fontFamily: "var(--serif)",
            color: "var(--c11)",
          }}
        >
          1. Tournoi
        </h2>

        <div style={fieldRow}>
          <div>
            <label style={labelStyle}>Tournoi existant</label>
            <select
              style={inputStyle}
              value={selectedTournoi?.id ?? ""}
              onChange={(e) => handleSelectTournoi(e.target.value)}
            >
              <option value="">Sélectionner un tournoi</option>
              {tournois.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nom} {t.date ? `(${t.date})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Nom du tournoi</label>
            <input
              style={inputStyle}
              value={tournoiForm.nom}
              onChange={(e) => handleTournoiChange("nom", e.target.value)}
              placeholder="Ex : Open de Paris"
            />
          </div>
        </div>

        <div style={fieldRow}>
          <div>
            <label style={labelStyle}>Date</label>
            <input
              style={inputStyle}
              type="date"
              value={tournoiForm.date}
              onChange={(e) => handleTournoiChange("date", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Pays</label>
            <select
              style={inputStyle}
              value={tournoiForm.pays}
              onChange={(e) => handleTournoiChange("pays", e.target.value)}
            >
              <option value="">Aucun pays</option>
              {paysList.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.nom} ({p.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={fieldRow}>
          <div>
            <label style={labelStyle}>Nombre de joueurs</label>
            <input
              style={inputStyle}
              type="number"
              min="0"
              value={tournoiForm.nbrJoueurs}
              onChange={(e) =>
                handleTournoiChange("nbrJoueurs", e.target.value)
              }
            />
          </div>
          <div>
            <label style={labelStyle}>Nombre de parties</label>
            <input
              style={inputStyle}
              type="number"
              min="0"
              value={tournoiForm.nbrParties}
              onChange={(e) =>
                handleTournoiChange("nbrParties", e.target.value)
              }
            />
          </div>
          <div>
            <label style={labelStyle}>Classement moyen</label>
            <input
              style={inputStyle}
              type="number"
              min="0"
              value={tournoiForm.classementMoyen}
              onChange={(e) =>
                handleTournoiChange("classementMoyen", e.target.value)
              }
            />
          </div>
        </div>

        <button
          style={buttonStyle}
          onClick={handleCreateTournoi}
          disabled={loading}
        >
          Créer le tournoi
        </button>

        {selectedTournoi && (
          <div
            style={{
              marginTop: 24,
              padding: 18,
              borderRadius: 14,
              background: "rgba(56, 92, 249, .08)",
            }}
          >
            <div style={{ fontSize: 13, color: "var(--c7)", marginBottom: 8 }}>
              Tournoi sélectionné
            </div>
            <div
              style={{ fontWeight: 700, color: "var(--c11)", marginBottom: 4 }}
            >
              {selectedTournoi.nom}
            </div>
            <div style={smallText}>ID : {selectedTournoi.id}</div>
            {selectedTournoi.date && (
              <div style={smallText}>Date : {selectedTournoi.date}</div>
            )}
          </div>
        )}
      </section>

      <section style={sectionStyle}>
        <h2
          style={{
            marginTop: 0,
            fontSize: 22,
            fontFamily: "var(--serif)",
            color: "var(--c11)",
          }}
        >
          2. Ajouter un joueur au tournoi
        </h2>

        <div style={fieldRow}>
          <div>
            <label style={labelStyle}>Nom complet</label>
            <input
              style={inputStyle}
              value={participantForm.nomComplet}
              onChange={(e) =>
                handleParticipantChange("nomComplet", e.target.value)
              }
              placeholder="Magnus Carlsen"
            />
          </div>
          <div>
            <label style={labelStyle}>Pays</label>
            <select
              style={inputStyle}
              value={participantForm.pays}
              onChange={(e) => handleParticipantChange("pays", e.target.value)}
            >
              <option value="">Aucun pays</option>
              {paysList.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.nom} ({p.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={fieldRow}>
          <div>
            <label style={labelStyle}>ELO</label>
            <input
              style={inputStyle}
              type="number"
              min="0"
              value={participantForm.elo}
              onChange={(e) => handleParticipantChange("elo", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Points marqués</label>
            <input
              style={inputStyle}
              type="number"
              min="0"
              value={participantForm.pointsMarques}
              onChange={(e) =>
                handleParticipantChange("pointsMarques", e.target.value)
              }
            />
          </div>
        </div>

        <button
          style={buttonStyle}
          onClick={handleAddParticipant}
          disabled={loading}
        >
          Ajouter au tournoi
        </button>
      </section>

      {(message || error) && (
        <div
          style={{
            ...sectionStyle,
            borderColor: error ? "#F87171" : "var(--c8)",
          }}
        >
          <div
            style={{ fontWeight: 700, color: error ? "#B91C1C" : "var(--c11)" }}
          >
            {error ? "Erreur" : "Succès"}
          </div>
          <p
            style={{
              margin: "10px 0 0",
              color: error ? "#b91c1c" : "var(--c11)",
            }}
          >
            {error || message}
          </p>
        </div>
      )}
    </div>
  );
};
