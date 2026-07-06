// view-event.jsx — R120 : Page publique mini-événement (Weezevent-style)

const EVT_PUBLIC_STEPS = ['Présentation', 'Inscription', 'Paiement', 'Confirmation'];

const eurP = v => v.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

// ── Etape 1 — Landing / présentation ─────────────────────────────────────────
const EventLanding = ({ event, onStart }) => {
  const placesRestantes = event.capacite - event.nbInscrits;
  return (
    <div>
      {/* Hero */}
      <div style={{
        background: event.imageUrl
          ? `linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.55)), url(${event.imageUrl}) center/cover`
          : `linear-gradient(135deg, ${event.couleur}cc 0%, ${event.couleur} 100%)`,
        color: '#fff', padding: '64px 0 40px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 740, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 13, opacity: .8, marginBottom: 12, letterSpacing: '.05em', textTransform: 'uppercase' }}>
            Comité des Salons et Concours de Mâcon
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 16px', lineHeight: 1.2 }}>{event.titre}</h1>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 20, fontSize: 14, opacity: .9 }}>
            <span>📅 {event.date} à {event.heure}</span>
            <span>📍 {event.lieu}</span>
            <span>🎟 {placesRestantes > 0 ? placesRestantes + ' places restantes' : 'Complet'}</span>
            <span>💶 {eurP(event.prixHT * 1.2)} TTC / pers.</span>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32, alignItems: 'start' }}>
        {/* Colonne gauche */}
        <div>
          {event.description && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 14px' }}>À propos de cet événement</h2>
              <p style={{ lineHeight: 1.7, color: '#374151', margin: 0 }}>{event.description}</p>
            </div>
          )}
          {event.programme && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 14px' }}>Programme</h2>
              <div style={{ background: '#f9fafb', borderRadius: 10, padding: '18px 22px', borderLeft: `4px solid ${event.couleur}` }}>
                {event.programme.split('\n').map((line, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, marginBottom: i < event.programme.split('\n').length - 1 ? 10 : 0 }}>
                    {line.includes('—') ? (
                      <>
                        <span style={{ fontWeight: 600, color: event.couleur, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{line.split('—')[0].trim()}</span>
                        <span style={{ color: '#374151' }}>— {line.split('—').slice(1).join('—').trim()}</span>
                      </>
                    ) : <span style={{ color: '#374151' }}>{line}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {event.adresse && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 14px' }}>Lieu</h2>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: event.couleur + '22', color: event.couleur, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>📍</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{event.lieu}</div>
                  <div style={{ color: '#6b7280', fontSize: 14, marginTop: 2 }}>{event.adresse}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Carte d'inscription */}
        <div style={{ position: 'sticky', top: 20 }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,.08)' }}>
            <div style={{ background: event.couleur, padding: '18px 22px', color: '#fff' }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{eurP(event.prixHT * 1.2)}</div>
              <div style={{ fontSize: 13, opacity: .85 }}>TTC par personne (TVA 20 %)</div>
            </div>
            <div style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 10 }}>
                <span style={{ color: '#6b7280' }}>Date</span>
                <span style={{ fontWeight: 500 }}>{event.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 10 }}>
                <span style={{ color: '#6b7280' }}>Heure</span>
                <span style={{ fontWeight: 500 }}>{event.heure}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 18 }}>
                <span style={{ color: '#6b7280' }}>Places restantes</span>
                <span style={{ fontWeight: 600, color: placesRestantes < 5 ? '#dc2626' : '#166534' }}>{placesRestantes}</span>
              </div>
              {event.inscriptionsOuvertes && placesRestantes > 0 ? (
                <button onClick={onStart} style={{
                  width: '100%', padding: '13px 0', background: event.couleur, color: '#fff',
                  border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer',
                  transition: 'opacity .15s',
                }}>
                  S'inscrire →
                </button>
              ) : (
                <div style={{ textAlign: 'center', padding: '13px 0', background: '#f3f4f6', borderRadius: 10, color: '#6b7280', fontSize: 14 }}>
                  {placesRestantes <= 0 ? 'Événement complet' : 'Inscriptions fermées'}
                </div>
              )}
              <div style={{ fontSize: 11.5, color: '#9ca3af', textAlign: 'center', marginTop: 10 }}>
                Annulation gratuite jusqu'à 48 h avant l'événement
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Etape 2 — Formulaire d'inscription ───────────────────────────────────────
const EventRegistrationForm = ({ event, onNext, onBack }) => {
  const [values, setValues] = React.useState({});
  const [errors, setErrors] = React.useState({});

  const setVal = (id, val) => setValues(v => ({ ...v, [id]: val }));

  const validate = () => {
    const errs = {};
    event.champs.forEach(c => {
      if (c.requis && !values[c.id]) errs[c.id] = 'Ce champ est requis';
      if (c.type === 'email' && values[c.id] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values[c.id]))
        errs[c.id] = 'E-mail invalide';
      if (c.type === 'number' && values[c.id] && (+values[c.id] < 1 || +values[c.id] > event.capacite - event.nbInscrits))
        errs[c.id] = `Entre 1 et ${event.capacite - event.nbInscrits}`;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(values); };
  const nbPlaces = +(values['places'] || values[event.champs.find(c => c.type === 'number')?.id] || 1);
  const total = nbPlaces * event.prixHT * 1.2;

  return (
    <div style={{ maxWidth: 580, margin: '0 auto', padding: '0 24px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 24px' }}>Votre inscription</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {event.champs.map(c => (
          <div key={c.id}>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 500, marginBottom: 6 }}>
              {c.label}{c.requis && <span style={{ color: '#dc2626', marginLeft: 3 }}>*</span>}
            </label>
            {c.type === 'select' ? (
              <select value={values[c.id] || ''} onChange={e => setVal(c.id, e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: `1px solid ${errors[c.id] ? '#dc2626' : '#d1d5db'}`, borderRadius: 8, fontSize: 14, background: '#fff', color: values[c.id] ? '#111' : '#9ca3af' }}>
                <option value="">Choisir…</option>
                {(c.options || '').split('\n').filter(Boolean).map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : c.type === 'textarea' ? (
              <textarea rows={3} value={values[c.id] || ''} onChange={e => setVal(c.id, e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: `1px solid ${errors[c.id] ? '#dc2626' : '#d1d5db'}`, borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}/>
            ) : c.type === 'checkbox' ? (
              <label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={!!values[c.id]} onChange={e => setVal(c.id, e.target.checked)} style={{ width: 17, height: 17, accentColor: event.couleur }}/>
                <span style={{ fontSize: 14 }}>J'accepte</span>
              </label>
            ) : (
              <input type={c.type} value={values[c.id] || ''} onChange={e => setVal(c.id, e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: `1px solid ${errors[c.id] ? '#dc2626' : '#d1d5db'}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}/>
            )}
            {errors[c.id] && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors[c.id]}</div>}
          </div>
        ))}
      </div>

      {/* Récap montant */}
      <div style={{ margin: '24px 0', padding: '16px 20px', background: '#f9fafb', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13.5, color: '#6b7280' }}>{nbPlaces} place{nbPlaces > 1 ? 's' : ''} × {eurP(event.prixHT * 1.2)}</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{eurP(total)}</div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onBack} style={{ padding: '11px 22px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 9, fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>← Retour</button>
        <button onClick={handleNext} style={{ flex: 1, padding: '11px 0', background: event.couleur, color: '#fff', border: 'none', borderRadius: 9, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          Passer au paiement →
        </button>
      </div>
    </div>
  );
};

// ── Etape 3 — Paiement ────────────────────────────────────────────────────────
const EventPayment = ({ event, formData, onPay, onBack }) => {
  const [mode, setMode] = React.useState('cb');
  const [card, setCard] = React.useState({ num: '', exp: '', cvv: '', nom: '' });
  const [paying, setPaying] = React.useState(false);
  const setC = (k, v) => setCard(c => ({ ...c, [k]: v }));

  const nbPlaces = +(formData['places'] || formData[Object.keys(formData)[0]] || 1);
  const total = nbPlaces * event.prixHT * 1.2;

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => { setPaying(false); onPay(); }, 1800);
  };

  return (
    <div style={{ maxWidth: 540, margin: '0 auto', padding: '0 24px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 8px' }}>Paiement</h2>
      <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>Montant total : <strong style={{ color: '#111' }}>{eurP(total)}</strong></div>

      {/* Mode de paiement */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
        {[['cb', '💳 Carte bancaire'], ['virement', '🏦 Virement']].map(([v, l]) => (
          <button key={v} onClick={() => setMode(v)} style={{
            flex: 1, padding: '10px 14px', border: `2px solid ${mode === v ? event.couleur : '#e5e7eb'}`,
            borderRadius: 9, background: mode === v ? event.couleur + '11' : '#fff',
            color: mode === v ? event.couleur : '#374151', fontSize: 14, fontWeight: mode === v ? 600 : 400, cursor: 'pointer',
          }}>{l}</button>
        ))}
      </div>

      {mode === 'cb' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>Numéro de carte</label>
            <input value={card.num} onChange={e => setC('num', e.target.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim())}
              placeholder="1234 5678 9012 3456" maxLength={19}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, letterSpacing: '.05em', fontFamily: 'monospace', boxSizing: 'border-box' }}/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>Date d'expiration</label>
              <input value={card.exp} onChange={e => setC('exp', e.target.value)} placeholder="MM / AA"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}/>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>CVV</label>
              <input value={card.cvv} onChange={e => setC('cvv', e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="123"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}/>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>Nom sur la carte</label>
            <input value={card.nom} onChange={e => setC('nom', e.target.value)} placeholder="PRÉNOM NOM"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}/>
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
            🔒 Paiement sécurisé SSL — vos données bancaires ne sont jamais stockées
          </div>
        </div>
      ) : (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '18px 20px', marginBottom: 22 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Coordonnées bancaires</div>
          {[['Bénéficiaire', 'Comité des Salons et Concours de Mâcon'], ['IBAN', 'FR76 1234 5678 9012 3456 7890 123'], ['BIC', 'BNPAFRPPXXX'], ['Référence', 'EVT-' + event.id.toUpperCase()], ['Montant', eurP(total)]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 10, fontSize: 13.5, marginBottom: 6 }}>
              <span style={{ color: '#6b7280', minWidth: 120 }}>{k}</span>
              <span style={{ fontWeight: 500, fontFamily: k === 'IBAN' || k === 'BIC' ? 'monospace' : 'inherit' }}>{v}</span>
            </div>
          ))}
          <div style={{ fontSize: 12, color: '#166534', marginTop: 10 }}>Votre inscription sera confirmée à réception du virement.</div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onBack} style={{ padding: '11px 22px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 9, fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>← Retour</button>
        <button onClick={handlePay} disabled={paying} style={{
          flex: 1, padding: '11px 0', background: paying ? '#9ca3af' : event.couleur, color: '#fff', border: 'none',
          borderRadius: 9, fontSize: 15, fontWeight: 600, cursor: paying ? 'not-allowed' : 'pointer', transition: 'background .2s',
        }}>
          {paying ? '⏳ Traitement en cours…' : mode === 'cb' ? `Payer ${eurP(total)} →` : `Confirmer l'inscription →`}
        </button>
      </div>
    </div>
  );
};

// ── Etape 4 — Confirmation ────────────────────────────────────────────────────
const EventConfirmation = ({ event, formData }) => {
  const nbPlaces = +(formData['places'] || formData[Object.keys(formData)[0]] || 1);
  const total = nbPlaces * event.prixHT * 1.2;
  const refNum = 'INS-' + Math.floor(1000 + Math.random() * 9000);

  return (
    <div style={{ maxWidth: 540, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#dcfce7', color: '#166534', fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>✓</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 10px' }}>Inscription confirmée !</h2>
      <p style={{ color: '#6b7280', lineHeight: 1.6, margin: '0 0 28px' }}>
        Un e-mail de confirmation a été envoyé à <strong>{formData['email'] || 'votre adresse'}</strong>.<br/>
        Conservez-le précieusement — il vous servira de billet d'entrée.
      </p>

      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 24px', textAlign: 'left', marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Récapitulatif</div>
        {[
          ['Événement', event.titre],
          ['Date', event.date + ' à ' + event.heure],
          ['Lieu', event.lieu],
          ['Places', nbPlaces],
          ['Montant total', eurP(total)],
          ['Référence', refNum],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ color: '#6b7280' }}>{k}</span>
            <span style={{ fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button style={{ padding: '10px 22px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 9, fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>
          📄 Télécharger le billet
        </button>
        <button style={{ padding: '10px 22px', background: event.couleur, color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>
          📅 Ajouter à mon agenda
        </button>
      </div>
    </div>
  );
};

// ── Progress bar ──────────────────────────────────────────────────────────────
const StepBar = ({ steps, current, couleur }) => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: 0, padding: '24px 24px 0' }}>
    {steps.map((s, i) => (
      <React.Fragment key={s}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700,
            background: i < current ? couleur : i === current ? couleur : '#e5e7eb',
            color: i <= current ? '#fff' : '#9ca3af',
            border: i === current ? `3px solid ${couleur}55` : '2px solid transparent',
            boxSizing: 'border-box', transition: 'all .2s',
          }}>
            {i < current ? '✓' : i + 1}
          </div>
          <div style={{ fontSize: 11.5, marginTop: 5, fontWeight: i === current ? 600 : 400, color: i === current ? couleur : i < current ? '#374151' : '#9ca3af' }}>
            {s}
          </div>
        </div>
        {i < steps.length - 1 && (
          <div style={{ flex: 1, height: 2, background: i < current ? couleur : '#e5e7eb', marginTop: 13, transition: 'background .2s', maxWidth: 60 }}/>
        )}
      </React.Fragment>
    ))}
  </div>
);

// ── Composant racine public ───────────────────────────────────────────────────
const EventPublicPage = ({ eventId, onBack }) => {
  const [step, setStep]   = React.useState(0);
  const [formData, setFormData] = React.useState({});

  const events = window.MINI_EVENTS_INIT || [];
  const event = events.find(e => e.id === eventId);

  if (!event) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🍷</div>
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>Événement introuvable</h1>
        <p style={{ color: '#6b7280' }}>Cet événement n'existe pas ou n'est plus disponible.</p>
        {onBack && <button onClick={onBack} style={{ marginTop: 16, padding: '10px 22px', background: '#374151', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>← Retour</button>}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Topbar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: event.couleur, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>🍷</span>
        </div>
        <span style={{ fontWeight: 600, fontSize: 14 }}>Comité des Salons et Concours de Mâcon</span>
        {onBack && (
          <button onClick={onBack} style={{ marginLeft: 'auto', padding: '6px 14px', background: '#f3f4f6', border: 'none', borderRadius: 7, fontSize: 13, cursor: 'pointer', color: '#374151' }}>
            ← Retour admin
          </button>
        )}
      </div>

      {/* Stepper (caché sur landing) */}
      {step > 0 && <StepBar steps={EVT_PUBLIC_STEPS} current={step} couleur={event.couleur}/>}

      {/* Contenu par étape */}
      <div style={{ paddingBottom: step === 0 ? 0 : 64, paddingTop: step > 0 ? 32 : 0 }}>
        {step === 0 && <EventLanding event={event} onStart={() => setStep(1)}/>}
        {step === 1 && <EventRegistrationForm event={event} onNext={data => { setFormData(data); setStep(2); }} onBack={() => setStep(0)}/>}
        {step === 2 && <EventPayment event={event} formData={formData} onPay={() => setStep(3)} onBack={() => setStep(1)}/>}
        {step === 3 && <EventConfirmation event={event} formData={formData}/>}
      </div>

      {/* Footer */}
      <div style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '20px 24px', textAlign: 'center', fontSize: 12.5, color: '#9ca3af', marginTop: step > 0 ? 32 : 0 }}>
        © 2026 Comité des Salons et Concours de Mâcon · <a href="#" style={{ color: '#9ca3af' }}>Mentions légales</a> · <a href="#" style={{ color: '#9ca3af' }}>CGV</a>
      </div>
    </div>
  );
};

window.EventPublicPage = EventPublicPage;
