import React from 'react';
import { BookOpen, FileText, CheckCircle2, RotateCcw, Lightbulb, Printer, LogOut, UserCheck } from 'lucide-react';

export default function Header({ 
  studentName, 
  setStudentName, 
  studentId, 
  setStudentId, 
  viewMode, 
  setViewMode, 
  onReset, 
  onShowSolution,
  onLogout,
  passedCount,
  totalCount
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-3">
          
          {/* Title & Badge */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-slate-900 leading-tight">
                  ใบงานที่ 1 รูปภาพที่คลิกได้
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Basic Website Design • Interactive Exercise
                </p>
              </div>
            </div>

            {/* Score pill */}
            <div className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-2xs ${
              passedCount === totalCount 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
              <span>ความถูกต้อง: {passedCount}/{totalCount} ข้อ</span>
            </div>
          </div>

          {/* Student Info Display */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center bg-indigo-50 border border-indigo-200 rounded-xl px-3.5 py-1.5 text-sm sm:text-base text-indigo-950 font-medium shadow-2xs">
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mr-2 shrink-0" />
              <div className="flex items-center gap-2">
                <span className="font-bold font-mono bg-white px-2 py-0.5 rounded-md border border-indigo-100 text-indigo-700">
                  {studentId}
                </span>
                <span className="font-semibold truncate max-w-[160px] sm:max-w-none">{studentName}</span>
              </div>
            </div>
          </div>

          {/* View Toggles & Actions */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <div className="bg-slate-100 p-0.5 rounded-lg flex border border-slate-200 text-xs sm:text-sm font-medium">
              <button
                onClick={() => setViewMode('interactive')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                  viewMode === 'interactive' 
                    ? 'bg-white text-indigo-700 shadow-sm font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>💻 โหมดฝึกเขียนโค้ด</span>
              </button>
              <button
                onClick={() => setViewMode('paper')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                  viewMode === 'paper' 
                    ? 'bg-white text-indigo-700 shadow-sm font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>📄 โหมดใบงาน</span>
              </button>
            </div>

            <button
              onClick={onShowSolution}
              title="ดูแนวทางและเฉลย"
              className="px-2.5 py-1.5 text-amber-700 hover:bg-amber-50 rounded-lg border border-amber-200 transition text-xs sm:text-sm font-medium flex items-center gap-1.5"
            >
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">เฉลย</span>
            </button>

            <button
              onClick={() => window.print()}
              title="พิมพ์ใบงาน (Print)"
              className="px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition text-xs sm:text-sm font-medium flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">พิมพ์</span>
            </button>

            <button
              onClick={onReset}
              title="รีเซ็ตโค้ดใหม่ (เริ่มต้นใหม่ตั้งแต่ต้น)"
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onLogout}
              title="ออกจากระบบ"
              className="px-2.5 py-1.5 text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition text-xs sm:text-sm font-medium flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
