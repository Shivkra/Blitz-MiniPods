import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isVercel = process.env.VERCEL || process.env.NOW_BUILDER;
const dbPath = isVercel ? "/tmp/darkstore.db" : path.join(__dirname, "darkstore.db");

class MockDatabaseSync {
  constructor(path) {
    this.path = path;
    this.cities = [];
    this.stores = [];
    this.applications = [];
    this.allocated_shelves = [];
    this.cityIdCounter = 1;
    this.storeIdCounter = 1;
    this.appIdCounter = 1;
    this.shelfIdCounter = 1;
  }

  exec(sql) {
    // No-op for mock schema
  }

  prepare(sql) {
    const db = this;
    const cleanSql = sql.replace(/\s+/g, " ").trim();

    return {
      get(...args) {
        return db._executeGet(cleanSql, args);
      },
      run(...args) {
        return db._executeRun(cleanSql, args);
      },
      all(...args) {
        return db._executeAll(cleanSql, args);
      }
    };
  }

  _executeGet(sql, args) {
    if (sql.includes("COUNT(*) AS count FROM cities") && sql.includes("active = 1")) {
      const count = this.cities.filter(c => c.active === 1).length;
      return { count };
    }
    if (sql.includes("FROM cities WHERE name = 'Delhi NCR'")) {
      const city = this.cities.find(c => c.name === "Delhi NCR");
      return city ? { id: city.id } : undefined;
    }
    if (sql.includes("FROM cities WHERE name = 'Delhi'")) {
      const city = this.cities.find(c => c.name === "Delhi");
      return city ? { id: city.id } : undefined;
    }
    if (sql.includes("FROM cities WHERE name = ?")) {
      const city = this.cities.find(c => c.name === args[0]);
      return city ? { id: city.id } : undefined;
    }
    if (sql.includes("FROM stores WHERE city_id = ? AND name = ?")) {
      const store = this.stores.find(s => s.city_id == args[0] && s.name === args[1]);
      return store ? { id: store.id } : undefined;
    }
    if (sql.includes("payment_status FROM applications WHERE id = ?")) {
      const app = this.applications.find(a => a.id == args[0]);
      return app ? { payment_status: app.payment_status } : undefined;
    }
    if (sql.includes("FROM allocated_shelves WHERE application_id = ?")) {
      const shelf = this.allocated_shelves.find(s => s.application_id == args[0]);
      return shelf ? { id: shelf.id } : undefined;
    }
    if (sql.includes("FROM allocated_shelves WHERE store_id = ? AND shelf_code = ?")) {
      const shelf = this.allocated_shelves.find(s => s.store_id == args[0] && s.shelf_code === args[1]);
      return shelf ? { id: shelf.id } : undefined;
    }
    if (sql.includes("FROM cities WHERE name = ? AND active = 1")) {
      const city = this.cities.find(c => c.name === args[0] && c.active === 1);
      return city ? { id: city.id, name: city.name } : undefined;
    }
    if (sql.includes("payload FROM applications WHERE id = ?")) {
      const app = this.applications.find(a => a.id == args[0]);
      return app ? { payload: app.payload } : undefined;
    }
    if (sql.includes("name FROM stores WHERE id = ?")) {
      const store = this.stores.find(s => s.id == args[0]);
      return store ? { name: store.name } : undefined;
    }
    return undefined;
  }

