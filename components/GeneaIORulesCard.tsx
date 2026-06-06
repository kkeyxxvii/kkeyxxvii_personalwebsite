"use client";

/**
 * GeneaIORulesCard
 * Animated thumbnail for "Preventing Silent Misconfiguration in Physical Access Control".
 * Implements the Automation Showcase v2 design — macOS browser mockup with the
 * Automations management table: one live row + skeleton shimmer rows.
 *
 * Colors (user-specified):
 *   Primary:    #181617
 *   Background: rgba(24, 22, 23, 0.05)
 */
export default function GeneaIORulesCard() {
  // Skeleton row widths (name %, tag px, exec px, loc %, lu %)
  const skRows = [
    [58, 48, 52, 72, 66],
    [46, 64, 60, 62, 70],
    [64, 72, 66, 68, 60],
    [52, 80, 58, 74, 68],
    [68, 68, 70, 66, 72],
    [50, 74, 64, 60, 64],
    [62, 86, 60, 72, 58],
    [56, 76, 68, 64, 62],
    [48, 62, 56, 70, 66],
  ];

  return (
    <div className="asc-root">

      {/* ── macOS Browser Chrome ─────────────────── */}
      <div className="asc-chrome">
        <div className="asc-lights">
          <span className="asc-light asc-r" />
          <span className="asc-light asc-y" />
          <span className="asc-light asc-g" />
        </div>

        {/* nav arrows */}
        <div className="asc-nav">
          <div className="asc-nav-btn">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </div>
          <div className="asc-nav-btn">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

        <div className="asc-urlbar">
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          app.genea.io / security / <strong>Automations</strong>
        </div>

        <div className="asc-chrome-dots">
          <span /><span /><span />
        </div>
      </div>

      {/* ── App Body ─────────────────────────────── */}
      <div className="asc-body">

        {/* Tabs */}
        <div className="asc-tabs">
          <div className="asc-tab asc-tab-on">Automations</div>
          <div className="asc-tab">Variables</div>
        </div>

        {/* Table card */}
        <div className="asc-card">

          {/* Toolbar */}
          <div className="asc-toolbar">
            <div className="asc-search">
              <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Search by automation name…
            </div>
            <div className="asc-btn asc-btn-ghost">
              <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filters
            </div>
            <div className="asc-spacer" />
            <div className="asc-btn asc-btn-icon" title="Columns">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="10" y1="3" x2="10" y2="21"/>
              </svg>
            </div>
            <div className="asc-btn asc-btn-primary">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add
              <span className="asc-split">
                <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </span>
            </div>
          </div>

          {/* Table header */}
          <div className="asc-thead">
            <div className="asc-th">Automation Name</div>
            <div className="asc-th">Status</div>
            <div className="asc-th">Location</div>
            <div className="asc-th">Last Updated</div>
            <div className="asc-th asc-th-right">Toggle</div>
          </div>

          {/* ── Live row ── */}
          <div className="asc-row asc-row-live">
            <div className="asc-name-cell">
              <span className="asc-name-link">Access Granted with Valid Door Usage</span>
              <span className="asc-tag asc-tag-active">
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/>
                </svg>
                Active
              </span>
            </div>
            <div>
              <span className="asc-exec asc-exec-on">
                <span className="asc-exec-dot" />
                Executing
              </span>
            </div>
            <div className="asc-trunc">NYC Headquarters, USA</div>
            <div className="asc-trunc">Annette B. · May 12, 2025</div>
            <div className="asc-cell-right">
              <div className="asc-toggle asc-toggle-on" />
            </div>
          </div>

          {/* ── Skeleton rows ── */}
          {skRows.map(([name, tag, exec, loc, lu], i) => (
            <div key={i} className="asc-row asc-row-sk">
              <div className="asc-name-cell" style={{ gap: 6 }}>
                <span className="asc-sk" style={{ height: 7, width: `${name}%` }} />
                <span className="asc-sk asc-sk-pill" style={{ height: 13, width: tag, flexShrink: 0 }} />
              </div>
              <div>
                <span className="asc-sk asc-sk-pill" style={{ height: 14, width: exec }} />
              </div>
              <div>
                <span className="asc-sk" style={{ height: 7, width: `${loc}%` }} />
              </div>
              <div>
                <span className="asc-sk" style={{ height: 7, width: `${lu}%` }} />
              </div>
              <div className="asc-cell-right">
                <span className="asc-sk-toggle" />
              </div>
            </div>
          ))}

          {/* ── Footer ── */}
          <div className="asc-footer">
            <span className="asc-footer-info">78 results · page 1 of 8</span>
            <div className="asc-pgr">
              <div className="asc-pg asc-pg-dim">← Previous</div>
              <div className="asc-pg">Next →</div>
            </div>
          </div>

        </div>{/* /card */}
      </div>{/* /body */}

      <style>{`
        /* ═══ Root ═══════════════════════════════════════════ */
        .asc-root {
          position: absolute; inset: 0;
          background: rgba(24, 22, 23, 0.05);
          display: flex; flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', sans-serif;
          overflow: hidden;
          border-radius: inherit;
          -webkit-font-smoothing: antialiased;
        }

        /* ═══ Browser Chrome ══════════════════════════════════ */
        .asc-chrome {
          height: 30px; flex-shrink: 0;
          display: flex; align-items: center; gap: 7px;
          padding: 0 10px;
          background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
          border-bottom: 1px solid rgba(24,22,23,0.08);
        }

        .asc-lights { display: flex; gap: 4px; align-items: center; }
        .asc-light  {
          width: 7px; height: 7px; border-radius: 50%;
          box-shadow: inset 0 0 0 0.5px rgba(0,0,0,0.10);
          flex-shrink: 0;
        }
        .asc-r { background: #ff5f57; }
        .asc-y { background: #febc2e; }
        .asc-g { background: #28c840; }

        .asc-nav { display: flex; gap: 2px; }
        .asc-nav-btn {
          width: 16px; height: 16px; border-radius: 4px;
          display: grid; place-items: center;
          color: rgba(24,22,23,0.3);
        }

        .asc-urlbar {
          flex: 1; height: 16px;
          background: rgba(24,22,23,0.05); border-radius: 5px;
          display: flex; align-items: center; gap: 4px;
          padding: 0 7px;
          font-size: 7px; color: rgba(24,22,23,0.4);
          white-space: nowrap; overflow: hidden;
        }
        .asc-urlbar strong { color: rgba(24,22,23,0.85); font-weight: 500; }
        .asc-urlbar svg   { color: rgba(24,22,23,0.25); flex-shrink: 0; }

        .asc-chrome-dots { display: flex; gap: 3px; }
        .asc-chrome-dots span {
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(24,22,23,0.18);
        }

        /* ═══ App body ════════════════════════════════════════ */
        .asc-body {
          flex: 1; min-height: 0;
          background: rgba(24, 22, 23, 0.05);
          display: flex; flex-direction: column;
          padding: 10px 12px 12px;
        }

        /* ═══ Tabs ════════════════════════════════════════════ */
        .asc-tabs {
          display: flex; gap: 14px;
          border-bottom: 1px solid rgba(24,22,23,0.08);
          padding: 0 2px; margin-bottom: 8px;
        }
        .asc-tab {
          position: relative; padding: 5px 2px 8px;
          font-size: 8px; font-weight: 500;
          color: rgba(24,22,23,0.35);
        }
        .asc-tab-on { color: #181617; }
        .asc-tab-on::after {
          content: '';
          position: absolute; left: 0; right: 0; bottom: -1px;
          height: 1.5px; background: #181617;
          border-radius: 2px 2px 0 0;
        }

        /* ═══ Card ════════════════════════════════════════════ */
        .asc-card {
          background: #ffffff;
          border: 1px solid rgba(24,22,23,0.08);
          border-radius: 6px;
          box-shadow:
            0 1px 2px rgba(24,22,23,0.02),
            0 1px 6px -1px rgba(24,22,23,0.02),
            0 2px 4px rgba(24,22,23,0.031);
          display: flex; flex-direction: column;
          overflow: hidden; flex: 1; min-height: 0;
        }

        /* ═══ Toolbar ═════════════════════════════════════════ */
        .asc-toolbar {
          display: flex; align-items: center; gap: 5px;
          padding: 7px 10px;
          border-bottom: 1px solid rgba(24,22,23,0.07);
          flex-shrink: 0;
        }
        .asc-search {
          display: flex; align-items: center; gap: 4px;
          height: 18px; padding: 0 7px;
          border: 1px solid rgba(24,22,23,0.11); border-radius: 4px;
          background: #fff; font-size: 7px; color: rgba(24,22,23,0.30);
        }
        .asc-search svg { color: rgba(24,22,23,0.25); flex-shrink: 0; }
        .asc-btn {
          height: 18px; padding: 0 7px; border-radius: 4px;
          font-size: 7px; font-weight: 500;
          display: inline-flex; align-items: center; gap: 3px; flex-shrink: 0;
        }
        .asc-btn-ghost {
          border: 1px solid rgba(24,22,23,0.11);
          color: rgba(24,22,23,0.58); background: #fff;
        }
        .asc-btn-ghost svg { color: rgba(24,22,23,0.35); }
        .asc-btn-icon {
          width: 18px; padding: 0; justify-content: center;
          border: 1px solid rgba(24,22,23,0.11);
          color: rgba(24,22,23,0.45); background: #fff;
        }
        .asc-btn-primary {
          background: #181617; border: 1px solid #181617;
          color: rgba(255,255,255,0.92);
          box-shadow: 0 1px 0 rgba(0,0,0,0.04);
          padding-right: 3px;
        }
        .asc-btn-primary svg { color: rgba(255,255,255,0.9); }
        .asc-split {
          width: 14px; height: 14px; border-radius: 3px; margin-left: 2px;
          background: rgba(255,255,255,0.10);
          display: inline-flex; align-items: center; justify-content: center;
        }
        .asc-split svg { color: rgba(255,255,255,0.80); }
        .asc-spacer { flex: 1; }

        /* ═══ Table header ════════════════════════════════════ */
        .asc-thead {
          display: grid;
          grid-template-columns:
            minmax(0,2.2fr)
            minmax(0,1fr)
            minmax(0,1.1fr)
            minmax(0,1.4fr)
            46px;
          padding: 0 10px; height: 24px;
          align-items: center; gap: 6px;
          background: #fafafb;
          border-bottom: 1px solid rgba(24,22,23,0.07);
          flex-shrink: 0;
        }
        .asc-th {
          font-size: 7px; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase;
          color: rgba(24,22,23,0.40);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .asc-th-right { text-align: right; justify-self: end; }

        /* ═══ Rows ════════════════════════════════════════════ */
        .asc-row {
          display: grid;
          grid-template-columns:
            minmax(0,2.2fr)
            minmax(0,1fr)
            minmax(0,1.1fr)
            minmax(0,1.4fr)
            46px;
          align-items: center; padding: 0 10px;
          height: 32px; gap: 6px;
          border-bottom: 1px solid rgba(24,22,23,0.055);
          flex-shrink: 0;
        }
        .asc-row:last-of-type { border-bottom: 0; }

        /* Live row */
        .asc-row-live {
          background: linear-gradient(
            90deg,
            rgba(24,22,23,0.05) 0%,
            rgba(24,22,23,0.02) 65%,
            transparent 100%
          );
          position: relative;
        }
        .asc-row-live::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 2px; background: #181617; border-radius: 0 1px 1px 0;
        }

        /* Skeleton row */
        .asc-row-sk { height: 26px; }

        /* ═══ Name cell ═══════════════════════════════════════ */
        .asc-name-cell {
          display: flex; align-items: center; gap: 5px; min-width: 0;
        }
        .asc-name-link {
          font-size: 7.5px; font-weight: 600; color: #181617;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;
        }
        .asc-tag {
          display: inline-flex; align-items: center; gap: 3px;
          height: 14px; padding: 0 5px; border-radius: 3px;
          border: 1px solid transparent;
          font-size: 6.5px; font-weight: 500; white-space: nowrap; flex-shrink: 0;
        }
        .asc-tag svg { flex-shrink: 0; }
        .asc-tag-active {
          color: #1F8A5B; background: #E8F5EE; border-color: #BFE4CD;
        }

        /* ═══ Execution pill ══════════════════════════════════ */
        .asc-exec {
          display: inline-flex; align-items: center; gap: 4px;
          height: 16px; padding: 0 6px; border-radius: 3px;
          font-size: 7px; font-weight: 500; white-space: nowrap;
          background: rgba(24,22,23,0.06); color: rgba(24,22,23,0.42);
        }
        .asc-exec-on {
          background: rgba(24,22,23,0.09); color: #181617;
        }
        .asc-exec-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: #181617; flex-shrink: 0;
          box-shadow: 0 0 0 2.5px rgba(24,22,23,0.12);
          animation: asc-dot-pulse 1.6s ease-in-out infinite;
        }
        @keyframes asc-dot-pulse {
          0%, 100% { box-shadow: 0 0 0 2.5px rgba(24,22,23,0.12); }
          50%       { box-shadow: 0 0 0 3.5px rgba(24,22,23,0.22); }
        }

        /* ═══ Text cells ══════════════════════════════════════ */
        .asc-trunc {
          font-size: 7.5px; color: rgba(24,22,23,0.58);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;
        }

        /* ═══ Toggle ══════════════════════════════════════════ */
        .asc-cell-right { display: flex; justify-content: flex-end; }
        .asc-toggle {
          width: 20px; height: 11px; border-radius: 999px;
          background: rgba(24,22,23,0.18);
          position: relative; flex-shrink: 0;
          transition: background 150ms ease;
        }
        .asc-toggle::after {
          content: '';
          position: absolute; top: 1.5px; left: 1.5px;
          width: 8px; height: 8px; border-radius: 50%;
          background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.16);
        }
        .asc-toggle-on { background: #181617; }
        .asc-toggle-on::after { left: 10.5px; }

        /* ═══ Skeleton shimmer ════════════════════════════════ */
        .asc-sk {
          display: block;
          background: linear-gradient(
            90deg,
            rgba(24,22,23,0.06) 0%,
            rgba(24,22,23,0.04) 38%,
            rgba(24,22,23,0.10) 50%,
            rgba(24,22,23,0.04) 62%,
            rgba(24,22,23,0.06) 100%
          );
          background-size: 300% 100%;
          border-radius: 3px;
          animation: asc-shimmer 2s linear infinite;
        }
        .asc-sk-pill { border-radius: 999px; }
        @keyframes asc-shimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: -200% 0; }
        }
        .asc-sk-toggle {
          width: 20px; height: 11px; border-radius: 999px;
          background: rgba(24,22,23,0.08);
        }

        /* ═══ Footer ══════════════════════════════════════════ */
        .asc-footer {
          border-top: 1px solid rgba(24,22,23,0.07);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 10px; height: 28px;
          background: #fff; flex-shrink: 0; margin-top: auto;
        }
        .asc-footer-info { font-size: 7px; color: rgba(24,22,23,0.36); }
        .asc-pgr { display: flex; gap: 4px; }
        .asc-pg {
          height: 16px; padding: 0 8px;
          border: 1px solid rgba(24,22,23,0.10); border-radius: 4px;
          font-size: 7px; font-weight: 500; color: rgba(24,22,23,0.52);
          display: inline-flex; align-items: center; background: #fff;
        }
        .asc-pg-dim { color: rgba(24,22,23,0.25); background: #fafafb; }
      `}</style>
    </div>
  );
}
