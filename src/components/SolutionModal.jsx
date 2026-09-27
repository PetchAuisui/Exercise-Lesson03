import React from 'react';
import { X, Check, Copy, ArrowRight, Lightbulb } from 'lucide-react';
import { SAMPLE_SOLUTION } from '../utils/htmlValidator';

export default function SolutionModal({ isOpen, onClose, onApplySolution }) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SAMPLE_SOLUTION);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                เฉลยและแนวทางการตอบ: ใบงานที่ 1
              </h3>
              <p className="text-xs text-slate-500">
                วิเคราะห์โครงสร้างโค้ดตามเงื่อนไขข้อ 1 ถึง 5
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-base">
          
          {/* Explanation Cards */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              การวิเคราะห์เงื่อนไข 5 ข้อ:
            </h4>
            <div className="grid gap-3 text-sm sm:text-base">
              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5">
                <span className="font-bold text-indigo-700 shrink-0">ข้อ 1:</span>
                <div>
                  <strong>โครงสร้างพื้นฐาน:</strong> ต้องมี <code>&lt;!DOCTYPE html&gt;</code>, <code>&lt;html&gt;</code>, <code>&lt;head&gt;</code>, <code>&lt;title&gt;</code>, <code>&lt;body&gt;</code> ครบถ้วน
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5">
                <span className="font-bold text-indigo-700 shrink-0">ข้อ 2:</span>
                <div>
                  <strong>ชื่อหน้าเว็บ:</strong> ใส่ไว้ในแท็ก <code>&lt;title&gt;สถานที่ท่องเที่ยว&lt;/title&gt;</code> ภายใน <code>&lt;head&gt;</code>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5">
                <span className="font-bold text-indigo-700 shrink-0">ข้อ 3 & 4:</span>
                <div>
                  <strong>แท็กรูปภาพ &amp; ข้อความทดแทน:</strong> ใช้แท็ก <code>&lt;img src="temple.jpg" alt="วัดไทย"&gt;</code>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5">
                <span className="font-bold text-indigo-700 shrink-0">ข้อ 5:</span>
                <div>
                  <strong>ทำรูปภาพให้คลิกได้:</strong> นำแท็ก <code>&lt;a href="detail.html"&gt;</code> มาครอบแท็ก <code>&lt;img&gt;</code> ไว้
                </div>
              </div>
            </div>
          </div>

          {/* Code Solution */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 text-sm sm:text-base">โค้ดตัวอย่างที่สมบูรณ์:</span>
              <button
                onClick={handleCopy}
                className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-semibold"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl font-code text-sm sm:text-base overflow-x-auto leading-relaxed border border-slate-800">
              <code>{SAMPLE_SOLUTION}</code>
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            ปิด
          </button>
          <button
            onClick={() => {
              onApplySolution();
              onClose();
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow flex items-center gap-1.5 transition"
          >
            <span>นำโค้ดเฉลยไปใส่ในตัวแก้ไข</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
