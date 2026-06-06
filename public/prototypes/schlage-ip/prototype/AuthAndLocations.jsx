// ENGAGE auth modal (Step 2)
const TKa = new Proxy({}, { get: (_, k) => window.GeneaTokens[k] });

function AuthModal({ state, dispatch }) {
  const { UI } = window;
  const [email, setEmail] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [showPwd, setShowPwd] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [noAccount, setNoAccount] = React.useState(false);
  const [err, setErr] = React.useState(null);

  const submit = () => {
    setErr(null);
    if (!email || !pwd) { setErr('Enter both email and password.'); return; }
    if (pwd === 'wrong') { setErr('ENGAGE rejected these credentials. Check your password, or confirm the account was created via portal.allegionengage.com.'); return; }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      dispatch({type:'authSuccess', email});
    }, 1400);
  };

  if (noAccount) {
    return (
      <UI.Modal open title="Connect to Allegion ENGAGE" onClose={()=>dispatch({type:'closeModal'})} width={560}>
        <div style={{display:'flex', flexDirection:'column', gap:16}}>
          <div style={{display:'flex', gap:12, padding:16, background:'#FFF8E6', border:'1px solid #FFE7A8', borderRadius:6}}>
            <Icon.Warn s={18} extra={{color:'#B88A0D', flexShrink:0, marginTop:1}}/>
            <div>
              <div style={{fontSize:14, fontWeight:500, color:'#B88A0D', marginBottom:4}}>An Allegion ENGAGE partner account is required</div>
              <div style={{fontSize:13, color:TKa.FG_BODY, lineHeight:'20px'}}>
                To use Schlage IP integration you need a partner account. Create one on the Allegion ENGAGE portal, then return here with your credentials.
              </div>
            </div>
          </div>
          <div style={{padding:16, background:'#FDEDED', border:'1px solid #F2B8B5', borderRadius:6, fontSize:13, color:'#B8342D', display:'flex', gap:10}}>
            <Icon.Info s={16} extra={{flexShrink:0, marginTop:2}}/>
            <div>
              <strong>Important:</strong> The ENGAGE account must be created on the web portal at <code style={{background:TKa.BG_CONTAINER, padding:'1px 6px', borderRadius:3, fontSize:12}}>portal.allegionengage.com</code> — not via the ENGAGE mobile app. Mobile-created accounts may lack partner-level API access.
            </div>
          </div>
          <div style={{padding:16, background:TKa.BG_LAYOUT, borderRadius:6, fontSize:13, color:TKa.FG_SECONDARY}}>
            After creating your account, return here and enter your credentials.
          </div>
        </div>
        <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:24}}>
          <UI.Btn onClick={()=>setNoAccount(false)}>Back</UI.Btn>
          <UI.Btn variant="primary" iconRight={<Icon.Ext s={13}/>} onClick={()=>{ setNoAccount(false); }}>
            Open ENGAGE Portal
          </UI.Btn>
        </div>
      </UI.Modal>
    );
  }

  return (
    <UI.Modal open title="Connect to Allegion ENGAGE" onClose={()=>dispatch({type:'closeModal'})} width={480}>
      <div style={{display:'flex', flexDirection:'column', gap:16}}>
        <div style={{display:'flex', alignItems:'center', gap:12, padding:12, background:TKa.BG_LAYOUT, borderRadius:6}}>
          <UI.SchlageMark size={32}/>
          <Icon.ArrowR s={14} extra={{color:TKa.FG_SECONDARY}}/>
          <UI.AllegionMark size={28}/>
          <div style={{fontSize:13, color:TKa.FG_SECONDARY, flex:1}}>
            Enter your Allegion ENGAGE partner credentials to link Schlage locks with Genea.
          </div>
        </div>
        <div>
          <label style={{fontSize:13, color:TKa.FG_BODY, fontWeight:500, display:'block', marginBottom:6}}>Partner Email</label>
          <UI.Input value={email} onChange={setEmail} placeholder="you@company.com" prefix={<Icon.Mail s={14}/>}/>
        </div>
        <div>
          <label style={{fontSize:13, color:TKa.FG_BODY, fontWeight:500, display:'block', marginBottom:6}}>Password</label>
          <UI.Input value={pwd} onChange={setPwd} placeholder="••••••••" type={showPwd?'text':'password'}
            prefix={<Icon.Key s={14}/>}
            suffix={<span onClick={()=>setShowPwd(!showPwd)} style={{cursor:'pointer', display:'flex'}}>{showPwd ? <Icon.EyeOff s={14}/> : <Icon.Eye s={14}/>}</span>}/>
        </div>
        {err && (
          <div style={{padding:'8px 12px', background:'#FDEDED', border:'1px solid #F2B8B5', borderRadius:6,
            fontSize:13, color:'#B8342D', display:'flex', gap:8, alignItems:'flex-start'}}>
            <Icon.Warn s={14} extra={{flexShrink:0, marginTop:2}}/>{err}
          </div>
        )}
        <div style={{fontSize:12, color:TKa.FG_DESCRIPTION}}>
          Credentials are encrypted and stored at the organization level. They're reused across all locations you enable.
        </div>
      </div>
      <div style={{display:'flex', gap:12, alignItems:'center', justifyContent:'space-between', marginTop:24}}>
        <a onClick={()=>setNoAccount(true)} style={{fontSize:13, color:TKa.LINK, cursor:'pointer', display:'flex', alignItems:'center', gap:4}}>
          Don't have an account? Create one <Icon.ArrowR s={12}/>
        </a>
        <div style={{display:'flex', gap:8}}>
          <UI.Btn onClick={()=>dispatch({type:'closeModal'})}>Cancel</UI.Btn>
          <UI.Btn variant="primary" onClick={submit} disabled={busy}
            icon={busy ? <Icon.Spinner s={14} extra={{animation:'spin 1s linear infinite'}}/> : null}>
            {busy ? 'Connecting…' : 'Connect'}
          </UI.Btn>
        </div>
      </div>
    </UI.Modal>
  );
}

