// Builder visuel drag-and-drop — En-têtes & Pieds de page d'emails
// Expose: BLOCK_TYPES, BlockPreview, HFBuilderModal, INITIAL_HEADERS, INITIAL_FOOTERS, mkBlock

// ── Types de blocs disponibles dans la palette ─────────────────────────
const BLOCK_TYPES = [
  { type: 'logo',    label: 'Logo + Nom',      icon: 'Award',      desc: "Logo et nom de l'organisation" },
  { type: 'text',    label: 'Texte',           icon: 'FileText',   desc: 'Bloc de texte libre' },
  { type: 'divider', label: 'Séparateur',      icon: 'Minus',      desc: 'Ligne horizontale' },
  { type: 'spacer',  label: 'Espacement',      icon: 'Layers',     desc: 'Espace vertical' },
  { type: 'button',  label: 'Bouton',          icon: 'ArrowRight', desc: "Bouton d'action" },
  { type: 'social',  label: 'Réseaux sociaux', icon: 'Globe',      desc: 'Icônes réseaux sociaux' },
  { type: 'address', label: 'Coordonnées',     icon: 'Building',   desc: 'Adresse et contacts' },
];

const BLOCK_DEFAULTS = {
  logo:    { name: 'Comité des Salons et Concours de Mâcon', tagline: '', bg: '#531442', color: '#ffffff', align: 'center', showLogo: true, showName: true },
  text:    { content: 'Votre texte ici', align: 'center', size: 13, color: '#334155', bold: false, italic: false },
  divider: { color: '#e2e8f0', thickness: 1, margin: 12 },
  spacer:  { height: 20 },
  button:  { text: 'En savoir plus', color: '#ffffff', bg: '#531442', align: 'center', radius: 6 },
  social:  { facebook: true, twitter: false, instagram: true, linkedin: false, youtube: false },
  address: { content: 'Maison des Vins · 71000 Mâcon · France\ncontact@comite-macon.fr', align: 'center', size: 11, color: '#94a3b8' },
};

let _hfIdSeq = 1000;
const mkBlock = (type, overrides = {}) => ({
  id: 'hfblk-' + (++_hfIdSeq),
  type,
  props: { ...BLOCK_DEFAULTS[type], ...overrides },
});

// ── Données initiales ──────────────────────────────────────────────────
const INITIAL_HEADERS = [
  {
    id: 'hdr-standard',
    name: 'En-tête standard',
    defaut: true,
    bg: '#531442',
    blocks: [
      mkBlock('logo', { bg: '#531442', color: '#fff' }),
    ],
  },
  {
    id: 'hdr-minimal',
    name: 'En-tête minimaliste',
    defaut: false,
    bg: '#ffffff',
    blocks: [
      mkBlock('logo', { bg: '#ffffff', color: '#531442', tagline: 'Salons & Concours' }),
      mkBlock('divider', { color: '#531442', thickness: 2, margin: 0 }),
    ],
  },
];

const INITIAL_FOOTERS = [
  {
    id: 'ftr-standard',
    name: 'Pied de page standard',
    defaut: true,
    bg: '#f8fafc',
    blocks: [
      mkBlock('divider', { color: '#e2e8f0', margin: 4 }),
      mkBlock('text', { content: 'Comité des Salons et Concours de Mâcon', align: 'center', size: 12, bold: true, color: '#475569' }),
      mkBlock('address'),
      mkBlock('social'),
      mkBlock('spacer', { height: 6 }),
      mkBlock('text', { content: 'Pour ne plus recevoir nos emails, désabonnez-vous ici.', align: 'center', size: 11, color: '#94a3b8', italic: true }),
    ],
  },
];

