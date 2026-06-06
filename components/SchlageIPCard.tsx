"use client";

export default function SchlageIPCard() {
  const locks = [
    { name: "NDEB-6700 Main Lobby",   serial: "SCH-NDEB-1042-887", gateway: "Floor 3 Gateway", battery: 87, status: "Online"   },
    { name: "NDEB-6700 Exec Suite",   serial: "SCH-NDEB-1042-891", gateway: "Floor 3 Gateway", battery: 72, status: "Online"   },
    { name: "LEB-4500 Storage Room",  serial: "SCH-LEB-0872-412",  gateway: "Floor 12 Gateway",battery: 94, status: "Online"   },
    { name: "NDEB-6700 Server Room",  serial: "SCH-NDEB-1042-903", gateway: "— Orphaned",       battery: 68, status: "Orphaned" },
    { name: "LEB-4500 Conference B",  serial: "SCH-LEB-0872-419",  gateway: "— Orphaned",       battery: 43, status: "Orphaned" },
  ];

  const batteryColor = (pct: number) =>
    pct > 60 ? "#3A9148" : pct > 25 ? "#B88A0D" : "#B8342D";

  const statusColor = (s: string) =>
    s === "Online" ? { c: "#3A9148", b: "#E8F5EB" } : { c: "#B88A0D", b: "#FEFAEC" };

  return (
    <div className="schlage-card-root">
      {/* ── Sidebar ───────────────────────────── */}
      <div className="sch-sidebar">
        <div className="sch-loc">NYC HQ ▾</div>
        {["Dashboard","Users","Alarms","Hardware","Integrations","Settings"].map((item) => (
          <div key={item} className={`sch-nav-item${item === "Integrations" ? " sch-nav-active" : ""}`}>
            {item}
          </div>
        ))}
      </div>

      {/* ── Main ──────────────────────────────── */}
      <div className="sch-main">
        {/* Header */}
        <div className="sch-header">
          <div>
            <div className="sch-breadcrumb">Integrations / Schlage</div>
            <div className="sch-page-title">Schlage IP Integration</div>
          </div>
          <div className="sch-header-actions">
            <button className="sch-btn-outline">Sync</button>
            <button className="sch-btn-primary">+ Add Location</button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="sch-stats">
          {[
            { label: "Locations", val: "2", color: "#2271EA" },
            { label: "Gateways",  val: "2", color: "#4E9E8E" },
            { label: "Linked",    val: "3", color: "#3A9148" },
            { label: "Orphaned",  val: "3", color: "#B88A0D" },
          ].map((s) => (
            <div key={s.label} className="sch-stat-card">
              <div className="sch-stat-label" style={{ color: s.color }}>{s.label}</div>
              <div className="sch-stat-val">{s.val}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="sch-table-wrap">
          <div className="sch-table-header">
            <span>Lock Name</span>
            <span>Gateway</span>
            <span>Battery</span>
            <span>Status</span>
          </div>
          {locks.map((lk, i) => {
            const sc = statusColor(lk.status);
            const bc = batteryColor(lk.battery);
            const isOrphan = lk.status === "Orphaned";
            return (
              <div
                key={i}
                className="sch-table-row"
                style={{ background: isOrphan ? "#FFFBF0" : "transparent" }}
              >
                <span className="sch-lock-name" style={{ color: isOrphan ? "#B88A0D" : "#181617" }}>
                  {lk.name}
                </span>
                <span className="sch-gateway" style={{ color: isOrphan ? "#B88A0D" : "#6b7280", fontStyle: isOrphan ? "italic" : "normal" }}>
                  {lk.gateway}
                </span>
                <span className="sch-battery" style={{ color: bc }}>
                  <span className="sch-bat-bar">
                    <span className="sch-bat-fill" style={{ width: `${lk.battery}%`, background: bc }} />
                  </span>
                  {lk.battery}%
                </span>
                <span className="sch-pill" style={{ color: sc.c, background: sc.b }}>
                  <span className="sch-dot" style={{ background: sc.c }} />{lk.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .schlage-card-root {
          position: absolute;
          inset: 0;
          display: flex;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 9px;
          overflow: hidden;
          background: #F5F6FA;
        }

        /* Sidebar */
        .sch-sidebar {
          width: 100px;
          flex-shrink: 0;
          background: #F5F6FA;
          border-right: 1px solid #E8E8E8;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .sch-loc {
          padding: 10px 12px;
          font-size: 9px;
          font-weight: 600;
          color: #181617;
          border-bottom: 1px solid #EFEFEF;
        }
        .sch-nav-item {
          padding: 7px 12px;
          font-size: 8.5px;
          color: #6b7280;
          cursor: default;
        }
        .sch-nav-active {
          background: rgba(34,113,234,0.08);
          color: #2271EA;
          font-weight: 500;
          border-left: 2px solid #2271EA;
        }

        /* Main */
        .sch-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: #F5F6FA;
          overflow: hidden;
        }

        /* Header */
        .sch-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 10px 12px 8px;
          background: #fff;
          border-bottom: 1px solid #EFEFEF;
        }
        .sch-breadcrumb {
          font-size: 7.5px;
          color: #9ca3af;
          margin-bottom: 2px;
        }
        .sch-page-title {
          font-size: 11px;
          font-weight: 600;
          color: #181617;
        }
        .sch-header-actions {
          display: flex;
          gap: 5px;
          align-items: center;
        }
        .sch-btn-outline {
          padding: 3px 7px;
          font-size: 7.5px;
          border: 1px solid #E0E0E0;
          border-radius: 4px;
          background: #fff;
          color: #4a4a5a;
          cursor: default;
          font-family: inherit;
        }
        .sch-btn-primary {
          padding: 3px 7px;
          font-size: 7.5px;
          border: none;
          border-radius: 4px;
          background: #2271EA;
          color: #fff;
          cursor: default;
          font-family: inherit;
        }

        /* Stats */
        .sch-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          padding: 8px 12px;
        }
        .sch-stat-card {
          background: #fff;
          border: 1px solid #EFEFEF;
          border-radius: 5px;
          padding: 6px 8px;
        }
        .sch-stat-label {
          font-size: 7.5px;
          margin-bottom: 2px;
        }
        .sch-stat-val {
          font-size: 14px;
          font-weight: 600;
          color: #181617;
          line-height: 1;
        }

        /* Table */
        .sch-table-wrap {
          flex: 1;
          background: #fff;
          border: 1px solid #EFEFEF;
          border-radius: 5px;
          margin: 0 12px 8px;
          overflow: hidden;
        }
        .sch-table-header {
          display: grid;
          grid-template-columns: 2fr 1.5fr 0.8fr 0.7fr;
          gap: 4px;
          padding: 5px 8px;
          background: #F5F6FA;
          border-bottom: 1px solid #EFEFEF;
          font-size: 7.5px;
          color: #9ca3af;
        }
        .sch-table-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 0.8fr 0.7fr;
          gap: 4px;
          padding: 5px 8px;
          border-top: 1px solid #F5F5F5;
          align-items: center;
          transition: background 0.15s;
        }
        .sch-lock-name {
          font-size: 8px;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sch-gateway {
          font-size: 7.5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sch-battery {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 7.5px;
        }
        .sch-bat-bar {
          display: inline-block;
          width: 16px;
          height: 7px;
          border: 1px solid currentColor;
          border-radius: 1.5px;
          overflow: hidden;
          position: relative;
        }
        .sch-bat-fill {
          position: absolute;
          top: 1px;
          left: 1px;
          bottom: 1px;
          border-radius: 1px;
          transition: width 0.3s;
        }
        .sch-pill {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 2px 5px;
          border-radius: 3px;
          font-size: 7px;
          font-weight: 500;
          white-space: nowrap;
        }
        .sch-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
