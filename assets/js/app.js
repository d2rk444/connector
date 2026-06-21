/* ═══════════════════════════════════════════════════════════════════════
   Connector
   Visual workspace for notes, tasks, folders and graph-based project structure.
   The graph uses smart links, local/global views, filters and optional folder groups.
═══════════════════════════════════════════════════════════════════════ */
(() => {
'use strict';

/* ── Tiny helpers ────────────────────────────────────────────────────── */
const $ = (id) => document.getElementById(id);
const app      = $('app');
const canvas   = $('graphCanvas');
const ctx      = canvas.getContext('2d');
const wrap     = $('canvasWrap');

/* ── Storage keys ────────────────────────────────────────────────────── */
const CURRENT_KEY  = 'connector_workspace';
const UI_KEY       = 'connector_ui';
const PHYS_KEY     = 'connector_physics';
// Legacy keys for migration
const LEGACY_KEYS  = [
  'constellation_graph_v36_code_cleanup','connector_workspace',
  'constellation_graph_v35_classic_graph_ui','constellation_graph_v34_export_ui','constellation_graph_v33_workspace_filters','constellation_graph_v32_workspace_help','constellation_graph_v31_workspace_dblclick','constellation_graph_v30_kinetic_graph','constellation_graph_v29_smart_focus','constellation_graph_v28_minimal',
  'constellation_graph_v27_graph_intelligence','constellation_graph_v26_obsidian','constellation_graph_v25_ux','constellation_graph_v24_classic','constellation_graph_v23','constellation_graph_v22','constellation_graph_v21','constellation_graph_v20',
  'constellation_graph_v19','constellation_graph_v18','constellation_graph_v17','constellation_graph_v16','constellation_graph_v15',
  'constellation_graph_v14','constellation_graph_v13','constellation_graph_v12','constellation_graph_v11','obsidian_constelacao_v10',
  'constellation_graph_v9'
];

/* ── i18n ────────────────────────────────────────────────────────────── */
const I18N = {
  en: {
    vault:'Vault', workspace:'Workspace', editor:'Editor', graph:'Graph', search:'Search',
    settings:'Settings', more:'Settings', note:'Note', task:'Task', filterTypes:'Types', filterCategories:'Categories', filterFolders:'Folders', filterCurrent:'Current filter', noDynamicFilters:'No categories or folders with content yet.',
    folder:'Folder', folders:'Folders', categories:'Categories',
    appearance:'Appearance', vaultName:'Workspace name', language:'Language',
    theme:'Theme', showCommands:'Show commands',
    showLabels:'Show graph labels', organicMotion:'Organic motion',
    categoryName:'Category name', create:'Create', backup:'Backup',
    import:'Import', dangerZone:'Danger zone', resetSample:'Reset sample vault',
    done:'Done', priority:'Priority', date:'Date',
    newPlaceholder:'New note, folder or task', searchVault:'Search vault',
    commands:'<b>Graph commands</b><ul><li><b>Click node:</b> select and edit the note/task.</li><li><b>Double-click empty canvas:</b> create a new note linked to the selected node.</li><li><b>Double-click another node:</b> connect it to the previously selected node in the same folder.</li><li><b>Click empty canvas:</b> clear selection, local graph and filters. The file pane remains visible.</li><li><b>Drag:</b> move nodes or pan the canvas. <b>Wheel:</b> zoom.</li><li><b>Space:</b> pause/resume. <b>Delete:</b> remove selected item/link. <b>Ctrl+Z:</b> undo.</li></ul>',
    nodes:'nodes', links:'links', created:'Created', deleted:'Deleted',
    moved:'Moved', renamed:'Renamed', category:'Category',
    connected:'Connected', disconnected:'Disconnected', undo:'Undo',
    sameFolderOnly:'Connection blocked: select a source note, then double-click a target in the same folder.',
    workspaceSummary:'Workspace summary', summaryHint:'Click a folder, note or task in the list to edit. Double-click a row to rename.', clearFilter:'Clear filter', help:'Help', closeEditor:'Close editor', exportJson:'Export JSON', exportPngHd:'HD image', importJson:'Import JSON', importMode:'Import mode', importMerge:'Merge with current workspace', importReplace:'Replace current workspace', backupHelp:'JSON saves the Connector structure. Import can merge with current work or replace everything.', graphDisplay:'Graph display', showGraphGroups:'Show folder groups', showGraphGroupsHelp:'Shows soft circles around folder groups. Keep off for the classic clean graph view.', importMerged:'Backup merged', importReplaced:'Backup imported',
    linkedNote:'Linked note created', linkCreated:'Connection created', blankReset:'Selection cleared',
    restored:'Restored', noSelection:'Select or create a note',
    bodyPlaceholder:'Write here...', root:'Root', newNote:'New note',
    newTask:'New task', newFolder:'New folder', newCategory:'New category',
    focusGraph:'Focus graph', exitFocus:'Exit focus',
    localGraph:'Local graph', globalGraph:'Global graph',
    pause:'Pause graph', resume:'Resume graph',
    labelsOn:'Hide names', labelsOff:'Show names',
    light:'Light', dark:'Dark', system:'System',
    sampleReset:'Sample vault restored', imported:'Imported',
    exportDone:'Exported', cannotMove:'Cannot move folder into itself',
    folderDeleted:'Folder and its contents deleted',
    categoryDeleted:'Category deleted',
    cannotDeleteLastCategory:'Keep at least one category',
    untitled:'Untitled', close:'Close',
    collapseVault:'Collapse vault', collapseEditor:'Collapse editor',
    deleteSelected:'Delete selected', newConnectedNote:'New connected note',
    centerGraph:'Center graph', optimizeLayout:'Optimize layout', manualMode:'Manual layout mode', layoutOptimized:'Layout optimized', pauseHint:'Paused: drag nodes to remodel without moving the whole graph.', smartLinks:'Smart links',
    smartLinking:'Automatic smart links',
    rebuildSmartLinks:'Rebuild smart links',
    smartLinksHelp:'Connects notes by folder, category, shared words and proximity. Preserves manual links.',
    smartLinksDone:'Smart links updated', importError:'Import error',
    low:'Low', normal:'Normal', high:'High',
    presetOverview:'Overview', presetTeam:'Team', presetTasks:'Tasks', presetDeliverables:'Deliverables', presetRisks:'Risks', presetStrong:'Strong links', presetLocal:'Local graph',
    filterAll:'All', filterPeople:'People', filterTasks:'Tasks', filterNotes:'Notes', filterDeliverables:'Deliverables', filterRisks:'Risks', filterStrong:'Strong links',
    diagnostics:'Diagnostics', importReport:'Import report', graphDiagnostics:'Graph diagnostics', noImportReport:'No import report yet',
    graphDensity:'Density', isolatedNodes:'Isolated nodes', topHubs:'Most connected', linksManualAuto:'Manual / auto links', visibleFilter:'Visible filter', filters:'Filters', filtersHelp:'Use filters to clean the graph without changing the vault data.', renameFolder:'Rename folder',
    physicsSettings:'Physics',
    repulsion:'Repulsion strength', springStiffness:'Spring stiffness',
    damping:'Velocity damping', labelSize:'Label size',
    resetPhysics:'Reset physics defaults',
  },
  'pt-BR': {
    vault:'Vault', workspace:'Arquivos', editor:'Editor', graph:'Grafo', search:'Buscar',
    settings:'Configurações', more:'Configurações', note:'Nota', filterTypes:'Tipos', filterCategories:'Categorias', filterFolders:'Pastas', filterCurrent:'Filtro atual', noDynamicFilters:'Nenhuma categoria ou pasta com conteúdo ainda.',
    task:'Tarefa', folder:'Pasta', folders:'Pastas',
    categories:'Categorias', appearance:'Aparência',
    vaultName:'Nome do workspace', language:'Idioma', theme:'Tema',
    showCommands:'Mostrar comandos', showLabels:'Mostrar nomes no grafo',
    organicMotion:'Movimento orgânico', categoryName:'Nome da categoria',
    create:'Criar', backup:'Backup', import:'Importar',
    dangerZone:'Zona de risco', resetSample:'Restaurar exemplo',
    done:'Concluída', priority:'Prioridade', date:'Data',
    newPlaceholder:'Nova nota, pasta ou tarefa',
    searchVault:'Buscar no vault',
    commands:'<b>Comandos do grafo</b><ul><li><b>Clique no nó:</b> seleciona e abre para editar.</li><li><b>Duplo clique no espaço vazio:</b> cria uma nova nota ligada ao nó selecionado.</li><li><b>Duplo clique em outro nó:</b> conecta ao nó selecionado anteriormente, na mesma pasta.</li><li><b>Clique no espaço vazio:</b> limpa seleção, grafo local e filtros.</li><li><b>Arraste:</b> move nós ou a tela. <b>Roda do mouse:</b> zoom.</li><li><b>Espaço:</b> pausa/retoma. <b>Delete:</b> remove item/link. <b>Ctrl+Z:</b> desfaz.</li></ul>',
    nodes:'nós', links:'links', created:'Criado', deleted:'Excluído',
    moved:'Movido', renamed:'Renomeado', category:'Categoria',
    connected:'Conectado', disconnected:'Desconectado', undo:'Desfazer',
    sameFolderOnly:'Conexão bloqueada: selecione a nota de origem e dê duplo clique em um destino da mesma pasta.',
    workspaceSummary:'Resumo do workspace', summaryHint:'Clique em uma pasta, nota ou tarefa na lista para editar. Dê duplo clique em uma linha para renomear.', clearFilter:'Limpar filtro', help:'Ajuda', closeEditor:'Fechar editor', exportJson:'Exportar JSON', exportPngHd:'Imagem HD', importJson:'Importar JSON', importMode:'Modo de importação', importMerge:'Mesclar com o workspace atual', importReplace:'Substituir workspace atual', backupHelp:'JSON salva a estrutura do Connector. A importação pode mesclar com o trabalho atual ou substituir tudo.', graphDisplay:'Exibição do grafo', showGraphGroups:'Exibir conjuntos do grafo', showGraphGroupsHelp:'Mostra círculos suaves em volta dos grupos/pastas. O padrão fica desligado para manter o grafo clássico limpo.', importMerged:'Backup mesclado', importReplaced:'Backup importado', linkedNote:'Nota conectada criada', linkCreated:'Conexão criada', blankReset:'Seleção limpa',
    restored:'Restaurado', noSelection:'Selecione ou crie uma nota',
    bodyPlaceholder:'Escreva aqui...', root:'Raiz', newNote:'Nova nota',
    newTask:'Nova tarefa', newFolder:'Nova pasta',
    newCategory:'Nova categoria', focusGraph:'Focar grafo',
    exitFocus:'Sair do foco', localGraph:'Grafo local',
    globalGraph:'Grafo global', pause:'Pausar grafo',
    resume:'Retomar grafo', labelsOn:'Ocultar nomes',
    labelsOff:'Exibir nomes', light:'Claro', dark:'Escuro',
    system:'Sistema', sampleReset:'Exemplo restaurado',
    imported:'Importado', exportDone:'Exportado',
    cannotMove:'Não é possível mover a pasta para dentro dela mesma',
    folderDeleted:'Pasta e conteúdo excluídos',
    categoryDeleted:'Categoria excluída',
    cannotDeleteLastCategory:'Mantenha pelo menos uma categoria',
    untitled:'Sem título', close:'Fechar',
    collapseVault:'Recolher vault', collapseEditor:'Recolher editor',
    deleteSelected:'Excluir selecionado',
    newConnectedNote:'Nova nota conectada',
    centerGraph:'Centralizar grafo', optimizeLayout:'Otimizar layout', manualMode:'Modo de remodelagem manual', layoutOptimized:'Layout otimizado', pauseHint:'Pausado: arraste os nós para remodelar sem mover o conjunto.', smartLinks:'Links inteligentes',
    smartLinking:'Links inteligentes automáticos',
    rebuildSmartLinks:'Reconstruir links inteligentes',
    smartLinksHelp:'Conecta notas por pasta, categoria, palavras em comum e proximidade.',
    smartLinksDone:'Links inteligentes atualizados',
    importError:'Erro ao importar', low:'Baixa', normal:'Normal',
    high:'Alta',
    presetOverview:'Visão geral', presetTeam:'Equipe', presetTasks:'Tarefas', presetDeliverables:'Entregáveis', presetRisks:'Riscos', presetStrong:'Links fortes', presetLocal:'Grafo local',
    filterAll:'Tudo', filterPeople:'Pessoas', filterTasks:'Tarefas', filterNotes:'Notas', filterDeliverables:'Entregáveis', filterRisks:'Riscos', filterStrong:'Links fortes',
    diagnostics:'Diagnóstico', importReport:'Relatório da importação', graphDiagnostics:'Diagnóstico do grafo', noImportReport:'Nenhum relatório de importação ainda',
    graphDensity:'Densidade', isolatedNodes:'Nós isolados', topHubs:'Mais conectados', linksManualAuto:'Links manuais / automáticos', visibleFilter:'Filtro visível', filters:'Filtros', filtersHelp:'Use filtros para limpar o grafo sem alterar os dados do vault.', renameFolder:'Renomear pasta',
    physicsSettings:'Física',
    repulsion:'Força de repulsão', springStiffness:'Rigidez das molas',
    damping:'Amortecimento', labelSize:'Tamanho dos rótulos',
    resetPhysics:'Redefinir física',
  }
};
const t = (key) => {
  const lang = state?.settings?.lang || 'en';
  return (I18N[lang] || I18N.en)[key] ?? I18N.en[key] ?? key;
};

/* ── Util ────────────────────────────────────────────────────────────── */
const clamp    = (v, a, b) => Math.max(a, Math.min(b, v));
const css      = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const uid      = (pfx)  => pfx + Math.random().toString(36).slice(2,8) + Date.now().toString(36).slice(-3);
const pairKey  = (a, b) => (a < b ? a + '::' + b : b + '::' + a);
const escHtml  = (s) => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const colorMix = (hex, alpha) => {
  const h = String(hex||'#999').replace('#','').padEnd(6,'9');
  return `rgba(${parseInt(h.slice(0,2),16)||153},${parseInt(h.slice(2,4),16)||153},${parseInt(h.slice(4,6),16)||153},${alpha})`;
};
const debounce = (fn, ms = 120) => {
  let timer = null;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
};
const titleCase = (s) => String(s || '').replace(/^./, c => c.toUpperCase());
// O(1) lookup – rebuild whenever state.items/folders/categories change
let _itemMap = new Map(), _folderMap = new Map(), _catMap = new Map();
const rebuildMaps = () => {
  _itemMap   = new Map(state.items.map(x => [x.id, x]));
  _folderMap = new Map(state.folders.map(x => [x.id, x]));
  _catMap    = new Map(state.categories.map(x => [x.id, x]));
};
const pickItem   = (id) => _itemMap.get(id);
const pickFolder = (id) => _folderMap.get(id);
const pickCat    = (id) => _catMap.get(id);
// Legacy pick() for compatibility
const pick = (arr, id) => {
  if (arr === state.items)      return _itemMap.get(id);
  if (arr === state.folders)    return _folderMap.get(id);
  if (arr === state.categories) return _catMap.get(id);
  return arr.find(x => x.id === id);
};

// Lightweight signatures prevent expensive O(n²) smart-link rebuilds when
// only visual/UI settings changed. Title/body/folder/category edits still rebuild.
let smartLinkSignature = '';
let communityCentersCache = { sig: '', centers: null };
function semanticStateSignature() {
  const items = state.items.map(i => [i.id, i.type, i.folderId || '', i.categoryId || '', i.title || '', i.body || ''].join('¦')).join('¶');
  const folders = state.folders.map(f => [f.id, f.parentId || '', f.name || ''].join('¦')).join('¶');
  const cats = state.categories.map(c => [c.id, c.name || '', c.color || ''].join('¦')).join('¶');
  return items + '§' + folders + '§' + cats;
}
function syncSmartLinksIfNeeded(markManual = false, force = false) {
  const sig = semanticStateSignature();
  if (!force && sig === smartLinkSignature) return 0;
  const count = syncSmartLinks(markManual);
  smartLinkSignature = sig;
  return count;
}

const icons = {
  note:   '<svg viewBox="0 0 24 24"><path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4"/></svg>',
  task:   '<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>',
  folder: '<svg viewBox="0 0 24 24"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h4.8l1.9 2H18.5A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z"/></svg>',
  trash:  '<svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M7 6l1 15h8l1-15"/></svg>'
};

const CATEGORY_PALETTE = ['#a78bfa','#22d3ee','#4ade80','#facc15','#fb7185','#38bdf8','#f97316','#34d399','#e879f9','#94a3b8'];
function nextCategoryColor() {
  const used = new Set(state.categories.map(c => String(c.color || '').toLowerCase()));
  return CATEGORY_PALETTE.find(c => !used.has(c.toLowerCase())) || CATEGORY_PALETTE[state.categories.length % CATEGORY_PALETTE.length];
}

/* ── Physics defaults (used by sliders) ──────────────────────────────── */
const PHYS_DEFAULTS = { repulsion: 4600, stiffness: 7, damping: 82, labelSize: 13 };
let phys = { ...PHYS_DEFAULTS };
const GRAPH_FILTERS = [
  ['all','filterAll'], ['people','filterPeople'], ['tasks','filterTasks'],
  ['notes','filterNotes'], ['deliverables','filterDeliverables'],
  ['risks','filterRisks'], ['strong','filterStrong']
];

/* ── Graph runtime state ─────────────────────────────────────────────── */
let graph = {
  scale: 1, x: 0, y: 0,
  paused: false, local: false,
  connectMode: false, connectFrom: null,
  hover: null, dragging: null, dragOffset: null, dragMoved: false,
  panning: false, panStart: null, blankClick: null,
  lastResizeW: 0, lastResizeH: 0,
  energy: 0,
  settleUntil: 0,
  lastNodeClick: null
};
let pointer = { x: 0, y: 0, wx: 0, wy: 0 };
let raf = null, lastTick = performance.now();

/* ── Stop-word set (built once) ──────────────────────────────────────── */
const STOP_WORDS = new Set(
  'the a an and or of to in for with is are be as on from this that '+
  'use uses using your you can e o a os as um uma de da do das dos '+
  'para com em no na nos nas que por se ao aos como notas nota note '+
  'notes task tarefa tarefas pasta folder projeto project simples '+
  'simple new nova novo arquivo arquivos data dados geral general '+
  'etapa fase status responsavel responsaveis'
  .split(' ')
);

/* ══════════════════════════════════════════════════════════════════════
   STATE – sample / load / normalize / save
══════════════════════════════════════════════════════════════════════ */
function sampleState() {
  const [cP,cA,cPe,cT] = ['cat_project','cat_area','cat_person','cat_task'];
  const [fI,fPr] = ['folder_ideas','folder_projects'];
  return {
    version: 36,
    settings: {
      lang:'pt-BR', theme:'dark', vaultName:'Connector',
      showCommands:false, showLabels:true, organic:true, smartLinking:true, graphFilter:'all', showGraphGroups:false
    },
    folders: [
      { id:fI,  name:'Ideas',    parentId:null },
      { id:fPr, name:'Projects', parentId:null }
    ],
    categories: [
      { id:cP,  name:'Project', color:'#a78bfa' },
      { id:cA,  name:'Area',    color:'#22d3ee' },
      { id:cPe, name:'Person',  color:'#4ade80' },
      { id:cT,  name:'Task',    color:'#facc15' }
    ],
    items: [
      { id:'n1', type:'note', title:'Writing is telepathy',   folderId:fI,  categoryId:cP,  body:'Ideas can travel through time and space. Use links to connect notes and watch the graph reveal relationships.', x:-180, y:-40, vx:0, vy:0 },
      { id:'n2', type:'note', title:'Graph of writing',       folderId:fI,  categoryId:cA,  body:'The graph shows relationships between notes, tasks and references. Click nodes to navigate.',                    x:40,   y:-80, vx:0, vy:0 },
      { id:'n3', type:'note', title:'References',             folderId:fI,  categoryId:cA,  body:'Collect useful references and connect them to projects.',                                                          x:190,  y:40,  vx:0, vy:0 },
      { id:'n4', type:'note', title:'Simple project',         folderId:fPr, categoryId:cPe, body:'A small editable project example.',                                                                                x:80,   y:150, vx:0, vy:0 },
      { id:'n5', type:'task', title:'Review connections',     folderId:fPr, categoryId:cT,  body:'Check if graph links are visible and useful.', done:false, priority:'normal', due:'',                             x:-120, y:150, vx:0, vy:0 }
    ],
    links: [
      { id:'l1', source:'n1', target:'n2', auto:true },
      { id:'l2', source:'n2', target:'n3', auto:true },
      { id:'l3', source:'n1', target:'n3', auto:true },
      { id:'l4', source:'n2', target:'n4', auto:true },
      { id:'l5', source:'n4', target:'n5', auto:true }
    ],
    blockedLinks: [],
    selectedId: 'n1'
  };
}

function normalizeState(raw = {}) {
  const s = sampleState();
  raw = raw && typeof raw === 'object' ? raw : {};
  const rawVersion = Number(raw.version) || 0;

  const boolish = (v, fallback = false) => {
    if (typeof v === 'boolean') return v;
    const txt = String(v ?? '').trim().toLowerCase();
    if (/^(true|1|sim|yes|x|ok|done)$/i.test(txt)) return true;
    if (/^(false|0|não|nao|no|n)$/i.test(txt)) return false;
    return fallback;
  };
  const uniqueId = (preferred, prefix, used) => {
    let base = String(preferred || '').trim() || uid(prefix);
    if (!base) base = uid(prefix);
    let id = base, n = 2;
    while (used.has(id)) id = `${base}_${n++}`;
    used.add(id);
    return id;
  };

  const settings = { ...s.settings, ...(raw.settings || {}) };
  if (!['en','pt-BR'].includes(settings.lang)) settings.lang = 'pt-BR';
  if (!['dark','light'].includes(settings.theme)) settings.theme = 'dark';
  if (!settings.vaultName) settings.vaultName = 'Connector';
  // Graph filters are temporary view tools; do not restore a stale fixed filter from old cache.
  settings.graphFilter = 'all';
  // Smart links are always automatic; the old settings switch was removed.
  settings.smartLinking = true;
  settings.organic = rawVersion < 30 ? true : boolish(settings.organic, true);
  settings.showCommands = false;
  settings.showGraphGroups = boolish(settings.showGraphGroups ?? settings.showGroups ?? settings.showCommunities, false);

  const rawFolders = Array.isArray(raw.folders) ? raw.folders : s.folders;
  const usedFolderIds = new Set();
  const folderIdMap = new Map();
  const folders = rawFolders.map((f,i) => {
    const oldId = String(f?.id || '').trim();
    const id = uniqueId(oldId, 'folder_', usedFolderIds);
    if (oldId) folderIdMap.set(oldId, id);
    return {
      id,
      name: String(f?.name || f?.label || `${settings.lang === 'pt-BR' ? 'Pasta' : 'Folder'} ${i+1}`),
      parentId: f?.parentId ? String(f.parentId) : null
    };
  });
  const folderIds = new Set(folders.map(f => f.id));
  for (const f of folders) {
    f.parentId = folderIdMap.get(String(f.parentId || '')) || (folderIds.has(f.parentId) ? f.parentId : null);
  }
  for (const f of folders) {
    if (f.parentId === f.id || isFolderCycleInList(folders, f.id, f.parentId)) f.parentId = null;
  }

  const rawCategories = (Array.isArray(raw.categories) && raw.categories.length) ? raw.categories : s.categories;
  const usedCatIds = new Set();
  const catIdMap = new Map();
  const categories = rawCategories.map((c,i) => {
    const oldId = String(c?.id || '').trim();
    const id = uniqueId(oldId, 'cat_', usedCatIds);
    if (oldId) catIdMap.set(oldId, id);
    const color = String(c?.color || ['#a78bfa','#22d3ee','#4ade80','#facc15'][i%4]);
    return {
      id,
      name: String(c?.name || c?.label || `${settings.lang === 'pt-BR' ? 'Categoria' : 'Category'} ${i+1}`),
      color: /^#[0-9a-f]{3,8}$/i.test(color) ? color : '#a78bfa'
    };
  });
  const catIds = new Set(categories.map(c => c.id));

  const src = Array.isArray(raw.items) ? raw.items : (Array.isArray(raw.nodes) ? raw.nodes : s.items);
  const usedItemIds = new Set();
  const itemIdMap = new Map();
  const items = src.map((it,i) => {
    const oldId = String(it?.id || '').trim();
    const id = uniqueId(oldId, 'n_', usedItemIds);
    if (oldId) itemIdMap.set(oldId, id);
    const folderRef = String(it?.folderId || '').trim();
    const catRef = String(it?.categoryId || '').trim();
    return {
      id,
      type: it?.type === 'task' ? 'task' : 'note',
      title: String(it?.title || it?.label || `${settings.lang === 'pt-BR' ? 'Sem título' : 'Untitled'} ${i+1}`),
      folderId: folderIdMap.get(folderRef) || (folderIds.has(folderRef) ? folderRef : null),
      categoryId: catIdMap.get(catRef) || (catIds.has(catRef) ? catRef : categories[0]?.id),
      body: String(it?.body || it?.note || ''),
      done: boolish(it?.done, false),
      priority: ['low','normal','high'].includes(it?.priority) ? it.priority : 'normal',
      due: String(it?.due || ''),
      x: Number.isFinite(+it?.x) ? +it.x : Math.random()*360-180,
      y: Number.isFinite(+it?.y) ? +it.y : Math.random()*240-120,
      vx: Number.isFinite(+it?.vx) ? +it.vx : 0,
      vy: Number.isFinite(+it?.vy) ? +it.vy : 0
    };
  });

  const ids = new Set(items.map(i => i.id));
  const linkSrc = Array.isArray(raw.links) ? raw.links : (Array.isArray(raw.edges) ? raw.edges : s.links);
  const seenL = new Set();
  const links = linkSrc.map(l => {
    const source = itemIdMap.get(String(l?.source || l?.from || '')) || String(l?.source || l?.from || '');
    const target = itemIdMap.get(String(l?.target || l?.to   || '')) || String(l?.target || l?.to   || '');
    return {
      id: String(l?.id || uid('l_')),
      source,
      target,
      auto: boolish(l?.auto, false),
      score: Number.isFinite(+l?.score) ? +l.score : undefined
    };
  }).filter(l => {
    const k = pairKey(l.source, l.target);
    const ok = ids.has(l.source) && ids.has(l.target) && l.source !== l.target && !seenL.has(k);
    if (ok) seenL.add(k);
    return ok;
  });

  const blocked = [];
  const blockedSrc = Array.isArray(raw.blockedLinks) ? raw.blockedLinks : [];
  const seenBlocked = new Set();
  for (const b of blockedSrc) {
    let a = '', z = '';
    if (typeof b === 'string') [a, z] = b.split('::');
    else if (b && typeof b === 'object') { a = b.source || b.from || b.a || ''; z = b.target || b.to || b.b || ''; }
    a = itemIdMap.get(String(a)) || String(a || '');
    z = itemIdMap.get(String(z)) || String(z || '');
    const k = pairKey(a, z);
    if (ids.has(a) && ids.has(z) && a !== z && !seenBlocked.has(k)) { blocked.push(k); seenBlocked.add(k); }
  }

  const selectedRaw = String(raw.selectedId || '');
  const selected = itemIdMap.get(selectedRaw) || (ids.has(selectedRaw) ? selectedRaw : (items[0]?.id || null));
  return { version: 36, settings, folders, categories, items, links, blockedLinks: blocked, selectedId: selected };
}

/* ── Load / save state ───────────────────────────────────────────────── */
function loadState() {
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (Array.isArray(parsed.items) || Array.isArray(parsed.nodes))) return parsed;
    }
  } catch { /* ignore */ }
  // Try legacy keys
  for (const key of LEGACY_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed && (Array.isArray(parsed.items) || Array.isArray(parsed.nodes))) return parsed;
    } catch { /* ignore */ }
  }
  return null;
}

