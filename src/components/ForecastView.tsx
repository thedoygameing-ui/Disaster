import React, { useState } from 'react';
import { FORECAST_7_DAYS, HAZARD_MATRIX_ITEMS, ACTION_PLANS } from '../data/disasterData';
import { DayForecast } from '../types/disaster';
import { sound } from '../utils/audio';

interface ForecastViewProps {
  onNavigateToTab: (tab: string) => void;
}

export const ForecastView: React.FC<ForecastViewProps> = ({ onNavigateToTab }) => {
  const [selectedHorizon, setSelectedHorizon] = useState<'24h' | '7d' | '30d'>('24h');
  const [selectedDay, setSelectedDay] = useState<DayForecast>(FORECAST_7_DAYS[4]); // Default to Friday (Peak 92)
  const [shareSuccess, setShareSuccess] = useState(false);

  // Dynamic risk score depending on horizon
  const horizonRisk = {
    '24h': { score: 78, label: 'เฝ้าระวังพิเศษ', rain: '+180% (วิกฤต)', seismic: '+24% (สูง)', press: '988 hPa' },
    '7d': { score: 92, label: 'วิกฤตสูงสุดช่วงสุดสัปดาห์', rain: '+240% (สูงสุด)', seismic: '+32% (เฝ้าระวัง)', press: '982 hPa' },
    '30d': { score: 65, label: 'ฤดูมรสุมชุกชุม', rain: '+120% (สูง)', seismic: '+18% (ปกติ)', press: '996 hPa' },
  }[selectedHorizon];

  const handleSharePlan = () => {
    sound.playSuccess();
    if (navigator.share) {
      navigator.share({
        title: 'แผนปฏิบัติการเผชิญเหตุภัยพิบัติล่วงหน้า (Aegis Forecast)',
        text: `ดัชนีความเสี่ยงรวม ${horizonRisk.score}/100 MAX แนะนำเตรียมพร้อม 72 ชม.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 py-4 pb-28 gap-4 max-w-4xl mx-auto">
      {/* AI Model Badge & Time Horizon Selector */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#c2c6d6] text-xs font-semibold">
            <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">
              neurology
            </span>
            <span>AI FORECAST ENGINE V4.8</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#191f2f] border border-amber-500/30 text-amber-300 font-mono text-[11px] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span>ความแม่นยำโมเดล 94.2%</span>
          </div>
        </div>

        {/* Horizon Tabs */}
        <div className="grid grid-cols-3 p-1 rounded-xl bg-[#141b2b] border border-[#2e3545] gap-1">
          <button
            onClick={() => {
              sound.playClick();
              setSelectedHorizon('24h');
            }}
            className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
              selectedHorizon === '24h'
                ? 'bg-[#232a3a] text-[#adc6ff] shadow border border-blue-500/30'
                : 'text-[#8c909f] hover:text-[#dce2f7]'
            }`}
          >
            24 ชม. ข้างหน้า
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setSelectedHorizon('7d');
            }}
            className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
              selectedHorizon === '7d'
                ? 'bg-[#232a3a] text-[#adc6ff] shadow border border-blue-500/30'
                : 'text-[#8c909f] hover:text-[#dce2f7]'
            }`}
          >
            3 - 7 วัน
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setSelectedHorizon('30d');
            }}
            className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
              selectedHorizon === '30d'
                ? 'bg-[#232a3a] text-[#adc6ff] shadow border border-blue-500/30'
                : 'text-[#8c909f] hover:text-[#dce2f7]'
            }`}
          >
            รายเดือน (30 วัน)
          </button>
        </div>
      </div>

      {/* Regional Risk Index Gauge Card */}
      <div className="flex flex-col rounded-2xl bg-[#191f2f] border border-[#2e3545] p-5 relative overflow-hidden shadow-xl">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-red-600/15 blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-2 z-10">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-red-400 text-[22px]">
              warning
            </span>
            <span className="font-bold text-base sm:text-lg text-[#dce2f7]">
              ดัชนีความเสี่ยงรวม
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-md bg-red-950/80 border border-red-500/50 text-red-300 font-mono text-xs font-bold tracking-wider uppercase animate-pulse">
            {horizonRisk.label}
          </span>
        </div>

        {/* Radial Concentric Telemetry Centerpiece */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-2 z-10">
          <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                fill="none"
                r="68"
                stroke="#2e3545"
                strokeDasharray="6 4"
                strokeWidth="8"
                opacity="0.5"
              />
              {/* Intermediate Track */}
              <circle
                cx="80"
                cy="80"
                fill="none"
                r="54"
                stroke="#2e3545"
                strokeWidth="3"
                opacity="0.6"
              />
              {/* Warning Arc */}
              <circle
                cx="80"
                cy="80"
                fill="none"
                r="54"
                stroke="#ffb95f"
                strokeDasharray="339"
                strokeDashoffset={339 - (339 * 0.65)}
                strokeLinecap="round"
                strokeWidth="5"
              />
              {/* Critical Outer Arc based on score */}
              <circle
                cx="80"
                cy="80"
                fill="none"
                r="68"
                stroke={horizonRisk.score >= 80 ? '#ffb4ab' : '#ffb95f'}
                strokeDasharray="427"
                strokeDashoffset={427 - (427 * (horizonRisk.score / 100))}
                strokeLinecap="round"
                strokeWidth="8"
              />
              {/* Central Pulse Core */}
              <circle
                cx="80"
                cy="80"
                fill="#a40217"
                r="24"
                opacity="0.85"
                className="animate-pulse"
              />
            </svg>

            {/* Center Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-extrabold text-3xl sm:text-4xl text-white tracking-tighter">
                {horizonRisk.score}
              </span>
              <span className="text-[10px] font-mono font-bold text-[#c2c6d6] uppercase tracking-wider">
                / 100 MAX
              </span>
            </div>
          </div>

          {/* Contributing Factor Breakdown */}
          <div className="flex flex-col w-full gap-2">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141b2b] border border-[#232a3a]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-red-400 text-[18px]">
                  rainy
                </span>
                <span className="text-xs text-[#dce2f7]">ปริมาณน้ำฝนสะสม</span>
              </div>
              <span className="font-mono text-xs font-bold text-red-400">
                {horizonRisk.rain}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141b2b] border border-[#232a3a]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-amber-400 text-[18px]">
                  earthquake
                </span>
                <span className="text-xs text-[#dce2f7]">การเคลื่อนเปลือกโลก</span>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400">
                {horizonRisk.seismic}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141b2b] border border-[#232a3a]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-blue-400 text-[18px]">
                  air
                </span>
                <span className="text-xs text-[#dce2f7]">ความกดอากาศต่ำรุนแรง</span>
              </div>
              <span className="font-mono text-xs font-bold text-[#adc6ff]">
                {horizonRisk.press}
              </span>
            </div>
          </div>
        </div>

        {/* Alert Status Note */}
        <div className="mt-2 pt-2 border-t border-[#2e3545] text-xs text-[#c2c6d6] leading-relaxed">
          โมเดลคาดการณ์สภาพภูมิอากาศประเมินว่า{' '}
          <strong className="text-red-300 font-semibold">ลุ่มน้ำภาคกลางและอีสาน</strong>{' '}
          มีอัตราเสี่ยงสูงสุดในรอบ 14 วัน จากอิทธิพลมรสุมร่องความกดอากาศต่ำกำลังแรง
        </div>
      </div>

      {/* 7-Day Early Warning Trajectory Graph / Visual Timeline */}
      <div className="flex flex-col rounded-2xl bg-[#191f2f] border border-[#2e3545] p-5 gap-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
              stacked_bar_chart
            </span>
            <h3 className="font-bold text-sm sm:text-base text-[#dce2f7]">
              วิเคราะห์แนวโน้ม 7 วันข้างหน้า
            </h3>
          </div>
          <span className="font-mono text-xs text-red-300 font-bold">PEAK: ศุกร์ - เสาร์</span>
        </div>

        {/* Trajectory Bar Chart */}
        <div className="grid grid-cols-7 items-end gap-1.5 h-36 pt-4 pb-2 px-2 bg-[#141b2b] rounded-xl border border-[#232a3a]">
          {FORECAST_7_DAYS.map((day) => {
            const isSelected = selectedDay.dayName === day.dayName;
            const isPeak = day.isPeak;

            return (
              <div
                key={day.dayName}
                onClick={() => {
                  sound.playClick();
                  setSelectedDay(day);
                }}
                className={`flex flex-col items-center gap-1 h-full justify-end group cursor-pointer p-1 rounded-lg transition-all ${
                  isSelected ? 'bg-[#232a3a]/80 ring-1 ring-blue-400' : 'hover:bg-[#191f2f]'
                }`}
              >
                <span
                  className={`font-mono text-[10px] ${
                    isPeak ? 'text-red-400 font-bold' : 'text-[#8c909f]'
                  }`}
                >
                  {day.score}
                </span>

                <div
                  className={`w-full rounded-t transition-all ${
                    isPeak
                      ? 'bg-gradient-to-t from-red-600 to-red-400 shadow-[0_0_10px_rgba(255,100,100,0.5)] animate-pulse'
                      : day.score >= 65
                      ? 'bg-amber-500/80 group-hover:bg-amber-400'
                      : 'bg-blue-500/60 group-hover:bg-blue-400'
                  }`}
                  style={{ height: `${day.score}%` }}
                />

                <span
                  className={`text-[11px] font-bold ${
                    isPeak
                      ? 'text-red-300'
                      : isSelected
                      ? 'text-white font-bold'
                      : 'text-[#8c909f]'
                  }`}
                >
                  {day.dayShort}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Day Tip Banner */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#232a3a] border border-[#2e3545] text-xs leading-relaxed text-[#dce2f7]">
          <span className="material-symbols-outlined text-amber-400 text-[20px] flex-shrink-0">
            calendar_clock
          </span>
          <div>
            วัน{selectedDay.dayName}: ดัชนีความเสี่ยง{' '}
            <strong
              className={
                selectedDay.score >= 80
                  ? 'text-red-400 font-bold'
                  : selectedDay.score >= 65
                  ? 'text-amber-400 font-bold'
                  : 'text-blue-400 font-bold'
              }
            >
              {selectedDay.score}/100
            </strong>{' '}
            — {selectedDay.desc}
          </div>
        </div>
      </div>

      {/* Probability Matrix & Trend Cards Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
            crisis_alert
          </span>
          <h3 className="font-bold text-sm sm:text-base text-[#dce2f7]">
            การแจ้งเตือนตามเมทริกซ์ความเสี่ยง
          </h3>
        </div>
        <span className="font-mono text-xs text-[#8c909f]">3 ภัยพิบัติสำคัญ</span>
      </div>

      {/* Hazard Cards Stack */}
      <div className="flex flex-col gap-3">
        {HAZARD_MATRIX_ITEMS.map((item) => {
          return (
            <div
              key={item.id}
              className="relative flex flex-col rounded-2xl bg-[#191f2f] border border-[#2e3545] overflow-hidden shadow-lg p-4 sm:p-5 gap-3"
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1.5"
                style={{ backgroundColor: item.severityColor }}
              />

              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: item.severityColor }}
                    />
                    <span
                      className="text-xs font-bold font-mono uppercase tracking-wider"
                      style={{ color: item.severityColor }}
                    >
                      {item.tag}
                    </span>
                    <span className="font-mono text-xs text-[#8c909f]">• {item.timeframe}</span>
                  </div>
                  <h4 className="font-bold text-base text-white">{item.title}</h4>
                </div>

                <div className="flex flex-col items-end flex-shrink-0">
                  <span
                    className="font-extrabold text-xl sm:text-2xl leading-none"
                    style={{ color: item.severityColor }}
                  >
                    {item.probability}%
                  </span>
                  <span className="text-[10px] text-[#8c909f]">{item.probLabel}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#c2c6d6]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#8c909f]">
                    location_on
                  </span>
                  <span>
                    พื้นที่เสี่ยง: <strong className="text-white">{item.affectedArea}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#8c909f]">
                    speed
                  </span>
                  <span>
                    เกณฑ์คาดการณ์:{' '}
                    <strong className="text-white">{item.forecastMetric}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141b2b] border border-[#232a3a] gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="material-symbols-outlined text-[18px] flex-shrink-0"
                    style={{ color: item.severityColor }}
                  >
                    eject
                  </span>
                  <span className="text-xs text-[#dce2f7] truncate">
                    คำแนะนำด่วน: {item.urgentTip}
                  </span>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateToTab('live-monitor');
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-bold text-white flex-shrink-0 hover:brightness-110 transition-all shadow"
                  style={{ backgroundColor: item.severityColor }}
                >
                  {item.actionButtonLabel}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Early Warning Action Recommendation Box */}
      <div className="flex flex-col rounded-2xl bg-[#191f2f] border border-[#2e3545] p-5 gap-3 shadow-xl mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#adc6ff] text-[22px]">
              checklist_rtl
            </span>
            <h3 className="font-bold text-sm sm:text-base text-white">
              แผนปฏิบัติการเชิงป้องกันล่วงหน้า
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
            3 แผนแนะนำ
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {ACTION_PLANS.map((plan) => (
            <div
              key={plan.step}
              className="flex items-start gap-3 p-3 rounded-xl bg-[#141b2b] border border-[#232a3a]"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5 ${plan.colorClass}`}
              >
                {plan.step}
              </div>
              <div className="flex flex-col min-w-0">
                <h5 className="font-bold text-xs sm:text-sm text-white">{plan.title}</h5>
                <p className="text-xs text-[#c2c6d6] mt-0.5 leading-relaxed">
                  {plan.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action Broadcast Sync Button */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2e3545]">
          <span className="font-mono text-xs text-[#8c909f]">
            อัปเดตข้อมูลอัตโนมัติทุก 15 นาที
          </span>
          <button
            onClick={handleSharePlan}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-500 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">share_location</span>
            <span>{shareSuccess ? 'คัดลอกแผนแล้ว!' : 'แชร์แผนเผชิญเหตุ'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
