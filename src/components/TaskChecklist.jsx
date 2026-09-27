import React from 'react';
import { CheckCircle2, XCircle, Info, ChevronDown, ChevronUp, Folder, Image as ImageIcon } from 'lucide-react';

export default function TaskChecklist({ validation, isOpen, onToggle }) {
  const { criteria, passedCount, totalCount } = validation;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div 
        onClick={onToggle}
        className="px-5 py-4 bg-gradient-to-r from-slate-50 to-indigo-50/30 border-b border-slate-200 flex items-center justify-between cursor-pointer select-none"
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
        <div className="p-5 space-y-4">
          {/* สถานการณ์ และ ข้อมูลรูปภาพ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* สถานการณ์และคำชี้แจง */}
            <div className="md:col-span-2 bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-sm sm:text-base text-amber-950 leading-relaxed shadow-2xs flex flex-col justify-center">
              <div className="font-bold mb-1 flex items-center gap-1.5 text-base sm:text-lg text-amber-950">
                <span>📌 สถานการณ์:</span>
              </div>
              <p className="font-normal text-amber-900">
                คุณกำลังสร้างหน้าเว็บแนะนำสถานที่ท่องเที่ยว เขียน HTML ให้หน้าเว็บทำงานตามเงื่อนไขทั้ง 5 ข้อด้านล่าง
              </p>
              <p className="mt-1 text-amber-900/90 font-medium">
                <strong className="text-amber-950">คำชี้แจง:</strong> เลือกใช้แท็กและ Attribute ที่เหมาะสม แล้วเขียนโค้ดด้วยตนเอง โดยไม่เติมคำลงในโครงสร้างที่เตรียมไว้
              </p>
            </div>

            {/* ข้อมูลรูปภาพและไฟล์ที่กำหนดให้ */}
            <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 text-sm sm:text-base text-sky-950 leading-relaxed shadow-2xs flex flex-col justify-center">
              <div className="font-bold mb-1.5 flex items-center gap-2 text-sky-950">
                <ImageIcon className="w-5 h-5 text-sky-600" />
                <span>ข้อมูลรูปภาพและไฟล์</span>
              </div>
              <p className="text-sky-900 text-sm">
                🏛️ <strong>ชื่อวัด:</strong> วัดพระศรีรัตนศาสดาราม (วัดพระแก้ว)
              </p>
              <p className="text-sky-900 text-sm mt-1 flex items-center gap-1.5">
                <Folder className="w-4 h-4 text-sky-600" />
                <span><strong>ตำแหน่งไฟล์:</strong> อยู่ในโฟลเดอร์ <code className="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-mono font-bold">image/temple.jpg</code></span>
              </p>
            </div>
          </div>

          {/* เงื่อนไข 5 ข้อ (ไม่มีการใบ้แท็กคำสั่ง) */}
          <div className="space-y-2.5">
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
