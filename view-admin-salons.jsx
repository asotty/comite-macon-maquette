// ─── Salons & exposants : Événements / Inscriptions / Stands ───────

// Shared salon picker (compact)
const SalonPicker = ({ salons, value, onChange, label }) => {
  const [open, setOpen] = React.useState(false);
  const current = salons.find(s => s.id === value);
  const displayLabel = current ? current.label : (label || 'Sélectionner…');
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 10px', fontSize: 12.5, fontWeight: 500,
          border: '1px solid var(--border)', borderRadius: 8,
          background: 'var(--surface)', color: 'var(--fg-muted)',
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        {displayLabel}
        <Icon.ChevronDown size={13} style={{ color: 'var(--fg-muted)' }}/>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }}/>
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0,
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            minWidth: 280, zIndex: 60, overflow: 'hidden',
          }}>
            {salons.map(s => (
              <button key={s.id} onClick={() => { onChange(s.id); setOpen(false); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', border: 'none',
                background: s.id === value ? 'var(--burgundy-50)' : 'transparent',
                textAlign: 'left', cursor: 'pointer', fontSize: 13,
                color: s.id === value ? 'var(--burgundy-800)' : 'var(--fg)',
                fontWeight: s.id === value ? 600 : 500, fontFamily: 'inherit',
              }}>
                <span style={{ flex: 1 }}>{s.label}</span>
                {s.id === value && <Icon.Check size={13}/>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const SALONS = [
  { id: 'vins-2026',     label: 'Salon des Vins 2026',          short: 'Salon des Vins' },
  { id: 'plaisirs-2026', label: 'Marché des Plaisirs Gourmands 2026', short: 'Plaisirs Gourmands' },
  { id: 'vins-2025',     label: 'Salon des Vins 2025 (archive)', short: 'Salon des Vins 2025' },
];

// Uniquement les archives — utilisé dans le SalonPicker "Autres éditions"
const SALONS_ARCHIVES = [
  { id: 'vins-2025', label: 'Salon des Vins 2025 (archive)', short: 'Vins 2025' },
];

// Catégories produits du Marché des Plaisirs Gourmands (col. supplémentaire dans la liste inscriptions)
const CATEGORIES_MARCHE = [
  'Vins',
  'Alcools et spiritueux',
  'Champagne',
  'Charcuteries, fromages',
  'Foie gras',
  'Préparations culinaires',
  'Saveurs du monde',
  'Épicerie fine',
  'Chocolat, desserts, confiserie',
  'Boulangerie, pâtisserie',
  'Arts de la table',
  'Spécialités régionales',
  'Bière',
];

// ─── Page 1 — Événements ──────────────────────────────────────────

const AdminEvenements = () => {
  const [createModal, setCreateModal] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [rowMenu, setRowMenu] = React.useState(null);

  const EVENTS = [
    {
      id: 'vins-2026',
      title: 'Salon des Vins de Mâcon',
      icon: <Icon.Wine size={20}/>,
      bg: 'var(--burgundy-50)', fg: 'var(--burgundy-800)',
      dates: '14 → 16 novembre 2026',
      lieu: 'Parc des expositions de Mâcon',
      inscriptions: '01/06/2026 → 30/09/2026',
      status: 'inscriptions-ouvertes',
      stats: { exposants: 142, stands: 87, total: 120 },
    },
    {
      id: 'plaisirs-2026',
      title: 'Marché des Plaisirs Gourmands',
      icon: <Icon.Building size={20}/>,
      bg: '#fef3c7', fg: '#a16207',
      dates: '5 → 7 décembre 2026',
      lieu: 'Place Saint-Pierre, Mâcon',
      inscriptions: '01/09/2026 → 15/11/2026',
      status: 'brouillon',
      stats: { exposants: 0, stands: 0, total: 48 },
    },
    {
      id: 'vins-2025',
      title: 'Salon des Vins de Mâcon',
      icon: <Icon.Wine size={20}/>,
      bg: 'var(--slate-100)', fg: 'var(--slate-600)',
      dates: '15 → 17 novembre 2025',
      lieu: 'Parc des expositions de Mâcon',
      inscriptions: '01/06/2025 → 30/09/2025',
      status: 'archive',
      stats: { exposants: 138, stands: 118, total: 118 },
    },
  ];

  const openCreate = () => { setEditingId(null); setCreateModal(true); };
  const openEdit   = (id) => { setEditingId(id); setCreateModal(true); setRowMenu(null); };

  return (
    <div data-screen-label="admin-evenements">
      <PageHeader
        breadcrumb={['Administration', 'Salons & exposants', 'Événements']}
        title="Événements"
        subtitle={`${EVENTS.length} événements · ${EVENTS.filter(e => e.status === 'inscriptions-ouvertes').length} en cours d'inscription`}
        actions={<>
          <button className="btn btn-primary btn-sm" onClick={openCreate} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Plus size={14}/> Créer un salon
          </button>
        </>}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {EVENTS.map((e, idx) => (
          <div key={e.id} className="card" style={{
            padding: 0, overflow: 'hidden',
            opacity: e.status === 'archive' ? 0.75 : 1,
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 20, padding: '20px 22px', alignItems: 'flex-start' }}>
              {/* Icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: e.bg, color: e.fg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>{e.icon}</div>

              {/* Main */}
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h3 className="display" style={{ fontSize: 18, fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>{e.title}</h3>
                  <SalonStatusBadge kind={e.status}/>
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Icon.Calendar size={12} style={{ color: 'var(--fg-subtle)' }}/>
                    {e.dates}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Icon.Building size={12} style={{ color: 'var(--fg-subtle)' }}/>
                    {e.lieu}
                  </span>
                </div>
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: 24,
                  padding: '10px 14px',
                  background: 'var(--slate-50)', border: '1px solid var(--border)',
                  borderRadius: 8, fontSize: 12.5,
                }}>
                  <div>
                    <div style={{ color: 'var(--fg-subtle)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Inscriptions</div>
                    <div style={{ color: 'var(--fg)' }} className="tnum">{e.inscriptions}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--fg-subtle)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Exposants inscrits</div>
                    <div style={{ color: 'var(--fg)', fontWeight: 600 }} className="tnum">{e.stats.exposants}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--fg-subtle)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Stands attribués</div>
                    <div style={{ color: 'var(--fg)', fontWeight: 600 }} className="tnum">{e.stats.stands} / {e.stats.total}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
                {e.status !== 'brouillon' && e.status !== 'archive' && (
                  <button className="btn btn-outline btn-sm"><Icon.Users size={13}/> Gérer les inscriptions</button>
                )}
                {e.status === 'archive' ? (
                  <button className="btn btn-outline btn-sm"><Icon.Eye size={13}/> Consulter</button>
                ) : (
                  <button className="btn btn-outline btn-sm"><Icon.Map size={13}/> Plan des stands</button>
                )}
                <button className="btn btn-icon btn-sm btn-ghost" onClick={() => setRowMenu(rowMenu === idx ? null : idx)}>
                  <Icon.MoreH size={13}/>
                </button>
                {rowMenu === idx && (
                  <>
                    <div onClick={() => setRowMenu(null)} style={{ position: 'fixed', inset: 0, zIndex: 50 }}/>
                    <div style={{
                      position: 'absolute', top: 36, right: 0,
                      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      minWidth: 240, zIndex: 60, overflow: 'hidden', padding: '4px 0',
                    }}>
                      <CmdMenuItem icon={<Icon.Edit size={13}/>}      label="Modifier le salon"            onClick={() => openEdit(e.id)}/>
                      <CmdMenuItem icon={<Icon.Copy size={13}/>}      label="Dupliquer pour l'édition suivante" onClick={() => setRowMenu(null)}/>
                      <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }}/>
                      <CmdMenuItem icon={<Icon.Lock size={13}/>}      label={e.status === 'archive' ? 'Désarchiver' : 'Archiver'} onClick={() => setRowMenu(null)}/>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {createModal && (
        <SalonModal
          editing={editingId ? EVENTS.find(e => e.id === editingId) : null}
          onCancel={() => setCreateModal(false)}
          onConfirm={() => setCreateModal(false)}
        />
      )}
    </div>
  );
};

const SalonStatusBadge = ({ kind }) => {
  const map = {
    'brouillon':              { bg: 'var(--slate-100)', fg: 'var(--slate-700)', dot: 'var(--slate-400)', label: 'Brouillon' },
    'inscriptions-ouvertes':  { bg: '#dcfce7',          fg: '#166534',         dot: '#16a34a',         label: 'Inscriptions ouvertes' },
    'inscriptions-closes':    { bg: '#fef3c7',          fg: '#a16207',         dot: '#f59e0b',         label: 'Inscriptions closes' },
    'en-cours':               { bg: 'var(--burgundy-50)',fg: 'var(--burgundy-800)',dot: 'var(--burgundy-500)',label: 'En cours' },
    'termine':                { bg: 'var(--slate-100)', fg: 'var(--slate-700)', dot: 'var(--slate-500)', label: 'Terminé' },
    'archive':                { bg: 'transparent',      fg: 'var(--fg-muted)',  dot: 'var(--slate-400)', label: 'Archivé', outline: true },
  };
  const s = map[kind] || map.brouillon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px 3px 7px', borderRadius: 999,
      background: s.bg, color: s.fg,
      fontSize: 11.5, fontWeight: 600,
      border: s.outline ? '1px solid var(--border)' : 'none',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 999, background: s.dot }}/>
      {s.label}
    </span>
  );
};

// ─── Create / edit salon modal ────────────────────────────────────

const SalonModal = ({ editing, onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const [name, setName] = React.useState(editing?.title || '');
  const [type, setType] = React.useState(editing?.title?.includes('Plaisirs') ? 'plaisirs' : editing ? 'vins' : 'vins');

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 580, padding: 0, overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '22px 26px 14px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {editing ? <Icon.Edit size={13}/> : <Icon.Plus size={13}/>}
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>
                {editing ? 'Modifier' : 'Créer'} un événement
              </span>
            </div>
            <h2 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>
              {editing ? editing.title : 'Nouveau salon'}
            </h2>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost" aria-label="Fermer">
            <Icon.X size={14}/>
          </button>
        </div>

        <div style={{ padding: '20px 26px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label className="field" style={{ display: 'block' }}>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Nom du salon</span>
            <input className="input" placeholder="Ex. Salon des Vins de Mâcon" value={name} onChange={e => setName(e.target.value)}/>
          </label>

          <div>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Type</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {[
                { id: 'vins',     label: 'Salon des Vins',           icon: <Icon.Wine size={14}/> },
                { id: 'plaisirs', label: 'Marché des Plaisirs Gourmands', icon: <Icon.Building size={14}/> },
                { id: 'concours', label: 'Concours',                  icon: <Icon.Trophy size={14}/> },
                { id: 'autre',    label: 'Autre',                     icon: <Icon.Sparkles size={14}/> },
              ].map(t => (
                <label key={t.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '10px 12px',
                  border: `1px solid ${type === t.id ? 'var(--burgundy-800)' : 'var(--border)'}`,
                  background: type === t.id ? 'var(--burgundy-50)' : 'var(--surface)',
                  color: type === t.id ? 'var(--burgundy-800)' : 'var(--fg)',
                  borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                }}>
                  <input type="radio" name="t" checked={type === t.id} onChange={() => setType(t.id)} style={{ display: 'none' }}/>
                  {t.icon}{t.label}
                </label>
              ))}
            </div>
          </div>

          {type === 'concours' && (
            <label className="field" style={{ display: 'block' }}>
              <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>
                Concours lié <span style={{ color: '#dc2626' }}>*</span>
              </span>
              <select className="input" defaultValue="france-2026">
                <optgroup label="Concours des Grands Vins de France">
                  <option value="france-2026">Concours des Grands Vins de France 2026</option>
                  <option value="france-2025">Concours des Grands Vins de France 2025</option>
                  <option value="france-2024">Concours des Grands Vins de France 2024</option>
                </optgroup>
                <optgroup label="Concours des Grands Vins du Monde">
                  <option value="monde-2026">Concours des Grands Vins du Monde 2026</option>
                  <option value="monde-2025">Concours des Grands Vins du Monde 2025</option>
                </optgroup>
              </select>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon.Info size={11}/>
                Seuls les producteurs médaillés du concours sélectionné pourront s'inscrire comme exposants.
              </div>
            </label>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label className="field" style={{ display: 'block' }}>
              <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Du</span>
              <input className="input tnum" type="date" defaultValue={editing?.id === 'vins-2026' ? '2026-11-14' : ''}/>
            </label>
            <label className="field" style={{ display: 'block' }}>
              <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Au</span>
              <input className="input tnum" type="date" defaultValue={editing?.id === 'vins-2026' ? '2026-11-16' : ''}/>
            </label>
          </div>

          <label className="field" style={{ display: 'block' }}>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Lieu</span>
            <input className="input" placeholder="Ex. Parc des expositions de Mâcon" defaultValue={editing?.lieu || ''}/>
          </label>

          <div>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Période d'inscription</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input className="input tnum" type="date" placeholder="Ouverture"/>
              <input className="input tnum" type="date" placeholder="Clôture"/>
            </div>
          </div>

          <label className="field" style={{ display: 'block' }}>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Description <span style={{ color: 'var(--fg-subtle)', fontWeight: 400 }}>(affichée sur le formulaire d'inscription)</span></span>
            <textarea className="input textarea" rows={3} placeholder="Présentation du salon, conditions, attentes…"/>
          </label>
        </div>

        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <span style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>
            {editing ? 'Modification visible immédiatement' : 'Le salon sera créé en statut Brouillon'}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
            <button className="btn btn-primary" onClick={onConfirm} style={{ background: 'var(--burgundy-800)' }}>
              <Icon.Check size={14}/> {editing ? 'Enregistrer' : 'Créer le salon'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Page 2 — Inscriptions exposants ──────────────────────────────

// Wrappers exposés comme routes distinctes dans la nav (R11)
const AdminInscriptionsVins   = (props) => <AdminInscriptionsExposants salonId="vins-2026"     {...props}/>;
const AdminInscriptionsMarche = (props) => <AdminInscriptionsExposants salonId="plaisirs-2026" {...props}/>;

const AdminInscriptionsExposants = ({ salonId = 'vins-2026', onOpenDetail }) => {
  const [tab, setTab] = React.useState('toutes');
  const [rowMenu, setRowMenu] = React.useState(null);

  const counts = { toutes: 142, attente: 38, validees: 86, acompte: 64, soldees: 12, refusees: 2 };

  // Données Salon des Vins
  // [ref, exposant, ville, typeActivité, stand, acompteMontant, acompteStatus, soldeMontant, soldeStatus, statut, région, appellationsPrésentées]
  const ROWS_VINS = [
    ['INS-2026-0142', 'Domaine de la Chevalière',  'Mâcon',       'Viticulteur',         '12 m²', 240,  'paye',    360,  'attente', 'acompte', 'Mâconnais',        'Mâcon-Villages, Viré-Clessé'],
    ['INS-2026-0141', 'Maison Joseph Drouhin',     'Beaune',      'Viticulteur',         '18 m²', 360,  'paye',    540,  'paye',    'soldee',  'Côte de Beaune',   'Beaune, Meursault, Puligny-Montrachet'],
    ['INS-2026-0140', 'Fromagerie Lactobac',       'Charolles',   'Artisan alimentaire', '9 m²',  180,  'attente', 270,  'attente', 'attente', '—',                '—'],
    ['INS-2026-0139', 'Cellier du Roi',            'Tournus',     'Caviste',             '9 m²',  180,  'paye',    270,  'attente', 'acompte', 'Côte Chalonnaise', 'Mercurey, Rully, Givry'],
    ['INS-2026-0138', 'Maison Joannet',            'Cluny',       'Artisan alimentaire', '6 m²',  120,  'attente', 180,  'attente', 'attente', '—',                '—'],
    ['INS-2026-0137', 'Vignobles Lacroix',         'Mercurey',    'Viticulteur',         '12 m²', 240,  'paye',    360,  'paye',    'soldee',  'Côte Chalonnaise', 'Mercurey, Givry'],
    ['INS-2026-0136', 'Brasserie de Saône',        'Mâcon',       'Brasseur',            '9 m²',  180,  'attente', 270,  'attente', 'validee', '—',                '—'],
    ['INS-2026-0135', 'Domaine Sainte-Anne',       'Saint-Véran', 'Viticulteur',         '12 m²', 240,  'paye',    360,  'attente', 'acompte', 'Mâconnais',        'Saint-Véran, Pouilly-Fuissé'],
    ['INS-2026-0134', 'Boulangerie Le Levain',     'Mâcon',       'Artisan alimentaire', '6 m²',  120,  'attente', 180,  'attente', 'refusee', '—',                '—'],
    ['INS-2026-0133', 'Domaine Tabard',            'Brouilly',    'Viticulteur',         '9 m²',  180,  'paye',    270,  'attente', 'acompte', 'Beaujolais',       'Brouilly, Côte de Brouilly'],
  ];
  // Données Marché des Plaisirs Gourmands — même structure + [10] = catégorie produit
  const ROWS_MARCHE = [
    ['MPG-2026-0042', 'Fromagerie des Dombes',      'Châtillon-s-Chalaronne', 'Artisan alimentaire', '9 m²',  180, 'paye',    270, 'attente', 'acompte',  'Charcuteries, fromages'],
    ['MPG-2026-0041', 'Domaine des Pentes',         'Mâcon',                  'Viticulteur',         '12 m²', 240, 'paye',    360, 'paye',    'soldee',   'Vins'],
    ['MPG-2026-0040', 'Chocolaterie Berthier',      'Cluny',                  'Artisan alimentaire', '6 m²',  120, 'attente', 180, 'attente', 'attente',  'Chocolat, desserts, confiserie'],
    ['MPG-2026-0039', 'Brasserie du Vieux Moulin',  'Tournus',                'Brasseur',            '9 m²',  180, 'paye',    270, 'attente', 'acompte',  'Bière'],
    ['MPG-2026-0038', 'Maison Foie Gras Périgord',  'Bergerac',               'Artisan alimentaire', '12 m²', 240, 'paye',    360, 'attente', 'validee',  'Foie gras'],
    ['MPG-2026-0037', 'Épicerie du Terroir',        'Mâcon',                  'Artisan alimentaire', '6 m²',  120, 'attente', 180, 'attente', 'attente',  'Épicerie fine'],
    ['MPG-2026-0036', 'Champagne Gauthier',         'Épernay',                'Artisan alimentaire', '9 m²',  180, 'paye',    270, 'paye',    'soldee',   'Champagne'],
    ['MPG-2026-0035', 'Boulangerie Artisanale Roy', 'Mâcon',                  'Artisan alimentaire', '6 m²',  120, 'paye',    180, 'attente', 'acompte',  'Boulangerie, pâtisserie'],
    ['MPG-2026-0034', 'Distillerie Saveurs du Monde','Lyon',                  'Artisan alimentaire', '9 m²',  180, 'attente', 270, 'attente', 'attente',  'Saveurs du monde'],
    ['MPG-2026-0033', 'Art de la Table Lefèvre',    'Dijon',                  'Artisan alimentaire', '6 m²',  120, 'paye',    180, 'attente', 'refusee',  'Arts de la table'],
  ];
  const isMarche = salonId === 'plaisirs-2026';
  const ROWS = isMarche ? ROWS_MARCHE : ROWS_VINS;

  const filtered = ROWS.filter(r => {
    if (tab === 'toutes')   return true;
    if (tab === 'attente')  return r[9] === 'attente';
    if (tab === 'validees') return r[9] !== 'attente' && r[9] !== 'refusee';
    if (tab === 'acompte')  return r[6] === 'paye'   && r[8] !== 'paye';
    if (tab === 'soldees')  return r[8] === 'paye';
    if (tab === 'refusees') return r[9] === 'refusee';
    return true;
  });
  const paged = useSortablePaged(filtered, {
    defaultPageSize: 25,
    accessors: {
      ref: r => r[0], exposant: r => r[1], type: r => r[3],
      region: r => r[10] || '', appellations: r => r[11] || '', categorie: r => r[10] || '',
      stand: r => r[4], reglement: r => r[5], statut: r => r[9],
    },
  });

  const tabsDef = [
    { id: 'toutes',   label: 'Toutes',         count: counts.toutes },
    { id: 'attente',  label: 'En attente',     count: counts.attente },
    { id: 'validees', label: 'Validées',       count: counts.validees },
    { id: 'acompte',  label: 'Acompte payé',   count: counts.acompte },
    { id: 'soldees',  label: 'Soldées',        count: counts.soldees },
    { id: 'refusees', label: 'Refusées',       count: counts.refusees },
  ];

  return (
    <div data-screen-label="admin-inscriptions-exposants">
      <PageHeader
        breadcrumb={['Administration', 'Salons & exposants', isMarche ? 'Marché des Plaisirs Gourmands' : 'Salon des Vins']}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span>{isMarche ? 'Marché des Plaisirs Gourmands' : 'Salon des Vins de Mâcon'}</span>
            {/* Archives uniquement — éditions passées */}
            <SalonPicker
              salons={SALONS_ARCHIVES}
              value={null}
              onChange={() => {}}
              label="Autres éditions…"
            />
          </div>
        }
        subtitle="142 inscriptions · 38 en attente de validation"
        actions={<>
          <button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Export</button>
        </>}
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        <div className="input-with-icon" style={{ flex: 1, maxWidth: 340 }}>
          <Icon.Search size={14} className="input-icon"/>
          <input className="input" placeholder="N° inscription, exposant, ville…"/>
        </div>
        <button className="btn btn-outline btn-sm"><Icon.Filter size={13}/> Type d'activité</button>
        <button className="btn btn-outline btn-sm"><Icon.Map size={13}/> Région</button>
        {isMarche && (
          <button className="btn btn-outline btn-sm"><Icon.Filter size={13}/> Catégorie</button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, borderBottom: '1px solid var(--border)', marginBottom: 14, overflowX: 'auto' }}>
        {tabsDef.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '12px 0', border: 'none',
              borderBottom: active ? '2px solid var(--burgundy-800)' : '2px solid transparent',
              background: 'transparent',
              fontSize: 13, fontWeight: active ? 600 : 500,
              color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
              marginBottom: -1, fontFamily: 'inherit', whiteSpace: 'nowrap',
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

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <SortableTh sortKey="ref"      currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>N° Inscription</SortableTh>
              <SortableTh sortKey="exposant" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Exposant</SortableTh>
              <SortableTh sortKey="type"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Type activité</SortableTh>
              {isMarche && (
                <SortableTh sortKey="categorie"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Catégorie</SortableTh>
              )}
              {!isMarche && (
                <SortableTh sortKey="region"       currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Région</SortableTh>
              )}
              {!isMarche && (
                <SortableTh sortKey="appellations" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Appellations présentées</SortableTh>
              )}
              <SortableTh sortKey="stand"      currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Stand</SortableTh>
              <SortableTh sortKey="reglement"  currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Règlement</SortableTh>
              <SortableTh sortKey="statut"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Statut</SortableTh>
              <th style={{ width: 36 }}></th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.map((r, i) => (
              <tr key={i} onClick={() => onOpenDetail && onOpenDetail(r[0])} style={{ cursor: 'pointer' }}>
                <td style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', fontSize: 12.5, fontWeight: 500 }}>{r[0]}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{r[1]}</div>
                  {/* Ville affichée uniquement pour le Marché (le Salon des Vins a sa propre colonne Région) */}
                  {isMarche && <div className="muted" style={{ fontSize: 11.5, marginTop: 1 }}>{r[2]}</div>}
                </td>
                <td><ActiviteBadge type={r[3]}/></td>
                {isMarche && (
                  <td style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>{r[10] || '—'}</td>
                )}
                {!isMarche && (
                  <td style={{ fontSize: 12.5 }}>{r[10] || '—'}</td>
                )}
                {!isMarche && (
                  <td style={{ fontSize: 12, color: 'var(--fg-muted)', maxWidth: 200 }}>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r[11]}>
                      {r[11] || '—'}
                    </span>
                  </td>
                )}
                <td className="tnum">{r[4]}</td>
                {/* Acompte + solde fusionnés en une seule cellule Règlement */}
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 10.5, color: 'var(--fg-muted)', width: 52, flexShrink: 0 }}>Acompte</span>
                      <PaymentLine montant={r[5]} status={r[6]}/>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 10.5, color: 'var(--fg-muted)', width: 52, flexShrink: 0 }}>Solde</span>
                      <PaymentLine montant={r[7]} status={r[8]}/>
                    </div>
                  </div>
                </td>
                <td><InscriptionStatusBadge kind={r[9]}/></td>
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
                        minWidth: 260, zIndex: 60, overflow: 'hidden', padding: '4px 0',
                      }}>
                        <CmdMenuItem icon={<Icon.Eye size={13}/>}    label="Voir la demande"               onClick={() => { setRowMenu(null); onOpenDetail && onOpenDetail(r[0]); }}/>
                        {r[9] === 'attente' && (
                          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }}/>
                        )}
                        {r[9] === 'attente' && (
                          <CmdMenuItem icon={<Icon.Check size={13}/>}        label="Valider l'inscription" primary onClick={() => setRowMenu(null)}/>
                        )}
                        {r[9] === 'attente' && (
                          <CmdMenuItem icon={<Icon.Mail size={13}/>}         label="Demander des compléments"     onClick={() => setRowMenu(null)}/>
                        )}
                        {(r[6] === 'attente' || r[8] === 'attente') && r[9] !== 'refusee' && (
                          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }}/>
                        )}
                        {(r[6] === 'attente' || r[8] === 'attente') && r[9] !== 'refusee' && (
                          <CmdMenuItem icon={<Icon.Send size={13}/>}         label="Envoyer relance paiement"     onClick={() => setRowMenu(null)}/>
                        )}
                        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }}/>
                        <CmdMenuItem icon={<Icon.X size={13}/>} label="Refuser la demande" danger onClick={() => setRowMenu(null)}/>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination {...paged}/>
    </div>
  );
};

