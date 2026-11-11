import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { verifyDriver, getAllDrivers } from '@/services/busService';
import type { Driver } from '@/types/types';

interface DriverVerificationProps {
  onVerified: (driver: Driver) => void;
  onBack: () => void;
}

const DriverVerification = ({ onVerified, onBack }: DriverVerificationProps) => {
  const [uniqueId, setUniqueId] = useState('');
  const [showDriverList, setShowDriverList] = useState(false);

  const { data: allDrivers } = useQuery({
    queryKey: ['allDrivers'],
    queryFn: getAllDrivers,
  });

  const verifyMutation = useMutation({
    mutationFn: verifyDriver,
    onSuccess: (driver) => {
      if (driver) {
        console.log('Driver verified:', driver);
        onVerified(driver);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uniqueId.trim()) {
      verifyMutation.mutate(uniqueId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 animate-fade-in-up">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto p-4 bg-blue-600 rounded-full w-fit">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl mb-2">Driver Verification</CardTitle>
              <CardDescription className="text-base">
                Enter your unique driver ID to continue
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="uniqueId" className="text-sm font-medium text-gray-700">
                  Unique Driver ID
                </label>
                <Input
                  id="uniqueId"
                  type="text"
                  placeholder="e.g., DRV001"
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value.toUpperCase())}
                  className="text-center text-lg tracking-wider font-mono"
                  disabled={verifyMutation.isPending}
                />
              </div>

              {verifyMutation.isError && (
                <Alert variant="destructive" className="animate-shake">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Invalid driver ID. Please check and try again.
                  </AlertDescription>
                </Alert>
              )}

              {verifyMutation.isSuccess && verifyMutation.data && (
                <Alert className="bg-green-50 border-green-200 animate-fade-in">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Welcome back, {verifyMutation.data.name}!
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
                disabled={verifyMutation.isPending || !uniqueId.trim()}
              >
                {verifyMutation.isPending ? 'Verifying...' : 'Verify & Continue'}
              </Button>
            </form>

            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full text-sm"
                onClick={() => setShowDriverList(!showDriverList)}
              >
                {showDriverList ? 'Hide' : 'Show'} Available Driver IDs (For Demo)
              </Button>

              {showDriverList && allDrivers && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2 animate-fade-in">
                  <p className="text-xs font-medium text-gray-600 mb-3">
                    Demo Driver IDs - Use any of these:
                  </p>
                  {allDrivers.map((driver) => (
                    <div
                      key={driver.id}
                      className="flex items-center justify-between p-2 bg-white rounded border hover:border-blue-400 cursor-pointer transition-colors"
                      onClick={() => setUniqueId(driver.id)}
                    >
                      <div>
                        <p className="font-mono text-sm font-medium text-blue-600">
                          {driver.id}
                        </p>
                        <p className="text-xs text-gray-600">{driver.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={onBack}
            >
              Back to Role Selection
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverVerification;
