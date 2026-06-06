const { useState: useSt } = React;
const TK = new Proxy({}, { get: (_, k) => window.GeneaTokens[k] });

const NAV = [
{ type: 'item', key: 'dashboard', icon: 'Dashboard', label: 'Dashboard' },
{ type: 'item', key: 'users', icon: 'Users', label: 'Users Management', expandable: true, children: [
  { key: 'users/all', label: 'All Users' },
  { key: 'users/roles', label: 'Roles & Permissions' }]
},
{ type: 'item', key: 'alarms', icon: 'Alarm', label: 'Alarms Management', expandable: true, children: [
  { key: 'alarms/active', label: 'All Alarms' },
  { key: 'alarms/history', label: 'Alarm History' },
  { key: 'alarms/settings', label: 'Alarm Settings' }]
},
{ type: 'item', key: 'inspections', icon: 'Shield', label: 'Physical Inspections' },
{ type: 'divider' },
{ type: 'item', key: 'keys', icon: 'Key', label: 'Keys' },
{ type: 'divider' },
{ type: 'item', key: 'control', icon: 'Control', label: 'Control Center' },
{ type: 'item', key: 'access', icon: 'Lock', label: 'Access Control' },
{ type: 'divider' },
{ type: 'item', key: 'emergency', icon: 'Emerg', label: 'Emergency Plans' },
{ type: 'item', key: 'floor', icon: 'Compass', label: 'Floor Plans' },
{ type: 'item', key: 'hardware', icon: 'Hardware', label: 'Hardware' },
{ type: 'divider' },
{ type: 'item', key: 'automations', icon: 'Swap', label: 'Automations' },
{ type: 'item', key: 'reports', icon: 'Chart', label: 'Reports' },
{ type: 'divider' },
{ type: 'item', key: 'badges', icon: 'Badge', label: 'Badges' },
{ type: 'item', key: 'email', icon: 'Mail', label: 'Email Templates' },
{ type: 'divider' },
{ type: 'item', key: 'api', icon: 'Api', label: 'API Key' },
{ type: 'item', key: 'integrations', icon: 'Bolt', label: 'Integrations' },
{ type: 'divider' },
{ type: 'item', key: 'settings', icon: 'Settings', label: 'Settings' },
{ type: 'item', key: 'subscription', icon: 'Card', label: 'Subscription' },
{ type: 'divider' },
{ type: 'item', key: 'updates', icon: 'Bell', label: 'Product Updates', external: true }];


