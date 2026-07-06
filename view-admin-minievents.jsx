// view-admin-minievents.jsx — R120 : Mini-événements (admin)

const EVT_COLORS = ['#7c3aed', '#0891b2', '#166534', '#b45309', '#be123c', '#1d4ed8'];

// ── Données mock ──────────────────────────────────────────────────────────────
const MINI_EVENTS_INIT = [
  {
    id: 'evt-001', couleur: '#7c3aed',
    titre: 'Soirée Dégustation Bourgogne 2026',
    description: 'Venez découvrir les meilleurs vins de Bourgogne sélectionnés par le Comité des Salons et Concours de Mâcon. Une soirée conviviale avec dégustation commentée, buffet de fromages et accords mets-vins.',
    programme: '19h00 — Accueil & présentation des vins\n19h30 — Dégustation guidée (6 vins)\n20h30 — Buffet de fromages & accords\n22h00 — Fin de soirée',
    date: '15 sept. 2026', dateISO: '2026-09-15', heure: '19:00',
    lieu: 'Cave du Comité · Mâcon', adresse: 'Parc des Expositions, 71000 Mâcon',
    capacite: 40, prixHT: 45, imageUrl: '',
    statut: 'publie', inscriptionsOuvertes: true,
    champs: [
      { id: 'nom',    label: 'Nom & prénom',      type: 'text',   requis: true  },
      { id: 'email',  label: 'E-mail',              type: 'email',  requis: true  },
      { id: 'tel',    label: 'Téléphone',            type: 'tel',    requis: false },
      { id: 'places', label: 'Nombre de places',    type: 'number', requis: true  },
      { id: 'regime', label: 'Régime alimentaire',  type: 'select', requis: false, options: 'Aucun\nVégétarien\nVegan\nSans gluten' },
    ],
    nbInscrits: 28, revenus: 1260, creeLe: '2026-06-01',
  },
  {
    id: 'evt-002', couleur: '#0891b2',
    titre: 'Atelier Accords Mets & Vins',
    description: 'Apprenez à marier vins et cuisine régionale lors de cet atelier pratique animé par nos experts. Dîner gastronomique inclus.',
    programme: '18h30 — Accueil\n19h00 — Introduction aux accords mets & vins\n19h30 — Dîner gastronomique commenté (5 services)\n22h00 — Questions-réponses',
    date: '8 oct. 2026', dateISO: '2026-10-08', heure: '18:30',
    lieu: 'Restaurant La Table du Concours', adresse: '12 rue des Vignerons, 71000 Mâcon',
    capacite: 24, prixHT: 75, imageUrl: '',
    statut: 'publie', inscriptionsOuvertes: true,
    champs: [
      { id: 'nom',      label: 'Nom & prénom',       type: 'text',   requis: true  },
      { id: 'email',    label: 'E-mail',               type: 'email',  requis: true  },
      { id: 'places',   label: 'Nombre de places',    type: 'number', requis: true  },
      { id: 'allergie', label: 'Allergies',            type: 'text',   requis: false },
    ],
    nbInscrits: 18, revenus: 1350, creeLe: '2026-06-10',
  },
  {
    id: 'evt-003', couleur: '#166534',
    titre: 'Master Class Beaujolais Nouveau 2026',
    description: 'Découvrez en avant-première les Beaujolais Nouveaux 2026 avec notre jury d\'experts. Initiation à la dégustation professionnelle.',
    programme: '18h00 — Accueil\n18h30 — Masterclass dégustation\n19h30 — Dégustation libre',
    date: '20 nov. 2026', dateISO: '2026-11-20', heure: '18:00',
    lieu: 'Parc des Expositions · Mâcon', adresse: 'Parc des Expositions, 71000 Mâcon',
    capacite: 80, prixHT: 25, imageUrl: '',
    statut: 'brouillon', inscriptionsOuvertes: false,
    champs: [
      { id: 'nom',    label: 'Nom & prénom',   type: 'text',   requis: true },
      { id: 'email',  label: 'E-mail',          type: 'email',  requis: true },
      { id: 'places', label: 'Nombre de places', type: 'number', requis: true },
    ],
    nbInscrits: 0, revenus: 0, creeLe: '2026-06-28',
  },
];