const ActiviteBadge = ({ type }) => {
  const map = {
    'Viticulteur':         { icon: <Icon.Wine size={11}/>,    fg: 'var(--burgundy-800)', bg: 'var(--burgundy-50)' },
    'Caviste':             { icon: <Icon.Wine size={11}/>,    fg: '#1e40af',            bg: '#eff6ff' },
    'Artisan alimentaire': { icon: <Icon.Building size={11}/>,fg: '#a16207',            bg: '#fef3c7' },
    'Brasseur':            { icon: <Icon.Building size={11}/>,fg: '#15803d',            bg: '#dcfce7' },
  };
  const s = map[type] || { icon: <Icon.Building size={11}/>, fg: 'var(--fg-muted)', bg: 'var(--slate-100)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px 3px 7px', borderRadius: 999,
      background: s.bg, color: s.fg,
      fontSize: 11.5, fontWeight: 500,
    }}>
      {s.icon}{type}
    </span>
  );
};

const PaymentLine = ({ montant, status }) => {
  const paid = status === 'paye';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span className="tnum" style={{ fontWeight: 500, color: 'var(--fg)' }}>{montant} €</span>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 7px', borderRadius: 999,
        background: paid ? '#dcfce7' : '#fef3c7',
        color: paid ? '#166534' : '#a16207',
        fontSize: 10.5, fontWeight: 600,
      }}>
        <span style={{ width: 5, height: 5, borderRadius: 999, background: paid ? '#16a34a' : '#f59e0b' }}/>
        {paid ? 'Payé' : 'En attente'}
      </span>
    </div>
  );
};

