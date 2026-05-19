// ─── Fiche détail inscription exposant ─────────────────────────────

const EXPO_DETAIL = {
  ref: 'INS-2026-0142',
  entreprise: 'Domaine de la Chevalière',
  responsable: 'Marie Dupont',
  type: 'Viticulteur',
  email: 'marie@chevaliere.fr',
  tel: '06 12 34 56 78',
  ville: 'Mâcon (71)',
  siret: '412 345 678 00012',
  salon: 'Salon des Vins de Mâcon 2026',
  salonDates: '14 → 16 novembre 2026',
  demandeAt: '08/05/2026 à 11h24',
  superficie: 12,
  besoins: "Stand d'angle si possible, avec une arrivée d'eau pour rinçage des verres. Affichage mural sur 2 faces (kakémonos fournis). Prévoir une prise électrique 16A pour réfrigération.",
  commentaire: "Participation pour la 5e année consécutive. Nous présentons 8 cuvées dont 3 nouveautés du millésime 2024.",
  docs: [
    { kind: 'KBis',            name: 'kbis-chevaliere-2026.pdf',         size: '180 Ko', status: 'ok' },
    { kind: 'Assurance',       name: 'attestation-rc-pro-2026.pdf',      size: '95 Ko',  status: 'ok' },
    { kind: 'Photos',          name: 'photos-stand-2025.zip',            size: '4.2 Mo', status: 'ok' },
  ],
  acompte: { montant: 240, status: 'paye',    paidAt: '10/05/2026 à 16h08', moyen: 'CB' },
  solde:   { montant: 360, status: 'attente', dueAt:  '30/09/2026' },
  stand:   null, // null = pas encore attribué
};