const INSCRIPTIONS_INIT = {
  'evt-001': [
    { id:'i01', date:'2026-07-05T14:32', nom:'Claire Martin',     email:'claire.martin@gmail.com',    tel:'06 12 34 56 78', places:2, montantTTC:108, statut:'paye',        modePaiement:'CB',       regime:'Végétarien' },
    { id:'i02', date:'2026-07-06T09:15', nom:'Thomas Blanc',      email:'t.blanc@domaine-blanc.fr',   tel:'07 45 67 89 01', places:1, montantTTC:54,  statut:'paye',        modePaiement:'Virement',  regime:'Aucun' },
    { id:'i03', date:'2026-07-07T16:50', nom:'Isabelle Roy',      email:'i.roy@gmail.com',            tel:'06 98 76 54 32', places:4, montantTTC:216, statut:'paye',        modePaiement:'CB',        regime:'Aucun' },
    { id:'i04', date:'2026-07-08T11:00', nom:'Marc Dupont',       email:'marc@dupont-vins.fr',        tel:'',               places:2, montantTTC:108, statut:'en-attente',  modePaiement:'Virement',  regime:'Sans gluten' },
    { id:'i05', date:'2026-07-09T14:22', nom:'Sophie Leclerc',    email:'sleclerc@gmail.com',         tel:'07 11 22 33 44', places:1, montantTTC:54,  statut:'paye',        modePaiement:'CB',        regime:'Vegan' },
    { id:'i06', date:'2026-07-10T10:05', nom:'Jean-Pierre Favre', email:'jp.favre@vignoble.fr',       tel:'06 55 44 33 22', places:2, montantTTC:108, statut:'paye',        modePaiement:'CB',        regime:'Aucun' },
    { id:'i07', date:'2026-07-12T17:30', nom:'Hélène Moreau',     email:'h.moreau@gmail.com',         tel:'',               places:1, montantTTC:54,  statut:'annule',      modePaiement:'CB',        regime:'Aucun' },
    { id:'i08', date:'2026-07-14T09:00', nom:'Antoine Bernard',   email:'a.bernard@chateau.fr',       tel:'06 77 88 99 00', places:3, montantTTC:162, statut:'paye',        modePaiement:'CB',        regime:'Aucun' },
  ],
  'evt-002': [
    { id:'i09', date:'2026-07-15T14:00', nom:'Nathalie Simon',    email:'nathalie.simon@gmail.com',   tel:'06 22 33 44 55', places:2, montantTTC:180, statut:'paye',        modePaiement:'CB',        allergie:'' },
    { id:'i10', date:'2026-07-16T10:30', nom:'Paul Renard',       email:'paul@renard.fr',             tel:'07 44 55 66 77', places:2, montantTTC:180, statut:'paye',        modePaiement:'Virement',  allergie:'Noix' },
    { id:'i11', date:'2026-07-17T16:00', nom:'Caroline Petit',    email:'c.petit@viticole.fr',        tel:'',               places:2, montantTTC:180, statut:'en-attente',  modePaiement:'Virement',  allergie:'' },
    { id:'i12', date:'2026-07-18T11:15', nom:'François Durand',   email:'f.durand@gmail.com',         tel:'06 11 22 33 44', places:2, montantTTC:180, statut:'paye',        modePaiement:'CB',        allergie:'Lactose' },
    { id:'i13', date:'2026-07-19T09:45', nom:'Marie Berthier',    email:'marie.berthier@gmail.com',   tel:'07 55 66 77 88', places:2, montantTTC:180, statut:'paye',        modePaiement:'CB',        allergie:'' },
  ],
  'evt-003': [],
};

const eurEvt = v => v.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

