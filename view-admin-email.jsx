// Email groupé — modal multi-étapes (compose → preview → confirm)

const TEMPLATES = {
  relance: {
    label: 'Relance paiement',
    subject: 'Concours des Grands Vins de France 2026 — Relance de paiement',
    body: `Bonjour {prenom},

Votre dossier INS-{numero_dossier} pour le Concours des Grands Vins de France 2026 a bien été enregistré, mais nous n'avons pas encore reçu votre règlement.

Merci de procéder au paiement depuis votre espace producteur : {lien_espace}

Cordialement,
Le Comité des Salons et Concours de Mâcon`,
  },
  complements: {
    label: 'Demande de compléments',
    subject: 'Concours des Grands Vins de France 2026 — Votre dossier nécessite des compléments',
    body: `Bonjour {prenom},

Votre dossier INS-{numero_dossier} est en attente de compléments. Merci de vous reconnecter à votre espace pour fournir les éléments manquants : {lien_espace}

Cordialement,
Le Comité des Salons et Concours de Mâcon`,
  },
  validation: {
    label: 'Confirmation de validation',
    subject: 'Concours des Grands Vins de France 2026 — Votre dossier est validé',
    body: `Bonjour {prenom},

Votre dossier INS-{numero_dossier} a été validé. Vos échantillons sont attendus à l'adresse de réception.

Retrouvez tous les détails sur votre espace : {lien_espace}

Cordialement,
Le Comité des Salons et Concours de Mâcon`,
  },
  perso: { label: 'Message personnalisé', subject: '', body: '' },
};

const VARIABLES = ['{prenom}', '{numero_dossier}', '{lien_espace}'];

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' o';
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' Ko';
  return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
};

const EmailGroupModal = ({ state, setState, selectionCount, currentFilter, rows, onClose }) => {
  // Form state
  const [audience, setAudience] = React.useState(selectionCount > 0 ? 'selection' : 'view');
  const [tplKey, setTplKey] = React.useState('relance');
  const tpl = TEMPLATES[tplKey];
  const [subject, setSubject] = React.useState(tpl.subject);
  const [body, setBody] = React.useState(tpl.body);
  const [attachments, setAttachments] = React.useState([]);
  const defaultSender = EXPEDITEURS_EMAIL.find(e => e.defaut) || EXPEDITEURS_EMAIL[0];
  const [senderId, setSenderId] = React.useState(defaultSender?.id || '');
  const currentSender = EXPEDITEURS_EMAIL.find(e => e.id === senderId) || defaultSender;
  // En-tête & pied de page
  const defaultHeader = INITIAL_HEADERS.find(h => h.defaut) || INITIAL_HEADERS[0];
  const defaultFooter = INITIAL_FOOTERS.find(f => f.defaut) || INITIAL_FOOTERS[0];
  const [headerId, setHeaderId] = React.useState(defaultHeader?.id || 'none');
  const [footerId, setFooterId] = React.useState(defaultFooter?.id || 'none');
  const currentHeader = INITIAL_HEADERS.find(h => h.id === headerId) || null;
  const currentFooter = INITIAL_FOOTERS.find(f => f.id === footerId) || null;
  const [previewIdx, setPreviewIdx] = React.useState(0);

  const handleFileAdd = (e) => {
    const files = Array.from(e.target.files).map(f => ({ name: f.name, size: formatFileSize(f.size) }));
    setAttachments(prev => [...prev, ...files]);
    e.target.value = '';
  };
  const removeAttachment = (idx) => setAttachments(prev => prev.filter((_, i) => i !== idx));

  React.useEffect(() => { setSubject(TEMPLATES[tplKey].subject); setBody(TEMPLATES[tplKey].body); }, [tplKey]);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Audience options
  const audienceOptions = [
    { id: 'selection', label: `Sélection (${selectionCount} producteur${selectionCount > 1 ? 's' : ''})`, count: selectionCount, disabled: selectionCount === 0 },
    { id: 'view', label: `Vue actuelle (${currentFilter} · ${rows.length} dossiers)`, count: rows.length },
    { id: 'soumis', label: 'Tous — Soumis', count: 142 },
    { id: 'verifier', label: 'Tous — À vérifier', count: 47 },
  ];
  const recipientCount = audienceOptions.find(o => o.id === audience)?.count || 0;

  // Mock recipients for preview
  const previewRecipients = [
    { name: 'Marie', email: 'contact@domaine-chevaliere.fr', dossier: 'INS-2026-0184' },
    { name: 'Jean-Paul', email: 'contact@chateau-pied-de-rieux.fr', dossier: 'INS-2026-0183' },
    { name: 'Sophie', email: 'commercial@drouhin.com', dossier: 'INS-2026-0182' },
  ];

  const renderPreview = (i) => {
    const r = previewRecipients[i];
    return {
      to: r.email,
      subject: subject.replace('{prenom}', r.name).replace('{numero_dossier}', r.dossier),
      body: body.replace(/\{prenom\}/g, r.name).replace(/\{numero_dossier\}/g, r.dossier).replace(/\{lien_espace\}/g, 'https://comite-macon.fr/espace'),
    };
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(15, 23, 42, 0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, animation: 'fadeIn .15s ease-out',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface)',
        borderRadius: 14,
        width: '100%', maxWidth: state === 'compose' ? 860 : 580,
        maxHeight: '92vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 48px rgba(0,0,0,.18)',
        overflow: 'hidden',
        animation: 'modalIn .2s cubic-bezier(.2,.9,.3,1)',
        transition: 'max-width .2s ease',
      }}>
        {state === 'compose' && (
          <ComposeStep
            audience={audience} setAudience={setAudience} audienceOptions={audienceOptions}
            tplKey={tplKey} setTplKey={setTplKey}
            subject={subject} setSubject={setSubject}
            body={body} setBody={setBody}
            attachments={attachments} onAddFiles={handleFileAdd} onRemoveAttachment={removeAttachment}
            senderId={senderId} onChangeSender={setSenderId}
            headerId={headerId} onChangeHeader={setHeaderId}
            footerId={footerId} onChangeFooter={setFooterId}
            onCancel={onClose}
            onPreview={() => setState('preview')}
            onSend={() => setState('confirm')}
          />
        )}
        {state === 'preview' && (
          <PreviewStep
            previewIdx={previewIdx} setPreviewIdx={setPreviewIdx}
            previewRecipients={previewRecipients}
            renderPreview={renderPreview}
            attachments={attachments}
            sender={currentSender}
            header={currentHeader}
            footer={currentFooter}
            onBack={() => setState('compose')}
            onSend={() => setState('confirm')}
          />
        )}
        {state === 'confirm' && (
          <ConfirmStep
            count={recipientCount}
            attachmentCount={attachments.length}
            senderNom={currentSender?.nom}
            senderEmail={currentSender?.email}
            onCancel={() => setState('compose')}
            onConfirm={onClose}
          />
        )}
      </div>
    </div>
  );
};

