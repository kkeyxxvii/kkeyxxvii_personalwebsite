// Gateway setup (Step 6) + Scan Locks (Step 7)
const TKg = new Proxy({}, { get: (_, k) => window.GeneaTokens[k] });

function AddGatewayModal({ state, dispatch }) {
  const { UI } = window;
  const { ALL_APPLICATIONS } = window.__SCHLAGE_CONSTS;
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [mac, setMac] = React.useState('');
  const [serial, setSerial] = React.useState('');
  const [apps, setApps] = React.useState([]); // selected application ids
  const [dropOpen, setDropOpen] = React.useState(false);
  const [conflictMsg, setConflictMsg] = React.useState(null);

  const hasSchlage = apps.includes('schlage-engage');
  const hasOthers = apps.some(a => a !== 'schlage-engage');

  const toggleApp = (id) => {
    const app = ALL_APPLICATIONS.find(a => a.id === id);
    // Exclusive logic
    if (id === 'schlage-engage') {
      if (hasOthers) {
        setConflictMsg('Schlage Engage Gateway cannot be combined with other applications. Please deselect other applications first.');
        setTimeout(() => setConflictMsg(null), 4500);
        return;
      }
      setApps(apps.includes(id) ? [] : [id]);
    } else {
      if (hasSchlage) {
        setConflictMsg('Schlage Engage Gateway cannot be combined with other applications. Please deselect other applications first.');
        setTimeout(() => setConflictMsg(null), 4500);
        return;
      }
      setApps(apps.includes(id) ? apps.filter(a=>a!==id) : [...apps, id]);
    }
  };

  const valid = name.trim() && mac.trim() && serial.trim() && apps.length > 0;

  return (
    <UI.Modal open title="Add Interface Panel" onClose={()=>dispatch({type:'closeModal'})} width={560}
      footer={<>
        <UI.Btn onClick={()=>dispatch({type:'closeModal'})}>Cancel</UI.Btn>
        <UI.Btn variant="primary" disabled={!valid} onClick={()=>dispatch({type:'addGateway', name, desc, mac, serial, applications:apps})}>Add Gateway</UI.Btn>
      </>}>
      <div style={{display:'flex', flexDirection:'column', gap:16}}>
        <div>
          <label style={{fontSize:13, fontWeight:500, color:TKg.FG_BODY, display:'block', marginBottom:6}}>
            Name <span style={{color:'#D44C46'}}>*</span>
          </label>
          <UI.Input value={name} onChange={setName} placeholder="e.g. Floor 5 ENGAGE Gateway"/>
        </div>
        <div>
          <label style={{fontSize:13, fontWeight:500, color:TKg.FG_BODY, display:'block', marginBottom:6}}>
            Description
          </label>
          <UI.Input value={desc} onChange={setDesc} placeholder="Optional · max 250 characters"/>
        </div>
        <div>
          <label style={{fontSize:13, fontWeight:500, color:TKg.FG_BODY, display:'block', marginBottom:6}}>
            MAC Address <span style={{color:'#D44C46'}}>*</span>
          </label>
          <UI.Input value={mac} onChange={setMac} placeholder="00:1A:2B:3C:4D:5E" prefix={<Icon.Radio s={14}/>}/>
        </div>
        <div>
          <label style={{fontSize:13, fontWeight:500, color:TKg.FG_BODY, display:'block', marginBottom:6}}>
            Serial Number <span style={{color:'#D44C46'}}>*</span>
          </label>
          <UI.Input value={serial} onChange={setSerial} placeholder="e.g. AC-ENG-2310-08812" prefix={<Icon.Hardware s={14}/>}/>
          <div style={{fontSize:11, color:TKg.FG_SECONDARY, marginTop:4}}>Printed on the gateway label, next to the MAC address.</div>
        </div>
        <div style={{position:'relative'}}>
          <label style={{fontSize:13, fontWeight:500, color:TKg.FG_BODY, display:'block', marginBottom:6}}>
            Applications <span style={{color:'#D44C46'}}>*</span>
            {hasSchlage && <span style={{marginLeft:8, fontSize:11, padding:'1px 6px', background:'#FFF5E6', color:'#D46B08', borderRadius:3, fontWeight:500}}>EXCLUSIVE MODE</span>}
          </label>
          <div onClick={()=>setDropOpen(!dropOpen)} style={{
            minHeight:32, border:`1px solid ${hasSchlage?'#FFD591':TKg.BORDER}`,
            background: hasSchlage?'#FFFBF0': TKg.BG_CONTAINER,
            borderRadius:6, padding:'4px 11px', cursor:'pointer', display:'flex', alignItems:'center',
            gap:6, flexWrap:'wrap'
          }}>
            {apps.length === 0 && <span style={{color:TKg.FG_DESCRIPTION, fontSize:14}}>Select applications…</span>}
            {apps.map(id => {
              const a = ALL_APPLICATIONS.find(x => x.id === id);
              return (
                <span key={id} style={{
                  display:'inline-flex', alignItems:'center', gap:4,
                  padding:'2px 6px 2px 8px', background: a.isExclusive ? '#FFE7BA' : '#EDF4FE',
                  color: a.isExclusive ? '#873800' : TKg.PRIMARY_TEXT,
                  borderRadius:4, fontSize:12, fontWeight:500,
                }}>
                  {a.isExclusive && <Icon.Zap s={10}/>}
                  {a.label}
                  <span onClick={(e)=>{e.stopPropagation(); toggleApp(id);}} style={{cursor:'pointer', display:'flex', opacity:0.6}}><Icon.Close s={10}/></span>
                </span>
              );
            })}
            <span style={{marginLeft:'auto', display:'flex', color:TKg.FG_SECONDARY}}><Icon.Down s={12}/></span>
          </div>
          {dropOpen && (
            <div style={{position:'absolute', top:'calc(100% + 4px)', left:0, right:0, background:TKg.BG_CONTAINER,
              border:`1px solid ${TKg.BORDER_SPLIT}`, borderRadius:6, boxShadow:TKg.MD_SHADOW, zIndex:30,
              maxHeight:280, overflowY:'auto'}}>
              {ALL_APPLICATIONS.map(a => {
                const checked = apps.includes(a.id);
                const disabled = (a.isExclusive && hasOthers && !checked) || (!a.isExclusive && hasSchlage && !checked);
                return (
                  <div key={a.id} onClick={()=>!disabled && toggleApp(a.id)} style={{
                    padding:'10px 12px', display:'flex', alignItems:'center', gap:10,
                    cursor:disabled?'not-allowed':'pointer',
                    opacity:disabled?0.4:1,
                    background: checked ? TKg.PRIMARY_BG : 'transparent',
                    borderTop: a.isExclusive ? `1px solid ${TKg.BORDER_SPLIT}` : 'none',
                    position: 'relative',
                  }} onMouseEnter={e=>{if(!disabled && !checked) e.currentTarget.style.background=TKg.BG_LAYOUT}}
                     onMouseLeave={e=>{if(!checked) e.currentTarget.style.background='transparent'}}>
                    <UI.Checkbox checked={checked} disabled={disabled} onChange={()=>!disabled && toggleApp(a.id)}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14, color:TKg.FG_HEADING, fontWeight: a.isExclusive ? 500 : 400, display:'flex', alignItems:'center', gap:6}}>
                        {a.isExclusive && <Icon.Zap s={11} extra={{color:'#D46B08'}}/>}
                        {a.label}
                        {a.isNew && <span style={{fontSize:10, padding:'1px 5px', background:'#FFF5E6', color:'#D46B08', border:'1px solid #FFD591', borderRadius:3, fontWeight:500}}>NEW</span>}
                      </div>
                      <div style={{fontSize:12, color:TKg.FG_SECONDARY}}>
                        {a.desc}
                        {a.isExclusive && <span style={{color:'#D46B08'}}> · Cannot be combined</span>}
                      </div>
                    </div>
                    {disabled && <span style={{fontSize:11, color:TKg.FG_DESCRIPTION}}>Disabled</span>}
                  </div>
                );
              })}
            </div>
          )}
          {conflictMsg && (
            <div style={{marginTop:8, padding:'8px 12px', background:'#FDEDED', border:'1px solid #F2B8B5', borderRadius:6,
              fontSize:13, color:'#B8342D', display:'flex', gap:8, alignItems:'flex-start', animation:'shake .3s'}}>
              <Icon.Warn s={14} extra={{flexShrink:0, marginTop:2}}/>{conflictMsg}
            </div>
          )}
          {hasSchlage && !conflictMsg && (
            <div style={{marginTop:8, padding:'10px 12px', background:'#FFF8E6', border:'1px solid #FFE7A8', borderRadius:6,
              fontSize:13, color:'#876400', display:'flex', gap:8, alignItems:'flex-start'}}>
              <Icon.Info s={14} extra={{flexShrink:0, marginTop:2, color:'#D46B08'}}/>
              <div>
                <strong>Schlage Engage Gateway is exclusive.</strong> When selected, this gateway is dedicated to Schlage wireless locks and cannot host other applications. All other options above are disabled.
              </div>
            </div>
          )}
        </div>
      </div>
    </UI.Modal>
  );
}

