// ─── Commandes médailles / Stocks / Transmissions ────────────────

// Shared edition picker (same pattern as Palmarès)
const EditionPicker = ({ editions, value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const current = editions.find(e => e.id === value);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', fontSize: 14, fontWeight: 500,
          border: '1px solid var(--border)', borderRadius: 8,
          background: 'var(--surface)', color: 'var(--fg)',
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        {current.label}
        {current.archive && <span style={{ fontSize: 10.5, padding: '1px 6px', background: 'var(--slate-100)', color: 'var(--fg-muted)', borderRadius: 4, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Archive</span>}
        <Icon.ChevronDown size={13} style={{ color: 'var(--fg-muted)' }}/>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }}/>
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0,
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            minWidth: 260, zIndex: 60, overflow: 'hidden',
          }}>
            {editions.map(e => (
              <button key={e.id} onClick={() => { onChange(e.id); setOpen(false); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', border: 'none',
                background: e.id === value ? 'var(--burgundy-50)' : 'transparent',
                textAlign: 'left', cursor: 'pointer', fontSize: 13,
                color: e.id === value ? 'var(--burgundy-800)' : 'var(--fg)',
                fontWeight: e.id === value ? 600 : 500, fontFamily: 'inherit',
              }}>
                <span style={{ flex: 1 }}>{e.label}</span>
                {e.archive && <span style={{ fontSize: 10.5, color: 'var(--fg-muted)', fontWeight: 500 }}>archive</span>}
                {e.id === value && <Icon.Check size={13}/>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const COMMON_EDITIONS = [
  { id: '2026', label: 'Concours des Grands Vins de France 2026' },
  { id: '2025', label: 'Concours des Grands Vins de France 2025', archive: true },
  { id: '2024', label: 'Concours des Grands Vins de France 2024', archive: true },
];

// ─── Page 1 — Commandes médailles ─────────────────────────────────

const AdminCommandesMedailles = () => {
  const [editionId, setEditionId] = React.useState('2026');
  const [tab, setTab] = React.useState('toutes');
  const [palmaresPublie, setPalmaresPublie] = React.useState(true);
  const [rowMenu, setRowMenu] = React.useState(null);

  const counts = { toutes: 312, a_expedier: 218, expediees: 81, livrees: 13 };

  const ROWS = [
    ['CMD-2026-0312', 'Domaine de la Chevalière',    'Pouilly-Fuissé',     12, 18, 6,  60,   'a-expedier'],
    ['CMD-2026-0311', 'Maison Joseph Drouhin',       'Beaune',             24, 12, 0,  60,   'a-expedier'],
    ['CMD-2026-0310', 'Château de Pierreclos',       'Saint-Véran',        6,  12, 4,  30,   'expedie'],
    ['CMD-2026-0309', 'Domaine Bouchard Père',       'Meursault',          18, 24, 0,  42,   'expedie'],
    ['CMD-2026-0308', 'Domaine des 3 Pierres',       'Mâcon-Villages',     0,  24, 12, null, 'livre'],
    ['CMD-2026-0307', 'Cellier de Solutré',          'Pouilly-Fuissé',     0,  18, 6,  30,   'a-expedier'],
    ['CMD-2026-0306', 'Vignobles Lacroix',           'Mercurey',           0,  12, 8,  18,   'a-expedier'],
    ['CMD-2026-0305', 'Domaine Sainte-Anne',         'Saint-Véran',        0,  6,  12, 30,   'expedie'],
    ['CMD-2026-0304', 'Domaine Tabard',              'Brouilly',           0,  0,  24, 24,   'livre'],
    ['CMD-2026-0303', 'Vignerons de Buxy',           'Bourgogne Aligoté',  0,  0,  18, null, 'a-expedier'],
  ];

  const filtered = ROWS.filter(r => {
    if (tab === 'toutes')     return true;
    if (tab === 'a_expedier') return r[7] === 'a-expedier';
    if (tab === 'expediees')  return r[7] === 'expedie';
    if (tab === 'livrees')    return r[7] === 'livre';
  });

  const paged = useSortablePaged(filtered, {
    defaultPageSize: 25,
    accessors: {
      ref: r => r[0], producteur: r => r[1], app: r => r[2],
      qty: r => r[3] + r[4] + r[5], statut: r => r[7],
    },
  });

  const tabsDef = [
    { id: 'toutes',     label: 'Toutes',     count: counts.toutes },
    { id: 'a_expedier', label: 'À expédier', count: counts.a_expedier },
    { id: 'expediees',  label: 'Expédiées',  count: counts.expediees },
    { id: 'livrees',    label: 'Livrées',    count: counts.livrees },
  ];

  if (!palmaresPublie) {
    return (
      <div data-screen-label="admin-commandes-medailles">
        <PageHeader
          breadcrumb={['Administration', 'Commandes', 'Commandes médailles']}
          title="Commandes médailles"
          subtitle="Aucune commande à traiter — palmarès non publié"
        />
        <div className="card" style={{ padding: '64px 32px', textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: '#fef3c7', color: '#a16207',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Icon.Medal size={28}/>
          </div>
          <div className="display" style={{ fontSize: 22, fontWeight: 500, marginBottom: 8, letterSpacing: '-0.01em' }}>
            Commandes indisponibles
          </div>
          <div style={{ fontSize: 14, color: 'var(--fg-muted)', maxWidth: 440, margin: '0 auto 20px' }}>
            Les commandes de médailles seront accessibles dès la publication du palmarès. Les producteurs médaillés pourront alors commander leurs médailles physiques via l'extranet.
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setPalmaresPublie(true)}>
            <Icon.Eye size={13}/> Voir l'état "publié" (démo)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-screen-label="admin-commandes-medailles">
      <PageHeader
        breadcrumb={['Administration', 'Commandes', 'Commandes médailles']}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span>Commandes médailles</span>
            <EditionPicker editions={COMMON_EDITIONS} value={editionId} onChange={setEditionId}/>
          </div>
        }
        subtitle="Concours des Grands Vins de France 2026 · 312 commandes · 1 840 médailles commandées"
        actions={<>
          <button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Export</button>
        </>}
      />

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Médailles Or',     n: 612,   dot: '#d4a017' },
          { label: 'Médailles Argent', n: 894,   dot: '#94a3b8' },
          { label: 'Médailles Bronze', n: 334,   dot: '#c2410c' },
          { label: 'Total médailles',  n: 1840,  plain: true },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            {!s.plain && <span style={{ width: 10, height: 10, borderRadius: 999, background: s.dot, display: 'inline-block' }}/>}
            <div>
              <div className="tnum display" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1 }}>{typeof s.n === 'number' ? s.n.toLocaleString('fr') : s.n}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        <div className="input-with-icon" style={{ flex: 1, maxWidth: 340 }}>
          <Icon.Search size={14} className="input-icon"/>
          <input className="input" placeholder="N° commande, producteur…"/>
        </div>
        <button className="btn btn-outline btn-sm"><Icon.Filter size={13}/> Région</button>
        <button className="btn btn-outline btn-sm"><Icon.Calendar size={13}/> Date</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, borderBottom: '1px solid var(--border)', marginBottom: 14 }}>
        {tabsDef.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '12px 0', border: 'none',
              borderBottom: active ? '2px solid var(--burgundy-800)' : '2px solid transparent',
              background: 'transparent',
              fontSize: 13.5, fontWeight: active ? 600 : 500,
              color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: -1, fontFamily: 'inherit',
            }}>
              {t.label}
              <span style={{
                fontSize: 11, padding: '0 6px', borderRadius: 999,
                background: active ? 'var(--burgundy-50)' : 'var(--slate-100)',
                color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)', fontWeight: 500,
              }}>{t.count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <SortableTh sortKey="ref"        currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>N° Commande</SortableTh>
              <SortableTh sortKey="producteur" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Producteur</SortableTh>
              <th className="num">Or</th>
              <th className="num">Argent</th>
              <th className="num">Bronze</th>
              <SortableTh sortKey="qty"        currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Total</SortableTh>
              <th className="num">Quota</th>
              <SortableTh sortKey="statut"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Livraison</SortableTh>
              <th style={{ width: 36 }}></th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.map((r, i) => (
              <tr key={i}>
                <td style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', fontSize: 12.5, color: 'var(--fg)', fontWeight: 500 }}>{r[0]}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{r[1]}</div>
                  <div className="muted" style={{ fontSize: 11.5, marginTop: 1 }}>{r[2]}</div>
                </td>
                <td className="num tnum">
                  {r[3] > 0 ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: '#d4a017' }}/>{r[3]}
                  </span> : <span className="subtle">—</span>}
                </td>
                <td className="num tnum">
                  {r[4] > 0 ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: '#94a3b8' }}/>{r[4]}
                  </span> : <span className="subtle">—</span>}
                </td>
                <td className="num tnum">
                  {r[5] > 0 ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: '#c2410c' }}/>{r[5]}
                  </span> : <span className="subtle">—</span>}
                </td>
                <td className="num tnum" style={{ fontWeight: 600 }}>{r[3] + r[4] + r[5]}</td>
                <td className="num"><QuotaCell ordered={r[3] + r[4] + r[5]} quota={r[6]}/></td>
                <td><LivraisonBadge kind={r[7]}/></td>
                <td onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
                  <button className="btn btn-icon btn-sm btn-ghost" onClick={() => setRowMenu(rowMenu === i ? null : i)}>
                    <Icon.MoreH size={13}/>
                  </button>
                  {rowMenu === i && (
                    <>
                      <div onClick={() => setRowMenu(null)} style={{ position: 'fixed', inset: 0, zIndex: 50 }}/>
                      <div style={{
                        position: 'absolute', top: 32, right: 8,
                        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        minWidth: 220, zIndex: 60, overflow: 'hidden', padding: '4px 0',
                      }}>
                        <CmdMenuItem icon={<Icon.Eye size={13}/>}     label="Voir le dossier producteur" onClick={() => setRowMenu(null)}/>
                        <CmdMenuItem icon={<Icon.Package size={13}/>} label="Marquer comme expédié"      onClick={() => setRowMenu(null)}/>
                        <CmdMenuItem icon={<Icon.FileText size={13}/>} label="Imprimer le bon de livraison" onClick={() => setRowMenu(null)}/>
                        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }}/>
                        <CmdMenuItem icon={<Icon.X size={13}/>} label="Annuler la commande" danger onClick={() => setRowMenu(null)}/>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination {...paged}
        leftSlot={<span style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginRight: 12 }}>{paged.total} commande{paged.total > 1 ? 's' : ''} — </span>}/>
    </div>
  );
};

