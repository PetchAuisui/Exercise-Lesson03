import React, { useState } from 'react';
import { X, Code2, Globe, CheckCircle2, XCircle, Copy, Check, User, Calendar, ExternalLink, KeyRound } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';

export default function StudentDetailModal({ student, isOpen, onClose, onResetPassword }) {
  const [activeTab, setActiveTab] = useState('code'); // 'code' | 'preview' | 'criteria'
  const [copied, setCopied] = useState(false);

  if (!isOpen || !student) return null;

  const handleCopyCode = () => {
    if (!student.code) return;
    navigator.clipboard.writeText(student.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getHighlightedHtml = () => {
    if (!student.code) {
      return '<span class="text-slate-500 italic">&lt;!-- นักศึกษายังไม่ได้พิมพ์โค้ดในระบบ --&gt;</span>';
    }
    return Prism.highlight(student.code, Prism.languages.markup, 'markup');
  };

  const lines = (student.code || '').split('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-fade-in no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/80 border border-indigo-400/30 flex items-center justify-center font-bold text-base">
              <User className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-base sm:text-lg text-white">
                  {student.name}
                </span>
                <span className="px-2 py-0.5 rounded-md font-mono text-xs font-semibold bg-white/10 text-indigo-300 border border-white/10">
                  {student.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  student.status === 'เสร็จสมบูรณ์'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : student.status === 'กำลังทำ'
                    ? 'bg-sky-950 text-sky-300 border-sky-700'
                    : student.status === 'ยังไม่ทำ'
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {student.status}
                </span>
                {student.isSubmitted ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                    🔒 ส่งงานแล้ว
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border bg-slate-800 text-slate-400 border-slate-700">
                    📝 ยังไม่ส่งงาน
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  อัปเดตล่าสุด: {student.lastUpdated ? new Date(student.lastUpdated).toLocaleString('th-TH') : 'ยังไม่มีข้อมูล'}
                </span>
                {student.submittedAt && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-300 font-semibold">
                      เวลาส่งงาน: {new Date(student.submittedAt).toLocaleString('th-TH')}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="text-amber-300 font-semibold">
                  คะแนนที่ได้: {student.score} / {student.totalCount} ข้อ ({student.scorePercent}%)
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onResetPassword && (
              <button
                onClick={() => onResetPassword(student)}
                title="รีเซ็ตรหัสผ่านของนักเรียนคนนี้กลับเป็นค่าเริ่มต้น"
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl border border-amber-500/40 transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>รีเซ็ตรหัสผ่าน</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
              title="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 sm:px-6 pt-2 sm:pt-3 flex items-center justify-between flex-wrap gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-t-lg font-bold text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 border-t border-x transition shrink-0 ${
                activeTab === 'code'
                  ? 'bg-white text-indigo-700 border-slate-200 shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
              <span><span className="hidden sm:inline">โค้ด HTML ที่ส่ง</span><span className="sm:hidden">โค้ด</span> ({lines.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-t-lg font-bold text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 border-t border-x transition shrink-0 ${
                activeTab === 'preview'
                  ? 'bg-white text-indigo-700 border-slate-200 shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500" />
              <span><span className="hidden sm:inline">ผลลัพธ์หน้าเว็บ</span><span className="sm:hidden">ผลลัพธ์</span> (Preview)</span>
            </button>

            <button
              onClick={() => setActiveTab('criteria')}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-t-lg font-bold text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 border-t border-x transition shrink-0 ${
                activeTab === 'criteria'
                  ? 'bg-white text-indigo-700 border-slate-200 shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
              <span><span className="hidden sm:inline">ผลการตรวจ 5 ข้อ</span><span className="sm:hidden">ตรวจ</span> ({student.score}/5)</span>
            </button>
          </div>

          {activeTab === 'code' && student.code && (
            <button
              onClick={handleCopyCode}
              className="mb-1.5 px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด'}</span>
            </button>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* 1. Code View */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              {!student.code ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                  <Code2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-600 font-semibold text-sm">นักศึกษายังไม่ได้เริ่มเขียนโค้ดในระบบ</p>
                  <p className="text-slate-400 text-xs mt-1">สถานะปัจจุบัน: {student.status}</p>
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden border border-slate-800 shadow-lg bg-[#1e1e1e]">
                  <div className="bg-[#252526] px-4 py-2 border-b border-[#2d2d2d] flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-[#d4d4d4]">index.html</span>
                    <span>{lines.length} บรรทัด • {student.code.length} ตัวอักษร</span>
                  </div>
                  <pre 
                    className="code-editor-pre p-4 m-0 overflow-x-auto text-sm leading-relaxed"
                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
                    dangerouslySetInnerHTML={{ __html: getHighlightedHtml() }}
                  />
                </div>
              )}
            </div>
          )}

          {/* 2. Browser Preview */}
          {activeTab === 'preview' && (
            <div className="space-y-3">
              {!student.code ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                  <Globe className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-600 font-semibold text-sm">ไม่มีโค้ดสำหรับแสดงผลหน้าเว็บ</p>
                  <p className="text-slate-400 text-xs mt-1">เนื่องจากนักศึกษายังไม่ได้พิมพ์โค้ด</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-300 shadow-md overflow-hidden">
                  <div className="bg-slate-200 px-4 py-2.5 border-b border-slate-300 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="flex-1 max-w-sm mx-auto bg-white px-3 py-1 rounded-md text-xs text-slate-600 font-mono truncate text-center border border-slate-300">
                      https://student-work.local/{student.id}/index.html
                    </div>
                  </div>
                  
                  {/* Raw Iframe / Sandbox Preview */}
                  <div className="p-6 bg-white min-h-[360px] overflow-auto">
                    <iframe
                      title={`preview-${student.id}`}
                      srcDoc={student.code}
                      className="w-full min-h-[340px] border-0"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Criteria Checklist Breakdown */}
          {activeTab === 'criteria' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm mb-3">
                ผลการประเมินตามเกณฑ์ใบงานที่ 1 (5 ข้อ):
              </h4>
              <div className="grid gap-3">
                {student.validation.criteria.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border flex items-start gap-3 transition ${
                      item.passed
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {item.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm">
                          ข้อ {idx + 1}: {item.title}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          item.passed
                            ? 'bg-emerald-200/60 text-emerald-800'
                            : 'bg-rose-100 text-rose-700'
                        }`}>
                          {item.passed ? 'ผ่าน' : 'ยังไม่ผ่าน'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            รหัสนักศึกษา: <strong className="font-mono text-slate-800">{student.id}</strong> • {student.name}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
}
