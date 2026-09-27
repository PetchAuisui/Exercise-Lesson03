import React from 'react';
import { CheckCircle2, XCircle, Info, ChevronDown, ChevronUp, Folder, FolderOpen, FileCode, FileText, Image as ImageIcon } from 'lucide-react';

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
          {/* สถานการณ์ และ โครงสร้างไฟล์ Directory Tree */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* สถานการณ์และคำชี้แจง (7 cols) */}
            <div className="lg:col-span-7 bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-sm sm:text-base text-amber-950 leading-relaxed shadow-2xs flex flex-col justify-center">
              <div className="font-bold mb-1.5 flex items-center gap-1.5 text-base sm:text-lg text-amber-950">
                <span>📌 สถานการณ์:</span>
              </div>
              <p className="font-normal text-amber-900">
                คุณกำลังสร้างหน้าเว็บแนะนำสถานที่ท่องเที่ยว เขียน HTML ให้หน้าเว็บทำงานตามเงื่อนไขทั้ง 5 ข้อด้านล่าง
              </p>
              <p className="mt-2 text-amber-900/90 font-medium">
                <strong className="text-amber-950">คำชี้แจง:</strong> เลือกใช้แท็กและ Attribute ที่เหมาะสม แล้วเขียนโค้ดด้วยตนเอง โดยไม่เติมคำลงในโครงสร้างที่เตรียมไว้
              </p>
            </div>

            {/* โครงสร้างโฟลเดอร์แบบ Tree (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-200 font-mono text-xs sm:text-sm shadow-md flex flex-col justify-between">
              <div className="font-bold text-amber-400 font-thai text-sm sm:text-base flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-800">
                <FolderOpen className="w-4 h-4 text-amber-400" />
                <span>โครงสร้างไฟล์ (Project Directory Tree)</span>
              </div>
              
              {/* Directory Tree Structure */}
              <div className="space-y-1 font-mono leading-relaxed pl-1">
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
                  <span className="text-slate-500 font-thai text-[11px] sm:text-xs font-normal">(ไฟล์หน้าเว็บที่กำลังเขียน)</span>
                </div>

                {/* detail.html */}
                <div className="flex items-center gap-2 pl-4 text-slate-300">
                  <span className="text-slate-600">├──</span>
                  <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300">detail.html</span>
                  <span className="text-slate-500 font-thai text-[11px] sm:text-xs font-normal">(หน้ารายละเอียดเมื่อคลิก)</span>
                </div>

                {/* image folder */}
                <div className="pl-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-slate-600">└──</span>
                    <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-amber-300 font-semibold">image/</span>
                  </div>
                  {/* temple.jpg */}
                  <div className="flex items-center gap-2 pl-6 text-slate-300 mt-1">
                    <span className="text-slate-600">└──</span>
                    <ImageIcon className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    <span className="text-pink-300 font-semibold">temple.jpg</span>
                    <span className="text-amber-200 font-thai text-[11px] sm:text-xs font-medium">(วัดพระศรีรัตนศาสดาราม)</span>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] sm:text-xs text-slate-400 font-thai">
                💡 <strong>หมายเหตุ:</strong> รูปภาพวัดพระแก้วถูกเก็บไว้ในโฟลเดอร์ <code className="text-pink-300 bg-slate-800 px-1 py-0.5 rounded font-mono font-bold">image/temple.jpg</code>
              </div>
            </div>

          </div>

          {/* เงื่อนไข 5 ข้อ (ไม่มีการใบ้แท็กคำสั่ง) */}
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
