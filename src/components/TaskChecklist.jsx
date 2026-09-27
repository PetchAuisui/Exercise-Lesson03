import React from 'react';
import { CheckCircle2, XCircle, Info, ChevronDown, ChevronUp, Folder, FolderOpen, FileCode, FileText, Image as ImageIcon, FileCheck } from 'lucide-react';

export default function TaskChecklist({ validation, isOpen, onToggle }) {
  const { criteria, passedCount, totalCount } = validation;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div 
        onClick={onToggle}
        className="px-5 py-3.5 bg-gradient-to-r from-slate-50 to-indigo-50/30 border-b border-slate-200 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-indigo-600 shrink-0" />
          <h2 className="font-bold text-slate-800 text-base sm:text-lg">
            โจทย์และเงื่อนไขใบงาน (ผ่านแล้ว {passedCount}/{totalCount})
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 sm:w-36 bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                passedCount === totalCount ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${(passedCount / totalCount) * 100}%` }}
            />
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* จัดวางแบบ "บน - ล่าง" สำหรับ สถานการณ์ (บน) และ คำชี้แจง (ล่าง) เคียงข้างโครงสร้างไฟล์ */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-stretch">
            
            {/* คอลัมน์ซ้าย: จัดเรียง สถานการณ์ (บน) และ คำชี้แจง (ล่าง) */}
            <div className="md:col-span-7 flex flex-col gap-3 justify-between">
              
              {/* กล่องบน: สถานการณ์ */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 sm:p-4 text-amber-950 shadow-2xs flex-1 flex flex-col justify-center">
                <div className="font-bold mb-1 flex items-center gap-2 text-sm sm:text-base lg:text-lg text-amber-950">
                  <span>📌 สถานการณ์</span>
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-amber-900 leading-relaxed font-normal">
                  คุณกำลังสร้างหน้าเว็บแนะนำสถานที่ท่องเที่ยว เขียน HTML ให้หน้าเว็บทำงานตามเงื่อนไขทั้ง 5 ข้อด้านล่าง
                </p>
              </div>

              {/* กล่องล่าง: คำชี้แจง */}
              <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-3.5 sm:p-4 text-sky-950 shadow-2xs flex-1 flex flex-col justify-center">
                <div className="font-bold mb-1 flex items-center gap-2 text-sm sm:text-base lg:text-lg text-sky-950">
                  <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600 shrink-0" />
                  <span>คำชี้แจง</span>
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-sky-900 leading-relaxed font-normal">
                  เลือกใช้แท็กและ Attribute ที่เหมาะสม แล้วเขียนโค้ดด้วยตนเอง โดยไม่เติมคำลงในโครงสร้างที่เตรียมไว้
                </p>
              </div>

            </div>

            {/* คอลัมน์ขวา: โครงสร้างโฟลเดอร์แบบ Tree */}
            <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4 text-slate-200 font-mono text-xs sm:text-sm shadow-md flex flex-col justify-between">
              <div>
                <div className="font-bold text-amber-400 font-thai text-sm sm:text-base flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-800">
                  <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>โครงสร้างไฟล์ (Project Directory Tree)</span>
                </div>
                
                {/* Directory Tree Structure */}
                <div className="space-y-1.5 font-mono leading-tight pl-1 text-xs sm:text-sm">
                  {/* Root */}
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>project/</span>
                  </div>

                  {/* index.html */}
                  <div className="flex items-center gap-2 pl-4 text-slate-300">
                    <span className="text-slate-600">├──</span>
                    <FileCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="text-sky-300 font-semibold">index.html</span>
                  </div>

                  {/* detail.html */}
                  <div className="flex items-center gap-2 pl-4 text-slate-300">
                    <span className="text-slate-600">├──</span>
                    <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-emerald-300">detail.html</span>
                  </div>

                  {/* image folder */}
                  <div className="pl-4 flex items-center gap-2 text-slate-300">
                    <span className="text-slate-600">└──</span>
                    <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-amber-300 font-semibold">image/</span>
                    <span className="text-slate-500">└──</span>
                    <ImageIcon className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    <span className="text-pink-300 font-semibold">temple.jpg</span>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] sm:text-xs text-slate-400 font-thai">
                💡 ไฟล์รูปภาพอยู่ที่ <code className="text-pink-300 bg-slate-800 px-1 py-0.5 rounded font-mono font-bold">image/temple.jpg</code>
              </div>
            </div>

          </div>

          {/* เงื่อนไข 5 ข้อ */}
          <div className="space-y-2.5 pt-1">
            {criteria.map((item) => (
              <div 
                key={item.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  item.passed 
                    ? 'bg-emerald-50/60 border-emerald-300 text-slate-900 shadow-2xs' 
                    : 'bg-slate-50 border-slate-200/90 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {item.passed ? (
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 shrink-0" />
                    )}
                    <span className={`text-base sm:text-lg font-bold ${item.passed ? 'text-emerald-950' : 'text-slate-900'}`}>
                      {item.title}
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold tracking-wide shrink-0 ${
                    item.passed 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.passed ? 'ผ่านแล้ว ✓' : 'ยังไม่สมบูรณ์'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
