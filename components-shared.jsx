// =====================================================================
// Reusable table helpers — sortable headers + pagination footer
// =====================================================================

// Hook combiné : tri + pagination
// rows: tableau complet · cfg: { defaultSort: 'colKey', defaultDir: 'asc', defaultPageSize: 10, accessors: { col: r => value } }
function useSortablePaged(rows, cfg = {}) {
  const [sortKey, setSortKey] = React.useState(cfg.defaultSort || null);
  const [sortDir, setSortDir] = React.useState(cfg.defaultDir || 'asc');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(cfg.defaultPageSize || 10);

  // Reset à la page 1 quand on change de tri ou de taille
  React.useEffect(() => { setPage(1); }, [sortKey, sortDir, pageSize]);

  const sorted = React.useMemo(() => {
    if (!sortKey || !cfg.accessors || !cfg.accessors[sortKey]) return rows;
    const acc = cfg.accessors[sortKey];
    const sign = sortDir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = acc(a), vb = acc(b);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * sign;
      return String(va).localeCompare(String(vb), 'fr', { numeric: true }) * sign;
    });
  }, [rows, sortKey, sortDir, cfg.accessors]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const onSort = (key) => {
    if (sortKey === key) {
      // cycle asc → desc → off
      if (sortDir === 'asc') setSortDir('desc');
      else { setSortKey(null); setSortDir('asc'); }
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return { rows: paged, total, totalPages, page: safePage, setPage, pageSize, setPageSize, sortKey, sortDir, onSort };
}

// Cellule d'en-tête triable — props : sortKey, currentKey, currentDir, onSort, align, children
const SortableTh = ({ sortKey, currentKey, currentDir, onSort, align, children, style }) => {
  const isActive = currentKey === sortKey;
  return (
    <th style={{ cursor: 'pointer', userSelect: 'none', textAlign: align || 'left', ...style }} onClick={() => onSort(sortKey)}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        color: isActive ? 'var(--burgundy-800)' : 'inherit',
      }}>
        {children}
        <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 0.5, opacity: isActive ? 1 : 0.4 }}>
          <svg width="9" height="5" viewBox="0 0 9 5" fill={isActive && currentDir === 'asc' ? 'var(--burgundy-800)' : 'currentColor'} style={{ marginBottom: 1 }}>
            <path d="M4.5 0L9 5H0z"/>
          </svg>
          <svg width="9" height="5" viewBox="0 0 9 5" fill={isActive && currentDir === 'desc' ? 'var(--burgundy-800)' : 'currentColor'}>
            <path d="M4.5 5L0 0h9z"/>
          </svg>
        </span>
      </span>
    </th>
  );
};