function save() {
  state.selectedId = selectedId;
  try { localStorage.setItem(CURRENT_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  saveUI();
}

/* ── Persist UI state (panel collapse, graph view, physics) ──────────── */
function loadUI() {
  try {
    const raw = localStorage.getItem(UI_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function saveUI() {
  const ui = {
    sidebarCollapsed: app.classList.contains('sidebar-collapsed'),
    editorCollapsed:  app.classList.contains('editor-collapsed'),
    focusGraph:       app.classList.contains('focus-graph'),
    localGraph:       graph.local,
    // Runtime pause is not persisted: the app opens moving unless paused manually in the session.
    paused:           false,
    scale:            graph.scale,
    gx:               graph.x,
    gy:               graph.y,
  };
  try { localStorage.setItem(UI_KEY, JSON.stringify(ui)); } catch { /* ignore */ }
}
function restoreUI() {
  const ui = loadUI();
  // v33: the workspace is the safe default. Old saved collapse/focus states
  // must never hide the file/folder/task pane on reload.
  app.classList.remove('sidebar-collapsed', 'editor-collapsed', 'focus-graph');
  app.dataset.mode = 'workspace';
  graph.local  = !!ui.localGraph;
  graph.paused = false;
  if (typeof ui.scale === 'number' && ui.scale > 0) {
    graph.scale = ui.scale;
    graph.x = ui.gx || 0;
    graph.y = ui.gy || 0;
  }
}

/* ── Persist physics settings ────────────────────────────────────────── */
function loadPhys() {
  try {
    const raw = localStorage.getItem(PHYS_KEY);
    if (raw) return { ...PHYS_DEFAULTS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...PHYS_DEFAULTS };
}
function savePhys() {
  try { localStorage.setItem(PHYS_KEY, JSON.stringify(phys)); } catch { /* ignore */ }
}

/* ── Undo stack ──────────────────────────────────────────────────────── */
let undoStack = [];
let toastTimer = null;

function snapshot() {
  undoStack.push(JSON.stringify(state));
  if (undoStack.length > 80) undoStack.shift();
}
function undo() {
  closeToast();
  const raw = undoStack.pop();
  if (!raw) return;
  state = normalizeState(JSON.parse(raw));
  rebuildMaps();
  selectedId = state.selectedId || state.items[0]?.id || null;
  save(); renderAll();
}
function mutate(label, fn, opts = {}) {
  snapshot();
  fn();
  rebuildMaps();
  if (opts.smartLinks !== false) syncSmartLinksIfNeeded(false);
  save(); renderAll();
  if (opts.toast === true && label !== '') showToast(label || t('restored'), false, opts.duration || 1400);
}

/* ── Toast ───────────────────────────────────────────────────────────── */
function closeToast() {
  clearTimeout(toastTimer);
  $('toast').hidden = true;
  $('toast').innerHTML = '';
}
function showToast(message, canUndo = false, duration = 3200) {
  clearTimeout(toastTimer);
  const safe = escHtml(message || '');
  $('toast').innerHTML = `<span>${safe}</span>`;
  $('toast').hidden = false;
  toastTimer = setTimeout(closeToast, duration);
}

/* ── Theme ───────────────────────────────────────────────────────────── */
function effectiveTheme() {
  return state.settings.theme === 'light' ? 'light' : 'dark';
}
function applyTheme() {
  document.documentElement.dataset.theme = effectiveTheme();
  document.title = `${state.settings.vaultName || 'Connector'} · Connector`;
}

/* ── i18n sync ───────────────────────────────────────────────────────── */
function setButtonLabel(id, label) {
  const el = $(id);
  if (!el) return;
  el.removeAttribute('title');
  el.setAttribute('aria-label', label);
}

function stripNativeTitles() {
  document.querySelectorAll('[title]').forEach(el => el.removeAttribute('title'));
}

function translateUI() {
  document.documentElement.lang = state.settings.lang === 'pt-BR' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  // Native title tooltips were removed to keep the interface clean.
  // Accessibility labels remain available to screen readers.
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.removeAttribute('title');
    el.setAttribute('aria-label', t(el.dataset.i18nTitle));
  });
  $('commandsBox').innerHTML = t('commands');
  if ($('btnHelpCommands')) { $('btnHelpCommands').removeAttribute('title'); $('btnHelpCommands').setAttribute('aria-label', t('help')); }
  if ($('btnClearGraphFilter')) $('btnClearGraphFilter').textContent = t('clearFilter');
  $('bodyInput').placeholder = t('bodyPlaceholder');
  if ($('settingLanguage')) $('settingLanguage').value = state.settings.lang;
  if ($('settingTheme')) $('settingTheme').value    = state.settings.theme;
  if ($('settingVaultName')) $('settingVaultName').value = state.settings.vaultName;
  if ($('settingShowCommands')) $('settingShowCommands').checked = !!state.settings.showCommands;
  if ($('settingShowLabels')) $('settingShowLabels').checked   = !!state.settings.showLabels;
  if ($('settingOrganic')) $('settingOrganic').checked      = !!state.settings.organic;
  if ($('settingGraphGroups')) $('settingGraphGroups').checked = !!state.settings.showGraphGroups;
  $('commandsBox').hidden = !state.settings.showCommands;
  if (!graphFilterExists(state.settings.graphFilter)) state.settings.graphFilter = 'all';
  if ($('graphFilterSelect')) $('graphFilterSelect').value = GRAPH_FILTERS.some(([v]) => v === (state.settings.graphFilter || 'all')) ? (state.settings.graphFilter || 'all') : 'all';
  renderGraphFilterChips();
  if ($('btnGraphFilters')) {
    const activeLabel = graphFilterLabel(state.settings.graphFilter || 'all');
    setButtonLabel('btnGraphFilters', `${t('filters')}: ${activeLabel}`);
  }
  if ($('graphPresetSelect')) $('graphPresetSelect').value = presetFromCurrentView();
  // Sliders
  $('sliderRepulsion').value  = phys.repulsion;  $('valRepulsion').textContent  = phys.repulsion;
  $('sliderStiffness').value  = phys.stiffness;  $('valStiffness').textContent  = phys.stiffness;
  $('sliderDamping').value    = phys.damping;    $('valDamping').textContent    = phys.damping;
  $('sliderLabelSize').value  = phys.labelSize;  $('valLabelSize').textContent  = phys.labelSize;
  // Button labels without native title tooltips
  setButtonLabel('btnFocusGraph', app.classList.contains('focus-graph') ? t('exitFocus') : t('focusGraph'));
  setButtonLabel('btnLocalGraph', graph.local ? t('globalGraph') : t('localGraph'));
  setButtonLabel('btnPause', graph.paused ? t('resume') : t('pause'));
  setButtonLabel('btnLabels', state.settings.showLabels ? t('labelsOn') : t('labelsOff'));
  setButtonLabel('btnCollapseSidebar', t('collapseVault'));
  setButtonLabel('btnCloseEditor', t('closeEditor'));
  setButtonLabel('btnDeleteSelected', t('deleteSelected'));
  setButtonLabel('btnCenterGraph', t('centerGraph'));
  setButtonLabel('btnCloseSettings', t('close'));
  $('taskPriority').querySelector('[value="low"]').textContent    = t('low');
  $('taskPriority').querySelector('[value="normal"]').textContent = t('normal');
  $('taskPriority').querySelector('[value="high"]').textContent   = t('high');
  stripNativeTitles();
}



function folderLabel(folderId) {
  const f = pickFolder(folderId);
  if (!f) return t('folder');
  const parts = [f.name];
  let p = f.parentId, guard = 0;
  while (p && guard++ < 20) {
    const parent = pickFolder(p); if (!parent) break;
    parts.unshift(parent.name); p = parent.parentId;
  }
  return parts.join(' / ');
}
function itemInFolderTree(item, folderId) {
  if (!folderId || !item) return false;
  let f = item.folderId || null, guard = 0;
  while (f && guard++ < 40) {
    if (f === folderId) return true;
    f = pickFolder(f)?.parentId || null;
  }
  return false;
}
function graphFilterLabel(value) {
  const staticMap = new Map(GRAPH_FILTERS.map(([v, key]) => [v, t(key)]));
  if (staticMap.has(value)) return staticMap.get(value);
  if (String(value).startsWith('cat:')) return pickCat(String(value).slice(4))?.name || t('category');
  if (String(value).startsWith('folder:')) return folderLabel(String(value).slice(7));
  return t('filterAll');
}
function graphFilterExists(value) {
  if (!value || value === 'all') return true;
  if (GRAPH_FILTERS.some(([v]) => v === value)) return true;
  if (String(value).startsWith('cat:')) return !!pickCat(String(value).slice(4));
  if (String(value).startsWith('folder:')) return !!pickFolder(String(value).slice(7));
  return false;
}
function graphFilterCount(value) {
  const f = graphFilterExists(value) ? value : 'all';
  if (f === 'all') return state.items.length;
  if (f === 'strong') {
    const ids = new Set();
    const thr = strongLinkThreshold();
    for (const l of state.links) {
      const score = Number(l.score) || 0;
      if (!l.auto || score >= thr) { ids.add(l.source); ids.add(l.target); }
    }
    return [...ids].filter(id => pickItem(id)).length;
  }
  return state.items.filter(item => itemMatchesGraphFilter(item, f)).length;
}
function dynamicGraphFilterSections() {
  const typeValues = ['all', 'notes', 'tasks', 'people', 'deliverables', 'risks', 'strong'];
  const types = typeValues
    .map(value => ({ value, label: graphFilterLabel(value), count: graphFilterCount(value) }))
    .filter(d => d.value === 'all' || d.value === 'notes' || d.value === 'tasks' || d.count > 0);
  const categories = state.categories
    .map(c => ({ value: `cat:${c.id}`, label: c.name, count: graphFilterCount(`cat:${c.id}`), color: c.color }))
    .filter(d => d.count > 0)
    .sort((a,b) => b.count - a.count || a.label.localeCompare(b.label));
  const folders = state.folders
    .map(f => ({ value: `folder:${f.id}`, label: folderLabel(f.id), count: graphFilterCount(`folder:${f.id}`) }))
    .filter(d => d.count > 0)
    .sort((a,b) => b.count - a.count || a.label.localeCompare(b.label));
  return [
    { title: t('filterTypes'), items: types },
    { title: t('filterCategories'), items: categories.slice(0, 18) },
    { title: t('filterFolders'), items: folders.slice(0, 20) },
  ];
}
function renderGraphFilterChips() {
  const box = $('graphFilterChips');
  if (!box) return;
  const active = graphFilterExists(state.settings.graphFilter) ? (state.settings.graphFilter || 'all') : 'all';
  const sections = dynamicGraphFilterSections().filter(sec => sec.items.length);
  box.innerHTML = sections.map(sec => `
    <section class="graph-filter-section">
      <h4>${escHtml(sec.title)}</h4>
      <div class="graph-filter-section-grid">
        ${sec.items.map(d => `
          <button class="graph-filter-chip${d.value === active ? ' is-active' : ''}" type="button" data-filter="${escHtml(d.value)}" role="option" aria-selected="${d.value === active}">
            ${d.color ? `<span class="dot" style="background:${escHtml(d.color)}"></span>` : ''}
            <span>${escHtml(d.label)}</span><b>${d.count}</b>
          </button>`).join('')}
      </div>
    </section>`).join('') || `<p class="graph-filter-help">${escHtml(t('noDynamicFilters'))}</p>`;
  const summary = $('graphFilterSummary');
  if (summary) summary.innerHTML = `<span>${escHtml(t('filterCurrent'))}</span><strong>${escHtml(graphFilterLabel(active))}</strong>`;
}
function closeTransientUI() {
  if ($('graphFilterPopover')) $('graphFilterPopover').hidden = true;
  if ($('graphInfoPanel')) $('graphInfoPanel').hidden = true;
  $('btnGraphFilters')?.classList.remove('is-active');
  graph.connectMode = false;
  graph.connectFrom = null;
}

function syncRailState() {
  const focusGraph = app.classList.contains('focus-graph');
  $('btnEditorRail')?.classList.toggle('is-active', !focusGraph && !app.classList.contains('sidebar-collapsed'));
  $('btnGraphRail')?.classList.toggle('is-active', focusGraph);
  $('btnSearch')?.classList.toggle('is-active', document.activeElement === $('searchInput'));
  $('btnThemeQuick')?.classList.remove('is-active');
  $('btnMore')?.classList.remove('is-active');
}

function applyGraphFilter(value, close = true) {
  state.settings.graphFilter = graphFilterExists(value) ? value : 'all';
  graph.local = false;
  stabilizeGraph();
  updateCounts();
  translateUI();
  centerGraph();
  save(); saveUI();
  if (close) closeTransientUI();
}

/* ── Render all ──────────────────────────────────────────────────────── */
function renderAll() {
  applyTheme();
  translateUI();
  renderTree();
  renderCategories();
  renderEditor();
  renderSettingsCategories();
  updateCounts();
  resizeCanvas(true);
  stripNativeTitles();
}

/* ══════════════════════════════════════════════════════════════════════
   TREE / VAULT PANE
══════════════════════════════════════════════════════════════════════ */
let selectedId         = null;
let selectedFolderId   = null;
let linkAnchorId       = null;
let dragData           = null;
let folderOpen         = new Set();
let blankResetTimer    = null;
let blankCreateAnchor  = null;

function folderPath(folderId) {
  const parts = [];
  let f = pickFolder(folderId), guard = 0;
  while (f && guard++ < 50) { parts.unshift(f.name); f = pickFolder(f.parentId); }
  return parts.join(' / ') || t('root');
}
function selectedItem()       { return pickItem(selectedId); }
function itemCategory(item)   { return pickCat(item?.categoryId) || state.categories[0]; }
function validFolderId(id)    { return !!id && _folderMap.has(id); }
function currentParentId()    { return validFolderId(selectedFolderId) ? selectedFolderId : null; }
function clearFolderSel()     { selectedFolderId = null; renderTree(); }

// Memoised folder content count
const _folderCountCache = new Map();
function countFolderContents(folderId) {
  if (_folderCountCache.has(folderId)) return _folderCountCache.get(folderId);
  const children = state.folders.filter(f => f.parentId === folderId);
  let count = state.items.filter(i => i.folderId === folderId).length;
  for (const c of children) count += countFolderContents(c.id);
  _folderCountCache.set(folderId, count);
  return count;
}


function renderVaultSummary() {
  const panel = $('vaultSummaryPanel');
  const box = $('vaultSummary');
  if (!box) return;
  const folders = state.folders.length;
  const notes = state.items.filter(i => i.type !== 'task').length;
  const tasks = state.items.filter(i => i.type === 'task').length;
  const openTasks = state.items.filter(i => i.type === 'task' && !i.done).length;
  const selected = selectedItem();
  box.innerHTML = `
    <button type="button" class="summary-card" data-summary-filter="folders"><b>${folders}</b><span>${escHtml(t('folders'))}</span></button>
    <button type="button" class="summary-card" data-summary-filter="notes"><b>${notes}</b><span>${escHtml(t('filterNotes'))}</span></button>
    <button type="button" class="summary-card" data-summary-filter="tasks"><b>${tasks}</b><span>${escHtml(t('filterTasks'))}</span></button>
  `;
  const hint = $('vaultSummaryHint');
  if (hint) {
    hint.textContent = selected
      ? `${selected.type === 'task' ? t('task') : t('note')}: ${selected.title}${openTasks ? ' · ' + openTasks + ' pendente(s)' : ''}`
      : t('summaryHint');
  }
  if (panel) panel.querySelector('summary span').textContent = t('workspaceSummary');
}

function renderTree() {
  _folderCountCache.clear();
  $('vaultTitleBtn').textContent = state.settings.vaultName || 'Connector';
  renderVaultSummary();
  const query = $('searchInput').value.trim().toLowerCase();
  const root = $('tree');
  root.innerHTML = '';

  // Build lookup maps
  const childrenByParent = new Map();
  for (const f of state.folders) {
    const key = f.parentId || 'root';
    if (!childrenByParent.has(key)) childrenByParent.set(key, []);
    childrenByParent.get(key).push(f);
  }
  const itemsByFolder = new Map();
  for (const it of state.items) {
    const key = it.folderId || 'root';
    if (!itemsByFolder.has(key)) itemsByFolder.set(key, []);
    itemsByFolder.get(key).push(it);
  }
  for (const arr of childrenByParent.values()) arr.sort((a,b) => a.name.localeCompare(b.name));
  for (const arr of itemsByFolder.values())    arr.sort((a,b) => a.title.localeCompare(b.title));

  const folderHasMatch = (folderId) => {
    if (!query) return true;
    const folder = pickFolder(folderId);
    if (folder?.name.toLowerCase().includes(query)) return true;
    const directItems = itemsByFolder.get(folderId || 'root') || [];
    if (directItems.some(it => it.title.toLowerCase().includes(query) || it.body.toLowerCase().includes(query))) return true;
    const childFolders = childrenByParent.get(folderId || 'root') || [];
    return childFolders.some(f => folderHasMatch(f.id));
  };

  const makeFolder = (folder, depth) => {
    const row = document.createElement('div');
    row.className = 'folder-row' + (selectedFolderId === folder.id ? ' is-selected' : '');
    row.style.paddingLeft = `${Math.min(depth * 16, 80)}px`;
    row.draggable = true; row.tabIndex = 0;
    row.setAttribute('role', 'treeitem');
    row.setAttribute('aria-selected', String(selectedFolderId === folder.id));
    row.dataset.type = 'folder'; row.dataset.id = folder.id;
    row.innerHTML = `<span class="chev" aria-hidden="true">${folderOpen.has(folder.id) ? '⌄' : '›'}</span>${icons.folder}<span class="row-label">${escHtml(folder.name)}</span><span class="count">${countFolderContents(folder.id)}</span><button class="icon-btn row-rename" type="button" aria-label="${t('renameFolder')}"><svg viewBox="0 0 24 24"><path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="M13.5 6.5l4 4"/></svg></button>`;
    row.querySelector('.chev').onclick = (e) => { e.stopPropagation(); toggleFolder(folder.id); };
    row.querySelector('.row-rename').onclick = (e) => { e.stopPropagation(); renameFolder(folder.id); };
    let clickTimer = null;
    row.onclick = (e) => {
      if (e.target.closest('button,input')) return;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { selectedFolderId = folder.id; selectedId = null; state.selectedId = null; linkAnchorId = null; settleGraph(260); closeTransientUI(); renderTree(); updateCounts(); saveUI(); }, 170);
    };
    row.ondblclick = (e) => {
      clearTimeout(clickTimer);
      if (!e.target.closest('button,input')) renameFolder(folder.id);
    };
    row.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectedFolderId = folder.id; selectedId = null; state.selectedId = null; linkAnchorId = null; settleGraph(260); closeTransientUI(); renderTree(); updateCounts(); saveUI(); }
    };
    attachDrag(row, 'folder', folder.id);
    attachDrop(row, folder.id);
    return row;
  };

  const makeItem = (item) => {
    if (query && !item.title.toLowerCase().includes(query) && !item.body.toLowerCase().includes(query)) return null;
    const row = document.createElement('div');
    row.className = 'item-row' + (selectedId === item.id ? ' is-selected' : '');
    row.style.paddingLeft = '28px';
    row.draggable = true; row.tabIndex = 0;
    row.setAttribute('role', 'treeitem');
    row.setAttribute('aria-selected', String(selectedId === item.id));
    row.dataset.type = 'item'; row.dataset.id = item.id;
    const cat = itemCategory(item);
    const catDot = `<span class="dot" style="background:${escHtml(cat.color)}" aria-hidden="true"></span>`;
    row.innerHTML = `<span aria-hidden="true">${item.type === 'task' ? icons.task : icons.note}</span>${catDot}<span class="row-label">${escHtml(item.title)}</span>`;
    let clickTimer = null;
    let clickAnchor = null;
    row.onclick = (e) => {
      if (e.target.closest('button,input')) return;
      clearTimeout(clickTimer);
      if (e.detail <= 1) {
        clickAnchor = selectedId;
        clickTimer = setTimeout(() => selectItem(item.id), 260);
      }
    };
    row.ondblclick = (e) => {
      if (e.target.closest('button,input')) return;
      clearTimeout(clickTimer);
      const anchor = clickAnchor || linkAnchorId;
      if (anchor && anchor !== item.id) upsertManualLink(anchor, item.id, { allowCrossFolder: false });
      else selectItem(item.id);
    };
    row.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectItem(item.id); } };
    attachDrag(row, 'item', item.id);
    return row;
  };

  const renderLevel = (parentId, depth, container) => {
    const folders = childrenByParent.get(parentId || 'root') || [];
    const items   = itemsByFolder.get(parentId || 'root') || [];

    let visibleFolders = query ? folders.filter(f => folderHasMatch(f.id)) : folders;
    let visibleItems   = query ? items.filter(it => it.title.toLowerCase().includes(query) || it.body.toLowerCase().includes(query)) : items;

    for (const folder of visibleFolders) {
      const row = makeFolder(folder, depth);
      container.appendChild(row);
      if (folderOpen.has(folder.id) || query) {
        const sub = document.createElement('div');
        sub.className = 'tree-children';
        renderLevel(folder.id, depth + 1, sub);
        if (sub.children.length > 0) container.appendChild(sub);
      }
    }
    for (const item of visibleItems) {
      const row = makeItem(item);
      if (row) container.appendChild(row);
    }
  };

  renderLevel(null, 0, root);


  if (!root.children.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-tree';
    empty.textContent = query ? 'No results' : t('noSelection');
    root.appendChild(empty);
  }
}

