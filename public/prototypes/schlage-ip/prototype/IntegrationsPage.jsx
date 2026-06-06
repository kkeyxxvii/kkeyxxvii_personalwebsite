// Integrations page — the Schlage card lives here
const TKi = new Proxy({}, { get: (_, k) => window.GeneaTokens[k] });

function IntegrationsPage({ state, dispatch }) {
  const { UI } = window;
  const [filter, setFilter] = React.useState('Locks');
  const filters = ['All', 'Locks', 'Elevators', 'Intrusion', 'Sensors', 'Video'];

  const schlageInstalled = state.engageConnected;

  // Other integrations shown as peers (placeholder, not interactive)
  const others = [
    { name:'Allegion XE360', vendor:'Allegion', desc:'Offline wireless locks via Mercury handheld sync', status: schlageInstalled ? null : null, tag:'Mercury Only', color:'#003865', letter:'X'},
    { name:'ASSA ABLOY Aperio', vendor:'ASSA ABLOY', desc:'Wireless RS-485 lock hubs over Mercury RIO', status:null, tag:'Mercury Only', color:'#004B87', letter:'A'},
    { name:'Kone Elevator', vendor:'Kone', desc:'Destination & conventional elevator access', status:'Connected', color:'#0066A1', letter:'K'},
    { name:'Schindler PORT', vendor:'Schindler', desc:'PORT destination dispatch for secure floors', status:null, color:'#E30613', letter:'S'},
    { name:'Bosch Intrusion', vendor:'Bosch', desc:'B & G Series panel events and arm/disarm', status:'Connected', color:'#ED1C24', letter:'B'},
    { name:'Tanlock Cabinets', vendor:'Tanlock', desc:'Smart cabinet & rack locks over gateway', status:null, color:'#111', letter:'T'},
  ];

  return (
    <div style={{padding:'24px 0', maxWidth: 1280}}>
      <UI.PageHeader
        title="Integrations"
        subtitle="Connect third-party hardware and services to Genea. Each integration lives alongside your existing access control."
        actions={
          <>
            <UI.Btn icon={<Icon.Refresh s={14}/>}>Refresh</UI.Btn>
            <UI.Btn variant="primary" icon={<Icon.Plus s={14}/>}>Request Integration</UI.Btn>
          </>
        }
      />

      {/* Filter tabs */}
      <div style={{display:'flex', gap:2, borderBottom:`1px solid ${TKi.BORDER_SPLIT}`, marginBottom:24}}>
        {filters.map(f=>(
          <div key={f} onClick={()=>setFilter(f)} style={{
            padding:'12px 16px', fontSize:14, cursor:'pointer',
            color: f===filter?TKi.PRIMARY:TKi.FG_BODY,
            borderBottom: f===filter?`2px solid ${TKi.PRIMARY}`:'2px solid transparent',
            marginBottom:-1, fontWeight: f===filter?500:400,
          }}>
            {f}
            {f==='Locks' && <span style={{marginLeft:6, fontSize:11, background:TKi.PRIMARY_BG, color:TKi.PRIMARY_TEXT, padding:'1px 6px', borderRadius:10}}>3</span>}
          </div>
        ))}
      </div>

      {/* Schlage card — the hero */}
      <SchlageCard state={state} dispatch={dispatch} variant={state.cardVariant}/>

      {/* Section header for peers */}
      <div style={{marginTop:32, marginBottom:12, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <h4 style={{margin:0, fontSize:14, fontWeight:500, color:TKi.FG_SECONDARY, textTransform:'uppercase', letterSpacing:'0.04em'}}>Other Lock Integrations</h4>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:12}}>
        {others.map(it => (
          <OtherIntegrationCard key={it.name} it={it}/>
        ))}
      </div>
    </div>
  );
}

