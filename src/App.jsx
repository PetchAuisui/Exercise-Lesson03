import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Code2, Globe, ArrowLeft, Send } from 'lucide-react';
import Header from './components/Header';
import TaskChecklist from './components/TaskChecklist';
import CodeEditor from './components/CodeEditor';
import BrowserPreview from './components/BrowserPreview';
import SolutionModal from './components/SolutionModal';
import LoginScreen from './components/LoginScreen';
import AdminDashboard from './components/AdminDashboard';
import { validateHtmlCode, SAMPLE_SOLUTION } from './utils/htmlValidator';
import { 
  recordStudentCodeUpdate, 
  getSolutionPermission,
  getStudentSubmission,
  submitStudentWork,
  cancelStudentSubmission
} from './utils/adminStorage';

export default function App() {
  // Authentication State
  const [currentStudent, setCurrentStudent] = useState(() => {
    const saved = localStorage.getItem('ws_auth_student');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const studentName = currentStudent?.name || '';
  const studentId = currentStudent?.id || '';

  // Admin student view simulation toggle
  const [adminPreviewStudentView, setAdminPreviewStudentView] = useState(false);

  // Solution access controlled by teacher (default: false / locked)
  const [solutionEnabled, setSolutionEnabled] = useState(getSolutionPermission);

  // Submission state for current student
  const [isSubmitted, setIsSubmitted] = useState(() => {
    if (currentStudent?.id) {
      return !!getStudentSubmission(currentStudent.id);
    }
    return false;
  });

  // Sync solution permission and submission state across tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      setSolutionEnabled(getSolutionPermission());
      if (currentStudent?.id) {
        setIsSubmitted(!!getStudentSubmission(currentStudent.id));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentStudent?.id]);

  // Update submission state when current student changes
  useEffect(() => {
    if (currentStudent?.id) {
      setIsSubmitted(!!getStudentSubmission(currentStudent.id));
    } else {
      setIsSubmitted(false);
    }
  }, [currentStudent?.id]);

  // Code starts completely empty ("") - student must write from scratch
  const [code, setCode] = useState(() => {
    if (currentStudent?.id && currentStudent?.role !== 'admin') {
      return localStorage.getItem(`ws_code_${currentStudent.id}`) || '';
    }
    return '';
  });

  const [workspaceTab, setWorkspaceTab] = useState('code'); // 'code' | 'preview'
  const [checklistOpen, setChecklistOpen] = useState(true);
  const [showSolution, setShowSolution] = useState(false);
  const prevPassedRef = useRef(false);

  // When student switches/logs in, load their code or empty string
  useEffect(() => {
    if (currentStudent?.id && currentStudent?.role !== 'admin') {
      const savedCode = localStorage.getItem(`ws_code_${currentStudent.id}`) || '';
      setCode(savedCode);
    } else {
      setCode('');
    }
  }, [currentStudent?.id, currentStudent?.role]);

  // Save student code per account & record activity
  useEffect(() => {
    if (currentStudent?.id && currentStudent?.role !== 'admin') {
      recordStudentCodeUpdate(currentStudent.id, code);
    }
  }, [code, currentStudent?.id, currentStudent?.role]);

  // Handle Login Success
  const handleLoginSuccess = (student) => {
    localStorage.setItem('ws_auth_student', JSON.stringify(student));
    setCurrentStudent(student);
  };

  // Handle Logout
  const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      localStorage.removeItem('ws_auth_student');
      setCurrentStudent(null);
    }
  };

  // Validate code
  const validation = validateHtmlCode(code);

  // Celebrate with confetti when user completes all 5 criteria!
  useEffect(() => {
    if (validation.isAllPassed && !prevPassedRef.current) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    prevPassedRef.current = validation.isAllPassed;
  }, [validation.isAllPassed]);

  const handleClear = () => {
    if (window.confirm('คุณต้องการล้างโค้ดทั้งหมดในพื้นที่เขียนใช่หรือไม่?')) {
      setCode('');
    }
  };

  const handleApplySolution = () => {
    setCode(SAMPLE_SOLUTION);
  };

  // Handle student work submission (Locks code and switches to preview)
  const handleSubmitWork = () => {
    if (!currentStudent?.id) return;
    const confirmSubmit = window.confirm(
      'คุณต้องการยืนยันส่งงานใช่หรือไม่?\n\n' +
      '• เมื่อส่งงานแล้ว พื้นที่เขียนโค้ดจะถูกล็อกเพื่อป้องกันการแก้ไขโดยไม่ตั้งใจ\n' +
      '• ระบบจะสลับไปหน้าแสดงผลลัพธ์หน้าเว็บ (Preview) ให้คุณตรวจดูผลงานทันที\n' +
      '• หากต้องการแก้ไขเพิ่มเติม สามารถกดปุ่ม "ยกเลิกส่งงาน" เพื่อปลดล็อกโค้ดได้ตลอดเวลา'
    );
    if (confirmSubmit) {
      submitStudentWork(currentStudent.id);
      setIsSubmitted(true);
      setWorkspaceTab('preview');
    }
  };

  // Handle student canceling submission (Unlocks code for re-editing)
  const handleCancelSubmission = () => {
    if (!currentStudent?.id) return;
    const confirmCancel = window.confirm(
      'คุณต้องการยกเลิกการส่งงานเพื่อปลดล็อกและกลับมาแก้ไขโค้ดใหม่ใช่หรือไม่?'
    );
    if (confirmCancel) {
      cancelStudentSubmission(currentStudent.id);
      setIsSubmitted(false);
    }
  };

  // If not logged in, show Login Screen
  if (!currentStudent) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // If Admin logged in and not simulating student view, show Admin Dashboard
  if (currentStudent.role === 'admin' && !adminPreviewStudentView) {
    return (
      <AdminDashboard 
        onLogout={handleLogout} 
        onPreviewStudentView={() => setAdminPreviewStudentView(true)} 
      />
    );
  }

  // Display name and ID for Header (supports admin simulation mode)
  const displayStudentName = currentStudent.role === 'admin' 
    ? 'นายศิวาภัทร อุยสุย (ตัวอย่างมุมมองนักเรียน)' 
    : studentName;
  const displayStudentId = currentStudent.role === 'admin' 
    ? '67030351' 
    : studentId;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-thai text-slate-800">
      {/* Simulation Banner for Admin */}
      {currentStudent.role === 'admin' && adminPreviewStudentView && (
        <div className="bg-slate-900 border-b border-indigo-500/30 text-white px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-lg sticky top-0 z-40 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-md uppercase tracking-wider shadow-xs">
              โหมดจำลองมุมมองนักเรียน
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-200">
              กำลังดูหน้าจอแบบฝึกหัดจริงของนักเรียน (สามารถทดลองเขียนโค้ดและดูผลลัพธ์ได้)
            </span>
          </div>
          <button
            onClick={() => setAdminPreviewStudentView(false)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับสู่ Admin Dashboard</span>
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <Header
        studentName={displayStudentName}
        studentId={displayStudentId}
        isSticky={!(currentStudent.role === 'admin' && adminPreviewStudentView)}
        canViewSolution={currentStudent?.role === 'admin' ? true : solutionEnabled}
        onShowSolution={() => setShowSolution(true)}
        onLogout={handleLogout}
        passedCount={validation.passedCount}
        totalCount={validation.totalCount}
        isSubmitted={isSubmitted}
        onSubmitWork={handleSubmitWork}
        onCancelSubmission={handleCancelSubmission}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col">
        <div className="flex flex-col gap-5 flex-1">
          {/* Criteria Checklist */}
          <TaskChecklist
            validation={validation}
            isOpen={checklistOpen}
            onToggle={() => setChecklistOpen(!checklistOpen)}
          />

          {/* Workspace Mode Switcher (Full Width Code vs Full Width Preview) */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setWorkspaceTab('code')}
                className={`px-4 py-2 rounded-md font-bold text-sm sm:text-base flex items-center gap-2 transition cursor-pointer ${
                  workspaceTab === 'code'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Code2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>พื้นที่เขียนโค้ด (index.html)</span>
                {isSubmitted && (
                  <span className="text-xs bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold border border-amber-400/40">
                    🔒
                  </span>
                )}
              </button>
              <button
                onClick={() => setWorkspaceTab('preview')}
                className={`px-4 py-2 rounded-md font-bold text-sm sm:text-base flex items-center gap-2 transition cursor-pointer ${
                  workspaceTab === 'preview'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Globe className="w-4 h-4 text-sky-300 shrink-0" />
                <span>ดูผลลัพธ์หน้าเว็บ (Browser Preview)</span>
              </button>
            </div>

            {/* Quick Submit & Status Controls in Workspace Toolbar */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmitWork}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  title="เมื่อมั่นใจว่าโค้ดเสร็จแล้ว กดปุ่มนี้เพื่อส่งงาน ล็อกโค้ด และดูผลลัพธ์"
                >
                  <Send className="w-4 h-4" />
                  <span>ส่งงาน (เมื่อมั่นใจว่าโค้ดเสร็จแล้ว)</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                    <span>🔒</span>
                    <span>ส่งงานแล้ว (โค้ดถูกล็อก)</span>
                  </span>
                  <button
                    onClick={handleCancelSubmission}
                    className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
                    title="ยกเลิกการส่งงานเพื่อปลดล็อกและกลับมาแก้ไขโค้ด"
                  >
                    ↩️ ยกเลิกส่งงานเพื่อแก้ไข
                  </button>
                </div>
              )}

              {/* Status / Instruction text */}
              <div className="text-xs sm:text-sm text-slate-500 font-medium px-2 hidden xl:block">
                {workspaceTab === 'code'
                  ? '💡 สลับไปดูผลลัพธ์หน้าเว็บได้ตลอดเวลา'
                  : '🌐 แสดงผลลัพธ์หน้าเว็บเสมือนจริง'}
              </div>
            </div>
          </div>

          {/* Full Width Workspace Display */}
          {workspaceTab === 'code' ? (
            <div className="w-full">
              <CodeEditor
                code={code}
                onChange={setCode}
                onClear={handleClear}
                onSwitchToPreview={() => setWorkspaceTab('preview')}
                isLocked={isSubmitted}
                onCancelSubmission={handleCancelSubmission}
              />
            </div>
          ) : (
            <div className="w-full">
              <BrowserPreview
                code={code}
                pageTitle={validation.extractedTitle}
                validation={validation}
                onSwitchToCode={() => setWorkspaceTab('code')}
                isSubmitted={isSubmitted}
                onCancelSubmission={handleCancelSubmission}
              />
            </div>
          )}
        </div>
      </main>

      {/* Solution & Guide Modal */}
      <SolutionModal
        isOpen={showSolution && (currentStudent?.role === 'admin' || solutionEnabled)}
        onClose={() => setShowSolution(false)}
        onApplySolution={handleApplySolution}
      />
    </div>
  );
}
