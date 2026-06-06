// Global state store for the Schlage IP integration prototype
// Uses React hooks + a simple pub/sub so all screens stay in sync.

const INITIAL_STATE = {
  step: 1, // 1..9
  // Connection
  engageConnected: false,
  engageEmail: '',
  showAuthFailure: false,
  // Locations
  enabledLocations: [], // location ids
  selectedLocation: null, // currently viewing
  selectedGateway: null,  // currently viewing gateway (step 7)
  // Gateways: { id, name, desc, mac, applications:[], locationId }
  gateways: [],
  // Locks: { id, name, serial, gateway (id or null for orphan), firmware, model, battery, status, locationId }
  locks: [],
  // Doors: { id, name, desc, lockId, locationId }
  doors: [],
  // UI flow
  modal: null, // 'auth' | 'locations' | 'addGateway' | 'scanLocks' | 'linkOrphan' | 'createDoor' | 'attachLock' | 'success'
  modalData: {},
  toast: null,
  // Card variation
  cardVariant: 'A', // 'A' compact, 'B' detailed, 'C' split
  // Pretend loading
  loading: null,
};

// Seed "already connected" demo data for testing flows
const SEED_CONNECTED = {
  engageConnected: true,
  engageEmail: 'facilities@acme-realty.com',
  enabledLocations: ['nyc-hq', 'sf-office'],
  gateways: [
    { id: 'gw-1', name: 'NYC HQ — Floor 3 Gateway', desc: 'Northeast wing, server closet 3C', mac: '00:1A:2B:3C:4D:5E', serial: 'AC-ENG-2310-04521', applications: ['schlage-engage'], locationId: 'nyc-hq' },
    { id: 'gw-2', name: 'NYC HQ — Floor 12 Gateway', desc: '', mac: '00:1A:2B:3C:4D:7F', serial: 'AC-ENG-2310-08812', applications: ['schlage-engage'], locationId: 'nyc-hq' },
  ],
  locks: [
    { id:'lk-1', name:'NDEB-6700 Main Lobby', serial:'SCH-NDEB-1042-887', gateway:'gw-1', firmware:'3.4.12', model:'NDEB', battery:87, status:'Online', locationId:'nyc-hq' },
    { id:'lk-2', name:'NDEB-6700 Exec Suite', serial:'SCH-NDEB-1042-891', gateway:'gw-1', firmware:'3.4.12', model:'NDEB', battery:72, status:'Online', locationId:'nyc-hq' },
    { id:'lk-3', name:'LEB-4500 Storage Room', serial:'SCH-LEB-0872-412', gateway:'gw-2', firmware:'3.3.08', model:'LEB', battery:94, status:'Online', locationId:'nyc-hq' },
    { id:'lk-4', name:'NDEB-6700 Server Room', serial:'SCH-NDEB-1042-903', gateway:null, firmware:'3.4.12', model:'NDEB', battery:68, status:'Orphaned', locationId:'nyc-hq' },
    { id:'lk-5', name:'LEB-4500 Conference B', serial:'SCH-LEB-0872-419', gateway:null, firmware:'3.3.08', model:'LEB', battery:43, status:'Orphaned', locationId:'nyc-hq' },
    { id:'lk-6', name:'NDEB-6700 Breakroom', serial:'SCH-NDEB-1042-918', gateway:null, firmware:'3.4.12', model:'NDEB', battery:23, status:'Orphaned', locationId:'nyc-hq' },
  ],
  doors: [],
};

const LOCATIONS = [
  { id:'nyc-hq', name:'NYC Headquarters', address:'245 Park Ave, New York, NY', doors: 42, readers: 38, engageSite:'NYC HQ - 245 Park', engageSiteId:'eng-site-NYC042', engageOrg:'Acme Realty Group' },
  { id:'sf-office', name:'San Francisco Office', address:'101 Mission St, San Francisco, CA', doors: 18, readers: 22, engageSite:'SF Mission Tower', engageSiteId:'eng-site-SFO118', engageOrg:'Acme Realty Group' },
  { id:'london', name:'London Office', address:'10 Bishops Square, London E1', doors: 24, readers: 26, engageSite:'London Bishops Sq', engageSiteId:'eng-site-LON024', engageOrg:'Acme Realty Group' },
  { id:'austin', name:'Austin Campus', address:'300 W 6th St, Austin, TX', doors: 31, readers: 34, engageSite:'Austin Campus West', engageSiteId:'eng-site-ATX031', engageOrg:'Acme Realty Group' },
  { id:'chicago', name:'Chicago Hub', address:'233 S Wacker Dr, Chicago, IL', doors: 12, readers: 14, engageSite:'Chicago Wacker Hub', engageSiteId:'eng-site-CHI012', engageOrg:'Acme Realty Group' },
  { id:'dublin', name:'Dublin Satellite', address:'Grand Canal Sq, Dublin 2', doors: 9, readers: 10, engageSite:'Dublin Grand Canal', engageSiteId:'eng-site-DUB009', engageOrg:'Acme Realty Group' },
];

const ALL_APPLICATIONS = [
  { id:'bosch', label:'Bosch Intrusion', desc:'B/G Series panels' },
  { id:'kone', label:'Kone Elevator', desc:'Destination & conventional' },
  { id:'schindler', label:'Schindler Elevator', desc:'PORT technology' },
  { id:'sds', label:'SDS Sensor', desc:'Environmental telemetry' },
  { id:'tanlock', label:'Tanlock', desc:'Cabinet / rack access' },
  { id:'schlage-engage', label:'Schlage Engage Gateway', desc:'Direct IP wireless locks (NDEB, LEB)', isExclusive: true, isNew: true },
];

window.__SCHLAGE_CONSTS = { INITIAL_STATE, SEED_CONNECTED, LOCATIONS, ALL_APPLICATIONS };
