import React, { useState } from 'react';
import { PREPAREDNESS_CATEGORIES } from '../data/preparednessData';
import { SURVIVAL_KIT_ITEMS } from '../data/disasterData';
import { SurvivalKitItem } from '../types/disaster';
import { sound } from '../utils/audio';

export const PreparednessView: React.FC = () => {
  const [selectedCatId, setSelectedCatId] = useState<string>('flood');
  const [activePhase, setActivePhase] = useState<'pre' | 'during' | 'post'>('pre');
  const [survivalKit, setSurvivalKit] = useState<SurvivalKitItem[]>(SURVIVAL_KIT_ITEMS);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const currentCategory =
    PREPAREDNESS_CATEGORIES.find((c) => c.id === selectedCatId) ||
    PREPAREDNESS_CATEGORIES[0];

  // Calculate readiness percent from survival kit
  const checkedCount = survivalKit.filter((item) => item.checked).length;
  const readinessPercent = Math.round((checkedCount / survivalKit.length) * 100);

  const toggleKitItem = (id: string) => {
    sound.playClick();
    setSurvivalKit((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleDownload = () => {
    sound.playClick();
    if (isDownloaded) {
      setIsDownloaded(false);
      return;
    }
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setIsDownloaded(true);
      sound.playSuccess();
      try {
        localStorage.setItem('aegis_manual_offline_ready', 'true');
      } catch {
        // ignore storage quota
      }
    }, 900);
  };

  const handleQuizChoice = (index: number) => {
    sound.playClick();
    setQuizAnswer(index);
    if (index === 1) {
      sound.playSuccess();
    }
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 py-4 pb-28 gap-4 max-w-4xl mx-auto">
      {/* Interactive Telemetry & Status HUD Header */}
      <div className="bg-[#141b2b] rounded-2xl p-4 sm:p-5 border border-[#2e3545] shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="font-mono text-[11px] uppercase text-blue-300 font-bold tracking-widest">
              TACTICAL PROTOCOL · V4.2
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#8c909f]">LOC: REGION-TH-13</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Radial Readiness Gauge */}
          <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                fill="none"
                r="22"
                stroke="#232a3a"
                strokeDasharray="2 3"
                strokeWidth="4"
              />
              <circle cx="28" cy="28" fill="none" r="17" stroke="#191f2f" strokeWidth="3" />
              <circle
                cx="28"
                cy="28"
                fill="none"
                r="17"
                stroke="#adc6ff"
                strokeDasharray="106.8"
                strokeDashoffset={106.8 - 106.8 * (readinessPercent / 100)}
                strokeLinecap="round"
                strokeWidth="3.5"
                className="transition-all duration-700 ease-out"
              />
              <circle cx="28" cy="28" fill="#ffb4ab" r="5" />
            </svg>
            <span className="absolute font-mono font-bold text-xs text-white">
              {readinessPercent}%
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <h2 className="font-bold text-base sm:text-lg text-white truncate">
              ระดับความพร้อมส่วนบุคคล
            </h2>
            <p className="text-xs text-[#c2c6d6] truncate">
              กระเป๋า 72 ชม. และแผนการอพยพพร้อมระดับมาตรฐาน ({checkedCount}/{survivalKit.length} รายการ)
            </p>
          </div>
        </div>
      </div>

      {/* Offline Manual Download Action Card */}
      <div className="bg-[#191f2f] border border-[#2e3545] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-400">
            <span className="material-symbols-outlined text-[24px]">cloud_download</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs sm:text-sm text-white truncate">
              ดาวน์โหลดคู่มือฉบับออฟไลน์
            </span>
            <span className="text-[11px] text-[#8c909f]">
              เปิดอ่านได้แม้อินเทอร์เน็ตล่มหรือตัดไฟ · 18.4 MB
            </span>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`flex-shrink-0 h-10 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
            isDownloaded
              ? 'bg-[#232a3a] text-emerald-400 border border-emerald-500/40'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isDownloading
              ? 'progress_activity'
              : isDownloaded
              ? 'check_circle'
              : 'download'}
          </span>
          <span>
            {isDownloading
              ? 'กำลังบันทึก...'
              : isDownloaded
              ? 'พร้อมใช้ (ออฟไลน์)'
              : 'บันทึก'}
          </span>
        </button>
      </div>

      {/* Category Selector Horizontal Carousel */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-[#8c909f] font-semibold">
            ประเภทวิกฤตภัยพิบัติ
          </span>
          <span className="font-mono text-xs text-amber-400">5 โหมดพร้อมใช้</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
          {PREPAREDNESS_CATEGORIES.map((cat) => {
            const isSelected = cat.id === selectedCatId;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedCatId(cat.id);
                }}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-[#191f2f] text-[#c2c6d6] hover:bg-[#232a3a] border border-[#2e3545]'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Situation Scene Preview Card */}
      <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden shadow-lg border border-[#2e3545] bg-[#070e1d]">
        <img
          src={currentCategory.bgImage}
          alt={currentCategory.imageAlt}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-[#0c1322]/60 to-transparent"></div>

        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#191f2f]/90 mb-1 border border-amber-500/30 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="font-mono text-[10px] text-amber-300 font-bold">
                {currentCategory.badge}
              </span>
            </div>
            <span className="font-bold text-base sm:text-lg text-white">
              {currentCategory.title}
            </span>
          </div>
          <span className="material-symbols-outlined text-blue-400 text-[28px] opacity-80">
            shield
          </span>
        </div>
      </div>

      {/* 3-Phase Action Protocol Tabs */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm sm:text-base text-white">
            ขั้นตอนปฏิบัติ 3 ระยะ
          </span>
          <span className="font-mono text-xs text-blue-400 font-semibold">
            PRIORITY TIER
          </span>
        </div>

        {/* Phase Segmented Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#141b2b] rounded-xl border border-[#2e3545] shadow-inner">
          <button
            onClick={() => {
              sound.playClick();
              setActivePhase('pre');
            }}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              activePhase === 'pre'
                ? 'bg-blue-600 text-white shadow'
                : 'text-[#8c909f] hover:text-[#dce2f7]'
            }`}
          >
            ก่อนเกิดเหตุ
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActivePhase('during');
            }}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              activePhase === 'during'
                ? 'bg-blue-600 text-white shadow'
                : 'text-[#8c909f] hover:text-[#dce2f7]'
            }`}
          >
            ขณะเกิดเหตุ
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActivePhase('post');
            }}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              activePhase === 'post'
                ? 'bg-blue-600 text-white shadow'
                : 'text-[#8c909f] hover:text-[#dce2f7]'
            }`}
          >
            หลังเกิดเหตุ
          </button>
        </div>

        {/* Phase Step List */}
        <div className="flex flex-col gap-2.5 mt-1">
          {currentCategory.phases[activePhase].map((step, idx) => (
            <div
              key={idx}
              className="bg-[#191f2f] rounded-xl p-3.5 flex items-start gap-3 border border-[#2e3545] shadow-sm"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  step.highlight === 'urgent'
                    ? 'bg-red-950/80 text-red-400 border border-red-500/40'
                    : 'bg-[#232a3a] text-blue-400 border border-blue-500/20'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-white">
                    {step.title}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-bold ${
                      step.highlight === 'urgent' ? 'text-red-400' : 'text-[#8c909f]'
                    }`}
                  >
                    {step.step}
                  </span>
                </div>
                <p className="text-xs text-[#c2c6d6] mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive 72-Hour Survival Kit Checklist */}
      <div className="bg-[#141b2b] rounded-2xl p-4 sm:p-5 border border-[#2e3545] shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400 text-[22px]">
              medical_services
            </span>
            <h3 className="font-bold text-sm sm:text-base text-white">
              กระเป๋ายังชีพ 72 ชม.
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-[#191f2f] border border-[#2e3545] px-2.5 py-0.5 rounded-full">
            <span className="font-mono text-xs text-blue-300 font-bold">{checkedCount}</span>
            <span className="font-mono text-xs text-[#8c909f]">
              / {survivalKit.length} รายการ
            </span>
          </div>
        </div>

        {/* Progress Meter */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="text-[#8c909f]">ความพร้อมกระเป๋าฉุกเฉิน</span>
            <span className="text-blue-300 font-mono font-bold">{readinessPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#191f2f] overflow-hidden border border-[#2e3545]">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
        </div>

        {/* Checklist Items */}
        <div className="flex flex-col gap-1.5 mt-1">
          {survivalKit.map((item) => (
            <label
              key={item.id}
              onClick={() => toggleKitItem(item.id)}
              className="flex items-center justify-between p-3 rounded-xl bg-[#191f2f] border border-[#2e3545] cursor-pointer hover:bg-[#232a3a] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => {}} // handled by wrapper
                  className="w-5 h-5 rounded accent-blue-600 bg-[#232a3a] cursor-pointer flex-shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span
                    className={`font-semibold text-xs sm:text-sm truncate ${
                      item.checked ? 'text-white' : 'text-[#c2c6d6]'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="text-[11px] text-[#8c909f] truncate">{item.detail}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#8c909f] text-[20px] flex-shrink-0 ml-2">
                {item.icon}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Interactive Quick Survival Drill Simulator Card */}
      <div className="bg-[#191f2f] rounded-2xl p-4 sm:p-5 border border-[#2e3545] shadow-md flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-amber-400 text-[20px]">
              sports_score
            </span>
            <span className="font-bold text-xs sm:text-sm text-white">
              แบบฝึกทักษะการตัดสินใจฉับไว (30 วินาที)
            </span>
          </div>
          <span className="font-mono text-xs text-amber-300 font-semibold">DRILL READY</span>
        </div>

        <div className="bg-[#141b2b] p-3.5 rounded-xl border border-[#232a3a] flex flex-col gap-2">
          <span className="font-bold text-xs sm:text-sm text-white">
            สถานการณ์จำลอง: กำลังขับรถแล้วเกิดแผ่นดินไหวรุนแรง ควรทำสิ่งใดก่อน?
          </span>

          <div className="grid grid-cols-1 gap-2 pt-1">
            <button
              onClick={() => handleQuizChoice(0)}
              className={`text-left p-3 rounded-xl text-xs font-medium transition-all ${
                quizAnswer === 0
                  ? 'bg-red-950/80 border border-red-500 text-red-200'
                  : 'bg-[#232a3a] text-[#c2c6d6] hover:bg-[#282933]'
              }`}
            >
              ก. เร่งเครื่องผ่านสะพานลอยหรืออุโมงค์โดยเร็ว
            </button>
            <button
              onClick={() => handleQuizChoice(1)}
              className={`text-left p-3 rounded-xl text-xs font-medium transition-all ${
                quizAnswer === 1
                  ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-200'
                  : 'bg-[#232a3a] text-[#c2c6d6] hover:bg-[#282933]'
              }`}
            >
              ข. ชะลอความเร็ว จอดข้างทางห่างเสาไฟ ดับเครื่อง คาเบรกมือ
            </button>
            <button
              onClick={() => handleQuizChoice(2)}
              className={`text-left p-3 rounded-xl text-xs font-medium transition-all ${
                quizAnswer === 2
                  ? 'bg-red-950/80 border border-red-500 text-red-200'
                  : 'bg-[#232a3a] text-[#c2c6d6] hover:bg-[#282933]'
              }`}
            >
              ค. รีบเปิดประตูรถแล้ววิ่งหนีขึ้นที่สูงทันที
            </button>
          </div>

          {quizAnswer !== null && (
            <div className="pt-2 border-t border-[#2e3545]">
              {quizAnswer === 1 ? (
                <div className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>ถูกหลักความปลอดภัย: ชะลอความเร็ว ดับเครื่อง หลีกเลี่ยงเสาไฟและป้ายล้มทับ</span>
                </div>
              ) : (
                <div className="text-red-400 text-xs font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                  <span>คำตอบยังไม่ปลอดภัย: ข้อ ข. คือหลักสากลที่แนะนำ ไม่ควรวิ่งออกนอกรถขณะมีแรงสั่น</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Regional Hotline Fast-Access Strip */}
      <div className="bg-[#141b2b] rounded-2xl p-4 border border-[#2e3545] shadow-inner flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[22px]">phone_in_talk</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs sm:text-sm text-white truncate">
              สายด่วน ปภ. (กรมป้องกันและบรรเทาสาธารณภัย)
            </span>
            <span className="font-mono text-xs text-red-400 font-bold">
              HOTLINE 1784 · ตลอด 24 ชม.
            </span>
          </div>
        </div>

        <a
          href="tel:1784"
          className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-transform flex-shrink-0"
        >
          <span>โทรออก</span>
          <span className="material-symbols-outlined text-[16px]">call</span>
        </a>
      </div>
    </div>
  );
};
