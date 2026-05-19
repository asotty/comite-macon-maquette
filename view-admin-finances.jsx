// ─── Finances : Paiements / Factures / Exports ─────────────────────

// ─── Page 1 — Paiements ────────────────────────────────────────────

const AdminPaiements = () => {
  const [periode, setPeriode] = React.useState('edition');
  const [rowMenu, setRowMenu] = React.useState(null);
  const [refundRow, setRefundRow] = React.useState(null);

  const ROWS = [
    ['15/05/2026 14:32', 'Domaine de la Chevalière',  'producteur', 'concours',   'INS-2026-0184', 480,  'paye',     'CB'],
    ['15/05/2026 11:08', 'Maison Joseph Drouhin',     'producteur', 'concours',   'INS-2026-0182', 720,  'paye',     'Virement'],
    ['14/05/2026 16:42', 'Domaine Sainte-Anne',       'producteur', 'concours',   'INS-2026-0179', 480,  'attente',  '—'],
    ['14/05/2026 09:18', 'Fromagerie Lactobac',       'exposant',   'salon',      'INS-2026-0140', 180,  'paye',     'CB'],
    ['12/05/2026 17:55', 'Cellier du Roi',            'exposant',   'salon',      'INS-2026-0139', 180,  'paye',     'CB'],
    ['11/05/2026 10:24', 'Vignobles Lacroix',         'producteur', 'derogation', 'DER-2026-0028', 120,  'paye',     'CB'],
    ['10/05/2026 14:08', 'Château de Pierreclos',     'producteur', 'concours',   'INS-2026-0175', 480,  'echec',    'CB refusée'],
    ['08/05/2026 11:32', 'Domaine Tabard',            'producteur', 'concours',   'INS-2026-0168', 240,  'rembourse','Annulation'],
    ['05/05/2026 16:20', 'Vignerons de Buxy',         'producteur', 'concours',   'INS-2026-0161', 960,  'paye',     'Virement'],
    ['02/05/2026 09:45', 'Maison Joannet',            'exposant',   'salon',      'INS-2026-0138', 120,  'attente',  '—'],
  ];

  const parseDate = (s) => { const [d, t] = s.split(' '); const [dd,mm,yy] = d.split('/'); return new Date(+yy, +mm-1, +dd, ...(t||'00:00').split(':').map(Number)).getTime(); };
  const paged = useSortablePaged(ROWS, {
    defaultPageSize: 25,
    accessors: {
      date: r => parseDate(r[0]),
      who: r => r[1],
      type: r => r[3],
      ref: r => r[4],
      montant: r => r[5],
      statut: r => r[6],
    },
  });

  return (
    <div data-screen-label="admin-finances-paiements">
      <PageHeader
        breadcrumb={['Administration', 'Finances', 'Paiements']}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span>Paiements</span>
            <SalonPicker
              salons={[
                { id: 'edition', label: 'Édition 2026' },
                { id: 'mois',    label: 'Ce mois-ci' },
                { id: 'trimestre', label: 'Ce trimestre' },
                { id: '2025',   label: 'Édition 2025' },
              ]}
              value={periode}
              onChange={setPeriode}
            />
          </div>
        }
        subtitle="Encaissements Paybox & virements bancaires"
        actions={<>
          <button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Export</button>
        </>}
      />

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total encaissé', n: '184 240 €', sub: 'Édition 2026',         icon: <Icon.Euro size={16}/>,        color: 'green'    },
          { label: 'En attente',     n: '12 480 €',  sub: '38 paiements',         icon: <Icon.Clock size={16}/>,       color: 'amber'    },
          { label: 'Ce mois-ci',     n: '42 180 €',  sub: '94 transactions',      icon: <Icon.TrendUp size={16}/>,     color: 'burgundy' },
          { label: 'Remboursements', n: '2 640 €',   sub: '11 remboursements',    icon: <Icon.Refresh size={16}/>,     color: 'slate'    },
        ].map(k => {
          const palette = {
            green:    { bg: '#dcfce7',           fg: '#166534' },
            amber:    { bg: '#fef3c7',           fg: '#a16207' },
            burgundy: { bg: 'var(--burgundy-50)', fg: 'var(--burgundy-800)' },
            slate:    { bg: 'var(--slate-100)',   fg: 'var(--slate-700)' },
          }[k.color];
          return (
            <div key={k.label} className="card" style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: palette.bg, color: palette.fg,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>{k.icon}</span>
                <span style={{ fontSize: 11.5, color: 'var(--fg-muted)', fontWeight: 500 }}>{k.label}</span>
              </div>
              <div className="tnum display" style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.01em' }}>{k.n}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 4 }}>{k.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        <div className="input-with-icon" style={{ flex: 1, maxWidth: 340 }}>
          <Icon.Search size={14} className="input-icon"/>
          <input className="input" placeholder="Producteur, exposant, référence…"/>
        </div>
        <button className="btn btn-outline btn-sm"><Icon.Filter size={13}/> Type</button>
        <button className="btn btn-outline btn-sm"><Icon.Filter size={13}/> Statut</button>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <SortableTh sortKey="date"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Date</SortableTh>
              <SortableTh sortKey="who"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Producteur / Exposant</SortableTh>
              <SortableTh sortKey="type"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Type</SortableTh>
              <SortableTh sortKey="ref"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Référence</SortableTh>
              <SortableTh sortKey="montant" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Montant</SortableTh>
              <SortableTh sortKey="statut"  currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Statut</SortableTh>
              <th style={{ width: 36 }}></th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.map((r, i) => (
              <tr key={i}>
                <td className="tnum" style={{ fontSize: 12.5 }}>{r[0]}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{r[1]}</div>
                  <div className="muted" style={{ fontSize: 11.5, marginTop: 1, textTransform: 'capitalize' }}>{r[2]}</div>
                </td>
                <td><PaiementTypeBadge type={r[3]}/></td>
                <td style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', fontSize: 12.5, color: 'var(--burgundy-800)', textDecoration: 'underline', textUnderlineOffset: 2, cursor: 'pointer' }}>{r[4]}</td>
                <td className="num tnum" style={{ fontWeight: 600 }}>{r[5]} €</td>
                <td><PaiementGlobalBadge kind={r[6]} sub={r[7]}/></td>
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
                        <CmdMenuItem icon={<Icon.Receipt size={13}/>}  label="Voir la facture"     onClick={() => setRowMenu(null)}/>
                        <CmdMenuItem icon={<Icon.Eye size={13}/>}      label="Voir le dossier lié" onClick={() => setRowMenu(null)}/>
                        {r[6] === 'paye' && (
                          <>
                            <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }}/>
                            <CmdMenuItem icon={<Icon.Refresh size={13}/>} label="Rembourser" danger onClick={() => { setRowMenu(null); setRefundRow({ producteur: r[1], montant: r[5], moyen: r[7], ref: r[4] }); }}/>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination {...paged}/>

      {refundRow && <RefundConfirmModal payment={refundRow} onCancel={() => setRefundRow(null)} onConfirm={() => setRefundRow(null)}/>}
    </div>
  );
};

// ─── Modale : Confirmer un remboursement ───────────────────

const RefundConfirmModal = ({ payment, onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const moyen = payment.moyen && payment.moyen !== '—' ? payment.moyen : 'Paybox';
  const channel = moyen.toLowerCase().includes('virement') ? 'Virement bancaire' : 'Paybox';

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 480, padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '22px 26px 14px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: '#fef2f2', color: '#991b1b', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Refresh size={13}/>
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Remboursement</span>
            </div>
            <h2 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>Confirmer le remboursement ?</h2>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost" aria-label="Fermer">
            <Icon.X size={14}/>
          </button>
        </div>

        <div style={{ padding: '18px 26px' }}>
          <div style={{
            padding: '16px 18px',
            background: 'var(--slate-50)', border: '1px solid var(--border)', borderRadius: 10,
            display: 'grid', gridTemplateColumns: '1fr auto', rowGap: 10, columnGap: 16, fontSize: 13,
          }}>
            <span style={{ color: 'var(--fg-muted)' }}>Destinataire</span>
            <span style={{ color: 'var(--fg)', fontWeight: 600, textAlign: 'right' }}>{payment.producteur}</span>

            <span style={{ color: 'var(--fg-muted)' }}>Référence</span>
            <span style={{ color: 'var(--burgundy-800)', fontWeight: 500, textAlign: 'right', fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>{payment.ref}</span>

            <span style={{ color: 'var(--fg-muted)' }}>Canal</span>
            <span style={{ color: 'var(--fg)', fontWeight: 500, textAlign: 'right' }}>{channel}</span>

            <span style={{ color: 'var(--fg-muted)', borderTop: '1px dashed var(--border)', paddingTop: 10 }}>Montant remboursé</span>
            <span className="tnum display" style={{
              color: 'var(--burgundy-800)', fontWeight: 500, textAlign: 'right',
              fontSize: 22, letterSpacing: '-0.01em',
              borderTop: '1px dashed var(--border)', paddingTop: 10,
            }}>{payment.montant} €</span>
          </div>

          <div style={{ marginTop: 14, padding: '12px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <Icon.AlertTriangle size={14} style={{ color: '#991b1b', marginTop: 2, flexShrink: 0 }}/>
            <div style={{ fontSize: 12.5, color: '#991b1b' }}>
              <strong style={{ fontWeight: 600 }}>Cette action est irréversible.</strong> Le remboursement sera exécuté immédiatement via <strong style={{ fontWeight: 600 }}>{channel}</strong>, une facture d'avoir sera générée et le dossier lié sera mis à jour.
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button className="btn btn-danger" onClick={onConfirm}>
            <Icon.Refresh size={13}/> Confirmer le remboursement
          </button>
        </div>
      </div>
    </div>
  );
};

const PaiementTypeBadge = ({ type }) => {
  const map = {
    concours:   { icon: <Icon.Trophy size={11}/>,      fg: 'var(--burgundy-800)', bg: 'var(--burgundy-50)', label: 'Inscription concours' },
    salon:      { icon: <Icon.Building size={11}/>,    fg: '#a16207',             bg: '#fef3c7',            label: 'Inscription salon' },
    derogation: { icon: <Icon.ShieldCheck size={11}/>, fg: '#1e40af',             bg: '#eff6ff',            label: 'Dérogation' },
  };
  const s = map[type] || map.concours;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px 3px 7px', borderRadius: 999,
      background: s.bg, color: s.fg,
      fontSize: 11.5, fontWeight: 500,
    }}>{s.icon}{s.label}</span>
  );
};

const PaiementGlobalBadge = ({ kind, sub }) => {
  const map = {
    paye:      { bg: '#dcfce7',          fg: '#166534', dot: '#16a34a', label: 'Payé' },
    attente:   { bg: '#fef3c7',          fg: '#a16207', dot: '#f59e0b', label: 'En attente' },
    echec:     { bg: '#fef2f2',          fg: '#991b1b', dot: '#dc2626', label: 'Échoué' },
    rembourse: { bg: 'var(--slate-100)', fg: 'var(--slate-700)', dot: 'var(--slate-400)', label: 'Remboursé' },
  };
  const s = map[kind] || map.attente;
  return (
    <div>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '3px 9px 3px 7px', borderRadius: 999,
        background: s.bg, color: s.fg,
        fontSize: 11.5, fontWeight: 600,
      }}>
        <span style={{ width: 7, height: 7, borderRadius: 999, background: s.dot }}/>
        {s.label}
      </span>
      {sub && sub !== '—' && (
        <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 3 }}>{sub}</div>
      )}
    </div>
  );
};

