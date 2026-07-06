// view-exposant.jsx
// Portail Exposant — Inscription aux salons (SDV + MPG), Ma surface, Mon compte
// R01-R12 docs/08-developpement/retours-maquette.md

// ── Constantes visuelles ──────────────────────────────────────────
const EXPO_FG = '#166534';  // vert forêt principal (SDV)
const EXPO_BG = '#f0fdf4';  // fond vert très clair (SDV)
const SALON_THEMES = {
  sdv: { fg: '#166534', bg: '#f0fdf4' },
  mpg: { fg: '#2D1508', bg: '#F5E4C0' },
};

// ── Données de référence ──────────────────────────────────────────
const SALONS_EXPO = [
  {
    id: 'sdv-2026', type: 'sdv',
    nom: 'Salon des Vins de Mâcon', edition: '2026',
    dateDebut: '14 novembre 2026', dateFin: '16 novembre 2026',
    dateDebutISO: '2026-11-14',
    lieu: 'Parc des Expositions · Mâcon',
    inscriptionsOuvertes: true, dateCloture: '30 sept. 2026',
  },
  {
    id: 'mpg-2026', type: 'mpg',
    nom: 'Marché des Plaisirs Gourmands', edition: '2026',
    dateDebut: '30 mai 2026', dateFin: '1er juin 2026',
    lieu: 'Parc des Expositions · Mâcon',
    inscriptionsOuvertes: false, dateCloture: '15 mars 2026 (clôturée)',
  },
];

// Catalogue prestations par salon (R08 — sélection libre depuis un catalogue)
const PRESTATIONS_EXPO = {
  sdv: [
    { id: 'forfait',    nom: 'Forfait stand 3×3m (9 m²)',     desc: 'Cloisons, moquette, 1 spot, 1 table, 2 badges exposant', prixHT: 840, obligatoire: true  },
    { id: 'ml-sup',     nom: 'Mètre linéaire supplémentaire',  desc: 'Par ml au-delà du forfait de base',                       prixHT: 95,  obligatoire: false },
    { id: 'angle1',     nom: 'Angle 1 côté',                   desc: null,                                                      prixHT: 110, obligatoire: false },
    { id: 'angle2',     nom: 'Angle 2 côtés',                  desc: null,                                                      prixHT: 170, obligatoire: false },
    { id: 'elec-3kw',   nom: 'Électricité 3 kW',               desc: null,                                                      prixHT: 160, obligatoire: false },
    { id: 'elec-18kw',  nom: 'Électricité 18 kW',              desc: null,                                                      prixHT: 300, obligatoire: false },
    { id: 'comptoir',   nom: 'Comptoir',                        desc: null,                                                      prixHT: 160, obligatoire: false },
    { id: 'table',      nom: 'Table supplémentaire',            desc: null,                                                      prixHT: 14,  obligatoire: false },
    { id: 'chaise',     nom: 'Chaise',                          desc: null,                                                      prixHT: 8,   obligatoire: false },
    { id: 'badge-exp',  nom: 'Badge exposant supplémentaire',   desc: null,                                                      prixHT: 6,   obligatoire: false },
    { id: 'badge-park', nom: 'Badge parking',                   desc: null,                                                      prixHT: 6,   obligatoire: false },
    { id: 'premium',    nom: 'Offre premium (4×3m)',            desc: 'Stand 4×3m + angle 2 côtés + vitrine réfrigérée + 2 spots', prixHT: 895, obligatoire: false },
  ],
  mpg: [
    { id: 'forfait',   nom: 'Forfait stand 6m² (3×2m)',            desc: 'Cloisons, enseigne, frais dossier, assurance, catalogue, site web, 2 badges exposant, 2 badges parking, 50 invitations×2 pers., wifi, 2 kW, 1 rail de spots — livré sans mobilier', prixHT: 630, obligatoire: true  },
    { id: 'ml-sup',    nom: 'Mètre linéaire supplémentaire',        desc: '105 € HT/m² au-delà du forfait',             prixHT: 105, obligatoire: false },
    { id: 'angle1',    nom: 'Angle 1 côté',                         desc: null,                                          prixHT: 110, obligatoire: false },
    { id: 'angle2',    nom: 'Angle 2 côtés',                        desc: null,                                          prixHT: 170, obligatoire: false },
    { id: 'comptoir',  nom: 'Comptoir (L 2m × H 1m × P 0,5m)',     desc: null,                                          prixHT: 160, obligatoire: false },
    { id: 'table',     nom: 'Table 1,8m × 0,6m',                    desc: null,                                          prixHT: 14,  obligatoire: false },
    { id: 'badge-exp', nom: 'Badge exposant supplémentaire',         desc: null,                                          prixHT: 6,   obligatoire: false },
    { id: 'badge-park',nom: 'Badge parking',                         desc: null,                                          prixHT: 6,   obligatoire: false },
    { id: 'elec-3kw',  nom: 'Électricité monophasé 3 kW',           desc: null,                                          prixHT: 160, obligatoire: false },
    { id: 'elec-18kw', nom: 'Électricité 18 kW (4 prises)',         desc: null,                                          prixHT: 300, obligatoire: false },
    { id: 'elec-ext',  nom: 'Électricité extérieure (camion frigo)',  desc: null,                                          prixHT: 165, obligatoire: false },
    { id: 'eau-org',   nom: 'Lave-mains autonome (fourni organisation)', desc: 'Obligatoire restauration/cuisson · normes sanitaires DDPP',  prixHT: 175, obligatoire: false },
    { id: 'eau-exp',   nom: 'Lave-mains autonome (fourni exposant)', desc: 'Obligatoire restauration/cuisson · fourni et installé par vos soins', prixHT: 175, obligatoire: false },
    { id: 'sol-org',   nom: 'Sol lavable lino 6m² (fourni organisation)', desc: 'Obligatoire restauration/cuisson · 3×2m',  prixHT: 80,  obligatoire: false },
    { id: 'invite-sup',nom: 'Invitations supplémentaires (×10 cartes)', desc: 'Dégressif : 1 €/carte (0–500) · 0,50 € (500–1 000) · 0,25 € (>1 000)', prixHT: 10, obligatoire: false },
  ],
};

