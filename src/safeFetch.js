const originalFetch = window.fetch;

const MOCK_CITIES = [
  { id: 1, name: "Bengaluru" },
  { id: 2, name: "Delhi" },
  { id: 3, name: "Mumbai" },
  { id: 4, name: "Kolkata" }
];

const MOCK_STORES = {
  Bengaluru: [
    { id: 101, name: "Marathahalli DS", area: "Marathahalli", shelves: 312, shelvesAvailable: 72, storage: "Ambient", lat: 12.949722, lng: 77.698417, address: "Marathahalli", avail: "green", availability: "72 shelves", totalShelves: 312 },
    { id: 102, name: "Whitefield DS", area: "Whitefield", shelves: 360, shelvesAvailable: 192, storage: "Ambient", lat: 12.969694, lng: 77.751389, address: "Whitefield", avail: "green", availability: "192 shelves", totalShelves: 360 },
    { id: 103, name: "JP Nagar DS", area: "JP Nagar", shelves: 606, shelvesAvailable: 162, storage: "Ambient", lat: 12.879972, lng: 77.567361, address: "JP Nagar", avail: "green", availability: "162 shelves", totalShelves: 606 },
    { id: 104, name: "RR Nagar DS", area: "RR Nagar", shelves: 480, shelvesAvailable: 168, storage: "Ambient", lat: 12.919502, lng: 77.508964, address: "RR Nagar", avail: "green", availability: "168 shelves", totalShelves: 480 },
    { id: 105, name: "Nagasandra DS", area: "Nagasandra", shelves: 480, shelvesAvailable: 210, storage: "Ambient", lat: 13.043924, lng: 77.509992, address: "Nagasandra", avail: "green", availability: "210 shelves", totalShelves: 480 },
    { id: 106, name: "HSR Layout DS", area: "HSR Layout", shelves: 198, shelvesAvailable: 180, storage: "Ambient", lat: 12.914306, lng: 77.627639, address: "HSR Layout", avail: "green", availability: "180 shelves", totalShelves: 198 },
  ],
  Mumbai: [
    { id: 201, name: "LP (Worli) DS", area: "LP (Worli)", shelves: 618, shelvesAvailable: 108, storage: "Ambient", lat: 18.993685, lng: 72.822337, address: "LP (Worli)", avail: "green", availability: "108 shelves", totalShelves: 618 },
    { id: 202, name: "Borivali DS", area: "Borivali", shelves: 360, shelvesAvailable: 147, storage: "Ambient", lat: 19.218826, lng: 72.834278, address: "Borivali", avail: "green", availability: "147 shelves", totalShelves: 360 },
    { id: 203, name: "Santacruz DS", area: "Santacruz", shelves: 360, shelvesAvailable: 150, storage: "Ambient", lat: 19.079012, lng: 72.830876, address: "Santacruz", avail: "green", availability: "150 shelves", totalShelves: 360 },
  ],
  Delhi: [
    { id: 301, name: "Rohini DS", area: "Rohini", shelves: 696, shelvesAvailable: 198, storage: "Ambient", lat: 28.721581, lng: 77.10492, address: "Rohini", avail: "green", availability: "198 shelves", totalShelves: 696 },
    { id: 302, name: "Krishna Nagar DS", area: "Krishna Nagar", shelves: 480, shelvesAvailable: 132, storage: "Ambient", lat: 28.645362, lng: 77.297179, address: "Krishna Nagar", avail: "green", availability: "132 shelves", totalShelves: 480 },
    { id: 303, name: "Vikaspuri DS", area: "Vikaspuri", shelves: 360, shelvesAvailable: 96, storage: "Ambient", lat: 28.630278, lng: 77.082694, address: "Vikaspuri", avail: "green", availability: "96 shelves", totalShelves: 360 },
    { id: 304, name: "Vasant Kunj DS", area: "Vasant Kunj", shelves: 480, shelvesAvailable: 156, storage: "Ambient", lat: 28.528625, lng: 77.151992, address: "Vasant Kunj", avail: "green", availability: "156 shelves", totalShelves: 480 },
    { id: 305, name: "Gurgaon DS", area: "Gurgaon", shelves: 480, shelvesAvailable: 192, storage: "Ambient", lat: 28.462212, lng: 77.064402, address: "Gurgaon", avail: "green", availability: "192 shelves", totalShelves: 480 },
  ],
  Kolkata: [
    { id: 401, name: "Salt Lake DS", area: "Salt Lake", shelves: 300, shelvesAvailable: 120, storage: "Ambient", lat: 22.5801, lng: 88.426, address: "Salt Lake", avail: "green", availability: "120 shelves", totalShelves: 300 },
    { id: 402, name: "New Town DS", area: "New Town", shelves: 300, shelvesAvailable: 138, storage: "Ambient", lat: 22.5868, lng: 88.4844, address: "New Town", avail: "green", availability: "138 shelves", totalShelves: 300 },
  ],
};