// Pied de tableau — sélecteur taille + pagination
const TablePagination = ({ page, totalPages, pageSize, setPageSize, setPage, sizes = [10, 25, 50, 100], leftSlot }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 14,
    fontSize: 13, color: 'var(--fg-muted)',
    flexWrap: 'wrap', gap: 12,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {leftSlot}
      <span>Afficher</span>
      <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="select" style={{
        width: 62, height: 30, padding: '0 22px 0 10px', fontSize: 13,
      }}>
        {sizes.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <span>par page</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="btn btn-icon btn-sm btn-outline" style={{ width: 30, height: 30 }}>
        <Icon.ChevronLeft size={14}/>
      </button>
      <span className="tnum" style={{ minWidth: 70, textAlign: 'center', color: 'var(--fg)' }}>
        Page {page} <span style={{ color: 'var(--fg-subtle)' }}>/ {totalPages}</span>
      </span>
      <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="btn btn-icon btn-sm btn-outline" style={{ width: 30, height: 30 }}>
        <Icon.ChevronRight size={14}/>
      </button>
    </div>
  </div>
);

Object.assign(window, { useSortablePaged, SortableTh, TablePagination });

// =====================================================================
const Logo = ({ size = 36, mono = false, label = true }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
    {label && (
      <div style={{ lineHeight: 1.1 }}>
        <div className="display" style={{ fontSize: 15, fontWeight: 600, color: mono ? '#fff' : 'var(--fg)', letterSpacing: '-0.015em' }}>
          Comité Mâcon
        </div>
        <div style={{ fontSize: 11, color: mono ? 'rgba(255,255,255,0.65)' : 'var(--fg-muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>
          Salons & Concours
        </div>
      </div>
    )}
  </div>
);

// Status badge — encapsulates wine inscription statuses
const StatusBadge = ({ status }) => {
  const map = {
    // R20 — 4 statuts inscriptions concours
    'en-attente-paiement': { cls: 'badge badge-warning', label: 'En attente de paiement', dot: '#d97706' },
    'a-verifier':  { cls: 'badge badge-warning', label: 'À vérifier', dot: '#d97706' },
    'valide':      { cls: 'badge badge-success', label: 'Validé', dot: '#16a34a' },
    'paye':        { cls: 'badge badge-success', label: 'Payé', dot: '#16a34a' },
    // Statuts conservés pour d'autres contextes (contrôle, dossiers…)
    'brouillon':   { cls: 'badge', label: 'Brouillon', dot: '#94a3b8' },
    'soumis':      { cls: 'badge badge-info', label: 'Soumis', dot: '#0284c7' },
    'rejete':      { cls: 'badge badge-danger', label: 'Rejeté', dot: '#dc2626' },
    'en-attente':  { cls: 'badge badge-warning', label: 'En attente', dot: '#d97706' },
    'en-cours':    { cls: 'badge badge-info', label: 'En cours', dot: '#0284c7' },
    'or':          { cls: 'badge badge-gold', label: 'Or', dot: '#d4a017' },
    'argent':      { cls: 'badge', label: 'Argent', dot: '#94a3b8' },
    'bronze':      { cls: 'badge', label: 'Bronze', dot: '#a16207' },
  };
  const it = map[status] || { cls: 'badge', label: status };
  return (
    <span className={it.cls}>
      {it.dot && <span className="badge-dot" style={{ background: it.dot }}/>}
      {it.label}
    </span>
  );
};

// KPI card — multiple styles selectable via Tweaks
const KpiCard = ({ icon, label, value, delta, deltaDir = 'up', sub, variant = 'default', accent = 'var(--burgundy-800)', showIcon = false }) => {
  // Strip decorative icon unless explicitly enabled
  if (!showIcon) icon = null;
  if (variant === 'minimal') {
    return (
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10 }}>
          <div className="display tnum" style={{ fontSize: 32, fontWeight: 600, color: 'var(--fg)' }}>{value}</div>
          {delta && (
            <span style={{ fontSize: 12, color: deltaDir === 'up' ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>
              {deltaDir === 'up' ? '↑' : '↓'} {delta}
            </span>
          )}
        </div>
        {sub && <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4 }}>{sub}</div>}
      </div>
    );
  }
  if (variant === 'accent') {
    return (
      <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
        <div style={{ height: 3, background: accent }}/>
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-muted)' }}>{label}</div>
            {icon && <div style={{ color: accent }}>{icon}</div>}
          </div>
          <div className="tnum" style={{ fontSize: 28, fontWeight: 600, color: 'var(--fg)', marginTop: 8, letterSpacing: '-0.02em' }}>{value}</div>
          {(sub || delta) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontSize: 12, color: 'var(--fg-muted)' }}>
              {delta && (
                <span style={{ color: deltaDir === 'up' ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>
                  {deltaDir === 'up' ? '+' : '−'}{delta}
                </span>
              )}
              {sub && <span>{sub}</span>}
            </div>
          )}
        </div>
      </div>
    );
  }
  if (variant === 'editorial') {
    return (
      <div className="card" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'var(--burgundy-50)', opacity: 0.6 }}/>
        {icon && <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>{icon}</div>}
        <div className="display tnum" style={{ fontSize: 36, fontWeight: 500, color: 'var(--fg)', marginTop: 16, letterSpacing: '-0.025em', position: 'relative' }}>{value}</div>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: 11.5, color: 'var(--fg-subtle)', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{sub}</div>}
      </div>
    );
  }
  // default
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {icon && <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--slate-100)', color: 'var(--burgundy-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>}
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', fontWeight: 500 }}>{label}</div>
        </div>
        {delta && (
          <span style={{ fontSize: 11.5, padding: '2px 7px', borderRadius: 999, background: deltaDir === 'up' ? 'var(--success-bg)' : 'var(--danger-bg)', color: deltaDir === 'up' ? '#166534' : '#991b1b', fontWeight: 500 }}>
            {deltaDir === 'up' ? '↑' : '↓'} {delta}
          </span>
        )}
      </div>
      <div className="tnum" style={{ fontSize: 28, fontWeight: 600, color: 'var(--fg)', marginTop: 14, letterSpacing: '-0.02em' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
};

// Page header
const PageHeader = ({ title, subtitle, actions, breadcrumb }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 28, flexWrap: 'wrap' }}>
    <div>
      {breadcrumb && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 8 }}>
          {breadcrumb.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Icon.ChevronRight size={12}/>}
              <span style={{ color: i === breadcrumb.length - 1 ? 'var(--fg)' : 'var(--fg-muted)', fontWeight: i === breadcrumb.length - 1 ? 500 : 400 }}>{b}</span>
            </React.Fragment>
          ))}
        </div>
      )}
      <h1 className="display" style={{ fontSize: 28, fontWeight: 500, color: 'var(--fg)', margin: 0, letterSpacing: '-0.025em' }}>{title}</h1>
      {subtitle && <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 6 }}>{subtitle}</div>}
    </div>
    {actions && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}</div>}
  </div>
);