  _executeRun(sql, args) {
    if (sql.includes("UPDATE cities SET name = 'Delhi', active = 1 WHERE id = ?")) {
      const id = args[0];
      const city = this.cities.find(c => c.id == id);
      if (city) {
        city.name = "Delhi";
        city.active = 1;
      }
      return { changes: 1 };
    }
    if (sql.includes("UPDATE stores SET city_id = ? WHERE city_id = ?")) {
      const newId = args[0];
      const oldId = args[1];
      this.stores.forEach(s => {
        if (s.city_id == oldId) s.city_id = newId;
      });
      return { changes: 1 };
    }
    if (sql.includes("DELETE FROM cities WHERE id = ?")) {
      const id = args[0];
      this.cities = this.cities.filter(c => c.id != id);
      return { changes: 1 };
    }
    if (sql.includes("UPDATE cities SET active = 1 WHERE id = ?")) {
      const id = args[0];
      const city = this.cities.find(c => c.id == id);
      if (city) city.active = 1;
      return { changes: 1 };
    }
    if (sql.includes("INSERT INTO cities (name, active) VALUES (?, 1)")) {
      const name = args[0];
      const id = this.cityIdCounter++;
      this.cities.push({ id, name, active: 1 });
      return { lastInsertRowid: id, changes: 1 };
    }
    if (sql.includes("UPDATE cities SET active = 0 WHERE name NOT IN")) {
      this.cities.forEach(c => {
        if (!args.includes(c.name)) c.active = 0;
      });
      return { changes: 1 };
    }
    if (sql.includes("INSERT INTO cities (name) VALUES (?)")) {
      const name = args[0];
      const id = this.cityIdCounter++;
      this.cities.push({ id, name, active: 1 });
      return { lastInsertRowid: id, changes: 1 };
    }
    if (sql.includes("INSERT INTO stores")) {
      const [city_id, name, area, availability, avail, storage, disabled, shelves_available, lat, lng, address] = args;
      const id = this.storeIdCounter++;
      this.stores.push({
        id, city_id, name, area, availability, avail, storage,
        disabled: disabled ? 1 : 0,
        shelves_available, lat, lng, address
      });
      return { lastInsertRowid: id, changes: 1 };
    }
    if (sql.includes("UPDATE stores SET area =") && sql.includes("WHERE id = ?")) {
      const [area, availability, avail, disabled, shelves_available, lat, lng, address, storage, id] = args;
      const store = this.stores.find(s => s.id == id);
      if (store) {
        store.area = area;
        store.availability = availability;
        store.avail = avail;
        store.disabled = disabled ? 1 : 0;
        store.shelves_available = shelves_available;
        store.lat = lat;
        store.lng = lng;
        store.address = address;
        store.storage = storage;
      }
      return { changes: 1 };
    }
    if (sql.includes("DELETE FROM stores WHERE city_id = ? AND name = ?")) {
      const [city_id, name] = args;
      this.stores = this.stores.filter(s => !(s.city_id == city_id && s.name === name));
      return { changes: 1 };
    }
    if (sql.includes("DELETE FROM stores WHERE city_id IN")) {
      const inactiveCityIds = this.cities.filter(c => c.active === 0).map(c => c.id);
      this.stores = this.stores.filter(s => !inactiveCityIds.includes(s.city_id));
      return { changes: 1 };
    }
    if (sql.includes("INSERT INTO applications")) {
      const [brand_name, poc, phone, email, city_id, store_ids, payload] = args;
      const id = this.appIdCounter++;
      this.applications.push({
        id, brand_name, poc, phone, email, city_id, store_ids, payload,
        payment_status: "pending", payment_id: null, amount: 0
      });
      return { lastInsertRowid: id, changes: 1 };
    }
    if (sql.includes("INSERT INTO document_verifications")) {
      if (!this.document_verifications) this.document_verifications = [];
      const id = this.document_verifications.length + 1;
      const [file_name, expected_type, detected_type, status, confidence, reason, extracted_text] = args;
      this.document_verifications.push({
        id, file_name, expected_type, detected_type, status, confidence, reason, extracted_text,
        created_at: new Date().toISOString()
      });
      return { lastInsertRowid: id, changes: 1 };
    }
    if (sql.includes("UPDATE applications SET payment_id = ?, payment_status = ?, amount = ? WHERE id = ?")) {
      const [payment_id, status, amount, id] = args;
      const app = this.applications.find(a => a.id == id);
      if (app) {
        app.payment_id = payment_id;
        app.payment_status = status;
        app.amount = amount;
      }
      return { changes: 1 };
    }
    if (sql.includes("UPDATE applications SET payment_id = ?, payment_status = ? WHERE id = ?")) {
      const [payment_id, status, id] = args;
      const app = this.applications.find(a => a.id == id);
      if (app) {
        app.payment_id = payment_id;
        app.payment_status = status;
      }
      return { changes: 1 };
    }
    if (sql.includes("UPDATE applications SET payload = ? WHERE id = ?")) {
      const [payload, id] = args;
      const app = this.applications.find(a => a.id == id);
      if (app) {
        app.payload = payload;
      }
      return { changes: 1 };
    }
    if (sql.includes("INSERT INTO allocated_shelves")) {
      const [application_id, store_id, shelf_code] = args;
      const id = this.shelfIdCounter++;
      this.allocated_shelves.push({ id, application_id: Number(application_id), store_id, shelf_code });
      return { lastInsertRowid: id, changes: 1 };
    }
    if (sql.includes("UPDATE stores SET shelves_available =") && sql.includes("disabled = ? WHERE id = ?")) {
      const [shelves_available, availability, avail, disabled, id] = args;
      const store = this.stores.find(s => s.id == id);
      if (store) {
        store.shelves_available = shelves_available;
        store.availability = availability;
        store.avail = avail;
        store.disabled = disabled ? 1 : 0;
      }
      return { changes: 1 };
    }
    return { changes: 0 };
  }

