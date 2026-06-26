import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
const CITIES = [
  {
    name: "Bengaluru",
    center: [12.9716, 77.6120],
    points: [
      [12.9569, 77.6970], // Marathahalli
      [12.8900, 77.5720], // Konanakunte
      [12.9128, 77.6387], // HSR Layout
      [12.9698, 77.7500], // Whitefield
      [12.9260, 77.5222], // RR Nagar
      [13.0485, 77.4950], // Nagasandra
      [13.0354, 77.5988], // Hebbal
      [12.9710, 77.6015], // Shanthala Nagar
    ]
  },
  {
    name: "Mumbai",
    center: [19.0760, 72.8777],
    points: [
      [19.0596, 72.8295], // Bandra
      [18.9220, 72.8347], // Colaba
      [19.1176, 72.9060], // Powai
      [18.9696, 72.8128], // Tardeo
      [19.0269, 72.8553], // Dadar
      [19.1680, 72.8720], // Dindoshi
    ]
  },
  {
    name: "Delhi",
    center: [28.6139, 77.2090],
    points: [
      [28.6304, 77.2177], // Connaught Place
      [28.5457, 77.2732], // Nehru Place
      [28.5244, 77.1855], // Saket
      [28.6921, 77.1511], // Pitampura
      [28.5900, 77.3100], // Mayur Vihar
      [28.6291, 77.1292], // Mayapuri
    ]
  }
];

