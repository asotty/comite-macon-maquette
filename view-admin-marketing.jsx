// ─── Marketing cross-portails — BO de gestion des offres ────────────────────

const PORTAL_LABELS = { producteur: 'Producteur', degustateur: 'Dégustateur', exposant: 'Exposant' };
const PORTAL_COLORS = { producteur: 'var(--burgundy-700)', degustateur: '#0c4a6e', exposant: '#166534' };

const COLOR_PRESETS = [
  { label: 'Bourgogne', value: 'var(--burgundy-700)', light: 'var(--burgundy-50)', border: 'var(--burgundy-200)' },
  { label: 'Ambre',     value: '#92400e',              light: '#fef9ec',            border: '#fde68a'            },
  { label: 'Marine',    value: '#0c4a6e',              light: '#f0f9ff',            border: '#bae6fd'            },
  { label: 'Vert',      value: '#166534',              light: '#f0fdf4',            border: '#bbf7d0'            },
  { label: 'Violet',    value: '#4c1d95',              light: '#f5f3ff',            border: '#ddd6fe'            },
];

const ICON_OPTIONS = ['Building', 'ShoppingCart', 'Award', 'Layers', 'Trophy', 'Globe', 'Star', 'Medal', 'Users', 'Calendar'];

// ── Modale création / édition d'une offre ───────────────────────────────────
const BADGE_COLOR_PRESETS = [
  { label: 'Ambre',  value: '#d97706' },
  { label: 'Rouge',  value: '#dc2626' },
  { label: 'Bleu',   value: '#0284c7' },
  { label: 'Vert',   value: '#15803d' },
  { label: 'Violet', value: '#7c3aed' },
];

