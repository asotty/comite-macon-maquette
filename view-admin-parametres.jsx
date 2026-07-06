// ─── Paramètres : 7 pages ────────────────────────────────────────

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

// ─── Formats de support — dérogation impression étiquette ─────────
// Composant réutilisé dans AdminParamConcours (section dédiée)

const AdminParamFormatsSupport = ({ markDirty }) => {
  const [formats, setFormats] = React.useState([
    { id: 'bouteille',  label: 'Bouteille',           equiv: 1,  actif: true  },
    { id: 'carton6',   label: 'Carton 6 bouteilles',  equiv: 6,  actif: true  },
    { id: 'carton12',  label: 'Carton 12 bouteilles', equiv: 12, actif: true  },
    { id: 'carton24',  label: 'Carton 24 bouteilles', equiv: 24, actif: false },
  ]);
  const [showAdd, setShowAdd]     = React.useState(false);
  const [newLabel, setNewLabel]   = React.useState('');
  const [newEquiv, setNewEquiv]   = React.useState(1);

  const updateFmt = (id, patch) => { setFormats(f => f.map(x => x.id === id ? { ...x, ...patch } : x)); markDirty && markDirty(); };
  const deleteFmt = (id)         => { setFormats(f => f.filter(x => x.id !== id)); markDirty && markDirty(); };

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    setFormats(f => [...f, { id: 'fs_' + Date.now(), label: newLabel.trim(), equiv: parseInt(newEquiv) || 1, actif: true, custom: true }]);
    setNewLabel(''); setNewEquiv(1); setShowAdd(false);
    markDirty && markDirty();
  };

  return (
    <ParamCard
      title="Formats de support (dérogation impression)"
      icon={<Icon.Printer size={14}/>}
      sub="Supports sur lesquels les producteurs peuvent demander d'imprimer leur médaille"
    >
      <ParamRow
        label="Formats disponibles"
        hint="L'équivalence détermine combien d'unités quota sont déduites par article (ex : carton 6 = 6 unités)."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Liste des formats */}
          {formats.map(f => (
            <div key={f.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 8,
              background: f.actif ? 'var(--surface)' : 'var(--surface-2)',
              border: '1px solid var(--border)', opacity: f.actif ? 1 : 0.6, transition: 'opacity .15s',
            }}>
              {/* Toggle actif */}
              <input
                type="checkbox" checked={f.actif}
                onChange={e => updateFmt(f.id, { actif: e.target.checked })}
                style={{ width: 16, height: 16, accentColor: 'var(--burgundy-800)', flexShrink: 0, cursor: 'pointer' }}
              />
              {/* Nom */}
              <div style={{ flex: 1, fontSize: 13.5, fontWeight: 500 }}>
                {f.label}
                {f.custom && <span style={{ fontSize: 11, color: 'var(--burgundy-600)', marginLeft: 8 }}>Personnalisé</span>}
              </div>
              {/* Équivalence */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Équivalence</span>
                <input
                  type="number" min={1} className="input tnum" value={f.equiv}
                  onChange={e => updateFmt(f.id, { equiv: parseInt(e.target.value) || 1 })}
                  style={{ width: 72, textAlign: 'center', fontSize: 13 }}
                />
                <span style={{ fontSize: 12, color: 'var(--fg-muted)', minWidth: 40 }}>unité{f.equiv !== 1 ? 's' : ''}</span>
              </div>
              {/* Supprimer (formats personnalisés) */}
              {f.custom ? (
                <button className="btn btn-icon btn-ghost btn-sm" onClick={() => deleteFmt(f.id)}
                  style={{ color: 'var(--danger)', flexShrink: 0 }}>
                  <Icon.Trash size={13}/>
                </button>
              ) : (
                <div style={{ width: 28, flexShrink: 0 }}/>
              )}
            </div>
          ))}

          {/* Formulaire d'ajout inline */}
          {showAdd ? (
            <div style={{
              padding: '14px 16px', borderRadius: 8,
              background: 'var(--burgundy-50)', border: '1px solid var(--burgundy-200)',
              display: 'flex', gap: 12, alignItems: 'flex-end',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--fg-muted)', marginBottom: 4 }}>Nom du format *</div>
                <input className="input" placeholder="ex : Carton 48 bouteilles" value={newLabel}
                  onChange={e => setNewLabel(e.target.value)} style={{ fontSize: 13 }} autoFocus/>
              </div>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--fg-muted)', marginBottom: 4 }}>Équivalence (unités)</div>
                <input type="number" min={1} className="input tnum" value={newEquiv}
                  onChange={e => setNewEquiv(e.target.value)} style={{ width: 80, textAlign: 'center' }}/>
              </div>
              <button className="btn btn-outline btn-sm"
                onClick={() => { setShowAdd(false); setNewLabel(''); setNewEquiv(1); }}>
                Annuler
              </button>
              <button className="btn btn-primary btn-sm" disabled={!newLabel.trim()} onClick={handleAdd}
                style={{ opacity: newLabel.trim() ? 1 : 0.45 }}>
                <Icon.Plus size={13}/> Ajouter
              </button>
            </div>
          ) : (
            <button className="btn btn-outline btn-sm" onClick={() => setShowAdd(true)}
              style={{ alignSelf: 'flex-start', marginTop: 2 }}>
              <Icon.Plus size={13}/> Ajouter un format
            </button>
          )}

          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2, paddingLeft: 2 }}>
            <Icon.Info size={12} style={{ verticalAlign: 'middle', marginRight: 5 }}/>
            Ces formats sont affichés aux producteurs lorsqu'ils soumettent une demande de dérogation impression.
          </div>
        </div>
      </ParamRow>
    </ParamCard>
  );
};

// ─── Page Dérogations impression ──────────────────────────────────

