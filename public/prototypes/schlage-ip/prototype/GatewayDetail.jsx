// Gateway Detail page — Step 7
// Scan Nearby Locks now opens a centered modal (per spec).
const TKgd = new Proxy({}, { get: (_, k) => window.GeneaTokens[k] });

function ScanNearbyModal({ gw, linkedLocks, onClose, dispatch }) {
  const { UI } = window;
  const [scanning, setScanning] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [scanned, setScanned] = React.useState(null);
  const [selected, setSelected] = React.useState(new Set());
  const [lastScan, setLastScan] = React.useState(null);

  const doScan = () => {
    setScanning(true); setProgress(0); setScanned(null); setSelected(new Set());
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(t);
          setScanning(false);
          setLastScan(new Date());
          const linkedSerials = new Set(linkedLocks.map(l => l.serial));
          const discovered = [
            { id:'disc-1', name:'NDEB-6700 Exec Washroom', serial:'SCH-NDEB-1042-926', model:'NDEB', firmware:'3.4.12', battery:91, rssi:-52 },
            { id:'disc-2', name:'LEB-4500 IT Closet', serial:'SCH-LEB-0872-433', model:'LEB', firmware:'3.3.08', battery:78, rssi:-61 },
            { id:'disc-3', name:'NDEB-6700 Mailroom', serial:'SCH-NDEB-1042-931', model:'NDEB', firmware:'3.4.12', battery:62, rssi:-68 },
            { id:'disc-4', name:'LEB-4500 HR Office', serial:'SCH-LEB-0872-447', model:'LEB', firmware:'3.3.08', battery:85, rssi:-58 },
            { id:'disc-5', name:'NDEB-6700 Janitor Closet', serial:'SCH-NDEB-1042-955', model:'NDEB', firmware:'3.4.10', battery:48, rssi:-73 },
          ].map(d => ({ ...d, alreadyLinked: linkedSerials.has(d.serial) }));
          setScanned(discovered);
          return 100;
        }
        return p + 6;
      });
    }, 140);
  };

  // Auto-start scan when modal opens
  React.useEffect(() => { doScan(); }, []);

  const toggle = (id) => {
    const n = new Set(selected);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelected(n);
  };

  const linkable = scanned ? scanned.filter(s => !s.alreadyLinked) : [];
  const allSel = linkable.length>0 && linkable.every(l => selected.has(l.id));

  const onLink = () => {
    dispatch({type:'linkScanned', gwId:gw.id, lockIds:[...selected], discovered:scanned});
    onClose();
  };

  return (
    <UI.Modal open title="Scan Nearby Locks" onClose={onClose} width={760}>
      <div style={{display:'flex', flexDirection:'column', gap:16}}>
        {/* Header context */}
        <div style={{display:'flex', alignItems:'center', gap:12, padding:'10px 12px',
          background:TKgd.BG_LAYOUT, border:`1px solid ${TKgd.BORDER_SPLIT}`, borderRadius:6}}>
          <Icon.Gateway s={18} extra={{color:TKgd.PRIMARY_TEXT}}/>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:13, color:TKgd.FG_HEADING, fontWeight:500}}>{gw.name}</div>
            <div style={{fontSize:12, color:TKgd.FG_SECONDARY, fontFamily:'ui-monospace, monospace'}}>{gw.mac}{gw.serial && <span style={{margin:'0 6px', color:TKgd.BORDER}}>·</span>}{gw.serial && <span>S/N {gw.serial}</span>}</div>
          </div>
          <UI.StatusPill status="Online"/>
        </div>

        {/* Scan state: scanning */}
        {scanning && (
          <div style={{padding:20, border:`1px solid ${TKgd.PRIMARY_BG}`, background:TKgd.PRIMARY_BG, borderRadius:6}}>
            <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:12}}>
              <div style={{width:32, height:32, borderRadius:'50%', background:TKgd.BG_CONTAINER, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Icon.Spinner s={18} extra={{color:TKgd.PRIMARY, animation:'spin 1s linear infinite'}}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:14, fontWeight:500, color:TKgd.FG_HEADING}}>Scanning gateway for nearby locks…</div>
                <div style={{fontSize:12, color:TKgd.FG_SECONDARY}}>Querying ENGAGE API for paired/linked locks.</div>
              </div>
              <div style={{fontVariantNumeric:'tabular-nums', fontSize:13, color:TKgd.PRIMARY_TEXT, fontWeight:500}}>{progress}%</div>
            </div>
            <div style={{height:4, background:TKgd.BG_CONTAINER, borderRadius:2, overflow:'hidden'}}>
              <div style={{height:'100%', width:`${progress}%`, background:TKgd.PRIMARY, transition:'width .18s ease'}}/>
            </div>
          </div>
        )}

        {/* Scan state: results */}
        {scanned && scanned.length > 0 && (
          <div>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:10, fontSize:13}}>
              <UI.Checkbox checked={allSel} disabled={linkable.length===0}
                onChange={()=>{ setSelected(allSel ? new Set() : new Set(linkable.map(l=>l.id))); }}/>
              <span style={{color:TKgd.FG_BODY, fontWeight:500}}>
                {linkable.length} linkable · {scanned.length - linkable.length} already linked
              </span>
              <span style={{marginLeft:'auto', color:TKgd.FG_SECONDARY, fontSize:12}}>
                {lastScan && `Scanned ${lastScan.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`}
              </span>
            </div>
            <div style={{border:`1px solid ${TKgd.BORDER_SPLIT}`, borderRadius:6, overflow:'hidden', maxHeight:340, overflowY:'auto'}}>
              {scanned.map((l, idx) => (
                <div key={l.id} onClick={()=>!l.alreadyLinked && toggle(l.id)} style={{
                  display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
                  borderTop: idx>0 ? `1px solid ${TKgd.BORDER_SPLIT}` : 'none',
                  cursor: l.alreadyLinked ? 'default' : 'pointer',
                  background: selected.has(l.id) ? TKgd.PRIMARY_BG : TKgd.BG_CONTAINER,
                  opacity: l.alreadyLinked ? 0.6 : 1,
                }}>
                  {!l.alreadyLinked
                    ? <UI.Checkbox checked={selected.has(l.id)} onChange={()=>toggle(l.id)}/>
                    : <div style={{width:16, height:16, flexShrink:0}}/>}
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:2}}>
                      <Icon.Lock s={13} extra={{color:TKgd.FG_SECONDARY, flexShrink:0}}/>
                      <span style={{fontSize:14, color:TKgd.FG_HEADING, fontWeight:500}}>{l.name}</span>
                      {l.alreadyLinked && <span style={{fontSize:11, padding:'1px 6px', background:'#E8F5E9', color:'#3A9148', border:'1px solid #C5E5C9', borderRadius:3, fontWeight:500}}>LINKED</span>}
                    </div>
                    <div style={{display:'flex', gap:14, fontSize:12, color:TKgd.FG_SECONDARY}}>
                      <span style={{fontFamily:'ui-monospace, monospace'}}>{l.serial}</span>
                      <span>{l.model} · fw {l.firmware}</span>
                    </div>
                  </div>
                  <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4}}>
                    <span style={{display:'inline-flex', alignItems:'center', gap:4, fontSize:12,
                      color: l.rssi > -60 ? '#3A9148' : l.rssi > -70 ? '#B88A0D' : '#B8342D'}}>
                      <Icon.Wifi s={11}/>{l.rssi} dBm
                    </span>
                    <UI.Battery pct={l.battery}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty result state */}
        {!scanning && scanned && scanned.length === 0 && (
          <div style={{padding:40, textAlign:'center', border:`1px dashed ${TKgd.BORDER}`, borderRadius:6}}>
            <Icon.Scan s={32} extra={{color:TKgd.FG_DESCRIPTION, margin:'0 auto 8px'}}/>
            <div style={{fontSize:14, fontWeight:500, color:TKgd.FG_HEADING, marginBottom:4}}>No locks found</div>
            <div style={{fontSize:12, color:TKgd.FG_SECONDARY}}>Make sure locks are paired with this gateway in the ENGAGE app.</div>
          </div>
        )}

        {/* Footer actions */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:`1px solid ${TKgd.BORDER_SPLIT}`, paddingTop:16, marginTop:4}}>
          <UI.Btn variant="text" icon={scanning ? <Icon.Spinner s={13} extra={{animation:'spin 1s linear infinite'}}/> : <Icon.Refresh s={13}/>}
            onClick={doScan} disabled={scanning}>
            {scanning ? 'Scanning…' : 'Rescan'}
          </UI.Btn>
          <div style={{display:'flex', gap:8}}>
            <UI.Btn onClick={onClose}>Cancel</UI.Btn>
            <UI.Btn variant="primary" disabled={!scanned || selected.size===0 || scanning} icon={<Icon.LinkI s={13}/>}
              onClick={onLink}>
              Link Selected {selected.size>0 && `(${selected.size})`}
            </UI.Btn>
          </div>
        </div>
      </div>
    </UI.Modal>
  );
}

