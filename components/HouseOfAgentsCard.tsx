"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BRAND = "#E8432E";
const NAMES = ["Abhishek Jaiswal", "Anjana Haladker", "Priya Sharma", "Rohan Mehta", "Siddharth Rao"];
const STATS = [
  { v: "847+", l: "AI Calls" },
  { v: "312",  l: "Leads Qualified" },
  { v: "89",   l: "Meetings Booked" },
];

export default function HouseOfAgentsCard() {
  const [nameIdx, setNameIdx] = useState(0);
  const [tick,    setTick]    = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setNameIdx(i => (i + 1) % NAMES.length);
        setVisible(true);
      }, 260);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ background: "#0d0d12", fontFamily: "system-ui,sans-serif" }}
    >
      {/* Subtle star field */}
      {[...Array(18)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 2 : 1,
            height: i % 3 === 0 ? 2 : 1,
            background: "rgba(255,255,255,0.18)",
            top: `${(i * 17 + 5) % 92}%`,
            left: `${(i * 23 + 11) % 96}%`,
            opacity: tick % 4 === i % 4 ? 0.5 : 0.18,
            transition: "opacity 0.8s ease",
          }}
        />
      ))}

      {/* Glow behind logo */}
      <div style={{
        position: "absolute", top: "22%", left: "50%", transform: "translateX(-50%)",
        width: 80, height: 80, borderRadius: "50%",
        background: `radial-gradient(circle, ${BRAND}28 0%, transparent 70%)`,
        filter: "blur(16px)",
      }} />

      {/* Logo + brand */}
      <div style={{ position: "absolute", top: 16, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <motion.span
          style={{ fontSize: 14, color: BRAND, fontWeight: 700, lineHeight: 1 }}
          animate={{ rotate: [0, 15, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          ✳
        </motion.span>
        <span style={{ fontSize: 10, fontWeight: 600, color: "white", letterSpacing: "0.06em" }}>House of Agents</span>
      </div>

      {/* AI calling card */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "78%",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: "14px 16px",
      }}>
        {/* Arya label */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            background: `linear-gradient(135deg, ${BRAND}, #ff6b4a)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 8, fontWeight: 700, color: "white",
          }}>A</div>
          <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.04em" }}>ARYA · AI SALES AGENT</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{
                width: 6, height: 6, borderRadius: "50%", background: "#3ad759",
                opacity: tick % 2 === 0 ? 1 : 0.3,
                transition: "opacity 0.5s",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 8, color: "#3ad759", fontWeight: 500 }}>LIVE</span>
          </div>
        </div>

        {/* Calling line */}
        <div style={{ marginBottom: 8 }}>
          <p style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Now calling
          </p>
          <p style={{
            fontSize: 11, fontWeight: 600, color: "white",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-4px)",
            transition: "opacity 0.22s ease, transform 0.28s ease",
          }}>
            {NAMES[nameIdx]}
          </p>
        </div>

        {/* Waveform */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, height: 18 }}>
          {[...Array(14)].map((_, i) => {
            const h = tick % 3 === i % 3 ? 14 : tick % 2 === i % 2 ? 8 : 5;
            return (
              <div
                key={i}
                style={{
                  width: 2.5, borderRadius: 2,
                  height: h,
                  background: i < 9 ? BRAND : "rgba(255,255,255,0.15)",
                  transition: "height 0.25s ease",
                }}
              />
            );
          })}
          <span style={{ marginLeft: 6, fontSize: 8, color: "rgba(255,255,255,0.3)" }}>0:47</span>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        display: "flex", borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(0,0,0,0.3)",
      }}>
        {STATS.map((s, i) => (
          <div
            key={s.l}
            style={{
              flex: 1, padding: "8px 0", textAlign: "center",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <p style={{ fontSize: 10, fontWeight: 700, color: BRAND, marginBottom: 1 }}>{s.v}</p>
            <p style={{ fontSize: 7, color: "rgba(255,255,255,0.28)", letterSpacing: "0.04em" }}>{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
