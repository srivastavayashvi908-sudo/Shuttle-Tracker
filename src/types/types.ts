export interface Driver {
  id: string;
  name: string;
  route: string;
}

export interface BusLocation {
  busId: string;
  route: string;
  driverName: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
}

export interface Route {
  routeNumber: string;
  routeName: string;
  description: string;
}
