export type DisasterType = 'earthquake' | 'flood' | 'tsunami' | 'volcano' | 'storm' | 'wildfire';

export type SeverityLevel = 'critical' | 'high' | 'monitoring' | 'info';

export interface DisasterIncident {
  id: string;
  title: string;
  type: DisasterType;
  severity: SeverityLevel;
  severityText: string;
  locationName: string;
  lat: number;
  lng: number;
  timeAgo: string;
  timestamp: string;
  description: string;
  metrics: {
    primaryLabel: string;
    primaryValue: string;
    secondaryLabel: string;
    secondaryValue: string;
    statusLabel: string;
    statusValue: string;
  };
  adviceUrgent: string;
  affectedRadiusKm: number;
  populationAtRisk: string;
  shelterCount?: number;
  mapPinPos: { x: number; y: number }; // Percentages on tactical canvas (0-100)
}

export interface DayForecast {
  dayName: string;
  dayShort: string;
  score: number;
  desc: string;
  isPeak?: boolean;
}

export interface HazardMatrixItem {
  id: string;
  tag: string;
  type: DisasterType;
  severityColor: string;
  timeframe: string;
  title: string;
  probability: number;
  probLabel: string;
  affectedArea: string;
  forecastMetric: string;
  urgentTip: string;
  actionButtonLabel: string;
}

export interface ActionPlan {
  step: number;
  title: string;
  description: string;
  colorClass: string;
}

export interface PreparednessPhase {
  id: string;
  title: string;
  badge: string;
  description: string;
  icon: string;
  color: string;
}

export interface SurvivalKitItem {
  id: string;
  label: string;
  detail: string;
  icon: string;
  checked: boolean;
}

export interface ShelterItem {
  id: string;
  name: string;
  distanceKm: number;
  walkMinutes: number;
  driveMinutes: number;
  vacantSlots: number;
  totalSlots: number;
  status: 'available' | 'crowded' | 'full';
  safeRouteDescription: string;
  amenities: { label: string; icon: string; color: string }[];
  lat: number;
  lng: number;
  mapImage: string;
}

export interface UserReport {
  id: string;
  type: DisasterType;
  title: string;
  location: string;
  severity: SeverityLevel;
  description: string;
  timestamp: string;
  votes: number;
  verified: boolean;
}
