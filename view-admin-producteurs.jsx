// ─── Producteurs : liste + fiche ───────────────────────────────────

const FOURNISSEURS_MEDAILLES = [
  { id: 'lyon',     nom: 'Médailleur Lyon',     zones: 'ARA, BFC, OCC, PAC, CORS' },
  { id: 'bordeaux', nom: 'Médailleur Bordeaux', zones: 'NAQ, PDL, BRE, NOR, CVL'  },
  { id: 'paris',    nom: 'Arthus-Bertrand',     zones: 'IDF, GE, HDF'             },
];

const PRODUCTEURS_ROWS = [
  ['PROD-0421', 'Domaine de la Chevalière',  'marie@chevaliere.fr',     'Mâconnais (71)',      3, 1, 2, 'or',     'actif'],
  ['PROD-0420', 'Maison Joseph Drouhin',     'contact@drouhin.fr',      'Côte-de-Beaune (21)', 5, 0, 3, 'or',     'actif'],
  ['PROD-0419', 'Château de Pierreclos',     'admin@pierreclos.fr',     'Mâconnais (71)',      2, 1, 1, 'or',     'actif'],
  ['PROD-0418', 'Domaine Bouchard Père',     'bouchard@drouhin.fr',     'Côte-de-Beaune (21)', 4, 0, 2, 'argent', 'actif'],
  ['PROD-0417', 'Domaine des 3 Pierres',     'contact@trois-pierres.fr','Mâconnais (71)',      3, 0, 1, 'argent', 'actif'],
  ['PROD-0416', 'Cellier de Solutré',        'caves@solutre.coop',      'Mâconnais (71)',      6, 1, 2, 'or',     'actif'],
  ['PROD-0415', 'Vignobles Lacroix',         'jean@vignobles-lacroix.fr','Côte chalonnaise (71)',2,0, 1, 'bronze', 'actif'],
  ['PROD-0414', 'Domaine Sainte-Anne',       'info@saint-anne.fr',      'Mâconnais (71)',      4, 0, 2, 'argent', 'actif'],
  ['PROD-0413', 'Domaine Tabard',            'tabard@domaine-tabard.fr','Beaujolais (69)',     1, 0, 0, null,     'inactif'],
  ['PROD-0412', 'Vignerons de Buxy',         'coop@vignerons-buxy.fr',  'Côte chalonnaise (71)',7,0, 4, 'or',     'actif'],
  ['PROD-0411', 'Domaine de la Verrière',    'verriere@verriere.fr',    'Beaujolais (69)',     2, 0, 0, null,     'inactif'],
];

const PRODUCTEUR_DETAIL = {
  ref:         'PROD-0421',
  domaine:     'Domaine de la Chevalière',
  region:      'Mâconnais (71)',
  email:       'marie@chevaliere.fr',
  siret:       '412 345 678 00012',
  tva:         'FR 78 412345678',
  membreDepuis:'08/03/2021',
  status:      'actif',
  fournisseurMedailles: 'lyon',
  raisonSociale: 'EARL Domaine de la Chevalière',
  adresseDomaine: '12 chemin des Vignes, 71960 Solutré-Pouilly',
  contactInsc:   { prenom: 'Marie', nom: 'Dupont', email: 'marie@chevaliere.fr',     tel: '06 12 34 56 78' },
  contactMkt:    { prenom: 'Jean',  nom: 'Dupont', email: 'jean@chevaliere.fr',      tel: '06 22 11 99 88' },
  adresseFact:   '12 chemin des Vignes, 71960 Solutré-Pouilly',

  inscriptions: [
    { ref: 'INS-2026-0184', concours: 'France', edition: '2026', ech: 8, status: 'a-verifier' },
    { ref: 'INS-2025-0142', concours: 'France', edition: '2025', ech: 6, status: 'terminee' },
    { ref: 'INS-2024-0098', concours: 'France', edition: '2024', ech: 4, status: 'terminee' },
    { ref: 'INS-2024-0042', concours: 'Monde',  edition: '2024', ech: 2, status: 'terminee' },
  ],
  commandes: [
    { edition: '2025', concours: 'France', vin: 'Les Crays — Pouilly-Fuissé',     medaille: 'or',     qte: 24, livraison: 'livre' },
    { edition: '2025', concours: 'France', vin: 'Cuvée Prestige — Mâcon-Villages', medaille: 'argent', qte: 18, livraison: 'livre' },
    { edition: '2024', concours: 'France', vin: 'Les Crays — Pouilly-Fuissé',     medaille: 'or',     qte: 18, livraison: 'livre' },
    { edition: '2024', concours: 'Monde',  vin: 'Cuvée Sélection — Mâcon Rouge',  medaille: 'bronze', qte: 12, livraison: 'livre' },
  ],
  derogations: [
    { ref: 'DER-2026-0032', date: '10/04/2026', type: 'Document manquant',   inscription: 'INS-2026-0184', status: 'en-cours' },
    { ref: 'DER-2026-0028', date: '08/04/2026', type: 'Dépassement de volume',inscription: 'INS-2026-0184', status: 'accordee' },
    { ref: 'DER-2025-0017', date: '12/05/2025', type: 'Document manquant',   inscription: 'INS-2025-0142', status: 'refusee' },
  ],
};

