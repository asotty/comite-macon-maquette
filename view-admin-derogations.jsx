// Admin · Dérogations impression — gestion des demandes d'impression sur étiquette
// Producteur soumet BAT + format + quantité → comité valide ou refuse ici.

const DEROG_IMP_ROWS_INIT = [
  {
    id: 'DBI-2026-0004', producteur: 'Domaine de la Chevalière', contact: 'Marie Dupont',
    region: 'Maconnais', vin: 'La Reserve Oree du Bois 2024', medaille: 'Or', concours: 'france',
    format: 'Bouteille', quantite: 800, unites: 800, batFile: 'bat-oree-bois-2024.pdf',
    dateDemande: '2026-06-21', statut: 'en_attente', motifRefus: null,
  },
  {
    id: 'DBI-2026-0003', producteur: 'Château Pied-de-Rieux', contact: 'Jean Moreau',
    region: 'Beaujolais', vin: 'Moulin-a-Vent 2023', medaille: 'Argent', concours: 'france',
    format: 'Carton 6 bouteilles', quantite: 120, unites: 720, batFile: 'bat-moulin-vent-2023.pdf',
    dateDemande: '2026-06-20', statut: 'en_attente', motifRefus: null,
  },
  {
    id: 'DBI-2026-0002', producteur: 'Maison Joseph Drouhin', contact: 'Sophie Granger',
    region: 'Cote de Beaune', vin: 'Pouilly-Fuisse Grand Cru 2022', medaille: 'Or', concours: 'france',
    format: 'Carton 12 bouteilles', quantite: 60, unites: 720, batFile: 'bat-pouilly-gc-2022.pdf',
    dateDemande: '2026-06-18', statut: 'validee', motifRefus: null,
  },
  {
    id: 'DBI-2026-0001', producteur: 'Vignobles Lacroix', contact: 'Pierre Lacombe',
    region: 'Cote Chalonnaise', vin: 'Mercurey Les Champs Martin 2023', medaille: 'Bronze', concours: 'france',
    format: 'Bouteille', quantite: 300, unites: 300, batFile: 'bat-mercurey-2023.pdf',
    dateDemande: '2026-06-15', statut: 'refusee', motifRefus: 'Fichier BAT illisible — résolution insuffisante (72 dpi). Merci de renvoyer en 300 dpi minimum.',
  },
];

const medailleColors = { Or: '#d97706', Argent: '#64748b', Bronze: '#92400e' };

// Badge statut dérogation impression (côté admin)
const AdminDerogImpBadge = ({ statut }) => {
  const cfg = {
    en_attente: { label: 'En attente', bg: '#fffbeb', color: '#b45309', border: '#fcd34d', icon: Icon.Clock     },
    validee:    { label: 'Validée',    bg: '#f0fdf4', color: '#15803d', border: '#86efac', icon: Icon.CheckCircle},
    refusee:    { label: 'Refusée',    bg: '#fff5f5', color: '#dc2626', border: '#fca5a5', icon: Icon.XCircle   },
  }[statut] || { label: statut, bg: '#f3f4f6', color: '#6b7280', border: '#d1d5db', icon: Icon.Clock };
  const Ic = cfg.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
    }}>
      <Ic size={11}/> {cfg.label}
    </span>
  );
};

