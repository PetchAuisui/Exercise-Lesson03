import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import TaskChecklist from './components/TaskChecklist';
import CodeEditor from './components/CodeEditor';
import BrowserPreview from './components/BrowserPreview';
import WorksheetPaperView from './components/WorksheetPaperView';
import SolutionModal from './components/SolutionModal';
import LoginScreen from './components/LoginScreen';
import { validateHtmlCode, SAMPLE_SOLUTION } from './utils/htmlValidator';

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

  // Code starts completely empty ("") - student must write from scratch
  const [code, setCode] = useState(() => {
    if (currentStudent?.id) {
      return localStorage.getItem(`ws_code_${currentStudent.id}`) || '';
    }
    return '';
  });

  const [viewMode, setViewMode] = useState('interactive'); // 'interactive' | 'paper'
  const [checklistOpen, setChecklistOpen] = useState(true);
  const [showSolution, setShowSolution] = useState(false);
  const prevPassedRef = useRef(false);

  // When student switches/logs in, load their code or empty string
  useEffect(() => {
    if (currentStudent?.id) {
      const savedCode = localStorage.getItem(`ws_code_${currentStudent.id}`) || '';
      setCode(savedCode);
    } else {
      setCode('');
    }
  }, [currentStudent?.id]);

  // Save student code per account
  useEffect(() => {
    if (currentStudent?.id) {
      localStorage.setItem(`ws_code_${currentStudent.id}`, code);
    }
  }, [code, currentStudent?.id]);

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

  // If not logged in, show Login Screen
  if (!currentStudent) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-thai text-slate-800">
      {/* Top Navigation */}
      <Header
        studentName={studentName}
        setStudentName={() => {}}
        studentId={studentId}
        setStudentId={() => {}}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onShowSolution={() => setShowSolution(true)}
        onLogout={handleLogout}
        passedCount={validation.passedCount}
        totalCount={validation.totalCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col">
        {viewMode === 'interactive' ? (
          <div className="flex flex-col gap-5 flex-1">
            {/* Criteria Checklist */}
            <TaskChecklist
              validation={validation}
              isOpen={checklistOpen}
              onToggle={() => setChecklistOpen(!checklistOpen)}
            />

            {/* Split Screen Workspace: Editor (Left) & Preview (Right) - Exactly Equal Heights */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
              {/* Code Editor */}
              <div className="flex flex-col h-full">
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  onClear={handleClear}
                />
              </div>

              {/* Live Browser Preview */}
              <div className="flex flex-col h-full">
                <BrowserPreview
                  code={code}
                  pageTitle={validation.extractedTitle}
                  validation={validation}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Paper Worksheet Mode */
          <WorksheetPaperView
            studentName={studentName}
            setStudentName={() => {}}
            studentId={studentId}
            setStudentId={() => {}}
            code={code}
            onChangeCode={setCode}
          />
        )}
      </main>

      {/* Solution & Guide Modal */}
      <SolutionModal
        isOpen={showSolution}
        onClose={() => setShowSolution(false)}
        onApplySolution={handleApplySolution}
      />
    </div>
  );
}