// ── Rendu d'un bloc (utilisé dans le builder ET dans la prévisualisation email) ──
const BlockPreview = ({ block }) => {
  const { type, props } = block;

  if (type === 'logo') return (
    <div style={{ background: props.bg, padding: '15px 24px', display: 'flex', alignItems: 'center', justifyContent: props.align === 'center' ? 'center' : props.align === 'right' ? 'flex-end' : 'flex-start', gap: 11 }}>
      {props.showLogo && (
        <div style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <img src="OR-2025.webp" style={{ width: 24, height: 24, objectFit: 'contain' }} alt=""/>
        </div>
      )}
      {props.showName && (
        <div>
          <div style={{ color: props.color, fontWeight: 700, fontSize: 13.5, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{props.name}</div>
          {props.tagline && <div style={{ color: props.color, opacity: 0.65, fontSize: 10.5, marginTop: 1 }}>{props.tagline}</div>}
        </div>
      )}
    </div>
  );

  if (type === 'text') return (
    <div style={{ padding: '5px 24px', textAlign: props.align, fontSize: props.size, color: props.color, fontWeight: props.bold ? 600 : 400, fontStyle: props.italic ? 'italic' : 'normal', lineHeight: 1.55 }}>
      {props.content}
    </div>
  );

  if (type === 'divider') return (
    <div style={{ padding: `${props.margin}px 0` }}>
      <div style={{ height: props.thickness, background: props.color, margin: '0 24px' }}/>
    </div>
  );

  if (type === 'spacer') return <div style={{ height: props.height }}/>;

  if (type === 'button') return (
    <div style={{ padding: '10px 24px', textAlign: props.align }}>
      <span style={{ display: 'inline-block', padding: '9px 20px', background: props.bg, color: props.color, borderRadius: props.radius, fontSize: 13, fontWeight: 600 }}>{props.text}</span>
    </div>
  );

  if (type === 'social') {
    const nets = [
      { key: 'facebook', label: 'FB', color: '#1877F2' },
      { key: 'instagram', label: 'IG', color: '#E1306C' },
      { key: 'twitter', label: 'X', color: '#14171A' },
      { key: 'linkedin', label: 'in', color: '#0A66C2' },
      { key: 'youtube', label: 'YT', color: '#FF0000' },
    ].filter(n => props[n.key]);
    return (
      <div style={{ padding: '8px 24px', display: 'flex', gap: 7, justifyContent: 'center' }}>
        {nets.map(n => (
          <div key={n.key} style={{ width: 26, height: 26, borderRadius: '50%', background: n.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, userSelect: 'none', letterSpacing: '-0.02em' }}>
            {n.label}
          </div>
        ))}
        {nets.length === 0 && <span style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>Aucun réseau sélectionné</span>}
      </div>
    );
  }

  if (type === 'address') return (
    <div style={{ padding: '4px 24px', textAlign: props.align, fontSize: props.size, color: props.color, lineHeight: 1.65, whiteSpace: 'pre-line' }}>
      {props.content}
    </div>
  );

  return null;
};

// ── Panneau de propriétés du bloc sélectionné ──────────────────────────
const BlockPropsPanel = ({ block, onChange }) => {
  if (!block) return (
    <div style={{ textAlign: 'center', paddingTop: 24, color: 'var(--fg-subtle)' }}>
      <Icon.Sliders size={18} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.35 }}/>
      <span style={{ fontSize: 12 }}>Cliquez sur un bloc pour éditer ses propriétés</span>
    </div>
  );

  const { type, props: p } = block;
  const upd = (k, v) => onChange({ ...block, props: { ...p, [k]: v } });
  const col = { display: 'flex', flexDirection: 'column', gap: 5 };
  const lbl = { fontSize: 11.5, fontWeight: 600, color: 'var(--fg-muted)' };
  const chk = { display: 'flex', gap: 8, alignItems: 'center', fontSize: 12.5, cursor: 'pointer', userSelect: 'none' };

  const ColorRow = ({ label, value, prop }) => (
    <div style={col}>
      <span style={lbl}>{label}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input type="color" value={value} onChange={e => upd(prop, e.target.value)}
          style={{ width: 30, height: 26, border: '1px solid var(--border)', borderRadius: 4, cursor: 'pointer', padding: 2, flexShrink: 0 }}/>
        <input className="input input-sm" value={value} onChange={e => upd(prop, e.target.value)}
          style={{ flex: 1, fontFamily: 'monospace', fontSize: 11.5 }}/>
      </div>
    </div>
  );

  const AlignBtns = ({ value, prop }) => (
    <div style={col}>
      <span style={lbl}>Alignement</span>
      <div style={{ display: 'flex', gap: 3 }}>
        {[['left','←'],['center','↔'],['right','→']].map(([a, sym]) => (
          <button key={a} type="button" onClick={() => upd(prop, a)}
            style={{ flex: 1, padding: '4px 0', fontSize: 13, border: '1px solid var(--border)', borderRadius: 5, background: value === a ? 'var(--burgundy-800)' : 'var(--bg)', color: value === a ? '#fff' : 'var(--fg)', cursor: 'pointer', transition: 'all .1s' }}>
            {sym}
          </button>
        ))}
      </div>
    </div>
  );

  if (type === 'logo') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div style={col}><span style={lbl}>Nom affiché</span><input className="input input-sm" value={p.name} onChange={e => upd('name', e.target.value)}/></div>
      <div style={col}><span style={lbl}>Tagline (optionnel)</span><input className="input input-sm" value={p.tagline || ''} onChange={e => upd('tagline', e.target.value)} placeholder="Salons & Concours"/></div>
      <ColorRow label="Fond" value={p.bg} prop="bg"/>
      <ColorRow label="Couleur du texte" value={p.color} prop="color"/>
      <label style={chk}><input type="checkbox" checked={p.showLogo} onChange={e => upd('showLogo', e.target.checked)} style={{ accentColor: 'var(--burgundy-800)' }}/> Afficher le logo</label>
      <label style={chk}><input type="checkbox" checked={p.showName} onChange={e => upd('showName', e.target.checked)} style={{ accentColor: 'var(--burgundy-800)' }}/> Afficher le nom</label>
      <AlignBtns value={p.align} prop="align"/>
    </div>
  );

  if (type === 'text') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div style={col}><span style={lbl}>Contenu</span><textarea className="input" value={p.content} onChange={e => upd('content', e.target.value)} rows={3} style={{ resize: 'vertical', fontSize: 12.5 }}/></div>
      <div style={col}>
        <span style={lbl}>Taille : {p.size}px</span>
        <input type="range" min={9} max={24} value={p.size} onChange={e => upd('size', +e.target.value)} style={{ accentColor: 'var(--burgundy-800)', width: '100%' }}/>
      </div>
      <ColorRow label="Couleur" value={p.color} prop="color"/>
      <AlignBtns value={p.align} prop="align"/>
      <div style={{ display: 'flex', gap: 12 }}>
        <label style={chk}><input type="checkbox" checked={p.bold} onChange={e => upd('bold', e.target.checked)} style={{ accentColor: 'var(--burgundy-800)' }}/> <strong>Gras</strong></label>
        <label style={chk}><input type="checkbox" checked={p.italic} onChange={e => upd('italic', e.target.checked)} style={{ accentColor: 'var(--burgundy-800)' }}/> <em>Italique</em></label>
      </div>
    </div>
  );

  if (type === 'divider') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <ColorRow label="Couleur" value={p.color} prop="color"/>
      <div style={col}>
        <span style={lbl}>Épaisseur : {p.thickness}px</span>
        <input type="range" min={1} max={6} value={p.thickness} onChange={e => upd('thickness', +e.target.value)} style={{ accentColor: 'var(--burgundy-800)', width: '100%' }}/>
      </div>
      <div style={col}>
        <span style={lbl}>Marge verticale : {p.margin}px</span>
        <input type="range" min={0} max={40} value={p.margin} onChange={e => upd('margin', +e.target.value)} style={{ accentColor: 'var(--burgundy-800)', width: '100%' }}/>
      </div>
    </div>
  );

  if (type === 'spacer') return (
    <div style={col}>
      <span style={lbl}>Hauteur : {p.height}px</span>
      <input type="range" min={4} max={100} value={p.height} onChange={e => upd('height', +e.target.value)} style={{ accentColor: 'var(--burgundy-800)', width: '100%' }}/>
    </div>
  );

  if (type === 'button') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div style={col}><span style={lbl}>Texte du bouton</span><input className="input input-sm" value={p.text} onChange={e => upd('text', e.target.value)}/></div>
      <ColorRow label="Fond du bouton" value={p.bg} prop="bg"/>
      <ColorRow label="Couleur du texte" value={p.color} prop="color"/>
      <div style={col}>
        <span style={lbl}>Arrondi : {p.radius}px</span>
        <input type="range" min={0} max={24} value={p.radius} onChange={e => upd('radius', +e.target.value)} style={{ accentColor: 'var(--burgundy-800)', width: '100%' }}/>
      </div>
      <AlignBtns value={p.align} prop="align"/>
    </div>
  );

  if (type === 'social') {
    const nets = [
      { key: 'facebook', label: 'Facebook' }, { key: 'instagram', label: 'Instagram' },
      { key: 'twitter',  label: 'X (Twitter)' }, { key: 'linkedin', label: 'LinkedIn' },
      { key: 'youtube',  label: 'YouTube' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={lbl}>Réseaux à afficher</span>
        {nets.map(n => (
          <label key={n.key} style={chk}>
            <input type="checkbox" checked={p[n.key] || false} onChange={e => upd(n.key, e.target.checked)} style={{ accentColor: 'var(--burgundy-800)' }}/> {n.label}
          </label>
        ))}
      </div>
    );
  }

  if (type === 'address') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div style={col}><span style={lbl}>Contenu (entrée = nouvelle ligne)</span><textarea className="input" value={p.content} onChange={e => upd('content', e.target.value)} rows={4} style={{ resize: 'vertical', fontSize: 11.5, fontFamily: 'monospace' }}/></div>
      <div style={col}>
        <span style={lbl}>Taille : {p.size}px</span>
        <input type="range" min={9} max={16} value={p.size} onChange={e => upd('size', +e.target.value)} style={{ accentColor: 'var(--burgundy-800)', width: '100%' }}/>
      </div>
      <ColorRow label="Couleur" value={p.color} prop="color"/>
    </div>
  );

  return null;
};