// Panel de validation (slide-in à droite)
const AdminDerogImpPanel = ({ row, onClose, onValider, onRefuser }) => {
  const [motif, setMotif]           = React.useState('');
  const [showRefusForm, setShowRef] = React.useState(false);
  const [loading, setLoading]       = React.useState(null); // 'valider' | 'refuser'

  const handleValider = () => {
    setLoading('valider');
    setTimeout(() => { onValider(row.id); setLoading(null); onClose(); }, 800);
  };

  const handleRefuser = () => {
    if (!motif.trim()) return;
    setLoading('refuser');
    setTimeout(() => { onRefuser(row.id, motif.trim()); setLoading(null); onClose(); }, 800);
  };

  const isDecided = row.statut !== 'en_attente';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
    }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }}/>

      {/* Panel */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: 460, height: '100vh', overflow: 'auto',
        background: 'var(--surface)', boxShadow: '-8px 0 40px rgba(0,0,0,0.14)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header panel */}
        <div style={{
          padding: '18px 22px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon.Printer size={16} style={{ color: 'var(--primary)' }}/> Dérogation impression
            </div>
            <code style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>{row.id}</code>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ fontSize: 18, padding: '4px 10px' }}>×</button>
        </div>

        {/* Corps */}
        <div style={{ flex: 1, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Statut */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AdminDerogImpBadge statut={row.statut}/>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Demande du {row.dateDemande}</span>
          </div>

          {/* Producteur */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>
              Producteur
            </div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{row.producteur}</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>{row.contact} · {row.region}</div>
          </div>

          {/* Médaille concernée */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>
              Médaille concernée
            </div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{row.vin}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                background: medailleColors[row.medaille] + '18',
                color: medailleColors[row.medaille] || '#6b7280',
                border: `1px solid ${medailleColors[row.medaille] || '#d1d5db'}44`,
              }}>
                <Icon.Award size={11}/> {row.medaille}
              </span>
              <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Concours {row.concours === 'france' ? 'France' : 'Monde'}</span>
            </div>
          </div>

          {/* Détails commande */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>
              Détails de la demande
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--fg-muted)' }}>Format de support</span>
                <strong>{row.format}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--fg-muted)' }}>Quantité</span>
                <strong className="tnum">{row.quantite} articles</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--fg-muted)' }}>Unités à déduire du quota</span>
                <strong className="tnum" style={{ color: 'var(--burgundy-800)' }}>{row.unites} unités</strong>
              </div>
            </div>
          </div>

          {/* BAT */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>
              Fichier BAT
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 8,
              background: 'var(--bg)', border: '1px solid var(--border)',
            }}>
              <Icon.FileText size={20} style={{ color: 'var(--primary)', flexShrink: 0 }}/>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{row.batFile}</span>
              <button className="btn btn-outline btn-sm">
                <Icon.Eye size={12}/> Aperçu
              </button>
              <button className="btn btn-outline btn-sm">
                <Icon.Download size={12}/> Télécharger
              </button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 8 }}>
              Vérifier : résolution minimum 300 dpi · format PDF/AI/EPS · logo et médaille lisibles.
            </div>
          </div>

          {/* Motif de refus (si refusée) */}
          {row.statut === 'refusee' && row.motifRefus && (
            <div style={{
              padding: '12px 14px', borderRadius: 8,
              background: '#fff5f5', border: '1px solid #fca5a5',
            }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: '#dc2626', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon.XCircle size={12}/> Motif du refus
              </div>
              <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.5 }}>{row.motifRefus}</div>
            </div>
          )}

          {/* Formulaire refus */}
          {showRefusForm && !isDecided && (
            <div style={{
              padding: '14px 16px', borderRadius: 8,
              background: '#fff5f5', border: '1px solid #fca5a5',
            }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: '#dc2626', display: 'block', marginBottom: 8 }}>
                Motif du refus (obligatoire)
              </label>
              <textarea
                value={motif} onChange={e => setMotif(e.target.value)}
                placeholder="Ex : Fichier BAT illisible — résolution insuffisante..."
                rows={3}
                style={{
                  width: '100%', padding: '8px 10px', borderRadius: 8, boxSizing: 'border-box',
                  border: '1.5px solid #fca5a5', background: 'white', color: 'var(--fg)',
                  fontSize: 13, resize: 'vertical', fontFamily: 'inherit',
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => { setShowRef(false); setMotif(''); }}>
                  Annuler
                </button>
                <button
                  className="btn btn-sm"
                  style={{
                    background: '#dc2626', color: 'white', border: 'none',
                    opacity: motif.trim() ? 1 : 0.45, cursor: motif.trim() ? 'pointer' : 'default',
                  }}
                  disabled={!motif.trim() || loading === 'refuser'}
                  onClick={handleRefuser}
                >
                  {loading === 'refuser' ? 'Envoi...' : 'Confirmer le refus'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!isDecided && !showRefusForm && (
          <div style={{
            padding: '14px 22px', borderTop: '1px solid var(--border)',
            display: 'flex', gap: 10,
          }}>
            <button
              className="btn btn-sm"
              style={{ flex: 1, background: '#dc2626', color: 'white', border: 'none' }}
              onClick={() => setShowRef(true)}
            >
              <Icon.XCircle size={13}/> Refuser
            </button>
            <button
              className="btn btn-sm"
              style={{ flex: 1, background: '#15803d', color: 'white', border: 'none' }}
              onClick={handleValider}
              disabled={loading === 'valider'}
            >
              {loading === 'valider' ? (
                'Validation...'
              ) : (
                <><Icon.CheckCircle size={13}/> Valider</>
              )}
            </button>
          </div>
        )}
        {isDecided && (
          <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-outline" style={{ width: '100%' }} onClick={onClose}>Fermer</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Composant principal ───────────────────────────────────────────

const AdminDerogations = ({ concours = 'France', onOpenDossier }) => {
  const [rows, setRows]       = React.useState(DEROG_IMP_ROWS_INIT);
  const [tab, setTab]         = React.useState('en-attente');
  const [selected, setSelected] = React.useState(null); // row ouverte dans le panel

  // Valider une demande → déduction quota + statut validée
  const handleValider = (id) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, statut: 'validee' } : r));
  };

  // Refuser une demande avec motif obligatoire
  const handleRefuser = (id, motif) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, statut: 'refusee', motifRefus: motif } : r));
  };

  const tabsDef = [
    { id: 'en-attente', label: 'En attente', statut: 'en_attente' },
    { id: 'validees',   label: 'Validées',   statut: 'validee'    },
    { id: 'refusees',   label: 'Refusées',   statut: 'refusee'    },
    { id: 'toutes',     label: 'Toutes',     statut: null         },
  ];

  const activeTab  = tabsDef.find(t => t.id === tab);
  const filtered   = activeTab.statut ? rows.filter(r => r.statut === activeTab.statut) : rows;
  const counts     = tabsDef.reduce((acc, t) => {
    acc[t.id] = t.statut ? rows.filter(r => r.statut === t.statut).length : rows.length;
    return acc;
  }, {});

  return (
    <div data-screen-label="admin-derogations-impression">
      <PageHeader
        title="Dérogations impression"
        subtitle={`Concours ${concours} 2026 · ${counts['en-attente']} demande${counts['en-attente'] !== 1 ? 's' : ''} en attente`}
        breadcrumb={['Administration', `Concours ${concours}`, 'Dérogations impression']}
        actions={<button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Export</button>}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, borderBottom: '1px solid var(--border)', marginBottom: 18 }}>
        {tabsDef.map(t => {
          const isActive = tab === t.id;
          const n = counts[t.id];
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '12px 0', border: 'none',
              borderBottom: isActive ? '2px solid var(--burgundy-800)' : '2px solid transparent',
              background: 'transparent', fontSize: 13.5, fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--burgundy-800)' : 'var(--fg-muted)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: -1, fontFamily: 'inherit',
            }}>
              {t.label}
              <span style={{
                fontSize: 11, padding: '0 6px', borderRadius: 999,
                background: isActive ? 'var(--burgundy-50)' : 'var(--slate-100)',
                color: isActive ? 'var(--burgundy-800)' : 'var(--fg-muted)', fontWeight: 500,
              }}>{n}</span>
            </button>
          );
        })}
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <div className="input-with-icon" style={{ flex: 1, maxWidth: 340 }}>
          <Icon.Search size={14} className="input-icon"/>
          <input className="input" placeholder="Rechercher producteur, vin, N° demande…"/>
        </div>
        <button className="btn btn-outline btn-sm"><Icon.Filter size={13}/> Format</button>
        <button className="btn btn-outline btn-sm"><Icon.Calendar size={13}/> Période</button>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>
          Tri : <strong style={{ color: 'var(--fg)' }}>Date ↓</strong>
        </span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 999, background: '#dcfce7',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#166534', marginBottom: 14 }}>
            <Icon.Check size={22}/>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
            {tab === 'en-attente' ? 'Aucune demande en attente' : 'Aucune demande ici'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
            {tab === 'en-attente' ? 'Toutes les demandes ont été traitées.' : 'Changez d\'onglet pour voir d\'autres demandes.'}
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>N° demande</th>
                <th>Producteur</th>
                <th>Vin / Médaille</th>
                <th>Format</th>
                <th className="tnum" style={{ textAlign: 'right' }}>Qté</th>
                <th className="tnum" style={{ textAlign: 'right' }}>Unités</th>
                <th>BAT</th>
                <th>Statut</th>
                <th style={{ width: 36 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <AdminDerogImpRow
                  key={r.id} r={r}
                  onClick={() => setSelected(r)}
                  onValider={() => { handleValider(r.id); }}
                  onRefuser={() => setSelected(r)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Panel latéral de validation */}
      {selected && (
        <AdminDerogImpPanel
          row={rows.find(r => r.id === selected.id) || selected}
          onClose={() => setSelected(null)}
          onValider={handleValider}
          onRefuser={handleRefuser}
        />
      )}
    </div>
  );
};

// Ligne de tableau — dérogation impression
const AdminDerogImpRow = ({ r, onClick, onValider, onRefuser }) => {
  const [menu, setMenu] = React.useState(false);

  return (
    <tr style={{ cursor: 'pointer' }} onClick={onClick}>
      <td>
        <code style={{ fontSize: 12, color: 'var(--burgundy-800)', fontFamily: 'Menlo, monospace', fontWeight: 600 }}>
          {r.id}
        </code>
      </td>
      <td>
        <div style={{ fontWeight: 500 }}>{r.producteur}</div>
        <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>{r.contact} · {r.region}</div>
      </td>
      <td>
        <div style={{ fontWeight: 500, fontSize: 13 }}>{r.vin}</div>
        <span style={{
          fontSize: 11, padding: '1px 6px', borderRadius: 999, fontWeight: 600,
          background: (medailleColors[r.medaille] || '#6b7280') + '18',
          color: medailleColors[r.medaille] || '#6b7280',
        }}>{r.medaille}</span>
      </td>
      <td className="muted">{r.format}</td>
      <td className="tnum" style={{ textAlign: 'right' }}>{r.quantite}</td>
      <td className="tnum" style={{ textAlign: 'right', fontWeight: 600, color: 'var(--burgundy-800)' }}>{r.unites}</td>
      <td onClick={e => e.stopPropagation()}>
        <button className="btn btn-ghost btn-sm" style={{ fontSize: 11.5 }}>
          <Icon.FileText size={12}/> {r.batFile.split('.').pop().toUpperCase()}
        </button>
      </td>
      <td><AdminDerogImpBadge statut={r.statut}/></td>
      <td onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
        <button className="btn btn-icon btn-sm btn-ghost" onClick={() => setMenu(o => !o)}>
          <Icon.MoreH size={13}/>
        </button>
        {menu && (
          <>
            <div onClick={() => setMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }}/>
            <div style={{
              position: 'absolute', top: 32, right: 8,
              background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)', minWidth: 200, zIndex: 60, overflow: 'hidden', padding: '4px 0',
            }}>
              <AdminDerogImpMenuItem icon={<Icon.Eye size={13}/>} label="Voir le détail"
                onClick={() => { setMenu(false); onClick(); }}/>
              {r.statut === 'en_attente' && (
                <>
                  <AdminDerogImpMenuItem icon={<Icon.CheckCircle size={13}/>} label="Valider"
                    onClick={() => { setMenu(false); onValider(); }}/>
                  <AdminDerogImpMenuItem icon={<Icon.XCircle size={13}/>} label="Refuser (avec motif)"
                    onClick={() => { setMenu(false); onRefuser(); }} danger/>
                </>
              )}
            </div>
          </>
        )}
      </td>
    </tr>
  );
};

const AdminDerogImpMenuItem = ({ icon, label, onClick, danger }) => (
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

Object.assign(window, { AdminDerogations });