const AdminInscriptionExposantDetail = ({ onBack }) => {
  const [tab, setTab]       = React.useState('demande');
  const [validateModal, setValidateModal] = React.useState(false);
  const [refuseModal, setRefuseModal]     = React.useState(false);
  const [contactMenu, setContactMenu]     = React.useState(false);
  const [stand, setStand]   = React.useState(EXPO_DETAIL.stand); // {id, sqm, tarif, zone}
  const [history, setHistory] = React.useState([
    { date: '08/05/2026 à 11h24', icon: <Icon.Plus size={12}/>, label: 'Demande reçue',         sub: `${EXPO_DETAIL.responsable} · via le formulaire en ligne`,           kind: 'info' },
    { date: '10/05/2026 à 16h08', icon: <Icon.CreditCard size={12}/>, label: 'Acompte payé',    sub: `240 € par CB · transaction #PAYBOX-22841`,                          kind: 'success' },
  ]);

  const status = stand ? 'validee' : 'attente';

  const onValidate = (chosenStand) => {
    setStand(chosenStand);
    setHistory(h => [
      ...h,
      { date: '15/05/2026 à 14h22', icon: <Icon.Check size={12}/>,        label: 'Demande validée',     sub: 'Sophie L.',                                                   kind: 'success' },
      { date: '15/05/2026 à 14h22', icon: <Icon.Map size={12}/>,          label: 'Stand attribué',      sub: `Stand ${chosenStand.id} · ${chosenStand.sqm} m² · zone ${chosenStand.zone}`, kind: 'success' },
    ]);
    setValidateModal(false);
    setTab('stand');
  };

  return (
    <div data-screen-label="admin-inscription-exposant-detail">
      {/* Back link */}
      <div style={{ marginBottom: 16 }}>
        <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, color: 'var(--fg-muted)' }}>
          <Icon.ChevronLeft size={14}/> Retour à la liste
        </button>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 6 }}>
          Administration <span style={{ color: 'var(--fg-subtle)', margin: '0 6px' }}>›</span>
          Salons & exposants <span style={{ color: 'var(--fg-subtle)', margin: '0 6px' }}>›</span>
          Inscriptions exposants <span style={{ color: 'var(--fg-subtle)', margin: '0 6px' }}>›</span>
          <span style={{ color: 'var(--fg)' }}>{EXPO_DETAIL.entreprise}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <h1 className="display" style={{ fontSize: 28, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>{EXPO_DETAIL.entreprise}</h1>
              <InscriptionStatusBadge kind={status}/>
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>{EXPO_DETAIL.ref}</span>
              <span style={{ color: 'var(--fg-subtle)' }}>·</span>
              <span><ActiviteBadge type={EXPO_DETAIL.type}/></span>
              <span style={{ color: 'var(--fg-subtle)' }}>·</span>
              <span>Demande reçue le <strong className="tnum" style={{ color: 'var(--fg)', fontWeight: 500 }}>{EXPO_DETAIL.demandeAt}</strong></span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', position: 'relative' }}>
            <button className="btn btn-outline btn-sm" onClick={() => setContactMenu(o => !o)}>
              <Icon.Mail size={13}/> Contacter
              <Icon.ChevronDown size={11} style={{ marginLeft: 2, opacity: 0.6 }}/>
            </button>
            {contactMenu && (
              <>
                <div onClick={() => setContactMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }}/>
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', right: 'calc(50% + 60px)',
                  background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
                  boxShadow: '0 12px 32px rgba(15,23,42,0.10)',
                  minWidth: 240, zIndex: 60, overflow: 'hidden', padding: '4px 0',
                }}>
                  <CmdMenuItem icon={<Icon.Mail size={13}/>}  label={`Email — ${EXPO_DETAIL.email}`} onClick={() => setContactMenu(false)}/>
                  <CmdMenuItem icon={<Icon.Phone size={13}/>} label={`Téléphone — ${EXPO_DETAIL.tel}`} onClick={() => setContactMenu(false)}/>
                  <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }}/>
                  <CmdMenuItem icon={<Icon.Send size={13}/>}  label="Envoyer une relance paiement" onClick={() => setContactMenu(false)}/>
                </div>
              </>
            )}
            <button className="btn btn-outline btn-sm" onClick={() => setRefuseModal(true)} style={{ color: '#991b1b', borderColor: '#fecaca' }}>
              <Icon.X size={13}/> Refuser
            </button>
            <button
              className="btn btn-primary btn-sm"
              disabled={status !== 'attente'}
              onClick={() => setValidateModal(true)}
              style={{
                background: 'var(--burgundy-800)',
                opacity: status !== 'attente' ? 0.45 : 1,
                cursor: status !== 'attente' ? 'not-allowed' : 'pointer',
              }}
            >
              <Icon.Check size={13}/> Valider + attribuer un stand
            </button>
          </div>
        </div>
      </div>

      {/* Two-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'flex-start' }}>
        {/* Main column */}
        <div>
          {/* Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
            {[
              { id: 'demande',    label: 'Demande' },
              { id: 'stand',      label: 'Stand attribué', warn: !stand },
              { id: 'paiement',   label: 'Paiement' },
              { id: 'historique', label: 'Historique', count: history.length },
            ].map(t => {
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  padding: '12px 0', border: 'none',
                  borderBottom: active ? '2px solid var(--burgundy-800)' : '2px solid transparent',
                  background: 'transparent',
                  fontSize: 13.5, fontWeight: active ? 600 : 500,
                  color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
                  marginBottom: -1, fontFamily: 'inherit',
                }}>
                  {t.label}
                  {t.warn && <span style={{ width: 6, height: 6, borderRadius: 999, background: '#f59e0b' }}/>}
                  {t.count != null && (
                    <span style={{
                      fontSize: 11, padding: '0 6px', borderRadius: 999,
                      background: active ? 'var(--burgundy-50)' : 'var(--slate-100)',
                      color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)', fontWeight: 500,
                    }}>{t.count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {tab === 'demande'    && <ExpoTabDemande/>}
          {tab === 'stand'      && <ExpoTabStand stand={stand} onAttribuer={() => setValidateModal(true)} canAttribuer={status === 'attente'}/>}
          {tab === 'paiement'   && <ExpoTabPaiement/>}
          {tab === 'historique' && <ExpoTabHistorique items={history}/>}
        </div>

        {/* Sidebar */}
        <aside style={{
          position: 'sticky', top: 16,
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
          padding: 0, overflow: 'hidden',
        }}>
          <div style={{ padding: '18px 18px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'var(--burgundy-50)', color: 'var(--burgundy-800)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, fontSize: 16, flexShrink: 0,
              }}>
                {EXPO_DETAIL.entreprise.split(' ').filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join('').toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {EXPO_DETAIL.entreprise}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 2 }}>
                  {EXPO_DETAIL.type} · {EXPO_DETAIL.ville}
                </div>
              </div>
            </div>
          </div>

          <SidebarSection label="Contact">
            <KVMini label="Responsable" value={EXPO_DETAIL.responsable}/>
            <KVMini label="Email"       value={EXPO_DETAIL.email} mono/>
            <KVMini label="Téléphone"   value={EXPO_DETAIL.tel}   mono/>
            <KVMini label="SIRET"       value={EXPO_DETAIL.siret} mono/>
          </SidebarSection>

          <SidebarSection label="Événement">
            <KVMini label="Salon"      value={EXPO_DETAIL.salon}/>
            <KVMini label="Dates"      value={EXPO_DETAIL.salonDates}/>
            <KVMini label="Demande"    value={EXPO_DETAIL.demandeAt}/>
          </SidebarSection>

          <SidebarSection label="Paiement" last>
            <SidebarPaiementRow label="Acompte (40%)" montant={EXPO_DETAIL.acompte.montant} status={EXPO_DETAIL.acompte.status}/>
            <SidebarPaiementRow label="Solde (60%)"   montant={EXPO_DETAIL.solde.montant}   status={EXPO_DETAIL.solde.status}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 10, paddingTop: 10, borderTop: '1px dashed var(--border)' }}>
              <span style={{ fontSize: 11.5, color: 'var(--fg-muted)', fontWeight: 500 }}>Total</span>
              <span className="tnum display" style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.01em' }}>{EXPO_DETAIL.acompte.montant + EXPO_DETAIL.solde.montant} €</span>
            </div>
          </SidebarSection>
        </aside>
      </div>

      {validateModal && <AttribuerStandModal onCancel={() => setValidateModal(false)} onConfirm={onValidate}/>}
      {refuseModal   && <RefuserDemandeModal onCancel={() => setRefuseModal(false)} onConfirm={() => setRefuseModal(false)}/>}
    </div>
  );
};

