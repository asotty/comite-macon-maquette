// SAS / Login — portail picker + sous-picker salon (exposant) + formulaire identifiants
// Chaque portail et chaque sas salon a son propre habillage visuel.

const portals = [
  {
    id: 'admin',
    name: 'Administration',
    sub: 'Comité — équipe interne',
    desc: 'Gestion des inscriptions, palmarès, commandes, dégustateurs et paramétrage.',
    icon: <Icon.ShieldCheck size={20} />,
    color: 'var(--burgundy-800)',
    credLabel: 'ESPACE ADMINISTRATION',
    credTitle: 'Connexion interne',
    credSub: 'Comité des Salons et Concours de Mâcon',
  },
  {
    id: 'producteur',
    name: 'Producteur',
    sub: 'Domaines & maisons vitivinicoles',
    desc: 'Inscription au concours, soumission d\'échantillons, commande de médailles.',
    icon: <Icon.Wine size={20} />,
    color: 'var(--burgundy-700)',
    credLabel: 'ESPACE PRODUCTEUR',
    credTitle: 'Bon retour parmi nous',
    credSub: 'Concours des Grands Vins · Mâcon',
  },
  {
    id: 'degustateur',
    name: 'Dégustateur',
    sub: 'Jury & professionnels',
    desc: 'Formations, repas, disponibilités et préférences de dégustation.',
    icon: <Icon.Award size={20} />,
    color: 'var(--burgundy-600)',
    credLabel: 'ESPACE DÉGUSTATEUR',
    credTitle: 'Bienvenue, expert',
    credSub: 'Jury · Formations · Disponibilités',
  },
  {
    id: 'exposant',
    name: 'Exposant',
    sub: 'Salons & marchés',
    desc: 'Inscription aux salons (SDV, MPG), suivi de votre stand et règlement.',
    icon: <Icon.Building size={20} />,
    color: '#166534',
    credLabel: 'ESPACE EXPOSANT',
    credTitle: 'Accès multi-salons',
    credSub: 'Salon des Vins · Marché des Plaisirs',
  },
];

// Sous-sas exposant — chaque entrée donne accès au même espace mais avec un contexte visuel distinct
const SALONS_SAS = [
  {
    id: 'sdv',
    name: 'Salon des Vins de Mâcon',
    sub: 'Édition 2026 · Tous les exposants vins',
    icon: <Icon.Wine size={20} />,
    logoSrc: 'logo-sdv.png',
    color: '#166534',
    credLabel: 'SALON DES VINS DE MÂCON 2026',
    credTitle: 'Espace exposant',
    credSub: 'Stands & règlement · Édition 2026',
    email: 'm.bouchard@vignobles-bouchard.fr',
  },
  {
    id: 'mpg',
    name: 'Marché des Plaisirs Gourmands',
    sub: 'Édition 2026 · Alimentation & artisanat',
    icon: <Icon.ShoppingCart size={20} />,
    logoSrc: 'logo-mpg.png',
    color: '#2D1508',
    credLabel: 'MARCHÉ DES PLAISIRS GOURMANDS 2026',
    credTitle: 'Espace exposant',
    credSub: 'Stands & règlement · Édition 2026',
    email: 'contact@fromagerie-moreau.fr',
  },
  {
    id: 'global',
    name: 'Tous mes salons',
    sub: 'Accès global à l\'espace exposant',
    icon: <Icon.Building size={20} />,
    color: '#166534',
    credLabel: 'ESPACE EXPOSANT',
    credTitle: 'Accès multi-salons',
    credSub: 'Salon des Vins · Marché des Plaisirs',
    email: 'marie.dupont@domaine-3-pierres.fr',
  },
];

// Logo-emblème circulaire par salon (icône + initiales)
// onDark=true : anneau blanc translucide sur fond coloré (panneau gauche)
// onDark=false : disque solide couleur marque sur fond clair (cards, header)
const SalonEmblem = ({ type, size = 44, onDark = false }) => {
  if (!type || type === 'global') return null;
  const isSDV = type === 'sdv';
  const brandColor = isSDV ? '#166534' : '#2D1508';
  const iconSize = Math.round(size * 0.38);
  const fontSize = Math.max(6, Math.round(size * 0.13));
  if (onDark) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.45)',
        background: 'rgba(255,255,255,0.1)',
        boxShadow: '0 0 0 6px rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 3, flexShrink: 0,
      }}>
        {isSDV
          ? <Icon.Wine size={iconSize} color="rgba(255,255,255,0.92)"/>
          : <Icon.ShoppingCart size={iconSize} color="rgba(255,255,255,0.92)"/>
        }
        <span style={{ fontSize, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.8)', lineHeight: 1, fontFamily: 'inherit' }}>
          {isSDV ? 'SDV' : 'MPG'}
        </span>
      </div>
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: brandColor,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 2, flexShrink: 0,
    }}>
      {isSDV
        ? <Icon.Wine size={iconSize} color="#fff"/>
        : <Icon.ShoppingCart size={iconSize} color="#fff"/>
      }
      <span style={{ fontSize, fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.85)', lineHeight: 1, fontFamily: 'inherit' }}>
        {isSDV ? 'SDV' : 'MPG'}
      </span>
    </div>
  );
};

