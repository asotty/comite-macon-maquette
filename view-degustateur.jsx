// =====================================================================
// Dégustateur — toutes les vues : Dashboard / Formations / Repas /
// Prochains concours / Disponibilités / Mon compte
// =====================================================================

const USER_DEGUSTATEUR = {
  prenom: 'Pierre',
  nom: 'Bouvier',
  email: 'pierre.bouvier@oenologue.fr',
  telephone: '06 14 22 89 03',
  adresse1: '12 rue des Carmes',
  adresse2: '',
  cp: '71000',
  ville: 'Mâcon',
  pays: 'France',
  organisme: 'Cabinet Bouvier Œnologie',
  regionHabituelle: 'Mâconnais',
  // Régime alimentaire (par défaut, transmis à chaque réservation de repas)
  regime: { vegetarien: false, vegan: false, sansGluten: false, sansPorc: true, allergieFruitsACoque: false, autre: '' },
};

const REGIME_OPTIONS = [
  { id: 'vegetarien',           label: 'Végétarien' },
  { id: 'vegan',                label: 'Végan' },
  { id: 'sansGluten',           label: 'Sans gluten' },
  { id: 'sansPorc',             label: 'Sans porc' },
  { id: 'allergieFruitsACoque', label: 'Allergie aux fruits à coque' },
];

// Résumé textuel d'un objet régime
function regimeSummary(r) {
  const yes = REGIME_OPTIONS.filter(o => r[o.id]).map(o => o.label);
  if (r.autre) yes.push(r.autre);
  if (yes.length === 0) return 'Aucune restriction déclarée';
  return yes.join(' · ');
}

const DEGUST_CRENEAUX = [
  { id: 'cf-s1', concours: 'Concours France 2026', label: 'Session 1', date: '14 mars 2026', heure: '8h – 12h',   lieu: 'Mâcon' },
  { id: 'cf-s2', concours: 'Concours France 2026', label: 'Session 2', date: '14 mars 2026', heure: '14h – 18h',  lieu: 'Mâcon' },
  { id: 'cf-s3', concours: 'Concours France 2026', label: 'Session 3', date: '21 mars 2026', heure: '8h – 12h',   lieu: 'Mâcon' },
  { id: 'cm-s1', concours: 'Concours Monde 2026',  label: 'Session 1', date: '04 avril 2026', heure: '8h – 12h',  lieu: 'Mâcon' },
  { id: 'cm-s2', concours: 'Concours Monde 2026',  label: 'Session 2', date: '04 avril 2026', heure: '14h – 18h', lieu: 'Mâcon' },
];

// =====================================================================
// 1 — Dashboard
// =====================================================================

