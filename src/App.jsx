import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import TaskChecklist from './components/TaskChecklist';
import CodeEditor from './components/CodeEditor';
import BrowserPreview from './components/BrowserPreview';
import WorksheetPaperView from './components/WorksheetPaperView';
import SolutionModal from './components/SolutionModal';
import { validateHtmlCode, STARTER_TEMPLATE, SAMPLE_SOLUTION } from './utils/htmlValidator';

export default function App() {
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('ws_student_name') || '';
  });
  const [studentId, setStudentId] = useState(() => {
    return localStorage.getItem('ws_student_id') || '';
  });
  const [code, setCode] = useState(() => {
    return localStorage.getItem('ws_code') || STARTER_TEMPLATE;
  });
  const [viewMode, setViewMode] = useState('interactive'); // 'interactive' | 'paper'
  const [checklistOpen, setChecklistOpen] = useState(true);
  const [showSolution, setShowSolution] = useState(false);
  const prevPassedRef = useRef(false);

  // Validate code
  const validation = validateHtmlCode(code);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('ws_student_name', studentName);
  }, [studentName]);

  useEffect(() => {
    localStorage.setItem('ws_student_id', studentId);
  }, [studentId]);

  useEffect(() => {
    localStorage.setItem('ws_code', code);
  }, [code]);

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

  const handleReset = () => {
    if (window.confirm('คุณต้องการรีเซ็ตโค้ดกลับไปเป็นค่าเริ่มต้นใช่หรือไม่?')) {
      setCode(STARTER_TEMPLATE);
    }
  };

  const handleClear = () => {
    if (window.confirm('คุณต้องการล้างโค้ดทั้งหมดในพื้นที่เขียนใช่หรือไม่?')) {
      setCode('');
    }
  };

  const handleApplySolution = () => {
    setCode(SAMPLE_SOLUTION);
  };

  // Simple clean auto-formatter
  const handleFormat = () => {
    const rawLines = code.split('\n');
    let indentLevel = 0;
    const formatted = rawLines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      // Decrease indent for closing tags
      if (trimmed.startsWith('</') || trimmed === '</html>' || trimmed === '</head>' || trimmed === '</body>' || trimmed === '</a>') {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      const indent = '    '.repeat(indentLevel);
      const result = indent + trimmed;

      // Increase indent for opening container tags
      if (
        (trimmed.startsWith('<html') && !trimmed.endsWith('</html>')) ||
        (trimmed.startsWith('<head') && !trimmed.endsWith('</head>')) ||
        (trimmed.startsWith('<body') && !trimmed.endsWith('</body>')) ||
        (trimmed.startsWith('<a ') && !trimmed.endsWith('</a>'))
      ) {
        indentLevel++;
      }

      return result;
    }).join('\n');

    setCode(formatted);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-thai text-slate-800">
      {/* Top Navigation */}
      <Header
        studentName={studentName}
        setStudentName={setStudentName}
        studentId={studentId}
        setStudentId={setStudentId}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onReset={handleReset}
        onShowSolution={() => setShowSolution(true)}
        passedCount={validation.passedCount}
        totalCount={validation.totalCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col">
        {viewMode === 'interactive' ? (
          <div className="flex flex-col gap-4 flex-1">
            {/* Criteria Checklist */}
            <TaskChecklist
              validation={validation}
              isOpen={checklistOpen}
              onToggle={() => setChecklistOpen(!checklistOpen)}
            />

            {/* Split Screen Workspace: Editor (Left) & Preview (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[560px]">
              {/* Code Editor */}
              <div className="flex flex-col h-full min-h-[400px]">
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  onFormat={handleFormat}
                  onClear={handleClear}
                />
              </div>

              {/* Live Browser Preview */}
              <div className="flex flex-col h-full min-h-[400px]">
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
            setStudentName={setStudentName}
            studentId={studentId}
            setStudentId={setStudentId}
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