// ─── Page 2 — Factures ─────────────────────────────────────────────

const AdminFactures = () => {
  const [relances, setRelances] = React.useState(true);
  const [rowMenu,  setRowMenu]  = React.useState(null);
  const [createModal, setCreateModal] = React.useState(false);

  const ROWS = [
    ['FAC-2026-0312', '15/05/2026', 'Domaine de la Chevalière',  'concours',   480,  'payee'],
    ['FAC-2026-0311', '15/05/2026', 'Maison Joseph Drouhin',     'concours',   720,  'payee'],
    ['FAC-2026-0310', '14/05/2026', 'Domaine Sainte-Anne',       'concours',   480,  'attente'],
    ['FAC-2026-0309', '14/05/2026', 'Fromagerie Lactobac',       'salon',      180,  'payee'],
    ['FAC-2026-0308', '02/05/2026', 'Maison Joannet',            'salon',      120,  'retard'],
    ['FAC-2026-0307', '28/04/2026', 'Cave de Mâcon-Vinzelles',   'concours',   360,  'retard'],
    ['FAC-2026-0306', '24/04/2026', 'Brasserie de Saône',        'salon',      180,  'annulee'],
    ['FAC-2026-0305', '21/04/2026', 'Vignerons de Buxy',         'concours',   960,  'payee'],
  ];

  const parseDate2 = (s) => { const [d,m,y] = s.split('/'); return new Date(+y, +m-1, +d).getTime(); };
  const paged = useSortablePaged(ROWS, {
    defaultPageSize: 25,
    accessors: {
      ref: r => r[0], date: r => parseDate2(r[1]), dest: r => r[2],
      type: r => r[3], montant: r => r[4], statut: r => r[5],
    },
  });

  return (
    <div data-screen-label="admin-finances-factures">
      <PageHeader
        breadcrumb={['Administration', 'Finances', 'Factures']}
        title="Factures"
        subtitle="Émission & relances automatiques"
        actions={<>
          <label style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 8,
            border: '1px solid var(--border)', background: 'var(--surface)',
            fontSize: 12.5, cursor: 'pointer',
          }}>
            <input type="checkbox" checked={relances} onChange={e => setRelances(e.target.checked)} style={{ accentColor: 'var(--burgundy-800)' }}/>
            <span style={{ color: 'var(--fg)', fontWeight: 500 }}>Relances automatiques</span>
            <span style={{
              fontSize: 10.5, padding: '1px 7px', borderRadius: 4,
              background: relances ? '#dcfce7' : 'var(--slate-100)',
              color: relances ? '#166534' : 'var(--fg-muted)',
              fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>{relances ? 'Activé' : 'Désactivé'}</span>
          </label>
          <button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => setCreateModal(true)} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Plus size={14}/> Créer une facture
          </button>
        </>}
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        <div className="input-with-icon" style={{ flex: 1, maxWidth: 340 }}>
          <Icon.Search size={14} className="input-icon"/>
          <input className="input" placeholder="N° facture, destinataire…"/>
        </div>
        <button className="btn btn-outline btn-sm"><Icon.Filter size={13}/> Statut</button>
        <button className="btn btn-outline btn-sm"><Icon.Calendar size={13}/> Période</button>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <SortableTh sortKey="ref"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>N° Facture</SortableTh>
              <SortableTh sortKey="date"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Date</SortableTh>
              <SortableTh sortKey="dest"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Destinataire</SortableTh>
              <SortableTh sortKey="type"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Type</SortableTh>
              <SortableTh sortKey="montant" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Montant</SortableTh>
              <SortableTh sortKey="statut"  currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Statut</SortableTh>
              <th style={{ width: 36 }}></th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.map((r, i) => (
              <tr key={i}>
                <td style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', fontSize: 12.5, fontWeight: 600, color: 'var(--burgundy-800)' }}>{r[0]}</td>
                <td className="tnum">{r[1]}</td>
                <td style={{ fontWeight: 500 }}>{r[2]}</td>
                <td><PaiementTypeBadge type={r[3]}/></td>
                <td className="num tnum" style={{ fontWeight: 600 }}>{r[4]} €</td>
                <td><FactureStatusBadge kind={r[5]}/></td>
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
                        <CmdMenuItem icon={<Icon.Download size={13}/>} label="Télécharger PDF"    primary onClick={() => setRowMenu(null)}/>
                        <CmdMenuItem icon={<Icon.Mail size={13}/>}     label="Envoyer par email"          onClick={() => setRowMenu(null)}/>
                        {r[5] !== 'annulee' && (
                          <>
                            <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }}/>
                            <CmdMenuItem icon={<Icon.X size={13}/>} label="Annuler la facture" danger onClick={() => setRowMenu(null)}/>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination {...paged}/>
      {createModal && <CreerFactureModal onCancel={() => setCreateModal(false)} onConfirm={() => setCreateModal(false)}/>}
    </div>
  );
};

// ─── Modale : Créer une facture (manuelle — dérogations) ──────────

const CreerFactureModal = ({ onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const [type, setType] = React.useState('derogation');
  const [montant, setMontant] = React.useState('120');
  const [destinataire, setDestinataire] = React.useState('');
  const [reference, setReference] = React.useState('');
  const [libelle, setLibelle] = React.useState("Dérogation pour dépôt hors délai");

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 560, padding: 0, overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '22px 26px 14px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Plus size={13}/>
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Facture manuelle</span>
            </div>
            <h2 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>Créer une facture</h2>
            <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 4, marginBottom: 0 }}>Pour les cas hors paiement automatique (dérogations, frais spécifiques…)</p>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost" aria-label="Fermer">
            <Icon.X size={14}/>
          </button>
        </div>

        <div style={{ padding: '18px 26px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Type</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { id: 'derogation', label: 'Dérogation',  icon: <Icon.ShieldCheck size={14}/> },
                { id: 'concours',   label: 'Concours',    icon: <Icon.Trophy size={14}/> },
                { id: 'autre',      label: 'Autre',       icon: <Icon.Sparkles size={14}/> },
              ].map(t => (
                <label key={t.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '10px 12px',
                  border: `1px solid ${type === t.id ? 'var(--burgundy-800)' : 'var(--border)'}`,
                  background: type === t.id ? 'var(--burgundy-50)' : 'var(--surface)',
                  color: type === t.id ? 'var(--burgundy-800)' : 'var(--fg)',
                  borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                }}>
                  <input type="radio" name="fact-type" checked={type === t.id} onChange={() => setType(t.id)} style={{ display: 'none' }}/>
                  {t.icon}{t.label}
                </label>
              ))}
            </div>
          </div>

          <label className="field">
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>
              Destinataire <span style={{ color: '#dc2626' }}>*</span>
            </span>
            <input className="input" placeholder="Domaine, producteur ou exposant…" value={destinataire} onChange={e => setDestinataire(e.target.value)}/>
            <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon.Info size={11}/> Les coordonnées de facturation seront récupérées depuis la fiche.
            </div>
          </label>

          <label className="field">
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>
              Référence liée <span style={{ color: 'var(--fg-subtle)', fontWeight: 400 }}>(optionnel)</span>
            </span>
            <input className="input" placeholder="Ex. DER-2026-0032" value={reference} onChange={e => setReference(e.target.value)} style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}/>
          </label>

          <label className="field">
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>
              Libellé <span style={{ color: '#dc2626' }}>*</span>
            </span>
            <input className="input" placeholder="Description apparaîtra sur la facture" value={libelle} onChange={e => setLibelle(e.target.value)}/>
          </label>

          <label className="field">
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>
              Montant HT <span style={{ color: '#dc2626' }}>*</span>
            </span>
            <div style={{ position: 'relative' }}>
              <input type="number" className="input tnum" value={montant} onChange={e => setMontant(e.target.value)} style={{ paddingRight: 32 }}/>
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13, pointerEvents: 'none' }}>€</span>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 6 }}>
              TVA 20% : <span className="tnum" style={{ color: 'var(--fg)', fontWeight: 500 }}>{(Number(montant) * 0.2).toFixed(2)} €</span> ·
              TTC : <span className="tnum" style={{ color: 'var(--burgundy-800)', fontWeight: 600 }}>{(Number(montant) * 1.2).toFixed(2)} €</span>
            </div>
          </label>

          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '12px 14px',
            border: '1px solid var(--burgundy-200)',
            background: 'var(--burgundy-50)',
            borderRadius: 8, cursor: 'pointer',
          }}>
            <input type="checkbox" defaultChecked style={{ marginTop: 2, accentColor: 'var(--burgundy-800)' }}/>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>Envoyer la facture par email</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 2 }}>
                Email envoyé immédiatement avec le PDF en pièce jointe.
              </div>
            </div>
          </label>
        </div>

        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={!destinataire || !libelle || !montant}
            style={{
              background: 'var(--burgundy-800)',
              opacity: (!destinataire || !libelle || !montant) ? 0.45 : 1,
            }}
          >
            <Icon.Check size={13}/> Créer la facture
          </button>
        </div>
      </div>
    </div>
  );
};