  _executeAll(sql, args) {
    if (sql.includes("table_info(stores)")) {
      return [
        { name: "id" },
        { name: "city_id" },
        { name: "name" },
        { name: "area" },
        { name: "availability" },
        { name: "avail" },
        { name: "storage" },
        { name: "disabled" },
        { name: "shelves_available" },
        { name: "lat" },
        { name: "lng" },
        { name: "address" }
      ];
    }
    if (sql.includes("table_info(applications)")) {
      return [
        { name: "id" },
        { name: "brand_name" },
        { name: "poc" },
        { name: "phone" },
        { name: "email" },
        { name: "city_id" },
        { name: "store_ids" },
        { name: "payload" },
        { name: "created_at" },
        { name: "payment_status" },
        { name: "payment_id" },
        { name: "amount" }
      ];
    }
    if (sql.includes("SELECT name FROM stores WHERE city_id = ?")) {
      const cityId = args[0];
      return this.stores.filter(s => s.city_id == cityId).map(s => ({ name: s.name }));
    }
    if (sql.includes("SELECT s.id, s.name, s.area") && sql.includes("JOIN cities c")) {
      const cityName = args[0];
      const city = this.cities.find(c => c.name === cityName);
      if (!city) return [];

      const result = this.stores
        .filter(s => s.city_id == city.id)
        .map(s => ({
          id: s.id,
          name: s.name,
          area: s.area,
          availability: s.availability,
          avail: s.avail,
          storage: s.storage,
          disabled: s.disabled,
          shelvesAvailable: s.shelves_available,
          lat: s.lat,
          lng: s.lng,
          address: s.address
        }));

      result.sort((a, b) => {
        if (a.disabled !== b.disabled) {
          return a.disabled - b.disabled;
        }
        return a.name.localeCompare(b.name);
      });

      return result;
    }
    if (sql.includes("SELECT payload FROM applications WHERE payment_status = 'paid'")) {
      return this.applications
        .filter(a => a.payment_status === "paid")
        .map(a => ({ payload: a.payload }));
    }
    if (sql.includes("SELECT a.shelf_code, s.name as store_name")) {
      const appId = args[0];
      const result = [];
      const appShelves = this.allocated_shelves.filter(s => s.application_id == appId);

      for (const shelf of appShelves) {
        const store = this.stores.find(s => s.id == shelf.store_id);
        if (store) {
          const city = this.cities.find(c => c.id == store.city_id);
          result.push({
            shelf_code: shelf.shelf_code,
            store_name: store.name,
            area: store.area,
            address: store.address,
            city_name: city ? city.name : ""
          });
        }
      }
      return result;
    }
    return [];
  }
}

let DatabaseSyncClass;
let useMock = false;

try {
  const sqliteModule = await import("node:sqlite");
  DatabaseSyncClass = sqliteModule.DatabaseSync;
} catch (e) {
  console.warn("Failed to load node:sqlite, falling back to in-memory mock database:", e.message);
  useMock = true;
  DatabaseSyncClass = MockDatabaseSync;
}

