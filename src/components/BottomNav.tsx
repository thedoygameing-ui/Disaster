import React from 'react';
import { sound } from '../utils/audio';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeAlertCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  activeAlertCount = 3,
}) => {
  const tabs = [
    {
      id: 'live-monitor',
      label: 'เหตุการณ์สด',
      icon: 'radar',
      badge: activeAlertCount > 0 ? activeAlertCount : null,
      isEmergency: false,
    },
    {
      id: 'forecast',
      label: 'คาดการณ์',
      icon: 'ssid_chart',
      badge: null,
      isEmergency: false,
    },
    {
      id: 'preparedness',
      label: 'คู่มือรับมือ',
      icon: 'health_and_safety',
      badge: null,
      isEmergency: false,
    },
    {
      id: 'emergency-sos',
      label: 'แจ้งเหตุ/SOS',
      icon: 'fmd_bad',
      badge: 'SOS',
      isEmergency: true,
    },
  ];

  const handleSelect = (tabId: string) => {
    sound.playClick();
    onTabChange(tabId);
  };

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-[env(safe-area-inset-bottom,0px)] bg-[#070e1d]/95 backdrop-blur-xl border-t border-[#2e3545]/70 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]">
      <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto grid grid-cols-4 items-center h-16 sm:h-20 px-2 sm:px-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={`flex flex-col items-center justify-center h-12 sm:h-14 rounded-xl transition-all relative ${
                isActive
                  ? tab.isEmergency
                    ? 'text-red-400 bg-red-950/40 border border-red-500/30'
                    : 'text-[#adc6ff] bg-[#232a3a]/80 border border-blue-500/20'
                  : tab.isEmergency
                  ? 'text-red-300 hover:text-red-200'
                  : 'text-[#8c909f] hover:text-[#dce2f7]'
              }`}
            >
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[24px] sm:text-[26px] ${
                    isActive ? (tab.isEmergency ? 'text-red-400' : 'text-[#adc6ff]') : ''
                  }`}
                >
                  {tab.icon}
                </span>

                {/* Badge for SOS or count */}
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-3 px-1 py-0.2 rounded-full text-[9px] font-bold ${
                      tab.isEmergency
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] sm:text-xs font-semibold tracking-tight truncate mt-0.5 ${
                  isActive
                    ? tab.isEmergency
                      ? 'text-red-400 font-bold'
                      : 'text-[#adc6ff]'
                    : tab.isEmergency
                    ? 'text-red-300'
                    : 'text-[#8c909f]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
