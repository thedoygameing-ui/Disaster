import React, { useState, useRef, useEffect } from 'react';
import { NEARBY_SHELTERS, EMERGENCY_HOTLINES } from '../data/disasterData';
import { DisasterIncident, DisasterType, SeverityLevel } from '../types/disaster';
import { formatDistance, calculateDistanceKm } from '../utils/distance';
import { sound } from '../utils/audio';

interface EmergencySosViewProps {
  userCoords: { lat: number; lng: number; cityName: string };
  onAddReport: (report: Partial<DisasterIncident>) => void;
}

export const EmergencySosView: React.FC<EmergencySosViewProps> = ({
  userCoords,
  onAddReport,
}) => {
  const [sosStatus, setSosStatus] = useState<'standby' | 'holding' | 'triggered'>('standby');
  const [holdSeconds, setHoldSeconds] = useState<number>(0);
  const [safetyCheckinStatus, setSafetyCheckinStatus] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Report form state
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<DisasterType>('flood');
  const [reportLocation, setReportLocation] = useState('');
  const [reportSeverity, setReportSeverity] = useState<SeverityLevel>('high');
  const [reportNotes, setReportNotes] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const holdCounterRef = useRef<number>(0);

  // Handle SOS button hold
  const startSosHold = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (sosStatus === 'triggered') return;

    sound.playClick();
    setSosStatus('holding');
    setHoldSeconds(0);
    holdCounterRef.current = 0;

    holdTimerRef.current = setInterval(() => {
      holdCounterRef.current += 1;
      const current = holdCounterRef.current;
      setHoldSeconds(current);

      sound.playCountdownBeep(700 + current * 120);

      if (current >= 5) {
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
        triggerSosBeacon();
      }
    }, 1000);
  };

  const cancelSosHold = () => {
    if (sosStatus === 'holding') {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
      setSosStatus('standby');
      setHoldSeconds(0);
      holdCounterRef.current = 0;
    }
  };

  const triggerSosBeacon = () => {
    setSosStatus('triggered');
    sound.playEmergencyAlert();

    // Trigger notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 AEGIS SOS EMERGENCY BEACON SENT', {
        body: `พิกัดดาวเทียม ${userCoords.lat.toFixed(4)}, ${userCoords.lng.toFixed(4)} ถูกส่งต่อศูนย์กู้ภัย 1784 แล้ว`,
      });
    }
  };

  const resetSos = () => {
    sound.playClick();
    setSosStatus('standby');
    setHoldSeconds(0);
    holdCounterRef.current = 0;
  };

  const handleSafetyCheck = (type: 'safe' | 'supplies' | 'critical') => {
    sound.playClick();
    if (type === 'safe') {
      setSafetyCheckinStatus('บันทึกสถานะ: "ฉันปลอดภัยดี" — ส่งถึงครอบครัวและศูนย์บรรเทาทุกข์แล้ว');
    } else if (type === 'supplies') {
      setSafetyCheckinStatus('บันทึกสถานะ: "ต้องการเสบียงน้ำ/อาหาร" — เพิ่มเข้าคิวส่งมอบสิ่งของจำเป็นแล้ว');
    } else {
      setSafetyCheckinStatus('บันทึกสถานะ: "ต้องการความช่วยเหลือด่วน!" — ปักหมุดหน่วยกู้ชีพฉุกเฉิน 1669');
      sound.playEmergencyAlert();
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) return;

    onAddReport({
      id: `rep-${Date.now()}`,
      title: reportTitle,
      type: reportType,
      severity: reportSeverity,
      severityText:
        reportSeverity === 'critical'
          ? 'วิกฤตด่วน (รายงานจากประชาชน)'
          : 'เฝ้าระวัง (รายงานจากประชาชน)',
      locationName: reportLocation || userCoords.cityName,
      lat: userCoords.lat,
      lng: userCoords.lng,
      timeAgo: 'เมื่อสักครู่',
      timestamp: 'ขณะนี้',
      description: reportNotes || 'รายงานสถานการณ์ฉุกเฉินจากประชาชนในพื้นที่',
      metrics: {
        primaryLabel: 'ประเภทเหตุ',
        primaryValue: reportType.toUpperCase(),
        secondaryLabel: 'สถานะ',
        secondaryValue: 'รอเจ้าหน้าที่ตรวจสอบ',
        statusLabel: 'แหล่งข้อมูล',
        statusValue: 'พลเมืองอาสา',
      },
      adviceUrgent: 'โปรดหลีกเลี่ยงเส้นทางและตรวจสอบความปลอดภัย',
      affectedRadiusKm: 5,
      populationAtRisk: 'พื้นที่ใกล้เคียง',
      mapPinPos: { x: 45, y: 45 },
    });

    sound.playSuccess();
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setShowReportModal(false);
      setReportTitle('');
      setReportNotes('');
    }, 1500);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Telemetry Bar */}
      <div className="px-4 sm:px-6 pt-3 pb-2 flex items-center justify-between bg-[#141b2b] border-b border-[#2e3545]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="font-mono text-xs text-amber-300 font-bold">
            SAT-LINK: IRIDIUM-89 ACTV
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-[#c2c6d6]">
          <span>
            LAT {userCoords.lat.toFixed(4)}° N / LON {userCoords.lng.toFixed(4)}° E
          </span>
          <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">
            satellite_alt
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6 flex flex-col gap-5 max-w-4xl mx-auto w-full">
        {/* SOS Beacon Section */}
        <div className="relative overflow-hidden rounded-2xl bg-[#191f2f] border border-[#2e3545] p-6 flex flex-col items-center text-center shadow-2xl">
          {/* Ambient red glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-600/15 via-transparent to-transparent pointer-events-none"></div>

          {/* Central Target Radar Reticle */}
          <div className="relative w-48 h-48 my-3 flex items-center justify-center select-none">
            {/* Outer radar dashed ring */}
            <svg
              className={`absolute inset-0 w-full h-full ${
                sosStatus === 'holding' ? 'animate-[spin_4s_linear_infinite]' : 'animate-[spin_16s_linear_infinite]'
              }`}
              viewBox="0 0 160 160"
            >
              <circle
                cx="80"
                cy="80"
                fill="none"
                r="72"
                stroke="#424754"
                strokeDasharray="6 8"
                strokeWidth="2.5"
                opacity="0.6"
              />
              <line stroke="#424754" strokeWidth="3" strokeLinecap="round" x1="80" x2="80" y1="2" y2="16" />
              <line stroke="#424754" strokeWidth="3" strokeLinecap="round" x1="80" x2="80" y1="144" y2="158" />
              <line stroke="#424754" strokeWidth="3" strokeLinecap="round" x1="2" x2="16" y1="80" y2="80" />
              <line stroke="#424754" strokeWidth="3" strokeLinecap="round" x1="144" x2="158" y1="80" y2="80" />
            </svg>

            {/* Segmented Rings */}
            <svg className="absolute w-36 h-36" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                fill="none"
                r="48"
                stroke="#4d8eff"
                strokeDasharray="210 300"
                strokeDashoffset="40"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <circle
                cx="60"
                cy="60"
                fill="none"
                r="48"
                stroke="#ffb95f"
                strokeDasharray="80 300"
                strokeDashoffset="-140"
                strokeLinecap="round"
                strokeWidth="5"
              />
            </svg>

            {/* SOS Interactive Core Button */}
            <button
              onMouseDown={startSosHold}
              onTouchStart={startSosHold}
              onMouseUp={cancelSosHold}
              onMouseLeave={cancelSosHold}
              onTouchEnd={cancelSosHold}
              className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all select-none cursor-pointer shadow-2xl active:scale-95 ${
                sosStatus === 'triggered'
                  ? 'bg-red-600 text-white animate-pulse ring-8 ring-red-500/50'
                  : sosStatus === 'holding'
                  ? 'bg-red-700 text-white scale-105 ring-4 ring-amber-400'
                  : 'bg-gradient-to-br from-red-600 to-red-800 text-white hover:brightness-110 shadow-red-600/40'
              }`}
            >
              <span
                className="material-symbols-outlined text-[36px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                emergency
              </span>
              <span className="font-black text-xl tracking-widest leading-none mt-1">
                SOS
              </span>

              {/* Countdown readout when holding */}
              {sosStatus === 'holding' && (
                <span className="absolute -bottom-7 font-mono font-bold text-amber-300 text-xs">
                  ปล่อยเพื่อยกเลิก ({5 - holdSeconds}s)
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col items-center gap-1.5 max-w-sm">
            <h2 className="font-bold text-lg sm:text-xl text-white">
              {sosStatus === 'triggered'
                ? 'สัญญาณ SOS ถูกส่งเรียบร้อยแล้ว!'
                : 'ส่งสัญญาณขอความช่วยเหลือฉุกเฉิน'}
            </h2>
            <p className="text-xs text-[#c2c6d6] leading-relaxed">
              {sosStatus === 'triggered'
                ? 'พิกัด GPS ของคุณถูกส่งตรงไปยังศูนย์ ปภ. (1784) และหน่วยกู้ภัยในรัศมีใกล้ที่สุดแล้ว กรุณารอ ณ จุดปลอดภัย'
                : 'กดปุ่ม SOS ค้างไว้ 5 วินาที เพื่อกระจายพิกัดดาวเทียมแบบเรียลไทม์ตรงถึงศูนย์บรรเทาสาธารณภัย (ปภ.) และหน่วยกู้ชีพใกล้เคียงทันที'}
            </p>
          </div>

          {/* Status readout banner */}
          <div
            className={`mt-4 w-full py-2.5 px-4 rounded-xl flex items-center justify-between border transition-all ${
              sosStatus === 'triggered'
                ? 'bg-red-950/80 border-red-500 text-red-200'
                : 'bg-[#141b2b] border-[#2e3545] text-[#adc6ff]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-[20px] ${
                  sosStatus === 'triggered' ? 'text-red-400 animate-spin' : 'text-blue-400'
                }`}
              >
                {sosStatus === 'triggered' ? 'crisis_alert' : 'gps_fixed'}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">
                {sosStatus === 'triggered'
                  ? 'กระจายสัญญาณ SOS ไปยังทุกข่ายวิทยุแล้ว'
                  : 'GPS ความแม่นยำสูง (±1.5ม.) พร้อมส่ง'}
              </span>
            </div>

            {sosStatus === 'triggered' ? (
              <button
                onClick={resetSos}
                className="text-[11px] font-bold text-white bg-red-600 px-2.5 py-1 rounded hover:bg-red-500"
              >
                รีเซ็ต
              </button>
            ) : (
              <span className="font-mono text-xs text-amber-400 font-bold">STANDBY</span>
            )}
          </div>
        </div>

        {/* Safety Status Check-in Micro-Action */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[20px] text-blue-400">
                how_to_reg
              </span>
              <h3 className="font-bold text-sm text-white">
                รายงานสถานะความปลอดภัยของฉัน
              </h3>
            </div>
            <span className="text-xs text-[#8c909f]">แจ้งเครือข่ายครอบครัว & ปภ.</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Safe State */}
            <button
              onClick={() => handleSafetyCheck('safe')}
              className="bg-[#191f2f] hover:bg-[#232a3a] border border-[#2e3545] py-3.5 px-2 rounded-xl flex flex-col items-center gap-1.5 transition-all text-center group"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <span className="font-bold text-xs text-white">ฉันปลอดภัยดี</span>
              <span className="text-[10px] text-[#8c909f]">ไม่ต้องช่วย</span>
            </button>

            {/* Supplies Needed */}
            <button
              onClick={() => handleSafetyCheck('supplies')}
              className="bg-[#191f2f] hover:bg-[#232a3a] border border-[#2e3545] py-3.5 px-2 rounded-xl flex flex-col items-center gap-1.5 transition-all text-center group"
            >
              <div className="w-8 h-8 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[18px]">water_drop</span>
              </div>
              <span className="font-bold text-xs text-amber-300">ต้องการเสบียง</span>
              <span className="text-[10px] text-[#8c909f]">น้ำ/อาหารแห้ง</span>
            </button>

            {/* Urgent Help Needed */}
            <button
              onClick={() => handleSafetyCheck('critical')}
              className="bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 py-3.5 px-2 rounded-xl flex flex-col items-center gap-1.5 transition-all text-center group"
            >
              <div className="w-8 h-8 rounded-full bg-red-950 border border-red-500 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[18px]">priority_high</span>
              </div>
              <span className="font-bold text-xs text-red-300">ต้องการช่วยด่วน</span>
              <span className="text-[10px] text-red-400">ติดค้างในพื้นที่</span>
            </button>
          </div>

          {safetyCheckinStatus && (
            <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs font-semibold text-center animate-in fade-in">
              {safetyCheckinStatus}
            </div>
          )}
        </div>

        {/* Quick Emergency Call Hotlines */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[20px] text-red-400">
                ring_volume
              </span>
              <h3 className="font-bold text-sm text-white">
                โทรด่วนฉุกเฉิน (แตะครั้งเดียวเพื่อโทร)
              </h3>
            </div>
            <span className="text-xs text-[#8c909f]">โทรฟรี 24 ชม.</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {EMERGENCY_HOTLINES.slice(0, 4).map((hotline) => (
              <a
                key={hotline.number}
                href={`tel:${hotline.number}`}
                className="bg-[#191f2f] hover:bg-[#232a3a] border border-[#2e3545] p-3.5 rounded-xl flex items-center justify-between shadow-sm transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#141b2b] border border-[#2e3545] flex items-center justify-center flex-shrink-0">
                    <span className={`material-symbols-outlined text-[20px] ${hotline.color}`}>
                      {hotline.icon}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`font-black font-mono text-lg leading-tight ${hotline.color}`}
                    >
                      {hotline.number}
                    </span>
                    <span className="text-[11px] text-[#c2c6d6] truncate">
                      {hotline.title}
                    </span>
                  </div>
                </div>
                <span
                  className={`material-symbols-outlined text-[18px] ${hotline.color} group-hover:scale-110 transition-transform`}
                >
                  call
                </span>
              </a>
            ))}

            {/* Tourist Hotline full width */}
            <a
              href="tel:1155"
              className="col-span-2 bg-[#191f2f] hover:bg-[#232a3a] border border-[#2e3545] p-3.5 rounded-xl flex items-center justify-between shadow-sm transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#141b2b] border border-[#2e3545] flex items-center justify-center flex-shrink-0 text-white">
                  <span className="material-symbols-outlined text-[20px]">translate</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black font-mono text-lg text-white leading-tight">
                      1155
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#232a3a] text-[#adc6ff] font-mono">
                      ENG / CH / JP / TH
                    </span>
                  </div>
                  <span className="text-xs text-[#c2c6d6] truncate">
                    ศูนย์ช่วยเหลือนักท่องเที่ยวสากล 24 ชม.
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-blue-400 group-hover:scale-110 transition-transform">
                call
              </span>
            </a>
          </div>
        </div>

        {/* Citizen Report Emergency Incident Banner */}
        <div className="p-4 rounded-2xl bg-[#191f2f] border border-blue-500/30 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/40 text-blue-400 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">add_alert</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs sm:text-sm text-white truncate">
                พบเห็นเหตุด่วนหรือภัยใกล้ตัว?
              </span>
              <span className="text-[11px] text-[#8c909f] truncate">
                รายงานเหตุทันทีเพื่อแจ้งเตือนประชาชนในละแวก
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setShowReportModal(true);
            }}
            className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            แจ้งเหตุด่วน
          </button>
        </div>

        {/* Nearby Evacuation Shelters */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[20px] text-blue-400">
                night_shelter
              </span>
              <h3 className="font-bold text-sm text-white">
                ศูนย์พักพิงและจุดปลอดภัยใกล้เคียง
              </h3>
            </div>
            <span className="font-mono text-xs text-amber-400">อัปเดต 2 นาทีที่แล้ว</span>
          </div>

          <div className="flex flex-col gap-3">
            {NEARBY_SHELTERS.map((shelter) => {
              const dist = calculateDistanceKm(
                userCoords.lat,
                userCoords.lng,
                shelter.lat,
                shelter.lng
              );

              return (
                <div
                  key={shelter.id}
                  className="bg-[#191f2f] border border-[#2e3545] rounded-2xl p-4 flex flex-col gap-3 shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
                        <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                          {shelter.name}
                        </h4>
                      </div>
                      <p className="text-xs text-[#8c909f] mt-0.5">
                        ห่างจากตำแหน่งคุณ {formatDistance(dist)} (เดินเท้า ~{shelter.walkMinutes} นาที)
                      </p>
                    </div>

                    <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[#141b2b] border border-[#2e3545] text-blue-300 font-bold flex-shrink-0">
                      ว่าง {shelter.vacantSlots} ที่
                    </span>
                  </div>

                  {/* Route safety description */}
                  <div className="p-2.5 rounded-xl bg-[#141b2b] border border-[#232a3a] text-xs text-[#c2c6d6] flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px] flex-shrink-0">
                      verified
                    </span>
                    <span>{shelter.safeRouteDescription}</span>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {shelter.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#232a3a] text-[#dce2f7] text-[11px]"
                      >
                        <span
                          className={`material-symbols-outlined text-[14px] ${amenity.color}`}
                        >
                          {amenity.icon}
                        </span>
                        <span>{amenity.label}</span>
                      </span>
                    ))}
                  </div>

                  {/* Navigation link */}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-10 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow transition-all active:scale-98"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      directions
                    </span>
                    <span>นำทาง GPS ไปยังศูนย์พักพิง</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Offline Mesh Radio & Satellite SOS Telemetry Box */}
        <div className="bg-[#141b2b] border border-[#2e3545] rounded-2xl p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-400">
                cell_tower
              </span>
              <span className="font-bold text-xs text-white uppercase tracking-wider">
                โหมดส่งข้อมูลฉุกเฉินออฟไลน์ (MESH & SAT-SOS)
              </span>
            </div>
            <span className="text-xs text-emerald-400 font-semibold">พร้อมทำงาน</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#191f2f] border border-[#2e3545] p-2.5 rounded-xl flex flex-col">
              <span className="text-[#8c909f]">LORA P2P MESH</span>
              <span className="font-mono text-white font-bold mt-0.5">868 MHz / 14 โหนด</span>
            </div>
            <div className="bg-[#191f2f] border border-[#2e3545] p-2.5 rounded-xl flex flex-col">
              <span className="text-[#8c909f]">ดาวเทียมสำรอง</span>
              <span className="font-mono text-white font-bold mt-0.5">C-Band สัญญาณดี</span>
            </div>
          </div>

          <p className="text-[11px] text-[#8c909f] leading-relaxed">
            แม้สัญญาณอินเทอร์เน็ตมือถือดับ ข้อความ SOS และพิกัดจะถูกส่งต่อไปยังศูนย์บัญชาการผ่านโครงข่ายวิทยุข้างเคียงแบบอัตโนมัติ
          </p>
        </div>
      </div>

      {/* Citizen Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#191f2f] border border-blue-500/40 rounded-2xl w-full max-w-md p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#2e3545]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400 text-[22px]">
                  campaign
                </span>
                <h3 className="font-bold text-base text-white">รายงานเหตุด่วนในพื้นที่</h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="w-8 h-8 rounded-lg text-[#c2c6d6] hover:text-white flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block text-[#c2c6d6] font-semibold mb-1">
                  หัวข้อเหตุการณ์ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น น้ำท่วมขังรอการระบายสูง 40 ซม., เสาไฟล้มขวางทาง"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141b2b] border border-[#2e3545] text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#c2c6d6] font-semibold mb-1">
                    ประเภทภัยพิบัติ
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as DisasterType)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141b2b] border border-[#2e3545] text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="flood">🌊 น้ำท่วม / น้ำป่า</option>
                    <option value="earthquake">🔴 แผ่นดินไหว</option>
                    <option value="storm">🌪️ พายุ / ลมพัดแรง</option>
                    <option value="wildfire">🔥 ไฟป่า / ควันพิษ</option>
                    <option value="volcano">🌋 ภูเขาไฟ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#c2c6d6] font-semibold mb-1">
                    ระดับความรุนแรง
                  </label>
                  <select
                    value={reportSeverity}
                    onChange={(e) => setReportSeverity(e.target.value as SeverityLevel)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141b2b] border border-[#2e3545] text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="monitoring">🟡 เฝ้าระวัง</option>
                    <option value="high">🟠 รุนแรงปานกลาง</option>
                    <option value="critical">🔴 วิกฤตด่วน</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#c2c6d6] font-semibold mb-1">
                  สถานที่ / พิกัด
                </label>
                <input
                  type="text"
                  placeholder={`พิกัดปัจจุบัน: ${userCoords.cityName}`}
                  value={reportLocation}
                  onChange={(e) => setReportLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141b2b] border border-[#2e3545] text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[#c2c6d6] font-semibold mb-1">
                  รายละเอียดเพิ่มเติม
                </label>
                <textarea
                  rows={3}
                  placeholder="ระบุสภาพความเสียหาย เส้นทางที่ถูกตัดขาด หรือจำนวนผู้ติดค้าง..."
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141b2b] border border-[#2e3545] text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              {reportSuccess ? (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl text-center font-bold">
                  ✓ ส่งรายงานสำเร็จ! เพิ่มเข้าสู่ระบบเรดาร์เรียลไทม์แล้ว
                </div>
              ) : (
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#232a3a] text-[#c2c6d6] hover:bg-[#2e3545]"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md"
                  >
                    ส่งรายงานเหตุด่วน
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