function ScanLocksModal({ state, dispatch }) {
  const { UI } = window;
  const gws = state.gateways.filter(g => g.locationId === state.selectedLocation);
  const [gwId, setGwId] = React.useState(state.modalData.gatewayId || gws[0]?.id);
  const [scanning, setScanning] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [scanned, setScanned] = React.useState(null); // null = not yet, [] = done
  const [selected, setSelected] = React.useState(new Set());

  const gw = gws.find(g => g.id === gwId);

  const doScan = () => {
    setScanning(true);
    setProgress(0);
    setScanned(null);
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(t);
          setScanning(false);
          // Produce fake discovered locks
          setScanned([
            { id:'disc-1', name:'NDEB-6700 Exec Washroom', serial:'SCH-NDEB-1042-926', model:'NDEB', firmware:'3.4.12', battery:91 },
            { id:'disc-2', name:'LEB-4500 IT Closet', serial:'SCH-LEB-0872-433', model:'LEB', firmware:'3.3.08', battery:78 },
            { id:'disc-3', name:'NDEB-6700 Mailroom', serial:'SCH-NDEB-1042-931', model:'NDEB', firmware:'3.4.12', battery:62 },
            { id:'disc-4', name:'LEB-4500 HR Office', serial:'SCH-LEB-0872-447', model:'LEB', firmware:'3.3.08', battery:85 },
          ]);
          return 100;
        }
        return p + 8;
      });
    }, 180);
  };

  const toggle = (id) => {
    const n = new Set(selected);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelected(n);
  };

  const allSel = scanned && scanned.length>0 && scanned.every(l => selected.has(l.id));

  return (
    <UI.Modal open title="Scan Locks from Gateway" onClose={()=>dispatch({type:'closeModal'})} width={640}
      footer={<>
        <UI.Btn onClick={()=>dispatch({type:'closeModal'})}>Cancel</UI.Btn>
        {scanned && scanned.length>0 && (
          <UI.Btn variant="primary" disabled={selected.size===0} icon={<Icon.LinkI s={13}/>}
            onClick={()=>dispatch({type:'linkScanned', gwId, lockIds:[...selected], discovered: scanned})}>
            Link {selected.size>0 ? `${selected.size} Lock${selected.size>1?'s':''}` : 'Selected'}
          </UI.Btn>
        )}
      </>}>
      <div style={{display:'flex', flexDirection:'column', gap:16}}>
        <div>
          <label style={{fontSize:13, fontWeight:500, color:TKg.FG_BODY, display:'block', marginBottom:6}}>Gateway</label>
          <div style={{display:'flex', gap:8, alignItems:'center', padding:'8px 12px', border:`1px solid ${TKg.BORDER}`, borderRadius:6, background:TKg.BG_LAYOUT}}>
            <Icon.Gateway s={16} extra={{color:TKg.PRIMARY_TEXT}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:14, color:TKg.FG_HEADING}}>{gw?.name}</div>
              <div style={{fontSize:12, color:TKg.FG_SECONDARY, fontFamily:'ui-monospace, monospace'}}>{gw?.mac}</div>
            </div>
            <UI.StatusPill status="Online"/>
          </div>
        </div>

        {!scanning && !scanned && (
          <div style={{padding:32, border:`1px dashed ${TKg.BORDER}`, borderRadius:6, textAlign:'center', color:TKg.FG_SECONDARY, background:TKg.BG_DASHED}}>
            <Icon.Scan s={32} extra={{color:TKg.FG_DESCRIPTION, margin:'0 auto 12px'}}/>
            <div style={{fontSize:14, color:TKg.FG_HEADING, fontWeight:500, marginBottom:4}}>Ready to scan</div>
            <div style={{fontSize:13, marginBottom:16}}>Query the ENGAGE gateway for all paired/linked locks.</div>
            <UI.Btn variant="primary" icon={<Icon.Scan s={14}/>} onClick={doScan}>Start Scan</UI.Btn>
          </div>
        )}

        {scanning && (
          <div style={{padding:24, border:`1px solid ${TKg.PRIMARY_BG}`, background:TKg.PRIMARY_BG, borderRadius:6}}>
            <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:12}}>
              <div style={{width:32, height:32, borderRadius:'50%', background:TKg.BG_CONTAINER, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Icon.Spinner s={18} extra={{color:TKg.PRIMARY, animation:'spin 1s linear infinite'}}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:14, fontWeight:500, color:TKg.FG_HEADING}}>Scanning gateway for linked locks…</div>
                <div style={{fontSize:12, color:TKg.FG_SECONDARY}}>Querying ENGAGE API · This usually takes 3–10 seconds.</div>
              </div>
              <div style={{fontVariantNumeric:'tabular-nums', fontSize:13, color:TKg.PRIMARY_TEXT, fontWeight:500}}>{progress}%</div>
            </div>
            <div style={{height:4, background:TKg.BG_CONTAINER, borderRadius:2, overflow:'hidden'}}>
              <div style={{height:'100%', width:`${progress}%`, background:TKg.PRIMARY, transition:'width .18s ease'}}/>
            </div>
          </div>
        )}

        {scanned && scanned.length > 0 && (
          <div>
            <div style={{fontSize:13, color:TKg.FG_BODY, marginBottom:8}}>
              Discovered <strong>{scanned.length} lock{scanned.length===1?'':'s'}</strong>. Select which ones to link.
            </div>
            <div style={{border:`1px solid ${TKg.BORDER_SPLIT}`, borderRadius:6, overflow:'hidden'}}>
              <div style={{padding:'8px 12px', background:TKg.BG_LAYOUT, display:'flex', alignItems:'center', gap:10, borderBottom:`1px solid ${TKg.BORDER_SPLIT}`}}>
                <UI.Checkbox checked={allSel}
                  onChange={()=>{ setSelected(allSel ? new Set() : new Set(scanned.map(l=>l.id))); }}/>
                <span style={{fontSize:13, color:TKg.FG_BODY, fontWeight:500}}>Select all discovered</span>
              </div>
              {scanned.map(l => (
                <div key={l.id} onClick={()=>toggle(l.id)} style={{
                  padding:'10px 12px', borderTop:`1px solid ${TKg.BORDER_SPLIT}`,
                  display:'flex', alignItems:'center', gap:12, cursor:'pointer',
                  background: selected.has(l.id) ? TKg.PRIMARY_BG : TKg.BG_CONTAINER,
                }}>
                  <UI.Checkbox checked={selected.has(l.id)} onChange={()=>toggle(l.id)}/>
                  <Icon.Lock s={14} extra={{color:TKg.FG_SECONDARY}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14, color:TKg.FG_HEADING}}>{l.name}</div>
                    <div style={{fontSize:12, color:TKg.FG_SECONDARY, fontFamily:'ui-monospace, monospace'}}>{l.serial} · {l.model} · fw {l.firmware}</div>
                  </div>
                  <UI.Battery pct={l.battery}/>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </UI.Modal>
  );
}

window.AddGatewayModal = AddGatewayModal;
window.ScanLocksModal = ScanLocksModal;