function Sidebar({ collapsed, selected, onSelect, onToggle }) {
  const [location, setLocation] = useSt('NYC Headquarters');
  const [locOpen, setLocOpen] = useSt(false);
  const [expanded, setExpanded] = useSt(new Set(['alarms']));

  const W = collapsed ? 80 : 296;

  const toggleGroup = (k) => {
    const n = new Set(expanded);
    n.has(k) ? n.delete(k) : n.add(k);
    setExpanded(n);
  };

  const Item = ({ it }) => {
    const IconEl = Icon[it.icon];
    const isSelected = selected === it.key || selected.startsWith(it.key + '/');
    const isOpen = expanded.has(it.key);
    return (
      <>
        <div onClick={() => it.expandable ? toggleGroup(it.key) : onSelect(it.key)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '0 28px' : '0 24px',
          height: 40, cursor: 'pointer',
          background: isSelected && !it.expandable ? TK.CONTROL_ACTIVE : 'transparent',
          color: isSelected && !it.expandable ? TK.PRIMARY_TEXT : TK.FG_HEADING,
          fontSize: 14, fontWeight: isSelected && !it.expandable ? 500 : 400 }}>
          <IconEl s={16} extra={{ color: isSelected && !it.expandable ? TK.PRIMARY_TEXT : TK.ICON }} />
          {!collapsed && <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>{it.label}</span>}
          {!collapsed && it.expandable && <Icon.Down s={12} extra={{ color: TK.ICON, transform: isOpen ? 'rotate(180deg)' : '', transition: 'transform .2s' }} />}
          {!collapsed && it.external && <Icon.Ext s={12} extra={{ color: TK.FG_SECONDARY }} />}
        </div>
        {!collapsed && it.expandable && isOpen && it.children.map((ch) =>
        <div key={ch.key} onClick={() => onSelect(ch.key)}
        style={{ padding: '0 24px 0 50px', height: 40, display: 'flex', alignItems: 'center',
          cursor: 'pointer', fontSize: 14,
          background: selected === ch.key ? TK.CONTROL_ACTIVE : 'transparent',
          color: selected === ch.key ? TK.PRIMARY_TEXT : TK.FG_BODY,
          fontWeight: selected === ch.key ? 500 : 400 }}>{ch.label}</div>
        )}
      </>);

  };

  return (
    <aside style={{ width: W, background: TK.BG_LAYOUT, borderRight: `1px solid ${TK.BORDER_SPLIT}`,
      display: 'flex', flexDirection: 'column', transition: 'width .2s', flexShrink: 0, position: 'relative' }}>
      {/* Header row: location */}
      <div style={{ height: 64, padding: `0 ${collapsed ? 28 : 24}px`, display: 'flex', alignItems: 'center',
        borderBottom: `1px solid ${TK.BORDER_SPLIT}`, justifyContent: collapsed ? 'center' : 'flex-start', position: 'relative' }}>
        {!collapsed ?
        <div onClick={() => setLocOpen(!locOpen)} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <span style={{ fontSize: 16, color: TK.FG_HEADING }}>{location}</span>
            <Icon.Down s={10} extra={{ color: TK.FG_SECONDARY }} />
          </div> :

        <div style={{ width: 32, height: 32, borderRadius: '50%', background: TK.PRIMARY_BG, border: `1px solid #BED6F8`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: TK.PRIMARY_TEXT }}>NH</div>
        }
        {locOpen && !collapsed &&
        <div style={{ position: 'absolute', top: 58, left: 12, background:TK.BG_CONTAINER, border: `1px solid ${TK.BORDER_SPLIT}`, borderRadius: 6, boxShadow: TK.MD_SHADOW, padding: 4, zIndex: 20, minWidth: 200 }}>
            {['Global Overview', 'NYC Headquarters', 'SF Office', 'London Office'].map((n) =>
          <div key={n} onClick={() => {setLocation(n);setLocOpen(false);}} style={{ padding: '8px 12px', fontSize: 14, cursor: 'pointer', borderRadius: 4, background: n === location ? TK.CONTROL_ACTIVE : 'transparent' }}>{n}</div>
          )}
          </div>
        }
      </div>
      {/* Scrollable nav */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 8 }}>
        {NAV.map((it, i) => it.type === 'divider' ?
        <div key={i} style={{ height: 1, background: TK.BORDER_SPLIT, margin: '8px 16px' }} /> :
        <Item key={it.key} it={it} />
        )}
      </div>
      {/* Footer: Genea AI */}
      <div style={{ borderTop: `1px solid ${TK.BORDER_SPLIT}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '0 28px' : '0 24px', height: 48, cursor: 'pointer', fontSize: 14, color: TK.FG_HEADING }}>
          <Icon.Star s={16} extra={{ color: TK.ICON }} />
          {!collapsed && <><span style={{ flex: 1 }}>Genea AI</span><Icon.Star s={12} extra={{ color: TK.FG_SECONDARY }} /></>}
        </div>
      </div>

      {/* Collapse toggle */}
      <div onClick={onToggle} style={{
        position: 'absolute', right: -12, top: 32, width: 24, height: 24, borderRadius: '50%', background:TK.BG_CONTAINER,
        border: `1px solid ${TK.BORDER_SPLIT}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', zIndex: 200, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
        {collapsed ? <Icon.Right s={11} extra={{ color: TK.FG_SECONDARY }} /> : <Icon.Left s={11} extra={{ color: TK.FG_SECONDARY }} />}
      </div>
    </aside>);

}

