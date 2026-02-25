// src/services/busService.ts

export interface Route {
  routeNumber: string;
  routeName: string;
  description: string;
}

export interface Driver {
  id: string;
  name: string;
  route: string;
}

export interface BusLocation {
  busId: string;
  route: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
}

/* ===============================
   MOCK DRIVERS
================================= */

const drivers: Driver[] = [
  { id: "DRV001", name: "Ravi", route: "Route 1" },
  { id: "DRV002", name: "Arjun", route: "Route 2" },
];

/* ===============================
   VERIFY DRIVER
================================= */

export const verifyDriver = async (
  driverId: string
): Promise<Driver | null> => {
  const driver = drivers.find((d) => d.id === driverId);
  return driver || null;
};

/* ===============================
   GET ALL DRIVERS
================================= */

export const getAllDrivers = async (): Promise<Driver[]> => {
  return drivers;
};

/* ===============================
   GET ROUTES
================================= */

export const getRoutes = async (): Promise<Route[]> => {
  return [
    {
      routeNumber: "Route 1",
      routeName: "Men's Hostel - Main Gate",
      description: "Goes to and fro the Men's Hostel and the Main Gate.",
    },
    {
      routeNumber: "Route 2",
      routeName: "Ladies Hostel- PRP/SJT",
      description: "Covers academic blocks from the ladies hostel.",
    },
  ];
};

/* ===============================
   GET ACTIVE BUSES FROM BACKEND
================================= */

export const getActiveBusesByRoute = async (
  route: string
): Promise<BusLocation[]> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/active-buses/${route}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch active buses");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching active buses:", error);
    return [];
  }
};