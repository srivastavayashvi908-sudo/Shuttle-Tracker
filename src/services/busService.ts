import type { BusLocation, Driver, Route } from "@/types/types";

// Relative URL: Vite proxies /api to the Express server in dev (see vite.config.ts).
const API = "/api";

const drivers: Driver[] = [
  { id: "DRV001", name: "Ravi", route: "Route 1" },
  { id: "DRV002", name: "Arjun", route: "Route 2" },
];

const routes: Route[] = [
  {
    routeNumber: "Route 1",
    routeName: "Men's Hostel - Main Gate",
    description: "Goes to and fro the Men's Hostel and the Main Gate.",
  },
  {
    routeNumber: "Route 2",
    routeName: "Ladies Hostel - PRP/SJT",
    description: "Covers academic blocks from the ladies hostel.",
  },
];

// Throws on an unknown ID so react-query's isError fires and the UI shows the error.
export const verifyDriver = async (driverId: string): Promise<Driver> => {
  const driver = drivers.find((d) => d.id === driverId);
  if (!driver) throw new Error("Invalid driver ID");
  return driver;
};

export const getAllDrivers = async (): Promise<Driver[]> => drivers;

export const getRoutes = async (): Promise<Route[]> => routes;

export const getActiveBusesByRoute = async (
  route: string
): Promise<BusLocation[]> => {
  try {
    const response = await fetch(`${API}/active-buses/${encodeURIComponent(route)}`);
    if (!response.ok) throw new Error("Failed to fetch active buses");
    return await response.json();
  } catch (error) {
    console.error("Error fetching active buses:", error);
    return [];
  }
};

export const sendLocation = async (
  driver: Driver,
  latitude: number,
  longitude: number
): Promise<void> => {
  await fetch(`${API}/update-location`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      busId: driver.id,
      route: driver.route,
      driverName: driver.name,
      latitude,
      longitude,
    }),
  });
};

export const stopTracking = async (driver: Driver): Promise<void> => {
  await fetch(`${API}/stop-tracking/${encodeURIComponent(driver.id)}`, {
    method: "POST",
  }).catch(() => {});
};