function renderCategories() {
  const list = $('categoryList');
  list.innerHTML = '';
  for (const cat of state.categories) {
    const row = document.createElement('div');
    row.className = 'category-row';
    row.innerHTML = `<span class="dot" style="background:${escHtml(cat.color)}"></span><span class="row-label">${escHtml(cat.name)}</span>`;
    row.ondblclick = (e) => { if (!e.target.closest('button,input')) beginRowRename(row, cat.name, (v) => mutate(t('renamed'), () => { cat.name = v || cat.name; })); };
    list.appendChild(row);
  }
}

function renderSettingsCategories() {
  const box = $('settingsCategoryList');
  if (!box) return;
  box.innerHTML = '';
  for (const cat of state.categories) {
    const row = document.createElement('div');
    row.className = 'settings-cat-row';
    row.innerHTML = `<span class="dot" style="background:${escHtml(cat.color)}"></span><span class="row-label">${escHtml(cat.name)}</span><button class="icon-btn" type="button" aria-label="${t('deleted')}">${icons.trash}</button>`;
    row.querySelector('button').onclick = () => deleteCategory(cat.id);
    row.ondblclick = (e) => { if (!e.target.closest('button,input')) beginRowRename(row, cat.name, (v) => mutate(t('renamed'), () => { cat.name = v || cat.name; })); };
    box.appendChild(row);
  }
}

/* ── Editor ──────────────────────────────────────────────────────────── */
function resizeTitleInput() {
  const el = $('titleInput');
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = Math.min(Math.max(el.scrollHeight, 58), 220) + 'px';
}
function cleanTitleValue(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}
function renderEditor() {
  const item = selectedItem();
  if (!item) {
    $('crumb').textContent = t('noSelection');
    $('titleInput').value = '';
    $('bodyInput').value  = '';
    resizeTitleInput();
    $('taskEditorRow').hidden = true;
    $('folderSelect').innerHTML = `<option value="">${escHtml(t('root'))}</option>`;
    $('categorySelect').innerHTML = '';
    $('categoryColorDot').style.background = 'var(--accent)';
    return;
  }
  const cat = itemCategory(item);
  $('crumb').textContent = `${folderPath(item.folderId)} / ${cat.name}`;
  if (document.activeElement !== $('titleInput')) $('titleInput').value = item.title;
  resizeTitleInput();
  if (document.activeElement !== $('bodyInput'))  $('bodyInput').value  = item.body || '';
  $('taskEditorRow').hidden = item.type !== 'task';
  $('taskDone').checked     = !!item.done;
  $('taskPriority').value   = item.priority || 'normal';
  $('taskDue').value        = item.due || '';
  renderFolderSelect(); renderCategorySelect();
}

function renderFolderSelect() {
  const select = $('folderSelect');
  const val = selectedItem()?.folderId || '';
  select.innerHTML = `<option value="">${escHtml(t('root'))}</option>`;
  const byParent = new Map();
  state.folders.forEach(f => { const k = f.parentId || 'root'; if (!byParent.has(k)) byParent.set(k,[]); byParent.get(k).push(f); });
  for (const arr of byParent.values()) arr.sort((a,b) => a.name.localeCompare(b.name));
  const add = (parent, depth) => {
    for (const f of byParent.get(parent || 'root') || []) {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = `${'— '.repeat(depth)}${f.name}`;
      select.appendChild(opt);
      add(f.id, depth + 1);
    }
  };
  add(null, 0);
  select.value = val;
}

function renderCategorySelect() {
  const select = $('categorySelect');
  const item   = selectedItem();
  select.innerHTML = '';
  for (const c of state.categories) {
    const opt = document.createElement('option');
    opt.value = c.id; opt.textContent = c.name;
    select.appendChild(opt);
  }
  if (item) select.value = item.categoryId;
  $('categoryColorDot').style.background = itemCategory(item)?.color || '#a78bfa';
}

/* ── Item / folder / category operations ────────────────────────────── */
function selectItem(id, opts = {}) {
  const item = pickItem(id);
  if (!item) return;
  const wasPaused = !!graph.paused;
  selectedId = id;
  state.selectedId = id;
  linkAnchorId = id;
  selectedFolderId = item.folderId || null;
  if (selectedFolderId) folderOpen.add(selectedFolderId);

  // Selecting a file/note must always bring the editor back in workspace mode.
  // This fixes the invisible editor column left after closing the editor and
  // then clicking an item from the file tree. Keep graph-only focus untouched.
  if (opts.openEditor !== false && !app.classList.contains('focus-graph')) {
    app.classList.remove('editor-collapsed');
  }

  if (!wasPaused) settleGraph(420);
  else freezeMotion();
  closeTransientUI();
  save();
  renderAll();
  resizeCanvas(true);
  syncRailState();
  saveUI();
  if (opts.center === true || opts.scale != null) centerOnItem(id, opts.scale ?? null);
  else centerIfOffscreen(id);
}

function createItem(type) {
  const input = $('newName');
  const title = input.value.trim() || (type === 'task' ? t('newTask') : t('newNote'));
  const cat   = state.categories.find(c => c.name.toLowerCase().includes(type === 'task' ? 'task' : 'project')) || state.categories[0];
  mutate(t('created'), () => {
    const id   = uid(type === 'task' ? 'task_' : 'note_');
    const base = selectedItem();
    state.items.push({ id, type, title, folderId: base?.folderId || currentParentId() || null, categoryId: cat.id, body:'', done:false, priority:'normal', due:'', x:(base?.x||0)+80, y:(base?.y||0)+40, vx:0, vy:0 });
    selectedId = id; state.selectedId = id; linkAnchorId = id; input.value = '';
  });
  stabilizeGraph({ itemId: selectedId, render: false });
  settleGraph(520);
  centerOnItem(selectedId);
  updateCounts();
  saveUI();
}

function createFolder() {
  const input = $('newName');
  const name  = input.value.trim() || t('newFolder');
  mutate(t('created'), () => {
    const id = uid('folder_');
    state.folders.push({ id, name, parentId: currentParentId() });
    selectedFolderId = id; folderOpen.add(id); input.value = '';
  });
}

function createCategory(name, color) {
  const finalName  = (name || $('newName')?.value || $('categoryName')?.value || t('newCategory')).trim();
  const finalColor = color || $('categoryColor')?.value || nextCategoryColor();
  if (!finalName) return;
  const existing = state.categories.find(c => c.name.trim().toLowerCase() === finalName.toLowerCase());
  if (existing) {
    if ($('newName')) $('newName').value = ''; if ($('categoryName')) $('categoryName').value = '';
    showToast(`${t('category')}: ${existing.name}`, false, 1000);
    return;
  }
  mutate(t('created'), () => {
    state.categories.push({ id: uid('cat_'), name: finalName, color: finalColor });
    if ($('newName')) $('newName').value = ''; if ($('categoryName')) $('categoryName').value = '';
  });
}


function renameFolder(id) {
  const folder = pickFolder(id); if (!folder) return;
  selectedFolderId = id; selectedId = null;
  const esc = window.CSS?.escape ? CSS.escape(id) : String(id).replace(/"/g, '\"');
  const row = document.querySelector(`.folder-row[data-id="${esc}"]`);
  if (row) {
    beginRowRename(row, folder.name, (v) => mutate(t('renamed'), () => { folder.name = v || folder.name; }));
    return;
  }
  const next = window.prompt(t('renameFolder'), folder.name);
  if (next && next.trim() && next.trim() !== folder.name) mutate(t('renamed'), () => { folder.name = next.trim(); });
}

function renameItem(id) {
  const item = pickItem(id); if (!item) return;
  const esc = window.CSS?.escape ? CSS.escape(id) : String(id).replace(/"/g, '\"');
  const row  = document.querySelector(`.item-row[data-id="${esc}"]`);
  if (row) beginRowRename(row, item.title, (v) => mutate(t('renamed'), () => { item.title = v || item.title; }));
  else {
    const next = window.prompt(t('renamed'), item.title);
    if (next && next.trim() && next.trim() !== item.title) mutate(t('renamed'), () => { item.title = next.trim(); });
  }
}

function beginRowRename(row, current, cb) {
  if (!row || row.querySelector('.inline-rename')) return;
  closeToast();
  const label = row.querySelector('.row-label'); if (!label) return;
  const original = current || label.textContent.trim();
  const input = document.createElement('input');
  input.className = 'inline-rename'; input.value = original;
  input.setAttribute('aria-label', t('renamed'));
  input.addEventListener('click', e => e.stopPropagation());
  input.addEventListener('pointerdown', e => e.stopPropagation());
  label.replaceWith(input); row.draggable = false; input.focus(); input.select();
  let done = false;
  const finish = (commit) => {
    if (done) return; done = true;
    row.draggable = (row.dataset.type === 'folder' || row.dataset.type === 'item');
    const value = input.value.trim();
    if (commit && value && value !== original) cb(value); else renderAll();
  };
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  { e.preventDefault(); finish(true);  }
    if (e.key === 'Escape') { e.preventDefault(); finish(false); }
  });
  input.addEventListener('blur', () => finish(true));
}

function deleteItem(id) {
  const item = pickItem(id); if (!item) return;
  mutate(t('deleted'), () => {
    state.items = state.items.filter(i => i.id !== id);
    state.links = state.links.filter(l => l.source !== id && l.target !== id);
    if (selectedId === id) selectedId = state.items[0]?.id || null;
  });
}

function deleteFolder(id) {
  mutate(t('folderDeleted'), () => {
    const folderIds = collectFolderIds(id);
    const itemIds   = new Set(state.items.filter(i => folderIds.has(i.folderId)).map(i => i.id));
    state.folders = state.folders.filter(f => !folderIds.has(f.id));
    state.items   = state.items.filter(i => !itemIds.has(i.id));
    state.links   = state.links.filter(l => !itemIds.has(l.source) && !itemIds.has(l.target));
    if (selectedId && itemIds.has(selectedId)) selectedId = state.items[0]?.id || null;
    if (selectedFolderId && folderIds.has(selectedFolderId)) selectedFolderId = null;
  });
}

function collectFolderIds(rootId) {
  const set = new Set([rootId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const f of state.folders) {
      if (f.parentId && set.has(f.parentId) && !set.has(f.id)) { set.add(f.id); changed = true; }
    }
  }
  return set;
}

function deleteCategory(id) {
  if (state.categories.length <= 1) { showToast(t('cannotDeleteLastCategory')); return; }
  const replacement = state.categories.find(c => c.id !== id);
  mutate(t('categoryDeleted'), () => {
    state.categories = state.categories.filter(c => c.id !== id);
    state.items.forEach(i => { if (i.categoryId === id) i.categoryId = replacement.id; });
  });
}

function deleteSelectedOrLink() {
  if (graph.hover?.type === 'link') {
    const linkId = graph.hover.id;
    const link = state.links.find(l => l.id === linkId);
    mutate(t('deleted'), () => {
      if (link?.auto) {
        if (!Array.isArray(state.blockedLinks)) state.blockedLinks = [];
        const k = pairKey(link.source, link.target);
        if (!state.blockedLinks.includes(k)) state.blockedLinks.push(k);
      }
      state.links = state.links.filter(l => l.id !== linkId);
      graph.hover = null;
    });
  } else if (selectedId) {
    deleteItem(selectedId);
  }
}