// ── Badges ────────────────────────────────────────────────────────────────────
const EventStatutBadge = ({ statut }) => {
  const map = {
    brouillon: { label: 'Brouillon', bg: 'var(--slate-100)', fg: 'var(--fg-muted)' },
    publie:    { label: 'Publié',    bg: '#dcfce7', fg: '#166534' },
    complet:   { label: 'Complet',  bg: '#fef3c7', fg: '#92400e' },
    termine:   { label: 'Terminé',  bg: 'var(--slate-100)', fg: 'var(--fg-subtle)' },
    annule:    { label: 'Annulé',   bg: '#fee2e2', fg: '#b91c1c' },
  };
  const s = map[statut] || map.brouillon;
  return <span style={{ fontSize: 11.5, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: s.bg, color: s.fg }}>{s.label}</span>;
};

const InsStatutBadge = ({ statut }) => {
  const map = {
    paye:        { label: 'Payé',        bg: '#dcfce7', fg: '#166534' },
    'en-attente':{ label: 'En attente',  bg: '#fef3c7', fg: '#92400e' },
    annule:      { label: 'Annulé',      bg: '#fee2e2', fg: '#b91c1c' },
    rembourse:   { label: 'Remboursé',   bg: '#f0f9ff', fg: '#0284c7' },
  };
  const s = map[statut] || map['en-attente'];
  return <span style={{ fontSize: 11.5, fontWeight: 600, padding: '3px 9px', borderRadius: 999, background: s.bg, color: s.fg }}>{s.label}</span>;
};

const CapaciteBar = ({ inscrits, total }) => {
  const pct = total ? Math.min(100, Math.round(inscrits / total * 100)) : 0;
  const color = pct >= 90 ? '#dc2626' : pct >= 70 ? '#d97706' : '#166534';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 4, color: 'var(--fg-muted)' }}>
        <span>{inscrits} / {total} inscrits</span>
        <span style={{ color, fontWeight: 600 }}>{pct} %</span>
      </div>
      <div style={{ height: 5, background: 'var(--border)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: pct + '%', background: color, borderRadius: 999, transition: 'width .3s' }}/>
      </div>
    </div>
  );
};

