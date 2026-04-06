# CLAUDE.md — Winnie & Vvs · Missions & Contexte

## Projet
Application web PWA (Progressive Web App) de couple — "Winnie & Vvs".
Permet de partager des souvenirs, une carte interactive, un journal, une wishlist et des stats.
Stack : HTML/CSS/JS vanilla · Supabase (backend) · IndexedDB (media local) · Leaflet (carte)
Repo GitHub : https://github.com/walidoum/Projet-app-date

---

## Stack technique identifiée
- `index.html` — Page splash d'accueil (compteur de jours, phrase romantique)
- `liste.html` — Grille masonry des souvenirs avec photos/vidéos
- `carte.html` — Carte Leaflet interactive (souvenirs + wishlist + géolocalisation)
- `journal.html` — Journal intime avec commentaires temps réel
- `stats.html` — Statistiques (KPIs, camembert, timeline, villes)
- `reglages.html` — Thèmes, catégories, dates spéciales, import/export
- `core.js` — Moteur central : State (S), Storage (STG), IDB, DB Supabase, UI, GEO, CAT, NAV, THEMES
- `style.css` — Design system complet : 8 thèmes, composants, animations
- `manifest.json` — PWA manifest

## Design System actuel
- Polices : Cormorant Garant (serif/titres) + Jost (sans/UI)
- 8 thèmes : romantique, minimaliste, mystique, nature, automne, clair, ocean, rosegold
- Navigation : bottom navbar fixe 5 onglets
- Composants : sheets (bottom), toast, confirm overlay, lightbox, masonry cards

## Skill utilisé
UI/UX Pro Max — path : `/Users/walidoumbarek/Documents/Claude code/Site_internet /.claude/skills/ui-ux-pro-max/`
Commande : `python3 [path]/scripts/search.py "<query>" --domain <style|ux|color|typography|landing>`

---

## 🎯 MISSIONS COMPLÈTES

### MISSION 1 — Amélioration globale de fond en comble
**Statut : 🔄 EN COURS**

#### 1.1 — Navigation & UX
- [ ] Remplacer la bottom navbar classique par un FAB (Floating Action Button) expandable
- [ ] Ajouter des transitions de page fluides (slide/fade) entre les pages
- [ ] Ajouter `overscroll-behavior: contain` sur toutes les zones scrollables
- [ ] Active state visuel clair sur l'onglet courant

#### 1.2 — Page Splash (index.html)
- [ ] Ajouter animation de compteur de jours (count-up)
- [ ] Améliorer les orbes animées (plus douces, plus premium)
- [ ] Ajouter une petite photo de couple optionnelle en médaillon
- [ ] Bouton "Entrer" avec animation de chargement

#### 1.3 — Page Liste (liste.html)
- [ ] Améliorer les cards masonry : ajouter hover/press states premium
- [ ] Ajouter une barre de recherche par texte
- [ ] Skeleton loading pendant le chargement des médias
- [ ] Micro-animation d'entrée des cards (staggered)
- [ ] Améliorer le formulaire d'ajout (expérience photo upload)

#### 1.4 — Page Carte (carte.html)
- [ ] Améliorer les popups Leaflet (style plus premium)
- [ ] Ajouter clustering des markers quand beaucoup de points
- [ ] Améliorer le long-press feedback (ripple visuel)
- [ ] Indicateur de chargement pendant le reverse geocoding

#### 1.5 — Page Journal (journal.html)
- [ ] Améliorer le rendu des entrées (plus éditorial, plus beau)
- [ ] Améliorer le système de commentaires (bubbles plus premium)
- [ ] Ajouter une animation d'entrée pour chaque entry

#### 1.6 — Page Stats (stats.html)
- [ ] Remplacer le camembert canvas custom par un rendu plus propre
- [ ] Améliorer les KPI cards (animations count-up)
- [ ] Améliorer la timeline (plus visuelle)
- [ ] Ajouter un graphique de fréquence par mois

#### 1.7 — Style & Design
- [ ] Appliquer les recommandations du skill UI-UX Pro Max (style "Modern Dark Cinema")
- [ ] Améliorer les animations : cubic-bezier(0.16,1,0.3,1) partout
- [ ] Ajouter des micro-interactions sur tous les boutons (scale 0.97 au press)
- [ ] Améliorer le glassmorphism de la navbar et des headers
- [ ] Ajouter un système de confettis amélioré pour les dates spéciales

#### 1.8 — Performance & PWA
- [ ] Ajouter un Service Worker pour offline
- [ ] Optimiser le chargement des images (lazy + placeholder blur)
- [ ] Corriger l'encodage des emojis dans le HTML (caractères corrompus)
- [ ] Sécuriser la clé Supabase (Row Level Security)

---

## 📋 RÈGLES DE TRAVAIL
1. Toujours utiliser le skill UI/UX Pro Max avant de coder un composant visuel
2. Mettre à jour MEMORY.md après chaque modification
3. Conserver la compatibilité avec Supabase et IndexedDB existants
4. Ne jamais casser le système de thèmes (8 thèmes CSS custom properties)
5. Mobile-first obligatoire — tester en vue 390px
6. Committer après chaque mission complète
