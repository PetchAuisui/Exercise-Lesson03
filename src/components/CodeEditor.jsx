import React, { useRef, useEffect } from 'react';
import { Code2, Sparkles, Copy, Check, Trash2 } from 'lucide-react';

export default function CodeEditor({ code, onChange, onFormat, onClear }) {
  const textareaRef = useRef(null);
  const [copied, setCopied] = React.useState(false);

  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 14);

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Top Bar */}
      <div className="px-4 py-2.5 bg-slate-900 text-slate-200 flex items-center justify-between border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-slate-100">index.html (พื้นที่เขียนโค้ด)</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
            {lines.length} / 14 บรรทัด
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onFormat}
            title="จัดรูปแบบโค้ดอัตโนมัติ"
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition flex items-center gap-1 text-[11px]"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span className="hidden sm:inline">จัดระเบียบโค้ด</span>
          </button>

          <button
            onClick={handleCopy}
            title="คัดลอกโค้ด"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition text-[11px]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClear}
            title="ล้างโค้ดทั้งหมด"
            className="p-1.5 bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-300 rounded transition text-[11px]"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Insert Snippet Chips */}
      <div className="px-3 py-1.5 bg-slate-800/90 border-b border-slate-700 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-400 text-[10px] whitespace-nowrap">คีย์ลัดแท็ก:</span>
        <button 
          onClick={() => insertSnippet('<!DOCTYPE html>\n')}
          className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-amber-200 rounded font-code transition whitespace-nowrap"
        >
          &lt;!DOCTYPE html&gt;
        </button>
        <button 
          onClick={() => insertSnippet('<html>\n\n</html>')}
          className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-sky-200 rounded font-code transition whitespace-nowrap"
        >
          &lt;html&gt;
        </button>
        <button 
          onClick={() => insertSnippet('<head>\n    <title>สถานที่ท่องเที่ยว</title>\n</head>')}
          className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-emerald-200 rounded font-code transition whitespace-nowrap"
        >
          &lt;head&gt;+&lt;title&gt;
        </button>
        <button 
          onClick={() => insertSnippet('<body>\n    \n</body>')}
          className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-purple-200 rounded font-code transition whitespace-nowrap"
        >
          &lt;body&gt;
        </button>
        <button 
          onClick={() => insertSnippet('<a href="detail.html"></a>')}
          className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-pink-200 rounded font-code transition whitespace-nowrap"
        >
          &lt;a href="..."&gt;
        </button>
        <button 
          onClick={() => insertSnippet('<img src="temple.jpg" alt="วัดไทย">')}
          className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-yellow-200 rounded font-code transition whitespace-nowrap"
        >
          &lt;img ...&gt;
        </button>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden bg-slate-950 font-code text-xs sm:text-sm relative">
        {/* Line Numbers with orange accent like the paper worksheet */}
        <div className="w-12 bg-slate-900/90 py-3 select-none text-slate-500 font-mono text-right pr-3 border-r border-slate-800 shrink-0">
          {Array.from({ length: lineCount }).map((_, idx) => {
            const lineNum = idx + 1;
            const isTargetRange = lineNum <= 14;
            return (
              <div 
                key={idx} 
                className={`leading-6 h-6 ${
                  isTargetRange ? 'text-amber-500/80 font-semibold' : 'text-slate-600'
                }`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          placeholder="เริ่มเขียนโค้ด HTML ที่นี่ด้วยตนเองตั้งแต่บรรทัดที่ 1 (เช่น <!DOCTYPE html>...)"
          spellCheck="false"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className="flex-1 p-3 bg-transparent text-slate-100 font-code resize-none outline-none leading-6 h-full min-h-[360px] overflow-y-auto selection:bg-indigo-500/40"
        />
      </div>

      {/* Footer Info */}
      <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>เส้นบรรทัด 1 - 14 สอดคล้องกับกรอบพื้นที่เขียนโค้ดในใบงาน</span>
        <span className="text-amber-400/90 font-medium">Basic Website Design</span>
      </div>
    </div>
  );
}
