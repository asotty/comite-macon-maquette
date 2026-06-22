// SAS / Login screen — chooses between 3 portals (Admin / Producteur / Dégustateur)
// then shows a credential form.

const portals = [
{
  id: 'admin',
  name: 'Administration',
  sub: 'Comité — équipe interne',
  desc: 'Gestion des inscriptions, palmarès, commandes, dégustateurs et paramétrage.',
  icon: <Icon.ShieldCheck size={20} />,
  color: 'var(--burgundy-800)'
},
{
  id: 'producteur',
  name: 'Producteur',
  sub: 'Domaines & maisons',
  desc: 'Inscription au concours, soumission d\'échantillons, commande de médailles.',
  icon: <Icon.Wine size={20} />,
  color: 'var(--burgundy-700)'
},
{
  id: 'degustateur',
  name: 'Dégustateur',
  sub: 'Jury & professionnels',
  desc: 'Formations, repas, disponibilités et préférences de dégustation.',
  icon: <Icon.Award size={20} />,
  color: 'var(--burgundy-600)'
},
{
  id: 'exposant',
  name: 'Exposant',
  sub: 'Salons & marchés',
  desc: 'Inscription aux salons (SDV, MPG), suivi de votre stand et règlement.',
  icon: <Icon.Building size={20} />,
  color: '#166534'
}];