const DegustateurDashboard = ({ onNavigate }) => {
  const sessions = [
    { id: 's1', date: '24 mai 2026',  heure: '9h – 18h', concours: 'Concours France',  jury: 'Jury n°4 · Mâconnais blanc',  table: 'Table 7', lieu: 'Mâcon' },
    { id: 's2', date: '14 juin 2026', heure: '9h – 17h', concours: 'Concours Monde',   jury: 'Jury n°2 · Vins blancs',      table: 'Table 3', lieu: 'Mâcon' },
  ];
  const formations = [
    { id: 'f1', titre: 'Nouvelles méthodes OIV', date: '21 juin 2026', lieu: 'En ligne', duree: '3 h' },
  ];
  const repas = [
    { id: 'r1', date: '25 mai 2026',  evt: 'Repas du Comité',       lieu: 'Restaurant Saint-Vincent · Mâcon' },
    { id: 'r2', date: '14 juin 2026', evt: 'Déjeuner Concours Monde', lieu: 'Salle du Comité · Mâcon' },
  ];
  const dispoCount = 4;
  const dispoTotal = DEGUST_CRENEAUX.length;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 className="display" style={{ fontSize: 32, fontWeight: 500, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>
          Bonjour, {USER_DEGUSTATEUR.prenom}
        </h1>
        <div style={{ marginTop: 8, fontSize: 14, color: 'var(--fg-muted)' }}>
          Voici un résumé de votre activité de dégustateur pour les semaines à venir.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Mes prochaines sessions */}
        <div className="card" style={{ padding: 0 }}>
          <DashCardHeader
            title="Mes prochaines sessions"
            sub="Dégustations auxquelles vous êtes convoqué"
            onSeeAll={() => onNavigate('d-concours')}
          />
          <div style={{ padding: '4px 22px 18px' }}>
            {sessions.length === 0 ? (
              <EmptyDash icon={<Icon.Trophy size={18}/>} label="Aucune session assignée"
                hint="Le jury n'est pas encore composé. Vous serez notifié par email."/>
            ) : (
              sessions.map((s, i) => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 0',
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8,
                    background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon.Calendar size={16}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{s.concours} · {s.date}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>{s.jury} · {s.table} · {s.heure}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Formations à venir */}
        <div className="card" style={{ padding: 0 }}>
          <DashCardHeader
            title="Formations à venir"
            sub="Sessions organisées par le Comité"
            onSeeAll={() => onNavigate('d-formations')}
          />
          <div style={{ padding: '4px 22px 18px' }}>
            {formations.length === 0 ? (
              <EmptyDash icon={<Icon.ListChecks size={18}/>} label="Aucune formation programmée" hint="Revenez bientôt."/>
            ) : (
              formations.map((f, i) => (
                <div key={f.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 0',
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8,
                    background: 'var(--gold-100)', color: 'var(--gold-700)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon.ListChecks size={16}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{f.titre}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>{f.date} · {f.lieu} · {f.duree}</div>
                  </div>
                  <button onClick={() => onNavigate('d-formations')} className="btn btn-outline btn-sm">Voir</button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Repas réservés */}
        <div className="card" style={{ padding: 0 }}>
          <DashCardHeader
            title="Repas réservés"
            sub="Mes réservations confirmées"
            onSeeAll={() => onNavigate('d-repas-mes')}
          />
          <div style={{ padding: '4px 22px 18px' }}>
            {repas.length === 0 ? (
              <EmptyDash icon={<Icon.Mail size={18}/>} label="Aucun repas réservé" hint="Consultez les repas à venir."/>
            ) : (
              repas.map((r, i) => (
                <div key={r.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 0',
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8,
                    background: '#eef4ff', color: '#1e40af',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon.Calendar size={16}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{r.evt}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>{r.date} · {r.lieu}</div>
                  </div>
                  <span className="badge badge-success"><Icon.Check size={11}/> Réservé</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mes disponibilités */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Mes disponibilités</div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2, marginBottom: 18 }}>
            Pour les prochaines sessions de dégustation
          </div>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 8,
            marginBottom: 14,
          }}>
            <span className="display tnum" style={{ fontSize: 30, fontWeight: 500, color: 'var(--burgundy-800)' }}>{dispoCount}</span>
            <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
              créneaux déclarés sur <span style={{ color: 'var(--fg)' }}>{dispoTotal}</span> proposés
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: 'var(--slate-100)', overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ height: '100%', width: (dispoCount / dispoTotal * 100) + '%', background: 'var(--burgundy-800)' }}/>
          </div>
          <button onClick={() => onNavigate('d-disponibilites')} className="btn btn-outline" style={{ width: '100%' }}>
            <Icon.Edit size={13}/> Mettre à jour mes disponibilités
          </button>
        </div>
      </div>
    </div>
  );
};

const DashCardHeader = ({ title, sub, onSeeAll }) => (
  <div style={{ padding: '18px 22px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <div>
      <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</div>
      <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>{sub}</div>
    </div>
    {onSeeAll && (
      <button onClick={onSeeAll} style={{
        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
        fontSize: 12.5, color: 'var(--burgundy-800)', fontWeight: 500, fontFamily: 'inherit',
      }}>Voir tout →</button>
    )}
  </div>
);

const EmptyDash = ({ icon, label, hint }) => (
  <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--fg-muted)' }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: 'var(--slate-100)', color: 'var(--fg-subtle)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 8,
    }}>{icon}</div>
    <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>{label}</div>
    {hint && <div style={{ fontSize: 12, marginTop: 4 }}>{hint}</div>}
  </div>
);

// =====================================================================
// 2 — Formations (liste) & 3 — Détail
// =====================================================================

const FORMATIONS_DATA = [
  { id: 'fo1', date: '21 juin 2026',  heure: '14h – 17h',   lieu: 'En ligne (Zoom)',
    titre: 'Nouvelles méthodes OIV 2026', duree: '3 h',
    intervenant: 'Dr. Hélène Marchand', intervenantRole: 'OIV — Référente méthodes analytiques',
    placesRest: 12, placesTotal: 30,
    description: "Présentation des dernières évolutions méthodologiques de l'OIV pour la dégustation officielle des vins. La session couvre les nouveaux protocoles de mise en bouche, la grille de notation 2026 révisée, et les retours d'expérience des concours internationaux 2025.",
  },
  { id: 'fo2', date: '18 sept. 2026', heure: '9h – 18h',     lieu: 'Mâcon · Maison du Vin',
    titre: 'Initiation aux vins effervescents', duree: '1 journée',
    intervenant: 'Marc Leblanc', intervenantRole: 'Chef sommelier · Crémant-de-Bourgogne',
    placesRest: 0, placesTotal: 20,
    description: "Journée complète d'initiation aux méthodes de dégustation des vins effervescents : technique de la perle, équilibre acidité-bulles, analyse sensorielle spécifique. Atelier pratique sur 24 cuvées (Crémant, Champagne, méthodes ancestrales).",
  },
  { id: 'fo3', date: '15 oct. 2026',  heure: '10h – 16h',    lieu: 'Beaune · Hospices',
    titre: 'Vins rouges du Beaujolais et Bourgogne sud', duree: '6 h',
    intervenant: 'Christine Vauthier', intervenantRole: 'Œnologue conseil',
    placesRest: 6, placesTotal: 20,
    description: 'Formation comparative sur les profils gustatifs des cépages Gamay et Pinot Noir dans le sud Bourgogne, avec dégustation de 18 cuvées représentatives.',
  },
];

const DegustateurFormations = ({ onOpen }) => (
  <div>
    <PageHeader
      title="Formations"
      subtitle="Sessions de formation organisées par le Comité"
    />

    {FORMATIONS_DATA.length === 0 ? (
      <Empty icon={<Icon.ListChecks size={20}/>} title="Aucune formation programmée pour le moment"
        hint="Revenez bientôt — les prochaines sessions seront annoncées par email."/>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {FORMATIONS_DATA.map(f => {
          const isFull = f.placesRest === 0;
          return (
            <div key={f.id} className="card" style={{ padding: 20, display: 'flex', gap: 18, alignItems: 'center' }}>
              <div style={{
                width: 64, padding: '8px 6px', textAlign: 'center',
                background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', borderRadius: 10,
                flexShrink: 0,
              }}>
                <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
                  {f.date.split(' ')[1]}
                </div>
                <div className="display" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1, margin: '4px 0' }}>
                  {f.date.split(' ')[0]}
                </div>
                <div style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{f.heure.split(' ')[0]}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>{f.titre}</div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <span>{f.lieu}</span>
                  <span>·</span>
                  <span>{f.duree}</span>
                  <span>·</span>
                  <span>{f.intervenant}</span>
                </div>
              </div>
              <span className={isFull ? 'badge badge-danger' : 'badge badge-success'}>
                <span className="badge-dot"/>
                {isFull ? 'Complet' : `${f.placesRest} place${f.placesRest > 1 ? 's' : ''}`}
              </span>
              <button onClick={() => onOpen(f)} className="btn btn-outline btn-sm">
                Voir le détail <Icon.ChevronRight size={13}/>
              </button>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const DegustateurFormationDetail = ({ formation, onBack }) => {
  const f = formation;
  const isFull = f.placesRest === 0;
  return (
    <div>
      <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ marginLeft: -10, marginBottom: 16 }}>
        <Icon.ChevronLeft size={14}/> Formations
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 28 }}>
        <div>
          <h1 className="display" style={{ fontSize: 28, fontWeight: 500, margin: 0, letterSpacing: '-0.025em' }}>{f.titre}</h1>
          <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 6 }}>{f.duree} · {f.intervenant}</div>
        </div>
        <span className={isFull ? 'badge badge-danger' : 'badge badge-success'} style={{ fontSize: 13, padding: '4px 12px' }}>
          <span className="badge-dot"/>
          {isFull ? 'Complet' : `${f.placesRest} place${f.placesRest > 1 ? 's' : ''} disponible${f.placesRest > 1 ? 's' : ''}`}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'flex-start' }}>
        {/* Colonne gauche */}
        <div>
          {/* Infos pratiques */}
          <div className="card" style={{ padding: 22, marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <InfoLine label="Date" value={f.date}/>
              <InfoLine label="Horaires" value={f.heure}/>
              <InfoLine label="Lieu" value={f.lieu} gridSpan={2}/>
              <InfoLine label="Intervenant" value={<span><strong>{f.intervenant}</strong><br/><span style={{ color: 'var(--fg-muted)', fontSize: 12.5 }}>{f.intervenantRole}</span></span>} gridSpan={2}/>
            </div>
          </div>

          {/* Description */}
          <div className="card" style={{ padding: 22 }}>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 10 }}>Description</div>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--slate-700)', textWrap: 'pretty' }}>
              {f.description}
            </p>
          </div>
        </div>

        {/* Bloc contact */}
        <div className="card" style={{ padding: 22, background: 'var(--surface-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon.Info size={15}/>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Inscription</div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-muted)', margin: '0 0 16px', lineHeight: 1.55 }}>
            Pas d'inscription automatique en ligne. Pour réserver votre place ou poser une question, contactez directement le secrétariat du Comité.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a href="mailto:formations@comite-macon.fr" className="btn btn-primary" style={{ width: '100%' }}>
              <Icon.Mail size={14}/> formations@comite-macon.fr
            </a>
            <a href="tel:+33385350000" className="btn btn-outline" style={{ width: '100%' }}>
              <Icon.Phone size={14}/> 03 85 35 00 00
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoLine = ({ label, value, gridSpan }) => (
  <div style={{ gridColumn: gridSpan ? 'span ' + gridSpan : undefined }}>
    <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 14, marginTop: 4 }}>{value}</div>
  </div>
);

