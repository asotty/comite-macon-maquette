// Admin · Contrôle optimisé — file de travail dédiée (≠ tab Contrôle d'une fiche)
// Périmètre : tous les dossiers à traiter. Tri par défaut : Score OCR croissant.

const AdminControleOptimise = ({ concours = 'France', onOpenDossier }) => {
  const [tab, setTab] = React.useState('a-controler');
  const [ctrlState, setCtrlState] = React.useState('idle'); // idle | confirm | running | done
  const [ctrlProgress, setCtrlProgress] = React.useState(0);
  const TOTAL_SOUMIS = 142;

  React.useEffect(() => {
    if (ctrlState !== 'running') return;
    setCtrlProgress(0);
    const t = setInterval(() => {
      setCtrlProgress(p => {
        const next = p + Math.max(1, Math.round((TOTAL_SOUMIS - p) * 0.08));
        if (next >= TOTAL_SOUMIS) { clearInterval(t); setCtrlState('done'); return TOTAL_SOUMIS; }
        return next;
      });
    }, 180);
    return () => clearInterval(t);
  }, [ctrlState]);

  // [ref, producteur, region, ech, scoreOCR, statut (a-controler|soumis), lastAction]
  const allRows = [
    ['INS-2026-0184', 'Domaine de la Chevalière',  'Mâconnais',         8, 32, 'a-controler', 'Contrôle lancé il y a 2h'],
    ['INS-2026-0166', 'Domaine Tabard',             'Beaujolais',        3, 41, 'a-controler', 'Ouvert par Sophie L. · 14h22'],
    ['INS-2026-0158', 'Vignobles Lacroix',          'Côte Chalonnaise', 12, 48, 'a-controler', 'Document manquant signalé'],
    ['INS-2026-0182', 'Maison Joseph Drouhin',      'Côte de Beaune',   22, 56, 'a-controler', 'Contrôle lancé il y a 4h'],
    ['INS-2026-0177', 'Domaine Sainte-Anne',        'Mâconnais',         5, 63, 'a-controler', 'OCR partiel · 3 champs incertains'],
    ['INS-2026-0171', 'Château de Pierreclos',      'Mâconnais',        14, 68, 'a-controler', 'Contrôle lancé il y a 1h'],
    ['INS-2026-0169', 'Cellier de Solutré',         'Mâconnais',         6, 74, 'a-controler', 'Aucun écart détecté'],
    ['INS-2026-0163', 'Domaine Bouchard Père',      'Côte de Beaune',   18, 81, 'soumis',      'Soumis il y a 12 min'],
    ['INS-2026-0162', 'Château Pied-de-Rieux',      'Beaujolais',        4, 87, 'soumis',      'Soumis il y a 28 min'],
    ['INS-2026-0161', 'Domaine des 3 Pierres',      'Mâconnais',         9, 91, 'soumis',      'Soumis il y a 1h'],
    ['INS-2026-0159', 'Domaine de la Verrière',     'Beaujolais',        7, 94, 'soumis',      'Soumis il y a 2h'],
    ['INS-2026-0157', 'Vignerons de Buxy',          'Côte Chalonnaise', 11, 96, 'soumis',      'Soumis il y a 3h'],
  ];

  const tabCounts = { 'a-controler': 47, soumis: 142, traites: 18, tous: 207 };
  const tabsDef = [
    { id: 'a-controler', label: 'À contrôler' },
    { id: 'soumis',      label: 'Soumis' },
    { id: 'traites',     label: "Traités aujourd'hui" },
    { id: 'tous',        label: 'Tous' },
  ];

  const filtered = allRows.filter(r => {
    if (tab === 'a-controler') return r[5] === 'a-controler';
    if (tab === 'soumis')      return r[5] === 'soumis';
    if (tab === 'traites')     return false; // mode "Traités aujourd'hui" — vue dédiée
    return true;
  });
  const paged = useSortablePaged(filtered, {
    defaultSort: 'score', defaultDir: 'asc',
    defaultPageSize: 25,
    accessors: {
      ref: r => r[0], producteur: r => r[1], region: r => r[2],
      ech: r => r[3], score: r => r[4], statut: r => r[5],
    },
  });
  const rows = paged.rows;

  return (
    <div data-screen-label="admin-controle-optimise">
      <PageHeader
        title="Contrôle optimisé"
        subtitle={`Concours ${concours} 2026 · 47 dossiers à traiter · 142 soumis en attente`}
        breadcrumb={['Administration', `Concours ${concours}`, 'Contrôle optimisé']}
        actions={<>
          <button className="btn btn-outline btn-sm"><Icon.Download size={14}/> Export</button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setCtrlState('confirm')}
            disabled={ctrlState === 'running'}
            style={{ background: 'var(--burgundy-800)' }}
          >
            <Icon.Sparkles size={14}/> Contrôle auto ({TOTAL_SOUMIS} soumis)
          </button>
        </>}
      />

      {ctrlState === 'confirm' && (
        <CtrlConfirmDialog total={TOTAL_SOUMIS} onCancel={() => setCtrlState('idle')} onConfirm={() => setCtrlState('running')}/>
      )}

      {ctrlState === 'running' && (
        <RunningBanner progress={ctrlProgress} total={TOTAL_SOUMIS} onCancel={() => setCtrlState('idle')}/>
      )}

      {ctrlState === 'done' && (
        <ResultBanner
          validated={98}
          aControler={36}
          rejected={8}
          onSeeAControler={() => { setTab('a-controler'); setCtrlState('idle'); }}
          onDismiss={() => setCtrlState('idle')}
        />
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, borderBottom: '1px solid var(--border)', marginBottom: 18 }}>
        {tabsDef.map(t => {
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
              <span style={{
                fontSize: 11, padding: '0 6px', borderRadius: 999,
                background: active ? 'var(--burgundy-50)' : 'var(--slate-100)',
                color: active ? 'var(--burgundy-800)' : 'var(--fg-muted)',
                fontWeight: 500,
              }}>{tabCounts[t.id]}</span>
            </button>
          );
        })}
      </div>

      {/* Helper bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div className="input-with-icon" style={{ flex: 1, maxWidth: 320 }}>
          <Icon.Search size={14} className="input-icon"/>
          <input className="input" placeholder="Rechercher producteur, n° inscription…"/>
        </div>
        <button className="btn btn-outline btn-sm"><Icon.Filter size={13}/> Région</button>
        <button className="btn btn-outline btn-sm"><Icon.AlertTriangle size={13}/> Score OCR</button>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>
          Cliquez sur une colonne pour trier · les plus problématiques en premier
        </span>
      </div>

      {/* Empty state for "Traités aujourd'hui" placeholder */}
      {tab === 'traites' && rows.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 999, background: 'var(--slate-100)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-muted)', marginBottom: 12 }}>
            <Icon.Check size={20}/>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)', marginBottom: 4 }}>18 dossiers traités aujourd'hui</div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>Validés ou rejetés par Sophie L., Marc R., Camille T.</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 30 }}><input type="checkbox" style={{ accentColor: 'var(--burgundy-800)' }}/></th>
                <SortableTh sortKey="ref"        currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>N° inscription</SortableTh>
                <SortableTh sortKey="producteur" currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Producteur · Région</SortableTh>
                <SortableTh sortKey="ech"        currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort} align="right">Échant.</SortableTh>
                <SortableTh sortKey="score"      currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Score OCR</SortableTh>
                <SortableTh sortKey="statut"     currentKey={paged.sortKey} currentDir={paged.sortDir} onSort={paged.onSort}>Statut</SortableTh>
                <th>Dernière action</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r[0]} style={{ cursor: 'pointer' }} onClick={() => onOpenDossier && onOpenDossier(r[0])}>
                  <td onClick={e => e.stopPropagation()}><input type="checkbox" style={{ accentColor: 'var(--burgundy-800)' }}/></td>
                  <td><code style={{ fontSize: 12, color: 'var(--burgundy-800)', fontFamily: 'Menlo, monospace' }}>{r[0]}</code></td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--fg)' }}>{r[1]}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>{r[2]}</div>
                  </td>
                  <td className="num tnum">{r[3]}</td>
                  <td><ScoreOCRCell score={r[4]}/></td>
                  <td>
                    {r[5] === 'a-controler'
                      ? <span className="badge badge-warning" style={{ whiteSpace: 'nowrap' }}><Icon.AlertCircle size={11}/> À contrôler</span>
                      : <span className="badge badge-info"    style={{ whiteSpace: 'nowrap' }}><Icon.Clock size={11}/> Soumis</span>
                    }
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>{r[6]}</td>
                  <td>
                    <button
                      className="btn btn-icon btn-sm btn-ghost"
                      title="Ouvrir le tab Contrôle"
                      onClick={e => { e.stopPropagation(); onOpenDossier && onOpenDossier(r[0]); }}
                    >
                      <Icon.ChevronRight size={14}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TablePagination {...paged}/>
    </div>
  );
};

