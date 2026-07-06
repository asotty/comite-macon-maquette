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

// ─── Métadonnées partagées par salon ─────────────────────────────
const SALON_META = {
  'vins-2026': {
    label: 'Salon des Vins de Mâcon 2026', short: 'Salon des Vins',
    icon: <Icon.Wine size={20}/>, bg: 'var(--burgundy-50)', fg: 'var(--burgundy-800)',
    dates: '14 → 16 novembre 2026', lieu: 'Parc des expositions de Mâcon',
    inscriptions: '01/06/2026 → 30/09/2026', status: 'inscriptions-ouvertes',
    stats: { exposants: 142, stands: 87, total: 120, sqm: 940, sqmTotal: 1296 },
  },
  'plaisirs-2026': {
    label: 'Marché des Plaisirs Gourmands 2026', short: 'Marché des Plaisirs Gourmands',
    icon: <Icon.ShoppingCart size={20}/>, bg: '#fef3c7', fg: '#a16207',
    dates: '5 → 7 décembre 2026', lieu: 'Place Saint-Pierre, Mâcon',
    inscriptions: '01/09/2026 → 15/11/2026', status: 'brouillon',
    stats: { exposants: 0, stands: 0, total: 48, sqm: 0, sqmTotal: 576 },
  },
};

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
      stats: { exposants: 142, stands: 87, total: 120, sqm: 940, sqmTotal: 1296 },
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
      stats: { exposants: 0, stands: 0, total: 48, sqm: 0, sqmTotal: 576 },
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
      stats: { exposants: 138, stands: 118, total: 118, sqm: 1274, sqmTotal: 1274 },
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
                  <div>
                    <div style={{ color: 'var(--fg-subtle)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Surface attribuée</div>
                    <div style={{ color: 'var(--fg)', fontWeight: 600 }} className="tnum">{e.stats.sqm.toLocaleString('fr-FR')} / {e.stats.sqmTotal.toLocaleString('fr-FR')} m²</div>
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

const AdminPlanStands = ({ defaultSalonId = 'vins-2026' }) => {
  const [salonId, setSalonId] = React.useState(defaultSalonId);
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

// ─── Page 4 — Règlement & Codes promo ────────────────────────────────

const ECHEANCIERS_DEMO = [
  { id: 1, ref: 'INS-2026-0142', exposant: 'Domaine de la Chevalière',  salon: 'Salon des Vins 2026', totalTTC: 600,
    echeances: [
      { label: 'Acompte',     date: '2026-03-01', montant: 150, statut: 'paye'    },
      { label: 'Versement 2', date: '2026-07-15', montant: 150, statut: 'attente' },
      { label: 'Solde',       date: '2026-10-15', montant: 300, statut: 'attente' },
    ],
  },
  { id: 2, ref: 'INS-2026-0139', exposant: 'Cellier du Roi',            salon: 'Salon des Vins 2026', totalTTC: 450,
    echeances: [
      { label: 'Acompte 20 %', date: '2026-02-01', montant: 90,  statut: 'paye'    },
      { label: 'Solde 80 %',   date: '2026-09-01', montant: 360, statut: 'attente' },
    ],
  },
  { id: 3, ref: 'MPG-2026-0042', exposant: 'Fromagerie des Dombes',     salon: 'Marché des Plaisirs 2026', totalTTC: 540,
    echeances: [
      { label: 'Acompte 50 %', date: '2026-05-01', montant: 270, statut: 'paye'    },
      { label: 'Solde 50 %',   date: '2026-11-01', montant: 270, statut: 'attente' },
    ],
  },
];

const CODES_PROMO_DEMO = [
  { id: 1, code: 'FIDELIO2026',  exposant: 'Maison Joseph Drouhin',    remiseType: 'pct', remise: 15, expiration: '2026-09-30', actif: true,  utilise: true,  ref: 'INS-2026-0141' },
  { id: 2, code: 'BIENVENUE10',  exposant: 'Fromagerie Lactobac',      remiseType: 'pct', remise: 10, expiration: '2026-08-31', actif: true,  utilise: false, ref: null            },
  { id: 3, code: 'STANDVIP',     exposant: 'Domaine Sainte-Anne',      remiseType: 'eur', remise: 80, expiration: '2026-07-15', actif: false, utilise: false, ref: null            },
  { id: 4, code: 'PREMIER25',    exposant: 'Brasserie de Saône',       remiseType: 'pct', remise: 25, expiration: '2026-10-01', actif: true,  utilise: false, ref: null            },
  { id: 5, code: 'PARTENAIRE50', exposant: 'Domaine Tabard',           remiseType: 'eur', remise: 50, expiration: '2026-10-31', actif: true,  utilise: true,  ref: 'INS-2026-0133' },
];

const EXPOSANTS_LISTE = [
  'Domaine de la Chevalière', 'Maison Joseph Drouhin', 'Fromagerie Lactobac',
  'Cellier du Roi', 'Maison Joannet', 'Vignobles Lacroix', 'Brasserie de Saône',
  'Domaine Sainte-Anne', 'Domaine Tabard', 'Fromagerie des Dombes',
  'Champagne Gauthier', 'Chocolaterie Berthier', 'Brasserie du Vieux Moulin',
];

// ── Modal échéancier ─────────────────────────────────────────────────
const EcheancierModal = ({ item, onClose }) => {
  const [exposant, setExposant]   = React.useState(item?.exposant || '');
  const [salon,    setSalon]      = React.useState(item?.salon    || 'Salon des Vins 2026');
  const [total,    setTotal]      = React.useState(item?.totalTTC || 600);
  const initLines = () => item?.echeances
    ? item.echeances.map((e, i) => ({ ...e, id: i }))
    : [
        { id: 0, label: 'Acompte',  date: '', montant: Math.round(total * 0.4), statut: 'attente' },
        { id: 1, label: 'Solde',    date: '', montant: Math.round(total * 0.6), statut: 'attente' },
      ];
  const [lines, setLines] = React.useState(initLines);
  const nextId = React.useRef(lines.length);

  const addLine = () => {
    setLines(l => [...l, { id: nextId.current++, label: `Versement ${l.length + 1}`, date: '', montant: 0, statut: 'attente' }]);
  };
  const removeLine = (id) => setLines(l => l.filter(x => x.id !== id));
  const setLine = (id, k, v) => setLines(l => l.map(x => x.id === id ? { ...x, [k]: v } : x));

  const sumMontants = lines.reduce((a, l) => a + (parseFloat(l.montant) || 0), 0);
  const diff = total - sumMontants;
  const valid = exposant && lines.length > 0 && Math.abs(diff) < 0.01;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--surface)', borderRadius: 14, boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 580, maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.CreditCard size={16}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.015em' }}>{item ? 'Modifier l\'échéancier' : 'Créer un échéancier'}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 1 }}>Paiement personnalisé par exposant</div>
          </div>
          <button onClick={onClose} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 22px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Exposant + salon */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label className="field-label">Exposant *</label>
              <select className="input" value={exposant} onChange={e => setExposant(e.target.value)}>
                <option value="">Sélectionner…</option>
                {EXPOSANTS_LISTE.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Salon</label>
              <select className="input" value={salon} onChange={e => setSalon(e.target.value)}>
                {SALONS.map(s => <option key={s.id} value={s.label}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div className="field" style={{ maxWidth: 160 }}>
            <label className="field-label">Total TTC (€)</label>
            <input className="input tnum" type="number" value={total} onChange={e => setTotal(parseFloat(e.target.value) || 0)}/>
          </div>

          {/* Échéances */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg-subtle)', marginBottom: 10 }}>Échéances</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {lines.map((l, i) => (
                <div key={l.id} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 110px 100px auto', gap: 8, alignItems: 'center' }}>
                  <input className="input" value={l.label} onChange={e => setLine(l.id, 'label', e.target.value)} placeholder={`Échéance ${i+1}`}/>
                  <input className="input tnum" type="date" value={l.date} onChange={e => setLine(l.id, 'date', e.target.value)}/>
                  <input className="input tnum" type="number" value={l.montant} onChange={e => setLine(l.id, 'montant', e.target.value)} placeholder="Montant €"/>
                  <select className="input" value={l.statut} onChange={e => setLine(l.id, 'statut', e.target.value)}>
                    <option value="attente">En attente</option>
                    <option value="paye">Payé</option>
                  </select>
                  <button onClick={() => removeLine(l.id)} className="btn btn-icon btn-sm btn-ghost" disabled={lines.length <= 1} style={{ color: 'var(--danger)', opacity: lines.length <= 1 ? 0.3 : 1 }}>
                    <Icon.Trash size={13}/>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addLine} className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>
              <Icon.Plus size={13}/> Ajouter une échéance
            </button>

            {/* Résumé */}
            <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: Math.abs(diff) < 0.01 ? '#f0fdf4' : '#fef3c7', border: `1px solid ${Math.abs(diff) < 0.01 ? '#bbf7d0' : '#fde68a'}`, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--fg-muted)' }}>Total planifié</span>
              <span style={{ fontWeight: 600, color: Math.abs(diff) < 0.01 ? '#166534' : '#92400e' }} className="tnum">
                {sumMontants.toFixed(2)} € / {total.toFixed(2)} €
                {Math.abs(diff) >= 0.01 && <span style={{ marginLeft: 8, fontSize: 11.5 }}>({diff > 0 ? `−${diff.toFixed(2)} € non planifié` : `+${Math.abs(diff).toFixed(2)} € en trop`})</span>}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 22px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8, background: 'var(--slate-50)', borderRadius: '0 0 14px 14px' }}>
          <button onClick={onClose} className="btn btn-outline">Annuler</button>
          <button onClick={onClose} disabled={!valid} className="btn btn-primary" style={{ background: 'var(--burgundy-800)', opacity: valid ? 1 : 0.5 }}>
            <Icon.Check size={14}/> {item ? 'Enregistrer' : 'Créer l\'échéancier'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Modal code promo ─────────────────────────────────────────────────
const genCode = () => {
  const words = ['BIENVENUE', 'FIDELIO', 'VIPEXPO', 'PARTENAIRE', 'EARLY', 'PREMIER', 'WELCOME'];
  const n = Math.floor(Math.abs(Math.sin(Date.now ? 42 : 42) * 900) + 10);
  return words[Math.floor(Math.abs(Math.sin(42) * words.length))] + n;
};

const CodePromoModal = ({ item, onClose }) => {
  const [code,       setCode]      = React.useState(item?.code      || genCode());
  const [exposant,   setExposant]  = React.useState(item?.exposant  || '');
  const [remiseType, setRemType]   = React.useState(item?.remiseType || 'pct');
  const [remise,     setRemise]    = React.useState(item?.remise    || 10);
  const [expiration, setExp]       = React.useState(item?.expiration || '');
  const [usage,      setUsage]     = React.useState('unique');
  const [actif,      setActif]     = React.useState(item?.actif !== undefined ? item.actif : true);

  const valid = code.trim() && exposant;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--surface)', borderRadius: 14, boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: '#fef3c7', color: '#a16207', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.Tag size={16}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.015em' }}>{item ? 'Modifier le code promo' : 'Créer un code promo'}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 1 }}>Code lié à un exposant précis</div>
          </div>
          <button onClick={onClose} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Code */}
          <div className="field">
            <label className="field-label">Code promo *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input tnum" value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="EX: BIENVENUE10" style={{ flex: 1, fontWeight: 600, letterSpacing: '0.05em' }}/>
              <button onClick={() => setCode(genCode())} className="btn btn-outline btn-sm" title="Générer automatiquement">
                <Icon.Refresh size={13}/>
              </button>
            </div>
          </div>

          {/* Exposant lié */}
          <div className="field">
            <label className="field-label">Exposant lié *</label>
            <select className="input" value={exposant} onChange={e => setExposant(e.target.value)}>
              <option value="">Sélectionner un exposant…</option>
              {EXPOSANTS_LISTE.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon.Info size={11}/> Le code ne fonctionnera que pour cet exposant.
            </div>
          </div>

          {/* Remise */}
          <div>
            <div className="field-label" style={{ marginBottom: 8 }}>Remise *</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[{ v: 'pct', label: '% remise' }, { v: 'eur', label: '€ fixe' }].map(opt => (
                  <button key={opt.v} onClick={() => setRemType(opt.v)} style={{
                    padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12.5, fontWeight: 500,
                    border: `1.5px solid ${remiseType === opt.v ? 'var(--burgundy-800)' : 'var(--border)'}`,
                    background: remiseType === opt.v ? 'var(--burgundy-50)' : 'var(--surface)',
                    color: remiseType === opt.v ? 'var(--burgundy-800)' : 'var(--fg-muted)',
                  }}>
                    {opt.label}
                  </button>
                ))}
              </div>
              <input className="input tnum" type="number" min={0} max={remiseType === 'pct' ? 100 : undefined}
                value={remise} onChange={e => setRemise(parseFloat(e.target.value) || 0)}
                style={{ width: 90 }}/>
              <span style={{ fontSize: 13, color: 'var(--fg-muted)', fontWeight: 500 }}>{remiseType === 'pct' ? '%' : '€'}</span>
              {/* Aperçu */}
              <span style={{ marginLeft: 8, padding: '4px 10px', borderRadius: 7, background: '#fef3c7', color: '#92400e', fontSize: 12, fontWeight: 700, letterSpacing: '0.03em' }}>
                {remiseType === 'pct' ? `−${remise} %` : `−${remise} €`}
              </span>
            </div>
          </div>

          {/* Expiration + usage */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label className="field-label">Date d'expiration</label>
              <input className="input tnum" type="date" value={expiration} onChange={e => setExp(e.target.value)}/>
            </div>
            <div className="field">
              <label className="field-label">Usage</label>
              <select className="input" value={usage} onChange={e => setUsage(e.target.value)}>
                <option value="unique">Usage unique</option>
                <option value="multiple">Usage multiple</option>
              </select>
            </div>
          </div>

          {/* Actif toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--slate-50)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Code actif</span>
            <button onClick={() => setActif(a => !a)} style={{
              width: 40, height: 22, borderRadius: 11, cursor: 'pointer', border: 'none',
              background: actif ? 'var(--burgundy-800)' : 'var(--slate-300)',
              position: 'relative', transition: 'background .2s',
            }}>
              <div style={{ position: 'absolute', top: 3, left: actif ? 20 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}/>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 22px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8, background: 'var(--slate-50)', borderRadius: '0 0 14px 14px' }}>
          <button onClick={onClose} className="btn btn-outline">Annuler</button>
          <button onClick={onClose} disabled={!valid} className="btn btn-primary" style={{ background: 'var(--burgundy-800)', opacity: valid ? 1 : 0.5 }}>
            <Icon.Check size={14}/> {item ? 'Enregistrer' : 'Créer le code'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Page principale ──────────────────────────────────────────────────
const AdminReglementSalon = ({ defaultSalon = null }) => {
  const [tab, setTab]                = React.useState('echeanciers');
  const [echeanciers, setEch]        = React.useState(ECHEANCIERS_DEMO);
  const [codes, setCodes]            = React.useState(CODES_PROMO_DEMO);
  const [modalEch, setModalEch]      = React.useState(null); // null | 'new' | item
  const [modalCode, setModalCode]    = React.useState(null);
  const [deleteConfirm, setDel]      = React.useState(null);

  const tabs = [
    { id: 'echeanciers', label: 'Échéanciers personnalisés', count: echeanciers.length },
    { id: 'codes',       label: 'Codes promo',               count: codes.length       },
  ];

  return (
    <div data-screen-label="admin-reglement-salon">
      <PageHeader
        breadcrumb={['Administration', 'Salons & exposants', 'Règlement & codes promo']}
        title="Règlement & codes promo"
        subtitle="Échéanciers personnalisés par exposant · Codes de réduction nominatifs"
        actions={
          tab === 'echeanciers'
            ? <button className="btn btn-primary btn-sm" onClick={() => setModalEch('new')} style={{ background: 'var(--burgundy-800)' }}><Icon.Plus size={14}/> Créer un échéancier</button>
            : <button className="btn btn-primary btn-sm" onClick={() => setModalCode('new')} style={{ background: 'var(--burgundy-800)' }}><Icon.Plus size={14}/> Créer un code promo</button>
        }
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 20, borderBottom: '1px solid var(--border)', marginBottom: 18 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '10px 0', border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 13.5, fontWeight: tab === t.id ? 600 : 400,
            color: tab === t.id ? 'var(--burgundy-800)' : 'var(--fg-muted)',
            borderBottom: `2px solid ${tab === t.id ? 'var(--burgundy-800)' : 'transparent'}`,
            marginBottom: -1, display: 'flex', alignItems: 'center', gap: 7,
          }}>
            {t.label}
            <span style={{ fontSize: 11, padding: '0 6px', borderRadius: 999, background: tab === t.id ? 'var(--burgundy-50)' : 'var(--slate-100)', color: tab === t.id ? 'var(--burgundy-800)' : 'var(--fg-muted)', fontWeight: 500 }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Tab Échéanciers ── */}
      {tab === 'echeanciers' && (
        <div>
          <div style={{ marginBottom: 12, padding: '10px 14px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, fontSize: 12.5, color: '#0c4a6e', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Icon.Info size={13} style={{ flexShrink: 0, marginTop: 1 }}/>
            Par défaut : 40 % à la validation + 60 % 30 jours avant le salon. Créez un échéancier pour personnaliser ce découpage pour un exposant précis.
          </div>
          {echeanciers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--fg-muted)' }}>
              <Icon.CreditCard size={32} style={{ opacity: 0.3, marginBottom: 12 }}/>
              <div style={{ fontSize: 14 }}>Aucun échéancier personnalisé</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {echeanciers.map(e => {
                const paye = e.echeances.reduce((a, l) => a + (l.statut === 'paye' ? l.montant : 0), 0);
                const pct  = Math.round(paye / e.totalTTC * 100);
                return (
                  <div key={e.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, padding: '16px 20px 12px', borderBottom: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 600 }}>{e.exposant}</span>
                          <span style={{ fontSize: 11.5, color: 'var(--fg-muted)', background: 'var(--slate-100)', padding: '2px 8px', borderRadius: 6 }}>{e.ref}</span>
                        </div>
                        <div style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>{e.salon}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => setModalEch(e)} className="btn btn-outline btn-sm"><Icon.Edit size={13}/> Modifier</button>
                        <button onClick={() => setDel({ type: 'ech', id: e.id, label: e.exposant })} className="btn btn-icon btn-sm btn-ghost" style={{ color: 'var(--danger)' }}><Icon.Trash size={13}/></button>
                      </div>
                    </div>
                    <div style={{ padding: '12px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr)) 180px', gap: 8, alignItems: 'start' }}>
                      {e.echeances.map((l, i) => (
                        <div key={i} style={{ padding: '8px 12px', background: 'var(--slate-50)', borderRadius: 8, border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{l.label}</div>
                          <div className="tnum" style={{ fontSize: 15, fontWeight: 700 }}>{eur(l.montant)}</div>
                          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{l.date || '—'}</div>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 5, fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 999, background: l.statut === 'paye' ? '#dcfce7' : '#fef3c7', color: l.statut === 'paye' ? '#166534' : '#a16207' }}>
                            {l.statut === 'paye' ? <Icon.Check size={9}/> : <Icon.Clock size={9}/>}
                            {l.statut === 'paye' ? 'Payé' : 'En attente'}
                          </span>
                        </div>
                      ))}
                      {/* Progress */}
                      <div style={{ padding: '8px 12px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginBottom: 6 }}>Réglé : {eur(paye)} / {eur(e.totalTTC)}</div>
                        <div style={{ height: 6, background: 'var(--slate-100)', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--burgundy-800)', borderRadius: 999, transition: 'width .3s' }}/>
                        </div>
                        <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--burgundy-800)', marginTop: 4 }}>{pct} % encaissé</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Tab Codes promo ── */}
      {tab === 'codes' && (
        <div>
          <div style={{ marginBottom: 12, padding: '10px 14px', background: '#fef9ec', border: '1px solid #fde68a', borderRadius: 8, fontSize: 12.5, color: '#78350f', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Icon.Info size={13} style={{ flexShrink: 0, marginTop: 1 }}/>
            Chaque code est nominatif : il est lié à un exposant précis et ne peut être utilisé que par lui lors de son inscription.
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Exposant lié</th>
                  <th>Remise</th>
                  <th>Expiration</th>
                  <th>Statut</th>
                  <th>Utilisation</th>
                  <th style={{ width: 36 }}/>
                </tr>
              </thead>
              <tbody>
                {codes.map((c, i) => {
                  const expire = c.expiration ? new Date(c.expiration) < new Date('2026-06-30') : false;
                  const statut = !c.actif ? 'inactif' : expire ? 'expire' : c.utilise ? 'utilise' : 'actif';
                  const statutStyle = {
                    actif:   { bg: '#dcfce7', fg: '#166534', label: 'Actif' },
                    utilise: { bg: 'var(--burgundy-50)', fg: 'var(--burgundy-800)', label: 'Utilisé' },
                    expire:  { bg: '#fef3c7', fg: '#a16207', label: 'Expiré' },
                    inactif: { bg: 'var(--slate-100)', fg: 'var(--slate-600)', label: 'Inactif' },
                  }[statut];
                  return (
                    <tr key={c.id}>
                      <td>
                        <span className="tnum" style={{ fontWeight: 700, letterSpacing: '0.06em', fontSize: 13, padding: '3px 8px', background: 'var(--slate-100)', borderRadius: 6 }}>{c.code}</span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{c.exposant}</td>
                      <td>
                        <span className="tnum" style={{ fontWeight: 700, color: 'var(--burgundy-800)', fontSize: 13.5 }}>
                          {c.remiseType === 'pct' ? `−${c.remise} %` : `−${c.remise} €`}
                        </span>
                      </td>
                      <td className="tnum" style={{ fontSize: 12.5, color: expire ? '#b91c1c' : 'var(--fg-muted)' }}>{c.expiration || '—'}</td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px 3px 7px', borderRadius: 999, background: statutStyle.bg, color: statutStyle.fg, fontSize: 11.5, fontWeight: 600 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statutStyle.fg }}/>
                          {statutStyle.label}
                        </span>
                      </td>
                      <td style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>
                        {c.utilise ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--burgundy-800)' }}>
                            <Icon.Check size={12}/> {c.ref}
                          </span>
                        ) : '—'}
                      </td>
                      <td onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => setModalCode(c)} className="btn btn-icon btn-sm btn-ghost"><Icon.Edit size={13}/></button>
                          <button onClick={() => setDel({ type: 'code', id: c.id, label: c.code })} className="btn btn-icon btn-sm btn-ghost" style={{ color: 'var(--danger)' }}><Icon.Trash size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modales */}
      {modalEch !== null && (
        <EcheancierModal item={modalEch === 'new' ? null : modalEch} onClose={() => setModalEch(null)}/>
      )}
      {modalCode !== null && (
        <CodePromoModal item={modalCode === 'new' ? null : modalCode} onClose={() => setModalCode(null)}/>
      )}

      {/* Confirm suppression */}
      {deleteConfirm && (
        <div onClick={() => setDel(null)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--surface)', borderRadius: 12, padding: '24px 28px', maxWidth: 380, width: '100%', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Icon.Trash size={20}/></div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Supprimer ?</div>
            <div style={{ fontSize: 13.5, color: 'var(--fg-muted)', marginBottom: 20 }}>
              {deleteConfirm.type === 'ech' ? `L'échéancier de "${deleteConfirm.label}"` : `Le code "${deleteConfirm.label}"`} sera définitivement supprimé.
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setDel(null)} className="btn btn-outline">Annuler</button>
              <button onClick={() => {
                if (deleteConfirm.type === 'ech') setEch(l => l.filter(x => x.id !== deleteConfirm.id));
                else setCodes(l => l.filter(x => x.id !== deleteConfirm.id));
                setDel(null);
              }} className="btn btn-primary" style={{ background: '#dc2626', borderColor: '#dc2626' }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Tableau de bord par salon ────────────────────────────────────
const SalonDashboard = ({ salonId = 'vins-2026' }) => {
  const meta = SALON_META[salonId] || SALON_META['vins-2026'];
  const s = meta.stats;
  const isVins = salonId === 'vins-2026';

  const RECENTES = isVins ? [
    { ref: 'INS-2026-0142', nom: 'Domaine de la Chevalière',  statut: 'acompte', stand: '12 m²' },
    { ref: 'INS-2026-0141', nom: 'Maison Joseph Drouhin',     statut: 'soldee',  stand: '18 m²' },
    { ref: 'INS-2026-0140', nom: 'Fromagerie Lactobac',       statut: 'attente', stand: '9 m²' },
    { ref: 'INS-2026-0139', nom: 'Cellier du Roi',            statut: 'acompte', stand: '9 m²' },
    { ref: 'INS-2026-0138', nom: 'Maison Joannet',            statut: 'attente', stand: '6 m²' },
  ] : [];

  const ECHEANCES = isVins ? [
    { date: '30 Sep 2026', label: "Clôture des inscriptions",      icon: <Icon.Calendar size={13}/> },
    { date: '15 Oct 2026', label: "Solde règlement dû",            icon: <Icon.Euro size={13}/> },
    { date: '14 Nov 2026', label: "Ouverture du salon",            icon: <Icon.Sparkles size={13}/> },
  ] : [
    { date: '15 Nov 2026', label: "Ouverture des inscriptions",    icon: <Icon.Calendar size={13}/> },
    { date: '05 Déc 2026', label: "Ouverture du marché",           icon: <Icon.Sparkles size={13}/> },
  ];

  return (
    <div>
      <PageHeader
        breadcrumb={['Administration', meta.short, 'Tableau de bord']}
        title={meta.short}
        subtitle={`${meta.dates} · ${meta.lieu}`}
        actions={<>
          <button className="btn btn-outline btn-sm"><Icon.Mail size={14}/> Communication</button>
          <button className="btn btn-primary btn-sm" style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Settings size={14}/> Paramètres
          </button>
        </>}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <SalonStatusBadge kind={meta.status}/>
        <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>{meta.inscriptions} · {meta.lieu}</span>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Exposants inscrits', value: s.exposants, sub: isVins ? '38 en attente' : 'Pas encore ouvert', icon: <Icon.Users size={18}/>, color: 'var(--burgundy-800)', bg: 'var(--burgundy-50)' },
          { label: 'Stands attribués',   value: `${s.stands} / ${s.total}`, sub: `${s.total - s.stands} disponibles`, icon: <Icon.Map size={18}/>, color: '#1e40af', bg: '#eff6ff' },
          { label: 'Surface attribuée',  value: `${s.sqm.toLocaleString('fr-FR')} m²`, sub: `/ ${s.sqmTotal.toLocaleString('fr-FR')} m²`, icon: <Icon.Layers size={18}/>, color: '#15803d', bg: '#dcfce7' },
          { label: 'Acomptes reçus',     value: isVins ? '64' : '0', sub: isVins ? '12 soldés' : '—', icon: <Icon.Euro size={18}/>, color: '#a16207', bg: '#fef3c7' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', fontWeight: 500, lineHeight: 1.3 }}>{stat.label}</div>
            </div>
            <div className="tnum" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg)', marginBottom: 3 }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* Dernières inscriptions / empty */}
        <div className="card" style={{ padding: '18px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg-subtle)', marginBottom: 14 }}>
            {isVins ? 'Dernières inscriptions' : 'Aucune inscription pour le moment'}
          </div>
          {!isVins && (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--fg-muted)', fontSize: 13 }}>
              <Icon.Calendar size={32} style={{ opacity: 0.3, display: 'block', margin: '0 auto 10px' }}/>
              Les inscriptions ouvrent le 1er septembre 2026
            </div>
          )}
          {isVins && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {RECENTES.map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < RECENTES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{row.nom}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 1 }}>{row.ref} · {row.stand}</div>
                  </div>
                  <InscriptionStatusBadge kind={row.statut}/>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prochaines échéances */}
        <div className="card" style={{ padding: '18px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg-subtle)', marginBottom: 14 }}>Prochaines échéances</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {ECHEANCES.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '9px 0', borderBottom: i < ECHEANCES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--slate-50)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--fg-muted)' }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 2 }}>{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Exposants confirmés par salon ───────────────────────────────
const SalonExposants = ({ salonId = 'vins-2026', onOpenDetail }) => {
  const meta = SALON_META[salonId] || SALON_META['vins-2026'];
  const isMarche = salonId === 'plaisirs-2026';
  const [rowMenu, setRowMenu] = React.useState(null);

  const ROWS_VINS = [
    ['INS-2026-0141', 'Maison Joseph Drouhin',   'Beaune',        'Viticulteur',          'B03', '18 m²', 1080, 'soldee'],
    ['INS-2026-0137', 'Vignobles Lacroix',        'Mercurey',      'Viticulteur',          'A07', '12 m²', 720,  'soldee'],
    ['INS-2026-0142', 'Domaine de la Chevalière', 'Mâcon',         'Viticulteur',          'C02', '12 m²', 720,  'acompte'],
    ['INS-2026-0139', 'Cellier du Roi',           'Tournus',       'Caviste',              'A12', '9 m²',  540,  'acompte'],
    ['INS-2026-0135', 'Domaine Sainte-Anne',      'Saint-Véran',   'Viticulteur',          'B08', '12 m²', 720,  'acompte'],
    ['INS-2026-0136', 'Brasserie de Saône',       'Mâcon',         'Brasseur',             'D04', '9 m²',  540,  'validee'],
    ['INS-2026-0133', 'Domaine Tabard',           'Brouilly',      'Viticulteur',          'A03', '9 m²',  540,  'acompte'],
  ];
  const ROWS = isMarche ? [] : ROWS_VINS;

  return (
    <div>
      <PageHeader
        breadcrumb={['Administration', meta.short, 'Exposants']}
        title="Exposants"
        subtitle={`${ROWS.length} exposants confirmés · ${ROWS.filter(r => r[7] === 'soldee').length} soldés`}
        actions={<>
          <button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Export</button>
          <button className="btn btn-outline btn-sm"><Icon.Mail size={14}/> Envoyer à tous</button>
        </>}
      />

      {ROWS.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--fg-muted)' }}>
          <Icon.Users size={36} style={{ opacity: 0.25, display: 'block', margin: '0 auto 12px' }}/>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Aucun exposant confirmé</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Les inscriptions ouvrent le 1er septembre 2026</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Réf.</th>
                <th>Exposant</th>
                <th>Type</th>
                <th>Stand</th>
                <th>Surface</th>
                <th>Total TTC</th>
                <th>Statut</th>
                <th style={{ width: 36 }}/>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} onClick={() => onOpenDetail && onOpenDetail(r[0])} style={{ cursor: 'pointer' }}>
                  <td style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', fontSize: 12, fontWeight: 500 }}>{r[0]}</td>
                  <td style={{ fontWeight: 500 }}>{r[1]}<div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 1 }}>{r[2]}</div></td>
                  <td><ActiviteBadge type={r[3]}/></td>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{r[4]}</td>
                  <td className="tnum">{r[5]}</td>
                  <td className="tnum">{r[6]} €</td>
                  <td><InscriptionStatusBadge kind={r[7]}/></td>
                  <td onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
                    <button className="btn btn-icon btn-sm btn-ghost" onClick={() => setRowMenu(rowMenu === i ? null : i)}>
                      <Icon.MoreH size={13}/>
                    </button>
                    {rowMenu === i && (
                      <>
                        <div onClick={() => setRowMenu(null)} style={{ position: 'fixed', inset: 0, zIndex: 50 }}/>
                        <div style={{ position: 'absolute', top: 32, right: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', minWidth: 200, zIndex: 60, overflow: 'hidden', padding: '4px 0' }}>
                          <CmdMenuItem icon={<Icon.Eye size={13}/>}  label="Voir la fiche"      onClick={() => { setRowMenu(null); onOpenDetail && onOpenDetail(r[0]); }}/>
                          <CmdMenuItem icon={<Icon.Mail size={13}/>} label="Envoyer un message" onClick={() => setRowMenu(null)}/>
                          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }}/>
                          <CmdMenuItem icon={<Icon.Map size={13}/>}  label="Voir sur le plan"   onClick={() => setRowMenu(null)}/>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ─── Communications salon ─────────────────────────────────────────
const SalonComms = ({ salonId = 'vins-2026' }) => {
  const meta = SALON_META[salonId] || SALON_META['vins-2026'];
  const isVins = salonId === 'vins-2026';
  const [rowMenu, setRowMenu] = React.useState(null);

  const COMMS_VINS = [
    { id: 1, objet: "Confirmation d'inscription — Salon des Vins 2026", dest: 142, date: '12 juin 2026',  type: 'confirmation', statut: 'envoye' },
    { id: 2, objet: "Rappel : acompte en attente de règlement",         dest: 38,  date: '18 juin 2026',  type: 'relance',      statut: 'envoye' },
    { id: 3, objet: "Attribution des stands — votre emplacement",       dest: 87,  date: '1 juil. 2026',  type: 'info',         statut: 'envoye' },
    { id: 4, objet: "Informations pratiques avant le salon",            dest: 0,   date: '—',             type: 'info',         statut: 'brouillon' },
  ];
  const COMMS = isVins ? COMMS_VINS : [];

  const typeStyle = {
    confirmation: { label: 'Confirmation', bg: '#dcfce7', fg: '#166534' },
    relance:      { label: 'Relance',      bg: '#fef3c7', fg: '#a16207' },
    info:         { label: 'Information',  bg: '#eff6ff', fg: '#1e40af' },
  };

  return (
    <div>
      <PageHeader
        breadcrumb={['Administration', meta.short, 'Communications']}
        title="Communications"
        subtitle="Historique des e-mails envoyés aux exposants"
        actions={<>
          <button className="btn btn-primary btn-sm" style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Plus size={14}/> Nouvelle communication
          </button>
        </>}
      />

      {COMMS.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--fg-muted)' }}>
          <Icon.Mail size={36} style={{ opacity: 0.25, display: 'block', margin: '0 auto 12px' }}/>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Aucune communication envoyée</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Les communications seront disponibles dès l'ouverture des inscriptions</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {COMMS.map((c, i) => {
            const ts = typeStyle[c.type] || typeStyle.info;
            return (
              <div key={c.id} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--slate-50)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon.Mail size={16} style={{ color: 'var(--fg-muted)' }}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                    <span style={{ fontWeight: 500, fontSize: 13.5 }}>{c.objet}</span>
                    <span style={{ padding: '2px 8px', borderRadius: 999, background: ts.bg, color: ts.fg, fontSize: 11, fontWeight: 600 }}>{ts.label}</span>
                    {c.statut === 'brouillon' && (
                      <span style={{ padding: '2px 8px', borderRadius: 999, background: 'var(--slate-100)', color: 'var(--slate-600)', fontSize: 11, fontWeight: 600 }}>Brouillon</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
                    {c.statut === 'envoye' ? `${c.dest} destinataires · ${c.date}` : 'Non envoyé'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, position: 'relative' }}>
                  {c.statut === 'envoye' && (
                    <span style={{ fontSize: 12, color: '#166534', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Icon.CheckCircle size={13}/>Envoyé
                    </span>
                  )}
                  <button className="btn btn-outline btn-sm"><Icon.Eye size={13}/> {c.statut === 'brouillon' ? 'Éditer' : 'Voir'}</button>
                  <button className="btn btn-icon btn-sm btn-ghost" onClick={() => setRowMenu(rowMenu === i ? null : i)}>
                    <Icon.MoreH size={13}/>
                  </button>
                  {rowMenu === i && (
                    <>
                      <div onClick={() => setRowMenu(null)} style={{ position: 'fixed', inset: 0, zIndex: 50 }}/>
                      <div style={{ position: 'absolute', top: 36, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', minWidth: 200, zIndex: 60, overflow: 'hidden', padding: '4px 0' }}>
                        {c.statut === 'brouillon' && <CmdMenuItem icon={<Icon.Send size={13}/>} label="Envoyer maintenant" primary onClick={() => setRowMenu(null)}/>}
                        <CmdMenuItem icon={<Icon.Copy size={13}/>}  label="Dupliquer"           onClick={() => setRowMenu(null)}/>
                        {c.statut === 'envoye' && <CmdMenuItem icon={<Icon.Send size={13}/>} label="Renvoyer" onClick={() => setRowMenu(null)}/>}
                        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }}/>
                        <CmdMenuItem icon={<Icon.Trash size={13}/>} label="Supprimer" danger    onClick={() => setRowMenu(null)}/>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Wrappers Salon des Vins ──────────────────────────────────────
const SdvDashboard    = ()  => <SalonDashboard salonId="vins-2026"/>;
const SdvExposants    = (p) => <SalonExposants salonId="vins-2026" {...p}/>;
const SdvInscriptions = (p) => <AdminInscriptionsExposants salonId="vins-2026" {...p}/>;
const SdvStands       = ()  => <AdminPlanStands defaultSalonId="vins-2026"/>;
const SdvReglement    = ()  => <AdminReglementSalon defaultSalon="vins-2026"/>;
const SdvComms        = ()  => <SalonComms salonId="vins-2026"/>;

// ─── Wrappers Marché des Plaisirs Gourmands ───────────────────────
const MpgDashboard    = ()  => <SalonDashboard salonId="plaisirs-2026"/>;
const MpgExposants    = (p) => <SalonExposants salonId="plaisirs-2026" {...p}/>;
const MpgInscriptions = (p) => <AdminInscriptionsExposants salonId="plaisirs-2026" {...p}/>;
const MpgStands       = ()  => <AdminPlanStands defaultSalonId="plaisirs-2026"/>;
const MpgReglement    = ()  => <AdminReglementSalon defaultSalon="plaisirs-2026"/>;
const MpgComms        = ()  => <SalonComms salonId="plaisirs-2026"/>;

Object.assign(window, {
  AdminEvenements,
  AdminInscriptionsExposants,
  AdminInscriptionsVins,
  AdminInscriptionsMarche,
  AdminPlanStands,
  AdminReglementSalon,
  SalonDashboard, SalonExposants, SalonComms,
  SdvDashboard, SdvExposants, SdvInscriptions, SdvStands, SdvReglement, SdvComms,
  MpgDashboard, MpgExposants, MpgInscriptions, MpgStands, MpgReglement, MpgComms,
});
