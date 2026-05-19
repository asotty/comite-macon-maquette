// ─── Dégustateurs : liste / formations / repas / jurys / dispos ─────

// ─── Page 1 — Liste dégustateurs ──────────────────────────────────

const DEG_ROWS = [
  ['DEG-0086', 'Pierre',   'Garnier',  'pierre.garnier@oeno.fr',     'validee',     3, ['Jury B3'],                 'actif'],
  ['DEG-0085', 'Sophie',   'Martin',   'sophie.martin@vins71.fr',    'validee',     5, ['Jury A1', 'Jury C2'],      'actif'],
  ['DEG-0084', 'Claire',   'Dubois',   'claire.dubois@chai.fr',      'renouveler', 2, ['Jury B1'],                 'actif'],
  ['DEG-0083', 'Antoine',  'Lefèvre',  'antoine.lefevre@chai.fr',    'validee',     4, ['Jury A2'],                 'actif'],
  ['DEG-0082', 'Hélène',   'Roux',     'helene.roux@oeno.fr',        'validee',     6, ['Jury B2', 'Jury D1'],      'actif'],
  ['DEG-0081', 'Marc',     'Durand',   'marc.durand@vinsetcie.fr',   'renouveler', 0, [],                          'actif'],
  ['DEG-0080', 'Isabelle', 'Petit',    'i.petit@degustation.com',    'validee',     5, ['Jury C1', 'Jury C3'],      'actif'],
  ['DEG-0079', 'Julien',   'Mercier',  'julien@mercier-vins.fr',     'validee',     3, ['Jury A3'],                 'actif'],
  ['DEG-0078', 'Camille',  'Boyer',    'camille.boyer@oeno.fr',      'non',         1, [],                          'actif'],
  ['DEG-0077', 'Olivier',  'Faure',    'o.faure@vignobles-faure.fr', 'validee',     0, [],                          'inactif'],
  ['DEG-0076', 'Patricia', 'Lambert',  'p.lambert@chai.fr',          'validee',     4, ['Jury B4'],                 'actif'],
  ['DEG-0075', 'Romain',   'Vidal',    'romain.vidal@vinsdumonde.fr','validee',     5, ['Jury D2'],                 'actif'],
];

const AdminDegustateursList = ({ onOpenDetail }) => {
  const [search,    setSearch]    = React.useState('');
  const [statut,    setStatut]    = React.useState('all');
  const [dispo,     setDispo]     = React.useState('all');
  const [formation, setFormation] = React.useState('all');
  const [rowMenu,   setRowMenu]   = React.useState(null);
  const [addModal,  setAddModal]  = React.useState(false);

  const filtered = DEG_ROWS.filter(r => {
    if (statut    !== 'all' && r[7] !== statut)                                                   return false;
    if (dispo     === 'oui' && r[5] === 0)                                                        return false;
    if (dispo     === 'non' && r[5] >  0)                                                         return false;
    if (formation === 'oui' && r[4] !== 'validee')                                                return false;
    if (formation === 'non' && r[4] === 'validee')                                                return false;
    if (search && !`${r[1]} ${r[2]} ${r[3]}`.toLowerCase().includes(search.toLowerCase()))        return false;
    return true;
  });

  const paged = useSortablePaged(filtered, {
    defaultPageSize: 25,
    accessors: {
      nom: r => `${r[2]} ${r[1]}`,
      email: r => r[3],
      formation: r => r[4],
      dispos: r => r[5],
      jurys: r => r[6].length,
      statut: r => r[7],
    },
  });

  return (
    <div data-screen-label="admin-degustateurs">
      <PageHeader
        breadcrumb={['Administration', 'Utilisateurs', 'Dégustateurs']}
        title="Dégustateurs"
        subtitle={`86 dégustateurs actifs · ${DEG_ROWS.filter(r => r[5] > 0).length}/${DEG_ROWS.length} disponibles édition 2026`}
        actions={<>
          <button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => setAddModal(true)} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Plus size={14}/> Ajouter un dégustateur
          </button>
        </>}
      />

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="input-with-icon" style={{ flex: 1, maxWidth: 360, minWidth: 220 }}>
          <Icon.Search size={14} className="input-icon"/>
          <input className="input" placeholder="Nom, prénom, email…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <FilterSelect icon={<Icon.Dot size={13}/>}        label="Statut"    value={statut}    onChange={setStatut}    options={[
          { id: 'all',     label: 'Tous statuts' },
          { id: 'actif',   label: 'Actif' },
          { id: 'inactif', label: 'Inactif' },
        ]}/>
        <FilterSelect icon={<Icon.Calendar size={13}/>}   label="Disponible 2026" value={dispo} onChange={setDispo} options={[
          { id: 'all', label: 'Indifférent' },
          { id: 'oui', label: 'A déclaré des dispos' },
          { id: 'non', label: 'Aucune dispo déclarée' },
        ]}/>
        <FilterSelect icon={<Icon.ShieldCheck size={13}/>} label="Formation" value={formation} onChange={setFormation} options={[
          { id: 'all', label: 'Indifférent' },
          { id: 'oui', label: 'Formation validée' },
          { id: 'non', label: 'À renouveler / non' },
        ]}/>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <SortableTh sortKey="nom"       currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Dégustateur</SortableTh>
              <SortableTh sortKey="email"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Email</SortableTh>
              <SortableTh sortKey="formation" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Formation</SortableTh>
              <SortableTh sortKey="dispos"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Dispos 2026</SortableTh>
              <SortableTh sortKey="jurys"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Jurys</SortableTh>
              <SortableTh sortKey="statut"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Statut</SortableTh>
              <th style={{ width: 36 }}></th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.map((r, i) => (
              <tr key={i} style={{ cursor: 'pointer' }} onClick={() => onOpenDetail && onOpenDetail(r[0])}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 999,
                      background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 600, fontSize: 12, flexShrink: 0,
                    }}>
                      {r[1][0]}{r[2][0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{r[1]} {r[2]}</div>
                      <div className="muted" style={{ fontSize: 11.5, fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>{r[0]}</div>
                    </div>
                  </div>
                </td>
                <td className="muted" style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', fontSize: 12.5 }}>{r[3]}</td>
                <td><FormationBadge kind={r[4]}/></td>
                <td className="num tnum">
                  {r[5] > 0 ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>{r[5]}</strong>
                      <span style={{ color: 'var(--fg-muted)', fontWeight: 400 }}>jours</span>
                    </span>
                  ) : (
                    <span className="subtle" style={{ fontStyle: 'italic' }}>aucune</span>
                  )}
                </td>
                <td>
                  {r[6].length === 0 ? (
                    <span className="subtle" style={{ fontStyle: 'italic' }}>—</span>
                  ) : (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {r[6].map(j => (
                        <span key={j} style={{
                          fontSize: 11, padding: '2px 7px', borderRadius: 4,
                          background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                          fontWeight: 600,
                        }}>{j}</span>
                      ))}
                    </div>
                  )}
                </td>
                <td><CompteBadge kind={r[7]}/></td>
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
                        <CmdMenuItem icon={<Icon.Eye size={13}/>}  label="Voir la fiche" primary onClick={() => { setRowMenu(null); onOpenDetail && onOpenDetail(r[0]); }}/>
                        <CmdMenuItem icon={<Icon.Users size={13}/>} label="Affecter à un jury" onClick={() => setRowMenu(null)}/>
                        <CmdMenuItem icon={<Icon.Mail size={13}/>} label="Envoyer un email" onClick={() => setRowMenu(null)}/>
                        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }}/>
                        {r[7] === 'actif'
                          ? <CmdMenuItem icon={<Icon.Lock size={13}/>}    label="Désactiver le compte" danger onClick={() => setRowMenu(null)}/>
                          : <CmdMenuItem icon={<Icon.Refresh size={13}/>} label="Réactiver le compte"        onClick={() => setRowMenu(null)}/>}
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
        leftSlot={<span style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginRight: 12 }}>{paged.total} dégustateur{paged.total > 1 ? 's' : ''} — </span>}/>

      {addModal && (
        <AjouterDegustateurModal
          onCancel={() => setAddModal(false)}
          onConfirm={() => { setAddModal(false); onOpenDetail && onOpenDetail('DEG-0087'); }}
        />
      )}
    </div>
  );
};

// ─── Modale : Ajouter un dégustateur ──────────────────────────────

const AjouterDegustateurModal = ({ onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const [form, setForm] = React.useState({ prenom: '', nom: '', email: '', tel: '', invite: true });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const canCreate = form.prenom && form.nom && form.email;

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 480, padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '22px 26px 14px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Plus size={13}/>
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Création rapide</span>
            </div>
            <h2 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>Ajouter un dégustateur</h2>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost" aria-label="Fermer">
            <Icon.X size={14}/>
          </button>
        </div>

        <div style={{ padding: '18px 26px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label className="field">
              <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>
                Prénom <span style={{ color: '#dc2626' }}>*</span>
              </span>
              <input className="input" placeholder="Marie" value={form.prenom} onChange={set('prenom')}/>
            </label>
            <label className="field">
              <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>
                Nom <span style={{ color: '#dc2626' }}>*</span>
              </span>
              <input className="input" placeholder="Dupont" value={form.nom} onChange={set('nom')}/>
            </label>
          </div>
          <label className="field">
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>
              Email <span style={{ color: '#dc2626' }}>*</span>
              <span style={{ color: 'var(--fg-subtle)', fontWeight: 400, marginLeft: 6 }}>(= identifiant de connexion)</span>
            </span>
            <input type="email" className="input" placeholder="marie.dupont@oeno.fr" value={form.email} onChange={set('email')} style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
          </label>
          <label className="field">
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Téléphone</span>
            <input type="tel" className="input" placeholder="06 12 34 56 78" value={form.tel} onChange={set('tel')} style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
          </label>

          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '12px 14px', marginTop: 4,
            border: `1px solid ${form.invite ? 'var(--burgundy-200)' : 'var(--border)'}`,
            background: form.invite ? 'var(--burgundy-50)' : 'var(--surface)',
            borderRadius: 8, cursor: 'pointer',
          }}>
            <input type="checkbox" checked={form.invite} onChange={set('invite')} style={{ marginTop: 2, accentColor: 'var(--burgundy-800)', flexShrink: 0 }}/>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>Envoyer un email d'invitation</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>
                Lien envoyé à <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>{form.email || '…'}</strong> pour compléter le profil et définir un mot de passe.
              </div>
            </div>
          </label>
        </div>

        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={!canCreate}
            style={{ background: 'var(--burgundy-800)', opacity: canCreate ? 1 : 0.45 }}
          >
            <Icon.Check size={13}/> Créer le compte{form.invite ? ' + inviter' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

const FormationBadge = ({ kind }) => {
  const map = {
    'validee':    { bg: '#dcfce7', fg: '#166534', icon: <Icon.Check size={11}/>,        label: 'Validée' },
    'renouveler': { bg: '#fef3c7', fg: '#a16207', icon: <Icon.AlertTriangle size={11}/>, label: 'À renouveler' },
    'non':        { bg: '#fef2f2', fg: '#991b1b', icon: <Icon.X size={11}/>,             label: 'Non validée' },
  };
  const s = map[kind] || map.non;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px 3px 7px', borderRadius: 999,
      background: s.bg, color: s.fg,
      fontSize: 11.5, fontWeight: 600,
    }}>{s.icon}{s.label}</span>
  );
};

// ─── Page 2 — Formations ──────────────────────────────────────────