const InscriptionStatusBadge = ({ kind }) => {
  const map = {
    attente:  { bg: '#fef3c7',           fg: '#a16207',         dot: '#f59e0b', label: 'En attente' },
    validee:  { bg: '#eff6ff',           fg: '#1e40af',         dot: '#3b82f6', label: 'Validée' },
    acompte:  { bg: 'var(--burgundy-50)',fg: 'var(--burgundy-800)',dot: 'var(--burgundy-500)',label: 'Acompte payé' },
    soldee:   { bg: '#dcfce7',           fg: '#166534',         dot: '#16a34a', label: 'Soldée' },
    refusee:  { bg: '#fef2f2',           fg: '#991b1b',         dot: '#dc2626', label: 'Refusée' },
  };
  const s = map[kind] || map.attente;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px 3px 7px', borderRadius: 999,
      background: s.bg, color: s.fg,
      fontSize: 11.5, fontWeight: 600,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 999, background: s.dot }}/>
      {s.label}
    </span>
  );
};

// ─── Page 3 — Plan des stands ─────────────────────────────────────

const AdminPlanStands = () => {
  const [salonId, setSalonId] = React.useState('vins-2026');
  const [mode, setMode] = React.useState('plan'); // 'plan' | 'liste'
  const [selectedStand, setSelectedStand] = React.useState(null);

  // 40 stands data — generated as a hall floor plan
  // Each stand: {id, x, y, w, h, sqm, tarif, status, expo?}
  const STANDS = React.useMemo(() => {
    const data = [];
    let n = 1;
    // Row A — 9m² stands along top
    for (let i = 0; i < 10; i++) {
      data.push({
        id: `A${String(i+1).padStart(2,'0')}`,
        x: 40 + i * 72, y: 40, w: 64, h: 64,
        sqm: 9, tarif: 450,
      });
      n++;
    }
    // Row B — 12m² stands (slightly larger)
    for (let i = 0; i < 8; i++) {
      data.push({
        id: `B${String(i+1).padStart(2,'0')}`,
        x: 40 + i * 90, y: 140, w: 80, h: 70,
        sqm: 12, tarif: 600,
      });
    }
    // Row C — 18m² double stands
    for (let i = 0; i < 6; i++) {
      data.push({
        id: `C${String(i+1).padStart(2,'0')}`,
        x: 40 + i * 120, y: 240, w: 108, h: 80,
        sqm: 18, tarif: 900,
      });
    }
    // Row D — 6m² compact stands
    for (let i = 0; i < 8; i++) {
      data.push({
        id: `D${String(i+1).padStart(2,'0')}`,
        x: 40 + i * 90, y: 350, w: 80, h: 56,
        sqm: 6, tarif: 300,
      });
    }
    // Apply pseudo-random statuses + expo
    const expos = [
      'Domaine de la Chevalière', 'Maison Joseph Drouhin', 'Fromagerie Lactobac',
      'Cellier du Roi', 'Maison Joannet', 'Vignobles Lacroix', 'Brasserie de Saône',
      'Domaine Sainte-Anne', 'Domaine Tabard', 'Château de Pierreclos',
      'Domaine Bouchard Père', 'Vignerons de Buxy', 'Domaine des 3 Pierres',
      'Cellier de Solutré', 'Boulangerie Le Levain', 'Charcuterie Pichet',
    ];
    return data.map((s, idx) => {
      const r = (idx * 7 + 3) % 11;
      let status;
      if (r < 6) status = 'occupe';
      else if (r < 8) status = 'reserve';
      else if (r === 8) status = 'hors-service';
      else status = 'disponible';
      return {
        ...s,
        status,
        expo: (status === 'occupe' || status === 'reserve') ? expos[idx % expos.length] : null,
      };
    });
  }, []);

  const counts = STANDS.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});
  const totalAttribues = (counts.occupe || 0) + (counts.reserve || 0);

  return (
    <div data-screen-label="admin-plan-stands">
      <PageHeader
        breadcrumb={['Administration', 'Salons & exposants', 'Plan des stands']}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span>Plan des stands</span>
            <SalonPicker salons={SALONS} value={salonId} onChange={setSalonId}/>
          </div>
        }
        subtitle={`${totalAttribues} / ${STANDS.length} stands attribués`}
        actions={<>
          <div style={{
            display: 'inline-flex', padding: 3, gap: 2,
            background: 'var(--slate-100)', borderRadius: 8,
          }}>
            {[
              { id: 'liste', label: 'Liste', icon: <Icon.ListChecks size={13}/> },
              { id: 'plan',  label: 'Plan',  icon: <Icon.Map size={13}/> },
            ].map(m => (
              <button key={m.id} onClick={() => setMode(m.id)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', border: 'none',
                background: mode === m.id ? 'var(--surface)' : 'transparent',
                color: mode === m.id ? 'var(--fg)' : 'var(--fg-muted)',
                borderRadius: 6, cursor: 'pointer', fontSize: 12.5, fontWeight: 500,
                fontFamily: 'inherit',
                boxShadow: mode === m.id ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}>
                {m.icon}{m.label}
              </button>
            ))}
          </div>
          <button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Export</button>
        </>}
      />

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: '12px 16px', background: 'var(--slate-50)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 16, fontSize: 12 }}>
        {[
          { kind: 'disponible',  label: 'Disponible',  n: counts.disponible || 0  },
          { kind: 'reserve',     label: 'Réservé',     n: counts.reserve || 0     },
          { kind: 'occupe',      label: 'Occupé',      n: counts.occupe || 0      },
          { kind: 'hors-service',label: 'Hors service',n: counts['hors-service']||0},
        ].map(l => {
          const s = STAND_COLORS[l.kind];
          return (
            <span key={l.kind} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 14, height: 10, borderRadius: 3, background: s.fill, border: `1px solid ${s.stroke}` }}/>
              <span style={{ color: 'var(--fg)', fontWeight: 500 }}>{l.label}</span>
              <span className="tnum" style={{ color: 'var(--fg-muted)' }}>· {l.n}</span>
            </span>
          );
        })}
      </div>

      {mode === 'plan' ? (
        <StandsFloorPlan stands={STANDS} selected={selectedStand} onSelect={setSelectedStand}/>
      ) : (
        <StandsListView stands={STANDS}/>
      )}
    </div>
  );
};

