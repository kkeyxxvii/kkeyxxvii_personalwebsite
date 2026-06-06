// UI primitives matched to Genea design system
const TK = new Proxy({}, { get: (_, k) => window.GeneaTokens[k] });

// Button — primary / default / text / link
function Btn({ children, variant='default', size='md', icon, iconRight, disabled, danger, onClick, style, block, ...rest }) {
  const h = size==='lg' ? 40 : size==='sm' ? 24 : 32;
  const pad = size==='lg' ? 16 : size==='sm' ? 8 : 15;
  const bg = {
    primary: danger ? TK.ERROR : TK.PRIMARY,
    default: TK.BG_CONTAINER,
    text: 'transparent',
    link: 'transparent',
    ghost: 'transparent',
  }[variant];
  const color = {
    primary: '#fff',
    default: danger ? TK.ERROR : TK.FG_BODY,
    text: danger ? TK.ERROR : TK.FG_BODY,
    link: TK.LINK,
    ghost: TK.FG_BODY,
  }[variant];
  const border = {
    primary: danger ? TK.ERROR : TK.PRIMARY,
    default: danger ? TK.ERROR : TK.BORDER,
    text: 'transparent',
    link: 'transparent',
    ghost: TK.BORDER,
  }[variant];
  return (
    <button disabled={disabled} onClick={onClick} {...rest} style={{
      height: h, padding: `0 ${pad}px`, fontSize: 14, lineHeight: '20px',
      background: disabled ? TK.BORDER_SPLIT : bg, color: disabled ? TK.FG_DISABLED : color,
      border: `1px solid ${disabled ? TK.BORDER_SPLIT : border}`, borderRadius: 6,
      cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: TK.FONT, fontWeight: variant==='primary'?500:400,
      display:'inline-flex', alignItems:'center', gap:6, transition:'all .15s', width: block?'100%':'auto',
      justifyContent: block?'center':'flex-start',
      ...style,
    }}>
      {icon}{children}{iconRight}
    </button>
  );
}

function Input({ value, onChange, placeholder, type='text', prefix, suffix, disabled, style, size='md', ...rest }) {
  const h = size==='lg' ? 40 : size==='sm' ? 24 : 32;
  return (
    <div style={{
      height: h, display:'flex', alignItems:'center', gap: 8,
      padding:'0 11px', background: disabled?TK.BORDER_SPLIT:TK.BG_CONTAINER,
      border:`1px solid ${TK.BORDER}`, borderRadius: 6,
      ...style,
    }}>
      {prefix && <span style={{color:TK.FG_SECONDARY, display:'flex'}}>{prefix}</span>}
      <input value={value} onChange={e=>onChange&&onChange(e.target.value)} type={type} placeholder={placeholder}
        disabled={disabled}
        style={{flex:1, border:'none', outline:'none', background:'transparent',
          fontSize:14, fontFamily:TK.FONT, color:TK.FG_HEADING, minWidth:0}}
        {...rest}/>
      {suffix && <span style={{color:TK.FG_SECONDARY, display:'flex'}}>{suffix}</span>}
    </div>
  );
}

// Status pill (Online / Offline / Orphaned / Active / etc)
function StatusPill({ status }) {
  const map = {
    'Online':      { c:'#3A9148', b:'#E8F5EB', br:'#B4D9BC', dot:'#57B867' },
    'Offline':     { c:'#B8342D', b:'#FDEDED', br:'#F2B8B5', dot:'#D44C46' },
    'Orphaned':    { c:'#B88A0D', b:'#FEFAEC', br:'#F7E4A8', dot:'#F3C33F' },
    'Active':      { c:'#1557B0', b:'#EDF4FE', br:'#BED6F8', dot:'#2271EA' },
    'Pending':     { c:'#B88A0D', b:'#FEFAEC', br:'#F7E4A8', dot:'#F3C33F' },
    'Connected':   { c:'#3A9148', b:'#E8F5EB', br:'#B4D9BC', dot:'#57B867' },
    'Not Connected':{c:'rgba(2,11,23,0.45)', b:'#F5F6FA', br:'#E0E0E0', dot:'#BBB' },
  };
  const m = map[status] || map['Pending'];
  return (
    <span style={{display:'inline-flex', alignItems:'center', gap:6, height:22, padding:'0 8px',
      fontSize:12, borderRadius:4, color:m.c, background:m.b, border:`1px solid ${m.br}`}}>
      <span style={{width:6, height:6, borderRadius:'50%', background:m.dot}}/>{status}
    </span>
  );
}

