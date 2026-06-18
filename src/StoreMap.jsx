import { useEffect, useMemo, useState, Fragment, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const COVERAGE_COLOR = "#f59e0b"; // Premium orange/gold color from reference design


function areaCode(name) {
  return name.replace(/\s*DS$/i, "").split(" ")[0].slice(0, 3).toUpperCase();
}

function createStoreIcon(store, inCart) {
  return L.divIcon({
    className: "leaflet-store-marker-wrap",
    html: `
      <div class="leaflet-store-marker ss-marker-${store.avail}${inCart ? " in-cart" : ""}">
        <span class="ss-marker-dot"></span>
        <span class="ss-marker-label">${store.area} DS</span>
      </div>
    `,
    iconSize: [56, 64],
    iconAnchor: [28, 6],
    popupAnchor: [0, -10],
  });
}


const MUMBAI_WEST_COAST = [
  { lat: 18.90, lng: 72.805 },
  { lat: 18.92, lng: 72.820 },
  { lat: 18.94, lng: 72.820 },
  { lat: 18.95, lng: 72.793 },
  { lat: 19.01, lng: 72.815 },
  { lat: 19.04, lng: 72.816 },
  { lat: 19.10, lng: 72.825 },
  { lat: 19.13, lng: 72.808 },
  { lat: 19.19, lng: 72.793 },
  { lat: 19.23, lng: 72.775 },
  { lat: 19.30, lng: 72.770 },
];

const MUMBAI_EAST_COAST = [
  { lat: 18.90, lng: 72.815 },
  { lat: 19.00, lng: 72.860 },
  { lat: 19.04, lng: 72.885 },
  { lat: 19.16, lng: 72.950 },
  { lat: 19.22, lng: 72.980 },
  { lat: 19.29, lng: 72.980 },
];

function getMumbaiWestCoastLng(lat) {
  const clampedLat = Math.max(18.895, Math.min(19.32, lat));
  if (clampedLat < 18.90) return 72.805;
  if (clampedLat > 19.30) return 72.770;
  for (let i = 0; i < MUMBAI_WEST_COAST.length - 1; i++) {
    const p1 = MUMBAI_WEST_COAST[i];
    const p2 = MUMBAI_WEST_COAST[i + 1];
    if (clampedLat >= p1.lat && clampedLat <= p2.lat) {
      const t = (clampedLat - p1.lat) / (p2.lat - p1.lat);
      return p1.lng + t * (p2.lng - p1.lng);
    }
  }
  return 72.805;
}

function getMumbaiEastCoastLng(lat) {
  const clampedLat = Math.max(18.895, Math.min(19.32, lat));
  if (clampedLat < 18.90) return 72.815;
  if (clampedLat > 19.29) return 72.980;
  for (let i = 0; i < MUMBAI_EAST_COAST.length - 1; i++) {
    const p1 = MUMBAI_EAST_COAST[i];
    const p2 = MUMBAI_EAST_COAST[i + 1];
    if (clampedLat >= p1.lat && clampedLat <= p2.lat) {
      const t = (clampedLat - p1.lat) / (p2.lat - p1.lat);
      return p1.lng + t * (p2.lng - p1.lng);
    }
  }
  return 72.95;
}

function adjustForLandOnly(lat, lng, store) {
  const isMumbai = store.lng < 74.0 && store.lat > 18.5 && store.lat < 19.5;
  const isKolkata = store.lng > 88.0 && store.lng < 89.0 && store.lat > 22.0 && store.lat < 23.0;

  if (isMumbai) {
    const clampedLat = Math.max(18.895, Math.min(19.32, lat));
    const westLimit = getMumbaiWestCoastLng(clampedLat);
    const eastLimit = getMumbaiEastCoastLng(clampedLat);
    let adjustedLng = lng;

    if (lng < westLimit) {
      adjustedLng = westLimit;
    } else if (lng > eastLimit) {
      adjustedLng = eastLimit;
    }

    return [clampedLat, adjustedLng];
  }

  if (isKolkata) {
    const isNewTown = store.area.toLowerCase().includes("new town");

    if (isNewTown) {
      // New Town store is further east. Clamp to avoid the wetlands on the east/south.
      const clampedLat = Math.max(22.540, Math.min(22.650, lat));
      // Clamp longitude to stay inside the New Town land corridor.
      const clampedLng = Math.max(88.435, Math.min(88.515, lng));
      return [clampedLat, clampedLng];
    } else {
      // Salt Lake store. Clamp to stay inside Salt Lake land and not cross the Hooghly River (west) or push deep into wetlands (east).
      const clampedLat = Math.max(22.520, Math.min(22.650, lat));
      const clampedLng = Math.max(88.345, Math.min(88.445, lng));
      return [clampedLat, clampedLng];
    }
  }

  return [lat, lng];
}

function getDestinationPoint(lat, lng, distanceMeters, bearingDegrees) {
  const nLat = parseFloat(lat);
  const nLng = parseFloat(lng);
  const R = 6378137; // Earth's radius in meters
  const dDivR = distanceMeters / R;
  const rLat = (nLat * Math.PI) / 180;
  const rLng = (nLng * Math.PI) / 180;
  const rBearing = (bearingDegrees * Math.PI) / 180;

  const sinRLat = Math.sin(rLat);
  const cosRLat = Math.cos(rLat);
  const cosDDivR = Math.cos(dDivR);
  const sinDDivR = Math.sin(dDivR);

  const destLatRad = Math.asin(sinRLat * cosDDivR + cosRLat * sinDDivR * Math.cos(rBearing));
  const destLngRad = rLng + Math.atan2(
    Math.sin(rBearing) * sinDDivR * cosRLat,
    cosDDivR - sinRLat * Math.sin(destLatRad)
  );

  return [
    (destLatRad * 180) / Math.PI,
    (destLngRad * 180) / Math.PI
  ];
}

const STORE_CUSTOM_OFFSETS = {
  "Rohini DS": [
    [0.045, -0.06],
    [0.04, 0.03],
    [0.01, 0.07],
    [-0.03, 0.06],
    [-0.04, -0.01],
    [-0.02, -0.06],
    [0.01, -0.08]
  ],
  "Vikaspuri DS": [
    [0.03, -0.06],
    [0.01, 0.02],
    [-0.04, 0.05],
    [-0.09, -0.02],
    [-0.07, -0.08],
    [-0.01, -0.09],
    [0.02, -0.08]
  ],
  "Vasant Kunj DS": [
    [0.04, -0.03],
    [0.06, 0.02],
    [0.02, 0.07],
    [-0.03, 0.05],
    [-0.08, 0.01],
    [-0.07, -0.04],
    [-0.02, -0.05]
  ],
  "Krishna Nagar DS": [
    [0.05, -0.04],
    [0.06, 0.02],
    [0.02, 0.06],
    [-0.04, 0.05],
    [-0.05, -0.02],
    [-0.01, -0.05]
  ],
  "Gurgaon DS": [
    [0.04, -0.05],
    [0.03, 0.03],
    [-0.02, 0.05],
    [-0.05, 0.02],
    [-0.06, -0.03],
    [-0.02, -0.06]
  ],
  "Marathahalli DS": [
    [0.03, -0.04],
    [0.04, 0.02],
    [0.01, 0.04],
    [-0.03, 0.03],
    [-0.04, -0.02],
    [-0.01, -0.04]
  ],
  "Whitefield DS": [
    [0.04, -0.03],
    [0.03, 0.04],
    [-0.02, 0.04],
    [-0.04, 0.01],
    [-0.03, -0.04],
    [-0.01, -0.03]
  ],
  "JP Nagar DS": [
    [0.03, -0.03],
    [0.03, 0.02],
    [-0.01, 0.04],
    [-0.04, 0.01],
    [-0.04, -0.03],
    [-0.01, -0.04]
  ],
  "RR Nagar DS": [
    [0.04, -0.02],
    [0.02, 0.03],
    [-0.02, 0.04],
    [-0.04, 0.01],
    [-0.03, -0.03],
    [-0.01, -0.04]
  ],
  "Nagasandra DS": [
    [0.03, -0.03],
    [0.03, 0.03],
    [-0.01, 0.04],
    [-0.04, 0.01],
    [-0.03, -0.03],
    [-0.01, -0.04]
  ],
  "HSR Layout DS": [
    [0.03, -0.02],
    [0.02, 0.03],
    [-0.02, 0.04],
    [-0.04, 0.01],
    [-0.03, -0.03],
    [-0.01, -0.04]
  ],
  "LP (Worli) DS": [
    [0.03, -0.03],
    [0.02, 0.02],
    [-0.01, 0.03],
    [-0.03, 0.01],
    [-0.02, -0.02],
    [-0.01, -0.03]
  ],
  "Borivali DS": [
    [0.04, -0.03],
    [0.03, 0.03],
    [-0.02, 0.04],
    [-0.04, 0.01],
    [-0.03, -0.03],
    [-0.01, -0.04]
  ],
  "Santacruz DS": [
    [0.03, -0.03],
    [0.03, 0.03],
    [-0.01, 0.04],
    [-0.04, 0.01],
    [-0.03, -0.03],
    [-0.01, -0.04]
  ],
  "Salt Lake DS": [
    [0.04, -0.03],
    [0.03, 0.03],
    [-0.02, 0.04],
    [-0.04, 0.01],
    [-0.03, -0.03],
    [-0.01, -0.04]
  ],
  "New Town DS": [
    [0.03, -0.03],
    [0.03, 0.03],
    [-0.01, 0.04],
    [-0.04, 0.01],
    [-0.03, -0.03],
    [-0.01, -0.04]
  ]
};

function generateIrregularPolygon(store, allStores) {
  const name = store.name;
  let offsets = STORE_CUSTOM_OFFSETS[name];

  if (!offsets) {
    // Fallback to a beautifully generated, blocky 8-sided polygon
    const numPoints = 8;
    offsets = [];
    const seedString = String(store.id || store.name || "");
    const hash = seedString.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (offset) => {
      const x = Math.sin(hash + offset) * 10000;
      return x - Math.floor(x);
    };
    
    // Scale factor to convert meters to approximate lat/lng degrees (approx 5km = 0.045 degrees)
    const baseDegree = 0.045;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 360) / numPoints;
      const angleRad = (angle * Math.PI) / 180;
      
      const dev1 = Math.sin(angleRad) * 0.005 * random(1);
      const dev2 = Math.cos(angleRad * 2) * 0.008 * random(2);
      const dev3 = Math.sin(angleRad * 3) * 0.004 * random(3);
      const distDegree = baseDegree + dev1 + dev2 + dev3;
      
      offsets.push([
        Math.cos(angleRad) * distDegree,
        Math.sin(angleRad) * distDegree * 1.15 // compensate for longitude scaling
      ]);
    }
  }

  // Calculate centroid of the offsets to center the polygon perfectly around the store coordinates [0, 0]
  let sumLat = 0;
  let sumLng = 0;
  for (const [dLat, dLng] of offsets) {
    sumLat += dLat;
    sumLng += dLng;
  }
  const avgLat = sumLat / offsets.length;
  const avgLng = sumLng / offsets.length;

  // Center the offsets, scale them down slightly (0.72) to reduce coverage radius, and map to absolute store coordinates
  const points = offsets.map(([dLat, dLng]) => {
    const centeredLat = (dLat - avgLat) * 0.72;
    const centeredLng = (dLng - avgLng) * 0.72;
    return [store.lat + centeredLat, store.lng + centeredLng];
  });

  const otherStores = allStores.filter((s) => s.id !== store.id && s.lat != null && s.lng != null);

  // Apply Voronoi overlap constraint to prevent overlaps
  const nonOverlappingPoints = points.map(([lat, lng]) => {
    const p = [lat, lng];

    for (const other of otherStores) {
      const dLatSelf = p[0] - store.lat;
      const dLngSelf = p[1] - store.lng;
      const distSelfSq = dLatSelf * dLatSelf + dLngSelf * dLngSelf;

      const dLatOther = p[0] - other.lat;
      const dLngOther = p[1] - other.lng;
      const distOtherSq = dLatOther * dLatOther + dLngOther * dLngOther;

      if (distOtherSq < distSelfSq) {
        // Point overlaps with other store's territory, project/pull it back onto the bisector
        const vLat = other.lat - store.lat;
        const vLng = other.lng - store.lng;
        const vLenSq = vLat * vLat + vLng * vLng;

        if (vLenSq > 0) {
          const dot = dLatSelf * vLat + dLngSelf * vLng;
          if (dot > 0) {
            // Factor to place point on bisector, pull back slightly by 0.015 for a premium visual boundary gap
            const t = Math.max(0.1, Math.min(0.95, vLenSq / (2 * dot) - 0.015));
            p[0] = store.lat + t * dLatSelf;
            p[1] = store.lng + t * dLngSelf;
          }
        }
      }
    }

    return p;
  });

  // Clamp points to land if necessary
  return nonOverlappingPoints.map(([lat, lng]) => {
    return adjustForLandOnly(lat, lng, store);
  });
}