// ─── Liste des producteurs ─────────────────────────────────────────

const AdminProducteursList = ({ onOpenDetail }) => {
  const [region,   setRegion]   = React.useState('all');
  const [statut,   setStatut]   = React.useState('all');
  const [concours, setConcours] = React.useState('all');
  const [search,   setSearch]   = React.useState('');
  const [rowMenu,  setRowMenu]  = React.useState(null);
  const [addModal, setAddModal] = React.useState(false);

  const filtered = PRODUCTEURS_ROWS.filter(r => {
    if (statut !== 'all' && r[8] !== statut) return false;
    if (search && !r[1].toLowerCase().includes(search.toLowerCase()) && !r[2].toLowerCase().includes(search.toLowerCase())) return false;
    if (region !== 'all' && !r[3].toLowerCase().includes(region.toLowerCase())) return false;
    return true;
  });

  const paged = useSortablePaged(filtered, {
    defaultPageSize: 25,
    accessors: {
      nom:       r => r[1],
      region:    r => r[3],
      inscr:     r => r[4],
      medailles: r => r[6],
      compte:    r => r[8],
    },
  });

  return (
    <div data-screen-label="admin-producteurs">
      <PageHeader
        breadcrumb={['Administration', 'Utilisateurs', 'Producteurs']}
        title="Producteurs"
        subtitle={`1 240 comptes producteurs · ${PRODUCTEURS_ROWS.filter(r => r[8] === 'actif').length}/${PRODUCTEURS_ROWS.length} affichés actifs`}
        actions={<>
          <button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => setAddModal(true)} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Plus size={14}/> Ajouter un producteur
          </button>
        </>}
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="input-with-icon" style={{ flex: 1, maxWidth: 360, minWidth: 220 }}>
          <Icon.Search size={14} className="input-icon"/>
          <input className="input" placeholder="Domaine, email…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <FilterSelect icon={<Icon.Map size={13}/>}    label="Région"  value={region}   onChange={setRegion}   options={[
          { id: 'all',          label: 'Toutes régions' },
          { id: 'mâconnais',    label: 'Mâconnais (71)' },
          { id: 'côte-de-beaune',label:'Côte-de-Beaune (21)' },
          { id: 'côte chalonnaise',label:'Côte chalonnaise (71)' },
          { id: 'beaujolais',   label: 'Beaujolais (69)' },
        ]}/>
        <FilterSelect icon={<Icon.Dot size={13}/>}    label="Statut compte" value={statut}   onChange={setStatut}   options={[
          { id: 'all',     label: 'Tous statuts' },
          { id: 'actif',   label: 'Actif' },
          { id: 'inactif', label: 'Inactif' },
        ]}/>
        <FilterSelect icon={<Icon.Trophy size={13}/>} label="Concours" value={concours} onChange={setConcours} options={[
          { id: 'all',     label: 'Tous concours' },
          { id: 'france',  label: 'France' },
          { id: 'monde',   label: 'Monde' },
          { id: 'both',    label: 'France + Monde' },
        ]}/>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <SortableTh sortKey="nom"      currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Producteur</SortableTh>
              <SortableTh sortKey="region"   currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Région</SortableTh>
              <SortableTh sortKey="inscr"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Inscriptions</SortableTh>
              <SortableTh sortKey="medailles" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Médailles</SortableTh>
              <SortableTh sortKey="compte"   currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Compte</SortableTh>
              <th style={{ width: 36 }}></th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.map((r, i) => (
              <tr key={i} style={{ cursor: 'pointer' }} onClick={() => onOpenDetail && onOpenDetail(r[0])}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 600, fontSize: 12, flexShrink: 0,
                    }}>
                      {r[1].split(' ').filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 500 }}>{r[1]}</div>
                      <div className="muted" style={{ fontSize: 11.5, marginTop: 1, fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>{r[2]}</div>
                    </div>
                  </div>
                </td>
                <td className="muted">{r[3]}</td>
                <td className="num tnum">
                  <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>{r[4]}</strong>
                  {r[5] > 0 && <span style={{ color: 'var(--burgundy-800)', fontSize: 11, marginLeft: 4 }}>(dont {r[5]} en cours)</span>}
                </td>
                <td>
                  {r[6] > 0 ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span className="tnum" style={{ fontWeight: 600 }}>{r[6]}</span>
                      <MedalChip kind={r[7]}/>
                    </span>
                  ) : (
                    <span className="subtle" style={{ fontStyle: 'italic' }}>—</span>
                  )}
                </td>
                <td><CompteBadge kind={r[8]}/></td>
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
                        <CmdMenuItem icon={<Icon.Mail size={13}/>} label="Envoyer un email" onClick={() => setRowMenu(null)}/>
                        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }}/>
                        {r[8] === 'actif' ? (
                          <CmdMenuItem icon={<Icon.Lock size={13}/>} label="Désactiver le compte" danger onClick={() => setRowMenu(null)}/>
                        ) : (
                          <CmdMenuItem icon={<Icon.Refresh size={13}/>} label="Réactiver le compte" onClick={() => setRowMenu(null)}/>
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

      <TablePagination {...paged}
        leftSlot={<span style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginRight: 12 }}>{paged.total} producteur{paged.total > 1 ? 's' : ''} — </span>}/>

      {addModal && <AjouterProducteurModal onCancel={() => setAddModal(false)} onConfirm={() => setAddModal(false)}/>}
    </div>
  );
};