// Empty state
const Empty = ({ icon, title, hint, action }) => (
  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--fg-muted)' }}>
    {icon && <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--slate-100)', color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>{icon}</div>}
    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg)' }}>{title}</div>
    {hint && <div style={{ fontSize: 13, marginTop: 4 }}>{hint}</div>}
    {action && <div style={{ marginTop: 16 }}>{action}</div>}
  </div>
);

// Toast (simple)
const Toast = ({ message, onClose }) => (
  <div style={{
    position: 'fixed', bottom: 24, right: 24, zIndex: 200,
    background: 'var(--slate-900)', color: 'white',
    padding: '12px 16px', borderRadius: 10, fontSize: 13.5,
    display: 'flex', alignItems: 'center', gap: 10,
    boxShadow: 'var(--shadow-lg)',
    animation: 'slideUp .25s ease-out',
  }}>
    <Icon.Check size={16}/>
    <span>{message}</span>
    {onClose && <button onClick={onClose} className="btn btn-icon btn-sm" style={{ background: 'transparent', color: 'white' }}><Icon.X size={14}/></button>}
  </div>
);

// ── Concours branding ──────────────────────────────────────────────

const CONCOURS_BRAND = {
  france: {
    id: 'france',
    nom: 'Concours des Grands Vins de France',
    nomCourt: 'CGVF',
    logo: 'OR-2025.webp',
    color: 'var(--burgundy-800)',
    colorLight: 'var(--burgundy-50)',
    colorBorder: 'rgba(83,20,66,0.15)',
  },
  monde: {
    id: 'monde',
    nom: 'Concours des Grands Vins du Monde',
    nomCourt: 'CGVM',
    logo: 'logo-comite-vin-monde.png',
    color: '#004D57',
    colorAccent: '#BC9F54',
    colorLight: '#e6eff0',
    colorBorder: 'rgba(0,77,87,0.15)',
  },
};

// Detect which concours brand from a string (id, route or label)
const getConcoursBrand = (id) => {
  if (!id) return CONCOURS_BRAND.france;
  const s = String(id).toLowerCase();
  if (s.includes('monde') || s === 'monde') return CONCOURS_BRAND.monde;
  return CONCOURS_BRAND.france;
};