const AdminFormations = () => {
  const [planModal, setPlanModal] = React.useState(false);
  const [tab, setTab] = React.useState('a-venir');
  const [openSession, setOpenSession] = React.useState(null);

  const SESSIONS = [
    { id: 'F-2026-04', concours: 'france-2026', date: '08/09/2026', heure: '09h00', duree: '1 j',  lieu: 'Maison des Vins, Mâcon',         inscrits: 18, capacite: 24, valides: 0,  status: 'planifiee', formateur: 'Patrick Léon' },
    { id: 'F-2026-03', concours: 'monde-2026',  date: '15/06/2026', heure: '14h00', duree: '½ j',  lieu: 'Maison des Vins, Mâcon',         inscrits: 22, capacite: 24, valides: 0,  status: 'planifiee', formateur: 'Sophie L.' },
    { id: 'F-2026-02', concours: 'france-2026', date: '12/04/2026', heure: '09h00', duree: '1 j',  lieu: 'Château de Pierreclos',          inscrits: 24, capacite: 24, valides: 22, status: 'passee',    formateur: 'Patrick Léon' },
    { id: 'F-2026-01', concours: 'tous',        date: '18/02/2026', heure: '09h00', duree: '2 j',  lieu: 'Maison des Vins, Mâcon',         inscrits: 16, capacite: 18, valides: 14, status: 'passee',    formateur: 'Patrick Léon' },
    { id: 'F-2025-04', concours: 'france-2025', date: '06/11/2025', heure: '14h00', duree: '½ j',  lieu: 'Maison des Vins, Mâcon',         inscrits: 20, capacite: 24, valides: 18, status: 'passee',    formateur: 'Sophie L.' },
  ];

  const filtered = SESSIONS.filter(s => tab === 'a-venir' ? s.status === 'planifiee' : s.status === 'passee');
  const paged = useSortablePaged(filtered, {
    defaultPageSize: 25,
    accessors: {
      session: s => s.id, concours: s => s.concours,
      date: s => { const [d,m,y] = s.date.split('/'); return new Date(+y, +m-1, +d).getTime(); },
      lieu: s => s.lieu, formateur: s => s.formateur,
      inscrits: s => s.inscrits, valides: s => s.valides, statut: s => s.status,
    },
  });

  if (openSession) {
    return <FormationSessionDetail session={SESSIONS.find(s => s.id === openSession)} onBack={() => setOpenSession(null)}/>;
  }

  return (
    <div data-screen-label="admin-formations">
      <PageHeader
        breadcrumb={['Administration', 'Dégustateurs', 'Formations']}
        title="Formations dégustateurs"
        subtitle="Programme de formation continue · Validité 3 ans"
        actions={<>
          <button className="btn btn-primary btn-sm" onClick={() => setPlanModal(true)} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Plus size={14}/> Planifier une session
          </button>
        </>}
      />

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Sessions à venir',          n: SESSIONS.filter(s => s.status === 'planifiee').length, icon: <Icon.Calendar size={16}/> },
          { label: 'Inscrits',                  n: SESSIONS.filter(s => s.status === 'planifiee').reduce((a, s) => a + s.inscrits, 0), icon: <Icon.Users size={16}/> },
          { label: 'Dégustateurs validés 2026', n: 68, icon: <Icon.ShieldCheck size={16}/> },
          { label: 'À renouveler',              n: 4,  icon: <Icon.AlertTriangle size={16}/>, warn: true },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              width: 36, height: 36, borderRadius: 9,
              background: k.warn ? '#fef3c7' : 'var(--burgundy-50)',
              color: k.warn ? '#a16207' : 'var(--burgundy-800)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>{k.icon}</span>
            <div>
              <div className="tnum display" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1 }}>{k.n}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 4 }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24, borderBottom: '1px solid var(--border)', marginBottom: 14 }}>
        {[
          { id: 'a-venir', label: 'À venir',  count: SESSIONS.filter(s => s.status === 'planifiee').length },
          { id: 'passees', label: 'Passées',  count: SESSIONS.filter(s => s.status === 'passee').length    },
        ].map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '12px 0', border: 'none',
              borderBottom: active ? '2px solid var(--burgundy-800)' : '2px solid transparent',
              background: 'transparent',
              fontSize: 13.5, fontWeight: active ? 600 : 500,
              color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
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

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <SortableTh sortKey="session"   currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Session</SortableTh>
              <SortableTh sortKey="concours"  currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Concours</SortableTh>
              <SortableTh sortKey="date"      currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Date</SortableTh>
              <SortableTh sortKey="lieu"      currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Lieu</SortableTh>
              <SortableTh sortKey="formateur" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Formateur</SortableTh>
              <SortableTh sortKey="inscrits"  currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Inscrits</SortableTh>
              <SortableTh sortKey="valides"   currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Validés</SortableTh>
              <SortableTh sortKey="statut"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Statut</SortableTh>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.map(s => (
              <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => setOpenSession(s.id)}>
                <td style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', fontSize: 12.5, fontWeight: 500 }}>{s.id}</td>
                <td><ConcoursCell value={s.concours}/></td>
                <td>
                  <div className="tnum" style={{ fontWeight: 500 }}>{s.date}</div>
                  <div className="muted" style={{ fontSize: 11.5 }}>{s.heure} · {s.duree}</div>
                </td>
                <td className="muted">{s.lieu}</td>
                <td>{s.formateur}</td>
                <td className="num tnum">
                  <span style={{ fontWeight: 500 }}>{s.inscrits}</span>
                  <span className="muted"> / {s.capacite}</span>
                </td>
                <td className="num tnum">
                  {s.status === 'passee' ? (
                    <strong style={{ color: s.valides >= s.inscrits * 0.9 ? '#16a34a' : 'var(--fg)', fontWeight: 600 }}>{s.valides}</strong>
                  ) : <span className="subtle">—</span>}
                </td>
                <td><SessionStatusBadge kind={s.status}/></td>
                <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                  <button className="btn btn-outline btn-sm" onClick={() => setOpenSession(s.id)}>
                    <Icon.Users size={13}/> {s.status === 'passee' ? 'Voir les inscrits' : 'Gérer les inscrits'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination {...paged}
        leftSlot={<span style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginRight: 12 }}>{paged.total} session{paged.total > 1 ? 's' : ''} — </span>}/>

      {planModal && <PlanSessionModal onCancel={() => setPlanModal(false)} onConfirm={() => setPlanModal(false)}/>}
    </div>
  );
};

// ─── Concours cell (used in formations table) ──────────────────

const ConcoursCell = ({ value }) => {
  if (!value || value === 'tous') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '2px 8px 2px 7px', borderRadius: 999,
        background: 'var(--slate-100)', color: 'var(--slate-700)',
        fontSize: 11.5, fontWeight: 600,
      }}>
        Tous concours
      </span>
    );
  }
  const isMonde = value.startsWith('monde');
  const edition = value.split('-')[1];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
      {isMonde
        ? <Icon.Globe size={12}  style={{ color: 'var(--burgundy-700)' }}/>
        : <Icon.Trophy size={12} style={{ color: 'var(--burgundy-800)' }}/>}
      <span style={{ fontWeight: 500 }}>{isMonde ? 'Monde' : 'France'}</span>
      <span className="tnum" style={{ color: 'var(--fg-muted)' }}>{edition}</span>
    </span>
  );
};

