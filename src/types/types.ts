export interface Driver {
  id: string;
  name: string;
  uniqueId: string;
  phoneNumber: string;
}

export interface BusLocation {
  busId: string;
  routeNumber: string;
  numberPlate: string;
  driverId: string;
  driverName: string;
  latitude: number;
  longitude: number;
  lastUpdated: Date;
  isActive: boolean;
}

export interface Route {
  routeNumber: string;
  routeName: string;
  description: string;
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  timestamp: Date;
}
