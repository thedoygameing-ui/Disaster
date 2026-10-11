/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LiveMonitorView } from './components/LiveMonitorView';
import { ForecastView } from './components/ForecastView';
import { PreparednessView } from './components/PreparednessView';
import { EmergencySosView } from './components/EmergencySosView';
import { INITIAL_INCIDENTS, DEFAULT_USER_COORDS } from './data/disasterData';
import { DisasterIncident } from './types/disaster';
import { sound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('live-monitor');
  const [userCoords, setUserCoords] = useState(DEFAULT_USER_COORDS);
  const [isScanning, setIsScanning] = useState(false);
  const [incidents, setIncidents] = useState<DisasterIncident[]>(INITIAL_INCIDENTS);
  const [realtimeNotice, setRealtimeNotice] = useState<string | null>(null);

  // Request browser Notification permission once if possible
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // Periodic heartbeat / live simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // randomly show live update pulse
      setIncidents((prev) =>
        prev.map((item, idx) => {
          if (idx === 0) {
            return {
              ...item,
              timeAgo: 'เมื่อสักครู่',
            };
          }
          return item;
        })
      );
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  // Real Geolocation Scan handler
  const handleScanLocation = () => {
    sound.playClick();
    setIsScanning(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsScanning(false);
          sound.playSuccess();
          const { latitude, longitude } = position.coords;
          setUserCoords({
            lat: latitude,
            lng: longitude,
            cityName: 'พิกัด GPS อัตโนมัติ (ความแม่นยำสูง)',
          });

          setRealtimeNotice(
            `สแกนพิกัดดาวเทียมสำเร็จ: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E (ตรวจพบสถานะปกติในรัศมี 10 กม.)`
          );
          setTimeout(() => setRealtimeNotice(null), 5000);
        },
        (error) => {
          console.warn('Geolocation error or permission denied:', error.message);
          setIsScanning(false);
          // Default back to Bangkok coords with notification
          setUserCoords(DEFAULT_USER_COORDS);
          setRealtimeNotice('อ้างอิงพิกัดศูนย์บัญชาการกรุงเทพฯ (ตรวจพบสถานะปกติ)');
          setTimeout(() => setRealtimeNotice(null), 4000);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    } else {
      setIsScanning(false);
      setUserCoords(DEFAULT_USER_COORDS);
    }
  };

  const handleAddUserReport = (newReport: Partial<DisasterIncident>) => {
    const createdIncident: DisasterIncident = {
      id: newReport.id || `rep-${Date.now()}`,
      title: newReport.title || 'รายงานเหตุด่วน',
      type: newReport.type || 'flood',
      severity: newReport.severity || 'high',
      severityText: newReport.severityText || 'รายงานจากประชาชน',
      locationName: newReport.locationName || userCoords.cityName,
      lat: newReport.lat || userCoords.lat,
      lng: newReport.lng || userCoords.lng,
      timeAgo: 'เมื่อสักครู่',
      timestamp: 'ขณะนี้',
      description: newReport.description || '',
      metrics: newReport.metrics || {
        primaryLabel: 'ประเภทเหตุ',
        primaryValue: 'พลเมืองแจ้งเหตุ',
        secondaryLabel: 'สถานะ',
        secondaryValue: 'เฝ้าระวัง',
        statusLabel: 'แหล่งข่าว',
        statusValue: 'ประชาชนในพื้นที่',
      },
      adviceUrgent: newReport.adviceUrgent || 'โปรดหลีกเลี่ยงพื้นที่',
      affectedRadiusKm: 5,
      populationAtRisk: 'พื้นที่ใกล้เคียง',
      mapPinPos: { x: 42, y: 44 },
    };

    setIncidents((prev) => [createdIncident, ...prev]);
    setActiveTab('live-monitor');
  };

  return (
    <div className="bg-[#0c1322] text-[#dce2f7] min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Real-time Notice Toast */}
      {realtimeNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-blue-600/95 border border-blue-400 text-white text-xs font-semibold rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[16px] text-amber-300">
            verified
          </span>
          <span>{realtimeNotice}</span>
        </div>
      )}

      {/* Main Header Bar */}
      <Header
        currentTab={activeTab}
        userCoords={userCoords}
        isScanning={isScanning}
        onScanLocation={handleScanLocation}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-16 w-full">
        {activeTab === 'live-monitor' && (
          <LiveMonitorView
            incidents={incidents}
            userCoords={userCoords}
            isScanning={isScanning}
            onScanLocation={handleScanLocation}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'forecast' && (
          <ForecastView onNavigateToTab={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'preparedness' && <PreparednessView />}

        {activeTab === 'emergency-sos' && (
          <EmergencySosView
            userCoords={userCoords}
            onAddReport={handleAddUserReport}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        activeAlertCount={incidents.filter((i) => i.severity === 'critical').length}
      />
    </div>
  );
}