const AdminParamDerogations = () => {
  const [dirty, setDirty] = React.useState(false);
  const markDirty = () => setDirty(true);

  return (
    <div data-screen-label="admin-param-derogations">
      <PageHeader
        breadcrumb={['Administration', 'Paramètres', 'Dérogations impression']}
        title="Dérogations impression"
        subtitle="Formats de support proposés aux producteurs lors d'une demande de dérogation étiquette"
      />

      <AdminParamFormatsSupport markDirty={markDirty}/>

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

// ─── Page 1 — Configuration concours ──────────────────────────────

const FORMAT_COLORS = ['#f59e0b','#8b5cf6','#0ea5e9','#16a34a','#ef4444','#f97316','#ec4899','#64748b'];

const AdminParamConcours = () => {
  const [concours, setConcours] = React.useState('france-2026');
  const [dirty, setDirty]       = React.useState(false);
  const markDirty = () => setDirty(true);

  // Repas payant/gratuit par type de participant
  const [repasDegsPayant,  setRepasDegsPayant]  = React.useState(true);
  const [repasAccomPayant, setRepasAccomPayant] = React.useState(true);

  // R84 — 3 produits fixes (à l'unité, pas d'équivalence, pas d'ajout/suppression)
  // médailles       : prix de référence 45 €/1 000 — déduit du quota
  // plaques_metal   : à l'unité, hors quota
  // chevalets_plexi : à l'unité, hors quota
  // image           : null = illustration SVG par défaut, sinon data-URL d'une image uploadée
  const [formats, setFormats] = React.useState([
    { id: 'medailles',       label: 'Médailles',        sub: 'Médaille physique · prix de référence 45 € / 1 000 pièces',  active: true, prix: 45.00, deductsStock: true,  lotLabel: '/ 1 000 médailles', color: '#d97706', image: null },
    { id: 'plaques_metal',   label: 'Plaques métal',    sub: 'Aluminium brossé gravé · vitrines, présentoirs, caves',       active: true, prix: 8.50,  deductsStock: false, lotLabel: '/ unité',           color: '#64748b', image: null },
    { id: 'chevalets_plexi', label: 'Chevalets plexi',  sub: 'Présentoir plexiglas transparent · table et comptoir',        active: true, prix: 6.00,  deductsStock: false, lotLabel: '/ unité',           color: '#3b82f6', image: null },
  ]);

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
          <ParamRow label="Repas — Dégustateur" hint="Définissez si le repas est inclus gratuitement ou payant pour les dégustateurs">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 8, border: '1px solid ' + (repasDegsPayant ? 'var(--border)' : 'var(--burgundy-800)'), background: repasDegsPayant ? 'var(--surface)' : 'var(--burgundy-50)', cursor: 'pointer', fontSize: 13 }}>
                  <input type="radio" name="repas-degs" checked={!repasDegsPayant} onChange={() => { setRepasDegsPayant(false); markDirty(); }} style={{ accentColor: 'var(--burgundy-800)' }}/>
                  Gratuit — inscription libre
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 8, border: '1px solid ' + (!repasDegsPayant ? 'var(--border)' : 'var(--burgundy-800)'), background: !repasDegsPayant ? 'var(--surface)' : 'var(--burgundy-50)', cursor: 'pointer', fontSize: 13 }}>
                  <input type="radio" name="repas-degs" checked={repasDegsPayant} onChange={() => { setRepasDegsPayant(true); markDirty(); }} style={{ accentColor: 'var(--burgundy-800)' }}/>
                  Payant
                </label>
              </div>
              {repasDegsPayant && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ position: 'relative', maxWidth: 160 }}>
                    <input type="number" className="input tnum" defaultValue={38} onChange={markDirty} style={{ paddingRight: 28 }}/>
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13, pointerEvents: 'none' }}>€</span>
                  </div>
                  <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>TTC / dégustateur</span>
                </div>
              )}
              {!repasDegsPayant && (
                <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon.Info size={13} style={{ color: 'var(--gold-600)', flexShrink: 0 }}/>
                  Aucune étape de paiement — le dégustateur s'inscrit directement.
                </div>
              )}
            </div>
          </ParamRow>
          <ParamRow label="Repas — Accompagnateur" hint="Définissez si le repas est inclus gratuitement ou payant pour les accompagnateurs">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 8, border: '1px solid ' + (repasAccomPayant ? 'var(--border)' : 'var(--burgundy-800)'), background: repasAccomPayant ? 'var(--surface)' : 'var(--burgundy-50)', cursor: 'pointer', fontSize: 13 }}>
                  <input type="radio" name="repas-accom" checked={!repasAccomPayant} onChange={() => { setRepasAccomPayant(false); markDirty(); }} style={{ accentColor: 'var(--burgundy-800)' }}/>
                  Gratuit — inscription libre
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 8, border: '1px solid ' + (!repasAccomPayant ? 'var(--border)' : 'var(--burgundy-800)'), background: !repasAccomPayant ? 'var(--surface)' : 'var(--burgundy-50)', cursor: 'pointer', fontSize: 13 }}>
                  <input type="radio" name="repas-accom" checked={repasAccomPayant} onChange={() => { setRepasAccomPayant(true); markDirty(); }} style={{ accentColor: 'var(--burgundy-800)' }}/>
                  Payant
                </label>
              </div>
              {repasAccomPayant && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ position: 'relative', maxWidth: 160 }}>
                    <input type="number" className="input tnum" defaultValue={28} onChange={markDirty} style={{ paddingRight: 28 }}/>
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13, pointerEvents: 'none' }}>€</span>
                  </div>
                  <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>TTC / accompagnateur</span>
                </div>
              )}
              {!repasAccomPayant && (
                <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon.Info size={13} style={{ color: 'var(--gold-600)', flexShrink: 0 }}/>
                  Aucune étape de paiement — l'accompagnateur s'inscrit directement.
                </div>
              )}
            </div>
          </ParamRow>
        </ParamCard>

        {/* Produits commandables — R84 */}
        <ParamCard title="Produits commandables" icon={<Icon.Medal size={14}/>} sub="Articles proposés aux producteurs après publication du palmarès">
          <ParamRow label="Articles actifs" hint="Activez ou désactivez chaque produit pour cette édition. Le prix est configurable par édition.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {formats.map((f) => (
                <div key={f.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px',
                  background: f.active ? 'var(--surface)' : 'var(--surface-2)',
                  border: '1px solid ' + (f.active ? 'var(--border)' : 'var(--border)'),
                  borderRadius: 8,
                  opacity: f.active ? 1 : 0.6,
                  transition: 'opacity .15s',
                }}>
                  {/* Checkbox activer/désactiver */}
                  <input
                    type="checkbox"
                    checked={f.active}
                    onChange={e => updateFormat(f.id, { active: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: 'var(--burgundy-800)', flexShrink: 0, cursor: 'pointer' }}
                  />

                  {/* Vignette image avec bouton "Changer" au survol */}
                  <label
                    htmlFor={'img-' + f.id}
                    style={{ position: 'relative', width: 52, height: 52, flexShrink: 0, cursor: 'pointer', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Cliquer pour changer l'image"
                  >
                    {f.image
                      ? <img src={f.image} alt={f.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                      : <span style={{ fontSize: 11, color: 'var(--fg-subtle)', textAlign: 'center', lineHeight: 1.2, padding: '0 4px' }}>Défaut SVG</span>
                    }
                    {/* Overlay hover */}
                    <div className="img-overlay" style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(0,0,0,0.55)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
                      opacity: 0, transition: 'opacity .15s',
                      color: '#fff',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                    >
                      <Icon.Upload size={14}/>
                      <span style={{ fontSize: 10, fontWeight: 600 }}>Changer</span>
                    </div>
                    <input
                      id={'img-' + f.id}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => { updateFormat(f.id, { image: ev.target.result }); };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>

                  {/* Identité */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{f.label}</div>
                    {f.sub && <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 1 }}>{f.sub}</div>}
                    {f.image && (
                      <button
                        onClick={() => updateFormat(f.id, { image: null })}
                        style={{ fontSize: 11, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', marginTop: 2, fontFamily: 'inherit' }}
                      >
                        Retirer l'image personnalisée
                      </button>
                    )}
                  </div>

                  {/* Badge impact stock */}
                  <span style={{
                    padding: '3px 9px', borderRadius: 6, fontSize: 11.5, fontWeight: 600, flexShrink: 0,
                    background: f.deductsStock ? 'var(--burgundy-50)' : 'var(--slate-100)',
                    color:      f.deductsStock ? 'var(--burgundy-800)' : 'var(--fg-muted)',
                  }}>
                    {f.deductsStock ? 'déduit du quota' : 'hors quota'}
                  </span>

                  {/* Prix configurable */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>Prix</span>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        className="input tnum"
                        value={f.prix}
                        min={0}
                        step={0.01}
                        onChange={e => updateFormat(f.id, { prix: parseFloat(e.target.value) || 0 })}
                        style={{ width: 90, textAlign: 'right', fontSize: 13, paddingRight: 28 }}
                      />
                      <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 12, pointerEvents: 'none' }}>€</span>
                    </div>
                    <span style={{ fontSize: 11.5, color: 'var(--fg-muted)', minWidth: 90 }}>{f.lotLabel}</span>
                  </div>
                </div>
              ))}
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4, paddingLeft: 2 }}>
                <Icon.Info size={12} style={{ verticalAlign: 'middle', marginRight: 5 }}/>
                Seules les médailles (au lot de 1 000) déduisent du quota déclaré. Plaques métal et chevalets plexi sont hors quota.
              </div>
            </div>
          </ParamRow>
          <ParamRow label="Seuil alerte commande" hint="En-dessous de ce nombre de lots commandés par producteur, une alerte est remontée côté admin">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, maxWidth: 320 }}>
              <input type="number" className="input tnum" defaultValue={1} min={1} onChange={markDirty} style={{ width: 80 }}/>
              <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>lot(s) · soit</span>
              <span className="tnum" style={{ fontSize: 13, fontWeight: 600, color: 'var(--burgundy-800)' }}>1 000 médailles</span>
            </div>
          </ParamRow>
          <ParamRow label="Seuil alerte dépassement stock" hint="Alerte admin si les médailles commandées dépassent ce pourcentage du volume déclaré du producteur">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, maxWidth: 240 }}>
              <div style={{ position: 'relative', maxWidth: 130 }}>
                <input type="number" className="input tnum" defaultValue={3} min={0} max={100} step={0.5} onChange={markDirty} style={{ paddingRight: 28 }}/>
                <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13, pointerEvents: 'none' }}>%</span>
              </div>
              <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>du stock déclaré</span>
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
  const [regionModal, setRegionModal] = React.useState(false);
  const [editingRegion, setEditingRegion] = React.useState(null);

  return (
    <div data-screen-label="admin-param-appellations">
      <PageHeader
        breadcrumb={['Administration', 'Paramètres', 'Régions']}
        title="Régions"
        subtitle="Régions viticoles disponibles dans les formulaires d'inscription"
        actions={<>
          <button className="btn btn-primary btn-sm" onClick={() => setRegionModal(true)} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Plus size={14}/> Ajouter une région
          </button>
        </>}
      />

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap" style={{ border: 'none', borderRadius: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Région</th>
                <th>Département</th>
                <th style={{ textAlign: 'right' }}>Producteurs rattachés</th>
                <th style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {REGIONS.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon.Map size={14} style={{ color: 'var(--fg-muted)', flexShrink: 0 }}/>
                      <span style={{ fontWeight: 500 }}>{r.nom}</span>
                    </div>
                  </td>
                  <td className="tnum" style={{ color: 'var(--fg-muted)' }}>{r.dept}</td>
                  <td className="tnum" style={{ textAlign: 'right' }}>{r.count}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <button className="btn btn-icon btn-sm btn-ghost" title="Modifier" onClick={() => setEditingRegion(r)}><Icon.Edit size={13}/></button>
                      <button className="btn btn-icon btn-sm btn-ghost" title="Supprimer" style={{ color: '#991b1b' }}><Icon.Trash size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {regionModal && <RegionModal onCancel={() => setRegionModal(false)} onConfirm={() => setRegionModal(false)}/>}
      {editingRegion && <RegionModal editing={editingRegion} onCancel={() => setEditingRegion(null)} onConfirm={() => setEditingRegion(null)}/>}
    </div>
  );
};

