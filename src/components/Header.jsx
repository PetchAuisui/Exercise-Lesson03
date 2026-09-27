import React from 'react';
import { BookOpen, FileText, CheckCircle2, Lightbulb, LogOut, UserCheck } from 'lucide-react';

export default function Header({ 
  studentName, 
  studentId, 
  viewMode, 
  setViewMode, 
  onShowSolution,
  onLogout,
  passedCount,
  totalCount
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap xl:flex-nowrap items-center justify-between py-3 gap-3 sm:gap-4">
          
          {/* Left: Brand, Title, and Score */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs shrink-0">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="shrink-0">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight whitespace-nowrap">
                  ใบงานที่ 1 รูปภาพที่คลิกได้
                </h1>
                <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
                  Basic Website Design • Interactive Exercise
                </p>
              </div>
            </div>

            {/* Score Pill */}
            <div className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 border ${
              passedCount === totalCount 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>ความถูกต้อง: {passedCount}/{totalCount} ข้อ</span>
            </div>
          </div>

          {/* Center / Right: Student Info, Mode Toggles, Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap justify-end ml-auto shrink-0">
            
            {/* Student Info Display */}
            <div className="flex items-center bg-indigo-50/80 border border-indigo-200/90 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-indigo-950 font-medium shrink-0 whitespace-nowrap">
              <UserCheck className="w-4 h-4 text-indigo-600 mr-2 shrink-0" />
              <div className="flex items-center gap-2">
                <span className="font-bold font-mono bg-white px-2 py-0.5 rounded-md border border-indigo-100 text-indigo-700 shadow-2xs">
                  {studentId}
                </span>
                <span className="font-semibold text-slate-800">{studentName}</span>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl flex border border-slate-200 text-xs sm:text-sm font-medium shrink-0 whitespace-nowrap">
              <button
                onClick={() => setViewMode('interactive')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
                  viewMode === 'interactive' 
                    ? 'bg-white text-indigo-700 shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>💻 โหมดฝึกเขียนโค้ด</span>
              </button>
              <button
                onClick={() => setViewMode('paper')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
                  viewMode === 'paper' 
                    ? 'bg-white text-indigo-700 shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>📄 โหมดใบงาน</span>
              </button>
            </div>

            {/* Solution Button */}
            <button
              onClick={onShowSolution}
              title="ดูแนวทางและเฉลย"
              className="px-3 py-1.5 text-amber-700 bg-amber-50/50 hover:bg-amber-100/70 rounded-xl border border-amber-200 transition text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
              <span>เฉลย</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              title="ออกจากระบบ"
              className="px-3 py-1.5 text-rose-700 bg-rose-50/50 hover:bg-rose-100/70 rounded-xl border border-rose-200 transition text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
              <span>ออกจากระบบ</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
