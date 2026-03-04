'use strict';

// ══════════════════════════════════════════════
//  PrincessLia · app.js
// ══════════════════════════════════════════════

var STORE = {};

// ── DATA INIT ─────────────────────────────────
function initData() {
  var defaults = {
    verses: [
      { ref: "Filipenses 4:13",   text: "Todo lo puedo en Cristo que me fortalece.",                           cat: "Fortaleza" },
      { ref: "Salmos 23:1",       text: "El Señor es mi pastor; nada me faltará.",                             cat: "Confianza" },
      { ref: "Juan 3:16",         text: "De tal manera amó Dios al mundo que dio a su Hijo unigénito.",        cat: "Amor"      },
      { ref: "Romanos 8:28",      text: "A los que aman a Dios, todas las cosas les ayudan a bien.",           cat: "Fe"        },
      { ref: "Proverbios 31:25",  text: "Se reviste de fuerza y dignidad, y afronta segura el porvenir.",      cat: "Mujer"     },
      { ref: "Isaías 40:31",      text: "Los que esperan en el Señor renovarán sus fuerzas.",                  cat: "Fortaleza" },
      { ref: "Jeremías 29:11",    text: "Yo sé los planes para vosotros: planes de bienestar.",                cat: "Fe"        },
      { ref: "Mateo 6:33",        text: "Buscad primero el reino de Dios y su justicia.",                      cat: "Fe"        },
      { ref: "Salmos 46:1",       text: "Dios es nuestro amparo y fortaleza, pronto auxilio.",                 cat: "Confianza" },
      { ref: "Proverbios 3:5",    text: "Confía en el Señor con todo tu corazón.",                             cat: "Confianza" }
    ],
    vcats: ["Fortaleza", "Confianza", "Amor", "Fe", "Mujer"],
    prayers: [
      { id: 1, text: "Sabiduría para los exámenes", cat: "Estudios", done: false, date: "hoy" },
      { id: 2, text: "Salud de mis padres",          cat: "Familia",  done: false, date: "hoy" }
    ],
    pcats: ["Familia", "Estudios", "Salud", "Iglesia", "Personal", "Amigos", "Gratitud"],
    materias: [
      { name: "Base de Datos I",        color: "#4f8ef7" },
      { name: "Estructura de Datos II", color: "#3ecf8e" },
      { name: "Programación",           color: "#f7c94f" },
      { name: "Inglés",                 color: "#f76f6f" },
      { name: "Matemáticas",            color: "#a78bfa" },
      { name: "Iglesia",                color: "#ffd700" },
      { name: "Personal",               color: "#ff6ec7" },
      { name: "General",                color: "#a06090" }
    ],
    events: [
      { id: 1, day: 1, title: "Clase BD I",           mat: "Base de Datos I",        hora: "08:00", done: false },
      { id: 2, day: 1, title: "Práctica Estructuras", mat: "Estructura de Datos II", hora: "10:00", done: false },
      { id: 3, day: 3, title: "Entrega tarea SQL",    mat: "Base de Datos I",        hora: "23:59", done: false },
      { id: 4, day: 5, title: "Ensayo iglesia",       mat: "Iglesia",                hora: "18:00", done: false },
      { id: 5, day: 0, title: "Culto dominical",      mat: "Iglesia",                hora: "09:00", done: false }
    ],
    notas: [
      { id: 1, title: "Consultas SQL básicas", body: "SELECT * FROM tabla;\nSELECT campo FROM tabla WHERE condición;", cat: "Base de Datos I" },
      { id: 2, title: "Versículo favorito",     body: "Filipenses 4:13 - Todo lo puedo en Cristo que me fortalece.",   cat: "Devocional"      }
    ],
    ncats: ["Base de Datos I", "Estructura de Datos II", "Programación", "Matemáticas", "Iglesia", "Devocional", "General"],
    metas: [
      { id: 1, title: "Leer la Biblia completa",  cat: "Espiritual", prog: 15, total: 100, unit: "%"          },
      { id: 2, title: "Aprobar Base de Datos I",  cat: "Académico",  prog: 0,  total: 1,   unit: "examen"     },
      { id: 3, title: "Memorizar 20 versículos",  cat: "Espiritual", prog: 5,  total: 20,  unit: "versículos" }
    ],
    mcats: ["Espiritual", "Académico", "Personal", "Iglesia"],
    diary: [],
    refl: ""
  };

  var keys = Object.keys(defaults);
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var loaded = null;
    try {
      var raw = localStorage.getItem('lia_' + k);
      if (raw !== null) loaded = JSON.parse(raw);
    } catch (e) {}
    STORE[k] = (loaded !== null) ? loaded : defaults[k];
  }
}