function toggleFolder(id) {
  folderOpen.has(id) ? folderOpen.delete(id) : folderOpen.add(id);
  renderTree();
}

/* ── Drag & drop ─────────────────────────────────────────────────────── */
function attachDrag(el, type, id) {
  el.addEventListener('dragstart', (e) => {
    dragData = { type, id };
    el.classList.add('dragging');
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  });
  el.addEventListener('dragend', () => { el.classList.remove('dragging'); clearDragState(); });
}
function attachDrop(el, folderId) {
  el.addEventListener('dragover',  (e) => { e.preventDefault(); el.classList.add('drag-over'); });
  el.addEventListener('dragleave', (e) => { if (!el.contains(e.relatedTarget)) el.classList.remove('drag-over'); });
  el.addEventListener('drop', (e) => {
    e.preventDefault(); e.stopPropagation();
    el.classList.remove('drag-over');
    moveDraggedToFolder(folderId);
    clearDragState();
  });
}
function clearDragState() {
  dragData = null;
  document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
  document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
}
function moveDraggedToFolder(targetFolderId) {
  if (!dragData) return;
  if (dragData.type === 'item') {
    const item = pickItem(dragData.id);
    if (item && item.folderId !== targetFolderId) mutate(t('moved'), () => { item.folderId = targetFolderId || null; selectedFolderId = targetFolderId; });
  } else if (dragData.type === 'folder') {
    const folder = pickFolder(dragData.id);
    if (!folder) return;
    if (folder.id === targetFolderId || isDescendant(targetFolderId, folder.id)) { showToast(t('cannotMove')); return; }
    mutate(t('moved'), () => { folder.parentId = targetFolderId || null; selectedFolderId = folder.id; if (targetFolderId) folderOpen.add(targetFolderId); });
  }
}
function isDescendant(candidateId, parentId) {
  let f = pickFolder(candidateId), guard = 0;
  while (f && guard++ < 80) {
    if (f.parentId === parentId) return true;
    f = pickFolder(f.parentId);
  }
  return false;
}

/* ══════════════════════════════════════════════════════════════════════
   SMART LINKS (semantic + structural graph)
══════════════════════════════════════════════════════════════════════ */
function syncSmartLinks(markManual = false) {
  if (!Array.isArray(state.links)) state.links = [];
  if (!Array.isArray(state.blockedLinks)) state.blockedLinks = [];

  const ids     = new Set(state.items.map(i => i.id));
  const itemMap = new Map(state.items.map(i => [i.id, i]));
  const blocked = new Set(
    state.blockedLinks.filter(k => {
      const [a,b] = String(k).split('::');
      return ids.has(a) && ids.has(b) && a !== b;
    })
  );
  state.blockedLinks = [...blocked];

  const manual = [];
  const seen   = new Set();
  for (const raw of state.links) {
    if (!raw || !ids.has(raw.source) || !ids.has(raw.target) || raw.source === raw.target) continue;
    const key = pairKey(raw.source, raw.target);
    if (seen.has(key) || blocked.has(key)) continue;

    // Only explicit manual/imported links are preserved. Auto links are recalculated.
    // This fixes the old behavior where every previous auto link became permanent.
    const isManual = markManual || raw.auto === false || raw.manual === true;
    if (!isManual) continue;

    const a = itemMap.get(raw.source), b = itemMap.get(raw.target);
    manual.push({ ...raw, auto: false, score: Number(raw.score) || +smartScore(a,b).toFixed(3) });
    seen.add(key);
  }

  const n = state.items.length;
  if (n < 2) { state.links = manual; return 0; }

  const reserved = new Set([...seen, ...blocked]);
  const candidates = buildSmartCandidates(state.items, itemMap, reserved);
  candidates.sort((x,y) => y.score - x.score);

  const degree = new Map(state.items.map(i => [i.id, 0]));
  const bump   = (id) => degree.set(id, (degree.get(id) || 0) + 1);
  manual.forEach(l => { bump(l.source); bump(l.target); });

  const auto = [];
  const addLink = (c) => {
    const key = pairKey(c.a, c.b);
    if (seen.has(key) || blocked.has(key)) return false;
    auto.push({ id: uid('auto_'), source: c.a, target: c.b, auto: true, score: +c.score.toFixed(3), reason: c.reason || 'smart' });
    seen.add(key); bump(c.a); bump(c.b);
    return true;
  };

  // Backbone: Kruskal-style connectivity using the strongest structural/semantic candidates.
  const parent = new Map(state.items.map(i => [i.id, i.id]));
  const find   = (x) => { if (parent.get(x) !== x) parent.set(x, find(parent.get(x))); return parent.get(x); };
  const unite  = (a,b) => { const ra = find(a), rb = find(b); if (ra === rb) return false; parent.set(ra, rb); return true; };
  const backboneThreshold = n > 800 ? 0.18 : 0.205;
  for (const c of candidates) {
    if (c.score < backboneThreshold) continue;
    if (unite(c.a, c.b)) addLink(c);
  }

  // Dense-but-readable local links.
  const strongThr   = n > 900 ? 0.34 : n > 450 ? 0.325 : 0.36;
  const maxAutoLinks = Math.max(n - 1, Math.min(Math.round(n * (n > 900 ? 1.65 : n > 450 ? 1.9 : 2.35)), 3600));
  for (const c of candidates) {
    if (auto.length >= maxAutoLinks) break;
    if (c.score < strongThr) continue;
    if ((degree.get(c.a)||0) >= autoDegreeCap(itemMap.get(c.a), n) || (degree.get(c.b)||0) >= autoDegreeCap(itemMap.get(c.b), n)) continue;
    addLink(c);
  }

  // Guarantee at least one neighbor per node whenever a candidate exists.
  for (const item of state.items) {
    if ((degree.get(item.id) || 0) > 0) continue;
    for (const c of candidates) {
      if ((c.a === item.id || c.b === item.id) && c.score >= .18 && addLink(c)) break;
    }
  }

  state.links = [...manual, ...auto];
  seedSmartLayout(false);
  return auto.length;
}

function buildSmartCandidates(items, itemMap, alreadySeen) {
  const n = items.length;
  const meta = buildSemanticMeta(items);
  const cand = new Map();
  const addPair = (a, b, hint = 0, reason = '') => {
    if (!a || !b || a === b) return;
    const key = pairKey(a, b);
    if (alreadySeen && alreadySeen.has(key)) return;
    const prev = cand.get(key);
    if (!prev || hint > prev.hint) cand.set(key, { a, b, hint, reason });
  };
  const sortedIds = (arr) => arr
    .map(x => typeof x === 'string' ? itemMap.get(x) : x)
    .filter(Boolean)
    .sort(compareItemsForStructure)
    .map(x => x.id);
  const pairGroup = (arr, hint, limit = 130, windowSize = 12, reason = '') => {
    const ids = sortedIds(arr);
    if (ids.length < 2) return;
    if (ids.length <= limit) {
      for (let i = 0; i < ids.length; i++) for (let j = i+1; j < ids.length; j++) addPair(ids[i], ids[j], hint, reason);
    } else {
      // Large groups are linked as local windows in deterministic order plus a light bridge chain.
      for (let i = 0; i < ids.length; i++) {
        const end = Math.min(i + windowSize + 1, ids.length);
        for (let j = i+1; j < end; j++) addPair(ids[i], ids[j], hint, reason);
        if (i + windowSize * 2 < ids.length) addPair(ids[i], ids[i + windowSize * 2], hint * .55, reason + ':bridge');
      }
    }
  };

  const byFolder = groupBy(items, it => it.folderId || 'root');
  const byRoot   = groupBy(items, it => rootFolderId(it.folderId) || 'root');
  const byCat    = groupBy(items, it => `${rootFolderId(it.folderId) || 'root'}::${it.categoryId || 'none'}`);
  for (const arr of byFolder.values()) pairGroup(arr, 0.35, 140, 12, 'folder');
  for (const arr of byRoot.values())   pairGroup(arr, 0.13, 120, 10, 'root-folder');
  for (const arr of byCat.values())    pairGroup(arr, 0.16, 110, 9, 'category-local');

  // Sequential project flow: links adjacent ordered items in each folder so the graph reads as phases.
  for (const arr of byFolder.values()) {
    const ordered = sortedIds(arr);
    for (let i = 0; i < ordered.length - 1; i++) addPair(ordered[i], ordered[i+1], 0.28, 'sequence');
  }

  // Inverted token index with IDF. Very common words are ignored so generic terms do not create fake links.
  const tokenEntries = [...meta.byToken.entries()].sort((a,b) => a[0].localeCompare(b[0]));
  for (const [, arr] of tokenEntries) {
    if (arr.length < 2 || arr.length > Math.max(26, Math.min(140, n * .22))) continue;
    pairGroup(arr, 0.21, 92, 8, 'token');
  }

  // Explicit reference links: when an item title is mentioned inside another item's body/title.
  for (const [refId, mentionedBy] of meta.mentions.entries()) {
    for (const id of mentionedBy) addPair(refId, id, 0.42, 'explicit-mention');
  }

  // Responsibility links: people named in task/note text should connect to the work,
  // but not become a giant hub. The later degree cap controls density.
  const people = items.filter(isPersonItem);
  const workItems = items.filter(x => !isPersonItem(x));
  for (const p of people) {
    for (const w of workItems) {
      if (responsibilityBoost(p, w, meta) >= .55) addPair(p.id, w.id, 0.48, 'responsibility');
    }
  }

  // Phase bridges between adjacent folders: creates a readable project flow
  // without connecting every item to every other phase.
  const folderKeys = [...byFolder.keys()].sort((a,b) => folderOrderValue(a) - folderOrderValue(b) || folderPathText(a).localeCompare(folderPathText(b)));
  for (let fi = 0; fi < folderKeys.length - 1; fi++) {
    if ((rootFolderId(folderKeys[fi]) || folderKeys[fi]) !== (rootFolderId(folderKeys[fi + 1]) || folderKeys[fi + 1])) continue;
    const left = (byFolder.get(folderKeys[fi]) || []).slice().sort(compareItemsForStructure).slice(-2);
    const right = (byFolder.get(folderKeys[fi + 1]) || []).slice().sort(compareItemsForStructure).slice(0, 2);
    for (const a of left) for (const b of right) addPair(a.id, b.id, 0.31, 'phase-bridge');
  }

  const out = [];
  for (const [, c] of cand) {
    const a = itemMap.get(c.a), b = itemMap.get(c.b);
    if (!a || !b) continue;
    const score = Math.min(1, smartScore(a, b, meta) + c.hint * .16);
    const minScore = n > 900 ? .125 : n > 420 ? .140 : .165;
    if (score >= minScore && smartCandidateAllowed(a, b, c.reason, score, meta)) out.push({ a: c.a, b: c.b, score, reason: c.reason });
  }

  // Small/medium exact fallback for high-quality semantic edges.
  if (n <= 520) {
    const has = new Set(out.map(c => pairKey(c.a, c.b)));
    for (let i = 0; i < n; i++) for (let j = i+1; j < n; j++) {
      const a = items[i], b = items[j], key = pairKey(a.id, b.id);
      if (has.has(key) || (alreadySeen && alreadySeen.has(key))) continue;
      const score = smartScore(a, b, meta);
      if (score >= .225 && smartCandidateAllowed(a, b, 'exact', score, meta)) out.push({ a: a.id, b: b.id, score, reason: 'exact' });
    }
  }
  return out.sort((a,b) => b.score - a.score || a.a.localeCompare(b.a) || a.b.localeCompare(b.b));
}

/* ── Semantic model: folder hierarchy + category + TF-IDF + project order ── */
function smartCandidateAllowed(a, b, reason = '', score = 0, meta = null) {
  const sameFolder = a?.folderId && a.folderId === b?.folderId;
  const sameRoot = rootFolderId(a?.folderId) && rootFolderId(a?.folderId) === rootFolderId(b?.folderId);
  const explicit = explicitMentionBoost(a, b, meta || buildSemanticMeta([a, b])) > 0;
  const responsibility = responsibilityBoost(a, b, meta) >= .55;
  if (sameFolder || explicit || responsibility) return true;
  if (sameRoot) return score >= .19 || /sequence|phase|root-folder|category-local/.test(reason || '');
  const semantic = weightedTextSim(`${a.title} ${a.body || ''}`, `${b.title} ${b.body || ''}`, 1, meta || buildSemanticMeta([a, b]));
  return score >= .52 && semantic >= .50;
}

function smartScore(a, b, meta = null) {
  if (!a || !b) return 0;
  meta = meta || buildSemanticMeta([a,b]);
  const sameFolder   = (a.folderId && a.folderId === b.folderId) ? 0.25 : 0;
  const hierarchy    = folderAffinity(a.folderId, b.folderId) * 0.20;
  const sameCategory = (a.categoryId && a.categoryId === b.categoryId) ? 0.105 : 0;
  const titleSim     = weightedTextSim(a.title, b.title, 2.5, meta) * 0.18;
  const bodySim      = weightedTextSim(`${a.title} ${a.body||''}`, `${b.title} ${b.body||''}`, 1.0, meta) * 0.18;
  const typeBridge   = semanticTypeBridge(a, b) * 0.065;
  const fnBoost      = folderNameBoost(a.folderId, b, meta) + folderNameBoost(b.folderId, a, meta);
  const mentionBoost = explicitMentionBoost(a, b, meta) * 0.16;
  const orderBoost   = structuralOrderBoost(a, b) * 0.09;
  const dueBoost     = dueDateBoost(a, b) * 0.03;
  const personBoost  = responsibilityBoost(a, b, meta) * 0.155;
  const phaseBoost   = phaseCompatibilityBoost(a, b) * 0.055;
  const kindPenalty  = itemKind(a) !== itemKind(b) && !isPersonItem(a) && !isPersonItem(b) ? 0.98 : 1;
  const raw = (sameFolder + hierarchy + sameCategory + titleSim + bodySim + typeBridge + fnBoost + mentionBoost + orderBoost + dueBoost + personBoost + phaseBoost) * kindPenalty;
  return clamp(raw * crossRootPenalty(a, b, meta), 0, 1);
}

function buildSemanticMeta(items) {
  const byToken = new Map();
  const docTokens = new Map();
  const titleTokens = new Map();
  const df = new Map();
  for (const it of items) {
    const toks = tokenise(`${it.title} ${it.body || ''}`);
    const unique = [...new Set(toks)];
    docTokens.set(it.id, toks);
    titleTokens.set(it.id, tokenise(it.title));
    for (const tok of unique) {
      df.set(tok, (df.get(tok) || 0) + 1);
      if (!byToken.has(tok)) byToken.set(tok, []);
      byToken.get(tok).push(it);
    }
  }
  const idf = new Map();
  const n = Math.max(1, items.length);
  for (const [tok, d] of df) idf.set(tok, Math.log(1 + n / (1 + d)) + 0.25);

  const mentions = new Map();
  const refs = items
    .map(it => ({ id: it.id, title: String(it.title || '').trim(), tokens: titleTokens.get(it.id) || [] }))
    .filter(x => x.title.length >= 4 && x.tokens.length && x.title.length <= 80)
    .sort((a,b) => b.title.length - a.title.length);
  for (const it of items) {
    const text = normalText(`${it.title} ${it.body || ''}`);
    for (const r of refs) {
      if (r.id === it.id) continue;
      const needle = normalText(r.title);
      const tokenHit = r.tokens.length >= 2 && r.tokens.every(tok => text.includes(tok));
      if ((needle.length >= 6 && text.includes(needle)) || tokenHit) {
        if (!mentions.has(r.id)) mentions.set(r.id, []);
        mentions.get(r.id).push(it.id);
      }
    }
  }
  return { byToken, docTokens, titleTokens, idf, mentions };
}

function normalText(text) {
  return String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
}

function compareItemsForStructure(a, b) {
  const fo = folderPathText(a.folderId).localeCompare(folderPathText(b.folderId));
  if (fo) return fo;
  const ao = itemOrderValue(a), bo = itemOrderValue(b);
  if (ao !== bo) return ao - bo;
  const ad = String(a.due || '9999-99-99'), bd = String(b.due || '9999-99-99');
  if (ad !== bd) return ad.localeCompare(bd);
  const ac = String(pickCat(a.categoryId)?.name || ''), bc = String(pickCat(b.categoryId)?.name || '');
  if (ac !== bc) return ac.localeCompare(bc);
  return String(a.title || '').localeCompare(String(b.title || ''));
}

function itemOrderValue(item) {
  const text = `${folderPathText(item.folderId)} ${item.title || ''}`;
  const m = text.match(/(?:^|\D)(\d{1,3})(?:\D|$)/);
  if (m) return parseInt(m[1], 10);
  const words = normalText(text);
  const orderWords = [
    ['inicio',1], ['planejamento',2], ['diagnostico',3], ['mapeamento',4], ['desenvolvimento',5],
    ['execucao',6], ['validacao',7], ['controle',8], ['entrega',9], ['encerramento',10]
  ];
  for (const [w, v] of orderWords) if (words.includes(w)) return v;
  return 999;
}

function folderPathText(folderId) {
  return folderAncestors(folderId).reverse().map(id => pickFolder(id)?.name || id).join(' / ');
}

function semanticTypeBridge(a, b) {
  if (a.type !== b.type) return 1;
  const ca = normalText(pickCat(a.categoryId)?.name || '');
  const cb = normalText(pickCat(b.categoryId)?.name || '');
  if ((ca.includes('pessoa') || ca.includes('person')) && !(cb.includes('pessoa') || cb.includes('person'))) return .85;
  if ((cb.includes('pessoa') || cb.includes('person')) && !(ca.includes('pessoa') || ca.includes('person'))) return .85;
  return .25;
}

function categoryKind(item) {
  const name = normalText(pickCat(item?.categoryId)?.name || '');
  if (/pessoa|person|responsavel|equipe|membro/.test(name)) return 'person';
  if (/tarefa|task|acao|atividade/.test(name) || item?.type === 'task') return 'task';
  if (/entrega|entregavel|deliverable|resultado/.test(name)) return 'deliverable';
  if (/risco|risk|problema|bloqueio/.test(name)) return 'risk';
  if (/indicador|kpi|metric/.test(name)) return 'metric';
  if (/reuniao|meeting|ritual/.test(name)) return 'meeting';
  return item?.type === 'task' ? 'task' : 'note';
}

function isPersonItem(item) {
  if (!item) return false;
  if (categoryKind(item) === 'person') return true;
  const text = normalText(`${pickCat(item.categoryId)?.name || ''} ${item.title || ''}`);
  return /^(pessoa|person|responsavel|membro|equipe)/.test(text);
}

function responsibilityBoost(a, b, meta = null) {
  const person = isPersonItem(a) ? a : (isPersonItem(b) ? b : null);
  const work   = person === a ? b : (person === b ? a : null);
  if (!person || !work) return 0;
  const pTokens = tokenise(person.title || '').filter(tok => tok.length >= 3);
  if (!pTokens.length) return 0;
  const text = normalText(`${work.title || ''} ${work.body || ''} ${folderPathText(work.folderId)}`);
  const hits = pTokens.filter(tok => text.includes(tok)).length;
  const mention = explicitMentionBoost(person, work, meta || buildSemanticMeta([person, work]));
  return Math.max(mention, hits / Math.max(1, Math.min(2, pTokens.length)));
}

function phaseCompatibilityBoost(a, b) {
  const av = itemOrderValue(a), bv = itemOrderValue(b);
  if (av >= 900 || bv >= 900) return 0;
  const d = Math.abs(av - bv);
  if (d === 0 && (a.folderId === b.folderId || rootFolderId(a.folderId) === rootFolderId(b.folderId))) return .45;
  if (d === 1) return 1;
  if (d === 2) return .45;
  return 0;
}

