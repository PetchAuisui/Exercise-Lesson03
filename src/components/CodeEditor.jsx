import React, { useRef, useState, useEffect } from 'react';
import { Code2, Sparkles, Copy, Check, Trash2, ZoomIn, ZoomOut } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';

export default function CodeEditor({ code, onChange, onFormat, onClear }) {
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(18); // Default 18px (comfortable and big)

  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 14);

  // Sync scroll between textarea and syntax highlight pre
  const handleScroll = (e) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.target.scrollTop;
      preRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to insert snippet at cursor
  const insertSnippet = (snippet) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const newText = text.substring(0, start) + snippet + text.substring(end);
    onChange(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 10);
  };

  // Generate syntax highlighted HTML with Prism
  const getHighlightedHtml = () => {
    if (!code) {
      return '<span class="text-slate-500 italic opacity-60">เริ่มเขียนโค้ด HTML ที่นี่ตั้งแต่บรรทัดที่ 1 (เช่น &lt;!DOCTYPE html&gt;...)</span>';
    }
    // Highlight HTML with Prism
    const highlighted = Prism.highlight(code, Prism.languages.markup, 'markup');
    // Ensure trailing newline is visible in pre
    return code.endsWith('\n') ? highlighted + '\n' : highlighted;
  };

  return (
    <div className="bg-slate-950 rounded-2xl shadow-xl border border-slate-800 overflow-hidden flex flex-col h-full min-h-[640px]">
      {/* Top Bar */}
      <div className="px-5 py-3.5 bg-slate-900 text-slate-200 flex items-center justify-between border-b border-slate-800 text-sm flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Code2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="font-bold text-slate-100 text-base">index.html</span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 text-xs font-mono font-semibold border border-slate-700">
            {lines.length} / 14 บรรทัด
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Font Size Adjusters */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 mr-1 text-xs">
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 transition"
              title="ลดขนาดตัวอักษร"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] text-slate-400">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 transition"
              title="เพิ่มขนาดตัวอักษร"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onFormat}
            title="จัดรูปแบบโค้ดอัตโนมัติ"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition flex items-center gap-1.5 text-xs sm:text-sm font-medium border border-slate-700"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>จัดระเบียบโค้ด</span>
          </button>

          <button
            onClick={handleCopy}
            title="คัดลอกโค้ด"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition text-xs sm:text-sm border border-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={onClear}
            title="ล้างโค้ดทั้งหมด"
            className="p-2 bg-slate-800 hover:bg-red-950/70 text-slate-200 hover:text-red-300 rounded-lg transition text-xs sm:text-sm border border-slate-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Insert Snippet Chips (wrap nicely without horizontal scrollbar) */}
      <div className="px-4 py-2 bg-slate-900/70 border-b border-slate-800 flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-400 text-xs font-semibold whitespace-nowrap">แท็กด่วน:</span>
        <button 
          onClick={() => insertSnippet('<!DOCTYPE html>\n')}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-md font-code transition text-xs border border-purple-900/50"
        >
          &lt;!DOCTYPE html&gt;
        </button>
        <button 
          onClick={() => insertSnippet('<html>\n\n</html>')}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-md font-code transition text-xs border border-sky-900/50"
        >
          &lt;html&gt;
        </button>
        <button 
          onClick={() => insertSnippet('<head>\n    <title>สถานที่ท่องเที่ยว</title>\n</head>')}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-md font-code transition text-xs border border-emerald-900/50"
        >
          &lt;head&gt;+&lt;title&gt;
        </button>
        <button 
          onClick={() => insertSnippet('<body>\n    \n</body>')}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-md font-code transition text-xs border border-indigo-900/50"
        >
          &lt;body&gt;
        </button>
        <button 
          onClick={() => insertSnippet('<a href="detail.html"></a>')}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-pink-300 rounded-md font-code transition text-xs border border-pink-900/50"
        >
          &lt;a href="..."&gt;
        </button>
        <button 
          onClick={() => insertSnippet('<img src="temple.jpg" alt="วัดไทย">')}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-md font-code transition text-xs border border-amber-900/50"
        >
          &lt;img ...&gt;
        </button>
      </div>

      {/* Editor Body with Real Syntax Highlighting Overlay */}
      <div className="flex-1 flex overflow-hidden bg-slate-950 font-code relative select-text">
        {/* Line Numbers with bright orange accents 1-14 */}
        <div 
          className="w-14 sm:w-16 bg-slate-950/80 py-4 select-none text-slate-500 font-mono text-right pr-4 border-r border-slate-800 shrink-0"
          style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.6}px` }}
        >
          {Array.from({ length: lineCount }).map((_, idx) => {
            const lineNum = idx + 1;
            const isTargetRange = lineNum <= 14;
            return (
              <div 
                key={idx} 
                className={`${
                  isTargetRange ? 'text-amber-400 font-bold' : 'text-slate-600'
                }`}
                style={{ height: `${fontSize * 1.6}px` }}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Code Content Area (Overlay Container) */}
        <div className="relative flex-1 h-full overflow-hidden">
          {/* Syntax Highlighted Background */}
          <pre
            ref={preRef}
            aria-hidden="true"
            className="code-editor-pre absolute inset-0 p-4 m-0 overflow-hidden pointer-events-none z-0 whitespace-pre-wrap break-all"
            style={{ 
              fontSize: `${fontSize}px`, 
              lineHeight: `${fontSize * 1.6}px`,
              tabSize: 4
            }}
            dangerouslySetInnerHTML={{ __html: getHighlightedHtml() }}
          />

          {/* Interactive Transparent Textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            spellCheck="false"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            className="absolute inset-0 w-full h-full p-4 m-0 bg-transparent text-transparent caret-sky-400 font-code resize-none outline-none z-10 whitespace-pre-wrap break-all selection:bg-indigo-500/40"
            style={{ 
              fontSize: `${fontSize}px`, 
              lineHeight: `${fontSize * 1.6}px`,
              tabSize: 4
            }}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-5 py-2.5 bg-slate-900 border-t border-slate-800 text-xs sm:text-sm text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          <span>สีโค้ดจริง (HTML Syntax Highlighting • VS Code Style)</span>
        </span>
        <span className="text-amber-400 font-semibold">Basic Website Design</span>
      </div>
    </div>
  );
}