// Small logo in a colored badge — size controls outer box
const ConcoursLogo = ({ concours, size = 26 }) => {
  const brand = (concours && typeof concours === 'object' && concours.id)
    ? concours : getConcoursBrand(concours);
  const inner = Math.round(size * 0.65);
  return (
    <div style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.22),
      background: brand.colorLight,
      border: `1px solid ${brand.colorBorder}`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <img src={brand.logo} alt={brand.nomCourt}
        style={{ width: inner, height: inner, objectFit: 'contain' }}/>
    </div>
  );
};

// Pill : logo + short name (CGVF / CGVM)
const ConcoursPillBrand = ({ concours }) => {
  const brand = (concours && typeof concours === 'object' && concours.id)
    ? concours : getConcoursBrand(concours);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px 2px 4px', borderRadius: 999,
      background: brand.colorLight, border: `1px solid ${brand.colorBorder}`,
    }}>
      <img src={brand.logo} alt={brand.nomCourt}
        style={{ width: 14, height: 14, objectFit: 'contain', flexShrink: 0 }}/>
      <span style={{ fontSize: 11.5, fontWeight: 600, color: brand.color }}>{brand.nomCourt}</span>
    </span>
  );
};

// ── Expéditeurs email — données partagées (parametres + modal email) ─
const EXPEDITEURS_EMAIL = [
  { id: 'contact',       nom: 'Comité des Salons et Concours de Mâcon', email: 'contact@comite-macon.fr',       defaut: true  },
  { id: 'cgvf',          nom: 'Concours des Grands Vins de France',      email: 'cgvf@comite-macon.fr',          defaut: false },
  { id: 'cgvm',          nom: 'Concours des Grands Vins du Monde',       email: 'cgvm@comite-macon.fr',          defaut: false },
  { id: 'inscriptions',  nom: 'Service des inscriptions',                email: 'inscriptions@comite-macon.fr',  defaut: false },
];

// ── Cross-marketing — offres affichées en bas de chaque espace utilisateur ─
// Gérable depuis AdminMarketing (BO). Chaque offre peut cibler 1-3 portails, avoir un badge promo + date de fin.
const CROSS_OFFERS = [
  {
    id: 'expo-sdv',
    portals: ['producteur', 'degustateur'],
    type: 'salon',
    icon: 'Building',
    color: 'var(--burgundy-700)',
    colorLight: 'var(--burgundy-50)',
    colorBorder: 'var(--burgundy-200)',
    title: 'Salon des Vins de Mâcon 2026',
    subtitle: 'Espace exposant · 14–16 nov. 2026',
    desc: 'Valorisez vos vins auprès de 12 000 visiteurs passionnés. Stands de 9 à 36 m². Candidature avant le 30 sept.',
    cta: 'Réserver un stand',
    badge: null,
    badgeColor: null,
    endDate: '2026-09-30',
    active: true,
  },
  {
    id: 'expo-mpg',
    portals: ['producteur'],
    type: 'salon',
    icon: 'ShoppingCart',
    color: '#92400e',
    colorLight: '#fef9ec',
    colorBorder: '#fde68a',
    title: 'Marché des Plaisirs Gourmands 2026',
    subtitle: 'Espace exposant artisanal',
    desc: 'Présentez votre domaine à un public d\'amateurs de gastronomie locale. Stand à partir de 180 €.',
    cta: 'En savoir plus',
    badge: 'Tarif early bird',
    badgeColor: '#d97706',
    endDate: '2026-07-31',
    active: true,
  },
  {
    id: 'degust-jury',
    portals: ['producteur', 'exposant'],
    type: 'recrutement',
    icon: 'Award',
    color: '#0c4a6e',
    colorLight: '#f0f9ff',
    colorBorder: '#bae6fd',
    title: 'Devenir juré au concours',
    subtitle: 'Concours des Grands Vins de France 2027',
    desc: 'Vous êtes professionnel de la filière ? Rejoignez nos 300 experts. Candidature en 5 min.',
    cta: 'Candidater',
    badge: 'Candidatures ouvertes',
    badgeColor: '#0284c7',
    endDate: '2026-08-30',
    active: true,
  },
  {
    id: 'formation',
    portals: ['producteur', 'degustateur', 'exposant'],
    type: 'formation',
    icon: 'Layers',
    color: '#166534',
    colorLight: '#f0fdf4',
    colorBorder: '#bbf7d0',
    title: 'Formation dégustation — Niveau 2',
    subtitle: '3 modules en ligne · 1 journée présentielle',
    desc: 'Perfectionnez votre analyse sensorielle. 14h certifiantes, éligible OPCO. Sessions juillet & septembre.',
    cta: 'S\'inscrire',
    badge: '-20% jusqu\'au 15 juil.',
    badgeColor: '#15803d',
    endDate: '2026-07-15',
    active: true,
  },
];