if (!useMock && isVercel && !fs.existsSync(dbPath)) {
  const bundledDbPath = path.join(__dirname, "darkstore.db");
  if (fs.existsSync(bundledDbPath)) {
    try {
      fs.copyFileSync(bundledDbPath, dbPath);
    } catch (e) {
      console.error("Failed to copy database to /tmp:", e);
    }
  }
}

const db = new DatabaseSyncClass(dbPath);
if (!useMock) {
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA foreign_keys = ON");
}

const ALLOWED_CITIES = ["Bengaluru", "Delhi", "Mumbai", "Kolkata"];

const CITY_STORES = {
  Bengaluru: [
    { name: "Marathahalli DS", area: "Marathahalli", shelves: 312, freeShelves: 72, storage: "Ambient", lat: 12.949722, lng: 77.698417, address: "Marathahalli" },
    { name: "Whitefield DS", area: "Whitefield", shelves: 360, freeShelves: 192, storage: "Ambient", lat: 12.969694, lng: 77.751389, address: "Whitefield" },
    { name: "JP Nagar DS", area: "JP Nagar", shelves: 606, freeShelves: 162, storage: "Ambient", lat: 12.879972, lng: 77.567361, address: "JP Nagar" },
    { name: "RR Nagar DS", area: "RR Nagar", shelves: 480, freeShelves: 168, storage: "Ambient", lat: 12.919502, lng: 77.508964, address: "RR Nagar" },
    { name: "Nagasandra DS", area: "Nagasandra", shelves: 480, freeShelves: 210, storage: "Ambient", lat: 13.043924, lng: 77.509992, address: "Nagasandra" },
    { name: "HSR Layout DS", area: "HSR Layout", shelves: 198, freeShelves: 180, storage: "Ambient", lat: 12.914306, lng: 77.627639, address: "HSR Layout" },
  ],
  Mumbai: [
    { name: "LP (Worli) DS", area: "LP (Worli)", shelves: 618, freeShelves: 108, storage: "Ambient", lat: 18.993685, lng: 72.822337, address: "LP (Worli)" },
    { name: "Borivali DS", area: "Borivali", shelves: 360, freeShelves: 147, storage: "Ambient", lat: 19.218826, lng: 72.834278, address: "Borivali" },
    { name: "Santacruz DS", area: "Santacruz", shelves: 360, freeShelves: 150, storage: "Ambient", lat: 19.079012, lng: 72.830876, address: "Santacruz" },
  ],
  Delhi: [
    { name: "Rohini DS", area: "Rohini", shelves: 696, freeShelves: 198, storage: "Ambient", lat: 28.721581, lng: 77.10492, address: "Rohini" },
    { name: "Krishna Nagar DS", area: "Krishna Nagar", shelves: 480, freeShelves: 132, storage: "Ambient", lat: 28.645362, lng: 77.297179, address: "Krishna Nagar" },
    { name: "Vikaspuri DS", area: "Vikaspuri", shelves: 360, freeShelves: 96, storage: "Ambient", lat: 28.630278, lng: 77.082694, address: "Vikaspuri" },
    { name: "Vasant Kunj DS", area: "Vasant Kunj", shelves: 480, freeShelves: 156, storage: "Ambient", lat: 28.528625, lng: 77.151992, address: "Vasant Kunj" },
    { name: "Gurgaon DS", area: "Gurgaon", shelves: 480, freeShelves: 192, storage: "Ambient", lat: 28.462212, lng: 77.064402, address: "Gurgaon" },
  ],
  Kolkata: [
    { name: "Salt Lake DS", area: "Salt Lake", shelves: 300, freeShelves: 120, storage: "Ambient", lat: 22.5801, lng: 88.426, address: "Salt Lake" },
    { name: "New Town DS", area: "New Town", shelves: 300, freeShelves: 138, storage: "Ambient", lat: 22.5868, lng: 88.4844, address: "New Town" },
  ],
};

function shelfMeta(shelves) {
  if (shelves <= 0) return { avail: "red", availability: "No shelves", disabled: 1 };
  if (shelves > 10) return { avail: "green", availability: `${shelves} shelves`, disabled: 0 };
  return { avail: "amber", availability: `${shelves} shelf${shelves === 1 ? "" : "es"}`, disabled: 0 };
}

