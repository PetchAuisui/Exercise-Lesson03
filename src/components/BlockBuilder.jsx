import React, { useState, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import { ArrowUp, ArrowDown, X, Plus, Trash2, Globe, Lock, GripVertical, Lightbulb } from 'lucide-react';

// Every block is one line of HTML. Some blocks are intentionally wrong (distractors),
// so students must read each tag/attribute and understand it before using it.
const BLOCKS = [
  { id: 'img', text: '<img src="image/temple.jpg" alt="วัดไทย">' },
  { id: 'html-close', text: '</html>' },
  { id: 'bad-title', text: '<title>หน้าแรก</title>' },
  { id: 'a-open', text: '<a href="detail.html">' },
  { id: 'head-open', text: '<head>' },
  { id: 'bad-img-path', text: '<img src="temple.png" alt="วัดไทย">' },
  { id: 'body-close', text: '</body>' },
  { id: 'doctype', text: '<!DOCTYPE html>' },
  { id: 'bad-a', text: '<a src="detail.html">' },
  { id: 'title', text: '<title>สถานที่ท่องเที่ยว</title>' },
  { id: 'body-open', text: '<body>' },
  { id: 'head-close', text: '</head>' },
  { id: 'bad-alt', text: '<img src="image/temple.jpg" alt="รูปวัด">' },
  { id: 'a-close', text: '</a>' },
  { id: 'html-open', text: '<html>' },
  { id: 'bad-link', text: '<link href="detail.html">' },
  { id: 'h1', text: '<h1>แนะนำวัดไทย</h1>' },
  { id: 'bad-h2', text: '<h2>แนะนำวัดไทย</h2>' },
  { id: 'bad-h1', text: '<h1>ยินดีต้อนรับ</h1>' },
];

const BLOCK_MAP = Object.fromEntries(BLOCKS.map(b => [b.id, b]));
const highlight = (text) => Prism.highlight(text, Prism.languages.markup, 'markup');
const INDENT = '    ';
const OPENING_CONTAINER = /^<(html|head|body|a)(\s[^>]*)?>$/i;

const storageKey = (studentId) => `ws_blocks_${studentId}`;

export function loadBlockIds(studentId) {
  try {
    const raw = localStorage.getItem(storageKey(studentId));
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids.filter(id => BLOCK_MAP[id]) : [];
  } catch {
    return [];
  }
}

// Build indented HTML from the ordered block ids
export function buildCodeFromBlocks(ids) {
  let depth = 0;
  return ids.map((id) => {
    const text = BLOCK_MAP[id].text;
    if (text.startsWith('</')) depth = Math.max(0, depth - 1);
    const line = INDENT.repeat(depth) + text;
    if (OPENING_CONTAINER.test(text)) depth += 1;
    return line;
  }).join('\n');
}

export default function BlockBuilder({
  studentId,
  code,
  onChange,
  onSwitchToPreview,
  isLocked = false,
  onCancelSubmission,
}) {
  const [selected, setSelected] = useState(() => loadBlockIds(studentId));
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const listRef = useRef(null);

  const update = (next) => {
    setSelected(next);
    try {
      localStorage.setItem(storageKey(studentId), JSON.stringify(next));
    } catch { /* ignore */ }
    onChange(buildCodeFromBlocks(next));
  };

  const available = BLOCKS.filter(b => !selected.includes(b.id));

  const addBlock = (id) => {
    if (isLocked) return;
    update([...selected, id]);
  };

  const removeBlock = (index) => {
    if (isLocked) return;
    update(selected.filter((_, i) => i !== index));
  };

  const moveBlock = (from, to) => {
    if (isLocked || to < 0 || to >= selected.length || from === to) return;
    const next = [...selected];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    update(next);
  };

  const clearAll = () => {
    if (isLocked || selected.length === 0) return;
    if (window.confirm('ต้องการล้างบล็อกที่เรียงไว้ทั้งหมดใช่หรือไม่?')) update([]);
  };

  // Typed code exists that was not produced by the blocks: warn before it gets replaced
  const hasForeignCode = code.trim() !== '' && code !== buildCodeFromBlocks(selected);

  const preview = buildCodeFromBlocks(selected);
  const lines = preview ? preview.split('\n') : [];

  return (
    <div className="rounded-xl shadow-lg overflow-hidden border border-slate-200 bg-white w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-3 sm:px-4 py-2.5 bg-slate-900 text-white">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-amber-400 text-lg leading-none shrink-0">🧩</span>
          <span className="font-bold text-sm sm:text-base truncate">จัดเรียงบล็อกโค้ด (index.html)</span>
          {isLocked && <Lock className="w-4 h-4 text-amber-300 shrink-0" />}
        </div>
        <div className="flex items-center gap-2">
          {!isLocked && (
            <button
              onClick={clearAll}
              disabled={selected.length === 0}
              className="px-2.5 py-1.5 text-sm font-semibold rounded-lg bg-slate-700 hover:bg-rose-600 disabled:opacity-40 disabled:hover:bg-slate-700 flex items-center gap-1 transition cursor-pointer disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้าง</span>
            </button>
          )}
          <button
            onClick={onSwitchToPreview}
            className="px-2.5 py-1.5 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 flex items-center gap-1 transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>ดูผลลัพธ์</span>
          </button>
        </div>
      </div>

      {isLocked && (
        <div className="px-3 sm:px-4 py-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs sm:text-sm font-medium flex items-center justify-between gap-2 flex-wrap">
          <span>🔒 ส่งงานแล้ว ไม่สามารถแก้ไขบล็อกได้</span>
          {onCancelSubmission && (
            <button
              onClick={onCancelSubmission}
              className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg text-xs font-bold cursor-pointer"
            >
              ↩️ ยกเลิกส่งงานเพื่อแก้ไข
            </button>
          )}
        </div>
      )}

      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 bg-slate-50">
        <div className="flex items-start gap-2 text-sm sm:text-base text-slate-600 bg-sky-50 border border-sky-200 rounded-lg px-3 py-2.5">
          <Lightbulb className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <p className="font-bold text-sky-900">วิธีทำ</p>
            <ol className="list-decimal list-inside space-y-1 text-slate-700">
              <li>อ่านโจทย์ทั้ง 6 ข้อด้านบนให้เข้าใจก่อน</li>
              <li>แตะ <b>บล็อกโค้ด</b> ในกล่องซ้าย เพื่อเลือกมาใช้ (บล็อกจะย้ายไปอยู่ในกล่อง "หน้าเว็บของคุณ")</li>
              <li>เรียงลำดับบล็อกให้ถูกต้อง ลากสลับตำแหน่ง หรือกดปุ่ม ↑ ↓ ได้ กด ✕ เพื่อเอาบล็อกออก</li>
              <li>กดปุ่ม <b>"ดูผลลัพธ์"</b> เพื่อทดสอบ แล้วกด <b>"ส่งงาน"</b> เมื่อมั่นใจ</li>
            </ol>
            <p className="text-amber-900 bg-amber-50 border border-amber-200 rounded-md px-2 py-1">
              ⚠️ <b>ระวัง:</b> มีบล็อกที่เขียน<b>ผิด</b>ปนอยู่ (เช่น แท็กผิด ชื่อไฟล์ผิด ข้อความผิด) ต้องอ่านให้ละเอียดแล้วเลือกเฉพาะบล็อกที่ตรงกับโจทย์
            </p>
          </div>
        </div>

        {hasForeignCode && !isLocked && (
          <div className="text-xs sm:text-sm text-amber-900 bg-amber-50 border border-amber-300 rounded-lg px-3 py-2">
            ⚠️ มีโค้ดที่พิมพ์ไว้ในโหมดเขียนโค้ด การเลือกบล็อกจะแทนที่โค้ดนั้น
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Palette */}
          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-700 mb-2">
              บล็อกที่เลือกได้ ({available.length})
            </h3>
            <div className="flex flex-wrap gap-2 p-2.5 sm:p-3 bg-white border-2 border-dashed border-slate-300 rounded-xl min-h-[80px]">
              {available.length === 0 && (
                <p className="text-xs sm:text-sm text-slate-400 m-auto">ใช้บล็อกครบแล้ว</p>
              )}
              {available.map(b => (
                <button
                  key={b.id}
                  onClick={() => addBlock(b.id)}
                  disabled={isLocked}
                  className="max-w-full px-2.5 py-2 bg-[#1e1e1e] hover:bg-[#2a2d2e] active:bg-[#37373d] border border-slate-600 hover:border-amber-400 rounded-lg font-mono text-sm sm:text-base lg:text-lg text-left break-all flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span
                    className="code-editor-pre"
                    dangerouslySetInnerHTML={{ __html: highlight(b.text) }}
                  />
                </button>
              ))}
            </div>
          </section>

          {/* Answer */}
          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-700 mb-2">
              หน้าเว็บของคุณ ({selected.length} บรรทัด)
            </h3>
            <div
              ref={listRef}
              className="p-2.5 sm:p-3 bg-[#1e1e1e] rounded-xl min-h-[80px] space-y-1.5"
            >
              {selected.length === 0 && (
                <p className="text-xs sm:text-sm text-slate-500 text-center py-4">
                  ยังไม่มีบล็อก — แตะบล็อกทางซ้าย/ด้านบนเพื่อเริ่มต้น
                </p>
              )}
              {selected.map((id, i) => (
                <div
                  key={id}
                  draggable={!isLocked}
                  onDragStart={() => setDragIndex(i)}
                  onDragOver={(e) => { e.preventDefault(); setOverIndex(i); }}
                  onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragIndex !== null) moveBlock(dragIndex, i);
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  className={`flex items-center gap-1.5 sm:gap-2 rounded-lg border px-1.5 sm:px-2 py-1.5 transition ${
                    overIndex === i && dragIndex !== null && dragIndex !== i
                      ? 'border-amber-400 bg-slate-700'
                      : 'border-slate-700 bg-slate-800'
                  } ${dragIndex === i ? 'opacity-40' : ''}`}
                >
                  <GripVertical className={`w-4 h-4 shrink-0 ${isLocked ? 'text-slate-700' : 'text-slate-500 cursor-grab'}`} />
                  <span className="w-5 text-right text-xs text-slate-500 font-mono shrink-0">{i + 1}</span>
                  <code
                    className="code-editor-pre flex-1 min-w-0 font-mono text-sm sm:text-base lg:text-lg"
                    style={{ paddingLeft: `${(lines[i].length - lines[i].trimStart().length) / INDENT.length * 0.75}rem` }}
                    dangerouslySetInnerHTML={{ __html: highlight(lines[i].trimStart()) }}
                  />
                  {!isLocked && (
                    <div className="flex items-center shrink-0">
                      <button
                        onClick={() => moveBlock(i, i - 1)}
                        disabled={i === 0}
                        title="เลื่อนขึ้น"
                        className="p-1.5 text-slate-300 hover:text-white disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveBlock(i, i + 1)}
                        disabled={i === selected.length - 1}
                        title="เลื่อนลง"
                        className="p-1.5 text-slate-300 hover:text-white disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeBlock(i)}
                        title="เอาออก"
                        className="p-1.5 text-rose-400 hover:text-rose-300 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
