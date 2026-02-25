import { useState } from 'react';
import { Bus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RoleSelectionProps {
  onRoleSelect: (role: 'driver' | 'student') => void;
}

const RoleSelection = ({ onRoleSelect }: RoleSelectionProps) => {
  const [selectedRole, setSelectedRole] = useState<'driver' | 'student' | null>(null);

  const handleRoleClick = (role: 'driver' | 'student') => {
    setSelectedRole(role);
    setTimeout(() => {
      onRoleSelect(role);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block p-3 bg-blue-600 rounded-2xl mb-4">
            <Bus className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Campus Bus Tracker
          </h1>
          <p className="text-lg text-gray-600">
            Select your role to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
          <Card
            className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 ${
              selectedRole === 'driver'
                ? 'border-blue-600 bg-blue-50 scale-105'
                : 'border-gray-200 hover:border-blue-400'
            }`}
            onClick={() => handleRoleClick('driver')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-blue-600 rounded-full w-fit">
                <Bus className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl">Driver</CardTitle>
              <CardDescription className="text-base">
                Start tracking your bus route
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                  Enter your unique driver ID
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                  Start and stop tracking
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                  Update route information
                </li>
              </ul>
              <Button
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Continue as Driver
              </Button>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 ${
              selectedRole === 'student'
                ? 'border-indigo-600 bg-indigo-50 scale-105'
                : 'border-gray-200 hover:border-indigo-400'
            }`}
            onClick={() => handleRoleClick('student')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-indigo-600 rounded-full w-fit">
                <Users className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl">Student</CardTitle>
              <CardDescription className="text-base">
                Track your bus in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3" />
                  Select your bus route
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3" />
                  View live bus location
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3" />
                  Get real-time updates
                </li>
              </ul>
              <Button
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white"
                size="lg"
              >
                Continue as Student
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 animate-fade-in">
          <p>Safe travels! 🚌</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
