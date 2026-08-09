// Fictional content for the immersive showcase — designer "Mira Solène".
// All projects, clients, metrics, and copy are invented for demo purposes.

export type Project = {
  idx: string;
  name: string;
  tag: string;
  year: string;
  role: string;
  discipline: string;
  // Two hues drive the procedural canvas artwork for each card.
  hueA: string;
  hueB: string;
};

export const PROJECTS: Project[] = [
  {
    idx: "01",
    name: "Halcyon OS",
    tag: "A spatial operating system for focus",
    year: "2025",
    role: "Lead Product Designer",
    discipline: "Systems · Motion",
    hueA: "#c6f24e",
    hueB: "#1e6b3a",
  },
  {
    idx: "02",
    name: "Loomi Finance",
    tag: "Banking that disappears into your day",
    year: "2024",
    role: "Design Lead",
    discipline: "Fintech · UX",
    hueA: "#6b5bff",
    hueB: "#2a1a6b",
  },
  {
    idx: "03",
    name: "Verdant",
    tag: "Carbon intelligence for supply chains",
    year: "2024",
    role: "Principal Designer",
    discipline: "Data Viz · Brand",
    hueA: "#4ee0c6",
    hueB: "#0d5a4e",
  },
  {
    idx: "04",
    name: "Atlas Field",
    tag: "Mission control for autonomous fleets",
    year: "2023",
    role: "Product Designer",
    discipline: "Realtime · 3D",
    hueA: "#ff7a4d",
    hueB: "#6b2a14",
  },
  {
    idx: "05",
    name: "Cadence",
    tag: "A rhythm engine for creative teams",
    year: "2023",
    role: "Design Lead",
    discipline: "Collaboration · Motion",
    hueA: "#f24e9e",
    hueB: "#6b1a44",
  },
];

export const CAPABILITIES = [
  { num: "01", title: "Product Strategy", desc: "Framing the problem before the pixels." },
  { num: "02", title: "Interaction & Motion", desc: "Choreographing how interfaces feel alive." },
  { num: "03", title: "Design Systems", desc: "Scalable foundations, tokens to components." },
  { num: "04", title: "Prototyping in Code", desc: "Prototypes that behave like the real thing." },
  { num: "05", title: "Creative Direction", desc: "Setting the visual & emotional north star." },
];

export const MARQUEE = [
  "Product Design",
  "Motion",
  "Design Systems",
  "Prototyping",
  "3D & WebGL",
  "Creative Direction",
  "Brand",
];

export const STATS = [
  { num: 11, suffix: "+", label: "Years designing" },
  { num: 40, suffix: "+", label: "Products shipped" },
  { num: 7, suffix: "", label: "Awards & honors" },
];
