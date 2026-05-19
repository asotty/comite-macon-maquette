// Admin · Dérogations — vue globale toutes inscriptions confondues
// Clic ligne → redirige vers la fiche inscription, tab Dérogation pré-ouvert.

const AdminDerogations = ({ concours = 'France', onOpenDossier }) => {
  const [tab, setTab] = React.useState('en-attente');

  const ROWS = [
    ['DER-2026-0032', 'Marie Dupont',              'Domaine de la Chevalière',  'Mâconnais',         'Document manquant',      'INS-2026-0184', '10/04/2026 à 09h15', 'pending'],
    ['DER-2026-0031', 'Jean Moreau',               'Château Pied-de-Rieux',     'Beaujolais',        'Dépôt hors délai',       'INS-2026-0183', '09/04/2026 à 17h42', 'pending'],
    ['DER-2026-0030', 'Sophie Granger',            'Maison Joseph Drouhin',     'Côte de Beaune',    'Dépassement de volume',  'INS-2026-0182', '09/04/2026 à 14h08', 'pending'],
    ['DER-2026-0029', 'Pierre Lacombe',            'Vignobles Lacroix',         'Côte Chalonnaise',  'Document manquant',      'INS-2026-0178', '08/04/2026 à 11h30', 'pending'],
    ['DER-2026-0028', 'Marie Dupont',              'Domaine de la Chevalière',  'Mâconnais',         'Dépassement de volume',  'INS-2026-0184', '08/04/2026 à 14h22', 'granted'],
    ['DER-2026-0027', 'Antoine Verger',            'Domaine Tabard',            'Beaujolais',        'Autre',                  'INS-2026-0179', '07/04/2026 à 16h05', 'refused'],
    ['DER-2026-0026', 'Camille Rocher',            'Château de Pierreclos',     'Mâconnais',         'Document manquant',      'INS-2026-0176', '06/04/2026 à 10h18', 'granted'],
    ['DER-2026-0025', 'Lucie Bernard',             'Cellier de Solutré',        'Mâconnais',         'Dépôt hors délai',       'INS-2026-0180', '05/04/2026 à 09h44', 'granted'],
  ];

  const counts = { pending: 8, granted: 24, refused: 6, all: 38 };
  const tabsDef = [
    { id: 'en-attente', label: 'En attente', count: counts.pending, filter: 'pending' },
    { id: 'accordees',  label: 'Accordées',  count: counts.granted, filter: 'granted' },
    { id: 'refusees',   label: 'Refusées',   count: counts.refused, filter: 'refused' },
    { id: 'toutes',     label: 'Toutes',     count: counts.all,     filter: null },
  ];
  const active = tabsDef.find(t => t.id === tab);
  const filteredRows = active.filter ? ROWS.filter(r => r[7] === active.filter) : ROWS;
  const paged = useSortablePaged(filteredRows, {
    defaultPageSize: 25,
    accessors: {
      ref: r => r[0], producteur: r => r[2], region: r => r[3],
      type: r => r[4], ins: r => r[5], date: r => r[6], statut: r => r[7],
    },
  });
  const rows = paged.rows;

  const openDossier = (insRef) => onOpenDossier && onOpenDossier(insRef, 'derogations');

  return (
    <div data-screen-label="admin-derogations">
      <PageHeader
        title="Dérogations"
        subtitle={`Concours ${concours} 2026 · ${counts.pending} dérogations en attente`}
        breadcrumb={['Administration', `Concours ${concours}`, 'Dérogations']}
        actions={<button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Export</button>}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, borderBottom: '1px solid var(--border)', marginBottom: 18 }}>
        {tabsDef.map(t => {
          const isActive = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '12px 0', border: 'none',
              borderBottom: isActive ? '2px solid var(--burgundy-800)' : '2px solid transparent',
              background: 'transparent', fontSize: 13.5, fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--burgundy-800)' : 'var(--fg-muted)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: -1, fontFamily: 'inherit',
            }}>
              {t.label}
              <span style={{
                fontSize: 11, padding: '0 6px', borderRadius: 999,
                background: isActive ? 'var(--burgundy-50)' : 'var(--slate-100)',
                color: isActive ? 'var(--burgundy-800)' : 'var(--fg-muted)', fontWeight: 500,
              }}>{t.count}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <div className="input-with-icon" style={{ flex: 1, maxWidth: 340 }}>
          <Icon.Search size={14} className="input-icon"/>
          <input className="input" placeholder="Rechercher producteur, n° dérogation…"/>
        </div>
        <button className="btn btn-outline btn-sm"><Icon.Filter size={13}/> Type</button>
        <button className="btn btn-outline btn-sm"><Icon.Calendar size={13}/> Période</button>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>Tri : <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>Date ↓</strong></span>
      </div>

      {/* Empty state */}
      {tab === 'en-attente' && rows.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 999, background: '#dcfce7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#166534', marginBottom: 14 }}>
            <Icon.Check size={22}/>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)', marginBottom: 6 }}>Aucune dérogation en attente</div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Toutes les demandes ont été traitées.</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <SortableTh sortKey="ref"        currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>N° dérogation</SortableTh>
                <SortableTh sortKey="producteur" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Producteur</SortableTh>
                <SortableTh sortKey="type"       currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Type</SortableTh>
                <SortableTh sortKey="ins"        currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Inscription</SortableTh>
                <SortableTh sortKey="date"       currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Demandée le</SortableTh>
                <SortableTh sortKey="statut"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Statut</SortableTh>
                <th style={{ width: 36 }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <DerogRow key={r[0]} r={r} onOpenDossier={openDossier}/>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TablePagination {...paged}/>
    </div>
  );
};