function Header({ user, onLogout, theme, onThemeChange }) {
  const [menuOpen, setMenuOpen] = useSt(false);
  const [themeOpen, setThemeOpen] = useSt(false);
  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const themes = [
    { k:'light', label:'Light' },
    { k:'dark', label:'Dark' },
    { k:'system', label:'Match Browser' },
  ];
  return (
    <header style={{ height: 64, padding: '0 24px', background: TK.BG_LAYOUT, borderBottom: `1px solid ${TK.BORDER_SPLIT}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 360, height: 32, border: `1px solid ${TK.BORDER}`, borderRadius: 6, padding: '0 11px', background: TK.BG_CONTAINER }}>
        <Icon.Search s={14} extra={{ color: TK.FG_SECONDARY }} />
        <input placeholder="Search by user name, email, card number etc..." style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, fontFamily: TK.FONT, color: TK.FG_HEADING, background: 'transparent' }} />
      </div>
      <div style={{ position: 'relative' }}>
        <div onClick={() => { setMenuOpen(!menuOpen); setThemeOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, lineHeight: '16px', color: TK.FG_HEADING }}>{user.name}</div>
            <div style={{ fontSize: 12, lineHeight: '16px', color: TK.FG_SECONDARY }}>{user.role}</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E0EDFD', border: `1px solid ${TK.PRIMARY_BG}`, color: TK.PRIMARY_TEXT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, fontSize: 12 }}>{initials}</div>
        </div>
        {menuOpen &&
        <div style={{ position: 'absolute', top: 46, right: 0, background: TK.BG_CONTAINER, border: `1px solid ${TK.BORDER_SPLIT}`, borderRadius: 6, boxShadow: TK.MD_SHADOW, padding: 4, minWidth: 200, zIndex: 20 }}>
            <div style={{ padding: '8px 12px', fontSize: 14, cursor: 'pointer', borderRadius: 4, color:TK.FG_HEADING }}
              onMouseEnter={e=>e.currentTarget.style.background=TK.CONTROL_ACTIVE}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>My Profile</div>
            <div style={{ position:'relative' }}
              onMouseEnter={()=>setThemeOpen(true)}
              onMouseLeave={()=>setThemeOpen(false)}>
              <div onClick={()=>setThemeOpen(o=>!o)} style={{ padding: '8px 12px', fontSize: 14, cursor: 'pointer', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems:'center', color:TK.FG_HEADING,
                background: themeOpen ? TK.CONTROL_ACTIVE : 'transparent' }}>
                Theme<Icon.Right s={12} extra={{color:TK.FG_SECONDARY}}/>
              </div>
              {themeOpen && (
                <div style={{ position:'absolute', top:0, right:'calc(100% + 6px)', background:TK.BG_CONTAINER, border:`1px solid ${TK.BORDER_SPLIT}`, borderRadius:6, boxShadow:TK.MD_SHADOW, padding:4, minWidth:180, zIndex:25 }}>
                  {themes.map(t=>(
                    <div key={t.k} onClick={()=>{ onThemeChange(t.k); setThemeOpen(false); setMenuOpen(false); }} style={{
                      padding:'8px 12px', fontSize:14, cursor:'pointer', borderRadius:4,
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      background: theme===t.k ? TK.CONTROL_ACTIVE : 'transparent',
                      color: theme===t.k ? TK.PRIMARY_TEXT : TK.FG_HEADING,
                      fontWeight: theme===t.k ? 500 : 400,
                    }}
                      onMouseEnter={e=>{ if(theme!==t.k) e.currentTarget.style.background=TK.BG_LAYOUT; }}
                      onMouseLeave={e=>{ if(theme!==t.k) e.currentTarget.style.background='transparent'; }}>
                      {t.label}
                      {theme===t.k && <Icon.Check s={14} extra={{color:TK.PRIMARY}}/>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ height: 1, background: TK.BORDER_SPLIT, margin: '4px 0' }} />
            <div onClick={onLogout} style={{ padding: '8px 12px', fontSize: 14, cursor: 'pointer', borderRadius: 4, color: TK.ERROR }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(212,76,70,0.06)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>Sign Out</div>
          </div>
        }
      </div>
    </header>);

}

window.Sidebar = Sidebar;
window.Header = Header;