const COMMUNICATION_EXPO = {
  sdv: [
    { id: 'aff-ext',  cat: 'Affichage', nom: 'Affichage extérieur',       desc: "Bandeau 2×1m à l'entrée du parc — visibilité maximale dès l'arrivée des visiteurs",    prixHT: 180, couleur: '#2563eb', visuelUrl: '' },
    { id: 'aff-int',  cat: 'Affichage', nom: 'Panneau allée intérieure',  desc: 'Panneau A1 positionné dans les allées principales — vu par tous les visiteurs',       prixHT: 120, couleur: '#7c3aed', visuelUrl: '' },
    { id: 'digital',  cat: 'Digital',   nom: 'Diffusion écran digital',   desc: 'Votre visuel sur les écrans LED du salon · 10 passages minimum par heure',             prixHT: 280, couleur: '#0891b2', visuelUrl: '' },
    { id: 'prog',     cat: 'Print',     nom: 'Encart programme papier',   desc: 'Encart ½ page dans le programme officiel distribué à tous les visiteurs (tirage 5 000)', prixHT: 220, couleur: '#d97706', visuelUrl: '' },
    { id: 'web',      cat: 'Digital',   nom: 'Bannière site web',         desc: "Bannière publicitaire sur le site du salon durant 1 mois avant l'événement",           prixHT: 150, couleur: '#059669', visuelUrl: '' },
    { id: 'rs',       cat: 'Digital',   nom: 'Post réseaux sociaux',      desc: 'Publication dédiée à votre domaine sur les réseaux du Comité (Instagram, Facebook)',   prixHT: 90,  couleur: '#e11d48', visuelUrl: '' },
  ],
  mpg: [
    { id: 'cat-qp',   cat: 'Print',     nom: 'Encart catalogue quart de page',   desc: 'Catalogue distribué à 11 000 ex. + remis à l\'entrée du salon · format 72,5×105mm', prixHT: 200, couleur: '#d97706', visuelUrl: '' },
    { id: 'cat-dp',   cat: 'Print',     nom: 'Encart catalogue demi-page',       desc: 'Catalogue 11 000 ex. · format 145×105mm',                                            prixHT: 395, couleur: '#b45309', visuelUrl: '' },
    { id: 'cat-pp',   cat: 'Print',     nom: 'Encart catalogue pleine page',     desc: 'Catalogue 11 000 ex. · format 145×210mm',                                            prixHT: 785, couleur: '#92400e', visuelUrl: '' },
    { id: 'rs',       cat: 'Digital',   nom: 'Post réseaux sociaux',             desc: 'Facebook + Instagram "Salon des vins de Mâcon" · 3 posts max + fichier remis après', prixHT: 220, couleur: '#e11d48', visuelUrl: '' },
    { id: 'digital',  cat: 'Digital',   nom: 'Affichage écran grand format',     desc: 'Entrée salon pendant 3 jours en rotation · 3 affichages maximum',                   prixHT: 800, couleur: '#0891b2', visuelUrl: '' },
  ],
};

// Régions viticoles — Salon des Vins (R07)
const REGIONS_SDV = [
  'Alsace', 'Beaujolais', 'Bordeaux', 'Bourgogne', 'Champagne',
  'Côtes du Rhône', 'Jura', 'Languedoc-Roussillon', 'Loire',
  'Provence', 'Savoie', 'Sud-Ouest', 'Vallée du Rhône',
  'Cognac / Armagnac', 'Bières & Spiritueux', 'Autre',
];

// Catégories produits — Marché des Plaisirs Gourmands (R04)
const CATEGORIES_MPG = [
  'Gastronomie', 'Vins & Spiritueux', 'Arts de la table',
  'Épicerie fine', 'Fromages & Charcuteries',
  'Confiserie & Chocolat', 'Bio & Naturel', 'Autre',
];

// Inscription démo — statut « soumise »
const INSCRIPTION_DEMO_EXPO = {
  salon: SALONS_EXPO[0],
  ref: 'EXP-2026-0042',
  statut: 'soumise',
  surfaceM2: 9,
  enseigne: 'Domaine des Trois Pierres',
  totalHT: 1016,
  tva: 203.20,
  totalTTC: 1219.20,
  acompteTTC: 487.68,
  soldeTTC: 731.52,
  soldeDateLimiteStr: '15 octobre 2026', // J-30 avant le salon (14 nov. 2026)
  paiementStatut: 'bloque', // bloqué tant que statut !== 'validee'
  modePaiement: 'Virement bancaire',
  prestations: [
    { nom: 'Forfait stand 3×3m (9 m²)',   qte: 1, prixHT: 840 },
    { nom: 'Angle 1 côté',                qte: 1, prixHT: 110 },
    { nom: 'Table supplémentaire',         qte: 1, prixHT: 14  },
    { nom: 'Chaise',                       qte: 3, prixHT: 8   },
    { nom: 'Badge parking',                qte: 2, prixHT: 6   },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────
const eur = v => v.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

const StatutExpoLabel = {
  brouillon: { label: 'Brouillon',     bg: 'var(--slate-100)', fg: 'var(--slate-700)' },
  soumise:   { label: 'En attente',    bg: '#fef3c7',          fg: '#92400e'          },
  validee:   { label: 'Validée',       bg: '#dcfce7',          fg: '#166534'          },
  refusee:   { label: 'Refusée',       bg: '#fee2e2',          fg: '#b91c1c'          },
};
const StatutExpoBadge = ({ statut }) => {
  const s = StatutExpoLabel[statut] || StatutExpoLabel.soumise;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: s.bg, color: s.fg, fontSize: 12.5, fontWeight: 600 }}>
      {statut === 'validee'  && <Icon.Check size={11}/>}
      {statut === 'soumise'  && <Icon.Clock size={11}/>}
      {statut === 'refusee'  && <Icon.X size={11}/>}
      {s.label}
    </span>
  );
};

// Indicateur d'étape du wizard
const WizardStepper = ({ steps, current }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 36 }}>
    {steps.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={i}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: done ? EXPO_FG : active ? EXPO_FG : 'var(--border)',
              color: done || active ? '#fff' : 'var(--fg-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 600,
              flexShrink: 0,
            }}>
              {done ? <Icon.Check size={14}/> : i + 1}
            </div>
            <div style={{ fontSize: 11.5, fontWeight: active ? 600 : 400, color: active ? EXPO_FG : done ? 'var(--fg-muted)' : 'var(--fg-subtle)', whiteSpace: 'nowrap', maxWidth: 90, textAlign: 'center', lineHeight: 1.3 }}>
              {label}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < current ? EXPO_FG : 'var(--border)', margin: '0 6px', marginBottom: 22 }}/>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ── DASHBOARD ─────────────────────────────────────────────────────