function migrateDb() {
  const addStoreCol = (col, sql) => {
    const cols = db.prepare("PRAGMA table_info(stores)").all().map((c) => c.name);
    if (!cols.includes(col)) {
      try { db.exec(sql); } catch { /* column exists */ }
    }
  };
  addStoreCol("shelves_available", "ALTER TABLE stores ADD COLUMN shelves_available INTEGER NOT NULL DEFAULT 0");
  addStoreCol("lat", "ALTER TABLE stores ADD COLUMN lat REAL");
  addStoreCol("lng", "ALTER TABLE stores ADD COLUMN lng REAL");
  addStoreCol("address", "ALTER TABLE stores ADD COLUMN address TEXT");
  addStoreCol("shelves", "ALTER TABLE stores ADD COLUMN shelves INTEGER NOT NULL DEFAULT 0");

  const addAppCol = (col, sql) => {
    const cols = db.prepare("PRAGMA table_info(applications)").all().map((c) => c.name);
    if (!cols.includes(col)) {
      try { db.exec(sql); } catch { /* column exists */ }
    }
  };
  addAppCol("payment_status", "ALTER TABLE applications ADD COLUMN payment_status TEXT DEFAULT 'pending'");
  addAppCol("payment_id", "ALTER TABLE applications ADD COLUMN payment_id TEXT");
  addAppCol("amount", "ALTER TABLE applications ADD COLUMN amount REAL DEFAULT 0");
}

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      area TEXT NOT NULL,
      availability TEXT NOT NULL,
      avail TEXT NOT NULL CHECK (avail IN ('green', 'amber', 'red')),
      storage TEXT NOT NULL,
      disabled INTEGER NOT NULL DEFAULT 0,
      shelves_available INTEGER NOT NULL DEFAULT 0,
      lat REAL,
      lng REAL,
      address TEXT,
      shelves INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_name TEXT NOT NULL,
      poc TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      city_id INTEGER NOT NULL,
      store_ids TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (city_id) REFERENCES cities(id)
    );

    CREATE TABLE IF NOT EXISTS allocated_shelves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_id INTEGER NOT NULL,
      store_id INTEGER NOT NULL,
      shelf_code TEXT NOT NULL,
      FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
      FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
      UNIQUE(store_id, shelf_code)
    );

    CREATE TABLE IF NOT EXISTS document_verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_name TEXT,
      expected_type TEXT NOT NULL,
      detected_type TEXT,
      status TEXT NOT NULL,
      confidence REAL,
      reason TEXT,
      extracted_text TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  migrateDb();

  syncCities();

  const cityCount = db.prepare("SELECT COUNT(*) AS count FROM cities WHERE active = 1").get().count;
  if (cityCount === 0) {
    seedAll();
  } else {
    syncStoreDetails();
  }
  recalculateStoreShelves();
}

function syncCities() {
  const delhiNcr = db.prepare("SELECT id FROM cities WHERE name = 'Delhi NCR'").get();
  const delhi = db.prepare("SELECT id FROM cities WHERE name = 'Delhi'").get();

  if (delhiNcr && !delhi) {
    db.prepare("UPDATE cities SET name = 'Delhi', active = 1 WHERE id = ?").run(delhiNcr.id);
  } else if (delhiNcr && delhi) {
    db.prepare("UPDATE stores SET city_id = ? WHERE city_id = ?").run(delhi.id, delhiNcr.id);
    db.prepare("DELETE FROM cities WHERE id = ?").run(delhiNcr.id);
  }

  for (const name of ALLOWED_CITIES) {
    const row = db.prepare("SELECT id FROM cities WHERE name = ?").get(name);
    if (row) {
      db.prepare("UPDATE cities SET active = 1 WHERE id = ?").run(row.id);
    } else {
      db.prepare("INSERT INTO cities (name, active) VALUES (?, 1)").run(name);
    }
  }

  const placeholders = ALLOWED_CITIES.map(() => "?").join(", ");
  db.prepare(`UPDATE cities SET active = 0 WHERE name NOT IN (${placeholders})`).run(...ALLOWED_CITIES);
}

