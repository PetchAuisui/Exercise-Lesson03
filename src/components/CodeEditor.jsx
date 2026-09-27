import React, { useRef, useState, useEffect } from 'react';
import { Code2, Copy, Check, Trash2, ZoomIn, ZoomOut, Globe } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';

export default function CodeEditor({ code, onChange, onClear, onSwitchToPreview }) {
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const gutterRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(17);

  const lines = code.split('\n');
  const lineHeightPx = Math.round(fontSize * 1.55);
  // Extend code lines down comfortably so the temple image and code have plenty of room
  const minLines = 18;
  const lineCount = Math.max(lines.length, minLines);
  const totalBodyHeightPx = lineCount * lineHeightPx + 24; // +24px for top & bottom padding (py-3)

  // Auto-focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Sync scroll between textarea, syntax highlight pre, and line numbers gutter
  const handleScroll = (e) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.target.scrollTop;
      preRef.current.scrollLeft = e.target.scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.target.scrollTop;
    }
  };

  // Support Tab key for proper code indentation
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate authentic VS Code syntax highlighted HTML with Prism
  const getHighlightedHtml = () => {
    if (!code) {
      return '<span class="token comment select-none">&lt;!-- เริ่มเขียนโค้ด HTML ที่นี่ (บรรทัดที่ 1 - 14) --&gt;</span>';
    }
    const highlighted = Prism.highlight(code, Prism.languages.markup, 'markup');
    return code.endsWith('\n') ? highlighted + '\n' : highlighted;
  };

  const fontStack = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

  return (
    <div className="rounded-xl shadow-lg overflow-hidden flex flex-col border border-[#3c3c3c] bg-[#1e1e1e] code-editor-vscode w-full min-h-[540px]">
      {/* VS Code Tab Bar */}
      <div className="bg-[#252526] border-b border-[#2d2d2d] px-2 sm:px-3 pt-1.5 flex items-center justify-between text-sm flex-wrap gap-2 shrink-0">
        {/* Active File Tab */}
        <div className="flex items-center gap-1">
          <div className="bg-[#1e1e1e] border-t-2 border-t-[#007acc] text-white px-3.5 py-1.5 rounded-t flex items-center gap-2 text-xs sm:text-sm font-medium select-none shadow-xs">
            <Code2 className="w-4 h-4 text-[#e44d26] shrink-0" />
            <span className="tracking-wide">index.html</span>
            <span className="text-[11px] text-[#858585] ml-1 font-mono">
              ({lines.length}/14 บรรทัด)
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 pb-1">
          {/* Switch to Preview Button */}
          {onSwitchToPreview && (
            <button
              onClick={onSwitchToPreview}
              title="สลับไปดูผลลัพธ์หน้าเว็บ (Browser Preview)"
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded border border-indigo-500 transition flex items-center gap-1.5 text-xs font-semibold shadow-xs mr-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>ดูผลลัพธ์หน้าเว็บ (Preview)</span>
            </button>
          )}

          {/* Font Size Adjusters */}
          <div className="flex items-center rounded bg-[#333333] border border-[#3c3c3c] text-xs">
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="p-1 rounded text-[#858585] hover:text-[#cccccc] transition"
              title="ลดขนาดตัวอักษร"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] font-medium text-[#cccccc] select-none">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(22, fontSize + 2))}
              className="p-1 rounded text-[#858585] hover:text-[#cccccc] transition"
              title="เพิ่มขนาดตัวอักษร"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Copy */}
          <button
            onClick={handleCopy}
            title="คัดลอกโค้ดทั้งหมด"
            className="p-1.5 bg-[#333333] hover:bg-[#3c3c3c] text-[#cccccc] hover:text-white rounded border border-[#3c3c3c] transition text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Clear */}
          <button
            onClick={onClear}
            title="ล้างโค้ดทั้งหมดเพื่อเขียนใหม่"
            className="p-1.5 bg-[#333333] hover:bg-red-950/80 text-[#cccccc] hover:text-red-300 rounded border border-[#3c3c3c] hover:border-red-800 transition text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Body: Clean spacious coding area with at least 18+ lines */}
      <div 
        onClick={() => textareaRef.current?.focus()}
        className="flex relative bg-[#1e1e1e] flex-1 cursor-text select-text min-h-[470px]"
        style={{ height: `${totalBodyHeightPx}px` }}
      >
        {/* Line Numbers Gutter: VS Code style #858585 */}
        <div 
          ref={gutterRef}
          className="w-12 sm:w-14 py-3 select-none font-mono text-right pr-3.5 shrink-0 border-r border-[#2d2d2d] bg-[#1e1e1e] overflow-hidden"
          style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeightPx}px`, fontFamily: fontStack }}
        >
          {Array.from({ length: lineCount }).map((_, idx) => {
            const lineNum = idx + 1;
            return (
              <div 
                key={idx} 
                className="text-[#858585] font-normal"
                style={{ height: `${lineHeightPx}px` }}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Code Content Area: Exact 1:1 Overlay with Interactive Focus */}
        <div className="relative flex-1 bg-[#1e1e1e] overflow-hidden h-full">
          {/* Syntax Highlighted Background (Prism VS Code Dark+) */}
          <pre
            ref={preRef}
            aria-hidden="true"
            className="code-editor-pre absolute inset-0 p-3 m-0 overflow-hidden pointer-events-none z-0 select-none"
            style={{ 
              fontSize: `${fontSize}px`, 
              lineHeight: `${lineHeightPx}px`,
              tabSize: 2,
              fontFamily: fontStack,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
            dangerouslySetInnerHTML={{ __html: getHighlightedHtml() }}
          />

          {/* Interactive Textarea with Perfect Input Handling */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            spellCheck="false"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            autoFocus
            className="absolute inset-0 w-full h-full p-3 m-0 bg-transparent resize-none outline-none z-10 overflow-y-auto"
            style={{ 
              fontSize: `${fontSize}px`, 
              lineHeight: `${lineHeightPx}px`,
              tabSize: 2,
              fontFamily: fontStack,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              color: '#d4d4d4',
              WebkitTextFillColor: 'transparent',
              caretColor: '#569cd6',
            }}
          />
        </div>
      </div>
    </div>
  );
}