// Wrapper liste ↔ détail
const DegustateurFormationsWrapper = () => {
  const [viewing, setViewing] = React.useState(null);
  if (viewing) return <DegustateurFormationDetail formation={viewing} onBack={() => setViewing(null)}/>;
  return <DegustateurFormations onOpen={setViewing}/>;
};

// =====================================================================
// 4 — Repas (à venir + actions) & 5 — Mes réservations
// =====================================================================

const REPAS_INIT = [
  { id: 'r1', date: '24 mai 2026',  evt: 'Déjeuner Concours France', lieu: 'Salle du Comité · Mâcon',         places: 8,  prix: 0,     reserved: true,  paye: true, status: 'confirmee' },
  { id: 'r2', date: '25 mai 2026',  evt: 'Repas du Comité',          lieu: 'Restaurant Saint-Vincent · Mâcon', places: 12, prix: 38.00, reserved: true,  paye: true, status: 'confirmee' },
  { id: 'r3', date: '14 juin 2026', evt: 'Déjeuner Concours Monde',  lieu: 'Salle du Comité · Mâcon',         places: 24, prix: 18.00, reserved: false, paye: false, status: null },
  { id: 'r4', date: '14 juin 2026', evt: 'Soirée de gala — Palmarès',lieu: 'Château de Pierreclos',           places: 4,  prix: 65.00, reserved: false, paye: false, status: null },
  { id: 'r5', date: '21 juin 2026', evt: 'Buffet formation OIV',     lieu: 'Maison du Vin · Mâcon',           places: 0,  prix: 0,     reserved: false, paye: false, status: null },
];

const formatPrix = (n) => n === 0 ? 'Gratuit' : n.toFixed(2).replace('.', ',') + ' €';