const OfferFormModal = ({ offer, onSave, onClose }) => {
  const findPreset = (color) => COLOR_PRESETS.find(c => c.value === color) || COLOR_PRESETS[0];

  const [form, setForm] = React.useState({
    title:       offer?.title    || '',
    subtitle:    offer?.subtitle || '',
    desc:        offer?.desc     || '',
    portals:     offer?.portals  || ['producteur'],
    type:        offer?.type     || 'salon',
    icon:        offer?.icon     || 'Building',
    colorPreset: offer ? findPreset(offer.color) : COLOR_PRESETS[0],
    cta:         offer?.cta      || 'En savoir plus',
    badge:       offer?.badge    || '',
    badgeColor:  offer?.badgeColor || '#d97706',
    endDate:     offer?.endDate  || '',
    active:      offer?.active !== undefined ? offer.active : true,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const togglePortal = (p) => set('portals', form.portals.includes(p)
    ? form.portals.filter(x => x !== p)
    : [...form.portals, p]);

  const handleSave = () => {
    if (!form.title.trim() || !form.portals.length) return;
    const cp = form.colorPreset;
    onSave({ ...form, color: cp.value, colorLight: cp.light, colorBorder: cp.border });
  };

  const cp = form.colorPreset;
  const OfferIconEl = Icon[form.icon] || Icon.Star;

  const Lbl = ({ children, note }) => (
    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-muted)', marginBottom: 6 }}>
      {children}
      {note && <span style={{ fontWeight: 400, color: 'var(--fg-subtle)', marginLeft: 5, fontSize: 11 }}>{note}</span>}
    </div>
  );

  const SectionHead = ({ children }) => (
    <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
      {children}
    </div>
  );

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(15,23,42,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
      animation: 'fadeIn .15s ease-out',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface)', borderRadius: 14, boxShadow: 'var(--shadow-lg)',
        width: '100%', maxWidth: 600,
        maxHeight: '92vh',
        display: 'flex', flexDirection: 'column',
        animation: 'modalIn .2s ease-out',
      }}>

        {/* ── Header fixe ──────────────────────────────────────────── */}
        <div style={{ padding: '18px 22px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 11, flexShrink: 0,
            background: cp.value, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background .2s',
            boxShadow: `0 2px 10px ${cp.value}55`,
          }}>
            <OfferIconEl size={20}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="display" style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em' }}>
              {offer ? 'Modifier l\'offre' : 'Nouvelle offre'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {form.title || <span style={{ fontStyle: 'italic', color: 'var(--fg-subtle)' }}>Titre de l'offre…</span>}
            </div>
          </div>
          <button onClick={onClose} className="btn btn-icon" style={{ color: 'var(--fg-muted)', flexShrink: 0 }}>
            <Icon.X size={16}/>
          </button>
        </div>

        {/* ── Body scrollable ──────────────────────────────────────── */}
        <div style={{ padding: '16px 22px 8px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Contenu */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 14px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <Lbl>Titre *</Lbl>
              <input className="input" value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="ex : Salon des Vins de Mâcon 2026"/>
            </div>
            <div>
              <Lbl note="optionnel">Sous-titre</Lbl>
              <input className="input" value={form.subtitle} onChange={e => set('subtitle', e.target.value)}
                placeholder="Espace exposant · nov. 2026"/>
            </div>
            <div>
              <Lbl>Bouton (CTA)</Lbl>
              <input className="input" value={form.cta} onChange={e => set('cta', e.target.value)}
                placeholder="Réserver un stand"/>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <Lbl note="optionnel">Description</Lbl>
              <textarea className="textarea" value={form.desc} onChange={e => set('desc', e.target.value)}
                rows={2} placeholder="Quelques mots sur l'offre…" style={{ minHeight: 'unset', resize: 'none' }}/>
            </div>
          </div>

          {/* Apparence */}
          <SectionHead>Apparence</SectionHead>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
            <div>
              <Lbl>Icône</Lbl>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
                {ICON_OPTIONS.map(name => {
                  const Ic = Icon[name]; if (!Ic) return null;
                  const sel = form.icon === name;
                  return (
                    <button key={name} onClick={() => set('icon', name)} title={name} style={{
                      width: 36, height: 36, borderRadius: 8, cursor: 'pointer',
                      border: `1.5px solid ${sel ? cp.value : 'var(--border)'}`,
                      background: sel ? cp.light : 'var(--surface)',
                      color: sel ? cp.value : 'var(--fg-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all .1s',
                    }}>
                      <Ic size={16}/>
                    </button>
                  );
                })}
              </div>
              <Lbl>Couleur de la carte</Lbl>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {COLOR_PRESETS.map(preset => {
                  const sel = form.colorPreset.label === preset.label;
                  return (
                    <button key={preset.label} onClick={() => set('colorPreset', preset)} style={{
                      height: 30, paddingInline: 10, borderRadius: 8, cursor: 'pointer',
                      border: `1.5px solid ${sel ? preset.value : 'var(--border)'}`,
                      background: sel ? preset.light : 'var(--surface)',
                      display: 'flex', alignItems: 'center', gap: 6,
                      transition: 'all .1s',
                    }}>
                      <div style={{ width: 9, height: 9, borderRadius: '50%', background: preset.value, flexShrink: 0 }}/>
                      <span style={{ fontSize: 12, fontWeight: sel ? 600 : 400, color: sel ? preset.value : 'var(--fg-muted)' }}>
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mini card preview */}
            <div style={{ width: 128, flexShrink: 0, paddingTop: 18 }}>
              <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--surface)' }}>
                <div style={{ background: cp.light, borderBottom: `1px solid ${cp.border}`, padding: '9px 11px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: cp.value, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <OfferIconEl size={12}/>
                  </div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.3, flex: 1, minWidth: 0 }}>
                    {form.title || <span style={{ color: 'var(--fg-subtle)', fontStyle: 'italic' }}>Titre</span>}
                  </div>
                </div>
                <div style={{ padding: '7px 11px 10px' }}>
                  <div style={{ fontSize: 9.5, color: cp.value, fontWeight: 500, marginBottom: 3 }}>
                    {form.subtitle || '—'}
                  </div>
                  <div style={{ fontSize: 9.5, color: 'var(--fg-muted)', lineHeight: 1.4, marginBottom: 8, minHeight: 24 }}>
                    {form.desc || <span style={{ fontStyle: 'italic' }}>…</span>}
                  </div>
                  <div style={{ background: cp.light, color: cp.value, border: `1px solid ${cp.border}`, borderRadius: 5, padding: '3px 6px', fontSize: 9.5, fontWeight: 500, textAlign: 'center' }}>
                    {form.cta}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badge & Promo */}
          <SectionHead>Badge & Promo</SectionHead>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 14px' }}>
            <div>
              <Lbl note="optionnel">Texte du badge</Lbl>
              <input className="input" value={form.badge} onChange={e => set('badge', e.target.value)}
                placeholder="-20% · Candidatures ouvertes…"/>
              {form.badge && (
                <div style={{ marginTop: 7 }}>
                  <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: form.badgeColor + '1a', color: form.badgeColor, border: `1px solid ${form.badgeColor}33` }}>
                    {form.badge}
                  </span>
                </div>
              )}
            </div>
            <div>
              <Lbl note="optionnel · affiche J−X dans les 30 derniers jours">Date de fin</Lbl>
              <input className="input" type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)}/>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <Lbl>Couleur du badge</Lbl>
              <div style={{ display: 'flex', gap: 6 }}>
                {BADGE_COLOR_PRESETS.map(bp => {
                  const sel = form.badgeColor === bp.value;
                  return (
                    <button key={bp.value} onClick={() => set('badgeColor', bp.value)} style={{
                      height: 28, paddingInline: 10, borderRadius: 7, cursor: 'pointer',
                      border: `1.5px solid ${sel ? bp.value : 'var(--border)'}`,
                      background: sel ? bp.value + '18' : 'var(--surface)',
                      display: 'flex', alignItems: 'center', gap: 5,
                      transition: 'all .1s',
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: bp.value }}/>
                      <span style={{ fontSize: 11.5, fontWeight: sel ? 600 : 400, color: sel ? bp.value : 'var(--fg-muted)' }}>
                        {bp.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Diffusion */}
          <SectionHead>Diffusion</SectionHead>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 8 }}>
            <div>
              <Lbl>Portails ciblés *</Lbl>
              <div style={{ display: 'flex', gap: 7 }}>
                {Object.entries(PORTAL_LABELS).map(([id, label]) => {
                  const sel = form.portals.includes(id);
                  return (
                    <button key={id} onClick={() => togglePortal(id)} style={{
                      height: 34, paddingInline: 16, borderRadius: 8, cursor: 'pointer',
                      border: `1.5px solid ${sel ? PORTAL_COLORS[id] : 'var(--border)'}`,
                      background: sel ? PORTAL_COLORS[id] + '14' : 'var(--surface)',
                      color: sel ? PORTAL_COLORS[id] : 'var(--fg-muted)',
                      fontSize: 13, fontWeight: sel ? 600 : 400,
                      transition: 'all .1s',
                    }}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Toggle on={form.active} onChange={() => set('active', !form.active)}/>
              <span style={{ fontSize: 13, fontWeight: 500, color: form.active ? 'var(--fg)' : 'var(--fg-muted)' }}>
                {form.active ? 'Offre active — visible sur les portails ciblés' : 'Offre inactive — non affichée'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Footer fixe ──────────────────────────────────────────── */}
        <div style={{ padding: '12px 22px 18px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8, flexShrink: 0 }}>
          <button onClick={onClose} className="btn btn-outline">Annuler</button>
          <button onClick={handleSave} className="btn btn-primary" disabled={!form.title.trim() || !form.portals.length}>
            {offer ? 'Enregistrer les modifications' : 'Créer l\'offre'} <Icon.Check size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Toggle switch réutilisable ────────────────────────────────────────────────
const Toggle = ({ on, onChange }) => (
  <div onClick={onChange} style={{
    width: 34, height: 20, borderRadius: 10, cursor: 'pointer', position: 'relative',
    background: on ? 'var(--burgundy-700)' : 'var(--slate-300)',
    transition: 'background .15s', flexShrink: 0,
  }}>
    <div style={{
      position: 'absolute', top: 3, left: on ? 17 : 3,
      width: 14, height: 14, borderRadius: '50%', background: '#fff',
      transition: 'left .15s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
    }}/>
  </div>
);

// ── Vue principale ────────────────────────────────────────────────────────────
const AdminMarketing = () => {
  const [offers, setOffers] = React.useState([...CROSS_OFFERS]);
  const [editing, setEditing]   = React.useState(null);
  const [showForm, setShowForm] = React.useState(false);
  const [previewPortal, setPreviewPortal] = React.useState('producteur');
  const [deleteConfirm, setDeleteConfirm] = React.useState(null);

  const toggleActive = (id) =>
    setOffers(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o));

  const deleteOffer = (id) => {
    setOffers(prev => prev.filter(o => o.id !== id));
    setDeleteConfirm(null);
  };

  const saveOffer = (data) => {
    if (editing?.id) {
      setOffers(prev => prev.map(o => o.id === editing.id ? { ...o, ...data } : o));
    } else {
      const newId = 'offer-' + offers.length + '-' + Math.floor(Math.random() * 1000);
      setOffers(prev => [...prev, { ...data, id: newId }]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const openEdit = (offer) => { setEditing(offer); setShowForm(true); };
  const openNew  = () => { setEditing(null); setShowForm(true); };

  const activeCount   = offers.filter(o => o.active).length;
  const allPortals    = new Set(offers.filter(o => o.active).flatMap(o => o.portals));
  const promoCount    = offers.filter(o => o.active && o.badge).length;

  // Offres filtrées pour la preview (state local, pas CROSS_OFFERS global)
  const previewOffers = offers.filter(o => o.active && o.portals.includes(previewPortal));

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto' }}>
      <PageHeader
        title="Marketing cross-portails"
        sub="Gérez les offres et promotions affichées en bas de chaque espace utilisateur"
        icon={<Icon.Sparkles size={26}/>}
        breadcrumb={['Administration', 'Marketing']}
        actions={[
          <button key="new" className="btn btn-primary" onClick={openNew}>
            <Icon.Plus size={14}/> Nouvelle offre
          </button>
        ]}
      />

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        <KpiCard label="Offres actives" value={activeCount} sub={`sur ${offers.length} configurées`} icon={<Icon.CheckCircle size={18}/>}/>
        <KpiCard label="Portails ciblés" value={allPortals.size} sub="par les offres actives" icon={<Icon.Users size={18}/>}/>
        <KpiCard label="Avec badge promo" value={promoCount} sub="offres avec mise en avant" icon={<Icon.Star size={18}/>}/>
      </div>

      {/* Table des offres */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Offres configurées</div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>{offers.length} offres · {activeCount} actives</div>
        </div>

        {offers.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--fg-muted)' }}>
            <Icon.Sparkles size={32} style={{ opacity: 0.3, marginBottom: 12 }}/>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Aucune offre configurée</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Créez votre première offre pour l'afficher sur les espaces utilisateurs.</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                {['Actif', 'Offre', 'Portails ciblés', 'Badge / Promo', 'Fin promo', ''].map((h, i) => (
                  <th key={i} style={{
                    padding: '9px 16px', textAlign: i === 5 ? 'right' : 'left',
                    fontSize: 11.5, color: 'var(--fg-muted)', fontWeight: 500,
                    width: i === 0 ? 56 : i === 5 ? 80 : 'auto',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {offers.map(offer => {
                const OfferIcon = Icon[offer.icon] || Icon.Star;
                return (
                  <tr key={offer.id} style={{ borderBottom: '1px solid var(--border)', opacity: offer.active ? 1 : 0.5 }}>
                    <td style={{ padding: '13px 16px' }}>
                      <Toggle on={offer.active} onChange={() => toggleActive(offer.id)}/>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: offer.color, color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <OfferIcon size={15}/>
                        </div>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg)' }}>{offer.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 1 }}>{offer.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {offer.portals.map(p => (
                          <span key={p} style={{
                            fontSize: 10.5, fontWeight: 500, padding: '2px 7px', borderRadius: 999,
                            background: PORTAL_COLORS[p] + '15', color: PORTAL_COLORS[p],
                            border: `1px solid ${PORTAL_COLORS[p]}33`,
                          }}>{PORTAL_LABELS[p] || p}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      {offer.badge ? (
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                          background: offer.badgeColor + '1a', color: offer.badgeColor,
                          border: `1px solid ${offer.badgeColor}33`,
                        }}>{offer.badge}</span>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 12.5, color: offer.endDate ? 'var(--fg-muted)' : 'var(--fg-subtle)' }}>
                      {offer.endDate || '—'}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                        <button className="btn btn-icon btn-sm" style={{ color: 'var(--fg-muted)' }}
                          onClick={() => openEdit(offer)} title="Modifier">
                          <Icon.Edit size={14}/>
                        </button>
                        <button className="btn btn-icon btn-sm" style={{ color: 'var(--danger)' }}
                          onClick={() => setDeleteConfirm(offer.id)} title="Supprimer">
                          <Icon.Trash size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Aperçu en situation */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon.Eye size={16} style={{ color: 'var(--fg-muted)' }}/>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>Aperçu en situation</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {Object.entries(PORTAL_LABELS).map(([id, label]) => (
              <button key={id} onClick={() => setPreviewPortal(id)} style={{
                padding: '4px 12px', fontSize: 12, fontWeight: 500, borderRadius: 6,
                cursor: 'pointer', border: `1px solid ${previewPortal === id ? PORTAL_COLORS[id] : 'var(--border)'}`,
                background: previewPortal === id ? PORTAL_COLORS[id] : 'transparent',
                color: previewPortal === id ? '#fff' : 'var(--fg-muted)',
                transition: 'all .12s',
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--surface-2)', minHeight: 120 }}>
          {previewOffers.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--fg-subtle)', fontSize: 13 }}>
              Aucune offre active ciblant le portail {PORTAL_LABELS[previewPortal]}.
            </div>
          ) : (
            // Aperçu local (utilise offers state, pas CROSS_OFFERS global)
            <div style={{ padding: '8px 24px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, marginTop: 8 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--fg-muted)' }}>
                  <Icon.Sparkles size={12}/>
                  <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    À découvrir aussi
                  </span>
                </div>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${previewOffers.length}, 1fr)`, gap: 12 }}>
                {previewOffers.map(offer => {
                  const OfferIcon = Icon[offer.icon] || Icon.Star;
                  return (
                    <div key={offer.id} style={{
                      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
                      overflow: 'hidden', display: 'flex', flexDirection: 'column',
                    }}>
                      <div style={{ background: offer.colorLight, borderBottom: `1px solid ${offer.colorBorder}`, padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: offer.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <OfferIcon size={15}/>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {offer.badge && <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 999, marginBottom: 3, background: offer.badgeColor + '1a', color: offer.badgeColor, border: `1px solid ${offer.badgeColor}33` }}>{offer.badge}</span>}
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.3 }}>{offer.title}</div>
                        </div>
                      </div>
                      <div style={{ padding: '10px 14px', flex: 1 }}>
                        <div style={{ fontSize: 11, color: offer.color, fontWeight: 500, marginBottom: 3 }}>{offer.subtitle}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', lineHeight: 1.45 }}>{offer.desc}</div>
                      </div>
                      <div style={{ padding: '4px 14px 12px' }}>
                        <button className="btn btn-sm" style={{ width: '100%', background: offer.colorLight, color: offer.color, border: `1px solid ${offer.colorBorder}`, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                          {offer.cta} <Icon.ArrowRight size={11}/>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modale création / édition */}
      {showForm && <OfferFormModal offer={editing} onSave={saveOffer} onClose={() => { setShowForm(false); setEditing(null); }}/>}

      {/* Confirmation suppression */}
      {deleteConfirm && (
        <div onClick={() => setDeleteConfirm(null)} style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(15,23,42,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--surface)', borderRadius: 14, boxShadow: 'var(--shadow-lg)',
            padding: 28, maxWidth: 380, width: '100%', textAlign: 'center',
          }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icon.Trash size={20}/>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Supprimer cette offre ?</div>
            <div style={{ fontSize: 13.5, color: 'var(--fg-muted)', marginBottom: 24, lineHeight: 1.5 }}>
              L'offre sera retirée de tous les portails ciblés. Cette action est irréversible.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)}>Annuler</button>
              <button className="btn btn-primary" style={{ background: '#dc2626', borderColor: '#dc2626' }}
                onClick={() => deleteOffer(deleteConfirm)}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { AdminMarketing });