function getStoreBaseRadius(store) {
  const seedString = String(store.id || store.name || "");
  const hash = seedString.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (offset) => {
    const x = Math.sin(hash + offset) * 10000;
    return x - Math.floor(x);
  };
  return 4700 + random(1) * 600;
}

function PulsingRadarCircle({ store, polygonCoords }) {
  const polygonRef = useRef(null);
  const sLat = parseFloat(store.lat);
  const sLng = parseFloat(store.lng);

  useEffect(() => {
    let animId;
    let lastTime = performance.now();
    const cycleDuration = 5000; // 5 seconds cycle
    const pulseDuration = 1500; // 1.5 seconds active expansion
    const seedOffset = ((store.id || 0) * 1200) % cycleDuration; // stagger start times organically

    const tick = (now) => {
      const elapsed = now - lastTime + seedOffset;
      const cycleTime = elapsed % cycleDuration;
      
      const polygon = polygonRef.current;
      if (polygon && polygonCoords) {
        if (cycleTime < pulseDuration) {
          const progress = cycleTime / pulseDuration;
          
          const scaledCoords = polygonCoords.map(([lat, lng]) => {
            const dLat = lat - sLat;
            const dLng = lng - sLng;
            return [
              sLat + dLat * progress,
              sLng + dLng * progress
            ];
          });

          polygon.setLatLngs(scaledCoords);
          polygon.setStyle({
            fillOpacity: 0.15 * (1 - progress),
            weight: 3.5 * (1 - progress) + 0.5,
            opacity: 0.95 * (1 - progress),
          });
        } else {
          // Hide during the idle phase of the 5s cycle
          polygon.setLatLngs([]);
          polygon.setStyle({
            fillOpacity: 0,
            weight: 0,
            opacity: 0,
          });
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [polygonCoords, sLat, sLng, store.id]);

  const color = COVERAGE_COLOR;

  return (
    <Polygon
      ref={polygonRef}
      positions={[]}
      interactive={false}
      pathOptions={{
        color: color,
        fillColor: color,
        fillOpacity: 0,
        weight: 0,
        opacity: 0,
        strokeLinejoin: "round",
        strokeLinecap: "round"
      }}
    />
  );
}


function InvalidateSize() {
  const map = useMap();

  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(t);
  }, [map]);

  return null;
}

function FitBounds({ stores }) {
  const map = useMap();

  useEffect(() => {
    if (!stores.length) return;
    
    const lat = stores.reduce((sum, s) => sum + s.lat, 0) / stores.length;
    const lng = stores.reduce((sum, s) => sum + s.lng, 0) / stores.length;
    
    const isDelhi = stores.some((s) => s.lat > 28.0 && s.lat < 29.0 && s.lng > 76.5 && s.lng < 77.5);
    const isKolkata = stores.some((s) => s.lng > 88.0 && s.lng < 89.0 && s.lat > 22.0 && s.lat < 23.0);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    let targetZoom = 11;
    if (isKolkata) {
      targetZoom = isMobile ? 11 : 12;
    } else if (isDelhi) {
      targetZoom = isMobile ? 9 : 10;
    } else {
      targetZoom = isMobile ? 10 : 11;
    }
    
    map.invalidateSize();
    map.setView([lat, lng], targetZoom, { animate: true });
  }, [map, stores]);

  return null;
}

function FocusStore({ storeId, stores }) {
  const map = useMap();

  useEffect(() => {
    if (!storeId) return;
    const store = stores.find((s) => s.id === storeId);
    if (!store) return;
    
    const isDelhi = store.lat > 28.0 && store.lat < 29.0 && store.lng > 76.5 && store.lng < 77.5;
    const isKolkata = store.lng > 88.0 && store.lng < 89.0 && store.lat > 22.0 && store.lat < 23.0;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    let targetZoom = 14;
    if (isKolkata) {
      targetZoom = isMobile ? 11 : 12;
    } else if (isDelhi) {
      targetZoom = isMobile ? 11 : 13;
    } else {
      targetZoom = isMobile ? 12 : 14;
    }
    
    map.flyTo([store.lat, store.lng], targetZoom, { duration: 0.6 });
  }, [map, storeId, stores]);

  return null;
}

export default function StoreMap({
  stores,
  cartMap,
  browseCity,
  highlightedStoreId,
  onConfigureStore,
}) {
  const mapStores = useMemo(
    () => stores.filter((s) => s.lat != null && s.lng != null),
    [stores]
  );

  const defaultCenter = useMemo(() => {
    if (!mapStores.length) return [20.5937, 78.9629];
    const lat = mapStores.reduce((sum, s) => sum + s.lat, 0) / mapStores.length;
    const lng = mapStores.reduce((sum, s) => sum + s.lng, 0) / mapStores.length;
    return [lat, lng];
  }, [mapStores]);

  if (!mapStores.length) {
    return (
      <div className="ss-map ss-map-empty">
        <p className="ss-hint">No map locations available for stores in {browseCity}.</p>
      </div>
    );
  }

  return (
    <div className="ss-map ss-map-leaflet">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom
        className="ss-leaflet-container"
      >
        <TileLayer
          attribution={OSM_ATTRIBUTION}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <InvalidateSize />
        <FitBounds stores={mapStores} />
        <FocusStore storeId={highlightedStoreId} stores={mapStores} />

        {/* Render irregular 5km coverage zones (polygons) */}
        {mapStores.map((store) => {
          const isHighlighted = store.id === highlightedStoreId;
          const polygonCoords = generateIrregularPolygon(store, mapStores);

          return (
            <Fragment key={`zone-group-${store.id}`}>
              {/* Pulse circle starting from store icon and expanding to the end of the radius */}
              <PulsingRadarCircle
                store={store}
                polygonCoords={polygonCoords}
              />

              {/* Clean reference-style polygon with premium outline and semi-transparent fill */}
              <Polygon
                positions={polygonCoords}
                interactive={false}
                pathOptions={{
                  className: `store-radius-polygon-base${isHighlighted ? " store-radius-polygon-base-highlighted" : ""}`,
                  color: isHighlighted ? COVERAGE_COLOR : "rgba(245, 158, 11, 0.65)",
                  fillColor: "#2d2510",
                  fillOpacity: isHighlighted ? 0.55 : 0.35,
                  weight: isHighlighted ? 4.5 : 2.5,
                  strokeLinejoin: "round",
                  strokeLinecap: "round"
                }}
              />
            </Fragment>
          );
        })}

        {/* Render store markers */}
        {mapStores.map((store) => {
          const inCart = Boolean(cartMap[store.id]);
          const unavailable = store.disabled || store.shelvesAvailable <= 0;

          return (
            <Marker
              key={store.id}
              position={[store.lat, store.lng]}
              icon={createStoreIcon(store, inCart)}
              eventHandlers={{
                click: () => {
                  /* popup opens on click */
                },
              }}
            >
              <Popup className="ss-leaflet-popup" closeButton>
                <div className="ss-leaflet-popup-inner">
                  <h4>{store.name}</h4>
                  <p className="ss-leaflet-popup-area">{store.area} · {browseCity}</p>
                  <p className={`ss-pill ss-pill-${store.avail}`}>
                    <span className="ss-pill-dot" />
                    {store.availability}
                  </p>
                  <p className="ss-popup-storage">{store.storage}</p>
                  {store.address && (
                    <p className="ss-leaflet-popup-address">{store.address}</p>
                  )}
                  {!unavailable ? (
                    <button
                      type="button"
                      className="ss-popup-link"
                      onClick={() => onConfigureStore(store.id)}
                    >
                      Configure racks in grid →
                    </button>
                  ) : (
                    <p className="ss-unavailable-msg" style={{ marginTop: 8 }}>No racks available</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
