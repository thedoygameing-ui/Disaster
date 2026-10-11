import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentTab: string;
  userCoords: { lat: number; lng: number; cityName: string };
  isScanning: boolean;
  onScanLocation: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  userCoords,
  isScanning,
  onScanLocation,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);

  const toggleSound = () => {
    const nextState = !isMuted;
    sound.setMuted(nextState);
    setIsMuted(nextState);
    if (!nextState) {
      sound.playClick();
    }
  };

  const getSubheaderTitle = () => {
    switch (currentTab) {
      case 'live-monitor':
        return 'Live Monitor';
      case 'forecast':
        return 'Forecast';
      case 'preparedness':
        return 'Preparedness';
      case 'emergency-sos':
        return 'Emergency SOS';
      default:
        return 'Disaster Console';
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#0c1322]/90 backdrop-blur-xl border-b border-[#2e3545]/60 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Logo & App Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <div className="w-full h-full bg-[#0c1322] rounded-[10px] flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-400 text-[22px] animate-pulse">
                  radar
                </span>
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[#adc6ff] font-bold text-base tracking-wider uppercase truncate">
                  AEGIS ALERTS
                </span>
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#232a3a]/90 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 leading-none">
                    LIVE SYNC
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-medium text-[#c2c6d6] truncate uppercase tracking-wider">
                {getSubheaderTitle()}
              </span>
            </div>
          </div>

          {/* Quick Tactical Action Controls */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? 'เปิดเสียงแจ้งเตือนไซเรน' : 'ปิดเสียง'}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-[#c2c6d6] hover:text-[#dce2f7] hover:bg-[#191f2f] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>

            {/* GPS Telemetry Scan */}
            <button
              onClick={onScanLocation}
              disabled={isScanning}
              title="ตรวจจับพิกัด GPS ของฉัน"
              className="w-10 h-10 flex items-center justify-center rounded-lg text-[#c2c6d6] hover:text-[#adc6ff] hover:bg-[#191f2f] transition-colors relative"
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isScanning ? 'animate-spin text-blue-400' : ''
                }`}
              >
                my_location
              </span>
            </button>

            {/* Telemetry Status Button */}
            <button
              onClick={() => {
                sound.playClick();
                setShowTelemetryModal(true);
              }}
              title="ดูข้อมูลดาวเทียมและสถานะเครือข่าย"
              className="w-10 h-10 flex items-center justify-center rounded-lg text-[#c2c6d6] hover:text-[#adc6ff] hover:bg-[#191f2f] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                satellite_alt
              </span>
            </button>

            {/* Tactical Profile Avatar */}
            <div className="w-9 h-9 rounded-full bg-[#191f2f] border-2 border-[#4d8eff]/60 overflow-hidden flex items-center justify-center ml-1">
              <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
                shield_person
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Telemetry HUD Modal */}
      {showTelemetryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#191f2f] border border-[#424754] rounded-2xl w-full max-w-md p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#424754]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#adc6ff] text-[22px]">
                  satellite_alt
                </span>
                <h3 className="font-bold text-base text-[#dce2f7]">
                  สถานะเครือข่ายและดาวเทียม Aegis Telemetry
                </h3>
              </div>
              <button
                onClick={() => setShowTelemetryModal(false)}
                className="w-8 h-8 rounded-lg text-[#c2c6d6] hover:text-white flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm">
              <div className="flex items-center justify-between p-2.5 bg-[#141b2b] rounded-lg">
                <span className="text-[#c2c6d6]">ดาวเทียมหลัก</span>
                <span className="font-mono text-[#adc6ff] font-semibold">
                  AEGIS-ORBIT 14 (Geostationary)
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#141b2b] rounded-lg">
                <span className="text-[#c2c6d6]">ลิงก์สำรองฉุกเฉิน</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  IRIDIUM-89 & Starlink Ready
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#141b2b] rounded-lg">
                <span className="text-[#c2c6d6]">พิกัดตรวจจับปัจจุบัน</span>
                <span className="font-mono text-amber-300 font-semibold text-xs">
                  {userCoords.lat.toFixed(4)}° N, {userCoords.lng.toFixed(4)}° E
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#141b2b] rounded-lg">
                <span className="text-[#c2c6d6]">พื้นที่ปัจจุบัน</span>
                <span className="text-[#dce2f7] font-medium">{userCoords.cityName}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#141b2b] rounded-lg">
                <span className="text-[#c2c6d6]">รอบการซิงค์ข้อมูล</span>
                <span className="font-mono text-emerald-400">เรียลไทม์ (ทุก 5 วินาที)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowTelemetryModal(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
