// Schlage integration list view (Step 4) + Location detail (Step 5) + Orphan link modal
const TKl = new Proxy({}, { get: (_, k) => window.GeneaTokens[k] });

function SchlageListView({ state, dispatch }) {
  const { UI, EngageSitesSpike } = window;
  const { LOCATIONS } = window.__SCHLAGE_CONSTS;
  const enabled = LOCATIONS.filter(l => state.enabledLocations.includes(l.id));
  const [sitesOpen, setSitesOpen] = React.useState(false);

  return (
    <div style={{padding:'24px 0', maxWidth:1280}}>
      <UI.Breadcrumb items={[
        {label:'Integrations', onClick:()=>dispatch({type:'goto', step:1})},
        {label:'Schlage'},
      ]}/>
      <UI.PageHeader
        title="Schlage IP Integration"
        subtitle={<span>Connected as <strong style={{color:TKl.FG_HEADING}}>{state.engageEmail}</strong> · <a style={{color:TKl.LINK, cursor:'pointer'}}>Change account</a></span>}
        actions={<>
          <UI.Btn icon={<Icon.Refresh s={14}/>}>Sync</UI.Btn>
          <UI.Btn variant="primary" icon={<Icon.Plus s={14}/>} onClick={()=>dispatch({type:'openLocations'})}>Add Location</UI.Btn>
        </>}
      />

      {/* Stats strip */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginBottom:20}}>
        {[
          {label:'Locations', val:state.enabledLocations.length, icon:<Icon.Building s={16}/>, color:TKl.PRIMARY_TEXT},
          {label:'Gateways', val:state.gateways.length, icon:<Icon.Gateway s={16}/>, color:'#4E9E8E'},
          {label:'Linked Locks', val:state.locks.filter(l=>l.gateway).length, icon:<Icon.Lock s={16}/>, color:'#3A9148'},
          {label:'Orphaned Locks', val:state.locks.filter(l=>!l.gateway).length, icon:<Icon.Warn s={16}/>, color:'#B88A0D'},
        ].map(s => (
          <div key={s.label} style={{background:TKl.BG_CONTAINER, border:`1px solid ${TKl.BORDER_SPLIT}`, borderRadius:6, padding:'14px 16px', boxShadow:TKl.CARD_SHADOW}}>
            <div style={{display:'flex', alignItems:'center', gap:8, color:s.color, marginBottom:6}}>
              {s.icon}<span style={{fontSize:12, color:TKl.FG_SECONDARY}}>{s.label}</span>
            </div>
            <div style={{fontSize:24, fontWeight:600, color:TKl.FG_HEADING, fontVariantNumeric:'tabular-nums'}}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{background:TKl.BG_CONTAINER, border:`1px solid ${TKl.BORDER_SPLIT}`, borderRadius:6, boxShadow:TKl.CARD_SHADOW, overflow:'hidden'}}>
        <div style={{padding:'12px 16px', borderBottom:`1px solid ${TKl.BORDER_SPLIT}`, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{fontSize:14, fontWeight:500, color:TKl.FG_HEADING}}>Enabled Locations</div>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <UI.Btn size="sm" icon={<Icon.Ext s={12}/>} onClick={()=>setSitesOpen(true)}>View ENGAGE Sites</UI.Btn>
            <UI.Input size="sm" placeholder="Filter locations…" prefix={<Icon.Search s={12}/>} style={{width:260, height:28}}/>
          </div>
        </div>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:14}}>
          <thead>
            <tr style={{background:TKl.BG_LAYOUT, color:TKl.FG_BODY, textAlign:'left'}}>
              <th style={{padding:'10px 16px', fontWeight:400}}>Location</th>
              <th style={{padding:'10px 16px', fontWeight:400}}>Gateways</th>
              <th style={{padding:'10px 16px', fontWeight:400}}>Locks</th>
              <th style={{padding:'10px 16px', fontWeight:400}}>Orphaned</th>
              <th style={{padding:'10px 16px', fontWeight:400}}>Status</th>
              <th style={{padding:'10px 16px', fontWeight:400, width:100}}></th>
            </tr>
          </thead>
          <tbody>
            {enabled.map(l => {
              const gws = state.gateways.filter(g=>g.locationId===l.id);
              const locks = state.locks.filter(lk=>lk.locationId===l.id);
              const orphans = locks.filter(lk=>!lk.gateway).length;
              return (
                <tr key={l.id} onClick={()=>dispatch({type:'openLocation', id:l.id})} style={{
                  borderTop:`1px solid ${TKl.BORDER_SPLIT}`, cursor:'pointer', transition:'background .15s'
                }} onMouseEnter={e=>e.currentTarget.style.background=TKl.BG_LAYOUT} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{padding:'14px 16px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <Icon.Building s={16} extra={{color:TKl.FG_SECONDARY}}/>
                      <div>
                        <div style={{color:TKl.LINK, fontWeight:500}}>{l.name}</div>
                        <div style={{fontSize:12, color:TKl.FG_SECONDARY}}>{l.address}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:'14px 16px', fontVariantNumeric:'tabular-nums'}}>{gws.length}</td>
                  <td style={{padding:'14px 16px', fontVariantNumeric:'tabular-nums'}}>{locks.length}</td>
                  <td style={{padding:'14px 16px'}}>
                    {orphans > 0 ? (
                      <span style={{color:'#B88A0D', fontVariantNumeric:'tabular-nums', display:'inline-flex', gap:4, alignItems:'center'}}>
                        <Icon.Warn s={12}/> {orphans}
                      </span>
                    ) : <span style={{color:TKl.FG_DESCRIPTION}}>—</span>}
                  </td>
                  <td style={{padding:'14px 16px'}}>
                    <UI.StatusPill status={gws.length===0 ? 'Pending' : orphans > 0 ? 'Active' : 'Connected'}/>
                  </td>
                  <td style={{padding:'14px 16px', textAlign:'right'}}>
                    <Icon.ArrowR s={14} extra={{color:TKl.ICON}}/>
                  </td>
                </tr>
              );
            })}
            {enabled.length===0 && (
              <tr><td colSpan={6} style={{padding:48, textAlign:'center', color:TKl.FG_SECONDARY}}>
                <Icon.Building s={28} extra={{color:TKl.FG_DESCRIPTION, margin:'0 auto 12px'}}/>
                <div style={{marginBottom:12}}>No locations yet. Add a location to start provisioning Schlage locks.</div>
                <UI.Btn variant="primary" icon={<Icon.Plus s={14}/>} onClick={()=>dispatch({type:'openLocations'})}>Add Location</UI.Btn>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      <UI.Drawer open={sitesOpen} onClose={()=>setSitesOpen(false)}
        title="ENGAGE Sites · Implementation Spike"
        subtitle={<span>Evaluating data flow for sites, gateways, and locks created in the <strong style={{color:TKl.FG_HEADING}}>Allegion ENGAGE Portal</strong> and synced into Genea.</span>}
        width={720}>
        <EngageSitesSpike state={state} enabled={enabled}/>
      </UI.Drawer>
    </div>
  );
}

function LocationDetail({ state, dispatch }) {
  const { UI } = window;
  const { LOCATIONS } = window.__SCHLAGE_CONSTS;
  const loc = LOCATIONS.find(l => l.id === state.selectedLocation);
  if (!loc) return null;
  const gws = state.gateways.filter(g=>g.locationId===loc.id);
  const locks = state.locks.filter(lk=>lk.locationId===loc.id);
  const [tab, setTab] = React.useState('locks');
  const [sel, setSel] = React.useState(new Set());
  const orphans = locks.filter(l=>!l.gateway);

  return (
    <div style={{padding:'24px 0', maxWidth:1280}}>
      <UI.Breadcrumb items={[
        {label:'Integrations', onClick:()=>dispatch({type:'goto', step:1})},
        {label:'Schlage', onClick:()=>dispatch({type:'goto', step:4})},
        {label:loc.name},
      ]}/>
      <UI.PageHeader
        title={loc.name}
        subtitle={`${loc.address} · ${locks.length} lock${locks.length===1?'':'s'}, ${gws.length} gateway${gws.length===1?'':'s'}`}
        actions={<>
          <UI.Btn icon={<Icon.Plus s={14}/>} onClick={()=>dispatch({type:'openAddGateway'})}>Add Gateway</UI.Btn>
        </>}
      />

      {orphans.length > 0 && (
        <div style={{padding:'12px 16px', background:'#FFF8E6', border:'1px solid #FFE7A8', borderRadius:6, marginBottom:16,
          display:'flex', alignItems:'center', gap:12}}>
          <Icon.Warn s={18} extra={{color:'#B88A0D', flexShrink:0}}/>
          <div style={{flex:1, fontSize:13, color:'#876400'}}>
            <strong>{orphans.length} orphaned lock{orphans.length===1?' is':'s are'}</strong> provisioned but not linked to any gateway.
            {sel.size > 0 ? ` ${sel.size} selected.` : ' Select locks below to bulk-link.'}
          </div>
          <UI.Btn size="sm" variant="primary" disabled={sel.size===0} onClick={()=>dispatch({type:'openLinkOrphan', lockIds:[...sel]})}>
            Link {sel.size>0 ? `${sel.size} Orphan${sel.size>1?'s':''}` : 'Orphans'}
          </UI.Btn>
        </div>
      )}

      {/* Tabs */}
      <div style={{display:'flex', gap:2, borderBottom:`1px solid ${TKl.BORDER_SPLIT}`, marginBottom:16}}>
        {[{k:'locks', l:'Locks', n:locks.length}, {k:'gateways', l:'Gateways', n:gws.length}].map(t=>(
          <div key={t.k} onClick={()=>setTab(t.k)} style={{
            padding:'12px 16px', fontSize:14, cursor:'pointer',
            color: t.k===tab?TKl.PRIMARY:TKl.FG_BODY,
            borderBottom: t.k===tab?`2px solid ${TKl.PRIMARY}`:'2px solid transparent',
            marginBottom:-1, fontWeight: t.k===tab?500:400,
          }}>{t.l} <span style={{marginLeft:4, color:TKl.FG_SECONDARY}}>{t.n}</span></div>
        ))}
      </div>

      {tab === 'locks' ? (
        <LocksTable locks={locks} gateways={gws} sel={sel} setSel={setSel} dispatch={dispatch}/>
      ) : (
        <GatewaysTable gateways={gws} locks={locks} dispatch={dispatch}/>
      )}
    </div>
  );
}

function LocksTable({ locks, gateways, sel, setSel, dispatch }) {
  const { UI } = window;
  const toggle = (id) => {
    const n = new Set(sel);
    n.has(id) ? n.delete(id) : n.add(id);
    setSel(n);
  };
  const orphans = locks.filter(l=>!l.gateway);
  const allOrphanSel = orphans.length>0 && orphans.every(l => sel.has(l.id));
  const toggleAllOrphans = () => {
    const n = new Set(sel);
    if (allOrphanSel) orphans.forEach(l => n.delete(l.id));
    else orphans.forEach(l => n.add(l.id));
    setSel(n);
  };

  if (locks.length===0) {
    return (
      <div style={{background:TKl.BG_CONTAINER, border:`1px solid ${TKl.BORDER_SPLIT}`, borderRadius:6, padding:64, textAlign:'center', color:TKl.FG_SECONDARY, boxShadow:TKl.CARD_SHADOW}}>
        <Icon.Lock s={32} extra={{color:TKl.FG_DESCRIPTION, margin:'0 auto 16px'}}/>
        <div style={{fontSize:15, marginBottom:4, color:TKl.FG_HEADING, fontWeight:500}}>No locks yet</div>
        <div style={{fontSize:13, marginBottom:16}}>Add a gateway first, then scan for linked locks.</div>
        <UI.Btn variant="primary" icon={<Icon.Plus s={14}/>} onClick={()=>dispatch({type:'openAddGateway'})}>Add Gateway</UI.Btn>
      </div>
    );
  }

  return (
    <div style={{background:TKl.BG_CONTAINER, border:`1px solid ${TKl.BORDER_SPLIT}`, borderRadius:6, boxShadow:TKl.CARD_SHADOW, overflow:'hidden'}}>
      <table style={{width:'100%', borderCollapse:'collapse', fontSize:14}}>
        <thead>
          <tr style={{background:TKl.BG_LAYOUT, color:TKl.FG_BODY, textAlign:'left'}}>
            <th style={{padding:'10px 16px', width:40}}>
              {orphans.length>0 && <UI.Checkbox checked={allOrphanSel} onChange={toggleAllOrphans}/>}
            </th>
            <th style={{padding:'10px 16px', fontWeight:400}}>Lock Name</th>
            <th style={{padding:'10px 16px', fontWeight:400}}>Gateway</th>
            <th style={{padding:'10px 16px', fontWeight:400}}>Serial Number</th>
            <th style={{padding:'10px 16px', fontWeight:400}}>Model</th>
            <th style={{padding:'10px 16px', fontWeight:400}}>Firmware</th>
            <th style={{padding:'10px 16px', fontWeight:400}}>Battery</th>
            <th style={{padding:'10px 16px', fontWeight:400}}>Status</th>
            <th style={{padding:'10px 16px', fontWeight:400}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {locks.map(lk => {
            const gw = gateways.find(g=>g.id===lk.gateway);
            const isOrphan = !lk.gateway;
            return (
              <tr key={lk.id} style={{borderTop:`1px solid ${TKl.BORDER_SPLIT}`, background: isOrphan?'#FFFBF0':'transparent'}}>
                <td style={{padding:'12px 16px'}}>
                  {isOrphan && <UI.Checkbox checked={sel.has(lk.id)} onChange={()=>toggle(lk.id)}/>}
                </td>
                <td style={{padding:'12px 16px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <Icon.Lock s={14} extra={{color: isOrphan?'#B88A0D':TKl.FG_SECONDARY}}/>
                    <span style={{color:TKl.FG_HEADING, fontWeight:500}}>{lk.name}</span>
                  </div>
                </td>
                <td style={{padding:'12px 16px', color:TKl.FG_BODY}}>
                  {gw ? gw.name : <span style={{color:'#B88A0D', fontStyle:'italic'}}>— Orphaned</span>}
                </td>
                <td style={{padding:'12px 16px', fontFamily:'ui-monospace, monospace', fontSize:12, color:TKl.FG_SECONDARY}}>{lk.serial}</td>
                <td style={{padding:'12px 16px', color:TKl.FG_BODY}}>{lk.model}</td>
                <td style={{padding:'12px 16px', color:TKl.FG_SECONDARY, fontVariantNumeric:'tabular-nums'}}>{lk.firmware}</td>
                <td style={{padding:'12px 16px'}}><UI.Battery pct={lk.battery}/></td>
                <td style={{padding:'12px 16px'}}><UI.StatusPill status={lk.status}/></td>
                <td style={{padding:'12px 16px'}}>
                  {isOrphan
                    ? <UI.Btn size="sm" variant="primary" icon={<Icon.LinkI s={12}/>} onClick={()=>dispatch({type:'openLinkOrphan', lockIds:[lk.id]})}>Link</UI.Btn>
                    : <UI.Btn size="sm" icon={<Icon.Unlink s={12}/>} onClick={()=>dispatch({type:'unlink', id:lk.id})}>Unlink</UI.Btn>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function GatewaysTable({ gateways, locks, dispatch }) {
  const { UI } = window;
  if (gateways.length===0) {
    return (
      <div style={{background:TKl.BG_CONTAINER, border:`1px solid ${TKl.BORDER_SPLIT}`, borderRadius:6, padding:64, textAlign:'center', color:TKl.FG_SECONDARY, boxShadow:TKl.CARD_SHADOW}}>
        <Icon.Gateway s={32} extra={{color:TKl.FG_DESCRIPTION, margin:'0 auto 16px'}}/>
        <div style={{fontSize:15, marginBottom:4, color:TKl.FG_HEADING, fontWeight:500}}>No gateways added yet</div>
        <div style={{fontSize:13, marginBottom:16}}>Register an ENGAGE gateway to start discovering paired locks.</div>
        <UI.Btn variant="primary" icon={<Icon.Plus s={14}/>} onClick={()=>dispatch({type:'openAddGateway'})}>Add Gateway</UI.Btn>
      </div>
    );
  }
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:12}}>
      {gateways.map(gw => {
        const linkedLocks = locks.filter(l=>l.gateway===gw.id);
        return (
          <div key={gw.id} onClick={()=>dispatch({type:'openGateway', id:gw.id})} style={{background:TKl.BG_CONTAINER, border:`1px solid ${TKl.BORDER_SPLIT}`, borderRadius:6, padding:16, boxShadow:TKl.CARD_SHADOW, cursor:'pointer', transition:'border-color .15s, box-shadow .15s'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=TKl.PRIMARY; e.currentTarget.style.boxShadow='0 2px 8px rgba(34,113,234,0.12)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=TKl.BORDER_SPLIT; e.currentTarget.style.boxShadow=TKl.CARD_SHADOW}}>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12}}>
              <div style={{width:36, height:36, borderRadius:6, background:'#EDF4FE', color:TKl.PRIMARY_TEXT, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Icon.Gateway s={18}/>
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:14, fontWeight:500, color:TKl.FG_HEADING}}>{gw.name}</div>
                <div style={{fontSize:12, color:TKl.FG_SECONDARY, fontFamily:'ui-monospace, monospace'}}>{gw.mac}</div>
              </div>
              <UI.StatusPill status="Online"/>
            </div>
            {gw.desc && <div style={{fontSize:13, color:TKl.FG_SECONDARY, marginBottom:12}}>{gw.desc}</div>}
            <div style={{fontSize:12, color:TKl.FG_SECONDARY, marginBottom:12, display:'flex', gap:16}}>
              <span><Icon.Lock s={12} extra={{display:'inline', verticalAlign:'-2px', marginRight:4}}/>{linkedLocks.length} linked locks</span>
              <span style={{color:TKl.PRIMARY_TEXT}}>· Schlage Engage (exclusive)</span>
            </div>
            <div style={{display:'flex', gap:8}}>
              <UI.Btn size="sm" variant="primary" icon={<Icon.Scan s={12}/>} onClick={(e)=>{e.stopPropagation(); dispatch({type:'openGateway', id:gw.id})}}>Open Gateway</UI.Btn>
              <UI.Btn size="sm" icon={<Icon.Settings s={12}/>} onClick={(e)=>e.stopPropagation()}>Configure</UI.Btn>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Link orphan → gateway modal
function LinkOrphanModal({ state, dispatch }) {
  const { UI } = window;
  const lockIds = state.modalData.lockIds || [];
  const selLocks = state.locks.filter(l => lockIds.includes(l.id));
  const loc = selLocks[0]?.locationId;
  const gws = state.gateways.filter(g => g.locationId === loc);
  const [gwId, setGwId] = React.useState(gws[0]?.id);

  return (
    <UI.Modal open title={`Link ${lockIds.length} Lock${lockIds.length>1?'s':''} to Gateway`} onClose={()=>dispatch({type:'closeModal'})}
      footer={<>
        <UI.Btn onClick={()=>dispatch({type:'closeModal'})}>Cancel</UI.Btn>
        <UI.Btn variant="primary" disabled={!gwId} onClick={()=>dispatch({type:'linkOrphans', lockIds, gwId})} icon={<Icon.LinkI s={13}/>}>
          Link to Gateway
        </UI.Btn>
      </>}>
      <div style={{display:'flex', flexDirection:'column', gap:16}}>
        <div style={{fontSize:13, color:TKl.FG_SECONDARY}}>
          Associate the selected orphaned lock{lockIds.length>1?'s':''} with an ENGAGE gateway at this location. Only gateways at the same location can be chosen.
        </div>
        <div style={{background:TKl.BG_LAYOUT, borderRadius:6, padding:12, display:'flex', flexDirection:'column', gap:6}}>
          {selLocks.map(lk => (
            <div key={lk.id} style={{fontSize:13, display:'flex', alignItems:'center', gap:8}}>
              <Icon.Lock s={12} extra={{color:'#B88A0D'}}/>
              <span style={{color:TKl.FG_HEADING}}>{lk.name}</span>
              <span style={{color:TKl.FG_SECONDARY, fontFamily:'ui-monospace, monospace', fontSize:11}}>{lk.serial}</span>
            </div>
          ))}
        </div>
        <div>
          <label style={{fontSize:13, fontWeight:500, color:TKl.FG_BODY, display:'block', marginBottom:8}}>Target Gateway</label>
          <div style={{display:'flex', flexDirection:'column', gap:6}}>
            {gws.map(gw => (
              <div key={gw.id} onClick={()=>setGwId(gw.id)} style={{
                padding:12, border:`1px solid ${gw.id===gwId?TKl.PRIMARY:TKl.BORDER}`, borderRadius:6,
                background: gw.id===gwId?TKl.PRIMARY_BG: TKl.BG_CONTAINER, cursor:'pointer', display:'flex', alignItems:'center', gap:12
              }}>
                <div style={{width:16, height:16, borderRadius:'50%', border:`2px solid ${gw.id===gwId?TKl.PRIMARY:TKl.BORDER}`,
                  display:'flex', alignItems:'center', justifyContent:'center'}}>
                  {gw.id===gwId && <div style={{width:8, height:8, borderRadius:'50%', background:TKl.PRIMARY}}/>}
                </div>
                <Icon.Gateway s={16} extra={{color:TKl.FG_SECONDARY}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:14, color:TKl.FG_HEADING, fontWeight:500}}>{gw.name}</div>
                  <div style={{fontSize:12, color:TKl.FG_SECONDARY, fontFamily:'ui-monospace, monospace'}}>{gw.mac}</div>
                </div>
                <UI.StatusPill status="Online"/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UI.Modal>
  );
}

window.SchlageListView = SchlageListView;
window.LocationDetail = LocationDetail;
window.LinkOrphanModal = LinkOrphanModal;
