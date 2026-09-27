import React, { useRef, useState, useEffect } from 'react';
import { Code2, Copy, Check, Trash2, ZoomIn, ZoomOut, Globe } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';

export default function CodeEditor({ 
  code, 
  onChange, 
  onClear, 
  onSwitchToPreview,
  isLocked = false,
  onCancelSubmission
}) {
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const gutterRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) return 14;
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return 15;
    return 17;
  });

  const lines = code.split('\n');
  const lineHeightPx = Math.round(fontSize * 1.55);
  // Extend code lines down comfortably so the temple image and code have plenty of room
  const minLines = 18;
  const lineCount = Math.max(lines.length, minLines);
  const totalBodyHeightPx = lineCount * lineHeightPx + 24; // +24px for top & bottom padding (py-3)

  // Auto-focus textarea on mount if not locked
  useEffect(() => {
    if (textareaRef.current && !isLocked) {
      textareaRef.current.focus();
    }
  }, [isLocked]);

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

// HTML Void elements that do not have a closing tag
const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 
  'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

// Helper to find the most recent unclosed opening tag
function findLastUnclosedTag(text) {
  if (!text) return null;
  const clean = text.replace(/<!--[\s\S]*?-->/g, '');
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9_-]*)(?:\s+[^<>]*)?\/?>/g;
  const stack = [];
  let match;
  while ((match = tagRegex.exec(clean)) !== null) {
    const full = match[0];
    const tagName = match[1].toLowerCase();
    if (VOID_TAGS.has(tagName) || full.endsWith('/>')) continue;
    if (full.startsWith('</')) {
      if (stack.length > 0 && stack[stack.length - 1] === tagName) {
        stack.pop();
      }
    } else {
      stack.push(tagName);
    }
  }
  return stack.length > 0 ? stack[stack.length - 1] : null;
}

  // Handle advanced keystrokes: Tab, Auto-closing tags (VS Code style), and Smart Indentation
  const handleKeyDown = (e) => {
    if (isLocked) return;
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // 1. Support Tab key for 2-space indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const newValue = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newValue);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
      return;
    }

    // 2. Auto-close opening tag when typing '>' (e.g. <map> -> <map>|</map>, <div> -> <div>|</div>)
    if (e.key === '>') {
      const textBefore = code.substring(0, start);
      const match = textBefore.match(/<([a-zA-Z][a-zA-Z0-9_-]*)(?:\s+[^<>]*)?$/);
      if (match) {
        const fullTag = match[0];
        const tagName = match[1];
        const lowerTag = tagName.toLowerCase();
        
        // If not self-closing and not a void element (like <img...>, <area...>, <br>)
        if (!fullTag.trim().endsWith('/') && !VOID_TAGS.has(lowerTag)) {
          e.preventDefault();
          const closingTag = `</${tagName}>`;
          const textAfter = code.substring(end);

          // If identical closing tag isn't already immediately after cursor
          if (!textAfter.startsWith(closingTag)) {
            const newValue = code.substring(0, start) + '>' + closingTag + textAfter;
            onChange(newValue);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
              }
            }, 0);
            return;
          }
        }
      }
    }

    // 3. Auto-complete closing tag when typing '/' right after '<' (e.g. </ -> </map>)
    if (e.key === '/') {
      if (start === end && start > 0 && code[start - 1] === '<') {
        const unclosedTag = findLastUnclosedTag(code.substring(0, start - 1));
        if (unclosedTag) {
          e.preventDefault();
          const insertText = `/${unclosedTag}>`;
          const textAfter = code.substring(end);
          const newValue = code.substring(0, start) + insertText + textAfter;
          onChange(newValue);
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + insertText.length;
            }
          }, 0);
          return;
        }
      }
    }

    // 4. Smart Enter key indentation between opening and closing tags (e.g. <map>|</map> + Enter)
    if (e.key === 'Enter') {
      if (start === end && start > 0 && code[start - 1] === '>' && code.substring(end, end + 2) === '</') {
        e.preventDefault();
        const lineStart = code.lastIndexOf('\n', start - 1) + 1;
        const currentLine = code.substring(lineStart, start);
        const indentMatch = currentLine.match(/^\s*/);
        const currentIndent = indentMatch ? indentMatch[0] : '';
        const innerIndent = currentIndent + '  ';

        const insertText = '\n' + innerIndent + '\n' + currentIndent;
        const newValue = code.substring(0, start) + insertText + code.substring(end);
        onChange(newValue);
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1 + innerIndent.length;
          }
        }, 0);
        return;
      }
    }
  };

  // Textarea input handler with fallback for mobile/virtual keyboards
  const handleTextareaChange = (e) => {
    if (isLocked) return;
    const newText = e.target.value;
    const cursor = e.target.selectionStart;

    // Mobile/Touch keyboard fallback: user typed '>' after opening tag
    if (newText.length === code.length + 1 && cursor > 0 && newText[cursor - 1] === '>') {
      const textBefore = newText.substring(0, cursor - 1);
      const match = textBefore.match(/<([a-zA-Z][a-zA-Z0-9_-]*)(?:\s+[^<>]*)?$/);
      if (match) {
        const fullTag = match[0];
        const tagName = match[1];
        const lowerTag = tagName.toLowerCase();
        const textAfter = newText.substring(cursor);

        if (!fullTag.trim().endsWith('/') && !VOID_TAGS.has(lowerTag) && !textAfter.startsWith(`</${tagName}>`)) {
          const closingTag = `</${tagName}>`;
          const autoValue = newText.substring(0, cursor) + closingTag + textAfter;
          onChange(autoValue);
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = textareaRef.current.selectionEnd = cursor;
            }
          }, 0);
          return;
        }
      }
    }

    onChange(newText);
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

  const sharedEditorStyle = {
    fontSize: `${fontSize}px`,
    lineHeight: `${lineHeightPx}px`,
    tabSize: 2,
    fontFamily: fontStack,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    boxSizing: 'border-box',
    padding: '10px 10px',
    margin: 0,
    border: 0,
  };

  return (
    <div className="rounded-xl shadow-lg overflow-hidden flex flex-col border border-[#3c3c3c] bg-[#1e1e1e] code-editor-vscode w-full min-h-[500px]">
      {/* VS Code Tab Bar */}
      <div className="bg-[#252526] border-b border-[#2d2d2d] px-2 sm:px-3 pt-1.5 flex items-center justify-between text-sm flex-wrap gap-2 shrink-0">
        {/* Active File Tab */}
        <div className="flex items-center gap-1">
          <div className="bg-[#1e1e1e] border-t-2 border-t-[#007acc] text-white px-2.5 sm:px-3.5 py-1.5 rounded-t flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium select-none shadow-xs">
            <Code2 className="w-4 h-4 text-[#e44d26] shrink-0" />
            <span className="tracking-wide">index.html</span>
            <span className="text-[11px] text-[#858585] ml-0.5 sm:ml-1 font-mono">
              ({lines.length}/14 <span className="hidden sm:inline">บรรทัด</span>)
            </span>
            {isLocked && (
              <span className="ml-1 sm:ml-1.5 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <span>🔒 ล็อก</span>
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 pb-1">
          {/* Switch to Preview Button */}
          {onSwitchToPreview && (
            <button
              onClick={onSwitchToPreview}
              title="สลับไปดูผลลัพธ์หน้าเว็บ (Browser Preview)"
              className="px-2.5 sm:px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded border border-indigo-500 transition flex items-center gap-1 text-xs font-semibold shadow-xs mr-0.5 sm:mr-1 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span><span className="hidden sm:inline">ดูผลลัพธ์ </span>Preview</span>
            </button>
          )}

          {/* Font Size Adjusters */}
          <div className="flex items-center rounded bg-[#333333] border border-[#3c3c3c] text-xs">
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="p-1 rounded text-[#858585] hover:text-[#cccccc] transition cursor-pointer"
              title="ลดขนาดตัวอักษร"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] font-medium text-[#cccccc] select-none">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(22, fontSize + 2))}
              className="p-1 rounded text-[#858585] hover:text-[#cccccc] transition cursor-pointer"
              title="เพิ่มขนาดตัวอักษร"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Copy */}
          <button
            onClick={handleCopy}
            title="คัดลอกโค้ดทั้งหมด"
            className="p-1.5 bg-[#333333] hover:bg-[#3c3c3c] text-[#cccccc] hover:text-white rounded border border-[#3c3c3c] transition text-xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Clear */}
          <button
            onClick={isLocked ? undefined : onClear}
            disabled={isLocked}
            title={isLocked ? "ไม่สามารถล้างโค้ดได้เนื่องจากส่งงานแล้ว" : "ล้างโค้ดทั้งหมดเพื่อเขียนใหม่"}
            className={`p-1.5 rounded border transition text-xs ${
              isLocked 
                ? 'opacity-40 cursor-not-allowed bg-[#2a2a2a] text-[#666666] border-[#333333]' 
                : 'bg-[#333333] hover:bg-red-950/80 text-[#cccccc] hover:text-red-300 border-[#3c3c3c] hover:border-red-800 cursor-pointer'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Submission Lock Banner */}
      {isLocked && (
        <div className="bg-amber-950/70 border-b border-amber-600/50 px-3 sm:px-4 py-2 flex items-center justify-between text-xs text-amber-200 shrink-0 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <span>🔒</span> โค้ดถูกล็อกเนื่องจากส่งงานแล้ว
            </span>
            <span className="text-amber-200/80 hidden sm:inline">
              (ไม่สามารถพิมพ์แก้ไขได้จนกว่าจะกดยกเลิกการส่งงาน)
            </span>
          </div>
          {onCancelSubmission && (
            <button
              onClick={onCancelSubmission}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-md text-xs transition shadow-2xs shrink-0 cursor-pointer"
            >
              ↩️ ยกเลิกการส่งงานเพื่อแก้ไข
            </button>
          )}
        </div>
      )}

      {/* Editor Body: Clean spacious coding area with at least 18+ lines */}
      <div 
        onClick={() => !isLocked && textareaRef.current?.focus()}
        className={`flex relative bg-[#1e1e1e] flex-1 ${isLocked ? 'cursor-default' : 'cursor-text select-text'}`}
        style={{ minHeight: `${totalBodyHeightPx}px` }}
      >
        {/* Line Numbers Gutter: VS Code style #858585 */}
        <div 
          ref={gutterRef}
          className="w-9 sm:w-12 lg:w-14 py-3 select-none font-mono text-right pr-2 sm:pr-3.5 shrink-0 border-r border-[#2d2d2d] bg-[#1e1e1e] overflow-hidden"
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

        {/* Code Content Area: Pre in normal flow dictates height, Textarea overlays exactly */}
        <div 
          className="relative flex-1 bg-[#1e1e1e] overflow-x-auto"
          style={{ minHeight: `${totalBodyHeightPx}px` }}
        >
          {/* Syntax Highlighted Background (Prism VS Code Dark+) in normal flow */}
          <pre
            ref={preRef}
            aria-hidden="true"
            className="code-editor-pre pointer-events-none select-none relative"
            style={{ 
              ...sharedEditorStyle,
              minHeight: `${totalBodyHeightPx}px`,
              background: 'transparent',
            }}
            dangerouslySetInnerHTML={{ __html: getHighlightedHtml() + '<br />' }}
          />

          {/* Interactive Textarea with transparent text overlay so colored text shines through */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            readOnly={isLocked}
            spellCheck="false"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            autoFocus={!isLocked}
            className={`code-editor-textarea absolute top-0 left-0 w-full h-full bg-transparent resize-none outline-none z-10 ${
              isLocked ? 'cursor-default select-text' : ''
            }`}
            style={{ 
              ...sharedEditorStyle,
              color: '#d4d4d4',
              WebkitTextFillColor: 'transparent',
              caretColor: isLocked ? 'transparent' : '#569cd6',
            }}
          />
        </div>
      </div>
    </div>
  );
}

