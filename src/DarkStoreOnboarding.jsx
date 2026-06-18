import { useState, useEffect } from "react";
import StoreSelection, { StoreIcon } from "./StoreSelection.jsx";
import DocumentUpload from "./components/onboarding/DocumentUpload.jsx";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:           #08080a;
    --bg-elevated:  #0f0f12;
    --surface:      #141419;
    --surface-2:    #1a1a22;
    --surface-3:    #22222c;
    --border:       rgba(255,255,255,0.06);
    --border-focus: rgba(99,102,241,0.5);
    --accent:       #6366f1;
    --accent-soft:  rgba(99,102,241,0.12);
    --accent-glow:  rgba(99,102,241,0.25);
    --green:        #10b981;
    --green-soft:   rgba(16,185,129,0.12);
    --amber:        #f59e0b;
    --amber-soft:   rgba(245,158,11,0.12);
    --red:          #ef4444;
    --red-soft:     rgba(239,68,68,0.12);
    --text:         #f4f4f5;
    --text-2:       #a1a1aa;
    --text-3:       #71717a;
    --sans:         'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    --radius:       12px;
    --radius-lg:    16px;
    --radius-xl:    24px;
  }

  html {
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
    overscroll-behavior-y: none;
  }

  .shell {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 340px 1fr;
    background: var(--bg);
    position: relative;
    overflow: hidden;
  }

  .shell::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 10% 20%, rgba(99,102,241,0.08) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 90% 80%, rgba(16,185,129,0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── SIDEBAR ── */
  .sidebar {
    position: relative;
    z-index: 1;
    border-right: 1px solid var(--border);
    padding: 40px 32px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: rgba(15,15,18,0.6);
    backdrop-filter: blur(20px);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 48px;
  }

  .brand-mark {
    width: 42px;
    height: 42px;
    border-radius: 11px;
    background: linear-gradient(135deg, var(--accent) 0%, #818cf8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px var(--accent-glow);
  }

  .brand-mark svg { color: #fff; }

  .brand-name {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text);
  }

  .brand-tag {
    font-size: 12px;
    color: var(--text-3);
    margin-top: 1px;
  }

  .nav-steps {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .nav-step {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 16px;
    border-radius: var(--radius);
    cursor: default;
    transition: background 0.2s, opacity 0.2s;
    border: 1px solid transparent;
  }

  .nav-step.clickable { cursor: pointer; }
  .nav-step.clickable:hover { background: rgba(255,255,255,0.03); }

  .nav-step.active {
    background: var(--accent-soft);
    border-color: rgba(99,102,241,0.2);
  }

  .nav-step.future { opacity: 0.45; }

  .nav-num {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
    background: var(--surface-2);
    color: var(--text-3);
    border: 1px solid var(--border);
    transition: all 0.2s;
  }

  .nav-step.active .nav-num {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
    box-shadow: 0 4px 16px var(--accent-glow);
  }

  .nav-step.done .nav-num {
    background: var(--green-soft);
    border-color: rgba(16,185,129,0.3);
    color: var(--green);
  }

  .nav-text h4 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.01em;
    margin-bottom: 2px;
  }

  .nav-step.future .nav-text h4 { color: var(--text-2); }

  .nav-text p {
    font-size: 12px;
    color: var(--text-3);
    line-height: 1.45;
  }

  .sidebar-foot {
    margin-top: auto;
    padding-top: 32px;
    border-top: 1px solid var(--border);
  }

  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--text-3);
    margin-bottom: 10px;
  }

  .progress-label span:last-child { color: var(--text-2); font-weight: 500; }

  .progress-track {
    height: 4px;
    background: var(--surface-2);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), #818cf8);
    border-radius: 4px;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .trust-note {
    margin-top: 20px;
    font-size: 12px;
    color: var(--text-3);
    line-height: 1.55;
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }

  .trust-note svg { flex-shrink: 0; margin-top: 1px; color: var(--text-3); }

  /* === RECOMMENDER MODAL === */
  .recommender-sidebar-promo {
    margin-top: 20px;
    background: rgba(99, 102, 241, 0.04);
    border: 1px dashed rgba(99, 102, 241, 0.2);
    border-radius: var(--radius);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .promo-tag {
    font-size: 11px;
    font-weight: 700;
    color: #818cf8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .promo-text {
    font-size: 12px;
    color: var(--text-2);
    line-height: 1.5;
  }

  .btn-recommender {
    background: linear-gradient(135deg, var(--accent) 0%, #818cf8 100%);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    padding: 10px 14px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 14px var(--accent-glow);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-recommender:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px var(--accent-glow);
  }

  /* Recommender Highlight Banner in Page 2 */
  .recommender-highlight-banner {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0.02) 100%);
    border: 1px solid rgba(99, 102, 241, 0.25);
    border-radius: var(--radius-lg);
    padding: 20px 24px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.05), inset 0 0 20px rgba(99, 102, 241, 0.05);
  }

  @media (max-width: 768px) {
    .recommender-highlight-banner {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
    }
  }

  .recommender-highlight-left {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .recommender-highlight-title {
    font-size: 15px;
    font-weight: 700;
    color: #a5b4fc;
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: 0.04em;
  }

  .recommender-highlight-desc {
    font-size: 13px;
    color: var(--text-2);
    line-height: 1.5;
    max-width: 580px;
    margin: 0;
  }

  .btn-recommender-highlight {
    background: linear-gradient(135deg, var(--accent) 0%, #818cf8 100%);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    padding: 12px 20px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
    box-shadow: 0 4px 14px var(--accent-glow);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-recommender-highlight:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px var(--accent-glow);
  }

  /* Sidebar Recommender / Optimizer Placement */
  .sidebar-recommender {
    margin-top: 32px;
    padding-top: 32px;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .sidebar-recommender-title {
    font-size: 13px;
    font-weight: 600;
    color: #a5b4fc;
    display: flex;
    align-items: center;
    gap: 6px;
    text-transform: none;
  }

  .sidebar-recommender-desc {
    font-size: 12px;
    color: var(--text-3);
    line-height: 1.6;
    margin: 0;
  }

  .btn-sidebar-recommender {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 11px 18px;
    background: linear-gradient(135deg, var(--accent) 0%, #818cf8 100%);
    border: none;
    border-radius: var(--radius);
    color: #ffffff;
    font-size: 13px;
    font-weight: 600;
    font-family: var(--sans);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    margin-top: 8px;
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
    position: relative;
    overflow: hidden;
  }

  .btn-sidebar-recommender::after {
    content: '';
    position: absolute;
    top: 0;
    left: -150%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-25deg);
    transition: all 0.75s ease;
  }

  .btn-sidebar-recommender:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  }

  .btn-sidebar-recommender:hover::after {
    left: 150%;
  }

  .btn-sidebar-recommender:active {
    transform: translateY(-0.5px);
    box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
  }

  .recommender-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.82);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.25s ease-out;
  }

  .recommender-modal {
    width: 100%;
    max-width: 1100px;
    height: 90vh;
    max-height: 800px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6), 0 0 50px rgba(99, 102, 241, 0.12);
    animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .recommender-modal-head {
    padding: 20px 28px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .recommender-modal-head h3 {
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .btn-close-modal {
    background: var(--surface-3);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-2);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-close-modal:hover {
    background: var(--red-soft);
    color: var(--red);
    border-color: rgba(239, 68, 68, 0.2);
  }

  .recommender-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 28px;
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 28px;
  }

  @media (max-width: 992px) {
    .recommender-modal-body {
      grid-template-columns: 1fr;
    }
    .recommender-modal {
      height: 95vh;
      max-height: none;
    }
  }

  .recommender-modal-foot {
    padding: 16px 28px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
    background: rgba(15, 15, 18, 0.4);
  }

  .recommender-store-select-wrapper {
    margin-right: auto;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .recommender-store-select-wrapper label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-3);
  }

  .recommender-store-select {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-2);
    padding: 8px 36px 8px 14px;
    font-size: 13px;
    font-weight: 600;
    font-family: var(--sans);
    outline: none;
    cursor: pointer;
    transition: all 0.2s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
  }

  .recommender-store-select:hover {
    border-color: rgba(99,102,241,0.4);
    color: var(--text);
  }

  .recommender-store-select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-soft);
  }

  .recommender-store-warning {
    font-size: 11px;
    font-weight: 600;
    color: var(--amber);
    background: var(--amber-soft);
    padding: 4px 8px;
    border-radius: 6px;
    white-space: nowrap;
  }

  /* Spec strip */
  .spec-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px 14px;
    margin-bottom: 20px;
  }

  .spec-chip {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 4px 12px;
    border-right: 1px solid var(--border);
  }

  .spec-chip:last-child {
    border-right: none;
  }

  .spec-chip .lbl {
    font-family: monospace;
    font-size: 9px;
    letter-spacing: .06em;
    color: var(--text-3);
    text-transform: uppercase;
  }

  .spec-chip .val {
    font-family: monospace;
    font-size: 13px;
    color: var(--text-2);
    font-weight: 600;
  }

  /* List & inputs styling */
  .recommender-items-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .item-block {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .item-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1.2fr 1.2fr auto auto;
    gap: 8px;
    align-items: center;
  }

  @media (max-width: 640px) {
    .item-row {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .item-row input[type=text] {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text);
    font-size: 13px;
    padding: 6px 8px;
    outline: none;
    width: 100%;
  }

  .item-row input[type=number] {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text);
    font-family: monospace;
    font-size: 12.5px;
    padding: 6px 4px;
    width: 100%;
    outline: none;
    text-align: center;
  }

  .item-row input:focus {
    border-color: var(--accent);
  }

  .upright-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  .upright-wrap input {
    accent-color: var(--accent);
    width: 14px;
    height: 14px;
    cursor: pointer;
  }

  .upright-wrap label {
    font-size: 10px;
    color: var(--text-3);
    cursor: pointer;
    line-height: 1.2;
    white-space: nowrap;
  }

  .del-btn {
    background: transparent;
    border: none;
    color: var(--text-3);
    font-size: 14px;
    cursor: pointer;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .del-btn:hover {
    background: var(--red-soft);
    color: var(--red);
  }

  .result-line {
    font-family: monospace;
    font-size: 11px;
    padding: 6px 10px;
    border-radius: 6px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }

  .result-line.ok {
    background: var(--green-soft);
    color: #a7f3d0;
  }

  .result-line.warn {
    background: var(--red-soft);
    color: #fca5a5;
  }

  .result-line b {
    color: #fff;
  }

  .oversized-tag {
    font-family: monospace;
    font-size: 9px;
    background: rgba(239, 68, 68, 0.2);
    color: var(--red);
    padding: 1px 5px;
    border-radius: 4px;
    letter-spacing: .04em;
    text-transform: uppercase;
  }

  .add-row-btn {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px dashed var(--border);
    background: transparent;
    color: var(--text-2);
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--sans);
    transition: all 0.2s;
  }

  .add-row-btn:hover {
    border-color: var(--accent);
    color: #a5b4fc;
    background: var(--accent-soft);
  }

  /* Summary pane */
  .big-stat {
    background: linear-gradient(135deg, var(--accent-soft), transparent);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 14px;
    padding: 16px 20px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .big-stat .num {
    font-family: monospace;
    font-size: 36px;
    font-weight: 700;
    color: #fff;
    line-height: 1;
  }

  .big-stat .lbl {
    font-family: monospace;
    font-size: 11px;
    letter-spacing: .08em;
    color: #a5b4fc;
    text-transform: uppercase;
    margin-top: 6px;
  }

  .big-stat .sub {
    font-size: 12.5px;
    color: var(--text-2);
    margin-top: 6px;
  }

  .util-row {
    margin-bottom: 14px;
  }

  .util-row .top {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--text-2);
    margin-bottom: 4px;
  }

  .util-row .top b {
    color: var(--text);
    font-family: monospace;
  }

  .bar {
    height: 6px;
    border-radius: 3px;
    background: var(--surface-2);
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width .25s ease;
  }

  /* Bin visualizer Peek */
  .bin-peek-trigger {
    width: 100%;
    margin-top: 14px;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    font-family: var(--sans);
    position: relative;
    display: block;
  }

  .bin-peek-inner {
    display: flex;
    align-items: center;
    border-radius: 10px;
    overflow: hidden;
    background: var(--surface);
    border: 1px solid var(--border);
    transition: border-color .2s ease, box-shadow .2s ease;
  }

  .bin-peek-trigger:hover .bin-peek-inner {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent-glow);
  }

  .bin-peek-icon {
    width: 48px;
    flex-shrink: 0;
    background: linear-gradient(160deg, #1e1b4b, #312e81);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 0;
    position: relative;
    overflow: hidden;
  }

  .bin-peek-icon::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 80%, rgba(99, 102, 241, .4), transparent 70%);
  }

  /* Mini 3D bin animations */
  .mini-bin-wrap {
    position: relative;
    z-index: 1;
    width: 24px;
    height: 22px;
  }

  .mini-face {
    position: absolute;
  }

  .mini-front {
    bottom: 0;
    left: 4px;
    width: 16px;
    height: 14px;
    background: linear-gradient(160deg, #4338ca, #312e81);
    border: 1px solid rgba(99, 102, 241, .65);
    border-radius: 1.5px;
  }

  .mini-top {
    bottom: 12px;
    left: 0;
    width: 18px;
    height: 6px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border: 1px solid rgba(129, 140, 248, .7);
    border-radius: 1.5px 1.5px 0 0;
    transform: skewX(-30deg);
    transform-origin: bottom right;
  }

  .mini-side {
    bottom: 0;
    left: 17px;
    width: 7px;
    height: 14px;
    background: linear-gradient(180deg, #3730a3, #1e1b4b);
    border: 1px solid rgba(99, 102, 241, .4);
    border-radius: 1.5px;
    transform: skewY(-45deg);
    transform-origin: top left;
  }

  .mini-dots-grid {
    position: absolute;
    bottom: 2px;
    left: 4px;
    display: grid;
    grid-template-columns: repeat(3, 4px);
    gap: 1.5px;
  }

  .mini-d {
    width: 3px;
    height: 3px;
    border-radius: 0.5px;
    background: rgba(165, 180, 252, .9);
    animation: dp 1.8s ease-in-out infinite;
  }

  .mini-d:nth-child(2) { animation-delay: .15s; }
  .mini-d:nth-child(3) { animation-delay: .3s; }
  .mini-d:nth-child(4) { animation-delay: .45s; background: rgba(16, 185, 129, .9); }
  .mini-d:nth-child(5) { animation-delay: .6s; background: rgba(16, 185, 129, .9); }
  .mini-d:nth-child(6) { animation-delay: .75s; background: rgba(16, 185, 129, .6); }

  @keyframes dp {
    0%, 100% { opacity: .5; transform: scale(.85) }
    50% { opacity: 1; transform: scale(1) }
  }

  .bin-peek-text {
    flex: 1;
    text-align: left;
    padding: 10px 12px;
  }

  .bin-peek-label {
    font-size: 12px;
    font-weight: 700;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .bin-peek-badge {
    font-family: monospace;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
    background: var(--accent-soft);
    color: #a5b4fc;
    border: 1px solid rgba(99, 102, 241, .3);
    padding: 1px 4px;
    border-radius: 4px;
  }

  .bin-peek-sub {
    font-size: 11px;
    color: var(--text-3);
    margin-top: 2px;
  }

  .bin-peek-arrow {
    flex-shrink: 0;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-3);
    font-size: 12px;
    transition: transform .3s ease, color .2s;
  }

  .bin-peek-trigger:hover .bin-peek-arrow {
    color: #818cf8;
  }

  .bin-peek-trigger[aria-expanded="true"] .bin-peek-arrow {
    transform: rotate(180deg);
    color: #818cf8;
  }

  /* PREVIEW SHELL */
  .bin-preview-shell {
    overflow: hidden;
    max-height: 0;
    transition: max-height .5s cubic-bezier(.16,1,.3,1), opacity .3s ease;
    opacity: 0;
  }

  .bin-preview-shell.open {
    max-height: 900px;
    opacity: 1;
  }

  .bin-preview-panel {
    margin-top: 12px;
    background: linear-gradient(160deg, #111115, #16161c);
    border: 1px solid rgba(99, 102, 241, 0.15);
    border-radius: 12px;
    overflow: hidden;
  }

  .preview-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-bottom: 1px solid rgba(99, 102, 241, 0.1);
    background: rgba(99, 102, 241, 0.03);
  }

  .preview-topbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ptb-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 6px var(--accent);
    animation: pglow 2s ease-in-out infinite;
  }

  @keyframes pglow {
    0%, 100% { box-shadow: 0 0 4px rgba(99,102,241,.6) }
    50% { box-shadow: 0 0 12px rgba(99,102,241,1) }
  }

  .ptb-title {
    font-family: monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .06em;
    color: #a5b4fc;
    text-transform: uppercase;
  }

  .viz-select {
    background: rgba(255, 255, 255, .04);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text);
    font-size: 11px;
    padding: 4px 6px;
    font-family: var(--sans);
    outline: none;
  }

  .viz-select:focus {
    border-color: var(--accent);
  }

  .preview-body {
    padding: 16px;
  }

  .preview-empty {
    padding: 24px 16px;
    text-align: center;
    color: var(--text-3);
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .preview-empty-icon {
    font-size: 28px;
    opacity: .3;
  }

  .iso-stage {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
  }

  .iso-stage svg {
    max-width: 280px;
    width: 100%;
    filter: drop-shadow(0 10px 24px rgba(99, 102, 241, 0.15));
  }

  .flat-views {
    display: flex;
    gap: 8px;
  }

  .viz-panel {
    flex: 1 1 0;
    background: rgba(255, 255, 255, .02);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px;
  }

  .viz-panel-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .viz-panel-head .t {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: .05em;
    text-transform: uppercase;
    color: var(--text-2);
  }

  .viz-panel-head .d {
    font-family: monospace;
    font-size: 9px;
    color: var(--text-3);
  }

  .viz-panel svg {
    display: block;
    width: 100%;
    height: auto;
  }

  .viz-panel-foot {
    margin-top: 6px;
    text-align: center;
    font-family: monospace;
    font-size: 10px;
    color: var(--text-2);
  }

  .viz-panel-foot b {
    color: var(--text);
    font-size: 12px;
  }

  .viz-legend {
    display: flex;
    gap: 14px;
    margin: 10px 0 0;
    font-size: 10px;
    color: var(--text-3);
  }

  .viz-legend span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    display: inline-block;
    flex-shrink: 0;
  }

  .sw-fill {
    background: var(--accent);
  }

  .sw-empty {
    background-image: repeating-linear-gradient(45deg,rgba(255,255,255,.1) 0 2px,transparent 2px 5px);
    border: 1px solid var(--border);
  }

  .viz-buffer {
    margin-top: 14px;
    background: rgba(255, 255, 255, .02);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px;
  }

  .viz-dots {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 8px;
  }

  .viz-dot {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    background: var(--accent);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, .08) inset;
    transition: transform .15s ease;
  }

  .viz-dot:hover {
    transform: scale(1.25);
  }

  .viz-dot.muted {
    background: transparent;
    border: 1px dashed var(--border);
  }

  .viz-dot.weight-cut {
    background: transparent;
    border: 1px dashed var(--amber);
  }

  .viz-buffer-note {
    font-size: 11px;
    color: var(--text-2);
    line-height: 1.5;
  }

  .viz-buffer-note b {
    color: var(--text);
  }

  .viz-flow {
    display: flex;
    align-items: stretch;
    gap: 4px;
    margin-top: 14px;
  }

  .viz-flow-stat {
    flex: 1;
    text-align: center;
    background: rgba(255, 255, 255, .02);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 2px;
  }

  .viz-flow-stat.hi {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.03));
    border-color: rgba(99, 102, 241, 0.3);
  }

  .viz-flow-stat .n {
    font-family: monospace;
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
    line-height: 1;
  }

  .viz-flow-stat.hi .n {
    color: #fff;
  }

  .viz-flow-stat .l {
    font-size: 9px;
    letter-spacing: .03em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-top: 3px;
  }

  .viz-flow-arrow {
    flex: 0 0 auto;
    align-self: center;
    color: var(--text-3);
    font-size: 14px;
  }

  .viz-sentence {
    margin: 14px 0 0;
    padding: 8px 10px;
    background: rgba(99, 102, 241, 0.05);
    border-left: 2px solid var(--accent);
    border-radius: 0 6px 6px 0;
    font-size: 11.5px;
    line-height: 1.6;
    color: var(--text-2);
  }

  .viz-sentence b {
    color: var(--text);
  }

  /* ── MAIN ── */
  .main {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow-y: auto;
  }

  .main-inner {
    flex: 1;
    max-width: 720px;
    width: 100%;
    margin: 0 auto;
    padding: 56px 48px 32px;
  }

  .page-head {
    margin-bottom: 40px;
  }

  .page-eyebrow {
    font-size: 12px;
    font-weight: 600;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 12px;
  }

  .page-title {
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--text);
    line-height: 1.15;
    margin-bottom: 10px;
  }

  .page-desc {
    font-size: 15px;
    color: var(--text-2);
    line-height: 1.65;
    max-width: 520px;
  }

  /* ── SECTIONS ── */
  .section {
    margin-bottom: 32px;
  }

  .section-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-label .optional {
    font-weight: 400;
    color: var(--text-3);
    font-size: 12px;
  }

  .panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 24px;
  }

  .panel + .panel { margin-top: 16px; }

  .field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .field-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .field span {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-2);
  }

  .field span em {
    color: var(--red);
    font-style: normal;
  }

  .field input,
  .field select,
  .field textarea {
    width: 100%;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
    font-size: 14px;
    font-family: var(--sans);
    padding: 12px 14px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    appearance: none;
  }

  .field input::placeholder { color: var(--text-3); }

  .field input:hover,
  .field select:hover {
    border-color: rgba(255,255,255,0.1);
    background: var(--surface-3);
  }

  .field input:focus,
  .field select:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px var(--accent-soft);
    background: var(--surface-2);
  }

  .field select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 40px;
    cursor: pointer;
  }

  .field select option { background: var(--surface-2); }

  .field-hint {
    font-size: 12px;
    color: var(--text-3);
    margin-top: -2px;
  }

  .field-error {
    font-size: 12px;
    color: var(--red);
    margin-top: -2px;
  }

  .field.has-error input,
  .field.has-error select {
    border-color: rgba(239,68,68,0.5);
    box-shadow: 0 0 0 3px var(--red-soft);
  }

  .step-error-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    margin-bottom: 24px;
    background: var(--red-soft);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: var(--radius);
    font-size: 13px;
    color: var(--red);
  }

  .btn-primary:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .btn-primary:disabled:hover {
    background: var(--accent);
    transform: none;
    box-shadow: none;
  }

  .agreement.has-error {
    border-color: rgba(239,68,68,0.4);
    background: var(--red-soft);
  }

  /* ── SOCIAL ── */
  .social-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .social-item {
    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 12px;
    align-items: center;
  }

  .social-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--radius);
    background: var(--surface-2);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-2);
  }

  /* ── SKU ── */
  .sku-list { display: flex; flex-direction: column; gap: 12px; }

  .sku-item {
    display: grid;
    grid-template-columns: 1fr 120px;
    gap: 12px;
    align-items: center;
  }

  .sku-index {
    position: absolute;
    left: -28px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
    width: 20px;
    text-align: center;
  }

  .sku-item-wrap { position: relative; padding-left: 28px; }

  /* ── CHIPS ── */
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .chip {
    padding: 8px 16px;
    border-radius: 100px;
    border: 1px solid var(--border);
    font-size: 13px;
    font-weight: 500;
    color: var(--text-2);
    background: var(--surface-2);
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;
  }

  .chip:hover {
    border-color: rgba(255,255,255,0.12);
    color: var(--text);
  }

  .chip.on {
    background: var(--accent-soft);
    border-color: rgba(99,102,241,0.35);
    color: #a5b4fc;
  }

  /* ── STORE CARDS ── */
  .store-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .store-card {
    position: relative;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 18px 18px 18px 20px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .store-card:hover:not(.disabled) {
    border-color: rgba(255,255,255,0.1);
    background: var(--surface-3);
  }

  .store-card.selected {
    border-color: rgba(99,102,241,0.4);
    background: var(--accent-soft);
    box-shadow: 0 0 0 1px rgba(99,102,241,0.15);
  }

  .store-card.disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .store-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  .store-card h5 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.01em;
  }

  .store-card .area {
    font-size: 12px;
    color: var(--text-3);
    margin-top: 2px;
  }

  .store-check {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    border: 1.5px solid var(--border);
    background: var(--surface);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .store-card.selected .store-check {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }

  .store-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 100px;
    letter-spacing: 0.01em;
  }

  .pill-green { background: var(--green-soft); color: var(--green); }
  .pill-amber { background: var(--amber-soft); color: var(--amber); }
  .pill-red   { background: var(--red-soft);   color: var(--red); }

  .pill-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }

  .storage-tag {
    font-size: 11px;
    color: var(--text-3);
    padding: 4px 0;
  }

  /* ── STORE SELECTION (grid / map / cart) ── */
  .ss-wrap { display: flex; flex-direction: column; gap: 20px; }

  .ss-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }

  .ss-search {
    flex: 1;
    min-width: 220px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0 14px;
    color: var(--text-3);
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .ss-search:focus-within {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  .ss-search input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text);
    font-size: 14px;
    font-family: var(--sans);
    padding: 13px 0;
    outline: none;
    min-width: 0;
  }

  .ss-search input::placeholder { color: var(--text-3); }

  .ss-count {
    font-size: 13px;
    color: var(--text-3);
    white-space: nowrap;
  }

  .ss-view-toggle {
    display: flex;
    gap: 4px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 4px;
  }

  .ss-view-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--text-3);
    font-size: 13px;
    font-weight: 600;
    font-family: var(--sans);
    cursor: pointer;
    transition: all 0.15s;
  }

  .ss-view-btn.active {
    background: var(--surface-3);
    color: var(--text);
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }

  .ss-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  .ss-card {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .ss-card.highlighted {
    border-color: rgba(99,102,241,0.5);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  .ss-card.in-cart {
    border-color: rgba(99,102,241,0.35);
    background: rgba(99,102,241,0.06);
  }

  .ss-card.unavailable {
    opacity: 0.55;
  }

  .ss-card-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
  }

  .ss-card-head h3 {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .ss-card-head p {
    font-size: 12px;
    color: var(--text-3);
    margin-top: 2px;
  }

  .ss-in-cart-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    color: #a5b4fc;
    background: var(--accent-soft);
    border: 1px solid rgba(99,102,241,0.3);
    padding: 4px 8px;
    border-radius: 100px;
    flex-shrink: 0;
  }

  .ss-card-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }

  .ss-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 100px;
  }

  .ss-pill-green { background: var(--green-soft); color: var(--green); }
  .ss-pill-amber { background: var(--amber-soft); color: var(--amber); }
  .ss-pill-red   { background: var(--red-soft);   color: var(--red); }

  .ss-pill-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  .ss-storage-tag {
    font-size: 11px;
    color: var(--text-3);
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 3px 8px;
    border-radius: 100px;
  }

  .ss-address {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-3);
  }

  /* ── SHELF VISUALIZER ── */
  .ss-shelf-visualizer {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: var(--radius);
    padding: 14px;
    margin-top: 4px;
    margin-bottom: 4px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ss-shelf-visualizer:hover {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .ss-shelf-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  .ss-shelf-allocating {
    color: var(--text-2);
  }

  .ss-shelf-allocating strong {
    color: #a5b4fc;
    font-size: 13px;
    margin-left: 4px;
    text-shadow: 0 0 8px rgba(99,102,241,0.4);
  }

  .ss-shelf-pending {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .ss-shelf-pending-green { color: var(--green); }
  .ss-shelf-pending-amber { color: var(--amber); }
  .ss-shelf-pending-red { color: var(--red); }

  .ss-shelf-pending strong {
    font-size: 13px;
    text-shadow: currentColor 0px 0px 8px;
  }

  /* Segmented progress bar for shelves distribution */
  .ss-shelf-progress-wrapper {
    margin-bottom: 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .ss-shelf-progress-bar {
    height: 6px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 3px;
    overflow: hidden;
    display: flex;
    border: 1px solid rgba(255, 255, 255, 0.04);
  }

  .ss-progress-segment {
    height: 100%;
    transition: width 0.3s ease;
  }
  .ss-progress-segment.blocked {
    background: var(--red);
    box-shadow: 0 0 6px rgba(239, 68, 68, 0.45);
  }

  .ss-progress-segment.selected {
    background: linear-gradient(90deg, #a855f7 0%, #8b5cf6 100%);
    box-shadow: 0 0 6px rgba(139, 92, 246, 0.5);
  }

  .ss-progress-segment.free {
    background: var(--green);
    box-shadow: 0 0 6px rgba(16, 185, 129, 0.45);
  }

  .ss-shelf-progress-labels {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 10px;
    font-weight: 500;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .ss-shelf-progress-labels span {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .ss-shelf-progress-labels span strong {
    color: var(--text-2);
  }

  .ss-shelf-progress-labels span.green strong {
    color: var(--green);
  }

  .ss-shelf-progress-labels span.amber strong {
    color: var(--amber);
  }

  .ss-shelf-progress-labels .ss-progress-total {
    margin-left: auto;
    color: var(--text-3);
  }

  .ss-shelf-rack {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(22px, 1fr));
    gap: 6px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.03);
    min-height: 40px;
    position: relative;
    overflow: hidden;
  }

  .ss-shelf-rack::before {
    content: '';
    position: absolute;
    top: 0;
    left: -150%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.03) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-25deg);
    animation: shimmer-shelf 6s infinite linear;
  }

  @keyframes shimmer-shelf {
    0% { left: -150%; }
    50% { left: 150%; }
    100% { left: 150%; }
  }

  .ss-shelf-slot {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    position: relative;
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    transition-delay: calc(var(--index) * 6ms);
    cursor: default;
    flex-shrink: 0;
  }

  /* Booked state (disabled/grayed out) */
  .ss-shelf-slot.booked {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    cursor: not-allowed;
    opacity: 0.35;
  }

  /* Allocated state (Indigo glow) */
  .ss-shelf-slot.allocated {
    background: linear-gradient(135deg, var(--accent) 0%, #818cf8 100%);
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.5), inset 0 1px 0 rgba(255,255,255,0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
    animation: pulse-active 2s infinite ease-in-out;
  }

  @keyframes pulse-active {
    0%, 100% {
      box-shadow: 0 0 8px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255,255,255,0.2);
    }
    50% {
      box-shadow: 0 0 16px rgba(99, 102, 241, 0.7), inset 0 1px 0 rgba(255,255,255,0.4);
      transform: scale(1.08);
    }
  }

  /* Pending green state */
  .ss-shelf-slot.pending.green {
    background: rgba(16, 185, 129, 0.05);
    border: 1px solid rgba(16, 185, 129, 0.25);
  }
  .ss-shelf-slot.pending.green:hover {
    background: rgba(16, 185, 129, 0.12);
    border-color: rgba(16, 185, 129, 0.5);
    box-shadow: 0 0 6px rgba(16, 185, 129, 0.2);
  }

  /* Pending amber state */
  .ss-shelf-slot.pending.amber {
    background: rgba(245, 158, 11, 0.05);
    border: 1px solid rgba(245, 158, 11, 0.25);
  }
  .ss-shelf-slot.pending.amber:hover {
    background: rgba(245, 158, 11, 0.12);
    border-color: rgba(245, 158, 11, 0.5);
    box-shadow: 0 0 6px rgba(245, 158, 11, 0.2);
  }

  /* Core center dot for pending slots */
  .ss-shelf-slot.pending::after {
    content: '';
    position: absolute;
    inset: 0;
    margin: auto;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.35;
    transition: opacity 0.2s, transform 0.2s;
  }

  .ss-shelf-slot.pending.green::after { color: var(--green); }
  .ss-shelf-slot.pending.amber::after { color: var(--amber); }

  .ss-shelf-slot.pending:hover::after {
    opacity: 0.8;
    transform: scale(1.3);
  }

  /* Sold out / Empty state */
  .ss-shelf-visualizer.exhausted {
    opacity: 0.8;
  }

  .ss-shelf-slot-empty-alert {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 500;
    color: var(--red);
    padding: 6px 0;
  }

  .pulse-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--red);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    animation: pulse-red 1.6s infinite cubic-bezier(0.66, 0, 0, 1);
  }

  @keyframes pulse-red {
    to {
      box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
    }
  }

  .ss-unavailable-msg {
    font-size: 12px;
    color: var(--text-3);
    padding: 10px 0 4px;
    border-top: 1px solid var(--border);
    margin-top: auto;
  }

  .ss-card-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
    margin-top: auto;
  }

  .ss-qty {
    display: flex;
    align-items: center;
    gap: 4px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 4px;
  }

  .ss-qty button {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 8px;
    background: var(--surface-2);
    color: var(--text-2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s;
  }

  .ss-qty button:disabled { opacity: 0.35; cursor: not-allowed; }
  .ss-qty button:not(:disabled):hover { background: var(--surface-3); color: var(--text); }

  .ss-qty span {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-2);
    min-width: 58px;
    text-align: center;
  }

  .ss-qty-input {
    width: 36px;
    height: 32px;
    background: transparent;
    border: none;
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
    font-family: var(--sans);
    text-align: center;
    outline: none;
    padding: 0;
  }

  .ss-qty-input::-webkit-outer-spin-button,
  .ss-qty-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .ss-qty-input[type=number] {
    -moz-appearance: textfield;
  }

  .ss-qty-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-3);
    margin-right: 6px;
    user-select: none;
  }

  .ss-add-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border: 1px solid rgba(99,102,241,0.35);
    border-radius: 10px;
    background: var(--accent-soft);
    color: #c7d2fe;
    font-size: 13px;
    font-weight: 600;
    font-family: var(--sans);
    cursor: pointer;
    transition: all 0.15s;
  }

  .ss-add-btn:hover {
    background: rgba(99,102,241,0.22);
    border-color: rgba(99,102,241,0.5);
  }

  .ss-map-wrap { display: flex; flex-direction: column; gap: 12px; }

  .ss-map {
    position: relative;
    height: 420px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .ss-map-leaflet {
    padding: 0;
  }

  .ss-map-empty {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ss-leaflet-container {
    width: 100%;
    height: 100%;
    min-height: 420px;
    background: #1a1a22;
    font-family: var(--sans);
  }

  .ss-leaflet-container path {
    transition: stroke 0.25s ease, stroke-width 0.25s ease, fill-opacity 0.25s ease, fill 0.25s ease;
  }

  /* ── COVERAGE POLYGONS ── */
  .store-radius-polygon-base {
    transition: stroke-width 0.3s ease, stroke 0.3s ease, fill-opacity 0.3s ease;
    stroke-linejoin: round !important;
    stroke-linecap: round !important;
  }

  .store-radius-polygon-base-highlighted {
    animation: polygon-glow-breathe 4s ease-in-out infinite;
    stroke-linejoin: round !important;
    stroke-linecap: round !important;
  }

  @keyframes polygon-glow-breathe {
    0%, 100% { fill-opacity: 0.35; }
    50% { fill-opacity: 0.55; }
  }

  .leaflet-store-marker-wrap {
    background: transparent !important;
    border: none !important;
  }

  .leaflet-store-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transition: transform 0.15s;
  }

  .leaflet-store-marker:hover {
    transform: scale(1.08);
  }

  .ss-marker-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 2px 12px rgba(0,0,0,0.45);
  }

  .ss-marker-green .ss-marker-dot,
  .leaflet-store-marker.ss-marker-green .ss-marker-dot { background: var(--green); box-shadow: 0 0 16px rgba(16,185,129,0.55); }
  .ss-marker-amber .ss-marker-dot,
  .leaflet-store-marker.ss-marker-amber .ss-marker-dot { background: var(--amber); box-shadow: 0 0 16px rgba(245,158,11,0.55); }
  .ss-marker-red .ss-marker-dot,
  .leaflet-store-marker.ss-marker-red .ss-marker-dot   { background: var(--red);   box-shadow: 0 0 16px rgba(239,68,68,0.45); }

  .leaflet-store-marker.in-cart .ss-marker-dot {
    outline: 3px solid var(--accent);
    outline-offset: 2px;
  }

  .ss-marker-code {
    font-size: 10px;
    font-weight: 700;
    color: var(--text);
    background: rgba(8,8,10,0.92);
    border: 1px solid var(--border);
    padding: 2px 6px;
    border-radius: 4px;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  .ss-marker-label {
    font-size: 10px;
    color: var(--text);
    background: rgba(8,8,10,0.85);
    padding: 1px 6px;
    border-radius: 4px;
    max-width: 90px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ss-leaflet-popup .leaflet-popup-content-wrapper {
    background: rgba(20,20,25,0.98);
    border: 1px solid rgba(99,102,241,0.35);
    border-radius: var(--radius);
    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
    color: var(--text);
  }

  .ss-leaflet-popup .leaflet-popup-content {
    margin: 14px 16px;
    min-width: 200px;
  }

  .ss-leaflet-popup .leaflet-popup-tip {
    background: rgba(20,20,25,0.98);
    border: 1px solid rgba(99,102,241,0.2);
    box-shadow: none;
  }

  .ss-leaflet-popup .leaflet-popup-close-button {
    color: var(--text-3) !important;
    font-size: 18px !important;
    padding: 6px 8px 0 0 !important;
  }

  .ss-leaflet-popup .leaflet-popup-close-button:hover {
    color: var(--text) !important;
  }

  .ss-leaflet-popup-inner h4 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
    letter-spacing: -0.01em;
  }

  .ss-leaflet-popup-area {
    font-size: 12px;
    color: var(--text-3);
    margin-bottom: 10px;
  }

  .ss-leaflet-popup-address {
    font-size: 11px;
    color: var(--text-3);
    margin: 8px 0;
    line-height: 1.45;
  }

  .leaflet-control-zoom a {
    background: rgba(20,20,25,0.95) !important;
    color: var(--text) !important;
    border-color: var(--border) !important;
  }

  .leaflet-control-zoom a:hover {
    background: var(--surface-3) !important;
  }

  .leaflet-control-attribution {
    background: rgba(8,8,10,0.75) !important;
    color: var(--text-3) !important;
    font-size: 10px !important;
    padding: 2px 6px !important;
    border-radius: 4px 0 0 0;
  }

  .leaflet-control-attribution a {
    color: var(--text-2) !important;
  }

  .ss-popup-storage {
    font-size: 12px;
    color: var(--text-3);
    margin: 8px 0;
  }

  .ss-popup-link {
    background: none;
    border: none;
    color: var(--accent);
    font-size: 12px;
    font-weight: 600;
    font-family: var(--sans);
    cursor: pointer;
    padding: 0;
    text-align: left;
  }

  .ss-popup-link:hover { text-decoration: underline; }

  .ss-map-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    font-size: 12px;
    color: var(--text-3);
  }

  .ss-map-legend span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .ss-legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .ss-legend-dot.green { background: var(--green); }
  .ss-legend-dot.amber { background: var(--amber); }
  .ss-legend-dot.red   { background: var(--red); }

  .ss-map-hint, .ss-hint {
    font-size: 12px;
    color: var(--text-3);
    line-height: 1.5;
  }

  .ss-error {
    font-size: 13px;
    color: var(--red);
  }

  .ss-city-filter {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ss-city-filter-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .ss-city-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .ss-city-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 100px;
    border: 1px solid var(--border);
    background: var(--surface-2);
    color: var(--text-2);
    font-size: 13px;
    font-weight: 600;
    font-family: var(--sans);
    cursor: pointer;
    transition: all 0.15s;
  }

  .ss-city-pill:hover {
    border-color: rgba(255,255,255,0.12);
    color: var(--text);
  }

  .ss-city-pill.active {
    background: var(--accent-soft);
    border-color: rgba(99,102,241,0.4);
    color: #c7d2fe;
    box-shadow: 0 0 0 1px rgba(99,102,241,0.15);
  }

  .ss-city-pill-badge {
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 100px;
    background: var(--accent);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .ss-selection-panel {
    background: linear-gradient(180deg, var(--surface) 0%, rgba(20,20,25,0.95) 100%);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  }

  .ss-selection-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 20px;
    background: var(--accent-soft);
    border-bottom: 1px solid rgba(99,102,241,0.15);
  }

  .ss-selection-head h4 {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
  }

  .ss-selection-head p {
    font-size: 12px;
    color: var(--text-3);
  }

  .ss-selection-total {
    flex-shrink: 0;
    font-size: 13px;
    font-weight: 700;
    color: #a5b4fc;
    background: rgba(99,102,241,0.15);
    border: 1px solid rgba(99,102,241,0.25);
    padding: 8px 14px;
    border-radius: 100px;
  }

  .ss-selection-groups {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .ss-selection-city-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 700;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 10px;
  }

  .ss-selection-city-label em {
    font-style: normal;
    font-weight: 500;
    color: var(--text-3);
    opacity: 0.8;
    margin-left: auto;
  }

  .ss-selection-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ss-selection-item {
    display: flex;
    align-items: stretch;
    gap: 12px;
    padding: 14px 16px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition: border-color 0.15s;
  }

  .ss-selection-item:hover {
    border-color: rgba(255,255,255,0.1);
  }

  .ss-selection-item-main {
    flex: 1;
    min-width: 0;
  }

  .ss-selection-item-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 4px;
  }

  .ss-selection-item-top strong {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .ss-selection-area {
    font-size: 12px;
    color: var(--text-3);
    margin-bottom: 4px;
  }

  .ss-selection-address {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: var(--text-3);
    opacity: 0.85;
  }

  .ss-selection-item-actions {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex-shrink: 0;
  }

  .ss-selection-view {
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-2);
    font-size: 11px;
    font-weight: 600;
    font-family: var(--sans);
    cursor: pointer;
  }

  .ss-selection-view:hover {
    color: var(--text);
    border-color: rgba(255,255,255,0.12);
  }

  .ss-selection-remove {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid rgba(239,68,68,0.25);
    background: var(--red-soft);
    color: var(--red);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-left: auto;
  }

  .ss-selection-remove:hover {
    background: rgba(239,68,68,0.2);
  }

  .ss-selection-disclaimer {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .ss-disclaimer-text {
    font-size: 11px;
    margin-left: 16px;
    margin-right: 12px;
    line-height: 1.5;
    color: var(--text-3);
  }

  .ss-disclaimer-text strong {
    color: var(--text-2);
  }

  .ss-disclaimer-agreement {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 12px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: var(--radius);
    cursor: pointer;
    margin-top: 10px;
    transition: background-color 0.15s, border-color 0.15s;
  }

  .ss-disclaimer-agreement:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.1);
  }

  .ss-disclaimer-agreement input {
    width: 16px;
    height: 16px;
    margin-top: 1px;
    accent-color: var(--accent);
    cursor: pointer;
    flex-shrink: 0;
  }

  .ss-disclaimer-agreement span {
    font-size: 11px;
    color: var(--text-2);
    line-height: 1.5;
    user-select: none;
  }

  .checkout-bar .action-bar-inner {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 16px;
  }

  .checkout-summary {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
  }

  .checkout-cart-icon {
    position: relative;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-2);
    flex-shrink: 0;
  }

  .checkout-cart-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 100px;
    background: var(--accent);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .checkout-stats {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .checkout-stats strong {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
  }

  .checkout-stats span {
    font-size: 12px;
    color: var(--text-3);
  }

  .btn-checkout {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .main-inner.step-store {
    max-width: 900px;
  }

  /* ── DOCS ── */
  .doc-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .doc-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 18px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.15s;
  }

  .doc-item:hover {
    border-color: rgba(255,255,255,0.1);
    background: var(--surface-3);
  }

  .doc-item.uploaded {
    border-color: rgba(16,185,129,0.3);
    background: var(--green-soft);
  }

  .doc-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-2);
    flex-shrink: 0;
  }

  .doc-item.uploaded .doc-icon {
    background: rgba(16,185,129,0.15);
    border-color: rgba(16,185,129,0.25);
    color: var(--green);
  }

  .doc-info { flex: 1; min-width: 0; }

  .doc-info h5 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
  }

  .doc-info p {
    font-size: 12px;
    color: var(--text-3);
    margin-top: 2px;
  }

  .doc-item.uploaded .doc-info p { color: var(--green); }

  .doc-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 100px;
    flex-shrink: 0;
  }

  .doc-badge.req { background: var(--red-soft); color: var(--red); }
  .doc-badge.opt { background: var(--surface); color: var(--text-3); border: 1px solid var(--border); }

  .doc-action {
    font-size: 12px;
    font-weight: 600;
    color: var(--accent);
    flex-shrink: 0;
  }

  .doc-remove-btn {
    background: none;
    border: none;
    color: var(--text-3);
    font-size: 14px;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 6px;
    transition: all 0.15s;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .doc-item-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
  }

  .doc-item-wrapper.rejected .doc-item {
    border-color: rgba(239, 68, 68, 0.4) !important;
    background: rgba(239, 68, 68, 0.05);
  }

  .doc-item-wrapper.review .doc-item {
    border-color: rgba(245, 158, 11, 0.3) !important;
    background: var(--amber-soft);
  }

  .doc-item-wrapper.review .doc-icon {
    background: rgba(245, 158, 11, 0.15);
    border-color: rgba(245, 158, 11, 0.25);
    color: var(--amber);
  }

  .doc-status-alert {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 14px;
    border-radius: var(--radius);
    font-size: 12px;
    line-height: 1.4;
  }

  .loading-alert {
    background: rgba(99, 102, 241, 0.08);
    border: 1px solid rgba(99, 102, 241, 0.15);
    color: var(--text-2);
  }

  .reject-alert {
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.18);
    color: #fca5a5;
  }

  .review-alert {
    background: rgba(245, 158, 11, 0.08);
    border: 1px solid rgba(245, 158, 11, 0.18);
    color: #fcd34d;
  }

  .accept-alert {
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.18);
    color: #a7f3d0;
  }

  .animate-spin {
    animation: doc-spin 1s linear infinite;
  }

  @keyframes doc-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .doc-remove-btn:hover {
    color: var(--red);
    background: rgba(239, 68, 68, 0.15);
  }

  /* ── SUMMARY ── */
  .summary {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--border);
  }

  .summary-item {
    background: var(--surface-2);
    padding: 16px 20px;
  }

  .summary-item span {
    display: block;
    font-size: 12px;
    color: var(--text-3);
    margin-bottom: 4px;
  }

  .summary-item strong {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
  }

  /* ── AGREEMENT ── */
  .agreement {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 18px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    cursor: pointer;
    transition: border-color 0.15s;
  }

  .agreement:hover { border-color: rgba(255,255,255,0.1); }

  .agreement input {
    width: 18px;
    height: 18px;
    margin-top: 1px;
    accent-color: var(--accent);
    cursor: pointer;
    flex-shrink: 0;
  }

  .agreement label {
    font-size: 13px;
    color: var(--text-2);
    line-height: 1.6;
    cursor: pointer;
  }

  .agreement a {
    color: var(--accent);
    text-decoration: none;
  }

  .agreement a:hover { text-decoration: underline; }

  /* ── FOOTER BAR ── */
  .action-bar {
    position: sticky;
    bottom: 0;
    z-index: 10;
    border-top: 1px solid var(--border);
    background: rgba(8,8,10,0.85);
    backdrop-filter: blur(16px);
    padding: 20px 48px;
  }

  .action-bar-inner {
    max-width: 720px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 600;
    padding: 12px 22px;
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.15s;
    border: none;
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-2);
    border: 1px solid var(--border);
  }

  .btn-ghost:hover {
    background: var(--surface);
    color: var(--text);
    border-color: rgba(255,255,255,0.1);
  }

  .btn-primary {
    background: var(--accent);
    color: #fff;
    box-shadow: 0 4px 24px var(--accent-glow);
  }

  .btn-primary:hover {
    background: #5558e3;
    transform: translateY(-1px);
    box-shadow: 0 8px 32px var(--accent-glow);
  }

  /* ── CONFIRM ── */
  .confirm-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 48px 24px;
    position: relative;
    z-index: 1;
  }

  .confirm-card {
    max-width: 480px;
    width: 100%;
    text-align: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 48px 40px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.4);
  }

  .confirm-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: var(--green-soft);
    border: 2px solid rgba(16,185,129,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    color: var(--green);
    box-shadow: 0 0 48px rgba(16,185,129,0.2);
  }

  .confirm-card h2 {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.03em;
    margin-bottom: 10px;
  }

  .confirm-card > p {
    font-size: 15px;
    color: var(--text-2);
    line-height: 1.65;
    margin-bottom: 32px;
  }

  .timeline {
    text-align: left;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 20px 24px;
  }

  .timeline h4 {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 16px;
  }

  .timeline-item {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding: 10px 0;
  }

  .timeline-item + .timeline-item {
    border-top: 1px solid var(--border);
  }

  .timeline-num {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--accent-soft);
    color: #a5b4fc;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .timeline-item p {
    font-size: 13px;
    color: var(--text);
    line-height: 1.5;
  }

  /* ── MOBILE HEADER (hidden on desktop) ── */
  .mobile-header {
    display: none;
  }

  @media (max-width: 960px) {
    .shell {
      grid-template-columns: 1fr;
      min-height: 100dvh;
    }

    .sidebar { display: none; }

    .mobile-header {
      display: block;
      position: sticky;
      top: 0;
      z-index: 20;
      background: rgba(8,8,10,0.92);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      padding: calc(12px + env(safe-area-inset-top, 0px)) 16px 14px;
    }

    .mobile-header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
    }

    .mobile-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .mobile-brand img {
      width: 34px;
      height: 34px;
      border-radius: 9px;
      flex-shrink: 0;
    }

    .mobile-brand-text {
      min-width: 0;
    }

    .mobile-brand-text strong {
      display: block;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.02em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mobile-brand-text span {
      display: block;
      font-size: 11px;
      color: var(--text-3);
      margin-top: 1px;
    }

    .mobile-step-badge {
      flex-shrink: 0;
      font-size: 11px;
      font-weight: 600;
      color: #a5b4fc;
      background: var(--accent-soft);
      border: 1px solid rgba(99,102,241,0.25);
      padding: 6px 10px;
      border-radius: 100px;
      letter-spacing: 0.02em;
    }

    .mobile-progress-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .mobile-progress-track {
      flex: 1;
      height: 4px;
      background: var(--surface-2);
      border-radius: 4px;
      overflow: hidden;
    }

    .mobile-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent), #818cf8);
      border-radius: 4px;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .mobile-progress-pct {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-3);
      min-width: 32px;
      text-align: right;
    }

    .mobile-step-pills {
      display: flex;
      gap: 6px;
      margin-top: 12px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      padding-bottom: 2px;
    }

    .mobile-step-pills::-webkit-scrollbar { display: none; }

    .mobile-step-pill {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-3);
      background: var(--surface-2);
      border: 1px solid var(--border);
      transition: all 0.2s;
    }

    .mobile-step-pill.clickable {
      cursor: pointer;
    }

    .mobile-step-pill.done {
      color: var(--green);
      background: var(--green-soft);
      border-color: rgba(16,185,129,0.25);
    }

    .mobile-step-pill.active {
      color: #c7d2fe;
      background: var(--accent-soft);
      border-color: rgba(99,102,241,0.35);
    }

    .mobile-step-pill-num {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: 700;
      background: rgba(255,255,255,0.06);
      flex-shrink: 0;
    }

    .mobile-step-pill-num svg {
      width: 10px;
      height: 10px;
    }

    .mobile-step-pill.active .mobile-step-pill-num {
      background: var(--accent);
      color: #fff;
    }

    .mobile-step-pill.done .mobile-step-pill-num {
      background: rgba(16,185,129,0.2);
      color: var(--green);
    }

    .main {
      min-height: 100dvh;
    }

    .main-inner {
      padding: 20px 16px calc(88px + env(safe-area-inset-bottom, 0px));
      max-width: none;
    }

    .page-head {
      margin-bottom: 28px;
    }

    .page-eyebrow {
      font-size: 11px;
      margin-bottom: 8px;
    }

    .page-title {
      font-size: 24px;
      letter-spacing: -0.025em;
      margin-bottom: 8px;
    }

    .page-desc {
      font-size: 14px;
      line-height: 1.55;
      max-width: none;
    }

    .section {
      margin-bottom: 24px;
    }

    .section-label {
      font-size: 12px;
      margin-bottom: 12px;
    }

    .panel {
      padding: 16px;
      border-radius: var(--radius);
    }

    .field-grid,
    .field-grid-3,
    .store-grid,
    .summary {
      grid-template-columns: 1fr;
    }

    .field input,
    .field select {
      font-size: 16px;
      padding: 14px 16px;
      border-radius: 14px;
      min-height: 48px;
    }

    .field span {
      font-size: 12px;
    }

    .chip {
      padding: 10px 16px;
      font-size: 13px;
      min-height: 40px;
      display: inline-flex;
      align-items: center;
    }

    .chip:active {
      transform: scale(0.97);
    }

    .sku-item {
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .sku-item-wrap {
      padding-left: 0;
      padding-top: 24px;
    }

    .sku-index {
      left: 0;
      top: 0;
      width: auto;
      text-align: left;
    }

    .store-grid {
      gap: 10px;
    }

    .ss-city-pills {
      overflow-x: auto;
      flex-wrap: nowrap;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 4px;
    }

    .ss-city-pill {
      flex-shrink: 0;
    }

    .ss-selection-head {
      flex-direction: column;
      align-items: flex-start;
    }

    .ss-selection-item {
      flex-direction: column;
    }

    .ss-selection-item-actions {
      flex-direction: row;
      align-items: center;
    }

    .ss-toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .ss-count { text-align: center; }

    .ss-view-toggle {
      width: 100%;
    }

    .ss-view-btn {
      flex: 1;
      justify-content: center;
    }

    .ss-grid {
      grid-template-columns: 1fr;
    }

    .ss-map {
      height: 320px;
    }

    .ss-map-legend {
      flex-direction: column;
      gap: 8px;
    }

    .checkout-bar .action-bar-inner {
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto;
    }

    .checkout-summary {
      grid-column: 1 / -1;
      justify-content: center;
    }

    .checkout-bar .btn-ghost {
      grid-row: 2;
    }

    .checkout-bar .btn-checkout {
      grid-row: 2;
      flex: 1;
      justify-content: center;
    }

    .store-card {
      padding: 16px;
      border-radius: var(--radius);
      -webkit-tap-highlight-color: transparent;
    }

    .store-card:active:not(.disabled) {
      transform: scale(0.985);
    }

    .store-card h5 {
      font-size: 15px;
    }

    .doc-item {
      flex-wrap: wrap;
      padding: 14px 16px;
      gap: 12px;
      border-radius: 14px;
      -webkit-tap-highlight-color: transparent;
    }

    .doc-item:active {
      transform: scale(0.99);
    }

    .doc-info {
      flex: 1 1 calc(100% - 56px);
    }

    .doc-badge,
    .doc-action {
      margin-left: auto;
    }

    .summary-item {
      padding: 14px 16px;
    }

    .agreement {
      padding: 14px 16px;
      border-radius: 14px;
    }

    .agreement input {
      width: 22px;
      height: 22px;
      margin-top: 0;
    }

    .step-error-banner {
      margin-bottom: 16px;
      font-size: 12px;
      padding: 12px 14px;
    }

    .action-bar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
      background: rgba(8,8,10,0.94);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid var(--border);
      box-shadow: 0 -8px 32px rgba(0,0,0,0.35);
    }

    .action-bar-inner {
      max-width: none;
      gap: 10px;
    }

    .action-bar-inner > div:empty {
      display: none;
    }

    .btn {
      font-size: 15px;
      min-height: 50px;
      padding: 14px 20px;
      border-radius: 14px;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .btn-ghost {
      min-width: 50px;
      padding: 14px 16px;
    }

    .btn-primary {
      flex: 1;
      justify-content: center;
      box-shadow: 0 4px 20px var(--accent-glow);
    }

    .btn-primary:active:not(:disabled) {
      transform: scale(0.98);
    }

    .btn-primary:hover {
      transform: none;
    }

    .confirm-wrap {
      padding: 24px 16px calc(24px + env(safe-area-inset-bottom, 0px));
      min-height: 100dvh;
    }

    .confirm-card {
      padding: 32px 20px;
      border-radius: var(--radius-lg);
    }

    .confirm-card h2 {
      font-size: 24px;
    }

    .confirm-icon {
      width: 64px;
      height: 64px;
      margin-bottom: 20px;
    }

    .timeline {
      padding: 16px;
    }
  }

  @media (max-width: 380px) {
    .mobile-step-pill {
      padding: 5px 10px;
      font-size: 10px;
    }

    .page-title {
      font-size: 22px;
    }

    .doc-action {
      display: none;
    }

    .btn-ghost span.btn-label {
      display: none;
    }
  }

  @media (hover: none) and (pointer: coarse) {
    .chip:hover,
    .store-card:hover:not(.disabled),
    .doc-item:hover,
    .agreement:hover,
    .btn-ghost:hover,
    .btn-primary:hover {
      transform: none;
      background: inherit;
      border-color: inherit;
      box-shadow: inherit;
    }

    .chip.on:hover {
      background: var(--accent-soft);
      border-color: rgba(99,102,241,0.35);
      color: #a5b4fc;
    }

    .store-card.selected:hover {
      border-color: rgba(99,102,241,0.4);
      background: var(--accent-soft);
    }

    .btn-primary:hover {
      background: var(--accent);
    }

    .btn-ghost:hover {
      background: transparent;
      color: var(--text-2);
    }
  }

  /* ── SIMULATED PAYMENT MODAL ── */
  .payment-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: fadeIn 0.25s ease-out;
  }

  .payment-modal {
    width: 100%;
    max-width: 440px;
    background: var(--surface-2);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--radius-lg);
    padding: 32px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.15);
    display: flex;
    flex-direction: column;
    gap: 20px;
    animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .payment-modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .payment-gateway-badge {
    background: var(--accent-soft);
    color: #a5b4fc;
    border: 1px solid rgba(99, 102, 241, 0.3);
    padding: 4px 10px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .payment-modal-head h4 {
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
  }

  .payment-modal-desc {
    font-size: 13px;
    color: var(--text-2);
    line-height: 1.5;
  }

  .payment-modal-desc strong {
    color: var(--amber);
  }

  .payment-details {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .payment-detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }

  .payment-detail-row span {
    color: var(--text-3);
  }

  .payment-detail-row code {
    background: var(--surface-2);
    padding: 2px 6px;
    border-radius: 4px;
    color: var(--text-2);
    font-family: monospace;
  }

  .payment-detail-row strong {
    color: var(--text);
    font-size: 16px;
    font-weight: 700;
  }

  .payment-modal-actions {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 12px;
    margin-top: 8px;
  }

  .payment-modal-actions .btn {
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .payment-modal-actions .btn-secondary {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-2);
  }

  .payment-modal-actions .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.03);
    color: var(--text);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .payment-modal-actions .btn-primary {
    background: var(--accent);
    border: 1px solid var(--accent);
    color: white;
    box-shadow: 0 4px 12px var(--accent-glow);
  }

  .payment-modal-actions .btn-primary:hover {
    background: #818cf8;
    border-color: #818cf8;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px var(--accent-glow);
  }

  /* ── CONFIRM CONTAINER ── */
  .confirm-container {
    min-height: 100vh;
    background: var(--bg);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
    width: 100%;
    z-index: 1;
    padding: 60px 24px;
  }
  
  .confirm-container::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 40% at 50% 20%, rgba(99,102,241,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 50% 50% at 50% 80%, rgba(16,185,129,0.06) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── PREMIUM CONFIRM CARD (CRED STYLE) ── */
  .confirm-card.premium-card {
    max-width: 540px;
    width: 100%;
    background: rgba(20, 20, 25, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(24px);
    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(99, 102, 241, 0.08);
    display: flex;
    flex-direction: column;
    gap: 28px;
    text-align: left;
    padding: 40px;
    border-radius: var(--radius-xl);
  }

  .confirm-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
  }

  .success-glow-circle {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    background: rgba(16, 185, 129, 0.1);
    border: 1.5px solid rgba(16, 185, 129, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--green);
    box-shadow: 0 0 30px rgba(16, 185, 129, 0.25);
    animation: success-pulse 2s infinite ease-in-out;
  }

  @keyframes success-pulse {
    0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.2); }
    50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.45); transform: scale(1.03); }
  }

  .success-status-tag {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 700;
    color: var(--green);
    background: rgba(16, 185, 129, 0.12);
    padding: 4px 10px;
    border-radius: 100px;
  }

  .confirm-header h2 {
    font-size: 26px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.02em;
  }

  .confirm-subtitle {
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.5;
  }

  /* ── RECEIPT DETAILS ── */
  .receipt-section {
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .receipt-amount-box {
    padding: 20px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, transparent 100%);
    border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .receipt-amount-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-3);
    font-weight: 600;
  }

  .receipt-amount-value {
    font-size: 36px;
    font-weight: 800;
    color: var(--text);
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
    font-family: var(--sans);
    letter-spacing: -0.01em;
  }

  .receipt-details {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .receipt-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }

  .receipt-row span {
    color: var(--text-3);
  }

  .receipt-row strong {
    color: var(--text-2);
    font-weight: 500;
  }

  .receipt-row code {
    background: rgba(255, 255, 255, 0.05);
    padding: 2px 6px;
    border-radius: 4px;
    color: #a5b4fc;
    font-family: monospace;
    font-size: 12px;
  }

  /* ── ALLOCATION ── */
  .allocation-breakdown {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .allocation-breakdown h4 {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-3);
    font-weight: 600;
  }

  .allocation-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .allocation-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.015);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: var(--radius);
    font-size: 13px;
  }

  .allocation-store-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .store-indicator-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
  }

  .allocation-store-info strong {
    color: var(--text-2);
    font-weight: 600;
  }

  .allocation-store-info em {
    font-style: normal;
    color: var(--text-3);
  }

  .allocation-quantity {
    font-weight: 700;
    color: var(--text);
  }

  /* ── CRED TIMELINE ── */
  .cred-timeline {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .cred-timeline h4 {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-3);
    font-weight: 600;
  }

  .cred-timeline-steps {
    display: flex;
    flex-direction: column;
    position: relative;
    padding-left: 20px;
  }

  .cred-timeline-steps::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 4px;
    bottom: 6px;
    width: 1px;
    background: rgba(255, 255, 255, 0.06);
  }

  .cred-timeline-step {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding-bottom: 24px;
    position: relative;
  }

  .cred-timeline-step:last-child {
    padding-bottom: 0;
  }

  .cred-step-icon {
    position: absolute;
    left: -20px;
    top: 2px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--surface-3);
    border: 1px solid rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0px;
    transition: all 0.3s;
  }

  .cred-timeline-step.completed .cred-step-icon {
    background: var(--green);
    border-color: var(--green);
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
    font-size: 7px;
    color: var(--bg);
    font-weight: bold;
    width: 11px;
    height: 11px;
    left: -21px;
    top: 1px;
  }

  .cred-timeline-step.active .cred-step-icon {
    background: var(--amber);
    border-color: var(--amber);
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
    width: 9px;
    height: 9px;
    left: -20px;
    top: 2px;
    animation: cred-pulse-amber 1.8s infinite ease-in-out;
  }

  @keyframes cred-pulse-amber {
    0%, 100% { box-shadow: 0 0 4px rgba(245, 158, 11, 0.3); }
    50% { box-shadow: 0 0 10px rgba(245, 158, 11, 0.6); }
  }

  .cred-step-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .cred-step-content h5 {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-2);
  }

  .cred-timeline-step.completed .cred-step-content h5 {
    color: var(--text);
  }

  .cred-step-content p {
    font-size: 11px;
    color: var(--text-3);
    line-height: 1.45;
  }

  /* ── CONFIRM ACTIONS ── */
  .confirm-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 10px;
  }

  .btn-confirm-dashboard {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    background: var(--accent);
    color: white;
    border: none;
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .btn-confirm-dashboard:hover {
    background: #818cf8;
    transform: translateY(-1px);
    box-shadow: 0 12px 30px rgba(99, 102, 241, 0.35);
  }

  .btn-confirm-receipt {
    text-align: center;
    background: transparent;
    border: none;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.15s;
    padding: 4px;
    width: fit-content;
    margin: 0 auto;
  }

  .btn-confirm-receipt:hover {
    color: var(--text-2);
  }

  .shelf-badge-code {
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.35);
    color: #a5b4fc;
    font-family: monospace;
    font-size: 13px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 6px;
    letter-spacing: 0.05em;
    text-shadow: 0 0 8px rgba(99,102,241,0.3);
  }