export default function Bengaluru3DMap() {
  const [state, setState] = useState("init"); // 'init', 'folded', 'unfolding', 'unfolded', 'folding'
  const [isHoverEnabled, setIsHoverEnabled] = useState(false);
  const [isFoldedClass, setIsFoldedClass] = useState(false); // start flat to let Leaflet load tiles
  const [isReady, setIsReady] = useState(false); // control fade-in
  const [isInitializing, setIsInitializing] = useState(true);
  const [cityIndex, setCityIndex] = useState(0);

  const mapContainerRef = useRef(null);
  const sceneRef = useRef(null);
  const mapsRef = useRef({});

  // Refs for each of the 9 tiles
  const refs = {
    tl: useRef(null),
    tc: useRef(null),
    tr: useRef(null),
    ml: useRef(null),
    mc: useRef(null),
    mr: useRef(null),
    bl: useRef(null),
    bc: useRef(null),
    br: useRef(null),
  };

  // Keep track of active timeouts for cleanup
  const timersRef = useRef([]);
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    // ─── LEAFLET MAPS SETUP ───
    const zoomLevel = 11.5;
    // Geographical center of Bangalore (shifted slightly east to include Whitefield)
    const centerLatLng = L.latLng(12.9716, 77.6120);
    const tileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    const panels = [
      { id: "tl", row: 0, col: 0 },
      { id: "tc", row: 0, col: 1 },
      { id: "tr", row: 0, col: 2 },
      { id: "ml", row: 1, col: 0 },
      { id: "mc", row: 1, col: 1 },
      { id: "mr", row: 1, col: 2 },
      { id: "bl", row: 2, col: 0 },
      { id: "bc", row: 2, col: 1 },
      { id: "br", row: 2, col: 2 },
    ];

    const localMaps = {};

    // First, initialize the master center map to establish projection reference
    if (refs.mc.current) {
      const masterMap = L.map(refs.mc.current, {
        center: centerLatLng,
        zoom: zoomLevel,
        zoomSnap: 0.1,
        zoomDelta: 0.1,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false,
      });
      L.tileLayer(tileUrl).addTo(masterMap);
      localMaps["mc"] = masterMap;

      // Project geographical center to pixel coordinate space
      const centerPoint = masterMap.project(centerLatLng, zoomLevel);

      // Initialize remaining 8 maps at calculated geographical offsets
      panels.forEach((p) => {
        if (p.id === "mc") return;
        if (!refs[p.id].current) return;

        // Each panel is 200px wide/tall in the 3x3 layout
        const xOffset = (p.col - 1) * 200;
        const yOffset = (p.row - 1) * 200;

        // Offset the center coordinates in pixels, then translate back to LatLng
        const targetPoint = centerPoint.add([xOffset, yOffset]);
        const targetLatLng = masterMap.unproject(targetPoint, zoomLevel);

        const map = L.map(refs[p.id].current, {
          center: targetLatLng,
          zoom: zoomLevel,
          zoomSnap: 0.1,
          zoomDelta: 0.1,
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          doubleClickZoom: false,
          scrollWheelZoom: false,
          boxZoom: false,
          keyboard: false,
        });
        L.tileLayer(tileUrl).addTo(map);
        localMaps[p.id] = map;
      });

      // Custom HUD radar markers (exactly 2 concentric circles with breathing + rotations)
      const radarIcon = L.divIcon({
        className: "custom-radar-icon",
        html: `
          <div class="hud-node">
            <div class="hud-glow"></div>
            <div class="hud-outer"></div>
            <div class="hud-inner"></div>
            <div class="hud-core"></div>
          </div>
        `,
        iconSize: [80, 80],
        iconAnchor: [40, 40],
      });

      // Complete Neighborhood Coordinates for POIs across all of Bengaluru
      const pointsLatLngs = [
        [12.9569, 77.6970], // Marathahalli
        [12.8900, 77.5720], // Konanakunte
        [12.9128, 77.6387], // HSR Layout
        [12.9698, 77.7500], // Whitefield
        [12.9260, 77.5222], // RR Nagar
        [13.0485, 77.4950], // Nagasandra
        [13.0354, 77.5988], // Hebbal
        [12.9710, 77.6015], // Shanthala Nagar
      ];

      // Add markers to ALL map instances.
      Object.values(localMaps).forEach((map) => {
        pointsLatLngs.forEach((latlng) => {
          L.marker(latlng, { icon: radarIcon }).addTo(map);
        });
      });

      mapsRef.current = localMaps;

      // Invalidate sizes immediately to ensure maps render correctly in flat state
      Object.values(localMaps).forEach((map) => {
        map.invalidateSize();
      });

      // Wait 350ms to allow tiles to load while flat, then fold and fade in!
      const initTimer = setTimeout(() => {
        setIsFoldedClass(true);
        setState("folded");

        const readyTimer = setTimeout(() => {
          setIsInitializing(false);
          setIsReady(true);
        }, 50);
        timersRef.current.push(readyTimer);
      }, 350);
      timersRef.current.push(initTimer);
    }

    // Clean up maps and timers on unmount
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      Object.values(mapsRef.current).forEach((map) => {
        map.remove();
      });
    };
  }, []);

  // Update map coordinates and clear/redraw markers when cityIndex changes
  useEffect(() => {
    if (state === "init") return;
    const city = CITIES[cityIndex];

    // Clear old markers from all maps
    Object.values(mapsRef.current).forEach((map) => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
    });

    const mcMap = mapsRef.current["mc"];
    if (!mcMap) return;

    const zoomLevel = 11.5;
    const centerLatLng = L.latLng(city.center[0], city.center[1]);
    const centerPoint = mcMap.project(centerLatLng, zoomLevel);

    const panels = [
      { id: "tl", row: 0, col: 0 },
      { id: "tc", row: 0, col: 1 },
      { id: "tr", row: 0, col: 2 },
      { id: "ml", row: 1, col: 0 },
      { id: "mc", row: 1, col: 1 },
      { id: "mr", row: 1, col: 2 },
      { id: "bl", row: 2, col: 0 },
      { id: "bc", row: 2, col: 1 },
      { id: "br", row: 2, col: 2 },
    ];

    const radarIcon = L.divIcon({
      className: "custom-radar-icon",
      html: `
        <div class="hud-node">
          <div class="hud-glow"></div>
          <div class="hud-outer"></div>
          <div class="hud-inner"></div>
          <div class="hud-core"></div>
        </div>
      `,
      iconSize: [80, 80],
      iconAnchor: [40, 40],
    });

    // Update center for each map panel and add new city markers
    panels.forEach((p) => {
      const map = mapsRef.current[p.id];
      if (!map) return;

      const xOffset = (p.col - 1) * 200;
      const yOffset = (p.row - 1) * 200;
      const targetPoint = centerPoint.add([xOffset, yOffset]);
      const targetLatLng = mcMap.unproject(targetPoint, zoomLevel);

      map.setView(targetLatLng, zoomLevel, { animate: false });

      // Add new markers to this map panel
      city.points.forEach((latlng) => {
        L.marker(latlng, { icon: radarIcon }).addTo(map);
      });

      // Force instant tile reload
      map.invalidateSize();
    });
  }, [cityIndex]);


  // Global mousemove parallax tilt logic with cleanup
  useEffect(() => {
    if (!isHoverEnabled || state !== "unfolded") return;

    const handleGlobalMouseMove = (e) => {
      if (!sceneRef.current || !mapContainerRef.current) return;
      const rect = sceneRef.current.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      const tiltX = -(y / (window.innerHeight / 2)) * 10;
      const tiltY = (x / (window.innerWidth / 2)) * 10;

      mapContainerRef.current.style.transform = `scale(0.96) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(0deg)`;
    };

    const handleGlobalMouseLeave = () => {
      if (!mapContainerRef.current) return;
      mapContainerRef.current.style.transform = "scale(0.96) rotateX(0deg) rotateY(0deg) rotateZ(0deg)";
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseleave", handleGlobalMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseleave", handleGlobalMouseLeave);
    };
  }, [isHoverEnabled, state]);

  // ─── UN-FOLD CONTROLLER LOGIC ───
  const unfold = () => {
    if (state !== "folded" && state !== "init") return;
    setState("unfolding");
    setIsFoldedClass(false);

    const unfoldTimer = setTimeout(() => {
      setState("unfolded");
      setIsHoverEnabled(true);

      // Finalize leaflet calculations once map lies flat
      Object.values(mapsRef.current).forEach((map) => {
        map.invalidateSize();
      });
    }, 4000);
    timersRef.current.push(unfoldTimer);
  };

  const fold = () => {
    if (state !== "unfolded") return;
    setState("folding");
    setIsHoverEnabled(false);

    // Reset tilt transition instantly before folding
    if (mapContainerRef.current) {
      mapContainerRef.current.style.transform = "";
    }

    const resetTimer = setTimeout(() => {
      setIsFoldedClass(true);

      const foldTimer = setTimeout(() => {
        setState("folded");
      }, 4000);
      timersRef.current.push(foldTimer);
    }, 100);
    timersRef.current.push(resetTimer);
  };

  // Continuous opening and closing cycle
  useEffect(() => {
    let loopTimeout;
    if (state === "unfolded") {
      loopTimeout = setTimeout(() => {
        fold();
      }, 3000); // stay unfolded for 3 seconds
    } else if (state === "folded") {
      const delay = isFirstLoadRef.current ? 1000 : 3000;
      if (isFirstLoadRef.current) {
        isFirstLoadRef.current = false;
      } else {
        setCityIndex((prev) => (prev + 1) % CITIES.length);
      }
      loopTimeout = setTimeout(() => {
        unfold();
      }, delay);
    }
    return () => clearTimeout(loopTimeout);
  }, [state]);

  return (
    <div className={`bengaluru-3d-map-wrapper ${isReady ? "ready" : ""} ${isInitializing ? "init-phase" : ""} ${state === "unfolded" ? "unfolded-state" : ""}`}>
      <style>{`
        .bengaluru-3d-map-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 500px;
          perspective: 2000px;
          font-family: 'Inter', sans-serif;
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
        }

        .bengaluru-3d-map-wrapper.ready {
          opacity: 1;
        }

        .bengaluru-3d-map-wrapper.init-phase * {
          transition: none !important;
          transition-delay: 0s !important;
        }

        /* ─── SCENE & CONTAINER ─── */
        .bengaluru-3d-map-wrapper .scene {
          width: 600px;
          height: 600px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.5s ease;
          z-index: 2;
          perspective: 2000px;
          transform: scale(0.8); /* Scale down slightly for a tighter fit */
        }

        .bengaluru-3d-map-wrapper .map-container {
          width: 600px;
          height: 600px;
          position: relative;
          transform-style: preserve-3d;
          /* Main camera transition for zooming/tilted fold look to flat full map */
          transition: transform 4.0s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        /* High-performance GPU accelerated shadow layer replacing expensive drop-shadow filter */
        .bengaluru-3d-map-wrapper .map-container::before {
          content: '';
          position: absolute;
          inset: 15px;
          background: rgba(0, 0, 0, 0.45);
          filter: blur(35px);
          transform: translateZ(-20px);
          pointer-events: none;
          transition: transform 4.0s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 4.0s ease, filter 4.0s ease, inset 4.0s cubic-bezier(0.645, 0.045, 0.355, 1);
          opacity: 0.8;
          border-radius: 12px;
          z-index: -1;
        }

        /* Folded Map Camera View */
        .bengaluru-3d-map-wrapper .map-container.folded {
          transform: scale(0.38) rotateX(56deg) rotateY(0deg) rotateZ(-28deg);
        }

        .bengaluru-3d-map-wrapper .map-container.folded::before {
          inset: 200px; /* shrink to match the folded 200x200 stack in the center */
          opacity: 0.95;
          filter: blur(15px);
          transform: translateZ(-40px);
        }

        /* ─── PANEL RIG SYSTEM ─── */
        /* 3x3 Grid panel size = 200px x 200px */
        .bengaluru-3d-map-wrapper .map-fold-panel {
          position: absolute;
          width: 200px;
          height: 200px;
          transform-style: preserve-3d;
          will-change: transform;
        }

        /* Base Center Panel (MC) - Positioned at row 2, col 2 */
        .bengaluru-3d-map-wrapper .map-fold-mc {
          left: 200px;
          top: 200px;
          z-index: 10;
        }

        /* Edge panels nested in MC */
        .bengaluru-3d-map-wrapper .map-fold-ml {
          left: -200px;
          top: 0;
          transform-origin: 100% 50%; /* hinge on right */
        }
        .bengaluru-3d-map-wrapper .map-fold-mr {
          left: 200px;
          top: 0;
          transform-origin: 0% 50%; /* hinge on left */
        }
        .bengaluru-3d-map-wrapper .map-fold-tc {
          left: 0;
          top: -200px;
          transform-origin: 50% 100%; /* hinge on bottom */
        }
        .bengaluru-3d-map-wrapper .map-fold-bc {
          left: 0;
          top: 200px;
          transform-origin: 50% 0%; /* hinge on top */
        }

        /* Corner panels nested inside TC and BC */
        .bengaluru-3d-map-wrapper .map-fold-tl {
          left: -200px;
          top: 0;
          transform-origin: 100% 50%; /* hinge on right of TC */
        }
        .bengaluru-3d-map-wrapper .map-fold-tr {
          left: 200px;
          top: 0;
          transform-origin: 0% 50%; /* hinge on left of TC */
        }
        .bengaluru-3d-map-wrapper .map-fold-bl {
          left: -200px;
          top: 0;
          transform-origin: 100% 50%; /* hinge on right of BC */
        }
        .bengaluru-3d-map-wrapper .map-fold-br {
          left: 200px;
          top: 0;
          transform-origin: 0% 50%; /* hinge on left of BC */
        }

        /* ─── TRANSITIONS & DELAYS (PHYSICS) ─── */
        /* Unfold transition (removing .folded) uses easeInOutCubic to start slowly and elegantly */
        .bengaluru-3d-map-wrapper .map-fold-panel {
          transition: transform 2.5s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        /* Unfolding order delays: MC is flat -> BC (0s) -> TC (0.2s) -> MR (0.4s) -> ML (0.6s) -> BR (0.8s) -> BL (1.0s) -> TR (1.2s) -> TL (1.4s) */
        .bengaluru-3d-map-wrapper .map-fold-bc { transition-delay: 0.0s; }
        .bengaluru-3d-map-wrapper .map-fold-tc { transition-delay: 0.2s; }
        .bengaluru-3d-map-wrapper .map-fold-mr { transition-delay: 0.4s; }
        .bengaluru-3d-map-wrapper .map-fold-ml { transition-delay: 0.6s; }
        .bengaluru-3d-map-wrapper .map-fold-br { transition-delay: 0.8s; }
        .bengaluru-3d-map-wrapper .map-fold-bl { transition-delay: 1.0s; }
        .bengaluru-3d-map-wrapper .map-fold-tr { transition-delay: 1.2s; }
        .bengaluru-3d-map-wrapper .map-fold-tl { transition-delay: 1.4s; }

        /* Folded rotations and Z translations to avoid Z-fighting in stack */
        .bengaluru-3d-map-wrapper .map-container.folded .map-fold-bc { transform: rotateX(-180deg) translateZ(-0.4px); transition-delay: 1.4s; }
        .bengaluru-3d-map-wrapper .map-container.folded .map-fold-tc { transform: rotateX(180deg) translateZ(-0.3px); transition-delay: 1.2s; }
        .bengaluru-3d-map-wrapper .map-container.folded .map-fold-mr { transform: rotateY(-180deg) translateZ(-0.2px); transition-delay: 1.0s; }
        .bengaluru-3d-map-wrapper .map-container.folded .map-fold-ml { transform: rotateY(180deg) translateZ(-0.1px); transition-delay: 0.8s; }
        .bengaluru-3d-map-wrapper .map-container.folded .map-fold-br { transform: rotateY(-180deg) translateZ(-0.2px); transition-delay: 0.6s; }
        .bengaluru-3d-map-wrapper .map-container.folded .map-fold-bl { transform: rotateY(180deg) translateZ(-0.2px); transition-delay: 0.4s; }
        .bengaluru-3d-map-wrapper .map-container.folded .map-fold-tr { transform: rotateY(-180deg) translateZ(-0.2px); transition-delay: 0.2s; }
        .bengaluru-3d-map-wrapper .map-container.folded .map-fold-tl { transform: rotateY(180deg) translateZ(-0.1px); transition-delay: 0.0s; }

        /* ─── DOUBLE-SIDED FACES ─── */
        .bengaluru-3d-map-wrapper .face {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          transform-style: preserve-3d;
          background: #faf6ee;
          overflow: hidden;
          will-change: filter;
          /* Dynamic brightness shadow during unfolding */
          transition: filter 2.5s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        .bengaluru-3d-map-wrapper .face.front {
          transform: rotateY(0deg);
          /* Blend subpixel seams by drawing a 1px paper-colored outline overlap */
          box-shadow: inset 0 0 1px rgba(0,0,0,0.1), 0 0 0 1px #faf6ee;
        }

        .bengaluru-3d-map-wrapper .face.back {
          transform: rotateY(180deg);
          background: #e3decb;
        }

        .bengaluru-3d-map-wrapper .map-fold-bc .face.back {
          transform: rotateX(180deg);
        }

        /* Optimize graphics layer performance with compositing */
        .bengaluru-3d-map-wrapper .map-tile,
        .bengaluru-3d-map-wrapper .leaflet-container {
          will-change: transform;
          transform: translateZ(0);
        }

        /* Disable marker animations unless the map is completely unfolded */
        .bengaluru-3d-map-wrapper:not(.unfolded-state) .hud-outer {
          animation: none !important;
        }
        .bengaluru-3d-map-wrapper:not(.unfolded-state) .hud-inner {
          animation: none !important;
        }

        /* Paper lighting shadow changes during folding */
        .bengaluru-3d-map-wrapper .map-container.folded .face.front {
          filter: brightness(0.45);
        }
        .bengaluru-3d-map-wrapper .map-container.folded .face.back {
          filter: brightness(0.85);
        }

        /* ─── TEXTURES, CREASES, SHADOWS ─── */
        /* SVG Paper Texture overlay */
        .bengaluru-3d-map-wrapper .paper-texture {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 15;
          mix-blend-mode: multiply;
          opacity: 0.55;
          /* Center radial gradient across the full 600px x 600px sheet */
          background: radial-gradient(circle at 300px 300px, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.08) 100%);
          background-size: 600px 600px;
        }

        /* 3x3 background offsets to stitch the lighting gradient continuously across panels */
        .bengaluru-3d-map-wrapper .map-fold-tl .paper-texture { background-position: 0px 0px; }
        .bengaluru-3d-map-wrapper .map-fold-tc .paper-texture { background-position: -200px 0px; }
        .bengaluru-3d-map-wrapper .map-fold-tr .paper-texture { background-position: -400px 0px; }
        .bengaluru-3d-map-wrapper .map-fold-ml .paper-texture { background-position: 0px -200px; }
        .bengaluru-3d-map-wrapper .map-fold-mc .paper-texture { background-position: -200px -200px; }
        .bengaluru-3d-map-wrapper .map-fold-mr .paper-texture { background-position: -400px -200px; }
        .bengaluru-3d-map-wrapper .map-fold-bl .paper-texture { background-position: 0px -400px; }
        .bengaluru-3d-map-wrapper .map-fold-bc .paper-texture { background-position: -200px -400px; }
        .bengaluru-3d-map-wrapper .map-fold-br .paper-texture { background-position: -400px -400px; }
        
        .bengaluru-3d-map-wrapper .face::before {
          content: '';
          position: absolute;
          inset: 0;
          filter: url(#paper-texture-filter);
          pointer-events: none;
          z-index: 14;
        }

        /* Crease overlay shadows along the seams */
        .bengaluru-3d-map-wrapper .face::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 12;
        }
        
        .bengaluru-3d-map-wrapper .map-fold-ml .face.front::after { box-shadow: inset -6px 0 12px rgba(0,0,0,0.08), inset -1px 0 rgba(0,0,0,0.06); }
        .bengaluru-3d-map-wrapper .map-fold-mr .face.front::after { box-shadow: inset 6px 0 12px rgba(0,0,0,0.08), inset 1px 0 rgba(0,0,0,0.06); }
        .bengaluru-3d-map-wrapper .map-fold-tc .face.front::after { box-shadow: inset 0 -6px 12px rgba(0,0,0,0.08), inset 0 -1px rgba(0,0,0,0.06); }
        .bengaluru-3d-map-wrapper .map-fold-bc .face.front::after { box-shadow: inset 0 6px 12px rgba(0,0,0,0.08), inset 0 1px rgba(0,0,0,0.06); }
        .bengaluru-3d-map-wrapper .map-fold-tl .face.front::after { box-shadow: inset -4px 0 8px rgba(0,0,0,0.05); }
        .bengaluru-3d-map-wrapper .map-fold-tr .face.front::after { box-shadow: inset 4px 0 8px rgba(0,0,0,0.05); }
        .bengaluru-3d-map-wrapper .map-fold-bl .face.front::after { box-shadow: inset -4px 0 8px rgba(0,0,0,0.05); }
        .bengaluru-3d-map-wrapper .map-fold-br .face.front::after { box-shadow: inset 4px 0 8px rgba(0,0,0,0.05); }

        /* ─── LEAFLET CONTAINER TILES ─── */
        .bengaluru-3d-map-wrapper .map-tile {
          width: 200px;
          height: 200px;
          position: absolute;
          inset: 0;
          z-index: 1;
          background: #faf6ee;
        }

        /* Force Leaflet base color match map paper background */
        .bengaluru-3d-map-wrapper .leaflet-container {
          background: #faf6ee !important;
        }
        
        /* Clean up Leaflet pane overflows */
        .bengaluru-3d-map-wrapper .leaflet-pane {
          z-index: 1 !important;
        }

        /* ─── RADAR MARKER AURA GLOW FILTER ─── */
        .bengaluru-3d-map-wrapper .blue-glow-marker {
          filter: drop-shadow(0 0 8px rgba(29, 114, 232, 0.8));
        }

        /* ─── GLOWING NODE TRANSITIONS ─── */
        .bengaluru-3d-map-wrapper .custom-radar-icon {
          background: none !important;
          border: none !important;
          opacity: 1;
          transition: opacity 0.4s ease 0s;
        }
        
        .bengaluru-3d-map-wrapper .map-container.folded .custom-radar-icon {
          opacity: 0;
          transition: opacity 0.2s ease 0s;
        }

        /* ─── 2 CONCENTRIC HUD MARKERS ─── */
        .bengaluru-3d-map-wrapper .hud-node {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        /* Glowing Blue Aura */
        .bengaluru-3d-map-wrapper .hud-glow {
          position: absolute;
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, rgba(29, 114, 232, 0.42) 0%, rgba(29, 114, 232, 0) 70%);
          border-radius: 50%;
          pointer-events: none;
          filter: blur(2px);
        }

        /* Outer Circle (Dashed, Rotating/Crawling + Breathing) */
        .bengaluru-3d-map-wrapper .hud-outer {
          position: absolute;
          width: 56px;
          height: 56px;
          border: 1px dashed rgba(29, 114, 232, 0.65);
          border-radius: 50%;
          animation: 
            hudPulseOuter 3s ease-in-out infinite,
            hudRotate 8s linear infinite;
          box-shadow: 0 0 8px rgba(29, 114, 232, 0.2);
        }

        /* Inner Circle (Solid, Breathing) */
        .bengaluru-3d-map-wrapper .hud-inner {
          position: absolute;
          width: 28px;
          height: 28px;
          border: 1.2px solid rgba(29, 114, 232, 0.85);
          border-radius: 50%;
          animation: hudPulseInner 3s ease-in-out infinite;
          box-shadow: 0 0 6px rgba(29, 114, 232, 0.3);
        }

        /* Central Core Dot */
        .bengaluru-3d-map-wrapper .hud-core {
          position: absolute;
          width: 9px;
          height: 9px;
          background: #0055ff;
          border: 1.5px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 10px #1d72e8;
        }

        /* Keyframe Animations */
        @keyframes hudRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes hudPulseOuter {
          0%, 100% {
            transform: scale(0.9);
            opacity: 0.55;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.9;
          }
        }

        @keyframes hudPulseInner {
          0%, 100% {
            transform: scale(0.85);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.95;
          }
        }

        /* ─── MINIMAL POCKET GUIDE COVER (BACK OF BC) ─── */
        .bengaluru-3d-map-wrapper .guide-cover {
          position: absolute;
          inset: 8px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          color: #1e1e20;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          font-family: 'Outfit', sans-serif;
          z-index: 2;
        }

        .bengaluru-3d-map-wrapper .guide-brand {
          font-family: 'Outfit', sans-serif;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #1e1e20;
        }

        /* Rounded outer corners for the unfolded map */
        .bengaluru-3d-map-wrapper .map-fold-tl .face { border-top-left-radius: 12px; }
        .bengaluru-3d-map-wrapper .map-fold-tr .face { border-top-right-radius: 12px; }
        .bengaluru-3d-map-wrapper .map-fold-bl .face { border-bottom-left-radius: 12px; }
        .bengaluru-3d-map-wrapper .map-fold-br .face { border-bottom-right-radius: 12px; }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .bengaluru-3d-map-wrapper {
            min-height: 420px;
          }
          .bengaluru-3d-map-wrapper .scene {
            transform: scale(0.7) !important;
            margin-top: -90px;
            margin-bottom: -90px;
          }
        }
        @media (max-width: 480px) {
          .bengaluru-3d-map-wrapper {
            min-height: 200px;
          }
          .bengaluru-3d-map-wrapper .scene {
            transform: scale(0.42) !important;
            margin-top: -210px;
            margin-bottom: -210px;
          }
        }
        @media (max-width: 400px) {
          .bengaluru-3d-map-wrapper {
            min-height: 160px;
          }
          .bengaluru-3d-map-wrapper .scene {
            transform: scale(0.36) !important;
            margin-top: -220px;
            margin-bottom: -220px;
          }
        }
      `}</style>

      {/* Hidden master SVG filter for paper texture (applied to tile surfaces) */}
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
        <defs>
          <filter id="paper-texture-filter" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0" in="noise" result="coloredNoise" />
            <feComposite operator="in" in2="SourceGraphic" />
            <feBlend mode="multiply" in="SourceGraphic" in2="coloredNoise" />
          </filter>
        </defs>
      </svg>

      <div
        className="scene"
        ref={sceneRef}
      >
        {/* Map Container with 3x3 Nested Folding Rig */}
        <div
          className={`map-container ${isFoldedClass ? "folded" : ""}`}
          ref={mapContainerRef}
        >
          {/* Center stationary panel (MC) */}
          <div className="map-fold-panel map-fold-mc">
            <div className="face front">
              <div ref={refs.mc} className="map-tile"></div>
              <div className="paper-texture"></div>
            </div>
            <div className="face back">
              <div className="paper-texture"></div>
            </div>

            {/* Middle-Left (ML) - hinged to MC's left */}
            <div className="map-fold-panel map-fold-ml">
              <div className="face front">
                <div ref={refs.ml} className="map-tile"></div>
                <div className="paper-texture"></div>
              </div>
              <div className="face back">
                <div className="paper-texture"></div>
              </div>
            </div>

            {/* Middle-Right (MR) - hinged to MC's right */}
            <div className="map-fold-panel map-fold-mr">
              <div className="face front">
                <div ref={refs.mr} className="map-tile"></div>
                <div className="paper-texture"></div>
              </div>
              <div className="face back">
                <div className="paper-texture"></div>
              </div>
            </div>

            {/* Top-Center (TC) - hinged to MC's top */}
            <div className="map-fold-panel map-fold-tc">
              <div className="face front">
                <div ref={refs.tc} className="map-tile"></div>
                <div className="paper-texture"></div>
              </div>
              <div className="face back">
                <div className="paper-texture"></div>
              </div>

              {/* Top-Left (TL) - nested in TC, hinged to TC's left */}
              <div className="map-fold-panel map-fold-tl">
                <div className="face front">
                  <div ref={refs.tl} className="map-tile"></div>
                  <div className="paper-texture"></div>
                </div>
                <div className="face back">
                  <div className="paper-texture"></div>
                </div>
              </div>

              {/* Top-Right (TR) - nested in TC, hinged to TC's right */}
              <div className="map-fold-panel map-fold-tr">
                <div className="face front">
                  <div ref={refs.tr} className="map-tile"></div>
                  <div className="paper-texture"></div>
                </div>
                <div className="face back">
                  <div className="paper-texture"></div>
                </div>
              </div>
            </div>

            {/* Bottom-Center (BC) - hinged to MC's bottom */}
            {/* Contains the printed Guide Cover on its back face */}
            <div className="map-fold-panel map-fold-bc">
              <div className="face front">
                <div ref={refs.bc} className="map-tile"></div>
                <div className="paper-texture"></div>
              </div>
              {/* BC Back Face: Show guide cover when folded (top of stack) */}
              <div className="face back">
                <div className="guide-cover">
                  <div className="guide-brand">Blitz</div>
                </div>
                <div className="paper-texture"></div>
              </div>

              {/* Bottom-Left (BL) - nested in BC, hinged to BC's left */}
              <div className="map-fold-panel map-fold-bl">
                <div className="face front">
                  <div ref={refs.bl} className="map-tile"></div>
                  <div className="paper-texture"></div>
                </div>
                <div className="face back">
                  <div className="paper-texture"></div>
                </div>
              </div>

              {/* Bottom-Right (BR) - nested in BC, hinged to BC's right */}
              <div className="map-fold-panel map-fold-br">
                <div className="face front">
                  <div ref={refs.br} className="map-tile"></div>
                  <div className="paper-texture"></div>
                </div>
                <div className="face back">
                  <div className="paper-texture"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