const RegionModal = ({ editing, onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);
  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 440, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '22px 26px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <h2 className="display" style={{ fontSize: 19, fontWeight: 500, margin: 0 }}>{editing ? 'Modifier la région' : 'Ajouter une région'}</h2>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
        </div>
        <div style={{ padding: '18px 26px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Nom</span>
            <input className="input" placeholder="Ex. Chablisien" defaultValue={editing?.nom || ''}/></label>
          <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Département</span>
            <input className="input tnum" placeholder="89" defaultValue={editing?.dept || ''}/></label>
        </div>
        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button className="btn btn-primary" onClick={onConfirm} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Check size={13}/> {editing ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page 3 — Fournisseurs médailles ──────────────────────────────

const FR_REGIONS = [
  { id: 'ARA',  label: 'Auvergne-Rhône-Alpes' },
  { id: 'BFC',  label: 'Bourgogne-Franche-Comté' },
  { id: 'BRE',  label: 'Bretagne' },
  { id: 'CVL',  label: 'Centre-Val de Loire' },
  { id: 'GE',   label: 'Grand Est' },
  { id: 'HDF',  label: 'Hauts-de-France' },
  { id: 'IDF',  label: 'Île-de-France' },
  { id: 'NOR',  label: 'Normandie' },
  { id: 'NAQ',  label: 'Nouvelle-Aquitaine' },
  { id: 'OCC',  label: 'Occitanie' },
  { id: 'PDL',  label: 'Pays de la Loire' },
  { id: 'PAC',  label: 'Provence-Alpes-Côte d\'Azur' },
  { id: 'CORS', label: 'Corse' },
];
const FDP_TRANCHES = [
  { id: 'xs', label: '< 2 kg',   maxKg: 2 },
  { id: 'sm', label: '2–5 kg',   maxKg: 5 },
  { id: 'md', label: '5–10 kg',  maxKg: 10 },
  { id: 'lg', label: '10–20 kg', maxKg: 20 },
  { id: 'xl', label: '> 20 kg',  maxKg: Infinity },
];
const FDP_TIMINGS = [
  { id: 'standard', label: 'Standard', sub: '5–7 j ouvrés' },
  { id: 'express',  label: 'Express',  sub: '2–3 j ouvrés' },
];

const AdminParamFournisseurs = () => {
  const [addModal, setAddModal] = React.useState(false);
  const [editId, setEditId] = React.useState(null);

  const FOURNISSEURS = [
    {
      id: 'lyon', nom: 'Médailleur Lyon', contact: 'Pierre Dupont', email: 'contact@medailleur-lyon.fr', tel: '04 78 12 34 56',
      formatId: 'CSV', delai: 14, status: 'actif', producteurs: 248, medailles: ['or', 'argent', 'bronze'],
      zones: ['ARA', 'BFC', 'OCC', 'PAC', 'CORS'],
      fdp: { xs: { standard: 6.90, express: 14.50 }, sm: { standard: 9.50, express: 18.00 }, md: { standard: 13.50, express: 26.00 }, lg: { standard: 19.00, express: 38.00 }, xl: { standard: 28.00, express: 55.00 } },
    },
    {
      id: 'bordeaux', nom: 'Médailleur Bordeaux', contact: 'Marie Verdier', email: 'commandes@verdier-medailles.fr', tel: '05 56 78 12 34',
      formatId: 'CSV', delai: 21, status: 'actif', producteurs: 52, medailles: ['or', 'argent', 'bronze'],
      zones: ['NAQ', 'PDL', 'BRE', 'NOR', 'CVL'],
      fdp: { xs: { standard: 7.50, express: 15.00 }, sm: { standard: 10.50, express: 19.50 }, md: { standard: 14.50, express: 28.00 }, lg: { standard: 21.00, express: 42.00 }, xl: { standard: 30.00, express: 60.00 } },
    },
    {
      id: 'paris', nom: 'Arthus-Bertrand', contact: 'Sophie Martin', email: 'btob@arthus-bertrand.fr', tel: '01 42 60 73 19',
      formatId: 'XLSX', delai: 30, status: 'inactif', producteurs: 12, medailles: ['or'],
      zones: ['IDF', 'GE', 'HDF'],
      fdp: { xs: { standard: 7.90, express: 15.50 }, sm: { standard: 11.00, express: 20.00 }, md: { standard: 15.00, express: 29.00 }, lg: { standard: 22.00, express: 44.00 }, xl: { standard: 32.00, express: 62.00 } },
    },
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
        breadcrumb={['Administration', 'Paramètres', 'Imprimeurs']}
        title="Imprimeurs"
        subtitle="Médailleurs partenaires · Format d'export et délais de production"
        actions={<>
          <button className="btn btn-primary btn-sm" onClick={() => setAddModal(true)} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Plus size={14}/> Ajouter un imprimeur
          </button>
        </>}
      />

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <SortableTh sortKey="nom"         currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Imprimeur</SortableTh>
              <SortableTh sortKey="contact"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Contact</SortableTh>
              <SortableTh sortKey="formatId"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Format d'export</SortableTh>
              <th>Médailles gérées</th>
              <th>Zones géographiques</th>
              <SortableTh sortKey="delai"       currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Délai (j)</SortableTh>
              <SortableTh sortKey="producteurs" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Prod. rattachés</SortableTh>
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
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {(f.zones || []).slice(0, 4).map(z => (
                      <span key={z} title={(FR_REGIONS.find(r => r.id === z) || {}).label} style={{
                        fontSize: 10, fontWeight: 600, padding: '1px 5px', borderRadius: 4,
                        background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                        border: '1px solid var(--burgundy-200, #e9d5d5)',
                      }}>{z}</span>
                    ))}
                    {(f.zones || []).length > 4 && (
                      <span style={{ fontSize: 10, color: 'var(--fg-muted)', padding: '1px 4px' }}>+{f.zones.length - 4}</span>
                    )}
                    {(f.zones || []).length === 0 && <span style={{ fontSize: 11, color: 'var(--fg-subtle)', fontStyle: 'italic' }}>—</span>}
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

const FournisseurModalSectionTitle = ({ children }) => (
  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg-muted)', marginBottom: 8, marginTop: 4, paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>
    {children}
  </div>
);

const FournisseurModal = ({ editing, onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const [medailles, setMedailles] = React.useState((editing && editing.medailles) ? editing.medailles : ['or', 'argent', 'bronze']);
  const toggleMedaille = (m) => setMedailles(arr => arr.includes(m) ? arr.filter(x => x !== m) : [...arr, m]);

  const [zones, setZones] = React.useState((editing && editing.zones) ? editing.zones : []);
  const toggleZone = (z) => setZones(arr => arr.includes(z) ? arr.filter(x => x !== z) : [...arr, z]);

  const buildInitFdp = () => {
    var init = {};
    FDP_TRANCHES.forEach(function(t) {
      init[t.id] = {};
      FDP_TIMINGS.forEach(function(tm) {
        var val = (editing && editing.fdp && editing.fdp[t.id] && editing.fdp[t.id][tm.id] !== undefined) ? editing.fdp[t.id][tm.id] : '';
        init[t.id][tm.id] = val;
      });
    });
    return init;
  };
  const [fdpData, setFdpData] = React.useState(buildInitFdp);
  const updateFdp = (tId, tmId, val) => setFdpData(prev => ({ ...prev, [tId]: { ...prev[tId], [tmId]: val } }));

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 660, padding: 0, overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '22px 26px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <h2 className="display" style={{ fontSize: 19, fontWeight: 500, margin: 0 }}>
            {editing ? `Modifier ${editing.nom}` : 'Ajouter un imprimeur'}
          </h2>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
        </div>
        <div style={{ padding: '18px 26px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── Infos générales */}
          <div>
            <FournisseurModalSectionTitle>Informations générales</FournisseurModalSectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label className="field"><span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Nom de l'imprimeur</span>
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
            </div>
          </div>

          {/* ── Types de médailles */}
          <div>
            <FournisseurModalSectionTitle>Types de médailles gérés</FournisseurModalSectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { id: 'or', label: 'Or', dot: '#d4a017' },
                { id: 'argent', label: 'Argent', dot: '#94a3b8' },
                { id: 'bronze', label: 'Bronze', dot: '#c2410c' },
              ].map(m => {
                const active = medailles.includes(m.id);
                return (
                  <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: `1px solid ${active ? 'var(--burgundy-800)' : 'var(--border)'}`, background: active ? 'var(--burgundy-50)' : 'var(--surface)', borderRadius: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={active} onChange={() => toggleMedaille(m.id)} style={{ accentColor: 'var(--burgundy-800)' }}/>
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: m.dot, flexShrink: 0 }}/>
                    <span style={{ fontSize: 13, fontWeight: 500, color: active ? 'var(--burgundy-800)' : 'var(--fg)' }}>{m.label}</span>
                  </label>
                );
              })}
            </div>
            {medailles.length === 0 && (
              <div style={{ fontSize: 11.5, color: '#991b1b', marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon.AlertTriangle size={11}/> Au moins un type doit être sélectionné.
              </div>
            )}
          </div>

          {/* ── Zones géographiques */}
          <div>
            <FournisseurModalSectionTitle>Zones géographiques desservies</FournisseurModalSectionTitle>
            <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon.Globe size={11}/>
              Les producteurs de ces régions seront automatiquement rattachés à cet imprimeur.
              {zones.length > 0 && <span style={{ marginLeft: 4, fontWeight: 600, color: 'var(--burgundy-800)' }}>{zones.length} région(s) sélectionnée(s)</span>}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {FR_REGIONS.map(function(r) {
                var active = zones.includes(r.id);
                return (
                  <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', border: '1px solid ' + (active ? 'var(--burgundy-800)' : 'var(--border)'), background: active ? 'var(--burgundy-50)' : 'var(--surface)', borderRadius: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={active} onChange={function() { toggleZone(r.id); }} style={{ accentColor: 'var(--burgundy-800)' }}/>
                    <span style={{ fontSize: 10.5, fontWeight: 700 }}>{r.id}</span>
                    <span style={{ fontSize: 10.5 }}>{r.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ── Barème frais de port */}
          <div>
            <FournisseurModalSectionTitle>Barème frais de port (€ TTC)</FournisseurModalSectionTitle>
            <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginBottom: 10 }}>
              Référence : 1 médaille ≈ 5 g · 1 000 médailles ≈ 5 kg
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: 'var(--surface-2)' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, border: '1px solid var(--border)', fontSize: 11 }}>Tranche poids</th>
                    {FDP_TIMINGS.map(function(tm) {
                      return (
                        <th key={tm.id} style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, border: '1px solid var(--border)', fontSize: 11 }}>
                          <div>{tm.label}</div>
                          <div style={{ fontWeight: 400, fontSize: 10.5 }}>{tm.sub}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {FDP_TRANCHES.map(function(t, i) {
                    return (
                      <tr key={t.id} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface-2)' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 600, border: '1px solid var(--border)' }}>{t.label}</td>
                        {FDP_TIMINGS.map(function(tm) {
                          return (
                            <td key={tm.id} style={{ padding: '6px 10px', border: '1px solid var(--border)', textAlign: 'center' }}>
                              <input
                                type="number" step="0.01" min="0"
                                value={fdpData[t.id] && fdpData[t.id][tm.id] !== undefined ? fdpData[t.id][tm.id] : ''}
                                onChange={function(e) { updateFdp(t.id, tm.id, e.target.value); }}
                                className="input tnum"
                                style={{ width: 72, padding: '4px 8px', fontSize: 12.5, textAlign: 'right' }}
                              />
                              {' '}€
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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

// ── Modal ajout/édition expéditeur ──────────────────────────────────
const ExpEditeurModal = ({ sender, onSave, onClose }) => {
  const [nom, setNom] = React.useState(sender?.nom || '');
  const [email, setEmail] = React.useState(sender?.email || '');
  const [defaut, setDefaut] = React.useState(sender?.defaut || false);
  const isNew = !sender;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15,23,42,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--surface)', borderRadius: 14, width: '100%', maxWidth: 460, boxShadow: '0 24px 48px rgba(0,0,0,.18)', overflow: 'hidden' }}>
        <div style={{ padding: '22px 28px 18px', borderBottom: '1px solid var(--border)' }}>
          <h3 className="display" style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>
            {isNew ? 'Nouvel expéditeur' : "Modifier l'expéditeur"}
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--fg-muted)' }}>
            Ce nom et cette adresse apparaîtront dans le champ « De : » des emails envoyés.
          </p>
        </div>
        <div style={{ padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label className="field">
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Nom affiché</span>
            <input className="input" value={nom} onChange={e => setNom(e.target.value)} placeholder="Comité des Salons et Concours de Mâcon"/>
          </label>
          <label className="field">
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Adresse email</span>
            <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="contact@comite-macon.fr"
              style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
            <input type="checkbox" checked={defaut} onChange={e => setDefaut(e.target.checked)}
              style={{ accentColor: 'var(--burgundy-800)', width: 15, height: 15, flexShrink: 0 }}/>
            Définir comme expéditeur par défaut
          </label>
        </div>
        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-outline" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" style={{ background: 'var(--burgundy-800)' }}
            onClick={() => { onSave({ nom, email, defaut }); onClose(); }}
            disabled={!nom.trim() || !email.trim()}>
            {isNew ? 'Ajouter' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminParamEmails = () => {
  const [openId, setOpenId] = React.useState(null);
  const [createModal, setCreateModal] = React.useState(false);
  // Expéditeurs — initialisés depuis les données globales partagées
  const [senders, setSenders] = React.useState([...EXPEDITEURS_EMAIL]);
  const [senderModal, setSenderModal] = React.useState(null); // null | 'new' | sender object
  // En-têtes & pieds de page
  const [headers, setHeaders] = React.useState(() => JSON.parse(JSON.stringify(INITIAL_HEADERS)));
  const [footers, setFooters] = React.useState(() => JSON.parse(JSON.stringify(INITIAL_FOOTERS)));
  const [hfModal, setHfModal] = React.useState(null); // null | { type: 'header'|'footer', item? }
  const [hfTab,   setHfTab  ] = React.useState('headers');
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

  const handleSenderSave = (data) => {
    if (senderModal === 'new') {
      const newId = 'sender-' + (senders.length + 1);
      // Si défaut coché, retirer le défaut des autres
      setSenders(prev => [
        ...(data.defaut ? prev.map(s => ({ ...s, defaut: false })) : prev),
        { id: newId, ...data },
      ]);
    } else {
      setSenders(prev => prev.map(s => {
        if (s.id === senderModal.id) return { ...s, ...data };
        return data.defaut ? { ...s, defaut: false } : s;
      }));
    }
  };

  return (
    <div data-screen-label="admin-param-emails">
      <PageHeader
        breadcrumb={['Administration', 'Paramètres', 'Emails']}
        title="Emails"
        subtitle="Expéditeurs et templates de notifications"
        actions={<>
          <button className="btn btn-primary btn-sm" onClick={() => setCreateModal(true)} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Plus size={14}/> Nouveau template
          </button>
        </>}
      />

      {/* Section — En-têtes & Pieds de page */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 16 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: 'var(--fg)' }}>En-têtes &amp; Pieds de page</h3>
            <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 3 }}>Modèles visuels réutilisables dans vos templates et envois groupés.</p>
          </div>
        </div>

        {/* Onglets En-têtes / Pieds de page */}
        <div style={{ display: 'flex', marginBottom: 14, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', width: 'fit-content' }}>
          {[['headers','En-têtes'],['footers','Pieds de page']].map(([key, label]) => (
            <button key={key} type="button" onClick={() => setHfTab(key)}
              style={{ padding: '8px 18px', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', background: hfTab === key ? 'var(--burgundy-800)' : 'var(--bg)', color: hfTab === key ? '#fff' : 'var(--fg)', transition: 'all .12s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Grille de cartes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {(hfTab === 'headers' ? headers : footers).map(hf => (
            <div key={hf.id} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--surface)' }}>
              {/* Mini-aperçu du modèle */}
              <div style={{ background: hf.bg, maxHeight: 76, overflow: 'hidden' }}>
                {hf.blocks.slice(0, 4).map(b => <BlockPreview key={b.id} block={b}/>)}
              </div>
              {/* Nom + actions */}
              <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, fontSize: 13 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hf.name}</span>
                    {hf.defaut && (
                      <span style={{ fontSize: 10.5, fontWeight: 600, padding: '1px 6px', borderRadius: 999, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', border: '1px solid rgba(83,20,66,.15)', flexShrink: 0 }}>Défaut</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 1 }}>{hf.blocks.length} bloc{hf.blocks.length !== 1 ? 's' : ''}</div>
                </div>
                <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                  {!hf.defaut && (
                    <button className="btn btn-icon btn-sm btn-ghost" title="Définir par défaut"
                      onClick={() => {
                        const setter = hfTab === 'headers' ? setHeaders : setFooters;
                        setter(prev => prev.map(x => ({ ...x, defaut: x.id === hf.id })));
                      }}>
                      <Icon.Star size={12}/>
                    </button>
                  )}
                  <button className="btn btn-icon btn-sm btn-ghost" title="Modifier" onClick={() => setHfModal({ type: hfTab === 'headers' ? 'header' : 'footer', item: hf })}>
                    <Icon.Edit size={12}/>
                  </button>
                  {!hf.defaut && (
                    <button className="btn btn-icon btn-sm btn-ghost" title="Supprimer" style={{ color: 'var(--error, #dc2626)' }}
                      onClick={() => {
                        const setter = hfTab === 'headers' ? setHeaders : setFooters;
                        setter(prev => prev.filter(x => x.id !== hf.id));
                      }}>
                      <Icon.Trash size={12}/>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Carte « Nouveau » */}
          <button type="button"
            onClick={() => setHfModal({ type: hfTab === 'headers' ? 'header' : 'footer' })}
            style={{ border: '2px dashed var(--border)', borderRadius: 10, background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '24px 16px', minHeight: 118, color: 'var(--fg-muted)', transition: 'all .12s', fontSize: 13, fontWeight: 500 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--burgundy-800)'; e.currentTarget.style.color = 'var(--burgundy-800)'; e.currentTarget.style.background = 'var(--burgundy-50)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--fg-muted)'; e.currentTarget.style.background = 'transparent'; }}>
            <Icon.Plus size={20}/>
            Nouveau {hfTab === 'headers' ? 'en-tête' : 'pied de page'}
          </button>
        </div>
      </div>

      {/* Section — Adresses expéditrices */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 16 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: 'var(--fg)' }}>Adresses expéditrices</h3>
            <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 3 }}>
              Ces adresses apparaissent dans le champ « De : » lors de l'envoi d'emails groupés.
            </p>
          </div>
          <button className="btn btn-sm btn-outline" onClick={() => setSenderModal('new')} style={{ flexShrink: 0, marginTop: 2 }}>
            <Icon.Plus size={13}/> Ajouter
          </button>
        </div>

        <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--surface)' }}>
          {senders.map((s, idx) => (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '13px 18px',
              borderBottom: idx < senders.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon.Mail size={15}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 500, fontSize: 13.5 }}>{s.nom}</span>
                  {s.defaut && (
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 999,
                      background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                      border: '1px solid rgba(83,20,66,.18)',
                    }}>Défaut</span>
                  )}
                </div>
                <div style={{
                  fontSize: 12, color: 'var(--fg-muted)', marginTop: 2,
                  fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
                }}>{s.email}</div>
              </div>
              <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                {!s.defaut && (
                  <button className="btn btn-icon btn-sm btn-ghost" title="Définir par défaut"
                    onClick={() => setSenders(prev => prev.map(x => ({ ...x, defaut: x.id === s.id })))}>
                    <Icon.Star size={13}/>
                  </button>
                )}
                <button className="btn btn-icon btn-sm btn-ghost" onClick={() => setSenderModal(s)}>
                  <Icon.Edit size={13}/>
                </button>
                {!s.defaut && (
                  <button className="btn btn-icon btn-sm btn-ghost" style={{ color: 'var(--error, #dc2626)' }}
                    onClick={() => setSenders(prev => prev.filter(x => x.id !== s.id))}>
                    <Icon.Trash size={13}/>
                  </button>
                )}
              </div>
            </div>
          ))}
          {senders.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>
              Aucun expéditeur configuré
            </div>
          )}
        </div>
      </div>

      {/* Section — Templates emails */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: 'var(--fg)' }}>Templates emails</h3>
          <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 3 }}>Notifications automatiques envoyées aux producteurs et dégustateurs.</p>
        </div>
      </div>

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

      {senderModal !== null && (
        <ExpEditeurModal
          sender={senderModal === 'new' ? null : senderModal}
          onSave={handleSenderSave}
          onClose={() => setSenderModal(null)}
        />
      )}

      {hfModal !== null && (
        <HFBuilderModal
          type={hfModal.type}
          item={hfModal.item || null}
          onSave={(saved) => {
            const setter = hfModal.type === 'header' ? setHeaders : setFooters;
            setter(prev => {
              if (hfModal.item) {
                return prev.map(x => x.id === saved.id ? saved : (saved.defaut ? { ...x, defaut: false } : x));
              }
              return [...(saved.defaut ? prev.map(x => ({ ...x, defaut: false })) : prev), saved];
            });
          }}
          onClose={() => setHfModal(null)}
        />
      )}
    </div>
  );
};

const EmailTemplateEditor = ({ template, onBack }) => {
  const isDraft = template.status === 'brouillon';
  const [objet, setObjet] = React.useState(isDraft ? '' : `Confirmation de votre inscription au Concours des Grands Vins de France 2026`);
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

// ─── Page — Notifications par utilisateur ────────────────────────

const NOTIF_CATEGORIES = [
  { id: 'inscriptions', label: 'Inscriptions', icon: 'FileText', items: [
    { id: 'ins_soumise',  label: 'Nouvelle inscription soumise',       desc: "Dès qu'un producteur soumet un dossier d'inscription" },
    { id: 'ins_validee',  label: 'Inscription validée automatiquement', desc: 'Confirmation de validation automatique par le système' },
    { id: 'ins_refusee',  label: 'Inscription refusée',                desc: 'Dossier non conforme après contrôle — action requise' },
  ]},
  { id: 'paiements', label: 'Paiements', icon: 'Euro', items: [
    { id: 'pay_cb',       label: 'Paiement CB reçu',                   desc: 'Transaction Paybox confirmée en temps réel' },
    { id: 'pay_virement', label: 'Virement reçu à confirmer',          desc: 'Virement déclaré par le producteur, en attente de validation manuelle' },
    { id: 'pay_retard',   label: 'Virement en retard (> 8 jours)',     desc: 'Aucun paiement reçu 8 jours après la soumission du dossier' },
    { id: 'pay_cheque',   label: 'Chèque à encaisser',                 desc: 'Chèque déclaré mais non encore traité' },
  ]},
  { id: 'derogations', label: 'Dérogations', icon: 'ShieldCheck', items: [
    { id: 'dero_nouvelle', label: 'Nouvelle demande de dérogation',    desc: 'Producteur ayant coché la case dérogation impression' },
    { id: 'dero_traitee',  label: 'Dérogation traitée par un collègue', desc: 'Un autre administrateur a statué sur une dérogation' },
  ]},
  { id: 'degustateurs', label: 'Dégustateurs', icon: 'Users', items: [
    { id: 'deg_inscrit',  label: 'Nouveau dégustateur inscrit',        desc: "Création d'un compte dégustateur sur la plateforme" },
    { id: 'deg_dispo',    label: 'Disponibilités confirmées',          desc: 'Un dégustateur a validé ses disponibilités pour un concours' },
  ]},
  { id: 'salons', label: 'Salons & exposants', icon: 'Building', items: [
    { id: 'sal_inscrit',  label: 'Nouvelle inscription exposant',       desc: 'Un exposant a soumis son inscription à un salon' },
    { id: 'sal_paiement', label: 'Paiement exposant reçu',             desc: "Paiement d'inscription au salon confirmé" },
  ]},
  { id: 'systeme', label: 'Système', icon: 'Settings', items: [
    { id: 'sys_api',      label: 'Erreur API (Paybox, Sage…)',         desc: 'Échec de connexion à un service tiers — intervention requise' },
    { id: 'sys_backup',   label: 'Sauvegarde échouée',                 desc: 'Alerte infrastructure automatique' },
  ]},
];

const ALL_NOTIF_IDS = NOTIF_CATEGORIES.flatMap(c => c.items.map(i => i.id));
const ALL_ON  = Object.fromEntries(ALL_NOTIF_IDS.map(id => [id, true]));
const ALL_OFF = Object.fromEntries(ALL_NOTIF_IDS.map(id => [id, false]));

const NOTIF_DEFAULTS = {
  sophie:   { ins_soumise: true,  ins_validee: false, ins_refusee: true,  pay_cb: true,  pay_virement: true,  pay_retard: true,  pay_cheque: false, dero_nouvelle: true,  dero_traitee: false, deg_inscrit: false, deg_dispo: false, sal_inscrit: true,  sal_paiement: false, sys_api: true,  sys_backup: true  },
  marc:     { ins_soumise: true,  ins_validee: false, ins_refusee: false, pay_cb: false, pay_virement: true,  pay_retard: true,  pay_cheque: true,  dero_nouvelle: true,  dero_traitee: true,  deg_inscrit: false, deg_dispo: false, sal_inscrit: true,  sal_paiement: true,  sys_api: false, sys_backup: false },
  claire:   { ins_soumise: true,  ins_validee: true,  ins_refusee: true,  pay_cb: true,  pay_virement: false, pay_retard: false, pay_cheque: false, dero_nouvelle: false, dero_traitee: false, deg_inscrit: true,  deg_dispo: true,  sal_inscrit: false, sal_paiement: false, sys_api: false, sys_backup: false },
  pierre:   { ins_soumise: false, ins_validee: false, ins_refusee: false, pay_cb: false, pay_virement: false, pay_retard: false, pay_cheque: false, dero_nouvelle: false, dero_traitee: false, deg_inscrit: false, deg_dispo: false, sal_inscrit: false, sal_paiement: false, sys_api: false, sys_backup: false },
  isabelle: { ins_soumise: true,  ins_validee: false, ins_refusee: true,  pay_cb: true,  pay_virement: true,  pay_retard: false, pay_cheque: false, dero_nouvelle: true,  dero_traitee: false, deg_inscrit: false, deg_dispo: false, sal_inscrit: false, sal_paiement: false, sys_api: false, sys_backup: false },
};

const ADMINS_NOTIF = [
  { id: 'sophie',   prenom: 'Sophie',   nom: 'Lambert',  role: 'super-admin', avatar: 'SL' },
  { id: 'marc',     prenom: 'Marc',     nom: 'Dubois',   role: 'admin',       avatar: 'MD' },
  { id: 'claire',   prenom: 'Claire',   nom: 'Mercier',  role: 'admin',       avatar: 'CM' },
  { id: 'pierre',   prenom: 'Pierre',   nom: 'Gauthier', role: 'lecteur',     avatar: 'PG' },
  { id: 'isabelle', prenom: 'Isabelle', nom: 'Petit',    role: 'admin',       avatar: 'IP' },
];

const NotifToggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    style={{
      width: 38, height: 22, borderRadius: 999, padding: 0, border: 'none',
      background: checked ? 'var(--burgundy-800)' : 'var(--slate-200)',
      cursor: 'pointer', position: 'relative', flexShrink: 0,
      transition: 'background .18s',
    }}
  >
    <span style={{
      position: 'absolute', top: 3, left: checked ? 19 : 3,
      width: 16, height: 16, borderRadius: 999, background: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,.2)',
      transition: 'left .18s',
    }}/>
  </button>
);

const AdminParamNotifications = () => {
  const [selectedId, setSelectedId] = React.useState('sophie');
  const [prefs, setPrefs] = React.useState(NOTIF_DEFAULTS);
  const [dirty, setDirty] = React.useState({});

  const user = ADMINS_NOTIF.find(a => a.id === selectedId);
  const userPrefs = prefs[selectedId] || {};
  const countOn = Object.values(userPrefs).filter(Boolean).length;

  const toggle = (notifId) => {
    setPrefs(p => ({ ...p, [selectedId]: { ...p[selectedId], [notifId]: !p[selectedId][notifId] } }));
    setDirty(d => ({ ...d, [selectedId]: true }));
  };

  const setAll = (val) => {
    setPrefs(p => ({ ...p, [selectedId]: { ...p[selectedId], ...Object.fromEntries(ALL_NOTIF_IDS.map(id => [id, val])) } }));
    setDirty(d => ({ ...d, [selectedId]: true }));
  };

  const save = () => setDirty(d => ({ ...d, [selectedId]: false }));

  const catIconMap = { FileText: <Icon.FileText size={14}/>, Euro: <Icon.Euro size={14}/>, ShieldCheck: <Icon.ShieldCheck size={14}/>, Users: <Icon.Users size={14}/>, Building: <Icon.Building size={14}/>, Settings: <Icon.Settings size={14}/> };

  return (
    <div data-screen-label="admin-param-notifs">
      <PageHeader
        breadcrumb={['Administration', 'Paramètres', 'Notifications']}
        title="Notifications"
        subtitle="Configurez les alertes e-mail et in-app de chaque administrateur"
        icon={<Icon.Bell size={22}/>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Colonne utilisateurs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', padding: '0 4px', marginBottom: 4 }}>Administrateurs</div>
          {ADMINS_NOTIF.map(a => {
            const n = Object.values(prefs[a.id] || {}).filter(Boolean).length;
            const isSelected = a.id === selectedId;
            return (
              <button key={a.id} onClick={() => setSelectedId(a.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 9, border: `1px solid ${isSelected ? 'var(--burgundy-800)' : 'var(--border)'}`,
                background: isSelected ? 'var(--burgundy-50)' : 'var(--surface)',
                cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'all .12s',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 999, flexShrink: 0,
                  background: isSelected ? 'var(--burgundy-800)' : 'var(--slate-100)',
                  color: isSelected ? '#fff' : 'var(--fg-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                }}>{a.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? 'var(--burgundy-800)' : 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.prenom} {a.nom}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{n} alerte{n > 1 ? 's' : ''} activée{n > 1 ? 's' : ''}</div>
                </div>
                {dirty[a.id] && <span style={{ width: 7, height: 7, borderRadius: 999, background: '#f59e0b', flexShrink: 0 }}/>}
              </button>
            );
          })}
        </div>

        {/* Panneau préférences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* En-tête utilisateur */}
          <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 999, background: 'var(--burgundy-800)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{user.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{user.prenom} {user.nom}</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>{ROLES[user.role]?.label} · {countOn} alerte{countOn > 1 ? 's' : ''} activée{countOn > 1 ? 's' : ''} sur {ALL_NOTIF_IDS.length}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline btn-sm" onClick={() => setAll(true)}>Tout activer</button>
              <button className="btn btn-outline btn-sm" onClick={() => setAll(false)}>Tout désactiver</button>
              {dirty[selectedId] && (
                <button className="btn btn-primary btn-sm" onClick={save}>
                  <Icon.Check size={13}/> Enregistrer
                </button>
              )}
            </div>
          </div>

          {/* Catégories */}
          {NOTIF_CATEGORIES.map(cat => {
            const catCount = cat.items.filter(i => userPrefs[i.id]).length;
            return (
              <div key={cat.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: 'var(--burgundy-800)' }}>{catIconMap[cat.icon]}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{cat.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--fg-muted)', marginLeft: 'auto' }}>{catCount} / {cat.items.length} activée{catCount > 1 ? 's' : ''}</span>
                </div>
                <div style={{ padding: '4px 0' }}>
                  {cat.items.map((item, i) => (
                    <div key={item.id} style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px',
                      borderBottom: i < cat.items.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{item.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{item.desc}</div>
                      </div>
                      <NotifToggle checked={!!userPrefs[item.id]} onChange={() => toggle(item.id)}/>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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

const RAPPELS_PAIEMENT_INIT = {
  'salon-vins-2026': [
    { id: 'r1', actif: true,  cible: 'acompte', jAvant: 7,  label: 'Premier rappel acompte',    modele: 'rappel-acompte-j7'   },
    { id: 'r2', actif: true,  cible: 'solde',   jAvant: 60, label: 'Alerte solde à venir',       modele: 'rappel-solde-j60'    },
    { id: 'r3', actif: true,  cible: 'solde',   jAvant: 30, label: 'Rappel date limite solde',   modele: 'rappel-solde-j30'    },
    { id: 'r4', actif: true,  cible: 'solde',   jAvant: 14, label: 'Relance urgente solde',      modele: 'rappel-solde-j14'    },
    { id: 'r5', actif: false, cible: 'solde',   jAvant: 0,  label: 'Alerte solde en retard',     modele: 'alerte-solde-retard' },
  ],
  'marche-plaisirs-2026': [
    { id: 'r1', actif: true,  cible: 'solde',   jAvant: 30, label: 'Alerte solde à venir',       modele: 'rappel-solde-j30'    },
    { id: 'r2', actif: true,  cible: 'solde',   jAvant: 7,  label: 'Dernier rappel solde',       modele: 'rappel-solde-j7'     },
  ],
  'salon-vins-2025': [],
};

const COMMUNICATION_EXPO_INIT = {
  'salon-vins-2026': [
    { id: 'aff-ext', actif: true,  cat: 'Affichage', nom: 'Affichage extérieur',       desc: "Bandeau 2×1m à l'entrée du parc — visibilité maximale",      prixHT: 180, couleur: '#2563eb', visuelUrl: '' },
    { id: 'aff-int', actif: true,  cat: 'Affichage', nom: 'Panneau allée intérieure',  desc: 'Panneau A1 dans les allées principales du salon',              prixHT: 120, couleur: '#7c3aed', visuelUrl: '' },
    { id: 'digital', actif: true,  cat: 'Digital',   nom: 'Diffusion écran digital',   desc: 'Votre visuel sur les écrans LED · 10 passages/heure',           prixHT: 280, couleur: '#0891b2', visuelUrl: '' },
    { id: 'prog',    actif: true,  cat: 'Print',     nom: 'Encart programme papier',   desc: 'Encart ½ page · programme officiel (tirage 5 000 ex.)',         prixHT: 220, couleur: '#d97706', visuelUrl: '' },
    { id: 'web',     actif: true,  cat: 'Digital',   nom: 'Bannière site web',         desc: "Bannière sur le site du salon · 1 mois avant l'événement",     prixHT: 150, couleur: '#059669', visuelUrl: '' },
    { id: 'rs',      actif: false, cat: 'Digital',   nom: 'Post réseaux sociaux',      desc: 'Publication dédiée sur les réseaux du Comité',                 prixHT: 90,  couleur: '#e11d48', visuelUrl: '' },
  ],
  'marche-plaisirs-2026': [
    { id: 'aff-ext', actif: true,  cat: 'Affichage', nom: 'Affichage extérieur',       desc: "Bandeau à l'entrée du Marché des Plaisirs Gourmands",          prixHT: 150, couleur: '#2563eb', visuelUrl: '' },
    { id: 'digital', actif: true,  cat: 'Digital',   nom: 'Écran digital entrée',      desc: "Votre visuel sur l'écran principal à l'entrée du marché",      prixHT: 200, couleur: '#0891b2', visuelUrl: '' },
    { id: 'prog',    actif: true,  cat: 'Print',     nom: 'Programme papier',          desc: 'Encart dans le programme officiel du Marché des Plaisirs',     prixHT: 180, couleur: '#d97706', visuelUrl: '' },
    { id: 'rs',      actif: true,  cat: 'Digital',   nom: 'Post réseaux sociaux',      desc: 'Publication dédiée sur les réseaux du Comité',                 prixHT: 90,  couleur: '#e11d48', visuelUrl: '' },
  ],
  'salon-vins-2025': [],
};

const CommOptionCard = ({ opt, onUpdate }) => {
  const [showUrl, setShowUrl] = React.useState(false);
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', opacity: opt.actif ? 1 : 0.5, transition: 'opacity .15s' }}>
      {/* Zone visuelle */}
      <div style={{
        height: 130, position: 'relative',
        background: opt.visuelUrl
          ? `url(${opt.visuelUrl}) center/cover no-repeat`
          : `linear-gradient(135deg, ${opt.couleur}18 0%, ${opt.couleur}38 100%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        {!opt.visuelUrl && (
          <div style={{ textAlign: 'center' }}>
            <Icon.Layers size={30} style={{ color: opt.couleur, opacity: .45, display: 'block', margin: '0 auto 6px' }}/>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: opt.couleur, textTransform: 'uppercase', letterSpacing: '.07em', opacity: .65 }}>{opt.cat}</span>
          </div>
        )}
        <label style={{ position: 'absolute', top: 8, left: 8, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,.88)', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 12, fontWeight: 500, boxShadow: '0 1px 3px rgba(0,0,0,.1)' }}>
          <input type="checkbox" checked={opt.actif} onChange={e => onUpdate(opt.id, { actif: e.target.checked })} style={{ width: 13, height: 13, accentColor: 'var(--burgundy-800)' }}/>
          Actif
        </label>
        <button
          onClick={() => setShowUrl(v => !v)}
          className="btn btn-sm btn-outline"
          style={{ position: 'absolute', bottom: 8, right: 8, fontSize: 11.5, padding: '3px 9px', background: 'rgba(255,255,255,.88)' }}
        >
          <Icon.Layers size={11}/> {opt.visuelUrl ? 'Changer' : 'Ajouter visuel'}
        </button>
      </div>
      {showUrl && (
        <div style={{ padding: '8px 12px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
          <input className="input" value={opt.visuelUrl} onChange={e => onUpdate(opt.id, { visuelUrl: e.target.value })} placeholder="URL de l'image (https://…jpg, png, webp)" style={{ fontSize: 12 }}/>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4 }}>Dans la version finale, ce champ sera remplacé par un bouton d'upload.</div>
        </div>
      )}
      {/* Champs éditables */}
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <input className="input" value={opt.nom} onChange={e => onUpdate(opt.id, { nom: e.target.value })} placeholder="Nom de l'option" style={{ fontWeight: 600, fontSize: 13 }}/>
        <textarea className="input" rows={2} value={opt.desc} onChange={e => onUpdate(opt.id, { desc: e.target.value })} placeholder="Description…" style={{ fontSize: 12, resize: 'none', lineHeight: 1.4 }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input type="number" min={0} className="input tnum" value={opt.prixHT} onChange={e => onUpdate(opt.id, { prixHT: parseFloat(e.target.value) || 0 })} style={{ paddingRight: 40 }}/>
            <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13, pointerEvents: 'none' }}>€ HT</span>
          </div>
          <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 999, fontWeight: 600, background: opt.couleur + '22', color: opt.couleur, whiteSpace: 'nowrap' }}>{opt.cat}</span>
        </div>
      </div>
    </div>
  );
};

const RappelRow = ({ rappel: r, onUpdate }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '11px 14px',
    background: r.actif ? 'var(--surface)' : 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    opacity: r.actif ? 1 : 0.6,
    transition: 'opacity .15s',
  }}>
    <input
      type="checkbox"
      checked={r.actif}
      onChange={e => onUpdate(r.id, { actif: e.target.checked })}
      style={{ width: 16, height: 16, accentColor: 'var(--burgundy-800)', flexShrink: 0, cursor: 'pointer' }}
    />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 500 }}>{r.label}</div>
      <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 1 }}>
        Modèle : <span style={{ fontFamily: 'monospace', fontSize: 11.5, background: 'var(--surface-2)', padding: '1px 5px', borderRadius: 3 }}>{r.modele}</span>
      </div>
    </div>
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999, flexShrink: 0,
      background: r.cible === 'solde' ? '#ede9fe' : '#dbeafe',
      color: r.cible === 'solde' ? '#6d28d9' : '#1d4ed8',
    }}>
      {r.cible === 'solde' ? 'Solde' : 'Acompte'}
    </span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
      <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>J −</span>
      <input
        type="number" min={0} max={365}
        className="input tnum"
        value={r.jAvant}
        onChange={e => onUpdate(r.id, { jAvant: parseInt(e.target.value, 10) || 0 })}
        style={{ width: 60, textAlign: 'center' }}
      />
      <span style={{ fontSize: 12, color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>avant salon</span>
    </div>
  </div>
);

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

  const [rappels, setRappels] = React.useState(RAPPELS_PAIEMENT_INIT);
  const salonRappels = rappels[salon] || [];
  const updateRappel = (id, patch) => { setRappels(r => ({ ...r, [salon]: (r[salon] || []).map(x => x.id === id ? { ...x, ...patch } : x) })); markDirty(); };

  const [comm, setComm] = React.useState(COMMUNICATION_EXPO_INIT);
  const salonComm = comm[salon] || [];
  const updateComm = (id, patch) => { setComm(c => ({ ...c, [salon]: (c[salon] || []).map(x => x.id === id ? { ...x, ...patch } : x) })); markDirty(); };

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

        {/* ─── Rappels de paiement automatiques ─────────────────── */}
        <ParamCard
          title="Rappels de paiement automatiques"
          icon={<Icon.Bell size={14}/>}
          sub="E-mails envoyés automatiquement aux exposants selon l'échéance de leur règlement"
          actions={
            <button className="btn btn-outline btn-sm" onClick={markDirty}>
              <Icon.Plus size={13}/> Ajouter un rappel
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {salonRappels.map(r => (
              <RappelRow key={r.id} rappel={r} onUpdate={updateRappel}/>
            ))}
            {salonRappels.length === 0 && (
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', textAlign: 'center', padding: '16px 0' }}>
                Aucun rappel configuré pour ce salon.
              </div>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon.Info size={12} style={{ flexShrink: 0 }}/>
            Les délais sont calculés à partir de la date de début du salon. J − 0 = le jour même du salon.
          </div>
        </ParamCard>

        {/* ─── Options de communication ─────────────────────────── */}
        <ParamCard
          title="Options de communication"
          icon={<Icon.Send size={14}/>}
          sub="Supports de communication proposés aux exposants lors de leur inscription — prix et visuels configurables"
          actions={
            <button className="btn btn-outline btn-sm" onClick={markDirty}>
              <Icon.Plus size={13}/> Ajouter une option
            </button>
          }
        >
          {salonComm.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', textAlign: 'center', padding: '20px 0' }}>
              Aucune option de communication pour ce salon.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {salonComm.map(opt => (
                <CommOptionCard key={opt.id} opt={opt} onUpdate={updateComm}/>
              ))}
            </div>
          )}
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon.Info size={12} style={{ flexShrink: 0 }}/>
            Les options désactivées ne sont pas affichées aux exposants lors de l'inscription.
          </div>
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

// ─── Mon compte (admin) ───────────────────────────────────────────

const MY_NOTIF_DEFAULTS = {
  ins_soumise: true, ins_validee: false, ins_refusee: true,
  pay_cb: true, pay_virement: true, pay_retard: true, pay_cheque: false,
  dero_nouvelle: true, dero_traitee: false,
  deg_inscrit: false, deg_dispo: false,
  sal_inscrit: true, sal_paiement: false,
  sys_api: true, sys_backup: true,
};

const AdminMonCompte = () => {
  const [tab, setTab] = React.useState('profil');
  const [notifs, setNotifs] = React.useState(MY_NOTIF_DEFAULTS);
  const [dirtyNotifs, setDirtyNotifs] = React.useState(false);
  const [savedNotifs, setSavedNotifs] = React.useState(false);

  const toggleNotif = (id) => {
    setNotifs(n => ({ ...n, [id]: !n[id] }));
    setDirtyNotifs(true);
    setSavedNotifs(false);
  };
  const setAllNotifs = (val) => {
    setNotifs(Object.fromEntries(Object.keys(MY_NOTIF_DEFAULTS).map(k => [k, val])));
    setDirtyNotifs(true);
    setSavedNotifs(false);
  };
  const saveNotifs = () => { setDirtyNotifs(false); setSavedNotifs(true); };

  const countOn = Object.values(notifs).filter(Boolean).length;
  const total   = Object.keys(notifs).length;

  const catIconMap = { FileText: <Icon.FileText size={14}/>, Euro: <Icon.Euro size={14}/>, ShieldCheck: <Icon.ShieldCheck size={14}/>, Users: <Icon.Users size={14}/>, Building: <Icon.Building size={14}/>, Settings: <Icon.Settings size={14}/> };

  const tabs = [
    { id: 'profil',        label: 'Profil' },
    { id: 'notifications', label: 'Notifications', badge: countOn },
    { id: 'securite',      label: 'Sécurité' },
  ];

  return (
    <div data-screen-label="admin-compte">
      <PageHeader
        breadcrumb={['Administration', 'Mon compte']}
        title="Mon compte"
        subtitle="Sophie Lambert · Administratrice"
        icon={<Icon.User size={22}/>}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13.5, fontWeight: tab === t.id ? 600 : 400,
            color: tab === t.id ? 'var(--burgundy-800)' : 'var(--fg-muted)',
            borderBottom: `2px solid ${tab === t.id ? 'var(--burgundy-800)' : 'transparent'}`,
            marginBottom: -1, transition: 'all .1s',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            {t.label}
            {t.id === 'notifications' && (
              <span style={{ minWidth: 18, height: 18, borderRadius: 999, background: tab === t.id ? 'var(--burgundy-800)' : 'var(--border)', color: tab === t.id ? '#fff' : 'var(--fg-muted)', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>{countOn}</span>
            )}
          </button>
        ))}
      </div>

      {/* Onglet Profil */}
      {tab === 'profil' && (
        <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 18 }}>Informations personnelles</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field"><label className="field-label">Prénom</label><input className="input" defaultValue="Sophie"/></div>
                <div className="field"><label className="field-label">Nom</label><input className="input" defaultValue="Lambert"/></div>
              </div>
              <div className="field"><label className="field-label">Adresse e-mail</label><input className="input" type="email" defaultValue="sophie@vins-macon.fr"/></div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary btn-sm" style={{ background: 'var(--burgundy-800)' }}><Icon.Check size={13}/> Enregistrer</button>
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>Rôle</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <span style={{ padding: '3px 10px', borderRadius: 4, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', fontSize: 12, fontWeight: 600 }}>Super admin</span>
              <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>Tous droits, gestion utilisateurs incluse</span>
            </div>
          </div>
        </div>
      )}

      {/* Onglet Notifications */}
      {tab === 'notifications' && (
        <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* En-tête */}
          <div className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>Mes alertes e-mail</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>{countOn} alerte{countOn > 1 ? 's' : ''} activée{countOn > 1 ? 's' : ''} sur {total}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button className="btn btn-outline btn-sm" onClick={() => setAllNotifs(true)}>Tout activer</button>
              <button className="btn btn-outline btn-sm" onClick={() => setAllNotifs(false)}>Tout désactiver</button>
              {dirtyNotifs && (
                <button className="btn btn-primary btn-sm" onClick={saveNotifs} style={{ background: 'var(--burgundy-800)' }}>
                  <Icon.Check size={13}/> Enregistrer
                </button>
              )}
              {savedNotifs && !dirtyNotifs && (
                <span style={{ fontSize: 12.5, color: '#166534', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon.Check size={13}/> Sauvegardé
                </span>
              )}
            </div>
          </div>

          {NOTIF_CATEGORIES.map(cat => {
            const catCount = cat.items.filter(i => notifs[i.id]).length;
            return (
              <div key={cat.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '11px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: 'var(--burgundy-800)' }}>{catIconMap[cat.icon]}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{cat.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--fg-muted)', marginLeft: 'auto' }}>{catCount} / {cat.items.length}</span>
                </div>
                <div style={{ padding: '4px 0' }}>
                  {cat.items.map((item, i) => (
                    <div key={item.id} style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '11px 20px',
                      borderBottom: i < cat.items.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{item.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{item.desc}</div>
                      </div>
                      <NotifToggle checked={!!notifs[item.id]} onChange={() => toggleNotif(item.id)}/>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Onglet Sécurité */}
      {tab === 'securite' && (
        <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 18 }}>Changer le mot de passe</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="field"><label className="field-label">Mot de passe actuel</label><input className="input" type="password" placeholder="••••••••"/></div>
              <div className="field"><label className="field-label">Nouveau mot de passe</label><input className="input" type="password" placeholder="••••••••"/></div>
              <div className="field"><label className="field-label">Confirmer le nouveau mot de passe</label><input className="input" type="password" placeholder="••••••••"/></div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary btn-sm" style={{ background: 'var(--burgundy-800)' }}><Icon.Check size={13}/> Changer le mot de passe</button>
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Sessions actives</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 14 }}>Appareil actuel et dernières connexions</div>
            {[
              { device: 'MacBook Pro · Chrome 125', ip: '89.234.12.45', date: "Aujourd'hui à 14h32", current: true },
              { device: 'iPhone 15 · Safari',       ip: '89.234.12.45', date: 'Hier à 09h15',        current: false },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i === 0 ? '1px solid var(--border)' : 'none' }}>
                <Icon.Globe size={16} style={{ color: 'var(--fg-muted)', flexShrink: 0 }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{s.device}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{s.ip} · {s.date}</div>
                </div>
                {s.current
                  ? <span style={{ fontSize: 11.5, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>Session actuelle</span>
                  : <button className="btn btn-outline btn-sm" style={{ color: '#dc2626', borderColor: '#fecaca', fontSize: 12 }}>Révoquer</button>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Barème commandes médailles ───────────────────────────────────

const BAREME_EDITIONS = [
  { id: 'france-2026', label: 'Concours des Grands Vins de France 2026' },
  { id: 'monde-2026',  label: 'Concours des Grands Vins du Monde 2026' },
  { id: 'france-2025', label: 'Concours des Grands Vins de France 2025', archive: true },
];

const BAREME_DEFAULTS = {
  'france-2026': { or: 500, argent: 300, bronze: 150, mention: 100 },
  'monde-2026':  { or: 400, argent: 250, bronze: 120, mention: 80  },
  'france-2025': { or: 480, argent: 280, bronze: 140, mention: 90  },
};

const RANGS_BAREME = [
  { key: 'or',      label: 'Or',              dotColor: '#d4a017',  bgColor: '#fef9ec', fgColor: '#92400e' },
  { key: 'argent',  label: 'Argent',           dotColor: '#94a3b8',  bgColor: '#f1f5f9', fgColor: '#475569' },
  { key: 'bronze',  label: 'Bronze',           dotColor: '#c2410c',  bgColor: '#fef3c7', fgColor: '#a16207' },
  { key: 'mention', label: 'Mention spéciale', dotColor: '#6b7280',  bgColor: '#f9fafb', fgColor: '#374151' },
];

const AdminParamBareme = () => {
  const [editionId, setEditionId]   = React.useState('france-2026');
  const [marge, setMarge]           = React.useState(3);
  const [baremes, setBaremes]       = React.useState(JSON.parse(JSON.stringify(BAREME_DEFAULTS)));
  const [dirty, setDirty]           = React.useState(false);
  const [copySource, setCopySource] = React.useState('france-2025');
  const [saved, setSaved]           = React.useState(false);

  const markDirty = () => setDirty(true);

  const currentBareme = baremes[editionId] || { or: 0, argent: 0, bronze: 0, mention: 0 };

  const withMarge = (v) => Math.ceil(v * (1 + marge / 100));

  const updateQuota = (rang, val) => {
    const n = Math.max(0, parseInt(val, 10) || 0);
    setBaremes(b => ({ ...b, [editionId]: { ...b[editionId], [rang]: n } }));
    markDirty();
  };

  const handleCopy = () => {
    const src = baremes[copySource];
    if (!src) return;
    setBaremes(b => ({ ...b, [editionId]: { ...src } }));
    markDirty();
  };

  const handleSave = () => {
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // SalonPicker custom inline pour ce composant (reprend le style EditionPicker local)
  const EditionPickerBareme = ({ value, onChange }) => {
    const [open, setOpen] = React.useState(false);
    const current = BAREME_EDITIONS.find(e => e.id === value);
    return (
      <div style={{ position: 'relative' }}>
        <button onClick={() => setOpen(o => !o)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', fontSize: 14, fontWeight: 500,
          border: '1px solid var(--border)', borderRadius: 8,
          background: 'var(--surface)', color: 'var(--fg)',
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
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
              minWidth: 340, zIndex: 60, overflow: 'hidden',
            }}>
              {BAREME_EDITIONS.map(e => (
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

  return (
    <div data-screen-label="admin-param-bareme">
      <PageHeader
        breadcrumb={['Administration', 'Paramètres', 'Barème commandes médailles']}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span>Barème commandes médailles</span>
            <EditionPickerBareme value={editionId} onChange={setEditionId}/>
          </div>
        }
        subtitle="Quotas maximaux par rang de médaille — sert de base au calcul de la quantité commandable"
        actions={dirty && (
          <button className="btn btn-primary btn-sm" onClick={handleSave}
            style={{ background: 'var(--burgundy-800)' }}>
            {saved ? <><Icon.Check size={13}/> Enregistré</> : <><Icon.Save size={13}/> Enregistrer</>}
          </button>
        )}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 860 }}>

        {/* Règle de calcul */}
        <ParamCard title="Règle de calcul" icon={<Icon.Info size={14}/>} sub="Comment le quota commandable est calculé à partir du barème">
          <ParamRow
            label="Marge autorisée"
            hint="Pourcentage ajouté au-dessus du barème de base pour absorber la casse et les erreurs de tri."
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="number" min={0} max={20} value={marge}
                className="input tnum"
                onChange={e => { setMarge(Math.max(0, Math.min(20, parseInt(e.target.value) || 0))); markDirty(); }}
                style={{ width: 80, textAlign: 'center' }}
              />
              <span style={{ fontSize: 13.5, color: 'var(--fg-muted)' }}>%</span>
              <span style={{ fontSize: 12, color: 'var(--fg-muted)', marginLeft: 8 }}>
                Exemple : barème Or {currentBareme.or} → quota commandable{' '}
                <strong style={{ color: 'var(--burgundy-800)', fontVariantNumeric: 'tabular-nums' }}>{withMarge(currentBareme.or)}</strong> médailles
              </span>
            </div>
          </ParamRow>
          <ParamRow
            label="Formule"
            hint="Arrondi à l'entier supérieur (⌈ ⌉) pour éviter les demi-médailles."
          >
            <div style={{
              fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
              fontSize: 13, background: 'var(--slate-50)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '10px 14px', color: 'var(--fg)', lineHeight: 1.6,
            }}>
              quota_max = ⌈ barème[rang] × {marge > 0 ? (1 + marge / 100).toFixed(2) : '1.00'} ⌉ <span style={{ color: 'var(--fg-muted)' }}>par vin médaillé et par édition</span>
            </div>
          </ParamRow>
        </ParamCard>

        {/* Quotas par rang */}
        <ParamCard title="Quotas par rang" icon={<Icon.Medal size={14}/>} sub="Quotas de base pour l'édition sélectionnée — éditables par concours/année">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Rang', 'Quota de base', 'Avec marge (' + marge + ' %)', ''].map((h, i) => (
                    <th key={i} style={{ padding: '8px 14px', textAlign: i > 0 ? 'right' : 'left', fontSize: 11.5, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RANGS_BAREME.map(rang => {
                  const base = currentBareme[rang.key] || 0;
                  const avecMarge = withMarge(base);
                  return (
                    <tr key={rang.key} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 10, height: 10, borderRadius: 999, background: rang.dotColor, flexShrink: 0 }}/>
                          <span style={{
                            fontSize: 12.5, fontWeight: 600,
                            padding: '2px 9px', borderRadius: 99,
                            background: rang.bgColor, color: rang.fgColor,
                          }}>{rang.label}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                        <input
                          type="number" min={0} value={base}
                          className="input tnum"
                          onChange={e => updateQuota(rang.key, e.target.value)}
                          style={{ width: 100, textAlign: 'center' }}
                        />
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                        <span className="tnum" style={{ fontSize: 14, fontWeight: 700, color: 'var(--burgundy-800)' }}>
                          {avecMarge.toLocaleString('fr-FR')}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 11.5, color: 'var(--fg-muted)' }}>
                        {avecMarge > base && <>+ {(avecMarge - base)} médailles</>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ParamCard>

        {/* Réutiliser un barème */}
        <ParamCard title="Réutiliser un barème" icon={<Icon.Copy size={14}/>} sub="Copier les quotas de base d'une édition passée vers l'édition sélectionnée">
          <ParamRow label="Copier depuis" hint="Les quotas de base seront remplacés. La marge ne change pas.">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                className="input"
                value={copySource}
                onChange={e => setCopySource(e.target.value)}
                style={{ minWidth: 300 }}
              >
                {BAREME_EDITIONS.filter(e => e.id !== editionId).map(e => (
                  <option key={e.id} value={e.id}>{e.label}{e.archive ? ' (archive)' : ''}</option>
                ))}
              </select>
              <button className="btn btn-outline btn-sm" onClick={handleCopy}>
                <Icon.Copy size={13}/> Copier vers {BAREME_EDITIONS.find(e => e.id === editionId)?.label || editionId}
              </button>
            </div>
          </ParamRow>
        </ParamCard>

      </div>
    </div>
  );
};

Object.assign(window, {
  AdminParamConcours,
  AdminParamDerogations,
  AdminParamAppellations,
  AdminParamFournisseurs,
  AdminParamEmails,
  AdminParamAPI,
  AdminParamUtilisateurs,
  AdminParamNotifications,
  AdminParamPaiements,
  AdminParamSalons,
  AdminMonCompte,
  AdminParamBareme,
});