const FactureStatusBadge = ({ kind }) => {
  const map = {
    payee:   { bg: '#dcfce7',          fg: '#166534', dot: '#16a34a', label: 'Payée' },
    attente: { bg: '#fef3c7',          fg: '#a16207', dot: '#f59e0b', label: 'En attente' },
    retard:  { bg: '#fef2f2',          fg: '#991b1b', dot: '#dc2626', label: 'En retard' },
    annulee: { bg: 'var(--slate-100)', fg: 'var(--slate-700)', dot: 'var(--slate-400)', label: 'Annulée' },
  };
  const s = map[kind] || map.attente;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px 3px 7px', borderRadius: 999,
      background: s.bg, color: s.fg,
      fontSize: 11.5, fontWeight: 600,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 999, background: s.dot }}/>
      {s.label}
    </span>
  );
};

// ─── Page 3 — Exports comptables ───────────────────────────────────

const AdminExportsComptables = () => {
  const [exportModal, setExportModal] = React.useState(false);

  const HISTORY = [
    ['15/05/2026 14:42', 'Sophie L.', '01/05/2026 → 15/05/2026', 'Tout',          'Sage',    'export-sage-2026-05.csv',     '184 lignes'],
    ['01/05/2026 09:15', 'Sophie L.', '01/04/2026 → 30/04/2026', 'Inscriptions',  'Sage',    'export-sage-2026-04.csv',     '312 lignes'],
    ['01/05/2026 09:18', 'Sophie L.', '01/04/2026 → 30/04/2026', 'Salons',        'CSV',     'export-salons-2026-04.csv',   '48 lignes'],
    ['01/04/2026 10:02', 'Marc D.',   '01/03/2026 → 31/03/2026', 'Tout',          'Sage',    'export-sage-2026-03.csv',     '240 lignes'],
    ['01/03/2026 11:24', 'Sophie L.', '01/02/2026 → 28/02/2026', 'Inscriptions',  'Sage',    'export-sage-2026-02.csv',     '186 lignes'],
  ];
  const parseDate3 = (s) => { const [d,t] = s.split(' '); const [dd,mm,yy] = d.split('/'); return new Date(+yy, +mm-1, +dd, ...(t||'00:00').split(':').map(Number)).getTime(); };
  const paged = useSortablePaged(HISTORY, {
    defaultPageSize: 25,
    accessors: { date: r => parseDate3(r[0]), admin: r => r[1], periode: r => r[2], type: r => r[3], format: r => r[4], fichier: r => r[5] },
  });

  return (
    <div data-screen-label="admin-finances-exports">
      <PageHeader
        breadcrumb={['Administration', 'Finances', 'Exports comptables']}
        title="Exports comptables (Sage)"
        subtitle="Génération mensuelle ou ponctuelle des écritures comptables"
        actions={<>
          <button className="btn btn-primary btn-sm" onClick={() => setExportModal(true)} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Download size={14}/> Générer un export
          </button>
        </>}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 className="display" style={{ fontSize: 17, fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>Historique des exports</h3>
        <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }} className="tnum">{HISTORY.length} exports</span>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <SortableTh sortKey="date"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Date</SortableTh>
              <SortableTh sortKey="admin"   currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Admin</SortableTh>
              <SortableTh sortKey="periode" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Période</SortableTh>
              <SortableTh sortKey="type"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Type</SortableTh>
              <SortableTh sortKey="format"  currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Format</SortableTh>
              <SortableTh sortKey="fichier" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Fichier</SortableTh>
              <th style={{ width: 36 }}></th>
            </tr>
          </thead>
          <tbody>
            {paged.rows.map((r, i) => (
              <tr key={i}>
                <td className="tnum" style={{ fontSize: 12.5 }}>{r[0]}</td>
                <td>{r[1]}</td>
                <td className="tnum muted" style={{ fontSize: 12.5 }}>{r[2]}</td>
                <td>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '2px 8px', borderRadius: 999,
                    background: 'var(--slate-100)', color: 'var(--slate-700)',
                    fontSize: 11.5, fontWeight: 600,
                  }}>{r[3]}</span>
                </td>
                <td>
                  <span style={{
                    fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
                    fontSize: 11.5, padding: '2px 7px', borderRadius: 4,
                    background: r[4] === 'Sage' ? 'var(--burgundy-50)' : 'var(--slate-50)',
                    color:      r[4] === 'Sage' ? 'var(--burgundy-800)' : 'var(--fg-muted)',
                    fontWeight: 600,
                    border: '1px solid var(--border)',
                  }}>{r[4]}</span>
                </td>
                <td>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
                    fontSize: 12, color: 'var(--burgundy-800)',
                    textDecoration: 'underline', textUnderlineOffset: 2, cursor: 'pointer',
                  }}>
                    <Icon.FileText size={12}/>{r[5]}
                  </span>
                  <div className="muted" style={{ fontSize: 11, marginTop: 2, fontFamily: 'inherit' }}>{r[6]}</div>
                </td>
                <td>
                  <button className="btn btn-icon btn-sm btn-ghost" title="Télécharger"><Icon.Download size={13}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination {...paged}/>

      {exportModal && <GenerateExportModal onCancel={() => setExportModal(false)} onConfirm={() => setExportModal(false)}/>}
    </div>
  );
};

