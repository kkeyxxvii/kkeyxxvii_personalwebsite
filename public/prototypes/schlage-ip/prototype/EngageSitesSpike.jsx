// EngageSitesSpike — implementation spike artifact for ENGAGE Portal → Genea data flow
const TKs = new Proxy({}, { get: (_, k) => window.GeneaTokens[k] });

function EngageSitesSpike({ state, enabled }) {
  const { UI } = window;
  const { LOCATIONS } = window.__SCHLAGE_CONSTS;
  const [tab, setTab] = React.useState('sites');

  // Synthesize a richer "discovery" view: show sites that exist in ENGAGE
  // including ones not yet mapped to a Genea location. This is the spike question.
  const engageSites = React.useMemo(() => {
    return LOCATIONS.map(l => {
      const linked = state.enabledLocations.includes(l.id);
      const gws = state.gateways.filter(g=>g.locationId===l.id).length;
      const locks = state.locks.filter(lk=>lk.locationId===l.id).length;
      let status = 'unmapped';
      if (linked && gws > 0) status = 'synced';
      else if (linked) status = 'pending';
      return { ...l, linked, gws, locks, status };
    }).concat([
      // Sites that exist in ENGAGE but have no Genea Location yet — the gap this spike addresses.
      { id:'engage-only-1', name:null, address:null, engageSite:'Boston Pilot Site', engageSiteId:'eng-site-BOS001', engageOrg:'Acme Realty Group', linked:false, gws:1, locks:4, status:'orphan-engage' },
      { id:'engage-only-2', name:null, address:null, engageSite:'Toronto Annex', engageSiteId:'eng-site-YTO007', engageOrg:'Acme Realty Group', linked:false, gws:0, locks:2, status:'orphan-engage' },
    ]);
  }, [state.enabledLocations, state.gateways, state.locks]);

  return (
    <div>
      {/* Header strip — account context */}
      <div style={{display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
        background:TKs.BG_LAYOUT, border:`1px solid ${TKs.BORDER_SPLIT}`, borderRadius:6, marginBottom:16}}>
        <UI.AllegionMark size={28}/>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:13, fontWeight:500, color:TKs.FG_HEADING}}>Allegion ENGAGE · Acme Realty Group</div>
          <div style={{fontSize:12, color:TKs.FG_SECONDARY}}>{state.engageEmail} · org_id <span style={{fontFamily:'ui-monospace, monospace'}}>org_a1b2c3d4</span></div>
        </div>
        <UI.StatusPill status="Connected"/>
      </div>

      {/* Tabs */}
      <div style={{display:'flex', gap:0, borderBottom:`1px solid ${TKs.BORDER_SPLIT}`, marginBottom:16}}>
        {[
          {id:'sites', label:'Sites', count:engageSites.length},
          {id:'flow',  label:'Data Flow'},
          {id:'questions', label:'Open Questions', count:7},
        ].map(t => (
          <div key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:'10px 14px', cursor:'pointer', fontSize:13,
            color: tab===t.id ? TKs.PRIMARY_TEXT : TKs.FG_BODY,
            borderBottom: tab===t.id ? `2px solid ${TKs.PRIMARY_TEXT}` : '2px solid transparent',
            marginBottom:-1, fontWeight: tab===t.id ? 500 : 400, display:'flex', alignItems:'center', gap:6,
          }}>
            {t.label}
            {t.count != null && (
              <span style={{fontSize:11, padding:'1px 6px', borderRadius:8,
                background: tab===t.id ? 'rgba(255,107,46,0.12)' : TKs.BG_LAYOUT,
                color: tab===t.id ? TKs.PRIMARY_TEXT : TKs.FG_SECONDARY}}>{t.count}</span>
            )}
          </div>
        ))}
      </div>

      {tab === 'sites' && <SitesTab engageSites={engageSites}/>}
      {tab === 'flow' && <FlowTab/>}
      {tab === 'questions' && <QuestionsTab/>}
    </div>
  );
}