const DegustateurRepas = ({ onNavigate }) => {
  const [repas, setRepas] = React.useState(REPAS_INIT);
  const [reserving, setReserving] = React.useState(null); // repas en cours de réservation
  const [confirmedPayment, setConfirmedPayment] = React.useState(null); // { repas, regime, payment }
  const upcoming = repas.filter(r => !r.reserved || r.status === 'confirmee');

  const handleConfirm = ({ repas: r, regime, paid, nbAccomp = 0, montant }) => {
    setRepas(rs => rs.map(x => x.id === r.id ? { ...x, reserved: true, status: 'confirmee', paye: paid, places: x.places - 1, regime } : x));
    setReserving(null);
    if (paid && r.prix > 0) {
      setConfirmedPayment({
        repas: r, regime, nbAccomp,
        montant: montant || r.prix,
        ref: 'PAY-RPS-' + Math.floor(100000 + Math.random() * 900000),
      });
    }
  };
  const annuler = (id) => setRepas(rs => rs.map(r => r.id === id ? { ...r, reserved: false, status: null, paye: false, places: r.places + 1 } : r));

  // Si paiement confirmé → page de confirmation dédiée
  if (confirmedPayment) {
    return <RepasPaymentConfirmation
      payment={confirmedPayment}
      onContinue={() => { setConfirmedPayment(null); onNavigate('d-repas-mes'); }}
      onClose={() => setConfirmedPayment(null)}
    />;
  }

  return (
    <div>
      <PageHeader
        title="Repas"
        subtitle="Repas organisés à l'occasion des concours et événements"
        actions={
          <button onClick={() => onNavigate('d-repas-mes')} className="btn btn-outline">
            <Icon.ListChecks size={14}/> Voir mes réservations
          </button>
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {upcoming.map(r => {
          const isFull = r.places === 0 && !r.reserved;
          return (
            <div key={r.id} className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 60, padding: '8px 4px', textAlign: 'center',
                background: r.reserved ? 'var(--success-bg)' : 'var(--burgundy-50)',
                color: r.reserved ? '#166534' : 'var(--burgundy-800)',
                borderRadius: 10,
                flexShrink: 0,
              }}>
                <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{r.date.split(' ')[1]}</div>
                <div className="display" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1, margin: '4px 0' }}>{r.date.split(' ')[0]}</div>
                <div style={{ fontSize: 10, opacity: 0.7 }}>{r.date.split(' ')[2]}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>{r.evt}</div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>{r.lieu}</div>
              </div>

              {/* Bloc droite : info + prix + action */}
              <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', textAlign: 'right', minWidth: 130 }}>
                {r.reserved ? (
                  <span style={{ color: 'var(--success)', fontWeight: 500 }}>Place réservée</span>
                ) : isFull ? (
                  <span style={{ color: 'var(--danger)', fontWeight: 500 }}>Complet</span>
                ) : (
                  <span className="tnum">{r.places} place{r.places > 1 ? 's' : ''} restantes</span>
                )}
                <div className="tnum" style={{
                  marginTop: 4,
                  fontSize: 13, fontWeight: 600,
                  color: r.prix === 0 ? 'var(--success)' : 'var(--fg)',
                }}>
                  {formatPrix(r.prix)}
                </div>
              </div>

              {r.reserved ? (
                <>
                  <span className="badge badge-success"><Icon.Check size={11}/> Réservé{r.paye && r.prix > 0 ? ' · Payé' : ''}</span>
                  <button onClick={() => annuler(r.id)} className="btn btn-ghost btn-sm">Annuler</button>
                </>
              ) : (
                <button
                  onClick={() => !isFull && setReserving(r)}
                  disabled={isFull}
                  className={isFull ? 'btn btn-sm' : 'btn btn-primary btn-sm'}
                  style={isFull ? { background: 'var(--slate-100)', color: 'var(--fg-muted)', cursor: 'not-allowed', border: '1px solid var(--border)' } : {}}
                >
                  <Icon.Plus size={13}/> {isFull ? 'Complet' : r.prix === 0 ? 'Réserver ma place' : '+ Réserver'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {reserving && (
        <ReservationModal
          repas={reserving}
          onClose={() => setReserving(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

// Modale de réservation — récap + régime alimentaire + CTA paiement/confirmation
const ReservationModal = ({ repas, onClose, onConfirm }) => {
  const [regime, setRegime] = React.useState(USER_DEGUSTATEUR.regime);
  const [nbAccomp, setNbAccomp] = React.useState(0);
  const isFree = repas.prix === 0;
  const prixAccomp = 28.00; // prix accompagnateur (issu des paramètres concours)
  const totalAmount = isFree ? 0 : repas.prix + nbAccomp * prixAccomp;

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(15,23,42,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
      animation: 'fadeIn .15s ease-out',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface)',
        borderRadius: 14,
        boxShadow: 'var(--shadow-lg)',
        width: '100%', maxWidth: 560,
        maxHeight: '90vh', overflow: 'auto',
        animation: 'modalIn .2s ease-out',
      }}>
        <div style={{ padding: '22px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <div className="display" style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.02em' }}>Réserver ce repas</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>
              Confirmez votre présence et indiquez vos restrictions alimentaires
            </div>
          </div>
          <button onClick={onClose} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
        </div>

        {/* Bloc 1 — Récapitulatif */}
        <div style={{ padding: '20px 24px 0' }}>
          <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Récapitulatif
          </div>
          <div style={{ padding: '14px 16px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.01em' }}>{repas.evt}</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <span><Icon.Calendar size={11} style={{ verticalAlign: -1 }}/> {repas.date}</span>
              <span style={{ color: 'var(--fg-subtle)' }}>·</span>
              <span>{repas.lieu}</span>
            </div>
          </div>
        </div>

        {/* Bloc 2 — MA PLACE (dégustateur) */}
        <div style={{ padding: '16px 24px 0' }}>
          <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Ma place
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10 }}>
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>Dégustateur</div>
            <div className="tnum" style={{ fontSize: 14, fontWeight: 600, color: isFree ? 'var(--success)' : 'var(--fg)' }}>
              {isFree ? 'Gratuit' : formatPrix(repas.prix)}
            </div>
          </div>
        </div>

        {/* Bloc 3 — ACCOMPAGNATEURS */}
        <div style={{ padding: '16px 24px 0' }}>
          <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Accompagnateurs
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10 }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>Nombre d'accompagnateurs</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>
                {isFree ? 'Gratuit · invités du comité' : formatPrix(prixAccomp) + ' / personne'}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setNbAccomp(Math.max(0, nbAccomp - 1))}
                className="btn btn-outline btn-sm btn-icon"
                style={{ width: 32, height: 32, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >−</button>
              <span className="tnum" style={{ fontSize: 16, fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{nbAccomp}</span>
              <button
                onClick={() => setNbAccomp(nbAccomp + 1)}
                className="btn btn-primary btn-sm btn-icon"
                style={{ width: 32, height: 32, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >+</button>
            </div>
          </div>
        </div>

        {/* Bloc 4 — Régime alimentaire */}
        <div style={{ padding: '16px 24px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Régime alimentaire
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>
                Pré-rempli depuis votre profil · modifiable pour ce repas uniquement
              </div>
            </div>
          </div>
          <RegimeFields regime={regime} onChange={setRegime}/>
        </div>

        {/* Total */}
        <div style={{ margin: '16px 24px 0', padding: '14px 16px', background: 'var(--burgundy-50)', border: '1px solid var(--burgundy-200)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--burgundy-800)', fontWeight: 500, marginBottom: 4 }}>Total</div>
            {!isFree && nbAccomp > 0 && (
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>
                1 × {formatPrix(repas.prix)} + {nbAccomp} × {formatPrix(prixAccomp)}
              </div>
            )}
          </div>
          <div className="tnum display" style={{ fontSize: 22, fontWeight: 600, color: isFree ? 'var(--success)' : 'var(--burgundy-900)' }}>
            {isFree ? 'Gratuit' : formatPrix(totalAmount)}
          </div>
        </div>

        <div style={{ padding: '16px 24px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} className="btn btn-outline">Annuler</button>
          {isFree ? (
            <button onClick={() => onConfirm({ repas, regime, paid: false, nbAccomp, montant: 0 })} className="btn btn-primary">
              <Icon.Check size={14}/> Confirmer ma réservation
            </button>
          ) : (
            <button onClick={() => onConfirm({ repas, regime, paid: true, nbAccomp, montant: totalAmount })} className="btn btn-primary">
              Réserver et payer · {formatPrix(totalAmount)} <Icon.ArrowRight size={14}/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Champs régime alimentaire (checkboxes + champ texte autre)
const RegimeFields = ({ regime, onChange }) => {
  const toggle = (id) => onChange({ ...regime, [id]: !regime[id] });
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {REGIME_OPTIONS.map(opt => {
          const checked = !!regime[opt.id];
          return (
            <label key={opt.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px',
              border: '1px solid ' + (checked ? 'var(--burgundy-300)' : 'var(--border)'),
              background: checked ? 'var(--burgundy-50)' : 'var(--surface)',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all .12s',
              fontSize: 13.5,
              fontWeight: checked ? 500 : 400,
              color: checked ? 'var(--burgundy-900)' : 'var(--fg)',
            }}>
              <input type="checkbox" checked={checked} onChange={() => toggle(opt.id)}
                style={{ accentColor: 'var(--burgundy-800)', margin: 0, width: 16, height: 16, cursor: 'pointer' }}/>
              {opt.label}
            </label>
          );
        })}
      </div>
      <div className="field" style={{ marginTop: 12 }}>
        <input
          className="input"
          placeholder="Autre — précisez (ex. allergie aux crustacés, intolérance lactose…)"
          value={regime.autre || ''}
          onChange={e => onChange({ ...regime, autre: e.target.value })}
        />
      </div>
    </div>
  );
};

// Confirmation post-paiement repas
const RepasPaymentConfirmation = ({ payment, onContinue, onClose }) => (
  <div style={{ minHeight: 'calc(100vh - 64px)', padding: '64px 24px 80px' }}>
    <div className="fade-in" style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--success-bg)', color: '#16a34a',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
          border: '6px solid #d1fae5',
        }}>
          <Icon.Check size={32}/>
        </div>
        <h1 className="display" style={{ fontSize: 30, fontWeight: 500, margin: 0, letterSpacing: '-0.025em' }}>
          Réservation confirmée
        </h1>
        <div style={{ marginTop: 10, fontSize: 14, color: 'var(--fg-muted)' }}>
          Paiement reçu · Référence <span className="tnum" style={{ color: 'var(--fg)', fontWeight: 500 }}>{payment.ref}</span>
        </div>
      </div>

      <div className="card" style={{ padding: 22, marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon.Calendar size={20}/>
          </div>
          <div style={{ flex: 1 }}>
            <div className="display" style={{ fontSize: 16, fontWeight: 500 }}>{payment.repas.evt}</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>{payment.repas.date} · {payment.repas.lieu}</div>
          </div>
        </div>
        <div style={{ paddingTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ gridColumn: payment.nbAccomp > 0 ? 'span 2' : 'span 1' }}>
            <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Montant payé</div>
            <div className="tnum" style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{formatPrix(payment.montant)} <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 400 }}>TTC</span></div>
            {payment.nbAccomp > 0 && (
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4 }}>
                1 dégustateur × {formatPrix(payment.repas.prix)} + {payment.nbAccomp} accompagnateur{payment.nbAccomp > 1 ? 's' : ''} × {formatPrix(28.00)}
              </div>
            )}
          </div>
          {!(payment.nbAccomp > 0) && (
            <div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Régime alimentaire</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{regimeSummary(payment.regime)}</div>
            </div>
          )}
          {payment.nbAccomp > 0 && (
            <div style={{ gridColumn: 'span 2', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Régime alimentaire</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{regimeSummary(payment.regime)}</div>
            </div>
          )}
        </div>
      </div>

      <div style={{
        fontSize: 13, color: 'var(--fg-muted)', textAlign: 'center',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        marginBottom: 24,
      }}>
        <Icon.Mail size={14} style={{ color: 'var(--fg-subtle)' }}/>
        Un email de confirmation vous a été envoyé
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} className="btn btn-outline btn-lg" style={{ flex: 1 }}>
          Retour aux repas
        </button>
        <button onClick={onContinue} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
          Voir mes réservations <Icon.ArrowRight size={14}/>
        </button>
      </div>
    </div>
  </div>
);

const DegustateurReservations = ({ onNavigate }) => {
  const reservations = [
    { date: '24 mai 2026',  evt: 'Déjeuner Concours France',  lieu: 'Salle du Comité · Mâcon',         prix: 0,     status: 'confirmee', payment: 'gratuit', canCancel: true },
    { date: '25 mai 2026',  evt: 'Repas du Comité',           lieu: 'Restaurant Saint-Vincent · Mâcon', prix: 38.00, status: 'confirmee', payment: 'paye',    canCancel: true },
    { date: '14 juin 2026', evt: 'Déjeuner Concours Monde',   lieu: 'Salle du Comité · Mâcon',          prix: 18.00, status: 'confirmee', payment: 'en-attente', canCancel: true },
    { date: '18 sept. 2025', evt: 'Déjeuner Concours France',  lieu: 'Salle du Comité · Mâcon',         prix: 0,     status: 'confirmee', payment: 'gratuit', canCancel: false },
    { date: '12 mars 2025', evt: 'Repas du Comité',           lieu: 'Restaurant Saint-Vincent · Mâcon', prix: 38.00, status: 'annulee',   payment: 'rembourse', canCancel: false },
  ];
  const statusMap = {
    confirmee: { label: 'Confirmée', cls: 'badge badge-success' },
    annulee:   { label: 'Annulée',   cls: 'badge badge-danger' },
  };
  const paymentMap = {
    'paye':       { label: 'Payée',                 cls: 'badge badge-success' },
    'gratuit':    { label: 'Gratuite',              cls: 'badge badge-outline' },
    'en-attente': { label: 'Paiement en attente',   cls: 'badge badge-warning' },
    'rembourse':  { label: 'Remboursée',            cls: 'badge badge-info' },
  };

  return (
    <div>
      <button onClick={() => onNavigate('d-repas')} className="btn btn-ghost btn-sm" style={{ marginLeft: -10, marginBottom: 16 }}>
        <Icon.ChevronLeft size={14}/> Repas à venir
      </button>
      <PageHeader title="Mes réservations" subtitle="Historique de vos réservations de repas"/>

      {reservations.length === 0 ? (
        <Empty icon={<Icon.Calendar size={20}/>} title="Vous n'avez aucune réservation pour le moment"
          hint="Consultez les repas à venir pour réserver votre place."
          action={<button onClick={() => onNavigate('d-repas')} className="btn btn-primary">Voir les repas à venir</button>}/>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Événement</th>
                <th>Lieu</th>
                <th className="num">Montant</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r, i) => (
                <tr key={i}>
                  <td className="muted">{r.date}</td>
                  <td style={{ fontWeight: 500 }}>{r.evt}</td>
                  <td className="muted">{r.lieu}</td>
                  <td className="num tnum" style={{ fontWeight: 500, color: r.prix === 0 ? 'var(--fg-muted)' : 'var(--fg)' }}>
                    {r.prix === 0 ? '—' : r.prix.toFixed(2).replace('.', ',') + ' €'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                      <span className={statusMap[r.status].cls}>
                        <span className="badge-dot"/>
                        {statusMap[r.status].label}
                      </span>
                      <span className={paymentMap[r.payment].cls} style={{ fontSize: 10.5 }}>
                        {paymentMap[r.payment].label}
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {r.canCancel && <button className="btn btn-outline btn-sm">Annuler</button>}
                    {r.payment === 'en-attente' && (
                      <button className="btn btn-primary btn-sm" style={{ marginLeft: 6 }}>
                        Payer · {r.prix.toFixed(2).replace('.', ',')} €
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// =====================================================================
// 6 — Prochains concours (3 cas)
// =====================================================================

const DegustateurConcours = () => {
  // Mock 3 cas
  const concours = [
    {
      id: 'cf26', nom: 'Concours France', edition: '2026',
      date: '14 mars 2026', lieu: 'Mâcon · Salle des Concours',
      state: 'composed',
      sessions: [
        { session: 'Session 1', table: 'Table 7', horaires: '08h30 – 12h00', salle: 'Salle A · 1er étage' },
        { session: 'Session 2', table: 'Table 7', horaires: '14h00 – 18h00', salle: 'Salle A · 1er étage' },
      ],
    },
    {
      id: 'cm26', nom: 'Concours Monde', edition: '2026',
      date: '04 avril 2026', lieu: 'Mâcon · Salle des Concours',
      state: 'pending',
    },
  ];

  if (concours.length === 0) {
    return (
      <div>
        <PageHeader title="Prochains concours" subtitle="Sessions de dégustation à venir"/>
        <Empty icon={<Icon.Trophy size={20}/>} title="Aucun concours programmé pour le moment"
          hint="Les prochaines éditions seront annoncées prochainement."/>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Prochains concours"
        subtitle="Sessions de dégustation auxquelles vous êtes ou serez convoqué"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {concours.map(c => (
          <div key={c.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: c.nom.includes('Monde') ? '#eef4ff' : 'var(--burgundy-50)',
                color: c.nom.includes('Monde') ? '#1e40af' : 'var(--burgundy-800)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {c.nom.includes('Monde') ? <Icon.Globe size={20}/> : <Icon.Trophy size={20}/>}
              </div>
              <div style={{ flex: 1 }}>
                <div className="display" style={{ fontSize: 18, fontWeight: 500 }}>{c.nom} {c.edition}</div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2 }}>{c.date} · {c.lieu}</div>
              </div>
              {c.state === 'composed' && (
                <span className="badge" style={{ background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', fontSize: 13, padding: '4px 12px', fontWeight: 600 }}>
                  <Icon.Check size={12}/> Vous êtes convoqué
                </span>
              )}
            </div>

            {c.state === 'composed' ? (
              <div style={{ padding: '4px 0 4px' }}>
                <table className="table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Session</th>
                      <th>Table</th>
                      <th>Horaires</th>
                      <th>Salle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.sessions.map((s, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500 }}>{s.session}</td>
                        <td className="tnum">{s.table}</td>
                        <td className="tnum">{s.horaires}</td>
                        <td>{s.salle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '16px 24px',
                background: '#fef3c7',
                borderTop: '1px solid #fde68a',
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'rgba(255,255,255,0.7)', color: '#92400e',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon.Clock size={15}/>
                </div>
                <div style={{ flex: 1, fontSize: 13.5, color: '#92400e' }}>
                  <strong>La composition des jurys est en cours de préparation.</strong> Vous serez notifié par email dès que vos sessions seront attribuées.
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// =====================================================================
// 7 — Mes disponibilités (créneaux uniquement — préférences dans Mon compte)
// =====================================================================

const DegustateurDisponibilites = () => {
  const initial = { 'cf-s1': true, 'cf-s2': true, 'cf-s3': false, 'cm-s1': true, 'cm-s2': true };
  const [dispos, setDispos] = React.useState(initial);
  const dirty = Object.keys(initial).some(k => initial[k] !== dispos[k]) || Object.keys(dispos).some(k => initial[k] !== dispos[k]);

  // Regrouper par concours
  const grouped = DEGUST_CRENEAUX.reduce((acc, c) => {
    if (!acc[c.concours]) acc[c.concours] = [];
    acc[c.concours].push(c);
    return acc;
  }, {});

  const totalChecked = Object.values(dispos).filter(Boolean).length;

  return (
    <div>
      <PageHeader
        title="Mes disponibilités"
        subtitle="Indiquez vos disponibilités pour les prochaines sessions de dégustation"
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: '12px 16px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon.Activity size={15}/>
        </div>
        <div style={{ flex: 1, fontSize: 13.5 }}>
          <strong>{totalChecked}</strong> créneau{totalChecked > 1 ? 'x' : ''} déclaré{totalChecked > 1 ? 's' : ''} disponible{totalChecked > 1 ? 's' : ''} sur {DEGUST_CRENEAUX.length} proposés.
        </div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
          La composition des jurys dépend de vos disponibilités.
        </div>
      </div>

      {Object.entries(grouped).map(([concours, items]) => (
        <div key={concours} className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: concours.includes('Monde') ? '#eef4ff' : 'var(--burgundy-50)',
              color: concours.includes('Monde') ? '#1e40af' : 'var(--burgundy-800)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {concours.includes('Monde') ? <Icon.Globe size={14}/> : <Icon.Trophy size={14}/>}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{concours}</div>
          </div>
          <div>
            {items.map((c, i) => {
              const checked = dispos[c.id];
              return (
                <label key={c.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 20px',
                  cursor: 'pointer',
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                  background: checked ? 'rgba(83,20,66,0.025)' : 'transparent',
                  transition: 'background .12s',
                }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={e => setDispos({ ...dispos, [c.id]: e.target.checked })}
                    style={{ accentColor: 'var(--burgundy-800)', width: 18, height: 18, margin: 0, cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{c.label} · {c.date}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>{c.heure} · {c.lieu}</div>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 500,
                    color: checked ? 'var(--success)' : 'var(--fg-muted)',
                  }}>
                    {checked ? 'Disponible' : 'Indisponible'}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
        {dirty && <button onClick={() => setDispos(initial)} className="btn btn-outline">Annuler</button>}
        <button disabled={!dirty} className="btn btn-primary">
          <Icon.Check size={14}/> Enregistrer mes disponibilités
        </button>
      </div>
    </div>
  );
};

// =====================================================================
// 8 — Mon compte (3 onglets)
// =====================================================================

const DegustateurCompte = ({ initial }) => {
  const [tab, setTab] = React.useState(initial || 'infos');
  React.useEffect(() => { if (initial) setTab(initial); }, [initial]);

  return (
    <div>
      <PageHeader title="Mon compte" subtitle="Profil personnel, préférences de dégustation et sécurité du compte"/>

      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        {[
          { id: 'infos', label: 'Mes informations',         icon: <Icon.User size={14}/> },
          { id: 'prefs', label: 'Préférences dégustation',  icon: <Icon.Wine size={14}/> },
          { id: 'mdp',   label: 'Mot de passe',             icon: <Icon.Lock size={14}/> },
        ].map(t => {
          const isActive = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              position: 'relative',
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 13.5,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--burgundy-800)' : 'var(--fg-muted)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              {t.icon}{t.label}
              {isActive && <span style={{ position: 'absolute', left: 12, right: 12, bottom: -1, height: 2, background: 'var(--burgundy-800)' }}/>}
            </button>
          );
        })}
      </div>

      <div className="fade-in" key={tab}>
        {tab === 'infos' && <DegustCompteInfos/>}
        {tab === 'prefs' && <DegustCompteEnvies/>}
        {tab === 'mdp'   && <CompteMotDePasse/> /* réutilise composant Producteur */}
      </div>
    </div>
  );
};

const DegustCompteInfos = () => {
  const i = USER_DEGUSTATEUR;
  const initial = { ...i, regime: { ...i.regime } };
  const [f, setF] = React.useState(initial);
  const setField = (k) => (e) => setF(s => ({ ...s, [k]: e.target.value }));
  const setRegime = (newR) => setF(s => ({ ...s, regime: newR }));
  const dirty = JSON.stringify(initial) !== JSON.stringify(f);

  return (
    <div style={{ maxWidth: 880 }}>
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>Profil personnel</div>
        <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 18 }}>Vos coordonnées personnelles</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="field"><label className="field-label">Nom</label><input className="input" value={f.nom} onChange={setField('nom')}/></div>
          <div className="field"><label className="field-label">Prénom</label><input className="input" value={f.prenom} onChange={setField('prenom')}/></div>
          <div className="field"><label className="field-label">Email</label><input className="input" value={f.email} onChange={setField('email')}/></div>
          <div className="field"><label className="field-label">Téléphone</label><input className="input tnum" value={f.telephone} onChange={setField('telephone')}/></div>
          <div className="field" style={{ gridColumn: 'span 2' }}><label className="field-label">Adresse 1</label><input className="input" value={f.adresse1} onChange={setField('adresse1')}/></div>
          <div className="field" style={{ gridColumn: 'span 2' }}><label className="field-label">Adresse 2 <span style={{ fontWeight: 400, color: 'var(--fg-muted)' }}>(optionnel)</span></label><input className="input" value={f.adresse2} onChange={setField('adresse2')}/></div>
          <div className="field"><label className="field-label">Code postal</label><input className="input tnum" value={f.cp} onChange={setField('cp')}/></div>
          <div className="field"><label className="field-label">Ville</label><input className="input" value={f.ville} onChange={setField('ville')}/></div>
          <div className="field" style={{ gridColumn: 'span 2' }}><label className="field-label">Pays</label><select className="select" value={f.pays} onChange={setField('pays')}><option>France</option><option>Belgique</option><option>Suisse</option><option>Luxembourg</option></select></div>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>Appartenance</div>
        <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 18 }}>Rattachement professionnel et zone habituelle de dégustation</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="field" style={{ gridColumn: 'span 2' }}>
            <label className="field-label">Organisme / Cave / Domaine de rattachement</label>
            <input className="input" value={f.organisme} onChange={setField('organisme')} placeholder="(optionnel)"/>
          </div>
          <div className="field" style={{ gridColumn: 'span 2' }}>
            <label className="field-label">Région habituelle de dégustation</label>
            <select className="select" value={f.regionHabituelle} onChange={setField('regionHabituelle')}>
              <option>Mâconnais</option><option>Beaujolais</option><option>Côte de Beaune</option><option>Côte de Nuits</option><option>Chablisien</option>
            </select>
          </div>
        </div>
      </div>

      {/* Régime alimentaire */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>Régime alimentaire</div>
        <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 18 }}>
          Ces informations sont transmises à l'organisateur pour chaque repas auquel vous participez. Elles restent modifiables au moment de la réservation.
        </div>
        <RegimeFields regime={f.regime} onChange={setRegime}/>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        {dirty && <button onClick={() => setF(initial)} className="btn btn-outline">Annuler</button>}
        <button disabled={!dirty} className="btn btn-primary"><Icon.Check size={14}/> Enregistrer les modifications</button>
      </div>
    </div>
  );
};

const DegustCompteEnvies = () => {
  const [couleur, setCouleur] = React.useState('blanc');
  const [region, setRegion]   = React.useState('Mâconnais');
  const [type, setType]       = React.useState('Vins blancs secs');

  return (
    <div style={{ maxWidth: 880 }}>
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>Préférences de dégustation</div>
        <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 20 }}>
          Ces informations aident à composer les jurys en cohérence avec votre profil. Elles ne sont pas obligatoires.
        </div>

        {/* Couleur préférée */}
        <div className="field" style={{ marginBottom: 22 }}>
          <label className="field-label">Couleur préférée</label>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            {[
              { id: 'rouge',        label: 'Rouge',        dot: '#7e1d1d' },
              { id: 'blanc',        label: 'Blanc',        dot: '#f4e4a8' },
              { id: 'rose',         label: 'Rosé',         dot: '#f3a5b4' },
              { id: 'effervescent', label: 'Effervescent', dot: '#cbe2f1' },
              { id: 'tous',         label: 'Tous',         dot: 'linear-gradient(135deg, #7e1d1d 0%, #f4e4a8 50%, #f3a5b4 100%)' },
            ].map(c => {
              const isActive = couleur === c.id;
              return (
                <button key={c.id} onClick={() => setCouleur(c.id)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px',
                  border: '1px solid ' + (isActive ? 'var(--burgundy-800)' : 'var(--border)'),
                  background: isActive ? 'var(--burgundy-50)' : 'var(--surface)',
                  color: isActive ? 'var(--burgundy-800)' : 'var(--fg)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all .12s',
                }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: c.dot, border: '1px solid rgba(0,0,0,0.1)' }}/>
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Région préférée */}
        <div className="field" style={{ marginBottom: 22 }}>
          <label className="field-label">Région préférée</label>
          <select className="select" value={region} onChange={e => setRegion(e.target.value)} style={{ maxWidth: 340 }}>
            <option>Mâconnais</option>
            <option>Beaujolais</option>
            <option>Côte de Beaune</option>
            <option>Côte de Nuits</option>
            <option>Chablisien</option>
            <option>Côte chalonnaise</option>
            <option>Toutes</option>
          </select>
        </div>

        {/* Type de vin préféré */}
        <div className="field">
          <label className="field-label">Type de vin préféré</label>
          <input className="input" value={type} onChange={e => setType(e.target.value)} placeholder="Ex. Vins blancs secs, Crémants, Vins moelleux…" style={{ maxWidth: 480 }}/>
          <span className="field-hint">Texte libre — décrivez vos vins favoris</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary"><Icon.Check size={14}/> Enregistrer mes préférences</button>
      </div>
    </div>
  );
};

// =====================================================================
// Placeholder
// =====================================================================

const DegustateurGeneric = ({ title, sub, icon }) => (
  <div>
    <PageHeader title={title} subtitle={sub} breadcrumb={['Mon espace', title]}/>
    <div className="card" style={{ padding: 60, textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>{icon}</div>
      <div className="display" style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: 'var(--fg-muted)' }}>Module à détailler avec le client.</div>
    </div>
  </div>
);

Object.assign(window, {
  DegustateurDashboard,
  DegustateurFormationsWrapper,
  DegustateurRepas,
  DegustateurReservations,
  DegustateurConcours,
  DegustateurDisponibilites,
  DegustateurCompte,
  DegustateurGeneric,
});