// Battery indicator
function Battery({ pct }) {
  const color = pct > 60 ? '#3A9148' : pct > 25 ? '#B88A0D' : '#B8342D';
  const bg = pct > 60 ? '#E8F5EB' : pct > 25 ? '#FEFAEC' : '#FDEDED';
  return (
    <div style={{display:'inline-flex', alignItems:'center', gap:6}}>
      <div style={{width:24, height:12, border:`1px solid ${color}`, borderRadius:2, position:'relative', background:bg}}>
        <div style={{position:'absolute', right:-3, top:3, width:2, height:6, background:color, borderRadius:1}}/>
        <div style={{position:'absolute', top:1, left:1, bottom:1, width:`${Math.max(10, pct-10)}%`, background:color, borderRadius:1}}/>
      </div>
      <span style={{fontSize:12, color:TK.FG_BODY, fontVariantNumeric:'tabular-nums'}}>{pct}%</span>
    </div>
  );
}

// Modal
function Modal({ open, onClose, title, width=520, children, footer }) {
  if (!open) return null;
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:1000,
      display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:80, opacity:1}}>
      <div onClick={(e)=>e.stopPropagation()} style={{
        width, maxWidth:'calc(100vw - 48px)', maxHeight:'calc(100vh - 120px)',
        background:TK.BG_CONTAINER, borderRadius:8, boxShadow:'0 6px 16px rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05)',
        display:'flex', flexDirection:'column', opacity:1
      }}>
        <div style={{padding:'20px 24px', borderBottom:`1px solid ${TK.BORDER_SPLIT}`, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <h3 style={{margin:0, fontSize:16, fontWeight:600, color:TK.FG_HEADING}}>{title}</h3>
          <div onClick={onClose} style={{cursor:'pointer', padding:4, color:TK.ICON, display:'flex'}}><Icon.Close s={16}/></div>
        </div>
        <div style={{padding:'24px', flex:1, overflowY:'auto'}}>{children}</div>
        {footer && <div style={{padding:'16px 24px', borderTop:`1px solid ${TK.BORDER_SPLIT}`, display:'flex', gap:8, justifyContent:'flex-end'}}>{footer}</div>}
      </div>
    </div>
  );
}

// Right-side Drawer
function Drawer({ open, onClose, title, subtitle, width=480, children, footer }) {
  if (!open) return null;
  return (
    <div style={{position:'fixed', inset:0, zIndex:1000, display:'flex', justifyContent:'flex-end'}}>
      <div onClick={onClose} style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.35)'}}/>
      <div style={{position:'relative', width, height:'100%', background:TK.BG_CONTAINER, boxShadow:'-8px 0 24px rgba(0,0,0,0.12)',
        display:'flex', flexDirection:'column'}}>
        <div style={{padding:'16px 20px', borderBottom:`1px solid ${TK.BORDER_SPLIT}`,
          display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12}}>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:16, fontWeight:600, color:TK.FG_HEADING}}>{title}</div>
            {subtitle && <div style={{fontSize:13, color:TK.FG_SECONDARY, marginTop:4}}>{subtitle}</div>}
          </div>
          <div onClick={onClose} style={{cursor:'pointer', padding:4, color:TK.ICON, marginTop:-2}}>
            <Icon.Close s={18}/>
          </div>
        </div>
        <div style={{flex:1, overflowY:'auto', padding:'16px 20px'}}>{children}</div>
        {footer && <div style={{padding:'12px 20px', borderTop:`1px solid ${TK.BORDER_SPLIT}`, display:'flex', justifyContent:'flex-end', gap:8}}>{footer}</div>}
      </div>
    </div>
  );
}