// ─── Sidebar bits ─────────────────────────────────────────────────

const SidebarSection = ({ label, children, last }) => (
  <div style={{ padding: '16px 18px', borderBottom: last ? 'none' : '1px solid var(--border)' }}>
    <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--fg-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
    {children}
  </div>
);

const KVMini = ({ label, value, mono }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 10 }}>
    <span style={{ fontSize: 10.5, color: 'var(--fg-muted)' }}>{label}</span>
    <span style={{ fontSize: 12.5, color: 'var(--fg)', fontWeight: 500, fontFamily: mono ? 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' : 'inherit', wordBreak: 'break-word' }}>{value}</span>
  </div>
);

const SidebarPaiementRow = ({ label, montant, status }) => {
  const paid = status === 'paye';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <div>
        <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>{label}</div>
        <div className="tnum" style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)', marginTop: 1 }}>{montant} €</div>
      </div>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 7px', borderRadius: 999,
        background: paid ? '#dcfce7' : '#fef3c7',
        color: paid ? '#166534' : '#a16207',
        fontSize: 10.5, fontWeight: 600,
      }}>
        <span style={{ width: 5, height: 5, borderRadius: 999, background: paid ? '#16a34a' : '#f59e0b' }}/>
        {paid ? 'Payé' : 'En attente'}
      </span>
    </div>
  );
};

// ─── Tab : Demande ────────────────────────────────────────────────

