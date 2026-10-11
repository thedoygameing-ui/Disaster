import React, { useState } from 'react';
import { DisasterIncident, DisasterType } from '../types/disaster';
import { TacticalRadarMap } from './TacticalRadarMap';
import { calculateDistanceKm, formatDistance } from '../utils/distance';
import { sound } from '../utils/audio';

interface LiveMonitorViewProps {
  incidents: DisasterIncident[];
  userCoords: { lat: number; lng: number; cityName: string };
  isScanning: boolean;
  onScanLocation: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const LiveMonitorView: React.FC<LiveMonitorViewProps> = ({
  incidents,
  userCoords,
  isScanning,
  onScanLocation,
  onNavigateToTab,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | DisasterType>('all');
  const [selectedIncident, setSelectedIncident] = useState<DisasterIncident | null>(null);
  const [activeIncidentModal, setActiveIncidentModal] = useState<DisasterIncident | null>(null);
  const [sharedToast, setSharedToast] = useState<string | null>(null);

  // Filter incidents based on pill
  const filteredIncidents = incidents.filter((inc) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'flood') return inc.type === 'flood' || inc.type === 'tsunami';
    return inc.type === activeFilter;
  });

  // Calculate nearest incident
  const incidentsWithDistance = filteredIncidents.map((inc) => {
    const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, inc.lat, inc.lng);
    return { ...inc, distanceToUser: dist };
  });

  // Find if any critical incident is within 300 km
  const nearbyCritical = incidentsWithDistance.find(
    (inc) => inc.severity === 'critical' && inc.distanceToUser <= 300
  );

  const handleShare = (title: string) => {
    sound.playClick();
    if (navigator.share) {
      navigator.share({
        title: 'AEGIS DISASTER ALERT',
        text: `⚠️ แจ้งเตือนภัยพิบัติด่วน: ${title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`⚠️ แจ้งเตือนภัยพิบัติด่วน: ${title}\nติดตามผ่าน Aegis Monitor`);
      setSharedToast('คัดลอกลิงก์แจ้งเตือนเรียบร้อยแล้ว');
      setTimeout(() => setSharedToast(null), 3000);
    }
  };

  const handleTestSiren = () => {
    sound.playEmergencyAlert();
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Toast */}
      {sharedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-xl flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>{sharedToast}</span>
        </div>
      )}

      {/* Telemetry Bar */}
      <div className="px-4 sm:px-6 pt-3 pb-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#1f2638] bg-[#0c1322]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          <span className="font-mono text-xs text-red-400 font-bold tracking-wider uppercase">
            DEFCON-2 MONITORING
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-[#8c909f]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-amber-400">
              satellite
            </span>
            AEGIS-ORBIT 14
          </span>
          <span>•</span>
          <span className="text-[#c2c6d6] font-semibold">
            {userCoords.lat.toFixed(4)}° N, {userCoords.lng.toFixed(4)}° E
          </span>
        </div>
      </div>

      {/* Proximity Alert Banner if an event is near user */}
      {nearbyCritical && (
        <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-xl bg-red-950/60 border border-red-500/60 flex items-center justify-between gap-3 shadow-lg shadow-red-950/30">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="material-symbols-outlined text-red-400 text-[24px] animate-bounce">
              crisis_alert
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-red-300 font-bold text-xs uppercase tracking-wider">
                สัญญาณแจ้งเตือนใกล้ตัวคุณ ({formatDistance(nearbyCritical.distanceToUser)})
              </span>
              <span className="text-white text-xs font-semibold truncate">
                {nearbyCritical.title}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveIncidentModal(nearbyCritical);
              sound.playClick();
            }}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
          >
            เปิดแผนอพยพ
          </button>
        </div>
      )}

      {/* 1. Breaking Alert Card */}
      <div className="px-4 sm:px-6 my-3">
        <div className="relative overflow-hidden rounded-2xl bg-[#191f2f] border border-red-500/40 p-4 sm:p-5 shadow-2xl">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600"></div>

          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>เตือนภัยระดับสีแดง (วิกฤตสูงสุด)</span>
            </div>
            <span className="font-mono text-xs text-[#8c909f]">เมื่อ 14 นาทีที่แล้ว</span>
          </div>

          <div className="flex flex-col mt-2">
            <h2 className="font-bold text-lg sm:text-xl text-[#dce2f7] flex items-center gap-2">
              <span className="material-symbols-outlined text-red-400 text-[24px]">
                warning
              </span>
              แผ่นดินไหวขนาด 7.4 ริกเตอร์ นอกชายฝั่งมหาสมุทรแปซิฟิก
            </h2>
            <p className="text-sm text-[#c2c6d6] mt-1.5 leading-relaxed">
              จุดศูนย์กลางลึก 12 กม. มีโอกาสเกิดคลื่นสึนามิสูง 2-3 เมตรตามแนวชายฝั่งรอบรัศมี 350 กม. เจ้าหน้าที่ออกคำสั่งอพยพทันที คลื่นลูกแรกคาดปะทะภายใน 45 นาที
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2e3545] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs font-mono text-red-300 font-semibold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">tsunami</span>
                เสี่ยงสึนามิสูง
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">speed</span>
                ความเร็วคลื่น 720 กม./ชม.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTestSiren}
                className="px-3 py-1.5 rounded-lg bg-[#232a3a] hover:bg-[#2e3545] text-amber-300 text-xs font-semibold flex items-center gap-1 transition-colors border border-amber-500/20"
                title="ทดสอบเสียงแจ้งเตือนฉุกเฉิน"
              >
                <span className="material-symbols-outlined text-[16px]">volume_up</span>
                <span>ทดสอบไซเรน</span>
              </button>

              <button
                onClick={() => {
                  const target = incidents.find((i) => i.id === 'inc-pacific-74');
                  if (target) {
                    setActiveIncidentModal(target);
                    sound.playClick();
                  }
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-md"
              >
                <span>แนวปะทะ & แผนอพยพ</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Filter Pills (Horizontal Scroll) */}
      <div className="w-full overflow-x-auto no-scrollbar py-1 px-4 sm:px-6 flex items-center gap-2">
        <button
          onClick={() => {
            sound.playClick();
            setActiveFilter('all');
          }}
          className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white shadow-blue-500/30'
              : 'bg-[#191f2f] text-[#c2c6d6] hover:bg-[#232a3a] border border-[#2e3545]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">crisis_alert</span>
          <span>ทั้งหมด ({incidents.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveFilter('earthquake');
          }}
          className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeFilter === 'earthquake'
              ? 'bg-blue-600 text-white shadow-blue-500/30'
              : 'bg-[#191f2f] text-[#c2c6d6] hover:bg-[#232a3a] border border-[#2e3545]'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
          <span>แผ่นดินไหว (12)</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveFilter('flood');
          }}
          className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeFilter === 'flood'
              ? 'bg-blue-600 text-white shadow-blue-500/30'
              : 'bg-[#191f2f] text-[#c2c6d6] hover:bg-[#232a3a] border border-[#2e3545]'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
          <span>สึนามิ & น้ำท่วม (15)</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveFilter('volcano');
          }}
          className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeFilter === 'volcano'
              ? 'bg-blue-600 text-white shadow-blue-500/30'
              : 'bg-[#191f2f] text-[#c2c6d6] hover:bg-[#232a3a] border border-[#2e3545]'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span>ภูเขาไฟ (6)</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveFilter('storm');
          }}
          className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeFilter === 'storm'
              ? 'bg-blue-600 text-white shadow-blue-500/30'
              : 'bg-[#191f2f] text-[#c2c6d6] hover:bg-[#232a3a] border border-[#2e3545]'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
          <span>พายุหมุน (15)</span>
        </button>
      </div>

      {/* 3. Interactive Global Tactical Map View preview */}
      <div className="px-4 sm:px-6 my-3">
        <TacticalRadarMap
          incidents={filteredIncidents}
          selectedIncident={selectedIncident}
          onSelectIncident={(inc) => {
            setSelectedIncident(inc);
            setActiveIncidentModal(inc);
          }}
          userCoords={userCoords}
        />
      </div>

      {/* Section Title & Density Counter */}
      <div className="px-4 sm:px-6 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-base sm:text-lg text-[#dce2f7]">เหตุการณ์ด่วนล่าสุด</h3>
          <span className="px-2 py-0.5 rounded-md bg-[#191f2f] border border-[#424754] text-[#adc6ff] font-mono text-xs">
            {filteredIncidents.length} รายการ
          </span>
        </div>
        <span className="font-mono text-xs text-[#8c909f] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          อัปเดตอัตโนมัติ 5s
        </span>
      </div>

      {/* 4. Breaking Incidents Feed */}
      <div className="px-4 sm:px-6 flex flex-col gap-3.5 my-2">
        {incidentsWithDistance.map((inc) => {
          const isCritical = inc.severity === 'critical';
          const isHigh = inc.severity === 'high';

          return (
            <div
              key={inc.id}
              className={`relative rounded-2xl bg-[#191f2f] border p-4 sm:p-5 shadow-lg transition-all ${
                isCritical
                  ? 'border-red-500/50 hover:border-red-500'
                  : isHigh
                  ? 'border-amber-500/40 hover:border-amber-500'
                  : 'border-[#2e3545] hover:border-blue-500/40'
              }`}
            >
              {/* Left Accent Stripe */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${
                  isCritical ? 'bg-red-500' : isHigh ? 'bg-amber-500' : 'bg-blue-500'
                }`}
              ></div>

              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                      isCritical
                        ? 'bg-red-950/70 text-red-300 border border-red-500/30'
                        : isHigh
                        ? 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-950/70 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isCritical ? 'bg-red-400 animate-pulse' : 'bg-amber-400'
                      }`}
                    ></span>
                    {inc.severityText}
                  </span>

                  <span className="px-2 py-0.5 rounded bg-[#232a3a] text-[#c2c6d6] text-xs font-medium">
                    {inc.type === 'earthquake'
                      ? 'แผ่นดินไหว'
                      : inc.type === 'flood'
                      ? 'น้ำท่วมฉับพลัน'
                      : inc.type === 'volcano'
                      ? 'ภูเขาไฟ'
                      : inc.type === 'storm'
                      ? 'พายุหมุน'
                      : 'ไฟป่า'}
                  </span>

                  {/* Calculated Proximity Badge */}
                  <span className="font-mono text-[11px] text-[#adc6ff] bg-[#141b2b] px-2 py-0.5 rounded border border-[#2e3545]">
                    ห่างจากคุณ {formatDistance(inc.distanceToUser)}
                  </span>
                </div>

                <span className="font-mono text-xs text-[#8c909f] flex-shrink-0">
                  {inc.timeAgo}
                </span>
              </div>

              <h4 className="font-bold text-base sm:text-lg text-[#dce2f7] flex items-center gap-1.5">
                {inc.title}
              </h4>

              <p className="text-sm text-[#c2c6d6] mt-1 leading-relaxed">
                {inc.description}
              </p>

              {/* Key Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-[#141b2b] border border-[#232a3a]">
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#8c909f] font-medium">
                    {inc.metrics.primaryLabel}
                  </span>
                  <span className="font-mono text-xs sm:text-sm text-[#dce2f7] font-bold mt-0.5">
                    {inc.metrics.primaryValue}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#8c909f] font-medium">
                    {inc.metrics.secondaryLabel}
                  </span>
                  <span
                    className={`font-mono text-xs sm:text-sm font-bold mt-0.5 ${
                      isCritical ? 'text-red-400' : 'text-amber-400'
                    }`}
                  >
                    {inc.metrics.secondaryValue}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#8c909f] font-medium">
                    {inc.metrics.statusLabel}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#adc6ff] mt-0.5 truncate">
                    {inc.metrics.statusValue}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setActiveIncidentModal(inc);
                    sound.playClick();
                  }}
                  className={`flex-1 h-10 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow ${
                    isCritical
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-[#232a3a] hover:bg-[#2e3545] text-[#dce2f7]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isCritical ? 'map' : 'navigation'}
                  </span>
                  <span>ดูข้อมูล & แผนอพยพ</span>
                </button>

                <button
                  onClick={() => handleShare(inc.title)}
                  title="แชร์เหตุการณ์นี้"
                  className="w-10 h-10 rounded-xl bg-[#232a3a] hover:bg-[#2e3545] border border-[#424754] text-[#dce2f7] flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">share</span>
                </button>

                <button
                  onClick={() => {
                    sound.playEmergencyAlert();
                    onNavigateToTab('emergency-sos');
                  }}
                  title="แจ้งศูนย์กู้ภัยหรือกด SOS"
                  className="w-10 h-10 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-400 flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">sos</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Incident Statistics Mini Grid */}
      <div className="px-4 sm:px-6 my-3 grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-[#191f2f] border border-[#2e3545] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8c909f] font-semibold uppercase tracking-wider">
              ประชากรในรัศมีเสี่ยง
            </span>
            <span className="material-symbols-outlined text-red-400 text-[20px]">
              group
            </span>
          </div>
          <div className="mt-2">
            <span className="font-bold text-xl sm:text-2xl text-[#dce2f7]">1.24 M</span>
            <span className="block text-xs text-[#8c909f] mt-0.5">
              ทั่วภูมิภาคเอเชียแปซิฟิก
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#191f2f] border border-[#2e3545] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8c909f] font-semibold uppercase tracking-wider">
              ศูนย์พักพิงพร้อมใช้
            </span>
            <span className="material-symbols-outlined text-blue-400 text-[20px]">
              holiday_village
            </span>
          </div>
          <div className="mt-2">
            <span className="font-bold text-xl sm:text-2xl text-[#dce2f7]">84 แห่ง</span>
            <span className="block text-xs text-blue-400 mt-0.5">
              รองรับได้ 78,500 คน
            </span>
          </div>
        </div>
      </div>

      {/* 5. Floating / Sticky Tactical Bottom Quick Action Banner */}
      <div className="sticky bottom-20 z-40 px-4 sm:px-6 py-2">
        <div className="relative overflow-hidden rounded-2xl bg-[#191f2f]/95 backdrop-blur-xl border border-blue-500/30 p-3.5 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-blue-400 text-[22px] animate-pulse">
                my_location
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs sm:text-sm text-[#dce2f7] truncate">
                สแกนพิกัดปัจจุบันของฉัน
              </span>
              <span className="text-[11px] text-[#8c909f] truncate">
                ตรวจสอบความปลอดภัยในรัศมี 10 กม.
              </span>
            </div>
          </div>

          <button
            onClick={onScanLocation}
            disabled={isScanning}
            className="flex-shrink-0 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
          >
            <span>{isScanning ? 'กำลังสแกน...' : 'สแกนทันที'}</span>
            <span
              className={`material-symbols-outlined text-[16px] ${
                isScanning ? 'animate-spin' : ''
              }`}
            >
              radar
            </span>
          </button>
        </div>
      </div>

      {/* Deep Incident Modal */}
      {activeIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#191f2f] border border-blue-500/40 rounded-2xl w-full max-w-lg p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#2e3545]">
              <div className="flex flex-col pr-4">
                <span className="text-xs font-bold font-mono text-red-400 uppercase">
                  {activeIncidentModal.severityText}
                </span>
                <h3 className="font-bold text-lg text-white mt-1">
                  {activeIncidentModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveIncidentModal(null)}
                className="w-8 h-8 rounded-lg text-[#c2c6d6] hover:text-white flex items-center justify-center flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm">
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-red-200">
                <span className="material-symbols-outlined text-red-400 text-[22px] flex-shrink-0 mt-0.5">
                  eject
                </span>
                <div className="flex flex-col">
                  <span className="font-bold text-xs">คำแนะนำด่วนสำหรับพื้นที่นี้:</span>
                  <p className="text-xs mt-0.5 leading-relaxed">
                    {activeIncidentModal.adviceUrgent}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xs text-[#8c909f] uppercase tracking-wider">
                  รายละเอียดเหตุการณ์
                </h4>
                <p className="text-xs text-[#c2c6d6] leading-relaxed">
                  {activeIncidentModal.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#141b2b]">
                  <span className="text-[#8c909f]">พื้นที่ / จุดศูนย์กลาง</span>
                  <p className="font-semibold text-white mt-0.5">
                    {activeIncidentModal.locationName}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-[#141b2b]">
                  <span className="text-[#8c909f]">ระยะห่างจากคุณ</span>
                  <p className="font-mono font-bold text-blue-400 mt-0.5">
                    {formatDistance(
                      calculateDistanceKm(
                        userCoords.lat,
                        userCoords.lng,
                        activeIncidentModal.lat,
                        activeIncidentModal.lng
                      )
                    )}
                  </p>
                </div>
              </div>

              {/* Action Roadmap */}
              <div className="pt-2 border-t border-[#2e3545] space-y-2">
                <button
                  onClick={() => {
                    setActiveIncidentModal(null);
                    onNavigateToTab('preparedness');
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    health_and_safety
                  </span>
                  <span>ดูคู่มือรับมือภัยประเภทนี้แบบละเอียด</span>
                </button>

                <button
                  onClick={() => {
                    setActiveIncidentModal(null);
                    onNavigateToTab('emergency-sos');
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-500/50 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    night_shelter
                  </span>
                  <span>ดูจุดปลอดภัยและศูนย์พักพิงใกล้เคียง</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