`;

const DOCUMENTS = [
  { id: "gst", name: "GST certificate", sub: "PDF format", req: true },
  { id: "pan", name: "PAN card", sub: "PDF or JPG", req: true },
  { id: "reg", name: "Company registration", sub: "PDF format", req: false },
  { id: "cat", name: "Product catalog", sub: "Excel (.xlsx)", req: true },
  { id: "fssai", name: "FSSAI license", sub: "For F&B brands", req: false },
];

const DS_CHIPS = ["Blinkit", "Swiggy Instamart", "Zepto", "Other", "None — first time"];
const CHALLENGE_CHIPS = ["High delivery cost", "Slow delivery speed", "Inventory & ops management", "Lack of city expansion", "Low order volume"];

const STEPS = [
  { title: "Brand & requirements", desc: "Company info & product profile" },
  { title: "Store selection", desc: "browse map & book racks" },
  { title: "Verification", desc: "basic documents & final review" },
];

const isValidMobileNumber = (value) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return /^[6-9]\d{9}$/.test(digits);
  if (digits.length === 12 && digits.startsWith("91")) return /^91[6-9]\d{9}$/.test(digits);
  return false;
};

const Icon = {
  Store: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Check: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Send: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Shield: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Instagram: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  Linkedin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Youtube: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  ),
  File: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Upload: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Success: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
};

const BIN = { W: 28, L: 45, H: 25 };
const BIN_VOL = BIN.W * BIN.L * BIN.H;
const MAX_BIN_WEIGHT = 20;
const BIN_EFFICIENCY_PCT = 90;
const BINS_PER_SHELF = 3;
const VIZ_SCALE = 3.2;
const MAX_DOTS = 24;
const VIZ_UNUSED_VISIBLE_PX = 6;

function permute3([a, b, c]) {
  return [
    [a, b, c],
    [a, c, b],
    [b, a, c],
    [b, c, a],
    [c, a, b],
    [c, b, a]
  ];
}

function fitBest(item) {
  const orients = item.upright
    ? [[item.l, item.w, item.h], [item.w, item.l, item.h]]
    : permute3([item.l, item.w, item.h]);
  let best = { count: 0, ol: 0, ow: 0, oh: 0, cL: 0, cW: 0, cH: 0 };
  orients.forEach(([ol, ow, oh]) => {
    const cL = Math.floor(BIN.L / ol);
    const cW = Math.floor(BIN.W / ow);
    const cH = Math.floor(BIN.H / oh);
    const total = cL * cW * cH;
    if (total > best.count) {
      best = { count: total, ol, ow, oh, cL, cW, cH };
    }
  });
  return best;
}

function bufferAdjust(count, effPct) {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return count - 1;
  return Math.max(1, Math.floor(count * (effPct / 100)));
}

function pluralize(n, singular, plural) {
  return n === 1 ? singular : (plural || singular + 's');
}

function computeItem(item) {
  const fit = fitBest(item);
  const effective = bufferAdjust(fit.count, BIN_EFFICIENCY_PCT);
  const weightCount = item.wt > 0 ? Math.floor(MAX_BIN_WEIGHT / item.wt) : Infinity;
  const itemsPerBin = Math.min(effective, weightCount);
  const oversized = fit.count === 0;
  const tooHeavy = weightCount === 0;
  const limiting = effective <= weightCount ? 'packing' : 'weight';
  const binsNeeded = (itemsPerBin >= 1 && !oversized && !tooHeavy) ? Math.ceil(item.qty / itemsPerBin) : 0;
  const shelvesNeeded = binsNeeded > 0 ? Math.ceil(binsNeeded / BINS_PER_SHELF) : 0;
  return { item, fit, effective, weightCount, itemsPerBin, oversized, tooHeavy, limiting, binsNeeded, shelvesNeeded };
}

function buildFloorSvg(r) {
  const rectW = BIN.L * VIZ_SCALE, rectH = BIN.W * VIZ_SCALE;
  const x0 = (180 - rectW) / 2, y0 = (110 - rectH) / 2;
  const cellW = r.fit.ol * VIZ_SCALE, cellH = r.fit.ow * VIZ_SCALE;
  let cells = '';
  for (let i = 0; i < r.fit.cL; i++) {
    for (let j = 0; j < r.fit.cW; j++) {
      cells += `<rect x="${x0 + i * cellW + 1.5}" y="${y0 + j * cellH + 1.5}" width="${cellW - 3}" height="${cellH - 3}" rx="3" fill="rgba(99,102,241,0.34)" stroke="#818cf8" stroke-width="1"/>`;
    }
  }
  const usedW = r.fit.cL * cellW, usedH = r.fit.cW * cellH;
  let hatch = '';
  const hasUnused = (rectW - usedW > VIZ_UNUSED_VISIBLE_PX) || (rectH - usedH > VIZ_UNUSED_VISIBLE_PX);
  if (usedW < rectW - 0.5) hatch += `<rect x="${x0 + usedW}" y="${y0}" width="${rectW - usedW}" height="${rectH}" fill="url(#hF)"/>`;
  if (usedH < rectH - 0.5) hatch += `<rect x="${x0}" y="${y0 + usedH}" width="${rectW}" height="${rectH - usedH}" fill="url(#hF)"/>`;
  const svg = `<defs><pattern id="hF" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="rgba(255,255,255,0.03)"/><line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.12)" stroke-width="1.4"/></pattern></defs>
  <rect x="${x0}" y="${y0}" width="${rectW}" height="${rectH}" rx="6" fill="none" stroke="#3A3B47" stroke-width="1.5"/>${hatch}${cells}`;
  return { svg, hasUnused };
}

function buildStackSvg(r) {
  const rectW = BIN.L * VIZ_SCALE, rectH = BIN.H * VIZ_SCALE;
  const x0 = (180 - rectW) / 2, y0 = (110 - rectH) / 2;
  const layerH = r.fit.oh * VIZ_SCALE;
  let layers = '';
  for (let i = 0; i < r.fit.cH; i++) {
    const ly = y0 + rectH - (i + 1) * layerH;
    const op = Math.min(0.85, 0.30 + i * 0.09);
    layers += `<rect x="${x0 + 2}" y="${ly + 1.5}" width="${rectW - 4}" height="${layerH - 3}" rx="3" fill="rgba(16,185,129,${op})" stroke="#10b981" stroke-width="1"/>`;
  }
  const usedH = r.fit.cH * layerH;
  const hasUnused = rectH - usedH > VIZ_UNUSED_VISIBLE_PX;
  const hatch = (usedH < rectH - 0.5) ? `<rect x="${x0}" y="${y0}" width="${rectW}" height="${rectH - usedH}" fill="url(#hS)"/>` : '';
  const svg = `<defs><pattern id="hS" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="rgba(255,255,255,0.03)"/><line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.12)" stroke-width="1.4"/></pattern></defs>
  <rect x="${x0}" y="${y0}" width="${rectW}" height="${rectH}" rx="6" fill="none" stroke="#3A3B47" stroke-width="1.5"/>${hatch}${layers}`;
  return { svg, hasUnused };
}

function buildIsoBin(r) {
  const OX = 170, OY = 200, S = 3.6;
  const ISO = 0.866;
  function toIso(l, w, h) { return { x: OX + (l - w) * ISO * S, y: OY - (l + w) * 0.5 * S - h * S } }
  function pt(p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1) }

  const p00 = toIso(0, 0, 0), p10 = toIso(BIN.L, 0, 0), p11 = toIso(BIN.L, BIN.W, 0), p01 = toIso(0, BIN.W, 0);
  const p00h = toIso(0, 0, BIN.H), p10h = toIso(BIN.L, 0, BIN.H), p11h = toIso(BIN.L, BIN.W, BIN.H), p01h = toIso(0, BIN.W, BIN.H);

  const fFront = `M${pt(p00)} L${pt(p10)} L${pt(p10h)} L${pt(p00h)} Z`;
  const fRight = `M${pt(p10)} L${pt(p11)} L${pt(p11h)} L${pt(p10h)} Z`;
  const fTop = `M${pt(p00h)} L${pt(p10h)} L${pt(p11h)} L${pt(p01h)} Z`;

  const cL = r.fit.cL, cW = r.fit.cW, cH = r.fit.cH;
  const iL = r.fit.ol, iW = r.fit.ow, iH = r.fit.oh;

  const PALETTES = [
    ['rgba(99,102,241,0.78)', 'rgba(79,70,210,0.92)', 'rgba(139,127,255,0.55)'],
    ['rgba(16,185,129,0.72)', 'rgba(12,150,90,0.88)', 'rgba(80,230,170,0.5)'],
    ['rgba(245,158,11,0.68)', 'rgba(195,125,25,0.84)', 'rgba(255,200,90,0.48)'],
  ];

  let blocks = '';
  let idx = 0;
  for (let hh = 0; hh < cH; hh++) {
    for (let ww = cW - 1; ww >= 0; ww--) {
      for (let ll = 0; ll < cL; ll++) {
        const pal = PALETTES[idx % PALETTES.length];
        const x0 = ll * iL, y0 = ww * iW, z0 = hh * iH;
        const x1 = x0 + iL, y1 = y0 + iW, z1 = z0 + iH;
        const T = (a, b, c) => toIso(a, b, c);
        const ff = [T(x0, y0, z0), T(x1, y0, z0), T(x1, y0, z1), T(x0, y0, z1)];
        const rf = [T(x1, y0, z0), T(x1, y1, z0), T(x1, y1, z1), T(x1, y0, z1)];
        const tf = [T(x0, y0, z1), T(x1, y0, z1), T(x1, y1, z1), T(x0, y1, z1)];
        const poly = (pts, fill, stroke) => `<polygon points="${pts.map(p => pt(p)).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="0.7"/>`;
        const delay = ((ll * 0.04 + ww * 0.07 + hh * 0.12)).toFixed(2);
        blocks += `<g style="animation:fadeUp .4s ease ${delay}s both">
        ${poly(ff, pal[0], pal[2])}${poly(rf, pal[1], pal[2])}${poly(tf, pal[2], 'rgba(255,255,255,0.2)')}
      </g>`;
        idx++;
      }
    }
  }

  return `
  <defs>
    <filter id="bsh"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="rgba(0,0,0,0.65)"/></filter>
    <linearGradient id="gFr" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#1e1b4b" stop-opacity=".92"/><stop offset="100%" stop-color="#111029" stop-opacity=".9"/></linearGradient>
    <linearGradient id="gRt" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#141230" stop-opacity=".94"/><stop offset="100%" stop-color="#0a091d" stop-opacity=".92"/></linearGradient>
    <linearGradient id="gTp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#312e81" stop-opacity=".45"/><stop offset="100%" stop-color="#1e1b4b" stop-opacity=".28"/></linearGradient>
  </defs>
  <g filter="url(#bsh)" opacity=".7">
    <path d="M${pt(p00)} L${pt(p10)} L${pt(p11)} L${pt(p01)} Z" fill="#0d0c18" stroke="#1e1b4b" stroke-width="1"/>
    <path d="M${pt(p00)} L${pt(p01)} L${pt(p01h)} L${pt(p00h)} Z" fill="#0b0a15" stroke="#1e1b4b" stroke-width="1"/>
  </g>
  ${blocks}
  <path d="${fFront}" fill="url(#gFr)" stroke="rgba(99,102,241,.42)" stroke-width="1.3"/>
  <path d="${fRight}" fill="url(#gRt)" stroke="rgba(99,102,241,.36)" stroke-width="1.3"/>
  <path d="${fTop}" fill="url(#gTp)" stroke="rgba(129,140,248,.52)" stroke-width="1.3"/>
  <line x1="${p00.x}" y1="${p00.y}" x2="${p10.x}" y2="${p10.y}" stroke="rgba(129,140,248,.55)" stroke-width="1.2"/>
  <line x1="${p10.x}" y1="${p10.y}" x2="${p11.x}" y2="${p11.y}" stroke="rgba(129,140,248,.48)" stroke-width="1.2"/>
  <line x1="${p00h.x}" y1="${p00h.y}" x2="${p10h.x}" y2="${p10h.y}" stroke="rgba(129,140,248,.7)" stroke-width="1.4"/>
  <line x1="${p10h.x}" y1="${p10h.y}" x2="${p11h.x}" y2="${p11h.y}" stroke="rgba(129,140,248,.65)" stroke-width="1.4"/>
  <line x1="${p11h.x}" y1="${p11h.y}" x2="${p01h.x}" y2="${p01h.y}" stroke="rgba(129,140,248,.52)" stroke-width="1.2"/>
  <line x1="${p00h.x}" y1="${p00h.y}" x2="${p01h.x}" y2="${p01h.y}" stroke="rgba(129,140,248,.52)" stroke-width="1.2"/>
  <line x1="${p10.x}" y1="${p10.y}" x2="${p10h.x}" y2="${p10h.y}" stroke="rgba(129,140,248,.58)" stroke-width="1.3"/>
  <line x1="${p11.x}" y1="${p11.y}" x2="${p11h.x}" y2="${p11h.y}" stroke="rgba(129,140,248,.5)" stroke-width="1.3"/>
  <line x1="${p00.x}" y1="${p00.y}" x2="${p00h.x}" y2="${p00h.y}" stroke="rgba(129,140,248,.38)" stroke-width="1.1"/>
  <text x="${OX}" y="${OY + 24}" text-anchor="middle" font-family="monospace" font-size="10" fill="rgba(129,140,248,.45)" letter-spacing=".05em">${BIN.L} x ${BIN.W} x ${BIN.H} cm</text>`;
}