function crossRootPenalty(a, b, meta = null) {
  const ra = rootFolderId(a.folderId), rb = rootFolderId(b.folderId);
  if (!ra || !rb || ra === rb) return 1;
  // Explicit mentions and person assignments are valid bridges across communities.
  if (explicitMentionBoost(a, b, meta || buildSemanticMeta([a,b])) || responsibilityBoost(a, b, meta) >= .55) return .96;
  // Otherwise only strong semantic similarity should cross root communities.
  const sim = weightedTextSim(`${a.title} ${a.body||''}`, `${b.title} ${b.body||''}`, 1, meta || buildSemanticMeta([a,b]));
  return sim > .50 ? .78 : .44;
}

function folderOrderValue(folderId) {
  const path = folderPathText(folderId);
  const m = path.match(/(?:^|\D)(\d{1,3})(?:\D|$)/);
  if (m) return parseInt(m[1], 10);
  const txt = normalText(path);
  const orderWords = [
    ['inicio',1], ['abertura',1], ['planejamento',2], ['diagnostico',3], ['mapeamento',4],
    ['arquitetura',5], ['desenho',5], ['desenvolvimento',6], ['execucao',7],
    ['validacao',8], ['controle',9], ['implantacao',10], ['entrega',11], ['encerramento',12]
  ];
  for (const [w, v] of orderWords) if (txt.includes(w)) return v;
  return 999;
}

function explicitMentionBoost(a, b, meta) {
  const ma = meta.mentions.get(a.id) || [];
  const mb = meta.mentions.get(b.id) || [];
  return ma.includes(b.id) || mb.includes(a.id) ? 1 : 0;
}

function structuralOrderBoost(a, b) {
  if (a.folderId !== b.folderId) return 0;
  const d = Math.abs(itemOrderValue(a) - itemOrderValue(b));
  if (d === 1) return 1;
  if (d === 0) return .35;
  if (d <= 2) return .35;
  return 0;
}

function dueDateBoost(a, b) {
  if (!a.due || !b.due) return 0;
  const da = Date.parse(a.due), db = Date.parse(b.due);
  if (!Number.isFinite(da) || !Number.isFinite(db)) return 0;
  const days = Math.abs(da - db) / 86400000;
  return days <= 2 ? 1 : days <= 7 ? .55 : 0;
}

function folderAffinity(aId, bId) {
  if (!aId || !bId || aId === bId) return aId === bId ? 1 : 0;
  const aa = folderAncestors(aId), bb = folderAncestors(bId);
  if (!aa.length || !bb.length) return 0;
  if (rootFolderId(aId) && rootFolderId(aId) === rootFolderId(bId)) return 0.62;
  const setA = new Set(aa); let closest = 0;
  for (let j = 0; j < bb.length; j++) {
    if (setA.has(bb[j])) closest = Math.max(closest, 1 / (1 + j + aa.indexOf(bb[j])));
  }
  return Math.min(0.66, closest);
}

function folderAncestors(id) {
  const out = []; let f = pickFolder(id), guard = 0;
  while (f && guard++ < 80) { out.push(f.id); f = pickFolder(f.parentId); }
  return out;
}

function rootFolderId(folderId) {
  let f = pickFolder(folderId); if (!f) return '';
  let last = f, guard = 0;
  while (f && f.parentId && guard++ < 80) { f = pickFolder(f.parentId); if (f) last = f; }
  return last?.id || folderId || '';
}

function folderNameBoost(folderId, item, meta = null) {
  const f = pickFolder(folderId);
  if (!f || !item) return 0;
  return weightedTextSim(f.name, `${item.title} ${item.body||''}`, 1.2, meta) * 0.055;
}

function weightedTextSim(a, b, w = 1, meta = null) {
  const va = tokenVector(a, w, meta), vb = tokenVector(b, w, meta);
  const keys = new Set([...va.keys(), ...vb.keys()]);
  if (!keys.size) return 0;
  let dot = 0, na = 0, nb = 0;
  for (const k of keys) {
    const x = va.get(k)||0, y = vb.get(k)||0;
    dot += x*y; na += x*x; nb += y*y;
  }
  return (na && nb) ? dot / Math.sqrt(na * nb) : 0;
}

function tokenVector(text, weight = 1, meta = null) {
  const map = new Map();
  for (const tok of tokenise(text)) {
    const idf = meta?.idf?.get(tok) ?? 1;
    map.set(tok, (map.get(tok)||0) + weight * idf);
  }
  return map;
}

function tokenise(text) {
  return String(text||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().split(/[^a-z0-9]+/)
    .map(w => w.replace(/s$/, ''))
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

/* ── Layout seed ─────────────────────────────────────────────────────── */
function groupBy(arr, fn) {
  const map = new Map();
  for (const x of arr) { const k = fn(x); if (!map.has(k)) map.set(k,[]); map.get(k).push(x); }
  return map;
}

function seedSmartLayout(force = false) {
  const n = state.items.length; if (!n) return;
  const degree = new Map(state.items.map(i => [i.id, 0]));
  for (const l of state.links || []) {
    degree.set(l.source, (degree.get(l.source)||0) + 1);
    degree.set(l.target, (degree.get(l.target)||0) + 1);
  }
  const { targets } = computeFlowTargets(state.items, degree);
  let i = 0;
  for (const item of state.items.slice().sort(compareItemsForStructure)) {
    const missing = !Number.isFinite(item.x) || !Number.isFinite(item.y) ||
                    (Math.abs(item.x) < .001 && Math.abs(item.y) < .001);
    if (!force && !missing && item._laidOut && Math.hypot(item.x, item.y) > 24) { i++; continue; }
    if (!force && !missing && Math.hypot(item.x, item.y) > 24) { item._laidOut = true; i++; continue; }
    const target = targets.get(item.id) || { x:0, y:0 };
    const a = i * 2.399963229728653;
    const jitter = 10 + Math.min(32, Math.sqrt(n) * 1.5);
    item.x = target.x + Math.cos(a) * jitter;
    item.y = target.y + Math.sin(a) * jitter;
    item.vx = 0; item.vy = 0; item._laidOut = true;
    i++;
  }
}


function smartRebuildRequested() {
  snapshot();
  state.blockedLinks = [];
  const count = syncSmartLinksIfNeeded(false, true);
  save(); renderAll();
  showToast(`${t('smartLinksDone')} · ${count} ${t('links')}`, false, 1200);
}

/* ══════════════════════════════════════════════════════════════════════
   PHYSICS  —  Barnes-Hut Quadtree O(n log n) repulsion
══════════════════════════════════════════════════════════════════════ */
class QuadNode {
  constructor(x, y, hw) {
    this.cx = x; this.cy = y; this.hw = hw; // half-width
    this.mx = 0; this.my = 0; this.m = 0;   // mass center
    this.children = null;
    this.item = null;
  }
}

function buildQuadTree(items) {
  if (!items.length) return null;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const n of items) { minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x); minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y); }
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const hw = Math.max(maxX - minX, maxY - minY) / 2 + 1;
  const root = new QuadNode(cx, cy, hw);
  for (const item of items) qtInsert(root, item);
  qtComputeMass(root);
  return root;
}

function qtInsert(node, item) {
  if (node.m === 0) { node.item = item; node.mx = item.x; node.my = item.y; node.m = 1; return; }

  // Avoid infinite subdivision when many imported nodes share exactly the same coordinates.
  if (node.item && Math.abs(node.item.x - item.x) < 1e-6 && Math.abs(node.item.y - item.y) < 1e-6) {
    const a = Math.random() * Math.PI * 2;
    item.x += Math.cos(a) * 0.75;
    item.y += Math.sin(a) * 0.75;
  }
  if (node.hw < 0.05) {
    item.x += (Math.random() - 0.5) * 1.5;
    item.y += (Math.random() - 0.5) * 1.5;
  }

  if (!node.children) {
    const old = node.item; node.item = null; node.children = [null,null,null,null];
    qtInsert(node, old);
  }
  const qi = qtQuadrant(node, item.x, item.y);
  if (!node.children[qi]) {
    const hw2 = node.hw / 2;
    const nx = node.cx + (qi % 2 === 0 ? -hw2 : hw2);
    const ny = node.cy + (qi < 2 ? -hw2 : hw2);
    node.children[qi] = new QuadNode(nx, ny, hw2);
  }
  qtInsert(node.children[qi], item);
}

function qtQuadrant(node, x, y) {
  return (x >= node.cx ? 1 : 0) + (y >= node.cy ? 2 : 0);
}

function qtComputeMass(node) {
  if (!node) return;
  if (!node.children) return; // leaf already set
  let tx = 0, ty = 0, tm = 0;
  for (const c of node.children) {
    if (!c) continue;
    qtComputeMass(c);
    tx += c.mx * c.m; ty += c.my * c.m; tm += c.m;
  }
  if (tm > 0) { node.mx = tx / tm; node.my = ty / tm; node.m = tm; }
}

const BH_THETA = 0.85; // Barnes-Hut accuracy threshold
function qtApplyRepulsion(node, item, repulsion) {
  if (!node || node.m === 0) return;
  const dx = node.mx - item.x, dy = node.my - item.y;
  const d2 = dx*dx + dy*dy || 0.01;
  const d  = Math.sqrt(d2);
  if (node.hw * 2 / d < BH_THETA || !node.children) {
    // Treat as single mass
    if (d < 0.001) return; // same position
    const f = repulsion * node.m / Math.max(d2, 72);
    item.fx -= (dx / d) * f;
    item.fy -= (dy / d) * f;
  } else {
    for (const c of node.children) qtApplyRepulsion(c, item, repulsion);
  }
}

function applyRepulsion(items, degree) {
  const n = items.length;
  if (n <= 260) {
    // Exact O(n²)
    for (let i = 0; i < n; i++) for (let j = i+1; j < n; j++) pushRepelPair(items[i], items[j], degree);
    return;
  }
  // Barnes-Hut O(n log n). Collision is handled by spatial hashing after springs.
  const tree = buildQuadTree(items);
  for (const item of items) qtApplyRepulsion(tree, item, phys.repulsion);
}

function pushRepelPair(a, b, degree) {
  let dx = b.x - a.x, dy = b.y - a.y;
  let d2 = dx*dx + dy*dy || .01;
  const d = Math.sqrt(d2); dx /= d; dy /= d;
  const minSep = 30 + Math.min(24, ((degree.get(a.id)||0) + (degree.get(b.id)||0)) * 1.7);
  const mass   = (1 + Math.sqrt(degree.get(a.id)||0) * .20) * (1 + Math.sqrt(degree.get(b.id)||0) * .20);
  const f      = phys.repulsion * mass / Math.max(d2, 72);
  a.fx -= dx*f; a.fy -= dy*f; b.fx += dx*f; b.fy += dy*f;
  if (d < minSep) {
    const push = (minSep - d) * .055;
    a.fx -= dx*push; a.fy -= dy*push; b.fx += dx*push; b.fy += dy*push;
  }
}

function computeFolderCenters(items) {
  return computeCommunityCenters(items);
}

function computeCommunityCenters(items) {
  const sig = items.map(it => `${it.id}:${it.folderId || 'root'}`).join('|') + '§' + state.folders.map(f => `${f.id}:${f.parentId || ''}:${f.name}`).join('|');
  if (communityCentersCache.centers && communityCentersCache.sig === sig) return communityCentersCache.centers;
  const roots = groupBy(items, it => rootFolderId(it.folderId) || 'root');
  const rootKeys = [...roots.keys()].sort((a,b) => String(pickFolder(a)?.name||a).localeCompare(String(pickFolder(b)?.name||b)));
  const n = Math.max(1, items.length);
  const mainR = Math.max(170, 70 * Math.sqrt(n));
  const centers = new Map();

  rootKeys.forEach((rootKey, ri) => {
    const rootAngle = (Math.PI * 2 * ri) / Math.max(1, rootKeys.length) - Math.PI / 2;
    const rootItems = roots.get(rootKey) || [];
    const rootCx = Math.cos(rootAngle) * mainR;
    const rootCy = Math.sin(rootAngle) * mainR;
    const folders = groupBy(rootItems, it => it.folderId || 'root');
    const folderKeys = [...folders.keys()].sort((a,b) => folderPathText(a).localeCompare(folderPathText(b)));
    const subR = Math.max(46, 20 * Math.sqrt(rootItems.length));
    centers.set(rootKey, { x: rootCx, y: rootCy, weight: rootItems.length });
    folderKeys.forEach((folderKey, fi) => {
      const depth = folderAncestors(folderKey).length;
      const a = rootAngle + (Math.PI * 2 * fi) / Math.max(1, folderKeys.length);
      const r = subR + depth * 34;
      centers.set(folderKey, { x: rootCx + Math.cos(a) * r, y: rootCy + Math.sin(a) * r, weight: folders.get(folderKey).length });
    });
  });
  if (!centers.has('root')) centers.set('root', { x:0, y:0, weight:n });
  communityCentersCache = { sig, centers };
  return centers;
}

function computeFlowTargets(items, degree = new Map()) {
  const centers = computeCommunityCenters(items);
  const targets = new Map();
  const byFolder = groupBy(items, it => it.folderId || 'root');
  for (const [folderKey, arr0] of byFolder.entries()) {
    const arr = arr0.slice().sort(compareItemsForStructure);
    const fc = centers.get(folderKey) || centers.get(rootFolderId(folderKey) || 'root') || { x:0, y:0 };
    const byCat = groupBy(arr, it => it.categoryId || 'none');
    const catKeys = [...byCat.keys()].sort((a,b) => String(pickCat(a)?.name||a).localeCompare(String(pickCat(b)?.name||b)));
    const folderSpan = Math.max(90, 22 * Math.sqrt(arr.length) + Math.min(180, arr.length * 3));
    const orderVals = arr.map(itemOrderValue).filter(v => v < 999);
    const useFlow = orderVals.length >= 2 || folderOrderValue(folderKey) < 999 || arr.length >= 5;

    arr.forEach((item, idx) => {
      const catIndex = Math.max(0, catKeys.indexOf(item.categoryId || 'none'));
      const catOffset = (catIndex - (catKeys.length - 1) / 2) * 34;
      let x, y;
      if (useFlow) {
        const pos = arr.length <= 1 ? 0 : (idx / (arr.length - 1) - .5);
        const order = itemOrderValue(item);
        const phaseNudge = order < 999 ? (order - 6) * 10 : 0;
        x = fc.x + pos * folderSpan + phaseNudge;
        y = fc.y + catOffset + ((idx % 2) - .5) * 20;
      } else {
        const a = idx * 2.399963229728653;
        const r = Math.max(32, 18 * Math.sqrt(idx + 1));
        x = fc.x + Math.cos(a) * r;
        y = fc.y + Math.sin(a) * r + catOffset;
      }
      // Important nodes/hubs stay near the local center but not exactly in the middle.
      const deg = degree.get(item.id) || 0;
      if (deg > 4) { x = x * .88 + fc.x * .12; y = y * .88 + fc.y * .12; }
      targets.set(item.id, { x, y });
    });
  }
  return { centers, targets };
}

function nodeRadius(item, degree) {
  const titleLen = String(item.title || '').length;
  return 15 + Math.min(12, Math.sqrt(degree.get(item.id) || 0) * 2.1) + Math.min(9, titleLen / 18);
}

function applyCollision(items, degree) {
  const cell = 58;
  const grid = new Map();
  const keyOf = (x,y) => `${Math.floor(x/cell)}:${Math.floor(y/cell)}`;
  for (const it of items) {
    const k = keyOf(it.x, it.y);
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k).push(it);
  }
  for (const a of items) {
    const gx = Math.floor(a.x / cell), gy = Math.floor(a.y / cell);
    for (let ix = gx - 1; ix <= gx + 1; ix++) for (let iy = gy - 1; iy <= gy + 1; iy++) {
      const arr = grid.get(`${ix}:${iy}`); if (!arr) continue;
      for (const b of arr) {
        if (a === b || a.id > b.id) continue;
        let dx = b.x - a.x, dy = b.y - a.y;
        let d = Math.sqrt(dx*dx + dy*dy);
        if (!d) { dx = (Math.random()-.5) * .01; dy = (Math.random()-.5) * .01; d = Math.sqrt(dx*dx + dy*dy) || .01; }
        const minD = nodeRadius(a, degree) + nodeRadius(b, degree) + 8;
        if (d < minD) {
          const push = (minD - d) * .045;
          dx /= d; dy /= d;
          a.fx -= dx * push; a.fy -= dy * push;
          b.fx += dx * push; b.fy += dy * push;
        }
      }
    }
  }
}


function freezeMotion(items = state.items) {
  for (const n of items) { n.vx = 0; n.vy = 0; n.fx = 0; n.fy = 0; }
  graph.energy = 0;
}

function setPaused(value, notify = true) {
  graph.paused = !!value;
  graph.settleUntil = 0;
  freezeMotion();
  if (graph.paused) graph.connectMode = false;
  updateCounts();
  translateUI();
  save();
  saveUI();
  if (notify) showToast(graph.paused ? t('pauseHint') : t('resume'), false, graph.paused ? 1600 : 900);
}

function stabilizeGraph(opts = {}) {
  const wasPaused = !!graph.paused;
  graph.settleUntil = 0;
  graph.connectMode = false;
  graph.connectFrom = null;
  freezeMotion(opts.items || visibleItems());
  if (opts.itemId) centerOnItem(opts.itemId, opts.scale ?? null);
  else if (opts.center) centerGraph();
  if (!wasPaused && opts.keepPaused !== true) settleGraph(opts.duration ?? 460);
  else graph.paused = true;
  updateCounts();
  translateUI();
}

function settleGraph(duration = 650) {
  graph.paused = false;
  graph.settleUntil = performance.now() + duration;
  // A tiny non-zero energy lets the adaptive cooling loop perform a short, natural settle.
  graph.energy = Math.max(graph.energy || 0, 1);
  updateCounts();
  translateUI();
}

function stopSettledGraph(items = visibleItems()) {
  graph.settleUntil = 0;
  if (!state.settings.organic) freezeMotion(items);
  translateUI();
}

function sameFolderScope(a, b) {
  return (a?.folderId || 'root') === (b?.folderId || 'root');
}

function upsertManualLink(sourceId, targetId, opts = {}) {
  const a = pickItem(sourceId), b = pickItem(targetId);
  if (!a || !b || a.id === b.id) return false;
  if (!opts.allowCrossFolder && !sameFolderScope(a, b)) {
    showToast(t('sameFolderOnly'), false, 1800);
    selectItem(b.id);
    return false;
  }
  mutate(t('linkCreated'), () => {
    const key = pairKey(a.id, b.id);
    state.blockedLinks = (state.blockedLinks || []).filter(k => k !== key);
    const existing = state.links.find(l => pairKey(l.source, l.target) === key);
    if (existing) {
      existing.source = a.id; existing.target = b.id;
      existing.auto = false; existing.manual = true;
      existing.score = 1; existing.reason = 'manual-double-click';
    } else {
      state.links.push({ id: uid('link_'), source: a.id, target: b.id, auto: false, manual: true, score: 1, reason: 'manual-double-click' });
    }
    selectedId = b.id; state.selectedId = b.id; linkAnchorId = b.id; selectedFolderId = b.folderId || selectedFolderId;
  });
  settleGraph(420);
  centerIfOffscreen(b.id);
  return true;
}

function staticCollisionPass(items, degree, iterations = 7) {
  for (let iter = 0; iter < iterations; iter++) {
    const cell = 62;
    const grid = new Map();
    const keyOf = (x,y) => `${Math.floor(x/cell)}:${Math.floor(y/cell)}`;
    for (const it of items) {
      const k = keyOf(it.x, it.y);
      if (!grid.has(k)) grid.set(k, []);
      grid.get(k).push(it);
    }
    let moved = 0;
    for (const a of items) {
      const gx = Math.floor(a.x / cell), gy = Math.floor(a.y / cell);
      for (let ix = gx - 1; ix <= gx + 1; ix++) for (let iy = gy - 1; iy <= gy + 1; iy++) {
        const arr = grid.get(`${ix}:${iy}`); if (!arr) continue;
        for (const b of arr) {
          if (a === b || a.id > b.id) continue;
          let dx = b.x - a.x, dy = b.y - a.y;
          let d = Math.sqrt(dx*dx + dy*dy);
          if (!d) { dx = .01; dy = .01; d = .014; }
          const minD = nodeRadius(a, degree) + nodeRadius(b, degree) + 12;
          if (d < minD) {
            const push = (minD - d) * .52;
            dx /= d; dy /= d;
            a.x -= dx * push * .5; a.y -= dy * push * .5;
            b.x += dx * push * .5; b.y += dy * push * .5;
            moved += push;
          }
        }
      }
    }
    if (moved < .25) break;
  }
}

