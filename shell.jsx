// Shell layout for the 3 portals — sidebar + topbar + content area.
// Driven by a "route" prop that the parent App owns.

const navAdmin = [
  { id: 'inscriptions-fr', label: 'Concours France', icon: <Icon.Trophy size={16}/>, group: 'Concours', badge: 47, children: [
    { id: 'fr-dashboard', label: 'Tableau de bord' },
    { id: 'fr-inscriptions', label: 'Inscriptions' },
    { id: 'fr-controle', label: 'Contrôle optimisé', badge: 47 },
    { id: 'fr-palmares', label: 'Résultats / Palmarès' },
  ]},
  { id: 'inscriptions-monde', label: 'Concours Monde', icon: <Icon.Globe size={16}/>, group: 'Concours', badge: 12, children: [
    { id: 'monde-dashboard', label: 'Tableau de bord' },
    { id: 'monde-inscriptions', label: 'Inscriptions' },
    { id: 'monde-controle', label: 'Contrôle optimisé' },
    { id: 'monde-palmares', label: 'Résultats / Palmarès' },
  ]},
  { id: 'commandes', label: 'Commandes médailles', icon: <Icon.Package size={16}/>, group: 'Logistique', children: [
    { id: 'cmd-liste', label: 'Commandes producteurs' },
    { id: 'cmd-stocks', label: 'Stocks' },
    { id: 'cmd-fournisseurs', label: 'Transmissions fournisseurs' },
  ]},
  { id: 'salons', label: 'Salons & exposants', icon: <Icon.Building size={16}/>, group: 'Logistique', children: [
    { id: 'salons-events', label: 'Événements' },
    { id: 'salons-vins',   label: 'Salon des Vins' },
    { id: 'salons-marche', label: 'Marché des Plaisirs Gourmands' },
  ]},
  { id: 'producteurs', label: 'Producteurs', icon: <Icon.Wine size={16}/>, group: 'Utilisateurs' },
  { id: 'degustateurs', label: 'Dégustateurs', icon: <Icon.Users size={16}/>, group: 'Utilisateurs', children: [
    { id: 'deg-liste', label: 'Liste & fiches' },
    { id: 'deg-formations', label: 'Formations' },
    { id: 'deg-repas', label: 'Repas' },
    { id: 'deg-jurys', label: 'Jurys' },
    { id: 'deg-dispos', label: 'Disponibilités' },
  ]},
  { id: 'finances', label: 'Finances', icon: <Icon.Receipt size={16}/>, group: 'Gestion', children: [
    { id: 'fin-paiements', label: 'Paiements' },
    { id: 'fin-factures', label: 'Factures' },
    { id: 'fin-exports', label: 'Exports comptables (Sage)' },
  ]},
  { id: 'parametres', label: 'Paramètres', icon: <Icon.Settings size={16}/>, group: 'Gestion', children: [
    { id: 'param-concours', label: 'Configuration concours' },
    { id: 'param-salons', label: 'Configuration salons' },
    { id: 'param-appellations', label: 'Appellations & régions' },
    { id: 'param-fournisseurs', label: 'Fournisseurs médailles' },
    { id: 'param-emails', label: 'Templates emails' },
    { id: 'param-api', label: 'Configuration API' },
    { id: 'param-utilisateurs', label: 'Utilisateurs & droits' },
    { id: 'param-paiements', label: 'Configuration paiements' },
  ]},
];

// Producteur — navbar horizontale simplifiée (4 entrées principales)
const navProducteur = [
  { id: 'concours',    label: 'Concours',    route: 'p-inscriptions',  match: ['p-inscriptions', 'p-ins-cours', 'p-ins-historique', 'p-inscription'] },
  { id: 'medailles',   label: 'Médailles',   route: 'p-medailles',  badge: 1,
    match: ['p-medailles', 'p-commandes', 'p-cmd-nouvelle', 'p-cmd-historique'] },
  { id: 'derogations', label: 'Dérogations', route: 'p-derogations',
    match: ['p-derogations', 'p-der-nouvelle', 'p-der-mes'] },
  { id: 'compte',      label: 'Mon compte',  route: 'p-compte',
    match: ['p-compte', 'p-compte-infos', 'p-compte-facturation', 'p-compte-mdp'] },
];

const navByPortal = {
  admin: navAdmin,
  producteur: navProducteur,
};

