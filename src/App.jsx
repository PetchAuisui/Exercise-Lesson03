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
import LessonSlides from './components/LessonSlides';
import ForcePasswordChangeModal from './components/ForcePasswordChangeModal';
import { validateHtmlCode, SAMPLE_SOLUTION } from './utils/htmlValidator';
import { isPasswordChanged } from './data/students';
import { 
  recordStudentCodeUpdate, 
  getSolutionPermission,
  getExercisePermission,
  getStudentSubmission,
  submitStudentWork,
  cancelStudentSubmission
} from './utils/adminStorage';
import { 
  subscribeToClassroom, 
  subscribeToStudentSelf, 
  syncStudentLogin, 
  syncStudentCode, 
  syncStudentSubmission, 
  syncStudentPasswordChange 
} from './services/realtimeSync';
import { initFirebase } from './services/firebase';

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

  // Exercise access controlled by teacher (default: false / locked until unlocked by teacher)
  const [exerciseEnabled, setExerciseEnabled] = useState(getExercisePermission);

  // Submission state for current student
  const [isSubmitted, setIsSubmitted] = useState(() => {
    if (currentStudent?.id) {
      return !!getStudentSubmission(currentStudent.id);
    }
    return false;
  });

  // Password change enforcement state (Forces change if still default 'kmitl')
  const [mustChangePassword, setMustChangePassword] = useState(() => {
    if (currentStudent && currentStudent.role === 'student') {
      return !isPasswordChanged(currentStudent.id);
    }
    return false;
  });

  // Initialize Firebase app once
  useEffect(() => {
    initFirebase();
  }, []);

  // Listen to Realtime Classroom settings (Exercise lock & Solution toggle)
  useEffect(() => {
    const unsub = subscribeToClassroom(({ exerciseEnabled, solutionEnabled }) => {
      setExerciseEnabled(exerciseEnabled);
      setSolutionEnabled(solutionEnabled);
    });
    return () => unsub();
  }, []);

  // Listen to single student live updates (e.g. teacher resets password or changes lock)
  useEffect(() => {
    if (currentStudent?.id && currentStudent.role === 'student') {
      const unsub = subscribeToStudentSelf(currentStudent.id, (data) => {
        if (data.hasChangedPassword !== undefined) {
          setMustChangePassword(!data.hasChangedPassword);
        }
        if (data.isSubmitted !== undefined) {
          setIsSubmitted(data.isSubmitted);
        }
      });
      return () => unsub();
    }
  }, [currentStudent?.id, currentStudent?.role]);

  // Sync solution permission, exercise unlock, submission, and password state across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setSolutionEnabled(getSolutionPermission());
      setExerciseEnabled(getExercisePermission());
      if (currentStudent?.id) {
        setIsSubmitted(!!getStudentSubmission(currentStudent.id));
        if (currentStudent.role === 'student') {
          setMustChangePassword(!isPasswordChanged(currentStudent.id));
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentStudent?.id, currentStudent?.role]);

  // Update submission and password state when current student changes
  useEffect(() => {
    if (currentStudent?.id) {
      setIsSubmitted(!!getStudentSubmission(currentStudent.id));
      if (currentStudent.role === 'student') {
        setMustChangePassword(!isPasswordChanged(currentStudent.id));
      } else {
        setMustChangePassword(false);
      }
    } else {
      setIsSubmitted(false);
      setMustChangePassword(false);
    }
  }, [currentStudent?.id, currentStudent?.role]);

  // Code starts completely empty ("") - student must write from scratch
  const [code, setCode] = useState(() => {
    if (currentStudent?.id && currentStudent?.role !== 'admin') {
      return localStorage.getItem(`ws_code_${currentStudent.id}`) || '';
    }
    return '';
  });

  const [workspaceTab, setWorkspaceTab] = useState('code'); // 'code' | 'preview'
  const [activeView, setActiveView] = useState('slides'); // 'slides' | 'exercise'
  const [showSlidesModal, setShowSlidesModal] = useState(false);
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

  // Save student code per account & sync to Firebase in real-time (debounced)
  useEffect(() => {
    if (currentStudent?.id && currentStudent?.role !== 'admin') {
      recordStudentCodeUpdate(currentStudent.id, code);
      const timer = setTimeout(() => {
        syncStudentCode(currentStudent.id, code);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [code, currentStudent?.id, currentStudent?.role]);

  // Handle Login Success (always presents slides first)
  const handleLoginSuccess = (student) => {
    localStorage.setItem('ws_auth_student', JSON.stringify(student));
    setCurrentStudent(student);
    if (student.role === 'student') {
      syncStudentLogin(student.id);
      setMustChangePassword(!isPasswordChanged(student.id));
    } else {
      setMustChangePassword(false);
    }
    setActiveView('slides');
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

  // Celebrate with confetti when user submits and completes all 5 criteria!
  useEffect(() => {
    if (isSubmitted && validation.isAllPassed && !prevPassedRef.current) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
    prevPassedRef.current = isSubmitted && validation.isAllPassed;
  }, [isSubmitted, validation.isAllPassed]);

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
      syncStudentSubmission(currentStudent.id, true);
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
      syncStudentSubmission(currentStudent.id, false);
      setIsSubmitted(false);
    }
  };

  // If not logged in, show Login Screen
  if (!currentStudent) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Force student to change password if still using default 'kmitl'
  if (currentStudent.role === 'student' && mustChangePassword) {
    return (
      <ForcePasswordChangeModal
        student={currentStudent}
        onPasswordChanged={async (newPwd) => {
          await syncStudentPasswordChange(currentStudent.id, newPwd);
          setMustChangePassword(false);
        }}
        onLogout={handleLogout}
      />
    );
  }

  // Determine if exercise is unlocked for current user
  const canAccessExercise = currentStudent?.role === 'admin' ? true : exerciseEnabled;

  // If exercise gets locked by teacher, route student back to slides
  useEffect(() => {
    if (currentStudent && currentStudent.role !== 'admin' && !exerciseEnabled) {
      setActiveView('slides');
    }
  }, [exerciseEnabled, currentStudent]);

  // If Admin logged in and not simulating student view, show Admin Dashboard
  if (currentStudent.role === 'admin' && !adminPreviewStudentView) {
    return (
      <>
        <AdminDashboard 
          onLogout={handleLogout} 
          onPreviewStudentView={() => {
            setAdminPreviewStudentView(true);
            setActiveView('slides');
          }}
          onViewSlides={() => setShowSlidesModal(true)}
        />
        {showSlidesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-fade-in no-print">
            <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
              <LessonSlides 
                isModal={true} 
                canAccessExercise={true}
                onCloseModal={() => setShowSlidesModal(false)}
                onGoToExercise={() => {
                  setShowSlidesModal(false);
                  setAdminPreviewStudentView(true);
                  setActiveView('exercise');
                }}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // If viewing slides (first screen students see upon entry)
  if (activeView === 'slides') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white font-thai">
        {/* Simulation Banner for Admin */}
        {currentStudent.role === 'admin' && adminPreviewStudentView && (
          <div className="bg-slate-900 border-b border-indigo-500/30 text-white px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-lg sticky top-0 z-40 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-md uppercase tracking-wider shadow-xs">
                โหมดจำลองมุมมองนักเรียน
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                กำลังดูสไลด์ประกอบการสอน (ขั้นตอนที่ 1 ก่อนเข้าสู่แบบฝึกหัด)
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
        <LessonSlides 
          canAccessExercise={canAccessExercise}
          onGoToExercise={() => {
            if (canAccessExercise) {
              setActiveView('exercise');
            } else {
              alert('แบบฝึกหัดยังไม่เปิดให้ทำ กรุณารออาจารย์ผู้สอนปลดล็อกแบบฝึกหัด');
            }
          }} 
          student={currentStudent.role === 'student' ? currentStudent : null}
          onLogout={currentStudent.role === 'student' ? handleLogout : null}
        />
      </div>
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
        onOpenSlides={() => setActiveView('slides')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col">
        <div className="flex flex-col gap-5 flex-1">
          {/* Criteria Checklist */}
          <TaskChecklist
            validation={validation}
            isOpen={checklistOpen}
            onToggle={() => setChecklistOpen(!checklistOpen)}
            isSubmitted={isSubmitted}
          />

          {/* Workspace Mode Switcher (Full Width Code vs Full Width Preview) */}
          <div className="flex items-center justify-between flex-wrap gap-2.5 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-slate-100 rounded-lg flex-1 sm:flex-initial">
              <button
                onClick={() => setWorkspaceTab('code')}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-md font-bold text-xs sm:text-sm lg:text-base flex items-center justify-center gap-1.5 sm:gap-2 transition cursor-pointer ${
                  workspaceTab === 'code'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Code2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span><span className="hidden sm:inline">เขียน</span>โค้ด (index.html)</span>
                {isSubmitted && (
                  <span className="text-xs bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded font-bold border border-amber-400/40">
                    🔒
                  </span>
                )}
              </button>
              <button
                onClick={() => setWorkspaceTab('preview')}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-md font-bold text-xs sm:text-sm lg:text-base flex items-center justify-center gap-1.5 sm:gap-2 transition cursor-pointer ${
                  workspaceTab === 'preview'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Globe className="w-4 h-4 text-sky-300 shrink-0" />
                <span><span className="hidden sm:inline">ดูผลลัพธ์</span><span className="sm:hidden">ผลลัพธ์</span>หน้าเว็บ</span>
              </button>
            </div>

            {/* Quick Submit & Status Controls in Workspace Toolbar */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmitWork}
                  className="px-3 sm:px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  title="เมื่อมั่นใจว่าโค้ดเสร็จแล้ว กดปุ่มนี้เพื่อส่งงาน ล็อกโค้ด และดูผลลัพธ์"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>ส่งงาน <span className="hidden md:inline">(เมื่อมั่นใจว่าโค้ดเสร็จแล้ว)</span></span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="px-2 sm:px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs">
                    <span>🔒</span>
                    <span>ส่งแล้ว</span>
                  </span>
                  <button
                    onClick={handleCancelSubmission}
                    className="px-2.5 sm:px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
                    title="ยกเลิกการส่งงานเพื่อปลดล็อกและกลับมาแก้ไขโค้ด"
                  >
                    ↩️ แก้ไข
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