function optimizeVisibleLayout(center = true) {
  const items = visibleItems();
  const ids = new Set(items.map(i => i.id));
  const links = visibleLinks(ids);
  const degree = new Map(items.map(i => [i.id, 0]));
  links.forEach(l => { degree.set(l.source, (degree.get(l.source)||0)+1); degree.set(l.target, (degree.get(l.target)||0)+1); });
  const targets = computeFlowTargets(items, degree);
  for (const n of items) {
    const target = targets.get(n.id);
    if (!target) continue;
    n.x = n.x * .18 + target.x * .82;
    n.y = n.y * .18 + target.y * .82;
    n.vx = 0; n.vy = 0;
  }
  staticCollisionPass(items, degree, Math.min(12, Math.max(5, Math.ceil(items.length / 32))));
  freezeMotion(items);
  if (center) centerGraph();
}

function optimizeLayoutAction() {
  snapshot();
  optimizeVisibleLayout(true);
  save();
  renderAll();
  drawGraph();
  showToast(t('layoutOptimized'), false, 1400);
}

function tickPhysics(dt) {
  if (graph.paused) {
    if (graph.energy) freezeMotion(visibleItems());
    return;
  }
  const items = visibleItems();
  const ids   = new Set(items.map(i => i.id));
  const links = visibleLinks(ids);
  const speed = Math.min(dt / 16.67, 2.2);
  const stiffBase = phys.stiffness * 0.001;
  const baseDamp = phys.damping * 0.01;

  const degree  = new Map(items.map(i => [i.id, 0]));
  const itemMap = new Map(items.map(i => [i.id, i]));
  links.forEach(l => { degree.set(l.source, (degree.get(l.source)||0)+1); degree.set(l.target, (degree.get(l.target)||0)+1); });
  for (const n of items) { n.fx = 0; n.fy = 0; }

  applyRepulsion(items, degree);

  // Weighted springs inspired by ForceAtlas2/CoSE: strong semantic links stay closer,
  // cross-folder links stay readable, and hubs do not pull everything into a ball.
  for (const l of links) {
    const a = itemMap.get(l.source), b = itemMap.get(l.target); if (!a || !b) continue;
    let dx = b.x - a.x, dy = b.y - a.y;
    const d = Math.sqrt(dx*dx + dy*dy) || 1; dx /= d; dy /= d;
    const w = clamp(Number(l.score) || smartScore(a,b) || .35, .1, 1);
    const sameFolder = a.folderId && a.folderId === b.folderId;
    const sameRoot = rootFolderId(a.folderId) && rootFolderId(a.folderId) === rootFolderId(b.folderId);
    const hubDissuasion = 1 / Math.sqrt(1 + Math.max(degree.get(a.id)||0, degree.get(b.id)||0) * .12);
    const desired = 230 - 105 * w + (sameFolder ? -18 : sameRoot ? 14 : 52);
    const stiffness = (stiffBase + stiffBase * 1.45 * w) * hubDissuasion;
    const force = (d - desired) * stiffness;
    a.fx += dx * force; a.fy += dy * force;
    b.fx -= dx * force; b.fy -= dy * force;
  }

  // Folder/compound gravity: keeps project areas together without forcing overlap.
  const centers = computeCommunityCenters(items);
  for (const n of items) {
    const deg = degree.get(n.id) || 0;
    const fc  = centers.get(n.folderId || 'root') || centers.get(rootFolderId(n.folderId) || 'root') || { x:0, y:0 };
    const rc  = centers.get(rootFolderId(n.folderId) || 'root') || { x:0, y:0 };
    n.fx += (fc.x - n.x) * .00110;
    n.fy += (fc.y - n.y) * .00110;
    n.fx += (rc.x - n.x) * .00024;
    n.fy += (rc.y - n.y) * .00024;
    n.fx += -n.x * (0.00023 + Math.sqrt(deg) * .000035);
    n.fy += -n.y * (0.00023 + Math.sqrt(deg) * .000035);
  }

  applyCollision(items, degree);

  // Adaptive cooling: high movement damps faster, settled graphs remain gently interactive.
  const prevEnergy = graph.energy || 0;
  let totalEnergy = 0;
  const adaptiveDamp = clamp(baseDamp - Math.min(.10, prevEnergy / Math.max(1, items.length) / 900), .64, .96);
  for (const n of items) {
    if (state.settings.organic) {
      const t0 = performance.now();
      n.fx += Math.sin(t0/1500 + n.x*.008) * .003;
      n.fy += Math.cos(t0/1600 + n.y*.008) * .003;
    }
    n.vx = (n.vx||0) * adaptiveDamp + n.fx * speed;
    n.vy = (n.vy||0) * adaptiveDamp + n.fy * speed;
    const maxV = 8.4;
    n.vx = clamp(n.vx, -maxV, maxV); n.vy = clamp(n.vy, -maxV, maxV);
    totalEnergy += n.vx*n.vx + n.vy*n.vy;
    if (graph.dragging !== n.id) { n.x += n.vx * speed; n.y += n.vy * speed; }
  }
  graph.energy = totalEnergy;
  const expired = graph.settleUntil && performance.now() > graph.settleUntil;
  const cold = totalEnergy < Math.max(0.015, items.length * 0.006);
  if (!graph.dragging && graph.settleUntil && (expired || cold)) stopSettledGraph(items);
}

/* ══════════════════════════════════════════════════════════════════════
   GRAPH FILTERS / PRESETS / DIAGNOSTICS
══════════════════════════════════════════════════════════════════════ */
function itemKind(item) {
  const cat = normalText(pickCat(item?.categoryId)?.name || '');
  const text = normalText(`${item?.title || ''} ${item?.body || ''}`);
  if (isPersonItem(item)) return 'people';
  if (item?.type === 'task') return 'tasks';
  if (/entreg|deliver|resultado|saida|output|produto/.test(cat + ' ' + text)) return 'deliverables';
  if (/risco|risk|bloqueio|impedimento|problema|issue/.test(cat + ' ' + text)) return 'risks';
  return 'notes';
}
function itemMatchesGraphFilter(item, filter = state.settings.graphFilter || 'all', strongIds = null) {
  if (!item) return false;
  if (filter === 'all') return true;
  if (String(filter).startsWith('cat:')) return item.categoryId === String(filter).slice(4);
  if (String(filter).startsWith('folder:')) return itemInFolderTree(item, String(filter).slice(7));
  if (filter === 'strong') return strongIds ? strongIds.has(item.id) : true;
  return itemKind(item) === filter;
}
function strongLinkThreshold() {
  const n = Math.max(1, state.items.length);
  return n > 600 ? .42 : n > 250 ? .44 : .46;
}
function presetFromCurrentView() {
  if (graph.local) return 'local';
  const f = state.settings.graphFilter || 'all';
  if (String(f).startsWith('cat:') || String(f).startsWith('folder:')) return 'overview';
  return f === 'all' ? 'overview' : f;
}
function applyGraphPreset(preset) {
  graph.local = preset === 'local';
  const map = { overview:'all', team:'people', tasks:'tasks', deliverables:'deliverables', risks:'risks', strong:'strong', local:'all' };
  state.settings.graphFilter = map[preset] || 'all';
  updateCounts(); translateUI(); centerGraph(); save(); saveUI();
}
function linkReasonBoost(reason = '', manual = false) {
  if (manual) return .16;
  const r = String(reason || '');
  if (r.includes('responsibility')) return .18;
  if (r.includes('explicit')) return .16;
  if (r.includes('phase')) return .10;
  if (r.includes('sequence')) return .08;
  if (r.includes('folder')) return .07;
  if (r.includes('category')) return .02;
  if (r.includes('token')) return -.03;
  return 0;
}
function autoDegreeCap(item, total = state.items.length) {
  const kind = itemKind(item);
  let base = kind === 'people' ? 12 : kind === 'tasks' ? 5 : kind === 'deliverables' ? 7 : kind === 'risks' ? 7 : 6;
  if (total > 700) base -= 2;
  else if (total > 350) base -= 1;
  return Math.max(kind === 'people' ? 7 : 4, base);
}
function computeGraphDiagnostics() {
  const allIds = new Set(state.items.map(i => i.id));
  const links = state.links.filter(l => allIds.has(l.source) && allIds.has(l.target) && l.source !== l.target);
  const degree = new Map(state.items.map(i => [i.id, 0]));
  let manual = 0, auto = 0;
  for (const l of links) {
    if (l.auto) auto++; else manual++;
    degree.set(l.source, (degree.get(l.source) || 0) + 1);
    degree.set(l.target, (degree.get(l.target) || 0) + 1);
  }
  const n = state.items.length;
  const density = n > 1 ? links.length / (n * (n - 1) / 2) : 0;
  const isolated = state.items.filter(i => (degree.get(i.id) || 0) === 0);
  const hubs = state.items.slice().sort((a,b) => (degree.get(b.id)||0) - (degree.get(a.id)||0)).slice(0, 8);
  const byKind = new Map();
  for (const it of state.items) byKind.set(itemKind(it), (byKind.get(itemKind(it)) || 0) + 1);
  const byRoot = new Map();
  for (const it of state.items) {
    const root = rootFolderId(it.folderId) || 'root';
    byRoot.set(root, (byRoot.get(root) || 0) + 1);
  }
  return { n, links: links.length, manual, auto, density, isolated, hubs, byKind, byRoot, degree };
}
function showGraphInfo(title, html) {
  $('graphInfoTitle').textContent = title;
  $('graphInfoBody').innerHTML = html;
  $('graphInfoPanel').hidden = false;
}
function fmtPct(v) { return `${(v * 100).toFixed(v < .01 ? 2 : 1)}%`; }
function showDiagnosticsPanel() {
  const d = computeGraphDiagnostics();
  const kindRows = [...d.byKind.entries()].map(([k,v]) => `<tr><td>${escHtml(k)}</td><td>${v}</td></tr>`).join('');
  const hubList = d.hubs.map(i => `<li>${escHtml(i.title)} <b>${d.degree.get(i.id)||0}</b></li>`).join('');
  const isolatedList = d.isolated.slice(0, 8).map(i => `<li>${escHtml(i.title)}</li>`).join('') || `<li>0</li>`;
  const html = `
    <table>
      <tr><td>${escHtml(t('nodes'))}</td><td>${d.n}</td></tr>
      <tr><td>${escHtml(t('links'))}</td><td>${d.links}</td></tr>
      <tr><td>${escHtml(t('linksManualAuto'))}</td><td>${d.manual} / ${d.auto}</td></tr>
      <tr><td>${escHtml(t('graphDensity'))}</td><td>${fmtPct(d.density)}</td></tr>
      <tr><td>${escHtml(t('visibleFilter'))}</td><td>${escHtml(t('filter' + titleCase(state.settings.graphFilter || 'all')) || state.settings.graphFilter)}</td></tr>
    </table>
    <h4>${escHtml(t('categories'))}</h4><table>${kindRows}</table>
    <h4>${escHtml(t('topHubs'))}</h4><ol class="mini-list">${hubList}</ol>
    <h4>${escHtml(t('isolatedNodes'))}</h4><ol class="mini-list">${isolatedList}</ol>`;
  showGraphInfo(t('graphDiagnostics'), html);
}
let lastImportReport = null;
function showImportReportPanel() {
  const r = lastImportReport;
  if (!r) { showGraphInfo(t('importReport'), `<p>${escHtml(t('noImportReport'))}</p>`); return; }
  const rows = Object.entries(r).map(([k,v]) => `<tr><td>${escHtml(k)}</td><td>${escHtml(String(v))}</td></tr>`).join('');
  showGraphInfo(t('importReport'), `<table>${rows}</table>`);
}
function buildImportReport(fileName, sourceKind, parsedReport, autoCount) {
  const d = computeGraphDiagnostics();
  return {
    file: fileName || '',
    format: sourceKind,
    folders: state.folders.length,
    categories: state.categories.length,
    items: state.items.length,
    manualLinks: d.manual,
    autoLinks: d.auto,
    autoGeneratedNow: autoCount ?? d.auto,
    invalidLinksIgnored: parsedReport?.invalidLinks || 0,
    duplicateIdsAdjusted: parsedReport?.duplicates || 0,
    folderCyclesFixed: parsedReport?.cyclesFixed || 0,
    isolatedNodes: d.isolated.length,
    density: fmtPct(d.density)
  };
}

/* ══════════════════════════════════════════════════════════════════════
   CANVAS RENDER  —  improved label rendering
══════════════════════════════════════════════════════════════════════ */
function visibleItems() {
  let base = state.items;
  if (graph.local && selectedId) {
    const ids = new Set([selectedId]);
    state.links.forEach(l => {
      if (l.source === selectedId) ids.add(l.target);
      if (l.target === selectedId) ids.add(l.source);
    });
    base = state.items.filter(i => ids.has(i.id));
  }
  const filter = graphFilterExists(state.settings.graphFilter) ? (state.settings.graphFilter || 'all') : 'all';
  if (filter === 'all') return base;
  const baseIds = new Set(base.map(i => i.id));
  const strongIds = new Set();
  if (filter === 'strong') {
    const thr = strongLinkThreshold();
    for (const l of state.links) {
      if (!baseIds.has(l.source) || !baseIds.has(l.target)) continue;
      const score = Number(l.score) || 0;
      if (!l.auto || score >= thr) { strongIds.add(l.source); strongIds.add(l.target); }
    }
  }
  return base.filter(i => itemMatchesGraphFilter(i, filter, strongIds));
}

function visibleLinks(idsSet) {
  const filter = graphFilterExists(state.settings.graphFilter) ? (state.settings.graphFilter || 'all') : 'all';
  const thr = strongLinkThreshold();
  return state.links.filter(l => {
    if (!idsSet.has(l.source) || !idsSet.has(l.target)) return false;
    if (filter === 'strong') return !l.auto || (Number(l.score) || 0) >= thr;
    return true;
  });
}

function resizeCanvas(force = false) {
  const rect = wrap.getBoundingClientRect();
  const dpr  = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.floor(rect.width));
  const h = Math.max(1, Math.floor(rect.height));
  if (!force && graph.lastResizeW === w && graph.lastResizeH === h) return;
  graph.lastResizeW = w; graph.lastResizeH = h;
  canvas.width  = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
  canvas.style.width  = w + 'px'; canvas.style.height = h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (!graph.x && !graph.y) centerGraph(false);
}

function centerGraph() {
  const items = visibleItems(); if (!items.length) return;
  const rect  = wrap.getBoundingClientRect();
  const minX  = Math.min(...items.map(i => i.x)); const maxX = Math.max(...items.map(i => i.x));
  const minY  = Math.min(...items.map(i => i.y)); const maxY = Math.max(...items.map(i => i.y));
  const bw    = Math.max(1, maxX - minX + 180); const bh = Math.max(1, maxY - minY + 180);
  graph.scale = clamp(Math.min(rect.width / bw, rect.height / bh), .45, 1.7);
  graph.x     = rect.width  / 2 - ((minX + maxX) / 2) * graph.scale;
  graph.y     = rect.height / 2 - ((minY + maxY) / 2) * graph.scale;
  saveUI();
}

function centerOnItem(id, preferredScale = null) {
  const item = pickItem(id); if (!item) return;
  const rect = wrap.getBoundingClientRect();
  if (preferredScale !== null) graph.scale = clamp(preferredScale, .55, 1.8);
  else graph.scale = clamp(graph.scale || 1, .58, 1.45);
  graph.x = rect.width / 2 - item.x * graph.scale;
  graph.y = rect.height / 2 - item.y * graph.scale;
  saveUI();
}

function centerIfOffscreen(id) {
  const item = pickItem(id); if (!item) return;
  const p    = worldToScreen(item.x, item.y);
  const r    = wrap.getBoundingClientRect();
  if (p.x < 60 || p.y < 60 || p.x > r.width - 60 || p.y > r.height - 60) centerOnItem(id);
}

const screenToWorld = (x, y) => ({ x:(x - graph.x) / graph.scale, y:(y - graph.y) / graph.scale });
const worldToScreen = (x, y) => ({ x: x * graph.scale + graph.x, y: y * graph.scale + graph.y });

function dominantCategoryColor(items) {
  const counts = new Map();
  for (const it of items) counts.set(it.categoryId, (counts.get(it.categoryId)||0) + 1);
  let best = null, bestN = -1;
  for (const [id, n] of counts) if (n > bestN) { best = id; bestN = n; }
  return pickCat(best)?.color || css('--accent') || '#a78bfa';
}

function drawCommunityAreas(items, renderCtx = ctx, view = graph) {
  if (!items.length || view.scale < .28) return;
  const roots = groupBy(items, it => rootFolderId(it.folderId) || 'root');
  const entries = [...roots.entries()].filter(([,arr]) => arr.length >= 2);
  if (!entries.length) return;
  renderCtx.save();
  for (const [rootId, arr] of entries) {
    const minX = Math.min(...arr.map(i => i.x)), maxX = Math.max(...arr.map(i => i.x));
    const minY = Math.min(...arr.map(i => i.y)), maxY = Math.max(...arr.map(i => i.y));
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    const rx = Math.max(80, (maxX - minX) / 2 + 74);
    const ry = Math.max(58, (maxY - minY) / 2 + 58);
    const color = dominantCategoryColor(arr);
    renderCtx.globalAlpha = .075;
    renderCtx.fillStyle = color;
    renderCtx.beginPath(); renderCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); renderCtx.fill();
    renderCtx.globalAlpha = .16;
    renderCtx.strokeStyle = color; renderCtx.lineWidth = 1.2 / view.scale;
    renderCtx.beginPath(); renderCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); renderCtx.stroke();
    if (view.scale > .38) {
      const name = pickFolder(rootId)?.name || (rootId === 'root' ? t('root') : rootId);
      renderCtx.globalAlpha = .42;
      renderCtx.font = `650 ${Math.max(11, phys.labelSize + 1) / view.scale}px ${css('--font') || 'sans-serif'}`;
      renderCtx.fillStyle = css('--text-muted');
      renderCtx.textAlign = 'center'; renderCtx.textBaseline = 'bottom';
      renderCtx.fillText(name, cx, cy - ry + 18 / view.scale);
    }
  }
  renderCtx.globalAlpha = 1;
  renderCtx.restore();
}

function edgeCurveControl(a, b, l) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const dx = b.x - a.x, dy = b.y - a.y;
  const d = Math.sqrt(dx*dx + dy*dy) || 1;
  const crossRoot = rootFolderId(a.folderId) !== rootFolderId(b.folderId);
  const reason = String(l.reason || '');
  const bend = (crossRoot ? 26 : reason.includes('phase') ? 16 : reason.includes('responsibility') ? 10 : 0) / graph.scale;
  return { x: mx - dy / d * bend, y: my + dx / d * bend };
}

function rectsOverlap(a, b, pad = 2 / Math.max(.35, graph.scale)) {
  return !(a.x + a.w + pad < b.x || b.x + b.w + pad < a.x || a.y + a.h + pad < b.y || b.y + b.h + pad < a.y);
}

