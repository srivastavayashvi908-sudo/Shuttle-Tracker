import { useState, useEffect } from "react";
import { Bus, MapPin, Play, Square, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Driver {
  id: string;
  name: string;
  route: string;
}

interface DriverDashboardProps {
  driver: Driver;
  onLogout: () => void;
}

const DriverDashboard = ({ driver, onLogout }: DriverDashboardProps) => {
  const [tracking, setTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if (!tracking) return;

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        setCurrentPosition({ latitude, longitude });

        try {
          await fetch("http://localhost:5000/api/update-location", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              busId: driver.id,
              route: driver.route,
              latitude,
              longitude,
            }),
          });
        } catch (error) {
          console.error("Failed to send location:", error);
        }
      },
      (err) => {
        console.error("GPS error:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [tracking, driver]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Driver Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Route: {driver.route}
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Tracking Status</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">
                GPS Tracking
              </span>

              {tracking ? (
                <Badge className="bg-green-600">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary">Stopped</Badge>
              )}
            </div>

            {currentPosition && (
              <div className="p-4 bg-indigo-50 rounded-lg text-sm space-y-1">
                <p>
                  <span className="font-medium">Latitude:</span>{" "}
                  {currentPosition.latitude.toFixed(6)}
                </p>
                <p>
                  <span className="font-medium">Longitude:</span>{" "}
                  {currentPosition.longitude.toFixed(6)}
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              {!tracking ? (
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setTracking(true)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Tracking
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={() => setTracking(false)}
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Tracking
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Driver Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Driver ID:</span> {driver.id}
            </p>
            <p>
              <span className="font-medium">Driver Name:</span> {driver.name}
            </p>
            <p>
              <span className="font-medium">Assigned Route:</span>{" "}
              {driver.route}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DriverDashboard;