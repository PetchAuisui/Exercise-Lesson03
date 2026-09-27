import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Download, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  LogOut, 
  Code2, 
  Eye, 
  ShieldCheck, 
  FileSpreadsheet, 
  TrendingUp,
  UserX,
  BookOpen,
  Lock,
  Unlock,
  KeyRound
} from 'lucide-react';
import { 
  getAllStudentsProgress, 
  exportScoresToCSV, 
  getSolutionPermission, 
  setSolutionPermission,
  getExercisePermission,
  setExercisePermission
} from '../utils/adminStorage';
import { resetStudentPassword } from '../data/students';
import StudentDetailModal from './StudentDetailModal';

export default function AdminDashboard({ onLogout, onPreviewStudentView, onViewSlides }) {
  const [studentsProgress, setStudentsProgress] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'เสร็จสมบูรณ์' | 'กำลังทำ' | 'ยังไม่ทำ' | 'ยังไม่เข้าระบบ'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [solutionEnabled, setSolutionEnabled] = useState(getSolutionPermission);
  const [exerciseEnabled, setExerciseEnabled] = useState(getExercisePermission);

  const handleToggleSolution = () => {
    const next = !solutionEnabled;
    setSolutionPermission(next);
    setSolutionEnabled(next);
  };

  const handleToggleExercise = () => {
    const next = !exerciseEnabled;
    setExercisePermission(next);
    setExerciseEnabled(next);
  };

  // Reset student password back to default 'kmitl'
  const handleResetPassword = (student) => {
    if (!student?.id) return;
    const confirmReset = window.confirm(
      `คุณต้องการรีเซ็ตรหัสผ่านของ "${student.name}" (รหัส: ${student.id}) กลับเป็น "kmitl" ใช่หรือไม่?\n\n` +
      `• เมื่อรีเซ็ตแล้ว นักเรียนจะสามารถเข้าสู่ระบบด้วยรหัสผ่าน "kmitl"\n` +
      `• เมื่อนักเรียนเข้าสู่ระบบสำเร็จ ระบบจะบังคับให้นักเรียนตั้งรหัสผ่านใหม่อีกครั้งทันที (ห้ามใช้ kmitl)`
    );

    if (confirmReset) {
      resetStudentPassword(student.id);
      loadData();
      if (selectedStudent && selectedStudent.id === student.id) {
        setSelectedStudent(prev => prev ? { ...prev, hasChangedPassword: false } : null);
      }
      alert(`รีเซ็ตรหัสผ่านของ "${student.name}" กลับเป็น "kmitl" เรียบร้อยแล้ว`);
    }
  };

  // Load students progress
  const loadData = () => {
    setIsRefreshing(true);
    const data = getAllStudentsProgress();
    setStudentsProgress(data);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter students based on search and status
  const filteredStudents = studentsProgress.filter(student => {
    const matchesSearch = 
      student.id.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase().trim());

    let matchesStatus = true;
    if (statusFilter === 'all') {
      matchesStatus = true;
    } else if (statusFilter === 'submitted') {
      matchesStatus = student.isSubmitted;
    } else {
      matchesStatus = student.status === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  // Calculate summary metrics
  const totalCount = studentsProgress.length;
  const submittedCount = studentsProgress.filter(s => s.isSubmitted).length;
  const completedCount = studentsProgress.filter(s => s.status === 'เสร็จสมบูรณ์').length;
  const inProgressCount = studentsProgress.filter(s => s.status === 'กำลังทำ').length;
  const notStartedCount = studentsProgress.filter(s => s.status === 'ยังไม่ทำ').length;
  const notLoggedInCount = studentsProgress.filter(s => s.status === 'ยังไม่เข้าระบบ').length;

  const handleExport = () => {
    exportScoresToCSV(studentsProgress);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-thai text-slate-800">
      
      {/* Admin Top Navigation */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          
          {/* Left: Brand & Admin Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="p-2 sm:p-2.5 bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 rounded-xl font-bold shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base lg:text-lg font-bold text-white tracking-tight whitespace-nowrap truncate">
                  ระบบผู้ดูแล (Admin Dashboard)
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 whitespace-nowrap hidden sm:inline-block">
                  อาจารย์ผู้สอน
                </span>
              </div>
              <p className="text-xs text-slate-400 whitespace-nowrap truncate">
                ใบงานที่ 1 • <span className="text-slate-300 font-mono">siwarpatauisui@gmail.com</span>
              </p>
            </div>
          </div>

          {/* Right: Master Classroom Controls & Logout */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap ml-auto">
            {/* Exercise Access Toggle Button (Teacher controls when students can start exercise) */}
            <button
              onClick={handleToggleExercise}
              title={exerciseEnabled ? 'คลิกเพื่อล็อกแบบฝึกหัด (นักเรียนจะเริ่มทำไม่ได้)' : 'คลิกเพื่อปลดล็อกแบบฝึกหัดให้นักเรียนเริ่มทำได้'}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 border shadow-xs shrink-0 whitespace-nowrap cursor-pointer ${
                exerciseEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
              }`}
            >
              {exerciseEnabled ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>แบบฝึกหัด: <span className="text-emerald-300">เปิดให้นักเรียนทำ</span></span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>แบบฝึกหัด: <span className="text-rose-300">ล็อกอยู่</span></span>
                </>
              )}
            </button>

            {/* Student Solution Access Toggle Button */}
            <button
              onClick={handleToggleSolution}
              title={solutionEnabled ? 'คลิกเพื่อปิดเฉลยฝั่งนักเรียน' : 'คลิกเพื่อเปิดเฉลยให้นักเรียนเห็น'}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 border shadow-xs shrink-0 whitespace-nowrap cursor-pointer ${
                solutionEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {solutionEnabled ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>เฉลย: <span className="text-emerald-300">เปิดอยู่</span></span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>เฉลย: <span className="text-amber-300">ปิดอยู่</span></span>
                </>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              title="ออกจากระบบผู้ดูแล"
              className="px-2.5 sm:px-3 py-1.5 bg-rose-950/70 hover:bg-rose-900 text-rose-300 hover:text-rose-100 rounded-xl border border-rose-800 transition text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ออกจากระบบ</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Students */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                นักศึกษาในระบบทั้งหมด
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {totalCount} <span className="text-sm font-semibold text-slate-500 font-normal">คน</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                ห้องเรียนวิชา Basic Website Design
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Completed (5/5) */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-200/90 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-emerald-50/30">
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                เสร็จสมบูรณ์ (5/5 ข้อ)
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
                {completedCount} <span className="text-sm font-semibold text-emerald-700/70 font-normal">คน</span>
              </h3>
              <p className="text-xs text-emerald-600/80 mt-1">
                ผ่านเกณฑ์ครบถ้วน 100%
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 border border-emerald-200 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: In Progress */}
          <div className="bg-white rounded-2xl p-5 border border-sky-200/90 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-sky-50/30">
            <div>
              <p className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
                กำลังทำ (1-4 ข้อ)
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-sky-600 mt-1">
                {inProgressCount} <span className="text-sm font-semibold text-sky-700/70 font-normal">คน</span>
              </h3>
              <p className="text-xs text-sky-600/80 mt-1">
                เริ่มเขียนแล้วแต่ยังไม่ครบ 5 ข้อ
              </p>
            </div>
            <div className="w-12 h-12 bg-sky-100 border border-sky-200 rounded-2xl flex items-center justify-center text-sky-600 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Not Started / Not Logged In */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-amber-50/30">
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                ยังไม่เข้าระบบ / ยังไม่ทำ
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                {notLoggedInCount + notStartedCount} <span className="text-sm font-semibold text-amber-700/70 font-normal">คน</span>
              </h3>
              <p className="text-xs text-amber-600/80 mt-1">
                ยังไม่เข้า ({notLoggedInCount}) • ยังไม่ทำ ({notStartedCount})
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
              <UserX className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Action and Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3.5">
          
          {/* Top Row: Quick Teaching Tools & Data Export */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            {/* Left: Teaching Material & Student View Shortcuts */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
                เครื่องมืออาจารย์:
              </span>

              {onPreviewStudentView && (
                <button
                  onClick={onPreviewStudentView}
                  title="ดูหน้าตาแบบฝึกหัดที่นักเรียนมองเห็น"
                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 rounded-xl border border-indigo-200 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span>ดูแบบฝึกหัดนักเรียน</span>
                </button>
              )}

              {onViewSlides && (
                <button
                  onClick={onViewSlides}
                  title="เปิดดูสไลด์เอกสารประกอบการสอน 12 สไลด์ (PDF)"
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>สไลด์บทเรียน (PDF)</span>
                </button>
              )}
            </div>

            {/* Right: Refresh & CSV Export */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={loadData}
                disabled={isRefreshing}
                title="รีเฟรชข้อมูลคะแนนล่าสุด"
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
                <span>{isRefreshing ? 'กำลังโหลด...' : 'รีเฟรชข้อมูล'}</span>
              </button>

              <button
                onClick={handleExport}
                title="ดาวน์โหลดคะแนนของทุกคนเป็นไฟล์ CSV / Excel"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลดคะแนน (CSV)</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Search Box & Status Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหารหัสนักศึกษา หรือ ชื่อ-นามสกุล..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">
              กรองสถานะ:
            </span>

            {[
              { id: 'all', label: `ทั้งหมด (${totalCount})` },
              { id: 'submitted', label: `ส่งงานแล้ว (${submittedCount})`, color: 'emerald' },
              { id: 'เสร็จสมบูรณ์', label: `เสร็จสมบูรณ์ (${completedCount})`, color: 'emerald' },
              { id: 'กำลังทำ', label: `กำลังทำ (${inProgressCount})`, color: 'sky' },
              { id: 'ยังไม่ทำ', label: `ยังไม่ทำ (${notStartedCount})`, color: 'amber' },
              { id: 'ยังไม่เข้าระบบ', label: `ยังไม่เข้าระบบ (${notLoggedInCount})`, color: 'slate' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === f.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">รหัสนักศึกษา</th>
                  <th className="py-3.5 px-4">ชื่อ-นามสกุล</th>
                  <th className="py-3.5 px-4 text-center">สถานะ</th>
                  <th className="py-3.5 px-4 text-center">การส่งงาน</th>
                  <th className="py-3.5 px-4 text-center">รหัสผ่าน</th>
                  <th className="py-3.5 px-4 text-center">คะแนน</th>
                  <th className="py-3.5 px-4 text-center">เกณฑ์ 5 ข้อ</th>
                  <th className="py-3.5 px-4">อัปเดตล่าสุด</th>
                  <th className="py-3.5 px-4 text-center">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-12 text-center text-slate-400">
                      <Search className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold">ไม่พบข้อมูลนักศึกษาที่ตรงกับเงื่อนไขการค้นหา</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr 
                      key={student.id} 
                      className="hover:bg-slate-50/80 transition"
                    >
                      {/* # */}
                      <td className="py-3.5 px-4 text-center text-xs font-mono text-slate-400">
                        {student.no}
                      </td>

                      {/* Student ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                        {student.id}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                        {student.name}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          student.status === 'เสร็จสมบูรณ์'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : student.status === 'กำลังทำ'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : student.status === 'ยังไม่ทำ'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            student.status === 'เสร็จสมบูรณ์'
                              ? 'bg-emerald-500'
                              : student.status === 'กำลังทำ'
                              ? 'bg-sky-500'
                              : student.status === 'ยังไม่ทำ'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}></span>
                          <span>{student.status}</span>
                        </span>
                      </td>

                      {/* Submission Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {student.isSubmitted ? (
                          <span 
                            title={`ยืนยันส่งงานเมื่อ: ${new Date(student.submittedAt).toLocaleString('th-TH')}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"
                          >
                            <span>🔒 ส่งงานแล้ว</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                            <span>ยังไม่ส่ง</span>
                          </span>
                        )}
                      </td>

                      {/* Password Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {student.hasChangedPassword ? (
                          <span 
                            title="นักเรียนเปลี่ยนรหัสผ่านจากค่าเริ่มต้นแล้ว"
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                          >
                            <KeyRound className="w-3 h-3 text-emerald-600" />
                            <span>เปลี่ยนแล้ว</span>
                          </span>
                        ) : (
                          <span 
                            title="ยังเป็นรหัสผ่านเริ่มต้น (kmitl)"
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300"
                          >
                            <KeyRound className="w-3 h-3 text-amber-600" />
                            <span>kmitl</span>
                          </span>
                        )}
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-bold text-slate-900 font-mono text-sm">
                            {student.score} / {student.totalCount}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            ({student.scorePercent}%)
                          </span>
                        </div>
                      </td>

                      {/* Criteria Mini Badges (1-5) */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {student.validation.criteria.map((c, i) => (
                            <span
                              key={c.id}
                              title={`ข้อ ${i + 1}: ${c.title} (${c.passed ? 'ผ่าน' : 'ไม่ผ่าน'})`}
                              className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center cursor-default ${
                                c.passed 
                                  ? 'bg-emerald-500 text-white' 
                                  : 'bg-slate-200 text-slate-400'
                              }`}
                            >
                              {i + 1}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Last Updated */}
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {student.lastUpdated 
                          ? new Date(student.lastUpdated).toLocaleString('th-TH', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: '2-digit', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })
                          : <span className="text-slate-400 italic">ยังไม่มีบันทึก</span>
                        }
                      </td>

                      {/* Action: Inspect Code & Reset Password */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5 flex-nowrap">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            title="ดูโค้ดและผลงานของนักศึกษา"
                            className="px-2.5 sm:px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900 rounded-lg text-xs font-bold border border-indigo-200 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>ดูโค้ด</span>
                          </button>

                          <button
                            onClick={() => handleResetPassword(student)}
                            title={`คลิกเพื่อรีเซ็ตรหัสผ่านของ ${student.name} กลับเป็น 'kmitl'`}
                            className="px-2.5 sm:px-3 py-1.5 bg-slate-50 hover:bg-amber-50 active:bg-amber-100 text-slate-700 hover:text-amber-800 rounded-lg text-xs font-semibold border border-slate-200 hover:border-amber-300 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                            <span className="hidden xl:inline">รีเซ็ตรหัส</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              แสดงข้อมูลทั้งหมด <strong>{filteredStudents.length}</strong> จาก <strong>{totalCount}</strong> คน
            </span>
            <span className="font-medium text-slate-600">
              คะแนนเฉลี่ยทั้งห้อง: {(
                studentsProgress.reduce((acc, s) => acc + s.score, 0) / (totalCount || 1)
              ).toFixed(1)} / 5 คะแนน
            </span>
          </div>
        </div>

      </main>

      {/* Student Code Inspection Modal */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onResetPassword={handleResetPassword}
      />

    </div>
  );
}
