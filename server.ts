import express from "express";
import cors from "cors";

interface BusLocation {
  busId: string;
  route: string;
  driverName: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
}

const PORT = Number(process.env.PORT) || 5000;
// A bus that has not reported for this long is treated as offline.
const STALE_MS = 30_000;

const buses = new Map<string, BusLocation>();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/update-location", (req, res) => {
  const { busId, route, driverName, latitude, longitude } = req.body ?? {};

  if (
    typeof busId !== "string" ||
    typeof route !== "string" ||
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  ) {
    res.status(400).json({ error: "busId, route, latitude and longitude are required" });
    return;
  }

  buses.set(busId, {
    busId,
    route,
    driverName: typeof driverName === "string" ? driverName : "",
    latitude,
    longitude,
    lastUpdated: new Date().toISOString(),
  });
  res.json({ ok: true });
});

app.post("/api/stop-tracking/:busId", (req, res) => {
  buses.delete(req.params.busId);
  res.json({ ok: true });
});

app.get("/api/active-buses/:route", (req, res) => {
  const now = Date.now();
  const active: BusLocation[] = [];

  for (const [id, bus] of buses) {
    if (now - Date.parse(bus.lastUpdated) > STALE_MS) {
      buses.delete(id);
    } else if (bus.route === req.params.route) {
      active.push(bus);
    }
  }
  res.json(active);
});

app.listen(PORT, () => {
  console.log(`Shuttle server running on http://localhost:${PORT}`);
});