/* ── Obsidian-like edge and title styling ────────────────────────────── */
function hexToRgb(hex) {
  let h = String(hex || '').trim().replace('#','');
  if (h.length === 3) h = h.split('').map(ch => ch + ch).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) return { r: 160, g: 160, b: 170 };
  return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) };
}
function rgbaFromHex(hex, alpha = 1) {
  const c = hexToRgb(hex);
  return `rgba(${c.r},${c.g},${c.b},${clamp(alpha,0,1)})`;
}
function mixHex(a, b, t = .5) {
  const ca = hexToRgb(a), cb = hexToRgb(b);
  const m = (x,y) => Math.round(x + (y - x) * clamp(t,0,1));
  return `#${[m(ca.r,cb.r), m(ca.g,cb.g), m(ca.b,cb.b)].map(v => v.toString(16).padStart(2,'0')).join('')}`;
}
function linkVisualStyle(a, b, l, strong = false) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const d  = Math.sqrt(dx*dx + dy*dy) || 1;
  const score = clamp(Number(l.score) || smartScore(a, b) || .32, .10, 1);
  const sameCat = a.categoryId && a.categoryId === b.categoryId;
  const sameFolder = a.folderId && a.folderId === b.folderId;
  const sameRoot = rootFolderId(a.folderId) && rootFolderId(a.folderId) === rootFolderId(b.folderId);
  const closeness = 1 - clamp((d - 80) / 720, 0, 1);
  const distanceFade = 1 - clamp((d - 160) / 980, 0, .62);
  const structure = sameFolder ? .14 : sameRoot ? .06 : -.06;
  const reason = linkReasonBoost(l.reason, !l.auto);
  const visual = clamp(score * .58 + closeness * .30 + distanceFade * .16 + structure + reason, .10, 1);
  const ca = itemCategory(a).color || '#a78bfa';
  const cb = itemCategory(b).color || ca;
  const base = sameCat ? ca : mixHex(ca, cb, .50);
  const neutral = effectiveTheme() === 'dark' ? '#d7d7e2' : '#252530';
  const muted = mixHex(base, neutral, sameCat ? .12 : .24);
  const alpha = strong ? .98 : clamp(.12 + visual * .43, .14, .62);
  return {
    color: strong ? rgbaFromHex(base, .98) : rgbaFromHex(muted, alpha),
    width: strong ? 3.10 : clamp(.48 + visual * 1.62 - (1 - distanceFade) * .38, .42, 2.35),
    alpha: 1,
    score,
    distance: d,
  };
}
function titleColorForNode(n, selected = false, hover = false) {
  const cat = itemCategory(n).color || '#a78bfa';
  const label = css('--graph-label') || '#cfcfd6';
  const tMix = selected || hover ? .04 : .24;
  const alpha = selected || hover ? .98 : .84;
  return rgbaFromHex(mixHex(cat, label, tMix), alpha);
}

function nodeDegreeMapForVisible(items, links) {
  const deg = new Map(items.map(i => [i.id, 0]));
  for (const l of links) { deg.set(l.source, (deg.get(l.source)||0)+1); deg.set(l.target, (deg.get(l.target)||0)+1); }
  return deg;
}
function shouldDrawNodeLabel(n, selected, hover, linked, itemsCount, degree) {
  if (selected || hover) return true;
  if (!state.settings.showLabels) return false;
  if (itemsCount > 170 && graph.scale < .95) return linked;
  if (itemsCount > 90 && graph.scale < .78) return linked || degree >= 5;
  if (graph.scale < .43) return linked && itemsCount < 80;
  return true;
}

/* ── drawGraph: improved label rendering ─────────────────────────────── */
function drawGraph() {
  resizeCanvas();
  const rect = wrap.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  drawGraphToContext(ctx, rect.width, rect.height, graph, dpr, { includeGhost: true });
}

function drawGraphToContext(renderCtx, width, height, view = graph, pixelRatio = 1, opts = {}) {
  renderCtx.save();
  renderCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  renderCtx.clearRect(0, 0, width, height);
  renderCtx.fillStyle = css('--bg-primary');
  renderCtx.fillRect(0, 0, width, height);

  const items       = visibleItems();
  const ids         = new Set(items.map(i => i.id));
  const links       = visibleLinks(ids);
  const selectedLinks = new Set(
    state.links.filter(l => l.source === selectedId || l.target === selectedId).map(l => l.id)
  );
  const drawItemMap = new Map(items.map(i => [i.id, i]));
  const visibleDegree = nodeDegreeMapForVisible(items, links);

  renderCtx.save();
  renderCtx.translate(view.x, view.y);
  renderCtx.scale(view.scale, view.scale);
  renderCtx.lineCap = 'round';

  if (state.settings.showGraphGroups) drawCommunityAreas(items, renderCtx, view);

  // ── Draw edges: Obsidian-like cords with distance-aware tone/width ──────
  for (const l of links) {
    const a = drawItemMap.get(l.source), b = drawItemMap.get(l.target); if (!a || !b) continue;
    const strong = selectedLinks.has(l.id) || graph.hover?.id === l.id;
    const style  = linkVisualStyle(a, b, l, strong);
    renderCtx.strokeStyle = style.color;
    renderCtx.globalAlpha = style.alpha;
    renderCtx.lineWidth   = style.width / view.scale;
    renderCtx.setLineDash([]);
    renderCtx.beginPath(); renderCtx.moveTo(a.x, a.y); renderCtx.lineTo(b.x, b.y); renderCtx.stroke();
    renderCtx.globalAlpha = 1;
  }

  // ── Connect-mode ghost line ───────────────────────────────────────────
  if (opts.includeGhost !== false && graph.connectMode && graph.connectFrom) {
    const from = pickItem(graph.connectFrom);
    if (from) {
      renderCtx.strokeStyle = css('--accent'); renderCtx.lineWidth = 2/view.scale;
      renderCtx.setLineDash([8/view.scale, 8/view.scale]);
      renderCtx.beginPath(); renderCtx.moveTo(from.x, from.y); renderCtx.lineTo(pointer.wx, pointer.wy); renderCtx.stroke();
      renderCtx.setLineDash([]);
    }
  }

  // ── Label opacity based on zoom level ────────────────────────────────
  const labelAlpha = clamp((view.scale - 0.35) / 0.35, 0, 1);

  // ── Draw nodes ────────────────────────────────────────────────────────
  const baseFontSize = phys.labelSize / view.scale;
  for (const n of items) {
    const cat      = itemCategory(n);
    const selected = n.id === selectedId;
    const linked   = selectedLinks.size > 0 && state.links.some(l => selectedLinks.has(l.id) && (l.source === n.id || l.target === n.id));
    const isHover  = graph.hover?.type === 'node' && graph.hover.id === n.id;
    const nodeR    = selected ? 12 : (isHover ? 10 : 8.5);

    renderCtx.beginPath();
    renderCtx.globalAlpha = selected || linked || !selectedId ? 1 : .72;
    renderCtx.fillStyle = cat.color || '#a78bfa';
    renderCtx.arc(n.x, n.y, nodeR, 0, Math.PI * 2); renderCtx.fill();

    if (selected) {
      renderCtx.strokeStyle = colorMix(cat.color, .42); renderCtx.lineWidth = 8/view.scale; renderCtx.stroke();
      renderCtx.strokeStyle = '#ffffff'; renderCtx.lineWidth = 1.7/view.scale; renderCtx.stroke();
    } else if (linked) {
      renderCtx.strokeStyle = colorMix(cat.color, .34); renderCtx.lineWidth = 4/view.scale; renderCtx.stroke();
    } else if (isHover) {
      renderCtx.strokeStyle = colorMix(cat.color, .55); renderCtx.lineWidth = 3/view.scale; renderCtx.stroke();
    }
    renderCtx.globalAlpha = 1;

    const showLabel = shouldDrawNodeLabel(n, selected, isHover, linked, items.length, visibleDegree.get(n.id) || 0);
    if (!showLabel) continue;

    renderCtx.globalAlpha = selected || isHover || linked ? 1 : labelAlpha;
    if (renderCtx.globalAlpha < 0.05) { renderCtx.globalAlpha = 1; continue; }

    if (selected) {
      const fs      = (phys.labelSize + 3) / view.scale;
      renderCtx.font      = `700 ${fs}px ${css('--font') || 'sans-serif'}`;
      const maxW    = 220 / view.scale;
      const lines   = wrapText(renderCtx, n.title, maxW);
      const lineH   = fs * 1.28;
      const yStart  = n.y + (nodeR + 6) / view.scale;
      for (let li = 0; li < Math.min(lines.length, 2); li++) {
        const lx = n.x, ly = yStart + li * lineH;
        renderCtx.shadowColor = css('--graph-shadow'); renderCtx.shadowBlur = 6 / view.scale;
        renderCtx.fillStyle   = titleColorForNode(n, true, isHover);
        renderCtx.textAlign   = 'center'; renderCtx.textBaseline = 'top';
        renderCtx.fillText(lines[li], lx, ly);
        renderCtx.shadowBlur = 0;
      }
    } else {
      renderCtx.font = `${baseFontSize}px ${css('--font') || 'sans-serif'}`;
      const maxChars = 28;
      const label    = n.title.length > maxChars ? n.title.slice(0, maxChars - 1) + '…' : n.title;
      const ly       = n.y + (isHover ? 15 : 13) / view.scale;
      renderCtx.shadowColor = css('--graph-shadow'); renderCtx.shadowBlur = 4 / view.scale;
      renderCtx.fillStyle   = titleColorForNode(n, false, isHover);
      renderCtx.textAlign   = 'center'; renderCtx.textBaseline = 'top';
      renderCtx.fillText(label, n.x, ly);
      renderCtx.shadowBlur = 0;
    }
    renderCtx.globalAlpha = 1;
  }

  renderCtx.restore();
  renderCtx.restore();
}

/** Wrap text to multiple lines fitting maxWidth */
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const word of words) {
    const test = cur ? cur + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && cur) {
      lines.push(cur); cur = word;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function animate(now) {
  const dt = now - lastTick; lastTick = now;
  tickPhysics(dt); drawGraph();
  raf = requestAnimationFrame(animate);
}

function updateCounts() {
  const items = visibleItems();
  const ids   = new Set(items.map(i => i.id));
  $('nodeCount').textContent = `${items.length} ${t('nodes')}`;
  $('linkCount').textContent = `${visibleLinks(ids).length} ${t('links')}`;
  if (!graphFilterExists(state.settings.graphFilter)) state.settings.graphFilter = 'all';
  if ($('graphFilterSelect')) $('graphFilterSelect').value = GRAPH_FILTERS.some(([v]) => v === (state.settings.graphFilter || 'all')) ? (state.settings.graphFilter || 'all') : 'all';
  renderGraphFilterChips();
  if ($('btnGraphFilters')) {
    const activeLabel = graphFilterLabel(state.settings.graphFilter || 'all');
    setButtonLabel('btnGraphFilters', `${t('filters')}: ${activeLabel}`);
  }
  if ($('graphPresetSelect')) $('graphPresetSelect').value = presetFromCurrentView();
  $('btnLabels').classList.toggle('is-active', !!state.settings.showLabels);
  $('btnLocalGraph').classList.toggle('is-active', !!graph.local);
  $('btnPause')?.classList.toggle('is-active', !!graph.paused);
  $('btnPause')?.setAttribute('aria-pressed', String(!!graph.paused));
  $('btnGraphFilters')?.classList.toggle('is-active', !($('graphFilterPopover')?.hidden ?? true));
  $('btnHelpCommands')?.classList.toggle('is-active', !!state.settings.showCommands);
  wrap.classList.toggle('is-paused', !!graph.paused);
  wrap.dataset.modeLabel = graph.paused ? t('pauseHint') : '';
  $('btnFocusGraph')?.classList.toggle('is-active', app.classList.contains('focus-graph'));
  $('btnFocusGraph')?.setAttribute('aria-pressed',     String(app.classList.contains('focus-graph')));
  $('btnCollapseSidebar')?.setAttribute('aria-expanded', String(!app.classList.contains('sidebar-collapsed')));
  $('btnToggleEditor')?.setAttribute('aria-expanded',    String(!app.classList.contains('editor-collapsed')));
  syncRailState();
}

/* ── Hit testing ─────────────────────────────────────────────────────── */
function hitNode(sx, sy) {
  const w = screenToWorld(sx, sy); let best = null, bestD = Infinity;
  for (const n of visibleItems()) {
    const dx = n.x - w.x, dy = n.y - w.y; const d = Math.sqrt(dx*dx + dy*dy);
    if (d < 18 / graph.scale && d < bestD) { best = n; bestD = d; }
  }
  return best;
}

function hitLink(sx, sy) {
  const w    = screenToWorld(sx, sy);
  const ids  = new Set(visibleItems().map(i => i.id));
  let best   = null, bestD = 10 / graph.scale;
  for (const l of visibleLinks(ids)) {
    const a = pickItem(l.source), b = pickItem(l.target); if (!a || !b) continue;
    const d = distPointSegment(w.x, w.y, a.x, a.y, b.x, b.y);
    if (d < bestD) { best = l; bestD = d; }
  }
  return best;
}

function distPointSegment(px, py, x1, y1, x2, y2) {
  const dx = x2-x1, dy = y2-y1; const len = dx*dx + dy*dy || 1;
  const tt = clamp(((px-x1)*dx + (py-y1)*dy) / len, 0, 1);
  return Math.hypot(px - x1 - tt*dx, py - y1 - tt*dy);
}

function setCanvasPointer(e) {
  const r = wrap.getBoundingClientRect();
  pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
  const w = screenToWorld(pointer.x, pointer.y); pointer.wx = w.x; pointer.wy = w.y;
}

/* ══════════════════════════════════════════════════════════════════════
   EXPORT / IMPORT
══════════════════════════════════════════════════════════════════════ */
function exportPayload() {
  const data = JSON.parse(JSON.stringify(state));
  data.selectedId = selectedId || data.selectedId || null;
  delete data.version;
  data.settings = { ...(data.settings || {}), graphFilter: 'all' };
  return {
    app: 'Connector',
    schema: 'connector-workspace',
    exportedAt: new Date().toISOString(),
    state: data,
  };
}

function exportJson() {
  const payload = exportPayload();
  download(new Blob([JSON.stringify(payload, null, 2)], { type:'application/json;charset=utf-8' }), `${safeFile(state.settings.vaultName)}-backup.json`);
  showToast(t('exportDone'), false, 1100);
}

function exportPng() {
  drawGraph();
  const rect = wrap.getBoundingClientRect();
  const scale = 4;
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = Math.max(1, Math.round(rect.width * scale));
  exportCanvas.height = Math.max(1, Math.round(rect.height * scale));
  const exportCtx = exportCanvas.getContext('2d');
  drawGraphToContext(exportCtx, rect.width, rect.height, graph, scale, { includeGhost: false });
  exportCanvas.toBlob(blob => {
    if (!blob) { showToast(t('importError'), false, 1200); return; }
    download(blob, `${safeFile(state.settings.vaultName)}-graph-hd.png`);
    showToast(t('exportDone'), false, 1100);
  }, 'image/png');
}

function download(blob, name) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 300);
}

function safeFile(s) {
  return String(s||'vault').toLowerCase().replace(/[^a-z0-9\-_]+/gi,'-').replace(/^-+|-+$/g,'') || 'vault';
}

function importedStateFromPayload(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Invalid JSON backup');
  return payload.state && typeof payload.state === 'object' ? payload.state : payload;
}

function mergeImportedState(currentRaw, importedRaw) {
  const current = normalizeState(currentRaw);
  const imported = normalizeState(importedRaw);
  const merged = JSON.parse(JSON.stringify(current));
  const folderIdMap = new Map();
  const categoryIdMap = new Map();
  const itemIdMap = new Map();

  const folderKey = (name, parentId) => `${normalText(name)}::${parentId || ''}`;
  const currentFolderByKey = new Map(merged.folders.map(f => [folderKey(f.name, f.parentId), f]));

  // Preserve hierarchy order by repeatedly attempting to attach parents first.
  const pendingFolders = imported.folders.slice();
  let guard = 0;
  while (pendingFolders.length && guard++ < imported.folders.length + 8) {
    const f = pendingFolders.shift();
    const parentMapped = f.parentId ? folderIdMap.get(f.parentId) : null;
    if (f.parentId && !parentMapped && imported.folders.some(x => x.id === f.parentId)) {
      pendingFolders.push(f);
      continue;
    }
    const parentId = parentMapped || null;
    const key = folderKey(f.name, parentId);
    const existing = currentFolderByKey.get(key);
    if (existing) {
      folderIdMap.set(f.id, existing.id);
    } else {
      const newId = merged.folders.some(x => x.id === f.id) ? uid('fold_') : f.id;
      const nf = { ...f, id: newId, parentId };
      merged.folders.push(nf);
      currentFolderByKey.set(key, nf);
      folderIdMap.set(f.id, newId);
    }
  }

  const currentCatByName = new Map(merged.categories.map(c => [normalText(c.name), c]));
  for (const c of imported.categories) {
    const key = normalText(c.name);
    const existing = currentCatByName.get(key);
    if (existing) {
      categoryIdMap.set(c.id, existing.id);
      if (!existing.color && c.color) existing.color = c.color;
    } else {
      const newId = merged.categories.some(x => x.id === c.id) ? uid('cat_') : c.id;
      const nc = { ...c, id: newId };
      merged.categories.push(nc);
      currentCatByName.set(key, nc);
      categoryIdMap.set(c.id, newId);
    }
  }

  const itemKey = (it) => `${it.type || 'note'}::${folderIdMap.get(it.folderId) || it.folderId || ''}::${normalText(it.title)}::${normalText(it.body || '').slice(0, 180)}`;
  const currentItemByKey = new Map(merged.items.map(i => [`${i.type || 'note'}::${i.folderId || ''}::${normalText(i.title)}::${normalText(i.body || '').slice(0, 180)}`, i]));
  for (const it of imported.items) {
    const mappedFolder = folderIdMap.get(it.folderId) || it.folderId || merged.folders[0]?.id || null;
    const mappedCat = categoryIdMap.get(it.categoryId) || it.categoryId || merged.categories[0]?.id || null;
    const probe = { ...it, folderId: mappedFolder, categoryId: mappedCat };
    const existing = currentItemByKey.get(itemKey(probe));
    if (existing) {
      itemIdMap.set(it.id, existing.id);
      continue;
    }
    const newId = merged.items.some(x => x.id === it.id) ? uid('item_') : it.id;
    const ni = { ...it, id: newId, folderId: mappedFolder, categoryId: mappedCat };
    merged.items.push(ni);
    currentItemByKey.set(itemKey(ni), ni);
    itemIdMap.set(it.id, newId);
  }

  const pairSet = new Set(merged.links.map(l => pairKey(l.source, l.target)));
  for (const l of imported.links) {
    const source = itemIdMap.get(l.source) || (merged.items.some(i => i.id === l.source) ? l.source : null);
    const target = itemIdMap.get(l.target) || (merged.items.some(i => i.id === l.target) ? l.target : null);
    if (!source || !target || source === target) continue;
    const key = pairKey(source, target);
    if (pairSet.has(key)) continue;
    merged.links.push({ ...l, id: merged.links.some(x => x.id === l.id) ? uid('link_') : l.id, source, target });
    pairSet.add(key);
  }

  // Keep current UI/settings, but import data folders/items/categories/links.
  merged.settings = { ...current.settings, vaultName: current.settings?.vaultName || imported.settings?.vaultName || 'Connector', graphFilter: 'all' };
  merged.selectedId = selectedId || merged.items[0]?.id || null;
  return normalizeState(merged);
}

function importFile(file) {
  if (!/\.json$/i.test(file.name)) {
    showToast(t('importError'), false, 1600);
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const txt  = String(reader.result || '');
      const payload = JSON.parse(txt);
      const imported = importedStateFromPayload(payload);
      const mode = $('importMode')?.value || 'merge';
      snapshot();
      state = mode === 'replace' ? normalizeState(imported) : mergeImportedState(state, imported);
      rebuildMaps();
      const autoCount = syncSmartLinksIfNeeded(false, true);
      selectedId       = state.selectedId || selectedId || state.items[0]?.id || null;
      state.selectedId = selectedId;
      selectedFolderId = selectedItem()?.folderId || state.folders.find(f => !f.parentId)?.id || state.folders[0]?.id || null;
      folderOpen       = new Set(state.folders.map(f => f.id));
      if ($('searchInput')) $('searchInput').value = '';
      seedSmartLayout(true);
      state.settings.graphFilter = 'all';
      lastImportReport = buildImportReport(file.name, 'JSON', null, autoCount);
      save(); renderAll(); centerGraph(); closeSettings();
      showToast(`${mode === 'replace' ? t('importReplaced') : t('importMerged')}: ${state.items.length} ${t('nodes')} · ${state.links.length} ${t('links')}`, false, 2400);
    } catch (err) {
      console.error('Import failed:', err);
      showToast(t('importError'), false, 1600);
    }
  };
  reader.readAsText(file, 'utf-8');
}