function seedAll() {
  const insertCity = db.prepare("INSERT INTO cities (name) VALUES (?)");
  const insertStore = db.prepare(`
    INSERT INTO stores (city_id, name, area, availability, avail, storage, disabled, shelves_available, lat, lng, address, shelves)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.exec("BEGIN");
  try {
    for (const [cityName, stores] of Object.entries(CITY_STORES)) {
      const { lastInsertRowid: cityId } = insertCity.run(cityName);
      for (const store of stores) {
        const meta = shelfMeta(store.freeShelves);
        insertStore.run(
          cityId, store.name, store.area, meta.availability, meta.avail,
          store.storage, meta.disabled, store.freeShelves, store.lat, store.lng, store.address, store.shelves
        );
      }
    }
    db.exec("COMMIT");
    console.log("Database seeded with cities and stores");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

function syncStoreDetails() {
  const getCity = db.prepare("SELECT id FROM cities WHERE name = ?");
  const findStore = db.prepare("SELECT id FROM stores WHERE city_id = ? AND name = ?");
  const update = db.prepare(`
    UPDATE stores SET area = ?, availability = ?, avail = ?, disabled = ?, shelves_available = ?,
      lat = ?, lng = ?, address = ?, storage = ?, shelves = ?
    WHERE id = ?
  `);
  const insert = db.prepare(`
    INSERT INTO stores (city_id, name, area, availability, avail, storage, disabled, shelves_available, lat, lng, address, shelves)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const deleteStore = db.prepare("DELETE FROM stores WHERE city_id = ? AND name = ?");

  db.exec("BEGIN");
  try {
    for (const [cityName, stores] of Object.entries(CITY_STORES)) {
      const city = getCity.get(cityName);
      if (!city) continue;
      const seedNames = stores.map((s) => s.name);

      for (const store of stores) {
        const meta = shelfMeta(store.freeShelves);
        const existing = findStore.get(city.id, store.name);
        if (existing) {
          update.run(
            store.area, meta.availability, meta.avail, meta.disabled, store.freeShelves,
            store.lat, store.lng, store.address, store.storage, store.shelves, existing.id
          );
        } else {
          insert.run(
            city.id, store.name, store.area, meta.availability, meta.avail,
            store.storage, meta.disabled, store.freeShelves, store.lat, store.lng, store.address, store.shelves
          );
        }
      }

      const orphans = db.prepare("SELECT name FROM stores WHERE city_id = ?").all(city.id)
        .filter((r) => !seedNames.includes(r.name));
      for (const orphan of orphans) {
        deleteStore.run(city.id, orphan.name);
      }
    }

    db.prepare("DELETE FROM stores WHERE city_id IN (SELECT id FROM cities WHERE active = 0)").run();
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

initDb();

export function getCities() {
  const getCity = db.prepare("SELECT id, name FROM cities WHERE name = ? AND active = 1");
  return ALLOWED_CITIES.map((name) => getCity.get(name)).filter(Boolean);
}

export function getStoresByCityName(cityName) {
  return db
    .prepare(`
      SELECT s.id, s.name, s.area, s.availability, s.avail, s.storage, s.disabled,
             s.shelves_available AS shelvesAvailable, s.shelves AS totalShelves, s.lat, s.lng, s.address
      FROM stores s
      JOIN cities c ON c.id = s.city_id
      WHERE c.name = ?
      ORDER BY s.disabled ASC, s.name ASC
    `)
    .all(cityName)
    .map((row) => ({
      ...row,
      disabled: Boolean(row.disabled),
    }));
}

export function saveApplication(data) {
  const city = db.prepare("SELECT id FROM cities WHERE name = ?").get(data.city);
  if (!city) throw new Error("Invalid city");

  const result = db
    .prepare(`
      INSERT INTO applications (brand_name, poc, phone, email, city_id, store_ids, payload)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      data.brandName,
      data.poc,
      data.phone,
      data.email,
      city.id,
      JSON.stringify(data.cart || data.storeIds || []),
      JSON.stringify(data)
    );

  return { id: result.lastInsertRowid };
}

export function updateApplicationPayment(id, paymentId, status, amount) {
  if (amount !== undefined && amount !== null) {
    return db
      .prepare("UPDATE applications SET payment_id = ?, payment_status = ?, amount = ? WHERE id = ?")
      .run(paymentId, status, amount, id);
  } else {
    return db
      .prepare("UPDATE applications SET payment_id = ?, payment_status = ? WHERE id = ?")
      .run(paymentId, status, id);
  }
}

export function recalculateStoreShelves() {
  const paidApps = db.prepare("SELECT payload FROM applications WHERE payment_status = 'paid'").all();

  const bookedRacks = {};
  for (const app of paidApps) {
    try {
      const payload = JSON.parse(app.payload);
      const cart = payload.cart || [];
      for (const item of cart) {
        if (item.storeId) {
          bookedRacks[item.storeId] = (bookedRacks[item.storeId] || 0) + (item.racks || 0);
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  const getCity = db.prepare("SELECT id FROM cities WHERE name = ?");
  const findStore = db.prepare("SELECT id FROM stores WHERE city_id = ? AND name = ?");
  const updateStore = db.prepare(`
    UPDATE stores 
    SET shelves_available = ?, availability = ?, avail = ?, disabled = ?
    WHERE id = ?
  `);

  db.exec("BEGIN");
  try {
    for (const [cityName, stores] of Object.entries(CITY_STORES)) {
      const city = getCity.get(cityName);
      if (!city) continue;

      for (const store of stores) {
        const existing = findStore.get(city.id, store.name);
        if (existing) {
          const booked = bookedRacks[existing.id] || 0;
          const remaining = Math.max(0, store.freeShelves - booked);
          const meta = shelfMeta(remaining);
          updateStore.run(remaining, meta.availability, meta.avail, meta.disabled, existing.id);
        }
      }
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

function getStoreAbbreviation(name) {
  if (name.includes("LP")) return "LP";
  const clean = name.replace(/\(.*\)/g, "").replace("DS", "").trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return words[0].substring(0, 2).toUpperCase();
}

export function allocateShelves(applicationId) {
  // Check if shelves are already allocated for this application
  const existing = db.prepare("SELECT id FROM allocated_shelves WHERE application_id = ?").get(applicationId);
  if (existing) return; // Already allocated

  const app = db.prepare("SELECT payload FROM applications WHERE id = ?").get(applicationId);
  if (!app) return;

  try {
    const payload = JSON.parse(app.payload);
    const cart = payload.cart || [];

    db.exec("BEGIN");
    for (const item of cart) {
      const storeId = item.storeId;
      const racksCount = item.racks || 0;

      const store = db.prepare("SELECT name FROM stores WHERE id = ?").get(storeId);
      if (!store) continue;

      const abbr = getStoreAbbreviation(store.name);

      for (let i = 0; i < racksCount; i++) {
        let uniqueCode = "";
        let attempts = 0;

        while (attempts < 100) {
          attempts++;
          const bay = ["A", "B", "C", "D"][Math.floor(Math.random() * 4)];
          const rack = `R${Math.floor(Math.random() * 5) + 1}`;
          const level = `L${Math.floor(Math.random() * 6) + 1}`;
          uniqueCode = `${abbr}-${bay}-${rack}-${level}`;

          // Check uniqueness
          const exists = db.prepare("SELECT id FROM allocated_shelves WHERE store_id = ? AND shelf_code = ?").get(storeId, uniqueCode);
          if (!exists) {
            break;
          }
        }

        db.prepare("INSERT INTO allocated_shelves (application_id, store_id, shelf_code) VALUES (?, ?, ?)")
          .run(applicationId, storeId, uniqueCode);
      }
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

export function logDocumentVerification({ file_name, expected_type, detected_type, status, confidence, reason, extracted_text }) {
  const stmt = db.prepare(`
    INSERT INTO document_verifications (file_name, expected_type, detected_type, status, confidence, reason, extracted_text)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(file_name, expected_type, detected_type, status, confidence, reason, extracted_text);
}

export default db;