// ─── Score OCR cell ────────────────────────────────────────────────

const ScoreOCRCell = ({ score }) => {
  const color = score < 50 ? '#dc2626' : score < 80 ? '#d97706' : '#16a34a';
  const bg    = score < 50 ? '#fef2f2' : score < 80 ? '#fffbeb' : '#f0fdf4';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 110 }}>
      <div style={{ flex: 1, height: 6, background: 'var(--slate-100)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 999, transition: 'width .3s' }}/>
      </div>
      <span className="tnum" style={{
        fontSize: 11.5, fontWeight: 600, color,
        padding: '1px 6px', borderRadius: 4, background: bg,
        minWidth: 38, textAlign: 'center',
      }}>{score}%</span>
    </div>
  );
};

// ─── Confirm dialog (lancer le contrôle auto) ──────────────────────

const CtrlConfirmDialog = ({ total, onCancel, onConfirm }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,15,15,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={onCancel}>
    <div className="card" style={{ width: 440, padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
      <div style={{ padding: '20px 24px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.Sparkles size={16}/>
          </span>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Lancer le contrôle automatique</h3>
        </div>
        <p style={{ margin: '8px 0 0 42px', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.5 }}>
          L'OCR sera lancé sur <strong style={{ color: 'var(--fg)' }}>{total} dossiers soumis</strong>.
          Chaque dossier est analysé en moyenne en 2 secondes.
        </p>
      </div>
      <div style={{ padding: '16px 24px', background: 'var(--slate-50)', fontSize: 12.5, color: 'var(--fg-muted)' }}>
        Les dossiers avec un score OCR &lt; 80% seront marqués <strong style={{ color: 'var(--fg)' }}>« À contrôler »</strong>.
        Vous pouvez continuer à travailler pendant l'analyse.
      </div>
      <div style={{ padding: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button className="btn btn-outline btn-sm" onClick={onCancel}>Annuler</button>
        <button className="btn btn-primary btn-sm" onClick={onConfirm} style={{ background: 'var(--burgundy-800)' }}>
          <Icon.Sparkles size={13}/> Lancer
        </button>
      </div>
    </div>
  </div>
);

// ─── Running banner (non-bloquant) ─────────────────────────────────

const RunningBanner = ({ progress, total, onCancel }) => {
  const pct = Math.round((progress / total) * 100);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '12px 16px',
      background: '#fffbeb',
      border: '1px solid #fde68a',
      borderRadius: 8,
      marginBottom: 18,
    }}>
      <span style={{ width: 32, height: 32, borderRadius: 8, background: '#fde68a', color: '#78350f', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon.Sparkles size={15}/>
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#78350f', marginBottom: 4 }}>
          Contrôle automatique en cours · {progress}/{total} dossiers
        </div>
        <div style={{ height: 4, background: '#fef3c7', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: '#d97706', transition: 'width .2s' }}/>
        </div>
      </div>
      <span className="tnum" style={{ fontSize: 12, color: '#78350f', fontWeight: 600, minWidth: 38, textAlign: 'right' }}>{pct}%</span>
      <button className="btn btn-icon btn-sm btn-ghost" onClick={onCancel} title="Annuler"><Icon.X size={13}/></button>
    </div>
  );
};

// ─── Result banner (après contrôle auto) ───────────────────────────

const ResultBanner = ({ validated, aControler, rejected, onSeeAControler, onDismiss }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '14px 16px',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: 8,
    marginBottom: 18,
  }}>
    <span style={{ width: 32, height: 32, borderRadius: 8, background: '#bbf7d0', color: '#166534', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon.Check size={16}/>
    </span>
    <div style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: 'var(--fg)' }}>
      <strong style={{ color: '#166534' }}>Contrôle terminé</strong>
      <span style={{ color: 'var(--fg-muted)' }}>
        {' — '}
        <strong style={{ color: '#166534' }}>{validated}</strong> validés ·
        {' '}<strong style={{ color: '#78350f' }}>{aControler}</strong> à contrôler ·
        {' '}<strong style={{ color: '#991b1b' }}>{rejected}</strong> rejetés
      </span>
    </div>
    <button className="btn btn-primary btn-sm" onClick={onSeeAControler} style={{ background: 'var(--burgundy-800)' }}>
      Voir les {aControler} dossiers à contrôler <Icon.ArrowRight size={13}/>
    </button>
    <button className="btn btn-icon btn-sm btn-ghost" onClick={onDismiss} title="Fermer"><Icon.X size={13}/></button>
  </div>
);

Object.assign(window, { AdminControleOptimise });