function buildDotsHtml(r) {
  const total = r.fit.count, packed = r.itemsPerBin;
  if (total <= 0) return '';
  const weightLimited = r.limiting === 'weight';
  let dotCount = total, activeCount = packed;
  if (total > MAX_DOTS) { dotCount = MAX_DOTS; activeCount = Math.max(1, Math.round((packed / total) * MAX_DOTS)) }
  let html = '';
  for (let i = 0; i < dotCount; i++) {
    const cls = i < activeCount ? 'viz-dot' : `viz-dot ${weightLimited ? 'weight-cut' : 'muted'}`;
    html += `<span class="${cls}"></span>`;
  }
  return html;
}

function buildBufferNote(r) {
  const total = r.fit.count, packed = r.itemsPerBin;
  if (r.limiting === 'weight') return `Space allows for <b>${total}</b>, but weight caps it at <b>${packed}</b> per bin (${MAX_BIN_WEIGHT}kg limit).`;
  if (total === packed) return `<b>${packed}</b> fits exactly — no spare room needed.`;
  return `<b>${total}</b> fit by size, but only <b>${packed}</b> are packed in, leaving room to lift the bin comfortably.`;
}

function buildCaption(r) {
  const name = r.item.name, packed = r.itemsPerBin;
  const binWord = pluralize(r.binsNeeded, 'bin'), shelfWord = pluralize(r.shelvesNeeded, 'shelf', 'shelves');
  let lead;
  if (r.limiting === 'weight') { lead = `at ${r.item.wt}kg each, weight is the limit — only ${packed} fit before the bin hits its ${MAX_BIN_WEIGHT}kg cap, even though more would fit by size` }
  else if (r.fit.count === packed) { lead = `one bin holds exactly ${packed}, filling it neatly with no wasted room` }
  else { lead = `a bin can physically fit ${r.fit.count}, but we pack ${packed} per bin so it stays easy to lift and carry` }
  return `<b>${name}</b> — ${lead}. That's <b>${r.binsNeeded} ${binWord}</b> in total, which works out to <b>${r.shelvesNeeded} ${shelfWord}</b> at ${BINS_PER_SHELF} bins per shelf.`;
}

