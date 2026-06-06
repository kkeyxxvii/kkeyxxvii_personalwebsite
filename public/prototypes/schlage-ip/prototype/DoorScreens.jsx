// Doors (Step 8) + Attach Lock (Step 9)
const TKd = new Proxy({}, { get: (_, k) => window.GeneaTokens[k] });

function DoorsPage({ state, dispatch }) {
  const { UI } = window;
  const { LOCATIONS } = window.__SCHLAGE_CONSTS;
  // Demo doors list — mix of existing (non-Schlage) + our new ones
  const existing = [
    { id:'door-x1', name:'Main Lobby Entry', locationId:'nyc-hq', lockType:'HID iCLASS SE (Mercury)', status:'Online' },
    { id:'door-x2', name:'Floor 3 North', locationId:'nyc-hq', lockType:'HID multiCLASS (Mercury)', status:'Online' },
    { id:'door-x3', name:'Parking Garage A', locationId:'nyc-hq', lockType:'HID iCLASS SE (Mercury)', status:'Offline' },
  ];
  const mine = state.doors.map(d => {
    const lock = state.locks.find(l => l.id === d.lockId);
    return { ...d, lockType: lock ? `Schlage ${lock.model} (IP)` : 'Unassigned', status: lock ? 'Online' : 'Pending' };
  });
  const all = [...mine, ...existing];

  return (
    <div style={{padding:'24px 0', maxWidth:1280}}>
      <UI.Breadcrumb items={[{label:'Hardware', onClick:()=>{}}, {label:'Doors'}]}/>
      <UI.PageHeader title="Doors" subtitle={`${all.length} door${all.length===1?'':'s'} across ${state.enabledLocations.length || 1} location${(state.enabledLocations.length||1)===1?'':'s'}`}
        actions={<>
          <UI.Btn icon={<Icon.Filter s={14}/>}>Filter</UI.Btn>
          <UI.Btn variant="primary" icon={<Icon.Plus s={14}/>} onClick={()=>dispatch({type:'openCreateDoor'})}>Create Door</UI.Btn>
        </>}/>
      <div style={{background:TKd.BG_CONTAINER, border:`1px solid ${TKd.BORDER_SPLIT}`, borderRadius:6, boxShadow:TKd.CARD_SHADOW, overflow:'hidden'}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:14}}>
          <thead><tr style={{background:TKd.BG_LAYOUT, textAlign:'left', color:TKd.FG_BODY}}>
            <th style={{padding:'10px 16px', fontWeight:400}}>Door Name</th>
            <th style={{padding:'10px 16px', fontWeight:400}}>Location</th>
            <th style={{padding:'10px 16px', fontWeight:400}}>Lock / Reader</th>
            <th style={{padding:'10px 16px', fontWeight:400}}>Status</th>
            <th style={{padding:'10px 16px', fontWeight:400, width:140}}></th>
          </tr></thead>
          <tbody>
            {all.map(d => {
              const loc = LOCATIONS.find(l => l.id === d.locationId);
              const isNew = mine.some(m => m.id === d.id);
              const needsLock = isNew && !d.lockId;
              return (
                <tr key={d.id} onClick={()=>isNew && dispatch({type:'openDoorDetail', id:d.id})} style={{
                  borderTop:`1px solid ${TKd.BORDER_SPLIT}`, cursor: isNew ? 'pointer':'default',
                  background: needsLock ? '#FFFBF0' : 'transparent',
                }}>
                  <td style={{padding:'14px 16px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <Icon.Door s={14} extra={{color: needsLock ? '#B88A0D' : TKd.FG_SECONDARY}}/>
                      <span style={{color: isNew ? TKd.LINK : TKd.FG_HEADING, fontWeight: isNew ? 500 : 400}}>{d.name}</span>
                      {isNew && <span style={{fontSize:10, padding:'1px 5px', background:'#EDF4FE', color:TKd.PRIMARY_TEXT, borderRadius:3}}>NEW</span>}
                    </div>
                  </td>
                  <td style={{padding:'14px 16px', color:TKd.FG_BODY}}>{loc?.name || '—'}</td>
                  <td style={{padding:'14px 16px', color: needsLock ? '#B88A0D' : TKd.FG_SECONDARY}}>
                    {needsLock ? 'No lock attached' : d.lockType}
                  </td>
                  <td style={{padding:'14px 16px'}}><UI.StatusPill status={d.status}/></td>
                  <td style={{padding:'14px 16px', textAlign:'right'}}>
                    {needsLock ? (
                      <UI.Btn size="sm" variant="primary" icon={<Icon.Plus s={12}/>} onClick={(e)=>{e.stopPropagation(); dispatch({type:'openAttachLock', doorId:d.id})}}>Attach Lock</UI.Btn>
                    ) : <Icon.More s={14} extra={{color:TKd.ICON}}/>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateDoorModal({ state, dispatch }) {
  const { UI } = window;
  const { LOCATIONS } = window.__SCHLAGE_CONSTS;
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [locId, setLocId] = React.useState(state.enabledLocations[0] || LOCATIONS[0].id);
  const [andAttach, setAndAttach] = React.useState(true);

  const valid = name.trim();

  return (
    <UI.Modal open title="Create Door" onClose={()=>dispatch({type:'closeModal'})} width={500}
      footer={<>
        <UI.Btn onClick={()=>dispatch({type:'closeModal'})}>Cancel</UI.Btn>
        <UI.Btn variant="primary" disabled={!valid} onClick={()=>dispatch({type:'createDoor', name, desc, locationId:locId, thenAttach:andAttach})}>
          {andAttach ? 'Create & Attach Lock' : 'Create Door'}
        </UI.Btn>
      </>}>
      <div style={{display:'flex', flexDirection:'column', gap:16}}>
        <div>
          <label style={{fontSize:13, fontWeight:500, color:TKd.FG_BODY, display:'block', marginBottom:6}}>
            Name <span style={{color:'#D44C46'}}>*</span>
          </label>
          <UI.Input value={name} onChange={setName} placeholder="e.g. Server Room 3C"/>
        </div>
        <div>
          <label style={{fontSize:13, fontWeight:500, color:TKd.FG_BODY, display:'block', marginBottom:6}}>Description</label>
          <UI.Input value={desc} onChange={setDesc} placeholder="Optional"/>
        </div>
        <div>
          <label style={{fontSize:13, fontWeight:500, color:TKd.FG_BODY, display:'block', marginBottom:6}}>Location</label>
          <div style={{display:'flex', alignItems:'center', gap:8, padding:'0 11px', height:32,
            border:`1px solid ${TKd.BORDER}`, borderRadius:6, background:TKd.BG_CONTAINER}}>
            <Icon.Building s={14} extra={{color:TKd.FG_SECONDARY}}/>
            <select value={locId} onChange={e=>setLocId(e.target.value)}
              style={{flex:1, border:'none', outline:'none', background:'transparent', fontSize:14, fontFamily:TKd.FONT}}>
              {LOCATIONS.filter(l => state.enabledLocations.includes(l.id) || state.enabledLocations.length===0).map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{padding:'10px 12px', background:TKd.BG_LAYOUT, borderRadius:6}}>
          <UI.Checkbox checked={andAttach} onChange={setAndAttach} label={<span style={{fontSize:13, color:TKd.FG_BODY}}>Attach a lock after creating</span>}/>
        </div>
      </div>
    </UI.Modal>
  );
}

function AttachLockModal({ state, dispatch }) {
  const { UI } = window;
  const doorId = state.modalData.doorId;
  const door = state.doors.find(d => d.id === doorId);
  if (!door) return null;
  const [mfr, setMfr] = React.useState('allegion-schlage');
  const [model, setModel] = React.useState('NDEB');
  const [mode, setMode] = React.useState('IP'); // 'Mercury' | 'IP'
  const [method, setMethod] = React.useState('gateway'); // 'serial' | 'gateway'
  const [serial, setSerial] = React.useState('');
  const [gwId, setGwId] = React.useState('');
  const [lockId, setLockId] = React.useState('');

  const gws = state.gateways.filter(g => g.locationId === door.locationId);
  const locksForGw = state.locks.filter(l => l.gateway === gwId && l.locationId === door.locationId);

  // Mercury toggle only appears if ENGAGE Gateway is registered as Mercury interface panel — demo: disabled
  const mercuryAvailable = false;

  const serialMatch = state.locks.find(l => l.serial === serial && l.locationId === door.locationId);
  const valid = mode === 'IP' ? (method === 'serial' ? !!serialMatch : !!lockId) : false;

  const submit = () => {
    let targetLockId = method === 'serial' ? serialMatch?.id : lockId;
    if (!targetLockId) return;
    dispatch({type:'attachLock', doorId, lockId: targetLockId});
  };

  return (
    <UI.Modal open title={`Attach Lock · ${door.name}`} onClose={()=>dispatch({type:'closeModal'})} width={600}
      footer={<>
        <UI.Btn onClick={()=>dispatch({type:'closeModal'})}>Cancel</UI.Btn>
        <UI.Btn variant="primary" disabled={!valid} onClick={submit}>Attach Lock</UI.Btn>
      </>}>
      <div style={{display:'flex', flexDirection:'column', gap:20}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <div>
            <label style={{fontSize:13, fontWeight:500, color:TKd.FG_BODY, display:'block', marginBottom:6}}>Manufacturer</label>
            <div style={{display:'flex', alignItems:'center', gap:8, padding:'0 11px', height:32, border:`1px solid ${TKd.BORDER}`, borderRadius:6, background:TKd.BG_CONTAINER}}>
              <UI.SchlageMark size={16}/>
              <select value={mfr} onChange={e=>setMfr(e.target.value)} style={{flex:1, border:'none', outline:'none', background:'transparent', fontSize:14, fontFamily:TKd.FONT}}>
                <option value="allegion-schlage">Allegion Schlage</option>
                <option value="hid" disabled>HID Global</option>
                <option value="assa" disabled>ASSA ABLOY</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{fontSize:13, fontWeight:500, color:TKd.FG_BODY, display:'block', marginBottom:6}}>Model Number</label>
            <div style={{display:'flex', alignItems:'center', gap:8, padding:'0 11px', height:32, border:`1px solid ${TKd.BORDER}`, borderRadius:6, background:TKd.BG_CONTAINER}}>
              <Icon.Lock s={14} extra={{color:TKd.FG_SECONDARY}}/>
              <select value={model} onChange={e=>setModel(e.target.value)} style={{flex:1, border:'none', outline:'none', background:'transparent', fontSize:14, fontFamily:TKd.FONT}}>
                <option value="NDEB">NDEB (cylindrical wireless)</option>
                <option value="LEB">LEB (mortise wireless)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mercury / IP toggle */}
        <div>
          <label style={{fontSize:13, fontWeight:500, color:TKd.FG_BODY, display:'block', marginBottom:8}}>Connection Type</label>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
            <div onClick={()=>mercuryAvailable && setMode('Mercury')} style={{
              padding:'12px 14px', border:`1px solid ${mode==='Mercury'?TKd.PRIMARY:TKd.BORDER}`, borderRadius:6,
              background: mode==='Mercury' ? TKd.PRIMARY_BG : TKd.BG_CONTAINER,
              cursor: mercuryAvailable ? 'pointer' : 'not-allowed', opacity: mercuryAvailable ? 1 : 0.5,
              display:'flex', gap:10, alignItems:'flex-start', position:'relative',
            }}>
              <div style={{width:16, height:16, borderRadius:'50%', border:`2px solid ${mode==='Mercury'?TKd.PRIMARY:TKd.BORDER}`,
                flexShrink:0, marginTop:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
                {mode==='Mercury' && <div style={{width:8, height:8, borderRadius:'50%', background:TKd.PRIMARY}}/>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:14, fontWeight:500, color:TKd.FG_HEADING, display:'flex', alignItems:'center', gap:6}}>
                  <Icon.Cpu s={14} extra={{color:TKd.FG_SECONDARY}}/>Mercury Based
                </div>
                <div style={{fontSize:12, color:TKd.FG_SECONDARY, marginTop:2}}>
                  {mercuryAvailable ? 'Route via Mercury controller' : 'Unavailable — no ENGAGE gateway on a Mercury panel at this location'}
                </div>
              </div>
            </div>
            <div onClick={()=>setMode('IP')} style={{
              padding:'12px 14px', border:`1px solid ${mode==='IP'?TKd.PRIMARY:TKd.BORDER}`, borderRadius:6,
              background: mode==='IP' ? TKd.PRIMARY_BG : TKd.BG_CONTAINER, cursor:'pointer',
              display:'flex', gap:10, alignItems:'flex-start',
            }}>
              <div style={{width:16, height:16, borderRadius:'50%', border:`2px solid ${mode==='IP'?TKd.PRIMARY:TKd.BORDER}`,
                flexShrink:0, marginTop:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
                {mode==='IP' && <div style={{width:8, height:8, borderRadius:'50%', background:TKd.PRIMARY}}/>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:14, fontWeight:500, color:TKd.FG_HEADING, display:'flex', alignItems:'center', gap:6}}>
                  <Icon.Wifi s={14} extra={{color:TKd.PRIMARY_TEXT}}/>IP Based <span style={{fontSize:10, padding:'1px 5px', background:'#EDF4FE', color:TKd.PRIMARY_TEXT, borderRadius:3, fontWeight:500}}>RECOMMENDED</span>
                </div>
                <div style={{fontSize:12, color:TKd.FG_SECONDARY, marginTop:2}}>Direct via ENGAGE gateway — no Mercury controller needed</div>
              </div>
            </div>
          </div>
        </div>

        {mode === 'IP' && (
          <div>
            <label style={{fontSize:13, fontWeight:500, color:TKd.FG_BODY, display:'block', marginBottom:8}}>Identify Lock</label>
            <div style={{display:'flex', gap:2, marginBottom:12, padding:3, background:TKd.BG_LAYOUT, borderRadius:6, border:`1px solid ${TKd.BORDER_SPLIT}`}}>
              {[{k:'gateway', l:'Select from Gateway', icon:<Icon.Gateway s={13}/>},
                {k:'serial', l:'Enter Serial Number', icon:<Icon.Copy s={13}/>}].map(o => (
                <div key={o.k} onClick={()=>setMethod(o.k)} style={{
                  flex:1, padding:'8px 12px', textAlign:'center', fontSize:13, cursor:'pointer',
                  background: method===o.k?'#fff':'transparent',
                  color: method===o.k?TKd.FG_HEADING:TKd.FG_SECONDARY,
                  fontWeight: method===o.k?500:400, borderRadius:4,
                  boxShadow: method===o.k ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                  transition:'all .15s'
                }}>{o.icon}{o.l}</div>
              ))}
            </div>

            {method === 'serial' && (
              <div>
                <UI.Input value={serial} onChange={setSerial} placeholder="SCH-NDEB-1042-XXX"
                  prefix={<Icon.Copy s={14}/>}
                  suffix={serialMatch ? <Icon.CheckCircle s={14} extra={{color:'#3A9148'}}/> : serial ? <Icon.Warn s={14} extra={{color:'#B8342D'}}/> : null}/>
                {serial && serialMatch && (
                  <div style={{marginTop:10, padding:10, background:'#E8F5EB', border:'1px solid #B4D9BC', borderRadius:6, display:'flex', alignItems:'center', gap:10}}>
                    <Icon.CheckCircle s={16} extra={{color:'#3A9148', flexShrink:0}}/>
                    <div style={{flex:1, fontSize:13}}>
                      <div style={{color:'#2D6B38', fontWeight:500}}>Matched: {serialMatch.name}</div>
                      <div style={{color:TKd.FG_SECONDARY, fontSize:12}}>{serialMatch.model} · fw {serialMatch.firmware} · battery {serialMatch.battery}%</div>
                    </div>
                  </div>
                )}
                {serial && !serialMatch && (
                  <div style={{marginTop:10, padding:10, background:'#FDEDED', border:'1px solid #F2B8B5', borderRadius:6, fontSize:13, color:'#B8342D'}}>
                    No provisioned lock found with this serial at this location.
                  </div>
                )}
                <div style={{marginTop:8, fontSize:12, color:TKd.FG_SECONDARY}}>
                  Try a demo serial: <code onClick={()=>setSerial('SCH-NDEB-1042-887')} style={{cursor:'pointer', background:TKd.BG_LAYOUT, padding:'1px 6px', borderRadius:3, color:TKd.LINK}}>SCH-NDEB-1042-887</code>
                </div>
              </div>
            )}

            {method === 'gateway' && (
              <div style={{display:'flex', flexDirection:'column', gap:12}}>
                <div>
                  <div style={{fontSize:12, color:TKd.FG_SECONDARY, marginBottom:6}}>Gateway at {(window.__SCHLAGE_CONSTS.LOCATIONS.find(l=>l.id===door.locationId)||{}).name}</div>
                  <div style={{display:'flex', alignItems:'center', gap:8, padding:'0 11px', height:32, border:`1px solid ${TKd.BORDER}`, borderRadius:6, background:TKd.BG_CONTAINER}}>
                    <Icon.Gateway s={14} extra={{color:TKd.PRIMARY_TEXT}}/>
                    <select value={gwId} onChange={e=>{setGwId(e.target.value); setLockId('')}} style={{flex:1, border:'none', outline:'none', background:'transparent', fontSize:14, fontFamily:TKd.FONT}}>
                      <option value="">Select a gateway…</option>
                      {gws.map(g => <option key={g.id} value={g.id}>{g.name} ({g.mac})</option>)}
                    </select>
                  </div>
                </div>
                {gwId && (
                  <div>
                    <div style={{fontSize:12, color:TKd.FG_SECONDARY, marginBottom:6}}>Linked locks on this gateway ({locksForGw.length})</div>
                    <div style={{border:`1px solid ${TKd.BORDER_SPLIT}`, borderRadius:6, overflow:'hidden', maxHeight:220, overflowY:'auto'}}>
                      {locksForGw.length===0 && <div style={{padding:16, fontSize:13, color:TKd.FG_SECONDARY, textAlign:'center'}}>No linked locks on this gateway. Scan locks first.</div>}
                      {locksForGw.map(l => (
                        <div key={l.id} onClick={()=>setLockId(l.id)} style={{
                          padding:'10px 12px', borderTop:`1px solid ${TKd.BORDER_SPLIT}`,
                          display:'flex', alignItems:'center', gap:12, cursor:'pointer',
                          background: lockId===l.id ? TKd.PRIMARY_BG : TKd.BG_CONTAINER,
                        }}>
                          <div style={{width:14, height:14, borderRadius:'50%', border:`2px solid ${lockId===l.id?TKd.PRIMARY:TKd.BORDER}`,
                            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                            {lockId===l.id && <div style={{width:6, height:6, borderRadius:'50%', background:TKd.PRIMARY}}/>}
                          </div>
                          <Icon.Lock s={14} extra={{color:TKd.FG_SECONDARY}}/>
                          <div style={{flex:1, minWidth:0}}>
                            <div style={{fontSize:14, color:TKd.FG_HEADING}}>{l.name}</div>
                            <div style={{fontSize:12, color:TKd.FG_SECONDARY, fontFamily:'ui-monospace, monospace'}}>{l.serial}</div>
                          </div>
                          <UI.Battery pct={l.battery}/>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </UI.Modal>
  );
}

function DoorDetail({ state, dispatch }) {
  const { UI } = window;
  const { LOCATIONS } = window.__SCHLAGE_CONSTS;
  const door = state.doors.find(d => d.id === state.modalData.doorId);
  if (!door) return null;
  const lock = state.locks.find(l => l.id === door.lockId);
  const gw = lock ? state.gateways.find(g => g.id === lock.gateway) : null;
  const loc = LOCATIONS.find(l => l.id === door.locationId);

  return (
    <div style={{padding:'24px 0', maxWidth:1280}}>
      <UI.Breadcrumb items={[
        {label:'Hardware', onClick:()=>dispatch({type:'goto', step:8})},
        {label:'Doors', onClick:()=>dispatch({type:'goto', step:8})},
        {label:door.name},
      ]}/>
      <UI.PageHeader title={door.name} subtitle={`${loc?.name} · ${door.desc || 'No description'}`}
        actions={<UI.Btn icon={<Icon.Edit s={14}/>}>Edit Door</UI.Btn>}/>

      {!lock ? (
        <div style={{background:TKd.BG_CONTAINER, border:`1px solid ${TKd.BORDER_SPLIT}`, borderRadius:6, padding:48, textAlign:'center', boxShadow:TKd.CARD_SHADOW}}>
          <Icon.Lock s={36} extra={{color:TKd.FG_DESCRIPTION, margin:'0 auto 12px'}}/>
          <div style={{fontSize:16, fontWeight:500, color:TKd.FG_HEADING, marginBottom:4}}>No lock attached</div>
          <div style={{fontSize:13, color:TKd.FG_SECONDARY, marginBottom:20}}>Attach a Schlage wireless lock to start managing access.</div>
          <UI.Btn variant="primary" icon={<Icon.Plus s={14}/>} onClick={()=>dispatch({type:'openAttachLock', doorId:door.id})}>Attach Lock</UI.Btn>
        </div>
      ) : (
        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:16}}>
          <UI.Card title="Attached Lock" extra={<UI.Btn size="sm" icon={<Icon.Unlink s={12}/>}>Detach</UI.Btn>}>
            <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:16}}>
              <div style={{width:56, height:56, borderRadius:8, background:'#FFF5F5', border:'1px solid #FFCDD2', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Icon.Lock s={24} extra={{color:'#C8102E'}}/>
              </div>
              <div>
                <div style={{fontSize:16, fontWeight:500, color:TKd.FG_HEADING}}>{lock.name}</div>
                <div style={{fontSize:13, color:TKd.FG_SECONDARY}}>Schlage {lock.model} · {lock.serial}</div>
              </div>
              <div style={{marginLeft:'auto'}}><UI.StatusPill status={lock.status}/></div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, paddingTop:16, borderTop:`1px solid ${TKd.BORDER_SPLIT}`}}>
              {[
                {l:'Model', v:lock.model},
                {l:'Firmware', v:lock.firmware},
                {l:'Battery', v:<UI.Battery pct={lock.battery}/>},
                {l:'Connection', v:<span style={{fontSize:13, color:'#3A9148', display:'inline-flex', alignItems:'center', gap:4}}><Icon.Wifi s={12}/> IP via Gateway</span>},
              ].map(f => (
                <div key={f.l}>
                  <div style={{fontSize:11, color:TKd.FG_SECONDARY, textTransform:'uppercase', letterSpacing:'0.04em'}}>{f.l}</div>
                  <div style={{fontSize:14, color:TKd.FG_HEADING, marginTop:4}}>{f.v}</div>
                </div>
              ))}
            </div>
          </UI.Card>
          <UI.Card title="Gateway Association">
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12}}>
              <Icon.Gateway s={20} extra={{color:TKd.PRIMARY_TEXT}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:14, color:TKd.FG_HEADING, fontWeight:500}}>{gw?.name}</div>
                <div style={{fontSize:12, color:TKd.FG_SECONDARY, fontFamily:'ui-monospace, monospace'}}>{gw?.mac}</div>
              </div>
              <UI.StatusPill status="Online"/>
            </div>
            <div style={{fontSize:12, color:TKd.FG_SECONDARY}}>Events route directly over IP. No Mercury controller in the path.</div>
          </UI.Card>
          <div style={{gridColumn:'1 / -1'}}>
            <UI.Card title="Supported Features" extra={<a style={{fontSize:12, color:TKd.LINK, display:'flex', alignItems:'center', gap:4}}>Feature matrix <Icon.Ext s={10}/></a>}>
              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10}}>
                {['Schedules','Manual Unlock','Door Held Open Alarm','Access Denied Events','Battery Monitoring','Firmware OTA','Tamper Detection','Real-time Status','Audit Trail'].map(f => (
                  <div key={f} style={{display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background:TKd.BG_LAYOUT, borderRadius:4, fontSize:13}}>
                    <Icon.Check s={14} extra={{color:'#3A9148'}}/>{f}
                  </div>
                ))}
              </div>
            </UI.Card>
          </div>
        </div>
      )}
    </div>
  );
}

window.DoorsPage = DoorsPage;
window.CreateDoorModal = CreateDoorModal;
window.AttachLockModal = AttachLockModal;
window.DoorDetail = DoorDetail;
