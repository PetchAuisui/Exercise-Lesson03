import React, { useRef, useState } from 'react';
import { Code2, Sparkles, Copy, Check, Trash2, ZoomIn, ZoomOut, Sun, Moon } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';

export default function CodeEditor({ code, onChange, onFormat, onClear }) {
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to clean light theme matching the worksheet!

  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 14);
  const lineHeightPx = Math.round(fontSize * 1.6);
  const totalBodyHeightPx = 14 * lineHeightPx; // Exactly fits 14 lines! No excess black/white void below!

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

  // Generate syntax highlighted HTML with Prism
  const getHighlightedHtml = () => {
    if (!code) {
      return `<span class="${isDarkMode ? 'text-slate-600' : 'text-slate-400'} italic select-none">เริ่มเขียนโค้ด HTML ที่นี่ตั้งแต่บรรทัดที่ 1...</span>`;
    }
    const highlighted = Prism.highlight(code, Prism.languages.markup, 'markup');
    return code.endsWith('\n') ? highlighted + '\n' : highlighted;
  };

  return (
    <div className={`rounded-2xl shadow-md overflow-hidden flex flex-col transition-colors ${
      isDarkMode 
        ? 'bg-slate-950 border border-slate-800' 
        : 'bg-white border-2 border-orange-400/90'
    }`}>
      {/* Top Bar */}
      <div className={`px-4 sm:px-5 py-3 flex items-center justify-between border-b text-sm flex-wrap gap-2 ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800 text-slate-200' 
          : 'bg-orange-50/80 border-orange-200 text-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <Code2 className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-orange-600'} shrink-0`} />
          <span className="font-bold text-base">
            index.html <span className="font-normal text-xs text-slate-500">(พื้นที่เขียนโค้ด)</span>
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
            isDarkMode 
              ? 'bg-slate-800 text-amber-400 border-slate-700' 
              : 'bg-white text-orange-700 border-orange-200'
          }`}>
            {lines.length} / 14 บรรทัด
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700' 
                : 'bg-white border-orange-200 text-slate-700 hover:bg-orange-100/50'
            }`}
            title="สลับธีม สว่าง / มืด"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
            <span>{isDarkMode ? 'โหมดมืด' : 'โหมดสว่าง (ตามใบงาน)'}</span>
          </button>

          {/* Font Size Adjusters */}
          <div className={`flex items-center rounded-lg p-0.5 border text-xs ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-orange-200'
          }`}>
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="p-1 rounded text-slate-400 hover:text-slate-600 transition"
              title="ลดขนาดตัวอักษร"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] font-semibold text-slate-500">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="p-1 rounded text-slate-400 hover:text-slate-600 transition"
              title="เพิ่มขนาดตัวอักษร"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onFormat}
            title="จัดรูปแบบโค้ดอัตโนมัติ"
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 text-xs sm:text-sm font-semibold border ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-white hover:bg-orange-50 text-slate-700 border-orange-200 shadow-2xs'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>จัดระเบียบโค้ด</span>
          </button>

          <button
            onClick={handleCopy}
            title="คัดลอกโค้ด"
            className={`p-2 rounded-lg transition text-xs sm:text-sm border ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-white hover:bg-orange-50 text-slate-700 border-orange-200 shadow-2xs'
            }`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={onClear}
            title="ล้างโค้ดทั้งหมด"
            className={`p-2 rounded-lg transition text-xs sm:text-sm border ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-red-950/70 text-slate-200 hover:text-red-300 border-slate-700' 
                : 'bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 border-orange-200 shadow-2xs'
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Body with EXACT height for 14 lines (No excess empty void below!) */}
      <div 
        className={`flex overflow-hidden font-code relative select-text ${
          isDarkMode ? 'bg-slate-950' : 'bg-white code-editor-light'
        }`}
        style={{ height: `${totalBodyHeightPx}px` }}
      >
        {/* Line Numbers 1 to 14 exactly filling the height */}
        <div 
          className={`w-12 sm:w-14 py-0 select-none font-mono text-right pr-3 shrink-0 border-r ${
            isDarkMode 
              ? 'bg-slate-950/90 text-slate-500 border-slate-800' 
              : 'bg-orange-50/40 text-orange-500 font-bold border-orange-200'
          }`}
          style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeightPx}px` }}
        >
          {Array.from({ length: 14 }).map((_, idx) => {
            const lineNum = idx + 1;
            return (
              <div 
                key={idx} 
                className={`${isDarkMode ? 'text-amber-400 font-bold' : 'text-orange-600 font-bold'}`}
                style={{ height: `${lineHeightPx}px` }}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Code Content Area (Overlay Container strictly sized to 14 lines) */}
        <div className="relative flex-1 h-full overflow-hidden">
          {/* Syntax Highlighted Background */}
          <pre
            ref={preRef}
            aria-hidden="true"
            className="code-editor-pre absolute inset-0 px-3 py-0 m-0 overflow-y-auto pointer-events-none z-0 whitespace-pre-wrap break-all"
            style={{ 
              fontSize: `${fontSize}px`, 
              lineHeight: `${lineHeightPx}px`,
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
            className={`absolute inset-0 w-full h-full px-3 py-0 m-0 bg-transparent text-transparent resize-none outline-none z-10 whitespace-pre-wrap break-all ${
              isDarkMode 
                ? 'caret-sky-400 selection:bg-indigo-500/40' 
                : 'caret-indigo-600 selection:bg-indigo-100'
            }`}
            style={{ 
              fontSize: `${fontSize}px`, 
              lineHeight: `${lineHeightPx}px`,
              tabSize: 4
            }}
          />
        </div>
      </div>
    </div>
  );
}
