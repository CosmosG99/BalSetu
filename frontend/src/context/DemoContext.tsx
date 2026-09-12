import React, { createContext, useContext, useState } from 'react';
import { ReportInput } from '../types';
import { resetDemo } from '../api/operations';

export interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  reportData: ReportInput;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'scenario-1',
    title: 'Sample Case 1: Lost & Distressed Child',
    subtitle: 'Mumbai Central Railway Station • Platform 4',
    badge: 'HIGH RISK',
    reportData: {
      incidentTypes: ['LOST', 'DISTRESSED'],
      location: 'Mumbai Central Railway Station',
      locationType: 'RAILWAY_STATION',
      stationName: 'Mumbai Central',
      description: 'Child appears around 12 years old, alone near platform 4. Seemed visually distressed and searching for someone.',
      approxAge: '11-13 years',
      apparentGender: 'Male',
      clothing: 'Blue jacket, dark trousers, carrying a small red backpack',
      direction: 'Towards Foot Overbridge Platform 4',
      platformOrGate: 'Platform 4',
      approxTime: '7:42 PM',
      photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      isBlurred: true,
      isAnonymous: true,
      reporterRole: 'Station Vendor'
    }
  },
  {
    id: 'scenario-2',
    title: 'Sample Case 2: Potential Trafficking Concern',
    subtitle: 'Nagpur Junction Station • Exit Gate 2',
    badge: 'CRITICAL RISK',
    reportData: {
      incidentTypes: ['TRAFFICKING', 'DISTRESSED'],
      location: 'Nagpur Junction Station',
      locationType: 'RAILWAY_STATION',
      stationName: 'Nagpur Junction',
      description: 'Anxious child being pulled forcefully by an adult avoiding station security cameras near exit gate 2.',
      approxAge: '10-12 years',
      apparentGender: 'Male',
      clothing: 'Yellow shirt, black shorts',
      platformOrGate: 'Exit Gate 2',
      approxTime: '6:55 PM',
      photoUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=400&q=80',
      isBlurred: true,
      isAnonymous: true,
      reporterRole: 'Co-Passenger'
    }
  },
  {
    id: 'scenario-3',
    title: 'Sample Case 3: Unaccompanied Child',
    subtitle: 'Pune Swargate Bus Terminal • Bay No. 3',
    badge: 'MEDIUM RISK',
    reportData: {
      incidentTypes: ['UNACCOMPANIED'],
      location: 'Pune Swargate Bus Terminal',
      locationType: 'BUS_TERMINAL',
      stationName: 'Swargate Terminal',
      description: 'Young girl travelling alone with heavy luggage, asking people about buses to Solapur without adult supervision.',
      approxAge: '13-14 years',
      apparentGender: 'Female',
      clothing: 'Red sweater and denim jeans',
      platformOrGate: 'Bay No. 3',
      approxTime: '7:21 PM',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      isBlurred: true,
      isAnonymous: true,
      reporterRole: 'Bus Stand Shopkeeper'
    }
  }
];

interface DemoContextType {
  activeDemoScenario: DemoScenario | null;
  loadScenario: (scenarioId: string) => ReportInput;
  clearDemoScenario: () => void;
  resetDemoDataset: () => Promise<void>;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeDemoScenario, setActiveDemoScenario] = useState<DemoScenario | null>(null);

  const loadScenario = (scenarioId: string): ReportInput => {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId) || DEMO_SCENARIOS[0];
    setActiveDemoScenario(scenario);
    return scenario.reportData;
  };

  const clearDemoScenario = () => {
    setActiveDemoScenario(null);
  };

  const resetDemoDataset = async () => {
    await resetDemo();
    window.location.reload();
  };

  return (
    <DemoContext.Provider value={{ activeDemoScenario, loadScenario, clearDemoScenario, resetDemoDataset }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within DemoProvider');
  }
  return context;
};