// Panneau gauche — contexte visuel selon le portail sélectionné
const LeftPanel = ({ portal, salon }) => {
  const isExposant = portal === 'exposant';
  const salonData = salon ? SALONS_SAS.find(s => s.id === salon) : null;
  const accentColor = salonData ? salonData.color : (portal === 'admin' ? 'var(--burgundy-900)' : 'var(--burgundy-800)');

  if (isExposant && salonData) {
    // Panneau salon spécifique
    const isMPG = salon === 'mpg';
    return (
      <aside style={{
        position: 'relative',
        background: isMPG
          ? 'linear-gradient(160deg, #451a03 0%, #78350f 50%, #92400e 100%)'
          : 'linear-gradient(160deg, #14532d 0%, #166534 50%, #15803d 100%)',
        padding: '48px 56px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.06), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.03), transparent 50%)', pointerEvents: 'none' }} />
        <svg style={{ position: 'absolute', right: -120, top: 80, opacity: 0.07 }} width="500" height="500" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="240" fill="none" stroke="#fff" strokeWidth="0.5" />
          <circle cx="250" cy="250" r="200" fill="none" stroke="#fff" strokeWidth="0.5" />
          <circle cx="250" cy="250" r="160" fill="none" stroke="#fff" strokeWidth="0.5" />
        </svg>

        <div style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 14 }}>
          <img src="assets/logo-medaille.webp" alt="Logo Comité" style={{ width: 40, height: 40, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))' }} />
          <div style={{ lineHeight: 1.2 }}>
            <div className="display" style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', maxWidth: 200 }}>Comité des Salons et Concours de Mâcon</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>EXTRANET</div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 480 }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ background: 'rgba(255,255,255,0.13)', borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.22)', display: 'inline-block', backdropFilter: 'blur(4px)' }}>
              <img
                src={isMPG ? 'logo-mpg.png' : 'logo-sdv.png'}
                alt={isMPG ? 'Marché des Plaisirs Gourmands' : 'Salon des Vins de Mâcon'}
                style={{ width: 190, height: 'auto', display: 'block', borderRadius: 8 }}
              />
            </div>
          </div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginBottom: 12 }}>
            {isMPG ? 'Marché des Plaisirs Gourmands' : 'Salon des Vins de Mâcon'}
          </div>
          <h1 className="display" style={{ fontSize: 44, fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', margin: 0, color: '#fff' }}>
            {isMPG ? <>Marché des<br /><span style={{ fontStyle: 'italic', color: 'rgba(255,220,120,0.9)' }}>Plaisirs Gourmands</span></> : <>Salon des Vins<br /><span style={{ fontStyle: 'italic', color: 'rgba(255,220,120,0.9)' }}>de Mâcon</span></>}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', marginTop: 20, lineHeight: 1.6 }}>
            {isMPG
              ? 'Gérez votre stand, vos documents et votre règlement pour l\'édition 2026 du Marché des Plaisirs Gourmands.'
              : 'Gérez votre stand, vos documents et votre règlement pour l\'édition 2026 du Salon des Vins de Mâcon.'}
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1, fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'flex', justifyContent: 'space-between' }}>
          <span>© Comité des Salons et Concours de Mâcon</span>
          <span>V0.1 • Last release 05/05/2026</span>
        </div>
      </aside>
    );
  }

  // Panneau générique concours (Admin / Producteur / Dégustateur / Exposant global)
  return (
    <aside style={{
      position: 'relative',
      background: 'linear-gradient(160deg, var(--burgundy-900) 0%, var(--burgundy-800) 50%, #3d0f31 100%)',
      padding: '48px 56px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      overflow: 'hidden', color: 'rgb(207, 175, 72)',
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(212,160,23,0.08), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.04), transparent 50%)', pointerEvents: 'none' }} />
      <svg style={{ position: 'absolute', right: -120, top: 80, opacity: 0.08 }} width="500" height="500" viewBox="0 0 500 500">
        <circle cx="250" cy="250" r="240" fill="none" stroke="#fff" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="200" fill="none" stroke="#fff" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="160" fill="none" stroke="#fff" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="120" fill="none" stroke="#fff" strokeWidth="0.5" />
      </svg>

      <div style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 14 }}>
        <img src="assets/logo-medaille.webp" alt="Logo Comité" style={{ width: 48, height: 48, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))' }} />
        <div style={{ lineHeight: 1.2 }}>
          <div className="display" style={{ fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', maxWidth: 200 }}>Comité des Salons et Concours de Mâcon</div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>EXTRANET</div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 480 }}>
        <h1 className="display" style={{ fontSize: 52, fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', margin: 0, color: '#fff' }}>
          Concours des Grands Vins de France & du Monde<br />
          <span style={{ fontStyle: 'italic', color: 'var(--gold-300)' }}>à Mâcon</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="assets/medaille-or.webp" alt="CGVF" style={{ width: 44, height: 44, objectFit: 'contain', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.3))' }} />
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.82)', fontWeight: 500, lineHeight: 1.3 }}>Concours des<br />Grands Vins de France</div>
          </div>
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src="logo-comite-vin-monde.png" alt="CGVM" style={{ width: 34, height: 34, objectFit: 'contain' }} />
            </div>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.82)', fontWeight: 500, lineHeight: 1.3 }}>Concours des<br />Grands Vins du Monde</div>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, fontSize: 12, color: 'rgba(255,255,255,0.45)', display: 'flex', justifyContent: 'space-between' }}>
        <span>© Comité des Salons et Concours de Mâcon</span>
        <span>V0.1 • Last realease 05/05/2026</span>
      </div>
    </aside>
  );
};

