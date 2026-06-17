// Fiche détaillée d'un dossier d'inscription (admin)
// Header + 5 onglets (Échantillons, Documents, Contrôle, Paiement, Historique) + panneau latéral fixe.

const DOSSIER = {
  ref: 'INS-2026-0184',
  domaine: 'Domaine de la Chevalière',
  region: 'Mâconnais',
  concours: 'Concours France 2026',
  status: 'a-verifier',
  submittedAt: '12/04/2026 14h32',
  totalEch: 8,
  totalDocs: 16,
  amount: '480 €',
  paymentStatus: 'pending', // pending | paid
  methode_paiement: 'virement', // carte | virement | cheque
  contactInscription: { nom: 'Marie Dupont', email: 'marie@chevaliere.fr', tel: '06 12 34 56 78' },
  contactMarketing: { nom: 'Jean Dupont', email: 'jean@chevaliere.fr' },
  siret: '412 345 678 00012',
  controlScore: 74,
};

// R23 — colonnes tableau échantillons redessinées : N°ECH / Appellation / Mill. / Couleur / Qte / Unité / Cuvée / Lot / Statut
// R24 — drawer : ajout complement, renommage dénomination + unité de volume
const ECHANTILLONS = [
  { n: 1, nom: 'Mâcon-Villages Blanc',   appellation: 'Mâcon-Villages',  complement: 'Climat Les Crays',         mill: 2023, cep: 'Chardonnay', vol: '75cl', deg: '12.5°', s: 'ok',   type: 'Blanc tranquille', cuve: 'C-08', lot: 'L-2023-04', qte: 4200, unite: 'BT', denom: 'Domaine de la Chevalière', refProd: 'CHV-2023-001' },
  { n: 2, nom: 'Pouilly-Fuissé',         appellation: 'Pouilly-Fuissé',  complement: 'Lieu-dit En Vers Cras',    mill: 2022, cep: 'Chardonnay', vol: '75cl', deg: '13°',   s: 'warn', type: 'Blanc tranquille', cuve: 'C-14', lot: 'L-2022-08', qte: 2400, unite: 'BT', denom: 'Domaine de la Chevalière', anomaly: 'Volume DREV : 850hl déclaré, 920hl extrait du document', refProd: 'CHV-2022-004' },
  { n: 3, nom: 'Viré-Clessé',            appellation: 'Viré-Clessé',     complement: '',                         mill: 2023, cep: 'Chardonnay', vol: '75cl', deg: '12°',   s: 'ok',   type: 'Blanc tranquille', cuve: 'C-09', lot: 'L-2023-11', qte: 1800, unite: 'BT', denom: 'Domaine de la Chevalière', refProd: 'CHV-2023-002' },
  { n: 4, nom: 'Mâcon-Solutré',          appellation: 'Mâcon-Villages',  complement: 'Lieu-dit Solutré',         mill: 2023, cep: 'Chardonnay', vol: '75cl', deg: '12.5°', s: 'ok',   type: 'Blanc tranquille', cuve: 'C-11', lot: 'L-2023-07', qte:   48, unite: 'HL', denom: 'Domaine de la Chevalière', refProd: 'CHV-2023-003' },
  { n: 5, nom: 'Saint-Véran',            appellation: 'Saint-Véran',     complement: 'Climat Les Pommards',      mill: 2022, cep: 'Chardonnay', vol: '75cl', deg: '13°',   s: 'err',  type: 'Blanc tranquille', cuve: 'C-12A',lot: 'L-2022-03', qte: 1900, unite: 'BT', denom: 'Domaine de la Chevalière', anomaly: 'Cuve déclarée "C-12A" ≠ document "C-12B"', refProd: 'CHV-2022-005' },
  { n: 6, nom: 'Mâcon Rouge',            appellation: 'Mâcon',           complement: '',                         mill: 2022, cep: 'Pinot Noir', vol: '75cl', deg: '12°',   s: 'ok',   type: 'Rouge tranquille', cuve: 'C-22', lot: 'L-2022-15', qte:   32, unite: 'HL', denom: 'Domaine de la Chevalière', refProd: 'CHV-2022-006' },
  { n: 7, nom: 'Bourgogne Blanc',        appellation: 'Bourgogne',       complement: '',                         mill: 2023, cep: 'Chardonnay', vol: '75cl', deg: '12°',   s: 'warn', type: 'Blanc tranquille', cuve: 'C-05', lot: 'L-2023-02', qte: 5100, unite: 'BT', denom: 'Domaine de la Chevalière', anomaly: 'pH manquant dans le bulletin d\'analyses', refProd: 'CHV-2023-007' },
  { n: 8, nom: 'Crémant de Bourgogne',   appellation: 'Crémant',         complement: 'Blanc de Blancs',          mill: 2021, cep: 'Chardonnay', vol: '75cl', deg: '12°',   s: 'ok',   type: 'Effervescent',     cuve: 'C-30', lot: 'L-2021-09', qte:  420, unite: 'HL', denom: 'Domaine de la Chevalière', refProd: 'CHV-2021-008' },
];

const sStyles = {
  ok:   { bg: 'var(--success-bg)', fg: '#166534', icon: <Icon.Check size={11}/>,       label: 'OK' },
  warn: { bg: 'var(--warning-bg)', fg: '#92400e', icon: <Icon.AlertCircle size={11}/>, label: 'À vérifier' },
  err:  { bg: 'var(--danger-bg)',  fg: '#991b1b', icon: <Icon.X size={11}/>,            label: 'Anomalie' },
};

const DossierStatusPill = ({ s, withLabel }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: withLabel ? '2px 8px' : '0',
    borderRadius: 999,
    background: withLabel ? sStyles[s].bg : 'transparent',
    color: sStyles[s].fg,
    fontSize: 11.5, fontWeight: 600,
  }}>
    {sStyles[s].icon}
    {withLabel && sStyles[s].label}
  </span>
);

const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: 10.5, fontWeight: 600, color: 'var(--fg-subtle)',
    letterSpacing: '0.08em', textTransform: 'uppercase',
    marginBottom: 10,
  }}>{children}</div>
);

const KV = ({ label, children, mono }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 10 }}>
    <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{label}</span>
    <span style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 500, fontFamily: mono ? 'Menlo, monospace' : 'inherit' }}>{children}</span>
  </div>
);

// ─── Page principale ───────────────────────────────────────────────