// ---------- Sites tab ----------
function SitesTab({ engageSites }) {
  const grouped = {
    synced: engageSites.filter(s=>s.status==='synced'),
    pending: engageSites.filter(s=>s.status==='pending'),
    'orphan-engage': engageSites.filter(s=>s.status==='orphan-engage'),
    unmapped: engageSites.filter(s=>s.status==='unmapped'),
  };

  return (
    <div>
      <SpikeNote tone="neutral">
        Authoritative source for ENGAGE sites is the Allegion ENGAGE Portal. Genea polls
        <code style={codeS}> GET /v1/organizations/&#123;org_id&#125;/sites</code> on connect and on a 15&nbsp;min cadence.
        Each site below shows its current sync state with Genea.
      </SpikeNote>

      <SiteGroup title="Synced" tone="ok" items={grouped.synced}/>
      <SiteGroup title="Mapped — awaiting gateway" tone="warn" items={grouped.pending}/>
      <SiteGroup title="In ENGAGE only — needs Genea Location" tone="alert" items={grouped['orphan-engage']}/>
      <SiteGroup title="Available to map" tone="muted" items={grouped.unmapped}/>
    </div>
  );
}

function SiteGroup({ title, tone, items }) {
  if (items.length === 0) return null;
  const toneColor = { ok:'#3A9148', warn:'#B88A0D', alert:'#C8102E', muted:TKs.FG_SECONDARY }[tone];
  return (
    <div style={{marginBottom:18}}>
      <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:8}}>
        <span style={{display:'inline-block', width:8, height:8, borderRadius:'50%', background:toneColor}}/>
        <div style={{fontSize:12, fontWeight:500, color:TKs.FG_HEADING, textTransform:'uppercase', letterSpacing:'0.04em'}}>{title}</div>
        <span style={{fontSize:12, color:TKs.FG_SECONDARY}}>· {items.length}</span>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        {items.map(s => <SiteCard key={s.id} site={s}/>)}
      </div>
    </div>
  );
}