const userByPortal = {
  admin: { name: 'Sophie Lambert', role: 'Administratrice', avatar: 'SL' },
  producteur: { name: 'Sophie Lambert', role: 'Domaine de la Chevalière', avatar: 'SL', domain: 'Domaine de la Chevalière' },
  degustateur: { name: 'Pierre Bouvier', role: 'Œnologue · Jury senior', avatar: 'PB' },
};

const NavItem = ({ item, route, onNavigate }) => {
  const hasChildren = !!(item.children && item.children.length);
  const childActive = hasChildren && item.children.some(c => c.id === route);
  const active = route === item.id || childActive;
  const [open, setOpen] = React.useState(childActive);
  React.useEffect(() => { if (childActive) setOpen(true); }, [childActive]);

  const handleClick = () => {
    if (hasChildren) {
      setOpen(o => !o);
      // also navigate to first child if no child is currently active
      if (!childActive) onNavigate(item.children[0].id);
    } else {
      onNavigate(item.id);
    }
  };

  return (
    <div style={{ marginBottom: 1 }}>
      <button onClick={handleClick}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px',
          borderRadius: 7,
          border: 'none',
          background: active && !hasChildren ? 'var(--burgundy-50)' : (active && hasChildren ? 'transparent' : 'transparent'),
          color: active ? 'var(--burgundy-800)' : 'var(--slate-700)',
          fontSize: 13.5,
          fontWeight: active ? 600 : 500,
          textAlign: 'left',
          cursor: 'pointer',
          transition: 'all .12s',
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--slate-100)'; }}
        onMouseLeave={e => { if (!active || hasChildren) e.currentTarget.style.background = 'transparent'; }}
      >
        <span style={{ color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)', display: 'inline-flex' }}>{item.icon}</span>
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.badge && (
          <span style={{
            fontSize: 10.5, fontWeight: 600,
            padding: '1px 6px',
            background: active && !hasChildren ? 'var(--burgundy-800)' : 'var(--slate-200)',
            color: active && !hasChildren ? 'white' : 'var(--slate-700)',
            borderRadius: 999,
            minWidth: 18, textAlign: 'center',
          }}>{item.badge}</span>
        )}
        {item.highlight && !active && (
          <span style={{ fontSize: 10, padding: '1px 6px', background: 'var(--burgundy-800)', color: '#fff', borderRadius: 4, fontWeight: 600, letterSpacing: '0.05em' }}>NEW</span>
        )}
        {hasChildren && (
          <span style={{
            color: 'var(--fg-subtle)',
            display: 'inline-flex',
            transition: 'transform .15s',
            transform: open ? 'rotate(90deg)' : 'rotate(0)',
          }}>
            <Icon.ChevronRight size={14}/>
          </span>
        )}
      </button>
      {hasChildren && open && (
        <div style={{
          marginLeft: 23,
          paddingLeft: 11,
          borderLeft: '1px solid var(--border)',
          marginTop: 2,
          marginBottom: 4,
        }}>
          {item.children.map(c => {
            const cActive = route === c.id;
            return (
              <button key={c.id} onClick={() => onNavigate(c.id)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: cActive ? 'var(--burgundy-50)' : 'transparent',
                  color: cActive ? 'var(--burgundy-800)' : 'var(--slate-600)',
                  fontSize: 12.5,
                  fontWeight: cActive ? 600 : 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  marginBottom: 1,
                }}
                onMouseEnter={e => { if (!cActive) e.currentTarget.style.background = 'var(--slate-100)'; }}
                onMouseLeave={e => { if (!cActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ flex: 1 }}>{c.label}</span>
                {c.badge && (
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    padding: '1px 6px',
                    background: cActive ? 'var(--burgundy-800)' : 'var(--slate-200)',
                    color: cActive ? 'white' : 'var(--slate-700)',
                    borderRadius: 999,
                  }}>{c.badge}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Dégustateur — navbar horizontale (mêmes patterns que producteur)
const navDegustateur = [
  { id: 'dashboard',      label: 'Dashboard',          route: 'd-dashboard',      match: ['d-dashboard'] },
  { id: 'formations',     label: 'Formations',         route: 'd-formations',     match: ['d-formations', 'd-formation-detail'] },
  { id: 'repas',          label: 'Repas',              route: 'd-repas',          match: ['d-repas', 'd-repas-venir', 'd-repas-mes'] },
  { id: 'concours',       label: 'Prochains concours', route: 'd-concours',       match: ['d-concours'] },
  { id: 'disponibilites', label: 'Mes disponibilités', route: 'd-disponibilites', match: ['d-disponibilites'] },
  { id: 'compte',         label: 'Mon compte',         route: 'd-compte',         match: ['d-compte', 'd-compte-infos', 'd-compte-prefs', 'd-compte-mdp'] },
];

// Shell horizontal générique (utilisé par producteur + dégustateur)
const TopNavShell = ({ nav, user, route, onNavigate, onLogout, fullBleedRoutes = [], children }) => {
  const active = nav.find(n => n.match.includes(route))?.id;
  const homeRoute = nav[0].route;
  const isFullBleed = fullBleedRoutes.includes(route);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        height: 64,
        background: '#ffffff',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        {/* Logo */}
        <button onClick={() => onNavigate(homeRoute)} style={{
          background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center',
        }}>
          <Logo size={32}/>
        </button>

        {/* Nav centrée */}
        <nav style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 4 }}>
          {nav.map(item => {
            const isActive = item.id === active;
            return (
              <button key={item.id} onClick={() => onNavigate(item.route)} style={{
                position: 'relative',
                height: 64,
                padding: '0 16px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--burgundy-800)' : 'var(--slate-700)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                letterSpacing: '-0.005em',
                transition: 'color .12s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--burgundy-800)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--slate-700)'; }}
              >
                {item.label}
                {item.badge && (
                  <span style={{
                    minWidth: 18, height: 18, padding: '0 5px',
                    borderRadius: 999,
                    background: '#f97316',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center',
                    lineHeight: 1,
                  }}>{item.badge}</span>
                )}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    left: 10, right: 10, bottom: -1,
                    height: 2,
                    background: 'var(--burgundy-800)',
                    borderRadius: '2px 2px 0 0',
                  }}/>
                )}
              </button>
            );
          })}
        </nav>

        {/* User chip à droite */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar" title={user.name} style={{
            width: 34, height: 34,
            background: 'var(--burgundy-800)',
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
          }}>{user.avatar}</div>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>{user.name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>{user.role}</div>
          </div>
          <button onClick={onLogout} title="Se déconnecter" style={{
            width: 32, height: 32,
            background: 'transparent',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            color: 'var(--fg-muted)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginLeft: 4,
            transition: 'all .12s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--slate-100)'; e.currentTarget.style.color = 'var(--burgundy-800)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-muted)'; }}
          >
            <Icon.Logout size={16}/>
          </button>
        </div>
      </header>

      <main style={{ flex: 1, width: '100%' }}>
        {isFullBleed ? (
          <div className="fade-in" key={route}>{children}</div>
        ) : (
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 40px 80px' }}>
            <div className="fade-in" key={route}>{children}</div>
          </div>
        )}
      </main>
    </div>
  );
};

