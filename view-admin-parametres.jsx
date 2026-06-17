// ─── Paramètres : 6 pages ────────────────────────────────────────

// Shared section helpers

const ParamCard = ({ title, icon, sub, children, actions }) => (
  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
    <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--border)', background: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {icon && <span style={{ color: 'var(--burgundy-800)', display: 'inline-flex' }}>{icon}</span>}
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg)' }}>{title}</div>
          {sub && <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 1 }}>{sub}</div>}
        </div>
      </div>
      {actions}
    </div>
    <div style={{ padding: '18px 22px' }}>{children}</div>
  </div>
);

const ParamRow = ({ label, hint, children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20, alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>{label}</div>
      {hint && <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 3, lineHeight: 1.4 }}>{hint}</div>}
    </div>
    <div>{children}</div>
  </div>
);

// ─── Page 1 — Configuration concours ──────────────────────────────

const FORMAT_COLORS = ['#f59e0b','#8b5cf6','#0ea5e9','#16a34a','#ef4444','#f97316','#ec4899','#64748b'];

const AdminParamConcours = () => {
  const [concours, setConcours] = React.useState('france-2026');
  const [dirty, setDirty]       = React.useState(false);
  const markDirty = () => setDirty(true);

  const [formats, setFormats] = React.useState([
    { id: 'autocollants',      label: 'Autocollants ronds',          sub: 'Macaron Ø 35 mm · bouteilles',                   active: true,  units: 1,   prix: 0.15,  color: '#f59e0b', builtin: true  },
    { id: 'autocollants_rect', label: 'Autocollants rectangulaires', sub: 'Format col 80 × 30 mm',                          active: true,  units: 1,   prix: 0.20,  color: '#8b5cf6', builtin: true  },
    { id: 'plaques',           label: 'Plaques métal',               sub: 'Aluminium brossé · vitrines et présentoirs',     active: true,  units: 10,  prix: 25.00, color: '#0ea5e9', builtin: true  },
    { id: 'diplomes',          label: 'Certificats / Diplômes',      sub: 'Format A4 encadrable · attestation officielle',  active: false, units: 5,   prix: 8.00,  color: '#16a34a', builtin: true  },
    { id: 'boites',            label: 'Boîtes vrac',                 sub: 'Conditionnement cave · grands volumes',          active: false, units: 100, prix: 45.00, color: '#64748b', builtin: true  },
  ]);

  // Formulaire d'ajout
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newLabel,    setNewLabel]    = React.useState('');
  const [newSub,      setNewSub]      = React.useState('');
  const [newUnits,    setNewUnits]    = React.useState(1);
  const [newColor,    setNewColor]    = React.useState(FORMAT_COLORS[4]);

  const handleAddFormat = () => {
    if (!newLabel.trim()) return;
    const id = 'custom_' + Date.now();
    setFormats(f => [...f, { id, label: newLabel.trim(), sub: newSub.trim(), active: true, units: parseInt(newUnits, 10) || 1, color: newColor, builtin: false }]);
    setNewLabel(''); setNewSub(''); setNewUnits(1); setNewColor(FORMAT_COLORS[4]);
    setShowAddForm(false);
    markDirty();
  };

  const handleDeleteFormat = (id) => {
    setFormats(f => f.filter(x => x.id !== id));
    markDirty();
  };

  const updateFormat = (id, patch) => {
    setFormats(f => f.map(x => x.id === id ? { ...x, ...patch } : x));
    markDirty();
  };

  return (
    <div data-screen-label="admin-param-concours">
      <PageHeader
        breadcrumb={['Administration', 'Paramètres', 'Configuration concours']}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span>Configuration concours</span>
            <SalonPicker
              salons={[
                { id: 'france-2026', label: 'Concours des Grands Vins de France 2026' },
                { id: 'monde-2026',  label: 'Concours des Grands Vins du Monde 2026' },
                { id: 'france-2025', label: 'Concours des Grands Vins de France 2025' },
              ]}
              value={concours}
              onChange={(v) => { setConcours(v); setDirty(false); }}
            />
          </div>
        }
        subtitle="Paramètres généraux par édition · tarifs · règles de contrôle"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Dates */}
        <ParamCard title="Dates de l'édition" icon={<Icon.Calendar size={14}/>} sub="Calendrier opérationnel">
          <ParamRow label="Ouverture des inscriptions" hint="Date à partir de laquelle les producteurs peuvent déposer un dossier">
            <input type="date" className="input tnum" defaultValue="2026-01-15" onChange={markDirty} style={{ maxWidth: 220 }}/>
          </ParamRow>
          <ParamRow label="Clôture des inscriptions" hint="Date limite de dépôt — dérogations possibles au-delà">
            <input type="date" className="input tnum" defaultValue="2026-03-31" onChange={markDirty} style={{ maxWidth: 220 }}/>
          </ParamRow>
          <ParamRow label="Dégustation" hint="Semaine de jurys">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', maxWidth: 460 }}>
              <input type="date" className="input tnum" defaultValue="2026-04-13" onChange={markDirty}/>
              <span style={{ color: 'var(--fg-muted)' }}>→</span>
              <input type="date" className="input tnum" defaultValue="2026-04-17" onChange={markDirty}/>
            </div>
          </ParamRow>
          <ParamRow label="Publication du palmarès" hint="Date prévue de mise en ligne des résultats">
            <input type="date" className="input tnum" defaultValue="2026-05-15" onChange={markDirty} style={{ maxWidth: 220 }}/>
          </ParamRow>
        </ParamCard>

        {/* Tarification */}
        <ParamCard title="Tarification" icon={<Icon.Euro size={14}/>} sub="Frais d'inscription par échantillon">
          <ParamRow label="Tarif par échantillon" hint="Montant HT facturé par échantillon présenté">
            <div style={{ position: 'relative', maxWidth: 160 }}>
              <input type="number" className="input tnum" defaultValue={60} onChange={markDirty} style={{ paddingRight: 28 }}/>
              <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13, pointerEvents: 'none' }}>€</span>
            </div>
          </ParamRow>
          <ParamRow label="Tranches dégressives" hint="Réductions sur le total HT en fonction du nombre d'échantillons">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { from: 1,  to: 5,  pct: 0  },
                { from: 6,  to: 10, pct: 10 },
                { from: 11, to: 99, pct: 20 },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--fg-muted)', minWidth: 80 }}>De</span>
                  <input type="number" className="input tnum" defaultValue={t.from} onChange={markDirty} style={{ width: 80 }}/>
                  <span style={{ color: 'var(--fg-muted)' }}>à</span>
                  <input type="number" className="input tnum" defaultValue={t.to} onChange={markDirty} style={{ width: 80 }}/>
                  <span style={{ color: 'var(--fg-muted)' }}>échantillons :</span>
                  <div style={{ position: 'relative', width: 100 }}>
                    <input type="number" className="input tnum" defaultValue={t.pct} onChange={markDirty} style={{ paddingRight: 28 }}/>
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13, pointerEvents: 'none' }}>%</span>
                  </div>
                  <button className="btn btn-icon btn-sm btn-ghost"><Icon.X size={13}/></button>
                </div>
              ))}
              <button className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                <Icon.Plus size={13}/> Ajouter une tranche
              </button>
            </div>
          </ParamRow>
          <ParamRow label="Nombre max d'échantillons" hint="Plafond par dossier d'inscription">
            <input type="number" className="input tnum" defaultValue={12} onChange={markDirty} style={{ maxWidth: 120 }}/>
          </ParamRow>
          <ParamRow label="Prix repas — Dégustateur" hint="Tarif HT par dégustateur pour les repas du concours">
            <div style={{ position: 'relative', maxWidth: 160 }}>
              <input type="number" className="input tnum" defaultValue={38} onChange={markDirty} style={{ paddingRight: 28 }}/>
              <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13, pointerEvents: 'none' }}>€</span>
            </div>
          </ParamRow>
          <ParamRow label="Prix repas — Accompagnateur" hint="Tarif HT par accompagnateur (distinct du tarif dégustateur)">
            <div style={{ position: 'relative', maxWidth: 160 }}>
              <input type="number" className="input tnum" defaultValue={28} onChange={markDirty} style={{ paddingRight: 28 }}/>
              <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13, pointerEvents: 'none' }}>€</span>
            </div>
          </ParamRow>
        </ParamCard>

        {/* Formats de médailles */}
        <ParamCard title="Formats de médailles" icon={<Icon.Medal size={14}/>} sub="Types d'articles disponibles à la commande par les producteurs">
          <ParamRow label="Formats commandables" hint="Cochez les formats proposés aux producteurs pour cette édition. L'équivalence détermine combien d'unités quota consomme chaque article.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

              {/* Liste des formats existants */}
              {formats.map((f) => (
                <div key={f.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px',
                  background: f.active ? 'var(--surface)' : 'var(--surface-2)',
                  border: '1px solid ' + (f.active ? 'var(--border)' : 'var(--border)'),
                  borderRadius: 8,
                  opacity: f.active ? 1 : 0.65,
                  transition: 'opacity .15s',
                }}>
                  {/* Checkbox activer/désactiver */}
                  <input
                    type="checkbox"
                    checked={f.active}
                    onChange={e => updateFormat(f.id, { active: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: 'var(--burgundy-800)', flexShrink: 0, cursor: 'pointer' }}
                  />
                  {/* Pastille couleur */}
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: f.color, flexShrink: 0 }}/>
                  {/* Identité */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{f.label}</div>
                    {f.sub && <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 1 }}>{f.sub}</div>}
                    {!f.builtin && (
                      <span style={{ fontSize: 11, color: 'var(--burgundy-600)', marginTop: 2, display: 'inline-block' }}>Format personnalisé</span>
                    )}
                  </div>
                  {/* Équivalence modifiable */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>Équivalent</span>
                    <input
                      type="number"
                      className="input tnum"
                      value={f.units}
                      min={1}
                      onChange={e => updateFormat(f.id, { units: parseInt(e.target.value, 10) || 1 })}
                      style={{ width: 72, textAlign: 'center', fontSize: 13 }}
                    />
                    <span style={{ fontSize: 12, color: 'var(--fg-muted)', minWidth: 34 }}>unité{f.units !== 1 ? 's' : ''}</span>
                  </div>
                  {/* Prix unitaire */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>Prix</span>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        className="input tnum"
                        value={f.prix}
                        min={0}
                        step={0.01}
                        onChange={e => { updateFormat(f.id, { prix: parseFloat(e.target.value) || 0 }); }}
                        style={{ width: 84, textAlign: 'right', fontSize: 13, paddingRight: 24 }}
                      />
                      <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 12, pointerEvents: 'none' }}>€</span>
                    </div>
                  </div>
                  {/* Supprimer (formats personnalisés seulement) */}
                  {!f.builtin ? (
                    <button
                      className="btn btn-icon btn-ghost btn-sm"
                      onClick={() => handleDeleteFormat(f.id)}
                      title="Supprimer ce format"
                      style={{ color: 'var(--danger)', flexShrink: 0 }}
                    >
                      <Icon.Trash size={13}/>
                    </button>
                  ) : (
                    <div style={{ width: 28, flexShrink: 0 }}/>
                  )}
                </div>
              ))}

              {/* Formulaire d'ajout inline */}
              {showAddForm ? (
                <div style={{
                  padding: '14px 16px',
                  background: 'var(--burgundy-50)',
                  border: '1px solid var(--burgundy-200)',
                  borderRadius: 8,
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--burgundy-900)', marginBottom: 2 }}>
                    Nouveau format
                  </div>
                  {/* Nom + description */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ flex: '0 0 220px' }}>
                      <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--fg-muted)', marginBottom: 4 }}>Nom du format *</div>
                      <input
                        className="input"
                        placeholder="ex : Étiquette adhésive"
                        value={newLabel}
                        onChange={e => setNewLabel(e.target.value)}
                        style={{ fontSize: 13 }}
                        autoFocus
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--fg-muted)', marginBottom: 4 }}>Description (optionnel)</div>
                      <input
                        className="input"
                        placeholder="ex : Format 50 × 70 mm · usage salon"
                        value={newSub}
                        onChange={e => setNewSub(e.target.value)}
                        style={{ fontSize: 13 }}
                      />
                    </div>
                  </div>
                  {/* Équivalence + couleur */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--fg-muted)', marginBottom: 4 }}>Équivalent unités</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="number"
                          className="input tnum"
                          value={newUnits}
                          min={1}
                          onChange={e => setNewUnits(e.target.value)}
                          style={{ width: 80, textAlign: 'center' }}
                        />
                        <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>unité{newUnits > 1 ? 's' : ''} / article</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--fg-muted)', marginBottom: 6 }}>Couleur</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {FORMAT_COLORS.map(c => (
                          <button
                            key={c}
                            onClick={() => setNewColor(c)}
                            style={{
                              width: 22, height: 22, borderRadius: '50%',
                              background: c, border: 'none', cursor: 'pointer', padding: 0,
                              outline: newColor === c ? '2px solid var(--burgundy-800)' : '2px solid transparent',
                              outlineOffset: 2,
                              transition: 'outline .1s',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => { setShowAddForm(false); setNewLabel(''); setNewSub(''); }}
                      >
                        Annuler
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={!newLabel.trim()}
                        onClick={handleAddFormat}
                        style={{ background: 'var(--burgundy-800)', opacity: newLabel.trim() ? 1 : 0.45 }}
                      >
                        <Icon.Plus size={13}/> Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setShowAddForm(true)}
                  style={{ alignSelf: 'flex-start', marginTop: 2 }}
                >
                  <Icon.Plus size={13}/> Ajouter un format
                </button>
              )}

              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2, paddingLeft: 2 }}>
                <Icon.Info size={12} style={{ verticalAlign: 'middle', marginRight: 5 }}/>
                L'équivalence détermine combien d'unités du quota médailles consomme chaque article commandé.
              </div>
            </div>
          </ParamRow>
        </ParamCard>

        {/* Règles de contrôle */}
        <ParamCard title="Règles de contrôle" icon={<Icon.ShieldCheck size={14}/>} sub="Validation automatique des dossiers">
          <ParamRow label="Seuil de confiance OCR" hint="En-dessous, le dossier est marqué « À vérifier »">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 380 }}>
              <input type="range" min={50} max={100} defaultValue={85} onChange={markDirty} style={{ flex: 1, accentColor: 'var(--burgundy-800)' }}/>
              <span className="tnum" style={{ minWidth: 50, textAlign: 'right', fontWeight: 600, color: 'var(--burgundy-800)' }}>85 %</span>
            </div>
          </ParamRow>
          <ParamRow label="Tolérance DREV" hint="Écart maximum accepté entre volume déclaré et volume DREV">
            <div style={{ position: 'relative', maxWidth: 140 }}>
              <input type="number" className="input tnum" defaultValue={5} onChange={markDirty} style={{ paddingRight: 28 }}/>
              <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13, pointerEvents: 'none' }}>%</span>
            </div>
          </ParamRow>
          <ParamRow label="Auto-validation" hint="Valider automatiquement les dossiers sans anomalie après contrôle OCR">
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked onChange={markDirty} style={{ width: 16, height: 16, accentColor: 'var(--burgundy-800)' }}/>
              <span style={{ fontSize: 13, color: 'var(--fg)' }}>Activée</span>
            </label>
          </ParamRow>
          <ParamRow label="Documents requis" hint="Pièces obligatoires pour qu'un dossier soit acceptable">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                ['KBis', true],
                ['Bulletin d\'analyses', true],
                ['Revendication de récolte', true],
                ['Étiquette / contre-étiquette', false],
                ['Attestation HVE', false],
              ].map(([label, def]) => (
                <label key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked={def} onChange={markDirty} style={{ accentColor: 'var(--burgundy-800)' }}/>
                  {label}
                </label>
              ))}
            </div>
          </ParamRow>
        </ParamCard>
      </div>

      {/* Sticky save bar */}
      {dirty && (
        <div style={{
          position: 'sticky', bottom: 16, marginTop: 18,
          padding: '12px 16px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(15,23,42,0.10)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <span style={{ fontSize: 12.5, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: '#f59e0b' }}/>
            Modifications non sauvegardées
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline btn-sm" onClick={() => setDirty(false)}>Annuler</button>
            <button className="btn btn-primary btn-sm" onClick={() => setDirty(false)} style={{ background: 'var(--burgundy-800)' }}>
              <Icon.Check size={13}/> Sauvegarder
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Page 2 — Appellations & régions ──────────────────────────────

const REGIONS = [
  {
    id: 'maconnais', nom: 'Mâconnais', dept: '71', count: 12,
    appellations: [
      { nom: 'Mâcon-Villages',  type: 'AOC', mill: [2020, 2021, 2022, 2023, 2024] },
      { nom: 'Pouilly-Fuissé',  type: 'AOC', mill: [2020, 2021, 2022, 2023] },
      { nom: 'Saint-Véran',     type: 'AOC', mill: [2021, 2022, 2023, 2024] },
      { nom: 'Viré-Clessé',     type: 'AOC', mill: [2021, 2022, 2023, 2024] },
      { nom: 'Mâcon',           type: 'AOC', mill: [2020, 2021, 2022, 2023, 2024] },
    ],
  },
  {
    id: 'cote-beaune', nom: 'Côte-de-Beaune', dept: '21', count: 15,
    appellations: [
      { nom: 'Beaune 1er Cru',  type: 'AOC', mill: [2019, 2020, 2021, 2022, 2023] },
      { nom: 'Meursault',       type: 'AOC', mill: [2020, 2021, 2022, 2023] },
      { nom: 'Pommard',         type: 'AOC', mill: [2019, 2020, 2021, 2022, 2023] },
      { nom: 'Volnay',          type: 'AOC', mill: [2020, 2021, 2022, 2023] },
    ],
  },
  {
    id: 'cote-chalonnaise', nom: 'Côte chalonnaise', dept: '71', count: 6,
    appellations: [
      { nom: 'Mercurey',           type: 'AOC', mill: [2020, 2021, 2022, 2023] },
      { nom: 'Givry',              type: 'AOC', mill: [2020, 2021, 2022, 2023] },
      { nom: 'Bourgogne Aligoté',  type: 'AOC', mill: [2022, 2023, 2024] },
    ],
  },
  {
    id: 'beaujolais', nom: 'Beaujolais', dept: '69', count: 10,
    appellations: [
      { nom: 'Brouilly',  type: 'AOC', mill: [2021, 2022, 2023, 2024] },
      { nom: 'Morgon',    type: 'AOC', mill: [2020, 2021, 2022, 2023] },
      { nom: 'Fleurie',   type: 'AOC', mill: [2021, 2022, 2023, 2024] },
    ],
  },
];

const AdminParamAppellations = () => {
  const [openRegion, setOpenRegion] = React.useState(REGIONS[0].id);
  const [appellationModal, setAppellationModal] = React.useState(false);
  const [editingAppellation, setEditingAppellation] = React.useState(null);
  const [regionModal, setRegionModal] = React.useState(false);

  const region = REGIONS.find(r => r.id === openRegion);

  return (
    <div data-screen-label="admin-param-appellations">
      <PageHeader
        breadcrumb={['Administration', 'Paramètres', 'Appellations & régions']}
        title="Appellations & régions"
        subtitle="Référentiel viticole utilisé dans les formulaires d'inscription"
        actions={<>
          <button className="btn btn-primary btn-sm" onClick={() => setRegionModal(true)} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Plus size={14}/> Ajouter une région
          </button>
        </>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        {/* Regions list */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', alignSelf: 'flex-start' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--slate-50)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Régions</div>
          </div>
          <div>
            {REGIONS.map((r, i) => {
              const active = openRegion === r.id;
              return (
                <button key={r.id} onClick={() => setOpenRegion(r.id)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', border: 'none',
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                  background: active ? 'var(--burgundy-50)' : 'transparent',
                  borderLeft: active ? '3px solid var(--burgundy-800)' : '3px solid transparent',
                  textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <Icon.Map size={14} style={{ color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)', flexShrink: 0 }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: active ? 600 : 500, color: active ? 'var(--burgundy-800)' : 'var(--fg)' }}>{r.nom}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 1 }} className="tnum">Département {r.dept}</div>
                  </div>
                  <span style={{
                    fontSize: 11, padding: '0 7px', borderRadius: 999,
                    background: active ? 'var(--burgundy-800)' : 'var(--slate-100)',
                    color: active ? '#fff' : 'var(--fg-muted)', fontWeight: 600,
                  }} className="tnum">{r.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Appellations of selected region */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--border)', background: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Appellations de</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--fg)', marginTop: 2 }}>{region.nom}</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-outline btn-sm"><Icon.Edit size={13}/> Renommer</button>
              <button className="btn btn-outline btn-sm" style={{ color: '#991b1b', borderColor: '#fecaca' }}>
                <Icon.Trash size={13}/> Supprimer région
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setAppellationModal(true)} style={{ background: 'var(--burgundy-800)' }}>
                <Icon.Plus size={13}/> Ajouter appellation
              </button>
            </div>
          </div>
          <div className="table-wrap" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Appellation</th>
                  <th>Type</th>
                  <th>Millésimes autorisés</th>
                  <th style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {region.appellations.map((a, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{a.nom}</td>
                    <td>
                      <span style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 4,
                        background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                        fontWeight: 600, letterSpacing: '0.04em',
                      }}>{a.type}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {a.mill.map(m => (
                          <span key={m} className="tnum" style={{
                            fontSize: 11, padding: '2px 7px', borderRadius: 4,
                            background: 'var(--slate-100)', color: 'var(--fg)',
                            fontWeight: 500,
                          }}>{m}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <button className="btn btn-icon btn-sm btn-ghost" title="Modifier" onClick={() => setEditingAppellation(a)}><Icon.Edit size={13}/></button>
                        <button className="btn btn-icon btn-sm btn-ghost" title="Supprimer"><Icon.Trash size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {appellationModal && <AppellationModal region={region} onCancel={() => setAppellationModal(false)} onConfirm={() => setAppellationModal(false)}/>}
      {editingAppellation && <AppellationModal region={region} editing={editingAppellation} onCancel={() => setEditingAppellation(null)} onConfirm={() => setEditingAppellation(null)}/>}
      {regionModal && <RegionModal onCancel={() => setRegionModal(false)} onConfirm={() => setRegionModal(false)}/>}
    </div>
  );
};

const RegionModal = ({ onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);
  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 440, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '22px 26px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <h2 className="display" style={{ fontSize: 19, fontWeight: 500, margin: 0 }}>Ajouter une région</h2>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
        </div>
        <div style={{ padding: '18px 26px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Nom</span>
            <input className="input" placeholder="Ex. Chablisien"/></label>
          <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Département</span>
            <input className="input tnum" placeholder="89"/></label>
        </div>
        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button className="btn btn-primary" onClick={onConfirm} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Check size={13}/> Créer
          </button>
        </div>
      </div>
    </div>
  );
};

const AppellationModal = ({ region, editing, onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const [nom, setNom]       = React.useState(editing?.nom || '');
  const [type, setType]     = React.useState(editing?.type || 'AOC');
  const [mills, setMills]   = React.useState(editing?.mill ? [...editing.mill].sort((a, b) => b - a) : []);
  const [newMill, setNewMill] = React.useState('');

  const addMill = () => {
    const n = parseInt(newMill, 10);
    if (!n || n < 1900 || n > 2100) return;
    if (mills.includes(n)) return;
    setMills(ms => [...ms, n].sort((a, b) => b - a));
    setNewMill('');
  };
  const removeMill = (n) => setMills(ms => ms.filter(m => m !== n));

  const canSave = nom.trim().length > 0;

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 520, padding: 0, overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '22px 26px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 6 }}>Région : {region.nom}</div>
            <h2 className="display" style={{ fontSize: 19, fontWeight: 500, margin: 0 }}>
              {editing ? `Modifier ${editing.nom}` : 'Ajouter une appellation'}
            </h2>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
        </div>

        <div style={{ padding: '18px 26px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label className="field">
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Nom de l'appellation <span style={{ color: '#dc2626' }}>*</span></span>
            <input className="input" placeholder="Ex. Pouilly-Loché" value={nom} onChange={e => setNom(e.target.value)}/>
          </label>

          <label className="field">
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Type</span>
            <select className="input" value={type} onChange={e => setType(e.target.value)}>
              <option>AOC</option>
              <option>AOP</option>
              <option>IGP</option>
              <option>Vin de France</option>
            </select>
          </label>

          <div>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>
              Millésimes autorisés <span style={{ color: 'var(--fg-subtle)', fontWeight: 400 }}>({mills.length})</span>
            </span>
            <div style={{
              minHeight: 60,
              padding: '10px 12px',
              border: '1px solid var(--border)', borderRadius: 8,
              background: 'var(--slate-50)',
              display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'flex-start',
            }}>
              {mills.length === 0 && (
                <span style={{ fontSize: 12, color: 'var(--fg-subtle)', fontStyle: 'italic', padding: '4px 2px' }}>Aucun millésime — ajoutez-en ci-dessous.</span>
              )}
              {mills.map(m => (
                <span key={m} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 4px 3px 9px', borderRadius: 6,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  fontSize: 12.5, fontWeight: 500, color: 'var(--fg)',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {m}
                  <button
                    onClick={() => removeMill(m)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 18, height: 18, padding: 0,
                      border: 'none', background: 'transparent',
                      color: 'var(--fg-muted)', cursor: 'pointer', borderRadius: 4,
                    }}
                    title="Retirer"
                    onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#991b1b'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-muted)'; }}
                  >
                    <Icon.X size={11}/>
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <input
                type="number"
                className="input tnum"
                placeholder="Année (ex. 2024)"
                value={newMill}
                onChange={e => setNewMill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMill())}
                style={{ maxWidth: 200 }}
              />
              <button className="btn btn-outline btn-sm" onClick={addMill} disabled={!newMill}>
                <Icon.Plus size={13}/> Ajouter
              </button>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 6 }}>Appuyer sur Entrée pour ajouter rapidement.</div>
          </div>
        </div>

        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={!canSave}
            style={{ background: 'var(--burgundy-800)', opacity: canSave ? 1 : 0.45 }}
          >
            <Icon.Check size={13}/> {editing ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page 3 — Fournisseurs médailles ──────────────────────────────

const AdminParamFournisseurs = () => {
  const [addModal, setAddModal] = React.useState(false);
  const [editId, setEditId] = React.useState(null);

  const FOURNISSEURS = [
    { id: 'lyon',     nom: 'Médailleur Lyon',   contact: 'Pierre Dupont', email: 'contact@medailleur-lyon.fr',   tel: '04 78 12 34 56', formatId: 'CSV',  delai: 14, status: 'actif',   producteurs: 248, medailles: ['or', 'argent', 'bronze'] },
    { id: 'bordeaux', nom: 'Médailleur Bordeaux','contact': 'Marie Verdier', email: 'commandes@verdier-medailles.fr','tel': '05 56 78 12 34', formatId: 'CSV',  delai: 21, status: 'actif',   producteurs: 52,  medailles: ['or', 'argent', 'bronze'] },
    { id: 'paris',    nom: 'Arthus-Bertrand',   contact: 'Sophie Martin', email: 'btob@arthus-bertrand.fr',      tel: '01 42 60 73 19', formatId: 'XLSX', delai: 30, status: 'inactif', producteurs: 12,  medailles: ['or'] },
  ];

  const paged = useSortablePaged(FOURNISSEURS, {
    defaultPageSize: 25,
    accessors: {
      nom: f => f.nom, contact: f => f.contact, formatId: f => f.formatId,
      delai: f => f.delai, producteurs: f => f.producteurs, statut: f => f.status,
    },
  });

  return (
    <div data-screen-label="admin-param-fournisseurs">
      <PageHeader
        breadcrumb={['Administration', 'Paramètres', 'Fournisseurs médailles']}
        title="Fournisseurs médailles"
        subtitle="Médailleurs partenaires · Format d'export et délais de production"
        actions={<>
          <button className="btn btn-primary btn-sm" onClick={() => setAddModal(true)} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Plus size={14}/> Ajouter un fournisseur
          </button>
        </>}
      />

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <SortableTh sortKey="nom"         currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Fournisseur</SortableTh>
              <SortableTh sortKey="contact"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Contact</SortableTh>
              <SortableTh sortKey="formatId"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Format d'export</SortableTh>
              <th>Médailles gérées</th>
              <SortableTh sortKey="delai"       currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Délai (j)</SortableTh>
              <SortableTh sortKey="producteurs" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Producteurs rattachés</SortableTh>
              <SortableTh sortKey="statut"      currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Statut</SortableTh>
              <th style={{ width: 100 }}></th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.map(f => (
              <tr key={f.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon.Building size={15}/>
                    </span>
                    <div>
                      <div style={{ fontWeight: 500 }}>{f.nom}</div>
                      <div className="muted" style={{ fontSize: 11.5, fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>{f.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 13 }}>{f.contact}</div>
                  <div className="muted" style={{ fontSize: 11.5, fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>{f.email}</div>
                </td>
                <td>
                  <span style={{
                    fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
                    fontSize: 11.5, padding: '2px 7px', borderRadius: 4,
                    background: 'var(--slate-100)', color: 'var(--fg)', fontWeight: 600,
                    border: '1px solid var(--border)',
                  }}>{f.formatId}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {['or', 'argent', 'bronze'].map(m => {
                      const enabled = f.medailles.includes(m);
                      const dot = { or: '#d4a017', argent: '#94a3b8', bronze: '#c2410c' }[m];
                      return (
                        <span key={m} title={enabled ? `${m.charAt(0).toUpperCase()}${m.slice(1)} gérée` : `${m.charAt(0).toUpperCase()}${m.slice(1)} non gérée`} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '2px 7px 2px 6px', borderRadius: 999,
                          background: enabled ? '#fff' : 'transparent',
                          border: enabled ? '1px solid var(--border)' : '1px dashed var(--border)',
                          fontSize: 10.5, fontWeight: 600,
                          color: enabled ? 'var(--fg)' : 'var(--fg-subtle)',
                          textTransform: 'capitalize',
                          opacity: enabled ? 1 : 0.5,
                        }}>
                          <span style={{ width: 7, height: 7, borderRadius: 999, background: enabled ? dot : 'transparent', border: enabled ? 'none' : `1px dashed ${dot}` }}/>
                          {m}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="num tnum">{f.delai}</td>
                <td className="num tnum">{f.producteurs}</td>
                <td><CompteBadge kind={f.status}/></td>
                <td>
                  <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <button className="btn btn-icon btn-sm btn-ghost" onClick={() => setEditId(f.id)}><Icon.Edit size={13}/></button>
                    <button className="btn btn-icon btn-sm btn-ghost"><Icon.Trash size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination {...paged}/>

      {(addModal || editId) && (
        <FournisseurModal
          editing={editId ? FOURNISSEURS.find(f => f.id === editId) : null}
          onCancel={() => { setAddModal(false); setEditId(null); }}
          onConfirm={() => { setAddModal(false); setEditId(null); }}
        />
      )}
    </div>
  );
};

const FournisseurModal = ({ editing, onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const [medailles, setMedailles] = React.useState(
    editing?.medailles || ['or', 'argent', 'bronze']
  );
  const toggleMedaille = (m) => setMedailles(arr => arr.includes(m) ? arr.filter(x => x !== m) : [...arr, m]);
  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 520, padding: 0, overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '22px 26px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <h2 className="display" style={{ fontSize: 19, fontWeight: 500, margin: 0 }}>
            {editing ? `Modifier ${editing.nom}` : 'Ajouter un fournisseur'}
          </h2>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
        </div>
        <div style={{ padding: '18px 26px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Nom du fournisseur</span>
            <input className="input" defaultValue={editing?.nom || ''}/></label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Contact</span>
              <input className="input" defaultValue={editing?.contact || ''}/></label>
            <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Téléphone</span>
              <input className="input" defaultValue={editing?.tel || ''} style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/></label>
          </div>
          <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Email commandes</span>
            <input type="email" className="input" defaultValue={editing?.email || ''} style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/></label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Format d'export</span>
              <select className="input" defaultValue={editing?.formatId || 'CSV'}><option>CSV</option><option>XLSX</option><option>XML</option></select></label>
            <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Délai de production (jours)</span>
              <input type="number" className="input tnum" defaultValue={editing?.delai || 14}/></label>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>
              Types de médailles gérés <span style={{ color: '#dc2626' }}>*</span>
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { id: 'or',     label: 'Or',     dot: '#d4a017' },
                { id: 'argent', label: 'Argent', dot: '#94a3b8' },
                { id: 'bronze', label: 'Bronze', dot: '#c2410c' },
              ].map(m => {
                const active = medailles.includes(m.id);
                return (
                  <label key={m.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px',
                    border: `1px solid ${active ? 'var(--burgundy-800)' : 'var(--border)'}`,
                    background: active ? 'var(--burgundy-50)' : 'var(--surface)',
                    borderRadius: 8, cursor: 'pointer',
                  }}>
                    <input type="checkbox" checked={active} onChange={() => toggleMedaille(m.id)} style={{ accentColor: 'var(--burgundy-800)' }}/>
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: m.dot, flexShrink: 0 }}/>
                    <span style={{ fontSize: 13, fontWeight: 500, color: active ? 'var(--burgundy-800)' : 'var(--fg)' }}>{m.label}</span>
                  </label>
                );
              })}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon.Info size={11}/> Seules les commandes correspondant aux types cochés seront transmises à ce fournisseur.
            </div>
            {medailles.length === 0 && (
              <div style={{ fontSize: 11.5, color: '#991b1b', marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon.AlertTriangle size={11}/> Au moins un type doit être sélectionné.
              </div>
            )}
          </div>
        </div>
        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={medailles.length === 0}
            style={{ background: 'var(--burgundy-800)', opacity: medailles.length === 0 ? 0.45 : 1 }}
          >
            <Icon.Check size={13}/> {editing ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page 4 — Templates emails ────────────────────────────────────

const EMAIL_TEMPLATES = [
  { id: 'inscription-conf',   nom: 'Confirmation d\'inscription',          event: 'Dépôt dossier',        modifie: '12/03/2026', status: 'actif',   variables: ['{prenom}', '{numero_dossier}', '{nb_echantillons}', '{montant}'] },
  { id: 'inscription-valid',  nom: 'Validation de dossier',                event: 'Dossier validé',       modifie: '08/03/2026', status: 'actif',   variables: ['{prenom}', '{numero_dossier}'] },
  { id: 'inscription-rejet',  nom: 'Rejet de dossier',                     event: 'Dossier rejeté',       modifie: '08/03/2026', status: 'actif',   variables: ['{prenom}', '{numero_dossier}', '{motif}'] },
  { id: 'paiement-relance',   nom: 'Relance paiement',                     event: 'Paiement en retard',   modifie: '14/04/2026', status: 'actif',   variables: ['{prenom}', '{numero_dossier}', '{montant}', '{date_echeance}'] },
  { id: 'palmares-or',        nom: 'Félicitations médaille Or',            event: 'Palmarès publié',      modifie: '02/05/2026', status: 'actif',   variables: ['{prenom}', '{vin}', '{appellation}', '{millesime}'] },
  { id: 'derog-traitement',   nom: 'Demande de dérogation reçue',          event: 'Dérogation déposée',   modifie: '01/03/2026', status: 'actif',   variables: ['{prenom}', '{ref_derogation}'] },
  { id: 'jury-invite',        nom: 'Invitation au jury',                   event: 'Affectation jury',     modifie: '20/03/2026', status: 'brouillon', variables: ['{prenom}', '{nom_jury}', '{date}', '{salle}'] },
];

const AdminParamEmails = () => {
  const [openId, setOpenId] = React.useState(null);
  const [createModal, setCreateModal] = React.useState(false);
  const paged = useSortablePaged(EMAIL_TEMPLATES, {
    defaultPageSize: 25,
    accessors: {
      nom: t => t.nom, event: t => t.event,
      modifie: t => { const [d,m,y] = t.modifie.split('/'); return new Date(+y, +m-1, +d).getTime(); },
      statut: t => t.status,
    },
  });
  const [draftTemplate, setDraftTemplate] = React.useState(null);

  const template = openId === '__draft__' ? draftTemplate : EMAIL_TEMPLATES.find(t => t.id === openId);

  if (openId) {
    return <EmailTemplateEditor template={template} onBack={() => setOpenId(null)}/>;
  }

  return (
    <div data-screen-label="admin-param-emails">
      <PageHeader
        breadcrumb={['Administration', 'Paramètres', 'Templates emails']}
        title="Templates emails"
        subtitle="Notifications envoyées aux producteurs et dégustateurs"
        actions={<>
          <button className="btn btn-primary btn-sm" onClick={() => setCreateModal(true)} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Plus size={14}/> Nouveau template
          </button>
        </>}
      />

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <SortableTh sortKey="nom"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Template</SortableTh>
              <SortableTh sortKey="event"   currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Événement déclencheur</SortableTh>
              <th>Variables</th>
              <SortableTh sortKey="modifie" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Dernière modif</SortableTh>
              <SortableTh sortKey="statut"  currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Statut</SortableTh>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.map(t => (
              <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => setOpenId(t.id)}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: 7,
                      background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon.Mail size={13}/>
                    </span>
                    <div>
                      <div style={{ fontWeight: 500 }}>{t.nom}</div>
                      <div className="muted" style={{ fontSize: 11.5, fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>{t.id}</div>
                    </div>
                  </div>
                </td>
                <td className="muted">{t.event}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {t.variables.slice(0, 3).map(v => (
                      <span key={v} style={{
                        fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
                        fontSize: 11, padding: '2px 6px', borderRadius: 4,
                        background: 'var(--slate-100)', color: 'var(--fg-muted)',
                      }}>{v}</span>
                    ))}
                    {t.variables.length > 3 && (
                      <span style={{ fontSize: 11, color: 'var(--fg-subtle)', alignSelf: 'center' }}>+{t.variables.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="tnum muted" style={{ fontSize: 12.5 }}>{t.modifie}</td>
                <td>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 9px 3px 7px', borderRadius: 999,
                    background: t.status === 'actif' ? '#dcfce7' : 'var(--slate-100)',
                    color: t.status === 'actif' ? '#166534' : 'var(--fg-muted)',
                    fontSize: 11.5, fontWeight: 600,
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: 999, background: t.status === 'actif' ? '#16a34a' : 'var(--slate-400)' }}/>
                    {t.status === 'actif' ? 'Actif' : 'Brouillon'}
                  </span>
                </td>
                <td><Icon.ChevronRight size={13} style={{ color: 'var(--fg-subtle)' }}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination {...paged}/>

      {createModal && (
        <NouveauTemplateModal
          onCancel={() => setCreateModal(false)}
          onConfirm={(t) => {
            setDraftTemplate(t);
            setCreateModal(false);
            setOpenId('__draft__');
          }}
        />
      )}
    </div>
  );
};

const EmailTemplateEditor = ({ template, onBack }) => {
  const isDraft = template.status === 'brouillon';
  const [objet, setObjet] = React.useState(isDraft ? '' : `Confirmation de votre inscription au concours France 2026`);
  const [corps, setCorps] = React.useState(isDraft ? '' : `Bonjour {prenom},\n\nNous avons bien reçu votre dossier d'inscription n° {numero_dossier} au Concours des Grands Vins de France 2026.\n\nVotre dossier comporte {nb_echantillons} échantillon(s) pour un montant total de {montant} €.\n\nVotre paiement sera traité dans les prochains jours. Vous recevrez un email de confirmation dès validation.\n\nCordialement,\nLe Comité des Vins de Mâcon`);

  const renderPreview = (text) => text
    .replace(/\{prenom\}/g,           'Marie')
    .replace(/\{numero_dossier\}/g,   'INS-2026-0184')
    .replace(/\{nb_echantillons\}/g,  '8')
    .replace(/\{montant\}/g,          '480,00')
    .replace(/\{motif\}/g,            'Documents incomplets')
    .replace(/\{date_echeance\}/g,    '15/05/2026')
    .replace(/\{vin\}/g,              'Les Crays')
    .replace(/\{appellation\}/g,      'Pouilly-Fuissé')
    .replace(/\{millesime\}/g,        '2024')
    .replace(/\{ref_derogation\}/g,   'DER-2026-0032')
    .replace(/\{nom_jury\}/g,         'Jury B3')
    .replace(/\{date\}/g,             '14/04/2026')
    .replace(/\{salle\}/g,            'Salle Mâcon');

  return (
    <div data-screen-label="admin-param-email-edit">
      <div style={{ marginBottom: 16 }}>
        <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, color: 'var(--fg-muted)' }}>
          <Icon.ChevronLeft size={14}/> Retour aux templates
        </button>
      </div>

      <PageHeader
        breadcrumb={['Administration', 'Paramètres', 'Templates emails', template.nom]}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span>{template.nom}</span>
            {isDraft && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 9px 3px 7px', borderRadius: 999,
                background: 'var(--slate-100)', color: 'var(--slate-700)',
                fontSize: 11.5, fontWeight: 600,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--slate-400)' }}/>
                Brouillon
              </span>
            )}
          </div>
        }
        subtitle={`Événement déclencheur : ${template.event}`}
        actions={<>
          <button className="btn btn-outline btn-sm"><Icon.Send size={13}/> Envoyer un test</button>
          {isDraft && (
            <button className="btn btn-outline btn-sm" style={{ color: '#166534', borderColor: '#bbf7d0' }}>
              <Icon.Check size={13}/> Activer le template
            </button>
          )}
          <button className="btn btn-primary btn-sm" style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Check size={13}/> {isDraft ? 'Sauvegarder le brouillon' : 'Sauvegarder'}
          </button>
        </>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Objet</span>
            <input className="input" value={objet} onChange={e => setObjet(e.target.value)}/></label>

          <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Corps du message</span>
            <textarea className="input textarea" value={corps} onChange={e => setCorps(e.target.value)} rows={16} style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', fontSize: 12.5, lineHeight: 1.55 }}/></label>

          <div className="card" style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Variables disponibles</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {template.variables.map(v => (
                <button key={v} onClick={() => setCorps(c => c + ' ' + v)} style={{
                  fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
                  fontSize: 11.5, padding: '3px 8px', borderRadius: 4,
                  background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                  border: 'none', cursor: 'pointer', fontWeight: 500,
                }}>{v}</button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 6 }}>Cliquer pour insérer dans le corps du message</div>
          </div>
        </div>

        {/* Preview */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', alignSelf: 'flex-start', position: 'sticky', top: 16 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--slate-50)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon.Eye size={13} style={{ color: 'var(--burgundy-800)' }}/>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Aperçu</span>
          </div>
          <div style={{ padding: '18px 22px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 8, fontSize: 12, color: 'var(--fg-muted)', marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 500 }}>De :</span>
              <span style={{ color: 'var(--fg)' }}>Comité des Vins de Mâcon &lt;noreply@vins-macon.fr&gt;</span>
              <span style={{ fontWeight: 500 }}>À :</span>
              <span style={{ color: 'var(--fg)' }}>Marie Dupont &lt;marie@chevaliere.fr&gt;</span>
              <span style={{ fontWeight: 500 }}>Objet :</span>
              <span style={{ color: 'var(--fg)', fontWeight: 600 }}>{renderPreview(objet)}</span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--fg)', whiteSpace: 'pre-wrap' }}>
              {renderPreview(corps)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Modale : Nouveau template ────────────────────────────────────

const EVENTS_LIST = [
  { id: 'depot-dossier',    label: 'Dépôt dossier',           vars: ['{prenom}', '{numero_dossier}', '{nb_echantillons}', '{montant}'] },
  { id: 'dossier-valide',   label: 'Dossier validé',          vars: ['{prenom}', '{numero_dossier}'] },
  { id: 'dossier-rejete',   label: 'Dossier rejeté',          vars: ['{prenom}', '{numero_dossier}', '{motif}'] },
  { id: 'paiement-retard',  label: 'Paiement en retard',      vars: ['{prenom}', '{numero_dossier}', '{montant}', '{date_echeance}'] },
  { id: 'palmares-publie',  label: 'Palmarès publié',         vars: ['{prenom}', '{vin}', '{appellation}', '{millesime}'] },
  { id: 'derog-depose',     label: 'Dérogation déposée',      vars: ['{prenom}', '{ref_derogation}'] },
  { id: 'affect-jury',      label: 'Affectation jury',        vars: ['{prenom}', '{nom_jury}', '{date}', '{salle}'] },
  { id: 'invit-formation',  label: 'Invitation à une formation', vars: ['{prenom}', '{date}', '{salle}'] },
  { id: 'salon-inscription',label: 'Inscription salon',       vars: ['{prenom}', '{salon}', '{stand}'] },
];

const slugify = (s) => s
  .toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .slice(0, 40);

const NouveauTemplateModal = ({ onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const [nom, setNom] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [eventId, setEventId] = React.useState('');
  const [destinataire, setDestinataire] = React.useState('producteurs');

  // Auto-generate slug from name, until user manually edits it
  React.useEffect(() => {
    if (!slugTouched) setSlug(slugify(nom));
  }, [nom, slugTouched]);

  const evt = EVENTS_LIST.find(e => e.id === eventId);
  const canSave = nom.trim() && slug.trim() && eventId;

  const handleConfirm = () => {
    if (!canSave) return;
    onConfirm({
      id: slug,
      nom: nom.trim(),
      event: evt.label,
      modifie: '18/05/2026',
      status: 'brouillon',
      variables: evt.vars,
      destinataire,
    });
  };

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 540, padding: 0, overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '22px 26px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Plus size={13}/>
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Nouveau template</span>
            </div>
            <h2 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>Créer un template email</h2>
            <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 4, marginBottom: 0 }}>Le template sera créé en <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>Brouillon</strong>, activable manuellement après configuration.</p>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
        </div>

        <div style={{ padding: '18px 26px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label className="field">
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>
              Nom du template <span style={{ color: '#dc2626' }}>*</span>
            </span>
            <input className="input" placeholder="Ex. Confirmation d'inscription" value={nom} onChange={e => setNom(e.target.value)}/>
          </label>

          <label className="field">
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>
              Slug / identifiant technique <span style={{ color: 'var(--fg-subtle)', fontWeight: 400 }}>(auto-généré, modifiable)</span>
            </span>
            <input
              className="input tnum"
              placeholder="inscription-conf"
              value={slug}
              onChange={e => { setSlugTouched(true); setSlug(slugify(e.target.value)); }}
              style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', color: 'var(--fg-muted)' }}
            />
            <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 6 }}>Utilisé en interne — ne sera plus modifiable après création.</div>
          </label>

          <label className="field">
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>
              Événement déclencheur <span style={{ color: '#dc2626' }}>*</span>
            </span>
            <select className="input" value={eventId} onChange={e => setEventId(e.target.value)}>
              <option value="">— Choisir —</option>
              {EVENTS_LIST.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
            </select>
            {evt && (
              <div style={{ marginTop: 8, padding: '8px 10px', background: 'var(--burgundy-50)', border: '1px solid var(--burgundy-200)', borderRadius: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--burgundy-800)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 5 }}>Variables disponibles</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {evt.vars.map(v => (
                    <span key={v} style={{
                      fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
                      fontSize: 11, padding: '2px 6px', borderRadius: 4,
                      background: 'var(--surface)', color: 'var(--burgundy-800)',
                      border: '1px solid var(--burgundy-200)',
                      fontWeight: 500,
                    }}>{v}</span>
                  ))}
                </div>
              </div>
            )}
          </label>

          <div>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Destinataire</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { id: 'producteurs',  label: 'Producteurs',   icon: <Icon.Wine size={14}/> },
                { id: 'degustateurs', label: 'Dégustateurs',  icon: <Icon.Users size={14}/> },
                { id: 'les-deux',     label: 'Les deux',      icon: <Icon.Layers size={14}/> },
              ].map(d => {
                const active = destinataire === d.id;
                return (
                  <label key={d.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '10px 12px',
                    border: `1px solid ${active ? 'var(--burgundy-800)' : 'var(--border)'}`,
                    background: active ? 'var(--burgundy-50)' : 'var(--surface)',
                    color: active ? 'var(--burgundy-800)' : 'var(--fg)',
                    borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                  }}>
                    <input type="radio" name="dest" checked={active} onChange={() => setDestinataire(d.id)} style={{ display: 'none' }}/>
                    {d.icon}{d.label}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={!canSave}
            style={{ background: 'var(--burgundy-800)', opacity: canSave ? 1 : 0.45 }}
          >
            Configurer le template <Icon.ArrowRight size={13}/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page 5 — Configuration API ───────────────────────────────────

const AdminParamAPI = () => {
  const [testing, setTesting] = React.useState(null); // service id while testing
  const [results, setResults] = React.useState({});

  const test = (id) => {
    setTesting(id);
    setTimeout(() => {
      setTesting(null);
      setResults(r => ({ ...r, [id]: { ok: id === 'sage' ? Math.random() > 0.3 : id === 'ftp-labruyere' ? true : true, at: '14h32' } }));
    }, 1100);
  };

  const ServiceCard = ({ id, title, icon, status, children }) => {
    const result = results[id];
    const loading = testing === id;
    return (
      <ParamCard
        title={title}
        icon={icon}
        sub={
          loading ? 'Test en cours…' :
          result ? (result.ok ? `Connexion OK · ${result.at}` : 'Connexion échouée — vérifier les identifiants') :
          'Connexion non testée'
        }
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {result && !loading && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 9px 3px 7px', borderRadius: 999,
                background: result.ok ? '#dcfce7' : '#fef2f2',
                color: result.ok ? '#166534' : '#991b1b',
                fontSize: 11.5, fontWeight: 600,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: result.ok ? '#16a34a' : '#dc2626' }}/>
                {result.ok ? 'Connecté' : 'Échec'}
              </span>
            )}
            <button className="btn btn-outline btn-sm" disabled={loading} onClick={() => test(id)}>
              {loading ? <><Icon.Refresh size={13} style={{ animation: 'spin 1s linear infinite' }}/> Test…</> : <><Icon.Refresh size={13}/> Tester la connexion</>}
            </button>
          </div>
        }
      >
        {children}
      </ParamCard>
    );
  };

  return (
    <div data-screen-label="admin-param-api">
      <PageHeader
        breadcrumb={['Administration', 'Paramètres', 'Configuration API']}
        title="Configuration API"
        subtitle="Intégrations tierces · clés et URLs de connexion"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <ServiceCard id="paybox" title="Paybox" icon={<Icon.CreditCard size={14}/>}>
          <ParamRow label="Mode" hint="Recette (sandbox) ou Production">
            <div style={{ display: 'inline-flex', padding: 3, gap: 2, background: 'var(--slate-100)', borderRadius: 8 }}>
              {[
                { id: 'recette', label: 'Recette' },
                { id: 'prod',    label: 'Production' },
              ].map((m, i) => (
                <button key={m.id} style={{
                  padding: '6px 14px', border: 'none',
                  background: i === 1 ? 'var(--surface)' : 'transparent',
                  color: i === 1 ? 'var(--fg)' : 'var(--fg-muted)',
                  borderRadius: 6, cursor: 'pointer', fontSize: 12.5, fontWeight: 500, fontFamily: 'inherit',
                  boxShadow: i === 1 ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                }}>{m.label}</button>
              ))}
            </div>
          </ParamRow>
          <ParamRow label="Identifiant marchand">
            <input className="input tnum" defaultValue="1234567" style={{ maxWidth: 280, fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
          </ParamRow>
          <ParamRow label="Clé secrète" hint="Ne sera plus affichée après sauvegarde">
            <ApiSecretField defaultValue="0123456789ABCDEF0123456789ABCDEF"/>
          </ParamRow>
          <ParamRow label="URL de retour">
            <input className="input" defaultValue="https://extranet.vins-macon.fr/paybox/callback" style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
          </ParamRow>
        </ServiceCard>

        <ServiceCard id="wordpress" title="WordPress (sites publics)" icon={<Icon.Globe size={14}/>}>
          <ParamRow label="URL du site principal">
            <input className="input" defaultValue="https://vins-macon.fr" style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
          </ParamRow>
          <ParamRow label="URL du site Monde">
            <input className="input" defaultValue="https://concours-monde.vins-macon.fr" style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
          </ParamRow>
          <ParamRow label="Clé API" hint="Utilisée pour publier le palmarès">
            <ApiSecretField defaultValue="wp_4f2a8c91e7b3d6f0a1c5e9b2d8f4a7c3"/>
          </ParamRow>
        </ServiceCard>

        <ServiceCard id="sage" title="Sage (comptabilité)" icon={<Icon.Database size={14}/>}>
          <ParamRow label="Serveur SQL">
            <input className="input" defaultValue="sage.vins-macon.local:1433" style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
          </ParamRow>
          <ParamRow label="Base de données">
            <input className="input" defaultValue="SAGE_COMPTA_2026" style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
          </ParamRow>
          <ParamRow label="Identifiant">
            <input className="input" defaultValue="extranet_user" style={{ maxWidth: 280, fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
          </ParamRow>
          <ParamRow label="Mot de passe">
            <ApiSecretField defaultValue="VinsMacon2026!" mask/>
          </ParamRow>
        </ServiceCard>

        <ServiceCard id="ftp-labruyere" title="FTP La Bruyère" icon={<Icon.Upload size={14}/>}>
          <ParamRow label="Serveur FTP" hint="Hôte fourni par La Bruyère">
            <input className="input" defaultValue="ftp.labruyere-medailles.fr" style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
          </ParamRow>
          <ParamRow label="Port" hint="21 (FTP) ou 22 (SFTP)">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, maxWidth: 380 }}>
              <input type="number" className="input tnum" defaultValue={22} style={{ maxWidth: 100, fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
              <div style={{ display: 'inline-flex', padding: 3, gap: 2, background: 'var(--slate-100)', borderRadius: 8 }}>
                {[
                  { id: 'ftp',  label: 'FTP' },
                  { id: 'sftp', label: 'SFTP' },
                ].map((m, i) => (
                  <button key={m.id} style={{
                    padding: '6px 12px', border: 'none',
                    background: i === 1 ? 'var(--surface)' : 'transparent',
                    color: i === 1 ? 'var(--fg)' : 'var(--fg-muted)',
                    borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
                    boxShadow: i === 1 ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  }}>{m.label}</button>
                ))}
              </div>
            </div>
          </ParamRow>
          <ParamRow label="Identifiant">
            <input className="input" defaultValue="vins-macon" style={{ maxWidth: 280, fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
          </ParamRow>
          <ParamRow label="Mot de passe">
            <ApiSecretField defaultValue="LB2026!secret" mask/>
          </ParamRow>
          <ParamRow label="Dossier de dépôt" hint="Chemin distant où les fichiers de commande seront déposés">
            <input className="input" defaultValue="/commandes/extranet/" style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
          </ParamRow>
        </ServiceCard>
      </div>
    </div>
  );
};

const ApiSecretField = ({ defaultValue, mask = false }) => {
  const [show, setShow] = React.useState(false);
  return (
    <div style={{ position: 'relative', maxWidth: 420 }}>
      <input
        type={show ? 'text' : 'password'}
        className="input"
        defaultValue={defaultValue}
        style={{ paddingRight: 40, fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}
      />
      <button
        onClick={() => setShow(s => !s)}
        className="btn btn-icon btn-sm btn-ghost"
        style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)' }}
        title={show ? 'Masquer' : 'Afficher'}
      >
        {show ? <Icon.EyeOff size={13}/> : <Icon.Eye size={13}/>}
      </button>
    </div>
  );
};

// ─── Page 6 — Utilisateurs & droits ───────────────────────────────

const ROLES = {
  'super-admin': { label: 'Super admin',  bg: 'var(--burgundy-50)', fg: 'var(--burgundy-800)', desc: 'Tous droits, gestion utilisateurs incluse' },
  'admin':       { label: 'Admin',        bg: '#eff6ff',            fg: '#1e40af',             desc: 'Gestion complète sauf utilisateurs/droits' },
  'lecteur':     { label: 'Lecteur seul', bg: 'var(--slate-100)',   fg: 'var(--slate-700)',    desc: 'Consultation uniquement, pas de modification' },
};

const AdminParamUtilisateurs = () => {
  const [inviteModal, setInviteModal] = React.useState(false);
  const [rowMenu, setRowMenu] = React.useState(null);

  const ADMINS = [
    { id: 'sophie',  prenom: 'Sophie', nom: 'Lambert',  email: 'sophie@vins-macon.fr',  role: 'super-admin', last: '12/05/2026 à 14h32', status: 'actif' },
    { id: 'marc',    prenom: 'Marc',   nom: 'Dubois',   email: 'marc@vins-macon.fr',    role: 'admin',       last: '11/05/2026 à 09h18', status: 'actif' },
    { id: 'claire',  prenom: 'Claire', nom: 'Mercier',  email: 'claire@vins-macon.fr',  role: 'admin',       last: '08/05/2026 à 16h42', status: 'actif' },
    { id: 'pierre',  prenom: 'Pierre', nom: 'Gauthier', email: 'pierre@vins-macon.fr',  role: 'lecteur',     last: '02/05/2026 à 11h08', status: 'actif' },
    { id: 'isabelle',prenom: 'Isabelle', nom: 'Petit',  email: 'i.petit@vins-macon.fr', role: 'admin',       last: '—',                  status: 'pending' },
  ];

  const paged = useSortablePaged(ADMINS, {
    defaultPageSize: 25,
    accessors: {
      nom: a => `${a.nom} ${a.prenom}`, email: a => a.email,
      role: a => a.role, statut: a => a.status,
    },
  });

  return (
    <div data-screen-label="admin-param-utilisateurs">
      <PageHeader
        breadcrumb={['Administration', 'Paramètres', 'Utilisateurs & droits']}
        title="Utilisateurs & droits"
        subtitle="Comptes administrateurs et niveaux d'accès"
        actions={<>
          <button className="btn btn-primary btn-sm" onClick={() => setInviteModal(true)} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Plus size={14}/> Inviter un administrateur
          </button>
        </>}
      />

      {/* Roles legend */}
      <div className="card" style={{ padding: '14px 16px', marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Rôles disponibles</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {Object.entries(ROLES).map(([id, r]) => (
            <div key={id} style={{ padding: '10px 12px', background: 'var(--slate-50)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '2px 8px', borderRadius: 4,
                  background: r.bg, color: r.fg,
                  fontSize: 11, fontWeight: 600,
                }}>{r.label}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <SortableTh sortKey="nom"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Administrateur</SortableTh>
              <SortableTh sortKey="email"  currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Email</SortableTh>
              <SortableTh sortKey="role"   currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Rôle</SortableTh>
              <th>Dernière connexion</th>
              <SortableTh sortKey="statut" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Statut</SortableTh>
              <th style={{ width: 36 }}></th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.map((a, i) => (
              <tr key={a.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: 999,
                      background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 600, fontSize: 12, flexShrink: 0,
                    }}>
                      {a.prenom[0]}{a.nom[0]}
                    </span>
                    <span style={{ fontWeight: 500 }}>{a.prenom} {a.nom}</span>
                  </div>
                </td>
                <td className="muted" style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', fontSize: 12.5 }}>{a.email}</td>
                <td>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '2px 8px', borderRadius: 4,
                    background: ROLES[a.role].bg, color: ROLES[a.role].fg,
                    fontSize: 11.5, fontWeight: 600,
                  }}>{ROLES[a.role].label}</span>
                </td>
                <td className="tnum muted" style={{ fontSize: 12.5 }}>{a.last}</td>
                <td>
                  {a.status === 'pending' ? (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '3px 9px 3px 7px', borderRadius: 999,
                      background: '#fef3c7', color: '#a16207',
                      fontSize: 11.5, fontWeight: 600,
                    }}>
                      <span style={{ width: 7, height: 7, borderRadius: 999, background: '#f59e0b' }}/>
                      Invitation envoyée
                    </span>
                  ) : <CompteBadge kind={a.status}/>}
                </td>
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
                        <CmdMenuItem icon={<Icon.Edit size={13}/>} label="Modifier le rôle"  onClick={() => setRowMenu(null)}/>
                        {a.status === 'pending' && (
                          <CmdMenuItem icon={<Icon.Send size={13}/>} label="Renvoyer l'invitation" onClick={() => setRowMenu(null)}/>
                        )}
                        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }}/>
                        <CmdMenuItem icon={<Icon.Lock size={13}/>} label="Désactiver le compte" danger onClick={() => setRowMenu(null)}/>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {inviteModal && <InviteAdminModal onCancel={() => setInviteModal(false)} onConfirm={() => setInviteModal(false)}/>}
      <TablePagination {...paged}/>
    </div>
  );
};

const InviteAdminModal = ({ onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const [role, setRole] = React.useState('admin');

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 500, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '22px 26px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 6 }}>Nouvel administrateur</div>
            <h2 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Inviter un administrateur</h2>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
        </div>

        <div style={{ padding: '18px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Prénom</span>
              <input className="input"/></label>
            <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Nom</span>
              <input className="input"/></label>
          </div>
          <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Email</span>
            <input type="email" className="input" placeholder="prenom.nom@vins-macon.fr" style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/></label>

          <div>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Rôle</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Object.entries(ROLES).map(([id, r]) => (
                <label key={id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '12px 14px',
                  border: `1px solid ${role === id ? 'var(--burgundy-800)' : 'var(--border)'}`,
                  background: role === id ? 'var(--burgundy-50)' : 'var(--surface)',
                  borderRadius: 8, cursor: 'pointer',
                }}>
                  <input type="radio" name="role" checked={role === id} onChange={() => setRole(id)} style={{ marginTop: 2, accentColor: 'var(--burgundy-800)' }}/>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: role === id ? 'var(--burgundy-800)' : 'var(--fg)' }}>{r.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{r.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button className="btn btn-primary" onClick={onConfirm} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Send size={13}/> Envoyer l'invitation
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page N — Configuration des paiements ────────────────────────

const AdminParamPaiements = () => {
  const [dirty, setDirty] = React.useState(false);
  const markDirty = () => setDirty(true);

  return (
    <div data-screen-label="admin-param-paiements">
      <PageHeader
        breadcrumb={['Administration', 'Paramètres', 'Configuration paiements']}
        title="Configuration des paiements"
        subtitle="Coordonnées bancaires et postales affichées aux producteurs selon leur méthode de paiement"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Virement */}
        <ParamCard title="Virement bancaire" icon={<Icon.CreditCard size={14}/>} sub="Coordonnées affichées sur la page de confirmation virement">
          <ParamRow label="Titulaire du compte" hint="Nom exact tel qu'il apparaît sur le RIB">
            <input className="input" defaultValue="Comité des Salons et Concours de Mâcon" onChange={markDirty} style={{ maxWidth: 480 }}/>
          </ParamRow>
          <ParamRow label="IBAN" hint="Format FR76 XXXX XXXX …">
            <input className="input tnum" defaultValue="FR76 1234 5678 9012 3456 7890 123" onChange={markDirty} style={{ maxWidth: 380 }}/>
          </ParamRow>
          <ParamRow label="BIC / SWIFT" hint="">
            <input className="input tnum" defaultValue="AGRIFRPP" onChange={markDirty} style={{ maxWidth: 200 }}/>
          </ParamRow>
          <ParamRow label="Nom de la banque" hint="">
            <input className="input" defaultValue="Crédit Agricole Centre-Est" onChange={markDirty} style={{ maxWidth: 320 }}/>
          </ParamRow>
          <ParamRow label="Délai de paiement (jours)" hint="Nombre de jours ouvrés accordés au producteur après soumission">
            <input type="number" className="input tnum" defaultValue={10} onChange={markDirty} style={{ maxWidth: 120 }}/>
          </ParamRow>
        </ParamCard>

        {/* Chèque */}
        <ParamCard title="Paiement par chèque" icon={<Icon.FileText size={14}/>} sub="Instructions affichées sur la page de confirmation chèque">
          <ParamRow label="À l'ordre de" hint="Libellé exact du chèque">
            <input className="input" defaultValue="Comité des Salons et Concours de Mâcon" onChange={markDirty} style={{ maxWidth: 480 }}/>
          </ParamRow>
          <ParamRow label="Adresse d'envoi" hint="Adresse postale complète à afficher au producteur">
            <textarea className="textarea" rows={3} onChange={markDirty} style={{ maxWidth: 480 }} defaultValue={"Comité des Salons et Concours de Mâcon\n225 Quai des Marans\n71000 Mâcon"}/>
          </ParamRow>
          <ParamRow label="Délai de paiement (jours)" hint="Nombre de jours ouvrés accordés au producteur après soumission">
            <input type="number" className="input tnum" defaultValue={10} onChange={markDirty} style={{ maxWidth: 120 }}/>
          </ParamRow>
        </ParamCard>
      </div>

      {dirty && (
        <div style={{ position: 'sticky', bottom: 16, marginTop: 18, padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, boxShadow: '0 8px 24px rgba(15,23,42,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 12.5, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: '#f59e0b' }}/>
            Modifications non sauvegardées
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline btn-sm" onClick={() => setDirty(false)}>Annuler</button>
            <button className="btn btn-primary btn-sm" onClick={() => setDirty(false)} style={{ background: 'var(--burgundy-800)' }}>
              <Icon.Check size={13}/> Sauvegarder
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Page N+1 — Configuration salons ──────────────────────────────
//
// Données de paramétrage par salon :
//   • Calendrier (dates salon + fenêtre inscriptions exposants)
//   • Tarification (TVA, acompte, paiement CB)
//   • Types de stands (surface, prix HT, quantité disponible)
//   • Options & équipements (électricité, WiFi, mobilier…)
//   • Repas exposants (tarif par catégorie)

const PARAM_SALONS_LIST = [
  { id: 'salon-vins-2026',      label: 'Salon des Vins de Mâcon 2026' },
  { id: 'marche-plaisirs-2026', label: 'Marché des Plaisirs Gourmands 2026' },
  { id: 'salon-vins-2025',      label: 'Salon des Vins de Mâcon 2025' },
];

// Données initiales de chaque salon (préfixe PARAM_ pour éviter tout conflit de noms)
const PARAM_STANDS_INIT = {
  'salon-vins-2026': [
    { id: 'sv-s1', label: 'Stand individuel', sub: '6 m² · Emplacement standard',  surface: 6,  prix: 350, qty: 45, active: true,  builtin: true },
    { id: 'sv-s2', label: 'Stand double',     sub: '12 m² · Double largeur',        surface: 12, prix: 620, qty: 18, active: true,  builtin: true },
    { id: 'sv-s3', label: 'Stand angle',      sub: '9 m² · Coin allée principale', surface: 9,  prix: 480, qty: 8,  active: true,  builtin: true },
    { id: 'sv-s4', label: 'Stand prestige',   sub: '16 m² · Emplacement façade',   surface: 16, prix: 850, qty: 4,  active: false, builtin: true },
  ],
  'marche-plaisirs-2026': [
    { id: 'mp-s1', label: 'Stand standard', sub: '6 m² · Emplacement courant', surface: 6,  prix: 290, qty: 60, active: true, builtin: true },
    { id: 'mp-s2', label: 'Stand premium',  sub: '9 m² · Allée centrale',      surface: 9,  prix: 420, qty: 20, active: true, builtin: true },
    { id: 'mp-s3', label: 'Stand double',   sub: '12 m² · Grande surface',     surface: 12, prix: 560, qty: 10, active: true, builtin: true },
  ],
  'salon-vins-2025': [
    { id: 'sv25-s1', label: 'Stand individuel', sub: '6 m²', surface: 6,  prix: 330, qty: 45, active: true, builtin: true },
    { id: 'sv25-s2', label: 'Stand double',     sub: '12 m²', surface: 12, prix: 590, qty: 18, active: true, builtin: true },
  ],
};

const PARAM_OPTIONS_INIT = {
  'salon-vins-2026': [
    { id: 'sv-o1', label: 'Électricité monophasé', sub: '16A / 3,5 kW',          prix: 25,  active: true },
    { id: 'sv-o2', label: 'Électricité triphasé',  sub: '32A / 7 kW',            prix: 55,  active: true },
    { id: 'sv-o3', label: 'Accès WiFi',            sub: 'Connexion haut débit',   prix: 15,  active: true },
    { id: 'sv-o4', label: 'Table supplémentaire',  sub: 'Table pliante 180 cm',   prix: 20,  active: true },
    { id: 'sv-o5', label: 'Chaise supplémentaire', sub: 'Par unité',              prix: 8,   active: true },
    { id: 'sv-o6', label: 'Vitrine réfrigérée',    sub: '60 cm · avec serrure',   prix: 80,  active: false },
  ],
  'marche-plaisirs-2026': [
    { id: 'mp-o1', label: 'Électricité monophasé', sub: '16A / 3,5 kW',        prix: 22,  active: true },
    { id: 'mp-o2', label: 'Électricité triphasé',  sub: '32A / 7 kW',          prix: 48,  active: true },
    { id: 'mp-o3', label: 'Accès WiFi',            sub: 'Connexion haut débit', prix: 12,  active: true },
    { id: 'mp-o4', label: 'Table supplémentaire',  sub: 'Table pliante 180 cm', prix: 18,  active: true },
    { id: 'mp-o5', label: 'Chaise supplémentaire', sub: 'Par unité',            prix: 6,   active: true },
  ],
  'salon-vins-2025': [
    { id: 'sv25-o1', label: 'Électricité monophasé', sub: '16A',          prix: 22, active: true },
    { id: 'sv25-o2', label: 'Accès WiFi',            sub: 'Haut débit',   prix: 12, active: true },
  ],
};

const PARAM_DATES_INIT = {
  'salon-vins-2026':      { ouverture: '2026-01-15', cloture: '2026-03-15', debut: '2026-05-08', fin: '2026-05-10', tva: 20, acompte: 50, cb: true },
  'marche-plaisirs-2026': { ouverture: '2026-02-01', cloture: '2026-03-31', debut: '2026-05-09', fin: '2026-05-11', tva: 20, acompte: 50, cb: true },
  'salon-vins-2025':      { ouverture: '2025-01-20', cloture: '2025-03-10', debut: '2025-05-09', fin: '2025-05-11', tva: 20, acompte: 50, cb: false },
};

const PARAM_REPAS_INIT = {
  'salon-vins-2026':      [{ id: 'r1', label: 'Déjeuner exposant',      prix: 32 }, { id: 'r2', label: 'Déjeuner accompagnateur', prix: 28 }, { id: 'r3', label: 'Repas staff Comité', prix: 0 }],
  'marche-plaisirs-2026': [{ id: 'r1', label: 'Déjeuner exposant',      prix: 30 }, { id: 'r2', label: 'Déjeuner accompagnateur', prix: 26 }, { id: 'r3', label: 'Repas staff Comité', prix: 0 }],
  'salon-vins-2025':      [{ id: 'r1', label: 'Déjeuner exposant',      prix: 30 }, { id: 'r2', label: 'Déjeuner accompagnateur', prix: 26 }],
};

const AdminParamSalons = () => {
  const [salon, setSalon]   = React.useState('salon-vins-2026');
  const [dirty, setDirty]   = React.useState(false);
  const markDirty = () => setDirty(true);

  const [stands,  setStands]  = React.useState(PARAM_STANDS_INIT);
  const [options, setOptions] = React.useState(PARAM_OPTIONS_INIT);
  const [repas,   setRepas]   = React.useState(PARAM_REPAS_INIT);
  const [dates,   setDates]   = React.useState(PARAM_DATES_INIT);

  const salonStands  = stands[salon]  || [];
  const salonOptions = options[salon] || [];
  const salonRepas   = repas[salon]   || [];
  const salonDates   = dates[salon]   || {};

  // Helpers de mise à jour
  const updateStand  = (id, patch) => { setStands(s  => ({ ...s, [salon]: s[salon].map(x => x.id === id ? { ...x, ...patch } : x) }));  markDirty(); };
  const updateOption = (id, patch) => { setOptions(o => ({ ...o, [salon]: o[salon].map(x => x.id === id ? { ...x, ...patch } : x) })); markDirty(); };
  const updateRepas  = (id, patch) => { setRepas(r   => ({ ...r, [salon]: r[salon].map(x => x.id === id ? { ...x, ...patch } : x) }));  markDirty(); };
  const updateDates  = (patch)     => { setDates(d   => ({ ...d, [salon]: { ...d[salon], ...patch } })); markDirty(); };

  // Ligne réutilisable pour un article (stand ou option) avec toggle + champs
  const ArticleRow = ({ item, onUpdate, showSurface = false, showQty = false }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px',
      background: item.active ? 'var(--surface)' : 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      opacity: item.active ? 1 : 0.65,
      transition: 'opacity .15s',
    }}>
      {/* Toggle actif / inactif */}
      <input
        type="checkbox"
        checked={item.active}
        onChange={e => onUpdate(item.id, { active: e.target.checked })}
        style={{ width: 16, height: 16, accentColor: 'var(--burgundy-800)', flexShrink: 0, cursor: 'pointer' }}
      />
      {/* Identité */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{item.label}</div>
        {item.sub && <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 1 }}>{item.sub}</div>}
      </div>
      {/* Surface (stands seulement) */}
      {showSurface && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Surface</span>
          <div style={{ position: 'relative', width: 88 }}>
            <input
              type="number" min={1}
              className="input tnum"
              value={item.surface}
              onChange={e => onUpdate(item.id, { surface: parseInt(e.target.value, 10) || 1 })}
              style={{ paddingRight: 28, textAlign: 'center' }}
            />
            <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--fg-muted)', pointerEvents: 'none' }}>m²</span>
          </div>
        </div>
      )}
      {/* Prix HT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Prix HT</span>
        <div style={{ position: 'relative', width: 104 }}>
          <input
            type="number" min={0}
            className="input tnum"
            value={item.prix}
            onChange={e => onUpdate(item.id, { prix: parseInt(e.target.value, 10) || 0 })}
            style={{ paddingRight: 20, textAlign: 'right' }}
          />
          <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--fg-muted)', pointerEvents: 'none' }}>€</span>
        </div>
      </div>
      {/* Quantité disponible (stands seulement) */}
      {showQty && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Qté</span>
          <input
            type="number" min={0}
            className="input tnum"
            value={item.qty}
            onChange={e => onUpdate(item.id, { qty: parseInt(e.target.value, 10) || 0 })}
            style={{ width: 72, textAlign: 'center' }}
          />
        </div>
      )}
      {/* Supprimer (formats personnalisés seulement) */}
      {!item.builtin ? (
        <button
          className="btn btn-icon btn-ghost btn-sm"
          style={{ color: 'var(--danger)', flexShrink: 0 }}
          title="Supprimer"
        >
          <Icon.Trash size={13}/>
        </button>
      ) : (
        <div style={{ width: 28, flexShrink: 0 }}/>
      )}
    </div>
  );

  return (
    <div data-screen-label="admin-param-salons">
      <PageHeader
        breadcrumb={['Administration', 'Paramètres', 'Configuration salons']}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span>Configuration salons</span>
            <SalonPicker
              salons={PARAM_SALONS_LIST}
              value={salon}
              onChange={(v) => { setSalon(v); setDirty(false); }}
            />
          </div>
        }
        subtitle="Calendrier · tarifs prestations · types de stands · équipements · repas"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* ─── Calendrier ──────────────────────────────────────── */}
        <ParamCard
          title="Calendrier du salon"
          icon={<Icon.Calendar size={14}/>}
          sub="Dates d'ouverture au public et fenêtre d'inscriptions exposants"
        >
          <ParamRow label="Dates du salon" hint="Période d'ouverture effective au public">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', maxWidth: 460 }}>
              <input
                type="date" className="input tnum"
                defaultValue={salonDates.debut}
                onChange={e => updateDates({ debut: e.target.value })}
              />
              <span style={{ color: 'var(--fg-muted)' }}>→</span>
              <input
                type="date" className="input tnum"
                defaultValue={salonDates.fin}
                onChange={e => updateDates({ fin: e.target.value })}
              />
            </div>
          </ParamRow>
          <ParamRow label="Ouverture des inscriptions" hint="À partir de quand les exposants peuvent déposer un dossier">
            <input
              type="date" className="input tnum"
              defaultValue={salonDates.ouverture}
              onChange={e => updateDates({ ouverture: e.target.value })}
              style={{ maxWidth: 220 }}
            />
          </ParamRow>
          <ParamRow label="Clôture des inscriptions" hint="Date limite de dépôt — aucun nouveau dossier accepté après cette date">
            <input
              type="date" className="input tnum"
              defaultValue={salonDates.cloture}
              onChange={e => updateDates({ cloture: e.target.value })}
              style={{ maxWidth: 220 }}
            />
          </ParamRow>
        </ParamCard>

        {/* ─── Tarification ────────────────────────────────────── */}
        <ParamCard
          title="Tarification"
          icon={<Icon.Euro size={14}/>}
          sub="Règles financières applicables à ce salon"
        >
          <ParamRow
            label="Taux de TVA"
            hint="Les salons sont soumis à TVA — contrairement aux concours (exonérés)."
          >
            <div style={{ position: 'relative', maxWidth: 140 }}>
              <input
                type="number" className="input tnum"
                defaultValue={salonDates.tva}
                onChange={markDirty}
                style={{ paddingRight: 28 }}
              />
              <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13, pointerEvents: 'none' }}>%</span>
            </div>
          </ParamRow>
          <ParamRow
            label="Acompte à l'inscription"
            hint="Pourcentage du total TTC exigé lors de la soumission — le solde est facturé séparément."
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', maxWidth: 140 }}>
                <input
                  type="number" className="input tnum"
                  defaultValue={salonDates.acompte}
                  onChange={markDirty}
                  style={{ paddingRight: 28 }}
                />
                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13, pointerEvents: 'none' }}>%</span>
              </div>
              <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>du total TTC — le solde est dû à réception de facture</span>
            </div>
          </ParamRow>
          <ParamRow label="Paiement en ligne (CB)" hint="Autoriser le paiement CB via Paybox lors de l'inscription exposant">
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox"
                defaultChecked={salonDates.cb}
                onChange={markDirty}
                style={{ width: 16, height: 16, accentColor: 'var(--burgundy-800)' }}
              />
              <span style={{ fontSize: 13, color: 'var(--fg)' }}>Activé</span>
            </label>
          </ParamRow>
        </ParamCard>

        {/* ─── Types de stands ─────────────────────────────────── */}
        <ParamCard
          title="Types de stands"
          icon={<Icon.Building size={14}/>}
          sub="Formules disponibles à la réservation — surface, prix HT et quantité par type"
          actions={
            <button className="btn btn-outline btn-sm" onClick={markDirty}>
              <Icon.Plus size={13}/> Ajouter un type
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {salonStands.map(s => (
              <ArticleRow
                key={s.id}
                item={s}
                onUpdate={updateStand}
                showSurface
                showQty
              />
            ))}
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', paddingLeft: 2, marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon.Info size={12} style={{ flexShrink: 0 }}/>
              Les prix sont HT. La TVA ({salonDates.tva}%) s'ajoute automatiquement lors de la facturation exposant.
            </div>
          </div>
        </ParamCard>

        {/* ─── Options & équipements ───────────────────────────── */}
        <ParamCard
          title="Options & équipements"
          icon={<Icon.Sliders size={14}/>}
          sub="Services additionnels sélectionnables lors de l'inscription exposant"
          actions={
            <button className="btn btn-outline btn-sm" onClick={markDirty}>
              <Icon.Plus size={13}/> Ajouter une option
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {salonOptions.map(opt => (
              <ArticleRow
                key={opt.id}
                item={opt}
                onUpdate={updateOption}
              />
            ))}
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', paddingLeft: 2, marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon.Info size={12} style={{ flexShrink: 0 }}/>
              Décocher une option la masque dans le formulaire d'inscription sans supprimer son historique.
            </div>
          </div>
        </ParamCard>

        {/* ─── Repas exposants ─────────────────────────────────── */}
        <ParamCard
          title="Repas exposants"
          icon={<Icon.Receipt size={14}/>}
          sub="Tarifs HT des repas proposés au personnel exposant lors du salon"
        >
          {salonRepas.map(r => (
            <ParamRow
              key={r.id}
              label={r.label}
              hint={r.label === 'Repas staff Comité' ? 'Tarif interne — 0 € = gratuit pour le staff' : `Tarif HT par ${r.label.includes('accompagnateur') ? 'accompagnateur' : 'exposant'}`}
            >
              <div style={{ position: 'relative', maxWidth: 160 }}>
                <input
                  type="number" min={0}
                  className="input tnum"
                  value={r.prix}
                  onChange={e => updateRepas(r.id, { prix: parseInt(e.target.value, 10) || 0 })}
                  style={{ paddingRight: 28 }}
                />
                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13, pointerEvents: 'none' }}>€</span>
              </div>
            </ParamRow>
          ))}
        </ParamCard>

      </div>

      {/* Barre de sauvegarde persistante */}
      {dirty && (
        <div style={{
          position: 'sticky', bottom: 16, marginTop: 18,
          padding: '12px 16px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(15,23,42,0.10)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <span style={{ fontSize: 12.5, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: '#f59e0b' }}/>
            Modifications non sauvegardées
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline btn-sm" onClick={() => setDirty(false)}>Annuler</button>
            <button className="btn btn-primary btn-sm" onClick={() => setDirty(false)} style={{ background: 'var(--burgundy-800)' }}>
              <Icon.Check size={13}/> Sauvegarder
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, {
  AdminParamConcours,
  AdminParamAppellations,
  AdminParamFournisseurs,
  AdminParamEmails,
  AdminParamAPI,
  AdminParamUtilisateurs,
  AdminParamPaiements,
  AdminParamSalons,
});
