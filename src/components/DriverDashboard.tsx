import { useState, useEffect, useRef } from "react";
import { Bus, Play, Square, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sendLocation, stopTracking } from "@/services/busService";
import type { Driver } from "@/types/types";

interface DriverDashboardProps {
  driver: Driver;
  onLogout: () => void;
}

// Re-send the last known position so a stationary bus doesn't time out on the server.
const HEARTBEAT_MS = 10_000;

const DriverDashboard = ({ driver, onLogout }: DriverDashboardProps) => {
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const lastPosition = useRef<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (!tracking) return;

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setTracking(false);
      return;
    }

    const push = (latitude: number, longitude: number) =>
      sendLocation(driver, latitude, longitude).catch((e) =>
        console.error("Failed to send location:", e)
      );

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        lastPosition.current = { latitude, longitude };
        setCurrentPosition({ latitude, longitude });
        push(latitude, longitude);
      },
      (err) => {
        setError(`GPS error: ${err.message}`);
        setTracking(false);
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    const heartbeat = setInterval(() => {
      if (lastPosition.current) {
        push(lastPosition.current.latitude, lastPosition.current.longitude);
      }
    }, HEARTBEAT_MS);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(heartbeat);
      lastPosition.current = null;
      stopTracking(driver);
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

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

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
                  onClick={() => {
                    setError(null);
                    setTracking(true);
                  }}
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