// Producer top-navbar shell (utilise TopNavShell)
const ProducerShell = ({ route, onNavigate, onLogout, children }) => (
  <TopNavShell
    nav={navProducteur}
    user={userByPortal.producteur}
    route={route}
    onNavigate={onNavigate}
    onLogout={onLogout}
    fullBleedRoutes={['p-inscription']}
  >{children}</TopNavShell>
);

// Dégustateur top-navbar shell
const DegustateurShell = ({ route, onNavigate, onLogout, children }) => (
  <TopNavShell
    nav={navDegustateur}
    user={userByPortal.degustateur}
    route={route}
    onNavigate={onNavigate}
    onLogout={onLogout}
  >{children}</TopNavShell>
);

const Shell = ({ portal, route, onNavigate, onLogout, children }) => {
  // Producteur — navbar horizontale dédiée
  if (portal === 'producteur') {
    return <ProducerShell route={route} onNavigate={onNavigate} onLogout={onLogout}>{children}</ProducerShell>;
  }
  // Dégustateur — même pattern horizontal
  if (portal === 'degustateur') {
    return <DegustateurShell route={route} onNavigate={onNavigate} onLogout={onLogout}>{children}</DegustateurShell>;
  }

  const nav = navByPortal[portal];
  const user = userByPortal[portal];

  // Group items
  const groups = {};
  nav.forEach(item => {
    const g = item.group || '_top';
    if (!groups[g]) groups[g] = [];
    groups[g].push(item);
  });

  // Filtre les groupes vides (_top peut ne plus exister si aucun item n'a group:'')
  const groupOrder = ['_top', ...Object.keys(groups).filter(g => g !== '_top')].filter(g => !!groups[g]);
  const portalLabel = { admin: 'Administration', producteur: 'Espace Producteur', degustateur: 'Espace Dégustateur' }[portal];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '252px 1fr', minHeight: '100vh', background: 'var(--bg-app)' }}>
      {/* SIDEBAR */}
      <aside style={{
        background: '#fbfaf7',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ padding: '20px 18px 18px', borderBottom: '1px solid var(--border)' }}>
          <Logo size={32}/>
          <div style={{
            marginTop: 12,
            fontSize: 11,
            color: 'var(--fg-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span className="badge-dot" style={{ background: 'var(--burgundy-800)' }}/>
            {portalLabel}
          </div>
        </div>

        <nav className="scroll-y" style={{ flex: 1, padding: '14px 10px' }}>
          {groupOrder.map(g => (
            <div key={g} style={{ marginBottom: 6 }}>
              {g !== '_top' && (
                <div style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: 'var(--fg-subtle)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '12px 10px 6px',
                }}>{g}</div>
              )}
              {groups[g].map(item => <NavItem key={item.id} item={item} route={route} onNavigate={onNavigate}/>)}
            </div>
          ))}
        </nav>

        {/* User card */}
        <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: 10,
            borderRadius: 8,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}>
            <div className="avatar avatar-lg">{user.avatar}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.role}</div>
            </div>
            <button onClick={onLogout} className="btn btn-icon btn-sm btn-ghost" title="Se déconnecter">
              <Icon.Logout size={14}/>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar portal={portal} onLogout={onLogout} onNavigate={onNavigate}/>
        <div style={{ flex: 1, padding: '32px 40px 56px', maxWidth: 1440, width: '100%', alignSelf: 'flex-start' }}>
          <div className="fade-in" key={route}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