// ── Liste événements ──────────────────────────────────────────────────────────
const EventsList = ({ events, onSelect, onCreate }) => {
  const [filter, setFilter] = React.useState('all');
  const visible = events.filter(e => filter === 'all' || e.statut === filter || (filter === 'actif' && ['publie', 'complet'].includes(e.statut)));

  return (
    <div>
      <PageHeader
        title="Mini-événements"
        sub={`${events.length} événements · ${events.filter(e => e.statut === 'publie').length} publiés`}
        icon={<Icon.Calendar size={22}/>}
        breadcrumb={['Administration', 'Mini-événements']}
        actions={<button className="btn btn-primary" onClick={onCreate}><Icon.Plus size={14}/> Créer un événement</button>}
      />

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
        {[['all','Tous'], ['actif','Actifs'], ['brouillon','Brouillons'], ['termine','Terminés']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className={`btn btn-sm ${filter === v ? 'btn-primary' : 'btn-ghost'}`}
            style={filter === v ? {} : { color: 'var(--fg-muted)' }}>
            {l}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="card" style={{ padding: '60px 0', textAlign: 'center', color: 'var(--fg-muted)' }}>
          <Icon.Calendar size={28} style={{ opacity: .3, display: 'block', margin: '0 auto 12px' }}/>
          Aucun événement dans cette catégorie
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {visible.map(evt => (
            <div key={evt.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Header coloré */}
              <div style={{ background: `linear-gradient(135deg, ${evt.couleur}dd 0%, ${evt.couleur} 100%)`, padding: '20px 22px', color: '#fff', minHeight: evt.imageUrl ? 0 : 90, position: 'relative' }}
                style={evt.imageUrl ? { backgroundImage: `url(${evt.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: 90, position: 'relative' } : { background: `linear-gradient(135deg, ${evt.couleur}cc 0%, ${evt.couleur} 100%)`, padding: '20px 22px', color: '#fff', minHeight: 90, position: 'relative' }}
              >
                <div style={{ position: 'absolute', top: 12, right: 12 }}><EventStatutBadge statut={evt.statut}/></div>
                <div style={{ fontSize: 12, opacity: .85, marginBottom: 4 }}>{evt.date} · {evt.heure}</div>
                <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{evt.titre}</div>
                <div style={{ fontSize: 12, opacity: .75, marginTop: 3 }}>{evt.lieu}</div>
              </div>
              {/* Corps */}
              <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <CapaciteBar inscrits={evt.nbInscrits} total={evt.capacite}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--fg-muted)' }}>Revenus TTC</span>
                  <span className="tnum" style={{ fontWeight: 600 }}>{eurEvt(evt.revenus * 1.2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--fg-muted)' }}>Prix unitaire</span>
                  <span className="tnum" style={{ color: 'var(--fg-muted)' }}>{eurEvt(evt.prixHT)} HT / pers.</span>
                </div>
              </div>
              {/* Actions */}
              <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => onSelect(evt.id)}>
                  <Icon.Eye size={13}/> Gérer
                </button>
                <a href={'?event=' + evt.id} target="_blank" className="btn btn-outline btn-sm" style={{ flex: 1, textDecoration: 'none' }}>
                  <Icon.Globe size={13}/> Aperçu
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Éditeur de champs formulaire ──────────────────────────────────────────────
const CHAMPS_LIBRARY = [
  { type: 'text',     label: 'Champ texte',         icon: 'T' },
  { type: 'email',    label: 'E-mail',               icon: '@' },
  { type: 'tel',      label: 'Téléphone',             icon: '☎' },
  { type: 'number',   label: 'Nombre',               icon: '#' },
  { type: 'select',   label: 'Liste déroulante',     icon: '▾' },
  { type: 'checkbox', label: 'Case à cocher',        icon: '✓' },
  { type: 'textarea', label: 'Texte long',           icon: '¶' },
];

const ChampsEditor = ({ champs, onChange }) => {
  const addChamp = (type) => {
    const id = type + '_' + Date.now();
    onChange([...champs, { id, label: CHAMPS_LIBRARY.find(c => c.type === type)?.label || 'Champ', type, requis: false, options: type === 'select' ? 'Option 1\nOption 2' : undefined }]);
  };
  const removeChamp = (id) => onChange(champs.filter(c => c.id !== id));
  const updateChamp = (id, key, val) => onChange(champs.map(c => c.id === id ? { ...c, [key]: val } : c));
  const moveChamp = (idx, dir) => {
    const arr = [...champs];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= arr.length) return;
    [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
    onChange(arr);
  };

  return (
    <div>
      {/* Champs existants */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {champs.map((c, idx) => (
          <div key={c.id} className="card" style={{ padding: '10px 14px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button onClick={() => moveChamp(idx, -1)} disabled={idx === 0} className="btn btn-ghost" style={{ padding: '1px 4px', fontSize: 10, lineHeight: 1 }}>▲</button>
                <button onClick={() => moveChamp(idx, 1)} disabled={idx === champs.length - 1} className="btn btn-ghost" style={{ padding: '1px 4px', fontSize: 10, lineHeight: 1 }}>▼</button>
              </div>
              <span style={{ fontSize: 11, background: 'var(--slate-100)', color: 'var(--fg-muted)', padding: '2px 7px', borderRadius: 4, fontWeight: 600, flexShrink: 0 }}>{c.type}</span>
              <input className="input" style={{ flex: 1, fontSize: 12, padding: '5px 8px' }} value={c.label} onChange={e => updateChamp(c.id, 'label', e.target.value)}/>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, cursor: 'pointer', flexShrink: 0, color: 'var(--fg-muted)' }}>
                <input type="checkbox" checked={c.requis} onChange={e => updateChamp(c.id, 'requis', e.target.checked)} style={{ accentColor: 'var(--burgundy-800)' }}/>
                Requis
              </label>
              <button onClick={() => removeChamp(c.id)} className="btn btn-ghost btn-sm btn-icon" style={{ color: '#dc2626', flexShrink: 0 }}><Icon.Trash size={13}/></button>
            </div>
            {c.type === 'select' && (
              <div style={{ marginTop: 8, paddingLeft: 40 }}>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginBottom: 4 }}>Options (une par ligne)</div>
                <textarea className="input" rows={3} style={{ fontSize: 12, resize: 'vertical' }} value={c.options || ''} onChange={e => updateChamp(c.id, 'options', e.target.value)}/>
              </div>
            )}
          </div>
        ))}
        {champs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--fg-muted)', fontSize: 13 }}>Aucun champ — ajoutez en ci-dessous</div>
        )}
      </div>

      {/* Bibliothèque de champs */}
      <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 12 }}>
        <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginBottom: 8 }}>Ajouter un champ</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {CHAMPS_LIBRARY.map(c => (
            <button key={c.type} onClick={() => addChamp(c.type)} className="btn btn-outline btn-sm" style={{ fontSize: 12 }}>
              <span style={{ fontWeight: 700 }}>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Formulaire création / édition ─────────────────────────────────────────────
const EventForm = ({ event, onSave, onBack }) => {
  const isNew = !event;
  const [form, setForm] = React.useState(event || {
    id: 'evt-' + Date.now(), couleur: EVT_COLORS[0],
    titre: '', description: '', programme: '',
    date: '', dateISO: '', heure: '19:00',
    lieu: '', adresse: '',
    capacite: 50, prixHT: 0, imageUrl: '',
    statut: 'brouillon', inscriptionsOuvertes: false,
    champs: [
      { id: 'nom',    label: 'Nom & prénom', type: 'text',   requis: true },
      { id: 'email',  label: 'E-mail',        type: 'email',  requis: true },
      { id: 'places', label: 'Nombre de places', type: 'number', requis: true },
    ],
    nbInscrits: 0, revenus: 0, creeLe: new Date().toISOString().slice(0, 10),
  });
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}><Icon.ChevronLeft size={14}/> Retour</button>
        <div style={{ flex: 1 }}>
          <h1 className="display" style={{ fontSize: 22, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>
            {isNew ? 'Créer un événement' : 'Modifier — ' + event.titre}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={onBack}>Annuler</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>
            <Icon.Check size={14}/> {isNew ? 'Créer l\'événement' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24, alignItems: 'start' }}>
        {/* Colonne gauche — infos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 18 }}>Informations générales</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="field">
                <label className="field-label">Titre *</label>
                <input className="input" value={form.titre} onChange={e => setF('titre', e.target.value)} placeholder="Nom de l'événement"/>
              </div>
              <div className="field">
                <label className="field-label">Description</label>
                <textarea className="input" rows={3} style={{ resize: 'vertical' }} value={form.description} onChange={e => setF('description', e.target.value)} placeholder="Présentation de l'événement visible par les participants…"/>
              </div>
              <div className="field">
                <label className="field-label">Programme</label>
                <textarea className="input" rows={4} style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }} value={form.programme} onChange={e => setF('programme', e.target.value)} placeholder="19h00 — Accueil&#10;19h30 — Dégustation…"/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="field-label">Date *</label>
                  <input className="input" type="date" value={form.dateISO} onChange={e => setF('dateISO', e.target.value)}/>
                </div>
                <div className="field">
                  <label className="field-label">Heure</label>
                  <input className="input" type="time" value={form.heure} onChange={e => setF('heure', e.target.value)}/>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Lieu</label>
                <input className="input" value={form.lieu} onChange={e => setF('lieu', e.target.value)} placeholder="Nom du lieu"/>
              </div>
              <div className="field">
                <label className="field-label">Adresse</label>
                <input className="input" value={form.adresse} onChange={e => setF('adresse', e.target.value)} placeholder="Adresse complète"/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="field-label">Capacité max.</label>
                  <input className="input" type="number" min={1} value={form.capacite} onChange={e => setF('capacite', +e.target.value)}/>
                </div>
                <div className="field">
                  <label className="field-label">Prix unitaire HT (€)</label>
                  <input className="input" type="number" min={0} step={0.01} value={form.prixHT} onChange={e => setF('prixHT', +e.target.value)}/>
                </div>
              </div>
              <div className="field">
                <label className="field-label">URL image de couverture</label>
                <input className="input" value={form.imageUrl} onChange={e => setF('imageUrl', e.target.value)} placeholder="https://…"/>
              </div>
              <div className="field">
                <label className="field-label">Couleur de l'événement</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="color" value={form.couleur} onChange={e => setF('couleur', e.target.value)}
                    style={{ width: 44, height: 38, padding: 3, border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', background: '#fff' }}/>
                  <span style={{ fontSize: 13, color: 'var(--fg-muted)', fontFamily: 'monospace' }}>{form.couleur}</span>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: form.couleur, flexShrink: 0 }}/>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne droite — champs formulaire */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Champs du formulaire d'inscription</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 16 }}>Ces champs seront présentés aux participants sur la page d'inscription.</div>
            <ChampsEditor champs={form.champs} onChange={v => setF('champs', v)}/>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Options</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13.5 }}>
                <input type="checkbox" checked={form.inscriptionsOuvertes} onChange={e => setF('inscriptionsOuvertes', e.target.checked)} style={{ accentColor: 'var(--burgundy-800)', width: 16, height: 16 }}/>
                <div>
                  <div style={{ fontWeight: 500 }}>Inscriptions ouvertes</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Les participants peuvent s'inscrire immédiatement</div>
                </div>
              </label>
              <div className="field" style={{ marginTop: 4 }}>
                <label className="field-label">Statut</label>
                <select className="input" value={form.statut} onChange={e => setF('statut', e.target.value)}>
                  <option value="brouillon">Brouillon</option>
                  <option value="publie">Publié</option>
                  <option value="complet">Complet</option>
                  <option value="annule">Annulé</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Onglet Inscriptions ───────────────────────────────────────────────────────
const EventDetailInscriptions = ({ event, inscriptions }) => {
  const [filterStatut, setFilterStatut] = React.useState('all');
  const filtered = inscriptions.filter(i => filterStatut === 'all' || i.statut === filterStatut);
  const totalTTC = inscriptions.filter(i => i.statut === 'paye').reduce((s, i) => s + i.montantTTC, 0);
  const totalPlaces = inscriptions.reduce((s, i) => s + (i.statut !== 'annule' ? i.places : 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {[
          { label: 'Places réservées',  val: totalPlaces + ' / ' + event.capacite, icon: <Icon.Users size={18}/>,   bg: '#eff6ff', fg: '#1d4ed8' },
          { label: 'Revenus TTC perçus', val: eurEvt(totalTTC),                     icon: <Icon.Euro size={18}/>,    bg: '#f0fdf4', fg: '#166534' },
          { label: 'Inscrits',           val: inscriptions.filter(i => i.statut !== 'annule').length, icon: <Icon.CheckCircle size={18}/>, bg: '#fdf4ff', fg: '#7c3aed' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: k.bg, color: k.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div className="tnum" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>{k.val}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 2 }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {[['all','Tous'], ['paye','Payés'], ['en-attente','En attente'], ['annule','Annulés']].map(([v, l]) => (
          <button key={v} onClick={() => setFilterStatut(v)} className={`btn btn-sm ${filterStatut === v ? 'btn-primary' : 'btn-ghost'}`}
            style={filterStatut === v ? {} : { color: 'var(--fg-muted)' }}>{l}</button>
        ))}
        <div style={{ flex: 1 }}/>
        <button className="btn btn-outline btn-sm"><Icon.Download size={13}/> Exporter CSV</button>
        <button className="btn btn-outline btn-sm"><Icon.Mail size={13}/> E-mail à tous</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table className="table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Date</th><th>Participant</th><th>Places</th><th className="num">Montant TTC</th><th>Paiement</th><th>Statut</th><th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--fg-muted)', fontSize: 13 }}>Aucune inscription</td></tr>
            ) : filtered.map(ins => (
              <tr key={ins.id}>
                <td className="tnum" style={{ fontSize: 12, color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{ins.date.replace('T', ' ')}</td>
                <td>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{ins.nom}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>{ins.email}</div>
                </td>
                <td className="tnum" style={{ fontWeight: 600 }}>{ins.places}</td>
                <td className="num tnum" style={{ fontWeight: 600 }}>{eurEvt(ins.montantTTC)}</td>
                <td style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{ins.modePaiement}</td>
                <td><InsStatutBadge statut={ins.statut}/></td>
                <td>
                  <button className="btn btn-ghost btn-sm btn-icon" title="Actions"><Icon.MoreH size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Onglet Paramètres ─────────────────────────────────────────────────────────
const EventDetailParams = ({ event, onUpdate }) => {
  const [insc, setInsc] = React.useState(event.inscriptionsOuvertes);
  const [statut, setStatut] = React.useState(event.statut);

  return (
    <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card" style={{ padding: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>État des inscriptions</div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
          <div style={{ marginTop: 2 }}>
            <input type="checkbox" checked={insc} onChange={e => setInsc(e.target.checked)} style={{ accentColor: 'var(--burgundy-800)', width: 17, height: 17 }}/>
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>Inscriptions ouvertes</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>Les visiteurs peuvent s'inscrire depuis la page publique</div>
          </div>
        </label>
      </div>
      <div className="card" style={{ padding: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Statut de l'événement</div>
        <select className="input" value={statut} onChange={e => setStatut(e.target.value)} style={{ marginBottom: 12 }}>
          <option value="brouillon">Brouillon — non visible</option>
          <option value="publie">Publié — visible & accessible</option>
          <option value="complet">Complet — inscriptions fermées</option>
          <option value="annule">Annulé</option>
          <option value="termine">Terminé</option>
        </select>
        <button className="btn btn-primary" onClick={() => onUpdate({ ...event, statut, inscriptionsOuvertes: insc })}>
          <Icon.Check size={13}/> Enregistrer
        </button>
      </div>
      <div className="card" style={{ padding: 22, border: '1px solid #fecaca' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#dc2626', marginBottom: 10 }}>Zone de danger</div>
        <button className="btn btn-outline btn-sm" style={{ color: '#dc2626', borderColor: '#fecaca' }}>
          <Icon.Trash size={13}/> Supprimer cet événement
        </button>
      </div>
    </div>
  );
};

// ── Vue détail ────────────────────────────────────────────────────────────────
const EventDetail = ({ event, inscriptions, onBack, onEdit, onUpdate }) => {
  const [tab, setTab] = React.useState('inscriptions');
  const tabs = [
    { id: 'inscriptions', label: 'Inscriptions', badge: inscriptions.filter(i => i.statut !== 'annule').length },
    { id: 'detail',       label: 'Détail' },
    { id: 'emails',       label: 'E-mails' },
    { id: 'params',       label: 'Paramètres' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 24 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginTop: 4 }}><Icon.ChevronLeft size={14}/> Événements</button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 className="display" style={{ fontSize: 22, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>{event.titre}</h1>
            <EventStatutBadge statut={event.statut}/>
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{event.date} à {event.heure} · {event.lieu}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href={'?event=' + event.id} target="_blank" className="btn btn-outline btn-sm" style={{ textDecoration: 'none' }}>
            <Icon.Globe size={13}/> Voir la page
          </a>
          <button className="btn btn-primary btn-sm" onClick={onEdit}>
            <Icon.Edit size={13}/> Modifier
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13.5, fontWeight: tab === t.id ? 600 : 400,
            color: tab === t.id ? 'var(--burgundy-800)' : 'var(--fg-muted)',
            borderBottom: `2px solid ${tab === t.id ? 'var(--burgundy-800)' : 'transparent'}`,
            marginBottom: -1, transition: 'all .1s', display: 'flex', alignItems: 'center', gap: 7,
          }}>
            {t.label}
            {t.badge !== undefined && <span style={{ minWidth: 18, height: 18, borderRadius: 999, background: tab === t.id ? 'var(--burgundy-800)' : 'var(--border)', color: tab === t.id ? '#fff' : 'var(--fg-muted)', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>{t.badge}</span>}
          </button>
        ))}
      </div>

      {tab === 'inscriptions' && <EventDetailInscriptions event={event} inscriptions={inscriptions}/>}
      {tab === 'detail' && (
        <div style={{ maxWidth: 600 }} className="card">
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              ['Titre', event.titre], ['Date', event.date + ' à ' + event.heure],
              ['Lieu', event.lieu], ['Adresse', event.adresse],
              ['Capacité', event.capacite + ' personnes'], ['Prix', eurEvt(event.prixHT) + ' HT / pers.'],
              ['Champs formulaire', event.champs.map(c => c.label + (c.requis ? ' *' : '')).join(' · ')],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, alignItems: 'start' }}>
                <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', paddingTop: 1 }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 400 }}>{v}</div>
              </div>
            ))}
            {event.description && (
              <div style={{ paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 8 }}>Description</div>
                <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>{event.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
      {tab === 'emails' && (
        <div style={{ maxWidth: 560 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Envoyer un e-mail aux participants</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 18 }}>{inscriptions.filter(i => i.statut !== 'annule').length} destinataires · Tous les inscrits non annulés</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="field"><label className="field-label">Objet</label><input className="input" placeholder="Objet de l'e-mail"/></div>
              <div className="field"><label className="field-label">Message</label><textarea className="input" rows={6} placeholder="Votre message…"/></div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button className="btn btn-outline btn-sm"><Icon.Eye size={13}/> Prévisualiser</button>
                <button className="btn btn-primary btn-sm"><Icon.Send size={13}/> Envoyer</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {tab === 'params' && <EventDetailParams event={event} onUpdate={onUpdate}/>}
    </div>
  );
};

// ── Composant racine ──────────────────────────────────────────────────────────
const AdminMiniEvents = () => {
  const [view, setView]       = React.useState('list'); // list | detail | create | edit
  const [events, setEvents]   = React.useState(MINI_EVENTS_INIT);
  const [inscriptions, setInscriptions] = React.useState(INSCRIPTIONS_INIT);
  const [activeId, setActiveId] = React.useState(null);

  const activeEvent = events.find(e => e.id === activeId);
  const activeInscriptions = inscriptions[activeId] || [];

  const handleSelect = (id) => { setActiveId(id); setView('detail'); };
  const handleCreate = () => { setActiveId(null); setView('create'); };
  const handleEdit   = () => setView('edit');
  const handleBack   = () => setView('list');

  const handleSave = (updated) => {
    if (view === 'create') {
      setEvents(evts => [updated, ...evts]);
      setInscriptions(ins => ({ ...ins, [updated.id]: [] }));
      setActiveId(updated.id);
      setView('detail');
    } else {
      setEvents(evts => evts.map(e => e.id === updated.id ? updated : e));
      setView('detail');
    }
  };

  const handleUpdate = (updated) => {
    setEvents(evts => evts.map(e => e.id === updated.id ? updated : e));
  };

  if (view === 'list')   return <EventsList events={events} onSelect={handleSelect} onCreate={handleCreate}/>;
  if (view === 'create') return <EventForm event={null} onSave={handleSave} onBack={handleBack}/>;
  if (view === 'edit')   return <EventForm event={activeEvent} onSave={handleSave} onBack={() => setView('detail')}/>;
  if (view === 'detail') return <EventDetail event={activeEvent} inscriptions={activeInscriptions} onBack={handleBack} onEdit={handleEdit} onUpdate={handleUpdate}/>;
  return null;
};

Object.assign(window, { AdminMiniEvents, MINI_EVENTS_INIT });