function SiteCard({ site }) {
  const { UI } = window;
  const isOrphan = site.status === 'orphan-engage';
  const isUnmapped = site.status === 'unmapped';

  return (
    <div style={{border:`1px solid ${TKs.BORDER_SPLIT}`, borderRadius:6, background:TKs.BG_CONTAINER, overflow:'hidden'}}>
      <div style={{display:'grid', gridTemplateColumns:'1fr 24px 1fr', gap:12, alignItems:'center', padding:'12px 14px'}}>
        {/* Genea side */}
        <div style={{minWidth:0}}>
          <div style={{fontSize:11, color:TKs.FG_SECONDARY, textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:4, display:'flex', alignItems:'center', gap:4}}>
            <Icon.Building s={11}/> Genea Location
          </div>
          {site.name ? (
            <>
              <div style={{fontSize:13, fontWeight:500, color:TKs.FG_HEADING, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{site.name}</div>
              <div style={{fontSize:11, color:TKs.FG_SECONDARY, fontFamily:'ui-monospace, monospace'}}>{site.id}</div>
            </>
          ) : (
            <div style={{fontSize:12, color:'#C8102E', fontStyle:'italic'}}>— not yet created —</div>
          )}
        </div>
        {/* Arrow */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', color:TKs.FG_DESCRIPTION}}>
          <Icon.ArrowR s={14}/>
        </div>
        {/* ENGAGE side */}
        <div style={{minWidth:0}}>
          <div style={{fontSize:11, color:'#C8102E', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:4, display:'flex', alignItems:'center', gap:4}}>
            <span style={{display:'inline-block', width:10, height:10, borderRadius:2, background:'#C8102E'}}/> ENGAGE Site
          </div>
          <div style={{fontSize:13, fontWeight:500, color:TKs.FG_HEADING, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{site.engageSite}</div>
          <div style={{fontSize:11, color:TKs.FG_SECONDARY, fontFamily:'ui-monospace, monospace'}}>{site.engageSiteId}</div>
        </div>
      </div>
      <div style={{padding:'8px 14px', borderTop:`1px solid ${TKs.BORDER_SPLIT}`, background:TKs.BG_LAYOUT,
        display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12, color:TKs.FG_SECONDARY}}>
        <span>
          <Icon.Gateway s={11} extra={{verticalAlign:'-1px', marginRight:4}}/> {site.gws} gateway{site.gws===1?'':'s'}
          <span style={{margin:'0 8px', color:TKs.BORDER}}>·</span>
          <Icon.Lock s={11} extra={{verticalAlign:'-1px', marginRight:4}}/> {site.locks} lock{site.locks===1?'':'s'}
        </span>
        <span>
          {isOrphan && <a style={{color:TKs.LINK, cursor:'pointer', marginRight:12}}>Create Genea Location →</a>}
          {isUnmapped && <a style={{color:TKs.LINK, cursor:'pointer', marginRight:12}}>Map to ENGAGE site →</a>}
          <a style={{color:TKs.LINK, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:4}}>
            ENGAGE Portal <Icon.Ext s={11}/>
          </a>
        </span>
      </div>
    </div>
  );
}

// ---------- Data Flow tab ----------
function FlowTab() {
  return (
    <div>
      <SpikeNote tone="neutral">
        Sites, gateways, and locks are <strong style={{color:TKs.FG_HEADING}}>created in ENGAGE first</strong>. Genea is a downstream consumer.
        The flow below documents the proposed mechanism for the spike.
      </SpikeNote>

      {/* System diagram */}
      <SectionTitle>Topology</SectionTitle>
      <div style={{border:`1px solid ${TKs.BORDER_SPLIT}`, borderRadius:6, padding:20, background:TKs.BG_CONTAINER, marginBottom:20}}>
        <Topology/>
      </div>

      {/* Sequence diagram */}
      <SectionTitle>Discovery sequence</SectionTitle>
      <Sequence/>

      {/* Entity model */}
      <SectionTitle>Entity mapping</SectionTitle>
      <EntityTable/>

      {/* Sync cadence */}
      <SectionTitle>Sync triggers</SectionTitle>
      <SyncTable/>
    </div>
  );
}

function Topology() {
  // Three columns: ENGAGE Portal | Genea Backend | Genea UI
  const Box = ({title, sub, color, children}) => (
    <div style={{border:`1px solid ${color || TKs.BORDER}`, borderRadius:6, padding:'10px 12px', background:TKs.BG_CONTAINER, fontSize:12}}>
      <div style={{fontSize:11, color: color || TKs.FG_SECONDARY, textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:4}}>{title}</div>
      <div style={{color:TKs.FG_HEADING, fontWeight:500}}>{sub}</div>
      {children && <div style={{marginTop:6, color:TKs.FG_SECONDARY, fontSize:11}}>{children}</div>}
    </div>
  );

  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, alignItems:'start'}}>
      {/* ENGAGE Portal column */}
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        <ColumnHeader color="#C8102E" label="Allegion ENGAGE"/>
        <Box title="Site" sub="Boston Pilot" color="#C8102E">eng-site-BOS001</Box>
        <Box title="Gateway" sub="Floor 3 GW" color="#C8102E">MAC 00:1A:2B:…</Box>
        <Box title="Lock" sub="NDEB · Lobby">SN AC23-09812</Box>
      </div>

      {/* Middle column: arrows + integration service */}
      <div style={{display:'flex', flexDirection:'column', gap:8, alignItems:'center'}}>
        <ColumnHeader color={TKs.PRIMARY_TEXT} label="Genea Backend"/>
        <Box title="Schlage Adapter" sub="schlage-engage-svc" color={TKs.PRIMARY_TEXT}>
          OAuth2 client · Polling worker · Webhook receiver
        </Box>
        <ArrowDown label="REST + webhook"/>
        <Box title="Sync DB" sub="engage_sites · gateways · locks">
          {'site_id ↔ location_id mapping'}
        </Box>
        <ArrowDown label="GraphQL"/>
      </div>

      {/* Genea UI column */}
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        <ColumnHeader color="#3A9148" label="Genea Console"/>
        <Box title="Location" sub="NYC HQ" color="#3A9148">nyc-hq</Box>
        <Box title="Door + Reader" sub="Lobby Main">paired to lock</Box>
        <Box title="Events" sub="Access · Battery · Tamper">live stream</Box>
      </div>

      {/* Cross-column flow line */}
      <div style={{gridColumn:'1 / span 3', marginTop:6, paddingTop:10, borderTop:`1px dashed ${TKs.BORDER}`,
        display:'flex', justifyContent:'space-between', fontSize:11, color:TKs.FG_SECONDARY}}>
        <span>① Site/gateway/lock created in ENGAGE</span>
        <span>② Discovered via API/webhook</span>
        <span>③ Surfaced as Location/Door</span>
      </div>
    </div>
  );
}

function ColumnHeader({color, label}) {
  return (
    <div style={{display:'flex', alignItems:'center', gap:6, paddingBottom:6, borderBottom:`2px solid ${color}`, marginBottom:2}}>
      <span style={{display:'inline-block', width:8, height:8, borderRadius:2, background:color}}/>
      <span style={{fontSize:12, fontWeight:500, color:TKs.FG_HEADING}}>{label}</span>
    </div>
  );
}

function ArrowDown({label}) {
  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', color:TKs.FG_SECONDARY, fontSize:10}}>
      <div style={{width:1, height:10, background:TKs.BORDER}}/>
      <span style={{padding:'1px 6px', background:TKs.BG_LAYOUT, border:`1px solid ${TKs.BORDER_SPLIT}`, borderRadius:10, fontSize:10}}>{label}</span>
      <div style={{width:0, height:0, borderLeft:'4px solid transparent', borderRight:'4px solid transparent', borderTop:`5px solid ${TKs.BORDER}`}}/>
    </div>
  );
}

function Sequence() {
  const lanes = ['ENGAGE Portal', 'Allegion API', 'Genea Adapter', 'Genea DB', 'Genea UI'];
  const steps = [
    {from:0, to:1, label:'Admin creates Site, Gateway, Lock', tone:'red'},
    {from:2, to:1, label:'GET /sites?org_id', tone:'blue'},
    {from:1, to:2, label:'200 [sites]', tone:'blue', dashed:true},
    {from:2, to:1, label:'GET /sites/{id}/gateways', tone:'blue'},
    {from:2, to:1, label:'GET /gateways/{id}/locks', tone:'blue'},
    {from:2, to:3, label:'UPSERT engage_sites + gateways + locks', tone:'green'},
    {from:1, to:2, label:'webhook: lock.battery_low', tone:'orange', dashed:true},
    {from:2, to:3, label:'UPDATE locks SET battery=…', tone:'green'},
    {from:3, to:4, label:'GraphQL subscription tick', tone:'green'},
  ];
  const toneColor = { red:'#C8102E', blue:TKs.LINK, green:'#3A9148', orange:'#B88A0D' };

  return (
    <div style={{border:`1px solid ${TKs.BORDER_SPLIT}`, borderRadius:6, padding:14, background:TKs.BG_CONTAINER, marginBottom:20, overflow:'auto'}}>
      <div style={{minWidth:580}}>
        {/* Lane headers */}
        <div style={{display:'grid', gridTemplateColumns:`repeat(${lanes.length}, 1fr)`, gap:0, marginBottom:8}}>
          {lanes.map((l,i) => (
            <div key={i} style={{textAlign:'center', fontSize:11, fontWeight:500, color:TKs.FG_HEADING,
              padding:'6px 4px', borderBottom:`2px solid ${TKs.BORDER}`}}>{l}</div>
          ))}
        </div>
        {/* Lane lines + arrows */}
        <div style={{position:'relative', paddingTop:4}}>
          {/* Vertical lane lines */}
          <div style={{position:'absolute', inset:0, display:'grid', gridTemplateColumns:`repeat(${lanes.length}, 1fr)`, pointerEvents:'none'}}>
            {lanes.map((_,i) => (
              <div key={i} style={{display:'flex', justifyContent:'center'}}>
                <div style={{width:1, background:TKs.BORDER_SPLIT, height:'100%'}}/>
              </div>
            ))}
          </div>
          {/* Steps */}
          <div style={{position:'relative', display:'flex', flexDirection:'column', gap:10}}>
            {steps.map((s,i) => <SequenceStep key={i} step={s} lanes={lanes.length} toneColor={toneColor[s.tone]}/>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function SequenceStep({step, lanes, toneColor}) {
  const left = Math.min(step.from, step.to);
  const span = Math.abs(step.to - step.from);
  const reverse = step.to < step.from;
  // Compute % positions
  const colW = 100 / lanes;
  const startPct = (left + 0.5) * colW;
  const widthPct = span * colW;

  return (
    <div style={{position:'relative', height:24}}>
      <div style={{position:'absolute', left:`${startPct}%`, width:`${widthPct}%`, top:10, height:0,
        borderTop: step.dashed ? `1px dashed ${toneColor}` : `1px solid ${toneColor}`}}/>
      {/* Arrowhead */}
      <div style={{position:'absolute', left: reverse ? `${startPct}%` : `calc(${startPct + widthPct}% - 6px)`, top:6,
        width:0, height:0,
        borderTop:'4px solid transparent', borderBottom:'4px solid transparent',
        ...(reverse ? {borderRight:`6px solid ${toneColor}`} : {borderLeft:`6px solid ${toneColor}`})}}/>
      {/* Label */}
      <div style={{position:'absolute', left:`${startPct}%`, width:`${widthPct}%`, top:-4, textAlign:'center',
        fontSize:10, color:TKs.FG_BODY, padding:'0 4px', fontFamily:'ui-monospace, monospace'}}>
        <span style={{background:TKs.BG_CONTAINER, padding:'0 4px'}}>{step.label}</span>
      </div>
    </div>
  );
}

function EntityTable() {
  const rows = [
    {engage:'Organization', genea:'Tenant',     id:'org_id ↔ tenant_id', source:'manual at connect-time'},
    {engage:'Site',         genea:'Location',   id:'engage_site_id ↔ location_id', source:'mapped via Add Location flow'},
    {engage:'Gateway',      genea:'Gateway',    id:'engage_gateway_id (1:1)',     source:'auto-imported on site sync'},
    {engage:'Lock (NDEB/LEB)', genea:'Lock + Reader', id:'engage_lock_id (1:1)',  source:'auto-imported, attached to Door'},
    {engage:'—',            genea:'Door',       id:'created in Genea',            source:'user creates, then attaches lock'},
    {engage:'Credential',   genea:'Credential', id:'shared via Genea credential service', source:'pushed to ENGAGE per-lock'},
  ];
  return (
    <div style={{border:`1px solid ${TKs.BORDER_SPLIT}`, borderRadius:6, overflow:'hidden', marginBottom:20}}>
      <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
        <thead>
          <tr style={{background:TKs.BG_LAYOUT, color:TKs.FG_BODY, textAlign:'left'}}>
            <th style={thS}>ENGAGE</th>
            <th style={thS}>Genea</th>
            <th style={thS}>Identifier</th>
            <th style={thS}>Source of truth</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={i} style={{borderTop:`1px solid ${TKs.BORDER_SPLIT}`}}>
              <td style={tdS}><span style={{color:'#C8102E', fontWeight:500}}>{r.engage}</span></td>
              <td style={tdS}><span style={{color:'#3A9148', fontWeight:500}}>{r.genea}</span></td>
              <td style={{...tdS, fontFamily:'ui-monospace, monospace', fontSize:11, color:TKs.FG_SECONDARY}}>{r.id}</td>
              <td style={{...tdS, color:TKs.FG_SECONDARY}}>{r.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SyncTable() {
  const rows = [
    {trigger:'Connect ENGAGE account',  scope:'Full org pull',         method:'REST polling',  freq:'on-demand'},
    {trigger:'Add Location (map site)', scope:'Single site + children', method:'REST polling',  freq:'on-demand'},
    {trigger:'Background reconcile',    scope:'Org-level diff',         method:'REST polling',  freq:'every 15 min'},
    {trigger:'Lock event (access, battery, tamper)', scope:'Single lock', method:'Webhook', freq:'real-time'},
    {trigger:'Gateway online/offline',  scope:'Single gateway',         method:'Webhook',       freq:'real-time'},
    {trigger:'Manual "Sync" button',    scope:'Single location',        method:'REST polling',  freq:'on-demand'},
  ];
  return (
    <div style={{border:`1px solid ${TKs.BORDER_SPLIT}`, borderRadius:6, overflow:'hidden', marginBottom:20}}>
      <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
        <thead>
          <tr style={{background:TKs.BG_LAYOUT, color:TKs.FG_BODY, textAlign:'left'}}>
            <th style={thS}>Trigger</th>
            <th style={thS}>Scope</th>
            <th style={thS}>Method</th>
            <th style={thS}>Frequency</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={i} style={{borderTop:`1px solid ${TKs.BORDER_SPLIT}`}}>
              <td style={tdS}>{r.trigger}</td>
              <td style={{...tdS, color:TKs.FG_SECONDARY}}>{r.scope}</td>
              <td style={tdS}>
                <span style={{padding:'2px 6px', borderRadius:4, fontSize:11, fontWeight:500,
                  background: r.method==='Webhook' ? 'rgba(58,145,72,0.12)' : 'rgba(58,107,187,0.12)',
                  color: r.method==='Webhook' ? '#3A9148' : TKs.LINK}}>{r.method}</span>
              </td>
              <td style={{...tdS, color:TKs.FG_SECONDARY, fontFamily:'ui-monospace, monospace', fontSize:11}}>{r.freq}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- Open Questions tab ----------
function QuestionsTab() {
  const items = [
    {q:'What happens when a site is renamed in ENGAGE?',
     opts:['Auto-update Genea Location name', 'Flag as conflict, require admin confirm'],
     rec:'Auto-update; preserve admin-set Genea name with a "name overridden" flag'},
    {q:'What happens when a site is deleted in ENGAGE?',
     opts:['Delete Genea Location', 'Mark Location as orphaned, preserve history'],
     rec:'Mark orphaned. Hard delete only on explicit admin action; preserves audit trail'},
    {q:'What if a gateway is moved between sites in ENGAGE?',
     opts:['Re-parent in Genea automatically', 'Detach + require admin re-link'],
     rec:'Re-parent automatically; emit audit event. Locks follow the gateway'},
    {q:'Webhook delivery guarantees?',
     opts:['Trust ENGAGE webhooks as source-of-truth', 'Webhook + periodic reconcile'],
     rec:'Webhook + 15&nbsp;min reconcile. Webhooks are best-effort per Allegion docs'},
    {q:'Auth model for the integration?',
     opts:['Per-tenant OAuth (user delegated)', 'Shared service account (M2M)'],
     rec:'Per-tenant OAuth2 authorization-code with offline_access. Refresh tokens stored encrypted'},
    {q:'How do we handle ENGAGE rate limits?',
     opts:['Naive retry', 'Token bucket per org_id with backoff'],
     rec:'Token bucket per org_id, 429-aware exponential backoff. Allegion limit is ~100 req/min'},
    {q:'Bootstrapping a Genea Location from an ENGAGE-only site?',
     opts:['Block until admin creates Genea Location first', 'Offer "Import as Genea Location" CTA'],
     rec:'Show CTA in this drawer (see "In ENGAGE only" section). One-click create + auto-map'},
  ];

  return (
    <div>
      <SpikeNote tone="warn">
        These decisions block the implementation. Each needs a product/eng sign-off before development starts.
      </SpikeNote>
      <div style={{display:'flex', flexDirection:'column', gap:10}}>
        {items.map((it,i) => (
          <div key={i} style={{border:`1px solid ${TKs.BORDER_SPLIT}`, borderRadius:6, background:TKs.BG_CONTAINER, padding:'12px 14px'}}>
            <div style={{display:'flex', gap:10, alignItems:'flex-start', marginBottom:8}}>
              <div style={{flexShrink:0, width:20, height:20, borderRadius:'50%', background:TKs.BG_LAYOUT,
                border:`1px solid ${TKs.BORDER}`, display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:11, fontWeight:600, color:TKs.FG_HEADING, fontVariantNumeric:'tabular-nums'}}>{i+1}</div>
              <div style={{flex:1, fontSize:13, fontWeight:500, color:TKs.FG_HEADING}}>{it.q}</div>
            </div>
            <div style={{paddingLeft:30, marginBottom:8}}>
              {it.opts.map((o,j) => (
                <div key={j} style={{display:'flex', gap:6, fontSize:12, color:TKs.FG_SECONDARY, marginBottom:3}}>
                  <span style={{color:TKs.FG_DESCRIPTION}}>○</span><span>{o}</span>
                </div>
              ))}
            </div>
            <div style={{paddingLeft:30, paddingTop:8, borderTop:`1px dashed ${TKs.BORDER_SPLIT}`,
              display:'flex', gap:8, alignItems:'flex-start'}}>
              <span style={{flexShrink:0, fontSize:10, fontWeight:600, color:'#3A9148', textTransform:'uppercase', letterSpacing:'0.04em', marginTop:1}}>Proposed</span>
              <span style={{fontSize:12, color:TKs.FG_BODY}} dangerouslySetInnerHTML={{__html: it.rec}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Shared bits ----------
function SectionTitle({children}) {
  return <div style={{fontSize:12, fontWeight:500, color:TKs.FG_HEADING, textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:8, marginTop:4}}>{children}</div>;
}

function SpikeNote({tone='neutral', children}) {
  const colors = {
    neutral: {bg:TKs.BG_LAYOUT, border:TKs.BORDER_SPLIT, icon:TKs.FG_DESCRIPTION},
    warn:    {bg:'rgba(184,138,13,0.06)', border:'rgba(184,138,13,0.3)', icon:'#B88A0D'},
  }[tone];
  return (
    <div style={{padding:'10px 12px', background:colors.bg, border:`1px solid ${colors.border}`, borderRadius:6,
      fontSize:12, color:TKs.FG_BODY, display:'flex', gap:8, alignItems:'flex-start', marginBottom:16, lineHeight:1.5}}>
      <Icon.Info s={13} extra={{flexShrink:0, marginTop:2, color:colors.icon}}/>
      <div>{children}</div>
    </div>
  );
}

const codeS = {fontFamily:'ui-monospace, monospace', fontSize:11, padding:'1px 5px', background:'rgba(0,0,0,0.04)', borderRadius:3};
const thS = {padding:'8px 12px', fontWeight:500, fontSize:11, textTransform:'uppercase', letterSpacing:'0.04em', color:TKs.FG_SECONDARY};
const tdS = {padding:'8px 12px', color:TKs.FG_HEADING};

window.EngageSitesSpike = EngageSitesSpike;
