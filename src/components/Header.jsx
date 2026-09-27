import React from 'react';
import { BookOpen, FileText, CheckCircle2, RotateCcw, Lightbulb, Printer } from 'lucide-react';

export default function Header({ 
  studentName, 
  setStudentName, 
  studentId, 
  setStudentId, 
  viewMode, 
  setViewMode, 
  onReset, 
  onShowSolution,
  passedCount,
  totalCount
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-3">
          
          {/* Title & Badge */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 leading-tight">
                  ใบงานที่ 1 รูปภาพที่คลิกได้
                </h1>
                <p className="text-xs text-slate-500">
                  Basic Website Design • Interactive Exercise
                </p>
              </div>
            </div>

            {/* Score pill */}
            <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              passedCount === totalCount 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ความถูกต้อง: {passedCount}/{totalCount} ข้อ</span>
            </div>
          </div>

          {/* Student Info Inputs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center bg-slate-100 rounded-lg px-2.5 py-1.5 border border-slate-200 text-xs flex-1 sm:flex-none">
              <span className="text-slate-500 font-medium mr-1.5 whitespace-nowrap">ชื่อ:</span>
              <input 
                type="text" 
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="ระบุชื่อ-นามสกุล..." 
                className="bg-transparent border-none outline-none text-slate-800 w-32 sm:w-40 font-medium placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center bg-slate-100 rounded-lg px-2.5 py-1.5 border border-slate-200 text-xs flex-1 sm:flex-none">
              <span className="text-slate-500 font-medium mr-1.5 whitespace-nowrap">รหัสประจำตัว:</span>
              <input 
                type="text" 
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="รหัสประจำตัว..." 
                className="bg-transparent border-none outline-none text-slate-800 w-24 sm:w-28 font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* View Toggles & Actions */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <div className="bg-slate-100 p-0.5 rounded-lg flex border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setViewMode('interactive')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                  viewMode === 'interactive' 
                    ? 'bg-white text-indigo-700 shadow-sm font-semibold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>💻 โหมดฝึกเขียนโค้ด</span>
              </button>
              <button
                onClick={() => setViewMode('paper')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                  viewMode === 'paper' 
                    ? 'bg-white text-indigo-700 shadow-sm font-semibold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>📄 โหมดใบงาน</span>
              </button>
            </div>

            <button
              onClick={onShowSolution}
              title="ดูแนวทางและเฉลย"
              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg border border-amber-200 transition text-xs flex items-center gap-1"
            >
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">เฉลย</span>
            </button>

            <button
              onClick={() => window.print()}
              title="พิมพ์ใบงาน (Print)"
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition text-xs flex items-center gap-1"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">พิมพ์</span>
            </button>

            <button
              onClick={onReset}
              title="รีเซ็ตโค้ดใหม่"
              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
