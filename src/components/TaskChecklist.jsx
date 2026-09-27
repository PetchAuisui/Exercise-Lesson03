import React from 'react';
import { CheckCircle2, XCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function TaskChecklist({ validation, isOpen, onToggle }) {
  const { criteria, passedCount, totalCount } = validation;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div 
        onClick={onToggle}
        className="px-4 py-3 bg-gradient-to-r from-slate-50 to-indigo-50/30 border-b border-slate-200 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600" />
          <h2 className="font-semibold text-slate-800 text-sm">
            โจทย์และเงื่อนไขใบงาน (ผ่านแล้ว {passedCount}/{totalCount})
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                passedCount === totalCount ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${(passedCount / totalCount) * 100}%` }}
            />
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-3">
          {/* สถานการณ์ */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-900 leading-relaxed">
            <div className="font-bold mb-1 flex items-center gap-1.5 text-amber-950">
              <span>📌 สถานการณ์:</span>
            </div>
            <p>
              คุณกำลังสร้างหน้าเว็บแนะนำสถานที่ท่องเที่ยว เขียน HTML ให้หน้าเว็บทำงานตามเงื่อนไขทั้ง 5 ข้อด้านล่าง
            </p>
            <p className="mt-1 text-amber-800 italic">
              <strong>คำชี้แจง:</strong> เลือกใช้แท็กและ Attribute ที่เหมาะสม แล้วเขียนโค้ดด้วยตนเอง โดยไม่เติมคำลงในโครงสร้างที่เตรียมไว้
            </p>
          </div>

          {/* เงื่อนไข 5 ข้อ */}
          <div className="space-y-2">
            {criteria.map((item) => (
              <div 
                key={item.id}
                className={`p-2.5 rounded-lg border text-xs transition-all ${
                  item.passed 
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' 
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {item.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span className={`font-semibold ${item.passed ? 'text-emerald-900' : 'text-slate-800'}`}>
                        {item.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        item.passed 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {item.passed ? 'ผ่านแล้ว ✓' : 'ยังไม่สมบูรณ์'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.description}
                    </p>
                    {!item.passed && (
                      <p className="text-[11px] text-amber-600 mt-1 font-medium bg-amber-50 px-2 py-0.5 rounded inline-block">
                        💡 ข้อแนะนำ: {item.hint}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
