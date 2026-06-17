// Admin views — dashboard + key list pages

// Menu déroulant Actions rapides — header du dashboard admin
const ActionsRapidesMenu = () => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  const items = [
    { label: 'Créer une inscription',      icon: <Icon.Plus size={14}/> },
    { label: 'Ajouter un producteur',      icon: <Icon.User size={14}/> },
    { label: 'Saisir des résultats',       icon: <Icon.Award size={14}/> },
    { label: 'Envoyer un email groupé',    icon: <Icon.Mail size={14}/> },
  ];

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        className="btn btn-primary btn-sm"
        style={{ paddingRight: 10 }}
      >
        <Icon.Plus size={14}/> Actions rapides <Icon.ChevronDown size={12} style={{ transition: 'transform .15s', transform: open ? 'rotate(180deg)' : 'none' }}/>
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          right: 0, top: 36, zIndex: 30,
          minWidth: 240,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          boxShadow: 'var(--shadow-md)',
          padding: 6,
          animation: 'slideDown .15s ease-out',
        }}>
          {items.map((it, i) => (
            <button key={i} onClick={() => setOpen(false)} style={{
              width: '100%',
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13,
              color: 'var(--fg)', borderRadius: 6, textAlign: 'left',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--burgundy-50)'; e.currentTarget.style.color = 'var(--burgundy-800)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg)'; }}
            >
              <span style={{ color: 'var(--burgundy-800)', display: 'inline-flex' }}>{it.icon}</span>
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = ({ kpiVariant, showKpiIcons }) => {
  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de l'édition 2026 · mise à jour il y a 4 minutes"
        breadcrumb={['Administration', 'Tableau de bord']}
        actions={<>
          <button className="btn btn-outline btn-sm"><Icon.Refresh size={14}/> Actualiser</button>
          <button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Export</button>
          <ActionsRapidesMenu/>
        </>}
      />

      {/* Ligne 1 — Concours France + Concours Monde, 4 stats inline chacun */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <ConcoursStatsCard label="Concours France" delta="+12 %" stats={[
          { value: '847',  label: 'Inscrits' },
          { value: '241',  label: 'Validés' },
          { value: '198',  label: 'Payés' },
          { value: '2 148', label: 'Échantillons' },
        ]}/>
        <ConcoursStatsCard label="Concours Monde" delta="+48 %" stats={[
          { value: '97',  label: 'Inscrits' },
          { value: '80',  label: 'Validés' },
          { value: '65',  label: 'Payés' },
          { value: '312', label: 'Échantillons' },
        ]}/>
      </div>

      {/* Ligne 2 — Dossiers à traiter (2/3) + Prochaines échéances (1/3) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16, alignItems: 'flex-start' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg)' }}>Dossiers à traiter</div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>12 inscriptions en attente de validation</div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ height: 28, padding: '0 8px', fontSize: 12.5 }}>
              Voir tout <Icon.ArrowRight size={12}/>
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Producteur</th>
                <th>Concours</th>
                <th className="num">Échant.</th>
                <th>Statut</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Domaine de la Chevalière', 'Mâconnais',       'France', 8,  'a-verifier'],
                ['Château Pied-de-Rieux',   'Beaujolais',       'France', 4,  'soumis'],
                ['Cantina Verdicchio',      'Italie',           'Monde',  12, 'a-verifier'],
                ['Maison Joseph Drouhin',   'Côte de Beaune',   'France', 22, 'soumis'],
                ['Bodegas Ribera Sur',      'Espagne',          'Monde',  6,  'a-verifier'],
                ['Domaine des 3 Pierres',   'Mâconnais',        'France', 9,  'soumis'],
              ].map(([nom, region, concours, ech, status], i) => (
                <tr key={i} style={{ cursor: 'pointer' }}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--fg)' }}>{nom}</div>
                      <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{region}</div>
                    </div>
                  </td>
                  <td><ConcoursPill kind={concours}/></td>
                  <td className="num tnum">{ech}</td>
                  <td><StatusBadge status={status}/></td>
                  <td>
                    <button className="btn btn-icon btn-sm btn-ghost"><Icon.MoreH size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '18px 22px 10px', fontSize: 16, fontWeight: 700 }}>Prochaines échéances</div>
          <div style={{ padding: '0 22px 18px' }}>
            {[
              { mois: 'mai',  jour: '12', t: 'Clôture inscriptions France', sub: 'dans 7 jours' },
              { mois: 'mai',  jour: '24', t: 'Dégustation Concours France', sub: 'dans 19 jours' },
              { mois: 'juin', jour: '02', t: 'Publication palmarès',         sub: 'dans 28 jours' },
              { mois: 'juin', jour: '14', t: 'Clôture inscriptions Monde',   sub: 'dans 40 jours' },
            ].map((e, i, arr) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 0',
                borderTop: i > 0 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 44, textAlign: 'center', flexShrink: 0,
                  padding: '4px 0',
                }}>
                  <div className="display" style={{ fontSize: 11, fontWeight: 600, color: 'var(--burgundy-800)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{e.mois}</div>
                  <div className="display" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1, color: 'var(--fg)', marginTop: 2 }}>{e.jour}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg)' }}>{e.t}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>{e.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ligne 3 — Activité récente + Action requise */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '18px 22px 8px', fontSize: 16, fontWeight: 700 }}>Activité récente</div>
          <div style={{ padding: '0 22px 18px' }}>
            {[
              { who: 'Dom. Chevalière',  what: 'a soumis 8 échantillons',  when: 'il y a 12 min', icon: <Icon.Wine size={13}/>, color: 'var(--burgundy-800)', bg: 'var(--burgundy-50)' },
              { who: 'Sophie L.',         what: 'a validé Pied-de-Rieux',   when: 'il y a 28 min', icon: <Icon.Check size={13}/>, color: '#166534',           bg: 'var(--success-bg)' },
              { who: 'Cantina Verdicchio',what: 'a payé 480 €',             when: 'il y a 1 h',    icon: <Icon.Euro size={13}/>,  color: 'var(--gold-700)',   bg: 'var(--gold-100)' },
              { who: 'Système',           what: 'a contrôlé 14 dossiers',   when: 'il y a 2 h',    icon: <Icon.ShieldCheck size={13}/>, color: '#1e40af',     bg: '#eef4ff' },
            ].map((a, i, arr) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 0',
                borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                fontSize: 13,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: a.bg, color: a.color,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>{a.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: 600 }}>{a.who}</span>
                  <span style={{ color: 'var(--fg-muted)' }}> {a.what}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-subtle)', whiteSpace: 'nowrap' }}>{a.when}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action requise — fond bordeaux profond */}
        <div style={{
          background: 'var(--burgundy-900)',
          borderRadius: 12,
          padding: 24,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <svg style={{ position: 'absolute', right: -28, bottom: -28, opacity: 0.07 }} width="180" height="180" viewBox="0 0 24 24" fill="#fff">
            <circle cx="12" cy="9" r="6"/>
          </svg>
          <div style={{
            fontSize: 14, fontWeight: 700,
            color: 'var(--gold-300)',
            marginBottom: 16,
            position: 'relative',
          }}>Action requise</div>
          <div className="display" style={{
            fontSize: 22, fontWeight: 600,
            lineHeight: 1.3,
            color: '#f7f7f7',
            position: 'relative',
            letterSpacing: '-0.01em',
          }}>
            Lancer le contrôle automatique des 244 dossiers restants
          </div>
          <div style={{ fontSize: 13, opacity: 0.78, marginTop: 10, position: 'relative' }}>
            Extraction OCR + croisement DREV/analyses ~ 18 min
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 20, position: 'relative' }}>
            <button className="btn btn-sm" style={{
              background: '#f5f5f3', color: 'var(--burgundy-900)',
              fontWeight: 600, border: 'none',
            }}>
              <Icon.Sparkles size={13}/> Lancer le contrôle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Carte stats consolidée Concours France/Monde — 4 chiffres en ligne + delta vert
const ConcoursStatsCard = ({ label, delta, stats }) => (
  <div className="card" style={{ padding: '20px 24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-muted)' }}>{label}</div>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '4px 10px', borderRadius: 999,
        background: 'rgba(25,145,69,0.08)',
        color: '#116530',
        fontSize: 12, fontWeight: 600,
      }}>
        <Icon.ArrowRight size={11} style={{ transform: 'rotate(-45deg)' }}/>
        {delta}
      </span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {stats.map((s, i) => (
        <div key={i} style={{ borderLeft: i > 0 ? '1px solid var(--border)' : 'none', paddingLeft: i > 0 ? 16 : 0 }}>
          <div className="display tnum" style={{ fontSize: 30, fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 8, fontWeight: 500 }}>{s.label}</div>
        </div>
      ))}
    </div>
  </div>
);

// Pill concours — pastille France ou Monde
const ConcoursPill = ({ kind }) => {
  const m = kind === 'France'
    ? { bg: 'var(--burgundy-50)', fg: 'var(--burgundy-800)' }
    : { bg: '#eef4ff', fg: '#1e40af' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 999,
      background: m.bg, color: m.fg,
      fontSize: 12, fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', opacity: 0.6 }}/>
      {kind}
    </span>
  );
};

// Menu déroulant Export CSV — header inscriptions
const ExportCSVMenu = ({ totalCount }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  const items = [
    { label: 'Export CSV — vue actuelle',  sub: 'Lignes filtrées affichées' },
    { label: `Export CSV — Tous (${totalCount})`, sub: 'Toutes les inscriptions du concours' },
  ];

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        className="btn btn-outline btn-sm"
        style={{ paddingRight: 10 }}
      >
        <Icon.Download size={14}/> Export CSV <Icon.ChevronDown size={12} style={{ transition: 'transform .15s', transform: open ? 'rotate(180deg)' : 'none' }}/>
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          right: 0, top: 36, zIndex: 30,
          minWidth: 260,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          boxShadow: 'var(--shadow-md)',
          padding: 6,
          animation: 'slideDown .15s ease-out',
        }}>
          {items.map((it, i) => (
            <button key={i} onClick={() => setOpen(false)} style={{
              width: '100%',
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '9px 12px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13,
              color: 'var(--fg)', borderRadius: 6, textAlign: 'left',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--burgundy-50)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon.Download size={14} style={{ color: 'var(--burgundy-800)', marginTop: 1, flexShrink: 0 }}/>
              <div>
                <div style={{ fontWeight: 500 }}>{it.label}</div>
                <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 1 }}>{it.sub}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminInscriptions = ({ concours = 'France', onOpenDossier }) => {
  const [filter, setFilter] = React.useState('Tous');
  const [ctrlState, setCtrlState] = React.useState('idle'); // idle | confirm | running | done
  const [ctrlProgress, setCtrlProgress] = React.useState(0);
  const [emailState, setEmailState] = React.useState('idle'); // idle | compose | preview | confirm
  const [selectedRows, setSelectedRows] = React.useState([0]); // pre-checked row indices
  const TOTAL = 142;

  React.useEffect(() => {
    if (ctrlState !== 'running') return;
    setCtrlProgress(0);
    const t = setInterval(() => {
      setCtrlProgress(p => {
        const next = p + Math.max(1, Math.round((TOTAL - p) * 0.08));
        if (next >= TOTAL) { clearInterval(t); setCtrlState('done'); return TOTAL; }
        return next;
      });
    }, 180);
    return () => clearInterval(t);
  }, [ctrlState]);
  // R20 — statuts réduits à 4 : en-attente-paiement, paye, a-verifier, valide
  const ALL_ROWS = [
    ['INS-2026-0184', 'Domaine de la Chevalière', 'Mâconnais',       8,  'a-verifier',          480,  '12/04/26'],
    ['INS-2026-0183', 'Château Pied-de-Rieux',    'Beaujolais',      4,  'en-attente-paiement', 240,  '11/04/26'],
    ['INS-2026-0182', 'Maison Joseph Drouhin',    'Côte de Beaune',  22, 'en-attente-paiement', 1320, '11/04/26'],
    ['INS-2026-0181', 'Domaine des 3 Pierres',    'Mâconnais',       9,  'paye',                540,  '10/04/26'],
    ['INS-2026-0180', 'Cellier de Solutré',       'Mâconnais',       6,  'valide',              360,  '10/04/26'],
    ['INS-2026-0179', 'Domaine Tabard',           'Beaujolais',      3,  'paye',                180,  '09/04/26'],
    ['INS-2026-0178', 'Vignobles Lacroix',        'Côte Chalonnaise',12, 'a-verifier',          720,  '09/04/26'],
    ['INS-2026-0177', 'Domaine Sainte-Anne',      'Mâconnais',       5,  'paye',                300,  '08/04/26'],
    ['INS-2026-0176', 'Château de Pierreclos',    'Mâconnais',       14, 'valide',              840,  '08/04/26'],
    ['INS-2026-0175', 'Domaine Bouchard Père',    'Côte de Beaune',  18, 'paye',                1080, '07/04/26'],
    ['INS-2026-0174', 'Château Dubreuil',         'Côte de Beaune',  11, 'en-attente-paiement', 660,  '07/04/26'],
    ['INS-2026-0173', 'Domaine Servan',           'Beaujolais',      7,  'a-verifier',          420,  '06/04/26'],
    ['INS-2026-0172', 'Cave de Lugny',            'Mâconnais',       16, 'valide',              960,  '06/04/26'],
    ['INS-2026-0171', 'Domaine Bouland',          'Beaujolais',      9,  'paye',                540,  '05/04/26'],
    ['INS-2026-0170', 'Château Saint-Pierre',     'Côte Chalonnaise',5,  'en-attente-paiement', 300,  '05/04/26'],
  ];
  const fmt = (n) => n.toLocaleString('fr-FR') + ' €';
  const parseDate = (s) => { const [d, m, y] = s.split('/'); return new Date(2000 + (+y), +m - 1, +d).getTime(); };
  const paged = useSortablePaged(ALL_ROWS, {
    defaultPageSize: 10,
    accessors: {
      ref:        r => r[0],
      producteur: r => r[1],
      region:     r => r[2],
      ech:        r => r[3],
      status:     r => r[4],
      montant:    r => r[5],
      date:       r => parseDate(r[6]),
    },
  });
  const rows = paged.rows;
  return (
    <div>
      <PageHeader
        title={`Inscriptions Concours ${concours} 2026`}
        subtitle={`${concours === 'France' ? '847' : '312'} inscriptions · ${concours === 'France' ? '1 840' : '344'} échantillons`}
        breadcrumb={['Administration', `Concours ${concours}`, 'Inscriptions']}
        actions={<>
          <button className="btn btn-outline btn-sm" onClick={() => setCtrlState('confirm')} disabled={ctrlState === 'running'}><Icon.Sparkles size={14}/> Contrôle auto</button>
          <ExportCSVMenu totalCount={concours === 'France' ? 847 : 312}/>
          <button className="btn btn-primary btn-sm" onClick={() => setEmailState('compose')}><Icon.Send size={14}/> Email groupé</button>
        </>}
      />

      {/* Modal email groupé */}
      {emailState !== 'idle' && (
        <EmailGroupModal
          state={emailState}
          setState={setEmailState}
          selectionCount={selectedRows.length}
          currentFilter={filter}
          rows={rows}
          onClose={() => setEmailState('idle')}
        />
      )}

      {/* Banner contrôle auto */}
      {(ctrlState === 'running' || ctrlState === 'done') && (
        <ControlBanner
          state={ctrlState}
          progress={ctrlProgress}
          total={TOTAL}
          onSeeDetail={() => {}}
          onSeeAControler={() => { setFilter('À vérifier'); setCtrlState('idle'); }}
          onClose={() => setCtrlState('idle')}
        />
      )}

      {/* Modal confirmation */}
      {ctrlState === 'confirm' && (
        <ControlConfirmModal
          total={TOTAL}
          onCancel={() => setCtrlState('idle')}
          onConfirm={() => setCtrlState('running')}
        />
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
        {/* R20 — 4 statuts + Tous : en-attente-paiement, paye, a-verifier, valide */}
        {['Tous', 'En att. paiement', 'À vérifier', 'Validés', 'Payés'].map(t => {
          const active = filter === t;
          const counts = { 'Tous': 847, 'En att. paiement': 167, 'À vérifier': 47, 'Validés': 386, 'Payés': 240 };
          return (
            <button key={t} onClick={() => setFilter(t)} style={{
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
              {t}
              <span style={{
                fontSize: 11, padding: '0 6px', borderRadius: 999,
                background: active ? 'var(--burgundy-50)' : 'var(--slate-100)',
                color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)',
                fontWeight: 500,
              }}>{counts[t]}</span>
            </button>
          );
        })}
      </div>

      {/* Filters bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <div className="input-with-icon" style={{ flex: 1, maxWidth: 320 }}>
          <Icon.Search size={14} className="input-icon"/>
          <input className="input" placeholder="Rechercher producteur, n° inscription…"/>
        </div>
        <button className="btn btn-outline btn-sm"><Icon.Filter size={13}/> Région</button>
        <button className="btn btn-outline btn-sm"><Icon.Calendar size={13}/> Période</button>
        <button className="btn btn-outline btn-sm"><Icon.Wine size={13}/> Appellation</button>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>10 sur 847 dossiers</span>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 30 }}><input type="checkbox" style={{ accentColor: 'var(--burgundy-800)' }}/></th>
              <SortableTh sortKey="ref"        currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>N° inscription</SortableTh>
              <SortableTh sortKey="producteur" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Producteur</SortableTh>
              <SortableTh sortKey="region"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Région</SortableTh>
              <SortableTh sortKey="ech"        currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Échant.</SortableTh>
              <SortableTh sortKey="status"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Statut</SortableTh>
              <SortableTh sortKey="montant"    currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Montant</SortableTh>
              <SortableTh sortKey="date"       currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Date</SortableTh>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r[0]} className={i === 0 ? 'selected' : ''} style={{ cursor: onOpenDossier ? 'pointer' : 'default' }} onClick={() => onOpenDossier && onOpenDossier(r[0])}>
                <td onClick={e => e.stopPropagation()}><input type="checkbox" defaultChecked={i === 0} style={{ accentColor: 'var(--burgundy-800)' }}/></td>
                <td><code style={{ fontSize: 12, color: 'var(--burgundy-800)', fontFamily: 'Menlo, monospace' }}>{r[0]}</code></td>
                <td style={{ fontWeight: 500 }}>{r[1]}</td>
                <td className="muted">{r[2]}</td>
                <td className="num tnum">{r[3]}</td>
                <td><StatusBadge status={r[4]}/></td>
                <td className="num tnum" style={{ fontWeight: 500 }}>{fmt(r[5])}</td>
                <td className="muted">{r[6]}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                    <button className="btn btn-icon btn-sm btn-ghost" title="Voir" onClick={e => { e.stopPropagation(); onOpenDossier && onOpenDossier(r[0]); }}><Icon.Eye size={13}/></button>
                    <button className="btn btn-icon btn-sm btn-ghost" title="Plus"><Icon.MoreH size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination {...paged}
        leftSlot={<span style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginRight: 12 }}>
          1 ligne sélectionnée — <a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--burgundy-800)', fontWeight: 500 }}>Lancer le contrôle</a>
        </span>}/>
    </div>
  );
};

const AdminPalmares = ({ concours = 'france' }) => {
  const isMonde = concours === 'monde';

  // Editions selon le concours
  const EDITIONS = isMonde ? [
    { id: '2026', label: 'Concours Monde 2026', published: false, mode: 'edition' },
    { id: '2025', label: 'Concours Monde 2025', published: true,  publishedAt: '20/06/2025', publishedBy: 'Sophie L.', mode: 'archive' },
  ] : [
    { id: '2026', label: 'Concours France 2026', published: false, mode: 'edition' },
    { id: '2025', label: 'Concours France 2025', published: true,  publishedAt: '15/06/2025', publishedBy: 'Sophie L.', mode: 'archive' },
    { id: '2024', label: 'Concours France 2024', published: true,  publishedAt: '12/06/2024', publishedBy: 'Sophie L.', mode: 'archive' },
  ];

  const [editionId, setEditionId] = React.useState('2026');
  const [editionPicker, setEditionPicker] = React.useState(false);
  const [tab, setTab] = React.useState('tous');
  const [sortKey, setSortKey] = React.useState('note');
  const [sortDir, setSortDir] = React.useState('desc');
  const [pageSize, setPageSize] = React.useState(25);
  const [rowMenu, setRowMenu] = React.useState(null); // row index
  const [publishModal, setPublishModal] = React.useState(false);
  const [importModal,  setImportModal]  = React.useState(false);
  const [exportMenu,   setExportMenu]   = React.useState(false);
  const [published,    setPublished]    = React.useState({}); // { editionId: { at, by } }

  const edition = EDITIONS.find(e => e.id === editionId);
  const isArchive = edition.mode === 'archive';
  const justPublished = published[editionId];

  // Monde : pas de bronze
  const counts = isMonde
    ? { or: 78, argent: 112, bronze: 0, sans: 28 }
    : { or: 142, argent: 184, bronze: 97, sans: 36 };
  const totalMedailles = counts.or + counts.argent + counts.bronze;

  // Images médailles selon le concours
  const medalImgAdmin = (medal) => isMonde
    ? { or: 'monde-or.webp', argent: 'monde-argent.webp' }[medal]
    : { or: 'OR-2025.webp', argent: 'ARGENT-2025.webp', bronze: 'BRONZE-2025.webp' }[medal];

  // Colonnes : [producteur, région, appellation, couleur, millésime, médaille, note, n°éch]
  //              r[0]       r[1]    r[2]          r[3]    r[4]       r[5]      r[6]  r[7]
  // Colonnes : [0]Producteur [1]Région [2]Appellation [3]Couleur [4]Millésime [5]Médaille [6]Note [7]N°éch [8]Complément [9]Cuvée
  const ALL_ROWS_FRANCE = [
    ['Domaine de la Chevalière',  'Mâconnais',         'Pouilly-Fuissé',    'Blanc', 2024, 'or',     92.4, 'ECH-2026-0184', 'Lieu-dit En Vers Cras',  'Vieilles Vignes'],
    ['Maison Joseph Drouhin',     'Côte de Beaune',    'Beaune 1er Cru',    'Rouge', 2023, 'or',     91.8, 'ECH-2026-0201', 'Les Grèves',              'Élevé en fût de chêne'],
    ['Château de Pierreclos',     'Mâconnais',         'Saint-Véran',       'Blanc', 2024, 'or',     90.6, 'ECH-2026-0093', 'Climat Les Pommards',    'Grande Réserve'],
    ['Domaine Bouchard Père',     'Côte de Beaune',    'Meursault',         'Blanc', 2023, 'or',     90.1, 'ECH-2026-0157', 'Les Chevalières',         'Tradition'],
    ['Domaine des 3 Pierres',     'Mâconnais',         'Mâcon-Villages',    'Blanc', 2024, 'argent', 88.2, 'ECH-2026-0042', '',                        'Prestige'],
    ['Cellier de Solutré',        'Mâconnais',         'Pouilly-Fuissé',    'Blanc', 2023, 'argent', 87.9, 'ECH-2026-0118', '',                        'Élevé en fût de chêne'],
    ['Vignobles Lacroix',         'Côte Chalonnaise',  'Mercurey',          'Rouge', 2024, 'argent', 86.4, 'ECH-2026-0076', '1er Cru',                 'Les Champs Martins'],
    ['Domaine Sainte-Anne',       'Mâconnais',         'Mâcon-Villages',    'Blanc', 2024, 'argent', 85.7, 'ECH-2026-0209', '',                        'Réserve'],
    ['Domaine Tabard',            'Beaujolais',        'Brouilly',          'Rouge', 2024, 'bronze', 84.5, 'ECH-2026-0033', '',                        'Vieilles Vignes'],
    ['Domaine de la Verrière',    'Beaujolais',        'Morgon',            'Rouge', 2023, 'bronze', 83.2, 'ECH-2026-0147', 'Côte du Py',              'Tradition'],
    ['Vignerons de Buxy',         'Côte Chalonnaise',  'Bourgogne Aligoté', 'Blanc', 2024, 'bronze', 82.6, 'ECH-2026-0055', '',                        'Signature'],
    ['Domaine Sainte-Anne',       'Mâconnais',         'Saint-Véran',       'Blanc', 2023, 'sans',   78.4, 'ECH-2026-0218', '',                        'Les Parcelles'],
    ['Vignobles Lacroix',         'Côte Chalonnaise',  'Givry',             'Rouge', 2024, 'sans',   76.8, 'ECH-2026-0081', '',                        'Blanc de Blancs'],
  ];

  // Monde : uniquement Or et Argent (pas de bronze)
  const ALL_ROWS_MONDE = [
    ['Domaine de la Chevalière',  'Mâconnais',         'Pouilly-Fuissé',    'Blanc', 2024, 'or',     93.1, 'ECH-MONDE-2026-0012', 'Lieu-dit En Vers Cras', 'Vieilles Vignes'],
    ['Maison Joseph Drouhin',     'Côte de Beaune',    'Beaune 1er Cru',    'Rouge', 2023, 'or',     92.5, 'ECH-MONDE-2026-0034', 'Les Grèves',             'Élevé en fût de chêne'],
    ['Château de Pierreclos',     'Mâconnais',         'Saint-Véran',       'Blanc', 2024, 'or',     91.2, 'ECH-MONDE-2026-0008', 'Climat Les Pommards',   'Grande Réserve'],
    ['Cellier de Solutré',        'Mâconnais',         'Pouilly-Fuissé',    'Blanc', 2023, 'argent', 88.7, 'ECH-MONDE-2026-0051', '',                       'Élevé en fût de chêne'],
    ['Vignobles Lacroix',         'Côte Chalonnaise',  'Mercurey',          'Rouge', 2024, 'argent', 87.3, 'ECH-MONDE-2026-0019', '1er Cru',                'Les Champs Martins'],
    ['Domaine Bouchard Père',     'Côte de Beaune',    'Meursault',         'Blanc', 2023, 'argent', 86.1, 'ECH-MONDE-2026-0067', 'Les Chevalières',        'Tradition'],
    ['Domaine Sainte-Anne',       'Mâconnais',         'Mâcon-Villages',    'Blanc', 2024, 'sans',   77.9, 'ECH-MONDE-2026-0083', '',                       'Réserve'],
    ['Domaine Tabard',            'Beaujolais',        'Brouilly',          'Rouge', 2024, 'sans',   75.2, 'ECH-MONDE-2026-0041', '',                       'Vieilles Vignes'],
  ];

  const ALL_ROWS = isMonde ? ALL_ROWS_MONDE : ALL_ROWS_FRANCE;

  const filtered = tab === 'tous' ? ALL_ROWS : ALL_ROWS.filter(r => r[5] === tab);
  const sorted = [...filtered].sort((a, b) => {
    const k = sortKey === 'note' ? 6 : sortKey === 'appellation' ? 2 : 4;
    const av = a[k], bv = b[k];
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ?  1 : -1;
    return 0;
  });

  // Pas de tab Bronze pour le Concours Monde
  const tabsDef = [
    { id: 'tous',   label: 'Tous',         count: totalMedailles + counts.sans },
    { id: 'or',     label: 'Or',           count: counts.or },
    { id: 'argent', label: 'Argent',       count: counts.argent },
    ...(!isMonde ? [{ id: 'bronze', label: 'Bronze', count: counts.bronze }] : []),
    { id: 'sans',   label: 'Sans médaille',count: counts.sans },
  ];

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir(key === 'note' ? 'desc' : 'asc'); }
  };

  return (
    <div data-screen-label="admin-palmares">
      <PageHeader
        breadcrumb={['Administration', `Concours ${edition.label.includes('Monde') ? 'Monde' : 'France'}`, 'Palmarès']}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span>Palmarès</span>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setEditionPicker(o => !o)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '6px 12px',
                  fontSize: 14, fontWeight: 500,
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  background: 'var(--surface)',
                  color: 'var(--fg)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {edition.label}
                {isArchive && <span style={{ fontSize: 10.5, padding: '1px 6px', background: 'var(--slate-100)', color: 'var(--fg-muted)', borderRadius: 4, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Archive</span>}
                <Icon.ChevronDown size={13} style={{ color: 'var(--fg-muted)' }}/>
              </button>
              {editionPicker && (
                <>
                  <div onClick={() => setEditionPicker(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }}/>
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 4px)', left: 0,
                    background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    minWidth: 260, zIndex: 60, overflow: 'hidden',
                  }}>
                    {EDITIONS.map(e => (
                      <button key={e.id} onClick={() => { setEditionId(e.id); setEditionPicker(false); }} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 14px', border: 'none', background: e.id === editionId ? 'var(--burgundy-50)' : 'transparent',
                        textAlign: 'left', cursor: 'pointer', fontSize: 13,
                        color: e.id === editionId ? 'var(--burgundy-800)' : 'var(--fg)',
                        fontWeight: e.id === editionId ? 600 : 500, fontFamily: 'inherit',
                      }}>
                        <span style={{ flex: 1 }}>{e.label}</span>
                        {e.published && <span style={{ fontSize: 10.5, color: 'var(--fg-muted)', fontWeight: 500 }}>publié</span>}
                        {e.id === editionId && <Icon.Check size={13}/>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        }
        subtitle={`${edition.label} · 459 vins dégustés · ${totalMedailles} médailles attribuées`}
        actions={isArchive ? (
          <ExportPdfDropdown open={exportMenu} setOpen={setExportMenu}/>
        ) : (<>
          <button className="btn btn-outline btn-sm" onClick={() => setImportModal(true)}><Icon.Upload size={14}/> Importer résultats</button>
          <ExportPdfDropdown open={exportMenu} setOpen={setExportMenu}/>
          <button className="btn btn-primary btn-sm" onClick={() => setPublishModal(true)} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Send size={14}/> {justPublished ? 'Republier' : 'Publier'}
          </button>
        </>)}
      />

      {/* Read-only banner (archive) */}
      {isArchive && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', marginBottom: 18,
          background: 'var(--slate-50)', border: '1px solid var(--border)', borderRadius: 8,
          fontSize: 12.5, color: 'var(--fg-muted)',
        }}>
          <Icon.Lock size={13}/>
          Palmarès publié le <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>{edition.publishedAt}</strong> par {edition.publishedBy} — lecture seule
        </div>
      )}

      {/* Just-published banner */}
      {justPublished && !isArchive && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', marginBottom: 18,
          background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8,
          fontSize: 12.5, color: '#166534',
        }}>
          <Icon.Check size={14}/>
          Palmarès publié le <strong>{justPublished.at}</strong> par {justPublished.by}
        </div>
      )}

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMonde ? 2 : 3}, 1fr)`, gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Médailles d\'Or',     n: counts.or,     img: medalImgAdmin('or') },
          { label: 'Médailles d\'Argent', n: counts.argent, img: medalImgAdmin('argent') },
          ...(!isMonde ? [{ label: 'Médailles de Bronze', n: counts.bronze, img: medalImgAdmin('bronze') }] : []),
        ].map(c => (
          <div key={c.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={c.img} alt={c.label} style={{ width: 52, height: 52, objectFit: 'contain', flexShrink: 0 }}/>
            <div>
              <div className="tnum display" style={{ fontSize: 28, fontWeight: 500, lineHeight: 1 }}>{c.n}</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 4 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        <div className="input-with-icon" style={{ flex: 1, maxWidth: 340 }}>
          <Icon.Search size={14} className="input-icon"/>
          <input className="input" placeholder="Rechercher cuvée, producteur…"/>
        </div>
        <button className="btn btn-outline btn-sm"><Icon.Medal size={13}/> Médaille</button>
        <button className="btn btn-outline btn-sm"><Icon.Wine size={13}/> Appellation</button>
        <button className="btn btn-outline btn-sm"><Icon.Filter size={13}/> Région</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, borderBottom: '1px solid var(--border)', marginBottom: 14 }}>
        {tabsDef.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '12px 0', border: 'none',
              borderBottom: active ? '2px solid var(--burgundy-800)' : '2px solid transparent',
              background: 'transparent',
              fontSize: 13.5, fontWeight: active ? 600 : 500,
              color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: -1, fontFamily: 'inherit',
            }}>
              {t.label}
              <span style={{
                fontSize: 11, padding: '0 6px', borderRadius: 999,
                background: active ? 'var(--burgundy-50)' : 'var(--slate-100)',
                color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)', fontWeight: 500,
              }}>{t.count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Producteur</th>
              <PalmaresSortableTh label="Appellation"             k="appellation" sortKey={sortKey} sortDir={sortDir} onSort={handleSort}/>
              <PalmaresSortableTh label="Millésime"               k="mill"        sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right"/>
              <th>Couleur</th>
              <th>Complément d'appellation</th>
              <th>Cuvée</th>
              <th>Médaille</th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice(0, pageSize).map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{r[0]}</td>
                <td>{r[2]}</td>
                <td className="num tnum">{r[4]}</td>
                <td className="muted">{r[3]}</td>
                <td className="muted">{r[8]}</td>
                <td>{r[9]}</td>
                <td><MedailleBadge kind={r[5]} concours={concours}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, fontSize: 12.5, color: 'var(--fg-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>Affichage de {Math.min(pageSize, sorted.length)} sur {tab === 'tous' ? totalMedailles + counts.sans : counts[tab]} résultats</span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} style={{
              padding: '3px 6px', border: '1px solid var(--border)', borderRadius: 6,
              background: 'var(--surface)', fontSize: 12, fontFamily: 'inherit', color: 'var(--fg)',
            }}>
              <option value={25}>25</option><option value={50}>50</option><option value={100}>100</option>
            </select>
            lignes / page
          </label>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <button className="btn btn-icon btn-sm btn-outline"><Icon.ChevronLeft size={13}/></button>
          <span className="tnum">Page 1 / {Math.ceil((tab === 'tous' ? totalMedailles + counts.sans : counts[tab]) / pageSize)}</span>
          <button className="btn btn-icon btn-sm btn-outline"><Icon.ChevronRight size={13}/></button>
        </div>
      </div>

      {publishModal && (
        <PublishPalmaresModal
          medalCount={counts.or + counts.argent + counts.bronze}
          orCount={counts.or}
          argentCount={counts.argent}
          bronzeCount={counts.bronze}
          onCancel={() => setPublishModal(false)}
          onConfirm={() => {
            setPublished(p => ({ ...p, [editionId]: { at: '12/05/2026 à 14h32', by: 'Sophie L.' } }));
            setPublishModal(false);
          }}
        />
      )}

      {importModal && (
        <ImportPalmaresModal onCancel={() => setImportModal(false)} onConfirm={() => setImportModal(false)}/>
      )}
    </div>
  );
};

// ─── Sortable header cell ─────────────────────────────────────────

const PalmaresSortableTh = ({ label, k, sortKey, sortDir, onSort, align }) => {
  const active = sortKey === k;
  return (
    <th
      onClick={() => onSort(k)}
      style={{ cursor: 'pointer', userSelect: 'none', textAlign: align || 'left' }}
    >
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        color: active ? 'var(--burgundy-800)' : 'inherit',
      }}>
        {label}
        <span style={{ fontSize: 9, color: active ? 'var(--burgundy-800)' : 'var(--fg-subtle)' }}>
          {active ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </span>
    </th>
  );
};

// ─── Medal dot badge ──────────────────────────────────────────────

const MedailleBadge = ({ kind, concours = 'france' }) => {
  const isMonde = concours === 'monde';
  const map = {
    or:     { img: isMonde ? 'monde-or.webp'     : 'OR-2025.webp',     label: 'Or' },
    argent: { img: isMonde ? 'monde-argent.webp' : 'ARGENT-2025.webp', label: 'Argent' },
    bronze: { img: 'BRONZE-2025.webp', label: 'Bronze' }, // Monde n'a pas de bronze
    sans:   { img: null,               label: 'Sans médaille' },
  };
  const s = map[kind] || map.sans;
  if (!s.img) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '3px 9px 3px 7px', borderRadius: 999,
        background: 'transparent', color: 'var(--fg-muted)',
        fontSize: 11.5, fontWeight: 600,
        border: '1px dashed var(--border)',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: '#cbd5e1', display: 'inline-block' }}/>
        {s.label}
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <img src={s.img} alt={s.label} style={{ width: 24, height: 24, objectFit: 'contain' }}/>
      <span style={{ fontSize: 11.5, fontWeight: 600 }}>{s.label}</span>
    </span>
  );
};

// ─── Row menu item ────────────────────────────────────────────────

const RowMenuItem = ({ icon, label, onClick, danger }) => (
  <button onClick={onClick} style={{
    width: '100%', display: 'flex', alignItems: 'center', gap: 9,
    padding: '8px 14px', border: 'none', background: 'transparent',
    textAlign: 'left', cursor: 'pointer', fontSize: 12.5,
    color: danger ? '#991b1b' : 'var(--fg)', fontFamily: 'inherit',
  }}
  onMouseEnter={e => e.currentTarget.style.background = danger ? '#fef2f2' : 'var(--slate-50)'}
  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >
    <span style={{ color: danger ? '#991b1b' : 'var(--fg-muted)', display: 'inline-flex' }}>{icon}</span>
    {label}
  </button>
);

// ─── Export PDF dropdown ──────────────────────────────────────────

const ExportPdfDropdown = ({ open, setOpen }) => {
  const options = [
    { id: 'complet',     icon: <Icon.FileText size={14}/>, label: 'Palmarès complet',        sub: 'PDF · 18 pages' },
    { id: 'or',          icon: <Icon.Medal size={14}/>,    label: 'Palmarès Or uniquement',  sub: 'PDF · 6 pages' },
    { id: 'appellation', icon: <Icon.Wine size={14}/>,     label: 'Palmarès par appellation', sub: 'PDF · 24 pages' },
  ];
  return (
    <div style={{ position: 'relative' }}>
      <button className="btn btn-outline btn-sm" onClick={() => setOpen(!open)}>
        <Icon.Download size={14}/> Export PDF
        <Icon.ChevronDown size={12} style={{ marginLeft: 2, opacity: 0.7 }}/>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }}/>
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
            boxShadow: '0 12px 32px rgba(15,23,42,0.10)',
            minWidth: 280, zIndex: 60, overflow: 'hidden', padding: '6px 0',
          }}>
            {options.map(o => (
              <button key={o.id} onClick={() => setOpen(false)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', border: 'none', background: 'transparent',
                textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ color: 'var(--burgundy-800)', display: 'inline-flex' }}>{o.icon}</span>
                <span style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 500 }}>{o.label}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 1 }}>{o.sub}</div>
                </span>
                <Icon.Download size={12} style={{ color: 'var(--fg-subtle)' }}/>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Publish modal ────────────────────────────────────────────────

const PublishPalmaresModal = ({ medalCount, orCount, argentCount, bronzeCount, onCancel, onConfirm }) => {
  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const actions = [
    {
      icon: <Icon.Mail size={16}/>,
      bg: 'var(--burgundy-50)',
      fg: 'var(--burgundy-800)',
      title: <>Email de félicitations → <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>{medalCount} producteurs médaillés</strong></>,
      sub: [orCount && `${orCount} Or`, argentCount && `${argentCount} Argent`, bronzeCount && `${bronzeCount} Bronze`].filter(Boolean).join(' · '),
    },
    {
      icon: <Icon.Globe size={16}/>,
      bg: '#eff6ff',
      fg: '#1d4ed8',
      title: <>Mise à jour de l'<strong style={{ color: 'var(--fg)', fontWeight: 600 }}>API WordPress</strong></>,
      sub: 'Palmarès visible sur les sites publics',
    },
    {
      icon: <Icon.Medal size={16}/>,
      bg: '#fef3c7',
      fg: '#a16207',
      title: <>Activation de la <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>commande de médailles</strong></>,
      sub: 'Dans l\'extranet producteur',
    },
  ];

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 560, padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '22px 26px 0' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Send size={14}/>
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Publication palmarès</span>
            </div>
            <h2 className="display" style={{ fontSize: 22, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>Publier le palmarès ?</h2>
            <p style={{ fontSize: 13.5, color: 'var(--fg-muted)', marginTop: 8, marginBottom: 0 }}>
              Cette action va déclencher :
            </p>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost" aria-label="Fermer" style={{ marginTop: -4 }}>
            <Icon.X size={14}/>
          </button>
        </div>

        <div style={{ padding: '18px 26px 6px' }}>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {actions.map((a, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: a.bg, color: a.fg,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {a.icon}
                </span>
                <div style={{ paddingTop: 2 }}>
                  <div style={{ fontSize: 13.5, color: 'var(--fg-muted)', lineHeight: 1.4 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginTop: 3 }}>{a.sub}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ margin: '18px 26px 0', padding: '12px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon.AlertTriangle size={14} style={{ color: '#991b1b', flexShrink: 0 }}/>
          <span style={{ fontSize: 12.5, color: '#991b1b', fontWeight: 500 }}>Cette action est irréversible.</span>
        </div>

        <div style={{ padding: '18px 22px 18px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button className="btn btn-primary" onClick={onConfirm} style={{ background: 'var(--burgundy-800)' }}>
            <Icon.Check size={14}/> Publier le palmarès
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Import modal ─────────────────────────────────────────────────

const ImportPalmaresModal = ({ onCancel, onConfirm }) => {
  const [file, setFile] = React.useState(null);
  const [dragOver, setDragOver] = React.useState(false);

  React.useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  const PREVIEW_ROWS = [
    ['Domaine de la Chevalière', 'or',     92.4],
    ['Maison Joseph Drouhin',    'or',     91.8],
    ['Château de Pierreclos',    'or',     90.6],
    ['Domaine des 3 Pierres',    'argent', 88.2],
    ['Vignobles Lacroix',        'argent', 86.4],
  ];

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const step = file ? 'preview' : 'drop';

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 580, padding: 0, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 24px 14px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Upload size={13}/>
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>
                Étape {step === 'drop' ? '1' : '2'} / 2 · {step === 'drop' ? 'Dépôt du fichier' : 'Aperçu avant import'}
              </span>
            </div>
            <h2 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>Importer les résultats</h2>
          </div>
          <button onClick={onCancel} className="btn btn-icon btn-sm btn-ghost" aria-label="Fermer">
            <Icon.X size={14}/>
          </button>
        </div>

        {/* Body */}
        {step === 'drop' ? (
          <div style={{ padding: '20px 24px 22px' }}>
            <label
              htmlFor="palm-csv"
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                display: 'block',
                border: `2px dashed ${dragOver ? 'var(--burgundy-800)' : 'var(--border)'}`,
                borderRadius: 10,
                padding: '36px 18px', textAlign: 'center',
                cursor: 'pointer',
                background: dragOver ? 'var(--burgundy-50)' : 'var(--slate-50)',
                transition: 'background .15s, border-color .15s',
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 11, background: 'var(--surface)', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--burgundy-800)', marginBottom: 12 }}>
                <Icon.Upload size={18}/>
              </div>
              <div style={{ fontSize: 14, color: 'var(--fg)', marginBottom: 4, fontWeight: 500 }}>
                Déposer le fichier CSV
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>
                ou <span style={{ color: 'var(--burgundy-800)', fontWeight: 600 }}>cliquer pour parcourir</span>
              </div>
              <input id="palm-csv" type="file" accept=".csv" style={{ display: 'none' }} onChange={e => e.target.files[0] && setFile(e.target.files[0])}/>
            </label>

            <div style={{ marginTop: 14, padding: '11px 13px', background: 'var(--slate-50)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 6, fontWeight: 600 }}>Format attendu</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginBottom: 6 }}>CSV — colonnes :</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {['cuvée','producteur','appellation','millésime','médaille','note'].map(c => (
                  <span key={c} style={{
                    fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
                    fontSize: 11, padding: '2px 7px', borderRadius: 4,
                    background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg)',
                  }}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Success banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px', background: '#f0fdf4', borderBottom: '1px solid #bbf7d0' }}>
              <span style={{ width: 22, height: 22, borderRadius: 999, background: '#16a34a', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon.Check size={12}/>
              </span>
              <div style={{ flex: 1, fontSize: 13, color: '#166534' }}>
                <strong style={{ fontWeight: 600 }}>{file.name}</strong> — <span className="tnum">459 lignes</span> détectées
              </div>
              <button onClick={() => setFile(null)} style={{ background: 'transparent', border: 'none', color: '#166534', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>
                Changer
              </button>
            </div>

            {/* Preview table */}
            <div style={{ padding: '14px 24px 6px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 8 }}>Aperçu</div>
              <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: 'var(--slate-50)' }}>
                      <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Producteur</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Médaille</th>
                      <th style={{ textAlign: 'right', padding: '8px 12px', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PREVIEW_ROWS.map((r, i) => (
                      <tr key={i} style={{ borderBottom: i < PREVIEW_ROWS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <td style={{ padding: '8px 12px', color: 'var(--fg)', fontWeight: 500 }}>{r[0]}</td>
                        <td style={{ padding: '8px 12px' }}><MedailleBadge kind={r[1]}/></td>
                        <td className="tnum" style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--burgundy-800)', fontWeight: 600 }}>{r[2].toFixed(1)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} style={{ padding: '8px 12px', fontSize: 11.5, color: 'var(--fg-muted)', fontStyle: 'italic', background: 'var(--slate-50)' }}>
                        + 454 autres lignes
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Warning */}
            <div style={{ margin: '12px 24px 0', padding: '10px 13px', background: '#fefce8', border: '1px solid #fde68a', borderRadius: 8, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Icon.AlertTriangle size={14} style={{ color: '#a16207', marginTop: 2, flexShrink: 0 }}/>
              <div style={{ flex: 1, fontSize: 12.5, color: '#854d0e' }}>
                <strong style={{ fontWeight: 600 }}>3 lignes ignorées</strong> — cuvées non reconnues
                <button style={{ background: 'transparent', border: 'none', color: '#a16207', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline', marginLeft: 8, padding: 0 }}>
                  Voir détails
                </button>
              </div>
            </div>

            <div style={{ height: 14 }}/>
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', background: 'var(--slate-50)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          {step === 'drop' ? (
            <button className="btn btn-primary" disabled style={{ background: 'var(--burgundy-800)', opacity: 0.4 }}>
              <Icon.Upload size={13}/> Importer
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onConfirm} style={{ background: 'var(--burgundy-800)' }}>
              <Icon.Check size={13}/> Confirmer l'import
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminGeneric = ({ title, icon, sub, breadcrumb }) => (
  <div>
    <PageHeader title={title} subtitle={sub} breadcrumb={breadcrumb}/>
    <div className="card" style={{ padding: 60, textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>{icon}</div>
      <div className="display" style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>Module {title}</div>
      <div style={{ fontSize: 14, color: 'var(--fg-muted)', maxWidth: 480, margin: '0 auto 20px' }}>
        Tableaux et fiches détaillés générés automatiquement depuis EasyAdmin sur les entités Doctrine du domaine.
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        <button className="btn btn-outline btn-sm"><Icon.Eye size={14}/> Aperçu CRUD</button>
        <button className="btn btn-primary btn-sm"><Icon.Plus size={14}/> Nouvelle entrée</button>
      </div>
    </div>
  </div>
);

// =====================================================================
// Concours Dashboard (France / Monde) — figma "Concours France - Dashboard"
// =====================================================================

const AdminConcoursDashboard = ({ concours = 'France' }) => {
  const isFrance = concours === 'France';

  // Stepper phases — phase courante = "Inscriptions terminées" (index 1)
  const phases = ['Inscriptions en cours', 'Inscriptions terminés', 'Contrôle J-14', 'Dégustation', 'Palmarès'];
  const currentPhase = 1;

  // Stats Concours
  const concoursStats = isFrance
    // R20 — small KPIs alignés sur les 4 nouveaux statuts
    ? { delta: '+12 %', large: [['847','Inscrits'],['241','Validés'],['198','Payés'],['2148','Échantillons']], small: [['167','En att. paiement'],['47','À vérifier'],['240','Payés']] }
    : { delta: '+48 %', large: [['312','Inscrits'],['80','Validés'],['65','Payés'],['612','Échantillons']], small: [['55','En att. paiement'],['22','À vérifier'],['65','Payés']] };

  // Contrôle des échantillons (gauge)
  const ctrl = isFrance
    ? { pct: 68, num: 1460, total: 2148, valides: 1214, manuel: 198, rejet: 48, nonTraite: 244 }
    : { pct: 42, num: 257,  total: 612,  valides: 198,  manuel: 38,  rejet: 12, nonTraite: 95 };

  // Dossiers à traiter
  const dossiers = [
    { nom: 'Domaine de la Chevalière', region: 'Mâconnais',     concours: 'France', ech: 8,  status: 'a-verifier' },
    { nom: 'Château Pied-de-Rieux',    region: 'Beaujolais',    concours: 'France', ech: 4,  status: 'soumis' },
    { nom: 'Maison Joseph Drouhin',    region: 'Côte de Beaune',concours: 'France', ech: 22, status: 'soumis' },
    { nom: 'Domaine des 3 Pierres',    region: 'Mâconnais',     concours: 'France', ech: 9,  status: 'soumis' },
  ];

  // Répartition par région
  const regions = isFrance ? [
    { r: 'Bourgogne — Mâconnais',    p: 210, e: 580, v: '87%', c: 8,  rej: 2 },
    { r: 'Beaujolais',                p: 145, e: 380, v: '74%', c: 14, rej: 5 },
    { r: 'Bourgogne — Côte d\'Or',   p: 128, e: 310, v: '91%', c: 4,  rej: 1 },
    { r: 'Vallée du Rhône',           p: 89,  e: 198, v: '68%', c: 19, rej: 3 },
    { r: 'Languedoc-Roussillon',      p: 76,  e: 165, v: '61%', c: 22, rej: 8 },
    { r: 'Bordeaux',                  p: 68,  e: 142, v: '79%', c: 7,  rej: 2 },
    { r: 'Val de Loire',              p: 52,  e: 108, v: '83%', c: 6,  rej: 1 },
    { r: 'Alsace',                    p: 38,  e: 89,  v: '94%', c: 2,  rej: 0 },
    { r: 'Provence',                  p: 24,  e: 67,  v: '70%', c: 5,  rej: 2 },
    { r: 'Sud-Ouest',                 p: 17,  e: 109, v: '55%', c: 12, rej: 4 },
  ] : [
    { r: 'Italie',                    p: 84,  e: 218, v: '82%', c: 12, rej: 3 },
    { r: 'Espagne',                   p: 62,  e: 156, v: '76%', c: 9,  rej: 4 },
    { r: 'Portugal',                  p: 41,  e: 92,  v: '88%', c: 5,  rej: 1 },
    { r: 'Allemagne',                 p: 38,  e: 71,  v: '85%', c: 3,  rej: 1 },
    { r: 'Autriche',                  p: 22,  e: 48,  v: '90%', c: 2,  rej: 0 },
    { r: 'Suisse',                    p: 18,  e: 27,  v: '78%', c: 4,  rej: 1 },
  ];

  // Échéances
  const echeances = isFrance ? [
    { mois: 'mai',  jour: '12', t: 'Clôture inscriptions France', sub: 'dans 7 jours' },
    { mois: 'mai',  jour: '24', t: 'Dégustation Concours France', sub: 'dans 19 jours' },
    { mois: 'juin', jour: '02', t: 'Publication palmarès',         sub: 'dans 28 jours' },
  ] : [
    { mois: 'juin', jour: '14', t: 'Clôture inscriptions Monde',  sub: 'dans 40 jours' },
    { mois: 'juin', jour: '20', t: 'Dégustation Concours Monde',  sub: 'dans 46 jours' },
    { mois: 'juin', jour: '28', t: 'Publication palmarès Monde',  sub: 'dans 54 jours' },
  ];

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de l'édition 2026 · mise à jour il y a 4 minutes"
        breadcrumb={['Administration', isFrance ? 'Concours France' : 'Concours Monde', 'Tableau de bord']}
        actions={<>
          <button className="btn btn-outline btn-sm"><Icon.Refresh size={14}/> Actualiser</button>
          <button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Export</button>
          <ActionsRapidesMenu/>
        </>}
      />

      {/* Phase actuelle — stepper */}
      <div className="card" style={{ padding: '20px 24px 28px', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-muted)', marginBottom: 16 }}>Phase actuelle</div>
        <div style={{ position: 'relative', padding: '8px 8px 0' }}>
          {/* Background line */}
          <div style={{ position: 'absolute', left: 8, right: 8, top: 18, height: 4, background: 'var(--slate-200)', borderRadius: 999 }}/>
          {/* Progress line */}
          <div style={{ position: 'absolute', left: 8, top: 18, height: 4, background: 'var(--burgundy-800)', borderRadius: 999,
            width: `calc((100% - 16px) * ${currentPhase} / ${phases.length - 1})` }}/>
          {/* Steps */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
            {phases.map((p, i) => {
              const done    = i <= currentPhase;
              const isFirst = i === 0;
              const isLast  = i === phases.length - 1;
              return (
                <div key={p} style={{
                  display: 'flex', flexDirection: 'column', alignItems: isFirst ? 'flex-start' : isLast ? 'flex-end' : 'center',
                  flex: isFirst || isLast ? '0 0 auto' : '0 0 auto',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: done ? 'var(--burgundy-800)' : 'var(--slate-300)',
                    border: '4px solid var(--bg-app, #fff)',
                    boxShadow: done ? '0 0 0 2px var(--burgundy-800)' : 'none',
                    position: 'relative', zIndex: 1,
                  }}/>
                  <div style={{
                    fontSize: 13, fontWeight: done ? 600 : 500, marginTop: 10,
                    color: done ? 'var(--burgundy-800)' : 'var(--fg-muted)',
                    whiteSpace: 'nowrap',
                  }}>{p}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ligne 2 — Contrôle (1/3) + Stats consolidées (2/3) */}
      <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: 16, marginBottom: 16, alignItems: 'stretch' }}>
        {/* Contrôle des échantillons */}
        <div className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg)', marginBottom: 18 }}>Contrôle des échantillons</div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span className="tnum" style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>{ctrl.pct}%</span>
              <span className="tnum" style={{ fontSize: 13, color: 'var(--fg-subtle)' }}>{ctrl.num} / {ctrl.total}</span>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: 'var(--slate-200)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${ctrl.pct}%`, background: 'var(--burgundy-800)', borderRadius: 999 }}/>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
            <CtrlLine label="Validés automatiquement" value={ctrl.valides}/>
            <CtrlLine label="À vérifier manuellement" value={ctrl.manuel}/>
            <CtrlLine label="Rejetés" value={ctrl.rejet}/>
            <CtrlLine label="Non traités" value={ctrl.nonTraite}/>
          </div>
          <button className="btn btn-outline" style={{ marginTop: 'auto', justifyContent: 'center' }}>
            Contrôler les échantillons <Icon.ArrowRight size={13}/>
          </button>
        </div>

        {/* Concours stats consolidées (4 KPI + 3 secondaires) */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-muted)' }}>Concours {concours}</div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '4px 10px', borderRadius: 999,
              background: 'rgba(25,145,69,0.08)', color: '#116530',
              fontSize: 12, fontWeight: 600,
            }}>
              <Icon.ArrowRight size={11} style={{ transform: 'rotate(-45deg)' }}/>
              {concoursStats.delta}
            </span>
          </div>

          {/* 4 KPI principaux — boîtes grises */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
            {concoursStats.large.map(([v, l]) => (
              <ConcoursStatBox key={l} value={v} label={l}/>
            ))}
          </div>
          {/* 3 KPI secondaires */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {concoursStats.small.map(([v, l]) => (
              <ConcoursStatBox key={l} value={v} label={l}/>
            ))}
          </div>
        </div>
      </div>

      {/* Ligne 3 — Dossiers à traiter + Échéances */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 440px', gap: 16, marginBottom: 16, alignItems: 'flex-start' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Dossiers à traiter</div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>{dossiers.length} inscriptions en attente de validation</div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ height: 28, padding: '0 8px', fontSize: 12.5 }}>
              Voir tout <Icon.ArrowRight size={12}/>
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Producteur</th>
                <th>Concours</th>
                <th className="num">Échant.</th>
                <th>Statut</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {dossiers.map((d, i) => (
                <tr key={i} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--fg)' }}>{d.nom}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{d.region}</div>
                  </td>
                  <td><ConcoursPill kind={d.concours}/></td>
                  <td className="num tnum">{d.ech}</td>
                  <td><StatusBadge status={d.status}/></td>
                  <td><button className="btn btn-icon btn-sm btn-ghost"><Icon.MoreH size={14}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Colonne droite : Prochaines échéances */}
        <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '18px 22px 10px', fontSize: 16, fontWeight: 700 }}>Prochaines échéances</div>
            <div style={{ padding: '0 22px 18px' }}>
              {echeances.map((e, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 0',
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ width: 44, textAlign: 'center', flexShrink: 0, padding: '4px 0' }}>
                    <div className="display" style={{ fontSize: 11, fontWeight: 600, color: 'var(--burgundy-800)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{e.mois}</div>
                    <div className="display" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1, color: 'var(--fg)', marginTop: 2 }}>{e.jour}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{e.t}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>{e.sub}</div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* Ligne 4 — Répartition par région (pleine largeur) */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '18px 22px 14px', fontSize: 16, fontWeight: 700 }}>Répartition par région</div>
        <table className="table">
          <thead>
            <tr>
              <th>Région</th>
              <th className="num">Producteurs</th>
              <th className="num">Échant.</th>
              <th className="num">Validés</th>
              <th className="num">À contrô.</th>
              <th className="num">Rejetés</th>
            </tr>
          </thead>
          <tbody>
            {regions.map(r => (
              <tr key={r.r}>
                <td style={{ fontWeight: 500 }}>{r.r}</td>
                <td className="num tnum">{r.p}</td>
                <td className="num tnum">{r.e}</td>
                <td className="num tnum">{r.v}</td>
                <td className="num tnum">{r.c}</td>
                <td className="num tnum">{r.rej}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ligne 5 — Activité + Action requise */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '18px 22px 8px', fontSize: 16, fontWeight: 700 }}>Activité récente</div>
          <div style={{ padding: '0 22px 18px' }}>
            {[
              { who: 'Dom. Chevalière',  what: 'a soumis 8 échantillons',  when: 'il y a 12 min', icon: <Icon.Wine size={13}/>, color: 'var(--burgundy-800)', bg: 'var(--burgundy-50)' },
              { who: 'Sophie L.',         what: 'a validé Pied-de-Rieux',   when: 'il y a 28 min', icon: <Icon.Check size={13}/>, color: '#166534',           bg: 'var(--success-bg)' },
              { who: 'Cantina Verdicchio',what: 'a payé 480 €',             when: 'il y a 1 h',    icon: <Icon.Euro size={13}/>,  color: 'var(--gold-700)',   bg: 'var(--gold-100)' },
              { who: 'Système',           what: 'a contrôlé 14 dossiers',   when: 'il y a 2 h',    icon: <Icon.ShieldCheck size={13}/>, color: '#1e40af',     bg: '#eef4ff' },
            ].map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 0',
                borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                fontSize: 13,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: a.bg, color: a.color,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>{a.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: 600 }}>{a.who}</span>
                  <span style={{ color: 'var(--fg-muted)' }}> {a.what}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-subtle)', whiteSpace: 'nowrap' }}>{a.when}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'var(--burgundy-900)', borderRadius: 12, padding: 24, color: '#fff',
          position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          <svg style={{ position: 'absolute', right: -28, bottom: -28, opacity: 0.07 }} width="180" height="180" viewBox="0 0 24 24" fill="#fff">
            <circle cx="12" cy="9" r="6"/>
          </svg>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold-300)', marginBottom: 16, position: 'relative' }}>Action requise</div>
          <div className="display" style={{
            fontSize: 22, fontWeight: 600, lineHeight: 1.3,
            color: '#f7f7f7', position: 'relative', letterSpacing: '-0.01em',
          }}>
            Lancer le contrôle automatique des {ctrl.nonTraite} dossiers restants
          </div>
          <div style={{ fontSize: 13, opacity: 0.78, marginTop: 10, position: 'relative' }}>
            Extraction OCR + croisement DREV/analyses ~ 18 min
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 20, position: 'relative' }}>
            <button className="btn btn-sm" style={{ background: '#f5f5f3', color: 'var(--burgundy-900)', fontWeight: 600, border: 'none' }}>
              <Icon.Sparkles size={13}/> Lancer le contrôle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Ligne dans la card "Contrôle des échantillons"