function SchlageCard({ state, dispatch, variant='A' }) {
  const { UI } = window;
  const installed = state.engageConnected;
  const locationCount = state.enabledLocations.length;
  const lockCount = state.locks.length;
  const orphanCount = state.locks.filter(l=>!l.gateway).length;

  // Variant A: full split-pane card with two paths side-by-side (canonical, matches PRD copy)
  if (variant === 'A') {
    return (
      <div style={{
        background:TKi.BG_CONTAINER, border:`1px solid ${TKi.BORDER_SPLIT}`, borderRadius:8,
        boxShadow: TKi.CARD_SHADOW, overflow:'hidden',
      }}>
        {/* Header band */}
        <div style={{padding:'20px 24px', display:'flex', alignItems:'center', gap:16, borderBottom:`1px solid ${TKi.BORDER_SPLIT}`,
          background: `linear-gradient(90deg, ${TKi.BG_CONTAINER} 0%, ${TKi.BG_CONTAINER} 60%, ${TKi.BG_DASHED} 100%)`}}>
          <UI.SchlageMark size={48}/>
          <div style={{flex:1}}>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <h3 style={{margin:0, fontSize:18, fontWeight:600, color:TKi.FG_HEADING}}>Schlage Wireless Locks</h3>
              <span style={{fontSize:11, padding:'2px 8px', background:'#FFF5E6', color:'#D46B08', border:'1px solid #FFD591', borderRadius:10, fontWeight:500}}>NEW · Direct IP</span>
            </div>
            <div style={{marginTop:4, fontSize:13, color:TKi.FG_SECONDARY, display:'flex', alignItems:'center', gap:8}}>
              <UI.AllegionMark size={14}/>
              <span>By Allegion · NDEB, LEB series</span>
              <span style={{color:TKi.FG_DESCRIPTION}}>·</span>
              <a style={{color:TKi.LINK}}>Feature compatibility</a>
              <Icon.Ext s={10} extra={{color:TKi.LINK}}/>
            </div>
          </div>
          {installed && (
            <div style={{display:'flex', alignItems:'center', gap:12}}>
              <UI.StatusPill status="Connected"/>
              <UI.Btn icon={<Icon.Settings s={14}/>}>Manage</UI.Btn>
            </div>
          )}
        </div>

        {/* Two-path body */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1px 1fr'}}>
          {/* IP path */}
          <div style={{padding:24, position:'relative'}}>
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:6}}>
              <div style={{width:28, height:28, borderRadius:6, background:'#EDF4FE', color:TKi.PRIMARY_TEXT, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Icon.Wifi s={15}/>
              </div>
              <div style={{fontSize:14, fontWeight:600, color:TKi.FG_HEADING}}>Schlage IP <span style={{color:TKi.FG_SECONDARY, fontWeight:400}}>(ENGAGE Gateway)</span></div>
              <span style={{fontSize:10, padding:'1px 6px', background:'#EDF4FE', color:TKi.PRIMARY_TEXT, borderRadius:3, fontWeight:500, letterSpacing:'0.03em'}}>RECOMMENDED</span>
            </div>
            <p style={{margin:'0 0 12px 36px', fontSize:13, lineHeight:'20px', color:TKi.FG_SECONDARY}}>
              Use this to enable the Schlage integration for a location if using the ENGAGE Gateway in IP mode. Sets up partner authentication, adds locations, and provisions locks directly — no Mercury required.
            </p>
            <ul style={{margin:'0 0 16px 36px', padding:0, listStyle:'none', fontSize:13, color:TKi.FG_BODY}}>
              {['No Mercury controller needed','Up to 16 locks per ENGAGE gateway','Real-time events over IP'].map(t=>(
                <li key={t} style={{padding:'3px 0', display:'flex', alignItems:'center', gap:6}}>
                  <Icon.Check s={12} extra={{color:'#3A9148'}}/>{t}
                </li>
              ))}
            </ul>
            <div style={{marginLeft:36}}>
              {installed ? (
                <div style={{display:'flex', gap:8, alignItems:'center'}}>
                  <UI.Btn variant="primary" onClick={()=>dispatch({type:'goto', step:4})} iconRight={<Icon.ArrowR s={14}/>}>Open Integration</UI.Btn>
                  <span style={{fontSize:12, color:TKi.FG_SECONDARY}}>{locationCount} location{locationCount===1?'':'s'} · {lockCount} lock{lockCount===1?'':'s'} {orphanCount>0 && <span style={{color:'#B88A0D'}}>· {orphanCount} orphaned</span>}</span>
                </div>
              ) : (
                <UI.Btn variant="primary" onClick={()=>dispatch({type:'install'})}>Install</UI.Btn>
              )}
            </div>
          </div>

          <div style={{background:TKi.BORDER_SPLIT}}/>

          {/* Mercury path */}
          <div style={{padding:24, background:TKi.BG_DASHED}}>
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:6}}>
              <div style={{width:28, height:28, borderRadius:6, background:TKi.BG_LAYOUT, color:TKi.FG_SECONDARY, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Icon.Cpu s={15}/>
              </div>
              <div style={{fontSize:14, fontWeight:600, color:TKi.FG_HEADING}}>Schlage with Mercury <span style={{color:TKi.FG_SECONDARY, fontWeight:400}}>(RS-485)</span></div>
            </div>
            <p style={{margin:'0 0 12px 36px', fontSize:13, lineHeight:'20px', color:TKi.FG_SECONDARY}}>
              If using Schlage locks with a Mercury controller, go directly to your Location view in the Hardware section and start adding locks to your Mercury controller via the existing RS-485 flow.
            </p>
            <ul style={{margin:'0 0 16px 36px', padding:0, listStyle:'none', fontSize:13, color:TKi.FG_BODY}}>
              {['Existing Mercury deployments','Mixed fleets with NDE legacy hardware','RS-485 daisy-chained to PIM panel'].map(t=>(
                <li key={t} style={{padding:'3px 0', display:'flex', alignItems:'center', gap:6}}>
                  <Icon.Check s={12} extra={{color:TKi.FG_SECONDARY}}/>{t}
                </li>
              ))}
            </ul>
            <div style={{marginLeft:36}}>
              <UI.Btn iconRight={<Icon.ArrowR s={14}/>} onClick={()=>alert('(Demo) This takes you to Hardware → Location view → existing Mercury lock flow.')}>Go to Hardware</UI.Btn>
            </div>
          </div>
        </div>

        {/* Bottom meta bar */}
        <div style={{padding:'10px 24px', background:TKi.BG_DASHED, borderTop:`1px solid ${TKi.BORDER_SPLIT}`,
          display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12, color:TKi.FG_SECONDARY}}>
          <div style={{display:'flex', gap:16}}>
            <span>Supports NDEB · LEB</span>
            <span>·</span>
            <span>Firmware 3.3+</span>
            <span>·</span>
            <span>ENGAGE Gateway required</span>
          </div>
          <a style={{color:TKi.LINK, display:'flex', alignItems:'center', gap:4}}>Setup guide <Icon.Ext s={10}/></a>
        </div>
      </div>
    );
  }

  return null;
}

function OtherIntegrationCard({ it }) {
  const { UI } = window;
  return (
    <div style={{background:TKi.BG_CONTAINER, border:`1px solid ${TKi.BORDER_SPLIT}`, borderRadius:6, padding:16,
      boxShadow:TKi.CARD_SHADOW, display:'flex', flexDirection:'column', gap:12, minHeight:148}}>
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <div style={{width:36, height:36, borderRadius:6, background:it.color, color: TKi.BG_CONTAINER,
          display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16}}>{it.letter}</div>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:14, fontWeight:500, color:TKi.FG_HEADING, display:'flex', alignItems:'center', gap:8}}>
            {it.name}
            {it.tag && <span style={{fontSize:10, padding:'1px 6px', background:TKi.BG_LAYOUT, color:TKi.FG_SECONDARY, border:`1px solid ${TKi.BORDER_SPLIT}`, borderRadius:3}}>{it.tag}</span>}
          </div>
          <div style={{fontSize:12, color:TKi.FG_SECONDARY}}>{it.vendor}</div>
        </div>
        {it.status && <UI.StatusPill status={it.status}/>}
      </div>
      <p style={{margin:0, fontSize:13, color:TKi.FG_SECONDARY, lineHeight:'18px', flex:1}}>{it.desc}</p>
      <div>
        <UI.Btn size="sm" variant={it.status?'default':'default'}>{it.status ? 'Manage' : 'Install'}</UI.Btn>
      </div>
    </div>
  );
}

window.IntegrationsPage = IntegrationsPage;
