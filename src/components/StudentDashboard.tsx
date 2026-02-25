import LiveMap from "@/components/LiveMap";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bus,
  MapPin,
  Clock,
  RefreshCw,
  Navigation,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getRoutes, getActiveBusesByRoute } from "@/services/busService";
import type { BusLocation } from "@/types/types";

interface StudentDashboardProps {
  onBack: () => void;
}

const StudentDashboard = ({ onBack }: StudentDashboardProps) => {
  const [selectedRoute, setSelectedRoute] = useState("");
  const [activeBuses, setActiveBuses] = useState<BusLocation[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { data: routes } = useQuery({
    queryKey: ["routes"],
    queryFn: getRoutes,
  });

  const fetchBuses = async () => {
    if (selectedRoute) {
      const buses = await getActiveBusesByRoute(selectedRoute);
      setActiveBuses(buses);
      setLastUpdate(new Date());
    }
  };

  useEffect(() => {
    if (!selectedRoute) return;

    fetchBuses();
    const interval = setInterval(fetchBuses, 5000);

    return () => clearInterval(interval);
  }, [selectedRoute]);

  const selectedRouteInfo = routes?.find(
    (r) => r.routeNumber === selectedRoute
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Student Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Track your bus in real-time
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={onBack}>
            <LogOut className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT PANEL */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Navigation className="w-5 h-5 mr-2" />
                  Select Route
                </CardTitle>
                <CardDescription>
                  Choose your bus route
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Select
                  value={selectedRoute}
                  onValueChange={setSelectedRoute}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes?.map((route) => (
                      <SelectItem
                        key={route.routeNumber}
                        value={route.routeNumber}
                      >
                        {route.routeNumber} - {route.routeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedRouteInfo && (
                  <div className="p-4 bg-indigo-50 border rounded-lg">
                    <h3 className="font-medium mb-1">
                      {selectedRouteInfo.routeName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedRouteInfo.description}
                    </p>
                  </div>
                )}

                {selectedRoute && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Last updated
                    </span>
                    <span>{lastUpdate.toLocaleTimeString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedRoute && (
              <Card className="shadow-xl border-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle>Live Tracking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Updates every 5 seconds
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {activeBuses.length} bus
                    {activeBuses.length !== 1 ? "es" : ""} active
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-2 space-y-6">
            {!selectedRoute ? (
              <Card>
                <CardContent className="py-20 text-center">
                  <Bus className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p>Select a route to view live map</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* REAL MAP */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Live Map
                      </span>
                      <Badge className="bg-green-600">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                        Live
                      </Badge>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <LiveMap />
                  </CardContent>
                </Card>

                {/* ACTIVE BUS LIST */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Active Buses ({activeBuses.length})
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    {activeBuses.length > 0 ? (
                      <div className="space-y-3">
                        {activeBuses.map((bus) => (
                          <div
                            key={bus.busId}
                            className="p-4 border rounded-lg bg-indigo-50"
                          >
                            <div className="flex justify-between mb-2">
                              <div>
                                <p className="font-bold">
                                  {bus.numberPlate}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {bus.driverName}
                                </p>
                              </div>
                              <Badge className="bg-green-600">
                                Active
                              </Badge>
                            </div>

                            <div className="text-xs text-gray-600">
                              Lat: {bus.latitude.toFixed(4)} | Lng:{" "}
                              {bus.longitude.toFixed(4)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-6">
                        No active buses
                      </p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;