const CtrlLine = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
    <span style={{ color: 'var(--fg-muted)' }}>{label}</span>
    <span className="tnum" style={{ fontWeight: 500, color: 'var(--fg)' }}>{value.toLocaleString('fr-FR')}</span>
  </div>
);

// Boîte KPI grise des stats Concours
const ConcoursStatBox = ({ value, label }) => (
  <div style={{
    background: 'var(--slate-50)',
    borderRadius: 10,
    padding: '14px 16px',
  }}>
    <div className="display tnum" style={{ fontSize: 26, fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 8, fontWeight: 500 }}>{label}</div>
  </div>
);

// ─── Contrôle auto : Modal + Banner ─────────────────────────────────

const ControlConfirmModal = ({ total, onCancel, onConfirm }) => {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div onClick={onCancel} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(15, 23, 42, 0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, animation: 'fadeIn .15s ease-out',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface)',
        borderRadius: 14,
        width: '100%', maxWidth: 480,
        boxShadow: 'var(--shadow-xl, 0 24px 48px rgba(0,0,0,.18))',
        overflow: 'hidden',
        animation: 'modalIn .2s cubic-bezier(.2,.9,.3,1)',
      }}>
        <div style={{ padding: '24px 28px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon.Sparkles size={14}/>
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Contrôle automatique</span>
          </div>
          <h2 className="display" style={{ fontSize: 22, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>Lancer le contrôle automatique</h2>
          <p style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 8, lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>{total} dossiers soumis</strong> vont être analysés.
          </p>
        </div>

        <div style={{ padding: '18px 28px', margin: '20px 28px', background: 'var(--slate-50, #f8fafc)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg)', marginBottom: 10 }}>Le système va :</div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Extraire les données des documents (OCR)',
              'Croiser avec les déclarations producteurs',
              'Attribuer un score de fiabilité à chaque dossier',
            ].map((t, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.5 }}>
                <Icon.Check size={14} style={{ color: 'var(--burgundy-800)', marginTop: 2, flexShrink: 0 }}/>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ padding: '0 28px 4px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--fg-muted)' }}>
          <Icon.Activity size={14}/>
          <span>Durée estimée <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>~ 18 minutes</strong> · Vous pouvez continuer à travailler pendant le traitement.</span>
        </div>

        <div style={{ padding: '20px 28px 24px', display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button className="btn btn-primary" onClick={onConfirm}>
            <Icon.Sparkles size={14}/> Lancer le contrôle
            <Icon.ArrowRight size={13}/>
          </button>
        </div>
      </div>
    </div>
  );
};

const ControlBanner = ({ state, progress, total, onSeeAControler, onClose }) => {
  const isDone = state === 'done';
  const pct = Math.round((progress / total) * 100);

  // Fictional split for the "done" result
  const validated = 98, toReview = 35, rejected = 9;

  return (
    <div style={{
      marginBottom: 20,
      borderRadius: 10,
      border: '1px solid ' + (isDone ? 'var(--success-border, #bbf7d0)' : 'var(--burgundy-200, #f1d4e0)'),
      background: isDone ? 'var(--success-bg, #f0fdf4)' : 'var(--burgundy-50)',
      padding: '14px 18px',
      display: 'flex', alignItems: 'center', gap: 16,
      animation: 'slideDown .25s ease-out',
    }}>
      <span style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: isDone ? '#16a34a' : 'var(--burgundy-800)',
        color: '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isDone ? <Icon.Check size={16}/> : <Spinner/>}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        {!isDone ? (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--burgundy-900, var(--burgundy-800))' }}>Contrôle en cours</span>
              <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }} className="tnum">
                <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>{progress}</strong> / {total} · {pct}%
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: 'rgba(83,20,66,0.12)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: pct + '%',
                background: 'var(--burgundy-800)',
                transition: 'width .3s ease-out',
                borderRadius: 999,
              }}/>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#14532d', marginBottom: 4 }}>Contrôle terminé</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span><strong style={{ color: '#16a34a', fontWeight: 600 }} className="tnum">{validated}</strong> validés auto</span>
              <span style={{ color: 'var(--border)' }}>·</span>
              <span><strong style={{ color: '#b45309', fontWeight: 600 }} className="tnum">{toReview}</strong> à vérifier</span>
              <span style={{ color: 'var(--border)' }}>·</span>
              <span><strong style={{ color: '#b91c1c', fontWeight: 600 }} className="tnum">{rejected}</strong> rejetés</span>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {isDone ? (
          <button className="btn btn-primary btn-sm" onClick={onSeeAControler}>
            Voir les "À vérifier" <Icon.ArrowRight size={13}/>
          </button>
        ) : (
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--burgundy-800)' }}>
            Voir le détail
          </button>
        )}
        <button className="btn btn-icon btn-sm btn-ghost" onClick={onClose} title={isDone ? 'Fermer' : 'Masquer'}>
          <Icon.X size={14}/>
        </button>
      </div>
    </div>
  );
};

const Spinner = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3"/>
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

Object.assign(window, {
  AdminDashboard,
  AdminInscriptions,
  AdminPalmares,
  AdminGeneric,
  AdminConcoursDashboard,
  ControlConfirmModal,
  ControlBanner,
});
