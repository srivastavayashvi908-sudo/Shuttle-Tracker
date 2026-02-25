import { useState } from 'react';
import RoleSelection from '@/components/RoleSelection';
import DriverVerification from '@/components/DriverVerification';
import DriverDashboard from '@/components/DriverDashboard';
import StudentDashboard from '@/components/StudentDashboard';
import type { Driver } from '@/types/types';

type AppState = 'role-selection' | 'driver-verification' | 'driver-dashboard' | 'student-dashboard';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('role-selection');
  const [verifiedDriver, setVerifiedDriver] = useState<Driver | null>(null);

  const handleRoleSelect = (role: 'driver' | 'student') => {
    if (role === 'driver') {
      setAppState('driver-verification');
    } else {
      setAppState('student-dashboard');
    }
  };

  const handleDriverVerified = (driver: Driver) => {
    setVerifiedDriver(driver);
    setAppState('driver-dashboard');
  };

  const handleBackToRoleSelection = () => {
    setAppState('role-selection');
    setVerifiedDriver(null);
  };

  const handleDriverLogout = () => {
    setVerifiedDriver(null);
    setAppState('role-selection');
  };

  return (
    <>
      {appState === 'role-selection' && (
        <RoleSelection onRoleSelect={handleRoleSelect} />
      )}
      
      {appState === 'driver-verification' && (
        <DriverVerification 
          onVerified={handleDriverVerified}
          onBack={handleBackToRoleSelection}
        />
      )}
      
      {appState === 'driver-dashboard' && verifiedDriver && (
        <DriverDashboard 
          driver={verifiedDriver}
          onLogout={handleDriverLogout}
        />
      )}
      
      {appState === 'student-dashboard' && (
        <StudentDashboard onBack={handleBackToRoleSelection} />
      )}
    </>
  );
};

export default Index;