// ─── Quota cell ('commandé / droit') ──────────────────────────────

const QuotaCell = ({ ordered, quota }) => {
  // Quota not yet confirmed by client → unknown state
  if (quota == null) {
    return (
      <span className="tnum" style={{
        display: 'inline-flex', alignItems: 'baseline', gap: 4,
        color: 'var(--fg-subtle)', fontStyle: 'italic',
      }} title="Règle de quota à confirmer">
        — / ?
      </span>
    );
  }

  const over    = ordered > quota;
  const atMax   = ordered === quota;
  // Default: ordered < quota → highlight the consumed count in burgundy (active)
  // At max  : neutral gray (quota épuisé, nothing more available)
  // Over    : red (dépassement)
  const orderedColor = over ? '#dc2626' : atMax ? 'var(--fg-muted)' : 'var(--fg)';
  const quotaColor   = over ? '#dc2626' : 'var(--fg-subtle)';
  const weight       = over ? 700 : atMax ? 500 : 600;

  return (
    <span className="tnum" style={{ display: 'inline-flex', alignItems: 'baseline', gap: 3, fontWeight: weight }}>
      <span style={{ color: orderedColor }}>{ordered}</span>
      <span style={{ color: 'var(--fg-subtle)', fontWeight: 400 }}>/</span>
      <span style={{ color: quotaColor, fontWeight: 500 }}>{quota}</span>
      {over && (
        <Icon.AlertTriangle size={11} style={{ color: '#dc2626', marginLeft: 3, alignSelf: 'center' }}/>
      )}
    </span>
  );
};