const Login = ({ onLogin, initialPortal }) => {
  const [step, setStep] = React.useState(initialPortal ? 'creds' : 'portal');
  const [portal, setPortal] = React.useState(initialPortal || null);
  const [showPwd, setShowPwd] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  // Prefill demo credentials on portal selection
  React.useEffect(() => {
    if (portal) {
      const map = {
        admin:       { email: 'sophie.lambert@comite-macon.fr',        pwd: '••••••••••' },
        producteur:  { email: 'contact@domaine-des-3-pierres.fr',      pwd: '••••••••••' },
        degustateur: { email: 'p.bouvier@oenologie.fr',                pwd: '••••••••••' },
        exposant:    { email: 'marie.dupont@domaine-3-pierres.fr',     pwd: '••••••••••' },
      };
      setEmail(map[portal].email);
      setPwd(map[portal].pwd);
    }
  }, [portal]);

  const submit = (e) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => {onLogin(portal);setLoading(false);}, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1.05fr',
      background: 'var(--bg-app)'
    }}>
      {/* LEFT — editorial brand panel */}
      <aside style={{
        position: 'relative',
        background: 'linear-gradient(160deg, var(--burgundy-900) 0%, var(--burgundy-800) 50%, #3d0f31 100%)',

        padding: '48px 56px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden', color: "rgb(207, 175, 72)"
      }}>
        {/* Decorative grain / texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(212,160,23,0.08), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.04), transparent 50%)',
          pointerEvents: 'none'
        }} />
        {/* Décor: cercles concentriques évoquant un sceau */}
        <svg style={{ position: 'absolute', right: -120, top: 80, opacity: 0.08 }} width="500" height="500" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="240" fill="none" stroke="#fff" strokeWidth="0.5" />
          <circle cx="250" cy="250" r="200" fill="none" stroke="#fff" strokeWidth="0.5" />
          <circle cx="250" cy="250" r="160" fill="none" stroke="#fff" strokeWidth="0.5" />
          <circle cx="250" cy="250" r="120" fill="none" stroke="#fff" strokeWidth="0.5" />
        </svg>

        {/* Logo + nom Comité — haut gauche */}
        <div style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 14 }}>
          <img src="assets/logo-medaille.webp" alt="Logo Comité" style={{
            width: 48, height: 48,
            objectFit: 'contain',
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))'
          }} />
          <div style={{ lineHeight: 1.2 }}>
            <div className="display" style={{ fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', maxWidth: 200 }}>
              Comité des Salons et Concours de Mâcon
            </div>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>EXTRANET</div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 480 }}>
          <h1 className="display" style={{ fontSize: 52, fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', margin: 0, color: 'rgb(255, 255, 255)' }}>
            Concours des Grands Vins de France & du Monde<br />
            <span style={{ fontStyle: 'italic', color: 'var(--gold-300)' }}>à Mâcon</span>
          </h1>

          {/* Logos CGVF et CGVM côte à côte */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 32 }}>
            {/* CGVF */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="assets/medaille-or.webp" alt="CGVF"
                style={{ width: 44, height: 44, objectFit: 'contain', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.3))' }} />
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.82)', fontWeight: 500, lineHeight: 1.3 }}>
                Concours des<br />Grands Vins de France
              </div>
            </div>
            {/* séparateur */}
            <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.2)' }} />
            {/* CGVM */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(255,255,255,0.92)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <img src="logo-comite-vin-monde.png" alt="CGVM"
                  style={{ width: 34, height: 34, objectFit: 'contain' }} />
              </div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.82)', fontWeight: 500, lineHeight: 1.3 }}>
                Concours des<br />Grands Vins du Monde
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, fontSize: 12, color: 'rgba(255,255,255,0.45)', display: 'flex', justifyContent: 'space-between' }}>
          <span>© Comité des Salons et Concours de Mâcon</span>
          <span>V0.1 • Last realease 05/05/2026</span>
        </div>
      </aside>

      {/* RIGHT — portal picker / credentials */}
      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {step === 'portal' &&
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
                {portals.map((p) =>
              <button key={p.id}
              onClick={() => {setPortal(p.id);setStep('creds');}}
              style={{
                textAlign: 'left',
                padding: '18px 20px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                cursor: 'pointer',
                transition: 'all .18s ease',
                display: 'flex', alignItems: 'center', gap: 16
              }}
              onMouseEnter={(e) => {e.currentTarget.style.borderColor = 'var(--burgundy-300)';e.currentTarget.style.background = 'var(--burgundy-50)';}}
              onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'var(--border)';e.currentTarget.style.background = 'var(--surface)';}}>
                
                    <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: p.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>{p.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--fg)' }}>{p.name}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>{p.desc}</div>
                    </div>
                    <Icon.ChevronRight size={18} style={{ color: 'var(--fg-subtle)' }} />
                  </button>
              )}
              </div>

              <div style={{ marginTop: 32, padding: '14px 16px', background: 'var(--burgundy-50)', borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Icon.Info size={16} style={{ color: 'var(--burgundy-800)', marginTop: 2 }} />
                <div style={{ fontSize: 12.5, color: 'var(--burgundy-900)' }}>
                  <strong>Première visite ?</strong> Les producteurs créent leur compte directement depuis leur portail. Les dégustateurs font une pré-inscription sur le site.
                </div>
              </div>
            </div>
          }

          {step === 'creds' && portal &&
          <form onSubmit={submit} className="fade-in">
              <button type="button" onClick={() => setStep('portal')}
            className="btn btn-ghost btn-sm" style={{ marginLeft: -10, marginBottom: 18 }}>
                <Icon.ChevronLeft size={14} /> Changer d'espace
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: portals.find((p) => p.id === portal).color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                  {portals.find((p) => p.id === portal).icon}
                </div>
                <div>
                  <div style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-muted)', fontWeight: 500 }}>Espace {portal}</div>
                  <h2 className="display" style={{ fontSize: 22, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>
                    Bon retour parmi nous
                  </h2>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="field">
                  <label className="field-label">Adresse e-mail</label>
                  <div className="input-with-icon">
                    <Icon.Mail size={15} className="input-icon" />
                    <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.fr" autoFocus />
                  </div>
                </div>

                <div className="field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="field-label">Mot de passe</label>
                    <a href="#" style={{ fontSize: 12, color: 'var(--burgundy-800)', fontWeight: 500 }} onClick={(e) => e.preventDefault()}>Mot de passe oublié ?</a>
                  </div>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <Icon.Lock size={15} className="input-icon" />
                    <input className="input" type={showPwd ? 'text' : 'password'} value={pwd} onChange={(e) => setPwd(e.target.value)} style={{ paddingRight: 40 }} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="btn btn-icon btn-sm" style={{
                    position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', height: 30, width: 30, background: 'transparent'
                  }}>
                      {showPwd ? <Icon.EyeOff size={15} /> : <Icon.Eye size={15} />}
                    </button>
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--slate-700)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ accentColor: 'var(--burgundy-800)' }} />
                  <span>Rester connecté pendant 30 jours</span>
                </label>

                <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 4 }}>
                  {loading ?
                <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.2-8.6" />
                      </svg>
                      Connexion…
                    </> :

                <>Se connecter <Icon.ArrowRight size={16} /></>
                }
                </button>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

                {portal === 'producteur' &&
              <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)', marginTop: 8 }}>
                    Pas encore de compte ? <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--burgundy-800)', fontWeight: 500 }}>Créer mon espace producteur</a>
                  </div>
              }
                {portal === 'exposant' &&
              <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)', marginTop: 8 }}>
                    Pas encore de compte ? <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#166534', fontWeight: 500 }}>Créer mon espace exposant</a>
                  </div>
              }
              </div>

              <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)', fontSize: 11.5, color: 'var(--fg-subtle)', textAlign: 'center' }}>
                Connexion sécurisée · TLS 1.3 · Conforme RGPD
              </div>
            </form>
          }
        </div>
      </main>
    </div>);

};

window.Login = Login;