// Location picker (Step 3)
function LocationsModal({ state, dispatch }) {
  const { UI } = window;
  const { LOCATIONS } = window.__SCHLAGE_CONSTS;
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState(new Set(state.enabledLocations));
  const filtered = LOCATIONS.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));
  const allChecked = filtered.length>0 && filtered.every(l => selected.has(l.id));
  const someChecked = filtered.some(l => selected.has(l.id));

  const toggle = (id) => {
    const n = new Set(selected);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelected(n);
  };
  const toggleAll = () => {
    const n = new Set(selected);
    if (allChecked) filtered.forEach(l => n.delete(l.id));
    else filtered.forEach(l => n.add(l.id));
    setSelected(n);
  };

  return (
    <UI.Modal open title="Select Locations for Schlage IP Integration" onClose={()=>dispatch({type:'closeModal'})} width={560}
      footer={<>
        <UI.Btn onClick={()=>dispatch({type:'closeModal'})}>Cancel</UI.Btn>
        <UI.Btn variant="primary" disabled={selected.size===0} onClick={()=>dispatch({type:'enableLocations', ids: [...selected]})}>
          Add {selected.size>0 ? `${selected.size} Location${selected.size>1?'s':''}`: 'Location'}
        </UI.Btn>
      </>}>
      <div style={{display:'flex', flexDirection:'column', gap:12}}>
        <div style={{fontSize:13, color:TKa.FG_SECONDARY}}>
          Choose the locations where you want to enable Schlage IP integration. You can add more later.
        </div>
        <UI.Input value={search} onChange={setSearch} placeholder="Search locations by name…" prefix={<Icon.Search s={14}/>}/>
        <div style={{border:`1px solid ${TKa.BORDER_SPLIT}`, borderRadius:6, overflow:'hidden'}}>
          <div style={{padding:'10px 16px', background:TKa.BG_LAYOUT, borderBottom:`1px solid ${TKa.BORDER_SPLIT}`,
            display:'flex', alignItems:'center', gap:10}}>
            <UI.Checkbox checked={allChecked} indeterminate={!allChecked && someChecked} onChange={toggleAll}/>
            <span style={{fontSize:13, color:TKa.FG_BODY, fontWeight:500}}>Select All</span>
            <span style={{marginLeft:'auto', fontSize:12, color:TKa.FG_SECONDARY}}>{filtered.length} of {LOCATIONS.length} shown</span>
          </div>
          <div style={{maxHeight:320, overflowY:'auto'}}>
            {filtered.map(l => {
              const isSel = selected.has(l.id);
              const alreadyEnabled = state.enabledLocations.includes(l.id);
              return (
                <div key={l.id} onClick={()=>toggle(l.id)} style={{
                  padding:'10px 16px', borderTop:`1px solid ${TKa.BORDER_SPLIT}`,
                  display:'flex', alignItems:'center', gap:12, cursor:'pointer',
                  background: isSel ? '#F2F7FF' : 'transparent', transition:'background .15s'
                }}>
                  <UI.Checkbox checked={isSel} onChange={()=>toggle(l.id)}/>
                  <Icon.Building s={16} extra={{color:TKa.FG_SECONDARY}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14, color:TKa.FG_HEADING, display:'flex', alignItems:'center', gap:8}}>
                      {l.name}
                      {alreadyEnabled && <span style={{fontSize:11, padding:'1px 6px', background:'#E8F5EB', color:'#3A9148', borderRadius:3}}>Already enabled</span>}
                    </div>
                    <div style={{fontSize:12, color:TKa.FG_SECONDARY}}>{l.address}</div>
                  </div>
                  <div style={{fontSize:12, color:TKa.FG_SECONDARY, textAlign:'right'}}>
                    <div>{l.doors} doors</div>
                    <div>{l.readers} readers</div>
                  </div>
                </div>
              );
            })}
            {filtered.length===0 && <div style={{padding:32, textAlign:'center', color:TKa.FG_SECONDARY, fontSize:13}}>No locations match "{search}"</div>}
          </div>
        </div>
      </div>
    </UI.Modal>
  );
}

window.AuthModal = AuthModal;
window.LocationsModal = LocationsModal;