// ─── Status badges (commandes) ────────────────────────────────────

const LivraisonBadge = ({ kind }) => {
  const map = {
    'a-expedier': { bg: 'var(--slate-100)', fg: 'var(--slate-700)', label: 'À expédier' },
    'expedie':    { bg: '#eff6ff',          fg: '#1e40af',         label: 'Expédié' },
    'livre':      { bg: '#dcfce7',          fg: '#166534',         label: 'Livré' },
  };
  const s = map[kind];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px', borderRadius: 999,
      background: s.bg, color: s.fg,
      fontSize: 11.5, fontWeight: 600,
    }}>
      {s.label}
    </span>
  );
};

const CmdMenuItem = ({ icon, label, onClick, danger, primary }) => (
  <button onClick={onClick} style={{
    width: '100%', display: 'flex', alignItems: 'center', gap: 9,
    padding: '8px 14px', border: 'none', background: 'transparent',
    textAlign: 'left', cursor: 'pointer', fontSize: 12.5,
    color: danger ? '#991b1b' : primary ? 'var(--burgundy-800)' : 'var(--fg)',
    fontWeight: primary ? 600 : 400,
    fontFamily: 'inherit',
  }}
  onMouseEnter={e => e.currentTarget.style.background = danger ? '#fef2f2' : primary ? 'var(--burgundy-50)' : 'var(--slate-50)'}
  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >
    <span style={{ color: danger ? '#991b1b' : primary ? 'var(--burgundy-800)' : 'var(--fg-muted)', display: 'inline-flex' }}>{icon}</span>
    {label}
  </button>
);

// ─── Page 2 — Stocks ──────────────────────────────────────────────

