const ProducteurInscriptionsList = ({ onOpenWizard }) => {
  const [tab, setTab] = React.useState('cours');
  const [viewing, setViewing] = React.useState(null);
  const [duplicating, setDuplicating] = React.useState(null);

  const inscriptionsCours = [
    { concours: 'Concours France', edition: '2026', dossier: 'INS-2026-0184', ech: 8, montant: 480, status: 'valide',     date: '03 juin 2026' },
    { concours: 'Concours Monde',  edition: '2026', dossier: 'INS-2026-0021', ech: 3, montant: 180, status: 'brouillon',  date: '02 juin 2026' },
  ];
  const inscriptionsHist = [
    { concours: 'Concours France', edition: '2025', dossier: 'INS-2025-0142', ech: 7, montant: 420, status: 'paye',  date: '24 mai 2025' },
    { concours: 'Concours Monde',  edition: '2025', dossier: 'INS-2025-0008', ech: 4, montant: 240, status: 'paye',  date: '20 mai 2025' },
    { concours: 'Concours France', edition: '2024', dossier: 'INS-2024-0098', ech: 6, montant: 360, status: 'paye',  date: '18 mai 2024' },
    { concours: 'Concours France', edition: '2023', dossier: 'INS-2023-0067', ech: 5, montant: 300, status: 'rejete',date: '15 mai 2023' },
  ];
  const rows = tab === 'cours' ? inscriptionsCours : inscriptionsHist;

  if (viewing) {
    return (
      <>
        <ProducteurInscriptionDetail
          inscription={viewing}
          onBack={() => setViewing(null)}
          onDuplicate={() => setDuplicating(viewing)}
        />
        {duplicating && (
          <DuplicateInscriptionModal
            source={duplicating}
            onClose={() => setDuplicating(null)}
            onConfirm={(target) => { setDuplicating(null); onOpenWizard(); }}
          />
        )}
      </>
    );
  }

  const handleRow = (r) => {
    if (r.status === 'brouillon') onOpenWizard();
    else setViewing(r);
  };

  return (
    <div>
      <PageHeader
        title="Mes inscriptions"
        subtitle="Suivez vos dossiers en cours et l'historique de vos participations"
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
        {[
          { id: 'cours',     label: 'En cours',    count: inscriptionsCours.length },
          { id: 'historique', label: 'Historique', count: inscriptionsHist.length },
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
              {t.label}
              <span style={{
                fontSize: 11, fontWeight: 600,
                padding: '1px 7px',
                borderRadius: 999,
                background: isActive ? 'var(--burgundy-50)' : 'var(--slate-100)',
                color: isActive ? 'var(--burgundy-800)' : 'var(--fg-muted)',
              }}>{t.count}</span>
              {isActive && (
                <span style={{
                  position: 'absolute', left: 12, right: 12, bottom: -1,
                  height: 2, background: 'var(--burgundy-800)',
                }}/>
              )}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Concours</th>
              <th>Dossier</th>
              <th>Soumis le</th>
              <th className="num">Échantillons</th>
              <th className="num">Montant</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ cursor: 'pointer' }} onClick={() => handleRow(r)}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 7,
                      background: r.concours.includes('Monde') ? '#eef4ff' : 'var(--burgundy-50)',
                      color: r.concours.includes('Monde') ? '#1e40af' : 'var(--burgundy-800)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {r.concours.includes('Monde') ? <Icon.Globe size={14}/> : <Icon.Trophy size={14}/>}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{r.concours}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>Édition {r.edition}</div>
                    </div>
                  </div>
                </td>
                <td className="tnum muted">{r.dossier}</td>
                <td className="muted">{r.date}</td>
                <td className="num tnum">{r.ech}</td>
                <td className="num tnum" style={{ fontWeight: 500 }}>{r.montant} €</td>
                <td><StatusBadge status={r.status}/></td>
                <td style={{ textAlign: 'right', width: 80, paddingRight: 8 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }} onClick={(e) => e.stopPropagation()}>
                    <RowMenu items={[
                      { label: 'Voir le dossier', icon: <Icon.Eye size={13}/>, onClick: () => handleRow(r) },
                      { label: 'Dupliquer',       icon: <Icon.Copy size={13}/>, onClick: () => setDuplicating(r) },
                      'divider',
                      { label: 'Télécharger la facture', icon: <Icon.Download size={13}/>, onClick: () => {} },
                    ]}/>
                    <Icon.ChevronRight size={14} style={{ color: 'var(--fg-subtle)' }}/>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tab === 'cours' && (
        <div style={{
          marginTop: 16,
          padding: '14px 18px',
          background: 'var(--surface-2)',
          border: '1px dashed var(--border)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>Vous pouvez inscrire d'autres cuvées</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>
              Clôture Concours France · 15 juin 2026 · dans 12 jours
            </div>
          </div>
          <button className="btn btn-primary" onClick={onOpenWizard}>
            <Icon.Plus size={14}/> Nouvelle inscription
          </button>
        </div>
      )}

      {duplicating && (
        <DuplicateInscriptionModal
          source={duplicating}
          onClose={() => setDuplicating(null)}
          onConfirm={(target) => { setDuplicating(null); onOpenWizard(); }}
        />
      )}
    </div>
  );
};

const ProducteurDashboard = ({ kpiVariant, showKpiIcons, onNavigate }) => {
  const daysToClose = 12; // Clôture J-12 → bordeaux car < 15
  const closeUrgent = daysToClose < 15;
  const hasUrgentAction = true; // Toggle pour démontrer le bandeau

  return (
    <div>
      {/* Welcome block — texte simple, pas de card */}
      <div style={{ marginBottom: 28 }}>
        <h1 className="display" style={{ fontSize: 32, fontWeight: 500, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>
          Bonjour, Domaine de la Chevalière
        </h1>
        <div style={{ marginTop: 8, fontSize: 14, color: 'var(--fg-muted)' }}>
          Édition 2026 · Concours France · Clôture des inscriptions{' '}
          <span style={{ color: closeUrgent ? 'var(--burgundy-800)' : 'var(--fg)', fontWeight: closeUrgent ? 600 : 500 }}>
            dans {daysToClose} jours
          </span>
        </div>
      </div>

      {/* Bandeau paiement en attente */}
      {hasUrgentAction && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20,
          background: '#fdf0f3',
          border: '1.5px solid #f0b8c8',
          borderRadius: 14,
          padding: '20px 28px',
          marginBottom: 28,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'var(--burgundy-800)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon.AlertTriangle size={22}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--burgundy-900)', marginBottom: 4 }}>
              Paiement en attente
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--burgundy-700)' }}>
              Votre dossier <strong style={{ fontVariantNumeric: 'tabular-nums' }}>INS-2026-0184</strong> est en attente de paiement.
              Réglez avant la clôture pour valider votre participation.
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => onNavigate('p-inscription')} style={{ whiteSpace: 'nowrap' }}>
            Payer maintenant <Icon.ArrowRight size={15}/>
          </button>
        </div>
      )}

      {/* 2 cards concours côte à côte */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

        {/* Concours France — ACTIF */}
        <div className="card" style={{
          padding: 28,
          border: '2px solid var(--burgundy-200)',
          background: 'linear-gradient(135deg, #fff 60%, #fdf4f7 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'var(--burgundy-800)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon.Trophy size={26}/>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
              background: '#dcfce7', color: '#15803d',
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>Inscriptions ouvertes</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Concours France
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 20 }}>
            Concours des Grands Vins de France · Édition 2026
          </div>
          {/* Statut inscription */}
          <div style={{
            background: 'var(--burgundy-50)', borderRadius: 10, padding: '12px 16px', marginBottom: 20,
          }}>
            <div style={{ fontSize: 12, color: 'var(--burgundy-700)', fontWeight: 500, marginBottom: 4 }}>Votre dossier en cours</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>INS-2026-0184</span>
              <StatusBadge status="valide"/>
              <span style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginLeft: 'auto' }}>8 échantillons · 480 €</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12.5, color: 'var(--burgundy-800)', fontWeight: 500 }}>
              <Icon.Clock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }}/>
              Clôture dans <strong>12 jours</strong>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('p-inscriptions')}>
              Voir mon dossier <Icon.ArrowRight size={12}/>
            </button>
          </div>
        </div>

        {/* Concours Monde — FERMÉ / à venir */}
        <div className="card" style={{
          padding: 28,
          border: '1px solid var(--border)',
          background: 'var(--slate-50)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'var(--slate-300)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon.Globe size={26}/>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
              background: 'var(--slate-200)', color: 'var(--slate-500)',
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>Inscriptions fermées</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Concours Monde
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-subtle)', marginBottom: 20 }}>
            Concours des Grands Vins du Monde · Édition 2027
          </div>
          {/* Date d'ouverture */}
          <div style={{
            background: 'var(--slate-100)', borderRadius: 10, padding: '16px 20px', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--slate-200)', color: 'var(--slate-500)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon.Calendar size={18}/>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--slate-500)', fontWeight: 500, marginBottom: 2 }}>
                Ouverture des inscriptions
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-muted)' }}>
                15 septembre 2026
              </div>
            </div>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--slate-400)', textAlign: 'right' }}>
            dans environ 3 mois
          </div>
        </div>
      </div>

      {/* Mes inscriptions en cours */}
      <section style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: 'var(--fg)', letterSpacing: '-0.01em' }}>
              Mes inscriptions en cours
            </h2>
            <button onClick={() => onNavigate('p-inscriptions')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12.5, color: 'var(--burgundy-800)', fontWeight: 500,
              fontFamily: 'inherit', padding: 0,
            }}>
              Voir tout →
            </button>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('p-inscription')}>
            <Icon.Plus size={13}/> Nouvelle inscription
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Concours</th>
                <th>Dossier</th>
                <th className="num">Échantillons</th>
                <th className="num">Montant</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[
                { concours: 'Concours France', dossier: 'INS-2026-0184', ech: 8, montant: '480 €', status: 'valide' },
                { concours: 'Concours Monde',  dossier: 'INS-2026-0021', ech: 3, montant: '180 €', status: 'brouillon' },
              ].map((r, i) => (
                <tr key={i} style={{ cursor: 'pointer' }} onClick={() => onNavigate(r.status === 'brouillon' ? 'p-inscription' : 'p-inscriptions')}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 7,
                        background: r.concours.includes('Monde') ? '#eef4ff' : 'var(--burgundy-50)',
                        color: r.concours.includes('Monde') ? '#1e40af' : 'var(--burgundy-800)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {r.concours.includes('Monde') ? <Icon.Globe size={14}/> : <Icon.Trophy size={14}/>}
                      </div>
                      <span style={{ fontWeight: 500 }}>{r.concours}</span>
                    </div>
                  </td>
                  <td className="tnum muted">{r.dossier}</td>
                  <td className="num tnum">{r.ech}</td>
                  <td className="num tnum" style={{ fontWeight: 500 }}>{r.montant}</td>
                  <td><StatusBadge status={r.status}/></td>
                  <td style={{ textAlign: 'right', width: 32 }}>
                    <Icon.ChevronRight size={14} style={{ color: 'var(--fg-subtle)' }}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

// Carte KPI horizontale dédiée au producteur (label + valeur + sub + CTA optionnel)
const PKpi = ({ label, value, sub, cta }) => (
  <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
    <div className="display" style={{ fontSize: 24, fontWeight: 500, color: 'var(--fg)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{value}</div>
    <div style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>{sub}</div>
    {cta && (
      <button onClick={cta.onClick} style={{
        marginTop: 8,
        alignSelf: 'flex-start',
        background: 'none', border: 'none', padding: 0,
        cursor: 'pointer',
        fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
        color: 'var(--burgundy-800)',
        display: 'inline-flex', alignItems: 'center', gap: 4,
      }}>
        {cta.label} <Icon.ArrowRight size={13}/>
      </button>
    )}
  </div>
);

// Modale de duplication d'inscription
const DuplicateInscriptionModal = ({ source, onClose, onConfirm }) => {
  const [target, setTarget] = React.useState('france-2027');
  const targets = [
    { id: 'france-2027', label: 'Concours France 2027', sub: "Inscriptions ouvertes jusqu'au 15 mai 2027", icon: <Icon.Trophy size={14}/>, color: 'var(--burgundy-800)', bg: 'var(--burgundy-50)' },
    { id: 'monde-2026',  label: 'Concours Monde 2026',  sub: "Inscriptions ouvertes jusqu'au 30 juin 2026", icon: <Icon.Globe size={14}/>,  color: '#1e40af',           bg: '#eef4ff' },
  ];

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
        width: '100%', maxWidth: 520,
        animation: 'modalIn .2s ease-out',
      }}>
        <div style={{ padding: '22px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <div className="display" style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.02em' }}>Dupliquer ce dossier</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>
              Reprise des informations du domaine et des échantillons de <span className="tnum" style={{ color: 'var(--fg)' }}>{source?.dossier}</span>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Vers quel concours&nbsp;?
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {targets.map(t => {
              const isSelected = target === t.id;
              return (
                <label key={t.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px',
                  border: '1px solid ' + (isSelected ? 'var(--burgundy-800)' : 'var(--border)'),
                  borderRadius: 10,
                  cursor: 'pointer',
                  background: isSelected ? 'var(--burgundy-50)' : 'var(--surface)',
                  transition: 'all .12s',
                }}>
                  <input type="radio" name="target" value={t.id}
                    checked={isSelected}
                    onChange={() => setTarget(t.id)}
                    style={{ accentColor: 'var(--burgundy-800)', margin: 0 }}/>
                  <div style={{
                    width: 30, height: 30, borderRadius: 7,
                    background: t.bg, color: t.color,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>{t.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{t.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 1 }}>{t.sub}</div>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Récap des éléments dupliqués */}
          <div style={{ marginTop: 18, padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 500, marginBottom: 8 }}>
              Ce qui sera repris du dossier {source?.dossier}&nbsp;:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <DupRow yes label="Informations du domaine et contacts"/>
              <DupRow yes label={`Échantillons (${source?.ech || 8} cuvées, appellations, millésimes…)`}/>
              <DupRow label="Documents (analyses, DREV) — à re-téléverser"/>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 24px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} className="btn btn-outline">Annuler</button>
          <button onClick={() => onConfirm(target)} className="btn btn-primary">
            Dupliquer <Icon.ArrowRight size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
};

const DupRow = ({ yes, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
    <div style={{
      width: 18, height: 18, borderRadius: '50%',
      background: yes ? 'var(--success-bg)' : 'var(--slate-100)',
      color: yes ? '#166534' : 'var(--fg-subtle)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {yes ? <Icon.Check size={11}/> : <Icon.X size={11}/>}
    </div>
    <span style={{ color: yes ? 'var(--fg)' : 'var(--fg-muted)' }}>{label}</span>
  </div>
);

// Menu kebab (⋯) avec actions sur ligne
const RowMenu = ({ items }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();
  React.useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} style={{
        width: 28, height: 28, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-100)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 32, zIndex: 10,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          boxShadow: 'var(--shadow-md)',
          minWidth: 200,
          padding: 4,
          animation: 'slideDown .15s ease-out',
        }}>
          {items.map((it, i) => it === 'divider' ? (
            <div key={i} style={{ height: 1, background: 'var(--border)', margin: '4px 0' }}/>
          ) : (
            <button key={i} onClick={(e) => { e.stopPropagation(); setOpen(false); it.onClick(); }} style={{
              width: '100%',
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13,
              color: it.danger ? 'var(--danger)' : 'var(--fg)',
              borderRadius: 6, textAlign: 'left',
            }}
            onMouseEnter={e => e.currentTarget.style.background = it.danger ? '#fef2f2' : 'var(--slate-100)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {it.icon}{it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
const ProducteurInscriptionDetail = ({ inscription, onBack, onDuplicate }) => {
  const ins = inscription || {
    concours: 'Concours France', edition: '2026', dossier: 'INS-2026-0184',
    ech: 8, montant: 480, status: 'soumis', date: '03 juin 2026',
  };
  const [tab, setTab] = React.useState('dossier');

  // Mapping statut → étape EN COURS (les étapes < currentStep sont validées en vert)
  const stepByStatus = { 'brouillon': -1, 'soumis': 1, 'valide': 2, 'paye': 3, 'rejete': 1 };
  let currentStep = stepByStatus[ins.status] ?? 0;
  const isRejected = ins.status === 'rejete';
  const resultsPublished = ins.status === 'paye' && ins.edition !== '2026'; // démo
  if (resultsPublished) currentStep = 4; // tout est validé, plus rien en cours

  const tlSteps = [
    { id: 0, label: 'Soumis',    icon: <Icon.Upload size={13}/> },
    { id: 1, label: 'Validé',    icon: <Icon.Check size={13}/> },
    { id: 2, label: 'Payé',      icon: <Icon.CreditCard size={13}/> },
    { id: 3, label: 'Résultats', icon: <Icon.Trophy size={13}/> },
  ];

  const statusLabel = {
    'brouillon': { label: 'Brouillon', cls: 'badge' },
    'soumis':    { label: 'Soumis',    cls: 'badge badge-info' },
    'valide':    { label: 'Validé',    cls: 'badge badge-success' },
    'paye':      { label: 'Payé',      cls: 'badge badge-success' },
    'rejete':    { label: 'Rejeté',    cls: 'badge badge-danger' },
  }[ins.status] || { label: ins.status, cls: 'badge' };

  const echantillons = [
    { n: 1, nom: 'Vieilles Vignes',         appell: 'Mâcon-Villages', mil: 2024, doc: 'complet' },
    { n: 2, nom: 'Cuvée Tradition',          appell: 'Mâcon-Villages', mil: 2024, doc: 'complet' },
    { n: 3, nom: 'Saint-Véran Le Haut',      appell: 'Saint-Véran',    mil: 2023, doc: 'complet' },
    { n: 4, nom: 'Clos des Trois Pierres',   appell: 'Mâcon-Villages', mil: 2024, doc: 'complet' },
    { n: 5, nom: 'Réserve du Domaine',       appell: 'Pouilly-Fuissé', mil: 2023, doc: 'complet' },
    { n: 6, nom: 'Cuvée Marie-Anne',         appell: 'Mâcon-Villages', mil: 2024, doc: 'complet' },
    { n: 7, nom: "L'Authentique Rouge",      appell: 'Mâcon-Rouge',    mil: 2023, doc: 'complet' },
    { n: 8, nom: 'Les Crays Réserve',        appell: 'Pouilly-Fuissé', mil: 2024, doc: 'complet' },
  ];

  return (
    <div>
      {/* Header */}
      <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ marginLeft: -10, marginBottom: 16 }}>
        <Icon.ChevronLeft size={14}/> Mes inscriptions
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 28 }}>
        <div>
          <h1 className="display" style={{ fontSize: 28, fontWeight: 500, margin: 0, letterSpacing: '-0.025em' }}>
            {ins.concours} {ins.edition}
          </h1>
          <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 6 }}>
            Dossier <span className="tnum" style={{ color: 'var(--fg)' }}>{ins.dossier}</span> · Soumis le {ins.date}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onDuplicate && (
            <button onClick={onDuplicate} className="btn btn-outline btn-sm">
              <Icon.Copy size={13}/> Dupliquer
            </button>
          )}
          <span className={statusLabel.cls} style={{ fontSize: 13, padding: '4px 12px' }}>
            <span className="badge-dot"/>
            {statusLabel.label}
          </span>
        </div>
      </div>

      {/* Timeline horizontale */}
      <div className="card" style={{ padding: '24px 28px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {tlSteps.map((s, i) => {
            const isPast    = i < currentStep && !isRejected;
            const isCurrent = i === currentStep && !isRejected;
            const isReject  = isRejected && i === currentStep;
            const isFuture  = i > currentStep || (isRejected && i > currentStep);

            let bg, fg, ringColor;
            if (isPast)        { bg = 'var(--success)';       fg = '#fff';                ringColor = 'var(--success)'; }
            else if (isReject) { bg = 'var(--danger)';        fg = '#fff';                ringColor = 'var(--danger)'; }
            else if (isCurrent){ bg = 'var(--burgundy-800)';  fg = '#fff';                ringColor = 'var(--burgundy-800)'; }
            else               { bg = 'var(--surface)';       fg = 'var(--fg-subtle)';    ringColor = 'var(--border)'; }

            return (
              <React.Fragment key={s.id}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: bg, color: fg,
                    border: isFuture ? '1px solid ' + ringColor : 'none',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 600,
                  }}>
                    {isPast ? <Icon.Check size={14}/> : s.icon}
                  </div>
                  <div style={{
                    fontSize: 12, fontWeight: isCurrent || isReject ? 600 : 500,
                    color: isPast ? 'var(--success)' : (isCurrent ? 'var(--burgundy-800)' : (isReject ? 'var(--danger)' : 'var(--fg-subtle)')),
                  }}>
                    {isReject ? 'Rejeté' : s.label}
                  </div>
                </div>
                {i < tlSteps.length - 1 && (
                  <div style={{
                    flex: 1, height: 2, margin: '0 8px',
                    background: i < currentStep && !isRejected ? 'var(--success)' : 'var(--border)',
                    transform: 'translateY(-10px)',
                  }}/>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
        {[
          { id: 'dossier',   label: 'Mon dossier' },
          { id: 'documents', label: 'Documents' },
          { id: 'suivi',     label: 'Suivi' },
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
            }}>
              {t.label}
              {isActive && (
                <span style={{ position: 'absolute', left: 12, right: 12, bottom: -1, height: 2, background: 'var(--burgundy-800)' }}/>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === 'dossier' && (
        <div className="fade-in">
          {/* Bloc infos concours */}
          <div className="card" style={{ marginBottom: 16, padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) auto', gap: 24, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Échantillons</div>
                <div className="tnum" style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>{ins.ech}</div>
              </div>
              <div>
                <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Montant payé</div>
                <div className="tnum" style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>{(ins.montant * 1.2).toFixed(2).replace('.', ',')} € <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 400 }}>TTC</span></div>
              </div>
              <div>
                <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Référence paiement</div>
                <div className="tnum" style={{ fontSize: 14, fontWeight: 500, marginTop: 8 }}>PAY-2026-184022</div>
              </div>
              <button className="btn btn-outline">
                <Icon.Download size={14}/> Télécharger la facture
              </button>
            </div>
          </div>

          {/* Liste échantillons lecture seule */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Échantillons soumis</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>Lecture seule · dossier verrouillé depuis la soumission</div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 48 }}>#</th>
                  <th>Cuvée</th>
                  <th>Appellation</th>
                  <th>Millésime</th>
                  <th>Documents</th>
                </tr>
              </thead>
              <tbody>
                {echantillons.slice(0, ins.ech).map(e => (
                  <tr key={e.n}>
                    <td className="tnum muted">#{e.n}</td>
                    <td style={{ fontWeight: 500 }}>{e.nom}</td>
                    <td>{e.appell}</td>
                    <td className="tnum">{e.mil}</td>
                    <td><span className="badge badge-success"><Icon.Check size={11}/> Complet</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'documents' && (
        <div className="fade-in">
          {[
            { name: "Rapports d'analyses œnologiques", sub: 'PDF du laboratoire — un par cuvée', count: ins.ech, total: ins.ech },
            { name: 'Revendications AOC/IGP (DREV)',    sub: 'Document officiel ODG',           count: ins.ech, total: ins.ech },
            { name: "Bulletin d'inscription signé",     sub: 'PDF · signature électronique',    count: 1, total: 1 },
          ].map((d, i) => (
            <div key={i} className="card" style={{ padding: 20, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'var(--success-bg)', color: '#166534',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon.FileText size={20}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 500 }}>{d.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>{d.sub}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
                  {Array.from({ length: d.total }).map((_, k) => (
                    <div key={k} style={{ width: 28, height: 4, borderRadius: 999, background: 'var(--success)' }}/>
                  ))}
                  <span className="muted tnum" style={{ fontSize: 12, marginLeft: 8 }}>{d.count}/{d.total}</span>
                </div>
              </div>
              <button className="btn btn-outline btn-sm"><Icon.Download size={13}/> Télécharger</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'suivi' && (
        <div className="fade-in">
          <div className="card" style={{ padding: '8px 24px' }}>
            {[
              { date: '05 juin · 09h15', label: 'Dossier validé',     sub: 'Validé par le secrétariat du concours', state: 'done' },
              { date: '03 juin · 14h23', label: 'Paiement confirmé',  sub: 'Carte bancaire · PAY-2026-184022',      state: 'done' },
              { date: '03 juin · 14h22', label: 'Dossier soumis',     sub: '8 échantillons · 13 documents joints', state: 'done' },
              { date: '02 juin · 16h08', label: 'Dossier complété',   sub: 'Dernier document téléversé',             state: 'done' },
              { date: '28 mai · 10h40',  label: 'Dossier créé',       sub: 'Inscription démarrée',                   state: 'done' },
            ].map((ev, i, arr) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '14px 0',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                position: 'relative',
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: i === 0 ? 'var(--burgundy-800)' : 'var(--success)',
                  flexShrink: 0, marginTop: 6,
                  boxShadow: i === 0 ? '0 0 0 4px var(--burgundy-50)' : 'none',
                }}/>
                {i < arr.length - 1 && (
                  <div style={{
                    position: 'absolute', left: 4, top: 22, bottom: -6,
                    width: 2, background: 'var(--border)',
                  }}/>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{ev.label}</div>
                    <div className="tnum muted" style={{ fontSize: 12 }}>{ev.date}</div>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>{ev.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {isRejected && (
            <div className="card" style={{ marginTop: 16, padding: 20, background: '#fef2f2', borderColor: '#fecaca' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <Icon.AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }}/>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#7f1d1d' }}>Motif de rejet</div>
                  <div style={{ fontSize: 13, color: '#991b1b', marginTop: 6 }}>
                    Bulletin d'analyses œnologiques manquant pour 2 cuvées sur les 8 soumises. Vous pouvez demander une dérogation pour fournir les documents après la clôture.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bloc action contextuel */}
      {isRejected && (
        <div className="card" style={{ marginTop: 24, padding: 20, display: 'flex', alignItems: 'center', gap: 16, background: 'var(--surface-2)' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.ShieldCheck size={20}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Une dérogation est possible</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>Demandez à transmettre les documents manquants après la clôture.</div>
          </div>
          <button className="btn btn-primary">Faire une demande de dérogation <Icon.ArrowRight size={14}/></button>
        </div>
      )}
      {resultsPublished && (
        <div className="card" style={{ marginTop: 24, padding: 20, display: 'flex', alignItems: 'center', gap: 16, background: 'var(--surface-2)' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--gold-100)', color: 'var(--gold-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.Medal size={20}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Les résultats sont disponibles</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>Consultez votre palmarès et téléchargez vos diplômes.</div>
          </div>
          <button className="btn btn-primary">Voir mes médailles <Icon.ArrowRight size={14}/></button>
        </div>
      )}
    </div>
  );
};
const InscriptionConfirmation = ({ nbVins, payMethod = 'carte', onExit, onViewDossier }) => {
  const ttc = (nbVins * 60 * 1.2).toFixed(2).replace('.', ',');
  const ref = 'INS-2026-0184';
  const payRef = 'PAY-2026-' + Math.floor(100000 + Math.random() * 900000);

  // Variante Virement
  if (payMethod === 'virement') {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--bg-app)', padding: '64px 24px 80px' }}>
        <div className="fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
          <button onClick={onExit} className="btn btn-ghost btn-sm" style={{ marginLeft: -10, marginBottom: 32 }}>
            <Icon.ChevronLeft size={14}/> Retour à mes inscriptions
          </button>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--success-bg)', color: '#16a34a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, border: '6px solid #d1fae5' }}>
              <Icon.Check size={32}/>
            </div>
            <h1 className="display" style={{ fontSize: 32, fontWeight: 500, margin: 0, letterSpacing: '-0.025em' }}>Votre dossier a été soumis !</h1>
            <div style={{ marginTop: 10, fontSize: 14.5, color: 'var(--fg-muted)' }}>
              Dossier <span className="tnum" style={{ color: 'var(--fg)', fontWeight: 500 }}>{ref}</span> · En attente de réception du virement
            </div>
          </div>

          {/* RIB */}
          <div className="card" style={{ padding: 24, marginBottom: 16, borderColor: '#bfdbfe', background: '#eff6ff' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1e40af', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🏦</span> Coordonnées bancaires pour votre virement
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
              {[
                { label: 'Titulaire', value: 'Comité des Salons et Concours de Mâcon' },
                { label: 'Banque', value: 'Crédit Agricole Centre-Est' },
                { label: 'IBAN', value: 'FR76 1234 5678 9012 3456 7890 123', mono: true },
                { label: 'BIC', value: 'AGRIFRPP', mono: true },
              ].map(({ label, value, mono }) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: mono ? 'Menlo, monospace' : 'inherit', marginTop: 2, color: '#1e3a8a' }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(255,255,255,0.7)', borderRadius: 8, fontSize: 12.5, color: '#1e40af' }}>
              ⚠️ Indiquez impérativement la référence <strong className="tnum">{ref}</strong> dans le libellé de votre virement
            </div>
          </div>

          {/* Instructions */}
          <div className="card" style={{ padding: 22, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Et maintenant ?</div>
            {[
              { icon: <Icon.Check size={16}/>, label: 'Dossier soumis',               meta: 'Statut actuel', current: true },
              { icon: <Icon.CreditCard size={16}/>, label: 'Effectuez votre virement',      meta: 'Dans les 10 jours ouvrés' },
              { icon: <Icon.Check size={16}/>, label: 'Confirmation de réception',    meta: 'Par email dès validation admin' },
              { icon: <Icon.Trophy size={16}/>, label: 'Résultats publiés',           meta: 'Palmarès · 02 juin 2026' },
            ].map((s, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', position: 'relative' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: s.current ? 'var(--burgundy-800)' : 'var(--surface)', border: s.current ? 'none' : '1px solid var(--border)', color: s.current ? '#fff' : 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
                {i < arr.length - 1 && <div style={{ position: 'absolute', left: 15, top: 44, bottom: -6, width: 2, background: 'var(--border)' }}/>}
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: s.current ? 600 : 500 }}>{s.label}</div>
                  <div style={{ fontSize: 12.5, color: s.current ? 'var(--burgundy-800)' : 'var(--fg-muted)', marginTop: 2, fontWeight: s.current ? 500 : 400 }}>{s.meta}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline btn-lg" style={{ flex: 1 }}><Icon.Download size={14}/> Télécharger le récapitulatif</button>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={onViewDossier}>Retour à mon espace <Icon.ArrowRight size={14}/></button>
          </div>
        </div>
      </div>
    );
  }

  // Variante Chèque
  if (payMethod === 'cheque') {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--bg-app)', padding: '64px 24px 80px' }}>
        <div className="fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
          <button onClick={onExit} className="btn btn-ghost btn-sm" style={{ marginLeft: -10, marginBottom: 32 }}>
            <Icon.ChevronLeft size={14}/> Retour à mes inscriptions
          </button>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--success-bg)', color: '#16a34a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, border: '6px solid #d1fae5' }}>
              <Icon.Check size={32}/>
            </div>
            <h1 className="display" style={{ fontSize: 32, fontWeight: 500, margin: 0, letterSpacing: '-0.025em' }}>Votre dossier a été soumis !</h1>
            <div style={{ marginTop: 10, fontSize: 14.5, color: 'var(--fg-muted)' }}>
              Dossier <span className="tnum" style={{ color: 'var(--fg)', fontWeight: 500 }}>{ref}</span> · En attente de réception du chèque
            </div>
          </div>

          {/* Adresse chèque */}
          <div className="card" style={{ padding: 24, marginBottom: 16, borderColor: '#d1fae5', background: '#f0fdf4' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#166534', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📄</span> Instructions pour votre chèque
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>À l'ordre de</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2, color: '#14532d' }}>Comité des Salons et Concours de Mâcon</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Montant à libeller</div>
                <div className="tnum" style={{ fontSize: 18, fontWeight: 700, marginTop: 2, color: '#14532d' }}>{ttc} €</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 4 }}>Adresse d'envoi</div>
              <div style={{ fontSize: 13, color: '#14532d', lineHeight: 1.6 }}>
                Comité des Salons et Concours de Mâcon<br/>
                225 Quai des Marans<br/>
                71000 Mâcon
              </div>
            </div>
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(255,255,255,0.7)', borderRadius: 8, fontSize: 12.5, color: '#166534' }}>
              ⚠️ Notez impérativement la référence <strong className="tnum">{ref}</strong> au dos de votre chèque
            </div>
          </div>

          {/* Instructions timeline */}
          <div className="card" style={{ padding: 22, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Et maintenant ?</div>
            {[
              { icon: <Icon.Check size={16}/>, label: 'Dossier soumis',               meta: 'Statut actuel', current: true },
              { icon: <Icon.Mail size={16}/>,  label: 'Envoyez votre chèque',         meta: 'Dans les 10 jours ouvrés' },
              { icon: <Icon.Check size={16}/>, label: 'Confirmation de réception',    meta: 'Par email dès validation admin' },
              { icon: <Icon.Trophy size={16}/>, label: 'Résultats publiés',           meta: 'Palmarès · 02 juin 2026' },
            ].map((s, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', position: 'relative' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: s.current ? 'var(--burgundy-800)' : 'var(--surface)', border: s.current ? 'none' : '1px solid var(--border)', color: s.current ? '#fff' : 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
                {i < arr.length - 1 && <div style={{ position: 'absolute', left: 15, top: 44, bottom: -6, width: 2, background: 'var(--border)' }}/>}
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: s.current ? 600 : 500 }}>{s.label}</div>
                  <div style={{ fontSize: 12.5, color: s.current ? 'var(--burgundy-800)' : 'var(--fg-muted)', marginTop: 2, fontWeight: s.current ? 500 : 400 }}>{s.meta}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline btn-lg" style={{ flex: 1 }}><Icon.Download size={14}/> Télécharger le récapitulatif</button>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={onViewDossier}>Retour à mon espace <Icon.ArrowRight size={14}/></button>
          </div>
        </div>
      </div>
    );
  }

  // Variante Carte (existante)
  const steps = [
    { state: 'current', icon: <Icon.Eye size={16}/>,    label: "Votre dossier est en cours d'examen",   meta: "Statut actuel" },
    { state: 'pending', icon: <Icon.Mail size={16}/>,   label: "Vous recevrez un email de validation",  meta: "Sous 5 jours ouvrés" },
    { state: 'pending', icon: <Icon.Trophy size={16}/>, label: "Les résultats seront publiés",          meta: "Palmarès · 02 juin 2026" },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--bg-app)', padding: '64px 24px 80px' }}>
      <div className="fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 32 }}>
          <button onClick={onExit} className="btn btn-ghost btn-sm" style={{ marginLeft: -10 }}>
            <Icon.ChevronLeft size={14}/> Retour à mes inscriptions
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--success-bg)', color: '#16a34a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, border: '6px solid #d1fae5' }}>
            <Icon.Check size={32}/>
          </div>
          <h1 className="display" style={{ fontSize: 32, fontWeight: 500, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>
            Votre dossier a bien été soumis
          </h1>
          <div style={{ marginTop: 10, fontSize: 14.5, color: 'var(--fg-muted)' }}>
            Paiement confirmé · Dossier <span className="tnum" style={{ color: 'var(--fg)', fontWeight: 500 }}>{ref}</span>
          </div>
        </div>

        <div className="card" style={{ padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon.Trophy size={20}/>
            </div>
            <div style={{ flex: 1 }}>
              <div className="display" style={{ fontSize: 17, fontWeight: 500, color: 'var(--fg)' }}>Concours France 2026</div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2 }}>Édition du 24 mai · Mâcon</div>
            </div>
            <span className="badge badge-success"><Icon.Check size={11}/> Soumis</span>
          </div>

          <div style={{ paddingTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Échantillons</div>
              <div className="tnum" style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{nbVins}</div>
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Montant payé</div>
              <div className="tnum" style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{ttc} € <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 400 }}>TTC</span></div>
            </div>
            <div style={{ gridColumn: 'span 2', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Référence paiement</div>
              <div className="tnum" style={{ fontSize: 13.5, fontWeight: 500, marginTop: 4 }}>{payRef}</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px', letterSpacing: '-0.01em' }}>Et maintenant ?</h2>
          <div className="card" style={{ padding: '8px 22px' }}>
            {steps.map((s, i) => {
              const isCurrent = s.state === 'current';
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', borderBottom: i < steps.length - 1 ? '1px solid var(--border)' : 'none', position: 'relative' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: isCurrent ? 'var(--burgundy-800)' : 'var(--surface)', border: isCurrent ? 'none' : '1px solid var(--border)', color: isCurrent ? '#fff' : 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 1 }}>
                    {s.icon}
                  </div>
                  {i < steps.length - 1 && <div style={{ position: 'absolute', left: 15, top: 46, bottom: -6, width: 2, background: 'var(--border)' }}/>}
                  <div style={{ flex: 1, paddingTop: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: isCurrent ? 600 : 500, color: isCurrent ? 'var(--fg)' : 'var(--slate-700)' }}>{s.label}</div>
                    <div style={{ fontSize: 12.5, color: isCurrent ? 'var(--burgundy-800)' : 'var(--fg-muted)', marginTop: 2, fontWeight: isCurrent ? 500 : 400 }}>{s.meta}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
          <button className="btn btn-outline btn-lg" style={{ flex: 1 }}><Icon.Download size={14}/> Télécharger la facture</button>
          <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={onViewDossier}>Voir mon dossier <Icon.ArrowRight size={14}/></button>
        </div>

        <div style={{ fontSize: 13, color: 'var(--fg-muted)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Icon.Mail size={14} style={{ color: 'var(--fg-subtle)' }}/>
          Un email de confirmation a été envoyé à <span style={{ color: 'var(--fg)' }}>contact@domaine-chevaliere.fr</span>
        </div>
      </div>
    </div>
  );
};

// 4-step immersive wizard
const wizardSteps = [
  { id: 1, label: 'Mes infos', sub: 'Coordonnées & contacts' },
  { id: 2, label: 'Mes vins', sub: 'Échantillons soumis' },
  { id: 3, label: 'Documents', sub: 'Analyses & DREV' },
  { id: 4, label: 'Récapitulatif', sub: 'Validation & paiement' },
];

const ProducteurInscription = ({ onExit }) => {
  const [step, setStep] = React.useState(2);
  const [showVinForm, setShowVinForm] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [payMethod, setPayMethod] = React.useState('carte');
  const [vins, setVins] = React.useState([
    { name: 'Les Crays Vieilles Vignes', appell: 'Pouilly-Fuissé', mil: 2024, vol: '750 ml', cep: 'Chardonnay 100%' },
    { name: 'Cuvée Tradition', appell: 'Mâcon-Villages', mil: 2024, vol: '750 ml', cep: 'Chardonnay 100%' },
    { name: 'Saint-Véran Le Haut', appell: 'Saint-Véran', mil: 2023, vol: '750 ml', cep: 'Chardonnay 100%' },
    { name: 'Clos des Trois Pierres', appell: 'Mâcon-Villages', mil: 2024, vol: '750 ml', cep: 'Chardonnay 100%' },
    { name: 'Réserve du Domaine', appell: 'Pouilly-Fuissé', mil: 2023, vol: '750 ml', cep: 'Chardonnay 100%' },
    { name: 'Cuvée Marie-Anne', appell: 'Mâcon-Villages', mil: 2024, vol: '750 ml', cep: 'Chardonnay 100%' },
    { name: 'L\'Authentique Rouge', appell: 'Mâcon-Rouge', mil: 2023, vol: '750 ml', cep: 'Gamay 100%' },
  ]);

  if (submitted) {
    return <InscriptionConfirmation nbVins={vins.length} payMethod={payMethod} onExit={onExit} onViewDossier={onExit}/>;
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'grid', gridTemplateColumns: '320px 1fr', background: 'var(--bg-app)' }}>
      {/* Wizard rail */}
      <aside style={{ background: 'var(--surface-2)', borderRight: '1px solid var(--border)', padding: '32px 24px', position: 'sticky', top: 64, alignSelf: 'flex-start', height: 'calc(100vh - 64px)' }}>
        <button onClick={onExit} className="btn btn-ghost btn-sm" style={{ marginLeft: -8, marginBottom: 24 }}>
          <Icon.ChevronLeft size={14}/> Quitter (sauvegarde auto)
        </button>

        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--burgundy-800)', fontWeight: 600 }}>Inscription concours</div>
        <h2 className="display" style={{ fontSize: 24, fontWeight: 500, marginTop: 8, letterSpacing: '-0.02em', lineHeight: 1.2 }}>France 2026</h2>
        <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 4 }}>Domaine des 3 Pierres</div>

        <div style={{ marginTop: 32 }}>
          {wizardSteps.map((s, i) => {
            const done = s.id < step, active = s.id === step;
            return (
              <button key={s.id} onClick={() => setStep(s.id)} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                width: '100%',
                padding: '12px 12px',
                borderRadius: 10,
                background: active ? 'var(--burgundy-50)' : 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                position: 'relative',
                marginBottom: 2,
              }}>
                {i < wizardSteps.length - 1 && (
                  <div style={{ position: 'absolute', left: 25, top: 44, bottom: -10, width: 2, background: done ? 'var(--burgundy-800)' : 'var(--border)' }}/>
                )}
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'var(--burgundy-800)' : active ? 'var(--burgundy-800)' : 'var(--surface)',
                  color: (done || active) ? '#fff' : 'var(--fg-muted)',
                  border: (done || active) ? 'none' : '1px solid var(--border)',
                  fontSize: 12, fontWeight: 600, flexShrink: 0,
                  position: 'relative', zIndex: 1,
                }}>
                  {done ? <Icon.Check size={14}/> : s.id}
                </div>
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <div style={{ fontSize: 13.5, fontWeight: active ? 600 : 500, color: active ? 'var(--burgundy-800)' : done ? 'var(--fg)' : 'var(--fg-muted)' }}>{s.label}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 2 }}>{s.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 32, fontSize: 12, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon.Check size={12} style={{ color: 'var(--success)' }}/> Sauvegarde automatique · il y a 24 s
        </div>
      </aside>

      {/* Wizard content */}
      <div style={{ padding: '40px 56px 80px', maxWidth: 920, width: '100%' }}>
        {step === 1 && <WizardStep1/>}
        {step === 2 && <WizardStep2 vins={vins} setVins={setVins} showForm={showVinForm} setShowForm={setShowVinForm}/>}
        {step === 3 && <WizardStep3/>}
        {step === 4 && <WizardStep4 nbVins={vins.length} payMethod={payMethod} setPayMethod={setPayMethod}/>}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="btn btn-outline">
            <Icon.ChevronLeft size={14}/> Étape précédente
          </button>
          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} className="btn btn-primary btn-lg">
              Continuer · {wizardSteps[step].label} <Icon.ArrowRight size={16}/>
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={() => setSubmitted(true)}>
              {payMethod === 'carte'
                ? <>Valider et payer · {(vins.length * 60 * 1.2).toFixed(2).replace('.', ',')} € <Icon.ArrowRight size={16}/></>
                : <>Soumettre mon dossier <Icon.ArrowRight size={16}/></>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const WizardStep1 = () => (
  <div className="fade-in">
    <div style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--burgundy-800)', fontWeight: 600 }}>Étape 1 sur 4</div>
    <h1 className="display" style={{ fontSize: 36, fontWeight: 500, margin: '8px 0 4px', letterSpacing: '-0.025em' }}>Vos informations</h1>
    <p style={{ fontSize: 14, color: 'var(--fg-muted)', marginBottom: 32 }}>Coordonnées du domaine et contacts inscription &amp; communication.</p>

    <div className="card">
      <div className="card-title" style={{ marginBottom: 16 }}>Identité du domaine</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
        <div className="field"><label className="field-label">Raison sociale</label><input className="input" defaultValue="Domaine des 3 Pierres"/></div>
        <div className="field"><label className="field-label">N° SIRET</label><input className="input tnum" defaultValue="487 219 035 00018"/></div>
        <div className="field" style={{ gridColumn: 'span 2' }}><label className="field-label">Adresse</label><input className="input" defaultValue="Lieu-dit Les Crays, 71960 Vergisson"/></div>
        <div className="field"><label className="field-label">Code APE</label><input className="input" defaultValue="0121Z"/></div>
        <div className="field"><label className="field-label">N° TVA intracommunautaire</label><input className="input tnum" defaultValue="FR42487219035"/></div>
        <div className="field" style={{ gridColumn: 'span 2' }}>
          <label className="field-label">CVI (Code Viti-Identificateur) *
            <span title="Numéro officiel attribué par FranceAgriMer à chaque viticulteur" style={{ marginLeft: 6, cursor: 'help', color: 'var(--fg-muted)', fontSize: 12 }}>ⓘ</span>
          </label>
          <input className="input tnum" placeholder="Ex : 01234567890" defaultValue="08000123456"/>
          <span className="field-hint">Obligatoire · 11 chiffres · attribué par FranceAgriMer</span>
        </div>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
      <ContactCard title="Contact inscription" name="Marie-Anne Dubois" role="Gérante" email="contact@domaine-3-pierres.fr" phone="03 85 35 70 12"/>
      <ContactCard title="Contact communication" name="Thomas Renard" role="Marketing" email="t.renard@domaine-3-pierres.fr" phone="06 14 22 89 03"/>
    </div>

    <div className="card" style={{ marginTop: 16, background: 'var(--burgundy-50)', borderColor: 'var(--burgundy-200)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <Icon.Info size={18} style={{ color: 'var(--burgundy-800)', marginTop: 2 }}/>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--burgundy-900)' }}>Ces informations sont reportées sur votre profil et votre facture</div>
          <div style={{ fontSize: 12.5, color: 'var(--burgundy-800)', marginTop: 4 }}>Toute modification s'applique à vos prochaines inscriptions et commandes.</div>
        </div>
      </div>
    </div>
  </div>
);

const ContactCard = ({ title, name, role, email, phone }) => (
  <div className="card">
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
      <div className="card-title" style={{ fontSize: 14 }}>{title}</div>
      <button className="btn btn-ghost btn-sm"><Icon.Edit size={12}/></button>
    </div>
    <div className="field" style={{ marginBottom: 10 }}><label className="field-label">Nom complet</label><input className="input" defaultValue={name}/></div>
    <div className="field" style={{ marginBottom: 10 }}><label className="field-label">Fonction</label><input className="input" defaultValue={role}/></div>
    <div className="field" style={{ marginBottom: 10 }}><label className="field-label">E-mail</label><input className="input" defaultValue={email}/></div>
    <div className="field"><label className="field-label">Téléphone</label><input className="input tnum" defaultValue={phone}/></div>
  </div>
);

const WizardStep2 = ({ vins, setVins, showForm, setShowForm }) => (
  <div className="fade-in">
    <div style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--burgundy-800)', fontWeight: 600 }}>Étape 2 sur 4</div>
    <h1 className="display" style={{ fontSize: 36, fontWeight: 500, margin: '8px 0 4px', letterSpacing: '-0.025em' }}>Vos échantillons</h1>
    <p style={{ fontSize: 14, color: 'var(--fg-muted)', marginBottom: 24 }}>Ajoutez chaque cuvée que vous souhaitez soumettre. 60 € par échantillon — facturés à la validation.</p>

    {/* Sample summary */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '14px 18px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div><span className="display tnum" style={{ fontSize: 24, fontWeight: 600 }}>{vins.length}</span> <span className="muted" style={{ fontSize: 13 }}>échantillons</span></div>
        <div className="divider" style={{ width: 1, height: 24, margin: 0 }}/>
        <div><span className="tnum" style={{ fontSize: 14, fontWeight: 500 }}>{vins.length * 60} €</span> <span className="muted" style={{ fontSize: 12.5 }}>HT</span></div>
      </div>
      <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm"><Icon.Plus size={14}/> Ajouter un échantillon</button>
    </div>

    {/* Vin form (inline) */}
    {showForm && (
      <div className="card slide-up" style={{ marginBottom: 16, borderColor: 'var(--burgundy-300)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div className="card-title">Nouvel échantillon</div>
            <div className="card-subtitle">Échantillon n°{vins.length + 1} · 22 informations</div>
          </div>
          <button onClick={() => setShowForm(false)} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={14}/></button>
        </div>

        <FieldGroup title="Identification">
          <div className="field" style={{ gridColumn: 'span 2' }}><label className="field-label">Nom de la cuvée *</label><input className="input" placeholder="Ex. Vieilles Vignes"/></div>
          <div className="field"><label className="field-label">Couleur *</label>
            <select className="select"><option>Blanc</option><option>Rouge</option><option>Rosé</option><option>Effervescent</option></select>
          </div>
        </FieldGroup>

        <FieldGroup title="Appellation & origine">
          <div className="field"><label className="field-label">Région *</label>
            <select className="select"><option>Mâconnais</option><option>Beaujolais</option><option>Côte de Beaune</option></select>
          </div>
          <div className="field"><label className="field-label">Appellation (AOC/IGP) *</label>
            <select className="select"><option>Pouilly-Fuissé</option><option>Mâcon-Villages</option><option>Saint-Véran</option></select>
          </div>
          <div className="field"><label className="field-label">Millésime *</label><input className="input tnum" placeholder="2024"/>
            <span className="field-hint">Validé selon les règles de l'appellation</span>
          </div>
        </FieldGroup>

        <FieldGroup title="Cépages">
          <div className="field" style={{ gridColumn: 'span 3' }}>
            <label className="field-label">Encépagement *</label>
            <input className="input" placeholder="Ex. Chardonnay 100% — ou Pinot Noir 80% / Gamay 20%"/>
          </div>
        </FieldGroup>

        <FieldGroup title="Caractéristiques techniques">
          <div className="field"><label className="field-label">Degré (% vol.) *</label><input className="input tnum" placeholder="13.5"/></div>
          <div className="field"><label className="field-label">Sucres résiduels (g/L)</label><input className="input tnum" placeholder="1.8"/></div>
          <div className="field"><label className="field-label">Acidité totale (g/L)</label><input className="input tnum" placeholder="5.4"/></div>
          <div className="field"><label className="field-label">SO₂ total (mg/L)</label><input className="input tnum" placeholder="92"/></div>
          <div className="field"><label className="field-label">Volume bouteille</label>
            <select className="select"><option>750 ml</option><option>375 ml</option><option>1500 ml (Magnum)</option></select>
          </div>
          <div className="field"><label className="field-label">Type de vinification</label>
            <select className="select"><option>Tradition</option><option>Bio</option><option>Biodynamie</option><option>Nature</option></select>
          </div>
        </FieldGroup>

        <FieldGroup title="Lot & cuve">
          <div className="field"><label className="field-label">N° de lot *</label><input className="input" placeholder="L24-0218-A"/></div>
          <div className="field"><label className="field-label">Cuve / contenant</label><input className="input" placeholder="C-12"/></div>
          <div className="field"><label className="field-label">Volume soumis (hL) *</label><input className="input tnum" placeholder="42"/></div>
        </FieldGroup>

        <div className="field" style={{ marginTop: 14 }}>
          <label className="field-label">Notes complémentaires</label>
          <textarea className="textarea" placeholder="Particularités, mentions, allergènes, observations…"/>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <button onClick={() => setShowForm(false)} className="btn btn-outline btn-sm">Annuler</button>
          <button onClick={() => { setVins([...vins, { name: 'Nouveau vin', appell: '—', mil: 2024, vol: '750 ml', cep: '—' }]); setShowForm(false); }} className="btn btn-primary btn-sm">
            <Icon.Check size={13}/> Enregistrer l'échantillon
          </button>
        </div>
      </div>
    )}

    {/* Vins list */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {vins.map((v, i) => (
        <div key={i} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>#{i + 1}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{v.name}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{v.appell} · {v.mil} · {v.cep}</div>
          </div>
          <span className="badge badge-success"><Icon.Check size={11}/> Complet</span>
          <button className="btn btn-icon btn-sm btn-ghost"><Icon.Edit size={13}/></button>
          <button className="btn btn-icon btn-sm btn-ghost" onClick={() => setVins(vins.filter((_, idx) => idx !== i))}><Icon.Trash size={13}/></button>
        </div>
      ))}
    </div>
  </div>
);

const FieldGroup = ({ title, children }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)', marginBottom: 10 }}>{title}</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>{children}</div>
  </div>
);

const WizardStep3 = () => (
  <div className="fade-in">
    <div style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--burgundy-800)', fontWeight: 600 }}>Étape 3 sur 4</div>
    <h1 className="display" style={{ fontSize: 36, fontWeight: 500, margin: '8px 0 4px', letterSpacing: '-0.025em' }}>Documents obligatoires</h1>
    <p style={{ fontSize: 14, color: 'var(--fg-muted)', marginBottom: 32 }}>Bulletins d'analyses et revendications AOC/IGP — un document par échantillon.</p>

    {[
      { name: 'Rapports d\'analyses œnologiques', sub: 'PDF du laboratoire — un par cuvée', count: 7, total: 7 },
      { name: 'Revendications AOC/IGP (DREV)', sub: 'Document officiel ODG', count: 5, total: 7 },
      { name: 'Bulletin d\'inscription signé', sub: 'PDF · scanné ou signature électronique', count: 1, total: 1 },
    ].map((d, i) => (
      <div key={i} className="card" style={{ padding: 20, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: d.count === d.total ? 'var(--success-bg)' : 'var(--warning-bg)', color: d.count === d.total ? '#166534' : '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.FileText size={20}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14.5, fontWeight: 500 }}>{d.name}</div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>{d.sub}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {Array.from({ length: d.total }).map((_, k) => (
              <div key={k} style={{ width: 28, height: 4, borderRadius: 999, background: k < d.count ? 'var(--success)' : 'var(--slate-200)' }}/>
            ))}
            <span className="muted tnum" style={{ fontSize: 12, marginLeft: 8 }}>{d.count}/{d.total}</span>
          </div>
        </div>
        <button className="btn btn-outline btn-sm"><Icon.Upload size={13}/> Téléverser</button>
      </div>
    ))}

    <div className="card" style={{ marginTop: 24, padding: 24, border: '2px dashed var(--border)', textAlign: 'center', background: 'var(--surface-2)' }}>
      <Icon.Upload size={28} style={{ color: 'var(--fg-muted)' }}/>
      <div style={{ fontSize: 14, fontWeight: 500, marginTop: 8 }}>Glissez-déposez tous vos PDFs ici</div>
      <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 4 }}>L'IA détecte automatiquement le type de document et l'associe à la bonne cuvée</div>
    </div>
  </div>
);

const WizardStep4 = ({ nbVins, payMethod, setPayMethod }) => (
  <div className="fade-in">
    <div style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--burgundy-800)', fontWeight: 600 }}>Étape 4 sur 4</div>
    <h1 className="display" style={{ fontSize: 36, fontWeight: 500, margin: '8px 0 4px', letterSpacing: '-0.025em' }}>Récapitulatif &amp; paiement</h1>
    <p style={{ fontSize: 14, color: 'var(--fg-muted)', marginBottom: 32 }}>Vérifiez le contenu de votre dossier avant validation et règlement.</p>

    <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ padding: 20, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="card-title">Concours France 2026</div>
          <div className="card-subtitle">Édition du 24 mai · Mâcon</div>
        </div>
        <span className="badge badge-success"><Icon.Check size={11}/> Dossier complet</span>
      </div>
      <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        <div><div className="muted" style={{ fontSize: 12 }}>Échantillons</div><div className="tnum display" style={{ fontSize: 22, fontWeight: 500 }}>{nbVins}</div></div>
        <div><div className="muted" style={{ fontSize: 12 }}>Documents</div><div className="tnum display" style={{ fontSize: 22, fontWeight: 500 }}>13</div></div>
        <div><div className="muted" style={{ fontSize: 12 }}>Régions</div><div className="display" style={{ fontSize: 22, fontWeight: 500 }}>1</div></div>
      </div>
    </div>

    <div className="card" style={{ padding: 0, marginBottom: 16 }}>
      <table className="table">
        <tbody>
          <tr><td>Échantillons — {nbVins} × 60,00 €</td><td className="num tnum" style={{ fontWeight: 500 }}>{(nbVins * 60).toFixed(2).replace('.', ',')} €</td></tr>
          <tr><td className="muted">TVA</td><td className="num tnum muted">0 % (exonéré)</td></tr>
          <tr style={{ background: 'var(--burgundy-50)' }}>
            <td style={{ fontWeight: 600, color: 'var(--burgundy-900)' }}>Total à régler</td>
            <td className="num tnum display" style={{ fontWeight: 600, fontSize: 18, color: 'var(--burgundy-900)' }}>{(nbVins * 60).toFixed(2).replace('.', ',')} €</td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* Choix méthode de paiement */}
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12, letterSpacing: '-0.01em' }}>Choisissez votre méthode de paiement</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { id: 'carte',    icon: '🔵', label: 'Carte bancaire',   sub: 'Paiement immédiat sécurisé par Paybox · Crédit Agricole Up2Pay' },
          { id: 'virement', icon: '🏦', label: 'Virement bancaire', sub: 'Votre dossier est soumis — paiement confirmé manuellement à réception' },
          { id: 'cheque',   icon: '📄', label: 'Chèque',           sub: 'Votre dossier est soumis — chèque à envoyer par courrier' },
        ].map(m => {
          const selected = payMethod === m.id;
          return (
            <label key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px',
              border: '1px solid ' + (selected ? 'var(--burgundy-800)' : 'var(--border)'),
              background: selected ? 'var(--burgundy-50)' : 'var(--surface)',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'all .12s',
            }}>
              <input type="radio" name="payMethod" value={m.id} checked={selected} onChange={() => setPayMethod(m.id)}
                style={{ accentColor: 'var(--burgundy-800)', width: 16, height: 16 }}/>
              <span style={{ fontSize: 16 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: selected ? 600 : 500, color: selected ? 'var(--burgundy-900)' : 'var(--fg)' }}>{m.label}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{m.sub}</div>
              </div>
            </label>
          );
        })}
      </div>
    </div>

    {(payMethod === 'virement' || payMethod === 'cheque') && (
      <div style={{ padding: '12px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, fontSize: 13, color: '#92400e', marginBottom: 16 }}>
        <Icon.Info size={14} style={{ verticalAlign: -2, marginRight: 6 }}/>
        Votre inscription sera réservée <strong>10 jours</strong> à compter de la soumission. Le paiement doit être reçu dans ce délai pour valider votre dossier.
      </div>
    )}

    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--slate-700)', cursor: 'pointer', padding: 14, border: '1px solid var(--border)', borderRadius: 10 }}>
      <input type="checkbox" defaultChecked style={{ accentColor: 'var(--burgundy-800)', marginTop: 2 }}/>
      <span>J'accepte le règlement du Concours et certifie l'exactitude des informations fournies.
        {payMethod === 'carte' && <> Le paiement est sécurisé par <strong>Paybox</strong> · Crédit Agricole Up2Pay.</>}
      </span>
    </label>
  </div>
);

// Résout l'image d'une médaille selon le concours (france ou monde)
const medalImg = (medal, concours) => {
  if (concours === 'monde') {
    return { or: 'monde-or.webp', argent: 'monde-argent.webp' }[medal] || 'monde-or.webp';
  }
  return { or: 'OR-2025.webp', argent: 'ARGENT-2025.webp', bronze: 'BRONZE-2025.webp' }[medal];
};
const medalLabel = { or: 'Or', argent: 'Argent', bronze: 'Bronze' };

const ProducteurMedailles = ({ onNavigate }) => {
  const medals = [
    { id: 'vv24',  name: 'Vieilles Vignes 2024',   appell: 'Mâcon-Villages', medal: 'argent', pts: 88.2, edition: '2026', concours: 'france' },
    { id: 'cp23',  name: 'Cuvée Prestige 2023',    appell: 'Pouilly-Fuissé', medal: 'or',     pts: 91.5, edition: '2025', concours: 'france' },
    { id: 't22',   name: 'Tradition 2022',         appell: 'Mâcon-Villages', medal: 'bronze', pts: 84.0, edition: '2024', concours: 'france' },
    { id: 'csp22', name: 'Clos Saint-Pierre 2022', appell: 'Pouilly-Fuissé', medal: 'or',     pts: 92.1, edition: '2024', concours: 'france' },
    { id: 'lh23',  name: 'Les Hauts 2023',         appell: 'Saint-Véran',    medal: 'or',     pts: 90.8, edition: '2025', concours: 'monde'  },
    { id: 'aut21', name: "L'Authentique 2021",     appell: 'Mâcon-Villages', medal: 'argent', pts: 87.4, edition: '2023', concours: 'monde'  },
  ];

  const france = medals.filter(m => m.concours === 'france');
  const monde  = medals.filter(m => m.concours === 'monde');

  const goCommander = (wineId) => {
    window.__commandeFocusWine = wineId || null;
    onNavigate('p-commandes');
  };

  const MedalCard = ({ m }) => (
    <div className="card" style={{ display: 'flex', gap: 16, padding: 20 }}>
      <img
        src={medalImg(m.medal, m.concours)}
        alt={m.medal}
        style={{ width: 64, height: 64, objectFit: 'contain', flexShrink: 0 }}
      />
      <div style={{ flex: 1 }}>
        <div className="display" style={{ fontSize: 16, fontWeight: 500 }}>{m.name}</div>
        <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>{m.appell} · Édition {m.edition}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10, alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <img src={medalImg(m.medal, m.concours)} alt={m.medal} style={{ width: 20, height: 20, objectFit: 'contain' }}/>
            <span style={{ fontSize: 11.5, fontWeight: 600 }}>{medalLabel[m.medal]}</span>
          </span>
          <span className="badge tnum">{m.pts} pts</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button className="btn btn-outline btn-sm"><Icon.Download size={12}/> Diplôme</button>
        <button className="btn btn-ghost btn-sm" onClick={() => goCommander(m.id)}><Icon.Package size={12}/> Commander</button>
      </div>
    </div>
  );

  const Section = ({ title, icon, items, accent }) => (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
        paddingBottom: 10, borderBottom: `2px solid ${accent}`,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: accent + '22', color: accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{icon}</div>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)' }}>{title}</span>
        <span style={{
          fontSize: 11.5, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
          background: accent + '18', color: accent,
        }}>{items.length} médaille{items.length > 1 ? 's' : ''}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {items.map(m => <MedalCard key={m.id} m={m}/>)}
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Mon palmarès"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => onNavigate('p-cmd-historique')} className="btn btn-ghost btn-sm">
              <Icon.Package size={14}/> Mes commandes
            </button>
            <button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Tous les diplômes</button>
            <button className="btn btn-primary btn-sm" onClick={() => goCommander(null)}>
              <Icon.Plus size={14}/> Passer une commande
            </button>
          </div>
        }
      />
      <Section
        title="Concours France"
        icon={<Icon.Trophy size={16}/>}
        items={france}
        accent="var(--burgundy-800)"
      />
      <Section
        title="Concours Monde"
        icon={<Icon.Globe size={16}/>}
        items={monde}
        accent="#1e40af"
      />
    </div>
  );
};

// ============================================================
// Confirmation après envoi commande médailles
// ============================================================
const CommandeConfirmation = ({ order, onNavigate }) => (
  <div style={{ minHeight: 'calc(100vh - 64px)', padding: '64px 24px 80px' }}>
    <div className="fade-in" style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
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
          Commande envoyée
        </h1>
        <div style={{ marginTop: 10, fontSize: 14, color: 'var(--fg-muted)' }}>
          Référence : <span className="tnum" style={{ color: 'var(--fg)', fontWeight: 500 }}>{order.ref}</span>
        </div>
      </div>

      <div className="card" style={{ padding: 22, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            background: 'var(--gold-100)', color: 'var(--gold-700)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon.Medal size={20}/>
          </div>
          <div style={{ flex: 1 }}>
            <div className="display" style={{ fontSize: 16, fontWeight: 500 }}>Médailles 2026</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>Domaine de la Chevalière · Commandée le {order.date}</div>
          </div>
        </div>

        <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {order.lines.map((l) => (
            <div key={l.wine.id}>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{l.wine.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>
                {ALL_FORMAT_KEYS
                  .filter(k => (l.qty[k] || 0) > 0)
                  .map(k => {
                    const n = l.qty[k];
                    const lbl = FORMAT_LABELS[k];
                    return `${n} ${n > 1 ? lbl.plural : lbl.label}`;
                  })
                  .join(' · ')} <span style={{ color: 'var(--fg-subtle)' }}>·</span> <span className="tnum" style={{ color: 'var(--fg)', fontWeight: 500 }}>{l.units} unités</span>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 6, paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{order.totalItems} article{order.totalItems > 1 ? 's' : ''}</span>
            <span className="tnum display" style={{ fontSize: 18, fontWeight: 600 }}>{order.totalUnits.toLocaleString('fr-FR')} unités</span>
          </div>
        </div>
      </div>

      <div style={{
        fontSize: 13, color: 'var(--fg-muted)', textAlign: 'center',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        marginBottom: 24,
      }}>
        <Icon.Mail size={14} style={{ color: 'var(--fg-subtle)' }}/>
        Un email de confirmation a été envoyé à <span style={{ color: 'var(--fg)' }}>contact@domaine-chevaliere.fr</span>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => onNavigate('p-cmd-historique')} className="btn btn-outline btn-lg" style={{ flex: 1 }}>
          Voir mes commandes
        </button>
        <button onClick={() => onNavigate('p-medailles')} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
          Retour à mes médailles <Icon.ArrowRight size={14}/>
        </button>
      </div>
    </div>
  </div>
);

// ============================================================
// Liste des commandes
// ============================================================
const ProducteurCommandesListe = ({ onOpenCommande, onOpenNew }) => {
  const commandes = [
    { ref: 'CMD-2026-184022', date: '03 juin 2026',  detail: 'Vieilles Vignes 2024 · Cuvée Prestige 2023',  units: 320, status: 'en_cours' },
    { ref: 'CMD-2025-148901', date: '12 mai 2025',   detail: 'Cuvée Prestige 2023 · Les Hauts 2023',        units: 850, status: 'recue' },
    { ref: 'CMD-2025-127044', date: '03 avril 2025', detail: 'Tradition 2022',                              units: 200, status: 'transmise' },
    { ref: 'CMD-2024-108812', date: '18 juin 2024',  detail: 'Clos Saint-Pierre 2022 · Tradition 2022',     units: 540, status: 'transmise' },
  ];

  const statusInfo = {
    en_cours:  { label: 'En cours',                  cls: 'badge badge-info' },
    recue:     { label: 'Reçue',                     cls: 'badge badge-warning' },
    transmise: { label: 'Transmise à l\'imprimeur',  cls: 'badge badge-success' },
  };

  return (
    <div>
      <PageHeader
        title="Mes commandes de médailles"
        subtitle="Historique des commandes passées et leur statut de livraison"
        actions={
          <button onClick={onOpenNew} className="btn btn-primary">
            <Icon.Plus size={14}/> Nouvelle commande
          </button>
        }
      />

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Référence</th>
              <th>Détail</th>
              <th className="num">Unités</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {commandes.map(c => (
              <tr key={c.ref} style={{ cursor: 'pointer' }} onClick={() => onOpenCommande(c)}>
                <td className="muted">{c.date}</td>
                <td className="tnum" style={{ fontWeight: 500 }}>{c.ref}</td>
                <td>{c.detail}</td>
                <td className="num tnum" style={{ fontWeight: 500 }}>{c.units.toLocaleString('fr-FR')}</td>
                <td>
                  <span className={statusInfo[c.status].cls}>
                    <span className="badge-dot"/>
                    {statusInfo[c.status].label}
                  </span>
                </td>
                <td style={{ textAlign: 'right', width: 32 }}>
                  <Icon.ChevronRight size={14} style={{ color: 'var(--fg-subtle)' }}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================
// Détail d'une commande
// ============================================================
const ProducteurCommandeDetail = ({ commande, onBack }) => {
  const c = commande || { ref: 'CMD-2026-184022', date: '03 juin 2026', detail: '', units: 320, status: 'en_cours' };

  const stepByStatus = { en_cours: 0, recue: 1, transmise: 2 };
  const current = stepByStatus[c.status] ?? 0;

  const tlSteps = [
    { id: 0, label: 'En cours',                 icon: <Icon.Clock size={13}/> },
    { id: 1, label: 'Reçue',                    icon: <Icon.Check size={13}/> },
    { id: 2, label: 'Transmise à l\'imprimeur', icon: <Icon.Printer size={13}/> },
  ];

  // Articles fictifs basés sur le détail (parsing rapide ou exemple)
  const articles = c.units >= 800 ? [
    { wine: 'Cuvée Prestige 2023', appell: 'Pouilly-Fuissé', medal: 'or',     concours: 'france', items: [{ k: 'autocollants', n: 350 }, { k: 'plaques', n: 30 }], units: 650 },
    { wine: 'Les Hauts 2023',      appell: 'Saint-Véran',    medal: 'argent', concours: 'france', items: [{ k: 'autocollants', n: 200 }], units: 200 },
  ] : c.status === 'transmise' ? [
    { wine: 'Tradition 2022', appell: 'Mâcon-Villages', medal: 'bronze', concours: 'france', items: [{ k: 'autocollants', n: 200 }], units: 200 },
  ] : [
    { wine: 'Vieilles Vignes 2024', appell: 'Mâcon-Villages', medal: 'or', concours: 'france', items: [{ k: 'autocollants', n: 120 }, { k: 'plaques', n: 10 }], units: 220 },
    { wine: 'Cuvée Prestige 2023',  appell: 'Pouilly-Fuissé', medal: 'or', concours: 'france', items: [{ k: 'autocollants', n: 100 }], units: 100 },
  ];

  const livraison = {
    adresse: 'Domaine de la Chevalière · Lieu-dit Les Crays, 71960 Vergisson',
    dateSouhaitee: c.status === 'en_cours' || c.status === 'recue' ? '8 juin 2026' : null,
    transmiseLe: c.status === 'transmise' ? '06 avril 2025' : null,
  };

  const statusInfo = {
    en_cours:  { label: 'En cours',                 cls: 'badge badge-info' },
    recue:     { label: 'Reçue',                    cls: 'badge badge-warning' },
    transmise: { label: 'Transmise à l\'imprimeur', cls: 'badge badge-success' },
  }[c.status];

  const itemLabels = { autocollants: 'autocollant rond', autocollants_rect: 'autocollant rect.', plaques: 'plaque métal', diplomes: 'certificat', boites: 'boîte vrac' };

  return (
    <div>
      <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ marginLeft: -10, marginBottom: 16 }}>
        <Icon.ChevronLeft size={14}/> Mes commandes
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 28 }}>
        <div>
          <h1 className="display" style={{ fontSize: 28, fontWeight: 500, margin: 0, letterSpacing: '-0.025em' }}>
            Commande {c.ref}
          </h1>
          <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 6 }}>
            Commandée le {c.date} · {c.units.toLocaleString('fr-FR')} unités
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-outline btn-sm"><Icon.Download size={13}/> Bon de commande</button>
          <span className={statusInfo.cls} style={{ fontSize: 13, padding: '4px 12px' }}>
            <span className="badge-dot"/>
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="card" style={{ padding: '24px 28px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {tlSteps.map((s, i) => {
            const isPast    = i < current;
            const isCurrent = i === current;
            const isFuture  = i > current;
            let bg, fg;
            if (isPast)        { bg = 'var(--success)';      fg = '#fff'; }
            else if (isCurrent){ bg = 'var(--burgundy-800)'; fg = '#fff'; }
            else               { bg = 'var(--surface)';      fg = 'var(--fg-subtle)'; }

            return (
              <React.Fragment key={s.id}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: bg, color: fg,
                    border: isFuture ? '1px solid var(--border)' : 'none',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isPast ? <Icon.Check size={14}/> : s.icon}
                  </div>
                  <div style={{
                    fontSize: 12, fontWeight: isCurrent ? 600 : 500,
                    color: isPast ? 'var(--success)' : (isCurrent ? 'var(--burgundy-800)' : 'var(--fg-subtle)'),
                  }}>{s.label}</div>
                </div>
                {i < tlSteps.length - 1 && (
                  <div style={{
                    flex: 1, height: 2, margin: '0 8px',
                    background: i < current ? 'var(--success)' : 'var(--border)',
                    transform: 'translateY(-10px)',
                  }}/>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'flex-start' }}>
        {/* Articles */}
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 12 }}>Articles</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {articles.map((a, i) => {
              const medalColors = {
                or:     { bg: 'var(--gold-100)', fg: 'var(--gold-700)',  label: 'Or' },
                argent: { bg: '#f1f5f9',         fg: '#475569',          label: 'Argent' },
                bronze: { bg: '#fef3c7',         fg: '#a16207',          label: 'Bronze' },
              }[a.medal];
              return (
                <div key={i} className="card" style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <img
                      src={medalImg(a.medal, a.concours)}
                      alt={medalColors.label}
                      style={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{a.wine}</div>
                      <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{a.appell}</div>
                    </div>
                    <div className="tnum" style={{ fontSize: 13, fontWeight: 600 }}>{a.units} u.</div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12.5, color: 'var(--fg-muted)', paddingLeft: 4 }}>
                    {a.items.map((it, j) => (
                      <span key={j}>· {it.n} {itemLabels[it.k]}{it.n > 1 ? 's' : ''}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Livraison */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 14 }}>Livraison</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Adresse</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{livraison.adresse}</div>
            </div>
            {livraison.dateSouhaitee && (
              <div style={{ padding: '10px 12px', background: 'var(--burgundy-50)', borderRadius: 8 }}>
                <div style={{ fontSize: 11.5, color: 'var(--burgundy-800)', fontWeight: 500 }}>Date de livraison souhaitée</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--burgundy-900)', marginTop: 2 }}>{livraison.dateSouhaitee}</div>
              </div>
            )}
            {livraison.transmiseLe && (
              <div style={{ padding: '10px 12px', background: 'var(--success-bg)', borderRadius: 8 }}>
                <div style={{ fontSize: 11.5, color: '#166534', fontWeight: 500 }}>Transmise à l'imprimeur le</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#166534', marginTop: 2 }}>{livraison.transmiseLe}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper qui gère liste ↔ détail
const ProducteurCommandesHistorique = ({ onNavigate }) => {
  const [viewing, setViewing] = React.useState(null);
  if (viewing) {
    return <ProducteurCommandeDetail commande={viewing} onBack={() => setViewing(null)}/>;
  }
  return <ProducteurCommandesListe onOpenCommande={setViewing} onOpenNew={() => onNavigate('p-commandes')}/>;
};

const UNIT_PER  = { autocollants: 1, autocollants_rect: 1, plaques: 10, diplomes: 5, boites: 100 };
const PRICE_PER = { autocollants: 0.15, autocollants_rect: 0.20, plaques: 25.00, diplomes: 8.00, boites: 45.00 };
const ALL_FORMAT_KEYS = Object.keys(UNIT_PER);
const FORMAT_LABELS = {
  autocollants:      { label: 'autocollant rond',       plural: 'autocollants ronds'         },
  autocollants_rect: { label: 'autocollant rectangulaire', plural: 'autocollants rectangulaires' },
  plaques:           { label: 'plaque métal',           plural: 'plaques métal'              },
  diplomes:          { label: 'certificat',             plural: 'certificats'                },
  boites:            { label: 'boîte vrac',             plural: 'boîtes vrac'                },
};

const ProducteurCommandes = ({ onNavigate }) => {
  // Wine id passé via navigation (clic depuis "Mes médailles")
  const focusWine = React.useMemo(() => {
    const f = window.__commandeFocusWine || null;
    window.__commandeFocusWine = null;
    return f;
  }, []);
  const [submitted, setSubmitted] = React.useState(null); // détail de la commande envoyée

  // Vins médaillés disponibles à la commande + quota basé sur volumes déclarés
  const medailles = [
    // — Concours France —
    { id: 'vv24',    name: 'Vieilles Vignes 2024', appell: 'Mâcon-Villages', edition: '2026', concours: 'france', medal: 'or',     quota: 500,  used: 420 },
    { id: 'cp23',    name: 'Cuvée Prestige 2023',  appell: 'Pouilly-Fuissé', edition: '2025', concours: 'france', medal: 'or',     quota: 1200, used: 350 },
    { id: 'lh23',    name: 'Les Hauts 2023',       appell: 'Saint-Véran',    edition: '2025', concours: 'france', medal: 'argent', quota: 800,  used: 800 },
    { id: 't22',     name: 'Tradition 2022',       appell: 'Mâcon-Villages', edition: '2024', concours: 'france', medal: 'bronze', quota: 600,  used: 540 },
    // — Concours Monde —
    { id: 'vv24m',   name: 'Vieilles Vignes 2024', appell: 'Mâcon-Villages', edition: '2026', concours: 'monde',  medal: 'or',     quota: 300,  used: 180 },
    { id: 'cp23m',   name: 'Cuvée Prestige 2023',  appell: 'Pouilly-Fuissé', edition: '2025', concours: 'monde',  medal: 'argent', quota: 500,  used: 120 },
  ];

  const [concourTab, setConcourTab] = React.useState('france');
  const medaillesTab = medailles.filter(m => m.concours === concourTab);

  // État panier : { wineId: { autocollants, plaques, boites } }
  const [cart, setCart] = React.useState(() =>
    medailles.reduce((acc, m) => { acc[m.id] = { autocollants: 0, autocollants_rect: 0, plaques: 0, diplomes: 0, boites: 0 }; return acc; }, {})
  );

  const unitsOrdered = (wineId) => {
    const c = cart[wineId];
    return c.autocollants * UNIT_PER.autocollants + c.plaques * UNIT_PER.plaques + c.boites * UNIT_PER.boites;
  };
  const remainingAfter = (wine) => wine.quota - wine.used - unitsOrdered(wine.id);

  const setCount = (wineId, key, val) => {
    const v = Math.max(0, parseInt(val, 10) || 0);
    setCart(c => ({ ...c, [wineId]: { ...c[wineId], [key]: v } }));
  };

  // Totaux panier — filtrés sur l'onglet actif
  const cartLines = medaillesTab
    .map(m => ({ wine: m, qty: cart[m.id], units: unitsOrdered(m.id) }))
    .filter(l => l.units > 0);
  const totalItems = cartLines.reduce((s, l) => s + ALL_FORMAT_KEYS.filter(k => (l.qty[k] || 0) > 0).length, 0);
  const totalUnits = cartLines.reduce((s, l) => s + l.units, 0);
  const totalPrice = cartLines.reduce((s, l) => s + ALL_FORMAT_KEYS.reduce((ps, k) => ps + (l.qty[k] || 0) * PRICE_PER[k], 0), 0);
  const hasOverflow = medaillesTab.some(m => remainingAfter(m) < 0);

  const handleSubmit = () => {
    const ref = 'CMD-2026-' + Math.floor(100000 + Math.random() * 900000);
    setSubmitted({
      ref,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
      lines: cartLines,
      totalItems,
      totalUnits,
    });
  };

  if (submitted) {
    return <CommandeConfirmation order={submitted} onNavigate={onNavigate}/>;
  }

  return (
    <div>
      <PageHeader
        title="Commander des médailles"
        subtitle="Sélectionnez vos quantités — quota basé sur vos volumes déclarés"
      />

      {/* Onglets Concours France / Concours Monde */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
        {[{ k: 'france', label: 'Concours France' }, { k: 'monde', label: 'Concours Monde' }].map(t => (
          <button key={t.k} onClick={() => setConcourTab(t.k)} style={{
            padding: '10px 20px', border: 'none', background: 'transparent',
            borderBottom: concourTab === t.k ? '2px solid var(--burgundy-800)' : '2px solid transparent',
            fontWeight: concourTab === t.k ? 600 : 400,
            color: concourTab === t.k ? 'var(--burgundy-800)' : 'var(--fg-muted)',
            cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'flex-start' }}>
        {/* Gauche — vins médaillés */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {medaillesTab.map(m => (
            <WineOrderBlock
              key={m.id}
              wine={m}
              counts={cart[m.id]}
              unitsOrdered={unitsOrdered(m.id)}
              remaining={remainingAfter(m)}
              onChange={(k, v) => setCount(m.id, k, v)}
              initialOpen={focusWine === m.id}
            />
          ))}
        </div>

        {/* Droite — panier sticky */}
        <aside style={{ position: 'sticky', top: 88 }}>
          <CommandeCart
            lines={cartLines}
            totalItems={totalItems}
            totalUnits={totalUnits}
            totalPrice={totalPrice}
            disabled={cartLines.length === 0 || hasOverflow}
            hasOverflow={hasOverflow}
            onSubmit={handleSubmit}
          />
        </aside>
      </div>
    </div>
  );
};

const WineOrderBlock = ({ wine, counts, unitsOrdered, remaining, onChange, initialOpen }) => {
  const [open, setOpen] = React.useState(!!initialOpen);
  const isExhausted = wine.quota - wine.used <= 0;
  const totalUsed = wine.used + unitsOrdered;
  const isOverflow = remaining < 0;
  const remainingPct = (wine.quota - wine.used) / wine.quota;

  // Couleur jauge
  let gaugeColor;
  if (isOverflow)               gaugeColor = 'var(--danger)';
  else if (remainingPct < 0.20) gaugeColor = '#d97706';
  else                          gaugeColor = '#16a34a';

  const medalColors = {
    or:     { bg: 'var(--gold-100)',  fg: 'var(--gold-700)',  label: 'Or' },
    argent: { bg: '#f1f5f9',          fg: '#475569',          label: 'Argent' },
    bronze: { bg: '#fef3c7',          fg: '#a16207',          label: 'Bronze' },
  }[wine.medal];

  const itemTypes = [
    {
      key: 'autocollants',
      label: 'Autocollants ronds',
      sub: 'Macaron Ø 35 mm · à coller sur les bouteilles',
      icon: 'Medal',
      equiv: '1 unité / autocollant',
      color: '#f59e0b',
    },
    {
      key: 'autocollants_rect',
      label: 'Autocollants rectangulaires',
      sub: 'Format col 80 × 30 mm · version horizontale sur étiquette',
      icon: 'Layers',
      equiv: '1 unité / autocollant',
      color: '#8b5cf6',
    },
    {
      key: 'plaques',
      label: 'Plaques métal',
      sub: 'Aluminium brossé · vitrines, présentoirs et caves',
      icon: 'Award',
      equiv: '10 unités équivalent par plaque',
      color: '#0ea5e9',
    },
    {
      key: 'diplomes',
      label: 'Certificats / Diplômes',
      sub: 'Format A4 encadrable · attestation officielle du concours',
      icon: 'FileText',
      equiv: '5 unités équivalent par certificat',
      color: '#16a34a',
    },
    {
      key: 'boites',
      label: 'Boîtes vrac',
      sub: 'Conditionnement cave · pour les grands volumes de stock',
      icon: 'Package',
      equiv: '100 unités équivalent par boîte',
      color: '#64748b',
    },
  ];

  const itemsActive = itemTypes.filter(t => counts[t.key] > 0).length;

  return (
    <div className="card" style={{
      padding: 0, overflow: 'hidden',
      opacity: isExhausted ? 0.6 : 1,
      filter: isExhausted ? 'grayscale(.4)' : 'none',
      transition: 'opacity .15s',
      borderColor: open ? 'var(--burgundy-300)' : 'var(--border)',
      boxShadow: open ? 'var(--shadow-sm)' : 'none',
    }}>
      {/* Header (toujours visible — toggle) */}
      <button
        onClick={() => !isExhausted && setOpen(o => !o)}
        disabled={isExhausted}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px 20px',
          background: 'transparent',
          border: 'none',
          cursor: isExhausted ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          textAlign: 'left',
          transition: 'background .12s',
        }}
        onMouseEnter={e => { if (!isExhausted) e.currentTarget.style.background = 'var(--surface-2)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
      >
        {/* Image médaille */}
        <img
          src={medalImg(wine.medal, wine.concours)}
          alt={medalColors.label}
          style={{ width: 52, height: 52, objectFit: 'contain', flexShrink: 0 }}
        />

        {/* Identité vin */}
        <div style={{ flex: '0 1 280px', minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{wine.name}</div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{wine.appell} · Édition {wine.edition}</div>
        </div>

        {/* Jauge inline (mini) */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div className="tnum" style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>
            <span style={{ color: 'var(--fg)', fontWeight: 500 }}>{totalUsed.toLocaleString('fr-FR')}</span>
            <span> / {wine.quota.toLocaleString('fr-FR')}</span>
            <span style={{
              marginLeft: 8,
              color: isOverflow ? 'var(--danger)' : (remainingPct < 0.20 ? '#d97706' : 'var(--fg-muted)'),
              fontWeight: isOverflow || remainingPct < 0.20 ? 600 : 400,
            }}>
              · {isOverflow ? `${Math.abs(remaining)} dépassées` : `${remaining} restantes`}
            </span>
          </div>
          <div style={{
            height: 6, borderRadius: 999, background: 'var(--slate-100)', overflow: 'hidden', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: Math.min(100, (wine.used / wine.quota) * 100) + '%',
              background: 'var(--slate-300)',
            }}/>
            {unitsOrdered > 0 && (
              <div style={{
                position: 'absolute',
                left: Math.min(100, (wine.used / wine.quota) * 100) + '%',
                top: 0, bottom: 0,
                width: Math.min(100 - (wine.used / wine.quota) * 100, (unitsOrdered / wine.quota) * 100) + '%',
                background: gaugeColor,
                transition: 'width .2s',
              }}/>
            )}
          </div>
        </div>

        {/* État commande / chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {isExhausted ? (
            <span className="badge badge-danger" style={{ fontWeight: 500 }}>
              <Icon.AlertCircle size={11}/> Quota épuisé
            </span>
          ) : unitsOrdered > 0 ? (
            <span className="badge badge-primary" style={{ fontWeight: 600 }}>
              {unitsOrdered.toLocaleString('fr-FR')} u. · {itemsActive} article{itemsActive > 1 ? 's' : ''}
            </span>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>Aucune quantité</span>
          )}
          {!isExhausted && (
            <span style={{
              color: 'var(--fg-muted)',
              transition: 'transform .15s',
              transform: open ? 'rotate(180deg)' : 'rotate(0)',
              display: 'inline-flex',
            }}>
              <Icon.ChevronDown size={16}/>
            </span>
          )}
        </div>
      </button>

      {/* Body collapsé */}
      {open && !isExhausted && (
        <div className="slide-up" style={{ padding: '4px 20px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
            {itemTypes.map(row => {
              const IcoComp = Icon[row.icon] || Icon.Package;
              const active = (counts[row.key] || 0) > 0;
              const maxForType = Math.max(0, Math.floor((wine.quota - wine.used - (unitsOrdered - (counts[row.key] || 0) * UNIT_PER[row.key])) / UNIT_PER[row.key]));
              const unitsForType = (counts[row.key] || 0) * UNIT_PER[row.key];
              return (
                <div key={row.key} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px',
                  background: active ? 'var(--burgundy-50)' : 'var(--surface-2)',
                  border: '1px solid ' + (active ? 'var(--burgundy-200)' : 'var(--border)'),
                  borderRadius: 8,
                  transition: 'all .12s',
                }}>
                  {/* Icône colorée */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                    background: active ? row.color + '22' : 'var(--surface)',
                    border: '1px solid ' + (active ? row.color + '44' : 'var(--border)'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: active ? row.color : 'var(--fg-muted)',
                    transition: 'all .12s',
                  }}>
                    <IcoComp size={16}/>
                  </div>
                  {/* Texte */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: active ? 'var(--burgundy-900)' : 'var(--fg)' }}>{row.label}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums' }}>
                        {PRICE_PER[row.key].toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € / pce
                      </div>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 1 }}>{row.sub}</div>
                    <div style={{ fontSize: 11, color: active ? row.color : 'var(--fg-subtle)', marginTop: 3, fontWeight: active ? 500 : 400 }}>
                      {row.equiv}
                    </div>
                  </div>
                  {/* Stepper */}
                  <Stepper
                    value={counts[row.key] || 0}
                    onChange={(v) => onChange(row.key, v)}
                    disabled={isExhausted}
                    max={maxForType}
                  />
                  {/* Montant ligne + équivalent unités */}
                  <div className="tnum" style={{ minWidth: 90, textAlign: 'right', flexShrink: 0 }}>
                    {active ? (
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--burgundy-800)', marginBottom: 2 }}>
                        {(counts[row.key] * PRICE_PER[row.key]).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginBottom: 2 }}>—</div>
                    )}
                    <div style={{ fontSize: 11.5, color: active ? 'var(--fg-muted)' : 'var(--fg-subtle)', fontWeight: active ? 500 : 400 }}>
                      = {unitsForType} unité{unitsForType !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const Stepper = ({ value, onChange, disabled, max }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, height: 32 }}>
    <button onClick={() => onChange(value - 1)} disabled={disabled || value <= 0} style={{
      width: 28, height: 32,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '6px 0 0 6px',
      cursor: disabled || value <= 0 ? 'not-allowed' : 'pointer',
      color: 'var(--fg)', opacity: disabled || value <= 0 ? 0.4 : 1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>−</button>
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      min={0}
      style={{
        width: 52, height: 32,
        textAlign: 'center',
        border: '1px solid var(--border)',
        borderLeft: 'none', borderRight: 'none',
        fontSize: 13, fontWeight: 500,
        fontVariantNumeric: 'tabular-nums',
        background: disabled ? 'var(--slate-100)' : 'var(--surface)',
        outline: 'none',
        fontFamily: 'inherit',
        MozAppearance: 'textfield',
      }}
    />
    <button onClick={() => onChange(value + 1)} disabled={disabled || (max !== undefined && value >= max)} style={{
      width: 28, height: 32,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '0 6px 6px 0',
      cursor: disabled || (max !== undefined && value >= max) ? 'not-allowed' : 'pointer',
      color: 'var(--fg)', opacity: disabled || (max !== undefined && value >= max) ? 0.4 : 1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>+</button>
  </div>
);

const CommandeCart = ({ lines, totalItems, totalUnits, totalPrice, disabled, hasOverflow, onSubmit }) => (
  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
    <div style={{ padding: '18px 22px 4px' }}>
      <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>Votre commande</div>
      <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}/>
        Mis à jour en temps réel
      </div>
    </div>

    <div style={{ padding: '14px 22px' }}>
      {lines.length === 0 ? (
        <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--fg-muted)' }}>
          <Icon.Package size={28} style={{ color: 'var(--fg-subtle)', marginBottom: 10 }}/>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>Panier vide</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Saisissez les quantités à gauche</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {lines.map((l, i) => (
            <div key={l.wine.id} style={{
              paddingBottom: i < lines.length - 1 ? 14 : 0,
              borderBottom: i < lines.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 4 }}>{l.wine.name}</div>
              {[
                { k: 'autocollants',      sing: 'autocollant rond',        plur: 'autocollants ronds' },
                { k: 'autocollants_rect', sing: 'autocollant rect.',       plur: 'autocollants rect.' },
                { k: 'plaques',           sing: 'plaque métal',            plur: 'plaques métal' },
                { k: 'diplomes',          sing: 'certificat',              plur: 'certificats' },
                { k: 'boites',            sing: 'boîte vrac',              plur: 'boîtes vrac' },
              ].filter(f => (l.qty[f.k] || 0) > 0).map(f => {
                const qty = l.qty[f.k];
                const lineTotal = qty * PRICE_PER[f.k];
                return (
                  <div key={f.k} style={{ fontSize: 12, color: 'var(--fg-muted)', paddingLeft: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
                    <span>· {qty} {qty > 1 ? f.plur : f.sing}</span>
                    <span className="tnum" style={{ fontWeight: 500, color: 'var(--fg)', whiteSpace: 'nowrap' }}>
                      {lineTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Totaux */}
    <div style={{ padding: '14px 22px', background: 'var(--surface-2)', borderTop: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{totalItems} article{totalItems > 1 ? 's' : ''}</div>
          <div style={{ fontSize: 11.5, color: 'var(--fg-subtle)', marginTop: 2 }} className="tnum">{totalUnits.toLocaleString('fr-FR')} unités</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>Total</div>
          <div className="tnum display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--burgundy-800)', letterSpacing: '-0.02em' }}>
            {(totalPrice || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span style={{ fontSize: 16 }}>€</span>
          </div>
        </div>
      </div>
    </div>

    {hasOverflow && (
      <div style={{
        padding: '10px 22px',
        background: '#fef2f2',
        borderTop: '1px solid #fecaca',
        fontSize: 12, color: '#991b1b',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Icon.AlertTriangle size={13}/>
        Quota dépassé sur un ou plusieurs vins
      </div>
    )}

    <div style={{ padding: 18 }}>
      <button disabled={disabled} onClick={onSubmit} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
        <Icon.Check size={14}/> Soumettre la commande
      </button>
    </div>
  </div>
);

// ============================================================
// Dérogations — Liste / Formulaire / Détail
// ============================================================

const DEROG_TYPES = [
  { value: 'hors-delai',   label: 'Inscription hors délai' },
  { value: 'modif',        label: 'Modification de dossier soumis' },
  { value: 'remboursement',label: 'Remboursement' },
  { value: 'autre',        label: 'Autre' },
];

const ProducteurDerogationsList = ({ onOpen, onNew }) => {
  const rows = [
    { ref: 'DER-2026-0042', date: '04 juin 2026',  type: 'modif',         dossier: 'INS-2026-0184', status: 'en-attente', motif: 'Correction du nom de cuvée — erreur de saisie sur "Vieilles Vignes 2024".' },
    { ref: 'DER-2025-0117', date: '08 mai 2025',   type: 'hors-delai',    dossier: 'INS-2025-0142', status: 'accordee',   motif: 'Inscription tardive suite à un retard de mes analyses œnologiques.' },
    { ref: 'DER-2024-0089', date: '12 juin 2024',  type: 'remboursement', dossier: 'INS-2024-0098', status: 'refusee',    motif: 'Demande de remboursement partiel après annulation d\'un échantillon.' },
    { ref: 'DER-2023-0066', date: '19 mai 2023',   type: 'autre',         dossier: 'INS-2023-0067', status: 'accordee',   motif: 'Demande de jury spécifique pour la dégustation.' },
  ];

  const statusMap = {
    'en-attente': { label: 'En attente', cls: 'badge badge-warning' },
    'accordee':   { label: 'Accordée',   cls: 'badge badge-success' },
    'refusee':    { label: 'Refusée',    cls: 'badge badge-danger' },
  };
  const typeLabel = (v) => DEROG_TYPES.find(t => t.value === v)?.label || v;

  return (
    <div>
      <PageHeader
        title="Mes dérogations"
        subtitle="Demandes d'autorisation exceptionnelle auprès du Comité"
        actions={
          <button onClick={onNew} className="btn btn-primary">
            <Icon.Plus size={14}/> Faire une demande
          </button>
        }
      />

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Référence</th>
              <th>Type</th>
              <th>Inscription</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.ref} style={{ cursor: 'pointer' }} onClick={() => onOpen(r)}>
                <td className="muted">{r.date}</td>
                <td className="tnum" style={{ fontWeight: 500 }}>{r.ref}</td>
                <td>{typeLabel(r.type)}</td>
                <td className="tnum muted">{r.dossier}</td>
                <td>
                  <span className={statusMap[r.status].cls}>
                    <span className="badge-dot"/>
                    {statusMap[r.status].label}
                  </span>
                </td>
                <td style={{ textAlign: 'right', width: 32 }}>
                  <Icon.ChevronRight size={14} style={{ color: 'var(--fg-subtle)' }}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProducteurDerogationForm = ({ onCancel, onSubmit }) => {
  const [type, setType]       = React.useState('hors-delai');
  const [dossier, setDossier] = React.useState('');
  const [motif, setMotif]     = React.useState('');
  const [files, setFiles]     = React.useState([]);

  const dossiers = [
    { value: '', label: '— Aucune inscription liée —' },
    { value: 'INS-2026-0184', label: 'INS-2026-0184 · Concours France 2026' },
    { value: 'INS-2026-0021', label: 'INS-2026-0021 · Concours Monde 2026' },
    { value: 'INS-2025-0142', label: 'INS-2025-0142 · Concours France 2025' },
  ];

  const linkOptional = type === 'autre';
  const canSubmit = type && motif.trim().length >= 10 && (linkOptional || dossier);

  const handleFiles = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...list]);
  };

  return (
    <div>
      <button onClick={onCancel} className="btn btn-ghost btn-sm" style={{ marginLeft: -10, marginBottom: 16 }}>
        <Icon.ChevronLeft size={14}/> Mes dérogations
      </button>

      <h1 className="display" style={{ fontSize: 28, fontWeight: 500, margin: 0, letterSpacing: '-0.025em' }}>
        Nouvelle demande de dérogation
      </h1>
      <p style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 6, marginBottom: 24 }}>
        Votre demande sera étudiée par le secrétariat du Comité dans un délai de 5 jours ouvrés.
      </p>

      <div className="card" style={{ padding: 28, maxWidth: 720 }}>
        <div className="field" style={{ marginBottom: 18 }}>
          <label className="field-label">Type de demande *</label>
          <select className="select" value={type} onChange={e => setType(e.target.value)}>
            {DEROG_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div className="field" style={{ marginBottom: 18 }}>
          <label className="field-label">
            Inscription concernée {linkOptional && <span style={{ color: 'var(--fg-muted)', fontWeight: 400 }}>(optionnel)</span>}
          </label>
          <select className="select" value={dossier} onChange={e => setDossier(e.target.value)}>
            {dossiers.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>

        <div className="field" style={{ marginBottom: 18 }}>
          <label className="field-label">Motif détaillé *</label>
          <textarea
            className="textarea"
            placeholder="Expliquez votre demande en détail : contexte, justification, urgence éventuelle…"
            style={{ minHeight: 160 }}
            value={motif}
            onChange={e => setMotif(e.target.value)}
          />
          <span className="field-hint">{motif.length < 10 ? `Minimum 10 caractères (${motif.length}/10)` : `${motif.length} caractères`}</span>
        </div>

        <div className="field" style={{ marginBottom: 4 }}>
          <label className="field-label">Pièces jointes <span style={{ color: 'var(--fg-muted)', fontWeight: 400 }}>(optionnel)</span></label>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: 16,
            border: '2px dashed var(--border)', borderRadius: 10,
            background: 'var(--surface-2)',
            cursor: 'pointer',
            transition: 'all .12s',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'var(--surface)', color: 'var(--burgundy-800)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon.Upload size={16}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>Glisser-déposer ou cliquer pour téléverser</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>PDF, JPG, PNG · 10 Mo max par fichier</div>
            </div>
            <input type="file" multiple accept="application/pdf,image/*" onChange={handleFiles} style={{ display: 'none' }}/>
          </label>

          {files.length > 0 && (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {files.map((f, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 13,
                }}>
                  <Icon.FileText size={14} style={{ color: 'var(--burgundy-800)' }}/>
                  <span style={{ flex: 1 }}>{f.name}</span>
                  <span className="muted" style={{ fontSize: 12 }}>{(f.size / 1024).toFixed(0)} Ko</span>
                  <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="btn btn-icon btn-sm btn-ghost"><Icon.X size={12}/></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20, maxWidth: 720 }}>
        <button onClick={onCancel} className="btn btn-outline">Annuler</button>
        <button onClick={() => onSubmit({ type, dossier, motif })} disabled={!canSubmit} className="btn btn-primary">
          Envoyer la demande <Icon.ArrowRight size={14}/>
        </button>
      </div>
    </div>
  );
};

const ProducteurDerogationDetail = ({ derog, onBack }) => {
  const d = derog;
  const statusMap = {
    'en-attente': { label: 'En attente',  cls: 'badge badge-warning' },
    'accordee':   { label: 'Accordée',    cls: 'badge badge-success' },
    'refusee':    { label: 'Refusée',     cls: 'badge badge-danger' },
  };
  const typeLabel = DEROG_TYPES.find(t => t.value === d.type)?.label || d.type;

  // Bannière selon statut
  const banner = {
    'en-attente': {
      bg: '#fef3c7', border: '#fde68a', fg: '#92400e',
      icon: <Icon.Clock size={18}/>,
      title: 'Votre demande est en cours d\'examen',
      sub: 'Réponse attendue sous 5 jours ouvrés. Vous serez notifié par email.',
    },
    'accordee': {
      bg: 'var(--success-bg)', border: '#a7f3d0', fg: '#166534',
      icon: <Icon.Check size={18}/>,
      title: 'Demande accordée par le Comité',
      sub: 'La dérogation a été validée. Votre dossier d\'inscription a été mis à jour en conséquence.',
    },
    'refusee': {
      bg: '#fef2f2', border: '#fecaca', fg: '#991b1b',
      icon: <Icon.X size={18}/>,
      title: 'Demande refusée',
      sub: 'Le motif de refus est précisé ci-dessous.',
    },
  }[d.status];

  return (
    <div>
      <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ marginLeft: -10, marginBottom: 16 }}>
        <Icon.ChevronLeft size={14}/> Mes dérogations
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 24 }}>
        <div>
          <h1 className="display" style={{ fontSize: 28, fontWeight: 500, margin: 0, letterSpacing: '-0.025em' }}>
            Dérogation {d.ref}
          </h1>
          <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 6 }}>
            Soumise le {d.date}
          </div>
        </div>
        <span className={statusMap[d.status].cls} style={{ fontSize: 13, padding: '4px 12px' }}>
          <span className="badge-dot"/>
          {statusMap[d.status].label}
        </span>
      </div>

      {/* Bandeau statut */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 14,
        padding: '14px 18px',
        background: banner.bg, border: '1px solid ' + banner.border, borderRadius: 10,
        marginBottom: 20,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'rgba(255,255,255,0.7)', color: banner.fg,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>{banner.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: banner.fg }}>{banner.title}</div>
          <div style={{ fontSize: 13, color: banner.fg, opacity: 0.85, marginTop: 2 }}>{banner.sub}</div>
        </div>
        {d.status === 'accordee' && (
          <button className="btn btn-outline btn-sm">
            <Icon.Download size={13}/> Télécharger la facture
          </button>
        )}
      </div>

      {/* Récap de la demande */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 16 }}>Détail de la demande</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Type de demande</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{typeLabel}</div>
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Inscription concernée</div>
            <div className="tnum" style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{d.dossier || '—'}</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 6 }}>Motif</div>
          <div style={{
            fontSize: 13.5, lineHeight: 1.55,
            padding: 14,
            background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8,
            color: 'var(--slate-700)',
          }}>{d.motif}</div>
        </div>
      </div>

      {/* Motif de refus (si refusé) */}
      {d.status === 'refusee' && (
        <div className="card" style={{ padding: 20, background: '#fef2f2', borderColor: '#fecaca' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <Icon.AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }}/>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#7f1d1d' }}>Motif de refus du Comité</div>
              <div style={{ fontSize: 13, color: '#991b1b', marginTop: 6, lineHeight: 1.55 }}>
                La demande de remboursement ne peut être accordée après la date de clôture des inscriptions. Le règlement du concours prévoit un remboursement uniquement en cas d'annulation avant J-30. Pour toute question, contactez le secrétariat.
              </div>
              <div style={{ fontSize: 12, color: '#991b1b', marginTop: 10, opacity: 0.75 }}>
                Décision rendue le 14 juin 2024 par le secrétariat du Comité
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Wrapper qui gère liste ↔ détail ↔ form
const ProducteurDerogations = ({ initialView }) => {
  const [view, setView]   = React.useState(initialView || 'list'); // 'list' | 'form'
  const [viewing, setViewing] = React.useState(null);

  // Quand initialView change (navigation depuis la navbar)
  React.useEffect(() => { if (initialView) setView(initialView); }, [initialView]);

  if (viewing) {
    return <ProducteurDerogationDetail derog={viewing} onBack={() => setViewing(null)}/>;
  }
  if (view === 'form') {
    return (
      <ProducteurDerogationForm
        onCancel={() => setView('list')}
        onSubmit={() => {
          // Mock: on retourne à la liste avec un toast plus tard
          setView('list');
        }}
      />
    );
  }
  return <ProducteurDerogationsList onOpen={setViewing} onNew={() => setView('form')}/>;
};

// ============================================================
// Mon compte — wrapper avec sous-nav horizontale + 3 sous-pages
// ============================================================

const ProducteurCompte = ({ initial }) => {
  const [tab, setTab] = React.useState(initial || 'infos');
  React.useEffect(() => { if (initial) setTab(initial); }, [initial]);

  return (
    <div>
      <PageHeader
        title="Mon compte"
        subtitle="Vos informations administratives, la facturation et la sécurité de votre accès"
      />

      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        {[
          { id: 'infos',       label: 'Mes informations', icon: <Icon.User size={14}/> },
          { id: 'facturation', label: 'Facturation',      icon: <Icon.Receipt size={14}/> },
          { id: 'mdp',         label: 'Mot de passe',     icon: <Icon.Lock size={14}/> },
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
              {isActive && (
                <span style={{ position: 'absolute', left: 12, right: 12, bottom: -1, height: 2, background: 'var(--burgundy-800)' }}/>
              )}
            </button>
          );
        })}
      </div>

      <div className="fade-in" key={tab}>
        {tab === 'infos'       && <CompteInfos/>}
        {tab === 'facturation' && <CompteFacturation/>}
        {tab === 'mdp'         && <CompteMotDePasse/>}
      </div>
    </div>
  );
};

// 1 — Mes informations
const CompteInfos = () => {
  const initial = {
    raison:  'Domaine de la Chevalière',
    adresse: 'Lieu-dit Les Crays, 71960 Vergisson',
    ape:     '0121Z',
    siret:   '487 219 035 00018',
    tva:     'FR42487219035',
    inscNom: 'Lambert', inscPrenom: 'Sophie', inscFonction: 'Gérante', inscEmail: 'contact@domaine-chevaliere.fr', inscTel: '03 85 35 70 12',
    commNom: 'Renard',  commPrenom: 'Thomas', commFonction: 'Marketing', commEmail: 't.renard@domaine-chevaliere.fr',
  };
  const [form, setForm] = React.useState(initial);
  const dirty = Object.keys(initial).some(k => form[k] !== initial[k]);
  const setField = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ maxWidth: 880 }}>
      {/* Bandeau d'avertissement */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 14,
        background: '#fdf0f3',
        border: '1px solid #f4d4dd',
        borderRadius: 10,
        padding: '14px 18px',
        marginBottom: 20,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'var(--burgundy-800)', color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon.Info size={15}/>
        </div>
        <div style={{ flex: 1, fontSize: 13.5, color: 'var(--burgundy-900)', lineHeight: 1.5 }}>
          <strong>Toute modification est synchronisée avec notre logiciel comptable (Sage).</strong> Ces changements s'appliquent à toutes vos inscriptions et factures.
        </div>
      </div>

      {/* Identité du domaine */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>Identité du domaine</div>
        <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 18 }}>Coordonnées légales · transmises aux organismes officiels</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
          <div className="field" style={{ gridColumn: 'span 2' }}>
            <label className="field-label">Raison sociale</label>
            <input className="input" value={form.raison} onChange={setField('raison')}/>
          </div>
          <div className="field" style={{ gridColumn: 'span 2' }}>
            <label className="field-label">Adresse complète</label>
            <input className="input" value={form.adresse} onChange={setField('adresse')}/>
          </div>
          <div className="field">
            <label className="field-label">Code APE</label>
            <input className="input tnum" value={form.ape} onChange={setField('ape')}/>
          </div>
          <div className="field">
            <label className="field-label">N° SIRET</label>
            <input className="input tnum" value={form.siret} onChange={setField('siret')}/>
          </div>
          <div className="field" style={{ gridColumn: 'span 2' }}>
            <label className="field-label">N° TVA intracommunautaire</label>
            <input className="input tnum" value={form.tva} onChange={setField('tva')}/>
          </div>
          <div className="field" style={{ gridColumn: 'span 2' }}>
            <label className="field-label">CVI (Code Viti-Identificateur)
              <span title="Numéro officiel attribué par FranceAgriMer" style={{ marginLeft: 6, cursor: 'help', color: 'var(--fg-muted)', fontSize: 12 }}>ⓘ</span>
            </label>
            <input className="input tnum" value={form.cvi || '08000123456'} onChange={setField('cvi')}/>
            <span className="field-hint">11 chiffres · attribué par FranceAgriMer</span>
          </div>
        </div>
      </div>

      {/* Contact inscription */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>Contact inscription</div>
        <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 18 }}>Interlocuteur principal pour les inscriptions, paiements et dérogations</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="field"><label className="field-label">Nom</label><input className="input" value={form.inscNom} onChange={setField('inscNom')}/></div>
          <div className="field"><label className="field-label">Prénom</label><input className="input" value={form.inscPrenom} onChange={setField('inscPrenom')}/></div>
          <div className="field" style={{ gridColumn: 'span 2' }}><label className="field-label">Fonction</label><input className="input" value={form.inscFonction} onChange={setField('inscFonction')}/></div>
          <div className="field"><label className="field-label">Email</label><input className="input" value={form.inscEmail} onChange={setField('inscEmail')}/></div>
          <div className="field"><label className="field-label">Téléphone</label><input className="input tnum" value={form.inscTel} onChange={setField('inscTel')}/></div>
        </div>
      </div>

      {/* Contact communication */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>Contact communication</div>
        <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 18 }}>Contact pour la diffusion du palmarès et les supports presse</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="field"><label className="field-label">Nom</label><input className="input" value={form.commNom} onChange={setField('commNom')}/></div>
          <div className="field"><label className="field-label">Prénom</label><input className="input" value={form.commPrenom} onChange={setField('commPrenom')}/></div>
          <div className="field" style={{ gridColumn: 'span 2' }}><label className="field-label">Fonction</label><input className="input" value={form.commFonction} onChange={setField('commFonction')}/></div>
          <div className="field" style={{ gridColumn: 'span 2' }}><label className="field-label">Email</label><input className="input" value={form.commEmail} onChange={setField('commEmail')}/></div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        {dirty && (
          <button onClick={() => setForm(initial)} className="btn btn-outline">Annuler</button>
        )}
        <button disabled={!dirty} className="btn btn-primary">
          <Icon.Check size={14}/> Enregistrer les modifications
        </button>
      </div>
    </div>
  );
};

// 2 — Facturation
const CompteFacturation = () => {
  const [sameAsDomain, setSameAsDomain] = React.useState(true);
  const [addr, setAddr] = React.useState({ ligne1: '', cp: '', ville: '', pays: 'France' });

  const factures = [
    { date: '03 juin 2026', ref: 'FAC-2026-184022', montant: 576.00, type: 'inscription' },
    { date: '03 juin 2026', ref: 'FAC-2026-184023', montant: 60.00,  type: 'derogation' },
    { date: '12 mai 2025',  ref: 'FAC-2025-148901', montant: 504.00, type: 'inscription' },
    { date: '03 avr. 2025', ref: 'FAC-2025-127044', montant: 36.00,  type: 'derogation' },
    { date: '18 juin 2024', ref: 'FAC-2024-108812', montant: 432.00, type: 'inscription' },
    { date: '15 mai 2023',  ref: 'FAC-2023-067521', montant: 360.00, type: 'inscription' },
  ];

  return (
    <div style={{ maxWidth: 880 }}>
      {/* Adresse de facturation */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>Adresse de facturation</div>
        <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 16 }}>L'adresse imprimée sur vos factures</div>

        <label style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 14px',
          background: sameAsDomain ? 'var(--burgundy-50)' : 'var(--surface-2)',
          border: '1px solid ' + (sameAsDomain ? 'var(--burgundy-200)' : 'var(--border)'),
          borderRadius: 10,
          cursor: 'pointer',
          marginBottom: sameAsDomain ? 0 : 18,
          transition: 'all .12s',
        }}>
          <ToggleSwitch checked={sameAsDomain} onChange={setSameAsDomain}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>Identique à l'adresse du domaine</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>Lieu-dit Les Crays, 71960 Vergisson</div>
          </div>
        </label>

        {!sameAsDomain && (
          <div className="slide-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="field" style={{ gridColumn: 'span 2' }}>
              <label className="field-label">Adresse</label>
              <input className="input" value={addr.ligne1} onChange={e => setAddr({ ...addr, ligne1: e.target.value })} placeholder="N° et rue, complément…"/>
            </div>
            <div className="field"><label className="field-label">Code postal</label><input className="input tnum" value={addr.cp} onChange={e => setAddr({ ...addr, cp: e.target.value })}/></div>
            <div className="field"><label className="field-label">Ville</label><input className="input" value={addr.ville} onChange={e => setAddr({ ...addr, ville: e.target.value })}/></div>
            <div className="field" style={{ gridColumn: 'span 2' }}>
              <label className="field-label">Pays</label>
              <select className="select" value={addr.pays} onChange={e => setAddr({ ...addr, pays: e.target.value })}>
                <option>France</option><option>Belgique</option><option>Suisse</option><option>Luxembourg</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Historique des factures */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '18px 20px 12px' }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Historique des factures</div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>Toutes vos factures depuis la création du compte</div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Référence</th>
              <th className="num">Montant TTC</th>
              <th>Type</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {factures.map(f => (
              <tr key={f.ref}>
                <td className="muted">{f.date}</td>
                <td className="tnum" style={{ fontWeight: 500 }}>{f.ref}</td>
                <td className="num tnum" style={{ fontWeight: 500 }}>{f.montant.toFixed(2).replace('.', ',')} €</td>
                <td>
                  <span className="badge" style={{
                    background: f.type === 'inscription' ? 'var(--burgundy-50)' : 'var(--info-bg)',
                    color: f.type === 'inscription' ? 'var(--burgundy-800)' : '#1e40af',
                  }}>
                    {f.type === 'inscription' ? 'Inscription' : 'Dérogation'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-icon btn-sm btn-ghost" title="Télécharger">
                    <Icon.Download size={13}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary">
          <Icon.Check size={14}/> Enregistrer
        </button>
      </div>
    </div>
  );
};

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    style={{
      width: 38, height: 22, borderRadius: 999,
      background: checked ? 'var(--burgundy-800)' : 'var(--slate-300)',
      border: 'none', cursor: 'pointer',
      position: 'relative',
      transition: 'background .15s',
      flexShrink: 0,
    }}
  >
    <span style={{
      position: 'absolute',
      top: 2, left: checked ? 18 : 2,
      width: 18, height: 18,
      background: '#fff', borderRadius: '50%',
      transition: 'left .15s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    }}/>
  </button>
);

// 3 — Mot de passe
const CompteMotDePasse = () => {
  const [current, setCurrent] = React.useState('');
  const [next, setNext]       = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [showNew, setShowNew] = React.useState(false);

  // Calcul de force
  const strength = passwordStrength(next);
  const match    = confirm.length > 0 && confirm === next;
  const mismatch = confirm.length > 0 && confirm !== next;
  const canSubmit = current.length >= 6 && strength.score >= 2 && match;

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="card" style={{ padding: 28 }}>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>Mettre à jour mon mot de passe</div>
        <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 22 }}>
          Pour des raisons de sécurité, votre mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.
        </div>

        <div className="field" style={{ marginBottom: 14 }}>
          <label className="field-label">Mot de passe actuel</label>
          <input type="password" className="input" value={current} onChange={e => setCurrent(e.target.value)} placeholder="••••••••"/>
        </div>

        <div className="field" style={{ marginBottom: 14 }}>
          <label className="field-label">Nouveau mot de passe</label>
          <div style={{ position: 'relative' }}>
            <input type={showNew ? 'text' : 'password'} className="input" value={next} onChange={e => setNext(e.target.value)} placeholder="••••••••" style={{ paddingRight: 38 }}/>
            <button type="button" onClick={() => setShowNew(s => !s)} style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              width: 28, height: 28, background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 4,
            }}>
              {showNew ? <Icon.EyeOff size={15}/> : <Icon.Eye size={15}/>}
            </button>
          </div>
          {next.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 4, borderRadius: 999,
                    background: i < strength.score ? strength.color : 'var(--slate-200)',
                    transition: 'background .15s',
                  }}/>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: strength.color, fontWeight: 500 }}>{strength.label}</span>
                <span style={{ color: 'var(--fg-muted)' }}>{strength.hint}</span>
              </div>
            </div>
          )}
        </div>

        <div className="field" style={{ marginBottom: 0 }}>
          <label className="field-label">Confirmer le nouveau mot de passe</label>
          <input type="password" className="input" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••"
            style={{ borderColor: mismatch ? 'var(--danger)' : (match ? 'var(--success)' : 'var(--border)') }}/>
          {mismatch && <span className="field-error">Les mots de passe ne correspondent pas</span>}
          {match    && <span className="field-hint" style={{ color: 'var(--success)' }}><Icon.Check size={11}/> Les mots de passe correspondent</span>}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <button disabled={!canSubmit} className="btn btn-primary">
          <Icon.Lock size={14}/> Mettre à jour le mot de passe
        </button>
      </div>
    </div>
  );
};

// Calcul de force du mot de passe (score 0..4)
function passwordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: 'var(--slate-300)', hint: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score = Math.min(4, score + 1);

  if (score <= 1) return { score: 1, label: 'Faible',  color: 'var(--danger)',  hint: 'Min. 8 caractères, majuscule, chiffre' };
  if (score === 2) return { score: 2, label: 'Moyen',   color: '#d97706',        hint: 'Ajoutez un caractère spécial' };
  if (score === 3) return { score: 3, label: 'Fort',    color: '#16a34a',        hint: 'Bon !' };
  return                 { score: 4, label: 'Excellent', color: '#16a34a',       hint: 'Mot de passe robuste' };
}

const ProducteurGeneric = ({ title, sub, icon }) => (
  <div>
    <PageHeader title={title} subtitle={sub} breadcrumb={['Mon espace', title]}/>
    <div className="card" style={{ padding: 60, textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>{icon}</div>
      <div className="display" style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: 'var(--fg-muted)' }}>Module à détailler avec le client.</div>
    </div>
  </div>
);

Object.assign(window, { ProducteurDashboard, ProducteurInscription, ProducteurInscriptionsList, ProducteurInscriptionDetail, ProducteurMedailles, ProducteurCommandes, ProducteurCommandesHistorique, ProducteurDerogations, ProducteurCompte, CompteMotDePasse, ProducteurGeneric });