function isFolderCycleInList(folders, id, parentId) {
  let cur = folders.find(f => f.id === parentId), guard = 0;
  while (cur && guard++ < 100) { if (cur.id === id) return true; cur = folders.find(f => f.id === cur.parentId); }
  return false;
}

/* ══════════════════════════════════════════════════════════════════════
   SETTINGS MODAL
══════════════════════════════════════════════════════════════════════ */
function openSettings()  { closeToast(); $('modalBackdrop').hidden = false; $('settingsModal').hidden = false; $('settingsModal').setAttribute('aria-hidden','false'); $('settingVaultName').focus(); }
function closeSettings() { $('modalBackdrop').hidden = true;  $('settingsModal').hidden = true;  $('settingsModal').setAttribute('aria-hidden','true'); }


function cancelBlankReset() {
  if (blankResetTimer) clearTimeout(blankResetTimer);
  blankResetTimer = null;
}

function scheduleBlankReset(blank) {
  cancelBlankReset();
  blankCreateAnchor = blank?.anchorId || selectedId || linkAnchorId || null;
  blankResetTimer = setTimeout(() => {
    selectedId = null;
    state.selectedId = null;
    linkAnchorId = null;
    selectedFolderId = selectedItem()?.folderId || selectedFolderId || state.folders[0]?.id || null;
    state.settings.graphFilter = 'all';
    graph.local = false;
    graph.hover = null;
    graph.connectMode = false;
    graph.connectFrom = null;
    closeTransientUI();
    if (!graph.paused) settleGraph(420); else freezeMotion();
    renderAll();
    updateCounts();
    saveUI();
    blankResetTimer = null;
  }, 520);
}

function createLinkedNoteAtPointer(anchorId) {
  const base = pickItem(anchorId) || selectedItem();
  const folderId = base?.folderId || currentParentId();
  const categoryId = base?.categoryId || state.categories[0]?.id || '';
  let newId = null;
  mutate(t('linkedNote'), () => {
    const id = uid('note_');
    newId = id;
    state.items.push({
      id, type:'note', title:t('newNote'),
      folderId: folderId || null, categoryId,
      body:'', x:pointer.wx, y:pointer.wy, vx:0, vy:0
    });
    if (base) {
      state.links.push({ id: uid('link_'), source: base.id, target: id, auto:false, manual:true, score:1, reason:'manual-double-click-new-note' });
    }
    selectedId = id;
    state.selectedId = id;
    linkAnchorId = id;
    selectedFolderId = folderId || selectedFolderId;
    if (folderId) folderOpen.add(folderId);
  });
  if (newId) {
    if (!app.classList.contains('focus-graph')) app.classList.remove('editor-collapsed');
    settleGraph(560);
    renderAll();
    resizeCanvas(true);
    syncRailState();
    saveUI();
    centerIfOffscreen(newId);
  }
}

const saveDraftDebounced = debounce(() => save(), 360);
let bodyDraftSnapshotTaken = false;

/* ══════════════════════════════════════════════════════════════════════
   EVENT BINDINGS
══════════════════════════════════════════════════════════════════════ */
function bind() {
  // Sidebar / vault
  $('btnNewNote').onclick           = () => createItem('note');
  $('btnNewTask').onclick           = () => createItem('task');
  $('btnNewFolder').onclick         = createFolder;
  $('btnNewCategoryInline').onclick = () => createCategory($('newName').value.trim());
  $('newName').onkeydown = (e) => { if (e.key === 'Enter') createItem('note'); };
  $('searchInput').oninput = debounce(renderTree, 120);
  if ($('vaultSummary')) $('vaultSummary').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-summary-filter]');
    if (!btn) return;
    const f = btn.dataset.summaryFilter;
    if (f === 'folders') { selectedFolderId = state.folders[0]?.id || null; selectedId = null; renderAll(); return; }
    applyGraphFilter(f === 'tasks' ? 'tasks' : 'notes', true);
  });

  $('rootDrop').addEventListener('dragover',  (e) => { e.preventDefault(); $('rootDrop').classList.add('drag-over'); });
  $('rootDrop').addEventListener('dragleave', (e) => { if (!$('rootDrop').contains(e.relatedTarget)) $('rootDrop').classList.remove('drag-over'); });
  $('rootDrop').addEventListener('drop', (e) => {
    e.preventDefault(); $('rootDrop').classList.remove('drag-over');
    if (!e.target.closest('.folder-row,.item-row,.category-row,.category-list')) moveDraggedToFolder(null);
    clearDragState();
  });
  $('rootDrop').addEventListener('click', (e) => {
    if (!e.target.closest('.folder-row,.item-row,.category-row,button,input,.category-list')) clearFolderSel();
  });

  // Editor
  $('titleInput').oninput = () => { resizeTitleInput(); };
  $('titleInput').onchange  = () => { const it = selectedItem(); if (!it) return; snapshot(); it.title = cleanTitleValue($('titleInput').value) || t('untitled'); syncSmartLinksIfNeeded(false); save(); renderAll(); };
  $('bodyInput').onfocus    = () => { bodyDraftSnapshotTaken = false; };
  $('bodyInput').oninput    = () => {
    const it = selectedItem(); if (!it) return;
    if (!bodyDraftSnapshotTaken) { snapshot(); bodyDraftSnapshotTaken = true; }
    it.body = $('bodyInput').value;
    saveDraftDebounced();
  };
  $('bodyInput').onchange   = () => { const it = selectedItem(); if (!it) return; it.body = $('bodyInput').value; syncSmartLinksIfNeeded(false); save(); renderTree(); drawGraph(); updateCounts(); bodyDraftSnapshotTaken = false; };
  $('folderSelect').onchange   = () => { const it = selectedItem(); if (!it) return; mutate(t('moved'),    () => it.folderId    = $('folderSelect').value || null); };
  $('categorySelect').onchange = () => { const it = selectedItem(); if (!it) return; mutate(t('category'), () => it.categoryId  = $('categorySelect').value); };
  $('taskDone').onchange     = () => { const it = selectedItem(); if (it?.type === 'task') { snapshot(); it.done     = $('taskDone').checked;    save(); renderAll(); } };
  $('taskPriority').onchange = () => { const it = selectedItem(); if (it?.type === 'task') { snapshot(); it.priority = $('taskPriority').value; save(); } };
  $('taskDue').onchange      = () => { const it = selectedItem(); if (it?.type === 'task') { snapshot(); it.due      = $('taskDue').value;       save(); } };

  // Layout toggles
  const togglePanel = (cls, ...extras) => {
    closeTransientUI();
    app.classList.toggle(cls);
    for (const c of extras) app.classList.remove(c);
    resizeCanvas(true);
    syncRailState();
    saveUI();
  };
  const showWorkspace = () => { closeTransientUI(); app.classList.remove('sidebar-collapsed','editor-collapsed','focus-graph'); resizeCanvas(true); syncRailState(); renderTree(); saveUI(); };
  $('btnCollapseSidebar').onclick = () => togglePanel('sidebar-collapsed','focus-graph');
  $('btnVault')?.addEventListener('click', showWorkspace);
  $('btnEditorRail')?.addEventListener('click', showWorkspace);
  $('btnCloseEditor')?.addEventListener('click', () => { closeTransientUI(); app.classList.add('editor-collapsed'); resizeCanvas(true); syncRailState(); saveUI(); });
  $('btnGraphRail')?.addEventListener('click', () => { closeTransientUI(); app.classList.add('focus-graph'); resizeCanvas(true); syncRailState(); saveUI(); });
  $('btnSearch')?.addEventListener('click', () => { showWorkspace(); $('searchInput').focus(); });

  $('btnThemeQuick')?.addEventListener('click', () => mutate('', () => { state.settings.theme = effectiveTheme() === 'dark' ? 'light' : 'dark'; }));
  $('btnMore')?.addEventListener('click', openSettings);
  $('vaultTitleBtn').onclick = () => { openSettings(); $('settingVaultName').select(); };

  // Graph toolbar
  $('btnLabels').onclick     = () => mutate('', () => { state.settings.showLabels = !state.settings.showLabels; });
  $('btnLocalGraph').onclick = () => { graph.local = !graph.local; stabilizeGraph(); closeTransientUI(); updateCounts(); centerGraph(); saveUI(); };
  $('btnCenterGraph').onclick = () => { stabilizeGraph({ center: true }); updateCounts(); saveUI(); };
  $('btnFocusGraph')?.addEventListener('click', () => { closeTransientUI(); app.classList.toggle('focus-graph'); stabilizeGraph(); resizeCanvas(true); centerGraph(); translateUI(); updateCounts(); saveUI(); });
  if ($('btnPause')) $('btnPause').onclick = () => setPaused(!graph.paused);
  if ($('btnDeleteSelected')) $('btnDeleteSelected').onclick = deleteSelectedOrLink;
  const closeGraphFilters = () => { if ($('graphFilterPopover')) $('graphFilterPopover').hidden = true; $('btnGraphFilters')?.classList.remove('is-active'); };
  if ($('btnGraphFilters')) $('btnGraphFilters').onclick = (e) => { e.stopPropagation(); const pop = $('graphFilterPopover'); const willOpen = pop.hidden; pop.hidden = !willOpen; $('btnGraphFilters').classList.toggle('is-active', willOpen); };
  if ($('btnCloseGraphFilters')) $('btnCloseGraphFilters').onclick = closeGraphFilters;
  if ($('btnClearGraphFilter')) $('btnClearGraphFilter').onclick = () => applyGraphFilter('all', true);
  if ($('btnHelpCommands')) $('btnHelpCommands').onclick = () => mutate('', () => { state.settings.showCommands = !state.settings.showCommands; });
  if ($('graphFilterSelect')) $('graphFilterSelect').onchange = () => applyGraphFilter($('graphFilterSelect').value || 'all', true);
  if ($('graphFilterChips')) $('graphFilterChips').onclick = (e) => {
    const chip = e.target.closest('[data-filter]');
    if (chip) applyGraphFilter(chip.dataset.filter || 'all', true);
  };
  if ($('graphPresetSelect')) $('graphPresetSelect').onchange = () => applyGraphPreset($('graphPresetSelect').value);
  if ($('btnGraphDiagnostics')) $('btnGraphDiagnostics').onclick = showDiagnosticsPanel;
  if ($('btnImportReport')) $('btnImportReport').onclick = showImportReportPanel;
  if ($('btnCloseGraphInfo')) $('btnCloseGraphInfo').onclick = () => { $('graphInfoPanel').hidden = true; };

  // Settings modal
  $('btnCloseSettings').onclick  = closeSettings;
  $('modalBackdrop').onclick     = closeSettings;
  $('settingVaultName').onchange = () => mutate(t('renamed'), () => state.settings.vaultName = $('settingVaultName').value.trim() || 'Connector');
  $('settingLanguage').onchange  = () => mutate('', () => state.settings.lang   = $('settingLanguage').value);
  $('settingTheme').onchange     = () => mutate('', () => state.settings.theme  = $('settingTheme').value);
  if ($('settingShowCommands')) $('settingShowCommands').onchange = () => mutate('', () => state.settings.showCommands = $('settingShowCommands').checked);
  if ($('settingShowLabels')) $('settingShowLabels').onchange   = () => mutate('', () => state.settings.showLabels   = $('settingShowLabels').checked);
  if ($('settingOrganic')) $('settingOrganic').onchange      = () => mutate('', () => state.settings.organic      = $('settingOrganic').checked);
  if ($('settingGraphGroups')) $('settingGraphGroups').onchange = () => mutate('', () => { state.settings.showGraphGroups = $('settingGraphGroups').checked; });
  if ($('btnSmartLinksSettings')) $('btnSmartLinksSettings').onclick = smartRebuildRequested;

  // Physics sliders
  const makeSlider = (sliderId, valId, physKey, isInt = true) => {
    const slider = $(sliderId), valEl = $(valId);
    slider.addEventListener('input', () => {
      const v = isInt ? parseInt(slider.value) : parseFloat(slider.value);
      phys[physKey] = v; valEl.textContent = v; savePhys();
    });
  };
  makeSlider('sliderRepulsion',  'valRepulsion',  'repulsion');
  makeSlider('sliderStiffness',  'valStiffness',  'stiffness');
  makeSlider('sliderDamping',    'valDamping',    'damping');
  makeSlider('sliderLabelSize',  'valLabelSize',  'labelSize');
  $('btnResetPhysics').onclick = () => {
    phys = { ...PHYS_DEFAULTS };
    savePhys(); translateUI();
    showToast(t('resetPhysics'), false, 1000);
  };

  // Export / import
  $('btnExportJson').onclick = exportJson;
  $('btnExportPng').onclick  = exportPng;
  $('btnImport').onclick     = () => $('fileInput').click();
  $('fileInput').onchange    = () => { const f = $('fileInput').files[0]; if (f) importFile(f); $('fileInput').value = ''; };
  $('btnResetSample').onclick = () => mutate(t('sampleReset'), () => {
    state = sampleState(); rebuildMaps();
    selectedId       = state.selectedId;
    linkAnchorId     = selectedId;
    selectedFolderId = state.folders[0].id;
    folderOpen       = new Set(state.folders.map(f => f.id));
  });

  // Canvas pointer events
  wrap.addEventListener('pointerdown', (e) => {
    setCanvasPointer(e); wrap.setPointerCapture(e.pointerId);
    const node = hitNode(pointer.x, pointer.y);
    if (node) {
      cancelBlankReset();
      const now = performance.now();
      const repeat = graph.lastNodeClick && graph.lastNodeClick.nodeId === node.id && now - graph.lastNodeClick.time < 520;
      if (!repeat) graph.lastNodeClick = { nodeId: node.id, previousId: selectedId, time: now };
      selectItem(node.id);
      graph.dragging = node.id;
      graph.dragMoved = false;
      graph.dragOffset = { x: node.x - pointer.wx, y: node.y - pointer.wy };
      graph.panning = false; graph.panStart = null; graph.blankClick = null;
      node.vx = node.vy = node.fx = node.fy = 0;
    } else {
      const link = hitLink(pointer.x, pointer.y);
      graph.hover = link ? { type:'link', id:link.id } : null;
      if (!link) graph.blankClick = { x:e.clientX, y:e.clientY, moved:false, anchorId:selectedId || linkAnchorId || null, folderId:selectedFolderId || null };
      graph.panning = true; graph.panStart = { x:e.clientX, y:e.clientY, gx:graph.x, gy:graph.y };
    }
  });

  wrap.addEventListener('pointermove', (e) => {
    setCanvasPointer(e);
    if (graph.blankClick && (Math.abs(e.clientX - graph.blankClick.x) > 4 || Math.abs(e.clientY - graph.blankClick.y) > 4)) graph.blankClick.moved = true;
    if (graph.dragging) {
      const item = pickItem(graph.dragging);
      if (item) {
        item.x = pointer.wx + (graph.dragOffset?.x || 0);
        item.y = pointer.wy + (graph.dragOffset?.y || 0);
        item.vx = item.vy = item.fx = item.fy = 0;
        graph.dragMoved = true;
        if (graph.paused) freezeMotion();
        drawGraph();
      }
    } else if (graph.panning && graph.panStart) {
      graph.x = graph.panStart.gx + (e.clientX - graph.panStart.x);
      graph.y = graph.panStart.gy + (e.clientY - graph.panStart.y);
      saveUI();
    } else {
      const n = hitNode(pointer.x, pointer.y);
      if (n)      graph.hover = { type:'node', id:n.id };
      else { const l = hitLink(pointer.x, pointer.y); graph.hover = l ? { type:'link', id:l.id } : null; }
    }
  });

  wrap.addEventListener('pointerup', () => {
    const hadDrag = !!graph.dragging;
    if (graph.blankClick && !graph.blankClick.moved) {
      // Delay blank reset briefly so a double-click on empty canvas can create
      // a new note linked to the previously selected node instead of losing the anchor.
      scheduleBlankReset(graph.blankClick);
    }
    if (hadDrag && graph.dragMoved) { freezeMotion(); settleGraph(360); }
    graph.dragging = null; graph.dragOffset = null; graph.dragMoved = false;
    graph.panning = false; graph.panStart = null; graph.blankClick = null;
    save();
  });

  wrap.addEventListener('dblclick', (e) => {
    cancelBlankReset();
    setCanvasPointer(e);
    const node = hitNode(pointer.x, pointer.y);
    if (node) {
      const from = (graph.lastNodeClick && graph.lastNodeClick.nodeId === node.id && graph.lastNodeClick.previousId !== node.id)
        ? graph.lastNodeClick.previousId
        : (linkAnchorId && linkAnchorId !== node.id ? linkAnchorId : null);
      if (from && pickItem(from)) upsertManualLink(from, node.id, { allowCrossFolder: false });
      else selectItem(node.id);
      blankCreateAnchor = null;
      return;
    }
    const anchorId = blankCreateAnchor || selectedId || linkAnchorId;
    createLinkedNoteAtPointer(anchorId);
    blankCreateAnchor = null;
  });

  wrap.addEventListener('wheel', (e) => {
    e.preventDefault(); setCanvasPointer(e);
    const before = screenToWorld(pointer.x, pointer.y);
    const factor = Math.exp(-e.deltaY * 0.001);
    graph.scale  = clamp(graph.scale * factor, .15, 4.0);
    graph.x = pointer.x - before.x * graph.scale;
    graph.y = pointer.y - before.y * graph.scale;
    saveUI();
  }, { passive: false });

  document.addEventListener('click', (e) => {
    if (e.target.closest('#btnCloseSettings')) closeSettings();
    if (!e.target.closest('#graphFilterPopover') && !e.target.closest('#btnGraphFilters')) {
      if ($('graphFilterPopover')) $('graphFilterPopover').hidden = true;
      $('btnGraphFilters')?.classList.remove('is-active');
    }
    if (!e.target.closest('.toast') && !e.target.closest('.settings-modal') && !e.target.closest('.folder-row') && !e.target.closest('.item-row')) {
      document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    }
  });

  window.addEventListener('resize', () => resizeCanvas(true));

  document.addEventListener('keydown', (e) => {
    const typing = ['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName);
    if (e.key === 'Escape') {
      closeSettings();
      if ($('graphFilterPopover')) $('graphFilterPopover').hidden = true;
      $('btnGraphFilters')?.classList.remove('is-active');
      if ($('graphInfoPanel')) $('graphInfoPanel').hidden = true;
      graph.connectMode = false; graph.connectFrom = null; updateCounts(); return;
    }
    if (!typing && e.key === 'F2') {
      e.preventDefault();
      if (selectedId) renameItem(selectedId); else if (selectedFolderId) renameFolder(selectedFolderId);
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') { e.preventDefault(); app.classList.remove('sidebar-collapsed','editor-collapsed','focus-graph'); $('searchInput')?.focus(); resizeCanvas(true); saveUI(); return; }
    if (!typing && e.key.toLowerCase() === 'g') { e.preventDefault(); const pop = $('graphFilterPopover'); if (pop) { const willOpen = pop.hidden; pop.hidden = !willOpen; $('btnGraphFilters')?.classList.toggle('is-active', willOpen); } return; }
    if (!typing && e.key === ' ') { e.preventDefault(); setPaused(!graph.paused); return; }
    if (!typing && e.key.toLowerCase() === 'p') { e.preventDefault(); optimizeLayoutAction(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !typing) { e.preventDefault(); undo(); return; }
    if ((e.key === 'Delete' || e.key === 'Backspace') && !typing) { e.preventDefault(); deleteSelectedOrLink(); }
  });
}

/* ══════════════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════════════ */
// 1. Load physics
phys = loadPhys();

// 2. Load state
let state = loadState() || sampleState();
state = normalizeState(state);
rebuildMaps();
syncSmartLinksIfNeeded(false, true);
seedSmartLayout(false);

// 3. Init selection
selectedId       = state.selectedId || state.items[0]?.id || null;
linkAnchorId     = selectedId;
selectedFolderId = state.folders[0]?.id || null;
folderOpen       = new Set(state.folders.map(f => f.id));

// 4. Restore UI (panel states, zoom/pan)
restoreUI();

// 5. Bind + render
bind();
renderAll();

// 6. Center graph only if no saved position
if (!loadUI().scale) centerGraph();

// 7. Start animation loop with live motion enabled by default
if (!graph.paused) settleGraph(1400);
raf = requestAnimationFrame(animate);

})();