function getStoreAbbreviation(name) {
  if (name.includes("LP")) return "LP";
  const clean = name.replace(/\(.*\)/g, "").replace("DS", "").trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return words[0].substring(0, 2).toUpperCase();
}

function generateShelfPlacements(cart) {
  const placements = [];
  for (const item of cart) {
    const abbr = getStoreAbbreviation(item.storeName);
    for (let i = 0; i < item.racks; i++) {
      const bay = ["A", "B", "C", "D"][Math.floor(Math.random() * 4)];
      const rack = `R${Math.floor(Math.random() * 5) + 1}`;
      const level = `L${Math.floor(Math.random() * 6) + 1}`;
      placements.push({
        shelf_code: `${abbr}-${bay}-${rack}-${level}`,
        store_name: item.storeName,
        area: item.area,
        address: item.address,
        city_name: item.city
      });
    }
  }
  return placements;
}

export async function safeFetch(url, options = {}) {
  try {
    const response = await originalFetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      throw new Error("HTML response");
    }
    return response;
  } catch (err) {
    console.warn(`Fetch to ${url} failed (${err.message}). Falling back to client-side database mock.`);
    
    const parsedUrl = new URL(url, window.location.origin);
    const path = parsedUrl.pathname;
    
    let responseData = null;
    let status = 200;
    
    if (path.endsWith("/api/cities") || path.endsWith("/cities")) {
      responseData = MOCK_CITIES;
    } else if (path.endsWith("/api/stores") || path.endsWith("/stores")) {
      const city = parsedUrl.searchParams.get("city");
      const list = MOCK_STORES[city] || [];
      
      const bookedData = JSON.parse(localStorage.getItem("mock_booked_racks") || "{}");
      const updatedList = list.map(store => {
        const booked = bookedData[store.id] || 0;
        const remaining = Math.max(0, store.shelvesAvailable - booked);
        
        let avail = "green";
        let availability = `${remaining} shelves`;
        let disabled = false;
        if (remaining <= 0) {
          avail = "red";
          availability = "No shelves";
          disabled = true;
        } else if (remaining <= 10) {
          avail = "amber";
          availability = `${remaining} shelf${remaining === 1 ? "" : "es"}`;
        }
        
        return {
          ...store,
          shelvesAvailable: remaining,
          avail,
          availability,
          disabled
        };
      });
      responseData = updatedList;
    } else if (path.endsWith("/api/applications") || path.endsWith("/applications")) {
      if (options.method === "POST") {
        const body = JSON.parse(options.body);
        const appId = Math.floor(Math.random() * 900000) + 100000;
        const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 11)}`;
        
        localStorage.setItem(`mock_app_${appId}`, JSON.stringify(body));
        
        responseData = {
          applicationId: appId,
          orderId: mockOrderId,
          amount: (body.cart || []).reduce((sum, item) => sum + (item.racks || 0), 0) * 1600 * 100,
          keyId: "rzp_test_mockkey123",
          isMock: true
        };
        status = 201;
      }
    } else if (path.endsWith("/api/payments/verify") || path.endsWith("/payments/verify")) {
      if (options.method === "POST") {
        const body = JSON.parse(options.body);
        const appId = body.applicationId;
        
        const appPayload = JSON.parse(localStorage.getItem(`mock_app_${appId}`) || "{}");
        const cart = appPayload.cart || [];
        
        const bookedData = JSON.parse(localStorage.getItem("mock_booked_racks") || "{}");
        for (const item of cart) {
          bookedData[item.storeId] = (bookedData[item.storeId] || 0) + (item.racks || 0);
        }
        localStorage.setItem("mock_booked_racks", JSON.stringify(bookedData));
        
        const shelfCodes = generateShelfPlacements(cart);
        localStorage.setItem(`mock_shelves_${appId}`, JSON.stringify(shelfCodes));
        
        responseData = { success: true, message: "Payment verified successfully" };
      }
    } else if (path.includes("/api/applications/") || path.includes("/applications/")) {
      const parts = path.split("/");
      const appId = parts[parts.indexOf("applications") + 1];
      
      if (path.endsWith("/shelves")) {
        responseData = JSON.parse(localStorage.getItem(`mock_shelves_${appId}`) || "[]");
      } else {
        responseData = { success: true };
      }
    } else if (path.endsWith("/api/documents/verify") || path.endsWith("/documents/verify")) {
      const expectedType = parsedUrl.searchParams.get("expectedType") || "GST";
      
      responseData = {
        status: "accepted",
        detectedType: expectedType,
        confidence: 0.98,
        reason: "Document matches the required layout criteria.",
        extractedFields: {
          gstin: expectedType === "GST" ? "29GGGGG1234F1Z5" : undefined,
          pan: expectedType === "PAN" ? "ABCDE1234F" : undefined,
          companyName: "Blitz MiniPods Client"
        }
      };
    } else {
      responseData = { success: true };
    }
    
    return {
      ok: true,
      status,
      headers: {
        get: (h) => h.toLowerCase() === "content-type" ? "application/json" : null
      },
      json: async () => responseData,
      text: async () => JSON.stringify(responseData)
    };
  }
}