const AdminDossierDetail = ({ onBack, onNavigate }) => {
  const [tab, setTab] = React.useState('echantillons');
  const [drawerEch, setDrawerEch] = React.useState(null);
  const [paid, setPaid] = React.useState(false);
  const [docViewer, setDocViewer] = React.useState(null);
  const [docDecisions, setDocDecisions] = React.useState({}); // { [name]: { status, motif } }
  const [derogDecisions, setDerogDecisions] = React.useState({
    // DER-0028 already resolved as seed example
    'DER-2026-0028': { status: 'granted', comment: 'Attestation valide, délai accordé jusqu’au 16/04/2026.', resolvedAt: '11/04/2026', resolvedBy: 'Sophie L.' },
  });

  const setDocDecision = (name, decision) => {
    setDocDecisions(prev => ({ ...prev, [name]: decision }));
  };

  const DEROGATIONS = [
    {
      ref: 'DER-2026-0032',
      requestedAt: '10/04/2026 à 09h15',
      requestedBy: 'Marie Dupont',
      type: 'Document manquant',
      motif: "Le bulletin d'analyses physicochimiques de l'\u00e9chantillon 3 (Pouilly-Fuiss\u00e9 2023) ne peut pas \u00eatre fourni avant le 15/04 \u2014 le laboratoire INRAE est en maintenance. Je joins l'attestation du laboratoire confirmant la date de rendu.",
      attachment: { name: 'attestation_laboratoire_inrae.pdf', size: '420 Ko' },
      ech: { n: 3, nom: 'Pouilly-Fuiss\u00e9', mill: '2023' },
    },
    {
      ref: 'DER-2026-0028',
      requestedAt: '08/04/2026 à 14h22',
      requestedBy: 'Marie Dupont',
      type: 'D\u00e9passement de volume',
      motif: 'Volume revendiqu\u00e9 sup\u00e9rieur \u00e0 la DREV de 70 hl suite \u00e0 une r\u00e9\u00e9valuation des stocks (cf. document joint).',
      attachment: { name: 'reevaluation_stock_drev.pdf', size: '180 Ko' },
      ech: { n: 2, nom: 'Pouilly-Fuiss\u00e9 Vieilles Vignes', mill: '2022' },
    },
  ];

  const pendingDerog = DEROGATIONS.filter(d => !derogDecisions[d.ref]).length;

  const tabs = [
    { id: 'echantillons', label: '\u00c9chantillons', count: 8 },
    { id: 'documents',    label: 'Documents',    count: 16 },
    { id: 'controle',     label: 'Contr\u00f4le',     warn: true },
    { id: 'derogations',  label: DEROGATIONS.length > 1 ? 'D\u00e9rogations' : 'D\u00e9rogation', count: DEROGATIONS.length, warn: pendingDerog > 0 },
    { id: 'paiement',     label: 'Paiement' },
    { id: 'historique',   label: 'Historique' },
  ];

  return (
    <div data-screen-label="admin-dossier-detail">
      {/* Breadcrumb + back */}
      <div style={{ marginBottom: 16 }}>
        <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, color: 'var(--fg-muted)' }}>
          <Icon.ChevronLeft size={14}/> Retour à la liste
        </button>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
          <span>Administration</span><Icon.ChevronRight size={11}/>
          <span>Concours France</span><Icon.ChevronRight size={11}/>
          <span>Inscriptions</span><Icon.ChevronRight size={11}/>
          <span style={{ color: 'var(--fg)', fontWeight: 500, fontFamily: 'Menlo, monospace' }}>{DOSSIER.ref}</span>
        </div>
      </div>

      {/* Header dossier */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24,
        paddingBottom: 20, marginBottom: 0, borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h1 className="display" style={{ fontSize: 26, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>{DOSSIER.domaine}</h1>
            <StatusBadge status={DOSSIER.status}/>
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <code style={{ fontFamily: 'Menlo, monospace', color: 'var(--burgundy-800)', fontWeight: 500 }}>{DOSSIER.ref}</code>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--fg-subtle)' }}/>
            <span>{DOSSIER.concours}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--fg-subtle)' }}/>
            <span>{DOSSIER.totalEch} échantillons</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--fg-subtle)' }}/>
            <span>Soumis le {DOSSIER.submittedAt}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button className="btn btn-outline btn-sm"><Icon.Mail size={13}/> Contacter</button>
          <button className="btn btn-outline btn-sm" style={{ color: '#991b1b', borderColor: 'var(--border)' }}><Icon.X size={13}/> Rejeter</button>
          <button className="btn btn-primary btn-sm"><Icon.Check size={14}/> Valider le dossier</button>
        </div>
      </div>

      {/* Layout 2 colonnes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 32, marginTop: 24, alignItems: 'flex-start' }}>
        {/* Colonne gauche : tabs + contenu */}
        <div style={{ minWidth: 0 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
            {tabs.map(t => {
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  padding: '12px 0',
                  border: 'none',
                  borderBottom: active ? '2px solid var(--burgundy-800)' : '2px solid transparent',
                  background: 'transparent',
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: -1,
                }}>
                  {t.label}
                  {t.count !== undefined && (
                    <span style={{
                      fontSize: 11, padding: '0 6px', borderRadius: 999,
                      background: active ? 'var(--burgundy-50)' : 'var(--slate-100)',
                      color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)',
                      fontWeight: 500,
                    }}>{t.count}</span>
                  )}
                  {t.warn && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#d97706' }}/>}
                </button>
              );
            })}
          </div>

          <div className="fade-in" key={tab}>
            {tab === 'echantillons' && <TabEchantillons onOpen={setDrawerEch}/>}
            {tab === 'documents'    && <TabDocuments onPreview={setDocViewer} decisions={docDecisions}/>}
            {tab === 'controle'     && <TabControle onPreview={setDocViewer}/>}
            {tab === 'derogations'  && <TabDerogations
                                          list={DEROGATIONS}
                                          decisions={derogDecisions}
                                          onDecide={(ref, dec) => setDerogDecisions(prev => ({ ...prev, [ref]: dec }))}
                                          onPreviewAttachment={(d) => setDocViewer({ name: d.attachment.name, size: d.attachment.size, kind: 'attestation', ech: d.ech, status: 'ok' })}
                                       />}
            {tab === 'paiement'     && <TabPaiement paid={paid} onMarkPaid={() => setPaid(true)}/>}
            {tab === 'historique'   && <TabHistorique paid={paid}/>}
          </div>
        </div>

        {/* Colonne droite : panneau infos */}
        <DossierAside onNavigate={onNavigate}/>
      </div>

      {/* Drawer échantillon */}
      {drawerEch !== null && (
        <EchantillonDrawer ech={ECHANTILLONS[drawerEch]} onClose={() => setDrawerEch(null)}/>
      )}

      {/* Panneau d'aperçu document */}
      {docViewer && (
        <DocumentPreviewPanel
          doc={docViewer}
          decision={docDecisions[docViewer.name]}
          onDecide={(d) => setDocDecision(docViewer.name, d)}
          onClose={() => setDocViewer(null)}
        />
      )}
    </div>
  );
};

// ─── Panneau latéral ───────────────────────────────────────────────