const GenerateExportModal = ({ onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const [format, setFormat] = React.useState('sage');
  const [type, setType]     = React.useState('tout');

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 520, padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '22px 26px 14px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Download size={13}/>
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Nouvel export</span>
            </div>
            <h2 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>Générer un export comptable</h2>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
        </div>

        <div style={{ padding: '18px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Période</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label className="field"><span style={{ fontSize: 11, color: 'var(--fg-muted)', display: 'block', marginBottom: 4 }}>Du</span>
                <input type="date" className="input tnum" defaultValue="2026-05-01"/></label>
              <label className="field"><span style={{ fontSize: 11, color: 'var(--fg-muted)', display: 'block', marginBottom: 4 }}>Au</span>
                <input type="date" className="input tnum" defaultValue="2026-05-15"/></label>
            </div>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Format</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { id: 'sage', label: 'Sage',           sub: 'Format imposé Sage', recommended: true },
                { id: 'csv',  label: 'CSV générique',  sub: 'Pour autre logiciel' },
              ].map(f => (
                <label key={f.id} style={{
                  display: 'flex', flexDirection: 'column', gap: 4,
                  padding: '12px 14px',
                  border: `1px solid ${format === f.id ? 'var(--burgundy-800)' : 'var(--border)'}`,
                  background: format === f.id ? 'var(--burgundy-50)' : 'var(--surface)',
                  borderRadius: 8, cursor: 'pointer',
                }}>
                  <input type="radio" name="fmt" checked={format === f.id} onChange={() => setFormat(f.id)} style={{ display: 'none' }}/>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: format === f.id ? 'var(--burgundy-800)' : 'var(--fg)' }}>{f.label}</span>
                    {f.recommended && <span style={{
                      fontSize: 10, padding: '1px 6px', borderRadius: 4,
                      background: 'var(--burgundy-800)', color: '#fff',
                      fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
                    }}>Recommandé</span>}
                  </div>
                  <span style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>{f.sub}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--slate-700)', marginBottom: 6 }}>Type d'écritures</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { id: 'inscriptions', label: 'Inscriptions', icon: <Icon.Trophy size={14}/> },
                { id: 'salons',       label: 'Salons',       icon: <Icon.Building size={14}/> },
                { id: 'tout',         label: 'Tout',         icon: <Icon.Layers size={14}/> },
              ].map(t => (
                <label key={t.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '10px 12px',
                  border: `1px solid ${type === t.id ? 'var(--burgundy-800)' : 'var(--border)'}`,
                  background: type === t.id ? 'var(--burgundy-50)' : 'var(--surface)',
                  color: type === t.id ? 'var(--burgundy-800)' : 'var(--fg)',
                  borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                }}>
                  <input type="radio" name="type" checked={type === t.id} onChange={() => setType(t.id)} style={{ display: 'none' }}/>
                  {t.icon}{t.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button className="btn btn-primary" onClick={onConfirm} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Download size={13}/> Générer et télécharger
          </button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, {
  AdminPaiements,
  AdminFactures,
  AdminExportsComptables,
});
