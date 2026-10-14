"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CMDS, CTRLS, LABELS, NODES, SHOWN, VIEWBOX, type Cmd } from "./footerWordmarkData";

/* Overlay sizes are glyph units (1000 upm) against a ~0.16–0.26 render
   scale, so they read ~5x larger here than on screen. Strokes use
   non-scaling-stroke to stay hairlines at any width. */
const ANCHOR = 46;
const HANDLE = 22;
const GRAB   = 130;   // invisible hit area — fingers need more than 7px
const FS     = 86;

const VB = VIEWBOX.split(" ").map(Number);
const INK = "#141414";
const BLUE = "#2F6BFF";

type Offsets = Record<number, { dx: number; dy: number }>;

/** Rebuild the path, applying any live offsets to the points they belong to. */
function buildPath(offsets: Offsets): string {
  if (!Object.keys(offsets).length) {
    return CMDS.map((c) => c.join(" ")).join(" ");
  }
  const moved = CMDS.map((c) => c.slice()) as Cmd[];
  for (const key of Object.keys(offsets)) {
    const n = NODES[Number(key)];
    const { dx, dy } = offsets[Number(key)];
    const cmd = moved[n.c];
    const xi = 1 + n.p * 2;
    (cmd[xi] as number) += dx;
    (cmd[xi + 1] as number) += dy;
  }
  return moved.map((c) => c.join(" ")).join(" ");
}

export default function FooterWordmark() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [offsets, setOffsets] = useState<Offsets>({});
  const [dragging, setDragging] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [calm, setCalm] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setCalm(mq.matches);
    const h = (e: MediaQueryListEvent) => setCalm(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  /* Screen pixels → glyph units, so a drag tracks the cursor exactly
     however wide the footer happens to be. */
  const toUnits = useCallback((px: number, py: number) => {
    const el = svgRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return { x: (px / r.width) * VB[2], y: (py / r.height) * VB[3] };
  }, []);

  /* Track the pointer ourselves rather than trusting movementX/Y, which
     is inconsistent across browsers and zero under pointer capture. */
  const last = useRef<{ x: number; y: number } | null>(null);
  /* The handlers read this, not the state: a fast flick can deliver
     pointermove before React has re-rendered from pointerdown. */
  const dragRef = useRef<number | null>(null);

  const start = useCallback(
    (i: number) => (e: React.PointerEvent) => {
      if (calm) return;
      e.preventDefault();
      /* Capture keeps the drag alive past the node's own hit area, but it
         throws on a pointerId the element never saw — never let that take
         the drag down with it. */
      try {
        (e.target as Element).setPointerCapture?.(e.pointerId);
      } catch {
        /* no capture: the svg-level move handler still tracks the drag */
      }
      last.current = { x: e.clientX, y: e.clientY };
      dragRef.current = i;
      setDragging(i);
    },
    [calm],
  );

  const move = useCallback(
    (e: React.PointerEvent) => {
      const i = dragRef.current;
      if (i === null || !last.current) return;
      const d = toUnits(e.clientX - last.current.x, e.clientY - last.current.y);
      last.current = { x: e.clientX, y: e.clientY };
      setOffsets((prev) => {
        const cur = prev[i] ?? { dx: 0, dy: 0 };
        return { ...prev, [i]: { dx: cur.dx + d.x, dy: cur.dy + d.y } };
      });
    },
    [toUnits],
  );

  /* Let go and the outline settles back — the letterform is borrowed,
     not vandalised. */
  const end = useCallback(() => {
    dragRef.current = null;
    last.current = null;
    setDragging(null);
    setOffsets({});
  }, []);

  const d = useMemo(() => buildPath(offsets), [offsets]);
  const at = (i: number) => {
    const n = NODES[i];
    const o = offsets[i];
    return { x: n.x + (o?.dx ?? 0), y: n.y + (o?.dy ?? 0) };
  };

  const settle = dragging === null
    ? "cx .55s cubic-bezier(.2,0,0,1), cy .55s cubic-bezier(.2,0,0,1), x .55s cubic-bezier(.2,0,0,1), y .55s cubic-bezier(.2,0,0,1), d .55s cubic-bezier(.2,0,0,1)"
    : "none";

  return (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        lineHeight: 0,
        cursor: calm ? "default" : "crosshair",
        touchAction: "none",
      }}
    >
      <svg
        ref={svgRef}
        viewBox={VIEWBOX}
        style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onPointerLeave={end}
      >
        <path d={d} fill={INK} style={{ transition: settle }} />
        <path
          d={d}
          fill="none"
          stroke={BLUE}
          strokeWidth={1.2}
          vectorEffect="non-scaling-stroke"
          opacity={0.85}
          style={{ transition: settle }}
        />

        {/* Bezier handles */}
        {CTRLS.map((h, i) => (
          <g key={`h${i}`}>
            <line
              x1={h.x} y1={h.y} x2={h.x} y2={h.y}
              stroke={BLUE} strokeWidth={1} vectorEffect="non-scaling-stroke" opacity={0.6}
            />
            <circle
              cx={h.x} cy={h.y} r={HANDLE}
              fill="#fff" stroke={BLUE} strokeWidth={1.6} vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}

        {/* Anchors — visible square plus a finger-sized invisible target */}
        {SHOWN.map((i) => {
          const { x, y } = at(i);
          const live = dragging === i;
          const warm = live || hover === i;
          /* The page hides the system cursor, so the node itself has to
             show it is grabbable: it grows and fills on approach. */
          const side = warm ? ANCHOR * 1.5 : ANCHOR;
          return (
            <g key={`n${i}`}>
              <rect
                x={x - side / 2} y={y - side / 2}
                width={side} height={side}
                fill={warm ? BLUE : "#fff"}
                stroke={BLUE} strokeWidth={warm ? 2.4 : 1.6}
                vectorEffect="non-scaling-stroke"
                style={{ transition: settle }}
              />
              {!calm && (
                <circle
                  cx={x} cy={y} r={GRAB / 2}
                  fill="transparent"
                  style={{ cursor: live ? "grabbing" : "grab" }}
                  onPointerDown={start(i)}
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover((h) => (h === i ? null : h))}
                />
              )}
            </g>
          );
        })}

        {/* Coordinate chips — the readout follows the point as it moves */}
        {LABELS.map((l, i) => {
          const ni = NODES.findIndex((n) => n.c === l.c && n.p === l.p);
          const { x, y } = at(ni);
          const txt = `${Math.round(x)}, ${Math.round(-y)}`;
          const w = txt.length * FS * 0.62 + 26;
          const dy = l.up ? -ANCHOR - 10 : ANCHOR + FS + 22;
          return (
            <g
              key={`l${i}`}
              transform={`translate(${x + ANCHOR * 0.8} ${y + dy})`}
              style={{ transition: settle }}
            >
              <rect
                x={0} y={-FS - 12} width={w} height={FS + 16} rx={4}
                fill={l.accent ? "#F2E25C" : "#B5B5B0"} opacity={0.95}
              />
              <text x={13} y={-6} fontFamily="ui-monospace,monospace" fontSize={FS} fill="#24241E">
                {txt}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