const DerogRow = ({ r, onOpenDossier }) => {
  const [menu, setMenu] = React.useState(false);
  const insRef = r[5];

  return (
    <tr style={{ cursor: 'pointer' }} onClick={() => onOpenDossier(insRef)}>
      <td onClick={e => { e.stopPropagation(); onOpenDossier(insRef); }}>
        <code style={{ fontSize: 12, color: 'var(--burgundy-800)', fontFamily: 'Menlo, monospace', fontWeight: 600 }}>{r[0]}</code>
      </td>
      <td>
        <div style={{ fontWeight: 500, color: 'var(--fg)' }}>{r[2]}</div>
        <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>{r[1]} · {r[3]}</div>
      </td>
      <td className="muted">{r[4]}</td>
      <td onClick={e => { e.stopPropagation(); onOpenDossier(insRef); }}>
        <code style={{ fontSize: 12, color: 'var(--burgundy-800)', fontFamily: 'Menlo, monospace' }}>{insRef}</code>
      </td>
      <td className="muted">{r[6]}</td>
      <td><DerogStatusBadgeGlobal status={r[7]}/></td>
      <td onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
        <button className="btn btn-icon btn-sm btn-ghost" onClick={() => setMenu(o => !o)}><Icon.MoreH size={13}/></button>
        {menu && (
          <>
            <div onClick={() => setMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }}/>
            <div style={{
              position: 'absolute', top: 32, right: 8,
              background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)', minWidth: 200, zIndex: 60, overflow: 'hidden', padding: '4px 0',
            }}>
              <DerogMenuItem icon={<Icon.Eye size={13}/>} label="Voir le dossier" onClick={() => { setMenu(false); onOpenDossier(insRef); }}/>
              {r[7] === 'pending' && (
                <>
                  <DerogMenuItem icon={<Icon.Check size={13}/>} label="Accorder" onClick={() => { setMenu(false); onOpenDossier(insRef); }}/>
                  <DerogMenuItem icon={<Icon.X size={13}/>}     label="Refuser"  onClick={() => { setMenu(false); onOpenDossier(insRef); }} danger/>
                </>
              )}
            </div>
          </>
        )}
      </td>
    </tr>
  );
};

const DerogMenuItem = ({ icon, label, onClick, danger }) => (
  <button onClick={onClick} style={{
    width: '100%', display: 'flex', alignItems: 'center', gap: 9,
    padding: '8px 14px', border: 'none', background: 'transparent',
    textAlign: 'left', cursor: 'pointer', fontSize: 12.5,
    color: danger ? '#991b1b' : 'var(--fg)', fontFamily: 'inherit',
  }}
  onMouseEnter={e => e.currentTarget.style.background = danger ? '#fef2f2' : 'var(--slate-50)'}
  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >
    <span style={{ color: danger ? '#991b1b' : 'var(--fg-muted)', display: 'inline-flex' }}>{icon}</span>
    {label}
  </button>
);

const DerogStatusBadgeGlobal = ({ status }) => {
  const map = {
    pending: { bg: '#fef3c7', fg: '#78350f', label: 'En attente', icon: <Icon.Clock size={11}/> },
    granted: { bg: '#dcfce7', fg: '#166534', label: 'Accordée',  icon: <Icon.Check size={11}/> },
    refused: { bg: '#fee2e2', fg: '#991b1b', label: 'Refusée',   icon: <Icon.X     size={11}/> },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 9px', borderRadius: 999, background: s.bg, color: s.fg,
      fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap',
    }}>{s.icon} {s.label}</span>
  );
};

Object.assign(window, { AdminDerogations });
