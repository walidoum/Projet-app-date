// ── FAB Navigation ────────────────────────────────────────────────────────────
// Remplace la navbar classique
// Ordre : Liste↑, Stats↑, [Actif], Journal↓, Réglages↓

var PAGES = {
  list:     { emoji: '📋', label: 'Liste',     file: 'liste.html' },
  stats:    { emoji: '📊', label: 'Stats',     file: 'stats.html' },
  map:      { emoji: '🗺️', label: 'Carte',     file: 'carte.html' },
  journal:  { emoji: '📖', label: 'Journal',   file: 'journal.html' },
  settings: { emoji: '⚙️', label: 'Réglages', file: 'reglages.html' },
};

// Ordre fixe : up2, up1, [actif], down1, down2
var PAGE_ORDER = ['list', 'stats', 'map', 'journal', 'settings'];

var FAB = {
  _open: false,
  _cur: 'map', // page active

  init: function(currentPage) {
    FAB._cur = currentPage || 'map';
    FAB._build();
  },

  _build: function() {
    // Supprimer ancien FAB si existe
    var old = document.getElementById('fab-wrap');
    if (old) old.remove();
    var oldOv = document.getElementById('fab-overlay');
    if (oldOv) oldOv.remove();

    var cur = FAB._cur;
    var order = PAGE_ORDER.slice(); // ['list','stats','map','journal','settings']
    // Réarranger pour que la page active soit au centre
    var curIdx = order.indexOf(cur);
    // Toujours garder l'ordre fixe, juste identifier les slots
    // up2=list, up1=stats, center=map, down1=journal, down2=settings
    // Mais si page active ≠ map, réarranger autour de la page active

    // Slots relatifs au bouton actif
    var slots = [];
    order.forEach(function(p, i) {
      if (p === cur) return;
      var diff = i - curIdx;
      slots.push({ page: p, diff: diff });
    });
    // diff < 0 = au dessus, diff > 0 = en dessous
    // Trier par diff
    slots.sort(function(a,b){ return a.diff - b.diff; });
    // Assigner les slots: up2(-2), up1(-1), down1(+1), down2(+2)
    // ou les 4 premiers dans l'ordre
    var slotNames = [];
    var above = slots.filter(function(s){ return s.diff < 0; }).reverse(); // plus proche d'abord
    var below = slots.filter(function(s){ return s.diff > 0; });
    if (above[1]) slotNames.push({ page: above[1].page, slot: 'up2' });
    if (above[0]) slotNames.push({ page: above[0].page, slot: 'up1' });
    if (below[0]) slotNames.push({ page: below[0].page, slot: 'down1' });
    if (below[1]) slotNames.push({ page: below[1].page, slot: 'down2' });

    // Construire le DOM
    var wrap = document.createElement('div');
    wrap.id = 'fab-wrap';
    wrap.className = 'fab-wrap';

    // Bouton principal
    var main = document.createElement('button');
    main.className = 'fab-main';
    main.setAttribute('aria-label', PAGES[cur].label);
    main.textContent = PAGES[cur].emoji;
    main.onclick = function(e) {
      e.stopPropagation();
      FAB.toggle();
    };
    wrap.appendChild(main);

    // Boutons secondaires
    slotNames.forEach(function(s) {
      var btn = document.createElement('button');
      btn.className = 'fab-item';
      btn.setAttribute('data-slot', s.slot);
      btn.setAttribute('data-page', s.page);
      btn.setAttribute('aria-label', PAGES[s.page].label);
      btn.textContent = PAGES[s.page].emoji;
      btn.onclick = function(e) {
        e.stopPropagation();
        FAB.go(s.page);
      };
      wrap.appendChild(btn);
    });

    document.body.appendChild(wrap);

    // Overlay fermeture
    var overlay = document.createElement('div');
    overlay.id = 'fab-overlay';
    overlay.className = 'fab-overlay';
    overlay.onclick = function() { FAB.close(); };
    document.body.appendChild(overlay);
  },

  toggle: function() {
    FAB._open ? FAB.close() : FAB.open();
  },

  open: function() {
    FAB._open = true;
    var wrap = document.getElementById('fab-wrap');
    if (wrap) wrap.classList.add('open');
    var ov = document.getElementById('fab-overlay');
    if (ov) ov.style.display = 'block';
  },

  close: function() {
    FAB._open = false;
    var wrap = document.getElementById('fab-wrap');
    if (wrap) wrap.classList.remove('open');
    var ov = document.getElementById('fab-overlay');
    if (ov) ov.style.display = 'none';
  },

  go: function(page) {
    FAB.close();
    if (page === FAB._cur) return;
    window.location.replace(PAGES[page].file);
  }
};
