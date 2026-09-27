import React from 'react';
import { BookOpen, CheckCircle2, Lightbulb, LogOut, UserCheck, Send, RotateCcw, Lock } from 'lucide-react';

export default function Header({ 
  studentName, 
  studentId, 
  onShowSolution,
  onLogout,
  passedCount,
  totalCount,
  isSticky = true,
  canViewSolution = false,
  isSubmitted = false,
  onSubmitWork,
  onCancelSubmission,
  onOpenSlides
}) {
  return (
    <header className={`bg-white border-b border-slate-200 ${isSticky ? 'sticky top-0' : 'relative'} z-30 shadow-xs no-print`}>
      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5 sm:py-3 gap-3 overflow-x-auto">
          
          {/* Left: Brand, Title, and Score */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 sm:p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="shrink-0">
                <h1 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 leading-tight whitespace-nowrap">
                  ใบงานที่ 1 รูปภาพที่คลิกได้
                </h1>
                <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
                  Basic Website Design • Interactive Exercise
                </p>
              </div>
            </div>

            {/* Score Pill */}
            <div className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 border ${
              passedCount === totalCount 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>ความถูกต้อง: {passedCount}/{totalCount} ข้อ</span>
            </div>
          </div>

          {/* Center / Right: Student Info, Mode Toggles, Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-nowrap justify-end ml-auto shrink-0">
            
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

            {/* Submit / Cancel Submission Button */}
            {onSubmitWork && !isSubmitted && (
              <button
                onClick={onSubmitWork}
                title="ยืนยันส่งงานเมื่อเขียนโค้ดเสร็จแล้ว (จะล็อกโค้ดป้องกันการแก้ไข)"
                className="px-3 sm:px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl border border-emerald-500 shadow-xs transition text-xs sm:text-sm font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>ยืนยันส่งงาน</span>
              </button>
            )}

            {onCancelSubmission && isSubmitted && (
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-2xs whitespace-nowrap">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ส่งงานแล้ว (ล็อก)</span>
                </span>
                <button
                  onClick={onCancelSubmission}
                  title="ยกเลิกการส่งงานเพื่อปลดล็อกและกลับมาแก้ไขโค้ดใหม่"
                  className="px-3 py-1.5 text-amber-900 bg-amber-100 hover:bg-amber-200 active:bg-amber-300 rounded-xl border border-amber-300 transition text-xs sm:text-sm font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                  <span>ยกเลิกส่งงาน</span>
                </button>
              </div>
            )}

            {/* View Lesson Slides Button */}
            {onOpenSlides && (
              <button
                onClick={onOpenSlides}
                title="เปิดดูสไลด์เอกสารประกอบการสอน"
                className="px-2.5 sm:px-3 py-1.5 text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>สไลด์บทเรียน</span>
              </button>
            )}

            {/* Solution Button (Only visible if enabled by teacher) */}
            {canViewSolution && (
              <button
                onClick={onShowSolution}
                title="ดูแนวทางและเฉลย"
                className="px-3 py-1.5 text-amber-700 bg-amber-50/50 hover:bg-amber-100/70 rounded-xl border border-amber-200 transition text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span>เฉลย</span>
              </button>
            )}

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