// R22 — 2 colonnes : options à gauche, corps du mail à droite
const ComposeStep = ({ audience, setAudience, audienceOptions, tplKey, setTplKey, subject, setSubject, body, setBody, attachments, onAddFiles, onRemoveAttachment, senderId, onChangeSender, headerId, onChangeHeader, footerId, onChangeFooter, onCancel, onPreview, onSend }) => (
  <>
    {/* Header */}
    <div style={{ padding: '22px 28px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--burgundy-50)', color: 'var(--burgundy-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon.Send size={14}/>
      </span>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Communication</span>
      <h2 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.02em', marginLeft: 4 }}>Email groupé</h2>
    </div>

    {/* Corps 2 colonnes */}
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '300px 1fr', overflow: 'hidden' }}>

      {/* Colonne gauche — options */}
      <div className="scroll-y" style={{ padding: '20px 22px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Expéditeur */}
        <div>
          <FieldLabel>De</FieldLabel>
          <select className="input" value={senderId} onChange={e => onChangeSender(e.target.value)} style={{ width: '100%' }}>
            {EXPEDITEURS_EMAIL.map(s => (
              <option key={s.id} value={s.id}>{s.nom} — {s.email}</option>
            ))}
          </select>
        </div>

        {/* En-tête */}
        <div>
          <FieldLabel>En-tête</FieldLabel>
          <select className="input" value={headerId} onChange={e => onChangeHeader(e.target.value)} style={{ width: '100%' }}>
            <option value="none">Aucun en-tête</option>
            {INITIAL_HEADERS.map(h => <option key={h.id} value={h.id}>{h.name}{h.defaut ? ' ★' : ''}</option>)}
          </select>
        </div>

        {/* Pied de page */}
        <div>
          <FieldLabel>Pied de page</FieldLabel>
          <select className="input" value={footerId} onChange={e => onChangeFooter(e.target.value)} style={{ width: '100%' }}>
            <option value="none">Aucun pied de page</option>
            {INITIAL_FOOTERS.map(f => <option key={f.id} value={f.id}>{f.name}{f.defaut ? ' ★' : ''}</option>)}
          </select>
        </div>

        {/* Destinataires */}
        <div>
          <FieldLabel>Destinataires</FieldLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {audienceOptions.map(o => (
              <label key={o.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px',
                border: '1px solid ' + (audience === o.id ? 'var(--burgundy-800)' : 'var(--border)'),
                background: audience === o.id ? 'var(--burgundy-50)' : 'var(--surface)',
                borderRadius: 8,
                cursor: o.disabled ? 'not-allowed' : 'pointer',
                opacity: o.disabled ? 0.5 : 1,
                fontSize: 13,
                transition: 'all .12s',
              }}>
                <input type="radio" name="audience" checked={audience === o.id} onChange={() => !o.disabled && setAudience(o.id)} disabled={o.disabled} style={{ accentColor: 'var(--burgundy-800)' }}/>
                <span style={{ flex: 1, fontWeight: audience === o.id ? 500 : 400, color: audience === o.id ? 'var(--burgundy-900)' : 'var(--fg)' }}>{o.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Template */}
        <div>
          <FieldLabel>Template</FieldLabel>
          <select className="input" value={tplKey} onChange={e => setTplKey(e.target.value)} style={{ width: '100%' }}>
            {Object.entries(TEMPLATES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        {/* Objet */}
        <div>
          <FieldLabel>Objet</FieldLabel>
          <input className="input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Concours des Grands Vins de France 2026 — …" style={{ width: '100%' }}/>
        </div>

        {/* Variables */}
        <div style={{ padding: '10px 12px', background: 'var(--burgundy-50)', borderRadius: 7, fontSize: 12, color: 'var(--burgundy-900)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span>💡</span>
            <strong style={{ fontWeight: 600 }}>Variables disponibles</strong>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {VARIABLES.map(v => (
              <button key={v} type="button" onClick={() => setBody(body + ' ' + v)} style={{
                background: 'var(--surface)', border: '1px solid var(--burgundy-200, rgba(83,20,66,.18))',
                color: 'var(--burgundy-800)', padding: '2px 8px', borderRadius: 999,
                fontSize: 11.5, fontFamily: 'Menlo, monospace', cursor: 'pointer', fontWeight: 500,
              }}>{v}</button>
            ))}
          </div>
        </div>

        {/* Pièces jointes */}
        <div>
          <FieldLabel>Pièces jointes {attachments.length > 0 && <span style={{ color: 'var(--fg-muted)', fontWeight: 400 }}>({attachments.length})</span>}</FieldLabel>
          <label style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            padding: '14px 12px', border: '2px dashed var(--border)',
            borderRadius: 8, cursor: 'pointer', background: 'var(--slate-50)',
            fontSize: 12.5, color: 'var(--fg-muted)', textAlign: 'center',
            transition: 'border-color .12s',
          }}>
            <input type="file" multiple style={{ display: 'none' }} onChange={onAddFiles}/>
            <Icon.Paperclip size={16}/>
            Cliquez pour joindre un fichier
            <span style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>PDF, Word, Excel · max 10 Mo par fichier</span>
          </label>
          {attachments.length > 0 && (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {attachments.map((f, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 10px', background: 'var(--surface)',
                  border: '1px solid var(--border)', borderRadius: 6, fontSize: 12.5,
                }}>
                  <Icon.FileText size={13} style={{ color: 'var(--fg-muted)', flexShrink: 0 }}/>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--fg)' }}>{f.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--fg-subtle)', flexShrink: 0 }}>{f.size}</span>
                  <button type="button" onClick={() => onRemoveAttachment(i)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--fg-muted)', padding: 2, display: 'flex', borderRadius: 4,
                    lineHeight: 0,
                  }} title="Supprimer"><Icon.X size={12}/></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Colonne droite — corps du mail */}
      <div style={{ display: 'flex', flexDirection: 'column', padding: '20px 24px' }}>
        <FieldLabel>Corps du message</FieldLabel>
        <textarea
          className="input"
          value={body}
          onChange={e => setBody(e.target.value)}
          style={{ flex: 1, resize: 'none', fontFamily: 'inherit', lineHeight: 1.65, fontSize: 13.5, minHeight: 260 }}
        />
      </div>
    </div>

    {/* Footer */}
    <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <button className="btn btn-ghost" onClick={onCancel}>Annuler</button>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-outline" onClick={onPreview}><Icon.Eye size={14}/> Prévisualiser</button>
        <button className="btn btn-primary" onClick={onSend}>Envoyer <Icon.ArrowRight size={13}/></button>
      </div>
    </div>
  </>
);

const PreviewStep = ({ previewIdx, setPreviewIdx, previewRecipients, renderPreview, attachments, sender, header, footer, onBack, onSend }) => {
  const total = previewRecipients.length;
  const p = renderPreview(previewIdx);
  return (
    <>
      <div style={{ padding: '18px 28px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}><Icon.ChevronLeft size={14}/> Retour</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>Prévisualisation <span className="tnum" style={{ fontWeight: 600, color: 'var(--fg)' }}>{previewIdx + 1}/{total}</span></span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn btn-icon btn-sm btn-outline" disabled={previewIdx === 0} onClick={() => setPreviewIdx(i => Math.max(0, i - 1))}><Icon.ChevronLeft size={13}/></button>
          <button className="btn btn-icon btn-sm btn-outline" disabled={previewIdx === total - 1} onClick={() => setPreviewIdx(i => Math.min(total - 1, i + 1))}><Icon.ChevronRight size={13}/></button>
        </div>
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: '20px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '8px 14px', fontSize: 13, marginBottom: 18 }}>
          {sender && <>
            <span style={{ color: 'var(--fg-muted)', fontWeight: 500 }}>De</span>
            <span style={{ color: 'var(--fg)', fontFamily: 'Menlo, monospace', fontSize: 12.5 }}>{sender.nom} &lt;{sender.email}&gt;</span>
          </>}
          <span style={{ color: 'var(--fg-muted)', fontWeight: 500 }}>À</span>
          <span style={{ color: 'var(--fg)', fontFamily: 'Menlo, monospace', fontSize: 12.5 }}>{p.to}</span>
          <span style={{ color: 'var(--fg-muted)', fontWeight: 500 }}>Objet</span>
          <span style={{ color: 'var(--fg)', fontWeight: 500 }}>{p.subject}</span>
        </div>
        <div style={{ height: 1, background: 'var(--border)', marginBottom: 18 }}/>
        {/* En-tête email */}
        {header && (
          <div style={{ marginBottom: 16, border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', background: header.bg }}>
            {header.blocks.map(b => <BlockPreview key={b.id} block={b}/>)}
          </div>
        )}
        <div style={{ fontSize: 13.5, color: 'var(--fg)', lineHeight: 1.65, whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif' }}>
          {p.body}
        </div>
        {/* Pied de page email */}
        {footer && (
          <div style={{ marginTop: 16, border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', background: footer.bg }}>
            {footer.blocks.map(b => <BlockPreview key={b.id} block={b}/>)}
          </div>
        )}
        {attachments.length > 0 && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-muted)', marginBottom: 8 }}>
              Pièces jointes ({attachments.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {attachments.map((f, i) => (
                <div key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 10px', background: 'var(--slate-50)',
                  border: '1px solid var(--border)', borderRadius: 6, fontSize: 12.5,
                }}>
                  <Icon.FileText size={12} style={{ color: 'var(--fg-muted)' }}/>
                  <span style={{ color: 'var(--fg)' }}>{f.name}</span>
                  <span style={{ color: 'var(--fg-subtle)', fontSize: 11 }}>{f.size}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-ghost" onClick={onBack}>Annuler</button>
        <button className="btn btn-primary" onClick={onSend}>Envoyer <Icon.ArrowRight size={13}/></button>
      </div>
    </>
  );
};

const ConfirmStep = ({ count, attachmentCount, senderNom, senderEmail, onCancel, onConfirm }) => {
  const [sent, setSent] = React.useState(false);
  if (sent) {
    return (
      <div style={{ padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--success-bg, #f0fdf4)', color: '#16a34a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Icon.Check size={28}/>
        </div>
        <h3 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Emails envoyés</h3>
        <p style={{ fontSize: 13.5, color: 'var(--fg-muted)', marginTop: 8 }}>{count} producteurs ont été notifiés.</p>
        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={onConfirm}>Fermer</button>
      </div>
    );
  }
  return (
    <div style={{ padding: '32px 32px 24px' }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fef3c7', color: '#b45309', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon.AlertCircle size={22}/>
      </div>
      <h3 className="display" style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>Envoyer à {count} producteur{count > 1 ? 's' : ''} ?</h3>
      <p style={{ fontSize: 13.5, color: 'var(--fg-muted)', marginTop: 10, lineHeight: 1.5 }}>
        Cette action est <strong style={{ color: 'var(--fg)' }}>irréversible</strong>. Les emails partiront immédiatement avec les variables remplies pour chaque destinataire.
        {senderNom && <> Ils seront envoyés depuis <strong style={{ color: 'var(--fg)' }}>{senderNom}</strong>{senderEmail && <span style={{ fontFamily: 'Menlo, monospace', fontSize: 12.5 }}> ({senderEmail})</span>}.</>}
        {attachmentCount > 0 && <> Chaque email inclura <strong style={{ color: 'var(--fg)' }}>{attachmentCount} pièce{attachmentCount > 1 ? 's' : ''} jointe{attachmentCount > 1 ? 's' : ''}</strong>.</>}
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
        <button className="btn btn-outline" onClick={onCancel}>Retour</button>
        <button className="btn btn-primary" style={{ background: '#b45309', borderColor: '#b45309' }} onClick={() => { setSent(true); setTimeout(onConfirm, 1500); }}>
          <Icon.Send size={13}/> Confirmer l'envoi
        </button>
      </div>
    </div>
  );
};

const FieldLabel = ({ children }) => (
  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)', marginBottom: 7, letterSpacing: '0.01em' }}>{children}</div>
);

Object.assign(window, { EmailGroupModal });