const SessionStatusBadge = ({ kind }) => {
  const map = {
    'planifiee': { bg: 'var(--burgundy-50)', fg: 'var(--burgundy-800)', dot: 'var(--burgundy-500)', label: 'Planifiée' },
    'passee':    { bg: 'var(--slate-100)',   fg: 'var(--slate-700)',    dot: 'var(--slate-500)',    label: 'Passée' },
  };
  const s = map[kind] || map.planifiee;
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

const PlanSessionModal = ({ onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);
  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 540, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '22px 26px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 6 }}>Nouvelle session</div>
            <h2 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>Planifier une formation</h2>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
        </div>
        <div style={{ padding: '18px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>
              Concours lié <span style={{ color: '#dc2626' }}>*</span>
            </span>
            <select className="input" defaultValue="france-2026">
              <option value="tous">Tous concours (formation générale)</option>
              <optgroup label="Concours France">
                <option value="france-2026">Concours France 2026</option>
                <option value="france-2025">Concours France 2025</option>
              </optgroup>
              <optgroup label="Concours Monde">
                <option value="monde-2026">Concours Monde 2026</option>
                <option value="monde-2025">Concours Monde 2025</option>
              </optgroup>
            </select>
            <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon.Info size={11}/>
              Détermine quels dégustateurs seront invités à s'inscrire.
            </div>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Date</span>
              <input type="date" className="input tnum"/></label>
            <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Heure</span>
              <input type="time" className="input tnum" defaultValue="09:00"/></label>
          </div>
          <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Lieu</span>
            <input className="input" placeholder="Maison des Vins, Mâcon"/></label>
          <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Formateur</span>
            <select className="input"><option>Patrick Léon</option><option>Sophie Levêque</option><option>Marc Dubois</option></select></label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Durée</span>
              <select className="input"><option>½ journée</option><option>1 journée</option><option>2 journées</option></select></label>
            <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Capacité max</span>
              <input type="number" className="input tnum" defaultValue={24}/></label>
          </div>
        </div>
        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button className="btn btn-primary" onClick={onConfirm} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Check size={13}/> Planifier
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page 2b — Fiche session de formation ─────────────────────────

const FORMATION_INSCRITS = [
  { id: 'DEG-0085', prenom: 'Sophie',   nom: 'Martin',   email: 'sophie.martin@vins71.fr',     formation: 'validee',    statut: 'inscrit',  presence: true  },
  { id: 'DEG-0086', prenom: 'Pierre',   nom: 'Garnier',  email: 'pierre.garnier@oeno.fr',      formation: 'validee',    statut: 'inscrit',  presence: true  },
  { id: 'DEG-0080', prenom: 'Isabelle', nom: 'Petit',    email: 'i.petit@degustation.com',     formation: 'validee',    statut: 'present', presence: true  },
  { id: 'DEG-0082', prenom: 'Hélène',   nom: 'Roux',     email: 'helene.roux@oeno.fr',         formation: 'validee',    statut: 'present', presence: true  },
  { id: 'DEG-0083', prenom: 'Antoine',  nom: 'Lefèvre',  email: 'antoine.lefevre@chai.fr',     formation: 'validee',    statut: 'present', presence: true  },
  { id: 'DEG-0079', prenom: 'Julien',   nom: 'Mercier',  email: 'julien@mercier-vins.fr',      formation: 'validee',    statut: 'inscrit',  presence: true  },
  { id: 'DEG-0076', prenom: 'Patricia', nom: 'Lambert',  email: 'p.lambert@chai.fr',           formation: 'validee',    statut: 'inscrit',  presence: true  },
  { id: 'DEG-0084', prenom: 'Claire',   nom: 'Dubois',   email: 'claire.dubois@chai.fr',       formation: 'renouveler', statut: 'inscrit',  presence: true  },
  { id: 'DEG-0078', prenom: 'Camille',  nom: 'Boyer',    email: 'camille.boyer@oeno.fr',       formation: 'non',        statut: 'inscrit',  presence: false },
  { id: 'DEG-0081', prenom: 'Marc',     nom: 'Durand',   email: 'marc.durand@vinsetcie.fr',    formation: 'renouveler', statut: 'absent',   presence: false },
];

const DEGUSTATEURS_DISPO = [
  { id: 'DEG-0075', nom: 'Romain Vidal',    email: 'romain.vidal@vinsdumonde.fr', formation: 'validee'    },
  { id: 'DEG-0077', nom: 'Olivier Faure',   email: 'o.faure@vignobles-faure.fr',  formation: 'validee'    },
  { id: 'DEG-0073', nom: 'Élise Bonnet',    email: 'e.bonnet@oeno.fr',            formation: 'renouveler' },
  { id: 'DEG-0072', nom: 'Vincent Caron',   email: 'v.caron@degustation.com',     formation: 'non'        },
  { id: 'DEG-0071', nom: 'Anaïs Renaud',    email: 'a.renaud@vins71.fr',          formation: 'validee'    },
];

const FormationSessionDetail = ({ session, onBack }) => {
  const passee = session.status === 'passee';
  const [inscrits, setInscrits] = React.useState(FORMATION_INSCRITS.slice(0, session.inscrits));
  const [addOpen, setAddOpen]   = React.useState(false);
  const [addQuery, setAddQuery] = React.useState('');

  const togglePresence = (id) => {
    setInscrits(list => list.map(i => i.id === id ? {
      ...i,
      presence: !i.presence,
      statut: !i.presence ? 'present' : 'absent',
    } : i));
  };
  const setStatut = (id, statut) => {
    setInscrits(list => list.map(i => i.id === id ? { ...i, statut } : i));
  };
  const remove = (id) => {
    setInscrits(list => list.filter(i => i.id !== id));
  };
  const add = (d) => {
    setInscrits(list => [...list, {
      id: d.id, prenom: d.nom.split(' ')[0], nom: d.nom.split(' ').slice(1).join(' '),
      email: d.email, formation: d.formation, statut: 'inscrit', presence: true,
    }]);
    setAddOpen(false);
    setAddQuery('');
  };

  const presents = inscrits.filter(i => i.presence).length;
  const absents  = inscrits.filter(i => !i.presence).length;
  const valideRule = inscrits.filter(i => i.presence).length;

  const filteredDispo = DEGUSTATEURS_DISPO.filter(d =>
    !inscrits.find(i => i.id === d.id) &&
    (addQuery === '' || d.nom.toLowerCase().includes(addQuery.toLowerCase()) || d.email.toLowerCase().includes(addQuery.toLowerCase()))
  );

  return (
    <div data-screen-label="admin-formation-session">
      <div style={{ marginBottom: 16 }}>
        <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, color: 'var(--fg-muted)' }}>
          <Icon.ChevronLeft size={14}/> Retour aux formations
        </button>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 6 }}>
          Administration <span style={{ color: 'var(--fg-subtle)', margin: '0 6px' }}>›</span>
          Dégustateurs <span style={{ color: 'var(--fg-subtle)', margin: '0 6px' }}>›</span>
          Formations <span style={{ color: 'var(--fg-subtle)', margin: '0 6px' }}>›</span>
          <span style={{ color: 'var(--fg)', fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>{session.id}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
              <h1 className="display" style={{ fontSize: 26, fontWeight: 500, margin: 0, letterSpacing: '-0.02em', fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>{session.id}</h1>
              <SessionStatusBadge kind={session.status}/>
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Icon.Calendar size={12} style={{ color: 'var(--fg-subtle)' }}/>
                <span className="tnum" style={{ color: 'var(--fg)', fontWeight: 500 }}>{session.date}</span>
                <span style={{ color: 'var(--fg-subtle)' }}>·</span>
                <span className="tnum">{session.heure} · {session.duree}</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Icon.Building size={12} style={{ color: 'var(--fg-subtle)' }}/>
                {session.lieu}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Icon.User size={12} style={{ color: 'var(--fg-subtle)' }}/>
                {session.formateur}
              </span>
              <span><ConcoursCell value={session.concours}/></span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline btn-sm"><Icon.Edit size={13}/> Modifier la session</button>
            {!passee && (
              <button className="btn btn-outline btn-sm" style={{ color: '#991b1b', borderColor: '#fecaca' }}>
                <Icon.X size={13}/> Annuler la session
              </button>
            )}
            {passee && (
              <button className="btn btn-primary btn-sm" style={{ background: 'var(--burgundy-800)' }}>
                <Icon.Check size={13}/> Valider les formations ({valideRule})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Capacity strip */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: passee ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)' }}>
          <CapacityCell label="Capacité" value={`${inscrits.length} / ${session.capacite}`} sub={inscrits.length >= session.capacite ? 'Complet' : `${session.capacite - inscrits.length} place${session.capacite - inscrits.length > 1 ? 's' : ''} dispo`} accent="burgundy"/>
          <CapacityCell label="Inscrits"  value={inscrits.length} sub="confirmés"/>
          {passee && <CapacityCell label="Présents" value={presents} sub={`${absents} absent${absents > 1 ? 's' : ''}`} accent="green"/>}
          <CapacityCell
            label={passee ? 'Validations attribuées' : 'Formation requise'}
            value={passee ? valideRule : inscrits.filter(i => i.formation !== 'validee').length}
            sub={passee ? 'présents = formation validée' : 'inscrits sans formation à jour'}
            accent={passee ? 'green' : 'amber'}
          />
        </div>
      </div>

      {/* Add bar */}
      {!passee && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12 }}>
          <h3 className="display" style={{ fontSize: 17, fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>Inscrits</h3>
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setAddOpen(o => !o)}
              disabled={inscrits.length >= session.capacite}
              style={{ background: 'var(--burgundy-800)', opacity: inscrits.length >= session.capacite ? 0.45 : 1 }}
            >
              <Icon.Plus size={13}/> Ajouter un dégustateur
            </button>
            {addOpen && (
              <>
                <div onClick={() => { setAddOpen(false); setAddQuery(''); }} style={{ position: 'fixed', inset: 0, zIndex: 50 }}/>
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                  background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
                  boxShadow: '0 12px 32px rgba(15,23,42,0.10)',
                  minWidth: 360, maxHeight: 380, zIndex: 60, overflow: 'hidden',
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ padding: 10, borderBottom: '1px solid var(--border)' }}>
                    <div className="input-with-icon">
                      <Icon.Search size={14} className="input-icon"/>
                      <input
                        className="input" autoFocus
                        placeholder="Rechercher un dégustateur…"
                        value={addQuery}
                        onChange={e => setAddQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div style={{ overflowY: 'auto', flex: 1 }}>
                    {filteredDispo.length === 0 ? (
                      <div style={{ padding: 24, textAlign: 'center', fontSize: 12.5, color: 'var(--fg-muted)' }}>
                        Aucun résultat
                      </div>
                    ) : filteredDispo.map(d => (
                      <button key={d.id} onClick={() => add(d)} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 14px', border: 'none', background: 'transparent',
                        textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{
                          width: 28, height: 28, borderRadius: 999,
                          background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 600, fontSize: 11, flexShrink: 0,
                        }}>
                          {d.nom.split(' ').map(w => w[0]).join('')}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>{d.nom}</div>
                          <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>{d.email}</div>
                        </div>
                        <FormationBadge kind={d.formation}/>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Dégustateur</th>
              <th>Email</th>
              <th>Formation actuelle</th>
              <th>Statut</th>
              {passee && <th style={{ width: 110 }}>Présence</th>}
              <th style={{ width: 36 }}></th>
            </tr>
          </thead>
          <tbody>
            {inscrits.map(i => (
              <tr key={i.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: 999,
                      background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 600, fontSize: 11, flexShrink: 0,
                    }}>
                      {i.prenom[0]}{i.nom[0]}
                    </span>
                    <div>
                      <div style={{ fontWeight: 500 }}>{i.prenom} {i.nom}</div>
                      <div className="muted" style={{ fontSize: 11.5, fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>{i.id}</div>
                    </div>
                  </div>
                </td>
                <td className="muted" style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', fontSize: 12.5 }}>{i.email}</td>
                <td><FormationBadge kind={i.formation}/></td>
                <td>
                  {passee
                    ? <PresenceStatusBadge kind={i.statut}/>
                    : <InscriptionFormationBadge kind={i.statut}/>}
                </td>
                {passee && (
                  <td>
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      cursor: 'pointer', fontSize: 12.5,
                      color: i.presence ? '#166534' : 'var(--fg-muted)',
                      fontWeight: 500,
                    }}>
                      <input
                        type="checkbox" checked={i.presence}
                        onChange={() => togglePresence(i.id)}
                        style={{ accentColor: '#16a34a', width: 16, height: 16 }}
                      />
                      {i.presence ? 'Présent' : 'Absent'}
                    </label>
                  </td>
                )}
                <td onClick={e => e.stopPropagation()}>
                  {!passee && (
                    <button className="btn btn-icon btn-sm btn-ghost" onClick={() => remove(i.id)} title="Désinscrire">
                      <Icon.X size={13}/>
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {inscrits.length === 0 && (
              <tr><td colSpan={passee ? 6 : 5} style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--fg-muted)', fontSize: 13 }}>
                Aucun dégustateur inscrit
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {passee && (
        <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--slate-50)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5, color: 'var(--fg-muted)' }}>
          <Icon.Info size={14} style={{ marginTop: 2, flexShrink: 0 }}/>
          <span>Les dégustateurs marqués <strong style={{ color: '#166534', fontWeight: 600 }}>Présent</strong> verront leur formation validée pour 3 ans à la clôture de la session.</span>
        </div>
      )}
    </div>
  );
};

const CapacityCell = ({ label, value, sub, accent }) => {
  const palette = {
    burgundy: { color: 'var(--burgundy-800)' },
    green:    { color: '#16a34a' },
    amber:    { color: '#a16207' },
  }[accent] || { color: 'var(--fg)' };
  return (
    <div style={{ padding: '16px 20px', borderRight: '1px solid var(--border)' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <div className="display tnum" style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.01em', marginTop: 4, color: palette.color }}>{value}</div>
      <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 2 }}>{sub}</div>
    </div>
  );
};

const InscriptionFormationBadge = ({ kind }) => {
  const map = {
    inscrit: { bg: '#eff6ff', fg: '#1e40af', dot: '#3b82f6', label: 'Inscrit' },
    absent:  { bg: 'var(--slate-100)', fg: 'var(--slate-600)', dot: 'var(--slate-400)', label: 'Désinscrit' },
  };
  const s = map[kind] || map.inscrit;
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

const PresenceStatusBadge = ({ kind }) => {
  const map = {
    inscrit: { bg: '#eff6ff',          fg: '#1e40af',          dot: '#3b82f6', label: 'Inscrit (non pointé)' },
    present: { bg: '#dcfce7',          fg: '#166534',          dot: '#16a34a', label: 'Présent' },
    absent:  { bg: '#fef2f2',          fg: '#991b1b',          dot: '#dc2626', label: 'Absent' },
  };
  const s = map[kind] || map.inscrit;
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

// ─── Page 3 — Repas ───────────────────────────────────────────────

const AdminRepas = () => {
  const DATES = [
    { id: '13-04', label: '13 avril 2026',           short: 'Lun 13/04', concours: 'france-2026', traiteur: 'Mâcon Gastronomie', lieu: 'Restaurant des Vins',     heure: '12h30' },
    { id: '14-04', label: '14 avril 2026',           short: 'Mar 14/04', concours: 'france-2026', traiteur: 'Mâcon Gastronomie', lieu: 'Restaurant des Vins',     heure: '12h30' },
    { id: '15-04', label: '15 avril 2026',           short: 'Mer 15/04', concours: 'france-2026', traiteur: 'Mâcon Gastronomie', lieu: 'Restaurant des Vins',     heure: '12h30' },
    { id: '16-04', label: '16 avril 2026',           short: 'Jeu 16/04', concours: 'france-2026', traiteur: 'Mâcon Gastronomie', lieu: 'Restaurant des Vins',     heure: '12h30' },
    { id: '17-04', label: '17 avril 2026 (banquet)', short: 'Ven 17/04', concours: 'france-2026', traiteur: 'Mâcon Gastronomie', lieu: 'Grand salon — Hôtel de Ville', heure: '20h00' },
  ];
  const [dateId, setDateId] = React.useState('14-04');
  const [openJury, setOpenJury] = React.useState(null);
  const [paramModal, setParamModal] = React.useState(false);

  const JURYS_DAY = {
    '13-04': [
      { jury: 'Jury A1', salle: 'Salle Mâcon',     degustateurs: [
        { nom: 'Sophie Martin',    regime: 'veg' },
        { nom: 'Pierre Garnier',   regime: 'allergie', detail: 'Arachides' },
        { nom: 'Patricia Lambert', regime: null },
        { nom: 'Romain Vidal',     regime: null },
        { nom: 'Julien Mercier',   regime: null },
      ]},
      { jury: 'Jury A2', salle: 'Salle Pouilly',   degustateurs: [
        { nom: 'Marc Durand',      regime: null },
        { nom: 'Camille Boyer',    regime: null },
        { nom: 'Antoine Lefèvre',  regime: null },
        { nom: 'Hélène Roux',       regime: null },
        { nom: 'Isabelle Petit',   regime: null },
      ]},
      { jury: 'Jury B1', salle: 'Salle Beaune',    degustateurs: [
        { nom: 'Olivier Faure',    regime: 'sans_gluten' },
        { nom: 'Claire Dubois',    regime: 'allergie', detail: 'Fruits à coque' },
        { nom: 'Élise Bonnet',     regime: null },
        { nom: 'Vincent Caron',    regime: null },
        { nom: 'Anaïs Renaud',     regime: null },
        { nom: 'Théo Lemaire',     regime: null },
      ]},
    ],
    '14-04': [
      { jury: 'Jury A1', salle: 'Salle Mâcon',     degustateurs: [
        { nom: 'Sophie Martin',    regime: 'veg' },
        { nom: 'Pierre Garnier',   regime: 'allergie', detail: 'Arachides' },
        { nom: 'Patricia Lambert', regime: null },
        { nom: 'Romain Vidal',     regime: null },
        { nom: 'Julien Mercier',   regime: null },
      ]},
      { jury: 'Jury A2', salle: 'Salle Pouilly',   degustateurs: [
        { nom: 'Marc Durand',      regime: 'veg' },
        { nom: 'Camille Boyer',    regime: 'sans_gluten' },
        { nom: 'Antoine Lefèvre',  regime: 'allergie', detail: 'Lactose' },
        { nom: 'Hélène Roux',       regime: null },
        { nom: 'Isabelle Petit',   regime: null },
        { nom: 'Olivier Faure',    regime: null },
      ]},
      { jury: 'Jury A3', salle: 'Salle Solutré',   degustateurs: [
        { nom: 'Claire Dubois',    regime: null },
        { nom: 'Élise Bonnet',     regime: null },
        { nom: 'Vincent Caron',    regime: null },
        { nom: 'Anaïs Renaud',     regime: null },
        { nom: 'Théo Lemaire',     regime: null },
        { nom: 'Lucas Bertin',     regime: null },
      ]},
      { jury: 'Jury B1', salle: 'Salle Beaune',    degustateurs: [
        { nom: 'Sophie Léonard',   regime: 'veg' },
        { nom: 'Marc Dubois',      regime: 'veg' },
        { nom: 'Anne Mercier',     regime: 'allergie', detail: 'Fruits à coque' },
        { nom: 'David Charles',    regime: null },
        { nom: 'Nathalie Picard',  regime: null },
        { nom: 'Yves Berger',      regime: null },
      ]},
      { jury: 'Jury B2', salle: 'Salle Mercurey',  degustateurs: [
        { nom: 'Brigitte Vannier', regime: 'allergie', detail: 'Crustacés' },
        { nom: 'Pierre Lacombe',   regime: null },
        { nom: 'Aurélien Martel',  regime: null },
        { nom: 'Catherine Joly',   regime: null },
        { nom: 'François Garin',   regime: null },
      ]},
      { jury: 'Jury B3', salle: 'Salle Givry',     degustateurs: [
        { nom: 'Patrick Léon',     regime: 'sans_gluten' },
        { nom: 'Sandra Aubry',     regime: null },
        { nom: 'Béatrice Carlier', regime: null },
        { nom: 'Marc Vidal',       regime: null },
        { nom: 'Jean-Luc Brun',    regime: null },
      ]},
    ],
    '15-04': [
      { jury: 'Jury C1', salle: 'Salle Mâcon',     degustateurs: [
        { nom: 'Sophie Martin',    regime: 'veg' },
        { nom: 'Pierre Garnier',   regime: null },
        { nom: 'Patricia Lambert', regime: null },
        { nom: 'Romain Vidal',     regime: null },
        { nom: 'Julien Mercier',   regime: null },
        { nom: 'Marc Dubois',      regime: null },
      ]},
      { jury: 'Jury C2', salle: 'Salle Pouilly',   degustateurs: [
        { nom: 'Camille Boyer',    regime: 'sans_gluten' },
        { nom: 'Antoine Lefèvre',  regime: 'allergie', detail: 'Arachides, Lactose' },
        { nom: 'Hélène Roux',       regime: null },
        { nom: 'Isabelle Petit',   regime: null },
        { nom: 'Olivier Faure',    regime: null },
      ]},
      { jury: 'Jury C3', salle: 'Salle Beaune',    degustateurs: [
        { nom: 'Claire Dubois',    regime: 'veg' },
        { nom: 'Élise Bonnet',     regime: null },
        { nom: 'Vincent Caron',    regime: null },
        { nom: 'Anaïs Renaud',     regime: null },
        { nom: 'Théo Lemaire',     regime: null },
        { nom: 'Lucas Bertin',     regime: null },
      ]},
    ],
    '16-04': [
      { jury: 'Jury D1', salle: 'Salle Mâcon',     degustateurs: [
        { nom: 'Sophie Martin',    regime: null },
        { nom: 'Pierre Garnier',   regime: null },
        { nom: 'Patricia Lambert', regime: null },
        { nom: 'Romain Vidal',     regime: null },
        { nom: 'Julien Mercier',   regime: null },
        { nom: 'Marc Dubois',      regime: null },
      ]},
      { jury: 'Jury D2', salle: 'Salle Pouilly',   degustateurs: [
        { nom: 'Camille Boyer',    regime: 'veg' },
        { nom: 'Antoine Lefèvre',  regime: 'veg' },
        { nom: 'Hélène Roux',       regime: 'allergie', detail: 'Crustacés' },
        { nom: 'Isabelle Petit',   regime: null },
        { nom: 'Olivier Faure',    regime: null },
        { nom: 'Claire Dubois',    regime: null },
      ]},
    ],
    '17-04': [
      { jury: 'BANQUET', salle: 'Grand salon — Hôtel de Ville', degustateurs: Array.from({ length: 86 }).map((_, i) => ({
        nom: `Dégustateur #${String(i + 1).padStart(2, '0')}`,
        regime: i < 6 ? 'veg' : i < 9 ? 'sans_gluten' : i < 13 ? 'allergie' : null,
        detail: i < 13 && i >= 9 ? ['Arachides', 'Crustacés', 'Lactose', 'Fruits à coque'][i - 9] : null,
      })) },
    ],
  };

  const jurys = JURYS_DAY[dateId] || [];
  const date = DATES.find(d => d.id === dateId);

  const juryStats = (j) => ({
    deg: j.degustateurs.length,
    veg: j.degustateurs.filter(d => d.regime === 'veg').length,
    sg:  j.degustateurs.filter(d => d.regime === 'sans_gluten').length,
    allergies: [...new Set(j.degustateurs.filter(d => d.regime === 'allergie').map(d => d.detail))],
  });

  const totalDeg = jurys.reduce((a, j) => a + j.degustateurs.length, 0);
  const totalVeg = jurys.reduce((a, j) => a + juryStats(j).veg, 0);
  const totalSg  = jurys.reduce((a, j) => a + juryStats(j).sg, 0);
  const allAllerg = [...new Set(jurys.flatMap(j => juryStats(j).allergies))];

  return (
    <div data-screen-label="admin-repas">
      <PageHeader
        breadcrumb={['Administration', 'Dégustateurs', 'Repas']}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span>Repas dégustateurs</span>
            <SalonPicker
              salons={DATES.map(d => ({ id: d.id, label: d.label }))}
              value={dateId}
              onChange={setDateId}
            />
          </div>
        }
        subtitle={`${totalDeg} dégustateurs · ${jurys.length} ${jurys.length > 1 ? 'jurys' : 'jury'} · Concours France 2026 · Traiteur ${date.traiteur}`}
        actions={<>
          <button className="btn btn-outline btn-sm" onClick={() => setParamModal(true)}><Icon.Settings size={13}/> Paramètres du repas</button>
          <button className="btn btn-outline btn-sm"><Icon.Printer size={14}/> Imprimer</button>
          <button className="btn btn-primary btn-sm" style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Download size={14}/> Exporter pour traiteur (CSV)
          </button>
        </>}
      />

      {/* Info banner */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', marginBottom: 16, background: 'var(--slate-50)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12.5, color: 'var(--fg-muted)' }}>
        <Icon.Info size={13} style={{ marginTop: 2, flexShrink: 0 }}/>
        <span>Les repas sont générés automatiquement depuis les jurys planifiés. Utiliser <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Paramètres du repas</strong> pour modifier le traiteur, le lieu ou l'heure.</span>
      </div>

      {/* Day summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total repas',         n: totalDeg, icon: <Icon.Users size={16}/>,         color: 'burgundy' },
          { label: 'Végétariens',         n: totalVeg, icon: <Icon.Grape size={16}/>,         color: 'green'    },
          { label: 'Sans gluten',         n: totalSg,  icon: <Icon.ShieldCheck size={16}/>,   color: 'amber'    },
          { label: 'Allergies signalées', n: allAllerg.length, icon: <Icon.AlertCircle size={16}/>, color: 'red', warn: allAllerg.length > 0 },
        ].map(k => {
          const palette = {
            burgundy: { bg: 'var(--burgundy-50)', fg: 'var(--burgundy-800)' },
            green:    { bg: '#dcfce7',           fg: '#166534' },
            amber:    { bg: '#fef3c7',           fg: '#a16207' },
            red:      { bg: '#fef2f2',           fg: '#991b1b' },
          }[k.color];
          return (
            <div key={k.label} className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                width: 36, height: 36, borderRadius: 9,
                background: palette.bg, color: palette.fg,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{k.icon}</span>
              <div>
                <div className="tnum display" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1 }}>{k.n}</div>
                <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 4 }}>{k.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Jury</th>
              <th>Salle</th>
              <th className="num">Dégustateurs</th>
              <th>Végétariens</th>
              <th>Sans gluten</th>
              <th>Allergies / Restrictions</th>
            </tr>
          </thead>
          <tbody>
            {jurys.map(j => {
              const stats = juryStats(j);
              return (
              <tr key={j.jury} style={{ cursor: 'pointer' }} onClick={() => setOpenJury(j)}>
                <td style={{ fontWeight: 600, color: 'var(--burgundy-800)' }}>{j.jury}</td>
                <td>{j.salle}</td>
                <td className="num tnum" style={{ fontWeight: 600 }}>{stats.deg}</td>
                <td>{stats.veg > 0 ? <DietBadge n={stats.veg} kind="veg"/> : <span className="subtle">—</span>}</td>
                <td>{stats.sg  > 0 ? <DietBadge n={stats.sg}  kind="sg"/>  : <span className="subtle">—</span>}</td>
                <td>
                  {stats.allergies.length === 0 ? <span className="subtle">—</span> : (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {stats.allergies.map(a => (
                        <span key={a} style={{
                          fontSize: 11, padding: '2px 7px', borderRadius: 999,
                          background: '#fef2f2', color: '#991b1b',
                          fontWeight: 500,
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                        }}>
                          <Icon.AlertCircle size={10}/>{a}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      {openJury && <JuryRepasSheet jury={openJury} date={date} onClose={() => setOpenJury(null)}/>}
      {paramModal && <RepasParamsModal date={date} onCancel={() => setParamModal(false)} onConfirm={() => setParamModal(false)}/>}
    </div>
  );
};

// ─── Side sheet : détail jury repas (read-only) ───────────────

const JuryRepasSheet = ({ jury, date, onClose }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  const veg = jury.degustateurs.filter(d => d.regime === 'veg').length;
  const sg  = jury.degustateurs.filter(d => d.regime === 'sans_gluten').length;
  const allergies = jury.degustateurs.filter(d => d.regime === 'allergie').length;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)' }}/>
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 460, maxWidth: '95vw', zIndex: 101,
        background: 'var(--surface)', borderLeft: '1px solid var(--border)',
        boxShadow: '-20px 0 40px rgba(15,23,42,0.10)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 6 }}>Détail repas</div>
              <h2 className="display" style={{ fontSize: 22, fontWeight: 500, margin: 0, letterSpacing: '-0.02em', color: 'var(--burgundy-800)' }}>{jury.jury}</h2>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>
                {jury.salle} · <span className="tnum">{date.heure}</span>
              </div>
            </div>
            <button onClick={onClose} className="btn btn-icon btn-sm btn-ghost" aria-label="Fermer">
              <Icon.X size={14}/>
            </button>
          </div>

          {/* Summary chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px 4px 8px', borderRadius: 999,
              background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
              fontSize: 12, fontWeight: 600,
            }}>
              <Icon.Users size={11}/><span className="tnum">{jury.degustateurs.length}</span> total
            </span>
            {veg > 0 && <DietBadge n={veg} kind="veg"/>}
            {sg  > 0 && <DietBadge n={sg}  kind="sg"/>}
            {allergies > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 8px', borderRadius: 999,
                background: '#fef2f2', color: '#991b1b',
                fontSize: 11.5, fontWeight: 600,
              }}>
                <Icon.AlertCircle size={10}/>{allergies} allergie{allergies > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {jury.degustateurs.map((d, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 22px',
              borderBottom: i < jury.degustateurs.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{
                width: 30, height: 30, borderRadius: 999,
                background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, fontSize: 11, flexShrink: 0,
              }}>
                {d.nom.split(' ').filter(w => w.length > 1).slice(0, 2).map(w => w[0]).join('').toUpperCase()}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>{d.nom}</div>
                {d.regime === 'allergie' && d.detail && (
                  <div style={{ fontSize: 11.5, color: '#991b1b', marginTop: 1, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Icon.AlertCircle size={10}/>{d.detail}
                  </div>
                )}
                {(d.regime === 'veg' || d.regime === 'sans_gluten') && (
                  <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 1 }}>
                    {d.regime === 'veg' ? 'Menu végétarien' : 'Menu sans gluten'}
                  </div>
                )}
              </div>
              {d.regime === 'veg' && <DietBadge n={1} kind="veg"/>}
              {d.regime === 'sans_gluten' && <DietBadge n={1} kind="sg"/>}
              {d.regime === 'allergie' && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '2px 8px', borderRadius: 999,
                  background: '#fef2f2', color: '#991b1b',
                  fontSize: 11, fontWeight: 600,
                }}>
                  <Icon.AlertCircle size={10}/>Allergie
                </span>
              )}
              {d.regime === null && <span className="subtle" style={{ fontSize: 11.5 }}>Menu standard</span>}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 22px', borderTop: '1px solid var(--border)', background: 'var(--slate-50)', fontSize: 11.5, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon.Info size={12}/>
          Vue lecture seule — les régimes sont déclarés par les dégustateurs
        </div>
      </aside>
    </>
  );
};

// ─── Modal : Paramètres du repas ──────────────────────────

const RepasParamsModal = ({ date, onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);
  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 460, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '22px 26px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 6 }}>Paramètres logistiques</div>
            <h2 className="display" style={{ fontSize: 19, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>Repas du {date.label}</h2>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
        </div>
        <div style={{ padding: '18px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label className="field">
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Traiteur</span>
            <input className="input" defaultValue={date.traiteur}/>
          </label>
          <label className="field">
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Lieu du repas</span>
            <input className="input" defaultValue={date.lieu}/>
          </label>
          <label className="field">
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Heure</span>
            <input type="time" className="input tnum" defaultValue={date.heure.replace('h', ':')}/>
          </label>
          <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'flex-start', gap: 6 }}>
            <Icon.Info size={11} style={{ marginTop: 2 }}/>
            <span>La date et les jurys du jour sont déterminés par la planification des jurys et ne sont pas modifiables ici.</span>
          </div>
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

const DietBadge = ({ n, kind }) => {
  const map = {
    veg: { bg: '#dcfce7', fg: '#166534', label: 'végé' },
    sg:  { bg: '#fef3c7', fg: '#a16207', label: 'sans gluten' },
  };
  const s = map[kind];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 999,
      background: s.bg, color: s.fg,
      fontSize: 11.5, fontWeight: 600,
    }}>
      <span className="tnum">{n}</span>{s.label}
    </span>
  );
};

// ─── Page 4 — Jurys ───────────────────────────────────────────────

const AdminJurys = () => {
  const [createModal, setCreateModal] = React.useState(false);
  const [openJury,    setOpenJury]    = React.useState(null);
  const [concoursId,  setConcoursId]  = React.useState('france-2026');

  const CONCOURS_OPTS = [
    { id: 'france-2026', label: 'Concours France 2026' },
    { id: 'monde-2026',  label: 'Concours Monde 2026' },
    { id: 'france-2025', label: 'Concours France 2025' },
  ];

  const JURYS = [
    { id: 'J-A1', nom: 'Jury A1', date: '14/04/2026', heure: '09h00', salle: 'Salle Mâcon',     president: 'Patrick Léon',     deg: 5, capacite: 6, ech: 32, status: 'complet' },
    { id: 'J-A2', nom: 'Jury A2', date: '14/04/2026', heure: '09h00', salle: 'Salle Pouilly',   president: 'Sophie Martin',    deg: 6, capacite: 6, ech: 36, status: 'complet' },
    { id: 'J-A3', nom: 'Jury A3', date: '14/04/2026', heure: '09h00', salle: 'Salle Solutré',   president: 'Marc Dubois',      deg: 4, capacite: 6, ech: 28, status: 'incomplet' },
    { id: 'J-B1', nom: 'Jury B1', date: '14/04/2026', heure: '14h00', salle: 'Salle Beaune',    president: 'Hélène Roux',      deg: 6, capacite: 6, ech: 30, status: 'complet' },
    { id: 'J-B2', nom: 'Jury B2', date: '14/04/2026', heure: '14h00', salle: 'Salle Mercurey',  president: 'Isabelle Petit',   deg: 5, capacite: 6, ech: 26, status: 'incomplet' },
    { id: 'J-B3', nom: 'Jury B3', date: '14/04/2026', heure: '14h00', salle: 'Salle Givry',     president: 'Antoine Lefèvre',  deg: 5, capacite: 6, ech: 28, status: 'incomplet' },
    { id: 'J-C1', nom: 'Jury C1', date: '15/04/2026', heure: '09h00', salle: 'Salle Mâcon',     president: 'Patrick Léon',     deg: 6, capacite: 6, ech: 32, status: 'complet' },
  ];

  if (openJury) {
    return <JuryComposition jury={JURYS.find(j => j.id === openJury)} onBack={() => setOpenJury(null)}/>;
  }

  const paged = useSortablePaged(JURYS, {
    defaultPageSize: 25,
    accessors: {
      id: j => j.id, salle: j => j.salle, president: j => j.president,
      date: j => { const [d,m,y] = j.date.split('/'); return new Date(+y, +m-1, +d).getTime(); },
      comp: j => j.deg, ech: j => j.ech, status: j => j.status,
    },
  });

  return (
    <div data-screen-label="admin-jurys">
      <PageHeader
        breadcrumb={['Administration', 'Dégustateurs', 'Jurys']}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span>Composition des jurys</span>
            <SalonPicker salons={CONCOURS_OPTS} value={concoursId} onChange={setConcoursId}/>
          </div>
        }
        subtitle={`${JURYS.length} jurys planifiés · ${JURYS.reduce((a, j) => a + j.deg, 0)}/${JURYS.reduce((a, j) => a + j.capacite, 0)} sièges pourvus`}
        actions={<>
          <button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => setCreateModal(true)} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Plus size={14}/> Créer un jury
          </button>
        </>}
      />

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <SortableTh sortKey="id"        currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Jury</SortableTh>
              <SortableTh sortKey="date"      currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Date</SortableTh>
              <SortableTh sortKey="salle"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Salle</SortableTh>
              <SortableTh sortKey="president" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Président</SortableTh>
              <SortableTh sortKey="comp"      currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Composition</SortableTh>
              <SortableTh sortKey="ech"       currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Échantillons</SortableTh>
              <SortableTh sortKey="status"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Statut</SortableTh>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.map(j => (
              <tr key={j.id} style={{ cursor: 'pointer' }} onClick={() => setOpenJury(j.id)}>
                <td style={{ fontWeight: 600, color: 'var(--burgundy-800)' }}>{j.nom}</td>
                <td>
                  <div className="tnum" style={{ fontWeight: 500 }}>{j.date}</div>
                  <div className="muted" style={{ fontSize: 11.5 }}>{j.heure}</div>
                </td>
                <td className="muted">{j.salle}</td>
                <td>{j.president}</td>
                <td className="num tnum">
                  <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>{j.deg}</strong>
                  <span className="muted"> / {j.capacite}</span>
                </td>
                <td className="num tnum">{j.ech}</td>
                <td><JuryStatusBadge kind={j.status}/></td>
                <td><Icon.ChevronRight size={13} style={{ color: 'var(--fg-subtle)' }}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination {...paged}
        leftSlot={<span style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginRight: 12 }}>{paged.total} jury{paged.total > 1 ? 's' : ''} — </span>}/>

      {createModal && (
        <div onClick={() => setCreateModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} className="card" style={{ width: 480, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '22px 26px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <h2 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Créer un jury</h2>
              <button onClick={() => setCreateModal(false)} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
            </div>
            <div style={{ padding: '18px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label className="field">
                <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>
                  Concours lié <span style={{ color: '#dc2626' }}>*</span>
                </span>
                <select className="input" defaultValue={concoursId}>
                  <optgroup label="Concours France">
                    <option value="france-2026">Concours France 2026</option>
                    <option value="france-2025">Concours France 2025</option>
                  </optgroup>
                  <optgroup label="Concours Monde">
                    <option value="monde-2026">Concours Monde 2026</option>
                  </optgroup>
                </select>
              </label>
              <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Nom du jury</span>
                <input className="input" placeholder="Ex. Jury E1"/></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Date</span>
                  <input type="date" className="input tnum"/></label>
                <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Salle</span>
                  <select className="input"><option>Salle Mâcon</option><option>Salle Pouilly</option><option>Salle Beaune</option></select></label>
              </div>
              <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Président·e</span>
                <select className="input"><option>Patrick Léon</option><option>Sophie Martin</option><option>Marc Dubois</option></select></label>
            </div>
            <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
              <button className="btn btn-outline" onClick={() => setCreateModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={() => setCreateModal(false)} style={{ background: 'var(--burgundy-800)' }}>
                <Icon.Check size={13}/> Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const JuryStatusBadge = ({ kind }) => {
  const map = {
    complet:   { bg: '#dcfce7', fg: '#166534', dot: '#16a34a', label: 'Complet' },
    incomplet: { bg: '#fef3c7', fg: '#a16207', dot: '#f59e0b', label: 'Incomplet' },
    annule:    { bg: '#fef2f2', fg: '#991b1b', dot: '#dc2626', label: 'Annulé' },
  };
  const s = map[kind] || map.incomplet;
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

// ─── Fiche jury : drag & drop composition ─────────────────────────

const JuryComposition = ({ jury, onBack }) => {
  // Assigned dégustateurs (mock)
  const [assigned, setAssigned] = React.useState([
    { id: 'DEG-0085', nom: 'Sophie Martin',   role: 'Présidente', formation: 'validee' },
    { id: 'DEG-0086', nom: 'Pierre Garnier',  role: 'Membre',     formation: 'validee' },
    { id: 'DEG-0080', nom: 'Isabelle Petit',  role: 'Membre',     formation: 'validee' },
    { id: 'DEG-0082', nom: 'Hélène Roux',     role: 'Membre',     formation: 'validee' },
    { id: 'DEG-0083', nom: 'Antoine Lefèvre', role: 'Membre',     formation: 'validee' },
  ]);
  const [available, setAvailable] = React.useState([
    { id: 'DEG-0079', nom: 'Julien Mercier',   formation: 'validee' },
    { id: 'DEG-0076', nom: 'Patricia Lambert', formation: 'validee' },
    { id: 'DEG-0075', nom: 'Romain Vidal',     formation: 'validee' },
    { id: 'DEG-0084', nom: 'Claire Dubois',    formation: 'renouveler' },
  ]);
  const [dragId, setDragId] = React.useState(null);

  const assign = (d) => {
    if (assigned.length >= jury.capacite) return;
    setAvailable(a => a.filter(x => x.id !== d.id));
    setAssigned(a => [...a, { ...d, role: 'Membre' }]);
  };
  const unassign = (d) => {
    if (d.role === 'Présidente' || d.role === 'Président') return;
    setAssigned(a => a.filter(x => x.id !== d.id));
    setAvailable(a => [...a, { id: d.id, nom: d.nom, formation: d.formation }]);
  };

  return (
    <div data-screen-label="admin-jury-detail">
      <div style={{ marginBottom: 16 }}>
        <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, color: 'var(--fg-muted)' }}>
          <Icon.ChevronLeft size={14}/> Retour aux jurys
        </button>
      </div>

      <PageHeader
        breadcrumb={['Administration', 'Dégustateurs', 'Jurys', jury.nom]}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span>{jury.nom}</span>
            <JuryStatusBadge kind={assigned.length >= jury.capacite ? 'complet' : 'incomplet'}/>
          </div>
        }
        subtitle={`${jury.date} à ${jury.heure} · ${jury.salle} · ${jury.ech} échantillons à déguster`}
        actions={<>
          <button className="btn btn-outline btn-sm"><Icon.Edit size={13}/> Modifier les infos</button>
          <button className="btn btn-primary btn-sm" style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Check size={13}/> Enregistrer la composition
          </button>
        </>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* Assigned */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'var(--burgundy-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--burgundy-800)' }}>Composition</div>
              <div className="display tnum" style={{ fontSize: 22, fontWeight: 500, color: 'var(--burgundy-800)', letterSpacing: '-0.01em', marginTop: 2 }}>
                {assigned.length} / {jury.capacite} sièges
              </div>
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              {Array.from({ length: jury.capacite }).map((_, i) => (
                <span key={i} style={{
                  width: 14, height: 14, borderRadius: 999,
                  background: i < assigned.length ? 'var(--burgundy-800)' : 'transparent',
                  border: i < assigned.length ? 'none' : '1.5px dashed var(--burgundy-300)',
                }}/>
              ))}
            </div>
          </div>
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const d = available.find(x => x.id === dragId);
              if (d) assign(d);
              setDragId(null);
            }}
            style={{ minHeight: 200 }}
          >
            {assigned.map((d, idx) => (
              <div key={d.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 18px',
                borderTop: idx > 0 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 999,
                  background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600, fontSize: 12, flexShrink: 0,
                }}>
                  {d.nom.split(' ').map(w => w[0]).join('')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{d.nom}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 1, fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>{d.id}</div>
                </div>
                <span style={{
                  fontSize: 11, padding: '2px 8px', borderRadius: 4,
                  background: d.role === 'Présidente' || d.role === 'Président' ? 'var(--burgundy-800)' : 'var(--slate-100)',
                  color: d.role === 'Présidente' || d.role === 'Président' ? '#fff' : 'var(--fg-muted)',
                  fontWeight: 600,
                }}>{d.role}</span>
                <button
                  className="btn btn-icon btn-sm btn-ghost"
                  onClick={() => unassign(d)}
                  disabled={d.role === 'Présidente' || d.role === 'Président'}
                  style={d.role === 'Présidente' || d.role === 'Président' ? { opacity: 0.25 } : {}}
                  title={d.role === 'Présidente' || d.role === 'Président' ? 'Le président ne peut être retiré' : 'Retirer'}
                >
                  <Icon.X size={13}/>
                </button>
              </div>
            ))}
            {assigned.length < jury.capacite && (
              <div style={{
                margin: '12px 18px',
                padding: '18px 14px',
                border: '2px dashed var(--border)',
                borderRadius: 8,
                textAlign: 'center', fontSize: 12.5, color: 'var(--fg-muted)',
                background: 'var(--slate-50)',
              }}>
                Glisser un dégustateur depuis la liste ou cliquer sur <Icon.Plus size={11} style={{ verticalAlign: '-2px' }}/> dans la colonne de droite
              </div>
            )}
          </div>
        </div>

        {/* Available */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'var(--slate-50)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Dégustateurs disponibles</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{available.length} disponibles ce jour
</div>
          </div>
          <div>
            {available.map((d, idx) => (
              <div
                key={d.id}
                draggable
                onDragStart={() => setDragId(d.id)}
                onDragEnd={() => setDragId(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 16px',
                  borderTop: idx > 0 ? '1px solid var(--border)' : 'none',
                  cursor: 'grab',
                  background: dragId === d.id ? 'var(--burgundy-50)' : 'transparent',
                }}
              >
                <Icon.Menu size={12} style={{ color: 'var(--fg-subtle)' }}/>
                <div style={{
                  width: 28, height: 28, borderRadius: 999,
                  background: 'var(--slate-100)', color: 'var(--slate-700)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600, fontSize: 11, flexShrink: 0,
                }}>
                  {d.nom.split(' ').map(w => w[0]).join('')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{d.nom}</div>
                  {d.formation === 'renouveler' && (
                    <div style={{ fontSize: 11, color: '#a16207', marginTop: 1, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Icon.AlertTriangle size={10}/> Formation à renouveler
                    </div>
                  )}
                </div>
                <button
                  className="btn btn-icon btn-sm btn-ghost"
                  onClick={() => assign(d)}
                  disabled={assigned.length >= jury.capacite}
                  style={assigned.length >= jury.capacite ? { opacity: 0.25, cursor: 'not-allowed' } : {}}
                  title="Affecter au jury"
                >
                  <Icon.Plus size={13}/>
                </button>
              </div>
            ))}
            {available.length === 0 && (
              <div style={{ padding: 24, textAlign: 'center', fontSize: 12.5, color: 'var(--fg-muted)' }}>
                Tous les dégustateurs disponibles sont déjà affectés.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Page 5 — Disponibilités ──────────────────────────────────────

const AdminDisponibilites = () => {
  const [view, setView] = React.useState('calendar'); // calendar | list
  const [openDay, setOpenDay] = React.useState(null);
  const [relance, setRelance] = React.useState(null); // { scope, day?, count }

  const TOTAL_DEG = 86;
  const WEEK_NON_DECLARANTS = 14;

  const openWeekRelance = () => setRelance({ scope: 'week', count: WEEK_NON_DECLARANTS });
  const openDayRelance = (d) => setRelance({ scope: 'day', day: d, count: (TOTAL_DEG - d.declares) + (d.requis - d.dispo > 0 ? d.requis - d.dispo : 0) });

  // Days of one week of degustation
  const DAYS = [
    { date: '13/04', label: 'Lun. 13/04', dispo: 28, requis: 24, declares: 38 },
    { date: '14/04', label: 'Mar. 14/04', dispo: 42, requis: 36, declares: 56 },
    { date: '15/04', label: 'Mer. 15/04', dispo: 24, requis: 30, declares: 32 },
    { date: '16/04', label: 'Jeu. 16/04', dispo: 18, requis: 24, declares: 24 },
    { date: '17/04', label: 'Ven. 17/04', dispo: 22, requis: 18, declares: 32 },
  ];

  return (
    <div data-screen-label="admin-disponibilites">
      <PageHeader
        breadcrumb={['Administration', 'Dégustateurs', 'Disponibilités']}
        title="Disponibilités jurys"
        subtitle="Édition 2026 · Semaine du 13 au 17 avril"
        actions={<>
          <div style={{
            display: 'inline-flex', padding: 3, gap: 2,
            background: 'var(--slate-100)', borderRadius: 8,
          }}>
            {[
              { id: 'calendar', label: 'Calendrier', icon: <Icon.Calendar size={13}/> },
              { id: 'list',     label: 'Liste',      icon: <Icon.ListChecks size={13}/> },
            ].map(m => (
              <button key={m.id} onClick={() => setView(m.id)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', border: 'none',
                background: view === m.id ? 'var(--surface)' : 'transparent',
                color: view === m.id ? 'var(--fg)' : 'var(--fg-muted)',
                borderRadius: 6, cursor: 'pointer', fontSize: 12.5, fontWeight: 500,
                fontFamily: 'inherit',
                boxShadow: view === m.id ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}>{m.icon}{m.label}</button>
            ))}
          </div>
          <button className="btn btn-outline btn-sm" onClick={openWeekRelance}><Icon.Send size={14}/> Relancer non-déclarants</button>
          <button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Export</button>
        </>}
      />

      {/* Critical alert */}
      {DAYS.some(d => d.dispo < d.requis) && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '14px 16px', marginBottom: 16,
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
        }}>
          <Icon.AlertTriangle size={16} style={{ color: '#dc2626', marginTop: 2, flexShrink: 0 }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#991b1b', marginBottom: 4 }}>
              {DAYS.filter(d => d.dispo < d.requis).length} {DAYS.filter(d => d.dispo < d.requis).length > 1 ? 'jours sont' : 'jour est'} en sous-effectif
            </div>
            <div style={{ fontSize: 12.5, color: '#7f1d1d' }}>
              Manque {DAYS.filter(d => d.dispo < d.requis).reduce((a, d) => a + (d.requis - d.dispo), 0)} dégustateurs sur la semaine. Relancer ceux qui n'ont pas encore déclaré leurs disponibilités.
            </div>
          </div>
          <button className="btn btn-sm" onClick={openWeekRelance} style={{ background: '#fff', border: '1px solid #fecaca', color: '#991b1b' }}>
            <Icon.Send size={12}/> Relancer
          </button>
        </div>
      )}

      {view === 'calendar' ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {DAYS.map((d, i) => {
              const ratio = d.dispo / d.requis;
              const critical = ratio < 1;
              const warning  = !critical && ratio < 1.2;
              const headerBg = critical ? '#fef2f2' : warning ? '#fefce8' : '#f0fdf4';
              const headerFg = critical ? '#991b1b' : warning ? '#854d0e' : '#166534';
              const headerBorder = critical ? '#fecaca' : warning ? '#fde68a' : '#bbf7d0';
              return (
                <div key={d.date} onClick={() => setOpenDay(d)} style={{
                  borderRight: i < DAYS.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer',
                  transition: 'background .12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    padding: '12px 14px',
                    background: headerBg, borderBottom: `1px solid ${headerBorder}`,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: headerFg, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{d.label}</div>
                    <div className="display tnum" style={{ fontSize: 24, fontWeight: 500, color: headerFg, letterSpacing: '-0.01em', marginTop: 4 }}>
                      {d.dispo} <span style={{ fontSize: 14, color: 'var(--fg-muted)' }}>/ {d.requis}</span>
                    </div>
                    <div style={{ fontSize: 11, color: headerFg, marginTop: 2, fontWeight: 500 }}>
                      {critical ? `Manque ${d.requis - d.dispo}` : warning ? 'Tendu' : 'OK'}
                    </div>
                  </div>
                  <div style={{ padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <DayLine label="Disponibles"  value={d.dispo}   color="var(--burgundy-800)"/>
                    <DayLine label="Requis"       value={d.requis}  color="var(--fg)"/>
                    <DayLine label="Ont déclaré"  value={d.declares} color="var(--fg-muted)"/>
                    <div style={{ marginTop: 6, paddingTop: 8, borderTop: '1px dashed var(--border)' }}>
                      <div style={{ fontSize: 10.5, color: 'var(--fg-muted)', marginBottom: 4, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Couverture</div>
                      <div style={{ position: 'relative', height: 6, background: 'var(--slate-100)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{
                          position: 'absolute', inset: 0,
                          width: `${Math.min(100, ratio * 100)}%`,
                          background: critical ? '#dc2626' : warning ? '#f59e0b' : '#16a34a',
                        }}/>
                        <div style={{ position: 'absolute', top: -2, bottom: -2, left: '100%', width: 2, background: 'var(--fg-subtle)', marginLeft: -1 }} title="Seuil 100%"/>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th className="num">Requis</th>
                <th className="num">Disponibles</th>
                <th className="num">Couverture</th>
                <th className="num">Ont déclaré</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {DAYS.map(d => {
                const ratio = d.dispo / d.requis;
                const critical = ratio < 1;
                const warning  = !critical && ratio < 1.2;
                return (
                  <tr key={d.date} style={{ cursor: 'pointer' }} onClick={() => setOpenDay(d)}>
                    <td className="tnum" style={{ fontWeight: 500 }}>{d.label}</td>
                    <td className="num tnum">{d.requis}</td>
                    <td className="num tnum" style={{ fontWeight: 600, color: critical ? '#991b1b' : 'var(--fg)' }}>{d.dispo}</td>
                    <td className="num tnum" style={{ color: critical ? '#dc2626' : warning ? '#a16207' : '#16a34a', fontWeight: 600 }}>
                      {Math.round(ratio * 100)}%
                    </td>
                    <td className="num tnum muted">{d.declares}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '3px 9px 3px 7px', borderRadius: 999,
                        background: critical ? '#fef2f2' : warning ? '#fefce8' : '#dcfce7',
                        color:      critical ? '#991b1b' : warning ? '#854d0e' : '#166534',
                        fontSize: 11.5, fontWeight: 600,
                      }}>
                        <span style={{ width: 7, height: 7, borderRadius: 999, background: critical ? '#dc2626' : warning ? '#f59e0b' : '#16a34a' }}/>
                        {critical ? `Manque ${d.requis - d.dispo}` : warning ? 'Tendu' : 'OK'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      {critical && (
                        <button className="btn btn-outline btn-sm" onClick={() => openDayRelance(d)}><Icon.Send size={12}/> Relancer</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {openDay && <DispoDaySheet day={openDay} onClose={() => setOpenDay(null)} onRelance={() => openDayRelance(openDay)}/>}
      {relance && <RelanceModal scope={relance.scope} day={relance.day} count={relance.count} onCancel={() => setRelance(null)} onConfirm={() => setRelance(null)}/>}
    </div>
  );
};

// ─── Side sheet : détail dispos d'un jour ──────────────────────

const DISPO_BY_DAY = {
  '13/04': {
    disponibles: [
      { id: 'DEG-0085', nom: 'Sophie Martin',    slot: 'journée' },
      { id: 'DEG-0086', nom: 'Pierre Garnier',   slot: 'matin' },
      { id: 'DEG-0080', nom: 'Isabelle Petit',   slot: 'journée' },
      { id: 'DEG-0082', nom: 'Hélène Roux',      slot: 'matin' },
      { id: 'DEG-0083', nom: 'Antoine Lefèvre', slot: 'après-midi' },
      { id: 'DEG-0079', nom: 'Julien Mercier',   slot: 'journée' },
      { id: 'DEG-0076', nom: 'Patricia Lambert', slot: 'journée' },
      { id: 'DEG-0075', nom: 'Romain Vidal',     slot: 'matin' },
      { id: 'DEG-0084', nom: 'Claire Dubois',    slot: 'journée' },
      { id: 'DEG-0078', nom: 'Camille Boyer',    slot: 'après-midi' },
    ],
    nonDeclarants: [
      { id: 'DEG-0073', nom: 'Élise Bonnet'   },
      { id: 'DEG-0072', nom: 'Vincent Caron'  },
      { id: 'DEG-0071', nom: 'Anaïs Renaud'   },
    ],
  },
};

const getDayDispo = (day) => {
  const base = DISPO_BY_DAY[day.date] || DISPO_BY_DAY['13/04'];
  // Adjust counts to roughly match the day's stats for visual coherence
  return {
    disponibles:  base.disponibles.slice(0, Math.max(3, Math.min(base.disponibles.length, day.dispo > 12 ? base.disponibles.length : Math.min(day.dispo, base.disponibles.length)))),
    nonDeclarants: base.nonDeclarants,
  };
};

const DispoDaySheet = ({ day, onClose, onRelance }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  const data = getDayDispo(day);
  const ratio = day.dispo / day.requis;
  const critical = ratio < 1;
  const warning  = !critical && ratio < 1.2;

  const slotColor = (s) => ({
    'journée':    { bg: 'var(--burgundy-50)', fg: 'var(--burgundy-800)' },
    'matin':      { bg: '#eff6ff', fg: '#1e40af' },
    'après-midi': { bg: '#fef3c7', fg: '#a16207' },
  }[s] || { bg: 'var(--slate-100)', fg: 'var(--fg-muted)' });

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)' }}/>
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 460, maxWidth: '95vw', zIndex: 101,
        background: 'var(--surface)', borderLeft: '1px solid var(--border)',
        boxShadow: '-20px 0 40px rgba(15,23,42,0.10)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 6 }}>Détail journée</div>
              <h2 className="display" style={{ fontSize: 22, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>{day.label}</h2>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span className="tnum"><strong style={{ color: 'var(--fg)', fontWeight: 600 }}>{day.dispo}</strong> / {day.requis} sièges</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '2px 8px 2px 7px', borderRadius: 999,
                  background: critical ? '#fef2f2' : warning ? '#fefce8' : '#dcfce7',
                  color:      critical ? '#991b1b' : warning ? '#854d0e' : '#166534',
                  fontSize: 11, fontWeight: 600,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: critical ? '#dc2626' : warning ? '#f59e0b' : '#16a34a' }}/>
                  {critical ? `Manque ${day.requis - day.dispo}` : warning ? 'Tendu' : 'OK'}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="btn btn-icon btn-sm btn-ghost" aria-label="Fermer">
              <Icon.X size={14}/>
            </button>
          </div>
        </div>

        {/* Lists */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Disponibles */}
          <div style={{ padding: '14px 22px 6px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Disponibles <span className="tnum" style={{ color: '#16a34a', marginLeft: 4 }}>{day.dispo}</span>
            </div>
          </div>
          {data.disponibles.map((d, i) => (
            <div key={d.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 22px',
              borderBottom: i < data.disponibles.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: 999,
                background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, fontSize: 11, flexShrink: 0,
              }}>
                {d.nom.split(' ').slice(0, 2).map(w => w[0]).join('')}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{d.nom}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', marginTop: 1 }}>{d.id}</div>
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 8px', borderRadius: 999,
                background: slotColor(d.slot).bg, color: slotColor(d.slot).fg,
                fontSize: 11, fontWeight: 600,
              }}>
                <Icon.Check size={10}/>{d.slot}
              </span>
            </div>
          ))}

          {/* Non-déclarants */}
          <div style={{ padding: '14px 22px 6px', marginTop: 8, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              N'ont pas encore déclaré <span className="tnum" style={{ color: '#a16207', marginLeft: 4 }}>{data.nonDeclarants.length}</span>
            </div>
            <button className="btn btn-outline btn-sm" onClick={onRelance}><Icon.Send size={12}/> Relancer tous</button>
          </div>
          {data.nonDeclarants.length === 0 ? (
            <div style={{ padding: '14px 22px', fontSize: 12.5, color: 'var(--fg-muted)', fontStyle: 'italic', textAlign: 'center' }}>
              Tous les dégustateurs concernés ont répondu.
            </div>
          ) : data.nonDeclarants.map((d, i) => (
            <div key={d.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 22px',
              borderBottom: i < data.nonDeclarants.length - 1 ? '1px solid var(--border)' : 'none',
              opacity: 0.85,
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: 999,
                background: 'var(--slate-100)', color: 'var(--slate-600)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, fontSize: 11, flexShrink: 0,
              }}>
                {d.nom.split(' ').slice(0, 2).map(w => w[0]).join('')}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-muted)' }}>{d.nom}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', marginTop: 1 }}>{d.id}</div>
              </div>
              <button className="btn btn-icon btn-sm btn-ghost" title="Relancer">
                <Icon.Send size={12}/>
              </button>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

const DayLine = ({ label, value, color }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 12 }}>
    <span style={{ color: 'var(--fg-muted)' }}>{label}</span>
    <span className="tnum" style={{ color: color, fontWeight: 600, fontSize: 13 }}>{value}</span>
  </div>
);

// ─── Modale : Relancer (semaine ou jour) ──────────────────────────

const RelanceModal = ({ scope, day, count, onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const dayLabelLong = day ? day.label.replace(/^(Lun|Mar|Mer|Jeu|Ven|Sam|Dim)\./, (m) => ({
    'Lun.': 'lundi', 'Mar.': 'mardi', 'Mer.': 'mercredi', 'Jeu.': 'jeudi', 'Ven.': 'vendredi', 'Sam.': 'samedi', 'Dim.': 'dimanche',
  }[m] || m)) : '';

  const isWeek = scope === 'week';
  const title = isWeek ? 'Relancer les non-déclarants' : `Relance ciblée — ${dayLabelLong}`;
  const sentence = isWeek
    ? <>Envoyer un rappel à <strong className="tnum" style={{ color: 'var(--fg)', fontWeight: 600 }}>{count} dégustateurs</strong> qui n'ont pas encore déclaré leurs disponibilités pour la semaine du <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>13 au 17 avril</strong> ?</>
    : <>Envoyer un rappel ciblé pour le <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>{dayLabelLong}</strong> à <strong className="tnum" style={{ color: 'var(--fg)', fontWeight: 600 }}>{count} dégustateurs</strong> non disponibles ou non déclarants ?</>;

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 480, padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '22px 26px 14px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Send size={13}/>
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>
                Rappel email
              </span>
            </div>
            <h2 className="display" style={{ fontSize: 19, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>{title}</h2>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost" aria-label="Fermer">
            <Icon.X size={14}/>
          </button>
        </div>

        <div style={{ padding: '18px 26px' }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--fg-muted)' }}>
            {sentence}
          </p>
          {!isWeek && day && (
            <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--slate-50)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
              <Icon.Info size={13} style={{ color: 'var(--fg-muted)', flexShrink: 0 }}/>
              <span style={{ color: 'var(--fg-muted)' }}>
                Inclut les dégustateurs <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>non déclarants</strong> et ceux qui ont marqué <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>"non disponible"</strong> pour cette journée.
              </span>
            </div>
          )}
        </div>

        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button className="btn btn-primary" onClick={onConfirm} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Send size={13}/> Envoyer le rappel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Fiche dégustateur ─────────────────────────────────────────────

const DEG_DETAIL = {
  ref:         'DEG-0086',
  prenom:      'Pierre',
  nom:         'Garnier',
  email:       'pierre.garnier@oeno.fr',
  tel:         '06 24 18 02 71',
  adresse:     '8 rue des Tonneliers, 71000 Mâcon',
  membreDepuis:'14/09/2022',
  status:      'actif',
  formation:   'validee',
  formationExpire: '12/04/2029',
  disposEdition: [
    { date: '13/04', label: 'Lun. 13/04', dispo: true,  slots: ['matin']            },
    { date: '14/04', label: 'Mar. 14/04', dispo: true,  slots: ['matin', 'après-midi'] },
    { date: '15/04', label: 'Mer. 15/04', dispo: false, slots: []                  },
    { date: '16/04', label: 'Jeu. 16/04', dispo: true,  slots: ['matin']            },
    { date: '17/04', label: 'Ven. 17/04', dispo: false, slots: []                  },
  ],
  formations: [
    { id: 'F-2026-02', date: '12/04/2026', lieu: 'Château de Pierreclos',  formateur: 'Patrick Léon',     status: 'validee' },
    { id: 'F-2023-04', date: '09/11/2023', lieu: 'Maison des Vins, Mâcon', formateur: 'Patrick Léon',     status: 'validee' },
    { id: 'F-2022-03', date: '08/09/2022', lieu: 'Maison des Vins, Mâcon', formateur: 'Sophie Levêque',   status: 'validee' },
  ],
  jurys: [
    { edition: '2026', concours: 'France', jury: 'Jury B3', role: 'Dégustateur', date: '14/04/2026' },
    { edition: '2025', concours: 'France', jury: 'Jury A2', role: 'Dégustateur', date: '15/04/2025' },
    { edition: '2024', concours: 'France', jury: 'Jury C1', role: 'Président',   date: '16/04/2024' },
    { edition: '2024', concours: 'Monde',  jury: 'Jury W2', role: 'Dégustateur', date: '08/06/2024' },
    { edition: '2023', concours: 'France', jury: 'Jury B1', role: 'Dégustateur', date: '13/04/2023' },
  ],
};

const AdminDegustateurDetail = ({ onBack }) => {
  const [tab, setTab] = React.useState('infos');
  const [edition, setEdition] = React.useState('2026');
  const D = DEG_DETAIL;

  return (
    <div data-screen-label="admin-degustateur-detail">
      <div style={{ marginBottom: 16 }}>
        <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, color: 'var(--fg-muted)' }}>
          <Icon.ChevronLeft size={14}/> Retour à la liste
        </button>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 6 }}>
          Administration <span style={{ color: 'var(--fg-subtle)', margin: '0 6px' }}>›</span>
          Utilisateurs <span style={{ color: 'var(--fg-subtle)', margin: '0 6px' }}>›</span>
          Dégustateurs <span style={{ color: 'var(--fg-subtle)', margin: '0 6px' }}>›</span>
          <span style={{ color: 'var(--fg)' }}>{D.prenom} {D.nom}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 999,
              background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, fontSize: 18, flexShrink: 0,
            }}>{D.prenom[0]}{D.nom[0]}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <h1 className="display" style={{ fontSize: 28, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>{D.prenom} {D.nom}</h1>
                <CompteBadge kind={D.status}/>
              </div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>{D.email}</span>
                <span style={{ color: 'var(--fg-subtle)' }}>·</span>
                <span style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>{D.tel}</span>
                <span style={{ color: 'var(--fg-subtle)' }}>·</span>
                <span style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>{D.ref}</span>
                <span style={{ color: 'var(--fg-subtle)' }}>·</span>
                <span>Membre depuis <span className="tnum" style={{ color: 'var(--fg)' }}>{D.membreDepuis}</span></span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn btn-outline btn-sm"><Icon.Mail size={13}/> Contacter</button>
            {D.status === 'actif' ? (
              <button className="btn btn-outline btn-sm" style={{ color: '#991b1b', borderColor: '#fecaca' }}>
                <Icon.Lock size={13}/> Désactiver
              </button>
            ) : (
              <button className="btn btn-outline btn-sm"><Icon.Refresh size={13}/> Réactiver</button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
        {[
          { id: 'infos',     label: 'Informations' },
          { id: 'dispos',    label: 'Disponibilités', count: D.disposEdition.filter(d => d.dispo).length },
          { id: 'formations',label: 'Formations',     count: D.formations.length },
          { id: 'jurys',     label: 'Jurys',          count: D.jurys.length },
        ].map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '12px 0', border: 'none',
              borderBottom: active ? '2px solid var(--burgundy-800)' : '2px solid transparent',
              background: 'transparent',
              fontSize: 13.5, fontWeight: active ? 600 : 500,
              color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
              marginBottom: -1, fontFamily: 'inherit',
            }}>
              {t.label}
              {t.count != null && (
                <span style={{
                  fontSize: 11, padding: '0 6px', borderRadius: 999,
                  background: active ? 'var(--burgundy-50)' : 'var(--slate-100)',
                  color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)', fontWeight: 500,
                }}>{t.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {tab === 'infos'      && <DegTabInfos D={D}/>}
      {tab === 'dispos'     && <DegTabDispos disposEdition={D.disposEdition} edition={edition} onEditionChange={setEdition}/>}
      {tab === 'formations' && <DegTabFormations list={D.formations} expire={D.formationExpire} status={D.formation}/>}
      {tab === 'jurys'      && <DegTabJurys list={D.jurys}/>}
    </div>
  );
};

// ─── Tab : Informations ────────────────────────────────────────────

const DegTabInfos = ({ D }) => {
  const [editing, setEditing] = React.useState(false);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button className="btn btn-outline btn-sm" onClick={() => setEditing(o => !o)}>
          {editing ? <><Icon.X size={13}/> Annuler</> : <><Icon.Edit size={13}/> Modifier</>}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <InfoCard title="Identité" icon={<Icon.User size={14}/>}>
          <InfoKV label="Prénom"    value={D.prenom}/>
          <InfoKV label="Nom"       value={D.nom}/>
          <InfoKV label="N° interne" value={D.ref} mono/>
          <InfoKV label="Membre depuis" value={D.membreDepuis}/>
        </InfoCard>

        <InfoCard title="Coordonnées" icon={<Icon.Mail size={14}/>}>
          <InfoKV label="Email"     value={D.email} mono/>
          <InfoKV label="Téléphone" value={D.tel}   mono/>
          <InfoKV label="Adresse"   value={D.adresse}/>
        </InfoCard>
      </div>

      {editing && (
        <div style={{
          position: 'sticky', bottom: 16, marginTop: 18,
          padding: '12px 16px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(15,23,42,0.10)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>Mode édition — modifications visibles immédiatement par le dégustateur</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline btn-sm" onClick={() => setEditing(false)}>Annuler</button>
            <button className="btn btn-primary btn-sm" onClick={() => setEditing(false)} style={{ background: 'var(--burgundy-800)' }}>
              <Icon.Check size={13}/> Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Tab : Disponibilités ──────────────────────────────────────────

const DegTabDispos = ({ disposEdition, edition, onEditionChange }) => {
  const dispoCount = disposEdition.filter(d => d.dispo).length;
  const [weekOffset, setWeekOffset] = React.useState(0);
  const WEEKS = [
    { id: 0, label: 'Semaine du 13 au 17 avril 2026', start: '13/04', end: '17/04' },
    { id: 1, label: 'Semaine du 20 au 24 avril 2026', start: '20/04', end: '24/04' },
    { id: 2, label: 'Semaine du 27 au 30 avril 2026', start: '27/04', end: '30/04' },
  ];
  const week = WEEKS[weekOffset];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <SalonPicker
            salons={[
              { id: '2026', label: 'Édition 2026' },
              { id: '2025', label: 'Édition 2025' },
              { id: '2024', label: 'Édition 2024' },
            ]}
            value={edition}
            onChange={onEditionChange}
          />
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 2,
            border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)',
            padding: 2,
          }}>
            <button
              className="btn btn-icon btn-sm btn-ghost"
              onClick={() => setWeekOffset(o => Math.max(0, o - 1))}
              disabled={weekOffset === 0}
              style={weekOffset === 0 ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
              title="Semaine précédente"
            >
              <Icon.ChevronLeft size={13}/>
            </button>
            <span style={{ padding: '0 12px', fontSize: 12.5, fontWeight: 500, color: 'var(--fg)', whiteSpace: 'nowrap' }}>
              {week.label}
            </span>
            <button
              className="btn btn-icon btn-sm btn-ghost"
              onClick={() => setWeekOffset(o => Math.min(WEEKS.length - 1, o + 1))}
              disabled={weekOffset === WEEKS.length - 1}
              style={weekOffset === WEEKS.length - 1 ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
              title="Semaine suivante"
            >
              <Icon.ChevronRight size={13}/>
            </button>
          </div>
        </div>
        <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>
          <strong className="tnum" style={{ color: 'var(--fg)', fontWeight: 600 }}>{dispoCount}</strong> jour{dispoCount > 1 ? 's' : ''} déclaré{dispoCount > 1 ? 's' : ''} cette semaine
        </span>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {disposEdition.map((d, i) => (
            <div key={d.date} style={{
              borderRight: i < disposEdition.length - 1 ? '1px solid var(--border)' : 'none',
              padding: '16px 14px',
              background: d.dispo ? 'var(--surface)' : 'var(--slate-50)',
              opacity: d.dispo ? 1 : 0.6,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{d.label}</div>
              <div style={{ marginTop: 10 }}>
                {d.dispo ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', borderRadius: 999,
                    background: '#dcfce7', color: '#166534',
                    fontSize: 12, fontWeight: 600,
                  }}>
                    <Icon.Check size={11}/> Disponible
                  </span>
                ) : (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', borderRadius: 999,
                    background: 'transparent', color: 'var(--fg-subtle)',
                    border: '1px dashed var(--border)',
                    fontSize: 12, fontWeight: 500,
                  }}>
                    Non
                  </span>
                )}
              </div>
              {d.slots.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--fg-muted)' }}>
                  {d.slots.join(' · ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon.Info size={12}/>
        Disponibilités déclarées par le dégustateur depuis son extranet — modifiables seulement par lui.
      </div>
    </div>
  );
};

// ─── Tab : Formations ──────────────────────────────────────────────

const DegTabFormations = ({ list, expire, status }) => (
  <div>
    {/* Validity card */}
    <div className="card" style={{
      padding: '18px 22px', marginBottom: 18,
      borderColor: status === 'validee' ? '#bbf7d0' : '#fde68a',
      background: status === 'validee' ? '#f0fdf4' : '#fefce8',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 11,
        background: status === 'validee' ? '#16a34a' : '#f59e0b', color: '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {status === 'validee' ? <Icon.ShieldCheck size={22}/> : <Icon.AlertTriangle size={20}/>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: status === 'validee' ? '#166534' : '#854d0e', marginBottom: 2 }}>
          Validité actuelle
        </div>
        <div className="display" style={{ fontSize: 17, fontWeight: 500, color: status === 'validee' ? '#14532d' : '#713f12', letterSpacing: '-0.01em' }}>
          {status === 'validee' ? 'Formation validée' : 'À renouveler'} <span className="tnum" style={{ fontWeight: 400 }}>· jusqu'au {expire}</span>
        </div>
      </div>
      {status !== 'validee' && (
        <button className="btn btn-primary btn-sm" style={{ background: 'var(--burgundy-800)' }}>
          <Icon.Plus size={13}/> Inscrire à une session
        </button>
      )}
    </div>

    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Session</th>
            <th>Date</th>
            <th>Lieu</th>
            <th>Formateur</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {list.map(f => (
            <tr key={f.id}>
              <td style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', fontSize: 12.5, fontWeight: 500 }}>{f.id}</td>
              <td className="tnum">{f.date}</td>
              <td className="muted">{f.lieu}</td>
              <td>{f.formateur}</td>
              <td><FormationBadge kind={f.status}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Tab : Jurys ───────────────────────────────────────────────────

const DegTabJurys = ({ list }) => (
  <div className="table-wrap">
    <table className="table">
      <thead>
        <tr>
          <th className="num">Édition</th>
          <th>Concours</th>
          <th>Jury</th>
          <th>Rôle</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {list.map((j, i) => (
          <tr key={i}>
            <td className="num tnum">{j.edition}</td>
            <td>
              {j.concours === 'Monde'
                ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon.Globe size={12} style={{ color: 'var(--burgundy-700)' }}/> Monde</span>
                : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon.Trophy size={12} style={{ color: 'var(--burgundy-800)' }}/> France</span>}
            </td>
            <td style={{ fontWeight: 600, color: 'var(--burgundy-800)' }}>{j.jury}</td>
            <td>
              {j.role === 'Président' ? (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '2px 8px', borderRadius: 4,
                  background: 'var(--burgundy-800)', color: '#fff',
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>
                  <Icon.Star size={10}/> Président
                </span>
              ) : (
                <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>Dégustateur</span>
              )}
            </td>
            <td className="tnum muted">{j.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


Object.assign(window, {
  AdminDegustateursList,
  AdminDegustateurDetail,
  AdminFormations,
  AdminRepas,
  AdminJurys,
  AdminDisponibilites,
});