const ExposantDashboard = ({ onNavigate }) => {
  const insc = INSCRIPTION_DEMO_EXPO;
  const salon = insc.salon;

  return (
    <div>
      {/* Bannière salon */}
      <div style={{
        padding: '22px 28px',
        background: salon.type === 'mpg'
          ? 'linear-gradient(135deg, #451a03 0%, #78350f 60%, #2D1508 100%)'
          : 'linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%)',
        borderRadius: 14,
        color: '#fff',
        marginBottom: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 60, height: 60, borderRadius: 12, background: '#fff', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 1px 6px rgba(0,0,0,0.2)' }}>
            <img src={`logo-${salon.type}.png`} alt={salon.nom} style={{ width: 54, height: 54, objectFit: 'contain' }}/>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>Édition {salon.edition}</div>
            <div className="display" style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.1 }}>{salon.nom}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', marginTop: 4 }}>{salon.dateDebut} – {salon.dateFin} · {salon.lieu}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>Référence dossier</div>
          <div className="tnum" style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{insc.ref}</div>
          <StatutExpoBadge statut={insc.statut}/>
        </div>
      </div>

      {/* Alerte statut */}
      <div style={{ padding: '14px 18px', background: '#fef9ec', border: '1px solid #fde68a', borderRadius: 10, marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <Icon.Clock size={16} style={{ color: '#92400e', flexShrink: 0, marginTop: 1 }}/>
        <div style={{ fontSize: 13, color: '#78350f', lineHeight: 1.5 }}>
          <strong>Dossier en cours de traitement.</strong> Le Comité valide votre inscription. Vous serez notifié par e-mail dès qu'une décision sera prise.
        </div>
      </div>

      {/* ── Alerte deadline solde ─────────────────────────────── */}
      {insc.paiementStatut !== 'solde_recu' && (() => {
        const deadline = new Date(salon.dateDebutISO);
        deadline.setDate(deadline.getDate() - 30);
        const today    = new Date('2026-06-30');
        const diffDays = Math.ceil((deadline - today) / 86400000);
        const isPast   = diffDays < 0;
        const isUrgent = !isPast && diffDays <= 14;
        const isWarn   = !isPast && diffDays <= 30;
        const bg     = isPast ? '#fee2e2' : isUrgent ? '#fff7ed' : isWarn ? '#fef9ec' : '#eff6ff';
        const border = isPast ? '#fca5a5' : isUrgent ? '#fed7aa' : isWarn ? '#fde68a' : '#bfdbfe';
        const fg     = isPast ? '#991b1b' : isUrgent ? '#c2410c' : isWarn ? '#78350f' : '#1e40af';
        const IcnEl  = isPast || isUrgent ? Icon.AlertTriangle : isWarn ? Icon.Clock : Icon.Info;
        return (
          <div style={{ padding: '14px 18px', background: bg, border: `1px solid ${border}`, borderRadius: 10, marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <IcnEl size={16} style={{ color: fg, flexShrink: 0, marginTop: 1 }}/>
            <div style={{ fontSize: 13, color: fg, lineHeight: 1.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0 6px' }}>
              {isPast
                ? <><strong>Solde en retard !</strong>&nbsp;Le délai de paiement est dépassé. Contactez le Comité au plus vite.</>
                : <><strong>Règlement du solde :</strong>&nbsp;le solde de <strong>{eur(insc.soldeTTC)}</strong> doit être réglé au plus tard <strong>1 mois avant le salon</strong> — avant le <strong>{insc.soldeDateLimiteStr}</strong>.
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '1px 9px', borderRadius: 999, background: fg, color: '#fff', fontSize: 11, fontWeight: 700 }}>J − {diffDays}</span>
                  </>
              }
            </div>
          </div>
        );
      })()}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Surface */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Surface stand</div>
          <div style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1 }}>
            {insc.surfaceM2}&nbsp;<span style={{ fontSize: 16, fontWeight: 400, color: 'var(--fg-muted)' }}>m²</span>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 8 }}>Stand 3×3m · {salon.nom}</div>
        </div>
        {/* Total */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Total TTC</div>
          <div className="tnum" style={{ fontSize: 28, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1 }}>{eur(insc.totalTTC)}</div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 8 }}>HT : {eur(insc.totalHT)} · TVA : {eur(insc.tva)}</div>
        </div>
        {/* Acompte */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Acompte 40 %</div>
          {insc.paiementStatut === 'acompte_recu' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Icon.Check size={18} style={{ color: EXPO_FG }}/>
                <span className="tnum" style={{ fontSize: 18, fontWeight: 600, color: EXPO_FG }}>Reçu</span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>Solde : {eur(insc.soldeTTC)} restant</div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Icon.Lock size={15} style={{ color: '#92400e' }}/>
                <span className="tnum" style={{ fontSize: 16, fontWeight: 600, color: '#92400e' }}>{eur(insc.acompteTTC)}</span>
              </div>
              <div style={{ fontSize: 12, color: '#78350f', lineHeight: 1.4 }}>Disponible après validation du Comité</div>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>
        {/* Prestations */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 22px 12px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Mon dossier</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>Prestations réservées · {insc.enseigne}</div>
            </div>
            <button onClick={() => onNavigate('e-inscription')} className="btn btn-outline btn-sm">
              <Icon.Eye size={13}/> Voir le détail
            </button>
          </div>
          <table className="table" style={{ width: '100%' }}>
            <thead><tr><th>Prestation</th><th>Qté</th><th className="num">Total HT</th></tr></thead>
            <tbody>
              {insc.prestations.map((p, i) => (
                <tr key={i}>
                  <td>{p.nom}</td>
                  <td className="tnum">{p.qte}</td>
                  <td className="num tnum">{eur(p.prixHT * p.qte)}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 600, borderTop: '2px solid var(--border)' }}>
                <td colSpan={2}>Total HT</td>
                <td className="num tnum">{eur(insc.totalHT)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sidebar droite */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Paiement */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>Suivi du règlement</div>
            {insc.paiementStatut === 'bloque' && (
              <div style={{ padding: '9px 12px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, marginBottom: 12, fontSize: 12, color: '#78350f', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <Icon.Lock size={12} style={{ flexShrink: 0, marginTop: 1 }}/>
                Le règlement sera possible dès validation de votre dossier par le Comité.
              </div>
            )}
            {[
              { label: 'Acompte 40 %', montant: insc.acompteTTC, recu: insc.paiementStatut === 'acompte_recu' },
              { label: 'Solde 60 %',   montant: insc.soldeTTC,   recu: insc.paiementStatut === 'solde_recu', deadline: insc.soldeDateLimiteStr },
            ].map((line, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none', opacity: insc.paiementStatut === 'bloque' ? 0.45 : 1 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{line.label}</div>
                  <div className="tnum" style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{eur(line.montant)}</div>
                  {line.deadline && !line.recu && (
                    <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 2 }}>Limite : {line.deadline}</div>
                  )}
                </div>
                {line.recu
                  ? <span style={{ fontSize: 11.5, background: '#dcfce7', color: EXPO_FG, borderRadius: 999, padding: '3px 9px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon.Check size={10}/> Reçu</span>
                  : insc.paiementStatut === 'bloque'
                    ? <span style={{ fontSize: 11.5, background: 'var(--slate-100)', color: 'var(--fg-subtle)', borderRadius: 999, padding: '3px 9px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon.Lock size={9}/> Bloqué</span>
                    : <span style={{ fontSize: 11.5, background: 'var(--slate-100)', color: 'var(--fg-muted)', borderRadius: 999, padding: '3px 9px', fontWeight: 500 }}>À régler</span>
                }
              </div>
            ))}
            <div style={{ marginTop: 12, padding: '10px 12px', background: EXPO_BG, borderRadius: 8, fontSize: 12.5, color: EXPO_FG }}>
              Mode de paiement : <strong>{insc.modePaiement}</strong>
            </div>
          </div>

          {/* Autres salons */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Autres salons {insc.salon.edition}</div>
            {SALONS_EXPO.filter(s => s.id !== salon.id).map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: s.inscriptionsOuvertes ? '#16a34a' : 'var(--slate-300)' }}/>
                <div style={{ flex: 1, fontSize: 13 }}>{s.nom}</div>
                <span style={{ fontSize: 11.5, color: s.inscriptionsOuvertes ? EXPO_FG : 'var(--fg-muted)', fontWeight: 500 }}>
                  {s.inscriptionsOuvertes ? 'Ouvert' : 'Clôturé'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CrossMarketingBlock portal="exposant"/>

    </div>
  );
};

// ── WIZARD D'INSCRIPTION ──────────────────────────────────────────
const WIZARD_STEPS = ['Salon', 'Coordonnées', 'Responsable', 'Produits', 'Communication', 'Prestations', 'Récapitulatif'];

const ExposantInscription = ({ onNavigate }) => {
  const [step, setStep]           = React.useState(0);
  const [salon, setSalon]         = React.useState(null);
  const [confirmed, setConfirmed] = React.useState(false);

  // Données formulaire
  const [form, setForm] = React.useState({
    raisonSociale: '', siret: '', codeAPE: '', tvaIntra: '', nonAssujetti: false,
    adresse: '', codePostal: '', ville: '', pays: 'France',
    tel: '', email: '', siteWeb: '',
    responsableNom: '', responsableTel: '', responsableEmail: '',
    facturationDiff: false,
    factRS: '', factAdresse: '', factCP: '', factVille: '',
    // SDV
    regionsSDV: [], appellations: '', modeBio: false, modeBiodyn: false, modeHVE: false, produitsHorsVins: '',
    // MPG
    descGastro: '', typesDerivVin: [], descDerivVin: '',
    // Étape 3
    enseigne: '',
    // Étape 4
    modePaiement: 'virement', cgv: false,
  });
  const setF = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const toggleArr = (k, v) => setF(k, form[k].includes(v) ? form[k].filter(x => x !== v) : [...form[k], v]);

  // Prestations : { id → qte }
  const initPrestations = (salonType) => {
    const res = {};
    (PRESTATIONS_EXPO[salonType] || []).forEach(p => { res[p.id] = p.obligatoire ? 1 : 0; });
    return res;
  };
  const [prestations, setPrestations] = React.useState({});
  const setPrest = (id, qte) => setPrestations(prev => ({ ...prev, [id]: Math.max(0, qte) }));

  const [commOptions, setCommOptions] = React.useState({});
  const toggleComm = (id) => setCommOptions(prev => ({ ...prev, [id]: prev[id] ? 0 : 1 }));

  // Couleurs dynamiques selon le salon sélectionné
  const theme = SALON_THEMES[salon?.type] || SALON_THEMES.sdv;
  const tfg = theme.fg;
  const tbg = theme.bg;

  const handleChoixSalon = (s) => {
    setSalon(s);
    setPrestations(initPrestations(s.type));
    setCommOptions({});
    setStep(1);
  };

  // Calcul total
  const prestHT = salon ? (PRESTATIONS_EXPO[salon.type] || []).reduce((acc, p) => acc + p.prixHT * (prestations[p.id] || 0), 0) : 0;
  const commHT  = salon ? (COMMUNICATION_EXPO[salon.type] || []).reduce((acc, c) => acc + c.prixHT * (commOptions[c.id] || 0), 0) : 0;
  const totalHT = prestHT + commHT;
  const tva = totalHT * 0.2;
  const totalTTC = totalHT + tva;
  const acompteTTC = totalTTC * 0.4;

  const ref = 'EXP-2026-' + String(Math.floor(Math.abs(Math.sin(42) * 9000) + 1000));

  if (confirmed) {
    return (
      <div style={{ maxWidth: 580, margin: '60px auto', textAlign: 'center' }} className="fade-in">
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: tbg, border: `4px solid ${tbg}`, color: tfg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Icon.Check size={32}/>
        </div>
        <h1 className="display" style={{ fontSize: 30, fontWeight: 500, margin: '0 0 10px', letterSpacing: '-0.025em' }}>Dossier soumis !</h1>
        <div style={{ fontSize: 14.5, color: 'var(--fg-muted)', marginBottom: 32 }}>
          Référence <span className="tnum" style={{ fontWeight: 600, color: 'var(--fg)' }}>{ref}</span> — le Comité étudiera votre demande et vous contactera par e-mail.
        </div>
        <div className="card" style={{ padding: '20px 24px', textAlign: 'left', marginBottom: 20 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>Prochaines étapes</div>
          {[
            { icon: <Icon.Check size={14}/>, label: 'Dossier soumis', meta: 'Maintenant', done: true },
            { icon: <Icon.Mail size={14}/>,  label: 'Accusé de réception', meta: 'Dans quelques minutes' },
            { icon: <Icon.ListChecks size={14}/>, label: 'Validation par le Comité', meta: 'Sous 5 jours ouvrés' },
            { icon: <Icon.CreditCard size={14}/>, label: 'Règlement de l\'acompte', meta: `${eur(acompteTTC)} (40 % TTC)` },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.done ? tbg : 'var(--slate-100)', color: s.done ? tfg : 'var(--fg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: s.done ? 600 : 400 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{s.meta}</div>
            </div>
          ))}
        </div>
        <button onClick={() => onNavigate('e-dashboard')} className="btn btn-primary">
          Retour au tableau de bord <Icon.ArrowRight size={14}/>
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 className="display" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.025em', margin: 0 }}>
            {step === 0 ? 'Choisissez votre salon' : `Inscription — ${salon?.nom} ${salon?.edition}`}
          </h1>
          {step > 0 && (
            <div style={{ fontSize: 13.5, color: 'var(--fg-muted)', marginTop: 6 }}>
              {salon?.dateDebut} – {salon?.dateFin} · {salon?.lieu}
            </div>
          )}
        </div>

        {step > 0 && <WizardStepper steps={WIZARD_STEPS.slice(1)} current={step - 1}/>}

        {/* ── Étape 0 : Choix du salon ── */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {SALONS_EXPO.map(s => (
              <div key={s.id}
                onClick={() => s.inscriptionsOuvertes && handleChoixSalon(s)}
                className="card"
                style={{
                  padding: '22px 24px',
                  display: 'flex', alignItems: 'center', gap: 20,
                  cursor: s.inscriptionsOuvertes ? 'pointer' : 'not-allowed',
                  opacity: s.inscriptionsOuvertes ? 1 : 0.55,
                  border: '2px solid var(--border)',
                  transition: 'all .15s',
                }}
                onMouseEnter={e => { if (s.inscriptionsOuvertes) e.currentTarget.style.borderColor = SALON_THEMES[s.type].fg; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ width: 60, height: 60, borderRadius: 12, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
                  <img src={`logo-${s.type}.png`} alt={s.nom} style={{ width: 54, height: 54, objectFit: 'contain' }}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{s.nom} <span style={{ fontWeight: 400, color: 'var(--fg-muted)' }}>{s.edition}</span></div>
                  <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>{s.dateDebut} – {s.dateFin} · {s.lieu}</div>
                  {!s.inscriptionsOuvertes && (
                    <div style={{ marginTop: 6, fontSize: 12.5, color: '#b45309', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <Icon.Lock size={11}/> Inscriptions {s.dateCloture}
                    </div>
                  )}
                </div>
                {s.inscriptionsOuvertes
                  ? <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: SALON_THEMES[s.type].fg, fontWeight: 600, fontSize: 14 }}>S'inscrire <Icon.ChevronRight size={16}/></div>
                  : <Icon.Lock size={18} style={{ color: 'var(--fg-subtle)' }}/>
                }
              </div>
            ))}
          </div>
        )}

        {/* ── Étape 1 : Coordonnées ── */}
        {step === 1 && (
          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 22 }}>Coordonnées de l'entreprise</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
              {/* Identité légale */}
              {[
                ['Raison sociale *', 'raisonSociale', 'text', 'span-2'],
                ['SIRET *', 'siret', 'text', null],
                ['Code APE', 'codeAPE', 'text', null],
              ].map(([label, key, type, span]) => (
                <div key={key} className="field" style={span === 'span-2' ? { gridColumn: 'span 2' } : {}}>
                  <label className="field-label">{label}</label>
                  <input className="input" type={type} value={form[key]} onChange={e => setF(key, e.target.value)} placeholder={label.replace(' *', '')}/>
                </div>
              ))}
              {/* Checkbox non assujetti + TVA conditionnelle */}
              <div style={{ gridColumn: 'span 2', margin: '2px 0' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--fg-muted)' }}>
                  <input type="checkbox" checked={form.nonAssujetti} onChange={e => setF('nonAssujetti', e.target.checked)} style={{ accentColor: tfg, width: 15, height: 15 }}/>
                  Personne physique ou non assujetti à la TVA — pas de N° TVA intracommunautaire
                </label>
              </div>
              {!form.nonAssujetti && (
                <div className="field" style={{ gridColumn: 'span 2' }}>
                  <label className="field-label">N° TVA intracommunautaire</label>
                  <input className="input" type="text" value={form.tvaIntra} onChange={e => setF('tvaIntra', e.target.value)} placeholder="FR12345678901"/>
                </div>
              )}
              {/* Coordonnées + adresse */}
              {[
                ['Téléphone *', 'tel', 'tel', null],
                ['E-mail *', 'email', 'email', null],
                ['Site web', 'siteWeb', 'url', null],
                ['Adresse *', 'adresse', 'text', 'span-2'],
                ['Code postal *', 'codePostal', 'text', null],
                ['Ville *', 'ville', 'text', null],
                ['Pays *', 'pays', 'text', null],
              ].map(([label, key, type, span]) => (
                <div key={key} className="field" style={span === 'span-2' ? { gridColumn: 'span 2' } : {}}>
                  <label className="field-label">{label}</label>
                  <input className="input" type={type} value={form[key]} onChange={e => setF(key, e.target.value)} placeholder={label.replace(' *', '')}/>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', marginTop: 24, paddingTop: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13.5 }}>
                <input type="checkbox" checked={form.facturationDiff} onChange={e => setF('facturationDiff', e.target.checked)} style={{ accentColor: tfg }}/>
                Adresse de facturation différente
              </label>
              {form.facturationDiff && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', marginTop: 16 }}>
                  {[
                    ['Raison sociale facturation', 'factRS', 'text', 'span-2'],
                    ['Adresse', 'factAdresse', 'text', 'span-2'],
                    ['Code postal', 'factCP', 'text', null],
                    ['Ville', 'factVille', 'text', null],
                  ].map(([label, key, type, span]) => (
                    <div key={key} className="field" style={span === 'span-2' ? { gridColumn: 'span 2' } : {}}>
                      <label className="field-label">{label}</label>
                      <input className="input" type={type} value={form[key]} onChange={e => setF(key, e.target.value)}/>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Étape 2 : Responsable du stand ── */}
        {step === 2 && (
          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Responsable du stand</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 22 }}>Personne à contacter sur place pendant le salon — peut être différente du contact principal de l'entreprise.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
              {[
                ['Nom & prénom *', 'responsableNom', 'text', 'span-2'],
                ['Téléphone *', 'responsableTel', 'tel', null],
                ['E-mail *', 'responsableEmail', 'email', null],
              ].map(([label, key, type, span]) => (
                <div key={key} className="field" style={span === 'span-2' ? { gridColumn: 'span 2' } : {}}>
                  <label className="field-label">{label}</label>
                  <input className="input" type={type} value={form[key]} onChange={e => setF(key, e.target.value)} placeholder={label.replace(' *', '')}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Étape 3 : Enseigne + Désignation produits (adapté par salon) ── */}
        {step === 3 && salon && (
          <div className="card" style={{ padding: 24, marginBottom: 4 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Enseigne du stand</div>
            <div className="field">
              <label className="field-label">Nom affiché sur le stand <span style={{ color: 'var(--fg-muted)', fontWeight: 400 }}>(30 caractères max. · en majuscules)</span></label>
              <input className="input" maxLength={30} value={form.enseigne} onChange={e => setF('enseigne', e.target.value.toUpperCase())} placeholder="NOM AFFICHÉ SUR VOTRE STAND" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}/>
              <div style={{ fontSize: 11.5, color: form.enseigne.length >= 28 ? '#b45309' : 'var(--fg-muted)', marginTop: 4 }}>{form.enseigne.length}/30 · inscrit sur la signalétique, le site internet et le plan du salon</div>
            </div>
          </div>
        )}
        {step === 3 && salon?.type === 'sdv' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Régions viticoles présentées</div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 16 }}>Cochez toutes les régions qui seront représentées sur votre stand.</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                {REGIONS_SDV.map(r => (
                  <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13.5, padding: '4px 0' }}>
                    <input type="checkbox" checked={form.regionsSDV.includes(r)} onChange={() => toggleArr('regionsSDV', r)} style={{ accentColor: tfg }}/>
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Informations sur les produits</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="field">
                  <label className="field-label">Appellations présentées</label>
                  <textarea className="input" rows={3} style={{ resize: 'vertical' }} value={form.appellations} onChange={e => setF('appellations', e.target.value)} placeholder="Mâcon-Villages, Pouilly-Fuissé, Beaujolais…"/>
                </div>
                <div>
                  <div className="field-label" style={{ marginBottom: 8 }}>Mode de culture</div>
                  {[['modeBio', 'Agriculture Biologique'], ['modeBiodyn', 'Biodynamie'], ['modeHVE', 'Haute Valeur Environnementale (HVE)']].map(([key, label]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13.5, marginBottom: 8 }}>
                      <input type="checkbox" checked={form[key]} onChange={e => setF(key, e.target.checked)} style={{ accentColor: tfg }}/>
                      {label}
                    </label>
                  ))}
                </div>
                <div className="field">
                  <label className="field-label">Produits hors vins (le cas échéant)</label>
                  <input className="input" value={form.produitsHorsVins} onChange={e => setF('produitsHorsVins', e.target.value)} placeholder="Huiles, condiments, artisanat lié au vin…"/>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && salon?.type === 'mpg' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Profil 1 — Gastronomie & Bières */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>🧀</span>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Exposant Gastronomie & Bières</div>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 14, padding: '8px 12px', background: 'var(--slate-50)', borderRadius: 8, borderLeft: `3px solid ${tfg}` }}>
                L'organisation se réserve le droit de faire retirer tous produits non déclarés au dossier.
              </div>
              <div className="field">
                <label className="field-label">Détail des produits présentés <span style={{ color: 'var(--fg-muted)', fontWeight: 400 }}>(chocolat, foie gras, fromages, charcuteries…)</span></label>
                <textarea className="input" rows={4} style={{ resize: 'vertical' }} value={form.descGastro} onChange={e => setF('descGastro', e.target.value)} placeholder="Décrivez précisément les produits qui seront présentés sur votre stand…"/>
              </div>
            </div>

            {/* Profil 2 — Dérivés & Associés au Vin */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>🍷</span>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Exposant Dérivés & Associés au Vin</div>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 14, padding: '8px 12px', background: 'var(--slate-50)', borderRadius: 8, borderLeft: `3px solid ${tfg}` }}>
                L'organisation se réserve le droit de faire retirer tous produits non déclarés au dossier.
              </div>
              <div style={{ marginBottom: 16 }}>
                <div className="field-label" style={{ marginBottom: 10 }}>Type(s) d'activité</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                  {['Objet du vin', 'Rangement', 'Œnotourisme', 'Dégustation'].map(t => (
                    <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13.5, padding: '4px 0' }}>
                      <input type="checkbox" checked={form.typesDerivVin.includes(t)} onChange={() => toggleArr('typesDerivVin', t)} style={{ accentColor: tfg }}/>
                      {t}
                    </label>
                  ))}
                </div>
              </div>
              <div className="field">
                <label className="field-label">Détail des produits présentés</label>
                <textarea className="input" rows={4} style={{ resize: 'vertical' }} value={form.descDerivVin} onChange={e => setF('descDerivVin', e.target.value)} placeholder="Décrivez précisément les produits qui seront présentés sur votre stand…"/>
              </div>
            </div>
          </div>
        )}

        {/* ── Étape 4 : Communication ── */}
        {step === 4 && salon && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.5 }}>
              Renforcez votre visibilité avec des supports de communication configurés par le Comité. Toutes les options sont facultatives.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {(COMMUNICATION_EXPO[salon.type] || []).map(c => {
                const sel = !!(commOptions[c.id]);
                return (
                  <div key={c.id}
                    onClick={() => toggleComm(c.id)}
                    style={{
                      border: `2px solid ${sel ? tfg : 'var(--border)'}`,
                      borderRadius: 12, overflow: 'hidden',
                      background: sel ? tbg : 'var(--surface)',
                      transition: 'all .12s', cursor: 'pointer',
                    }}>
                    {/* Zone visuelle */}
                    <div style={{
                      height: 130, position: 'relative',
                      background: c.visuelUrl
                        ? `url(${c.visuelUrl}) center/cover no-repeat`
                        : `linear-gradient(135deg, ${c.couleur}20 0%, ${c.couleur}40 100%)`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      borderBottom: `1px solid ${sel ? EXPO_FG + '44' : 'var(--border)'}`,
                    }}>
                      {!c.visuelUrl && (
                        <>
                          <div style={{ width: 48, height: 48, borderRadius: '50%', background: c.couleur + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                            <Icon.Layers size={22} style={{ color: c.couleur }}/>
                          </div>
                          <div style={{ fontSize: 10.5, fontWeight: 700, color: c.couleur, textTransform: 'uppercase', letterSpacing: '.08em', opacity: .8 }}>{c.cat}</div>
                          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4, opacity: .7 }}>Visuel ajouté par l'admin</div>
                        </>
                      )}
                      {sel && (
                        <div style={{ position: 'absolute', top: 10, right: 10, width: 24, height: 24, borderRadius: '50%', background: EXPO_FG, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,.2)' }}>
                          <Icon.Check size={13} style={{ color: '#fff' }}/>
                        </div>
                      )}
                    </div>
                    {/* Infos */}
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>{c.nom}</div>
                      <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 12, lineHeight: 1.5 }}>{c.desc}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="tnum" style={{ fontSize: 14, fontWeight: 700, color: sel ? EXPO_FG : 'var(--fg)' }}>
                          {eur(c.prixHT)} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--fg-muted)' }}>HT</span>
                        </span>
                        <span style={{
                          fontSize: 12, fontWeight: 600, padding: '4px 11px', borderRadius: 6,
                          background: sel ? EXPO_FG : 'var(--surface-2)',
                          color: sel ? '#fff' : 'var(--fg-muted)',
                          transition: 'all .12s',
                        }}>
                          {sel ? '✓ Sélectionné' : 'Sélectionner'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {commHT > 0 && (
              <div style={{ textAlign: 'right', fontSize: 13, color: EXPO_FG, fontWeight: 600 }}>
                Sous-total communication : {eur(commHT)} HT
              </div>
            )}
          </div>
        )}

        {/* ── Étape 5 : Stand & Prestations ── */}
        {step === 5 && salon && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: '16px 22px 12px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Catalogue des prestations</div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>Sélectionnez les prestations souhaitées. Le forfait de base est obligatoire.</div>
              </div>
              <div style={{ padding: '8px 0 8px' }}>
                {(PRESTATIONS_EXPO[salon.type] || []).map((p, i) => {
                  const qte = prestations[p.id] || 0;
                  return (
                    <div key={p.id} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 22px',
                      borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                      background: p.obligatoire ? EXPO_BG : 'transparent',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 500 }}>{p.nom}</div>
                          {p.obligatoire && <span style={{ fontSize: 11, background: EXPO_FG, color: '#fff', borderRadius: 4, padding: '1px 6px', fontWeight: 600 }}>Obligatoire</span>}
                        </div>
                        {p.desc && <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{p.desc}</div>}
                      </div>
                      <div className="tnum" style={{ fontSize: 13.5, fontWeight: 600, color: p.prixHT === 0 ? EXPO_FG : 'var(--fg)', flexShrink: 0, width: 70, textAlign: 'right' }}>
                        {p.prixHT === 0 ? 'Offert' : `${eur(p.prixHT)} HT`}
                      </div>
                      {p.obligatoire ? (
                        <div style={{ width: 90, textAlign: 'right', fontSize: 12.5, color: 'var(--fg-muted)' }}>Inclus</div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                          <button onClick={() => setPrest(p.id, qte - 1)} className="btn btn-icon btn-sm btn-ghost" disabled={qte <= 0} style={{ width: 28, height: 28, fontSize: 16, lineHeight: 1 }}>−</button>
                          <span className="tnum" style={{ width: 24, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{qte}</span>
                          <button onClick={() => setPrest(p.id, qte + 1)} className="btn btn-icon btn-sm btn-ghost" style={{ width: 28, height: 28, background: qte > 0 ? EXPO_BG : undefined, color: qte > 0 ? EXPO_FG : undefined }}><Icon.Plus size={12}/></button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ padding: '14px 22px', borderTop: '2px solid var(--border)', background: 'var(--surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '0 0 12px 12px' }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Total HT estimé</div>
                <div className="tnum" style={{ fontSize: 20, fontWeight: 700, color: EXPO_FG }}>{eur(totalHT)}</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Étape 6 : Récapitulatif + Paiement ── */}
        {step === 6 && salon && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Récap communication */}
            {commHT > 0 && (
              <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '14px 22px 10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon.Send size={14} style={{ color: 'var(--fg-muted)' }}/>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Options de communication</div>
                </div>
                <table className="table" style={{ width: '100%' }}>
                  <thead><tr><th>Support</th><th style={{ textAlign: 'right' }}>Prix HT</th></tr></thead>
                  <tbody>
                    {(COMMUNICATION_EXPO[salon.type] || []).filter(c => commOptions[c.id]).map((c, i) => (
                      <tr key={i}>
                        <td>
                          <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 999, fontWeight: 600, marginRight: 8, background: c.couleur + '20', color: c.couleur }}>{c.cat}</span>
                          {c.nom}
                        </td>
                        <td className="num tnum">{eur(c.prixHT)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Récap prestations */}
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: '16px 22px 12px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Récapitulatif de la commande</div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2 }}>{salon.nom} {salon.edition} · {form.enseigne || 'Stand sans enseigne'}</div>
              </div>
              <table className="table" style={{ width: '100%' }}>
                <thead><tr><th>Prestation</th><th>Qté</th><th className="num">PU HT</th><th className="num">Total HT</th></tr></thead>
                <tbody>
                  {(PRESTATIONS_EXPO[salon.type] || []).filter(p => (prestations[p.id] || 0) > 0).map((p, i) => (
                    <tr key={i}>
                      <td>{p.nom}</td>
                      <td className="tnum">{prestations[p.id]}</td>
                      <td className="num tnum">{p.prixHT === 0 ? 'Offert' : eur(p.prixHT)}</td>
                      <td className="num tnum">{eur(p.prixHT * (prestations[p.id] || 0))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '12px 22px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px 32px' }}>
                {[
                  ['Total HT',  eur(totalHT)],
                  ['TVA 20 %',  eur(tva)],
                  ['Total TTC', eur(totalTTC)],
                ].map(([l, v], i) => (
                  <React.Fragment key={i}>
                    <div style={{ fontSize: i === 2 ? 14 : 13, fontWeight: i === 2 ? 700 : 400, color: i === 2 ? 'var(--fg)' : 'var(--fg-muted)', textAlign: 'right' }}>{l}</div>
                    <div className="tnum" style={{ fontSize: i === 2 ? 16 : 13, fontWeight: i === 2 ? 700 : 400, color: i === 2 ? EXPO_FG : 'var(--fg-muted)', textAlign: 'right' }}>{v}</div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Paiement */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Mode de règlement</div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 16 }}>
                Un acompte de <strong>40 % TTC ({eur(acompteTTC)})</strong> vous sera demandé après validation de votre dossier par le Comité. Le solde est exigible 30 jours avant le salon.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {[
                  ['virement', 'Virement bancaire', 'Coordonnées fournies par e-mail après validation'],
                  ['cheque',   'Chèque',            'À l\'ordre du Comité des Salons et Concours de Mâcon'],
                  ['cb',       'Carte bancaire',     'Paiement sécurisé via Paybox (redirection)'],
                ].map(([val, label, desc]) => (
                  <label key={val} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer',
                    padding: '12px 14px', borderRadius: 10,
                    border: `2px solid ${form.modePaiement === val ? EXPO_FG : 'var(--border)'}`,
                    background: form.modePaiement === val ? EXPO_BG : 'var(--surface)',
                    transition: 'all .12s',
                  }}>
                    <input type="radio" name="modePaiement" value={val} checked={form.modePaiement === val} onChange={() => setF('modePaiement', val)} style={{ accentColor: EXPO_FG, marginTop: 2 }}/>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{label}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>{desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" checked={form.cgv} onChange={e => setF('cgv', e.target.checked)} style={{ accentColor: EXPO_FG, marginTop: 2 }}/>
                <span>J'ai lu et j'accepte les <a href="#" onClick={e => e.preventDefault()} style={{ color: EXPO_FG, fontWeight: 500 }}>conditions générales de participation</a> ainsi que le règlement intérieur du salon.</span>
              </label>
            </div>
          </div>
        )}

        {/* Navigation wizard */}
        {step > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
            <button onClick={() => setStep(step - 1)} className="btn btn-outline">
              <Icon.ChevronLeft size={14}/> Retour
            </button>
            {step < 6 ? (
              <button onClick={() => setStep(step + 1)} className="btn btn-primary" style={{ background: EXPO_FG, borderColor: EXPO_FG }}>
                Continuer <Icon.ChevronRight size={14}/>
              </button>
            ) : (
              <button
                onClick={() => { if (form.cgv) setConfirmed(true); }}
                disabled={!form.cgv}
                className="btn btn-primary"
                style={{ background: EXPO_FG, borderColor: EXPO_FG, opacity: form.cgv ? 1 : 0.5 }}
              >
                Soumettre mon dossier <Icon.Check size={14}/>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── MA SURFACE ────────────────────────────────────────────────────
const ExposantMaSurface = () => {
  const insc = INSCRIPTION_DEMO_EXPO;
  const salon = insc.salon;

  if (insc.statut !== 'validee') {
    return (
      <div style={{ maxWidth: 520, margin: '80px auto', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fef3c7', color: '#92400e', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Icon.Clock size={28}/>
        </div>
        <h2 className="display" style={{ fontSize: 22, fontWeight: 500, margin: '0 0 10px', letterSpacing: '-0.02em' }}>Surface non encore attribuée</h2>
        <div style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.6, marginBottom: 24 }}>
          Votre dossier est en cours de traitement. La surface allouée sera visible ici dès validation par le Comité.
        </div>
        <StatutExpoBadge statut={insc.statut}/>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: EXPO_BG, border: `4px solid #bbf7d0`,
          color: EXPO_FG,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16,
        }}>
          <Icon.Building size={40}/>
        </div>
        <div style={{ fontSize: 48, fontWeight: 200, letterSpacing: '-0.04em', color: EXPO_FG }}>
          {insc.surfaceM2} m²
        </div>
        <div style={{ fontSize: 15, color: 'var(--fg-muted)', marginTop: 4 }}>Surface allouée · {salon.nom} {salon.edition}</div>
      </div>
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
          {[
            ['Salon', salon.nom],
            ['Édition', salon.edition],
            ['Dates', `${salon.dateDebut} – ${salon.dateFin}`],
            ['Lieu', salon.lieu],
            ['Enseigne stand', insc.enseigne],
            ['Référence dossier', insc.ref],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 16, padding: '14px 18px', background: EXPO_BG, borderRadius: 10, border: `1px solid #bbf7d0`, fontSize: 13, color: EXPO_FG, lineHeight: 1.5 }}>
        <Icon.Info size={14} style={{ marginRight: 8, verticalAlign: 'middle' }}/>
        Aucun emplacement physique n'est attribué — la surface indique uniquement le forfait de m² réservé.
      </div>
    </div>
  );
};

// ── MON COMPTE ────────────────────────────────────────────────────
const ExposantMonCompte = () => {
  const [tab, setTab] = React.useState('infos');
  const tabs = [
    { id: 'infos',       label: 'Entreprise'  },
    { id: 'contact',     label: 'Contact'     },
    { id: 'facturation', label: 'Facturation' },
    { id: 'mdp',         label: 'Mot de passe' },
  ];

  const [saved, setSaved]   = React.useState(false);
  const [noTva, setNoTva]   = React.useState(false);
  const saveFn = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };

  return (
    <div style={{ maxWidth: 620 }}>
      <h1 className="display" style={{ fontSize: 26, fontWeight: 500, marginBottom: 24, letterSpacing: '-0.025em' }}>Mon compte</h1>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '9px 16px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 13.5,
            fontWeight: tab === t.id ? 600 : 400,
            color: tab === t.id ? EXPO_FG : 'var(--fg-muted)',
            borderBottom: `2px solid ${tab === t.id ? EXPO_FG : 'transparent'}`,
            marginBottom: -1,
            transition: 'all .1s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'infos' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
            {/* Identité légale */}
            {[
              ['Raison sociale *', 'Domaine des Trois Pierres SARL', 'span-2'],
              ['SIRET *', '32194712300045', null],
              ['Code APE', '0111Z', null],
              ['Forme juridique', 'SARL', null],
            ].map(([label, val, span]) => (
              <div key={label} className="field" style={span === 'span-2' ? { gridColumn: 'span 2' } : {}}>
                <label className="field-label">{label}</label>
                <input className="input" defaultValue={val}/>
              </div>
            ))}
            {/* Checkbox non assujetti + TVA conditionnelle */}
            <div style={{ gridColumn: 'span 2', margin: '2px 0' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--fg-muted)' }}>
                <input type="checkbox" checked={noTva} onChange={e => setNoTva(e.target.checked)} style={{ accentColor: EXPO_FG, width: 15, height: 15 }}/>
                Personne physique ou non assujetti à la TVA — pas de N° TVA intracommunautaire
              </label>
            </div>
            {!noTva && (
              <div className="field" style={{ gridColumn: 'span 2' }}>
                <label className="field-label">N° TVA intracommunautaire</label>
                <input className="input" defaultValue="FR32194712300"/>
              </div>
            )}
            {/* Adresse */}
            {[
              ['Adresse *', '14 Route des Vignes', 'span-2'],
              ['Code postal *', '71960', null],
              ['Ville *', 'Solutré-Pouilly', null],
              ['Pays *', 'France', null],
              ['Téléphone *', '03 85 37 12 44', null],
              ['E-mail *', 'contact@domaine-3-pierres.fr', null],
              ['Site web', 'www.domaine-3-pierres.fr', null],
            ].map(([label, val, span]) => (
              <div key={label} className="field" style={span === 'span-2' ? { gridColumn: 'span 2' } : {}}>
                <label className="field-label">{label}</label>
                <input className="input" defaultValue={val}/>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            {saved && <span style={{ fontSize: 13, color: EXPO_FG, display: 'flex', alignItems: 'center', gap: 6 }}><Icon.Check size={14}/> Enregistré</span>}
            <button onClick={saveFn} className="btn btn-primary" style={{ background: EXPO_FG, borderColor: EXPO_FG }}>Enregistrer</button>
          </div>
        </div>
      )}

      {tab === 'contact' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Responsable principal</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
            {[
              ['Prénom *', 'Marie', null],
              ['Nom *', 'Dupont', null],
              ['Fonction', 'Gérante', 'span-2'],
              ['Téléphone *', '06 12 34 56 78', null],
              ['E-mail *', 'marie.dupont@domaine-3-pierres.fr', null],
            ].map(([label, val, span]) => (
              <div key={label} className="field" style={span === 'span-2' ? { gridColumn: 'span 2' } : {}}>
                <label className="field-label">{label}</label>
                <input className="input" defaultValue={val}/>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={saveFn} className="btn btn-primary" style={{ background: EXPO_FG, borderColor: EXPO_FG }}>Enregistrer</button>
          </div>
        </div>
      )}

      {tab === 'facturation' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon.Info size={14}/>
            Par défaut, les factures sont adressées à l'adresse principale de l'entreprise.
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13.5, marginBottom: 16 }}>
            <input type="checkbox" style={{ accentColor: EXPO_FG }}/>
            Utiliser une adresse de facturation différente
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px', opacity: 0.4, pointerEvents: 'none' }}>
            {[['Raison sociale', '', 'span-2'], ['Adresse', '', 'span-2'], ['Code postal', '', null], ['Ville', '', null]].map(([label, val, span]) => (
              <div key={label} className="field" style={span === 'span-2' ? { gridColumn: 'span 2' } : {}}>
                <label className="field-label">{label}</label>
                <input className="input" defaultValue={val}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'mdp' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[['Mot de passe actuel', 'current-password'], ['Nouveau mot de passe', 'new-password'], ['Confirmer le nouveau', 'new-password']].map(([label, ac]) => (
              <div key={label} className="field">
                <label className="field-label">{label}</label>
                <input className="input" type="password" autoComplete={ac}/>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" style={{ background: EXPO_FG, borderColor: EXPO_FG }}>Changer le mot de passe</button>
          </div>
        </div>
      )}
    </div>
  );
};

window.ExposantDashboard    = ExposantDashboard;
window.ExposantInscription  = ExposantInscription;
window.ExposantMaSurface    = ExposantMaSurface;
window.ExposantMonCompte    = ExposantMonCompte;
