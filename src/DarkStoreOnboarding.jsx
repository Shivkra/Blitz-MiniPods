import { useState, useEffect, useRef, Fragment } from "react";
import StoreSelection, { StoreIcon } from "./StoreSelection.jsx";
import DocumentUpload from "./components/onboarding/DocumentUpload.jsx";
import Bengaluru3DMap from "./components/onboarding/Bengaluru3DMap.jsx";
import IndiaMapSVG from "./components/onboarding/IndiaMapSVG.jsx";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:           #0a0a0f;
    --bg-elevated:  #12121c;
    --surface:      #191926;
    --surface-2:    #222235;
    --surface-3:    #2c2c44;
    --border:       rgba(255,255,255,0.09);
    --border-focus: rgba(99,102,241,0.6);
    --accent:       #6366f1;
    --accent-soft:  rgba(99,102,241,0.16);
    --accent-glow:  rgba(99,102,241,0.3);
    --green:        #10b981;
    --green-soft:   rgba(16,185,129,0.16);
    --amber:        #f59e0b;
    --amber-soft:   rgba(245,158,11,0.16);
    --red:          #f87171;
    --red-soft:     rgba(248, 113, 113, 0.1);
    --text:         #ffffff;
    --text-2:       #c7c7d2;
    --text-3:       #9494a8;
    --sans:         'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    --radius:       12px;
    --radius-lg:    16px;
    --radius-xl:    24px;
  }

  html.light {
    --bg:           #f8f9fa;
    --bg-elevated:  #ffffff;
    --surface:      #f1f3f5;
    --surface-2:    #e9ecef;
    --surface-3:    #dee2e6;
    --border:       rgba(0,0,0,0.08);
    --border-focus: rgba(99,102,241,0.65);
    --accent:       #4f46e5;
    --accent-soft:  rgba(99,102,241,0.08);
    --accent-glow:  rgba(99,102,241,0.2);
    --green:        #059669;
    --green-soft:   rgba(5,150,105,0.08);
    --amber:        #d97706;
    --amber-soft:   rgba(217,119,6,0.08);
    --red:          #dc2626;
    --red-soft:     rgba(220,38,38,0.06);
    --text:         #111827;
    --text-2:       #4b5563;
    --text-3:       #6b7280;
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
    transition: background 0.3s ease, color 0.3s ease;
  }

  .shell {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 340px 1fr;
    background: radial-gradient(circle at 15% 0%, #15131f 0%, var(--bg) 45%) fixed;
    position: relative;
    overflow: hidden;
  }

  html.light .shell {
    background: radial-gradient(circle at 15% 0%, #eef2ff 0%, var(--bg) 55%) fixed;
  }

  .shell::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 10% 20%, rgba(99,102,241,0.18) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 90% 80%, rgba(16,185,129,0.10) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  html.light .shell::before {
    background:
      radial-gradient(ellipse 80% 60% at 10% 20%, rgba(99,102,241,0.05) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 90% 80%, rgba(16,185,129,0.03) 0%, transparent 50%);
  }

  /* ── SIDEBAR ── */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 340px;
    z-index: 10;
    border-right: 1px solid var(--border);
    padding: 24px 24px 0 24px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: rgba(15,15,18,0.6);
    backdrop-filter: blur(20px);
    transition: background 0.3s ease, border-color 0.3s ease;
  }

  .sidebar-body {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-bottom: 20px;
    scrollbar-width: none;
  }
  
  .sidebar-body::-webkit-scrollbar {
    display: none;
  }

  html.light .sidebar {
    background: rgba(255, 255, 255, 0.45);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 24px;
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
    border-top: 1px solid var(--border);
    padding: 20px 0;
    height: 110px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .form-progress-footer {
    width: 100%;
    max-width: 720px;
    margin: auto auto 0 auto;
    padding: 16px 32px 16px 32px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .form-progress-footer.step-store {
    max-width: 900px;
  }

  /* Hide progress bar on desktop — sidebar step nav already shows progress */
  .progress-wrapper {
    display: none;
  }

  @media (max-width: 768px) {
    .form-progress-footer {
      padding: 12px 24px;
    }
    /* Show progress bar on mobile */
    .progress-wrapper {
      display: block;
    }
  }

  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--text-3);
    margin-bottom: 6px;
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
    margin-top: 0;
    font-size: 11px;
    color: var(--text-3);
    line-height: 1.4;
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  .trust-note svg { flex-shrink: 0; margin-top: 1px; color: var(--text-3); }

  /* Trust note positioned in action bar bottom-left */
  .action-bar-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .trust-note-bar {
    max-width: 260px;
    margin-top: 0;
  }

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

  /* Sidebar Recommender / Optimizer Placement - Premium Eye-Catching Card */
  .sidebar-recommender {
    margin-top: 24px;
    padding: 16px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(129, 140, 248, 0.02) 100%);
    border: 1px solid rgba(99, 102, 241, 0.16);
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.03);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar-recommender:hover {
    border-color: rgba(99, 102, 241, 0.32);
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(129, 140, 248, 0.04) 100%);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.08);
    transform: translateY(-1px);
  }

  .sidebar-recommender-title {
    font-size: 13px;
    font-weight: 700;
    color: #a5b4fc;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: none;
  }

  .sidebar-recommender-desc {
    font-size: 12px;
    color: var(--text-3);
    line-height: 1.6;
    margin: 0;
  }

  /* Pulse Glowing Beacon Dot */
  .pulse-glowing-beacon {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #10b981;
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    animation: beaconPulse 1.8s infinite;
  }

  @keyframes beaconPulse {
    0% {
      transform: scale(0.9);
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
    }
    100% {
      transform: scale(0.9);
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }

  @keyframes buttonShineAnimation {
    0% {
      left: -150%;
    }
    40% {
      left: 150%;
    }
    100% {
      left: 150%;
    }
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
      rgba(255, 255, 255, 0.35) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-25deg);
    animation: buttonShineAnimation 4.5s infinite ease-in-out;
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
    align-items: flex-start;
    justify-content: center;
    padding: 20px 10px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    animation: fadeIn 0.25s ease-out;
  }

  .recommender-modal {
    width: 100%;
    max-width: 600px;
    margin: 40px auto;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    display: flex;
    flex-direction: column;
    overflow: visible;
    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6), 0 0 50px rgba(99, 102, 241, 0.12);
    animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .recommender-modal-head {
    padding: 20px 28px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top-left-radius: var(--radius-xl);
    border-top-right-radius: var(--radius-xl);
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
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .recommender-modal-foot {
    padding: 16px 28px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
    background: rgba(15, 15, 18, 0.4);
    border-bottom-left-radius: var(--radius-xl);
    border-bottom-right-radius: var(--radius-xl);
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
    gap: 4px;
    padding: 6px 16px;
    border-right: 1px solid var(--border);
  }

  .spec-chip:last-child {
    border-right: none;
  }

  .spec-chip .lbl {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .05em;
    color: var(--text-3);
    text-transform: uppercase;
  }

  .spec-chip .val {
    font-family: var(--sans);
    font-size: 14px;
    color: var(--text);
    font-weight: 700;
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
    margin-top: 0;
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
    margin-top: 4px;
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
    grid-column: 2;
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
    padding: 47px 32px 20px;
  }

  .page-head {
    margin-bottom: 16px;
  }

  .page-eyebrow {
    font-size: 12px;
    font-weight: 600;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }

  .page-title {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--text);
    line-height: 1.15;
    margin-bottom: 6px;
  }

  .page-desc {
    font-size: 15px;
    color: var(--text-2);
    line-height: 1.65;
    max-width: 520px;
  }

  /* ── SECTIONS ── */
  .section {
    margin-bottom: 16px;
  }

  .section-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 12px;
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
    padding: 20px;
  }

  .panel + .panel { margin-top: 16px; }

  .field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
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
    border-color: rgba(248, 113, 113, 0.35);
    box-shadow: 0 0 0 3px var(--red-soft);
  }

  .step-error-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    margin-bottom: 24px;
    background: var(--red-soft);
    border: 1px solid rgba(248, 113, 113, 0.15);
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
    gap: 6px;
    align-items: center;
  }

  .ss-view-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 100px;
    background: var(--surface-2);
    color: var(--text-2);
    font-size: 13px;
    font-weight: 600;
    font-family: var(--sans);
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }

  /* Inactive Map button gets a teal/cyan identity */
  .ss-view-btn:not(.active) {
    color: #22d3ee;
    border-color: rgba(34,211,238,0.25);
    background: rgba(34,211,238,0.06);
    text-shadow: 0 0 12px rgba(34,211,238,0.4);
  }

  .ss-view-btn:not(.active) svg {
    color: #22d3ee;
    filter: drop-shadow(0 0 4px rgba(34,211,238,0.6));
    animation: map-icon-pulse 2.5s ease-in-out infinite;
  }

  @keyframes map-icon-pulse {
    0%, 100% { filter: drop-shadow(0 0 3px rgba(34,211,238,0.5)); opacity: 1; }
    50%       { filter: drop-shadow(0 0 8px rgba(34,211,238,0.9)); opacity: 0.85; }
  }

  .ss-view-btn:hover:not(.active) {
    border-color: rgba(34,211,238,0.55);
    background: rgba(34,211,238,0.12);
    color: #67e8f9;
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 6px 20px rgba(34,211,238,0.2);
  }

  .ss-view-btn.active {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-color: transparent;
    color: #fff;
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
  }

  .ss-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  /* ── Premium Store Card ── */
  .ss-card {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease, border-color 0.2s;
    cursor: default;
  }

  .ss-card:hover:not(.unavailable) {
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.25);
  }

  .ss-card.highlighted {
    border-color: rgba(99,102,241,0.6);
    box-shadow: 0 0 0 3px var(--accent-soft), 0 16px 40px rgba(99,102,241,0.12);
  }

  .ss-card.in-cart {
    border-color: rgba(99,102,241,0.5);
    background: linear-gradient(145deg, rgba(99,102,241,0.07) 0%, var(--surface-2) 100%);
  }

  .ss-card.unavailable {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Top color stripe = availability indicator */
  .ss-card-stripe {
    height: 4px;
    width: 100%;
    flex-shrink: 0;
  }
  .ss-card-stripe.green { background: linear-gradient(90deg, #10b981, #34d399); }
  .ss-card-stripe.amber { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
  .ss-card-stripe.red   { background: linear-gradient(90deg, #ef4444, #f87171); }

  /* Card body */
  .ss-card-body {
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
  }

  /* Header row: name + booked badge */
  .ss-card-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }

  .ss-card-name-block { flex: 1; min-width: 0; }

  .ss-card-head h3 {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ss-in-cart-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 10.5px;
    font-weight: 700;
    color: #a5b4fc;
    background: var(--accent-soft);
    border: 1px solid rgba(99,102,241,0.3);
    padding: 4px 9px;
    border-radius: 100px;
    flex-shrink: 0;
    white-space: nowrap;
  }

  /* Availability badge row */
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
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 100px;
    letter-spacing: 0.01em;
  }

  .ss-pill-green { background: var(--green-soft); color: var(--green); }
  .ss-pill-amber { background: var(--amber-soft); color: var(--amber); }
  .ss-pill-red   { background: var(--red-soft);   color: var(--red); }

  .ss-pill-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
    animation: ss-pulse-dot 2s infinite;
  }

  @keyframes ss-pulse-dot {
    0%,100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.7); }
  }

  /* Big shelf counter */
  .ss-shelf-counter {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }
  .ss-shelf-counter-num {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: var(--text);
    line-height: 1;
  }
  .ss-shelf-counter-label {
    font-size: 12px;
    color: var(--text-3);
    font-weight: 500;
  }
  .ss-shelf-counter-sub {
    font-size: 10.5px;
    color: var(--text-3);
    margin-top: 2px;
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

  /* ── SHELF VISUALIZER (redesigned) ── */
  .ss-shelf-visualizer {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ss-shelf-visualizer.exhausted {
    opacity: 0.75;
  }

  .ss-shelf-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    font-weight: 600;
  }

  .ss-shelf-allocating {
    color: var(--text-2);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .ss-shelf-allocating strong {
    color: #a5b4fc;
    font-size: 13px;
    margin-left: 4px;
  }

  .ss-shelf-pending {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .ss-shelf-pending-green { color: var(--green); }
  .ss-shelf-pending-amber { color: var(--amber); }
  .ss-shelf-pending-red   { color: var(--red); }

  .ss-shelf-pending strong {
    font-size: 13px;
  }

  /* Thick segmented bar */
  .ss-shelf-progress-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ss-shelf-progress-bar {
    height: 10px;
    background: rgba(255,255,255,0.04);
    border-radius: 100px;
    overflow: hidden;
    display: flex;
    border: 1px solid rgba(255,255,255,0.06);
  }

  .ss-progress-segment {
    height: 100%;
    transition: width 0.4s cubic-bezier(0.34,1,0.64,1);
  }
  .ss-progress-segment.blocked {
    background: linear-gradient(90deg, #ef4444, #f87171);
  }
  .ss-progress-segment.selected {
    background: linear-gradient(90deg, #8b5cf6, #a78bfa);
    box-shadow: 0 0 8px rgba(139,92,246,0.5);
  }
  .ss-progress-segment.free {
    background: linear-gradient(90deg, #10b981, #34d399);
    box-shadow: 0 0 8px rgba(16,185,129,0.4);
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
    text-align: center;
    padding: 8px 0 4px;
    border-top: 1px solid var(--border);
    margin-top: 4px;
  }

  /* Progress bar legend */
  .ss-bar-legend {
    display: flex;
    gap: 12px;
    font-size: 10.5px;
    color: var(--text-3);
  }
  .ss-bar-legend-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .ss-bar-legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .ss-bar-legend-dot.blocked { background: #f87171; }
  .ss-bar-legend-dot.free    { background: #34d399; }
  .ss-bar-legend-dot.selected{ background: #a78bfa; }

  /* Card actions area */
  .ss-card-actions {
    border-top: 1px solid var(--border);
    padding: 14px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: rgba(0,0,0,0.1);
  }

  /* Shelf stepper row */
  .ss-stepper-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ss-stepper-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  .ss-qty {
    display: flex;
    align-items: center;
    gap: 2px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 3px;
    flex: 1;
  }

  .ss-qty button {
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 7px;
    background: var(--surface-2);
    color: var(--text-2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s;
    flex-shrink: 0;
  }

  .ss-qty button:disabled { opacity: 0.3; cursor: not-allowed; }
  .ss-qty button:not(:disabled):hover { background: var(--surface-3); color: var(--text); }

  .ss-qty-input {
    flex: 1;
    min-width: 0;
    height: 30px;
    background: transparent;
    border: none;
    color: var(--text);
    font-size: 14px;
    font-weight: 700;
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
  .ss-qty-input[type=number] { -moz-appearance: textfield; }

  .ss-qty-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-3);
    flex-shrink: 0;
    padding: 0 6px 0 2px;
    user-select: none;
  }

  /* Big Add / Update CTA */
  .ss-add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 11px 16px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    font-family: var(--sans);
    cursor: pointer;
    width: 100%;
    transition: opacity 0.2s, transform 0.15s;
    letter-spacing: 0.01em;
  }

  .ss-add-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .ss-add-btn:active {
    transform: scale(0.98);
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
    z-index: 2;
    position: relative;
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
    background: rgba(18, 18, 28, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.12);
    padding: 2px 8px;
    border-radius: 6px;
    max-width: 90px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.15);
    font-weight: 500;
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

  .leaflet-bar {
    border: 1px solid rgba(0, 0, 0, 0.12) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
    border-radius: 6px !important;
    overflow: hidden !important;
  }

  .leaflet-control-zoom a {
    background: #ffffff !important;
    color: #0f172a !important;
    border: none !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
    width: 26px !important;
    height: 26px !important;
    font-size: 15px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .leaflet-control-zoom a:last-child {
    border-bottom: none !important;
  }

  .leaflet-control-zoom a:hover {
    background: #f1f5f9 !important;
    color: #000000 !important;
  }

  html.dark .leaflet-bar {
    border: 1px solid rgba(0, 0, 0, 0.12) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12) !important;
    border-radius: 6px !important;
    overflow: hidden !important;
  }

  html.dark .leaflet-control-zoom a {
    background: #ffffff !important;
    color: #0f172a !important;
    border: none !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
    width: 26px !important;
    height: 26px !important;
    font-size: 15px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: background 0.15s ease, color 0.15s ease;
  }

  html.dark .leaflet-control-zoom a:last-child {
    border-bottom: none !important;
  }

  html.dark .leaflet-control-zoom a:hover {
    background: #f1f5f9 !important;
    color: #000000 !important;
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

  html.dark .ss-popup-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: linear-gradient(135deg, var(--accent) 0%, #818cf8 100%) !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 8px 16px !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    font-family: var(--sans) !important;
    cursor: pointer !important;
    text-align: center !important;
    margin-top: 10px !important;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25) !important;
    transition: all 0.2s ease !important;
    text-decoration: none !important;
  }

  html.dark .ss-popup-link:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4) !important;
    text-decoration: none !important;
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%) !important;
  }

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
    padding: 10px 22px;
    border-radius: 100px;
    border: 1px solid var(--border);
    background: var(--surface-2);
    color: var(--text-2);
    font-size: 13px;
    font-weight: 600;
    font-family: var(--sans);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .ss-city-pill:hover {
    border-color: var(--accent);
    color: var(--text);
  }

  .ss-city-pill.active {
    background: linear-gradient(135deg, var(--accent) 0%, #818cf8 100%) !important;
    border-color: var(--accent) !important;
    color: #ffffff !important;
    box-shadow: 0 4px 16px var(--accent-glow) !important;
  }

  html.light .ss-city-pill {
    background: #ffffff !important;
    border-color: rgba(15, 23, 42, 0.08) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.01) !important;
  }

  html.light .ss-city-pill:hover {
    border-color: var(--accent) !important;
    color: var(--accent) !important;
  }

  html.light .ss-city-pill.active {
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%) !important;
    border-color: #4f46e5 !important;
    color: #ffffff !important;
    box-shadow: 0 4px 16px rgba(79, 70, 229, 0.25) !important;
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
    padding: 0 48px;
    height: 110px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }

  .action-bar-inner {
    max-width: 720px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
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
      grid-column: 1 !important;
    }

    .main-inner {
      padding: 20px 16px calc(88px + env(safe-area-inset-bottom, 0px));
      max-width: none;
    }
    .main-inner.step-store {
      padding-bottom: calc(180px + env(safe-area-inset-bottom, 0px)) !important;
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
      height: auto !important;
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

  /* ── CUSTOM DROPDOWN MULTI-SELECT ── */
  .custom-select-trigger {
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
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
  }

  .custom-select-trigger:hover {
    border-color: rgba(255,255,255,0.1);
    background: var(--surface-3);
  }

  .custom-select-trigger.open {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  .selected-cities-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 8px;
    color: var(--text);
    font-weight: 500;
  }

  .custom-select-trigger:not(.open) .selected-cities-text:empty::before {
    content: "Select cities";
    color: var(--text-3);
  }

  .select-arrow-icon {
    display: flex;
    align-items: center;
    transition: transform 0.2s ease, color 0.15s;
    color: var(--text-3);
  }

  .custom-select-trigger.open .select-arrow-icon {
    transform: rotate(180deg);
    color: var(--text);
  }

  .custom-select-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
    z-index: 100;
    padding: 6px;
    animation: selectDropdownFade 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes selectDropdownFade {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .city-checkbox-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .city-checkbox-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    color: var(--text-2);
    user-select: none;
  }

  .city-checkbox-item:hover {
    background: var(--surface-3);
    color: var(--text);
  }

  .city-checkbox-item.active {
    color: var(--text);
  }

  .city-custom-checkbox {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    border: 1.5px solid var(--text-3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    background: transparent;
    color: #fff;
    flex-shrink: 0;
  }

  .city-checkbox-item.active .city-custom-checkbox {
    border-color: var(--accent);
    background: var(--accent);
  }

  .city-custom-checkbox svg {
    width: 9px;
    height: 9px;
    stroke-width: 4px;
  }

  .city-checkbox-label {
    font-size: 14px;
    font-weight: 500;
  }

  /* ── LANDING PAGE MAIN ── */
  .lp-wrap {
    min-height: 100vh;
    background: radial-gradient(circle at 15% 0%, #15131f 0%, var(--bg) 45%) fixed;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-x: hidden;
  }

  html.light .lp-wrap {
    background: radial-gradient(circle at 15% 0%, #eef2ff 0%, var(--bg) 55%) fixed;
  }

  .lp-wrap::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 10% 20%, rgba(99,102,241,0.18) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 90% 80%, rgba(16,185,129,0.10) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  html.light .lp-wrap::before {
    background:
      radial-gradient(ellipse 80% 60% at 10% 20%, rgba(99,102,241,0.05) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 90% 80%, rgba(16,185,129,0.03) 0%, transparent 50%);
  }

  .lp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 44px 96px 8px 96px;
    position: relative;
    z-index: 10;
  }

  .lp-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .lp-brand-logo {
    width: 40px;
    height: 40px;
    border-radius: 8px;
  }

  .lp-brand-text {
    display: flex;
    flex-direction: column;
  }

  .lp-brand-name {
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
  }

  .lp-brand-tag {
    font-size: 11px;
    color: var(--text-3);
    margin-top: 1px;
  }

  .btn-talk {
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.02);
    color: var(--text-2);
    padding: 10px 20px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
  }

  .btn-talk-icon {
    display: none;
  }

  .btn-talk-text {
    display: inline;
  }

  .btn-talk:hover {
    border-color: rgba(255, 255, 255, 0.15);
    background: rgba(255,255,255,0.06);
    color: var(--text);
    transform: translateY(-1px);
  }

  .lp-body {
    flex: 1;
    display: grid;
    grid-template-columns: 1.25fr 1fr;
    gap: 40px;
    align-items: center;
    padding: 8px 96px 48px 96px;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    position: relative;
    z-index: 1;
    transform: translateY(-20px);
  }

  @media (max-width: 1024px) {
    .lp-body {
      grid-template-columns: 1fr;
      gap: 60px;
      padding: 0 40px 60px 40px;
      text-align: center;
    }
    .lp-header {
      padding: 24px 40px;
    }
    .lp-content-left {
      align-items: center !important;
    }
    .lp-actions {
      justify-content: center;
    }
    .lp-brands-list {
      justify-content: center;
    }
    .lp-metrics {
      max-width: 600px;
      margin: 0 auto 32px auto;
    }
  }

  .lp-content-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .lp-badge {
    color: #10b981;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .lp-badge::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5);
    animation: lp-pulse-dot 2s infinite;
  }

  @keyframes lp-pulse-dot {
    0% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }

  /* Concentric Radar Pulsing Rings Styling */
  .lp-radar-pulse {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }

  .lp-pulse-ring {
    stroke: #818cf8;
    stroke-width: 2.8;
    opacity: 0;
    transform-box: fill-box;
    transform-origin: center;
    filter: drop-shadow(0 0 8px rgba(124, 108, 255, 0.75)) drop-shadow(0 0 20px rgba(124, 108, 255, 0.35));
    animation: lp-ring-glow 6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
  }

  .lp-ring-2 {
    animation-delay: 1.38s;
  }

  .lp-ring-3 {
    animation-delay: 2.86s;
  }

  @keyframes lp-ring-glow {
    0% {
      transform: scale(0.15);
      opacity: 0.1;
      stroke-width: 4px;
    }
    12% {
      opacity: 0.95;
      stroke-width: 3.5px;
    }
    80% {
      opacity: 0.35;
      stroke-width: 1.8px;
    }
    100% {
      transform: scale(1.35);
      opacity: 0;
      stroke-width: 1px;
    }
  }

  .lp-pulse-center {
    fill: #a5b4fc;
    filter: drop-shadow(0 0 10px #7c6cff) drop-shadow(0 0 20px #7c6cff);
    transform-box: fill-box;
    transform-origin: center;
    animation: lp-center-pulse 2s infinite ease-in-out;
  }

  @keyframes lp-center-pulse {
    0%, 100% {
      transform: scale(0.85);
      opacity: 0.8;
      fill: #818cf8;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
      fill: #c084fc;
      filter: drop-shadow(0 0 14px #a5b4fc) drop-shadow(0 0 25px #7c6cff);
    }
  }

  .lp-title {
    font-size: 56px;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 16px;
  }

  .lp-title span.accent {
    color: #818cf8;
    background: linear-gradient(135deg, #818cf8 0%, #a5b4fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  html.light .lp-title span.accent {
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .lp-subtitle {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 16px;
    color: var(--text-2);
    line-height: 1.4;
  }

  .lp-subtitle em {
    font-style: italic;
    color: var(--text-3);
    font-weight: 400;
  }

  .lp-subtitle strong {
    font-weight: 700;
    color: var(--text);
  }

  .lp-desc {
    font-size: 15px;
    color: var(--text);
    line-height: 1.6;
    margin-bottom: 24px;
    max-width: 540px;
  }

  .lp-metrics {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    width: 100%;
    margin-bottom: 28px;
    border-top: 1px solid var(--border);
    padding-top: 20px;
  }

  .lp-metric-item {
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.015);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    padding: 12px 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
  }

  html.light .lp-metric-item {
    background: rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .lp-metric-item:hover {
    transform: translateY(-2px);
    border-color: rgba(99, 102, 241, 0.35);
    background: rgba(99, 102, 241, 0.05);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.08);
  }

  .lp-metric-val {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #fff 0%, #c7d2fe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }

  html.light .lp-metric-val {
    background: linear-gradient(135deg, #111827 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .lp-metric-lbl {
    font-size: 9.5px;
    color: var(--text-3);
    margin-top: 4px;
    line-height: 1.35;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .lp-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
    width: 100%;
  }

  @media (max-width: 640px) {
    .lp-actions {
      flex-direction: column;
      align-items: stretch;
    }
    .lp-metrics {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
  }

  .btn-check-availability {
    background: linear-gradient(135deg, var(--accent) 0%, #818cf8 100%);
    color: #fff;
    border: none;
    border-radius: 100px;
    padding: 14px 30px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 8px 30px var(--accent-glow);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-check-availability:hover {
    transform: translateY(-1.5px);
    box-shadow: 0 12px 36px var(--accent-glow);
  }

  .btn-talk-specialist {
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.02);
    color: var(--text-2);
    border-radius: 100px;
    padding: 14px 30px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-talk-specialist:hover {
    border-color: rgba(255, 255, 255, 0.15);
    background: rgba(255,255,255,0.06);
    color: var(--text);
    transform: translateY(-1.5px);
  }

  .lp-brands-section {
    width: 100%;
    border-top: 1px solid var(--border);
    padding-top: 16px;
  }

  .lp-brands-title {
    font-size: 11px;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 12px;
  }

  .lp-brands-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .lp-brand-chip {
    padding: 6px 14px;
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 12px;
    color: var(--text-2);
    font-weight: 500;
  }

  /* ── RIGHT ILLUSTRATION GRAPHIC ── */
  .lp-graphic-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 550px;
  }

  .lp-glow-background {
    position: absolute;
    width: 340px;
    height: 340px;
    background: radial-gradient(circle at center, rgba(124, 108, 255, 0.28) 0%, rgba(99, 102, 241, 0.15) 45%, rgba(192, 132, 252, 0.05) 75%, transparent 100%);
    border-radius: 50%;
    z-index: 0;
    animation: pulse-glow 6s infinite ease-in-out;
  }

  .lp-graphic-scene {
    position: relative;
    width: 380px;
    height: 380px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lp-shelf-panel {
    background: rgba(15, 15, 20, 0.7);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    backdrop-filter: blur(20px);
    width: 260px;
    height: 200px;
    padding: 16px;
    box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    animation: float 5s infinite ease-in-out;
  }

  .lp-shelf-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .lp-shelf-row {
    display: flex;
    gap: 12px;
    border-bottom: 1.5px dashed rgba(255,255,255,0.04);
    padding-bottom: 12px;
  }

  .lp-shelf-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .lp-shelf-slot {
    height: 28px;
    border-radius: 6px;
    flex: 1;
    background: rgba(255,255,255,0.03);
    transition: background 0.3s;
  }

  .lp-shelf-slot.purple {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0.15) 100%);
    border: 1px solid rgba(99, 102, 241, 0.4);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  }

  .lp-shelf-slot.green {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0.15) 100%);
    border: 1px solid rgba(16, 185, 129, 0.4);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  }

  .lp-shelf-slot.yellow {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.4) 0%, rgba(245, 158, 11, 0.15) 100%);
    border: 1px solid rgba(245, 158, 11, 0.4);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
  }

  /* Floating tags */
  .lp-floating-tag {
    position: absolute;
    background: rgba(15, 15, 20, 0.85);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 10px 24px rgba(0,0,0,0.4);
    backdrop-filter: blur(10px);
    user-select: none;
    z-index: 10;
  }

  .lp-floating-tag.tag-booked {
    top: 60px;
    right: -20px;
    animation: float 4.5s infinite ease-in-out 0.5s;
  }

  .lp-floating-tag.tag-free {
    bottom: 60px;
    left: -40px;
    animation: float-reverse 5.2s infinite ease-in-out;
  }

  .lp-floating-tag.tag-orders {
    bottom: 20px;
    right: -30px;
    animation: float 4.8s infinite ease-in-out 1s;
  }

  .lp-tag-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .lp-tag-dot.green { background: #10b981; box-shadow: 0 0 8px #10b981; }
  .lp-tag-dot.orange { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }
  .lp-tag-arrow { color: #10b981; font-weight: 800; font-size: 11px; }

  /* Floating Plus gradient block */
  .lp-floating-plus {
    position: absolute;
    top: 50px;
    left: 40px;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 24px;
    font-weight: 300;
    z-index: 10;
    animation: float-reverse 4s infinite ease-in-out 0.3s;
    user-select: none;
  }

  /* Animated connection line path */
  .lp-svg-overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
  }

  .lp-connection-path {
    stroke: rgba(99, 102, 241, 0.25);
    stroke-width: 1.5;
    stroke-dasharray: 6, 6;
    fill: none;
    animation: dash 3s infinite linear;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  @keyframes float-reverse {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(8px); }
  }

  @keyframes pulse-glow {
    0%, 100% { transform: scale(0.9); opacity: 0.85; }
    50% { transform: scale(1.15); opacity: 1; }
  }

  @keyframes dash {
    to {
      stroke-dashoffset: -12;
    }
  }

  /* Standalone Specialist Booking Page */
  .standalone-wrap {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-x: hidden;
  }

  .standalone-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 96px 8px 96px;
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(20px);
    background: rgba(8, 8, 10, 0.4);
    z-index: 10;
  }

  .standalone-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .standalone-logo {
    width: 36px;
    height: 36px;
    border-radius: 8px;
  }

  .standalone-brand-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
  }

  .standalone-brand-tag {
    font-size: 11px;
    color: var(--accent);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .btn-standalone-back {
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.02);
    color: var(--text-2);
    padding: 8px 18px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-standalone-back:hover {
    border-color: rgba(255, 255, 255, 0.15);
    background: rgba(255,255,255,0.06);
    color: var(--text);
  }

  .btn-standalone-back.btn-home-icon,
  .header-actions .btn-standalone-back.btn-home-icon {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 36px !important;
    height: 36px !important;
    padding: 0 !important;
    border-radius: 50% !important;
    min-width: 36px !important;
  }

  .btn-home-icon svg {
    display: inline-block !important;
    width: 18px !important;
    height: 18px !important;
    stroke: currentColor !important;
    stroke-width: 2 !important;
  }

  .standalone-main {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 40px 24px;
    z-index: 1;
  }

  .standalone-form-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    width: 100%;
    max-width: 680px;
    padding: 32px;
    box-shadow: 0 30px 60px rgba(0,0,0,0.4);
  }

  .standalone-form-head {
    margin-bottom: 24px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 16px;
  }

  .standalone-form-head h2 {
    font-size: 24px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 6px;
    letter-spacing: -0.02em;
  }

  .standalone-form-head p {
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.5;
  }

  .standalone-form-foot {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    margin-top: 24px;
    border-top: 1px solid var(--border);
    padding-top: 20px;
  }

  /* Success Screen styles */
  .lead-success-wrap {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
  }

  .lead-success-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    width: 100%;
    max-width: 500px;
    padding: 40px 32px;
    text-align: center;
    box-shadow: 0 30px 60px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .lead-success-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--green-soft);
    border: 1px solid rgba(16, 185, 129, 0.2);
    color: var(--green);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);
  }

  .lead-success-icon svg {
    width: 24px;
    height: 24px;
  }

  .lead-success-card h2 {
    font-size: 22px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 12px;
    letter-spacing: -0.01em;
  }

  .lead-success-desc {
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .lead-success-details {
    width: 100%;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 28px;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .lead-detail-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
  }

  .lead-detail-row span {
    color: var(--text-3);
  }

  .lead-detail-row strong {
    color: var(--text);
    font-weight: 600;
  }

  .btn-success-home {
    width: 100%;
    padding: 12px 24px;
  }

  /* ── THEME SWITCHER ── */
  .btn-theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.02);
    color: var(--text-2);
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
    z-index: 10;
  }

  .btn-theme-toggle:hover {
    border-color: rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.06);
    color: var(--text);
    transform: rotate(15deg) scale(1.05);
  }

  html.light .btn-theme-toggle {
    background: rgba(0, 0, 0, 0.02);
  }

  html.light .btn-theme-toggle:hover {
    border-color: rgba(0, 0, 0, 0.15);
    background: rgba(0, 0, 0, 0.05);
  }

  /* ── LIGHT THEME ADAPTIONS ── */
  html.light .ss-leaflet-container {
    background: #eef2ff;
  }
  html.light .ss-marker-label {
    background: rgba(255, 255, 255, 0.9);
    color: var(--text);
    border: 1px solid var(--border);
  }
  html.light .ss-leaflet-popup .leaflet-popup-content-wrapper {
    background: rgba(255, 255, 255, 0.98);
    border-color: rgba(99, 102, 241, 0.25);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  html.light .ss-leaflet-popup .leaflet-popup-tip {
    background: rgba(255, 255, 255, 0.98);
    border-color: rgba(99, 102, 241, 0.15);
  }

  html.light .ss-shelf-visualizer {
    background: rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }
  html.light .ss-shelf-visualizer:hover {
    background: rgba(0, 0, 0, 0.03);
    border-color: rgba(0, 0, 0, 0.08);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
  html.light .ss-shelf-progress-bar {
    background: rgba(0, 0, 0, 0.03);
    border-color: rgba(0, 0, 0, 0.06);
  }

  html.light .recommender-modal-foot {
    background: rgba(255, 255, 255, 0.4);
  }

  /* ── ELITE LIGHT THEME DEFINITIONS ── */
  html.light {
    /* Main Design Variables */
    --bg:           #fafafb; /* High-end studio off-white background */
    --bg-elevated:  #ffffff; /* Clean white card surfaces */
    --surface:      #f4f5f8; /* Soft light grey background */
    --surface-2:    #ffffff; /* Make form inputs & store cards crisp white */
    --surface-3:    #eef0f4; /* Clean hover backdrop states */
    --border:       rgba(15, 23, 42, 0.05); /* Incredibly fine dark-opacity borders */
    --border-focus: rgba(79, 70, 229, 0.4);
    --accent:       #4f46e5; /* Deep, vivid signature indigo */
    --accent-soft:  rgba(79, 70, 229, 0.06);
    --accent-glow:  rgba(79, 70, 229, 0.12);
    --green:        #059669; /* Balanced forest green */
    --green-soft:   rgba(5, 150, 105, 0.06);
    --amber:        #d97706; /* High-end warm amber */
    --amber-soft:   rgba(217, 119, 6, 0.06);
    --red:          #dc2626; /* Crimson validation red */
    --red-soft:     rgba(220, 38, 38, 0.05);
    --text:         #0f172a; /* Slate-900 (elite typography color) */
    --text-2:       #475569; /* Slate-600 */
    --text-3:       #64748b; /* Slate-500 */
  }

  /* Global light mode visual polish overrides */
  html.light .shell {
    background: radial-gradient(circle at 5% 5%, rgba(99, 102, 241, 0.04) 0%, var(--bg) 60%) fixed !important;
  }
  html.light .lp-wrap {
    background: radial-gradient(circle at 5% 5%, rgba(99, 102, 241, 0.04) 0%, var(--bg) 60%) fixed !important;
  }

  html.light .sidebar {
    background: rgba(255, 255, 255, 0.7) !important;
    border-right: 1px solid rgba(15, 23, 42, 0.05) !important;
  }

  html.light .panel {
    background: #ffffff !important;
    border-color: rgba(15, 23, 42, 0.05) !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.02) !important;
  }

  /* Navigation steps on light mode */
  html.light .nav-step.clickable:hover {
    background: rgba(15, 23, 42, 0.02) !important;
  }
  html.light .nav-step.active {
    background: rgba(79, 70, 229, 0.06) !important;
    border-color: rgba(79, 70, 229, 0.15) !important;
  }

  /* Landing page visual polish */
  html.light .lp-metric-item {
    background: #ffffff !important;
    border: 1px solid rgba(15, 23, 42, 0.04) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02) !important;
  }
  html.light .lp-metric-item:hover {
    border-color: rgba(79, 70, 229, 0.25) !important;
    background: rgba(79, 70, 229, 0.02) !important;
    box-shadow: 0 12px 30px rgba(79, 70, 229, 0.06) !important;
  }
  html.light .lp-metric-val {
    background: linear-gradient(135deg, #0f172a 0%, #4f46e5 100%) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
  }
  html.light .lp-title span.accent {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
  }

  /* Forms & Input Elements */
  html.light .field input,
  html.light .field select,
  html.light .field textarea {
    background: #ffffff !important;
    border: 1px solid rgba(15, 23, 42, 0.12) !important;
    color: #0f172a !important;
  }
  html.light .field input:hover,
  html.light .field select:hover,
  html.light .field textarea:hover {
    border-color: rgba(79, 70, 229, 0.3) !important;
    background: #ffffff !important;
  }
  html.light .field input:focus,
  html.light .field select:focus,
  html.light .field textarea:focus {
    border-color: var(--accent) !important;
    background: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
  }

  /* Checkout Agreement & Disclaimer */
  html.light .ss-disclaimer-agreement {
    background: #ffffff !important;
    border: 1px solid rgba(15, 23, 42, 0.08) !important;
  }
  html.light .ss-disclaimer-agreement:hover {
    border-color: rgba(79, 70, 229, 0.3) !important;
    background: rgba(79, 70, 229, 0.02) !important;
  }
  html.light .ss-progress-segment.blocked {
    background: #fca5a5 !important;
    box-shadow: none !important;
  }
  html.light .ss-qty-input {
    color: #0f172a !important;
  }
  html.light .ss-qty-label {
    color: #475569 !important;
  }
  html.light .ss-qty button {
    color: #334155 !important;
  }
  html.light .ss-selection-disclaimer {
    border-top: 1px solid rgba(15, 23, 42, 0.08) !important;
  }
  html.light .ss-disclaimer-text {
    color: #334155 !important;
  }
  html.light .ss-disclaimer-text strong {
    color: #0f172a !important;
  }
  html.light .ss-disclaimer-agreement span {
    color: #1e293b !important;
  }

  /* Selection Panel & Badges Light Theme Overrides */
  html.light .ss-selection-panel {
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%) !important;
    border: 1px solid rgba(79, 70, 229, 0.1) !important;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05) !important;
  }
  html.light .ss-selection-head {
    background: rgba(79, 70, 229, 0.04) !important;
    border-bottom: 1px solid rgba(79, 70, 229, 0.1) !important;
  }
  html.light .ss-selection-head h4 {
    color: #0f172a !important;
  }
  html.light .ss-selection-head p {
    color: #475569 !important;
  }
  html.light .ss-selection-total {
    color: var(--accent) !important;
    background: rgba(79, 70, 229, 0.08) !important;
    border-color: rgba(79, 70, 229, 0.2) !important;
  }
  html.light .ss-selection-city-label {
    color: #475569 !important;
  }
  html.light .ss-selection-city-label em {
    color: #64748b !important;
  }
  html.light .ss-selection-item {
    background: #ffffff !important;
    border-color: rgba(15, 23, 42, 0.08) !important;
  }
  html.light .ss-selection-item:hover {
    border-color: rgba(79, 70, 229, 0.2) !important;
  }
  html.light .ss-selection-item-top strong {
    color: #0f172a !important;
  }
  html.light .ss-selection-area {
    color: #475569 !important;
  }
  html.light .ss-selection-address {
    color: #64748b !important;
  }
  html.light .ss-selection-view {
    background: #f8fafc !important;
    border-color: rgba(15, 23, 42, 0.08) !important;
    color: #475569 !important;
  }
  html.light .ss-selection-view:hover {
    color: var(--accent) !important;
    border-color: rgba(79, 70, 229, 0.2) !important;
    background: rgba(79, 70, 229, 0.04) !important;
  }
  html.light .ss-in-cart-badge {
    color: var(--accent) !important;
    background: rgba(79, 70, 229, 0.08) !important;
    border-color: rgba(79, 70, 229, 0.25) !important;
  }


  /* Footer Action Bar */
  html.light .action-bar {
    background: rgba(255, 255, 255, 0.85) !important;
    border-top: 1px solid rgba(15, 23, 42, 0.05) !important;
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.03) !important;
  }
  html.light .btn-ghost {
    color: #475569 !important;
  }
  html.light .btn-ghost:hover {
    background: rgba(15, 23, 42, 0.04) !important;
    color: #0f172a !important;
  }

  /* Vibrant Buttons in Light Mode */
  html.light .btn-primary {
    background: linear-gradient(135deg, var(--accent) 0%, #6366f1 100%) !important;
    color: #ffffff !important;
    border: none !important;
    box-shadow: 0 4px 18px rgba(79, 70, 229, 0.25) !important;
    opacity: 1 !important;
  }
  html.light .btn-primary:hover:not(:disabled) {
    background: linear-gradient(135deg, #4338ca 0%, #4f46e5 100%) !important;
    box-shadow: 0 6px 24px rgba(79, 70, 229, 0.4) !important;
    transform: translateY(-1px) !important;
  }
  html.light .btn-primary:disabled {
    background: #e2e8f0 !important;
    color: #94a3b8 !important;
    border: 1px solid rgba(15, 23, 42, 0.05) !important;
    box-shadow: none !important;
    opacity: 0.85 !important;
    cursor: not-allowed !important;
    transform: none !important;
  }

  html.light .ss-add-btn {
    background: linear-gradient(135deg, var(--accent) 0%, #6366f1 100%) !important;
    color: #ffffff !important;
    border: none !important;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25) !important;
  }
  html.light .ss-add-btn:hover {
    background: linear-gradient(135deg, #4338ca 0%, #4f46e5 100%) !important;
    box-shadow: 0 6px 18px rgba(79, 70, 229, 0.35) !important;
    transform: translateY(-1px) !important;
  }


  /* Recommender Modal & Capacity Simulator adaptations */
  html.light .recommender-modal-overlay {
    background: rgba(15, 23, 42, 0.45) !important;
    backdrop-filter: blur(8px) !important;
  }
  html.light .recommender-modal {
    background: #ffffff !important;
    border-color: rgba(15, 23, 42, 0.08) !important;
    box-shadow: 0 30px 100px rgba(15, 23, 42, 0.15), 0 0 40px rgba(79, 70, 229, 0.05) !important;
  }
  html.light .recommender-modal-head {
    background: #ffffff !important;
    border-bottom: 1px solid rgba(15, 23, 42, 0.06) !important;
  }
  html.light .recommender-modal-head h3 {
    color: #0f172a !important;
  }
  html.light .btn-close-modal {
    background: #f1f5f9 !important;
    border-color: rgba(15, 23, 42, 0.08) !important;
    color: #475569 !important;
  }
  html.light .btn-close-modal:hover {
    background: #fee2e2 !important;
    color: #ef4444 !important;
    border-color: rgba(239, 68, 68, 0.2) !important;
  }
  html.light .recommender-modal-foot {
    background: #f8fafc !important;
    border-top: 1px solid rgba(15, 23, 42, 0.05) !important;
  }
  html.light .spec-strip {
    background: #f8fafc !important;
    border-color: rgba(15, 23, 42, 0.06) !important;
  }
  html.light .spec-chip {
    border-right-color: rgba(15, 23, 42, 0.06) !important;
  }
  html.light .spec-chip .lbl {
    color: #64748b !important;
  }
  html.light .spec-chip .val {
    color: var(--accent) !important;
  }
  html.light .bin-preview-panel {
    background: linear-gradient(160deg, #f8fafc, #f1f5f9) !important;
    border-color: rgba(79, 70, 229, 0.15) !important;
  }
  html.light .preview-topbar {
    background: rgba(79, 70, 229, 0.03) !important;
    border-bottom: 1px solid rgba(79, 70, 229, 0.08) !important;
  }
  html.light .preview-topbar-left .ptb-title {
    color: #475569 !important;
  }
  html.light .ptb-item-label {
    color: #0f172a !important;
  }
  html.light .bin-peek-inner {
    background: #ffffff !important;
    border-color: rgba(15, 23, 42, 0.08) !important;
  }
  html.light .bin-peek-trigger:hover .bin-peek-inner {
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.12), 0 6px 20px rgba(79, 70, 229, 0.08) !important;
  }
  html.light .bin-peek-icon {
    background: linear-gradient(160deg, #e0e7ff, #c7d2fe) !important;
  }
  
  /* Mini 3D bin light mode adjustments */
  html.light .mini-front {
    background: linear-gradient(160deg, #4f46e5, #4338ca) !important;
    border-color: rgba(79, 70, 229, 0.4) !important;
  }
  html.light .mini-top {
    background: linear-gradient(135deg, #818cf8, #6366f1) !important;
    border-color: rgba(99, 102, 241, 0.5) !important;
  }
  html.light .mini-side {
    background: linear-gradient(180deg, #4338ca, #312e81) !important;
    border-color: rgba(79, 70, 229, 0.3) !important;
  }
  html.light .mini-d {
    background: rgba(255, 255, 255, 0.95) !important;
  }
  html.light .mini-d:nth-child(4),
  html.light .mini-d:nth-child(5) {
    background: #10b981 !important;
  }

  html.light .item-hero {
    background: rgba(79, 70, 229, 0.05) !important;
    border-color: rgba(79, 70, 229, 0.12) !important;
  }
  html.light .tag-violet {
    background: rgba(79, 70, 229, 0.08) !important;
    color: #4f46e5 !important;
    border-color: rgba(79, 70, 229, 0.18) !important;
  }
  html.light .tag-green {
    background: rgba(5, 150, 105, 0.08) !important;
    color: #059669 !important;
    border-color: rgba(5, 150, 105, 0.18) !important;
  }
  html.light .tag-amber {
    background: rgba(217, 119, 6, 0.08) !important;
    color: #b45309 !important;
    border-color: rgba(217, 119, 6, 0.18) !important;
  }

  /* Capacity Simulator & Visualizer Light theme styling */
  html.light .item-card {
    background: #ffffff !important;
    border-color: rgba(15, 23, 42, 0.08) !important;
  }
  html.light .item-card:hover {
    border-color: rgba(79, 70, 229, 0.4) !important;
    box-shadow: 0 0 0 1px rgba(79, 70, 229, 0.1), 0 6px 18px rgba(79, 70, 229, 0.08) !important;
  }
  html.light .item-card.active {
    border-color: var(--accent) !important;
    background: linear-gradient(160deg, rgba(79, 70, 229, 0.05), #ffffff) !important;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15), 0 8px 24px rgba(79, 70, 229, 0.12) !important;
  }
  html.light .item-card .item-name {
    color: #0f172a !important;
  }
  html.light .item-card .item-dim {
    color: #64748b !important;
  }
  html.light .viz-panel {
    background: #ffffff !important;
    border-color: rgba(15, 23, 42, 0.06) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01) !important;
  }
  html.light .viz-panel-head .t {
    color: #475569 !important;
  }
  html.light .viz-panel-head .d {
    color: #64748b !important;
  }
  html.light .viz-panel-foot {
    color: #64748b !important;
  }
  html.light .viz-legend span {
    color: #475569 !important;
  }
  html.light .sw-empty {
    background-image: repeating-linear-gradient(45deg, rgba(15, 23, 42, 0.12) 0 2px, transparent 2px 5px) !important;
    background-color: rgba(0, 0, 0, 0.02) !important;
    border-color: rgba(15, 23, 42, 0.18) !important;
  }
  html.light .viz-buffer {
    background: rgba(15, 23, 42, 0.02) !important;
    border-color: rgba(15, 23, 42, 0.05) !important;
  }
  html.light .viz-buffer-note {
    color: #475569 !important;
  }
  html.light .viz-buffer-note b {
    color: #0f172a !important;
  }
  
  /* Dots buffer light mode alignment */
  html.light .viz-dot.muted {
    background: rgba(15, 23, 42, 0.05) !important;
    border: 1px dashed rgba(15, 23, 42, 0.25) !important;
  }
  html.light .viz-dot.weight-cut {
    background: rgba(217, 119, 6, 0.04) !important;
    border: 1px dashed rgba(217, 119, 6, 0.45) !important;
  }

  html.light .viz-flow-stat {
    background: #ffffff !important;
    border-color: rgba(15, 23, 42, 0.08) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.01) !important;
  }
  html.light .viz-flow-stat .n {
    color: #0f172a !important;
  }
  html.light .viz-flow-stat .l {
    color: #64748b !important;
  }
  html.light .viz-flow-stat.hi {
    background: rgba(79, 70, 229, 0.06) !important;
    border-color: rgba(79, 70, 229, 0.18) !important;
  }
  html.light .viz-flow-stat.hi .n {
    color: var(--accent) !important;
  }
  html.light .viz-flow-stat.hi .l {
    color: rgba(79, 70, 229, 0.8) !important;
  }
  html.light .viz-flow-arrow {
    color: #94a3b8 !important;
  }
  html.light .viz-sentence {
    background: rgba(79, 70, 229, 0.04) !important;
    border-color: rgba(79, 70, 229, 0.1) !important;
    color: #3730a3 !important;
  }
  html.light .viz-sentence b {
    color: #1e1b4b !important;
  }
  html.light .bin-peek-label {
    color: #0f172a !important;
  }
  html.light .bin-peek-sub {
    color: #64748b !important;
  }
  html.light .bin-peek-arrow {
    color: #64748b !important;
  }
  html.light .bin-peek-trigger:hover .bin-peek-arrow,
  html.light .bin-peek-trigger[aria-expanded="true"] .bin-peek-arrow {
    color: var(--accent) !important;
  }
  html.light .item-hero-name {
    color: #0f172a !important;
  }
  html.light .item-hero-dims {
    color: #64748b !important;
  }
  html.light .preview-topbar-left .ptb-title {
    color: #475569 !important;
  }
  html.light .ptb-item-label {
    color: #0f172a !important;
  }
  
  html.light .item-block {
    background: #f8fafc !important;
    border-color: rgba(15, 23, 42, 0.05) !important;
  }
  html.light .item-row input {
    background: #ffffff !important;
    border-color: rgba(15, 23, 42, 0.12) !important;
  }
  html.light .item-row input:focus {
    border-color: var(--accent) !important;
  }
  html.light .add-row-btn {
    border-color: rgba(79, 70, 229, 0.25) !important;
    color: var(--accent) !important;
  }
  html.light .add-row-btn:hover {
    background: rgba(79, 70, 229, 0.04) !important;
  }
  html.light .big-stat {
    background: rgba(79, 70, 229, 0.04) !important;
    border-color: rgba(79, 70, 229, 0.1) !important;
  }
  html.light .big-stat .num {
    color: var(--accent) !important;
  }
  html.light .big-stat .lbl {
    color: #475569 !important;
  }

  /* Map and Legend styles in Light mode */
  html.light .ss-leaflet-container {
    background: #eef2ff !important;
  }
  html.light .ss-marker-label {
    background: #ffffff !important;
    color: #0f172a !important;
    border: 1px solid rgba(15, 23, 42, 0.08) !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
  }
  html.light .ss-leaflet-popup .leaflet-popup-content-wrapper {
    background: #ffffff !important;
    border: 1px solid rgba(79, 70, 229, 0.2) !important;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08) !important;
    color: #0f172a !important;
  }
  html.light .ss-leaflet-popup .leaflet-popup-tip {
    background: #ffffff !important;
    border: 1px solid rgba(79, 70, 229, 0.1) !important;
  }
  html.light .ss-leaflet-popup-inner h4 {
    color: #0f172a !important;
  }
  html.light .ss-leaflet-popup-inner p {
    color: #475569 !important;
  }
  html.light .ss-leaflet-popup .leaflet-popup-close-button {
    color: #64748b !important;
  }

  /* Grid visualizer and legends in Store Selection */
  html.light .ss-card {
    background: #ffffff !important;
    border-color: rgba(15, 23, 42, 0.05) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01) !important;
  }
  html.light .ss-card:hover {
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04) !important;
    border-color: rgba(79, 70, 229, 0.2) !important;
  }
  html.light .ss-card.in-cart {
    background: rgba(79, 70, 229, 0.02) !important;
    border-color: rgba(79, 70, 229, 0.2) !important;
  }
  html.light .ss-shelf-visualizer {
    background: #f8fafc !important;
    border-color: rgba(15, 23, 42, 0.05) !important;
  }
  html.light .ss-shelf-visualizer:hover {
    background: #ffffff !important;
    border-color: rgba(79, 70, 229, 0.15) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02) !important;
  }
  html.light .ss-shelf-progress-bar {
    background: rgba(15, 23, 42, 0.03) !important;
    border-color: rgba(15, 23, 42, 0.05) !important;
  }
  html.light .ss-shelf-rack {
    background: #f8fafc !important;
    border-color: rgba(15, 23, 42, 0.06) !important;
  }
  html.light .ss-shelf-rack.filled {
    background: rgba(79, 70, 229, 0.04) !important;
    border-color: rgba(79, 70, 229, 0.25) !important;
  }
  html.light .ss-shelf-allocating strong {
    color: var(--accent) !important;
    text-shadow: none !important;
  }
  html.light .ss-shelf-pending strong {
    text-shadow: none !important;
  }
  html.light .ss-rack-unit {
    background: #ffffff !important;
    border-color: rgba(15, 23, 42, 0.1) !important;
    color: #475569 !important;
  }
  html.light .ss-rack-unit:hover {
    background: rgba(79, 70, 229, 0.04) !important;
    border-color: var(--accent) !important;
    color: var(--accent) !important;
  }
  html.light .ss-rack-unit.selected {
    background: var(--accent) !important;
    border-color: var(--accent) !important;
    color: #ffffff !important;
    box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3) !important;
  }

  html.light .standalone-header {
    background: rgba(255, 255, 255, 0.4) !important;
  }
  html.light .btn-standalone-back {
    background: rgba(0, 0, 0, 0.02) !important;
  }
  html.light .btn-standalone-back:hover {
    border-color: rgba(0, 0, 0, 0.15) !important;
    background: rgba(0, 0, 0, 0.05) !important;
  }

  html.light .lead-success-card {
    background: #ffffff !important;
    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.05) !important;
  }

  html.light .lp-shelf-panel {
    background: rgba(255, 255, 255, 0.7) !important;
    border-color: rgba(15, 23, 42, 0.05) !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.03) !important;
  }
  html.light .lp-shelf-row {
    border-bottom-color: rgba(0, 0, 0, 0.06) !important;
  }
  html.light .lp-shelf-slot {
    background: rgba(0, 0, 0, 0.02) !important;
  }

  html.light .lp-floating-tag {
    background: rgba(255, 255, 255, 0.85) !important;
    border-color: rgba(15, 23, 42, 0.05) !important;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.03) !important;
  }

  html.light [style*="color: #a5b4fc"],
  html.light [style*="color: rgb(165, 180, 252)"],
  html.light .recommender-highlight-title,
  html.light .sidebar-recommender-title,
  html.light .ss-shelf-allocating strong,
  html.light .spec-chip .val,
  html.light .promo-tag {
    color: var(--accent) !important;
  }

  html.light .sidebar-recommender {
    background: linear-gradient(135deg, rgba(79, 70, 229, 0.04) 0%, rgba(79, 70, 229, 0.01) 100%) !important;
    border: 1px solid rgba(79, 70, 229, 0.12) !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02) !important;
  }
  html.light .sidebar-recommender:hover {
    border-color: rgba(79, 70, 229, 0.22) !important;
    background: linear-gradient(135deg, rgba(79, 70, 229, 0.07) 0%, rgba(79, 70, 229, 0.02) 100%) !important;
  }
  html.light .sidebar-foot {
    border-top-color: rgba(15, 23, 42, 0.05) !important;
  }
  html.light .progress-track {
    background: rgba(15, 23, 42, 0.05) !important;
  }

  html.light .btn-sidebar-recommender,
  html.light .btn-recommender,
  html.light .btn-recommender-highlight {
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%) !important;
  }

  html.light .recommender-highlight-banner {
    background: linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(79, 70, 229, 0.02) 100%) !important;
    border-color: rgba(79, 70, 229, 0.15) !important;
    box-shadow: 0 4px 20px rgba(79, 70, 229, 0.02) !important;
  }

  html.light .recommender-sidebar-promo {
    background: rgba(79, 70, 229, 0.04) !important;
    border-color: rgba(79, 70, 229, 0.2) !important;
  }

  /* Unified Header Actions */
  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 100;
  }

  .header-actions .btn-theme-toggle {
    margin: 0 !important;
  }

  .header-actions .btn-talk,
  .header-actions .btn-standalone-back {
    margin: 0 !important;
    padding: 8px 16px !important;
    font-size: 13px !important;
    line-height: 1 !important;
    height: 38px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  /* Desktop layout: position absolutely inside relative parents */
  .desktop-actions-wrap-outer {
    position: absolute;
    top: 44px;
    right: 96px;
    z-index: 100;
  }

  @media (max-width: 960px) {
    .desktop-actions-wrap-outer {
      display: none;
    }
  }

  /* Mobile actions styling inside mobile header */
  .mobile-actions-wrap {
    margin-left: auto;
  }

  @media (max-width: 480px) {
    .mobile-actions-wrap .btn-talk,
    .mobile-actions-wrap .btn-standalone-back {
      padding: 6px 12px !important;
      font-size: 11px !important;
      height: 32px !important;
    }
    .mobile-actions-wrap {
      gap: 6px;
    }
    .lp-graphic-container {
      height: 220px !important;
      margin: 2px 0 !important;
    }
  }

  /* World-Class Mobile-First Landing Page Restructuring */
  @media (max-width: 768px) {
    .standalone-header {
      padding: 16px 20px 8px 20px !important;
    }
    .btn-talk-text {
      display: none !important;
    }
    .btn-talk-icon {
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
    }
    .btn-talk {
      width: 36px !important;
      height: 36px !important;
      padding: 0 !important;
      border-radius: 50% !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-width: 36px !important;
    }

    .lp-body {
      display: flex !important;
      flex-direction: column !important;
      padding: 32px 20px 48px 20px !important;
      gap: 24px !important;
      transform: none !important;
      text-align: center !important;
    }

    .lp-content-left {
      display: contents !important;
    }

    .lp-badge {
      order: 1 !important;
      margin: 0 auto 8px auto !important;
    }

    .lp-title {
      order: 2 !important;
      font-size: 38px !important;
      line-height: 1.2 !important;
      margin-bottom: 8px !important;
      letter-spacing: -0.03em !important;
    }

    .lp-subtitle {
      order: 3 !important;
      font-size: 15px !important;
      line-height: 1.4 !important;
      margin-bottom: 8px !important;
      color: var(--text-2) !important;
    }

    .lp-desc {
      order: 4 !important;
      font-size: 13.5px !important;
      line-height: 1.5 !important;
      margin-bottom: 12px !important;
      max-width: 480px !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }

    .lp-graphic-container {
      order: 5 !important;
      height: 460px !important;
      margin: 8px 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      overflow: hidden !important;
      width: 100% !important;
    }

    .lp-graphic-scene {
      transform: scale(0.7) !important;
      transform-origin: center !important;
      flex-shrink: 0 !important;
    }

    .lp-glow-background {
      width: 260px !important;
      height: 260px !important;
    }

    .lp-metrics {
      order: 6 !important;
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 12px !important;
      padding-top: 16px !important;
      margin-bottom: 12px !important;
      border-top: 1px solid var(--border) !important;
    }

    .lp-metric-item {
      padding: 14px 10px !important;
      border-radius: 12px !important;
      background: rgba(255, 255, 255, 0.02) !important;
      border: 1px solid rgba(255, 255, 255, 0.05) !important;
      backdrop-filter: blur(10px) !important;
    }

    html.light .lp-metric-item {
      background: rgba(255, 255, 255, 0.7) !important;
      border: 1px solid rgba(15, 23, 42, 0.04) !important;
    }

    .lp-metric-val {
      font-size: 18px !important;
      font-weight: 750 !important;
      margin-bottom: 4px !important;
    }

    .lp-metric-lbl {
      font-size: 10px !important;
      text-transform: uppercase !important;
      letter-spacing: 0.03em !important;
    }

    .lp-actions {
      order: 7 !important;
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 12px !important;
      width: 100% !important;
      max-width: 340px !important;
      margin: 8px auto 16px auto !important;
    }

    .btn-check-availability,
    .btn-talk-specialist {
      width: 100% !important;
      text-align: center !important;
      justify-content: center !important;
      padding: 14px 24px !important;
      font-size: 14px !important;
      height: 48px !important;
      border-radius: 100px !important;
    }

    .lp-brands-section {
      order: 8 !important;
      border-top: 1px solid var(--border) !important;
      padding-top: 16px !important;
      margin-top: 8px !important;
    }

    .lp-brands-list {
      justify-content: center !important;
      gap: 8px !important;
    }

    .lp-brand-chip {
      padding: 6px 12px !important;
      font-size: 11px !important;
      background: rgba(255, 255, 255, 0.02) !important;
      border: 1px solid rgba(255, 255, 255, 0.04) !important;
      border-radius: 100px !important;
    }

    html.light .lp-brand-chip {
      background: rgba(15, 23, 42, 0.02) !important;
      border: 1px solid rgba(15, 23, 42, 0.04) !important;
    }

    .lp-header {
      padding: 20px 20px 8px 20px !important;
    }

    .lp-brand-logo {
      width: 32px !important;
      height: 32px !important;
    }

    .lp-brand-name {
      font-size: 15px !important;
    }

    .lp-brand-tag {
      font-size: 9px !important;
    }
  }

  @media (max-width: 400px) {
    .lp-graphic-scene {
      transform: scale(0.65) !important;
    }
    .lp-graphic-container {
      height: 180px !important;
      margin: 0 !important;
    }
    .lp-title {
      font-size: 30px !important;
    }
  }

  /* Custom Dropdown Selector styling */
  .custom-dropdown-container {
    position: relative;
    width: 100%;
    margin-bottom: 8px;
    z-index: 100;
  }

  .custom-dropdown-trigger {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    color: var(--text);
    font-size: 14.5px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .custom-dropdown-trigger:hover {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent-glow);
  }

  .custom-dropdown-trigger .trigger-val {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .custom-dropdown-trigger .trigger-val .emoji {
    font-size: 18px;
  }

  .custom-dropdown-trigger .arrow {
    font-size: 10px;
    color: var(--text-3);
  }

  .custom-dropdown-trigger:has(.trigger-placeholder) {
    border-color: rgba(99, 102, 241, 0.4);
    background: rgba(99, 102, 241, 0.02);
    animation: trigger-border-pulse 2s infinite alternate;
  }

  html.light .custom-dropdown-trigger:has(.trigger-placeholder) {
    border-color: rgba(79, 70, 229, 0.35);
    background: rgba(79, 70, 229, 0.015);
  }

  .custom-dropdown-trigger .trigger-placeholder {
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, var(--accent) 0%, #a855f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
    letter-spacing: -0.01em;
    animation: placeholder-pulse 2s infinite alternate;
  }

  .custom-dropdown-trigger .trigger-placeholder .sparkle-icon {
    display: inline-block;
    margin-right: 6px;
    animation: sparkle-spin 3s infinite linear;
    -webkit-text-fill-color: initial;
  }

  @keyframes trigger-border-pulse {
    from {
      box-shadow: 0 0 0 0px rgba(99, 102, 241, 0);
      border-color: rgba(99, 102, 241, 0.3);
    }
    to {
      box-shadow: 0 0 12px 1px rgba(99, 102, 241, 0.12);
      border-color: rgba(99, 102, 241, 0.65);
    }
  }

  @keyframes placeholder-pulse {
    0% {
      opacity: 0.85;
      filter: drop-shadow(0 0 1px rgba(99, 102, 241, 0.1));
    }
    100% {
      opacity: 1;
      filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.45));
    }
  }

  @keyframes sparkle-spin {
    0% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.25) rotate(180deg); }
    100% { transform: scale(1) rotate(360deg); }
  }

  .custom-dropdown-menu {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: 0 10px 35px rgba(0, 0, 0, 0.4);
    z-index: 200;
    max-height: 250px;
    overflow-y: auto;
    padding: 6px;
    backdrop-filter: blur(8px);
  }

  .custom-dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.15s ease;
    color: var(--text-2);
  }

  .custom-dropdown-item:hover {
    background: rgba(255, 255, 255, 0.03);
    color: var(--text);
  }

  .custom-dropdown-item.selected {
    background: rgba(99, 102, 241, 0.08);
    color: var(--accent);
    font-weight: 600;
  }

  .custom-dropdown-item .emoji {
    font-size: 17px;
  }

  .custom-dropdown-item .name {
    font-size: 13.5px;
  }

  .custom-dropdown-item .dims {
    font-size: 12px;
    color: var(--text-3);
    margin-left: auto;
  }

  .custom-dropdown-item .oversized-tag {
    font-size: 9px;
    background: rgba(239, 68, 68, 0.15);
    color: var(--red);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid rgba(239, 68, 68, 0.25);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  /* ── VISUALIZER ITEM GRID PICKER & HERO STYLES ── */
  .items-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 8px;
  }

  .item-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 14px 10px 12px;
    cursor: pointer;
    transition: border-color .18s, box-shadow .18s, transform .15s;
    text-align: center;
    position: relative;
    user-select: none;
  }

  .item-card:hover {
    border-color: rgba(99, 102, 241, .5);
    box-shadow: 0 0 0 1px rgba(99, 102, 241, .18), 0 6px 22px rgba(99, 102, 241, .14);
    transform: translateY(-1px);
  }

  .item-card.active {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, .25), 0 8px 28px rgba(99, 102, 241, .22);
    background: linear-gradient(160deg, rgba(99, 102, 241, .1), var(--surface));
  }

  .item-card .emoji {
    font-size: 32px;
    line-height: 1;
    margin-bottom: 8px;
    display: block;
  }

  .item-card .item-name {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.3;
    margin-bottom: 4px;
  }

  .item-card .item-dim {
    font-family: monospace;
    font-size: 9.5px;
    color: var(--text-3);
  }

  .item-card .active-check {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent);
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    color: #fff;
  }

  .item-card.active .active-check {
    display: flex;
  }

  /* Selected item hero styling */
  .item-hero {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
    padding: 14px 16px;
    background: rgba(99, 102, 241, .07);
    border: 1px solid rgba(99, 102, 241, .16);
    border-radius: 13px;
  }

  .item-hero-emoji {
    font-size: 44px;
    line-height: 1;
    flex-shrink: 0;
  }

  .item-hero-info {
    text-align: left;
  }

  .item-hero-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 4px;
  }

  .item-hero-dims {
    font-family: monospace;
    font-size: 11px;
    color: var(--text-3);
    margin-bottom: 6px;
  }

  .item-hero-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .tag {
    font-family: monospace;
    font-size: 9.5px;
    letter-spacing: .05em;
    padding: 2px 7px;
    border-radius: 5px;
    font-weight: 600;
  }

  .tag-violet {
    background: var(--accent-soft);
    color: #a5b4fc;
    border: 1px solid rgba(99, 102, 241, .25);
  }

  .tag-green {
    background: var(--green-soft);
    color: var(--green);
    border: 1px solid rgba(16, 185, 129, .25);
  }

  .tag-amber {
    background: var(--amber-soft);
    color: var(--amber);
    border: 1px solid rgba(245, 158, 11, .25);
  }

  /* Hint text below trigger */
  .hint-text {
    font-size: 11.5px;
    color: var(--text-3);
    text-align: center;
    margin-top: 10px;
  }

  /* ─── NEW PREMIUM REBRANDED LANDING SECTIONS ─── */
  .lp-wrap {
    gap: 0 !important;
  }
  
  .lp-body {
    padding-bottom: 0 !important;
  }

  @media (min-width: 769px) {
    .lp-body {
      padding-top: 72px !important;
      transform: none !important;
    }
  }

  .lp-section {
    position: relative;
    padding: 100px 96px;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    z-index: 2;
  }

  @media (max-width: 768px) {
    .lp-section {
      padding: 60px 24px;
    }
  }

  .lp-divider {
    height: 1px;
    border: none;
    background: linear-gradient(90deg, transparent, var(--border) 20%, var(--border) 80%, transparent);
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    opacity: 0.8;
  }

  .lp-section-header {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 60px auto;
  }

  .lp-section-title {
    font-size: 38px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.2;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #ffffff 0%, #c7d2fe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  html.light .lp-section-title {
    background: linear-gradient(135deg, #0f172a 0%, #312e81 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .lp-section-subtitle {
    font-size: 16px;
    color: var(--text-2);
    line-height: 1.5;
  }

  /* 2. Trust Section */
  .lp-trust-section {
    padding: 40px 96px 80px 96px;
    border-bottom: 1px solid var(--border);
  }

  @media (max-width: 768px) {
    .lp-trust-section {
      padding: 30px 24px 60px 24px;
    }
  }

  .lp-trust-title {
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 24px;
  }

  .lp-trust-logos {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 32px;
  }

  .lp-trust-chip {
    padding: 8px 20px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-2);
    transition: all 0.3s ease;
  }

  .lp-trust-chip:hover {
    background: rgba(99, 102, 241, 0.08);
    border-color: rgba(99, 102, 241, 0.3);
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  }

  html.light .lp-trust-chip:hover {
    color: var(--accent);
    background: rgba(99, 102, 241, 0.04);
  }

  .lp-trust-pills {
    display: flex;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
  }

  .lp-trust-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--green);
  }

  /* 3. Why Choose section */
  .lp-why-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (max-width: 1024px) {
    .lp-why-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .lp-why-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Base card */
  .lp-why-card {
    position: relative;
    border-radius: 16px;
    padding: 28px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    overflow: hidden;
    cursor: default;
    background: rgba(255,255,255,0.018);
    border: 1px solid rgba(255,255,255,0.07);
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1),
                box-shadow 0.35s ease,
                border-color 0.35s ease;
    /* staggered entrance */
    opacity: 0;
    transform: translateY(28px);
    animation: why-card-in 0.55s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .lp-why-card:nth-child(1) { animation-delay: 0.05s; }
  .lp-why-card:nth-child(2) { animation-delay: 0.12s; }
  .lp-why-card:nth-child(3) { animation-delay: 0.19s; }
  .lp-why-card:nth-child(4) { animation-delay: 0.26s; }
  .lp-why-card:nth-child(5) { animation-delay: 0.33s; }
  .lp-why-card:nth-child(6) { animation-delay: 0.40s; }

  @keyframes why-card-in {
    to { opacity: 1; transform: translateY(0); }
  }

  /* Colored top accent bar */
  .lp-why-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2.5px;
    background: var(--why-accent, #6366f1);
    box-shadow: 0 0 18px var(--why-accent, #6366f1), 0 0 6px var(--why-accent, #6366f1);
    border-radius: 16px 16px 0 0;
    opacity: 0.8;
  }

  /* Shimmer sweep on hover */
  .lp-why-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%);
    background-size: 200% 100%;
    background-position: -100% 0;
    transition: background-position 0.6s ease;
    pointer-events: none;
    border-radius: inherit;
  }
  .lp-why-card:hover::after {
    background-position: 200% 0;
  }

  /* Hover lift + radial glow */
  .lp-why-card:hover {
    transform: translateY(-6px);
    border-color: color-mix(in srgb, var(--why-accent, #6366f1) 35%, transparent);
    box-shadow:
      0 16px 40px rgba(0,0,0,0.25),
      0 0 0 1px color-mix(in srgb, var(--why-accent, #6366f1) 20%, transparent),
      inset 0 0 60px color-mix(in srgb, var(--why-accent, #6366f1) 4%, transparent);
  }

  /* Icon circle */
  .lp-why-icon-wrap {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--why-accent, #6366f1) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--why-accent, #6366f1) 25%, transparent);
    box-shadow: 0 0 20px color-mix(in srgb, var(--why-accent, #6366f1) 15%, transparent);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    flex-shrink: 0;
  }
  .lp-why-card:hover .lp-why-icon-wrap {
    transform: scale(1.1) rotate(-4deg);
    box-shadow: 0 0 30px color-mix(in srgb, var(--why-accent, #6366f1) 35%, transparent);
  }

  /* Pulsing ring around icon */
  .lp-why-icon-ring {
    position: absolute;
    inset: -6px;
    border-radius: 20px;
    border: 1.5px solid color-mix(in srgb, var(--why-accent, #6366f1) 30%, transparent);
    animation: why-ring-pulse 2.5s ease-in-out infinite;
  }
  @keyframes why-ring-pulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50%       { opacity: 0.8; transform: scale(1.06); }
  }

  /* Metric chip */
  .lp-why-metric {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.06em;
    color: var(--why-accent, #6366f1);
    background: color-mix(in srgb, var(--why-accent, #6366f1) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--why-accent, #6366f1) 22%, transparent);
    border-radius: 20px;
    padding: 3px 9px;
    width: fit-content;
    margin-bottom: 2px;
    opacity: 0;
    animation: why-metric-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }
  .lp-why-card:nth-child(1) .lp-why-metric { animation-delay: 0.5s; }
  .lp-why-card:nth-child(2) .lp-why-metric { animation-delay: 0.57s; }
  .lp-why-card:nth-child(3) .lp-why-metric { animation-delay: 0.64s; }
  .lp-why-card:nth-child(4) .lp-why-metric { animation-delay: 0.71s; }
  .lp-why-card:nth-child(5) .lp-why-metric { animation-delay: 0.78s; }
  .lp-why-card:nth-child(6) .lp-why-metric { animation-delay: 0.85s; }
  @keyframes why-metric-pop {
    from { opacity: 0; transform: scale(0.7); }
    to   { opacity: 1; transform: scale(1); }
  }
  .lp-why-metric-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: currentColor;
    animation: why-dot-blink 1.2s ease-in-out infinite alternate;
  }
  @keyframes why-dot-blink {
    from { opacity: 0.3; }
    to   { opacity: 1; }
  }

  /* Card body text */
  .lp-why-card-title {
    font-size: 17px;
    font-weight: 800;
    color: var(--text);
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin: 0;
  }

  .lp-why-card-desc {
    font-size: 13.5px;
    color: var(--text-2);
    line-height: 1.55;
    margin: 0;
  }

  /* 4. Comparison Section */
  /* 4. Comparison Section */
  .lp-compare-table-container {
    width: 100%;
    overflow-x: auto;
    border-radius: var(--radius-xl);
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.01);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  .lp-compare-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    min-width: 600px;
  }

  .lp-compare-th {
    padding: 24px;
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    border-bottom: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.02);
  }

  .lp-compare-td {
    padding: 20px 24px;
    font-size: 14px;
    color: var(--text-2);
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  .lp-compare-highlight {
    background: rgba(99, 102, 241, 0.03);
    border-left: 1.5px solid rgba(99, 102, 241, 0.2);
    border-right: 1.5px solid rgba(99, 102, 241, 0.2);
  }

  tr:last-child .lp-compare-td {
    border-bottom: none;
  }

  .lp-compare-check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    background: var(--green-soft);
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 50%;
    color: var(--green);
    margin-right: 8px;
    flex-shrink: 0;
    font-style: normal;
  }

  .lp-compare-cross {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    background: var(--red-soft);
    border: 1px solid rgba(248, 113, 113, 0.2);
    border-radius: 50%;
    color: var(--red);
    margin-right: 8px;
    flex-shrink: 0;
    font-style: normal;
  }

  .lp-compare-item-wrap {
    display: flex;
    align-items: center;
  }
  /* 5. Journey Roadmap Section */
  .lp-journey-split {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 40px;
    align-items: stretch;
    width: 100%;
    margin-top: 32px;
  }

  @media (max-width: 1024px) {
    .lp-journey-split {
      grid-template-columns: 1fr;
      gap: 32px;
    }
  }

  @media (max-width: 1250px) and (min-width: 1025px) {
    .lp-journey-split {
      grid-template-columns: 1fr 1fr !important;
      gap: 20px !important;
    }
    .lp-journey-visual-panel {
      padding: 16px !important;
      align-items: flex-start !important;
      padding-top: 24px !important;
    }
    /* Select Stores shrink visual */
    .lp-journey-visual-panel .jv-india-map-wrapper {
      transform: scale(0.8) translateX(-35px) translateY(10px) !important;
    }
    .lp-journey-visual-panel .radar-grid {
      transform: scale(0.8) translateX(-35px) translateY(10px) !important;
    }
    .lp-journey-visual-panel .jv-map-stats-overlay {
      width: 110px !important;
      padding: 8px !important;
      top: 10px !important;
      right: 10px !important;
      gap: 4px !important;
    }
    .lp-journey-visual-panel .jv-map-stats-overlay .overlay-city {
      font-size: 11px !important;
    }
    .lp-journey-visual-panel .jv-map-stats-overlay .overlay-row {
      font-size: 9px !important;
    }
    .lp-journey-visual-panel .jv-map-stats-overlay .overlay-tag {
      font-size: 7px !important;
    }

    /* Send Inventory shrink visual */
    .lp-journey-visual-panel .jv-inventory-card {
      gap: 8px !important;
    }
    .lp-journey-visual-panel .inv-body {
      grid-template-columns: 1fr 90px !important;
      min-height: 140px !important;
      gap: 8px !important;
    }
    .lp-journey-visual-panel .inv-ring-wrap {
      width: 74px !important;
      height: 74px !important;
    }
    .lp-journey-visual-panel .inv-ring-pct {
      font-size: 15px !important;
    }
    .lp-journey-visual-panel .inv-ring-label {
      font-size: 8px !important;
    }
    .lp-journey-visual-panel .inv-kpi-strip {
      border-radius: 6px !important;
    }
    .lp-journey-visual-panel .inv-kpi {
      padding: 5px 3px !important;
    }
    .lp-journey-visual-panel .inv-kpi-val {
      font-size: 11px !important;
    }
    .lp-journey-visual-panel .inv-kpi-key {
      font-size: 7.5px !important;
    }
    .lp-journey-visual-panel .inv-scan-row {
      padding: 4px 6px !important;
    }
    .lp-journey-visual-panel .inv-barcode {
      height: 18px !important;
    }
    .lp-journey-visual-panel .inv-row-name {
      font-size: 9px !important;
    }
  }

  /* Left Showcase Panel */
  .lp-journey-visual-panel {
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    height: 100% !important;
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
    transition: all 0.3s ease;
  }

  .lp-journey-visual-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 80%);
    pointer-events: none;
  }

  /* Right steps list */
  .lp-journey-steps-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
  }

  @media (min-width: 1025px) {
    .lp-journey-split {
      height: 470px;
    }
    .lp-journey-steps-list {
      height: 100%;
      justify-content: space-between;
      gap: 0 !important;
    }
  }

  .lp-journey-mobile-visual {
    display: none;
  }

  @media (max-width: 1024px) {
    .lp-journey-visual-panel {
      display: none !important;
    }
    .lp-journey-steps-list {
      gap: 6px !important;
    }
    .lp-journey-step {
      padding: 10px 14px !important;
    }
    .lp-journey-step-desc {
      display: none !important;
    }
    .lp-journey-step-num {
      width: 32px !important;
      height: 32px !important;
      font-size: 13px !important;
    }
    .lp-step-connector {
      min-height: 8px !important;
    }
    .lp-step-connector-track {
      left: 29px !important; /* aligns with center of 32px circle: 14px padding + 16px half-circle - 1px half-width */
      top: -10px !important;  /* aligns with 10px step padding */
      bottom: -10px !important;
    }
    .lp-journey-mobile-visual {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 16px;
      width: 100%;
      height: 290px;
      background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%);
      border-radius: 16px;
      border: 1px solid rgba(99, 102, 241, 0.18);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      padding: 16px;
      overflow: hidden;
      position: relative;
      backdrop-filter: blur(12px);
      animation: mobile-visual-entrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    html.light .lp-journey-mobile-visual {
      background: radial-gradient(circle at 50% 0%, rgba(79, 70, 229, 0.06) 0%, rgba(255, 255, 255, 0.95) 100%);
      border-color: rgba(79, 70, 229, 0.15);
      box-shadow: 0 8px 24px rgba(79, 70, 229, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6);
    }

    @keyframes mobile-visual-entrance {
      from {
        opacity: 0;
        transform: translateY(-6px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .lp-journey-mobile-visual .jv-india-map-wrapper {
      transform: scale(1.0) translateX(0) translateY(0) !important;
    }

    .lp-journey-mobile-visual .radar-grid {
      transform: translateX(0) translateY(0) !important;
    }

    .lp-journey-mobile-visual .jv-map-stats-overlay {
      width: 105px !important;
      padding: 6px 8px !important;
      top: 8px !important;
      right: 8px !important;
      gap: 3px !important;
    }

    .lp-journey-mobile-visual .jv-map-stats-overlay .overlay-city {
      font-size: 10px !important;
    }

    .lp-journey-mobile-visual .jv-map-stats-overlay .overlay-row {
      font-size: 8.5px !important;
    }

    .lp-journey-mobile-visual .jv-map-stats-overlay .overlay-tag {
      font-size: 7px !important;
    }
  }

  /* Step Connector between steps */
  .lp-step-connector {
    flex-grow: 1;
    min-height: 12px;
    position: relative;
    width: 100%;
    z-index: 0;
  }

  .lp-step-connector-track {
    position: absolute;
    top: -16px; /* align with bottom of preceding circle */
    bottom: -16px; /* align with top of succeeding circle */
    left: 41px; /* center under the 44px circle */
    width: 2px;
    background: rgba(255, 255, 255, 0.05);
    overflow: visible;
  }

  html.light .lp-step-connector-track {
    background: rgba(0, 0, 0, 0.06);
  }

  .lp-step-connector-fill {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0%;
    background: linear-gradient(180deg, var(--accent) 0%, var(--accent-glow) 100%);
    box-shadow: 0 0 8px var(--accent-glow);
    border-radius: 2px;
    transition: height 0.8s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .lp-step-connector.filled .lp-step-connector-fill {
    height: 100%;
  }

  /* Laser light dot cursor */
  .lp-step-connector-fill::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 50%) scale(0);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 8px var(--accent), 0 0 16px var(--accent-glow);
    transition: transform 0.3s ease;
  }

  .lp-step-connector.filled .lp-step-connector-fill::after {
    transform: translate(-50%, 50%) scale(1);
    animation: connector-dot-glow 1.5s ease-in-out infinite;
  }

  @keyframes connector-dot-glow {
    0%, 100% {
      box-shadow: 0 0 6px var(--accent), 0 0 12px var(--accent-glow);
    }
    50% {
      box-shadow: 0 0 12px var(--accent), 0 0 24px var(--accent-glow);
    }
  }

  .lp-journey-step {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px 20px;
    background: rgba(18, 18, 24, 0.6); /* Slightly more solid but premium translucent glass background */
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    z-index: 1;
    backdrop-filter: blur(8px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  html.light .lp-journey-step {
    background: rgba(255, 255, 255, 0.8);
    border-color: var(--border);
  }

  .lp-journey-step:hover {
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(255, 255, 255, 0.15);
  }

  html.light .lp-journey-step:hover {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.12);
  }

  .lp-journey-step-node {
    flex-shrink: 0;
  }

  .lp-journey-step-num {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--bg-elevated);
    border: 2px solid var(--border);
    color: var(--text-3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 800;
    flex-shrink: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .lp-journey-step-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-top: 2px;
  }

  .lp-journey-step-title {
    font-size: 14.5px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.2px;
    transition: all 0.3s ease;
  }

  .lp-journey-step-desc {
    font-size: 12.5px;
    color: var(--text-3);
    line-height: 1.55;
    transition: all 0.3s ease;
  }

  /* Active states */
  .lp-journey-step.active-step {
    background: rgba(99, 102, 241, 0.04);
    border-color: rgba(99, 102, 241, 0.35);
    box-shadow: 0 8px 24px -8px rgba(99, 102, 241, 0.15);
    transform: translateX(4px);
  }

  html.light .lp-journey-step.active-step {
    background: rgba(99, 102, 241, 0.06);
    border-color: rgba(99, 102, 241, 0.4);
    box-shadow: 0 8px 24px -8px rgba(99, 102, 241, 0.25);
  }

  .lp-journey-step.active-step .lp-journey-step-num {
    border-color: var(--accent);
    background: var(--accent);
    color: #fff;
    box-shadow: 0 0 18px var(--accent-glow);
    transform: scale(1.1);
  }

  .lp-journey-step.active-step .lp-journey-step-title {
    color: #fff;
    font-size: 15.5px;
  }

  html.light .lp-journey-step.active-step .lp-journey-step-title {
    color: var(--accent);
  }

  .lp-journey-step.active-step .lp-journey-step-desc {
    color: var(--text-2);
    font-size: 13px;
  }

  /* Timer bar animation */
  .lp-journey-card-timer {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: var(--accent);
    width: 0%;
  }

  .lp-journey-step.active-step .lp-journey-card-timer {
    animation: active-timer-anim 5s linear forwards;
  }

  @keyframes active-timer-anim {
    from { width: 0%; }
    to { width: 100%; }
  }

  /* Showcase Card Visual Elements - Select Location Radar Visual */
  .jv-map-card {
    width: 100%;
    height: 100%;
    position: relative;
    background: radial-gradient(circle at center, rgba(99, 102, 241, 0.04) 0%, transparent 80%);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .radar-grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    transform: translateX(-50px) translateY(15px);
  }

  .radar-line-v {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
    background: linear-gradient(180deg, transparent, rgba(99, 102, 241, 0.18), transparent);
  }

  html.light .radar-line-v {
    background: linear-gradient(180deg, transparent, rgba(99, 102, 241, 0.12), transparent);
  }

  .radar-line-h {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.18), transparent);
  }

  html.light .radar-line-h {
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.12), transparent);
  }

  .radar-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px dashed rgba(99, 102, 241, 0.22);
    border-radius: 50%;
  }

  html.light .radar-circle {
    border-color: rgba(99, 102, 241, 0.15);
  }

  .rc-1 { width: 100px; height: 100px; }
  .rc-2 { width: 200px; height: 200px; }
  .rc-3 { width: 300px; height: 300px; }

  .radar-sweep {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 240px;
    height: 240px;
    background: conic-gradient(from 0deg at 0% 0%, rgba(99, 102, 241, 0.45) 0deg, rgba(99, 102, 241, 0.1) 90deg, transparent 180deg);
    transform-origin: 0% 0%;
    animation: radar-sweep-anim 8s infinite linear;
    z-index: 1;
  }

  html.light .radar-sweep {
    background: conic-gradient(from 0deg at 0% 0%, rgba(99, 102, 241, 0.35) 0deg, rgba(99, 102, 241, 0.08) 90deg, transparent 180deg);
  }

  @keyframes radar-sweep-anim {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }


  /* Stats Overlay Card */
  .jv-map-stats-overlay {
    position: absolute;
    top: 16px;
    right: 16px;
    left: auto;
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--radius);
    padding: 12px;
    width: 140px;
    z-index: 5;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(12px);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  html.light .jv-map-stats-overlay {
    background: rgba(255, 255, 255, 0.92);
    border-color: rgba(0, 0, 0, 0.08);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  }

  .overlay-tag {
    font-size: 8px;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--text-3);
    letter-spacing: 0.05em;
  }

  .overlay-city {
    font-size: 13px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 2px;
  }

  html.light .overlay-city {
    color: var(--text);
  }

  .overlay-row {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
  }

  .overlay-row span {
    color: var(--text-3);
  }

  .overlay-row strong {
    color: var(--text-2);
  }

  html.light .overlay-row strong {
    color: var(--text);
  }

  @keyframes stat-slide-in {
    from { opacity: 0; transform: translateY(6px); filter: blur(2px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
  }

  .overlay-anim {
    animation: stat-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  /* India Map & Wrapper */
  .jv-india-map-wrapper {
    position: relative;
    height: 100%;
    aspect-ratio: 612 / 696;
    margin: 0 auto;
    z-index: 2;
    transform: scale(1.0) translateX(-50px) translateY(15px);
    transform-origin: center;
  }

  @media (max-width: 1024px) {
    .jv-india-map-wrapper {
      transform: scale(0.92) translateX(-50px) translateY(11px);
    }
  }

  .jv-india-svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.45)) drop-shadow(0 0 1px rgba(99, 102, 241, 0.25));
    transition: filter 0.3s ease;
  }

  html.light .jv-india-svg {
    filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.08)) drop-shadow(0 0 1px rgba(79, 70, 229, 0.15));
  }

  .india-map-paths path {
    fill: rgba(30, 41, 59, 0.65);
    stroke: rgba(255, 255, 255, 0.15);
    stroke-width: 0.75px;
    transition: all 0.3s ease;
  }

  html.light .india-map-paths path {
    fill: #f1f5f9;
    stroke: #cbd5e1;
    stroke-width: 0.75px;
  }

  /* Pulsing Map Pins */
  .jv-map-pin {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 3;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .pin-label {
    margin-top: 6px;
    font-size: 10px;
    font-weight: 700;
    color: var(--text-3);
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 2px 6px;
    white-space: nowrap;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  }

  .pin-dot {
    width: 8px;
    height: 8px;
    background: var(--accent);
    border-radius: 50%;
    z-index: 2;
    transition: all 0.3s ease;
  }

  .pin-pulse {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--accent);
    opacity: 0.4;
    z-index: 1;
  }

  @keyframes pin-pulse-anim {
    0% { transform: scale(0.5); opacity: 1; box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.8); }
    70% { opacity: 0.5; }
    100% { transform: scale(3.2); opacity: 0; box-shadow: 0 0 0 16px transparent; }
  }

  .jv-map-pin.active .pin-label {
    color: #fff;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(12px);
    border-color: var(--accent);
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
    transform: translateY(-4px);
  }

  .jv-map-pin.active .pin-dot {
    background: #fff;
    box-shadow: 0 0 12px #fff;
    transform: scale(1.2);
  }

  .jv-map-pin.active .pin-pulse {
    animation: pin-pulse-anim 1.8s infinite cubic-bezier(0.25, 0, 0, 1);
  }

  .jv-tech-card {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
  }

  .jv-tech-flow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
  }

  .jv-tech-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .jv-tech-badge {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 700;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  html.light .jv-tech-badge {
    background: rgba(255, 255, 255, 0.7);
    border-color: rgba(0, 0, 0, 0.08);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  }

  .jv-tech-badge:hover {
    transform: translateY(-2px);
  }

  .jv-tech-badge.shopify {
    border-color: rgba(150, 191, 72, 0.3);
    color: #96bf48;
  }

  .jv-tech-badge.shopify:hover {
    border-color: #96bf48;
    box-shadow: 0 6px 16px rgba(150, 191, 72, 0.2);
  }

  .jv-tech-badge.custom-api {
    border-color: rgba(99, 102, 241, 0.3);
    color: var(--accent);
  }

  .jv-tech-badge.custom-api:hover {
    border-color: var(--accent);
    box-shadow: 0 6px 16px var(--accent-glow);
  }

  .jv-tech-middle {
    flex: 1;
    margin: 0 16px;
    position: relative;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tech-flow-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .flow-path-bg {
    stroke: rgba(99, 102, 241, 0.25);
    stroke-width: 2px;
    stroke-dasharray: 4 4;
  }

  html.light .flow-path-bg {
    stroke: rgba(99, 102, 241, 0.15);
  }

  .flow-path-active {
    stroke-width: 4px;
    stroke-linecap: round;
    stroke-dasharray: 40 180;
    animation: flow-pulse-anim 3s infinite linear;
  }

  .flow-path-active.shopify-pulse {
    stroke: #96bf48;
    filter: drop-shadow(0 0 8px rgba(150, 191, 72, 0.75));
  }

  .flow-path-active.api-pulse {
    stroke: var(--accent);
    animation-delay: 1.5s;
    filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.75));
  }

  @keyframes flow-pulse-anim {
    0% { stroke-dashoffset: 220; }
    100% { stroke-dashoffset: 0; }
  }

  .jv-tech-blitz {
    background: linear-gradient(135deg, var(--accent) 0%, #818cf8 100%);
    color: #fff;
    border-radius: 12px;
    padding: 12px 20px;
    font-size: 13px;
    font-weight: 700;
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.25);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  html.light .jv-tech-blitz {
    background: linear-gradient(135deg, var(--accent) 0%, #6366f1 100%);
    box-shadow: 0 4px 16px rgba(79, 70, 229, 0.25);
  }

  .jv-tech-blitz:hover {
    transform: scale(1.03);
    box-shadow: 0 0 28px var(--accent);
  }

  .jv-tech-blitz::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    transform: rotate(45deg);
    animation: blitz-shimmer 3s infinite linear;
  }

  @keyframes blitz-shimmer {
    0% { transform: translate(-50%, -50%) rotate(45deg); }
    100% { transform: translate(50%, 50%) rotate(45deg); }
  }

  .jv-json {
    background: #06060c;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 12px;
    font-family: monospace;
    font-size: 11px;
    color: #818cf8;
    line-height: 1.4;
  }

  html.light .jv-json {
    background: #f8f9fa;
    color: #3730a3;
  }

  .json-bracket { color: #818cf8; }
  .json-key { color: #818cf8; }
  .json-val { color: #34d399; }
  .json-comment { color: #475569; font-style: italic; }

  html.light .json-bracket { color: #1e293b; }
  html.light .json-key { color: #4338ca; }
  html.light .json-val { color: #047857; }
  html.light .json-comment { color: #64748b; }
  .jv-compliance-card {
    width: 100%;
  }

  .jv-checklist {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .jv-check-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 12px 16px;
  }

  .jv-check-item.checked {
    border-color: rgba(16, 185, 129, 0.3);
    background: rgba(16, 185, 129, 0.02);
  }

  .jv-check-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: bold;
    flex-shrink: 0;
  }

  .jv-check-item.checked .jv-check-icon {
    background: rgba(16, 185, 129, 0.2);
    color: var(--green);
  }

  .jv-check-item.signing .jv-check-icon {
    background: rgba(245, 158, 11, 0.2);
    color: var(--amber);
    animation: jv-pulse-sign 1s infinite alternate;
  }

  @keyframes jv-pulse-sign {
    0% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  .jv-check-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .jv-check-text strong {
    font-size: 13px;
    color: var(--text);
  }

  .jv-check-text span {
    font-size: 11px;
    color: var(--text-3);
  }

  /* ── Inward Inventory — WMS Dashboard ─────────────────────────── */
  .jv-inventory-card {
    width: 100%;
    height: 100%;
    max-height: 380px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    font-family: 'Inter', sans-serif;
  }

  /* --- Header --- */
  .inv-hdr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .inv-hdr-left {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .inv-session-label {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-3);
  }
  .inv-session-id {
    font-size: 13px;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.01em;
  }
  .inv-live-pill {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.14em;
    color: #22d3ee;
    background: rgba(34,211,238,0.08);
    border: 1px solid rgba(34,211,238,0.25);
    border-radius: 20px;
    padding: 4px 10px;
    animation: inv-pill-glow 2s ease-in-out infinite alternate;
  }
  .inv-live-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #22d3ee;
    box-shadow: 0 0 6px #22d3ee;
    animation: inv-live-blink 0.9s infinite alternate;
  }
  @keyframes inv-live-blink {
    from { opacity: 0.3; }
    to   { opacity: 1; }
  }
  @keyframes inv-pill-glow {
    from { box-shadow: none; }
    to   { box-shadow: 0 0 14px rgba(34,211,238,0.2); }
  }

  .inv-body {
    display: grid;
    grid-template-columns: 1fr 110px;
    gap: 10px;
    flex: 1;
    min-height: 140px;
    overflow: hidden;
  }

  /* --- Left: Live scan feed --- */
  .inv-feed-panel {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }
  .inv-feed-title {
    font-size: 8.5px;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--text-3);
  }
  .inv-feed-viewport {
    position: relative;
    flex: 1;
    overflow: hidden;
    border-radius: 8px;
    background: rgba(0,0,0,0.25);
    border: 1px solid rgba(255,255,255,0.05);
  }

  html.light .inv-feed-viewport {
    background: rgba(0, 0, 0, 0.03);
    border-color: rgba(0, 0, 0, 0.06);
  }

  /* scrolling container — duplicate items so it loops */
  .inv-feed-scroll {
    display: flex;
    flex-direction: column;
    animation: inv-scroll-up 12s linear infinite;
  }
  @keyframes inv-scroll-up {
    0%   { transform: translateY(0); }
    100% { transform: translateY(-50%); }
  }
  .inv-scan-row {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 5px 8px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    flex-shrink: 0;
  }

  html.light .inv-scan-row {
    border-bottom-color: rgba(0, 0, 0, 0.05);
  }
  /* mini barcode graphic */
  .inv-barcode {
    display: flex;
    align-items: stretch;
    gap: 1.5px;
    height: 22px;
    flex-shrink: 0;
  }
  .inv-bar {
    display: block;
    background: var(--text-3);
    border-radius: 0.5px;
    flex-shrink: 0;
  }
  .inv-row-info {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }
  .inv-row-brand {
    font-size: 9px;
    font-weight: 700;
    color: var(--text-2);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .inv-row-name {
    font-size: 10px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .inv-row-meta {
    display: flex;
    gap: 5px;
    align-items: center;
    margin-top: 1px;
  }
  .inv-row-sku {
    font-size: 8.5px;
    font-family: 'JetBrains Mono', monospace;
    color: var(--text-3);
    letter-spacing: 0.04em;
  }
  .inv-row-qty {
    font-size: 8.5px;
    font-weight: 700;
    color: #6366f1;
    background: rgba(99,102,241,0.1);
    border-radius: 3px;
    padding: 0px 4px;
  }
  .inv-row-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    flex-shrink: 0;
  }
  .inv-row-check {
    font-size: 9px;
    font-weight: 800;
    color: #22d3ee;
    background: rgba(34,211,238,0.1);
    border-radius: 3px;
    padding: 1px 4px;
  }
  .inv-row-time {
    font-size: 8px;
    font-family: 'JetBrains Mono', monospace;
    color: var(--text-3);
  }
  /* laser scan line over the feed */
  .inv-feed-laser {
    position: absolute;
    left: 0; right: 0;
    height: 1.5px;
    background: linear-gradient(90deg, transparent 0%, #22d3ee 30%, #6366f1 70%, transparent 100%);
    box-shadow: 0 0 10px #22d3ee, 0 0 20px rgba(34,211,238,0.3);
    pointer-events: none;
    animation: inv-laser-v2 2.4s ease-in-out infinite;
    z-index: 4;
  }
  @keyframes inv-laser-v2 {
    0%   { top: 5%;   opacity: 0; }
    8%   { opacity: 1; }
    85%  { top: 92%; opacity: 1; }
    100% { top: 92%; opacity: 0; }
  }
  /* bottom fade on feed */
  .inv-feed-fade {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 36px;
    background: linear-gradient(to bottom, transparent, rgba(8,10,26,0.9));
    pointer-events: none;
    z-index: 3;
  }

  html.light .inv-feed-fade {
    background: linear-gradient(to bottom, transparent, rgba(248, 249, 250, 0.95));
  }

  /* --- Right: Ring + categories --- */
  .inv-ring-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .inv-ring-wrap {
    position: relative;
    width: 86px;
    height: 86px;
    flex-shrink: 0;
  }
  .inv-ring-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  /* background track glow */
  .inv-ring-track {
    filter: none;
  }
  .inv-ring-arc {
    stroke-dasharray: 263.9; /* 2*pi*42 */
    stroke-dashoffset: 263.9;
    animation: inv-arc-fill 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s forwards;
    transform-origin: center;
    transform-box: fill-box;
  }
  @keyframes inv-arc-fill {
    to { stroke-dashoffset: 34.3; } /* 263.9 * 0.13 = 34.3 → 87% filled */
  }
  .inv-ring-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
  }
  .inv-ring-pct {
    font-size: 18px;
    font-weight: 900;
    color: var(--text);
    letter-spacing: -0.04em;
    line-height: 1;
  }
  .inv-ring-sub {
    font-size: 8px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .inv-ring-label {
    font-size: 9px;
    font-weight: 600;
    color: var(--text-3);
    text-align: center;
    line-height: 1.3;
  }

  /* category mini-bars */
  .inv-cats {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
  }
  .inv-cat-row {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .inv-cat-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .inv-cat-name {
    font-size: 8.5px;
    font-weight: 600;
    color: var(--text-3);
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .inv-cat-bar {
    width: 36px;
    height: 3px;
    background: rgba(255,255,255,0.07);
    border-radius: 2px;
    overflow: hidden;
    flex-shrink: 0;
  }

  html.light .inv-cat-bar {
    background: rgba(0, 0, 0, 0.08);
  }
  .inv-cat-fill {
    height: 100%;
    width: 0%;
    border-radius: 2px;
    animation: inv-cat-grow 1.4s ease-out forwards;
  }
  @keyframes inv-cat-grow {
    to { width: var(--w); }
  }
  .inv-cat-pct {
    font-size: 8px;
    font-weight: 700;
    color: var(--text-3);
    flex-shrink: 0;
    min-width: 22px;
    text-align: right;
  }

  /* --- Bottom KPI strip --- */
  .inv-kpi-strip {
    display: grid;
    grid-template-columns: 1fr auto 1fr auto 1fr;
    gap: 0;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 8px;
    overflow: hidden;
  }

  html.light .inv-kpi-strip {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.06);
  }

  .inv-kpi {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 7px 6px;
    gap: 1px;
  }
  .inv-kpi-val {
    font-size: 14px;
    font-weight: 900;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #6366f1, #22d3ee);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .inv-kpi-key {
    font-size: 8.5px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: nowrap;
  }
  .inv-kpi-div {
    width: 1px;
    background: rgba(255,255,255,0.07);
    margin: 6px 0;
  }

  html.light .inv-kpi-div {
    background: rgba(0, 0, 0, 0.06);
  }



  .jv-live-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .jv-live-head {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text);
  }

  .jv-live-status-pulse {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 8px var(--green);
    animation: live-pulse-anim 1s infinite alternate;
  }

  @keyframes live-pulse-anim {
    0% { opacity: 0.4; }
    100% { opacity: 1; }
  }

  .jv-live-eta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .jv-live-eta span {
    font-size: 11px;
    color: var(--text-3);
  }

  .jv-live-eta strong {
    font-size: 24px;
    font-weight: 800;
    color: var(--green);
  }

  .jv-live-route {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 12px 16px;
    position: relative;
    overflow: hidden;
  }

  html.light .jv-live-route {
    background: rgba(0, 0, 0, 0.015);
  }

  .route-node {
    background: var(--surface-2);
    border: 1px solid var(--border);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
  }

  .route-node.source {
    border-color: var(--accent);
  }

  .route-node.dest {
    border-color: var(--green);
  }

  .route-path {
    flex: 1;
    height: 2px;
    margin: 0 10px;
    position: relative;
    background: repeating-linear-gradient(
      to right,
      rgba(255,255,255,0.25) 0 8px,
      transparent 8px 16px
    );
  }

  html.light .route-path {
    background: repeating-linear-gradient(
      to right,
      rgba(0, 0, 0, 0.15) 0 8px,
      transparent 8px 16px
    );
  }

  .route-truck {
    position: absolute;
    top: -12px;
    left: 0;
    font-size: 18px;
    animation: truck-move-anim 3s infinite linear;
  }

  @keyframes truck-move-anim {
    0% { left: 0%; transform: scaleX(-1); }
    45% { left: 95%; transform: scaleX(-1); }
    50% { left: 95%; transform: scaleX(1); }
    95% { left: 0%; transform: scaleX(1); }
    100% { left: 0%; transform: scaleX(-1); }
  }



  /* 6. Forecasting Section */
  .lp-forecast-layout {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 60px;
    align-items: center;
  }

  @media (max-width: 1024px) {
    .lp-forecast-layout {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }

  .lp-forecast-info {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .lp-forecast-tag {
    font-size: 11px;
    font-weight: 600;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .lp-forecast-title-large {
    font-size: 40px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.15;
    background: linear-gradient(135deg, #ffffff 0%, #c7d2fe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  html.light .lp-forecast-title-large {
    background: linear-gradient(135deg, #0f172a 0%, #312e81 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .lp-forecast-desc {
    font-size: 16px;
    color: var(--text-2);
    line-height: 1.6;
  }

  .lp-forecast-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .lp-forecast-list-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: var(--text);
    font-weight: 500;
  }

  .lp-forecast-list-bullet {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
  }

  /* Forecast interactive visual dashboard mock */
  .lp-forecast-visual {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 24px;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    position: relative;
    overflow: hidden;
  }

  .lp-forecast-visual::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%);
    filter: blur(40px);
  }

  .lp-forecast-visual-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 16px;
  }

  .lp-forecast-visual-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .lp-forecast-visual-selector {
    display: flex;
    gap: 6px;
    background: var(--bg-elevated);
    padding: 3px;
    border-radius: 6px;
    border: 1px solid var(--border);
  }

  .lp-forecast-visual-btn {
    border: none;
    background: transparent;
    padding: 4px 8px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-3);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .lp-forecast-visual-btn.active {
    background: var(--accent);
    color: #fff;
  }

  .lp-forecast-insights {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .lp-forecast-stat-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
  }

  .lp-forecast-stat-label {
    font-size: 11px;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 6px;
  }

  .lp-forecast-stat-val {
    font-size: 24px;
    font-weight: 800;
    color: var(--text);
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .lp-forecast-stat-trend {
    font-size: 12px;
    font-weight: 600;
    color: var(--green);
  }

  .lp-forecast-chart {
    height: 130px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 0;
  }

  .lp-forecast-chart-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .lp-forecast-chart-bar-container {
    position: relative;
    width: 100%;
    height: 100px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 4px;
    overflow: hidden;
  }

  .lp-forecast-chart-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-radius: 4px;
    transition: height 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .lp-forecast-chart-bar.actual {
    background: var(--accent);
    opacity: 0.4;
  }

  .lp-forecast-chart-bar.predicted {
    background: linear-gradient(to top, var(--accent) 0%, #818cf8 100%);
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
  }

  .lp-forecast-chart-label {
    font-size: 10px;
    color: var(--text-3);
    font-weight: 500;
  }

  .lp-forecast-chart-legend {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 8px;
  }

  .lp-forecast-legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--text-3);
  }

  .lp-forecast-legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
  }

  .lp-forecast-legend-dot.actual {
    background: var(--accent);
    opacity: 0.4;
  }

  .lp-forecast-legend-dot.predicted {
    background: var(--accent);
  }

  /* 7. Own The Customer Section */
  .lp-own-card {
    background: linear-gradient(135deg, rgba(20, 20, 30, 0.8) 0%, rgba(10, 10, 15, 0.9) 100%);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    overflow: hidden;
    position: relative;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    .lp-own-card {
      grid-template-columns: 1fr;
    }
    .lp-own-side:first-child {
      border-right: none !important;
      border-bottom: 1px solid var(--border);
    }
  }

  .lp-own-side {
    padding: 60px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .lp-own-side:first-child {
    border-right: 1px solid var(--border);
  }

  .lp-own-side-head {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .lp-own-side-tag {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .lp-own-side-tag.red {
    color: var(--red);
  }

  .lp-own-side-tag.green {
    color: var(--green);
  }

  .lp-own-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .lp-own-list-item {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .lp-own-list-item.red {
    color: var(--text-3);
    text-decoration: line-through;
    opacity: 0.45;
  }

  .lp-own-list-item.green {
    background: linear-gradient(135deg, #ffffff 0%, #c7d2fe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  html.light .lp-own-list-item.green {
    background: linear-gradient(135deg, #0f172a 0%, #312e81 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* 8. Final CTA Section */
  .lp-final-cta-section {
    padding-bottom: 140px;
  }

  .lp-final-cta-card {
    background: radial-gradient(circle at center top, rgba(99, 102, 241, 0.1) 0%, rgba(255, 255, 255, 0.01) 80%);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 80px 40px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
  }

  .lp-final-cta-title {
    font-size: 44px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.15;
    background: linear-gradient(135deg, #ffffff 0%, #c7d2fe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    max-width: 600px;
  }

  html.light .lp-final-cta-title {
    background: linear-gradient(135deg, #0f172a 0%, #312e81 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .lp-final-cta-desc {
    font-size: 18px;
    color: var(--text-2);
    max-width: 600px;
    line-height: 1.5;
  }
}
`;

const DOCUMENTS = [
  { id: "gst", name: "GST certificate", sub: "PDF format", req: true },
  { id: "pan", name: "PAN card", sub: "PDF or JPG", req: true },
  { id: "reg", name: "Company registration", sub: "PDF format", req: false },
  { id: "cat", name: "Product catalog", sub: "Excel (.xlsx)", req: false },
  { id: "fssai", name: "FSSAI license", sub: "For F&B brands", req: false },
];

const DS_CHIPS = ["Blinkit", "Swiggy Instamart", "Zepto", "Other", "None — first time"];
const CHALLENGE_CHIPS = ["High delivery cost", "Slow delivery speed", "Inventory & ops management", "Lack of city expansion", "Low order volume"];

const STEPS = [
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
  Sun: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Moon: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Store: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
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
  Support: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  Home: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
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

function buildFloorSvg(r, theme) {
  const isLight = theme === 'light';
  const rectW = BIN.L * VIZ_SCALE, rectH = BIN.W * VIZ_SCALE;
  const x0 = (180 - rectW) / 2, y0 = (110 - rectH) / 2;
  const cellW = r.fit.ol * VIZ_SCALE, cellH = r.fit.ow * VIZ_SCALE;
  const cellFill = isLight ? "rgba(79, 70, 229, 0.16)" : "rgba(99, 102, 241, 0.34)";
  const cellStroke = isLight ? "#4f46e5" : "#818cf8";
  let cells = '';
  for (let i = 0; i < r.fit.cL; i++) {
    for (let j = 0; j < r.fit.cW; j++) {
      cells += `<rect x="${x0 + i * cellW + 1.5}" y="${y0 + j * cellH + 1.5}" width="${cellW - 3}" height="${cellH - 3}" rx="3" fill="${cellFill}" stroke="${cellStroke}" stroke-width="1"/>`;
    }
  }
  const usedW = r.fit.cL * cellW, usedH = r.fit.cW * cellH;
  let hatch = '';
  const hasUnused = (rectW - usedW > VIZ_UNUSED_VISIBLE_PX) || (rectH - usedH > VIZ_UNUSED_VISIBLE_PX);
  const hatchLineColor = isLight ? "rgba(15,23,42,0.12)" : "rgba(255,255,255,0.12)";
  const hatchBgColor = isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.03)";
  const rectStrokeColor = isLight ? "rgba(15,23,42,0.18)" : "#3A3B47";

  if (usedW < rectW - 0.5) hatch += `<rect x="${x0 + usedW}" y="${y0}" width="${rectW - usedW}" height="${rectH}" fill="url(#hF)"/>`;
  if (usedH < rectH - 0.5) hatch += `<rect x="${x0}" y="${y0 + usedH}" width="${rectW}" height="${rectH - usedH}" fill="url(#hF)"/>`;
  const svg = `<defs><pattern id="hF" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="${hatchBgColor}"/><line x1="0" y1="0" x2="0" y2="6" stroke="${hatchLineColor}" stroke-width="1.4"/></pattern></defs>
  <rect x="${x0}" y="${y0}" width="${rectW}" height="${rectH}" rx="6" fill="none" stroke="${rectStrokeColor}" stroke-width="1.5"/>${hatch}${cells}`;
  return { svg, hasUnused };
}

function buildStackSvg(r, theme) {
  const isLight = theme === 'light';
  const rectW = BIN.L * VIZ_SCALE, rectH = BIN.H * VIZ_SCALE;
  const x0 = (180 - rectW) / 2, y0 = (110 - rectH) / 2;
  const layerH = r.fit.oh * VIZ_SCALE;
  let layers = '';
  for (let i = 0; i < r.fit.cH; i++) {
    const ly = y0 + rectH - (i + 1) * layerH;
    const op = Math.min(0.85, 0.30 + i * 0.09);
    const fillAlpha = isLight ? op * 0.85 : op;
    const layerFill = isLight ? `rgba(5, 150, 105, ${fillAlpha})` : `rgba(16, 185, 129, ${op})`;
    const layerStroke = isLight ? "#059669" : "#10b981";
    layers += `<rect x="${x0 + 2}" y="${ly + 1.5}" width="${rectW - 4}" height="${layerH - 3}" rx="3" fill="${layerFill}" stroke="${layerStroke}" stroke-width="1"/>`;
  }
  const usedH = r.fit.cH * layerH;
  const hasUnused = rectH - usedH > VIZ_UNUSED_VISIBLE_PX;
  const hatchLineColor = isLight ? "rgba(15,23,42,0.12)" : "rgba(255,255,255,0.12)";
  const hatchBgColor = isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.03)";
  const rectStrokeColor = isLight ? "rgba(15,23,42,0.18)" : "#3A3B47";

  const hatch = (usedH < rectH - 0.5) ? `<rect x="${x0}" y="${y0}" width="${rectW}" height="${rectH - usedH}" fill="url(#hS)"/>` : '';
  const svg = `<defs><pattern id="hS" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="${hatchBgColor}"/><line x1="0" y1="0" x2="0" y2="6" stroke="${hatchLineColor}" stroke-width="1.4"/></pattern></defs>
  <rect x="${x0}" y="${y0}" width="${rectW}" height="${rectH}" rx="6" fill="none" stroke="${rectStrokeColor}" stroke-width="1.5"/>${hatch}${layers}`;
  return { svg, hasUnused };
}

function buildIsoBin(r, theme) {
  const isLight = theme === 'light';
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

  const gFrStart = isLight ? '#cbd5e1' : '#1e1b4b';
  const gFrEnd = isLight ? '#f1f5f9' : '#111029';
  const gRtStart = isLight ? '#94a3b8' : '#141230';
  const gRtEnd = isLight ? '#cbd5e1' : '#0a091d';
  const gTpStart = isLight ? '#cbd5e1' : '#312e81';
  const gTpEnd = isLight ? '#e2e8f0' : '#1e1b4b';

  const oFrStart = isLight ? '.18' : '.92';
  const oFrEnd = isLight ? '.08' : '.9';
  const oRtStart = isLight ? '.20' : '.94';
  const oRtEnd = isLight ? '.10' : '.92';
  const oTpStart = isLight ? '.25' : '.45';
  const oTpEnd = isLight ? '.12' : '.28';

  const bottomFill = isLight ? '#e2e8f0' : '#0d0c18';
  const bottomStroke = isLight ? '#cbd5e1' : '#1e1b4b';
  const shadowOpacity = isLight ? '0.12' : '0.7';
  const floodColor = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(0,0,0,0.65)';
  const dimensionsColor = isLight ? 'rgba(79,70,229,0.85)' : 'rgba(129,140,248,0.45)';

  const binFrontStroke = isLight ? 'rgba(79,70,229,0.30)' : 'rgba(99,102,241,0.42)';
  const binRightStroke = isLight ? 'rgba(79,70,229,0.25)' : 'rgba(99,102,241,0.36)';
  const binTopStroke = isLight ? 'rgba(79,70,229,0.40)' : 'rgba(129,140,248,.52)';
  const wireframesColor = isLight ? 'rgba(79,70,229,0.28)' : 'rgba(129,140,248,0.52)';

  const PALETTES = isLight ? [
    ['rgba(79, 70, 229, 0.72)', 'rgba(67, 56, 202, 0.85)', 'rgba(199, 210, 254, 0.8)'], // Clean Indigo
    ['rgba(5, 150, 105, 0.65)', 'rgba(4, 120, 87, 0.78)', 'rgba(209, 250, 229, 0.75)'], // Forest Green
    ['rgba(217, 119, 6, 0.65)', 'rgba(180, 83, 9, 0.78)', 'rgba(254, 243, 199, 0.75)'], // Warm Amber
  ] : [
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
        const topStrokeColor = isLight ? 'rgba(79,70,229,0.18)' : 'rgba(255,255,255,0.2)';
        const blockBorderColor = isLight ? 'rgba(0,0,0,0.08)' : pal[2];
        blocks += `<g style="animation:fadeUp .4s ease ${delay}s both">
        ${poly(ff, pal[0], blockBorderColor)}${poly(rf, pal[1], blockBorderColor)}${poly(tf, pal[2], topStrokeColor)}
      </g>`;
        idx++;
      }
    }
  }

  return `
  <defs>
    <filter id="bsh"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="${floodColor}"/></filter>
    <linearGradient id="gFr" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${gFrStart}" stop-opacity="${oFrStart}"/><stop offset="100%" stop-color="${gFrEnd}" stop-opacity="${oFrEnd}"/></linearGradient>
    <linearGradient id="gRt" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${gRtStart}" stop-opacity="${oRtStart}"/><stop offset="100%" stop-color="${gRtEnd}" stop-opacity="${oRtEnd}"/></linearGradient>
    <linearGradient id="gTp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${gTpStart}" stop-opacity="${oTpStart}"/><stop offset="100%" stop-color="${gTpEnd}" stop-opacity="${oTpEnd}"/></linearGradient>
  </defs>
  <g filter="url(#bsh)" opacity="${shadowOpacity}">
    <path d="M${pt(p00)} L${pt(p10)} L${pt(p11)} L${pt(p01)} Z" fill="${bottomFill}" stroke="${bottomStroke}" stroke-width="1"/>
    <path d="M${pt(p00)} L${pt(p01)} L${pt(p01h)} L${pt(p00h)} Z" fill="${bottomFill}" stroke="${bottomStroke}" stroke-width="1"/>
  </g>
  ${blocks}
  <path d="${fFront}" fill="url(#gFr)" stroke="${binFrontStroke}" stroke-width="1.3"/>
  <path d="${fRight}" fill="url(#gRt)" stroke="${binRightStroke}" stroke-width="1.3"/>
  <path d="${fTop}" fill="url(#gTp)" stroke="${binTopStroke}" stroke-width="1.3"/>
  <line x1="${p00.x}" y1="${p00.y}" x2="${p10.x}" y2="${p10.y}" stroke="${wireframesColor}" stroke-width="1.2"/>
  <line x1="${p10.x}" y1="${p10.y}" x2="${p11.x}" y2="${p11.y}" stroke="${wireframesColor}" stroke-width="1.2"/>
  <line x1="${p00h.x}" y1="${p00h.y}" x2="${p10h.x}" y2="${p10h.y}" stroke="${wireframesColor}" stroke-width="1.4"/>
  <line x1="${p10h.x}" y1="${p10h.y}" x2="${p11h.x}" y2="${p11h.y}" stroke="${wireframesColor}" stroke-width="1.4"/>
  <line x1="${p11h.x}" y1="${p11h.y}" x2="${p01h.x}" y2="${p01h.y}" stroke="${wireframesColor}" stroke-width="1.2"/>
  <line x1="${p00h.x}" y1="${p00h.y}" x2="${p01h.x}" y2="${p01h.y}" stroke="${wireframesColor}" stroke-width="1.2"/>
  <line x1="${p10.x}" y1="${p10.y}" x2="${p10h.x}" y2="${p10h.y}" stroke="${wireframesColor}" stroke-width="1.3"/>
  <line x1="${p11.x}" y1="${p11.y}" x2="${p11h.x}" y2="${p11h.y}" stroke="${wireframesColor}" stroke-width="1.3"/>
  <line x1="${p00.x}" y1="${p00.y}" x2="${p00h.x}" y2="${p00h.y}" stroke="${wireframesColor}" stroke-width="1.1"/>
  <text x="${OX}" y="${OY + 24}" text-anchor="middle" font-family="monospace" font-size="10" fill="${dimensionsColor}" letter-spacing=".05em">${BIN.L} x ${BIN.W} x ${BIN.H} cm</text>`;
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

const SelectLocationVisual = ({ theme }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const cities = [
    { name: "Delhi NCR", class: "del", x: 30.5, y: 30.3, pods: "2500+", space: "19%", stateId: "dl" },
    { name: "Bengaluru", class: "blr", x: 32.4, y: 79.8, pods: "2500+", space: "23%", stateId: "ka" },
    { name: "Mumbai", class: "bom", x: 16.2, y: 59.6, pods: "1500+", space: "16%", stateId: "mh" },
    { name: "Kolkata", class: "ccu", x: 69.1, y: 48.0, pods: "500+", space: "30%", stateId: "wb" },
    { name: "Patna", class: "pat", x: 58.1, y: 44.0, pods: "300+", space: "0%", stateId: "br" },
    { name: "Hyderabad", class: "hyd", x: 35.4, y: 65.2, pods: "400+", space: "13%", stateId: "tg" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % cities.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const activeRadarCity = cities[activeIdx];

  return (
    <div className="jv-map-card">
      <div className="radar-grid">
        <div className="radar-line-v"></div>
        <div className="radar-line-h"></div>
        <div className="radar-circle rc-1"></div>
        <div className="radar-circle rc-2"></div>
        <div className="radar-circle rc-3"></div>
      </div>

      <div className="jv-map-stats-overlay">
        <div className="overlay-tag">⚡ Live Status</div>
        <div className="overlay-city overlay-anim" key={activeRadarCity.name}>{activeRadarCity.name}</div>
        <div className="overlay-row overlay-anim" key={activeRadarCity.name + "-pods"}>
          <span>Pods Live</span>
          <strong>{activeRadarCity.pods}</strong>
        </div>
        <div className="overlay-row overlay-anim" key={activeRadarCity.name + "-space"}>
          <span>Space Avail.</span>
          <strong style={{ color: 'var(--accent)' }}>{activeRadarCity.space}</strong>
        </div>
      </div>

      <div className="jv-india-map-wrapper">
        <IndiaMapSVG
          className="jv-india-svg"
          activeStateId={activeRadarCity.stateId}
        />
        {cities.map((c, index) => {
          const isActive = activeIdx === index;
          return (
            <div
              key={c.name}
              className={`jv-map-pin pin-${c.class} ${isActive ? "active" : ""}`}
              style={{
                position: "absolute",
                left: `${c.x}%`,
                top: `${c.y}%`,
                transform: "translate(-50%, -50%)"
              }}
            >
              <span className="pin-pulse"></span>
              <span className="pin-dot"></span>
              <span className="pin-label">{c.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function DarkStoreOnboarding() {
  const [step, setStep] = useState(0);
  const [specialistOrigin, setSpecialistOrigin] = useState(0);
  const [forecastTab, setForecastTab] = useState("sku"); // 'sku', 'city', 'restock'
  const [journeyHoverStep, setJourneyHoverStep] = useState(null);
  const [journeyAutoStep, setJourneyAutoStep] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [simulationData, setSimulationData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [syncTime, setSyncTime] = useState(new Date().toLocaleTimeString());
  const [orderCount, setOrderCount] = useState(1425);

  useEffect(() => {
    const timer = setInterval(() => {
      setSyncTime(new Date().toLocaleTimeString());
      setOrderCount((prev) => prev + Math.floor(Math.random() * 2) + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (journeyHoverStep !== null) return;
    const interval = setInterval(() => {
      setJourneyAutoStep((prev) => (prev + 1) % 5);
    }, 5000);
    return () => clearInterval(interval);
  }, [journeyHoverStep]);
  const [applicationId, setApplicationId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [allocatedShelves, setAllocatedShelves] = useState([]);

  // Smart Capacity Recommender State
  const [isRecommenderOpen, setIsRecommenderOpen] = useState(false);
  const [recommenderItems, setRecommenderItems] = useState([
    { id: 1, emoji: '🥤', name: '500 ml Juice Carton', l: 9, w: 9, h: 24, wt: 0.6, qty: 200, upright: true },
    { id: 2, emoji: '🍚', name: '5 kg Rice Bag', l: 30, w: 20, h: 8, wt: 5, qty: 40, upright: false },
    { id: 3, emoji: '🫙', name: '1 L Cooking Oil Bottle', l: 8, w: 8, h: 27, wt: 1, qty: 150, upright: true },
    { id: 4, emoji: '🧴', name: '200 ml Shampoo Bottle', l: 5, w: 5, h: 18, wt: 0.3, qty: 300, upright: true },
    { id: 5, emoji: '🍫', name: 'Chocolate Biscuit Pack', l: 20, w: 12, h: 4, wt: 0.4, qty: 120, upright: false },
    { id: 6, emoji: '🧻', name: '6-Roll Tissue Pack', l: 22, w: 11, h: 11, wt: 0.5, qty: 80, upright: false },
  ]);
  const [nextItemId, setNextItemId] = useState(7);
  const [vizItemId, setVizItemId] = useState(null);
  const [isPeekOpen, setIsPeekOpen] = useState(false);

  // Lock page body scroll when modal is open to ensure only the modal body scrolls
  useEffect(() => {
    if (isRecommenderOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isRecommenderOpen]);

  // Auto-scroll the modal overlay to align the Peek accordion trigger when expanded
  useEffect(() => {
    if (isPeekOpen && vizItemId) {
      setTimeout(() => {
        const overlay = document.querySelector(".recommender-modal-overlay");
        const triggerEl = document.querySelector(".bin-peek-trigger");
        if (overlay && triggerEl) {
          const overlayRect = overlay.getBoundingClientRect();
          const triggerRect = triggerEl.getBoundingClientRect();
          const targetScrollTop = overlay.scrollTop + (triggerRect.top - overlayRect.top) - 16; // 16px padding from top
          overlay.scrollTo({
            top: targetScrollTop,
            behavior: "smooth"
          });
        }
      }, 300);
    }
  }, [isPeekOpen, vizItemId]);

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
  const [city, setCity] = useState([]);
  const [browseCity, setBrowseCity] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

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
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [ordersCount, setOrdersCount] = useState(120);

  const totalSteps = 3;
  const pct = step <= 2 ? 50 : 100;

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
    if (step === 2 && !browseCity) {
      if (city && city.length > 0) {
        setBrowseCity(city[0]);
      } else if (cities && cities.length > 0) {
        setBrowseCity(cities[0].name);
      }
    }
  }, [step, city, cities, browseCity]);

  useEffect(() => {
    if (cart.length === 0) {
      setDisclaimerAgreed(false);
    }
  }, [cart.length]);

  useEffect(() => {
    if (!isCityDropdownOpen) return;
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".custom-select-trigger") && !e.target.closest(".custom-select-dropdown")) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isCityDropdownOpen]);

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

  useEffect(() => {
    if (step !== 0) return;
    const interval = setInterval(() => {
      setOrdersCount((prev) => {
        const increment = Math.floor(Math.random() * 3) + 1;
        return prev + increment;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [step]);

  const handleCityToggle = (cityName) => {
    setCity((prev) => {
      const nextCities = prev.includes(cityName)
        ? prev.filter((c) => c !== cityName)
        : [...prev, cityName];

      // Filter cart to only keep items from selected cities
      setCart((prevCart) => prevCart.filter((item) => nextCities.includes(item.city)));

      // If the currently browsed city was deselected, switch to the first remaining city
      if (browseCity === cityName && !nextCities.includes(cityName)) {
        setBrowseCity(nextCities[0] || "");
      }

      return nextCities;
    });
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
      if (!city || city.length === 0) next.city = "Please select at least one city";
      if (!orders) next.orders = "Please select expected daily orders";
    }

    if (n === 2) {
      if (cart.length === 0) next.cart = "Add at least one store with racks to checkout";
    }

    if (n === 3) {
      if (!brandName.trim()) next.brandName = "Brand name is required";
      if (!poc.trim()) next.poc = "Point of contact is required";
      if (!phone.trim()) next.phone = "Mobile number is required";
      else if (!isValidMobileNumber(phone)) next.phone = "Enter a valid 10-digit mobile number";
      if (!email.trim()) next.email = "Email address is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email address";
      if (!orders) next.orders = "Please select expected daily orders";

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
    if (step === 1 && city && city.length > 0) setBrowseCity(city[0]);
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
        setStep(4);
      } else {
        alert("Verification failed: " + result.error);
      }
    } catch (err) {
      alert("Verification failed: " + err.message);
    }
  };

  const handleCheckoutPayment = async () => {
    const step3Errors = validateStep(3);
    if (Object.keys(step3Errors).length > 0) {
      setErrors(step3Errors);
      setShowStepError(true);
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

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        if (orderDetails.isMock) {
          // If script fails (e.g. offline/blocked), fall back to the offline simulation modal
          setSimulationData(orderDetails);
        } else {
          alert("Failed to load Razorpay SDK. Check your internet connection.");
          return;
        }
      } else {
        const options = {
          key: orderDetails.keyId,
          amount: orderDetails.amount,
          currency: "INR",
          name: "Blitz MiniPods",
          description: `Shelf Booking for ${brandName}`,
          handler: async function (res) {
            try {
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: res.razorpay_order_id || orderDetails.orderId || "",
                  razorpay_payment_id: res.razorpay_payment_id,
                  razorpay_signature: res.razorpay_signature || "mock_sig_12345",
                  applicationId: orderDetails.applicationId,
                  isMock: orderDetails.isMock,
                }),
              });

              const verification = await safeJsonFromResponse(verifyRes);
              if (verification.success) {
                setApplicationId(orderDetails.applicationId);
                setRefreshKey((prev) => prev + 1);
                setStep(4);
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

        if (!orderDetails.isMock && orderDetails.orderId) {
          options.order_id = orderDetails.orderId;
        }

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

  const resetLeadForm = () => {
    setBrandName("");
    setPoc("");
    setPhone("");
    setEmail("");
    setCity([]);
    setOrders("");
    setWeight("");
    setDsChips([]);
    setChalChips([]);
    setErrors({});
    setShowStepError(false);
  };

  const handleSpecialistCallSubmit = async () => {
    const stepErrors = validateStep(1);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setShowStepError(true);
      return;
    }

    try {
      const response = await fetch("/api/specialist-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          poc,
          phone,
          email,
          city,
          orders,
          weight,
          dsChips,
          chalChips,
          website,
          instagram,
          linkedin,
          youtube,
        }),
      });

      const result = await safeJsonFromResponse(response);
      if (result.success) {
        setLeadSubmitted(true);
        setErrors({});
        setShowStepError(false);
      } else {
        alert("Submission failed: " + result.error);
      }
    } catch (err) {
      alert("Failed to submit request: " + err.message);
    }
  };

  const renderStandaloneBrandForm = () => {
    if (leadSubmitted) {
      return (
        <div className="lead-success-wrap">
          <div className="lead-success-card">
            <div className="lead-success-icon">
              <Icon.Check />
            </div>
            <h2>Call Request Received!</h2>
            <p className="lead-success-desc">
              Thank you for sharing your requirements. A sales specialist from <strong>Blitz MiniPods</strong> will reach out to you at <strong>{email}</strong> or <strong>{phone}</strong> within 24 hours to book a specialist call.
            </p>
            <div className="lead-success-details">
              <div className="lead-detail-row">
                <span>Brand</span>
                <strong>{brandName}</strong>
              </div>
              <div className="lead-detail-row">
                <span>Contact</span>
                <strong>{poc}</strong>
              </div>
            </div>
            <button className="btn btn-primary btn-success-home" onClick={() => { setStep(specialistOrigin); setLeadSubmitted(false); resetLeadForm(); }}>
              {specialistOrigin === 2 ? "Back to Store Selection" : specialistOrigin === 3 ? "Back to Verification" : <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", justifyContent: "center" }}><Icon.Home /> Back to Home</span>}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="standalone-wrap">
        <header className="standalone-header">
          <div className="standalone-brand" onClick={() => setStep(0)} style={{ cursor: "pointer" }}>
            <img src="/Logo.png" alt="Logo" className="standalone-logo" />
            <div>
              <div className="standalone-brand-name">Blitz MiniPods</div>
              <div className="standalone-brand-tag">Talk to a specialist</div>
            </div>
          </div>
          {renderHeaderActions("standalone-actions-wrap")}
        </header>

        <main className="standalone-main">
          <div className="standalone-form-card">
            <div className="standalone-form-head">
              <h2>Share your brand requirements</h2>
              <p>Fill in this quick form to schedule a call with our enterprise sales and deployment team.</p>
            </div>

            {showStepError && Object.keys(errors).length > 0 && (
              <div className="step-error-banner" style={{ marginBottom: 20 }}>
                Please fill in all required fields to submit your request.
              </div>
            )}

            {renderPage1()}

            <div className="standalone-form-foot">
              <button className="btn btn-ghost" onClick={() => setStep(specialistOrigin)}>Cancel</button>
              <button className="btn btn-primary btn-submit-lead" onClick={handleSpecialistCallSubmit}>
                Request a Call <Icon.ArrowRight />
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  };

  const renderLandingPage = () => {
    return (
      <div className="lp-wrap">
        {/* Header */}
        <header className="lp-header">
          <div className="lp-brand" onClick={() => setStep(0)} style={{ cursor: "pointer" }}>
            <img src="/Logo.png" alt="Logo" className="lp-brand-logo" />
            <div className="lp-brand-text">
              <span className="lp-brand-name">Blitz MiniPods</span>
              <span className="lp-brand-tag">One Stop Solution for Quick Commerce</span>
            </div>
          </div>
          {renderHeaderActions("lp-actions-wrap")}
        </header>

        {/* Hero Section */}
        <div className="lp-body">
          {/* Left Column */}
          <div className="lp-content-left">
            <div className="lp-badge">
              17 MiniPods live across 5 cities
            </div>
            <h1 className="lp-title">
              Your Brand.<br />
              <span className="accent">Every City.</span><br />
              Zero Infrastructure.
            </h1>
            <p className="lp-desc">
              Launch 60-minute to same-day delivery across India without investing in warehouses, operations teams, or infrastructure.
            </p>

            {/* Metrics */}
            <div className="lp-metrics">
              <div className="lp-metric-item">
                <span className="lp-metric-val">17</span>
                <span className="lp-metric-lbl">MiniPods Live</span>
              </div>
              <div className="lp-metric-item">
                <span className="lp-metric-val">99.5%</span>
                <span className="lp-metric-lbl">Inventory Accuracy</span>
              </div>
              <div className="lp-metric-item">
                <span className="lp-metric-val">7 days</span>
                <span className="lp-metric-lbl">Go Live In 7 Days</span>
              </div>
              <div className="lp-metric-item">
                <span className="lp-metric-val">99.8%</span>
                <span className="lp-metric-lbl">Fulfillment Accuracy</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="lp-actions">
              <button className="btn-check-availability" onClick={() => { setStep(2); setBrowseCity("Delhi"); }}>
                Calculate My Coverage <Icon.ArrowRight />
              </button>
              <button className="btn-talk-specialist" onClick={() => { setSpecialistOrigin(0); setStep(1); }}>
                Talk To Our Team
              </button>
            </div>

          </div>

          {/* Right Column - Bengaluru 3D Folding Map Animation */}
          <div className="lp-graphic-container">
            <Bengaluru3DMap />
          </div>
        </div>

        {/* 2. TRUST SECTION */}
        <section className="lp-trust-section">
          <h2 className="lp-trust-title">Trusted By Brands Already Growing With Blitz</h2>
          <div className="lp-trust-logos">
            <span className="lp-trust-chip">Nykaa</span>
            <span className="lp-trust-chip">Foxtale</span>
            <span className="lp-trust-chip">HealthKart</span>
            <span className="lp-trust-chip">Ajio</span>
            <span className="lp-trust-chip">Myntra</span>
            <span className="lp-trust-chip">Durlabh Darshan</span>
          </div>
        </section>

        {/* 5. QUICK COMMERCE JOURNEY */}
        <section className="lp-section">
          <div className="lp-section-header">
            <h2 className="lp-section-title">Your Journey To Quick Commerce</h2>
            <p className="lp-section-subtitle">A seamless onboarding lifecycle designed to launch your brand live in days.</p>
          </div>
          <div className="lp-journey-split">
            <div className="lp-journey-visual-panel">
              {renderJourneyVisual(journeyHoverStep !== null ? journeyHoverStep : journeyAutoStep)}
            </div>

            <div className="lp-journey-steps-list">
              {[
                { step: 1, title: "Select Stores", desc: "Choose the right Dark Stores & MiniPods based on your requirements." },
                { step: 2, title: "Tech Integration", desc: "Seamlessly integrate your OMS, WMS & APIs for real-time operations." },
                { step: 3, title: "Compliance & Setup", desc: "Complete all legal requirements to become launch-ready." },
                { step: 4, title: "Send Inventory", desc: "Stock inventory based on our AI-powered forecast recommendations." },
                { step: 5, title: "Go Live", desc: "Start accepting orders & deliver to customers at lightning speed." }
              ].map((j, idx, arr) => {
                const activeIdx = journeyHoverStep !== null ? journeyHoverStep : journeyAutoStep;
                const isActive = activeIdx === idx;
                const isCompleted = activeIdx > idx;
                return (
                  <Fragment key={idx}>
                    <div
                      className={`lp-journey-step ${isActive ? "active-step" : ""} ${isCompleted ? "completed-step" : ""}`}
                      onMouseEnter={() => { setJourneyHoverStep(idx); setJourneyAutoStep(idx); }}
                      onMouseLeave={() => setJourneyHoverStep(null)}
                    >
                      <div className="lp-journey-step-node">
                        <div className="lp-journey-step-num">{j.step}</div>
                      </div>
                      <div className="lp-journey-step-content">
                        <h3 className="lp-journey-step-title">{j.title}</h3>
                        {j.desc && <p className="lp-journey-step-desc">{j.desc}</p>}
                        <div className="lp-journey-card-timer"></div>
                        {isActive && (
                          <div className="lp-journey-mobile-visual">
                            {renderJourneyVisual(idx)}
                          </div>
                        )}
                      </div>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className={`lp-step-connector ${isCompleted ? "filled" : ""}`}>
                        <div className="lp-step-connector-track">
                          <div className="lp-step-connector-fill" />
                        </div>
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </section>

        <hr className="lp-divider" />

        {/* 3. WHY BRANDS CHOOSE MINIPODS */}
        <section className="lp-section">
          <div className="lp-section-header">
            <h2 className="lp-section-title">Why Leading D2C Brands Choose MiniPods</h2>
            <p className="lp-section-subtitle">Quick commerce infrastructure built for brands, not marketplaces.</p>
          </div>
          <div className="lp-why-grid">
            {[
              {
                icon: '🚀',
                accent: '#6366f1',
                metric: '7 Days to Live',
                title: 'Launch in Days',
                desc: 'Skip the cost & complexity of dark stores. Start selling in just 7 days.',
              },
              {
                icon: '🌏',
                accent: '#22d3ee',
                metric: 'All Major Metros',
                title: 'Expand Without Limits',
                desc: 'Launch in all major metros without any Capex or warehouse leases.',
              },
              {
                icon: '📊',
                accent: '#a78bfa',
                metric: 'Blitz AI Forecast',
                title: 'Stock Where Demand Is',
                desc: 'AI keeps the right inventory in the right MiniPods at the right time.',
              },
              {
                icon: '⚡',
                accent: '#fbbf24',
                metric: '60-Min Delivery',
                title: 'Deliver at QCom Speed',
                desc: 'Enable 60-min, 2-hr, same-day & next-day delivery from one network.',
              },
              {
                icon: '👑',
                accent: '#f472b6',
                metric: '0% Commission',
                title: 'Own Your Brand & Customer',
                desc: 'Sell directly from your website without marketplace commissions.',
              },
              {
                icon: '📈',
                accent: '#34d399',
                metric: 'Scale with Growth',
                title: 'Scale Only When You Grow',
                desc: 'Start with a few MiniPods and expand effortlessly as demand rises.',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="lp-why-card"
                style={{ '--why-accent': card.accent }}
              >
                <div className="lp-why-icon-wrap">
                  <span className="lp-why-icon-ring"></span>
                  <span style={{ fontSize: '26px', lineHeight: 1 }}>{card.icon}</span>
                </div>
                <div className="lp-why-metric">
                  <span className="lp-why-metric-dot"></span>
                  {card.metric}
                </div>
                <h3 className="lp-why-card-title">{card.title}</h3>
                <p className="lp-why-card-desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="lp-divider" />

        {/* 4. MARKETPLACE VS MINIPODS */}
        <section className="lp-section">
          <div className="lp-section-header">
            <h2 className="lp-section-title">Why Build Your Brand On Someone Else's Shelf?</h2>
            <p className="lp-section-subtitle">Take control of your quick commerce fulfillment, margins, and customer data.</p>
          </div>
          <div className="lp-compare-table-container">
            <table className="lp-compare-table">
              <thead>
                <tr>
                  <th className="lp-compare-th">Fulfillment Dimension</th>
                  <th className="lp-compare-th">Marketplace Model</th>
                  <th className="lp-compare-th lp-compare-highlight">Blitz MiniPods</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="lp-compare-td" style={{ fontWeight: 600 }}>Listing Fees</td>
                  <td className="lp-compare-td">
                    <span className="lp-compare-item-wrap"><i className="lp-compare-cross">✖</i> ₹25,000 listing fees</span>
                  </td>
                  <td className="lp-compare-td lp-compare-highlight">
                    <span className="lp-compare-item-wrap"><i className="lp-compare-check">✔</i> No listing fees</span>
                  </td>
                </tr>
                <tr>
                  <td className="lp-compare-td" style={{ fontWeight: 600 }}>Storage Model</td>
                  <td className="lp-compare-td">
                    <span className="lp-compare-item-wrap"><i className="lp-compare-cross">✖</i> High storage charges &amp; trial periods</span>
                  </td>
                  <td className="lp-compare-td lp-compare-highlight">
                    <span className="lp-compare-item-wrap"><i className="lp-compare-check">✔</i> Shelf-based pricing</span>
                  </td>
                </tr>
                <tr>
                  <td className="lp-compare-td" style={{ fontWeight: 600 }}>Delisting Risk</td>
                  <td className="lp-compare-td">
                    <span className="lp-compare-item-wrap"><i className="lp-compare-cross">✖</i> Constant risk of sudden delisting</span>
                  </td>
                  <td className="lp-compare-td lp-compare-highlight">
                    <span className="lp-compare-item-wrap"><i className="lp-compare-check">✔</i> No delisting risk</span>
                  </td>
                </tr>
                <tr>
                  <td className="lp-compare-td" style={{ fontWeight: 600 }}>Distribution &amp; Cities</td>
                  <td className="lp-compare-td">
                    <span className="lp-compare-item-wrap"><i className="lp-compare-cross">✖</i> Restricted by platform algorithm</span>
                  </td>
                  <td className="lp-compare-td lp-compare-highlight">
                    <span className="lp-compare-item-wrap"><i className="lp-compare-check">✔</i> Choose your own active cities</span>
                  </td>
                </tr>
                <tr>
                  <td className="lp-compare-td" style={{ fontWeight: 600 }}>Customer Ownership</td>
                  <td className="lp-compare-td">
                    <span className="lp-compare-item-wrap"><i className="lp-compare-cross">✖</i> Customers owned by marketplace</span>
                  </td>
                  <td className="lp-compare-td lp-compare-highlight">
                    <span className="lp-compare-item-wrap"><i className="lp-compare-check">✔</i> Own your customer database</span>
                  </td>
                </tr>
                <tr>
                  <td className="lp-compare-td" style={{ fontWeight: 600 }}>Marketing Control</td>
                  <td className="lp-compare-td">
                    <span className="lp-compare-item-wrap"><i className="lp-compare-cross">✖</i> Heavy paid advertising required</span>
                  </td>
                  <td className="lp-compare-td lp-compare-highlight">
                    <span className="lp-compare-item-wrap"><i className="lp-compare-check">✔</i> Direct demand generation</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr className="lp-divider" />

        {/* 8. FINAL CTA SECTION */}
        <section className="lp-section lp-final-cta-section">
          <div className="lp-final-cta-card">
            <h2 className="lp-final-cta-title">Ready To Launch Quick Commerce?</h2>
            <p className="lp-final-cta-desc">
              Go live in days without warehouses, operations teams, or marketplace dependency.
            </p>
            <div className="lp-actions" style={{ margin: 0, justifyContent: 'center' }}>
              <button className="btn-check-availability" onClick={() => { setStep(2); setBrowseCity("Delhi"); }}>
                Check Availability In Your City <Icon.ArrowRight />
              </button>
              <button className="btn-talk-specialist" onClick={() => { setSpecialistOrigin(0); setStep(1); }}>
                Talk To Our Team
              </button>
            </div>
          </div>
        </section>
      </div>
    );
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

  const renderJourneyVisual = (idx) => {
    switch (idx) {
      case 0:
        return <SelectLocationVisual theme={theme} />;
      case 1:
        return (
          <div className="jv-tech-card">
            <div className="jv-tech-flow">
              <div className="jv-tech-left">
                <div className="jv-tech-badge shopify">Shopify</div>
                <div className="jv-tech-badge custom-api">API</div>
              </div>
              <div className="jv-tech-middle">
                <svg viewBox="0 0 240 120" className="tech-flow-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="flow-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Background curves */}
                  <path d="M 10 30 C 100 30 140 60 230 60" className="flow-path-bg" />
                  <path d="M 10 90 C 100 90 140 60 230 60" className="flow-path-bg" />

                  {/* Active glowing flow paths */}
                  <path d="M 10 30 C 100 30 140 60 230 60" className="flow-path-active shopify-pulse" filter="url(#flow-glow)" />
                  <path d="M 10 90 C 100 90 140 60 230 60" className="flow-path-active api-pulse" filter="url(#flow-glow)" />
                </svg>
              </div>
              <div className="jv-tech-right">
                <div className="jv-tech-blitz">Blitz OMS</div>
              </div>
            </div>
            <pre className="jv-json">
              <span className="json-bracket">{"{"}</span>{"\n"}
              {"  "}<span className="json-key">"status"</span>: <span className="json-val">"connected"</span>,<span className="json-comment"> // active</span>{"\n"}
              {"  "}<span className="json-key">"sync"</span>: <span className="json-val">"real-time"</span>,{"\n"}
              {"  "}<span className="json-key">"last_ping"</span>: <span className="json-val">"{syncTime}"</span>,{"\n"}
              {"  "}<span className="json-key">"orders_synced"</span>: <span className="json-val">{orderCount}</span>{"\n"}
              <span className="json-bracket">{"}"}</span>
            </pre>
          </div>
        );
      case 2:
        return (
          <div className="jv-compliance-card">
            <div className="jv-checklist">
              <div className="jv-check-item checked">
                <span className="jv-check-icon">✓</span>
                <div className="jv-check-text">
                  <strong>FSSAI Registration</strong>
                  <span>Validated by compliance team</span>
                </div>
              </div>
              <div className="jv-check-item checked">
                <span className="jv-check-icon">✓</span>
                <div className="jv-check-text">
                  <strong>GSTIN Check</strong>
                  <span>Automatic tax verification</span>
                </div>
              </div>
              <div className="jv-check-item signing">
                <span className="jv-check-icon">✍</span>
                <div className="jv-check-text">
                  <strong>Onboarding SLA</strong>
                  <span>Signing agreement...</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 3: {
        // 263.9 = 2*pi*42 (SVG ring circumference), 34.3 = 263.9*0.13 (13% remaining = 87% filled)
        const scanItems = [
          { brand: 'Nykaa', name: 'SPF50+ Sunscreen', sku: 'NK-1284', qty: 24, time: '08:04:32' },
          { brand: 'Foxtale', name: 'Vitamin C Serum', sku: 'FT-0891', qty: 12, time: '08:04:31' },
          { brand: 'HealthKart', name: 'B12 Supplement', sku: 'HK-4421', qty: 36, time: '08:04:29' },
          { brand: 'Ajio', name: 'Casual Linen Shirt', sku: 'AJ-7723', qty: 18, time: '08:04:28' },
          { brand: 'Nykaa', name: 'Hydra Moisturiser', sku: 'NK-2291', qty: 30, time: '08:04:26' },
          { brand: 'Foxtale', name: 'Retinol Night Cream', sku: 'FT-1102', qty: 15, time: '08:04:24' },
          { brand: 'HealthKart', name: 'Whey Protein 1kg', sku: 'HK-0033', qty: 8, time: '08:04:22' },
          { brand: 'Myntra', name: 'Sports Joggers', sku: 'MN-8812', qty: 22, time: '08:04:20' },
        ];
        const barWidths = [3, 1.5, 2, 1.5, 3, 1.5, 2, 1.5, 3, 1.5, 2, 1.5];
        const cats = [
          { name: 'Skincare', color: '#6366f1', w: '62%' },
          { name: 'Beverages', color: '#22d3ee', w: '85%' },
          { name: 'Health', color: '#34d399', w: '44%' },
        ];
        return (
          <div className="jv-inventory-card">

            {/* Header */}
            <div className="inv-hdr">
              <div className="inv-hdr-left">
                <span className="inv-session-label">Receiving Session</span>
                <span className="inv-session-id">#RS-2847</span>
              </div>
              <div className="inv-live-pill">
                <span className="inv-live-dot"></span>
                LIVE
              </div>
            </div>

            {/* Body */}
            <div className="inv-body">

              {/* Left: scrolling scan feed */}
              <div className="inv-feed-panel">
                <span className="inv-feed-title">Live Scan Feed</span>
                <div className="inv-feed-viewport">
                  <div className="inv-feed-scroll">
                    {[...scanItems, ...scanItems].map((item, i) => (
                      <div key={i} className="inv-scan-row">
                        {/* mini barcode */}
                        <div className="inv-barcode">
                          {barWidths.map((w, k) => (
                            <span key={k} className="inv-bar" style={{ width: `${w}px`, opacity: k % 2 === 0 ? 0.9 : 0.45 }} />
                          ))}
                        </div>
                        {/* item info */}
                        <div className="inv-row-info">
                          <div className="inv-row-brand">{item.brand}</div>
                          <div className="inv-row-name">{item.name}</div>
                          <div className="inv-row-meta">
                            <span className="inv-row-sku">{item.sku}</span>
                            <span className="inv-row-qty">×{item.qty}</span>
                          </div>
                        </div>
                        {/* status */}
                        <div className="inv-row-right">
                          <span className="inv-row-check">✓ OK</span>
                          <span className="inv-row-time">{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* laser line */}
                  <div className="inv-feed-laser"></div>
                  {/* fade bottom */}
                  <div className="inv-feed-fade"></div>
                </div>
              </div>

              {/* Right: ring + cats */}
              <div className="inv-ring-panel">
                {/* SVG donut ring */}
                <div className="inv-ring-wrap">
                  <svg viewBox="0 0 90 90" className="inv-ring-svg">
                    <defs>
                      <linearGradient id="inv2grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                      <filter id="inv-glow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>
                    {/* outer bg glow ring */}
                    <circle cx="45" cy="45" r="42" fill="none"
                      stroke="rgba(99,102,241,0.07)" strokeWidth="10" />
                    {/* track */}
                    <circle cx="45" cy="45" r="42" fill="none"
                      stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                    {/* animated arc */}
                    <circle cx="45" cy="45" r="42" fill="none"
                      stroke="url(#inv2grad)" strokeWidth="7"
                      strokeLinecap="round"
                      filter="url(#inv-glow)"
                      className="inv-ring-arc"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '45px 45px' }}
                    />
                  </svg>
                  <div className="inv-ring-center">
                    <span className="inv-ring-pct">87%</span>
                    <span className="inv-ring-sub">filled</span>
                  </div>
                </div>
                <span className="inv-ring-label">1,240 / 1,425<br />SKUs received</span>

                {/* category mini bars */}
                <div className="inv-cats">
                  {cats.map((c, i) => (
                    <div key={i} className="inv-cat-row">
                      <span className="inv-cat-dot" style={{ background: c.color }}></span>
                      <span className="inv-cat-name">{c.name}</span>
                      <div className="inv-cat-bar">
                        <div className="inv-cat-fill" style={{ '--w': c.w, background: c.color }}></div>
                      </div>
                      <span className="inv-cat-pct">{c.w}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>{/* /inv-body */}

            {/* KPI strip */}
            <div className="inv-kpi-strip">
              <div className="inv-kpi">
                <span className="inv-kpi-val">312</span>
                <span className="inv-kpi-key">SKUs / hr</span>
              </div>
              <div className="inv-kpi-div"></div>
              <div className="inv-kpi">
                <span className="inv-kpi-val">1,240</span>
                <span className="inv-kpi-key">Total SKUs</span>
              </div>
              <div className="inv-kpi-div"></div>
              <div className="inv-kpi">
                <span className="inv-kpi-val">99.8%</span>
                <span className="inv-kpi-key">Accuracy</span>
              </div>
            </div>

          </div>
        );
      }
      case 4:
        return (
          <div className="jv-live-card">
            <div className="jv-live-head">
              <span className="jv-live-status-pulse"></span>
              <strong>Live Delivery Routing</strong>
            </div>
            <div className="jv-live-eta">
              <span>ETA to Destination</span>
              <strong>14 Mins</strong>
            </div>
            <div className="jv-live-route">
              <div className="route-node source">Store</div>
              <div className="route-path">
                <span className="route-truck">🛵</span>
              </div>
              <div className="route-node dest">User</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const selectedStores = cart.length
    ? cart.map((c) => `${c.storeName}, ${c.city} (${c.racks} rack${c.racks !== 1 ? "s" : ""})`).join(" · ")
    : "—";

  const selectedCities = cart.length
    ? [...new Set(cart.map((c) => c.city))].join(", ")
    : city && city.length > 0 ? city.join(", ") : "—";

  const pageMeta = [
    null,
    { title: "Choose your stores" },
    { title: "Verify & Checkout", desc: "Enter company details, upload required documents." },
  ][step - 1];

  const renderThemeToggle = () => (
    <button
      type="button"
      className="btn-theme-toggle"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Icon.Sun /> : <Icon.Moon />}
    </button>
  );

  const renderHeaderActions = (originClass = "") => {
    if (step === 4) return null;
    return (
      <div className={`header-actions ${originClass}`}>
        {renderThemeToggle()}
        {(step === 0 || step === 2 || step === 3) && (
          <button
            type="button"
            className="btn-talk"
            onClick={() => {
              setErrors({});
              setShowStepError(false);
              setSpecialistOrigin(step);
              setStep(1);
            }}
            title="Talk to a specialist"
          >
            <span className="btn-talk-text">Talk to a specialist</span>
            <span className="btn-talk-icon"><Icon.Support /></span>
          </button>
        )}
        {step === 1 && (
          <button
            type="button"
            className={`btn-standalone-back${specialistOrigin === 0 ? " btn-home-icon" : ""}`}
            onClick={() => setStep(specialistOrigin)}
            title={specialistOrigin === 0 ? "Back to Home" : undefined}
          >{specialistOrigin === 2 ? "Back to Store Selection" : specialistOrigin === 3 ? "Back to Verification" : <Icon.Home />}</button>
        )}
      </div>
    );
  };

  const renderMobileHeader = () => (
    <header className="mobile-header">
      <div className="mobile-header-top">
        <div className="mobile-brand" onClick={() => setStep(0)} style={{ cursor: "pointer" }}>
          <img src="/Logo.png" />
          <div className="mobile-brand-text">
            <strong>Blitz MiniPods</strong>
            <span>Client onboarding</span>
          </div>
        </div>
        {renderHeaderActions("mobile-actions-wrap")}
      </div>
      <div className="mobile-progress-row">
        <div className="mobile-progress-track">
          <div className="mobile-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="mobile-progress-pct">{pct}%</span>
      </div>
      <div className="mobile-step-pills">
        {STEPS.map((s, i) => {
          const stateVal = i + 2;
          const isActive = step === stateVal;
          const isDone = step > stateVal;
          const canGoBack = isDone && !applicationId;
          return (
            <div
              key={stateVal}
              className={`mobile-step-pill${isActive ? " active" : ""}${isDone ? " done" : ""}${canGoBack ? " clickable" : ""}`}
              onClick={() => canGoBack && setStep(stateVal)}
              role={canGoBack ? "button" : undefined}
            >
              <span className="mobile-step-pill-num">{isDone ? <Icon.Check /> : (i + 1)}</span>
              {s.title}
            </div>
          );
        })}
      </div>
    </header>
  );

  const renderSidebar = () => {
    const highlightedStore = allStores.find(s => s.id === highlightedStoreId) || stores.find(s => s.id === highlightedStoreId);

    return (
      <aside className="sidebar">
        <div className="brand" onClick={() => setStep(0)} style={{ cursor: "pointer" }}>
          <div className="brand-mark">
            <img src="/Logo.png" alt="Company Logo" style={{ width: 40, height: 40, borderRadius: 8 }} />
          </div>

          <div>
            <div className="brand-name">Blitz MiniPods</div>
            <div className="brand-tag">Client onboarding</div>
          </div>
        </div>

        <div className="sidebar-body">
          <nav className="nav-steps">
            {STEPS.map((s, i) => {
              const stateVal = i + 2;
              const isActive = step === stateVal;
              const isDone = step > stateVal;
              const isFuture = step < stateVal;
              const canGoBack = isDone && !applicationId;
              return (
                <div
                  key={stateVal}
                  className={`nav-step${isActive ? " active" : ""}${isDone ? " done" : ""}${isFuture ? " future" : ""}${canGoBack ? " clickable" : ""}`}
                  onClick={() => canGoBack && setStep(stateVal)}
                >
                  <div className="nav-num">{isDone ? <Icon.Check /> : (i + 1)}</div>
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
                <span className="pulse-glowing-beacon"></span>
                <span>📦 Minipods Calculator</span>
              </div>
              <p className="sidebar-recommender-desc">
                Not sure how many shelves to book? Click below 👀.
              </p>
              <button
                type="button"
                className="btn-sidebar-recommender"
                onClick={() => setIsRecommenderOpen(true)}
              >
                Minipods Calculator ↗
              </button>
            </div>
          )}
        </div>

      </aside>
    );
  };

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
              <span>Name <em>*</em></span>
              <input type="text" placeholder="Your name" value={poc} onChange={e => { setPoc(e.target.value); clearError("poc"); }} />
              {errors.poc && <p className="field-error">{errors.poc}</p>}
            </div>
            <div className={`field${errors.phone ? " has-error" : ""}`}>
              <span>Mobile number <em>*</em></span>
              <input type="tel" inputMode="numeric" placeholder="9876543210" value={phone} onChange={e => { setPhone(e.target.value); clearError("phone"); }} />
              {errors.phone ? <p className="field-error">{errors.phone}</p> : <p className="field-hint">10-digit Indian mobile number</p>}
            </div>
            <div className={`field${errors.email ? " has-error" : ""}`}>
              <span>Work Email <em>*</em></span>
              <input type="email" placeholder="you@brand.com" value={email} onChange={e => { setEmail(e.target.value); clearError("email"); }} />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className={`field${errors.orders ? " has-error" : ""}`}>
              <span>Average daily orders<em>*</em></span>
              <select value={orders} onChange={e => { setOrders(e.target.value); clearError("orders"); }}>
                <option value="">Select range</option>
                {["1 – 50 orders / day", "51 – 150 orders / day", "151 – 500 orders / day", "500+ orders / day"].map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              {errors.orders && <p className="field-error">{errors.orders}</p>}
            </div>
          </div>
        </div>
      </section>

    </>
  );

  const renderPage2 = () => (
    <section className="section">
      {errors.cart && <p className="field-error" style={{ marginBottom: 12 }}>{errors.cart}</p>}



      <StoreSelection
        theme={theme}
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
      {renderPage1()}
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
          <div className="summary-item" >
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
                  <p>Our audit team is reviewing your uploaded PAN, GST & Catalog sheets</p>
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
    // Determine selected item
    const selectedItem = recommenderItems.find(it => it.id === vizItemId);
    const activeResult = selectedItem ? computeItem(selectedItem) : null;

    const totalBins = activeResult ? activeResult.binsNeeded : 0;
    const totalShelves = activeResult ? activeResult.shelvesNeeded : 0;

    const selectItem = (id) => {
      setVizItemId(id);
      setIsPeekOpen(true);
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
              Minipods Calculator
            </h3>
            <button className="btn-close-modal" onClick={() => setIsRecommenderOpen(false)}>✕</button>
          </div>

          <div className="recommender-modal-body">
            {/* Spec Strip */}
            <div className="spec-strip">
              <div className="spec-chip"><span className="lbl">Bin Size</span><span className="val">28 × 45 × 25 cm</span></div>
              <div className="spec-chip"><span className="lbl">Max Weight</span><span className="val">20 kg</span></div>
              <div className="spec-chip"><span className="lbl">Bins / Shelf</span><span className="val">3 units</span></div>
              <div className="spec-chip"><span className="lbl">Usable Space</span><span className="val">90%</span></div>
            </div>

            {/* Custom Dropdown Selector */}
            <p className="section-label" style={{ margin: '0 0 -2px 0', fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '700' }}>Select an item to check packing efficiency</p>
            <div className="custom-dropdown-container">
              <button
                type="button"
                className="custom-dropdown-trigger"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedItem ? (
                  <span className="trigger-val">
                    <span className="emoji">{selectedItem.emoji}</span>
                    <span className="name">{selectedItem.name} ({selectedItem.l}×{selectedItem.w}×{selectedItem.h} cm)</span>
                  </span>
                ) : (
                  <span className="trigger-placeholder">
                    <span className="sparkle-icon">✨</span> Choose an item to preview...
                  </span>
                )}
                <span className="arrow">{isDropdownOpen ? "▲" : "▼"}</span>
              </button>

              {isDropdownOpen && (
                <div className="custom-dropdown-menu">
                  {recommenderItems.map(item => {
                    const isSelected = item.id === vizItemId;
                    const computed = computeItem(item);
                    return (
                      <div
                        key={item.id}
                        className={`custom-dropdown-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          selectItem(item.id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span className="emoji">{item.emoji}</span>
                        <span className="name">{item.name}</span>
                        <span className="dims">{item.l}×{item.w}×{item.h} cm</span>
                        {computed.oversized && <span className="oversized-tag">Oversized</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {!vizItemId && (
              <div className="hint-text" style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-3)' }}>
                Select an item from the dropdown to check its dimensions and visual bin packing efficiency.
              </div>
            )}

            {/* Preview shell */}
            <div className={`bin-preview-shell ${vizItemId ? "open" : ""}`}>
              {activeResult && (
                <div className="shell-inner">
                  <div className="bin-preview-panel" style={activeResult.oversized ? { borderColor: "rgba(239, 68, 68, 0.3)" } : undefined}>
                    {/* Compact Specs and Orientation Tags (directly below dropdown, no duplicate hero card) */}
                    <div className="recommender-item-tags" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                      {activeResult.oversized ? (
                        <span className="tag tag-red" style={{ background: "var(--red-soft)", color: "var(--red)", borderColor: "rgba(239, 68, 68, 0.2)" }}>Oversized</span>
                      ) : (
                        <>
                          <span className="tag tag-violet">Best orientation: {activeResult.fit.ol}×{activeResult.fit.ow}×{activeResult.fit.oh} cm</span>
                          <span className="tag tag-green">Limit: {activeResult.limiting}</span>
                        </>
                      )}
                      {selectedItem.upright && <span className="tag tag-amber">Upright only</span>}
                    </div>

                    {activeResult.oversized ? (
                      <div className="preview-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center", gap: "16px" }}>
                        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--red-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--red)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <h4 style={{ color: "var(--red)", fontSize: "16px", fontWeight: "700" }}>Item does not fit in bin</h4>
                          <p style={{ color: "var(--text-3)", fontSize: "13px", maxWidth: "360px", lineHeight: "1.5" }}>
                            The dimensions of <b>{selectedItem.name}</b> ({selectedItem.l}×{selectedItem.w}×{selectedItem.h} cm) exceed the capacity of our standard bin (28×45×25 cm) under the required <b>{selectedItem.upright ? "upright-only" : "any"}</b> orientation rules.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="preview-body">
                        {/* Iso stage */}
                        <div className="iso-stage">
                          <svg viewBox="0 0 340 240" xmlns="http://www.w3.org/2000/svg" dangerouslySetInnerHTML={{ __html: buildIsoBin(activeResult, theme) }} />
                        </div>

                        {/* Flat views */}
                        <div className="flat-views">
                          <div className="viz-panel">
                            <div className="viz-panel-head">
                              <span className="t">Top view</span>
                              <span className="d">45 × 28 cm</span>
                            </div>
                            <svg viewBox="0 0 180 110" dangerouslySetInnerHTML={{ __html: buildFloorSvg(activeResult, theme).svg }} />
                            <div className="viz-panel-foot">
                              {activeResult.fit.cL} × {activeResult.fit.cW} = <b>{activeResult.fit.cL * activeResult.fit.cW}</b> per layer
                            </div>
                          </div>

                          <div className="viz-panel">
                            <div className="viz-panel-head">
                              <span className="t">Side view</span>
                              <span className="d">25 cm tall</span>
                            </div>
                            <svg viewBox="0 0 180 110" dangerouslySetInnerHTML={{ __html: buildStackSvg(activeResult, theme).svg }} />
                            <div className="viz-panel-foot">
                              <b>{activeResult.fit.cH}</b> {pluralize(activeResult.fit.cH, 'layer')} high
                            </div>
                          </div>
                        </div>

                        {/* Legend */}
                        {(buildFloorSvg(activeResult, theme).hasUnused || buildStackSvg(activeResult, theme).hasUnused) && (
                          <div className="viz-legend">
                            <span><i className="swatch sw-fill"></i>Packed item</span>
                            <span><i className="swatch sw-empty"></i>Unused space</span>
                          </div>
                        )}

                        {/* Dots buffer */}
                        <div className="viz-buffer">
                          <div className="viz-dots" dangerouslySetInnerHTML={{ __html: buildDotsHtml(activeResult) }} />
                          <div className="viz-buffer-note" dangerouslySetInnerHTML={{ __html: `<b>Buffer Check:</b> ` + buildBufferNote(activeResult) }} />
                        </div>

                        {/* Flow stats */}
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
                            <div className="l">shelves to book</div>
                          </div>
                        </div>

                        {/* Caption */}
                        <p className="viz-sentence" dangerouslySetInnerHTML={{ __html: `<b>Optimized:</b> ` + buildCaption(activeResult) }} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (step === 0) {
    return (
      <>
        <style>{STYLES}</style>
        {renderLandingPage()}
      </>
    );
  }

  if (step === 1) {
    return (
      <>
        <style>{STYLES}</style>
        {renderStandaloneBrandForm()}
      </>
    );
  }

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
          <div className="desktop-actions-wrap-outer">
            {renderHeaderActions("desktop-actions-wrap")}
          </div>
          {renderMobileHeader()}
          <div className={`main-inner${step === 2 ? " step-store" : ""}`}>
            {pageMeta && (
              <header className="page-head" style={{ marginBottom: "24px" }}>
                <div>
                  {pageMeta.eyebrow && <p className="page-eyebrow">{pageMeta.eyebrow}</p>}
                  <h1 className="page-title">{pageMeta.title}</h1>
                  {pageMeta.desc && <p className="page-desc">{pageMeta.desc}</p>}
                </div>
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

          {step >= 1 && step <= 3 && (
            <div className={`form-progress-footer${step === 2 ? " step-store" : ""}`}>
              <div className="progress-wrapper">
                <div className="progress-label">
                  <span>Progress</span>
                  <span>{pct}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          )}

          <footer className={`action-bar${step === 2 ? " checkout-bar" : ""}`}>
            <div className="action-bar-inner">
              {step === 2 ? (
                <>
                  <button className="btn btn-ghost" onClick={() => { setStep(0); setErrors({}); setShowStepError(false); }} aria-label="Go back">
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
                    onClick={handleNext}
                    disabled={cart.length === 0 || !disclaimerAgreed}
                    title={
                      cart.length === 0
                        ? "Add stores to your cart first"
                        : !disclaimerAgreed
                          ? "You must accept the legal disclaimer first"
                          : undefined
                    }
                  >
                    Continue <Icon.ArrowRight />
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
                    <button className="btn btn-primary btn-checkout" onClick={handleCheckoutPayment} disabled={!isStepValid(3)} title={!isStepValid(3) ? "Complete all required fields and documents to pay" : undefined}>
                      Pay & Book Racks <Icon.ArrowRight />
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