async function safeJsonFromResponse(response) {
  if (!response.ok) {
    let errMsg = `Server returned status ${response.status}`;
    try {
      const errData = await response.json();
      errMsg = errData.error || errData.message || errMsg;
    } catch (_) {
      try {
        const text = await response.text();
        if (response.status === 413 || text.toLowerCase().includes("payload too large") || text.toLowerCase().includes("entity too large")) {
          errMsg = "The application payload or uploaded documents are too large. Please upload smaller files.";
        } else {
          const match = text.match(/<pre>([\s\S]*?)<\/pre>/) || text.match(/<h1>([\s\S]*?)<\/h1>/);
          if (match) {
            errMsg = match[1].trim();
          } else if (text.length > 0) {
            errMsg = text.slice(0, 150).trim();
          }
        }
      } catch (_) { }
    }
    throw new Error(errMsg);
  }
  return response.json();
}

export default function DarkStoreOnboarding() {
  const [step, setStep] = useState(1);
  const [simulationData, setSimulationData] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [allocatedShelves, setAllocatedShelves] = useState([]);

  // Smart Capacity Recommender State
  const [isRecommenderOpen, setIsRecommenderOpen] = useState(false);
  const [recommenderItems, setRecommenderItems] = useState([
    { id: 1, name: "Juice Carton", l: 9, w: 9, h: 24, wt: 0.6, qty: 200, upright: true },
    { id: 2, name: "Rice Bag", l: 30, w: 20, h: 8, wt: 5, qty: 40, upright: false },
    { id: 3, name: "Oil Bottle", l: 8, w: 8, h: 27, wt: 1, qty: 150, upright: true }
  ]);
  const [nextItemId, setNextItemId] = useState(4);
  const [vizItemId, setVizItemId] = useState(1);
  const [isPeekOpen, setIsPeekOpen] = useState(true);

  const [brandName, setBrandName] = useState("");
  const [poc, setPoc] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [youtube, setYoutube] = useState("");

  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [citiesError, setCitiesError] = useState("");
  const [city, setCity] = useState("");
  const [browseCity, setBrowseCity] = useState("");
  const [stores, setStores] = useState([]);
  const [storesLoading, setStoresLoading] = useState(false);
  const [storesError, setStoresError] = useState("");
  const [allStores, setAllStores] = useState([]);
  const [orders, setOrders] = useState("");
  const [weight, setWeight] = useState("");
  const [skus, setSkus] = useState([{ name: "", mrp: "" }, { name: "", mrp: "" }, { name: "", mrp: "" }]);
  const [dsChips, setDsChips] = useState([]);
  const [chalChips, setChalChips] = useState([]);

  const [cart, setCart] = useState([]);
  const [highlightedStoreId, setHighlightedStoreId] = useState(null);

  const [uploads, setUploads] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [showStepError, setShowStepError] = useState(false);

  const totalSteps = 3;
  const pct = step > totalSteps ? 100 : Math.round((step / totalSteps) * 100);

  const totalCartRacks = cart.reduce((sum, item) => sum + item.racks, 0);
  const cartCityCount = new Set(cart.map((c) => c.city)).size;

  useEffect(() => {
    let cancelled = false;
    setCitiesLoading(true);
    setCitiesError("");
    fetch("/api/cities")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load cities");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setCities(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setCities([]);
          setCitiesError(err.message || "Could not load cities");
        }
      })
      .finally(() => {
        if (!cancelled) setCitiesLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (cities.length === 0) return;
    let cancelled = false;
    Promise.all(
      cities.map((c) =>
        fetch(`/api/stores?city=${encodeURIComponent(c.name)}`)
          .then((res) => (res.ok ? res.json() : []))
          .then((data) => data.map((store) => ({ ...store, cityName: c.name })))
          .catch(() => [])
      )
    ).then((results) => {
      if (!cancelled) {
        setAllStores(results.flat());
      }
    });
    return () => {
      cancelled = true;
    };
  }, [cities]);

  useEffect(() => {
    if (step === 2 && city && !browseCity) {
      setBrowseCity(city);
    }
  }, [step, city, browseCity]);

  useEffect(() => {
    if (cart.length === 0) {
      setDisclaimerAgreed(false);
    }
  }, [cart.length]);

  useEffect(() => {
    if (!browseCity) {
      setStores([]);
      setStoresError("");
      return undefined;
    }

    let cancelled = false;
    setStoresLoading(true);
    setStoresError("");
    setHighlightedStoreId(null);

    fetch(`/api/stores?city=${encodeURIComponent(browseCity)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load stores for selected city");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setStores(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setStores([]);
        setStoresError(err.message);
      })
      .finally(() => {
        if (!cancelled) setStoresLoading(false);
      });

    return () => { cancelled = true; };
  }, [browseCity, refreshKey]);

  useEffect(() => {
    if (step === 4 && applicationId) {
      fetch(`/api/applications/${applicationId}/shelves`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load shelf codes");
          return res.json();
        })
        .then((data) => {
          setAllocatedShelves(data);
        })
        .catch((err) => {
          console.error("Error loading assigned shelf placements:", err);
        });
    }
  }, [step, applicationId]);

  const handleCityChange = (nextCity) => {
    setCity(nextCity);
    setCart([]);
    clearError("city");
    clearError("cart");
  };

  const toggleChip = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const toggleDs = (val) => {
    if (val === "None — first time") {
      setDsChips(dsChips.includes(val) ? [] : [val]);
    } else {
      const next = dsChips.filter(v => v !== "None — first time");
      setDsChips(next.includes(val) ? next.filter(v => v !== val) : [...next, val]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleFileChange = (e, docId) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      alert("To ensure successful deployment, each file must be under 1.5 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploads((p) => ({
        ...p,
        [docId]: {
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result,
        },
      }));
      clearError(`doc_${docId}`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (docId) => {
    setUploads((p) => {
      const next = { ...p };
      delete next[docId];
      return next;
    });
  };

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.storeId === item.storeId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = item;
        return next;
      }
      return [...prev, item];
    });
    clearError("cart");
  };

  const handleRemoveFromCart = (storeId) => {
    setCart((prev) => prev.filter((c) => c.storeId !== storeId));
  };

  const clearError = (key) => {
    setErrors(prev => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateStep = (n) => {
    const next = {};

    if (n === 1) {
      if (!brandName.trim()) next.brandName = "Brand name is required";
      if (!poc.trim()) next.poc = "Point of contact is required";
      if (!phone.trim()) next.phone = "Mobile number is required";
      else if (!isValidMobileNumber(phone)) next.phone = "Enter a valid 10-digit mobile number";
      if (!email.trim()) next.email = "Email address is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email address";
      if (!city) next.city = "Please select a city";
      if (!orders) next.orders = "Please select expected daily orders";
      if (!weight) next.weight = "Please select average product weight";
    }

    if (n === 2) {
      if (cart.length === 0) next.cart = "Add at least one store with racks to checkout";
    }

    if (n === 3) {
      DOCUMENTS.filter(d => d.req).forEach(d => {
        if (!uploads[d.id]) next[`doc_${d.id}`] = "Required";
      });
      if (!agreed) next.agreed = "You must agree to continue";
    }

    return next;
  };

  const isStepValid = (n) => Object.keys(validateStep(n)).length === 0;

  const handleNext = () => {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setShowStepError(true);
      return;
    }
    setErrors({});
    setShowStepError(false);
    if (step === 1 && city) setBrowseCity(city);
    setStep(step + 1);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleVerifyMock = async (success) => {
    if (!success) {
      alert("Payment simulation failed.");
      setSimulationData(null);
      return;
    }

    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: simulationData.orderId,
          razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
          razorpay_signature: "mock_sig_12345",
          applicationId: simulationData.applicationId,
          isMock: true,
        }),
      });
      const result = await safeJsonFromResponse(response);
      if (result.success) {
        setSimulationData(null);
        setApplicationId(simulationData.applicationId);
        setRefreshKey((prev) => prev + 1);
        setStep(3);
      } else {
        alert("Verification failed: " + result.error);
      }
    } catch (err) {
      alert("Verification failed: " + err.message);
    }
  };

  const handleCheckoutPayment = async () => {
    const step1Errors = validateStep(1);
    if (Object.keys(step1Errors).length > 0) {
      setErrors(step1Errors);
      setShowStepError(true);
      setStep(1);
      return;
    }

    if (cart.length === 0) {
      alert("Please add at least one store/shelf to checkout.");
      return;
    }

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          poc,
          phone,
          email,
          website,
          instagram,
          linkedin,
          youtube,
          city,
          orders,
          weight,
          skus,
          dsChips,
          chalChips,
          cart,
          uploads,
        }),
      });

      const orderDetails = await safeJsonFromResponse(response);

      if (orderDetails.isMock) {
        setSimulationData(orderDetails);
      } else {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          alert("Failed to load Razorpay SDK. Check your internet connection.");
          return;
        }

        const options = {
          key: orderDetails.keyId,
          amount: orderDetails.amount,
          currency: "INR",
          name: "Blitz MiniPods",
          description: `Shelf Booking for ${brandName}`,
          order_id: orderDetails.orderId,
          handler: async function (res) {
            try {
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: res.razorpay_order_id,
                  razorpay_payment_id: res.razorpay_payment_id,
                  razorpay_signature: res.razorpay_signature,
                  applicationId: orderDetails.applicationId,
                  isMock: false,
                }),
              });

              const verification = await safeJsonFromResponse(verifyRes);
              if (verification.success) {
                setApplicationId(orderDetails.applicationId);
                setRefreshKey((prev) => prev + 1);
                setStep(3);
              } else {
                alert("Payment verification failed: " + verification.error);
              }
            } catch (err) {
              alert("Verification connection failed: " + err.message);
            }
          },
          prefill: {
            name: poc,
            email: email,
            contact: phone,
            method: "upi",
          },
          theme: {
            color: "#6366f1",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }

      setErrors({});
      setShowStepError(false);
    } catch (err) {
      alert("Checkout failed: " + err.message);
    }
  };

  const handleSubmit = async () => {
    const stepErrors = validateStep(3);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setShowStepError(true);
      return;
    }

    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          poc,
          phone,
          email,
          website,
          instagram,
          linkedin,
          youtube,
          city,
          orders,
          weight,
          skus,
          dsChips,
          chalChips,
          cart,
          uploads,
        }),
      });

      const result = await safeJsonFromResponse(response);
      if (result.success) {
        setErrors({});
        setShowStepError(false);
        setStep(4);
      } else {
        alert("Submission failed: " + result.error);
      }
    } catch (err) {
      alert("Application submission failed: " + err.message);
    }
  };

  const renderSimulationModal = () => (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal-head">
          <div className="payment-gateway-badge">Blitz Pay</div>
          <h4>Simulated Checkout</h4>
        </div>
        <p className="payment-modal-desc">
          No Razorpay credentials configured. Running in <strong>Sandbox Mode</strong>.
        </p>
        <div className="payment-details">
          <div className="payment-detail-row">
            <span>Order ID</span>
            <code>{simulationData.orderId}</code>
          </div>
          <div className="payment-detail-row">
            <span>Amount</span>
            <strong>₹{(simulationData.amount / 100).toLocaleString("en-IN")}</strong>
          </div>
        </div>
        <div className="payment-modal-actions">
          <button className="btn btn-secondary" onClick={() => handleVerifyMock(false)}>
            Simulate Failure
          </button>
          <button className="btn btn-primary" onClick={() => handleVerifyMock(true)}>
            Simulate Success
          </button>
        </div>
      </div>
    </div>
  );

  const selectedStores = cart.length
    ? cart.map((c) => `${c.storeName}, ${c.city} (${c.racks} rack${c.racks !== 1 ? "s" : ""})`).join(" · ")
    : "—";

  const selectedCities = cart.length
    ? [...new Set(cart.map((c) => c.city))].join(", ")
    : city || "—";

  const pageMeta = [
    { eyebrow: "Step 1", title: "Tell us about your brand", desc: "Share your company details and operations profile so we can recommend the right stores, racks, and fulfillment setup." },
    { eyebrow: "Step 2", title: "Choose your stores", desc: "Browse cities, pick dark stores, and add racks to your booking." },
    { eyebrow: "Step 3", title: "Verify and submit", desc: "Upload required documents and review your application before sending it to our team." },
  ][step - 1];

  const renderMobileHeader = () => (
    <header className="mobile-header">
      <div className="mobile-header-top">
        <div className="mobile-brand">
          <img src="/Logo.png" />
          <div className="mobile-brand-text">
            <strong>Blitz MiniPods</strong>
            <span>Client onboarding</span>
          </div>
        </div>
        <span className="mobile-step-badge">Step {step} of {totalSteps}</span>
      </div>
      <div className="mobile-progress-row">
        <div className="mobile-progress-track">
          <div className="mobile-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="mobile-progress-pct">{pct}%</span>
      </div>
      <div className="mobile-step-pills">
        {STEPS.map((s, i) => {
          const n = i + 1;
          const isActive = step === n;
          const isDone = step > n;
          const canGoBack = isDone && !applicationId;
          return (
            <div
              key={n}
              className={`mobile-step-pill${isActive ? " active" : ""}${isDone ? " done" : ""}${canGoBack ? " clickable" : ""}`}
              onClick={() => canGoBack && setStep(n)}
              role={canGoBack ? "button" : undefined}
            >
              <span className="mobile-step-pill-num">{isDone ? <Icon.Check /> : n}</span>
              {s.title}
            </div>
          );
        })}
      </div>
    </header>
  );

  const renderSidebar = () => (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <img src="/Logo.png" alt="Company Logo" style={{ width: 40, height: 40, borderRadius: 8 }} />
        </div>

        <div>
          <div className="brand-name">Blitz MiniPods</div>
          <div className="brand-tag">Client onboarding</div>
        </div>
      </div>

      <nav className="nav-steps">
        {STEPS.map((s, i) => {
          const n = i + 1;
          const isActive = step === n;
          const isDone = step > n;
          const isFuture = step < n;
          const canGoBack = isDone && !applicationId;
          return (
            <div
              key={n}
              className={`nav-step${isActive ? " active" : ""}${isDone ? " done" : ""}${isFuture ? " future" : ""}${canGoBack ? " clickable" : ""}`}
              onClick={() => canGoBack && setStep(n)}
            >
              <div className="nav-num">{isDone ? <Icon.Check /> : n}</div>
              <div className="nav-text">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </div>
          );
        })}
      </nav>

      {step === 2 && (
        <div className="sidebar-recommender">
          <div className="sidebar-recommender-title">
            <span>✨ ⚡ Smart Recommender</span>
          </div>
          <p className="sidebar-recommender-desc">
            Not sure how many shelves you need? Use our AI simulator to calculate your exact requirements.
          </p>
          <button type="button" className="btn-sidebar-recommender" onClick={() => setIsRecommenderOpen(true)}>
            Launch Smart Recommender ↗
          </button>
        </div>
      )}

      <div className="sidebar-foot">
        <div className="progress-label">
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="trust-note">
          <Icon.Shield />
          <span>Your data is encrypted and only used for partner verification. Typical review time is 2 business days.</span>
        </div>
      </div>
    </aside>
  );

  const renderPage1 = () => (
    <>
      <section className="section">
        <div className="section-label">Company details</div>
        <div className="panel">
          <div className="field-grid">
            <div className={`field${errors.brandName ? " has-error" : ""}`}>
              <span>Brand name <em>*</em></span>
              <input type="text" placeholder="The Whole Truth" value={brandName} onChange={e => { setBrandName(e.target.value); clearError("brandName"); }} />
              {errors.brandName && <p className="field-error">{errors.brandName}</p>}
            </div>
            <div className={`field${errors.poc ? " has-error" : ""}`}>
              <span>Point of contact <em>*</em></span>
              <input type="text" placeholder="Full name" value={poc} onChange={e => { setPoc(e.target.value); clearError("poc"); }} />
              {errors.poc && <p className="field-error">{errors.poc}</p>}
            </div>
            <div className={`field${errors.phone ? " has-error" : ""}`}>
              <span>Mobile number <em>*</em></span>
              <input type="tel" inputMode="numeric" placeholder="9876543210" value={phone} onChange={e => { setPhone(e.target.value); clearError("phone"); }} />
              {errors.phone ? <p className="field-error">{errors.phone}</p> : <p className="field-hint">10-digit Indian mobile number</p>}
            </div>
            <div className={`field${errors.email ? " has-error" : ""}`}>
              <span>Email address <em>*</em></span>
              <input type="email" placeholder="you@brand.com" value={email} onChange={e => { setEmail(e.target.value); clearError("email"); }} />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>
            <div className={`field${errors.city ? " has-error" : ""}`}>
              <span>Interested city <em>*</em></span>
              <select value={city} onChange={e => handleCityChange(e.target.value)} disabled={citiesLoading || cities.length === 0}>
                <option value="">{citiesLoading ? "Loading cities…" : "Select city"}</option>
                {cities.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {citiesError && <p className="field-error">{citiesError}</p>}
              {errors.city && <p className="field-error">{errors.city}</p>}
            </div>
            <div className={`field${errors.orders ? " has-error" : ""}`}>
              <span>Expected daily orders <em>*</em></span>
              <select value={orders} onChange={e => { setOrders(e.target.value); clearError("orders"); }}>
                <option value="">Select range</option>
                {["1 – 50 orders / day", "51 – 150 orders / day", "151 – 500 orders / day", "500+ orders / day"].map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              {errors.orders && <p className="field-error">{errors.orders}</p>}
            </div>
            <div className={`field${errors.weight ? " has-error" : ""}`} style={{ gridColumn: "1 / -1" }}>
              <span>Average product weight <em>*</em></span>
              <select value={weight} onChange={e => { setWeight(e.target.value); clearError("weight"); }}>
                <option value="">Select range</option>
                {["Under 0.5 kg", "0.5 – 1 kg", "1 – 3 kg", "3 – 5 kg", "Above 5 kg"].map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
              {errors.weight ? <p className="field-error">{errors.weight}</p> : <p className="field-hint">Helps determine rack type and slot sizing</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-label">Current dark store partners</div>
        <div className="chips">
          {DS_CHIPS.map(c => (
            <div key={c} className={`chip${dsChips.includes(c) ? " on" : ""}`} onClick={() => toggleDs(c)}>{c}</div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-label">Biggest challenges <span className="optional">Select all that apply</span></div>
        <div className="chips">
          {CHALLENGE_CHIPS.map(c => (
            <div key={c} className={`chip${chalChips.includes(c) ? " on" : ""}`} onClick={() => toggleChip(chalChips, setChalChips, c)}>{c}</div>
          ))}
        </div>
      </section>

    </>
  );

  const renderPage2 = () => (
    <section className="section">
      {errors.cart && <p className="field-error" style={{ marginBottom: 12 }}>{errors.cart}</p>}



      <StoreSelection
        cities={cities}
        browseCity={browseCity}
        onBrowseCityChange={setBrowseCity}
        stores={stores}
        storesLoading={storesLoading}
        storesError={storesError}
        cart={cart}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        highlightedStoreId={highlightedStoreId}
        onHighlightStore={setHighlightedStoreId}
        disclaimerAgreed={disclaimerAgreed}
        onDisclaimerAgreedChange={setDisclaimerAgreed}
      />
    </section>
  );

  const renderPage3 = () => (
    <>
      <section className="section">
        <div className="section-label">Required documents</div>
        <div className="doc-list">
          {DOCUMENTS.map(doc => (
            <DocumentUpload
              key={doc.id}
              doc={doc}
              uploads={uploads}
              errors={errors}
              onUploadSuccess={(docId, fileInfo) => {
                setUploads(prev => ({ ...prev, [docId]: fileInfo }));
                clearError(`doc_${docId}`);
              }}
              onUploadRemove={handleRemoveFile}
              clearError={clearError}
              formatFileSize={formatFileSize}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-label">Application summary</div>
        <div className="summary">
          <div className="summary-item"><span>Brand</span><strong>{brandName || "—"}</strong></div>
          <div className="summary-item"><span>Cities</span><strong>{selectedCities}</strong></div>
          <div className="summary-item"><span>Total racks</span><strong>{totalCartRacks || "—"}</strong></div>
          <div className="summary-item" style={{ gridColumn: "1 / -1" }}>
            <span>Stores & racks</span>
            <strong>{selectedStores}</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className={`agreement${errors.agreed ? " has-error" : ""}`} onClick={() => { setAgreed(!agreed); clearError("agreed"); }}>
          <input type="checkbox" id="tc" checked={agreed} onChange={e => { setAgreed(e.target.checked); clearError("agreed"); }} onClick={e => e.stopPropagation()} />
          <label htmlFor="tc">
            I confirm all information is accurate and agree to the{" "}
            <a href="#" onClick={e => e.stopPropagation()}>Partner Terms</a> and{" "}
            <a href="#" onClick={e => e.stopPropagation()}>SLA Agreement</a>.
          </label>
        </div>
      </section>
    </>
  );

  const renderConfirm = () => {
    const totalRacks = cart.reduce((sum, item) => sum + (item.racks || 0), 0);
    const amountPaid = totalRacks * 1600;

    return (
      <div className="confirm-wrap">
        <div className="confirm-card premium-card">
          <div className="confirm-header">
            <div className="success-glow-circle">
              <Icon.Success />
            </div>
            <span className="success-status-tag">Payment Verified</span>
            <h2>Booking Confirmed</h2>
            <p className="confirm-subtitle">Your darkstore slots have been secured successfully.</p>
          </div>

          {/* Receipt Section */}
          <div className="receipt-section">
            <div className="receipt-amount-box">
              <span className="receipt-amount-label">AMOUNT PAID</span>
              <span className="receipt-amount-value">₹{amountPaid.toLocaleString("en-IN")}</span>
            </div>

            <div className="receipt-details">
              <div className="receipt-row">
                <span>Account</span>
                <strong>{brandName || "Company Name"}</strong>
              </div>
              <div className="receipt-row">
                <span>Contact Person</span>
                <strong>{poc}</strong>
              </div>
              <div className="receipt-row">
                <span>Phone / Email</span>
                <strong>{phone} · {email}</strong>
              </div>
              <div className="receipt-row">
                <span>Payment Reference</span>
                <code>TXN-{Math.random().toString(36).substring(2, 10).toUpperCase()}</code>
              </div>
            </div>
          </div>

          {/* Cart / Allocated Shelves Breakdown */}
          {allocatedShelves.length > 0 ? (
            <div className="allocation-breakdown">
              <h4>Assigned Shelf Placements</h4>
              <div className="allocation-list" style={{ maxHeight: "200px", overflowY: "auto", paddingRight: "4px" }}>
                {allocatedShelves.map((shelf, idx) => (
                  <div key={idx} className="allocation-item">
                    <div className="allocation-store-info">
                      <span className="store-indicator-dot" />
                      <strong>{shelf.store_name}</strong>
                      <em>({shelf.city_name})</em>
                    </div>
                    <span className="shelf-badge-code">
                      {shelf.shelf_code}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : cart.length > 0 ? (
            <div className="allocation-breakdown">
              <h4>Allocated Shelves</h4>
              <div className="allocation-list">
                {cart.map((item) => (
                  <div key={item.storeId} className="allocation-item">
                    <div className="allocation-store-info">
                      <span className="store-indicator-dot" />
                      <strong>{item.storeName}</strong>
                      <em>({item.city})</em>
                    </div>
                    <span className="allocation-quantity">
                      {item.racks} Shelf{item.racks !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* CRED-style Interactive Timeline */}
          <div className="cred-timeline">
            <h4>Onboarding Journey</h4>
            <div className="cred-timeline-steps">
              <div className="cred-timeline-step completed">
                <div className="cred-step-icon">✓</div>
                <div className="cred-step-content">
                  <h5>Payment Received</h5>
                  <p>₹{amountPaid.toLocaleString("en-IN")} processed successfully via UPI</p>
                </div>
              </div>
              <div className="cred-timeline-step active">
                <div className="cred-step-icon">●</div>
                <div className="cred-step-content">
                  <h5>Document Verification</h5>
                  <p>Our audit team is reviewing your uploaded PAN, GST, and Catalog sheets</p>
                </div>
              </div>
              <div className="cred-timeline-step upcoming">
                <div className="cred-step-icon">○</div>
                <div className="cred-step-content">
                  <h5>Digital Agreement signing</h5>
                  <p>A secure DocuSign link will be dispatched to {email}</p>
                </div>
              </div>
              <div className="cred-timeline-step upcoming">
                <div className="cred-step-icon">○</div>
                <div className="cred-step-content">
                  <h5>Inventory Drop Scheduled</h5>
                  <p>Setup coordinate details and delivery scheduling at the booked locations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Button actions */}
          <div className="confirm-actions">
            <button className="btn btn-primary btn-confirm-dashboard" onClick={() => window.location.reload()}>
              Return to Dashboard
            </button>
            <button className="btn-confirm-receipt" onClick={() => window.print()}>
              Download Receipt PDF
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderRecommenderModal = () => {
    // Recalculate everything
    let totalBins = 0;
    let usedVolume = 0;
    let usedWeight = 0;

    const results = recommenderItems.map(it => computeItem(it));
    results.forEach(r => {
      if (!r.oversized && !r.tooHeavy) {
        totalBins += r.binsNeeded;
        usedVolume += r.item.l * r.item.w * r.item.h * r.item.qty;
        usedWeight += r.item.wt * r.item.qty;
      }
    });

    const totalShelves = Math.ceil(totalBins / BINS_PER_SHELF);
    const volCapacity = totalBins * BIN_VOL;
    const wtCapacity = totalBins * MAX_BIN_WEIGHT;
    const volPct = volCapacity > 0 ? Math.min(100, (usedVolume / volCapacity) * 100) : 0;
    const wtPct = wtCapacity > 0 ? Math.min(100, (usedWeight / wtCapacity) * 100) : 0;

    // Selected visual item
    const validResults = results.filter(r => !r.oversized && !r.tooHeavy);
    let activeResult = validResults.find(r => r.item.id === vizItemId);
    if (validResults.length > 0 && !activeResult) {
      activeResult = validResults[0];
    }

    const handleItemFieldChange = (id, field, value) => {
      setRecommenderItems(prev => prev.map(item => {
        if (item.id !== id) return item;
        const nextItem = { ...item };
        if (field === 'name') {
          nextItem.name = value;
        } else if (field === 'upright') {
          nextItem.upright = value;
        } else {
          nextItem[field] = parseFloat(value) || 0;
        }
        return nextItem;
      }));
    };

    const handleAddItem = () => {
      setRecommenderItems(prev => [
        ...prev,
        { id: nextItemId, name: `Item ${nextItemId}`, l: 10, w: 10, h: 10, wt: 1, qty: 10, upright: false }
      ]);
      setNextItemId(prev => prev + 1);
    };

    const handleDeleteItem = (id) => {
      setRecommenderItems(prev => prev.filter(item => item.id !== id));
    };

    const highlightedStore = allStores.find(s => s.id === highlightedStoreId) || stores.find(s => s.id === highlightedStoreId);

    const handleApplyRecommendation = () => {
      if (!highlightedStore) {
        alert("Please select a store first.");
        return;
      }
      const appliedRacks = Math.min(totalShelves, highlightedStore.shelvesAvailable || 1);
      const targetCity = highlightedStore.cityName || browseCity;
      handleAddToCart({
        storeId: highlightedStore.id,
        storeName: highlightedStore.name,
        area: highlightedStore.area,
        address: highlightedStore.address,
        city: targetCity,
        racks: appliedRacks,
        shelvesAvailable: highlightedStore.shelvesAvailable,
        avail: highlightedStore.avail,
        availability: highlightedStore.availability,
      });
      if (targetCity && targetCity !== browseCity) {
        setBrowseCity(targetCity);
      }
      setIsRecommenderOpen(false);
      alert(`Applied ${appliedRacks} shelf/shelves to ${highlightedStore.name}!`);
    };

    return (
      <div className="recommender-modal-overlay" onClick={() => setIsRecommenderOpen(false)}>
        <div className="recommender-modal" onClick={e => e.stopPropagation()}>
          <div className="recommender-modal-head">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent)" }}>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              Smart Shelf Recommender
            </h3>
            <button className="btn-close-modal" onClick={() => setIsRecommenderOpen(false)}>✕</button>
          </div>

          <div className="recommender-modal-body">
            {/* LHS: Item inputs list */}
            <div>
              <div className="spec-strip">
                <div className="spec-chip"><span className="lbl">Bin size</span><span className="val">28 × 45 × 25 cm</span></div>
                <div className="spec-chip"><span className="lbl">Bin volume</span><span className="val">31.5 L</span></div>
                <div className="spec-chip"><span className="lbl">Bins / shelf</span><span className="val">3</span></div>
                <div className="spec-chip"><span className="lbl">Max kg / bin</span><span className="val">20 kg</span></div>
                <div className="spec-chip"><span className="lbl">Bin Usable %</span><span className="val">90%</span></div>
              </div>

              <div style={{ marginBottom: 12, fontSize: 13, color: "var(--text-2)", fontWeight: 600 }}>
                Inventory mix & dimensions
              </div>

              <div className="recommender-items-list">
                {recommenderItems.map(it => {
                  const r = computeItem(it);
                  return (
                    <div className="item-block" key={it.id}>
                      <div className="item-row">
                        <input
                          type="text"
                          value={it.name}
                          placeholder="Item Name"
                          onChange={e => handleItemFieldChange(it.id, 'name', e.target.value)}
                        />
                        <input
                          type="number"
                          value={it.l}
                          placeholder="L cm"
                          min="1"
                          step="0.5"
                          title="Length in cm"
                          onChange={e => handleItemFieldChange(it.id, 'l', e.target.value)}
                        />
                        <input
                          type="number"
                          value={it.w}
                          placeholder="W cm"
                          min="1"
                          step="0.5"
                          title="Width in cm"
                          onChange={e => handleItemFieldChange(it.id, 'w', e.target.value)}
                        />
                        <input
                          type="number"
                          value={it.h}
                          placeholder="H cm"
                          min="1"
                          step="0.5"
                          title="Height in cm"
                          onChange={e => handleItemFieldChange(it.id, 'h', e.target.value)}
                        />
                        <input
                          type="number"
                          value={it.wt}
                          placeholder="Wt kg"
                          min="0.01"
                          step="0.1"
                          title="Weight in kg"
                          onChange={e => handleItemFieldChange(it.id, 'wt', e.target.value)}
                        />
                        <input
                          type="number"
                          value={it.qty}
                          placeholder="Qty"
                          min="1"
                          step="1"
                          title="Quantity of items"
                          onChange={e => handleItemFieldChange(it.id, 'qty', e.target.value)}
                        />
                        <div className="upright-wrap">
                          <input
                            type="checkbox"
                            checked={it.upright}
                            id={`up-${it.id}`}
                            onChange={e => handleItemFieldChange(it.id, 'upright', e.target.checked)}
                          />
                          <label htmlFor={`up-${it.id}`}>fixed</label>
                        </div>
                        <button className="del-btn" onClick={() => handleDeleteItem(it.id)}>✕</button>
                      </div>

                      {r.oversized || r.tooHeavy ? (
                        <div className="result-line warn">
                          <span className="oversized-tag">Won't fit</span>
                          {r.oversized ? "doesn't fit in any allowed orientation" : `single unit (${r.item.wt}kg) exceeds the ${MAX_BIN_WEIGHT}kg bin limit`}.
                        </div>
                      ) : (
                        <div className="result-line ok">
                          <span><b>{r.itemsPerBin}</b> / bin</span>
                          <span>orientation {r.fit.ol}x{r.fit.ow}x{r.fit.oh}cm</span>
                          <span><b>{r.binsNeeded}</b> bin{r.binsNeeded !== 1 ? 's' : ''} &rarr; <b>{r.shelvesNeeded}</b> {pluralize(r.shelvesNeeded, 'shelf', 'shelves')}</span>
                          <span>limit: {r.limiting}</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                <button className="add-row-btn" onClick={handleAddItem}>+ Add item</button>
              </div>
            </div>

            {/* RHS: Summary & capacity visualizer */}
            <div>
              <div className="big-stat">
                <div className="num">{totalShelves}</div>
                <div className="lbl">Shelves to book</div>
                <div className="sub">{totalBins} bin{totalBins !== 1 ? 's' : ''} required</div>
              </div>

              <div className="panel" style={{ background: "var(--surface)" }}>
                <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: "var(--text)" }}>Capacity used</p>
                <div className="util-row">
                  <div className="top"><span>Volume</span><b>{volPct.toFixed(0)}%</b></div>
                  <div className="bar"><div className="bar-fill" style={{ width: `${volPct}%`, background: "var(--accent)" }}></div></div>
                </div>
                <div className="util-row">
                  <div className="top"><span>Weight</span><b>{wtPct.toFixed(0)}%</b></div>
                  <div className="bar"><div className="bar-fill" style={{ width: `${wtPct}%`, background: "var(--green)" }}></div></div>
                </div>

                {/* PEEK Accordion trigger */}
                <button
                  className="bin-peek-trigger"
                  onClick={() => setIsPeekOpen(!isPeekOpen)}
                  aria-expanded={isPeekOpen}
                >
                  <div className="bin-peek-inner">
                    <div className="bin-peek-icon">
                      <div className="mini-bin-wrap">
                        <div className="mini-face mini-top"></div>
                        <div className="mini-face mini-side"></div>
                        <div className="mini-face mini-front">
                          <div className="mini-dots-grid">
                            <span className="mini-d"></span><span className="mini-d"></span><span className="mini-d"></span>
                            <span className="mini-d"></span><span className="mini-d"></span><span className="mini-d"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bin-peek-text">
                      <div className="bin-peek-label">Peek inside a bin <span className="bin-peek-badge">Visual</span></div>
                      <div className="bin-peek-sub">See exactly how one bin fills up</div>
                    </div>
                    <div className="bin-peek-arrow">{isPeekOpen ? "▲" : "▼"}</div>
                  </div>
                </button>

                {/* Visualizer output */}
                <div className={`bin-preview-shell${isPeekOpen ? " open" : ""}`}>
                  <div className="bin-preview-panel">
                    <div className="preview-topbar">
                      <div className="preview-topbar-left">
                        <div className="ptb-dot"></div>
                        <span className="ptb-title">Bin packing preview</span>
                      </div>
                      {validResults.length > 0 && (
                        <select
                          className="viz-select"
                          value={vizItemId}
                          onChange={e => setVizItemId(parseInt(e.target.value))}
                        >
                          {validResults.map(vr => (
                            <option key={vr.item.id} value={vr.item.id}>{vr.item.name}</option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="preview-body">
                      {!activeResult ? (
                        <div className="preview-empty">
                          <div className="preview-empty-icon">📦</div>
                          <span>Add at least one item that fits a standard bin to preview its layout.</span>
                        </div>
                      ) : (
                        <>
                          <div className="iso-stage">
                            <svg viewBox="0 0 340 240" xmlns="http://www.w3.org/2000/svg" dangerouslySetInnerHTML={{ __html: buildIsoBin(activeResult) }} />
                          </div>

                          <div className="flat-views">
                            <div className="viz-panel">
                              <div className="viz-panel-head">
                                <span className="t">Top view</span>
                                <span className="d">45 x 28 cm</span>
                              </div>
                              <svg viewBox="0 0 180 110" dangerouslySetInnerHTML={{ __html: buildFloorSvg(activeResult).svg }} />
                              <div className="viz-panel-foot">
                                {activeResult.fit.cL} x {activeResult.fit.cW} = <b>{activeResult.fit.cL * activeResult.fit.cW}</b> per layer
                              </div>
                            </div>

                            <div className="viz-panel">
                              <div className="viz-panel-head">
                                <span className="t">Side view</span>
                                <span className="d">25 cm tall</span>
                              </div>
                              <svg viewBox="0 0 180 110" dangerouslySetInnerHTML={{ __html: buildStackSvg(activeResult).svg }} />
                              <div className="viz-panel-foot">
                                <b>{activeResult.fit.cH}</b> {pluralize(activeResult.fit.cH, 'layer')} high
                              </div>
                            </div>
                          </div>

                          {(buildFloorSvg(activeResult).hasUnused || buildStackSvg(activeResult).hasUnused) && (
                            <div className="viz-legend">
                              <span><i className="swatch sw-fill"></i>Packed item</span>
                              <span><i className="swatch sw-empty"></i>Empty space</span>
                            </div>
                          )}

                          <div className="viz-buffer">
                            <div className="viz-dots" dangerouslySetInnerHTML={{ __html: buildDotsHtml(activeResult) }} />
                            <div className="viz-buffer-note" dangerouslySetInnerHTML={{ __html: `<b>Buffer Check:</b> ` + buildBufferNote(activeResult) }} />
                          </div>

                          <div className="viz-flow">
                            <div className="viz-flow-stat">
                              <div className="n">{activeResult.itemsPerBin}</div>
                              <div className="l">per bin</div>
                            </div>
                            <div className="viz-flow-arrow">→</div>
                            <div className="viz-flow-stat">
                              <div className="n">{activeResult.binsNeeded}</div>
                              <div className="l">bins needed</div>
                            </div>
                            <div className="viz-flow-arrow">→</div>
                            <div className="viz-flow-stat hi">
                              <div className="n">{activeResult.shelvesNeeded}</div>
                              <div className="l">shelves</div>
                            </div>
                          </div>

                          <p className="viz-sentence" dangerouslySetInnerHTML={{ __html: `<b>Optimized:</b> ` + buildCaption(activeResult) }} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="recommender-modal-foot">
            <div className="recommender-store-select-wrapper">
              <label htmlFor="recommender-store-dropdown">Select Store to Apply:</label>
              <select
                id="recommender-store-dropdown"
                className="recommender-store-select"
                value={highlightedStoreId || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setHighlightedStoreId(val ? Number(val) : null);
                }}
              >
                <option value="">-- Choose a Dark Store --</option>
                {cities.map(city => {
                  const cityStores = allStores.filter(s => s.cityName === city.name && !s.disabled && s.shelvesAvailable > 0);
                  if (cityStores.length === 0) return null;
                  return (
                    <optgroup key={city.id} label={city.name}>
                      {cityStores.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.area}) — {s.shelvesAvailable} free
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
              {highlightedStore && totalShelves > highlightedStore.shelvesAvailable && (
                <span className="recommender-store-warning">
                  ⚠️ Only {highlightedStore.shelvesAvailable} free shelves left
                </span>
              )}
            </div>
            <button className="btn btn-ghost" onClick={() => setIsRecommenderOpen(false)}>Close</button>
            <button
              className="btn-recommender"
              onClick={handleApplyRecommendation}
              disabled={!highlightedStore}
              title={!highlightedStore ? "Please select a store to apply the recommendation" : ""}
              style={{ opacity: highlightedStore ? 1 : 0.6 }}
            >
              {highlightedStore 
                ? `Apply ${Math.min(totalShelves, highlightedStore.shelvesAvailable)} Shelf/Shelves to ${highlightedStore.name}`
                : `Select Store to Apply (${totalShelves} Shelves)`}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (step === 4) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="confirm-container">{renderConfirm()}</div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="shell">
        {renderSidebar()}
        <main className="main">
          {renderMobileHeader()}
          <div className={`main-inner${step === 2 ? " step-store" : ""}`}>
            {pageMeta && step !== 2 && (
              <header className="page-head">
                <p className="page-eyebrow">{pageMeta.eyebrow}</p>
                <h1 className="page-title">{pageMeta.title}</h1>
                <p className="page-desc">{pageMeta.desc}</p>
              </header>
            )}

            {showStepError && Object.keys(errors).length > 0 && (
              <div className="step-error-banner">
                Please fill in all required fields before continuing.
              </div>
            )}

            {step === 1 && renderPage1()}
            {step === 2 && renderPage2()}
            {step === 3 && renderPage3()}
          </div>

          <footer className={`action-bar${step === 2 ? " checkout-bar" : ""}`}>
            <div className="action-bar-inner">
              {step === 2 ? (
                <>
                  <button className="btn btn-ghost" onClick={() => { setStep(step - 1); setErrors({}); setShowStepError(false); }} aria-label="Go back">
                    <Icon.ArrowLeft /> <span className="btn-label">Back</span>
                  </button>
                  <div className="checkout-summary">
                    <div className="checkout-cart-icon">
                      <StoreIcon.Cart />
                      {cart.length > 0 && <span className="checkout-cart-badge">{cart.length}</span>}
                    </div>
                    <div className="checkout-stats">
                      <strong>{cart.length} store{cart.length !== 1 ? "s" : ""} · {totalCartRacks} rack{totalCartRacks !== 1 ? "s" : ""}</strong>
                      <span>{cartCityCount > 0 ? `${cartCityCount} cit${cartCityCount !== 1 ? "ies" : "y"}: ${[...new Set(cart.map((c) => c.city))].join(", ")}` : "Add stores to checkout"}</span>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-checkout"
                    onClick={handleCheckoutPayment}
                    disabled={cart.length === 0 || !disclaimerAgreed}
                    title={
                      cart.length === 0
                        ? "Add stores to your cart first"
                        : !disclaimerAgreed
                          ? "You must accept the legal disclaimer first"
                          : undefined
                    }
                  >
                    Checkout <Icon.ArrowRight />
                  </button>
                </>
              ) : (
                <>
                  {step > 1 && !applicationId ? (
                    <button className="btn btn-ghost" onClick={() => { setStep(step - 1); setErrors({}); setShowStepError(false); }} aria-label="Go back">
                      <Icon.ArrowLeft /> <span className="btn-label">Back</span>
                    </button>
                  ) : <div />}

                  {step < totalSteps ? (
                    <button className="btn btn-primary" onClick={handleNext} disabled={!isStepValid(step)} title={!isStepValid(step) ? "Complete all required fields to continue" : undefined}>
                      Continue <Icon.ArrowRight />
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={!isStepValid(3)} title={!isStepValid(3) ? "Complete all required fields to submit" : undefined}>
                      <Icon.Send /> Submit application
                    </button>
                  )}
                </>
              )}
            </div>
          </footer>
        </main>
        {simulationData && renderSimulationModal()}
      </div>
      {isRecommenderOpen && renderRecommenderModal()}
    </>
  );
}
