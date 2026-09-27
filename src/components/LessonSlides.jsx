import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  ArrowRight, 
  FileText, 
  Maximize2, 
  Minimize2,
  ExternalLink,
  Laptop,
  Lock,
  Unlock
} from 'lucide-react';

export default function LessonSlides({ 
  onGoToExercise, 
  isModal = false, 
  onCloseModal,
  canAccessExercise = false 
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const totalSlides = 12;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !e.target.closest('button'))) {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape' && isModal && onCloseModal) {
        onCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides, isModal, onCloseModal]);

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const slideImagePath = `./slides/slide-${currentSlide + 1}.png`;

  return (
    <div className={`flex flex-col ${isModal ? 'max-w-6xl w-full h-[92vh]' : 'min-h-screen'} bg-slate-950 text-slate-100 select-none`}>
      {/* Top Slide Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 rounded-xl font-bold shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                เอกสารประกอบการสอน (Slide Presentation)
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                PDF แท้ 12 หน้า
              </span>
            </div>
            <p className="text-xs text-slate-400">
              บทเรียนที่ 3: การแทรกรูปภาพและสร้างลิงก์เชื่อมโยงหน้าเว็บเพจ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Link to Raw PDF */}
          <a
            href="./lesson03_slides.pdf"
            target="_blank"
            rel="noopener noreferrer"
            title="เปิดไฟล์ PDF ต้นฉบับในแท็บใหม่"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">เปิดไฟล์ PDF เต็ม</span>
          </a>

          {/* Slide Indicator */}
          <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono font-bold text-amber-300">
            {currentSlide + 1} / {totalSlides}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "ออกจากเต็มจอ" : "เต็มจอ"}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition hidden sm:inline-flex cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Go to Exercise CTA Button (Appears only when unlocked by teacher) */}
          {canAccessExercise ? (
            <button
              onClick={onGoToExercise}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <span>ไปทำแบบฝึกหัด</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div 
              title="อาจารย์ยังไม่ได้ปลดล็อกแบบฝึกหัด กรุณาศึกษาเอกสารประกอบการสอนระหว่างรอ"
              className="px-3 py-1.5 bg-slate-800 text-amber-300/90 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-amber-500/30 select-none shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">แบบฝึกหัด: </span>
              <span>รออาจารย์ปลดล็อก</span>
            </div>
          )}

          {isModal && onCloseModal && (
            <button
              onClick={onCloseModal}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              ปิด
            </button>
          )}
        </div>
      </header>

      {/* Main Slide Viewer: High-Res Rendered PDF Slide */}
      <main className="flex-1 p-2 sm:p-4 lg:p-6 flex items-center justify-center overflow-hidden relative bg-slate-950">
        <div className="relative w-full max-w-5xl h-full flex flex-col items-center justify-center">
          
          {/* Slide Image Box */}
          <div 
            onClick={nextSlide}
            title="คลิกที่สไลด์เพื่อไปยังหน้าถัดไป"
            className="relative w-full max-h-[80vh] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 cursor-pointer group"
          >
            <img
              src={slideImagePath}
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-auto max-h-[78vh] object-contain block mx-auto transition-transform duration-200"
            />

            {/* Click next hint overlay on hover */}
            {currentSlide < totalSlides - 1 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition p-2 bg-slate-900/80 backdrop-blur-xs text-white rounded-full border border-white/20 shadow-lg">
                <ChevronRight className="w-6 h-6 text-amber-400" />
              </div>
            )}

            {currentSlide > 0 && (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition p-2 bg-slate-900/80 backdrop-blur-xs text-white rounded-full border border-white/20 shadow-lg cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 text-amber-400" />
              </div>
            )}
          </div>

          {/* Action card for the final slide (Slide 12) */}
          {currentSlide === totalSlides - 1 && (
            <div className="mt-4 p-4 rounded-2xl shadow-xl w-full max-w-3xl flex items-center justify-between gap-4 flex-wrap border transition-all animate-fade-in bg-slate-900/95 border-slate-800">
              {canAccessExercise ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">อ่านสไลด์ครบ 12 หน้าเรียบร้อยแล้ว!</h4>
                      <p className="text-xs text-emerald-300">
                        อาจารย์ปลดล็อกแบบฝึกหัดแล้ว สามารถเริ่มลงมือเขียนโค้ดได้เลย
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="https://petchauisui.github.io/HTML-GuideWeb/lesson3.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-emerald-200 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>คู่มือเว็บ</span>
                    </a>
                    <button
                      onClick={onGoToExercise}
                      className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm transition shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>เริ่มทำแบบฝึกหัดทันที ➔</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">ศึกษาเอกสารครบทั้ง 12 หน้าแล้ว</h4>
                      <p className="text-xs text-amber-300">
                        กรุณารออาจารย์ผู้สอนปลดล็อกแบบฝึกหัด (เมื่อปลดล็อก ปุ่มจะปรากฏขึ้นทันที)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="https://petchauisui.github.io/HTML-GuideWeb/lesson3.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-indigo-200 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>คู่มือบทเรียน</span>
                    </a>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Bottom Navigation Toolbar */}
      <footer className="bg-slate-900 border-t border-slate-800 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shrink-0 gap-2">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="px-3.5 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">หน้าก่อนหน้า</span>
          <span className="sm:hidden">ก่อนหน้า</span>
        </button>

        {/* Slide Progress Thumbnails / Dots */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[60%] py-1 px-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              title={`สไลด์หน้า ${idx + 1}`}
              className={`h-2 sm:h-2.5 rounded-full transition-all cursor-pointer ${
                currentSlide === idx 
                  ? 'w-7 sm:w-8 bg-amber-400 shadow-xs' 
                  : 'w-2 sm:w-2.5 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        {currentSlide < totalSlides - 1 ? (
          <button
            onClick={nextSlide}
            className="px-3.5 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <span className="hidden sm:inline">หน้าถัดไป</span>
            <span className="sm:hidden">ถัดไป</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : canAccessExercise ? (
          <button
            onClick={onGoToExercise}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <span>ไปทำแบบฝึกหัด</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div 
            title="รออาจารย์ผู้สอนปลดล็อกแบบฝึกหัด"
            className="px-3.5 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 border border-slate-700 select-none"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>รออาจารย์ปลดล็อก</span>
          </div>
        )}
      </footer>
    </div>
  );
}
