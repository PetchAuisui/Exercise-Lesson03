import React, { useState, useEffect, useRef } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCw, ExternalLink, Image as ImageIcon, Eye, AlertCircle } from 'lucide-react';

export default function BrowserPreview({ code, pageTitle, validation }) {
  const [currentUrl, setCurrentUrl] = useState('http://localhost:3000/index.html');
  const [history, setHistory] = useState(['http://localhost:3000/index.html']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [simulateBrokenImage, setSimulateBrokenImage] = useState(false);
  const iframeRef = useRef(null);

  // Parse code for iframe
  const getProcessedHtml = () => {
    let processed = code;
    if (simulateBrokenImage) {
      // Intentionally break the image source to let student see alt text
      processed = processed.replace(/src\s*=\s*["'](?:\.\/)?temple\.jpg["']/gi, 'src="broken_temple.jpg"');
    }
    return processed;
  };

  const navigateTo = (url) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(url);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentUrl(url);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
    }
  };

  const reload = () => {
    if (iframeRef.current) {
      if (currentUrl.endsWith('detail.html')) {
        iframeRef.current.src = '/detail.html';
      } else {
        iframeRef.current.srcdoc = getProcessedHtml();
      }
    }
  };

  useEffect(() => {
    if (iframeRef.current && currentUrl.endsWith('index.html')) {
      iframeRef.current.srcdoc = getProcessedHtml();
    }
  }, [code, simulateBrokenImage, currentUrl]);

  // Intercept link clicks inside iframe
  const handleIframeLoad = () => {
    try {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentDocument) return;

      const links = iframe.contentDocument.querySelectorAll('a');
      links.forEach((a) => {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const target = a.getAttribute('href');
          if (target === 'detail.html' || target === './detail.html') {
            navigateTo('http://localhost:3000/detail.html');
          }
        });
      });
    } catch (err) {
      // cross-origin protection when loading external url
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Browser Top Window Frame */}
      <div className="bg-slate-100 border-b border-slate-200 p-2.5 space-y-2">
        {/* Window controls & Tab */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 ml-1">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
            </div>
            
            {/* Browser Tab */}
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-t-lg border-t border-l border-r border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 max-w-[240px] truncate shadow-xs">
              <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="truncate" title={pageTitle}>
                {pageTitle || 'Untitled Document'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSimulateBrokenImage(!simulateBrokenImage)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                simulateBrokenImage 
                  ? 'bg-amber-100 text-amber-900 border-amber-300' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
              title="ทดสอบแสดงผลเมื่อรูปภาพโหลดไม่ขึ้น เพื่อตรวจดูค่า alt='วัดไทย'"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>{simulateBrokenImage ? 'จำลองรูปพัง: เปิดอยู่' : 'ทดสอบตรวจ Alt Text'}</span>
            </button>
          </div>
        </div>

        {/* Address Bar & Navigation Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-slate-500">
            <button
              onClick={goBack}
              disabled={historyIndex === 0}
              className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
              title="ย้อนกลับ"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={goForward}
              disabled={historyIndex >= history.length - 1}
              className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
              title="ไปข้างหน้า"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={reload}
              className="p-1 rounded hover:bg-slate-200"
              title="โหลดใหม่"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* URL Bar */}
          <div className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs sm:text-sm text-slate-700 shadow-inner">
            <div className="flex items-center gap-2 truncate">
              <span className="text-emerald-600 font-semibold">🔒</span>
              <span className="font-mono text-slate-800 font-medium">{currentUrl}</span>
            </div>
            {currentUrl.endsWith('detail.html') && (
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
                ✓ คลิกสำเร็จ!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Simulated Browser Viewport */}
      <div className="flex-1 bg-white min-h-[360px] relative overflow-auto p-4">
        {currentUrl.endsWith('detail.html') ? (
          <div className="max-w-md mx-auto my-8 p-6 bg-white border border-slate-200 rounded-2xl shadow-lg text-center animate-fade-in">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <ExternalLink className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              เปิดหน้า detail.html สำเร็จ!
            </h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              เมื่อคลิกที่รูปภาพ <code>temple.jpg</code> ลิงก์ <code>&lt;a href="detail.html"&gt;</code> ทำงานถูกต้องตามข้อกำหนดที่ 5 แล้ว
            </p>
            <button
              onClick={() => navigateTo('http://localhost:3000/index.html')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
            >
              ← กลับไปหน้า index.html
            </button>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            title="Live Preview"
            srcDoc={getProcessedHtml()}
            onLoad={handleIframeLoad}
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full border-0 min-h-[360px]"
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-700">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">รูปภาพ:</span>
            <span className={validation.criteria[2].passed ? "text-emerald-700 font-bold" : "text-slate-600 font-medium"}>
              temple.jpg {validation.criteria[2].passed ? '✓' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">ข้อความทดแทน:</span>
            <span className={validation.criteria[3].passed ? "text-emerald-700 font-bold" : "text-slate-600 font-medium"}>
              alt="วัดไทย" {validation.criteria[3].passed ? '✓' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">ลิงก์ภาพ:</span>
            <span className={validation.criteria[4].passed ? "text-emerald-700 font-bold" : "text-slate-600 font-medium"}>
              href="detail.html" {validation.criteria[4].passed ? '✓' : ''}
            </span>
          </div>
        </div>

        {validation.isAllPassed && (
          <span className="text-emerald-600 font-bold flex items-center gap-1 text-sm">
            🎉 ยอดเยี่ยม! ผ่านเกณฑ์ครบทุกข้อ
          </span>
        )}
      </div>
    </div>
  );
}
