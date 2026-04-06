# MEMORY.md — Winnie & Vvs · Suivi des modifications en temps réel

> Fichier de tracking automatique — mis à jour à chaque modification.

---

## État initial (2026-04-05)
- Repo cloné depuis `https://github.com/walidoum/Projet-app-date`
- 8 fichiers sources : index.html, liste.html, carte.html, journal.html, stats.html, reglages.html, core.js, style.css, manifest.json
- CLAUDE.md créé avec 8 missions définies
- Style UI/UX identifié : **Modern Dark Cinema Mobile** (via skill ui-ux-pro-max)
  - Easing recommandé : `cubic-bezier(0.16,1,0.3,1)`
  - Blobs ambiants, glassmorphism, spring modals (damping:20, stiffness:90)
  - Scale press `0.97 → 1.0` sur tous les boutons

---

## Journal des modifications

### [2026-04-05] — Session 1
| Fichier | Modification | Statut |
|---------|-------------|--------|
| `CLAUDE.md` | Créé — 8 missions définies, règles de travail | ✅ |
| `MEMORY.md` | Créé — tracking temps réel | ✅ |

### [2026-04-05] — Session 2 (suite)
| Fichier | Modification | Statut |
|---------|-------------|--------|
| `style.css` | +140 lignes : variable `--ease`, micro-interactions scale 0.97, navbar glassmorphism renforcé (blur+saturate), skeleton shimmer, stagger `.mcard:nth-child`, `.cbubble` premium, `orbDrift` keyframes, count-up `.kcard` | ✅ |
| `index.html` | Count-up animation (easeOut, 1.4s), orbe 4ème ajoutée, animations `orbDrift`/`orbDrift2`, bouton "Entrer" avec état loading | ✅ |
| `liste.html` | Barre de recherche texte (filtre titre/note/adresse), skeleton 4 cards au chargement initial, message vide contextuel (🔍 vs 💭), variable `_q` + méthode `LIST.search()` | ✅ |
| `journal.html` | Rendu éditorial (Cormorant Garant italic, line-height 1.85), bulles commentaires `.cbubble`/`.cbubble-own` avec CSS classes (suppression inline styles), animation `entryIn` staggerée | ✅ |
| `stats.html` | KPI cards count-up animé (easeOut, stagger 100ms/card, délai 300ms) | ✅ |

---

## Missions en cours

| Mission | Composant | Statut |
|---------|-----------|--------|
| 1.1 | Navigation FAB expandable | ⏳ À faire |
| 1.2 | Splash — count-up, orbes premium | ✅ Fait |
| 1.3 | Liste — search, skeleton, stagger | ✅ Fait |
| 1.4 | Carte — clustering, popups premium | ⏳ À faire |
| 1.5 | Journal — rendu éditorial | ✅ Fait |
| 1.6 | Stats — count-up KPIs, graphique mensuel | ✅ Fait (count-up) |
| 1.7 | Style global — Modern Dark Cinema | ✅ Fait |
| 1.8 | PWA offline, emojis fix, Supabase RLS | ⏳ À faire |

---

## Notes techniques
- Emojis corrompus dans le HTML (mojibake UTF-8) — à corriger en mission 1.8
- Clé Supabase publique anon en clair dans core.js — acceptable côté client, activer RLS Supabase
- Thèmes CSS : 8 thèmes via `data-theme` — ne jamais casser ces variables
- Navigation actuelle : bottom navbar 5 onglets → à remplacer par FAB