function GatewayDetail({ state, dispatch }) {
  const { UI } = window;
  const { LOCATIONS } = window.__SCHLAGE_CONSTS;
  const gw = state.gateways.find(g => g.id === state.selectedGateway);
  if (!gw) return null;
  const loc = LOCATIONS.find(l => l.id === gw.locationId);
  const linkedLocks = state.locks.filter(l => l.gateway === gw.id);
  const [scanOpen, setScanOpen] = React.useState(false);

  return (
    <div style={{padding:'24px 0', maxWidth:1280}}>
      <UI.Breadcrumb items={[
        {label:'Integrations', onClick:()=>dispatch({type:'goto', step:1})},
        {label:'Schlage', onClick:()=>dispatch({type:'goto', step:4})},
        {label:loc.name, onClick:()=>dispatch({type:'openLocation', id:loc.id})},
        {label:gw.name},
      ]}/>
      <UI.PageHeader
        title={gw.name}
        subtitle={<span style={{fontFamily:'ui-monospace, monospace', fontSize:13}}>{gw.mac}{gw.serial && <span style={{margin:'0 8px', color:TKgd.BORDER}}>·</span>}{gw.serial && <span>S/N {gw.serial}</span>}</span>}
        actions={<>
          <UI.StatusPill status="Online"/>
          <UI.Btn icon={<Icon.Settings s={14}/>}>Configure</UI.Btn>
          <UI.Btn variant="primary" icon={<Icon.Scan s={14}/>} onClick={()=>setScanOpen(true)}>
            Scan Nearby Locks
          </UI.Btn>
        </>}
      />

      {/* Gateway meta card */}
      <div style={{background:TKgd.BG_CONTAINER, border:`1px solid ${TKgd.BORDER_SPLIT}`, borderRadius:6, padding:16, marginBottom:20,
        display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:24, boxShadow:TKgd.CARD_SHADOW}}>
        {[
          {l:'Location', v:loc.name},
          {l:'Application', v:<span style={{color:'#D46B08', display:'inline-flex', alignItems:'center', gap:4, fontWeight:500}}><Icon.Zap s={12}/> Schlage Engage (exclusive)</span>},
          {l:'Linked Locks', v:linkedLocks.length},
          {l:'Description', v:gw.desc || '—'},
        ].map(f => (
          <div key={f.l}>
            <div style={{fontSize:11, color:TKgd.FG_SECONDARY, textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:4}}>{f.l}</div>
            <div style={{fontSize:14, color:TKgd.FG_HEADING}}>{f.v}</div>
          </div>
        ))}
      </div>

      {/* Linked Locks section header */}
      <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:12}}>
        <div>
          <h3 style={{margin:0, fontSize:16, fontWeight:600, color:TKgd.FG_HEADING}}>Linked Locks</h3>
          <div style={{fontSize:13, color:TKgd.FG_SECONDARY, marginTop:2}}>
            Locks currently linked to this gateway. {linkedLocks.length === 0 ? 'Use Scan Nearby Locks to discover and link new locks.' : `${linkedLocks.length} lock${linkedLocks.length===1?'':'s'}.`}
          </div>
        </div>
      </div>

      {linkedLocks.length === 0 ? (
        <div style={{background:TKgd.BG_CONTAINER, border:`1px dashed ${TKgd.BORDER}`, borderRadius:6, padding:48, textAlign:'center'}}>
          <Icon.Lock s={28} extra={{color:TKgd.FG_DESCRIPTION, margin:'0 auto 12px'}}/>
          <div style={{fontSize:15, color:TKgd.FG_HEADING, fontWeight:500, marginBottom:4}}>No locks linked yet</div>
          <div style={{fontSize:13, color:TKgd.FG_SECONDARY, marginBottom:16}}>Click <strong>Scan Nearby Locks</strong> above to discover Schlage wireless locks within range of this gateway.</div>
          <UI.Btn variant="primary" icon={<Icon.Scan s={14}/>} onClick={()=>setScanOpen(true)}>Scan Nearby Locks</UI.Btn>
        </div>
      ) : (
        <div style={{background:TKgd.BG_CONTAINER, border:`1px solid ${TKgd.BORDER_SPLIT}`, borderRadius:6, overflow:'hidden', boxShadow:TKgd.CARD_SHADOW}}>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:14}}>
            <thead><tr style={{background:TKgd.BG_LAYOUT, color:TKgd.FG_BODY, textAlign:'left'}}>
              <th style={{padding:'10px 16px', fontWeight:400}}>Lock Name</th>
              <th style={{padding:'10px 16px', fontWeight:400}}>Serial</th>
              <th style={{padding:'10px 16px', fontWeight:400}}>Model</th>
              <th style={{padding:'10px 16px', fontWeight:400}}>Firmware</th>
              <th style={{padding:'10px 16px', fontWeight:400}}>Battery</th>
              <th style={{padding:'10px 16px', fontWeight:400}}>Status</th>
            </tr></thead>
            <tbody>
              {linkedLocks.map(l => (
                <tr key={l.id} style={{borderTop:`1px solid ${TKgd.BORDER_SPLIT}`}}>
                  <td style={{padding:'12px 16px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <Icon.Lock s={14} extra={{color:TKgd.FG_SECONDARY}}/>
                      <span style={{color:TKgd.FG_HEADING, fontWeight:500}}>{l.name}</span>
                    </div>
                  </td>
                  <td style={{padding:'12px 16px', fontFamily:'ui-monospace, monospace', fontSize:12, color:TKgd.FG_SECONDARY}}>{l.serial}</td>
                  <td style={{padding:'12px 16px'}}>{l.model}</td>
                  <td style={{padding:'12px 16px', color:TKgd.FG_SECONDARY, fontVariantNumeric:'tabular-nums'}}>{l.firmware}</td>
                  <td style={{padding:'12px 16px'}}><UI.Battery pct={l.battery}/></td>
                  <td style={{padding:'12px 16px'}}><UI.StatusPill status={l.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {scanOpen && <ScanNearbyModal gw={gw} linkedLocks={linkedLocks} dispatch={dispatch} onClose={()=>setScanOpen(false)}/>}
    </div>
  );
}

window.GatewayDetail = GatewayDetail;