// ── Indicateur visuel de zone de dépôt entre les blocs ────────────────
const DropZoneIndicator = ({ active, onDragOver, onDrop }) => (
  <div onDragOver={onDragOver} onDrop={onDrop}
    style={{ height: active ? 34 : 6, transition: 'height .1s ease', position: 'relative', flexShrink: 0 }}>
    {active && (
      <div style={{ position: 'absolute', inset: '3px 0', background: 'rgba(83,20,66,.07)', border: '2px dashed var(--burgundy-800)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ height: 2, width: 28, background: 'var(--burgundy-800)', borderRadius: 1 }}/>
      </div>
    )}
  </div>
);

// ── Modal builder principal ────────────────────────────────────────────
const HFBuilderModal = ({ type, item, onSave, onClose }) => {
  const isHeader = type === 'header';
  const [name, setName]     = React.useState(item?.name || (isHeader ? 'Nouvel en-tête' : 'Nouveau pied de page'));
  const [bg, setBg]         = React.useState(item?.bg   || (isHeader ? '#531442' : '#f8fafc'));
  const [blocks, setBlocks] = React.useState(() => item?.blocks ? JSON.parse(JSON.stringify(item.blocks)) : []);
  const [selectedId, setSelectedId]     = React.useState(null);
  const [hoverBlockId, setHoverBlockId] = React.useState(null);
  const [dragOverIdx, setDragOverIdx]   = React.useState(null);
  const dragInfo = React.useRef(null);

  const selectedBlock = blocks.find(b => b.id === selectedId) || null;
  const updateBlock   = (updated) => setBlocks(prev => prev.map(b => b.id === updated.id ? updated : b));
  const deleteBlock   = (id) => { setBlocks(prev => prev.filter(b => b.id !== id)); if (selectedId === id) setSelectedId(null); };

  const handlePaletteDragStart = (blockType) => { dragInfo.current = { source: 'palette', blockType }; };
  const handleCanvasDragStart  = (e, idx)    => { dragInfo.current = { source: 'canvas', idx }; e.dataTransfer.effectAllowed = 'move'; };
  const handleDragEnd          = ()          => { setDragOverIdx(null); dragInfo.current = null; };

  const handleDragOver = (e, insertIdx) => { e.preventDefault(); setDragOverIdx(insertIdx); };
  const handleDrop     = (e, insertIdx) => {
    e.preventDefault();
    const info = dragInfo.current;
    if (!info) { setDragOverIdx(null); return; }
    if (info.source === 'palette') {
      const nb = mkBlock(info.blockType);
      setBlocks(prev => { const n = [...prev]; n.splice(insertIdx, 0, nb); return n; });
      setSelectedId(nb.id);
    } else {
      const from = info.idx;
      setBlocks(prev => {
        const n = [...prev];
        const [moved] = n.splice(from, 1);
        const at = insertIdx > from ? insertIdx - 1 : insertIdx;
        n.splice(at, 0, moved);
        return n;
      });
    }
    setDragOverIdx(null);
    dragInfo.current = null;
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(15,23,42,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg)', borderRadius: 14, width: '100%', maxWidth: 1100, height: '95vh', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 64px rgba(0,0,0,.22)', overflow: 'hidden' }}>

        {/* ── Barre d'outils ── */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {isHeader ? <Icon.Layers size={13}/> : <Icon.List size={13}/>}
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-muted)', flexShrink: 0 }}>Builder email</span>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom du modèle…"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 16, fontWeight: 600, color: 'var(--fg)', fontFamily: 'inherit', letterSpacing: '-0.01em', minWidth: 0 }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', border: '1px solid var(--border)', borderRadius: 7, height: 32, flexShrink: 0 }}>
            <span style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>Fond</span>
            <input type="color" value={bg} onChange={e => setBg(e.target.value)} style={{ width: 20, height: 16, border: 'none', cursor: 'pointer', padding: 0, background: 'transparent' }}/>
            <span style={{ fontSize: 10.5, fontFamily: 'monospace', color: 'var(--fg-muted)' }}>{bg}</span>
          </div>
          <span style={{ flexShrink: 0, padding: '4px 10px', background: isHeader ? 'var(--burgundy-50)' : '#f0fdf4', color: isHeader ? 'var(--burgundy-800)' : '#166534', borderRadius: 5, fontSize: 11.5, fontWeight: 600 }}>
            {isHeader ? 'En-tête' : 'Pied de page'}
          </span>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><Icon.X size={15}/></button>
        </div>

        {/* ── Corps à 3 colonnes ── */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '185px 1fr 210px', minHeight: 0, overflow: 'hidden' }}>

          {/* Palette de blocs */}
          <div style={{ borderRight: '1px solid var(--border)', background: 'var(--surface)', overflow: 'auto' }}>
            <div style={{ padding: '10px 10px 6px', fontSize: 10.5, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Blocs disponibles</div>
            <div style={{ padding: '0 8px 10px' }}>
              {BLOCK_TYPES.map(bt => {
                const Ic = Icon[bt.icon];
                return (
                  <div key={bt.type} draggable
                    onDragStart={() => handlePaletteDragStart(bt.type)}
                    onDragEnd={handleDragEnd}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 8px', borderRadius: 7, marginBottom: 3, border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'grab', fontSize: 12, userSelect: 'none', transition: 'border-color .1s, background .1s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--burgundy-800)'; e.currentTarget.style.background = 'var(--burgundy-50)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg)'; }}>
                    <div style={{ width: 22, height: 22, borderRadius: 5, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {Ic ? <Ic size={11}/> : null}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, lineHeight: 1.2 }}>{bt.label}</div>
                      <div style={{ fontSize: 10, color: 'var(--fg-subtle)', lineHeight: 1.2 }}>{bt.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Canvas de composition */}
          <div style={{ background: '#d8dfe8', overflow: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>
              Glissez depuis la palette · Cliquez pour sélectionner · Réordonnez par glisser-déposer
            </div>
            <div style={{ width: '100%', maxWidth: 560 }}>
              {/* Chrome visuel de client mail */}
              <div style={{ background: '#e8edf3', borderRadius: '8px 8px 0 0', height: 26, display: 'flex', alignItems: 'center', padding: '0 10px', gap: 5 }}>
                {['#ff5f57','#febc2e','#28c840'].map((c,i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }}/>)}
                <div style={{ flex: 1, textAlign: 'center', fontSize: 10, color: '#94a3b8' }}>Aperçu email</div>
              </div>

              {/* Zone de dépôt des blocs */}
              <div style={{ background: bg, minHeight: 64, position: 'relative' }}>
                <DropZoneIndicator active={dragOverIdx === 0} onDragOver={e => handleDragOver(e, 0)} onDrop={e => handleDrop(e, 0)}/>
                {blocks.length === 0 && dragOverIdx === null && (
                  <div style={{ padding: '28px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 12, pointerEvents: 'none' }}>
                    <Icon.Layers size={20} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.4 }}/>
                    Glissez des blocs depuis la palette
                  </div>
                )}
                {blocks.map((block, idx) => (
                  <React.Fragment key={block.id}>
                    <div
                      draggable
                      onDragStart={e => handleCanvasDragStart(e, idx)}
                      onDragEnd={handleDragEnd}
                      onClick={e => { e.stopPropagation(); setSelectedId(block.id === selectedId ? null : block.id); }}
                      onMouseEnter={() => setHoverBlockId(block.id)}
                      onMouseLeave={() => setHoverBlockId(null)}
                      style={{
                        position: 'relative', cursor: 'grab',
                        outline: selectedId === block.id ? '2px solid var(--burgundy-800)' : (hoverBlockId === block.id ? '1px dashed rgba(83,20,66,.5)' : 'none'),
                        outlineOffset: -2,
                      }}>
                      <BlockPreview block={block}/>
                      {/* Badge nom du bloc + bouton suppression */}
                      {(hoverBlockId === block.id || selectedId === block.id) && (
                        <div style={{ position: 'absolute', top: 3, right: 4 }} onClick={e => e.stopPropagation()}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, background: selectedId === block.id ? 'var(--burgundy-800)' : 'rgba(83,20,66,.8)', borderRadius: 5, padding: '2px 5px 2px 7px' }}>
                            <span style={{ fontSize: 9.5, color: '#fff', fontWeight: 600, letterSpacing: '0.03em' }}>
                              {BLOCK_TYPES.find(b => b.type === block.type)?.label}
                            </span>
                            <button type="button" onClick={() => deleteBlock(block.id)}
                              style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,.9)', cursor: 'pointer', padding: '1px 3px', display: 'flex', alignItems: 'center', lineHeight: 1 }}>
                              <Icon.X size={10}/>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <DropZoneIndicator active={dragOverIdx === idx + 1} onDragOver={e => handleDragOver(e, idx + 1)} onDrop={e => handleDrop(e, idx + 1)}/>
                  </React.Fragment>
                ))}
              </div>

              {/* Pied du chrome */}
              <div style={{ background: '#e8edf3', borderRadius: '0 0 8px 8px', height: 24, borderTop: '1px solid #d1d9e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 9.5, color: '#94a3b8', fontStyle: 'italic' }}>Corps de l'email</span>
              </div>
            </div>
          </div>

          {/* Panneau de propriétés */}
          <div style={{ borderLeft: '1px solid var(--border)', background: 'var(--surface)', overflow: 'auto' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Propriétés</div>
              {selectedBlock && <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 2 }}>{BLOCK_TYPES.find(b => b.type === selectedBlock.type)?.label}</div>}
            </div>
            <div style={{ padding: 14 }}>
              <BlockPropsPanel block={selectedBlock} onChange={updateBlock}/>
            </div>
          </div>
        </div>

        {/* ── Pied du modal ── */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{blocks.length} bloc{blocks.length !== 1 ? 's' : ''}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline" onClick={onClose}>Annuler</button>
            <button className="btn btn-primary" style={{ background: 'var(--burgundy-800)' }}
              disabled={!name.trim()}
              onClick={() => {
                onSave({ id: item?.id || ('hf-' + (++_hfIdSeq)), name: name.trim(), bg, blocks, defaut: item?.defaut || false });
                onClose();
              }}>
              <Icon.Check size={13}/> Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { BLOCK_TYPES, BlockPreview, HFBuilderModal, INITIAL_HEADERS, INITIAL_FOOTERS, mkBlock });
