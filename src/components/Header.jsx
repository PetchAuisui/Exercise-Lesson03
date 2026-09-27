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
      <div className="max-w-[1720px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
        {/* On Desktop: 1-line flex; On Tablet & Mobile: 2 clean organized rows */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-4">
          
          {/* Top Row on Mobile / Left on Desktop: Brand, Title, and Score Pill + Mobile Logout */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="p-1.5 sm:p-2 bg-indigo-600 text-white rounded-xl shadow-xs shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xs sm:text-base font-bold text-slate-900 leading-tight truncate">
                  ใบงานที่ 1 รูปภาพที่คลิกได้
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                  Basic Website Design • Interactive Exercise
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Score Pill */}
              <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border shrink-0 ${
                passedCount === totalCount 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{passedCount}/{totalCount} <span className="hidden sm:inline">ข้อ</span></span>
              </div>

              {/* Logout button visible on mobile/iPad right next to score */}
              <button
                onClick={onLogout}
                title="ออกจากระบบ"
                className="lg:hidden p-1.5 sm:px-2.5 sm:py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="hidden sm:inline">ออก</span>
              </button>
            </div>
          </div>

          {/* Bottom Row on Mobile / Right on Desktop: Student Info, Actions */}
          <div className="flex items-center justify-between lg:justify-end gap-2 flex-wrap sm:flex-nowrap overflow-x-auto pb-0.5 lg:pb-0">
            {/* Student Info Display */}
            <div className="flex items-center bg-indigo-50/80 border border-indigo-200/90 rounded-xl px-2.5 py-1 text-xs text-indigo-950 font-medium shrink-0">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600 mr-1.5 shrink-0" />
              <div className="flex items-center gap-1.5">
                <span className="font-bold font-mono bg-white px-1.5 py-0.5 rounded border border-indigo-100 text-indigo-700 shadow-2xs">
                  {studentId}
                </span>
                <span className="font-semibold text-slate-800 truncate max-w-[120px] sm:max-w-[200px]">{studentName}</span>
              </div>
            </div>

            {/* Actions group */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Submit / Cancel Submission Button */}
              {onSubmitWork && !isSubmitted && (
                <button
                  onClick={onSubmitWork}
                  title="ยืนยันส่งงานเมื่อเขียนโค้ดเสร็จแล้ว"
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl border border-emerald-500 shadow-xs transition text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ยืนยันส่งงาน</span>
                </button>
              )}

              {onCancelSubmission && isSubmitted && (
                <div className="flex items-center gap-1 shrink-0">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span className="hidden sm:inline">ส่งแล้ว</span>
                  </span>
                  <button
                    onClick={onCancelSubmission}
                    title="ยกเลิกการส่งงานเพื่อปลดล็อกและแก้ไขใหม่"
                    className="px-2.5 py-1 text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl border border-amber-300 transition text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-700" />
                    <span>แก้ไข</span>
                  </button>
                </div>
              )}

              {/* View Lesson Slides Button */}
              {onOpenSlides && (
                <button
                  onClick={onOpenSlides}
                  title="เปิดดูสไลด์เอกสารประกอบการสอน"
                  className="px-2.5 py-1 sm:py-1.5 text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>สไลด์</span>
                </button>
              )}

              {/* Solution Button */}
              {canViewSolution && (
                <button
                  onClick={onShowSolution}
                  title="ดูแนวทางและเฉลย"
                  className="px-2.5 py-1 sm:py-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>เฉลย</span>
                </button>
              )}

              {/* Desktop Logout Button */}
              <button
                onClick={onLogout}
                title="ออกจากระบบ"
                className="hidden lg:flex px-3 py-1.5 text-rose-700 bg-rose-50/50 hover:bg-rose-100/70 rounded-xl border border-rose-200 transition text-xs sm:text-sm font-semibold items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
