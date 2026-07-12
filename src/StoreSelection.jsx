import { useMemo, useState } from "react";
import StoreMap from "./StoreMap.jsx";

const Icon = {
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Grid: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Map: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  Pin: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Cart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  Minus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Check: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Building: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
    </svg>
  ),
};

function storageTags(storage) {
  if (!storage) return [];
  if (storage.toLowerCase().includes("all types")) return ["Ambient", "Chilled", "Frozen"];
  return storage.split(/[·,]/).map((s) => s.trim()).filter(Boolean);
}

function groupCartByCity(cart) {
  const groups = {};
  for (const item of cart) {
    const key = item.city || "Other";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}

export default function StoreSelection({
  theme,
  cities,
  browseCity,
  onBrowseCityChange,
  stores,
  storesLoading,
  storesError,
  cart,
  onAddToCart,
  onRemoveFromCart,
  highlightedStoreId,
  onHighlightStore,
  disclaimerAgreed,
  onDisclaimerAgreedChange,
}) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [rackDrafts, setRackDrafts] = useState({});

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q) ||
        (s.address && s.address.toLowerCase().includes(q))
    );
  }, [stores, search]);

  const cartMap = useMemo(
    () => Object.fromEntries(cart.map((item) => [item.storeId, item])),
    [cart]
  );

  const cartByCity = useMemo(() => groupCartByCity(cart), [cart]);
  const totalRacks = cart.reduce((sum, item) => sum + item.racks, 0);
  const cityCount = Object.keys(cartByCity).length;

  const getDraftRacks = (storeId, maxRacks) => {
    const inCart = cartMap[storeId];
    const defaultVal = inCart ? inCart.racks : 0;
    const draft = rackDrafts[storeId] ?? defaultVal;
    if (draft === "") return 0;
    const num = Number(draft);
    if (isNaN(num)) return 0;
    return Math.min(Math.max(0, num), maxRacks || 0);
  };

  const setDraftRacks = (storeId, value) => {
    setRackDrafts((prev) => ({ ...prev, [storeId]: value }));
  };

  const handleAdd = (store) => {
    if (store.disabled || store.shelvesAvailable <= 0 || !browseCity) return;
    const racks = getDraftRacks(store.id, store.shelvesAvailable);
    if (racks === 0) {
      const inCart = cartMap[store.id];
      if (inCart) {
        onRemoveFromCart(store.id);
      } else {
        alert("Please select at least 1 MiniPod to add to your plan.");
      }
      return;
    }
    setDraftRacks(store.id, racks);
    onAddToCart({
      storeId: store.id,
      storeName: store.name,
      area: store.area,
      address: store.address,
      city: browseCity,
      racks,
      shelvesAvailable: store.shelvesAvailable,
      avail: store.avail,
      availability: store.availability,
    });
  };

  const jumpToStore = (storeId, itemCity) => {
    if (itemCity && itemCity !== browseCity) onBrowseCityChange(itemCity);
    onHighlightStore(storeId);
    setView("grid");
    setTimeout(() => {
      document.getElementById(`store-card-${storeId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  };

  const cartCountForCity = (cityName) =>
    cart.filter((c) => c.city === cityName).length;

  return (
    <div className="ss-wrap">
      <div className="ss-city-filter">
        <span className="ss-city-filter-label">Browse by city</span>
        <div className="ss-city-pills">
          {cities.map((c) => {
            const active = browseCity === c.name;
            const inCart = cartCountForCity(c.name);
            return (
              <button
                key={c.id}
                type="button"
                className={`ss-city-pill${active ? " active" : ""}`}
                onClick={() => onBrowseCityChange(c.name)}
              >
                {c.name}
                {inCart > 0 && <span className="ss-city-pill-badge">{inCart}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="ss-toolbar">
        <div className="ss-search">
          <Icon.Search />
          <input
            type="search"
            placeholder="Search dark stores by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="ss-view-toggle">
          <button type="button" className={`ss-view-btn${view === "grid" ? " active" : ""}`} onClick={() => setView("grid")}>
            <Icon.Grid /> Grid
          </button>
          <button type="button" className={`ss-view-btn${view === "map" ? " active" : ""}`} onClick={() => setView("map")}>
            <Icon.Map /> Map
          </button>
        </div>
      </div>

      {storesError && <p className="ss-error">{storesError}</p>}

      {!browseCity ? (
        <p className="ss-hint">Select a city above to browse dark stores.</p>
      ) : storesLoading ? (
        <p className="ss-hint">Loading stores for {browseCity}…</p>
      ) : view === "grid" ? (
        <div className="ss-grid">
          {filtered.length === 0 && <p className="ss-hint">No stores match your search.</p>}
          {filtered.map((store) => {
            const inCart = cartMap[store.id];
            const unavailable = store.disabled || store.shelvesAvailable <= 0;
            const maxRacks = store.shelvesAvailable || 0;
            const draft = getDraftRacks(store.id, maxRacks);
            const total = store.totalShelves || store.shelvesAvailable || 12;
            const booked = total - store.shelvesAvailable;
            const allocating = draft;
            const pending = store.shelvesAvailable - draft;
            const bookedPct = (booked / total) * 100;
            const allocatingPct = (allocating / total) * 100;
            const pendingPct = (pending / total) * 100;

            return (
              <article
                key={store.id}
                id={`store-card-${store.id}`}
                className={`ss-card${unavailable ? " unavailable" : ""}${inCart ? " in-cart" : ""}${highlightedStoreId === store.id ? " highlighted" : ""}`}
              >

                <div className="ss-card-body">
                  {/* Header: store name + in-cart badge */}
                  <div className="ss-card-head">
                    <div className="ss-card-name-block">
                      <h3 title={store.name}>{store.name}</h3>
                    </div>
                    {inCart && (
                      <span className="ss-in-cart-badge">
                        <Icon.Check /> {inCart.racks} MiniPod{inCart.racks !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Big shelf counter */}
                  {!unavailable && (
                    <div>
                      <div className="ss-shelf-counter">
                        <span className="ss-shelf-counter-num">{store.shelvesAvailable}</span>
                        <span className="ss-shelf-counter-label">MiniPods available</span>
                      </div>
                      <div className="ss-shelf-counter-sub">out of {total} total in this store</div>
                    </div>
                  )}

                  {/* Shelf distribution bar */}
                  <div className="ss-shelf-visualizer">
                    <div className="ss-shelf-progress-wrapper">
                      <div className="ss-shelf-progress-bar">
                        {booked > 0 && (
                          <div className="ss-progress-segment blocked" style={{ width: `${bookedPct}%` }} title={`${booked} already booked`} />
                        )}
                        {allocating > 0 && (
                          <div className="ss-progress-segment selected" style={{ width: `${allocatingPct}%` }} title={`${allocating} you're selecting`} />
                        )}
                        {pending > 0 && (
                          <div className="ss-progress-segment free" style={{ width: `${pendingPct}%` }} title={`${pending} still available`} />
                        )}
                        {unavailable && (
                          <div className="ss-progress-segment blocked" style={{ width: "100%" }} title="No MiniPods available" />
                        )}
                      </div>
                      {/* Legend */}
                      <div className="ss-bar-legend">
                        {booked > 0 && <span className="ss-bar-legend-item"><span className="ss-bar-legend-dot blocked" />{booked} booked</span>}
                        {allocating > 0 && <span className="ss-bar-legend-item"><span className="ss-bar-legend-dot selected" />{allocating} yours</span>}
                      </div>
                    </div>
                  </div>

                  {unavailable && (
                    <p className="ss-unavailable-msg">🚫 All MiniPods are taken at this location</p>
                  )}
                </div>

                {/* Action footer */}
                {!unavailable && (
                  <div className="ss-card-actions">
                    <div className="ss-stepper-row">

                      <div className="ss-qty">
                        <button type="button" aria-label="Decrease" onClick={() => setDraftRacks(store.id, draft - 1, maxRacks)} disabled={draft <= 0}>
                          <Icon.Minus />
                        </button>
                        <input
                          type="number"
                          className="ss-qty-input"
                          value={rackDrafts[store.id] ?? (inCart ? inCart.racks : 0)}
                          min={0}
                          max={maxRacks}
                          onChange={(e) => {
                            const valStr = e.target.value;
                            if (valStr === "") { setDraftRacks(store.id, ""); }
                            else { const val = parseInt(valStr, 10); if (!isNaN(val)) setDraftRacks(store.id, val); }
                          }}
                          onBlur={() => {
                            const raw = rackDrafts[store.id] ?? (inCart ? inCart.racks : 0);
                            let val = parseInt(raw, 10);
                            if (isNaN(val) || val < 0) val = 0;
                            if (val > maxRacks) val = maxRacks;
                            setDraftRacks(store.id, val);
                          }}
                        />
                        <span className="ss-qty-label">MiniPod{draft !== 1 ? "s" : ""}</span>
                        <button type="button" aria-label="Increase" onClick={() => setDraftRacks(store.id, draft + 1, maxRacks)} disabled={draft >= maxRacks}>
                          <Icon.Plus />
                        </button>
                      </div>
                    </div>
                    <button type="button" className="ss-add-btn" onClick={() => handleAdd(store)}>
                      <Icon.Cart />
                      {inCart ? `Update — ${draft} MiniPod${draft !== 1 ? "s" : ""}` : `Reserve ${draft > 0 ? draft + " " : ""}MiniPod${draft !== 1 ? "s" : ""}`}
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="ss-map-wrap">
          <StoreMap
            theme={theme}
            stores={filtered}
            cartMap={cartMap}
            browseCity={browseCity}
            highlightedStoreId={highlightedStoreId}
            onConfigureStore={(storeId) => jumpToStore(storeId, browseCity)}
          />

          <div className="ss-map-legend">
            <span><span className="ss-legend-dot green" /> 10+ MiniPods available</span>
            <span><span className="ss-legend-dot amber" /> 1–10 MiniPods available</span>
            <span><span className="ss-legend-dot red" /> No MiniPods available</span>
          </div>
          <p className="ss-map-hint">Tap a marker for store details, or open grid view to reserve MiniPods.</p>
        </div>
      )}

      {cart.length > 0 && (
        <div className="ss-selection-panel">
          <div className="ss-selection-head">
            <div>
              <h4>Your selection</h4>
              <p>{cart.length} store{cart.length !== 1 ? "s" : ""} across {cityCount} cit{cityCount !== 1 ? "ies" : "y"} · {totalRacks} MiniPod{totalRacks !== 1 ? "s" : ""}</p>
            </div>
            <span className="ss-selection-total">{totalRacks} MiniPods</span>
          </div>

          <div className="ss-selection-groups">
            {Object.entries(cartByCity).map(([cityName, items]) => (
              <div key={cityName} className="ss-selection-city-group">
                <div className="ss-selection-city-label">
                  <Icon.Building />
                  <span>{cityName}</span>
                  <em>{items.length} store{items.length !== 1 ? "s" : ""}</em>
                </div>
                <div className="ss-selection-items">
                  {items.map((item) => (
                    <div key={item.storeId} className="ss-selection-item">
                      <div className="ss-selection-item-main">
                        <div className="ss-selection-item-top">
                          <strong>{item.storeName}</strong>
                          <span className={`ss-pill ss-pill-${item.avail || "green"}`}>
                            <span className="ss-pill-dot" />
                            {item.racks} MiniPod{item.racks !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {item.address && <p className="ss-selection-address"><Icon.Pin /> {item.address}</p>}
                      </div>
                      <div className="ss-selection-item-actions">
                        <button type="button" className="ss-selection-view" onClick={() => jumpToStore(item.storeId, item.city)}>
                          View
                        </button>
                        <button type="button" className="ss-selection-remove" onClick={() => onRemoveFromCart(item.storeId)} aria-label="Remove">
                          <Icon.X />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="ss-selection-disclaimer">
            <div className="ss-disclaimer-text">
              <strong>Disclaimer:</strong> We do not accept, store, handle, fulfill, transport, or deliver any products prohibited or restricted under applicable Indian laws, including but not limited to alcohol, tobacco and nicotine products, cigarettes, vapes, narcotic drugs, controlled substances, firearms, ammunition, explosives, hazardous chemicals, counterfeit goods, wildlife products, obscene materials, human organs, medical waste, or any other illegal, regulated, or restricted items, and reserve the right to refuse service for any such products at our sole discretion.
            </div>
            <label className="ss-disclaimer-agreement">
              <input
                type="checkbox"
                checked={disclaimerAgreed}
                onChange={(e) => onDisclaimerAgreedChange?.(e.target.checked)}
              />
              <span>I accept and agree to the terms of this disclaimer.</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export { Icon as StoreIcon };