const DossierAside = ({ onNavigate }) => (
  <div style={{
    position: 'sticky', top: 80,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 20,
    fontSize: 13,
  }}>
    <SectionLabel>Producteur</SectionLabel>
    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)', marginBottom: 2 }}>{DOSSIER.domaine}</div>
    <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 8 }}>{DOSSIER.region}</div>
    <a href="#" onClick={e => { e.preventDefault(); onNavigate && onNavigate('producteur-detail'); }} style={{ fontSize: 12.5, color: 'var(--burgundy-800)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      Voir la fiche producteur <Icon.ArrowRight size={11}/>
    </a>

    <div style={{ height: 1, background: 'var(--border)', margin: '18px 0' }}/>

    {/* R21 — Paiement remonté avant Contact inscription */}
    <SectionLabel>Paiement</SectionLabel>
    <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 8 }}>
      Méthode : <strong style={{ color: 'var(--fg)' }}>
        {DOSSIER.methode_paiement === 'virement' ? '🏦 Virement bancaire'
         : DOSSIER.methode_paiement === 'cheque'  ? '📄 Chèque'
         : '🔵 Carte bancaire'}
      </strong>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <span className="display" style={{ fontSize: 22, fontWeight: 500 }}>{DOSSIER.amount}</span>
      <span style={{ fontSize: 11.5, color: '#92400e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
        <Icon.Clock size={11}/> En attente
      </span>
    </div>

    <div style={{ height: 1, background: 'var(--border)', margin: '18px 0' }}/>

    <SectionLabel>Contact inscription</SectionLabel>
    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{DOSSIER.contactInscription.nom}</div>
    <div style={{ fontSize: 12, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
      <Icon.Mail size={11}/> {DOSSIER.contactInscription.email}
    </div>
    <div style={{ fontSize: 12, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
      <Icon.Phone size={11}/> {DOSSIER.contactInscription.tel}
    </div>

    <div style={{ height: 1, background: 'var(--border)', margin: '18px 0' }}/>

    <SectionLabel>Contact marketing</SectionLabel>
    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{DOSSIER.contactMarketing.nom}</div>
    <div style={{ fontSize: 12, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
      <Icon.Mail size={11}/> {DOSSIER.contactMarketing.email}
    </div>

    <div style={{ height: 1, background: 'var(--border)', margin: '18px 0' }}/>

    <SectionLabel>SIRET</SectionLabel>
    <div style={{ fontSize: 13, fontFamily: 'Menlo, monospace', color: 'var(--fg)' }}>{DOSSIER.siret}</div>

    <div style={{ height: 1, background: 'var(--border)', margin: '18px 0' }}/>

    <SectionLabel>Dossier</SectionLabel>
    <KV label="Soumis le">{DOSSIER.submittedAt}</KV>
    <KV label="Échantillons">{DOSSIER.totalEch}</KV>
    <KV label="Documents">{DOSSIER.totalDocs}</KV>
  </div>
);

// ─── Onglet 1 — Échantillons ──────────────────────────────────────

const TabEchantillons = ({ onOpen }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 12 }}>
      <button className="btn btn-outline btn-sm"><Icon.Download size={13}/> Export Excel</button>
    </div>
    <div className="table-wrap">
      <table className="table">
        {/* R23 — colonnes : N°ECH / Appellation / Mill. / Couleur / Qte disponible / Unité / Cuvée / Lot / Statut */}
        <thead>
          <tr>
            <th style={{ width: 48 }}>N°ECH</th>
            <th>Appellation</th>
            <th style={{ width: 60 }}>Mill.</th>
            <th>Couleur</th>
            <th style={{ width: 90, textAlign: 'right' }}>Qte dispo</th>
            <th style={{ width: 64 }}>Unité</th>
            <th>Cuvée</th>
            <th style={{ width: 110 }}>Lot</th>
            <th style={{ width: 130 }}>Réf. Producteur</th>
            <th>Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ECHANTILLONS.map((e, i) => (
            <tr key={e.n} onClick={() => onOpen(i)} style={{ cursor: 'pointer' }}>
              <td className="tnum" style={{ fontWeight: 600, color: 'var(--burgundy-800)' }}>#{e.n}</td>
              <td style={{ fontWeight: 500 }}>{e.appellation}</td>
              <td className="tnum">{e.mill}</td>
              <td className="muted">{e.type}</td>
              <td className="tnum" style={{ textAlign: 'right' }}>{e.qte.toLocaleString('fr-FR')}</td>
              <td><span style={{ fontSize: 11, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: 'var(--slate-100)', color: 'var(--fg-muted)', letterSpacing: '0.04em' }}>{e.unite}</span></td>
              <td style={{ fontWeight: 500 }}>{e.nom}</td>
              <td className="tnum muted" style={{ fontSize: 12 }}>{e.lot}</td>
              <td className="tnum muted" style={{ fontSize: 12 }}>{e.refProd || '—'}</td>
              <td><DossierStatusPill s={e.s} withLabel/></td>
              <td><Icon.ChevronRight size={13} style={{ color: 'var(--fg-subtle)' }}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Drawer échantillon ───────────────────────────────────────────

const EchantillonDrawer = ({ ech, onClose }) => {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(15,23,42,.35)',
      animation: 'fadeIn .15s ease-out',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: 460, maxWidth: '92vw',
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
        boxShadow: '-12px 0 32px rgba(15,23,42,.08)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideRight .2s cubic-bezier(.2,.9,.3,1)',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 500, marginBottom: 4 }}>Échantillon {ech.n} sur 8</div>
            <h3 className="display" style={{ fontSize: 19, fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>{ech.nom}</h3>
            <div style={{ marginTop: 6 }}><DossierStatusPill s={ech.s} withLabel/></div>
          </div>
          <button onClick={onClose} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
        </div>

        <div className="scroll-y" style={{ flex: 1, padding: '20px 24px' }}>
          {ech.anomaly && (
            <div style={{
              padding: '10px 12px', borderRadius: 8,
              background: ech.s === 'err' ? 'var(--danger-bg)' : 'var(--warning-bg)',
              color: ech.s === 'err' ? '#991b1b' : '#92400e',
              fontSize: 12.5, marginBottom: 18,
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
              <Icon.AlertCircle size={14} style={{ marginTop: 1, flexShrink: 0 }}/>
              <div><strong style={{ fontWeight: 600 }}>Anomalie détectée — </strong>{ech.anomaly}</div>
            </div>
          )}

          {/* R24 — libellés mis à jour + complément d'appellation */}
          <SectionLabel>Informations générales</SectionLabel>
          <KV label="Appellation">{ech.appellation}</KV>
          {ech.complement && <KV label="Complément d'appellation (lieu-dit ou climat)">{ech.complement}</KV>}
          <KV label="Millésime">{ech.mill}</KV>
          <KV label="Type">{ech.type}</KV>
          <KV label="Cépage(s)">{ech.cep}</KV>
          <KV label="Nom de Château, Domaine ou Marque commerciale">{ech.denom}</KV>

          <div style={{ height: 1, background: 'var(--border)', margin: '14px 0 18px' }}/>

          <SectionLabel>Caractéristiques techniques</SectionLabel>
          <KV label="Degré alcoolique">{ech.deg}</KV>
          <KV label="Unité de volume">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'var(--slate-100)', color: 'var(--fg-muted)', letterSpacing: '0.04em' }}>{ech.unite}</span>
              <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{ech.unite === 'HL' ? 'Hectolitre' : 'Bouteille (75 cl)'}</span>
            </span>
          </KV>
          <KV label="Quantité disponible"><span className="tnum">{ech.qte.toLocaleString('fr-FR')} {ech.unite === 'HL' ? 'hl' : 'bouteilles'}</span></KV>
          <KV label="Numéro de cuve" mono>{ech.cuve}</KV>
          <KV label="Numéro de lot" mono>{ech.lot}</KV>

          <div style={{ height: 1, background: 'var(--border)', margin: '14px 0 18px' }}/>

          <SectionLabel>Documents associés</SectionLabel>
          <DocRow name={`bulletin-analyses-ech${ech.n}.pdf`} size="2.1 Mo" status={ech.s === 'err' ? 'err' : ech.s === 'warn' ? 'warn' : 'ok'}/>
          <DocRow name={`revendication-aoc-ech${ech.n}.pdf`} size="890 Ko" status="ok"/>
        </div>

        <div style={{ padding: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline btn-sm"><Icon.Edit size={13}/> Corriger</button>
          <button className="btn btn-primary btn-sm"><Icon.Check size={13}/> Valider l'échantillon</button>
        </div>
      </div>
    </div>
  );
};

const DocRow = ({ name, size, status, onPreview, kind, ech, decision }) => (
  <div onClick={() => onPreview && onPreview({ name, size, status, kind, ech })}
    style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 10px',
      border: '1px solid var(--border)',
      borderRadius: 8,
      marginBottom: 6,
      background: 'var(--surface)',
      cursor: onPreview ? 'pointer' : 'default',
      transition: 'border-color .12s, background .12s',
    }}
    onMouseEnter={e => { if (onPreview) { e.currentTarget.style.borderColor = 'var(--burgundy-300)'; e.currentTarget.style.background = 'var(--burgundy-50)'; }}}
    onMouseLeave={e => { if (onPreview) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}}
  >
    <span style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon.FileText size={14}/>
    </span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
        {name}
        {decision && decision.status === 'ok' && (
          <span style={{ fontSize: 10, color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: 2, fontWeight: 500 }}>
            <Icon.Check size={10}/> validé
          </span>
        )}
      </div>
      <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>
        {decision && decision.status === 'problem' && decision.motif
          ? <span style={{ color: '#92400e' }}>⚠ {decision.motif}</span>
          : size}
      </div>
    </div>
    <DossierStatusPill s={status} withLabel/>
    <button className="btn btn-icon btn-sm btn-ghost" title="Aperçu" onClick={e => { e.stopPropagation(); onPreview && onPreview({ name, size, status, kind, ech }); }}><Icon.Eye size={13}/></button>
    <button className="btn btn-icon btn-sm btn-ghost" title="Télécharger" onClick={e => e.stopPropagation()}><Icon.Download size={13}/></button>
  </div>
);

// ─── Onglet 2 — Documents ──────────────────────────────────────────

const TabDocuments = ({ onPreview, decisions = {} }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
        16 documents · groupés par échantillon. Cliquez sur un document pour ouvrir l'aperçu PDF à côté.
      </div>
      <button className="btn btn-outline btn-sm"><Icon.Download size={13}/> Tout télécharger (.zip)</button>
    </div>

    {ECHANTILLONS.map(e => {
      const docs = [
        { kind: 'bulletin',      name: `bulletin-analyses-${e.appellation.toLowerCase().replace(/\s+/g, '-')}.pdf`,  size: `${(1.5 + (e.n % 3) * 0.4).toFixed(1)} Mo`, status: e.s === 'err' ? 'err' : e.s === 'warn' ? 'warn' : 'ok' },
        { kind: 'revendication', name: `revendication-${e.appellation.toLowerCase().replace(/\s+/g, '-')}.pdf`,     size: `${(0.7 + (e.n % 2) * 0.3).toFixed(1)} Mo`, status: 'ok' },
      ];
      return (
        <div key={e.n} style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--fg-subtle)', fontWeight: 600, letterSpacing: '0.06em' }}>ÉCHANTILLON {e.n}</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{e.nom}</span>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>· {e.appellation} {e.mill}</span>
          </div>
          {docs.map(d => {
            const dec = decisions[d.name];
            const effective = dec ? (dec.status === 'problem' ? 'err' : 'ok') : d.status;
            return (
              <DocRow key={d.name} onPreview={onPreview} kind={d.kind} ech={e}
                name={d.name} size={d.size} status={effective}
                decision={dec}/>
            );
          })}
        </div>
      );
    })}
  </div>
);

// ─── Onglet 3 — Contrôle ───────────────────────────────────────────

const TabControle = ({ onPreview }) => {
  // corrections: { [echN]: { fields: { [fieldKey]: { value, source } }, justif } }
  const [corrections, setCorrections] = React.useState({});

  const rules = [
    { rule: 'Champs obligatoires présents',                  s: 'ok',   detail: 'Tous les champs requis sont remplis.' },
    { rule: 'Appellations reconnues dans le référentiel',    s: 'ok',   detail: '8 / 8 appellations valides.' },
    { rule: 'Millésimes autorisés par région',               s: 'ok',   detail: 'Tous autorisés.' },
    { rule: 'Volume ≤ DREV déclaré',                          s: 'warn', detail: 'Éch. 2 : 850 hl déclaré, DREV = 920 hl.' },
    { rule: 'Correspondance numéro de cuve / lot',           s: 'err',  detail: 'Éch. 5 : cuve "C-12A" ≠ document "C-12B".' },
    { rule: 'Données analyses physicochimiques complètes',   s: 'warn', detail: 'Éch. 7 : pH manquant dans le bulletin.' },
    { rule: 'Cohérence appellation ↔ document revendication', s: 'ok',  detail: '8 / 8 concordants.' },
  ];

  return (
    <div>
      {/* Score global */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 24, padding: 22, marginBottom: 20 }}>
        <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
          <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--slate-100)" strokeWidth="3"/>
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#d97706" strokeWidth="3"
              strokeDasharray={`${74 * 0.974} 100`} strokeLinecap="round"/>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="display tnum" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1 }}>74<span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>%</span></span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="display" style={{ fontSize: 17, fontWeight: 500 }}>Score de contrôle</span>
            <StatusBadge status="a-verifier"/>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>Analysé le 12/04/2026 à 15h28 par le système automatique</div>
          <div style={{ display: 'flex', gap: 14, marginTop: 12, fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }}/>4 OK</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#d97706' }}/>2 à vérifier</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626' }}/>1 anomalie</span>
          </div>
        </div>
        <button className="btn btn-outline btn-sm"><Icon.Sparkles size={13}/> Relancer le contrôle</button>
      </div>

      {/* Règles */}
      <SectionLabel>Règles de contrôle</SectionLabel>
      <div className="table-wrap" style={{ marginBottom: 28 }}>
        <table className="table">
          <thead>
            <tr><th style={{ width: 40 }}></th><th>Règle</th><th>Détail</th><th></th></tr>
          </thead>
          <tbody>
            {rules.map((r, i) => (
              <tr key={i}>
                <td><DossierStatusPill s={r.s}/></td>
                <td style={{ fontWeight: 500 }}>{r.rule}</td>
                <td className={r.s === 'ok' ? 'muted' : ''} style={{ color: r.s === 'err' ? '#991b1b' : r.s === 'warn' ? '#92400e' : undefined }}>{r.detail}</td>
                <td>{r.s !== 'ok' && <button className="btn btn-icon btn-sm btn-ghost" title="Voir source" onClick={() => onPreview && onPreview({ name: 'bulletin-analyses-pouilly-fuisse.pdf', size: '1.9 Mo', status: r.s, kind: 'bulletin', ech: ECHANTILLONS[1], anomaly: r })}><Icon.Eye size={13}/></button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comparaison données */}
      <SectionLabel>Données extraites vs déclarées</SectionLabel>
      <DiscrepancyHeader
        totalEcarts={ECARTS.length}
        totalEch={TOTAL_ECHANTILLONS}
        corrected={Object.keys(corrections).length}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ECARTS.map((ech, i) => (
          <EchantillonCorrectionCard
            key={ech.n}
            ech={ech}
            defaultOpen={i === 0}
            saved={corrections[ech.n]}
            onSave={(payload) => setCorrections(prev => ({ ...prev, [ech.n]: payload }))}
            onReset={() => setCorrections(prev => { const c = { ...prev }; delete c[ech.n]; return c; })}
            onPreviewSource={() => onPreview && onPreview({ ...ech.sourceDoc, status: 'warn', kind: 'bulletin', ech: ECHANTILLONS[ech.sourceDoc.echIdx] })}
          />
        ))}
      </div>

      <NoEcartsFooter count={TOTAL_ECHANTILLONS - ECARTS.length}/>
    </div>
  );
};

// ─── Données écarts ────────────────────────────────────────────

const TOTAL_ECHANTILLONS = 8;

const ECARTS = [
  {
    n: 2, nom: 'Pouilly-Fuissé Vieilles Vignes', appellation: 'Pouilly-Fuissé', mill: '2022',
    fields: [
      { key: 'degre',  label: 'Degré',       declared: '13°',     extracted: '13.2°',  gap: { text: '+0.2°',  kind: 'warn' } },
      { key: 'volume', label: 'Volume DREV', declared: '850 hl',  extracted: '920 hl', gap: { text: '−70 hl', kind: 'err'  } },
    ],
    sourceDoc: { name: 'bulletin-analyses-pouilly-fuisse.pdf', size: '1.9 Mo', echIdx: 1 },
  },
  {
    n: 5, nom: 'Mâcon-Solutré', appellation: 'Mâcon-Solutré', mill: '2023',
    fields: [
      { key: 'cuve', label: 'N° de cuve / lot', declared: 'C-12A', extracted: 'C-12B', gap: { text: 'différent', kind: 'err' } },
    ],
    sourceDoc: { name: 'bulletin-analyses-macon-solutre.pdf', size: '1.7 Mo', echIdx: 4 },
  },
];

// ─── En-tête récapitulatif écarts ────────────────────────────────

const DiscrepancyHeader = ({ totalEcarts, totalEch, corrected }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px',
    background: corrected === totalEcarts ? 'rgba(22, 101, 52, 0.06)' : 'rgba(217, 119, 6, 0.07)',
    border: `1px solid ${corrected === totalEcarts ? '#86efac' : '#fbd38d'}`,
    borderRadius: 8,
    marginBottom: 12,
  }}>
    <span style={{
      width: 26, height: 26, borderRadius: '50%',
      background: corrected === totalEcarts ? '#16a34a' : '#d97706',
      color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      {corrected === totalEcarts ? <Icon.Check size={13}/> : <Icon.AlertTriangle size={12}/>}
    </span>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>
        {corrected === totalEcarts
          ? `${totalEcarts} échantillon${totalEcarts > 1 ? 's' : ''} corrigé${totalEcarts > 1 ? 's' : ''} sur ${totalEch}`
          : `${totalEcarts} échantillon${totalEcarts > 1 ? 's' : ''} avec écarts sur ${totalEch}`}
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>
        {corrected === totalEcarts
          ? 'Toutes les corrections ont été enregistrées.'
          : corrected > 0
            ? `${corrected} sur ${totalEcarts} déjà corrigé · ${totalEcarts - corrected} restant${totalEcarts - corrected > 1 ? 's' : ''}`
            : 'Choisissez la valeur retenue pour chaque champ en écart.'}
      </div>
    </div>
  </div>
);

// ─── Carte échantillon corrigeable ─────────────────────────────

const EchantillonCorrectionCard = ({ ech, defaultOpen, saved, onSave, onReset, onPreviewSource }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  // Draft: per field { source, custom }
  const initDraft = () => {
    const d = {};
    ech.fields.forEach(f => {
      const s = saved && saved.fields && saved.fields[f.key];
      d[f.key] = s
        ? { source: s.source, custom: s.source === 'custom' ? s.value : '' }
        : { source: 'declared', custom: '' };
    });
    return d;
  };
  const [draft, setDraft] = React.useState(initDraft);
  const [justif, setJustif] = React.useState(saved ? saved.justif || '' : '');
  // Re-sync when saved prop changes externally (e.g. reset)
  React.useEffect(() => { setDraft(initDraft()); setJustif(saved ? saved.justif || '' : ''); }, [saved]);

  const setField = (key, patch) => setDraft(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const resolveValue = (f) => {
    const d = draft[f.key];
    if (d.source === 'declared') return f.declared;
    if (d.source === 'extracted') return f.extracted;
    return d.custom.trim();
  };

  const dirty = ech.fields.some(f => {
    const d = draft[f.key];
    if (!saved) {
      // Any non-declared change is a dirty draft worth saving
      if (d.source === 'declared') return false;
      if (d.source === 'extracted') return f.declared !== f.extracted;
      return d.custom.trim() !== '' && d.custom.trim() !== f.declared;
    }
    // Compare against saved
    const s = saved.fields[f.key];
    if (!s && d.source !== 'declared') return d.source === 'extracted' ? f.declared !== f.extracted : d.custom.trim() !== '';
    if (s) return s.source !== d.source || (d.source === 'custom' && d.custom !== s.value);
    return false;
  }) || (!!saved && justif !== (saved.justif || ''));

  const handleSave = () => {
    const fields = {};
    ech.fields.forEach(f => {
      const val = resolveValue(f);
      if (!val || val === f.declared) return;
      fields[f.key] = { value: val, source: draft[f.key].source };
    });
    onSave({ fields, justif: justif.trim() });
  };

  const correctedFields = saved ? Object.keys(saved.fields).length : 0;

  return (
    <div className="card" style={{
      padding: 0, overflow: 'hidden',
      borderColor: saved ? '#86efac' : 'var(--border)',
      borderWidth: saved ? 1 : 1,
      transition: 'border-color .15s',
    }}>
      {/* Header (collapse trigger) */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left',
          background: saved ? 'rgba(22, 101, 52, 0.04)' : 'var(--surface)',
          border: 'none', borderBottom: open ? '1px solid var(--border)' : 'none',
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        <Icon.ChevronDown size={14} style={{ transform: open ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform .15s', color: 'var(--fg-muted)' }}/>
        <span style={{ fontSize: 10.5, color: 'var(--fg-subtle)', fontWeight: 600, letterSpacing: '0.06em', flexShrink: 0 }}>ÉCHANTILLON {ech.n}</span>
        <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {ech.nom} <span style={{ color: 'var(--fg-muted)', fontWeight: 400 }}>· {ech.appellation} {ech.mill}</span>
        </span>
        {saved
          ? <span style={{ fontSize: 11, color: '#166534', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: 'rgba(22, 101, 52, 0.1)', borderRadius: 999 }}>
              <Icon.Check size={11}/> Corrigé ({correctedFields})
            </span>
          : <span style={{ fontSize: 11, color: ech.fields.some(f => f.gap && f.gap.kind === 'err') ? '#991b1b' : '#92400e', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: ech.fields.some(f => f.gap && f.gap.kind === 'err') ? 'rgba(153, 27, 27, 0.08)' : 'rgba(146, 64, 14, 0.08)', borderRadius: 999 }}>
              <Icon.AlertTriangle size={11}/> {ech.fields.length} écart{ech.fields.length > 1 ? 's' : ''}
            </span>}
      </button>

      {open && (
        <div>
          <table className="table" style={{ margin: 0 }}>
            <thead>
              <tr><th>Champ</th><th>Déclaré</th><th>Extrait du PDF</th><th>Écart</th><th style={{ width: '40%' }}>Valeur retenue</th></tr>
            </thead>
            <tbody>
              {ech.fields.map(f => (
                <tr key={f.key}>
                  <td style={{ fontWeight: 500 }}>{f.label}</td>
                  <td className="tnum">{f.declared}</td>
                  <td className="tnum">{f.extracted}</td>
                  <td><span style={{ fontSize: 12, color: f.gap.kind === 'err' ? '#991b1b' : '#92400e', fontWeight: 600 }}>{f.gap.text}</span></td>
                  <td>
                    <ValeurRetenueSelector
                      f={f}
                      draft={draft[f.key]}
                      onChange={(patch) => setField(f.key, patch)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: 14, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 4 }}>
                  Justification <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(traçabilité)</span>
                </label>
                <input
                  type="text"
                  value={justif}
                  onChange={e => setJustif(e.target.value)}
                  placeholder="ex. Vérifié auprès du producteur le 12/04 — valeur du bulletin retenue."
                  style={{
                    width: '100%', padding: '7px 10px',
                    border: '1px solid var(--border)', borderRadius: 6,
                    fontSize: 12.5, fontFamily: 'inherit', color: 'var(--fg)',
                    background: 'var(--surface)', outline: 'none',
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
              <a href="#" onClick={e => { e.preventDefault(); onPreviewSource(); }} style={{ fontSize: 12, color: 'var(--burgundy-800)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Icon.FileText size={12}/> Voir le document source <Icon.ArrowRight size={11}/>
              </a>
              <div style={{ display: 'flex', gap: 8 }}>
                {saved && <button className="btn btn-ghost btn-sm" onClick={onReset}>Annuler la correction</button>}
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSave}
                  disabled={!dirty || !justif.trim()}
                  style={(!dirty || !justif.trim()) ? { opacity: 0.5, cursor: 'not-allowed' } : null}
                >
                  <Icon.Check size={13}/> {saved ? 'Mettre à jour' : 'Enregistrer la correction'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Sélecteur inline "valeur retenue" ────────────────────────────

const ValeurRetenueSelector = ({ f, draft, onChange }) => {
  const opts = [
    { id: 'declared',  label: 'Déclaré', value: f.declared },
    { id: 'extracted', label: 'Extrait',  value: f.extracted },
    { id: 'custom',    label: 'Manuel',   value: null },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
      {opts.map(o => {
        const active = draft.source === o.id;
        if (o.id === 'custom') {
          return (
            <div key={o.id}
              onClick={() => onChange({ source: 'custom' })}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '4px 8px',
                border: `1.5px solid ${active ? 'var(--burgundy-800)' : 'var(--border)'}`,
                borderRadius: 6,
                background: active ? 'var(--burgundy-50)' : 'var(--surface)',
                cursor: 'pointer',
                transition: 'all .12s',
              }}
            >
              <span style={{ fontSize: 10.5, color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)', fontWeight: 600 }}>Manuel</span>
              <input
                type="text"
                value={draft.custom}
                onFocus={() => onChange({ source: 'custom' })}
                onChange={e => onChange({ source: 'custom', custom: e.target.value })}
                onClick={e => e.stopPropagation()}
                placeholder="…"
                style={{
                  width: 64,
                  background: 'transparent', border: 'none', outline: 'none',
                  fontSize: 12, fontFamily: 'Menlo, Consolas, monospace',
                  color: 'var(--fg)', padding: 0,
                }}
              />
            </div>
          );
        }
        return (
          <button key={o.id} onClick={() => onChange({ source: o.id })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '4px 8px',
              border: `1.5px solid ${active ? 'var(--burgundy-800)' : 'var(--border)'}`,
              borderRadius: 6,
              background: active ? 'var(--burgundy-50)' : 'var(--surface)',
              cursor: 'pointer',
              transition: 'all .12s',
              fontFamily: 'inherit',
            }}
          >
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              border: `1.5px solid ${active ? 'var(--burgundy-800)' : 'var(--border)'}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {active && <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--burgundy-800)' }}/>}
            </span>
            <span style={{ fontSize: 10.5, color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)', fontWeight: 600 }}>{o.label}</span>
            <span className="tnum" style={{ fontSize: 12, color: active ? 'var(--burgundy-800)' : 'var(--fg)', fontWeight: active ? 600 : 500 }}>{o.value}</span>
          </button>
        );
      })}
    </div>
  );
};

// ─── Footer : échantillons sans écart ─────────────────────────────

const NoEcartsFooter = ({ count }) => (
  <div style={{
    marginTop: 12,
    padding: '10px 14px',
    background: 'rgba(22, 101, 52, 0.04)',
    border: '1px dashed var(--border)',
    borderRadius: 8,
    display: 'flex', alignItems: 'center', gap: 10,
    fontSize: 12.5, color: 'var(--fg-muted)',
  }}>
    <span style={{
      width: 20, height: 20, borderRadius: '50%',
      background: '#16a34a', color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}><Icon.Check size={11}/></span>
    <span><strong style={{ color: 'var(--fg)' }}>{count} autres échantillons</strong> sans écart — aucune action requise.</span>
  </div>
);

// ─── Onglet 4 — Paiement ──────────────────────────────────────────

const TabPaiement = ({ paid, onMarkPaid }) => {
  const methode = DOSSIER.methode_paiement || 'carte';

  if (paid) {
    return (
      <div>
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <SectionLabel>Montant</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="display tnum" style={{ fontSize: 36, fontWeight: 500, letterSpacing: '-0.02em' }}>480 €</span>
            <span className="badge badge-success"><Icon.Check size={11}/> Payé le 12/04/2026 à 16h44</span>
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }}/>
          <SectionLabel>Détail</SectionLabel>
          <table className="table" style={{ margin: 0 }}>
            <tbody>
              <tr><td>8 échantillons × 60 €</td><td className="num tnum" style={{ width: 120, fontWeight: 500 }}>480,00 €</td></tr>
              <tr><td className="muted">TVA (0 %)</td><td className="num tnum muted">0,00 €</td></tr>
              <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ fontWeight: 600 }}>Total TTC</td><td className="num tnum" style={{ fontWeight: 600 }}>480,00 €</td></tr>
            </tbody>
          </table>
        </div>

        {methode === 'carte' && (
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <SectionLabel>Transaction Paybox</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px 24px' }}>
              <KV label="Référence" mono>TXN-2026-08412</KV>
              <KV label="Moyen de paiement">CB Visa ****4521</KV>
              <KV label="Montant" mono>480,00 €</KV>
              <KV label="Statut"><span style={{ color: '#166534', fontWeight: 600 }}>Accepté</span></KV>
            </div>
          </div>
        )}
        {methode === 'virement' && (
          <div className="card" style={{ padding: 24, marginBottom: 20, background: '#eff6ff', borderColor: '#bfdbfe' }}>
            <SectionLabel>Virement reçu</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px 24px' }}>
              <KV label="Reçu le">12/04/2026 à 16h44</KV>
              <KV label="Confirmé par">Sophie L. (admin)</KV>
              <KV label="Montant" mono>480,00 €</KV>
              <KV label="Statut"><span style={{ color: '#166534', fontWeight: 600 }}>Reçu et validé</span></KV>
            </div>
          </div>
        )}
        {methode === 'cheque' && (
          <div className="card" style={{ padding: 24, marginBottom: 20, background: '#f0fdf4', borderColor: '#d1fae5' }}>
            <SectionLabel>Chèque reçu</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px 24px' }}>
              <KV label="Reçu le">12/04/2026 à 16h44</KV>
              <KV label="Confirmé par">Sophie L. (admin)</KV>
              <KV label="Montant" mono>480,00 €</KV>
              <KV label="Statut"><span style={{ color: '#166534', fontWeight: 600 }}>Reçu et validé</span></KV>
            </div>
          </div>
        )}

        <button className="btn btn-outline"><Icon.Download size={14}/> Télécharger la facture FAC-2026-0089</button>
      </div>
    );
  }

  // Pas encore payé
  return (
    <div>
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <SectionLabel>Montant dû</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
          <span className="display tnum" style={{ fontSize: 36, fontWeight: 500, letterSpacing: '-0.02em' }}>480 €</span>
          <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>(8 échantillons × 60 €)</span>
        </div>
        <table className="table" style={{ margin: 0 }}>
          <tbody>
            <tr><td>8 échantillons × 60 €</td><td className="num tnum" style={{ width: 120, fontWeight: 500 }}>480,00 €</td></tr>
            <tr><td className="muted">TVA (0 %)</td><td className="num tnum muted">0,00 €</td></tr>
            <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ fontWeight: 600 }}>Total TTC</td><td className="num tnum" style={{ fontWeight: 600 }}>480,00 €</td></tr>
          </tbody>
        </table>
      </div>

      {methode === 'carte' && (
        <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--warning-bg)', color: '#92400e', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon.Clock size={20}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>En attente de paiement</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>Aucune transaction Paybox enregistrée à ce jour.</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline btn-sm"><Icon.Send size={13}/> Envoyer relance</button>
            <button className="btn btn-primary btn-sm" onClick={onMarkPaid}><Icon.Check size={13}/> Marquer comme payé</button>
          </div>
        </div>
      )}

      {(methode === 'virement' || methode === 'cheque') && (
        <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16, borderColor: '#fde68a', background: '#fffbeb' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fef3c7', color: '#92400e', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon.Clock size={20}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, color: '#92400e' }}>
              {methode === 'virement' ? '🏦 En attente de virement' : '📄 En attente du chèque'}
            </div>
            <div style={{ fontSize: 12.5, color: '#92400e' }}>
              {methode === 'virement'
                ? 'Le producteur a choisi le virement bancaire. Confirmez manuellement à réception.'
                : 'Le producteur a choisi le paiement par chèque. Confirmez manuellement à réception.'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline btn-sm"><Icon.Send size={13}/> Envoyer relance</button>
            <button className="btn btn-primary btn-sm" onClick={onMarkPaid} style={{ background: '#166534', borderColor: '#166534' }}>
              <Icon.Check size={13}/> Marquer le paiement comme reçu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Onglet 5 — Historique ────────────────────────────────────────

const TabHistorique = ({ paid }) => {
  const events12 = [
    paid && { time: '16h44', s: 'success', icon: <Icon.Check size={12}/>, title: 'Paiement confirmé', detail: DOSSIER.methode_paiement === 'virement' ? '480 € · Virement bancaire reçu · Confirmé par Sophie L.' : DOSSIER.methode_paiement === 'cheque' ? '480 € · Chèque reçu · Confirmé par Sophie L.' : '480 € · CB Visa ****4521 · Réf. TXN-2026-08412', actor: null },
    { time: '15h28', s: 'warn',    icon: <Icon.AlertCircle size={12}/>, title: 'Statut → À vérifier (score 74%)', detail: 'Anomalies détectées : volume éch. 2, cuve éch. 5, pH éch. 7', actor: 'Contrôle automatique' },
    { time: '15h10', s: 'info',    icon: <Icon.Sparkles size={12}/>,    title: 'Contrôle automatique lancé', actor: 'Sophie L. (admin)' },
    { time: '14h32', s: 'neutral', icon: <Icon.Mail size={12}/>,        title: 'Email de confirmation envoyé', detail: 'À : marie@chevaliere.fr' },
    { time: '14h32', s: 'neutral', icon: <Icon.FileText size={12}/>,    title: 'Dossier soumis par le producteur', detail: '8 échantillons · 16 documents' },
  ].filter(Boolean);
  const events11 = [
    { time: '09h15', s: 'neutral', icon: <Icon.Edit size={12}/>, title: 'Brouillon créé par le producteur' },
  ];

  const sBg = { success: '#16a34a', warn: '#d97706', info: '#0284c7', neutral: 'var(--slate-300)' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'flex-start' }}>
      <div>
        <SectionLabel>Timeline</SectionLabel>
        <Day day="12 avril 2026" events={events12} sBg={sBg}/>
        <Day day="11 avril 2026" events={events11} sBg={sBg}/>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <SectionLabel>Notes internes <span style={{ textTransform: 'none', color: 'var(--fg-muted)', fontWeight: 400, letterSpacing: 0 }}>(admin uniquement)</span></SectionLabel>
        </div>
        <div style={{ padding: 12, background: 'var(--slate-50)', borderRadius: 8, marginBottom: 12, fontSize: 12.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className="avatar" style={{ width: 22, height: 22, fontSize: 10 }}>SL</span>
            <span style={{ fontWeight: 600 }}>Sophie L.</span>
            <span style={{ color: 'var(--fg-muted)' }}>· 12/04 15h30</span>
          </div>
          <div style={{ color: 'var(--fg)', lineHeight: 1.5 }}>
            « Appelé Marie Dupont, elle confirme que la cuve C-12B est correcte, erreur de saisie dans le formulaire. »
          </div>
        </div>
        <textarea className="input" rows={3} placeholder="Ajouter une note interne…" style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit' }}/>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button className="btn btn-primary btn-sm"><Icon.Plus size={13}/> Ajouter</button>
        </div>
      </div>
    </div>
  );
};

const Day = ({ day, events, sBg }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)', marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>{day}</div>
    <div style={{ position: 'relative', paddingLeft: 22 }}>
      <div style={{ position: 'absolute', left: 8, top: 4, bottom: 4, width: 1, background: 'var(--border)' }}/>
      {events.map((e, i) => (
        <div key={i} style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{
            position: 'absolute', left: -22, top: 1,
            width: 18, height: 18, borderRadius: '50%',
            background: sBg[e.s], color: 'white',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--surface)',
          }}>{e.icon}</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className="tnum" style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 500, minWidth: 38 }}>{e.time}</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{e.title}</span>
          </div>
          {e.detail && <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginLeft: 46, marginTop: 2 }}>{e.detail}</div>}
          {e.actor && <div style={{ fontSize: 11.5, color: 'var(--fg-subtle)', marginLeft: 46, marginTop: 2, fontStyle: 'italic' }}>{e.actor}</div>}
        </div>
      ))}
    </div>
  </div>
);

// ─── Panneau d'aperçu document (PDF mock) ─────────────────────────

const DocumentPreviewPanel = ({ doc, decision, onDecide, onClose }) => {
  const [zoom, setZoom] = React.useState(100);
  const [mode, setMode] = React.useState('idle'); // idle | motif
  const [motif, setMotif] = React.useState('');

  // Reset local mode when switching docs / when decision arrives
  React.useEffect(() => { setMode('idle'); setMotif(''); }, [doc.name]);

  React.useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Truncate filename middle
  const truncMid = (s, max = 42) => {
    if (s.length <= max) return s;
    const keep = Math.floor((max - 1) / 2);
    return s.slice(0, keep) + '…' + s.slice(-keep);
  };

  return (
    <>
      {/* Backdrop léger — laisse voir le dossier derrière */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.15)',
        zIndex: 90,
        animation: 'fadeIn .15s ease-out',
      }}/>

      {/* Panneau latéral droite */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(760px, 65vw)',
        background: '#3a3a3a',
        zIndex: 91,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.25)',
        animation: 'slideInRight .22s cubic-bezier(.2,.8,.2,1)',
      }}>
        {/* Toolbar PDF */}
        <div style={{
          height: 44, flexShrink: 0,
          background: '#2b2b2b',
          color: '#e5e7eb',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '0 12px',
          borderBottom: '1px solid #1a1a1a',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 4, background: '#dc2626', flexShrink: 0 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>PDF</span>
          </span>
          <span style={{ fontSize: 12.5, fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{truncMid(doc.name)}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: '#9ca3af', marginRight: 8 }}>
            <span>1</span><span>/</span><span>2</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button onClick={() => setZoom(Math.max(60, zoom - 10))} style={tbBtn}>−</button>
            <span style={{ fontSize: 11, color: '#9ca3af', minWidth: 36, textAlign: 'center' }}>{zoom}%</span>
            <button onClick={() => setZoom(Math.min(150, zoom + 10))} style={tbBtn}>+</button>
          </div>
          <div style={{ width: 1, height: 18, background: '#1a1a1a', margin: '0 4px' }}/>
          <button style={tbBtn} title="Télécharger"><Icon.Download size={13}/></button>
          <button style={tbBtn} title="Imprimer"><Icon.Printer size={13}/></button>
          <div style={{ width: 1, height: 18, background: '#1a1a1a', margin: '0 4px' }}/>
          <button onClick={onClose} style={{ ...tbBtn, padding: '0 8px' }} title="Fermer (Échap)"><Icon.X size={14}/></button>
        </div>

        {/* Zone document */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: 595,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            background: '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            padding: '36px 44px',
            color: '#1a1a1a',
            fontFamily: 'Georgia, serif',
            fontSize: 10,
            lineHeight: 1.5,
            minHeight: 842,
          }}>
            {doc.kind === 'revendication'
              ? <PdfRevendication ech={doc.ech}/>
              : <PdfBulletin ech={doc.ech} anomaly={doc.status !== 'ok'}/>}
          </div>
        </div>

        {/* Footer / barre d'action de validation */}
        <DocValidationBar
          decision={decision}
          mode={mode} setMode={setMode}
          motif={motif} setMotif={setMotif}
          onValidate={() => onDecide && onDecide({ status: 'ok' })}
          onProblem={() => setMode('motif')}
          onConfirmProblem={() => { onDecide && onDecide({ status: 'problem', motif: motif.trim() || 'Problème non détaillé' }); setMode('idle'); }}
          onReset={() => { onDecide && onDecide(undefined); setMode('idle'); setMotif(''); }}
          docMeta={`${doc.size} · 2 pages · Modifié le 10/04/2026`}
        />
      </div>

      <style>{`
        @keyframes slideInRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  );
};

const tbBtn = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 24, height: 24, padding: 0,
  background: 'transparent', color: '#e5e7eb',
  border: 'none', borderRadius: 4,
  fontSize: 13, fontWeight: 500,
  cursor: 'pointer',
};

// ─── Barre de validation document ─────────────────────────────────

const DocValidationBar = ({ decision, mode, setMode, motif, setMotif, onValidate, onProblem, onConfirmProblem, onReset, docMeta }) => {
  // Décision déjà prise → état "résultat"
  if (decision) {
    const isOk = decision.status === 'ok';
    return (
      <div style={{
        flexShrink: 0,
        background: isOk ? '#0e1f14' : '#241410',
        borderTop: `2px solid ${isOk ? '#16a34a' : '#dc2626'}`,
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          width: 28, height: 28, borderRadius: '50%',
          background: isOk ? '#16a34a' : '#dc2626',
          color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {isOk ? <Icon.Check size={15}/> : <Icon.X size={15}/>}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff' }}>
            {isOk ? 'Document validé' : 'Document marqué comme problématique'}
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isOk
              ? 'Validé par vous · à l\'instant'
              : (decision.motif || 'Sans motif renseigné')}
          </div>
        </div>
        <button onClick={onReset} style={{
          background: 'transparent', color: '#9ca3af', border: '1px solid #4a4a4a',
          padding: '5px 10px', borderRadius: 4, fontSize: 11, fontWeight: 500, cursor: 'pointer',
        }}>Annuler la décision</button>
      </div>
    );
  }

  // Mode "saisie du motif"
  if (mode === 'motif') {
    return (
      <div style={{
        flexShrink: 0,
        background: '#241410',
        borderTop: '1px solid #1a1a1a',
        padding: '12px 16px',
      }}>
        <div style={{ fontSize: 12, color: '#fbbf24', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon.AlertTriangle size={12}/> Motif du problème <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optionnel)</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="text"
            autoFocus
            value={motif}
            onChange={e => setMotif(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onConfirmProblem(); if (e.key === 'Escape') setMode('idle'); }}
            placeholder="ex. Analyse illisible, page 2 manquante…"
            style={{
              flex: 1,
              background: '#1a1a1a',
              border: '1px solid #4a4a4a',
              borderRadius: 4,
              padding: '8px 10px',
              fontSize: 12.5,
              color: '#fff',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <button onClick={() => setMode('idle')} style={{
            background: 'transparent', color: '#9ca3af', border: '1px solid #4a4a4a',
            padding: '7px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer',
          }}>Annuler</button>
          <button onClick={onConfirmProblem} style={{
            background: '#dc2626', color: '#fff', border: '1px solid #dc2626',
            padding: '7px 14px', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>Confirmer</button>
        </div>
      </div>
    );
  }

  // État initial — question + 2 boutons
  return (
    <div style={{
      flexShrink: 0,
      background: '#2b2b2b',
      borderTop: '1px solid #1a1a1a',
      padding: '10px 16px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff' }}>Ce document est-il conforme&nbsp;?</div>
        <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{docMeta}</div>
      </div>
      <button onClick={onProblem} style={{
        background: 'transparent', color: '#fca5a5',
        border: '1px solid #7f1d1d',
        padding: '7px 14px', borderRadius: 5, fontSize: 12, fontWeight: 600,
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#7f1d1d'; e.currentTarget.style.color = '#fff'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fca5a5'; }}>
        <Icon.X size={13}/> Problème
      </button>
      <button onClick={onValidate} style={{
        background: '#16a34a', color: '#fff',
        border: '1px solid #16a34a',
        padding: '7px 16px', borderRadius: 5, fontSize: 12, fontWeight: 600,
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#15803d'; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#16a34a'; }}>
        <Icon.Check size={14}/> Valider
      </button>
    </div>
  );
};

// ─── Contenus PDF mockés ──────────────────────────────────────────

const PdfBulletin = ({ ech, anomaly }) => (
  <>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #1a1a1a', paddingBottom: 12, marginBottom: 18 }}>
      <div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.02em' }}>LABORATOIRE DUBOIS &amp; FILS</div>
        <div style={{ fontSize: 8, color: '#555', marginTop: 2 }}>Œnologie · Analyses physico-chimiques agréées</div>
        <div style={{ fontSize: 8, color: '#555' }}>14 rue de la Vigne, 71000 Mâcon · SIRET 412 089 567 00021</div>
      </div>
      <div style={{ textAlign: 'right', fontSize: 8, color: '#555' }}>
        <div>Réf. labo : <strong style={{ color: '#1a1a1a' }}>LDF-2026-08412</strong></div>
        <div>Émis le : 28 mars 2026</div>
      </div>
    </div>

    <h1 style={{ fontSize: 13, fontWeight: 700, textAlign: 'center', margin: '0 0 4px', letterSpacing: '0.08em' }}>BULLETIN D'ANALYSES PHYSICO-CHIMIQUES</h1>
    <div style={{ textAlign: 'center', fontSize: 9, color: '#555', marginBottom: 20 }}>Vin tranquille — règlement (UE) 2018/273</div>

    <table style={{ width: '100%', fontSize: 9.5, borderCollapse: 'collapse', marginBottom: 18 }}>
      <tbody>
        <tr><td style={kvL}>Client</td><td style={kvR}>Domaine Château de la Roche, M. Henri Marchand</td></tr>
        <tr><td style={kvL}>Échantillon</td><td style={kvR}>{ech?.nom || 'Pouilly-Fuissé Vieilles Vignes'}</td></tr>
        <tr><td style={kvL}>Appellation</td><td style={kvR}>{ech?.appellation || 'Pouilly-Fuissé'} AOC</td></tr>
        <tr><td style={kvL}>Millésime</td><td style={kvR}>{ech?.mill || '2022'}</td></tr>
        <tr><td style={kvL}>Couleur</td><td style={kvR}>Blanc sec</td></tr>
        <tr><td style={kvL}>N° de cuve / lot</td><td style={kvR}>C-12{anomaly ? 'B' : 'A'} · Lot 2026-0341</td></tr>
        <tr><td style={kvL}>Volume revendiqué</td><td style={kvR}><strong>{anomaly ? '920' : '850'} hl</strong></td></tr>
      </tbody>
    </table>

    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #999', paddingBottom: 3, marginBottom: 8 }}>Résultats analytiques</div>
    <table style={{ width: '100%', fontSize: 9.5, borderCollapse: 'collapse', marginBottom: 18 }}>
      <thead>
        <tr style={{ background: '#f3f3ef', fontSize: 8.5 }}>
          <th style={th}>Paramètre</th>
          <th style={th}>Méthode</th>
          <th style={{ ...th, textAlign: 'right' }}>Résultat</th>
          <th style={{ ...th, textAlign: 'right' }}>Unité</th>
          <th style={{ ...th, textAlign: 'right' }}>Norme AOC</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style={td}>Titre alcoométrique volumique</td><td style={td}>OIV-MA-AS312-01</td><td style={tdN}>13,2</td><td style={tdN}>% vol</td><td style={tdN}>≥ 11,0</td></tr>
        <tr><td style={td}>Sucres totaux</td><td style={td}>OIV-MA-AS311-01</td><td style={tdN}>2,4</td><td style={tdN}>g/L</td><td style={tdN}>≤ 4,0</td></tr>
        <tr><td style={td}>Acidité totale (H₂SO₄)</td><td style={td}>OIV-MA-AS313-01</td><td style={tdN}>3,8</td><td style={tdN}>g/L</td><td style={tdN}>≥ 3,5</td></tr>
        <tr><td style={td}>Acidité volatile</td><td style={td}>OIV-MA-AS313-02</td><td style={tdN}>0,42</td><td style={tdN}>g/L</td><td style={tdN}>≤ 0,88</td></tr>
        <tr style={anomaly ? { background: '#fef3c7' } : null}>
          <td style={td}>pH</td>
          <td style={td}>OIV-MA-AS313-15</td>
          <td style={tdN}>{anomaly ? '—' : '3,18'}</td>
          <td style={tdN}>—</td>
          <td style={tdN}>—</td>
        </tr>
        <tr><td style={td}>SO₂ libre</td><td style={td}>OIV-MA-AS323-04A</td><td style={tdN}>28</td><td style={tdN}>mg/L</td><td style={tdN}>—</td></tr>
        <tr><td style={td}>SO₂ total</td><td style={td}>OIV-MA-AS323-04B</td><td style={tdN}>118</td><td style={tdN}>mg/L</td><td style={tdN}>≤ 200</td></tr>
        <tr><td style={td}>Sucres réducteurs</td><td style={td}>OIV-MA-AS311-01A</td><td style={tdN}>1,8</td><td style={tdN}>g/L</td><td style={tdN}>—</td></tr>
      </tbody>
    </table>

    {anomaly && (
      <div style={{ border: '1px solid #d97706', background: '#fffbeb', padding: '8px 10px', fontSize: 9, marginBottom: 18 }}>
        <strong>Observation laboratoire :</strong> Valeur de pH non renseignée — relance demandée le 02/04/2026.
      </div>
    )}

    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #999', paddingBottom: 3, marginBottom: 8 }}>Conclusion</div>
    <p style={{ fontSize: 9.5, margin: '0 0 24px' }}>
      L'échantillon présenté est <strong>conforme</strong> aux critères analytiques de l'appellation {ech?.appellation || 'Pouilly-Fuissé'} pour le millésime {ech?.mill || '2022'}{anomaly ? ', sous réserve de complément d\'information sur la valeur de pH' : ''}. Le présent bulletin est destiné à accompagner la déclaration de candidature au Concours des Vins de Mâcon.
    </p>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #1a1a1a', paddingTop: 12, marginTop: 24 }}>
      <div style={{ fontSize: 8, color: '#555' }}>
        <div>Œnologue responsable</div>
        <div style={{ marginTop: 18, fontFamily: 'Brush Script MT, cursive', fontSize: 13, color: '#1a1a1a' }}>Mathilde Dubois</div>
        <div>Dr. M. Dubois — n° agrément 71-A-0089</div>
      </div>
      <div style={{ fontSize: 8, color: '#555', textAlign: 'right' }}>
        <div style={{ width: 70, height: 70, border: '1.5px solid #531442', borderRadius: '50%', color: '#531442', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 7.5, fontWeight: 700, lineHeight: 1.2, textAlign: 'center', padding: 4 }}>
          LABO<br/>AGRÉÉ<br/>COFRAC
        </div>
      </div>
    </div>
  </>
);

const PdfRevendication = ({ ech }) => (
  <>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #1a1a1a', paddingBottom: 12, marginBottom: 18 }}>
      <div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 11, fontWeight: 700 }}>RÉPUBLIQUE FRANÇAISE</div>
        <div style={{ fontSize: 8, color: '#555' }}>Institut National de l'Origine et de la Qualité</div>
        <div style={{ fontSize: 8, color: '#555' }}>Délégation Bourgogne — 132 rue de la Liberté, 21000 Dijon</div>
      </div>
      <div style={{ textAlign: 'right', fontSize: 8, color: '#555' }}>
        <div>N° DREV : <strong style={{ color: '#1a1a1a' }}>BOU-2026-{ech?.n || '02'}478</strong></div>
        <div>Campagne 2025-2026</div>
      </div>
    </div>

    <h1 style={{ fontSize: 12, fontWeight: 700, textAlign: 'center', margin: '0 0 4px', letterSpacing: '0.06em' }}>DÉCLARATION DE REVENDICATION</h1>
    <div style={{ textAlign: 'center', fontSize: 8.5, color: '#555', marginBottom: 22 }}>Vins d'Appellation d'Origine Contrôlée</div>

    <table style={{ width: '100%', fontSize: 9.5, borderCollapse: 'collapse', marginBottom: 14 }}>
      <tbody>
        <tr><td style={kvL}>Déclarant</td><td style={kvR}>SCEA Château de la Roche</td></tr>
        <tr><td style={kvL}>CVI / SIRET</td><td style={kvR}>71089 0421 · 542 781 003 00018</td></tr>
        <tr><td style={kvL}>Adresse</td><td style={kvR}>1245 chemin des Vignes, 71960 Fuissé</td></tr>
      </tbody>
    </table>

    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #999', paddingBottom: 3, marginBottom: 8 }}>Appellation revendiquée</div>
    <table style={{ width: '100%', fontSize: 9.5, borderCollapse: 'collapse', marginBottom: 18 }}>
      <thead>
        <tr style={{ background: '#f3f3ef', fontSize: 8.5 }}>
          <th style={th}>Appellation</th>
          <th style={{ ...th, textAlign: 'right' }}>Superficie</th>
          <th style={{ ...th, textAlign: 'right' }}>Rendement</th>
          <th style={{ ...th, textAlign: 'right' }}>Volume revendiqué</th>
          <th style={{ ...th, textAlign: 'right' }}>Millésime</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style={td}>{ech?.appellation || 'Pouilly-Fuissé'} AOC</td><td style={tdN}>12,40 ha</td><td style={tdN}>52 hl/ha</td><td style={tdN}><strong>850 hl</strong></td><td style={tdN}>{ech?.mill || '2022'}</td></tr>
      </tbody>
    </table>

    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #999', paddingBottom: 3, marginBottom: 8 }}>Engagements du déclarant</div>
    <ol style={{ fontSize: 9.5, paddingLeft: 18, margin: '0 0 22px' }}>
      <li style={{ marginBottom: 4 }}>Je déclare avoir respecté l'intégralité du cahier des charges de l'appellation.</li>
      <li style={{ marginBottom: 4 }}>Je certifie l'exactitude des volumes et superficies déclarés sous peine des sanctions prévues à l'article L. 645-1 du Code rural.</li>
      <li style={{ marginBottom: 4 }}>Je m'engage à conserver les justificatifs (registre de cave, bons d'enlèvement) pendant cinq ans.</li>
    </ol>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #1a1a1a', paddingTop: 12 }}>
      <div style={{ fontSize: 8, color: '#555' }}>
        <div>Fait à Fuissé, le 14 mars 2026</div>
        <div style={{ marginTop: 18, fontFamily: 'Brush Script MT, cursive', fontSize: 13, color: '#1a1a1a' }}>H. Marchand</div>
        <div>Henri Marchand, gérant</div>
      </div>
      <div style={{ width: 70, height: 70, border: '1.5px solid #1a1a1a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700, lineHeight: 1.2, textAlign: 'center', color: '#555' }}>
        CACHET<br/>DÉCLARANT
      </div>
    </div>
  </>
);

const kvL = { fontSize: 9, color: '#555', padding: '2px 0', width: 140, verticalAlign: 'top' };
const kvR = { fontSize: 9.5, color: '#1a1a1a', padding: '2px 0' };
const th  = { padding: '6px 8px', textAlign: 'left', fontWeight: 700, color: '#1a1a1a', borderBottom: '1px solid #999' };
const td  = { padding: '5px 8px', borderBottom: '1px dotted #ccc', color: '#1a1a1a' };
const tdN = { ...td, textAlign: 'right', fontFamily: 'Menlo, Consolas, monospace', fontSize: 9 };


// ─── Onglet 4bis — Dérogations ────────────────────────────────────

const TabDerogations = ({ list, decisions, onDecide, onPreviewAttachment }) => {
  const pending = list.filter(d => !decisions[d.ref]);
  const resolved = list.filter(d => decisions[d.ref]);

  return (
    <div>
      {pending.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 14px',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 8,
          marginBottom: 18,
        }}>
          <Icon.AlertTriangle size={16} style={{ color: '#d97706', flexShrink: 0 }}/>
          <div style={{ flex: 1, fontSize: 12.5, color: '#78350f' }}>
            <strong>{pending.length} dérogation{pending.length > 1 ? 's' : ''} en attente</strong> de votre validation.
            Le dossier ne pourra être validé tant qu'elles n'auront pas été traitées.
          </div>
        </div>
      )}

      {pending.map(d => (
        <DerogationCard
          key={d.ref}
          d={d}
          onDecide={(dec) => onDecide(d.ref, dec)}
          onPreviewAttachment={() => onPreviewAttachment(d)}
        />
      ))}

      {resolved.length > 0 && (
        <React.Fragment>
          {pending.length > 0 && (
            <div style={{ fontSize: 11, color: 'var(--fg-subtle)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '24px 0 12px' }}>
              Dérogations déjà traitées
            </div>
          )}
          {resolved.map(d => (
            <DerogationCardResolved
              key={d.ref}
              d={d}
              decision={decisions[d.ref]}
              onPreviewAttachment={() => onPreviewAttachment(d)}
            />
          ))}
        </React.Fragment>
      )}

      {list.length === 0 && (
        <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--fg-muted)' }}>
          Aucune dérogation demandée pour ce dossier.
        </div>
      )}
    </div>
  );
};

const DerogationCard = ({ d, onDecide, onPreviewAttachment }) => {
  const [comment, setComment] = React.useState('');

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 14, border: '1px solid var(--border)' }}>
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid var(--border)', background: 'var(--slate-50)' }}>
        <div style={{ minWidth: 0 }}>
          <code style={{ fontFamily: 'Menlo, Consolas, monospace', fontSize: 13, fontWeight: 600, color: 'var(--burgundy-800)' }}>{d.ref}</code>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 3 }}>
            Demandée le {d.requestedAt} par <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>{d.requestedBy}</strong>
          </div>
        </div>
        <DerogStatusBadge status="pending"/>
      </div>

      <div style={{ padding: '16px 18px' }}>
        <SectionLabel>Motif de la demande</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, marginBottom: 8 }}>
          <span style={{ color: 'var(--fg-muted)' }}>Type :</span>
          <span style={{ fontWeight: 500, color: 'var(--fg)' }}>{d.type}</span>
        </div>
        <blockquote style={{
          margin: 0,
          padding: '10px 14px',
          borderLeft: '3px solid var(--burgundy-300)',
          background: 'var(--burgundy-50)',
          fontSize: 13,
          color: 'var(--fg)',
          fontStyle: 'italic',
          lineHeight: 1.55,
          borderRadius: '0 6px 6px 0',
        }}>{d.motif}</blockquote>

        {d.attachment && (
          <React.Fragment>
            <SectionLabel style={{ marginTop: 18 }}>Pièce jointe</SectionLabel>
            <div onClick={onPreviewAttachment} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px',
              border: '1px solid var(--border)',
              borderRadius: 8,
              background: 'var(--surface)',
              cursor: 'pointer',
              transition: 'border-color .12s, background .12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--burgundy-300)'; e.currentTarget.style.background = 'var(--burgundy-50)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}
            >
              <span style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon.FileText size={14}/>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.attachment.name}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{d.attachment.size}</div>
              </div>
              <button className="btn btn-icon btn-sm btn-ghost" title="Aperçu" onClick={e => { e.stopPropagation(); onPreviewAttachment(); }}><Icon.Eye size={13}/></button>
              <button className="btn btn-icon btn-sm btn-ghost" title="Télécharger" onClick={e => e.stopPropagation()}><Icon.Download size={13}/></button>
            </div>
          </React.Fragment>
        )}

        <SectionLabel style={{ marginTop: 18 }}>Échantillon concerné</SectionLabel>
        <div style={{ fontSize: 13, color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--fg-subtle)', fontWeight: 600, letterSpacing: '0.06em', padding: '2px 6px', background: 'var(--slate-100)', borderRadius: 4 }}>ÉCH. {d.ech.n}</span>
          <span style={{ fontWeight: 500 }}>{d.ech.nom}</span>
          <span style={{ color: 'var(--fg-muted)' }}>· {d.ech.mill}</span>
        </div>
      </div>

      <div style={{ padding: '16px 18px', borderTop: '1px solid var(--border)', background: '#fafaf9' }}>
        <SectionLabel>Réponse de l'administration</SectionLabel>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Commentaire (optionnel) — visible par le producteur"
          rows={2}
          style={{
            width: '100%',
            padding: '8px 10px',
            border: '1px solid var(--border)',
            borderRadius: 6,
            fontSize: 12.5,
            fontFamily: 'inherit',
            color: 'var(--fg)',
            background: 'var(--surface)',
            outline: 'none',
            resize: 'vertical',
            marginBottom: 12,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            className="btn btn-outline btn-sm"
            style={{ color: '#991b1b', borderColor: '#fecaca' }}
            onClick={() => onDecide({ status: 'refused', comment: comment.trim(), resolvedAt: '12/05/2026', resolvedBy: 'Sophie L.' })}
          >
            <Icon.X size={13}/> Refuser la dérogation
          </button>
          <button
            className="btn btn-primary btn-sm"
            style={{ background: '#16a34a', borderColor: '#16a34a' }}
            onClick={() => onDecide({ status: 'granted', comment: comment.trim(), resolvedAt: '12/05/2026', resolvedBy: 'Sophie L.' })}
          >
            <Icon.Check size={14}/> Accorder la dérogation
          </button>
        </div>
      </div>
    </div>
  );
};

const DerogationCardResolved = ({ d, decision, onPreviewAttachment }) => (
  <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 12, border: '1px solid var(--border)' }}>
    <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid var(--border)', background: 'var(--slate-50)' }}>
      <div style={{ minWidth: 0 }}>
        <code style={{ fontFamily: 'Menlo, Consolas, monospace', fontSize: 13, fontWeight: 600, color: 'var(--burgundy-800)' }}>{d.ref}</code>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 3 }}>
          Demandée le {d.requestedAt.split(' à ')[0]} · Traitée le {decision.resolvedAt} par <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>{decision.resolvedBy}</strong>
        </div>
      </div>
      <DerogStatusBadge status={decision.status}/>
    </div>

    <div style={{ padding: '12px 18px', fontSize: 13 }}>
      <div style={{ color: 'var(--fg)', marginBottom: 8 }}>
        <span style={{ color: 'var(--fg-muted)' }}>Type :</span> {d.type} —
        <span style={{ marginLeft: 4 }}>Échantillon {d.ech.n} ({d.ech.nom} {d.ech.mill})</span>
      </div>

      {decision.comment && (
        <div style={{ fontSize: 12.5, color: 'var(--fg)' }}>
          <span style={{ color: 'var(--fg-muted)' }}>Commentaire admin :</span>{' '}
          <span style={{ fontStyle: 'italic' }}>« {decision.comment} »</span>
        </div>
      )}

      {d.attachment && (
        <div style={{ marginTop: 10 }}>
          <a href="#" onClick={e => { e.preventDefault(); onPreviewAttachment(); }} style={{ fontSize: 12, color: 'var(--burgundy-800)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon.FileText size={11}/> {d.attachment.name} <Icon.ArrowRight size={11}/>
          </a>
        </div>
      )}
    </div>
  </div>
);

const DerogStatusBadge = ({ status }) => {
  const map = {
    pending:  { bg: '#fef3c7', fg: '#78350f', label: 'En attente',  icon: <Icon.Clock size={11}/> },
    granted:  { bg: '#dcfce7', fg: '#166534', label: 'Accordée',   icon: <Icon.Check size={11}/> },
    refused:  { bg: '#fee2e2', fg: '#991b1b', label: 'Refusée',    icon: <Icon.X     size={11}/> },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 9px', borderRadius: 999,
      background: s.bg, color: s.fg,
      fontSize: 11.5, fontWeight: 600,
      flexShrink: 0,
    }}>
      {s.icon} {s.label}
    </span>
  );
};

Object.assign(window, { AdminDossierDetail });