function Toast({ toast, onClose }) {
  React.useEffect(() => {
    if (toast) {
      const t = setTimeout(onClose, 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);
  if (!toast) return null;
  const bg = toast.type==='success' ? '#E8F5EB' : toast.type==='error' ? '#FDEDED' : '#EDF4FE';
  const c = toast.type==='success' ? '#3A9148' : toast.type==='error' ? '#B8342D' : '#1557B0';
  return (
    <div style={{position:'fixed', top:80, left:'50%', transform:'translateX(-50%)', zIndex:2000,
      background:bg, border:`1px solid ${c}33`, color:c, padding:'10px 16px', borderRadius:6,
      display:'flex', alignItems:'center', gap:8, fontSize:14, boxShadow:TK.MD_SHADOW,
      opacity:1
    }}>
      <Icon.CheckCircle s={16}/>{toast.message}
    </div>
  );
}

// Breadcrumb
function Breadcrumb({ items, onClick }) {
  return (
    <div style={{display:'flex', alignItems:'center', gap:6, fontSize:14, color:TK.FG_SECONDARY, marginBottom:8}}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{color:TK.FG_DESCRIPTION}}>/</span>}
          <span onClick={()=>it.onClick && it.onClick()} style={{
            color: i === items.length-1 ? TK.FG_HEADING : TK.LINK,
            cursor: it.onClick ? 'pointer' : 'default', fontWeight: i===items.length-1?500:400,
          }}>{it.label}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

// Page title with actions
function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16, gap:24}}>
      <div>
        <h2 style={{margin:0, fontSize:24, lineHeight:'32px', fontWeight:600, color:TK.FG_HEADING}}>{title}</h2>
        {subtitle && <p style={{margin:'4px 0 0', fontSize:14, color:TK.FG_SECONDARY}}>{subtitle}</p>}
      </div>
      {actions && <div style={{display:'flex', gap:8, flexShrink:0}}>{actions}</div>}
    </div>
  );
}

function Card({ title, extra, children, style, padding=16, noShadow }) {
  return (
    <div style={{
      background:TK.BG_CONTAINER, border:`1px solid ${TK.BORDER_SPLIT}`, borderRadius:6,
      boxShadow: noShadow ? 'none' : TK.CARD_SHADOW, ...style
    }}>
      {title && (
        <div style={{minHeight:44, padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'space-between',
          borderBottom: children ? `1px solid ${TK.BORDER_SPLIT}` : 'none'}}>
          <div style={{fontSize:14, fontWeight:500, color:TK.FG_HEADING}}>{title}</div>
          {extra}
        </div>
      )}
      {children && <div style={{padding}}>{children}</div>}
    </div>
  );
}

function Checkbox({ checked, indeterminate, onChange, disabled, label, style }) {
  return (
    <label style={{display:'inline-flex', alignItems:'center', gap:8, cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.5:1, ...style}}>
      <span style={{
        width:16, height:16, border:`1px solid ${checked||indeterminate ? TK.PRIMARY : TK.BORDER}`,
        background: checked||indeterminate ? TK.PRIMARY : TK.BG_CONTAINER, borderRadius:3,
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .15s'
      }}>
        {checked && <svg width="10" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        {!checked && indeterminate && <span style={{width:8, height:2, background:TK.BG_CONTAINER}}/>}
      </span>
      <input type="checkbox" checked={!!checked} onChange={e=>onChange&&onChange(e.target.checked)} disabled={disabled}
        style={{position:'absolute', opacity:0, pointerEvents:'none', width:0, height:0}}/>
      {label && <span style={{fontSize:14, color:TK.FG_BODY}}>{label}</span>}
    </label>
  );
}

// Schlage logo mark
function SchlageMark({ size=40 }) {
  return (
    <div style={{width:size, height:size, borderRadius:8, background:'#C8102E', display:'flex',
      alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700,
      fontSize: size*0.3, letterSpacing:'-0.02em', flexShrink:0,
      boxShadow:'inset 0 -1px 0 rgba(0,0,0,0.15)'}}>
      <span style={{fontFamily:'Georgia, serif', fontStyle:'italic'}}>S</span>
    </div>
  );
}

function AllegionMark({ size=24 }) {
  return (
    <div style={{width:size, height:size, borderRadius:'50%', background:'#003865', display:'flex',
      alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:600, fontSize: size*0.42, flexShrink:0}}>A</div>
  );
}

window.UI = { Btn, Input, StatusPill, Battery, Modal, Drawer, Toast, Breadcrumb, PageHeader, Card, Checkbox, SchlageMark, AllegionMark };