const Login = ({ onLogin, initialPortal }) => {
  const [step, setStep] = React.useState(initialPortal ? 'creds' : 'portal');
  const [portal, setPortal] = React.useState(initialPortal || null);
  const [salon, setSalon] = React.useState(null); // sous-sas exposant
  const [showPwd, setShowPwd] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  // Pré-remplissage des identifiants démo
  React.useEffect(() => {
    if (portal && step === 'creds') {
      const defaultEmails = {
        admin:       'sophie.lambert@comite-macon.fr',
        producteur:  'contact@domaine-des-3-pierres.fr',
        degustateur: 'p.bouvier@oenologie.fr',
        exposant:    'marie.dupont@domaine-3-pierres.fr',
      };
      if (portal === 'exposant' && salon) {
        const salonData = SALONS_SAS.find(s => s.id === salon);
        setEmail(salonData?.email || defaultEmails.exposant);
      } else {
        setEmail(defaultEmails[portal] || '');
      }
      setPwd('••••••••••');
    }
  }, [portal, salon, step]);

  const selectPortal = (id) => {
    setPortal(id);
    if (id === 'exposant') {
      setStep('salon');
    } else {
      setStep('creds');
    }
  };

  const selectSalon = (id) => {
    setSalon(id);
    setStep('creds');
  };

  const goBack = () => {
    if (step === 'creds' && portal === 'exposant') {
      setStep('salon');
      setEmail(''); setPwd('');
    } else if (step === 'creds' || step === 'salon') {
      setStep('portal');
      setPortal(null); setSalon(null);
      setEmail(''); setPwd('');
    }
  };

  const submit = (e) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => { onLogin(portal); setLoading(false); }, 600);
  };

  // Données d'habillage du formulaire d'identifiants
  const getCredContext = () => {
    if (portal === 'exposant' && salon) {
      return SALONS_SAS.find(s => s.id === salon);
    }
    return portals.find(p => p.id === portal);
  };
  const ctx = getCredContext();

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1.05fr', background: 'var(--bg-app)' }}>

      <LeftPanel portal={portal} salon={salon} />

      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 440 }}>

          {/* ── Étape 1 : choix du portail ── */}
          {step === 'portal' && (
            <div className="fade-in">
              <div style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--burgundy-800)', fontWeight: 600, marginBottom: 8 }}>
                Connexion à l'extranet
              </div>
              <h2 className="display" style={{ fontSize: 32, fontWeight: 500, margin: 0, letterSpacing: '-0.025em' }}>
                Choisissez votre espace
              </h2>
              <p style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 8, marginBottom: 28 }}>
                Quatre portails, quatre usages métier distincts.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {portals.map(p => (
                  <button key={p.id} onClick={() => selectPortal(p.id)} style={{
                    textAlign: 'left', padding: '18px 20px',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 12, cursor: 'pointer', transition: 'all .18s ease',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--burgundy-300)'; e.currentTarget.style.background = 'var(--burgundy-50)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: p.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {p.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--fg)' }}>{p.name}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>{p.desc}</div>
                    </div>
                    <Icon.ChevronRight size={18} style={{ color: 'var(--fg-subtle)' }} />
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 32, padding: '14px 16px', background: 'var(--burgundy-50)', borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Icon.Info size={16} style={{ color: 'var(--burgundy-800)', marginTop: 2 }} />
                <div style={{ fontSize: 12.5, color: 'var(--burgundy-900)' }}>
                  <strong>Première visite ?</strong> Les producteurs créent leur compte directement depuis leur portail. Les dégustateurs font une pré-inscription sur le site.
                </div>
              </div>
            </div>
          )}

          {/* ── Étape 2 (exposant) : choix du salon ── */}
          {step === 'salon' && (
            <div className="fade-in">
              <button type="button" onClick={goBack} className="btn btn-ghost btn-sm" style={{ marginLeft: -10, marginBottom: 18 }}>
                <Icon.ChevronLeft size={14} /> Changer d'espace
              </button>
              <div style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#166534', fontWeight: 600, marginBottom: 8 }}>
                ESPACE EXPOSANT
              </div>
              <h2 className="display" style={{ fontSize: 28, fontWeight: 500, margin: 0, letterSpacing: '-0.025em' }}>
                Choisissez votre salon
              </h2>
              <p style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 8, marginBottom: 28 }}>
                Chaque salon a son propre accès — ou connectez-vous à tous vos salons en une fois.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SALONS_SAS.map(s => (
                  <button key={s.id} onClick={() => selectSalon(s.id)} style={{
                    textAlign: 'left', padding: '18px 20px',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 12, cursor: 'pointer', transition: 'all .18s ease',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = `${s.color}0d`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}
                  >
                    {s.logoSrc
                      ? <div style={{ width: 52, height: 52, borderRadius: 10, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
                          <img src={s.logoSrc} alt={s.name} style={{ width: 46, height: 46, objectFit: 'contain' }}/>
                        </div>
                      : <div style={{ width: 44, height: 44, borderRadius: '50%', background: s.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
                    }
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--fg)' }}>{s.name}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>{s.sub}</div>
                    </div>
                    <Icon.ChevronRight size={18} style={{ color: 'var(--fg-subtle)' }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Étape 3 : formulaire identifiants ── */}
          {step === 'creds' && portal && ctx && (
            <form onSubmit={submit} className="fade-in">
              <button type="button" onClick={goBack} className="btn btn-ghost btn-sm" style={{ marginLeft: -10, marginBottom: 18 }}>
                <Icon.ChevronLeft size={14} /> {portal === 'exposant' ? 'Changer de salon' : 'Changer d\'espace'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                {ctx.logoSrc
                  ? <div style={{ width: 56, height: 56, borderRadius: 12, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.1)' }}>
                      <img src={ctx.logoSrc} alt={ctx.name} style={{ width: 50, height: 50, objectFit: 'contain' }}/>
                    </div>
                  : <div style={{ width: 40, height: 40, borderRadius: '50%', background: ctx.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{ctx.icon}</div>
                }
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-muted)', fontWeight: 600 }}>
                    {ctx.credLabel}
                  </div>
                  <h2 className="display" style={{ fontSize: 22, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>
                    {ctx.credTitle}
                  </h2>
                  <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginTop: 2 }}>{ctx.credSub}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="field">
                  <label className="field-label">Adresse e-mail</label>
                  <div className="input-with-icon">
                    <Icon.Mail size={15} className="input-icon" />
                    <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.fr" autoFocus />
                  </div>
                </div>

                <div className="field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="field-label">Mot de passe</label>
                    <a href="#" style={{ fontSize: 12, color: ctx.color, fontWeight: 500 }} onClick={e => e.preventDefault()}>Mot de passe oublié ?</a>
                  </div>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <Icon.Lock size={15} className="input-icon" />
                    <input className="input" type={showPwd ? 'text' : 'password'} value={pwd} onChange={e => setPwd(e.target.value)} style={{ paddingRight: 40 }} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="btn btn-icon btn-sm" style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', height: 30, width: 30, background: 'transparent' }}>
                      {showPwd ? <Icon.EyeOff size={15} /> : <Icon.Eye size={15} />}
                    </button>
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--slate-700)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: ctx.color }} />
                  <span>Rester connecté pendant 30 jours</span>
                </label>

                <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 4, background: ctx.color }}>
                  {loading
                    ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.2-8.6" /></svg> Connexion…</>
                    : <>Se connecter <Icon.ArrowRight size={16} /></>
                  }
                </button>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

                {portal === 'producteur' && (
                  <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)', marginTop: 8 }}>
                    Pas encore de compte ? <a href="#" onClick={e => e.preventDefault()} style={{ color: ctx.color, fontWeight: 500 }}>Créer mon espace producteur</a>
                  </div>
                )}
                {portal === 'exposant' && (
                  <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)', marginTop: 8 }}>
                    Pas encore de compte ? <a href="#" onClick={e => e.preventDefault()} style={{ color: ctx.color, fontWeight: 500 }}>Créer mon espace exposant</a>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)', fontSize: 11.5, color: 'var(--fg-subtle)', textAlign: 'center' }}>
                Connexion sécurisée · TLS 1.3 · Conforme RGPD
              </div>
            </form>
          )}

        </div>
      </main>
    </div>
  );
};

window.Login = Login;