function save(k) {
  try { localStorage.setItem('lia_' + k, JSON.stringify(STORE[k])); } catch (e) {}
}

function uid()  { return Date.now() + Math.floor(Math.random() * 99999); }
function esc(s) { return String(s === undefined || s === null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function tod()  { return new Date().toLocaleDateString('es-ES'); }

// ── MODAL ─────────────────────────────────────
function showModal(html) {
  var layer = document.getElementById('modal-layer');
  layer.innerHTML = '<div class="box">' + html + '</div>';
  layer.className = 'overlay on';
  layer.onclick = function (e) { if (e.target === layer) closeModal(); };
}
function closeModal() {
  var layer = document.getElementById('modal-layer');
  layer.className = 'overlay';
  layer.innerHTML = '';
}

// ── NAV ───────────────────────────────────────
document.getElementById('nav').addEventListener('click', function (e) {
  var t = e.target.closest('.tab');
  if (!t) return;
  var pg = t.getAttribute('data-pg');
  if (!pg) return;
  document.querySelectorAll('.tab').forEach(function (b) { b.classList.remove('on'); });
  document.querySelectorAll('.pg').forEach(function (p) { p.classList.remove('on'); });
  t.classList.add('on');
  document.getElementById('pg-' + pg).classList.add('on');
  var fns = { dev: renderDev, agenda: renderAgenda, verses: renderVerses, notas: renderNotas, metas: renderMetas, diario: renderDiario };
  if (fns[pg]) fns[pg]();
});

// ── DAILY VERSE ───────────────────────────────
var DV = [
  { ref: "Filipenses 4:13",   text: "Todo lo puedo en Cristo que me fortalece."                    },
  { ref: "Salmos 23:1",       text: "El Señor es mi pastor; nada me faltará."                      },
  { ref: "Proverbios 3:5",    text: "Fíate de Jehová de todo tu corazón."                          },
  { ref: "Jeremías 29:11",    text: "Yo sé los planes que tengo para vosotros."                    },
  { ref: "Isaías 40:31",      text: "Los que esperan en el Señor renovarán sus fuerzas."           },
  { ref: "Hebreos 11:1",      text: "La fe es la certeza de lo que se espera."                     },
  { ref: "Mateo 6:33",        text: "Busca primero el reino de Dios y su justicia."                },
  { ref: "Salmos 46:1",       text: "Dios es nuestro amparo y fortaleza."                          },
  { ref: "Juan 13:34",        text: "Ámense los unos a los otros como yo los he amado."            },
  { ref: "Romanos 12:2",      text: "No se amolden al mundo sino transfórmense."                   },
  { ref: "Proverbios 31:25",  text: "Se reviste de fuerza y dignidad, y afronta segura el porvenir." },
  { ref: "Deuteronomio 31:6", text: "Sed fuertes y valientes. No temáis ni os aterréis."           }
];
function gdv() { var d = new Date(); return DV[(d.getDate() + d.getMonth()) % DV.length]; }

// ══════════════════════════════════════════════
//  DEVOCIONAL
// ══════════════════════════════════════════════
var pCatF = 'Todas';

function renderDev() {
  var v = gdv();
  var hvEl = document.getElementById('hv');
  if (hvEl) hvEl.textContent = '"' + v.text.slice(0, 45) + '..."';

  var pg = document.getElementById('pg-dev');
  pg.innerHTML =
    '<div style="background:linear-gradient(135deg,#1a0018,#2d0025);border:1px solid #e91e8c33;border-radius:12px;padding:18px;text-align:center;margin-bottom:10px">'
    + '<div style="color:#ffd700;font-size:10px;letter-spacing:2px;margin-bottom:10px">✦ VERSÍCULO DEL DÍA ✦</div>'
    + '<div style="font-size:14px;line-height:1.8;color:#ffb3e6;font-style:italic;margin-bottom:8px">"' + esc(v.text) + '"</div>'
    + '<div style="color:#ff6ec7;font-size:12px">— ' + esc(v.ref) + '</div></div>'
    + '<div class="card">'
    + '<div class="muted" style="margin-bottom:8px">✍️ MI REFLEXIÓN DE HOY</div>'
    + '<textarea id="refl-ta" class="inp" rows="4" placeholder="¿Qué te habló Dios hoy?..." style="resize:none;line-height:1.7">' + esc(STORE.refl) + '</textarea>'
    + '<div style="margin-top:8px;display:flex;gap:8px;align-items:center">'
    + '<button id="refl-btn" class="btn btnp btns">💾 Guardar</button>'
    + '<span id="refl-ok" style="color:#ff6ec7;font-size:11px;display:none">✓ Guardado</span>'
    + '</div></div>'
    + '<div class="card">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'
    + '<div class="muted">🙏 PETICIONES DE ORACIÓN</div>'
    + '<button id="btn-new-p" class="btn btnp btns">+ Nueva</button></div>'
    + '<div id="pcats-f" style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px"></div>'
    + '<div id="prayer-list"></div></div>';

  document.getElementById('refl-btn').onclick = function () {
    STORE.refl = document.getElementById('refl-ta').value;
    save('refl');
    var ok = document.getElementById('refl-ok');
    ok.style.display = 'inline';
    setTimeout(function () { ok.style.display = 'none'; }, 2000);
  };
  document.getElementById('btn-new-p').onclick = function () { openPrayerModal(null); };
  renderPrayers();
}

function renderPrayers() {
  var pf = document.getElementById('pcats-f');
  if (!pf) return;
  pf.innerHTML = '';
  var allCats = ['Todas'].concat(STORE.pcats);
  allCats.forEach(function (c) {
    var b = document.createElement('button');
    b.className = 'btn btns';
    b.textContent = c;
    b.style.background = pCatF === c ? '#e91e8c' : '#1a0018';
    b.style.color = pCatF === c ? '#fff' : '#a06090';
    b.onclick = function () { pCatF = c; renderPrayers(); };
    pf.appendChild(b);
  });

  var list = document.getElementById('prayer-list');
  if (!list) return;
  var items = pCatF === 'Todas' ? STORE.prayers : STORE.prayers.filter(function (p) { return p.cat === pCatF; });
  if (!items.length) {
    list.innerHTML = '<div class="muted" style="text-align:center;padding:14px">Sin peticiones aún 🙏</div>';
    return;
  }
  list.innerHTML = '';
  items.forEach(function (p) {
    var d = document.createElement('div');
    d.style.cssText = 'display:flex;align-items:center;gap:8px;padding:9px 11px;border-radius:8px;margin-bottom:6px;background:' + (p.done ? '#0a150a' : '#0d0008') + ';border:1px solid ' + (p.done ? '#1e3a1e' : '#3d0035');
    d.innerHTML =
      '<button class="tog-p" data-id="' + p.id + '" style="flex-shrink:0;background:none;border:2px solid ' + (p.done ? '#ffd700' : '#e91e8c') + ';border-radius:50%;width:22px;height:22px;cursor:pointer;color:' + (p.done ? '#ffd700' : 'transparent') + ';font-size:11px">' + (p.done ? '✓' : '') + '</button>'
      + '<div style="flex:1">'
      + '<div style="font-size:13px;text-decoration:' + (p.done ? 'line-through' : 'none') + ';color:' + (p.done ? '#a06090' : '#fce4ff') + '">' + esc(p.text) + '</div>'
      + '<div style="font-size:10px;color:#e91e8c">' + esc(p.cat) + ' · ' + esc(p.date) + '</div>'
      + '</div>'
      + '<button class="edit-p" data-id="' + p.id + '" style="background:none;border:none;color:#a06090;cursor:pointer;font-size:14px">✏️</button>'
      + '<button class="del-p" data-id="' + p.id + '" style="background:none;border:none;color:#c00;cursor:pointer;font-size:18px">×</button>';
    list.appendChild(d);
  });
  list.querySelectorAll('.tog-p').forEach(function (b) {
    b.onclick = function () {
      var id = Number(b.getAttribute('data-id'));
      STORE.prayers = STORE.prayers.map(function (p) { return p.id === id ? Object.assign({}, p, { done: !p.done }) : p; });
      save('prayers'); renderPrayers();
    };
  });
  list.querySelectorAll('.edit-p').forEach(function (b) {
    b.onclick = function () { openPrayerModal(Number(b.getAttribute('data-id'))); };
  });
  list.querySelectorAll('.del-p').forEach(function (b) {
    b.onclick = function () {
      if (!confirm('¿Eliminar?')) return;
      STORE.prayers = STORE.prayers.filter(function (p) { return p.id !== Number(b.getAttribute('data-id')); });
      save('prayers'); renderPrayers();
    };
  });
}

function openPrayerModal(id) {
  var p = id ? STORE.prayers.find(function (x) { return x.id === id; }) : null;
  var opts = STORE.pcats.map(function (c) { return '<option' + (p && p.cat === c ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('');
  showModal(
    '<h3>' + (p ? 'Editar' : 'Nueva') + ' petición</h3>'
    + '<input id="m-pt" class="inp" value="' + esc(p ? p.text : '') + '" placeholder="Petición..." style="margin-bottom:8px"/>'
    + '<select id="m-pc" class="inp" style="margin-bottom:12px">' + opts + '</select>'
    + '<div class="row">'
    + '<button id="m-psave" class="btn btnp">Guardar</button>'
    + '<button id="m-pcancel" class="btn">Cancelar</button>'
    + '<button id="m-pcats" class="btn btns">⚙️ Categorías</button></div>'
  );
  document.getElementById('m-psave').onclick = function () {
    var t = document.getElementById('m-pt').value.trim();
    if (!t) return;
    var c = document.getElementById('m-pc').value;
    if (p) {
      STORE.prayers = STORE.prayers.map(function (pp) { return pp.id === id ? Object.assign({}, pp, { text: t, cat: c }) : pp; });
    } else {
      STORE.prayers.unshift({ id: uid(), text: t, cat: c, done: false, date: tod() });
    }
    save('prayers'); closeModal(); renderPrayers();
  };
  document.getElementById('m-pcancel').onclick = closeModal;
  document.getElementById('m-pcats').onclick = function () { closeModal(); openCatModal('pcats', 'Categorías de oración', function () { openPrayerModal(null); }); };
}

// ══════════════════════════════════════════════
//  AGENDA
// ══════════════════════════════════════════════
var selDay = new Date().getDay();
var DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function renderAgenda() {
  var pg = document.getElementById('pg-agenda');
  var dayBtns = DIAS.map(function (d, i) {
    var has = STORE.events.some(function (e) { return e.day === i; });
    return '<button class="btn day-btn" data-d="' + i + '" style="flex:1;padding:8px 2px;font-size:12px;position:relative;'
      + 'background:' + (selDay === i ? '#e91e8c' : '#1a0018') + ';'
      + 'color:' + (selDay === i ? '#fff' : '#a06090') + ';'
      + 'border-color:' + (selDay === i ? '#e91e8c' : '#3d0035') + '">'
      + d
      + (has ? '<span style="position:absolute;top:3px;right:3px;width:5px;height:5px;border-radius:50%;background:#ffd700;display:block"></span>' : '')
      + '</button>';
  }).join('');

  pg.innerHTML =
    '<div style="display:flex;gap:4px;margin-bottom:10px">' + dayBtns + '</div>'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">'
    + '<div class="muted">📅 ' + DIAS[selDay] + '</div>'
    + '<div class="row">'
    + '<button id="btn-new-ev" class="btn btnp btns">+ Evento</button>'
    + '<button id="btn-mat-mgr" class="btn btns">⚙️ Materias</button>'
    + '</div></div>'
    + '<div id="ev-list"></div>';

  pg.querySelectorAll('.day-btn').forEach(function (b) {
    b.onclick = function () { selDay = Number(b.getAttribute('data-d')); renderAgenda(); };
  });
  document.getElementById('btn-new-ev').onclick = function () { openEvModal(null); };
  document.getElementById('btn-mat-mgr').onclick = openMatModal;
  renderEvents();
}

function renderEvents() {
  var list = document.getElementById('ev-list');
  if (!list) return;
  var evs = STORE.events.filter(function (e) { return e.day === selDay; }).sort(function (a, b) { return (a.hora || '').localeCompare(b.hora || ''); });
  if (!evs.length) {
    list.innerHTML = '<div class="card" style="text-align:center;color:#a06090">Día libre 🌸</div>';
    return;
  }
  list.innerHTML = '';
  evs.forEach(function (ev) {
    var mat = STORE.materias.find(function (m) { return m.name === ev.mat; }) || { color: '#a06090' };
    var d = document.createElement('div');
    d.style.cssText = 'display:flex;align-items:center;gap:8px;padding:11px;border-radius:10px;margin-bottom:8px;background:#0d0008;border:1px solid ' + mat.color + '44;border-left:3px solid ' + mat.color + ';opacity:' + (ev.done ? 0.5 : 1);
    d.innerHTML =
      '<button class="tog-e" data-id="' + ev.id + '" style="flex-shrink:0;background:none;border:2px solid ' + (ev.done ? '#ffd700' : mat.color) + ';border-radius:50%;width:22px;height:22px;cursor:pointer;color:' + (ev.done ? '#ffd700' : 'transparent') + ';font-size:11px">' + (ev.done ? '✓' : '') + '</button>'
      + '<div style="flex:1">'
      + '<div style="font-size:13px;text-decoration:' + (ev.done ? 'line-through' : 'none') + '">' + esc(ev.title) + '</div>'
      + '<div style="font-size:10px;color:' + mat.color + '">' + esc(ev.mat) + (ev.hora ? ' · ' + esc(ev.hora) : '') + '</div>'
      + '</div>'
      + '<button class="edit-e" data-id="' + ev.id + '" style="background:none;border:none;color:#a06090;cursor:pointer;font-size:14px">✏️</button>'
      + '<button class="del-e" data-id="' + ev.id + '" style="background:none;border:none;color:#c00;cursor:pointer;font-size:18px">×</button>';
    list.appendChild(d);
  });
  list.querySelectorAll('.tog-e').forEach(function (b) {
    b.onclick = function () {
      var id = Number(b.getAttribute('data-id'));
      STORE.events = STORE.events.map(function (e) { return e.id === id ? Object.assign({}, e, { done: !e.done }) : e; });
      save('events'); renderEvents();
    };
  });
  list.querySelectorAll('.edit-e').forEach(function (b) {
    b.onclick = function () { openEvModal(Number(b.getAttribute('data-id'))); };
  });
  list.querySelectorAll('.del-e').forEach(function (b) {
    b.onclick = function () {
      if (!confirm('¿Eliminar?')) return;
      STORE.events = STORE.events.filter(function (e) { return e.id !== Number(b.getAttribute('data-id')); });
      save('events'); renderAgenda();
    };
  });
}

function openEvModal(id) {
  var ev = id ? STORE.events.find(function (e) { return e.id === id; }) : null;
  var mOpts = STORE.materias.map(function (m) { return '<option' + (ev && ev.mat === m.name ? ' selected' : '') + '>' + esc(m.name) + '</option>'; }).join('');
  showModal(
    '<h3>' + (ev ? 'Editar evento' : 'Nuevo evento — ' + DIAS[selDay]) + '</h3>'
    + '<input id="m-et" class="inp" value="' + esc(ev ? ev.title : '') + '" placeholder="Descripción..." style="margin-bottom:8px"/>'
    + '<input id="m-eh" class="inp" value="' + esc(ev && ev.hora ? ev.hora : '') + '" placeholder="Hora (08:00)" style="margin-bottom:8px"/>'
    + '<select id="m-em" class="inp" style="margin-bottom:12px">' + mOpts + '</select>'
    + '<div class="row"><button id="m-esave" class="btn btnp">Guardar</button><button id="m-ecancel" class="btn">Cancelar</button></div>'
  );
  document.getElementById('m-esave').onclick = function () {
    var t = document.getElementById('m-et').value.trim();
    if (!t) return;
    var h = document.getElementById('m-eh').value.trim();
    var m = document.getElementById('m-em').value;
    if (ev) {
      STORE.events = STORE.events.map(function (e) { return e.id === id ? Object.assign({}, e, { title: t, hora: h, mat: m }) : e; });
    } else {
      STORE.events.push({ id: uid(), day: selDay, title: t, mat: m, hora: h, done: false });
    }
    save('events'); closeModal(); renderAgenda();
  };
  document.getElementById('m-ecancel').onclick = closeModal;
}

function openMatModal() {
  var rows = STORE.materias.map(function (m, i) {
    return '<div class="row" style="margin-bottom:6px">'
      + '<input class="inp mat-name" data-i="' + i + '" value="' + esc(m.name) + '" style="flex:1"/>'
      + '<input type="color" class="mat-color" data-i="' + i + '" value="' + m.color + '" style="width:32px;height:32px;border:none;background:none;cursor:pointer"/>'
      + '<button class="btn btnd btns del-mat" data-i="' + i + '">×</button></div>';
  }).join('');
  showModal(
    '<h3>⚙️ Materias</h3>' + r