const STAND_COLORS = {
  'disponible':   { fill: '#dcfce7',           stroke: '#86efac', text: '#166534', label: 'Disponible' },
  'reserve':      { fill: '#fef3c7',           stroke: '#fcd34d', text: '#a16207', label: 'Réservé' },
  'occupe':       { fill: 'var(--burgundy-50)',stroke: 'var(--burgundy-300)', text: 'var(--burgundy-800)', label: 'Occupé' },
  'hors-service': { fill: '#f1f5f9',           stroke: '#cbd5e1', text: '#64748b', label: 'Hors service' },
};

const StandsFloorPlan = ({ stands, selected, onSelect }) => {
  const W = 780, H = 460;
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ position: 'relative', background: 'var(--bg-app)' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block', maxHeight: 540 }}>
          {/* Hall outline */}
          <rect x={20} y={20} width={W - 40} height={H - 40} fill="var(--surface)" stroke="var(--border-strong)" strokeWidth={2} rx={4}/>

          {/* Aisle labels */}
          <text x={W/2} y={14} textAnchor="middle" fontSize={10} fill="var(--fg-subtle)" letterSpacing={2} fontFamily="ui-sans-serif, system-ui">ENTRÉE PRINCIPALE</text>
          <text x={W/2} y={H - 4} textAnchor="middle" fontSize={10} fill="var(--fg-subtle)" letterSpacing={2} fontFamily="ui-sans-serif, system-ui">FOND DU HALL</text>

          {/* Entry markers */}
          <rect x={W/2 - 60} y={18} width={120} height={4} fill="var(--burgundy-800)"/>

          {/* Row labels */}
          {[
            { y: 72,  label: 'RANG A — 9m²' },
            { y: 175, label: 'RANG B — 12m²' },
            { y: 280, label: 'RANG C — 18m²' },
            { y: 378, label: 'RANG D — 6m²' },
          ].map(r => (
            <text key={r.label} x={W - 28} y={r.y} textAnchor="end" fontSize={9} fill="var(--fg-subtle)" letterSpacing={1} fontFamily="ui-sans-serif, system-ui">{r.label}</text>
          ))}

          {/* Stands */}
          {stands.map(s => {
            const c = STAND_COLORS[s.status];
            const isSel = selected && selected.id === s.id;
            return (
              <g key={s.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(s)}>
                <rect
                  x={s.x} y={s.y} width={s.w} height={s.h} rx={4}
                  fill={c.fill}
                  stroke={isSel ? 'var(--burgundy-800)' : c.stroke}
                  strokeWidth={isSel ? 2.5 : 1.5}
                />
                <text x={s.x + s.w/2} y={s.y + s.h/2 - 4} textAnchor="middle" fontSize={11} fontWeight={600} fill={c.text} fontFamily="ui-sans-serif, system-ui">
                  {s.id}
                </text>
                <text x={s.x + s.w/2} y={s.y + s.h/2 + 10} textAnchor="middle" fontSize={9} fill={c.text} opacity={0.7} fontFamily="ui-sans-serif, system-ui">
                  {s.sqm}m²
                </text>
              </g>
            );
          })}
        </svg>

        {/* Popover */}
        {selected && (
          <>
            <div onClick={() => onSelect(null)} style={{ position: 'absolute', inset: 0, zIndex: 1 }}/>
            <div style={{
              position: 'absolute',
              left: `${Math.min(85, (selected.x + selected.w + 8) / W * 100)}%`,
              top:  `${(selected.y) / H * 100}%`,
              transform: (selected.x + selected.w + 240) > W ? `translateX(calc(-100% - ${selected.w + 16}px))` : 'none',
              minWidth: 240, zIndex: 2,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              boxShadow: '0 12px 32px rgba(15,23,42,0.12)',
              padding: 0, overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '12px 14px 8px' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Stand</div>
                  <div className="display" style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em' }}>{selected.id}</div>
                </div>
                <button onClick={() => onSelect(null)} className="btn btn-icon btn-sm btn-ghost" aria-label="Fermer">
                  <Icon.X size={12}/>
                </button>
              </div>
              <div style={{ padding: '0 14px 12px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
                <PopoverRow label="Superficie" value={<span className="tnum">{selected.sqm} m²</span>}/>
                <PopoverRow label="Tarif"      value={<span className="tnum">{selected.tarif} €</span>}/>
                <PopoverRow label="Statut"     value={<StandStatusBadge kind={selected.status}/>}/>
                {selected.expo && <PopoverRow label="Exposant" value={<span style={{ fontWeight: 500 }}>{selected.expo}</span>}/>}
              </div>
              <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', background: 'var(--slate-50)', display: 'flex', gap: 6 }}>
                {selected.status === 'disponible' && (
                  <button className="btn btn-primary btn-sm" style={{ flex: 1, background: 'var(--burgundy-800)' }}>
                    <Icon.Plus size={12}/> Attribuer
                  </button>
                )}
                {selected.status === 'reserve' && (
                  <button className="btn btn-primary btn-sm" style={{ flex: 1, background: 'var(--burgundy-800)' }}>
                    <Icon.Check size={12}/> Confirmer occupation
                  </button>
                )}
                {selected.status === 'occupe' && (
                  <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                    <Icon.Eye size={12}/> Voir l'exposant
                  </button>
                )}
                {selected.status === 'hors-service' && (
                  <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                    <Icon.Refresh size={12}/> Remettre en service
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const PopoverRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
    <span style={{ color: 'var(--fg-muted)' }}>{label}</span>
    <span style={{ color: 'var(--fg)' }}>{value}</span>
  </div>
);

const StandStatusBadge = ({ kind }) => {
  const c = STAND_COLORS[kind];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 999,
      background: c.fill, color: c.text,
      border: `1px solid ${c.stroke}`,
      fontSize: 11, fontWeight: 600,
    }}>
      {c.label}
    </span>
  );
};

const StandsListView = ({ stands }) => {
  const [rowMenu, setRowMenu] = React.useState(null);
  const paged = useSortablePaged(stands, {
    defaultPageSize: 25,
    accessors: {
      id: s => s.id, sqm: s => s.sqm, tarif: s => s.tarif,
      expo: s => s.expo || '', statut: s => s.status,
    },
  });
  return (
    <div>
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <SortableTh sortKey="id"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>N° Stand</SortableTh>
            <SortableTh sortKey="sqm"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Superficie</SortableTh>
            <SortableTh sortKey="tarif"  currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Tarif</SortableTh>
            <SortableTh sortKey="expo"   currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Exposant attribué</SortableTh>
            <SortableTh sortKey="statut" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Statut</SortableTh>
            <th style={{ width: 36 }}></th>
          </tr>
        </thead>
        <tbody>
          {paged.rows.map((s, i) => (
            <tr key={s.id}>
              <td style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', fontSize: 13, fontWeight: 600 }}>{s.id}</td>
              <td className="num tnum">{s.sqm} m²</td>
              <td className="num tnum">{s.tarif} €</td>
              <td>
                {s.expo
                  ? <span style={{ fontWeight: 500 }}>{s.expo}</span>
                  : <span className="subtle" style={{ fontStyle: 'italic' }}>—</span>}
              </td>
              <td><StandStatusBadge kind={s.status}/></td>
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
                      {s.status === 'occupe' && (
                        <CmdMenuItem icon={<Icon.Eye size={13}/>} label="Voir l'exposant" onClick={() => setRowMenu(null)}/>
                      )}
                      {s.status === 'occupe' && (
                        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }}/>
                      )}
                      {(s.status === 'disponible' || s.status === 'reserve' || s.status === 'occupe') && (
                        <CmdMenuItem
                          icon={s.status === 'disponible' ? <Icon.Plus size={13}/> : <Icon.Edit size={13}/>}
                          label={s.status === 'occupe' ? 'Réattribuer à un exposant' : 'Attribuer à un exposant'}
                          primary={s.status === 'disponible'}
                          onClick={() => setRowMenu(null)}
                        />
                      )}
                      {s.status === 'reserve' && (
                        <CmdMenuItem icon={<Icon.Check size={13}/>} label="Confirmer l'occupation" primary onClick={() => setRowMenu(null)}/>
                      )}
                      {s.status === 'hors-service' && (
                        <CmdMenuItem icon={<Icon.Refresh size={13}/>} label="Remettre en service" primary onClick={() => setRowMenu(null)}/>
                      )}
                      <CmdMenuItem icon={<Icon.Edit size={13}/>} label="Modifier le stand" onClick={() => setRowMenu(null)}/>
                      {s.status !== 'hors-service' && (
                        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }}/>
                      )}
                      {s.status !== 'hors-service' && (
                        <CmdMenuItem icon={<Icon.AlertTriangle size={13}/>} label="Marquer hors service" danger onClick={() => setRowMenu(null)}/>
                      )}
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <TablePagination {...paged}/>
    </div>
  );
};

Object.assign(window, {
  AdminEvenements,
  AdminInscriptionsExposants,
  AdminInscriptionsVins,
  AdminInscriptionsMarche,
  AdminPlanStands,
});