// ── Notifications dropdown ────────────────────────────────────────
const NOTIFS = [
  { id: 1, type: 'warning', icon: <Icon.AlertCircle size={14}/>, title: 'Virement en attente depuis 8 jours', sub: 'Château Pied-de-Rieux · INS-2026-0183', time: 'Il y a 8 j', unread: true },
  { id: 2, type: 'info',    icon: <Icon.FileText size={14}/>,    title: 'Nouvelle inscription soumise',        sub: 'Château Dubreuil · INS-2026-0174',     time: 'Il y a 12 min', unread: true },
  { id: 3, type: 'success', icon: <Icon.Check size={14}/>,       title: 'Paiement reçu',                      sub: 'Domaine des 3 Pierres · 540 €',          time: 'Il y a 1h',  unread: true },
  { id: 4, type: 'warning', icon: <Icon.AlertCircle size={14}/>, title: 'Dérogation en attente de traitement', sub: 'Domaine de la Chevalière · DER-2026-0032', time: 'Il y a 2h', unread: false },
  { id: 5, type: 'info',    icon: <Icon.Users size={14}/>,       title: 'Nouveau dégustateur inscrit',         sub: 'Pierre Moreau · Bordeaux',               time: 'Il y a 3h',  unread: false },
  { id: 6, type: 'success', icon: <Icon.Check size={14}/>,       title: 'Palmarès Concours France publié',     sub: 'Édition 2025 · 847 médailles attribuées', time: 'Il y a 2 j', unread: false },
];

const notifColors = {
  warning: { bg: 'var(--warning-bg)', fg: '#92400e' },
  info:    { bg: '#eff6ff',           fg: '#1e40af' },
  success: { bg: 'var(--success-bg)', fg: '#166534' },
};