const AdminStocks = () => {
  const [editionId, setEditionId] = React.useState('2026');
  const [editModal, setEditModal] = React.useState(false);

  const STOCKS = [
    { kind: 'or',     label: 'Médaille Or',     total: 6000, ordered: 1214, threshold: 500,  bg: '#fef3c7', fg: '#a16207', dot: '#d4a017' },
    { kind: 'argent', label: 'Médaille Argent', total: 5000, ordered: 1894, threshold: 500,  bg: '#f1f5f9', fg: '#475569', dot: '#94a3b8' },
    { kind: 'bronze', label: 'Médaille Bronze', total: 3000, ordered: 2680, threshold: 500,  bg: '#fed7aa', fg: '#9a3412', dot: '#c2410c' },
  ];

  const HISTORY = [
    ['15/05/2026', 'Commande producteur',     -24, -18, -6,  'CMD-2026-0312 · Domaine de la Chevalière'],
    ['14/05/2026', 'Commande producteur',     -12, -24, 0,   'CMD-2026-0311 · Maison Joseph Drouhin'],
    ['12/05/2026', 'Livraison fournisseur',   +500, +500, +200, 'BL-2026-008 · Médailleur Lyon'],
    ['10/05/2026', 'Correction manuelle',     0,   -3,   0,   'Médailles défectueuses retirées du stock — Sophie L.'],
    ['08/05/2026', 'Commande producteur',     -18, -12, -8,  'CMD-2026-0298 · Vignobles Lacroix'],
    ['01/05/2026', 'Stock initial 2026',      +6000, +5000, +3000, 'Stock d\'ouverture — édition 2026'],
  ];
  const parseD = (s) => { const [d,m,y] = s.split('/'); return new Date(+y, +m-1, +d).getTime(); };
  const paged = useSortablePaged(HISTORY, {
    defaultPageSize: 25,
    accessors: { date: r => parseD(r[0]), type: r => r[1], or: r => r[2], argent: r => r[3], bronze: r => r[4] },
  });

  return (
    <div data-screen-label="admin-stocks">
      <PageHeader
        breadcrumb={['Administration', 'Commandes', 'Stocks']}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span>Stocks médailles</span>
            <EditionPicker editions={COMMON_EDITIONS} value={editionId} onChange={setEditionId}/>
          </div>
        }
        subtitle="Édition 2026 · Mises à jour automatiques à chaque commande"
        actions={<>
          <button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => setEditModal(true)} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Edit size={13}/> Modifier les stocks
          </button>
        </>}
      />

      {/* Stock cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {STOCKS.map(s => {
          const available = s.total - s.ordered;
          const pct = Math.round((available / s.total) * 100);
          const critical = available <= s.threshold;
          const warning  = !critical && available <= s.threshold * 2;
          const barColor = critical ? '#dc2626' : warning ? '#f59e0b' : '#16a34a';
          const barBg    = critical ? '#fef2f2' : warning ? '#fefce8' : '#f0fdf4';

          return (
            <div key={s.kind} className="card" style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: s.bg, color: s.fg,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon.Medal size={20}/>
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg)' }}>{s.label}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 1 }}>Édition 2026</div>
                </div>
                {critical && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '3px 8px', borderRadius: 999,
                    background: '#fef2f2', color: '#991b1b',
                    fontSize: 10.5, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}>
                    <Icon.AlertTriangle size={10}/> Critique
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
                <div className="display tnum" style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.02em', color: critical ? '#991b1b' : 'var(--fg)' }}>
                  {available.toLocaleString('fr')}
                </div>
                <div className="tnum" style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
                  / {s.total.toLocaleString('fr')}
                </div>
              </div>

              <div style={{ position: 'relative', height: 8, background: barBg, borderRadius: 999, overflow: 'hidden', marginBottom: 14 }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, bottom: 0,
                  width: `${pct}%`, background: barColor, borderRadius: 999,
                  transition: 'width .3s',
                }}/>
                {/* Threshold marker */}
                <div style={{
                  position: 'absolute', top: -2, bottom: -2,
                  left: `${(s.threshold / s.total) * 100}%`,
                  width: 2, background: 'var(--fg-subtle)',
                }} title={`Seuil d'alerte : ${s.threshold}`}/>
              </div>

              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '1fr auto', rowGap: 6, columnGap: 12, fontSize: 12.5 }}>
                <dt style={{ color: 'var(--fg-muted)' }}>Commandées</dt>
                <dd className="tnum" style={{ margin: 0, fontWeight: 500, color: 'var(--fg)' }}>{s.ordered.toLocaleString('fr')}</dd>
                <dt style={{ color: 'var(--fg-muted)' }}>Disponibles</dt>
                <dd className="tnum" style={{ margin: 0, fontWeight: 600, color: critical ? '#991b1b' : 'var(--fg)' }}>{available.toLocaleString('fr')}</dd>
                <dt style={{ color: 'var(--fg-muted)' }}>Seuil alerte</dt>
                <dd className="tnum" style={{ margin: 0, fontWeight: 500, color: 'var(--fg-muted)' }}>{s.threshold.toLocaleString('fr')}</dd>
              </dl>
            </div>
          );
        })}
      </div>

      {/* History */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 className="display" style={{ fontSize: 17, fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>Historique des mouvements</h3>
        <button className="btn btn-outline btn-sm"><Icon.Filter size={13}/> Filtrer par type</button>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <SortableTh sortKey="date"   currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Date</SortableTh>
              <SortableTh sortKey="type"   currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Type</SortableTh>
              <SortableTh sortKey="or"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Or</SortableTh>
              <SortableTh sortKey="argent" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Argent</SortableTh>
              <SortableTh sortKey="bronze" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Bronze</SortableTh>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.map((r, i) => (
              <tr key={i}>
                <td className="muted tnum" style={{ fontSize: 12.5 }}>{r[0]}</td>
                <td><MouvementTypeBadge type={r[1]}/></td>
                <td className="num tnum"><Delta n={r[2]}/></td>
                <td className="num tnum"><Delta n={r[3]}/></td>
                <td className="num tnum"><Delta n={r[4]}/></td>
                <td className="muted" style={{ fontSize: 12.5 }}>{r[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination {...paged}/>

      {editModal && <EditStockModal onCancel={() => setEditModal(false)} onConfirm={() => setEditModal(false)}/>}
    </div>
  );
};

const Delta = ({ n }) => {
  if (n === 0) return <span className="subtle">—</span>;
  const positive = n > 0;
  return (
    <span style={{
      fontWeight: 600,
      color: positive ? '#16a34a' : '#991b1b',
    }}>
      {positive ? '+' : ''}{n.toLocaleString('fr')}
    </span>
  );
};

const MouvementTypeBadge = ({ type }) => {
  const map = {
    'Commande producteur':   { icon: <Icon.Package size={11}/>, bg: 'var(--slate-100)', fg: 'var(--slate-700)' },
    'Livraison fournisseur': { icon: <Icon.Download size={11}/>, bg: '#dcfce7',          fg: '#166534' },
    'Correction manuelle':   { icon: <Icon.Edit size={11}/>,    bg: '#fef3c7',          fg: '#a16207' },
    'Stock initial 2026':    { icon: <Icon.Sparkles size={11}/>,bg: 'var(--burgundy-50)',fg: 'var(--burgundy-800)' },
  };
  const s = map[type] || map['Commande producteur'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px 3px 7px', borderRadius: 999,
      background: s.bg, color: s.fg,
      fontSize: 11.5, fontWeight: 500,
    }}>
      {s.icon}{type}
    </span>
  );
};

const EditStockModal = ({ onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const [values, setValues] = React.useState({ or: 6000, argent: 5000, bronze: 3000, threshold: 500 });
  const [note, setNote] = React.useState('');

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 520, padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '22px 26px 14px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Edit size={13}/>
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Correction manuelle</span>
            </div>
            <h2 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>Modifier les stocks</h2>
            <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 4, marginBottom: 0 }}>Une trace est ajoutée à l'historique.</p>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost" aria-label="Fermer">
            <Icon.X size={14}/>
          </button>
        </div>

        <div style={{ padding: '18px 26px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
            {[
              { id: 'or',     label: 'Or',     dot: '#d4a017' },
              { id: 'argent', label: 'Argent', dot: '#94a3b8' },
              { id: 'bronze', label: 'Bronze', dot: '#c2410c' },
            ].map(f => (
              <label key={f.id} className="field" style={{ display: 'block' }}>
                <span className="field-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: f.dot }}/>
                  Stock total {f.label}
                </span>
                <input type="number" className="input tnum" value={values[f.id]} onChange={e => setValues(v => ({ ...v, [f.id]: e.target.value }))}/>
              </label>
            ))}
          </div>

          <label className="field" style={{ display: 'block', marginBottom: 14 }}>
            <span className="field-label" style={{ display: 'block', marginBottom: 6 }}>Seuil d'alerte (commun)</span>
            <input type="number" className="input tnum" value={values.threshold} onChange={e => setValues(v => ({ ...v, threshold: e.target.value }))}/>
          </label>

          <label className="field" style={{ display: 'block' }}>
            <span className="field-label" style={{ display: 'block', marginBottom: 6 }}>Note <span style={{ color: 'var(--fg-subtle)', fontWeight: 400 }}>(visible dans l'historique)</span></span>
            <textarea className="input textarea" rows={2} placeholder="Ex. Livraison reportée, médailles défectueuses…" value={note} onChange={e => setNote(e.target.value)}/>
          </label>
        </div>

        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button className="btn btn-primary" onClick={onConfirm} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Check size={13}/> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page 3 — Transmissions fournisseurs ──────────────────────────

const AdminTransmissions = () => {
  const [activeSupplier, setActiveSupplier] = React.useState(null); // supplier id for modal
  const [histMenu,       setHistMenu]       = React.useState(null); // row index for action menu
  const [statusOverrides, setStatusOverrides] = React.useState({});  // { rowIndex: newStatus }

  const SUPPLIERS = [
    {
      id: 'lyon',
      name: 'Médailleur Lyon',
      sub: 'Maison Dupont — Lyon (69)',
      producteurs: 248,
      a_transmettre: { or: 220, argent: 180, bronze: 95 },
    },
    {
      id: 'bordeaux',
      name: 'Médailleur Bordeaux',
      sub: 'Atelier Verdier — Bordeaux (33)',
      producteurs: 52,
      a_transmettre: { or: 48, argent: 32, bronze: 18 },
    },
    {
      id: 'paris',
      name: 'Arthus-Bertrand',
      sub: 'Paris (75) — médailles série limitée',
      producteurs: 12,
      a_transmettre: { or: 0, argent: 0, bronze: 0 },
    },
  ];

  const supplierTotal = (s) => s.a_transmettre.or + s.a_transmettre.argent + s.a_transmettre.bronze;
  const TOTAL_A_TRANSMETTRE = SUPPLIERS.reduce((acc, s) => acc + supplierTotal(s), 0);

  const TRANSMISSIONS = [
    ['15/05/2026 09:12', 'Sophie L.', 'lyon',     420, 380, 220, 1020, 'recu',    'transmission-lyon-2026-04.csv'],
    ['15/05/2026 09:14', 'Sophie L.', 'bordeaux',  62,  48,  28,  138, 'recu',    'transmission-bordeaux-2026-02.csv'],
    ['08/05/2026 14:08', 'Sophie L.', 'lyon',     380, 290, 180,  850, 'recu',    'transmission-lyon-2026-03.csv'],
    ['01/05/2026 11:32', 'Marc D.',   'lyon',     240, 180,  95,  515, 'attente', 'transmission-lyon-2026-02.csv'],
    ['24/04/2026 16:45', 'Sophie L.', 'bordeaux',  40,  30,  18,   88, 'erreur',  'transmission-bordeaux-2026-01.csv'],
    ['24/04/2026 16:42', 'Sophie L.', 'lyon',     150, 120,  60,  330, 'recu',    'transmission-lyon-2026-01.csv'],
  ];

  const parseDt = (s) => { const [d,t] = s.split(' '); const [dd,mm,yy] = d.split('/'); return new Date(+yy, +mm-1, +dd, ...(t||'00:00').split(':').map(Number)).getTime(); };
  const paged = useSortablePaged(TRANSMISSIONS, {
    defaultPageSize: 25,
    accessors: {
      date: r => parseDt(r[0]), admin: r => r[1], sup: r => r[2],
      total: r => r[6], statut: r => r[7], fichier: r => r[8],
    },
  });

  const supplierById = (id) => SUPPLIERS.find(s => s.id === id);
  const activeSupplierObj = activeSupplier ? supplierById(activeSupplier) : null;

  return (
    <div data-screen-label="admin-transmissions">
      <PageHeader
        breadcrumb={['Administration', 'Commandes', 'Transmissions fournisseurs']}
        title="Transmissions fournisseurs"
        subtitle={`${SUPPLIERS.length} médailleurs partenaires · ${TOTAL_A_TRANSMETTRE} médailles à transmettre`}
        actions={<>
          <button className="btn btn-outline btn-sm"><Icon.Settings size={13}/> Gérer les fournisseurs</button>
          <button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Export historique</button>
        </>}
      />

      {/* À transmettre — by supplier */}
      <div className="card" style={{ padding: 0, marginBottom: 24, overflow: 'hidden', borderColor: TOTAL_A_TRANSMETTRE > 0 ? 'var(--burgundy-200)' : 'var(--border)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px',
          background: TOTAL_A_TRANSMETTRE > 0 ? 'var(--burgundy-50)' : 'var(--slate-50)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon.Upload size={14} style={{ color: 'var(--burgundy-800)' }}/>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--burgundy-800)' }}>
              À transmettre
            </span>
            <span style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>
              — un export par fournisseur
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span className="tnum display" style={{ fontSize: 20, fontWeight: 500, color: 'var(--burgundy-800)' }}>{TOTAL_A_TRANSMETTRE}</span>
            <span style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>médailles au total</span>
          </div>
        </div>

        {SUPPLIERS.map((s, i) => {
          const total = supplierTotal(s);
          const empty = total === 0;
          return (
            <div key={s.id} style={{
              display: 'grid', gridTemplateColumns: 'minmax(220px, 1.4fr) 1fr auto',
              alignItems: 'center', gap: 24,
              padding: '16px 20px',
              borderBottom: i < SUPPLIERS.length - 1 ? '1px solid var(--border)' : 'none',
              opacity: empty ? 0.6 : 1,
            }}>
              {/* Supplier name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: empty ? 'var(--slate-100)' : 'var(--burgundy-50)',
                  color: empty ? 'var(--fg-muted)' : 'var(--burgundy-800)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon.Building size={16}/>
                </span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>{s.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 1 }}>
                    {s.sub} · <span className="tnum">{s.producteurs}</span> producteurs
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div>
                {empty ? (
                  <span style={{ fontSize: 12.5, color: 'var(--fg-subtle)', fontStyle: 'italic' }}>
                    Aucune commande à transmettre
                  </span>
                ) : (
                  <div style={{ display: 'flex', gap: 18, fontSize: 12.5, alignItems: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: '#d4a017' }}/>
                      <span className="tnum" style={{ fontWeight: 600, color: 'var(--fg)' }}>{s.a_transmettre.or}</span>
                      <span style={{ color: 'var(--fg-muted)' }}>Or</span>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: '#94a3b8' }}/>
                      <span className="tnum" style={{ fontWeight: 600, color: 'var(--fg)' }}>{s.a_transmettre.argent}</span>
                      <span style={{ color: 'var(--fg-muted)' }}>Argent</span>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: '#c2410c' }}/>
                      <span className="tnum" style={{ fontWeight: 600, color: 'var(--fg)' }}>{s.a_transmettre.bronze}</span>
                      <span style={{ color: 'var(--fg-muted)' }}>Bronze</span>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4, paddingLeft: 12, borderLeft: '1px solid var(--border)' }}>
                      <span className="tnum display" style={{ fontSize: 18, fontWeight: 500, color: 'var(--burgundy-800)' }}>{total}</span>
                      <span style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>total</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div>
                {empty ? (
                  <button className="btn btn-outline btn-sm" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                    <Icon.Upload size={13}/> Préparer
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setActiveSupplier(s.id)}
                    style={{ background: 'var(--burgundy-800)' }}
                  >
                    <Icon.Upload size={13}/> Préparer l'export
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* History */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 className="display" style={{ fontSize: 17, fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>Historique des transmissions</h3>
        <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }} className="tnum">{TRANSMISSIONS.length} transmissions</span>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <SortableTh sortKey="date"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Date</SortableTh>
              <SortableTh sortKey="admin"   currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Admin</SortableTh>
              <SortableTh sortKey="sup"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Fournisseur</SortableTh>
              <th className="num">Or</th>
              <th className="num">Argent</th>
              <th className="num">Bronze</th>
              <SortableTh sortKey="total"   currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Total</SortableTh>
              <SortableTh sortKey="statut"  currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Statut</SortableTh>
              <SortableTh sortKey="fichier" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Fichier</SortableTh>
              <th style={{ width: 36 }}></th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.map((r) => {
              const i = TRANSMISSIONS.indexOf(r);
              const sup = supplierById(r[2]);
              const status = statusOverrides[i] != null ? statusOverrides[i] : r[7];
              const actions = [];
              if (status === 'attente') {
                actions.push({ id: 'mark-recu',   icon: <Icon.Check size={13}/>,         label: 'Marquer comme « Accusé reçu »', onClick: () => setStatusOverrides(o => ({ ...o, [i]: 'recu' })) });
                actions.push({ id: 'mark-erreur', icon: <Icon.AlertTriangle size={13}/>, label: 'Signaler une erreur',           onClick: () => setStatusOverrides(o => ({ ...o, [i]: 'erreur' })), danger: true });
              }
              if (status === 'erreur') {
                actions.push({ id: 'retransmit', icon: <Icon.Refresh size={13}/>, label: 'Re-transmettre', onClick: () => setStatusOverrides(o => ({ ...o, [i]: 'attente' })) });
              }
              return (
                <tr key={i}>
                  <td className="tnum" style={{ fontSize: 12.5 }}>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon.Building size={11}/>
                      </span>
                      <span style={{ fontWeight: 500 }}>{sup ? sup.name : r[2]}</span>
                    </span>
                  </td>
                  <td className="num tnum">{r[3]}</td>
                  <td className="num tnum">{r[4]}</td>
                  <td className="num tnum">{r[5]}</td>
                  <td className="num tnum" style={{ fontWeight: 600 }}>{r[6].toLocaleString('fr')}</td>
                  <td><TransmissionBadge kind={status}/></td>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
                      fontSize: 12, color: 'var(--burgundy-800)',
                      textDecoration: 'underline', textUnderlineOffset: 2, cursor: 'pointer',
                    }}>
                      <Icon.FileText size={12}/>{r[8]}
                    </span>
                  </td>
                  <td onClick={e => e.stopPropagation()} style={{ position: 'relative', width: 36 }}>
                    <button
                      className="btn btn-icon btn-sm btn-ghost"
                      onClick={() => actions.length && setHistMenu(histMenu === i ? null : i)}
                      disabled={actions.length === 0}
                      style={actions.length === 0 ? { opacity: 0.3, cursor: 'not-allowed' } : null}
                      title={actions.length === 0 ? 'Aucune action disponible' : ''}
                    >
                      <Icon.MoreH size={13}/>
                    </button>
                    {histMenu === i && actions.length > 0 && (
                      <>
                        <div onClick={() => setHistMenu(null)} style={{ position: 'fixed', inset: 0, zIndex: 50 }}/>
                        <div style={{
                          position: 'absolute', top: 32, right: 8,
                          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                          minWidth: 240, zIndex: 60, overflow: 'hidden', padding: '4px 0',
                        }}>
                          {actions.map(a => (
                            <CmdMenuItem key={a.id} icon={a.icon} label={a.label} danger={a.danger} onClick={() => { a.onClick(); setHistMenu(null); }}/>
                          ))}
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <TablePagination {...paged}/>

      {activeSupplierObj && (
        <NewTransmissionModal
          supplier={activeSupplierObj}
          onCancel={() => setActiveSupplier(null)}
          onConfirm={() => setActiveSupplier(null)}
        />
      )}
    </div>
  );
};

const TransmissionBadge = ({ kind }) => {
  const map = {
    recu:    { bg: '#dcfce7', fg: '#166534', label: 'Accusé reçu', icon: <Icon.Check size={11}/> },
    attente: { bg: '#fef3c7', fg: '#a16207', label: 'En attente',  icon: <Icon.Clock size={11}/> },
    erreur:  { bg: '#fef2f2', fg: '#991b1b', label: 'Erreur',      icon: <Icon.AlertTriangle size={11}/> },
  };
  const s = map[kind];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px 3px 7px', borderRadius: 999,
      background: s.bg, color: s.fg,
      fontSize: 11.5, fontWeight: 600,
    }}>
      {s.icon}{s.label}
    </span>
  );
};

const NewTransmissionModal = ({ supplier, onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const [format, setFormat] = React.useState('csv-fournisseur');
  const stock = supplier.a_transmettre;
  const total = stock.or + stock.argent + stock.bronze;

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 560, padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '22px 26px 14px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Upload size={13}/>
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Préparer la transmission</span>
            </div>
            <h2 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>
              Transmettre à <span style={{ color: 'var(--burgundy-800)' }}>{supplier.name}</span>
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 4, marginBottom: 0 }}>
              {supplier.sub} · commandes des {supplier.producteurs} producteurs rattachés depuis la dernière transmission
            </p>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost" aria-label="Fermer">
            <Icon.X size={14}/>
          </button>
        </div>

        <div style={{ padding: '20px 26px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 10 }}>
            Médailles à inclure
          </div>
          <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 18 }}>
            {[
              { label: 'Or',     n: stock.or,     dot: '#d4a017', sub: 'nouvelles commandes' },
              { label: 'Argent', n: stock.argent, dot: '#94a3b8', sub: 'nouvelles commandes' },
              { label: 'Bronze', n: stock.bronze, dot: '#c2410c', sub: 'nouvelles commandes' },
            ].map((r, i, arr) => (
              <div key={r.label} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: r.dot }}/>
                <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)', flex: 1 }}>Médailles {r.label}</span>
                <span className="tnum display" style={{ fontSize: 18, fontWeight: 500 }}>{r.n}</span>
                <span style={{ fontSize: 11.5, color: 'var(--fg-muted)', minWidth: 130, textAlign: 'right' }}>{r.sub}</span>
              </div>
            ))}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px',
              background: 'var(--slate-50)',
              borderTop: '1px solid var(--border)',
            }}>
              <span style={{ width: 10, height: 10 }}/>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', flex: 1 }}>Total</span>
              <span className="tnum display" style={{ fontSize: 22, fontWeight: 500, color: 'var(--burgundy-800)' }}>{total}</span>
              <span style={{ fontSize: 11.5, color: 'var(--fg-muted)', minWidth: 130, textAlign: 'right' }}>médailles</span>
            </div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 10 }}>
            Format d'export
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { id: 'csv-fournisseur', label: `Format CSV — ${supplier.name}`, sub: 'Format impératif du fournisseur',          recommended: true },
              { id: 'xlsx',            label: 'Excel (XLSX)',                  sub: 'Copie pour archivage interne uniquement' },
            ].map(f => (
              <label key={f.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px',
                border: `1px solid ${format === f.id ? 'var(--burgundy-800)' : 'var(--border)'}`,
                background: format === f.id ? 'var(--burgundy-50)' : 'var(--surface)',
                borderRadius: 8,
                cursor: 'pointer',
              }}>
                <input
                  type="radio" name="fmt" checked={format === f.id} onChange={() => setFormat(f.id)}
                  style={{ accentColor: 'var(--burgundy-800)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>
                    {f.label}
                    {f.recommended && <span style={{
                      fontSize: 10, padding: '1px 6px', borderRadius: 4,
                      background: 'var(--burgundy-800)', color: '#fff',
                      fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
                    }}>Recommandé</span>}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 2 }}>{f.sub}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button className="btn btn-primary" onClick={onConfirm} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Download size={13}/> Générer et télécharger
          </button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, {
  AdminCommandesMedailles,
  AdminStocks,
  AdminTransmissions,
});