const ExpoTabDemande = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
    {/* Superficie */}
    <div className="card" style={{ padding: 22 }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--fg-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Superficie souhaitée</div>
      <div className="display tnum" style={{ fontSize: 36, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>{EXPO_DETAIL.superficie} m²</div>
      <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 6 }}>
        Stand standard rangée B · tarif estimé <span className="tnum" style={{ color: 'var(--fg)', fontWeight: 500 }}>600 €</span>
      </div>
    </div>

    {/* Besoins particuliers */}
    <div className="card" style={{ padding: 22 }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--fg-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Besoins particuliers</div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--fg)' }}>{EXPO_DETAIL.besoins}</p>
    </div>

    {/* Commentaire */}
    <div className="card" style={{ padding: 22 }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--fg-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Commentaire du demandeur</div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--fg-muted)', fontStyle: 'italic' }}>« {EXPO_DETAIL.commentaire} »</p>
    </div>

    {/* Documents */}
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '16px 22px 0' }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--fg-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          Documents joints <span className="tnum" style={{ color: 'var(--fg-muted)', fontWeight: 500 }}>· {EXPO_DETAIL.docs.length}</span>
        </div>
      </div>
      <div>
        {EXPO_DETAIL.docs.map((d, i) => (
          <div key={d.name} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 22px',
            borderTop: '1px solid var(--border)',
          }}>
            <span style={{
              width: 32, height: 32, borderRadius: 7,
              background: 'var(--slate-100)', color: 'var(--slate-600)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon.FileText size={15}/>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>{d.kind}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 1, fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>
                {d.name} · {d.size}
              </div>
            </div>
            <button className="btn btn-icon btn-sm btn-ghost"><Icon.Eye size={14}/></button>
            <button className="btn btn-icon btn-sm btn-ghost"><Icon.Download size={14}/></button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Tab : Stand attribué ─────────────────────────────────────────

const ExpoTabStand = ({ stand, onAttribuer, canAttribuer }) => {
  if (!stand) {
    return (
      <div className="card" style={{ padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--slate-100)', color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <Icon.Map size={26}/>
        </div>
        <div className="display" style={{ fontSize: 20, fontWeight: 500, marginBottom: 6, letterSpacing: '-0.01em' }}>Aucun stand attribué</div>
        <div style={{ fontSize: 13.5, color: 'var(--fg-muted)', maxWidth: 380, margin: '0 auto 18px' }}>
          Valider la demande pour attribuer un stand parmi ceux disponibles dans le hall.
        </div>
        {canAttribuer && (
          <button className="btn btn-primary btn-sm" onClick={onAttribuer} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Check size={14}/> Valider + attribuer un stand
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '22px 24px', background: 'var(--burgundy-50)', borderBottom: '1px solid var(--burgundy-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--burgundy-800)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Stand attribué</div>
          <div className="display" style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--burgundy-800)' }}>{stand.id}</div>
        </div>
        <StandStatusBadge kind="reserve"/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
        {[
          { label: 'Superficie', value: `${stand.sqm} m²` },
          { label: 'Zone',       value: `Rangée ${stand.zone}` },
          { label: 'Tarif',      value: `${stand.tarif} €` },
        ].map((s, i, arr) => (
          <div key={s.label} style={{
            padding: '18px 22px',
            borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-subtle)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
            <div className="tnum display" style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.01em' }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '14px 22px', background: 'var(--slate-50)', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>
          Stand <strong className="tnum" style={{ color: 'var(--fg)', fontWeight: 500 }}>{stand.id}</strong> réservé pour cet exposant — confirmation au paiement du solde
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-outline btn-sm"><Icon.Map size={13}/> Voir sur le plan</button>
          <button className="btn btn-outline btn-sm"><Icon.Edit size={13}/> Réattribuer</button>
        </div>
      </div>
    </div>
  );
};

// ─── Tab : Paiement ───────────────────────────────────────────────

const ExpoTabPaiement = () => {
  const total = EXPO_DETAIL.acompte.montant + EXPO_DETAIL.solde.montant;
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--slate-50)' }}>
            <th style={{ textAlign: 'left', padding: '12px 22px', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Ligne</th>
            <th style={{ textAlign: 'right', padding: '12px 22px', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Montant</th>
            <th style={{ textAlign: 'left',  padding: '12px 22px', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Statut</th>
            <th style={{ textAlign: 'left',  padding: '12px 22px', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Date</th>
            <th style={{ padding: '12px 22px', borderBottom: '1px solid var(--border)' }}></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '16px 22px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>Acompte</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 2 }}>40% du total · à la confirmation</div>
            </td>
            <td className="num tnum" style={{ padding: '16px 22px', fontSize: 15, fontWeight: 600 }}>{EXPO_DETAIL.acompte.montant} €</td>
            <td style={{ padding: '16px 22px' }}><PaymentLine montant="" status={EXPO_DETAIL.acompte.status}/></td>
            <td className="tnum" style={{ padding: '16px 22px', fontSize: 12.5, color: 'var(--fg-muted)' }}>
              {EXPO_DETAIL.acompte.paidAt}
              <div style={{ fontSize: 11, marginTop: 2, color: 'var(--fg-subtle)' }}>via {EXPO_DETAIL.acompte.moyen}</div>
            </td>
            <td style={{ padding: '16px 22px', textAlign: 'right' }}>
              <button className="btn btn-outline btn-sm"><Icon.Receipt size={13}/> Reçu</button>
            </td>
          </tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}>
            <td style={{ padding: '16px 22px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>Solde</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 2 }}>60% du total · avant l'événement</div>
            </td>
            <td className="num tnum" style={{ padding: '16px 22px', fontSize: 15, fontWeight: 600 }}>{EXPO_DETAIL.solde.montant} €</td>
            <td style={{ padding: '16px 22px' }}><PaymentLine montant="" status={EXPO_DETAIL.solde.status}/></td>
            <td className="tnum" style={{ padding: '16px 22px', fontSize: 12.5, color: 'var(--fg-muted)' }}>
              <div style={{ color: 'var(--fg)' }}>Échéance : {EXPO_DETAIL.solde.dueAt}</div>
              <div style={{ fontSize: 11, marginTop: 2, color: 'var(--fg-subtle)' }}>relance auto J-15</div>
            </td>
            <td style={{ padding: '16px 22px', textAlign: 'right' }}>
              <button className="btn btn-outline btn-sm"><Icon.Send size={13}/> Relancer</button>
            </td>
          </tr>
          <tr style={{ background: 'var(--slate-50)', borderTop: '2px solid var(--border)' }}>
            <td style={{ padding: '16px 22px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>Total</div>
            </td>
            <td className="num tnum display" style={{ padding: '16px 22px', fontSize: 22, fontWeight: 500, color: 'var(--burgundy-800)', letterSpacing: '-0.01em' }}>{total} €</td>
            <td style={{ padding: '16px 22px', fontSize: 12.5, color: 'var(--fg-muted)' }}>
              {EXPO_DETAIL.acompte.status === 'paye' ? '40% encaissés' : '0% encaissé'} · TVA incluse
            </td>
            <td colSpan={2}/>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Override PaymentLine to skip amount in the table when not needed
// (we already have a montant column) — uses an empty string sentinel.
// Defined in view-admin-salons.jsx — we just rely on it accepting any value.

// ─── Tab : Historique ─────────────────────────────────────────────

const ExpoTabHistorique = ({ items }) => (
  <div className="card" style={{ padding: 22 }}>
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map((e, i) => {
        const kindMap = {
          info:    { bg: 'var(--slate-100)', fg: 'var(--slate-700)' },
          success: { bg: '#dcfce7',          fg: '#166534' },
          warn:    { bg: '#fef3c7',          fg: '#a16207' },
          danger:  { bg: '#fef2f2',          fg: '#991b1b' },
        };
        const s = kindMap[e.kind] || kindMap.info;
        const last = i === items.length - 1;
        return (
          <li key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: 14, position: 'relative' }}>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <span style={{
                width: 26, height: 26, borderRadius: 999,
                background: s.bg, color: s.fg,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, position: 'relative', zIndex: 1,
              }}>{e.icon}</span>
              {!last && <span style={{ position: 'absolute', top: 26, bottom: -16, left: '50%', marginLeft: -1, width: 2, background: 'var(--border)' }}/>}
            </div>
            <div style={{ paddingBottom: last ? 0 : 18 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>{e.label}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>
                <span className="tnum">{e.date}</span> · {e.sub}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
);

// ─── Modale : Valider + attribuer un stand ────────────────────────

const AttribuerStandModal = ({ onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const STANDS_DISPO = [
    { id: 'B03', sqm: 12, tarif: 600, zone: 'B',          recommended: true,  emplacement: 'Rangée B · angle' },
    { id: 'B06', sqm: 12, tarif: 600, zone: 'B',          recommended: false, emplacement: 'Rangée B · centre' },
    { id: 'C02', sqm: 18, tarif: 900, zone: 'C',          recommended: false, emplacement: 'Rangée C · double' },
    { id: 'A04', sqm: 9,  tarif: 450, zone: 'A',          recommended: false, emplacement: 'Rangée A · entrée' },
    { id: 'D02', sqm: 6,  tarif: 300, zone: 'D',          recommended: false, emplacement: 'Rangée D · compact' },
  ];

  const [picked, setPicked] = React.useState('B03');
  const chosen = STANDS_DISPO.find(s => s.id === picked);

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 600, padding: 0, overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '22px 26px 14px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Check size={13}/>
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Valider + attribuer</span>
            </div>
            <h2 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>Attribuer un stand à {EXPO_DETAIL.entreprise}</h2>
            <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 4, marginBottom: 0 }}>
              Superficie souhaitée <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>{EXPO_DETAIL.superficie} m²</strong> · {EXPO_DETAIL.docs.length} documents fournis
            </p>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost" aria-label="Fermer">
            <Icon.X size={14}/>
          </button>
        </div>

        <div style={{ padding: '18px 26px', overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 10 }}>
            Stands disponibles
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {STANDS_DISPO.map(s => {
              const active = picked === s.id;
              return (
                <label key={s.id} style={{
                  display: 'grid', gridTemplateColumns: 'auto 60px 1fr auto auto', gap: 14, alignItems: 'center',
                  padding: '12px 14px',
                  border: `1px solid ${active ? 'var(--burgundy-800)' : 'var(--border)'}`,
                  background: active ? 'var(--burgundy-50)' : 'var(--surface)',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}>
                  <input type="radio" name="stand" checked={active} onChange={() => setPicked(s.id)} style={{ accentColor: 'var(--burgundy-800)' }}/>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 60, padding: '4px 8px', borderRadius: 6,
                    background: active ? 'var(--burgundy-800)' : 'var(--slate-100)',
                    color: active ? '#fff' : 'var(--fg)',
                    fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
                    fontSize: 13, fontWeight: 600,
                  }}>{s.id}</span>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 500 }}>{s.emplacement}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 1 }} className="tnum">{s.sqm} m² · {s.tarif} €</div>
                  </div>
                  {s.recommended && (
                    <span style={{
                      fontSize: 10, padding: '2px 6px', borderRadius: 4,
                      background: 'var(--burgundy-800)', color: '#fff',
                      fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
                    }}>Recommandé</span>
                  )}
                  {!s.recommended && <span/>}
                  <Icon.ChevronRight size={13} style={{ color: 'var(--fg-subtle)' }}/>
                </label>
              );
            })}
          </div>

          <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--slate-50)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5, color: 'var(--fg-muted)' }}>
            <Icon.Info size={14} style={{ color: 'var(--fg-muted)', marginTop: 2, flexShrink: 0 }}/>
            <span>
              À la validation : l'inscription passe en <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Validée</strong>, le stand <strong className="tnum" style={{ color: 'var(--fg)', fontWeight: 500 }}>{chosen.id}</strong> passe en <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Réservé</strong>, et un email de confirmation est envoyé à {EXPO_DETAIL.email}.
            </span>
          </div>
        </div>

        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button className="btn btn-primary" onClick={() => onConfirm(chosen)} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Check size={13}/> Valider + attribuer le stand {chosen.id}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modale : Refuser la demande ──────────────────────────────────

const RefuserDemandeModal = ({ onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const REASONS = [
    'Salon complet sur cette catégorie',
    'Activité non éligible',
    'Documents incomplets ou non valides',
    'Refus suite à édition précédente',
    'Autre',
  ];
  const [reason, setReason] = React.useState(REASONS[0]);

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 480, padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '22px 26px 14px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: '#fef2f2', color: '#991b1b', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.X size={13}/>
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Refus de la demande</span>
            </div>
            <h2 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>Refuser cette inscription ?</h2>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost" aria-label="Fermer">
            <Icon.X size={14}/>
          </button>
        </div>

        <div style={{ padding: '18px 26px' }}>
          <label className="field" style={{ display: 'block', marginBottom: 14 }}>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Motif du refus</span>
            <select className="input" value={reason} onChange={e => setReason(e.target.value)}>
              {REASONS.map(r => <option key={r}>{r}</option>)}
            </select>
          </label>
          <label className="field" style={{ display: 'block' }}>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Message à l'exposant <span style={{ color: 'var(--fg-subtle)', fontWeight: 400 }}>(facultatif)</span></span>
            <textarea className="input textarea" rows={3} placeholder="Le message sera inclus dans l'email de notification."/>
          </label>
          <div style={{ marginTop: 14, padding: '10px 13px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: '#991b1b' }}>
            <Icon.AlertTriangle size={14} style={{ flexShrink: 0 }}/>
            <span>Cette action déclenche un email automatique. L'acompte de 240 € sera remboursé.</span>
          </div>
        </div>

        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button className="btn btn-danger" onClick={onConfirm}>
            <Icon.X size={13}/> Refuser la demande
          </button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { AdminInscriptionExposantDetail });