const NotifDropdown = ({ onClose }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={ref} style={{
      position: 'absolute', top: 48, right: 0, zIndex: 50,
      width: 380,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      boxShadow: '0 12px 40px rgba(15,23,42,0.14)',
      overflow: 'hidden',
      animation: 'slideDown .15s ease-out',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Notifications</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11.5, color: 'var(--burgundy-800)', fontWeight: 500 }}>3 non lues</span>
          <button style={{ fontSize: 11.5, color: 'var(--fg-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Tout marquer lu</button>
        </div>
      </div>
      {/* Liste */}
      <div style={{ maxHeight: 380, overflowY: 'auto' }}>
        {NOTIFS.map((n, i) => (
          <div key={n.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '13px 18px',
            borderBottom: i < NOTIFS.length - 1 ? '1px solid var(--border)' : 'none',
            background: n.unread ? 'var(--burgundy-50)' : 'transparent',
            cursor: 'pointer',
            transition: 'background .1s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = n.unread ? '#f5eef2' : 'var(--surface-2)'}
          onMouseLeave={e => e.currentTarget.style.background = n.unread ? 'var(--burgundy-50)' : 'transparent'}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: notifColors[n.type].bg,
              color: notifColors[n.type].fg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{n.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: n.unread ? 600 : 500, color: 'var(--fg)', lineHeight: 1.3 }}>{n.title}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.sub}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{n.time}</span>
              {n.unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--burgundy-800)' }}/>}
            </div>
          </div>
        ))}
      </div>
      {/* Footer */}
      <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <button style={{ fontSize: 12.5, color: 'var(--burgundy-800)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
          Voir toutes les notifications
        </button>
      </div>
    </div>
  );
};

// ── Aide contextuelle / Documentation panel ───────────────────────
const HELP_SECTIONS = [
  {
    title: 'Démarrage rapide',
    icon: <Icon.Sparkles size={14}/>,
    items: [
      { label: 'Créer une nouvelle édition de concours', route: 'param-concours' },
      { label: 'Lancer le contrôle automatique des dossiers', route: 'fr-controle' },
      { label: 'Publier le palmarès', route: 'fr-palmares' },
      { label: 'Inviter un nouvel administrateur', route: 'param-utilisateurs' },
    ],
  },
  {
    title: 'Inscriptions & dossiers',
    icon: <Icon.FileText size={14}/>,
    items: [
      { label: "Comprendre les statuts d'inscription", info: "Brouillon → Soumis → Validé → Payé. Les statuts «Att. virement» et «Att. chèque» indiquent un paiement en attente de confirmation manuelle." },
      { label: 'Confirmer un paiement virement / chèque', route: 'fr-inscriptions' },
      { label: 'Exporter les dossiers en CSV', route: 'fr-inscriptions' },
    ],
  },
  {
    title: 'Paramètres & configuration',
    icon: <Icon.Settings size={14}/>,
    items: [
      { label: 'Configurer les tarifs et dates du concours', route: 'param-concours' },
      { label: 'Gérer les coordonnées bancaires (virement)', route: 'param-paiements' },
      { label: "Modifier les templates d'email", route: 'param-emails' },
      { label: 'Tester les connexions API (Paybox, Sage…)', route: 'param-api' },
    ],
  },
  {
    title: 'Raccourcis clavier',
    icon: <Icon.Sliders size={14}/>,
    items: [
      { label: '⌘K — Recherche globale', info: "Accès rapide à n'importe quel producteur, dossier ou commande." },
      { label: '⌘/ — Aide contextuelle', info: "Ouvre ce panneau depuis n'importe quelle page." },
      { label: 'Échap — Fermer les modales', info: 'Ferme les dialogues ouverts sans perdre les données.' },
    ],
  },
];

const HelpPanel = ({ onClose, onNavigate }) => {
  const [search, setSearch] = React.useState('');
  const [expandedSection, setExpandedSection] = React.useState(0);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const filtered = search.trim()
    ? HELP_SECTIONS.map(s => ({
        ...s,
        items: s.items.filter(it => it.label.toLowerCase().includes(search.toLowerCase())),
      })).filter(s => s.items.length > 0)
    : HELP_SECTIONS;

  return (
    <div ref={ref} style={{
      position: 'absolute', top: 48, right: 0, zIndex: 50,
      width: 380,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      boxShadow: '0 12px 40px rgba(15,23,42,0.14)',
      overflow: 'hidden',
      animation: 'slideDown .15s ease-out',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 18px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Aide & documentation</div>
          <button onClick={onClose} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
        </div>
        <div className="input-with-icon">
          <Icon.Search size={13} className="input-icon"/>
          <input
            className="input"
            placeholder="Rechercher dans l'aide…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontSize: 13 }}
            autoFocus
          />
        </div>
      </div>

      {/* Sections */}
      <div style={{ maxHeight: 420, overflowY: 'auto' }}>
        {filtered.map((section, si) => {
          const isOpen = search.trim() ? true : expandedSection === si;
          return (
            <div key={si} style={{ borderBottom: si < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <button
                onClick={() => setExpandedSection(isOpen ? -1 : si)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 18px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
              >
                <span style={{ color: 'var(--burgundy-800)' }}>{section.icon}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>{section.title}</span>
                <Icon.ChevronDown size={13} style={{ color: 'var(--fg-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}/>
              </button>
              {isOpen && (
                <div style={{ padding: '0 18px 12px' }}>
                  {section.items.map((item, ii) => (
                    <div
                      key={ii}
                      onClick={() => { if (item.route && onNavigate) { onNavigate(item.route); onClose(); } }}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '8px 10px',
                        borderRadius: 8,
                        cursor: item.route ? 'pointer' : 'default',
                        marginBottom: 2,
                      }}
                      onMouseEnter={e => { if (item.route) e.currentTarget.style.background = 'var(--burgundy-50)'; }}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {item.route
                        ? <Icon.ArrowRight size={12} style={{ color: 'var(--burgundy-800)', marginTop: 3, flexShrink: 0 }}/>
                        : <Icon.Info size={12} style={{ color: 'var(--fg-muted)', marginTop: 3, flexShrink: 0 }}/>
                      }
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: item.route ? 'var(--fg)' : 'var(--fg-muted)', fontWeight: item.route ? 500 : 400, lineHeight: 1.3 }}>{item.label}</div>
                        {item.info && <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 3, lineHeight: 1.4 }}>{item.info}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding: '32px 18px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>
            <Icon.Search size={20} style={{ marginBottom: 8, opacity: 0.4 }}/>
            <div>Aucun résultat pour «&nbsp;{search}&nbsp;»</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>Extranet Comité Mâcon v2.0</span>
        <button style={{ fontSize: 12, color: 'var(--burgundy-800)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
          Contacter le support →
        </button>
      </div>
    </div>
  );
};

// ── Topbar ────────────────────────────────────────────────────────
const Topbar = ({ portal, onLogout, onNavigate }) => {
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [helpOpen,  setHelpOpen]  = React.useState(false);
  const unreadCount = NOTIFS.filter(n => n.unread).length;

  return (
    <header style={{
      height: 60,
      borderBottom: '1px solid var(--border)',
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center',
      padding: '0 32px',
      gap: 16,
      position: 'sticky', top: 0, zIndex: 5,
    }}>
      <div style={{ flex: 1, maxWidth: 480 }}>
        <div className="input-with-icon">
          <Icon.Search size={15} className="input-icon"/>
          <input className="input" placeholder={portal === 'admin' ? 'Rechercher producteur, échantillon, commande…' : 'Rechercher dans mon espace…'} style={{ background: 'var(--slate-50)', border: '1px solid transparent' }}/>
          <span className="kbd" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>⌘K</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {/* Badge "dossiers à contrôler" — cliquable */}
        {portal === 'admin' && (
          <button
            onClick={() => onNavigate && onNavigate('fr-inscriptions')}
            className="badge badge-warning"
            style={{ marginRight: 8, cursor: 'pointer', background: 'none', border: '1px solid #fde68a', padding: '4px 10px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            title="Aller aux dossiers à contrôler"
          >
            <Icon.AlertCircle size={12}/> 3 dossiers à vérifier
          </button>
        )}

        {/* Cloche notifications */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-icon btn-ghost"
            title="Notifications"
            onClick={() => { setNotifOpen(o => !o); setHelpOpen(false); }}
            style={{ position: 'relative' }}
          >
            <Icon.Bell size={16}/>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 7, right: 7,
                minWidth: 7, height: 7,
                background: 'var(--burgundy-800)', borderRadius: '50%',
                border: '1.5px solid #fff',
              }}/>
            )}
          </button>
          {notifOpen && <NotifDropdown onClose={() => setNotifOpen(false)}/>}
        </div>

        {/* Aide contextuelle */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-icon btn-ghost"
            title="Aide & documentation"
            onClick={() => { setHelpOpen(o => !o); setNotifOpen(false); }}
            style={{ background: helpOpen ? 'var(--burgundy-50)' : undefined, color: helpOpen ? 'var(--burgundy-800)' : undefined }}
          >
            <Icon.Info size={16}/>
          </button>
          {helpOpen && <HelpPanel onClose={() => setHelpOpen(false)} onNavigate={onNavigate}/>}
        </div>
      </div>
    </header>
  );
};

window.Shell = Shell;