// Bloc cross-marketing — inséré en bas de chaque dashboard utilisateur.
// Filtre les offres actives pour le portail donné et affiche un compte à rebours si endDate ≤ 30 jours.
const CrossMarketingBlock = ({ portal }) => {
  const today = new Date('2026-06-29');
  const activeOffers = CROSS_OFFERS.filter(o => o.active && o.portals.includes(portal));
  if (!activeOffers.length) return null;

  const daysLeft = (endDateStr) => {
    if (!endDateStr) return null;
    const diff = Math.round((new Date(endDateStr) - today) / 86400000);
    return diff > 0 ? diff : null;
  };

  return (
    <div style={{ padding: '8px 24px 32px' }}>
      {/* Séparateur section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--fg-muted)' }}>
          <Icon.Sparkles size={12}/>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            À découvrir aussi
          </span>
        </div>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      {/* Grille */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${activeOffers.length}, 1fr)`, gap: 12 }}>
        {activeOffers.map(offer => {
          const days = daysLeft(offer.endDate);
          const OfferIcon = Icon[offer.icon] || Icon.Star;
          return (
            <div key={offer.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'box-shadow .15s, transform .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {/* En-tête coloré */}
              <div style={{
                background: offer.colorLight,
                borderBottom: `1px solid ${offer.colorBorder}`,
                padding: '14px 16px',
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 9,
                  background: offer.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <OfferIcon size={17}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {offer.badge && (
                    <span style={{
                      display: 'inline-block', fontSize: 10.5, fontWeight: 600,
                      padding: '2px 7px', borderRadius: 999, marginBottom: 4, marginRight: 4,
                      background: offer.badgeColor + '1a', color: offer.badgeColor,
                      border: `1px solid ${offer.badgeColor}33`,
                    }}>
                      {offer.badge}
                    </span>
                  )}
                  {days !== null && days <= 30 && (
                    <span style={{
                      display: 'inline-block', fontSize: 10.5, fontWeight: 600,
                      padding: '2px 7px', borderRadius: 999, marginBottom: 4,
                      background: days <= 7 ? '#fef2f2' : '#fffbeb',
                      color: days <= 7 ? '#dc2626' : '#d97706',
                      border: `1px solid ${days <= 7 ? '#fecaca' : '#fde68a'}`,
                    }}>
                      J−{days}
                    </span>
                  )}
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.3 }}>
                    {offer.title}
                  </div>
                </div>
              </div>

              {/* Corps */}
              <div style={{ padding: '11px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ fontSize: 11.5, color: offer.color, fontWeight: 500 }}>{offer.subtitle}</div>
                <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', lineHeight: 1.5 }}>{offer.desc}</div>
              </div>

              {/* CTA */}
              <div style={{ padding: '4px 16px 14px' }}>
                <button
                  className="btn btn-sm"
                  style={{
                    width: '100%', background: offer.colorLight,
                    color: offer.color, border: `1px solid ${offer.colorBorder}`,
                    fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  }}
                >
                  {offer.cta} <Icon.ArrowRight size={12}/>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Object.assign(window, { Logo, StatusBadge, KpiCard, PageHeader, Empty, Toast, CONCOURS_BRAND, getConcoursBrand, ConcoursLogo, ConcoursPillBrand, EXPEDITEURS_EMAIL, CROSS_OFFERS, CrossMarketingBlock });
