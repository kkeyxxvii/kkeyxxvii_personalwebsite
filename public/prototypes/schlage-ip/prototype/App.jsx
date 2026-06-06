// Root app + state reducer + Chrome for Schlage IP prototype
const TKr = new Proxy({}, { get: (_, k) => window.GeneaTokens[k] });

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "cardVariant": "A",
  "seedConnected": false,
  "density": "comfortable"
}/*EDITMODE-END*/;

function reduce(state, action) {
  const { SEED_CONNECTED, LOCATIONS } = window.__SCHLAGE_CONSTS;
  switch(action.type) {
    case 'install':
      return { ...state, modal:'auth' };
    case 'closeModal':
      return { ...state, modal:null, modalData:{} };
    case 'authSuccess':
      return { ...state, engageConnected:true, engageEmail:action.email, modal:'locations', step:3 };
    case 'openLocations':
      return { ...state, modal:'locations' };
    case 'enableLocations': {
      const existing = new Set(state.enabledLocations);
      action.ids.forEach(id => existing.add(id));
      const next = [...existing];
      return { ...state, enabledLocations: next, modal:null, step:4,
        toast:{type:'success', message:`Added ${action.ids.length} location${action.ids.length>1?'s':''} to Schlage IP integration.`}};
    }
    case 'goto':
      return { ...state, step:action.step };
    case 'openLocation':
      return { ...state, selectedLocation:action.id, step:5 };
    case 'openAddGateway':
      return { ...state, modal:'addGateway' };
    case 'addGateway': {
      const id = `gw-${Date.now()}`;
      const gateway = { id, name:action.name, desc:action.desc, mac:action.mac, serial:action.serial, applications:action.applications, locationId:state.selectedLocation };
      return { ...state, gateways:[...state.gateways, gateway], modal:null, selectedGateway:id, step:7,
        toast:{type:'success', message:`Gateway "${action.name}" added. Scan nearby locks to link them.`}};
    }
    case 'openGateway':
      return { ...state, selectedGateway:action.id, step:7 };
    case 'openScanLocks':
      // Legacy alias — now routes to gateway detail page (Nearby Locks tab)
      return { ...state, selectedGateway:action.gatewayId, step:7 };
    case 'linkScanned': {
      const newLocks = action.lockIds.map(dId => {
        const disc = action.discovered.find(d => d.id === dId);
        const gw = state.gateways.find(g => g.id === action.gwId);
        return { id:`lk-${Date.now()}-${Math.random()}`, name:disc.name, serial:disc.serial, gateway:action.gwId,
          firmware:disc.firmware, model:disc.model, battery:disc.battery, status:'Online', locationId:gw?.locationId || state.selectedLocation };
      });
      return { ...state, locks:[...state.locks, ...newLocks], modal:null,
        toast:{type:'success', message:`Linked ${newLocks.length} lock${newLocks.length>1?'s':''} to gateway.`}};
    }
    case 'openLinkOrphan':
      return { ...state, modal:'linkOrphan', modalData:{lockIds:action.lockIds}};
    case 'linkOrphans': {
      return { ...state, locks:state.locks.map(l => action.lockIds.includes(l.id) ? {...l, gateway:action.gwId, status:'Online'} : l),
        modal:null, toast:{type:'success', message:`Linked ${action.lockIds.length} orphan${action.lockIds.length>1?'s':''}.`}};
    }
    case 'unlink':
      return { ...state, locks:state.locks.map(l => l.id===action.id ? {...l, gateway:null, status:'Orphaned'} : l),
        toast:{type:'success', message:'Lock unlinked from gateway.'}};
    case 'openCreateDoor':
      return { ...state, modal:'createDoor' };
    case 'createDoor': {
      const id = `dr-${Date.now()}`;
      const door = { id, name:action.name, desc:action.desc, locationId:action.locationId, lockId:null };
      const next = { ...state, doors:[...state.doors, door], step:8,
        toast:{type:'success', message:`Door "${action.name}" created.`}};
      if (action.thenAttach) {
        return { ...next, modal:'attachLock', modalData:{doorId:id}};
      }
      return { ...next, modal:null };
    }
    case 'openAttachLock':
      return { ...state, modal:'attachLock', modalData:{doorId:action.doorId}};
    case 'attachLock': {
      const door = state.doors.find(d => d.id === action.doorId);
      return { ...state, doors:state.doors.map(d => d.id===action.doorId ? {...d, lockId:action.lockId} : d),
        modal:null, step:9, modalData:{doorId:action.doorId},
        toast:{type:'success', message:'Lock attached. Full Schlage features enabled.'}};
    }
    case 'openDoorDetail':
      return { ...state, step:9, modalData:{doorId:action.id}};
    case 'clearToast':
      return { ...state, toast:null };
    case 'reset':
      return { ...window.__SCHLAGE_CONSTS.INITIAL_STATE, cardVariant: state.cardVariant };
    case 'seed':
      return { ...state, ...window.__SCHLAGE_CONSTS.SEED_CONNECTED, step: action.step || state.step };
    case 'setVariant':
      return { ...state, cardVariant: action.variant };
    default:
      return state;
  }
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [state, dispatch] = React.useReducer(reduce, window.__SCHLAGE_CONSTS.INITIAL_STATE);
  const [collapsed, setCollapsed] = React.useState(false);
  const [theme, setTheme] = React.useState('light');
  const seededOnce = React.useRef(false);

  // Apply theme to GeneaTokens + body whenever it changes; track resolved key for remount
  const [themeNonce, setThemeNonce] = React.useState(0);
  React.useEffect(() => {
    window.applyTheme(theme);
    setThemeNonce(n => n + 1);
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => { window.applyTheme('system'); setThemeNonce(n => n + 1); };
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
  }, [theme]);

  // Sync tweak → state
  React.useEffect(() => {
    if (tweaks.cardVariant !== state.cardVariant) {
      dispatch({type:'setVariant', variant: tweaks.cardVariant});
    }
  }, [tweaks.cardVariant]);

  React.useEffect(() => {
    if (tweaks.seedConnected && !seededOnce.current) {
      seededOnce.current = true;
      dispatch({type:'seed'});
    }
  }, [tweaks.seedConnected]);

  const { UI } = window;

  // Sidebar stub — show "Integrations" selected by default. When at step 8/9, show "Hardware".
  const selected = (state.step === 8 || state.step === 9) ? 'hardware' : 'integrations';

  return (
    <div key={themeNonce} style={{display:'flex', minHeight:'100vh', fontFamily:TKr.FONT, background:window.GeneaTokens.BG_LAYOUT}}>
      <Sidebar collapsed={collapsed} selected={selected} onSelect={(k)=>{
        if (k==='integrations') dispatch({type:'goto', step:1});
        else if (k==='hardware') dispatch({type:'goto', step:8});
      }} onToggle={()=>setCollapsed(!collapsed)}/>
      <div style={{flex:1, display:'flex', flexDirection:'column', minWidth:0}}>
        <Header user={{name:'Alex Kim', role:'Security Admin'}} onLogout={()=>{}}
          theme={theme} onThemeChange={setTheme}/>
        <main style={{flex:1, padding:'0 24px', overflowY:'auto'}}>
          {(state.step === 1 || state.step === 2) && <IntegrationsPage state={state} dispatch={dispatch}/>}
          {state.step === 3 && <IntegrationsPage state={state} dispatch={dispatch}/>}
          {state.step === 4 && <SchlageListView state={state} dispatch={dispatch}/>}
          {state.step === 5 && <LocationDetail state={state} dispatch={dispatch}/>}
          {state.step === 7 && <GatewayDetail state={state} dispatch={dispatch}/>}
          {state.step === 8 && <DoorsPage state={state} dispatch={dispatch}/>}
          {state.step === 9 && <DoorDetail state={state} dispatch={dispatch}/>}
        </main>
      </div>

      {/* Modals */}
      {state.modal === 'auth' && <AuthModal state={state} dispatch={dispatch}/>}
      {state.modal === 'locations' && <LocationsModal state={state} dispatch={dispatch}/>}
      {state.modal === 'addGateway' && <AddGatewayModal state={state} dispatch={dispatch}/>}
      {state.modal === 'linkOrphan' && <LinkOrphanModal state={state} dispatch={dispatch}/>}
      {state.modal === 'createDoor' && <CreateDoorModal state={state} dispatch={dispatch}/>}
      {state.modal === 'attachLock' && <AttachLockModal state={state} dispatch={dispatch}/>}

      {/* Toast */}
      <UI.Toast toast={state.toast} onClose={()=>dispatch({type:'clearToast'})}/>

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Flow"/>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:4, padding:'4px 0'}}>
          {[{s:1,l:'1 · Card'},{s:2,l:'2 · Auth'},{s:4,l:'4 · List'},{s:5,l:'5 · Loc'},{s:7,l:'7 · GW'},{s:8,l:'8 · Doors'},{s:9,l:'9 · Detail'}].map(x=>(
            <button key={x.s} onClick={()=>dispatch({type:'goto', step:x.s})} style={{
              padding:'4px 6px', fontSize:10.5, background: state.step===x.s?'rgba(34,113,234,0.2)':'rgba(255,255,255,0.5)',
              border:'.5px solid rgba(0,0,0,0.1)', borderRadius:4, cursor:'pointer', color:'#29261b'
            }}>{x.l}</button>
          ))}
        </div>
        <TweakButton label="Reset demo" onClick={()=>{ seededOnce.current=false; setTweak('seedConnected', false); dispatch({type:'reset'}); }}>Reset</TweakButton>
        <TweakButton label="Seed demo data" onClick={()=>{ seededOnce.current=true; dispatch({type:'seed'}); }}>Load</TweakButton>

        <TweakSection label="Card variant"/>
        <TweakRadio label="Schlage card" value={tweaks.cardVariant}
          options={['A']}
          onChange={(v)=>setTweak('cardVariant', v)}/>

        <TweakSection label="State"/>
        <div style={{fontSize:10.5, color:'#29261b', padding:'2px 0', opacity:0.7}}>
          Step {state.step} · {state.engageConnected ? 'Connected' : 'Not connected'}<br/>
          {state.enabledLocations.length} loc · {state.gateways.length} gw · {state.locks.length} locks · {state.doors.length} doors
        </div>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
