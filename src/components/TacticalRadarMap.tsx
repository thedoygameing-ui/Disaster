import React, { useState } from 'react';
import { DisasterIncident } from '../types/disaster';
import { sound } from '../utils/audio';

interface TacticalRadarMapProps {
  incidents: DisasterIncident[];
  selectedIncident: DisasterIncident | null;
  onSelectIncident: (inc: DisasterIncident) => void;
  userCoords: { lat: number; lng: number; cityName: string };
}

export const TacticalRadarMap: React.FC<TacticalRadarMapProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  userCoords,
}) => {
  const [activeLayer, setActiveLayer] = useState<'all' | 'satellite' | 'seismic'>('all');
  const [showRadius, setShowRadius] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleZoom = (delta: number) => {
    sound.playClick();
    setZoomLevel((prev) => Math.min(1.8, Math.max(0.8, prev + delta)));
  };

  const toggleLayer = () => {
    sound.playClick();
    setActiveLayer((prev) => (prev === 'all' ? 'seismic' : prev === 'seismic' ? 'satellite' : 'all'));
  };

  const toggleRadius = () => {
    sound.playClick();
    setShowRadius((prev) => !prev);
  };

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'earthquake':
        return 'earthquake';
      case 'flood':
      case 'tsunami':
        return 'flood';
      case 'volcano':
        return 'volcano';
      case 'storm':
        return 'cyclone';
      case 'wildfire':
        return 'local_fire_department';
      default:
        return 'crisis_alert';
    }
  };

  const getIncidentColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-600',
          ring: 'bg-red-500',
          text: 'text-red-400',
          border: 'border-red-500',
        };
      case 'high':
        return {
          bg: 'bg-amber-600',
          ring: 'bg-amber-500',
          text: 'text-amber-400',
          border: 'border-amber-500',
        };
      case 'monitoring':
      default:
        return {
          bg: 'bg-blue-600',
          ring: 'bg-blue-500',
          text: 'text-blue-400',
          border: 'border-blue-500',
        };
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-[#070e1d] border border-[#2e3545] overflow-hidden shadow-2xl">
      {/* Top Map Header Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#191f2f]/90 backdrop-blur-md border border-[#424754] pointer-events-auto">
          <span className="material-symbols-outlined text-[#adc6ff] text-[16px] animate-pulse">
            radar
          </span>
          <span className="font-mono text-[11px] font-semibold text-[#dce2f7] tracking-wider">
            RADAR 360° • SCAN ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-1 pointer-events-auto">
          <button
            onClick={toggleLayer}
            className={`h-8 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
              activeLayer !== 'all'
                ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                : 'bg-[#191f2f]/90 border-[#424754] text-[#c2c6d6] hover:bg-[#282933]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-[#adc6ff]">
              layers
            </span>
            <span>
              {activeLayer === 'all'
                ? 'ทุกชั้นข้อมูล'
                : activeLayer === 'seismic'
                ? 'รอยเลื่อน'
                : 'ดาวเทียม'}
            </span>
          </button>

          <button
            onClick={toggleRadius}
            className={`h-8 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
              showRadius
                ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                : 'bg-[#191f2f]/90 border-[#424754] text-[#c2c6d6] hover:bg-[#282933]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-amber-400">
              track_changes
            </span>
            <span>รัศมีผลกระทบ</span>
          </button>
        </div>
      </div>

      {/* Main Radar Screen Viewport */}
      <div
        className="relative w-full h-80 sm:h-96 bg-[#070e1d] overflow-hidden select-none transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: '50% 50%' }}
      >
        {/* Synthetic Radar Grid Vector Background */}
        <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient cx="50%" cy="50%" id="radarGlow" r="50%">
              <stop offset="0%" stopColor="#4d8eff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0c1322" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect fill="url(#radarGlow)" height="100%" width="100%" />

          {/* Concentric Range Rings */}
          <circle cx="50%" cy="50%" fill="none" r="50" stroke="#424754" strokeDasharray="3 4" strokeWidth="1" />
          <circle cx="50%" cy="50%" fill="none" r="100" stroke="#424754" strokeDasharray="4 5" strokeWidth="1" />
          <circle cx="50%" cy="50%" fill="none" r="150" stroke="#424754" strokeWidth="1" opacity="0.6" />
          <circle cx="50%" cy="50%" fill="none" r="200" stroke="#424754" strokeDasharray="2 6" strokeWidth="1" opacity="0.4" />

          {/* Crosshairs */}
          <line stroke="#424754" strokeDasharray="4 6" strokeWidth="1" x1="0" x2="100%" y1="50%" y2="50%" opacity="0.7" />
          <line stroke="#424754" strokeDasharray="4 6" strokeWidth="1" x1="50%" x2="50%" y1="0" y2="100%" opacity="0.7" />

          {/* Radar Sweep Line */}
          <g className="radar-sweep-line">
            <line stroke="#adc6ff" strokeWidth="1.5" x1="50%" x2="100%" y1="50%" y2="50%" opacity="0.8" />
            <path
              d="M 50% 50% L 100% 50% A 200 200 0 0 0 95% 30% Z"
              fill="rgba(77, 142, 255, 0.12)"
            />
          </g>
        </svg>

        {/* Synthetic Regional Landmass Silhouettes (Thailand, Southeast Asia, Ring of Fire) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
          <svg className="w-full h-full" viewBox="0 0 500 400">
            {/* Indochina & Thailand Mainland */}
            <path
              d="M170,90 Q210,80 240,110 T280,140 T310,120 T360,95 T420,130 T430,210 T370,250 T310,230 T250,290 T210,340 T190,300 T210,240 T190,190 T150,150 Z"
              fill="#2e3545"
            />
            {/* Malay Peninsula & Sumatra / Java Arch */}
            <path
              d="M210,270 Q230,310 250,340 T330,370 T440,360 T410,330 T320,310 T260,280 Z"
              fill="#232a3a"
            />
            {/* Pacific Rim / Philippines / Borneo */}
            <path
              d="M360,180 Q390,170 410,200 T440,260 T390,290 T350,230 Z"
              fill="#1f2638"
            />
            {/* Active Fault Lines (when activeLayer !== 'satellite') */}
            {activeLayer !== 'satellite' && (
              <path
                d="M160,80 Q200,140 230,220 T260,330 T360,360 T440,350"
                fill="none"
                stroke="#ffb59d"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.85"
              />
            )}
          </svg>
        </div>

        {/* User Current Position Beacon */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ top: '44%', left: '42%' }}
        >
          <span className="absolute -inset-3 rounded-full bg-blue-500/30 animate-ping"></span>
          <div className="relative w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_12px_rgba(77,142,255,0.9)] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          </div>
          <div className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-[#0c1322]/90 border border-blue-400 text-blue-300 text-[10px] font-mono">
            คุณอยู่ที่นี่ ({userCoords.cityName.split(' ')[0]})
          </div>
        </div>

        {/* Live Incident Map Pulse Pins */}
        {incidents.map((inc) => {
          const colors = getIncidentColor(inc.severity);
          const isSelected = selectedIncident?.id === inc.id;

          return (
            <div
              key={inc.id}
              onClick={() => {
                sound.playClick();
                onSelectIncident(inc);
              }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                top: `${inc.mapPinPos.y}%`,
                left: `${inc.mapPinPos.x}%`,
              }}
            >
              {/* Optional Impact Radius Ring */}
              {showRadius && (
                <div
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed pointer-events-none transition-all ${
                    inc.severity === 'critical'
                      ? 'border-red-500/50 bg-red-500/10'
                      : inc.severity === 'high'
                      ? 'border-amber-500/40 bg-amber-500/10'
                      : 'border-blue-500/30 bg-blue-500/5'
                  }`}
                  style={{
                    width: `${Math.min(180, inc.affectedRadiusKm / 2.2)}px`,
                    height: `${Math.min(180, inc.affectedRadiusKm / 2.2)}px`,
                    top: '50%',
                    left: '50%',
                  }}
                />
              )}

              {/* Pulsing Concentric Aura */}
              <span
                className={`absolute -inset-3 rounded-full ${colors.ring}/30 animate-ping`}
              ></span>
              <span
                className={`absolute -inset-6 rounded-full ${colors.ring}/15 animate-pulse`}
              ></span>

              {/* Icon Marker Core */}
              <div
                className={`relative w-8 h-8 rounded-full ${colors.bg} text-white flex items-center justify-center shadow-lg border-2 ${
                  isSelected ? 'border-white scale-125' : 'border-[#191f2f]'
                } transition-all duration-200 group-hover:scale-125`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {getIncidentIcon(inc.type)}
                </span>
              </div>

              {/* Label Tag on Map */}
              <div
                className={`absolute left-9 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-[#191f2f]/95 border ${colors.border} ${colors.text} text-[11px] font-mono shadow-md backdrop-blur-md transition-all group-hover:bg-[#282933]`}
              >
                {inc.title.length > 24 ? inc.title.slice(0, 22) + '...' : inc.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Map Mini Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-1 pointer-events-auto">
          <span className="px-2 py-0.5 rounded bg-[#191f2f]/90 border border-[#424754] text-[#c2c6d6] font-mono text-[10px]">
            FILTER: M5.0+ / TH-REGION
          </span>
          <span className="px-2 py-0.5 rounded bg-[#191f2f]/90 border border-[#424754] text-[#c2c6d6] font-mono text-[10px]">
            ZOOM: {(zoomLevel * 100).toFixed(0)}%
          </span>
        </div>

        <div className="flex items-center gap-1 pointer-events-auto">
          <button
            onClick={() => handleZoom(0.2)}
            title="ขยาย"
            className="w-8 h-8 rounded-lg bg-[#191f2f]/90 hover:bg-[#2e3545] border border-[#424754] text-[#dce2f7] flex items-center justify-center transition-colors shadow"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
          <button
            onClick={() => handleZoom(-0.2)}
            title="ย่อ"
            className="w-8 h-8 rounded-lg bg-[#191f2f]/90 hover:bg-[#2e3545] border border-[#424754] text-[#dce2f7] flex items-center justify-center transition-colors shadow"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};