// ─── Modale : Ajouter un producteur ─────────────────────────

const AjouterProducteurModal = ({ onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const [form, setForm] = React.useState({
    raisonSociale: '', email: '', region: '', siret: '',
    contactPrenom: '', contactNom: '', contactTel: '',
    invite: true,
  });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 560, padding: 0, overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '22px 26px 14px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Plus size={13}/>
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Création rapide</span>
            </div>
            <h2 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>Ajouter un producteur</h2>
            <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 4, marginBottom: 0 }}>Le producteur complétera son profil à la première connexion.</p>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost" aria-label="Fermer">
            <Icon.X size={14}/>
          </button>
        </div>

        <div style={{ padding: '18px 26px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Section : Domaine */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Domaine</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label className="field">
                <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>
                  Raison sociale / Nom du domaine <span style={{ color: '#dc2626' }}>*</span>
                </span>
                <input className="input" placeholder="Ex. Domaine de la Chevelière" value={form.raisonSociale} onChange={set('raisonSociale')}/>
              </label>
              <label className="field">
                <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>
                  Email <span style={{ color: '#dc2626' }}>*</span>
                  <span style={{ color: 'var(--fg-subtle)', fontWeight: 400, marginLeft: 6 }}>(= identifiant de connexion)</span>
                </span>
                <input type="email" className="input" placeholder="contact@domaine.fr" value={form.email} onChange={set('email')} style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label className="field">
                  <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Région <span style={{ color: '#dc2626' }}>*</span></span>
                  <select className="input" value={form.region} onChange={set('region')}>
                    <option value="">— Choisir —</option>
                    <option>Mâconnais (71)</option>
                    <option>Côte-de-Beaune (21)</option>
                    <option>Côte chalonnaise (71)</option>
                    <option>Côte de Nuits (21)</option>
                    <option>Beaujolais (69)</option>
                    <option>Chablisien (89)</option>
                  </select>
                </label>
                <label className="field">
                  <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>SIRET</span>
                  <input className="input tnum" placeholder="412 345 678 00012" value={form.siret} onChange={set('siret')} style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
                </label>
              </div>
            </div>
          </div>

          {/* Section : Contact inscription */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Contact inscription</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <label className="field">
                <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Prénom</span>
                <input className="input" placeholder="Marie" value={form.contactPrenom} onChange={set('contactPrenom')}/>
              </label>
              <label className="field">
                <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Nom</span>
                <input className="input" placeholder="Dupont" value={form.contactNom} onChange={set('contactNom')}/>
              </label>
            </div>
            <label className="field">
              <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Téléphone</span>
              <input type="tel" className="input" placeholder="06 12 34 56 78" value={form.contactTel} onChange={set('contactTel')} style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
            </label>
          </div>

          {/* Invitation toggle */}
          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '12px 14px',
            border: `1px solid ${form.invite ? 'var(--burgundy-200)' : 'var(--border)'}`,
            background: form.invite ? 'var(--burgundy-50)' : 'var(--surface)',
            borderRadius: 8,
            cursor: 'pointer',
          }}>
            <input type="checkbox" checked={form.invite} onChange={set('invite')} style={{ marginTop: 2, accentColor: 'var(--burgundy-800)', flexShrink: 0 }}/>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>
                Envoyer un email d'invitation
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>
                Un email sera envoyé à <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>{form.email || '…'}</strong> avec un lien pour compléter le profil et définir un mot de passe.
              </div>
            </div>
          </label>
        </div>

        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={!form.raisonSociale || !form.email || !form.region}
            style={{
              background: 'var(--burgundy-800)',
              opacity: (!form.raisonSociale || !form.email || !form.region) ? 0.45 : 1,
            }}
          >
            <Icon.Check size={13}/> Créer le compte{form.invite ? ' + inviter' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Reusable filter dropdown ─────────────────────────────────────

const FilterSelect = ({ icon, label, value, onChange, options }) => {
  const [open, setOpen] = React.useState(false);
  const current = options.find(o => o.id === value);
  const isFiltering = value !== 'all';
  return (
    <div style={{ position: 'relative' }}>
      <button
        className="btn btn-outline btn-sm"
        onClick={() => setOpen(o => !o)}
        style={{
          background: isFiltering ? 'var(--burgundy-50)' : 'var(--surface)',
          color: isFiltering ? 'var(--burgundy-800)' : 'var(--fg)',
          borderColor: isFiltering ? 'var(--burgundy-200)' : 'var(--border)',
        }}
      >
        {icon} {isFiltering ? current.label : label}
        <Icon.ChevronDown size={11} style={{ marginLeft: 2, opacity: 0.6 }}/>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }}/>
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0,
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            minWidth: 220, zIndex: 60, overflow: 'hidden', padding: '4px 0',
          }}>
            {options.map(o => (
              <button key={o.id} onClick={() => { onChange(o.id); setOpen(false); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                padding: '8px 14px', border: 'none',
                background: o.id === value ? 'var(--burgundy-50)' : 'transparent',
                textAlign: 'left', cursor: 'pointer', fontSize: 12.5,
                color: o.id === value ? 'var(--burgundy-800)' : 'var(--fg)',
                fontWeight: o.id === value ? 600 : 500,
                fontFamily: 'inherit',
              }}>
                <span style={{ flex: 1 }}>{o.label}</span>
                {o.id === value && <Icon.Check size={13}/>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const CompteBadge = ({ kind }) => {
  const map = {
    actif:   { bg: '#dcfce7',           fg: '#166534',          dot: '#16a34a', label: 'Actif' },
    inactif: { bg: 'var(--slate-100)',  fg: 'var(--slate-600)', dot: 'var(--slate-400)', label: 'Inactif' },
  };
  const s = map[kind];
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

const MedalChip = ({ kind }) => {
  const map = {
    or:     { bg: '#fef3c7', fg: '#78350f', dot: '#d4a017', label: 'Or' },
    argent: { bg: '#f1f5f9', fg: '#475569', dot: '#94a3b8', label: 'Argent' },
    bronze: { bg: '#fed7aa', fg: '#9a3412', dot: '#c2410c', label: 'Bronze' },
  };
  const s = map[kind] || map.argent;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px 2px 6px', borderRadius: 999,
      background: s.bg, color: s.fg,
      fontSize: 11, fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: s.dot }}/>
      {s.label}
    </span>
  );
};

// ─── Fiche producteur ──────────────────────────────────────────────

const AdminProducteurDetail = ({ onBack, onOpenDossier, onOpenDerog }) => {
  const [tab, setTab] = React.useState('infos');
  const P = PRODUCTEUR_DETAIL;

  return (
    <div data-screen-label="admin-producteur-detail">
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
          Producteurs <span style={{ color: 'var(--fg-subtle)', margin: '0 6px' }}>›</span>
          <span style={{ color: 'var(--fg)' }}>{P.domaine}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <h1 className="display" style={{ fontSize: 28, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>{P.domaine}</h1>
              <CompteBadge kind={P.status}/>
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>{P.email}</span>
              <span style={{ color: 'var(--fg-subtle)' }}>·</span>
              <span>{P.region}</span>
              <span style={{ color: 'var(--fg-subtle)' }}>·</span>
              <span>SIRET <span className="tnum" style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', color: 'var(--fg)' }}>{P.siret}</span></span>
              <span style={{ color: 'var(--fg-subtle)' }}>·</span>
              <span>Membre depuis <span className="tnum" style={{ color: 'var(--fg)' }}>{P.membreDepuis}</span></span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn btn-outline btn-sm"><Icon.Mail size={13}/> Contacter</button>
            {P.status === 'actif' ? (
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
          { id: 'infos',        label: 'Informations' },
          { id: 'inscriptions', label: 'Inscriptions', count: P.inscriptions.length },
          { id: 'commandes',    label: 'Commandes médailles', count: P.commandes.length },
          { id: 'derogations',  label: 'Dérogations', count: P.derogations.length },
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

      {tab === 'infos'        && <ProdTabInfos        P={P}/>}
      {tab === 'inscriptions' && <ProdTabInscriptions list={P.inscriptions} onOpen={onOpenDossier}/>}
      {tab === 'commandes'    && <ProdTabCommandes    list={P.commandes}/>}
      {tab === 'derogations'  && <ProdTabDerogations  list={P.derogations} onOpen={onOpenDerog}/>}
    </div>
  );
};

// ─── Tab : Informations ────────────────────────────────────────────

const ProdTabInfos = ({ P }) => {
  const [editing, setEditing] = React.useState(false);
  const AUTO_FOURN_ID = P.fournisseurMedailles || 'lyon';
  const [fournisseurId, setFournisseurId] = React.useState(AUTO_FOURN_ID);
  const isManual = fournisseurId !== AUTO_FOURN_ID;
  const currentFourn = FOURNISSEURS_MEDAILLES.find(function(f) { return f.id === fournisseurId; }) || FOURNISSEURS_MEDAILLES[0];
  const autoFourn    = FOURNISSEURS_MEDAILLES.find(function(f) { return f.id === AUTO_FOURN_ID; }) || FOURNISSEURS_MEDAILLES[0];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button className="btn btn-outline btn-sm" onClick={() => setEditing(o => !o)}>
          {editing ? <><Icon.X size={13}/> Annuler</> : <><Icon.Edit size={13}/> Modifier</>}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <InfoCard title="Entreprise" icon={<Icon.Building size={14}/>}>
          <InfoKV label="Raison sociale"    value={P.raisonSociale}/>
          <InfoKV label="SIRET"             value={P.siret} mono/>
          <InfoKV label="N° TVA intra"      value={P.tva}   mono/>
          <InfoKV label="Adresse domaine"   value={P.adresseDomaine}/>
        </InfoCard>

        <InfoCard title="Adresse de facturation" icon={<Icon.Receipt size={14}/>}>
          <InfoKV label="Adresse"           value={P.adresseFact}/>
          <InfoKV label="Identique au domaine" value="Oui"/>
        </InfoCard>

        <InfoCard title="Contact inscription" icon={<Icon.User size={14}/>}>
          <InfoKV label="Nom"      value={`${P.contactInsc.prenom} ${P.contactInsc.nom}`}/>
          <InfoKV label="Email"    value={P.contactInsc.email} mono/>
          <InfoKV label="Téléphone" value={P.contactInsc.tel}   mono/>
        </InfoCard>

        <InfoCard title="Contact marketing" icon={<Icon.Send size={14}/>}>
          <InfoKV label="Nom"      value={`${P.contactMkt.prenom} ${P.contactMkt.nom}`}/>
          <InfoKV label="Email"    value={P.contactMkt.email} mono/>
          <InfoKV label="Téléphone" value={P.contactMkt.tel}   mono/>
        </InfoCard>

        {/* Imprimeur médailles — toujours éditable */}
        <div style={{ gridColumn: '1 / -1' }}>
          <InfoCard title="Imprimeur médailles" icon={<Icon.Printer size={14}/>}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>{currentFourn.nom}</span>
                  {isManual ? (
                    <span style={{ fontSize: 10.5, padding: '1px 8px', borderRadius: 999, background: '#fef3c7', color: '#92400e', fontWeight: 600 }}>Manuel</span>
                  ) : (
                    <span style={{ fontSize: 10.5, padding: '1px 8px', borderRadius: 999, background: '#dcfce7', color: '#166534', fontWeight: 600 }}>Auto — région</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
                  Zones couvertes : <span style={{ fontWeight: 500, color: 'var(--fg)' }}>{currentFourn.zones}</span>
                </div>
                {isManual && (
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4 }}>
                    Auto-assigné (région) : <span style={{ color: 'var(--fg)', fontWeight: 500 }}>{autoFourn.nom}</span>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <select
                  className="input"
                  style={{ fontSize: 13, padding: '5px 10px', minWidth: 200 }}
                  value={fournisseurId}
                  onChange={function(e) { setFournisseurId(e.target.value); }}
                >
                  {FOURNISSEURS_MEDAILLES.map(function(f) {
                    return (
                      <option key={f.id} value={f.id}>
                        {f.nom}{f.id === AUTO_FOURN_ID ? ' (auto — région)' : ''}
                      </option>
                    );
                  })}
                </select>
                {isManual && (
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--fg-muted)', fontSize: 12, whiteSpace: 'nowrap' }}
                    onClick={function() { setFournisseurId(AUTO_FOURN_ID); }}
                  >
                    <Icon.Refresh size={11}/> Réinitialiser
                  </button>
                )}
              </div>
            </div>
          </InfoCard>
        </div>
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
          <span style={{ fontSize: 12.5, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Icon.Refresh size={13} style={{ color: 'var(--burgundy-800)' }}/>
            Toute modification ici sera synchronisée avec le logiciel comptable (<strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Sage</strong>).
          </span>
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

const InfoCard = ({ title, icon, children }) => (
  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
    <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', background: 'var(--slate-50)', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: 'var(--burgundy-800)', display: 'inline-flex' }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{title}</span>
    </div>
    <div style={{ padding: '14px 18px' }}>
      {children}
    </div>
  </div>
);

const InfoKV = ({ label, value, mono }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, padding: '6px 0', borderBottom: '1px dashed var(--border)' }}>
    <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{label}</span>
    <span style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 500, fontFamily: mono ? 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' : 'inherit', wordBreak: 'break-word' }}>{value}</span>
  </div>
);

// ─── Tab : Inscriptions ────────────────────────────────────────────

const ProdTabInscriptions = ({ list, onOpen }) => (
  <div className="table-wrap">
    <table className="table">
      <thead>
        <tr>
          <th>N° inscription</th>
          <th>Concours</th>
          <th className="num">Édition</th>
          <th className="num">Échantillons</th>
          <th>Statut</th>
          <th style={{ width: 36 }}></th>
        </tr>
      </thead>
      <tbody>
        {list.map((i, idx) => (
          <tr key={idx} style={{ cursor: 'pointer' }} onClick={() => onOpen && onOpen(i.ref)}>
            <td style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', fontSize: 12.5, fontWeight: 500 }}>{i.ref}</td>
            <td>
              {i.concours === 'Monde'
                ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon.Globe size={12} style={{ color: 'var(--burgundy-700)' }}/> Concours des Grands Vins du Monde</span>
                : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon.Trophy size={12} style={{ color: 'var(--burgundy-800)' }}/> Concours des Grands Vins de France</span>}
            </td>
            <td className="num tnum">{i.edition}</td>
            <td className="num tnum">{i.ech}</td>
            <td><DossierStatusBadge kind={i.status}/></td>
            <td><Icon.ChevronRight size={13} style={{ color: 'var(--fg-subtle)' }}/></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DossierStatusBadge = ({ kind }) => {
  const map = {
    'a-verifier': { bg: '#fef3c7',           fg: '#a16207',         dot: '#f59e0b', label: 'À vérifier' },
    'terminee':    { bg: '#dcfce7',           fg: '#166534',         dot: '#16a34a', label: 'Payée' },
    'en-cours':    { bg: 'var(--burgundy-50)',fg: 'var(--burgundy-800)',dot:'var(--burgundy-500)',label: 'En cours' },
  };
  const s = map[kind] || map['a-verifier'];
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

// ─── Tab : Commandes médailles ─────────────────────────────────────

const ProdTabCommandes = ({ list }) => (
  <>
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th className="num">Édition</th>
            <th>Concours</th>
            <th>Vin</th>
            <th>Médaille</th>
            <th className="num">Qté commandée</th>
            <th>Livraison</th>
          </tr>
        </thead>
        <tbody>
          {list.map((c, i) => (
            <tr key={i}>
              <td className="num tnum">{c.edition}</td>
              <td>
                {c.concours === 'Monde'
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon.Globe size={12} style={{ color: 'var(--burgundy-700)' }}/> Monde</span>
                  : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon.Trophy size={12} style={{ color: 'var(--burgundy-800)' }}/> France</span>}
              </td>
              <td style={{ fontWeight: 500 }}>{c.vin}</td>
              <td><MedalChip kind={c.medaille}/></td>
              <td className="num tnum" style={{ fontWeight: 600 }}>{c.qte}</td>
              <td><LivraisonBadge kind={c.livraison}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
      <Icon.Info size={12}/>
      Lecture seule — les commandes sont gérées dans la section <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Logistique › Commandes médailles</strong>.
    </div>
  </>
);

// ─── Tab : Dérogations ─────────────────────────────────────────────

const ProdTabDerogations = ({ list, onOpen }) => (
  <div className="table-wrap">
    <table className="table">
      <thead>
        <tr>
          <th>Référence</th>
          <th>Date</th>
          <th>Type</th>
          <th>Inscription liée</th>
          <th>Décision</th>
          <th style={{ width: 36 }}></th>
        </tr>
      </thead>
      <tbody>
        {list.map((d, i) => (
          <tr key={i} style={{ cursor: 'pointer' }} onClick={() => onOpen && onOpen(d.inscription)}>
            <td style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', fontSize: 12.5, fontWeight: 500 }}>{d.ref}</td>
            <td className="tnum muted" style={{ fontSize: 12.5 }}>{d.date}</td>
            <td>{d.type}</td>
            <td style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', fontSize: 12.5, color: 'var(--burgundy-800)', textDecoration: 'underline', textUnderlineOffset: 2 }}>
              {d.inscription}
            </td>
            <td><DerogStatusBadge kind={d.status}/></td>
            <td><Icon.ChevronRight size={13} style={{ color: 'var(--fg-subtle)' }}/></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DerogStatusBadge = ({ kind }) => {
  const map = {
    'en-cours': { bg: '#fef3c7', fg: '#a16207', dot: '#f59e0b', label: 'En cours' },
    'accordee': { bg: '#dcfce7', fg: '#166534', dot: '#16a34a', label: 'Accordée' },
    'refusee':  { bg: '#fef2f2', fg: '#991b1b', dot: '#dc2626', label: 'Refusée' },
  };
  const s = map[kind] || map['en-cours'];
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

Object.assign(window, { AdminProducteursList, AdminProducteurDetail });
