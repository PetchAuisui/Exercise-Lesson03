import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Code2, 
  Globe, 
  ExternalLink, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Eye, 
  Lightbulb, 
  Laptop,
  Image as ImageIcon,
  Link as LinkIcon,
  Maximize2,
  Minimize2,
  Share2
} from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';

export default function LessonSlides({ onGoToExercise, isModal = false, onCloseModal }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);
  const [simulateBrokenImage, setSimulateBrokenImage] = useState(false);
  const totalSlides = 14;

  // Keyboard navigation (Arrow keys, Space)
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

  // Render authentic slide content
  const renderSlideContent = () => {
    switch (currentSlide) {
      // Slide 1: Cover
      case 0:
        return (
          <div className="flex flex-col items-center justify-center text-center h-full px-4 sm:px-12 py-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-amber-950 text-white rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs sm:text-sm font-bold mb-6 tracking-wide shadow-sm animate-fade-in">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Basic Website Design • บทเรียนที่ 3</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight max-w-4xl tracking-tight mb-6">
              การแทรกรูปภาพและสร้างลิงก์<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
                เชื่อมโยงหน้าเว็บเพจ
              </span>
            </h1>

            <div className="flex items-center gap-3 flex-wrap justify-center font-mono text-xs sm:text-sm text-slate-300 mb-10">
              <span className="px-3 py-1 bg-white/10 rounded-lg border border-white/10">&lt;img&gt;</span>
              <span className="text-slate-500">•</span>
              <span className="px-3 py-1 bg-white/10 rounded-lg border border-white/10">&lt;a&gt;</span>
              <span className="text-slate-500">•</span>
              <span className="px-3 py-1 bg-white/10 rounded-lg border border-white/10">src</span>
              <span className="text-slate-500">•</span>
              <span className="px-3 py-1 bg-white/10 rounded-lg border border-white/10">alt</span>
              <span className="text-slate-500">•</span>
              <span className="px-3 py-1 bg-white/10 rounded-lg border border-white/10">href</span>
            </div>

            <button
              onClick={nextSlide}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-2xl text-sm sm:text-base flex items-center gap-2 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>เริ่มเรียนรู้บทเรียน</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        );

      // Slide 2: Observation & Motivation
      case 1:
        return (
          <div className="flex flex-col h-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-2">
                <span>จุดเริ่มต้นการเรียนรู้</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-4">
                อะไรทำให้หน้าเว็บนี้น่าสนใจกว่าข้อความธรรมดา?
              </h2>
            </div>

            {/* Mockup browser */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-auto items-center">
              <div className="lg:col-span-2 rounded-2xl border border-slate-300 shadow-md overflow-hidden bg-slate-50">
                <div className="bg-slate-200 px-3 py-2 border-b border-slate-300 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <span className="bg-white px-3 py-0.5 rounded text-[11px] font-mono text-slate-600 border border-slate-200">
                    My Travel • 127.0.0.1:5500/index.html
                  </span>
                </div>
                
                {/* Simulated Webpage Body */}
                <div className="p-4 sm:p-6 bg-white space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 text-white min-h-[160px] flex items-center p-6 bg-gradient-to-r from-sky-900 to-indigo-900">
                    <div>
                      <h4 className="text-lg sm:text-xl font-black">เที่ยวธรรมชาติ ใกล้ตัวคุณ</h4>
                      <p className="text-xs text-slate-200 mt-1">ค้นพบสถานที่สวยงาม ทริปใหม่ๆ และแรงบันดาลใจในการเดินทาง</p>
                      <button className="mt-3 px-3 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow">
                        สำรวจเพิ่มเติม →
                      </button>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-xs text-slate-700 mb-2">สถานที่แนะนำ:</h5>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-16 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-[11px] font-bold text-emerald-800">
                        🏞️ ภูเขา & ทะเลหมอก
                      </div>
                      <div className="h-16 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center text-[11px] font-bold text-sky-800">
                        🌊 ทะเล & ชายหาด
                      </div>
                      <div className="h-16 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-[11px] font-bold text-indigo-800">
                        🏯 วัด & วัฒนธรรม
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observation Box */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 text-slate-800 shadow-sm flex flex-col justify-center">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold mb-3 shadow-xs">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-amber-950 mb-2">
                  ลองสังเกต!
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  หน้าเว็บนี้น่าสนใจเพราะมี <strong>รูปภาพที่สวยงาม</strong> ดึงดูดสายตา และมี <strong>ลิงก์ที่สามารถคลิกเพื่อพาไปหน้าอื่นได้</strong> ทันที!
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-400 text-right">
              สไลด์ 2 / {totalSlides}
            </div>
          </div>
        );

      // Slide 3: <img> Tag Introduction
      case 2:
        return (
          <div className="flex flex-col h-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2 border border-indigo-200">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>การแทรกรูปภาพ</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2">
                การแทรกรูปภาพด้วยแท็ก <span className="font-mono text-indigo-600">&lt;img&gt;</span>
              </h2>
            </div>

            <div className="space-y-6 my-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-3">1</div>
                  <h4 className="font-bold text-slate-900 mb-1 text-base">หน้าที่ของแท็ก</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    ใช้สำหรับแทรกและแสดงผลรูปภาพลงในหน้าเว็บเพจ (เช่น .jpg, .png, .gif, .svg, .webp)
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm mb-3">2</div>
                  <h4 className="font-bold text-slate-900 mb-1 text-base">ลักษณะการเขียน</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    เป็น <strong>แท็กเดี่ยว (Empty tag)</strong> ไม่จำเป็นต้องมีแท็กปิด <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono text-xs font-bold">&lt;/img&gt;</code>
                  </p>
                </div>
              </div>

              {/* Code Banner */}
              <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 text-white border border-slate-800 shadow-md">
                <p className="text-xs text-slate-400 font-mono mb-2 uppercase tracking-wider font-semibold">โครงสร้างไวยากรณ์ (Syntax)</p>
                <code className="text-sm sm:text-base font-mono block text-amber-300">
                  &lt;<span className="text-rose-400">img</span> <span className="text-amber-400">src</span>=<span className="text-emerald-300">"ชื่อไฟล์หรือลิงก์รูปภาพ"</span> <span className="text-amber-400">alt</span>=<span className="text-emerald-300">"คำอธิบายรูปภาพ"</span>&gt;
                </code>
              </div>
            </div>

            <div className="text-xs text-slate-400 text-right">
              สไลด์ 3 / {totalSlides}
            </div>
          </div>
        );

      // Slide 4: Attributes of <img>
      case 3:
        return (
          <div className="flex flex-col h-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2 border border-indigo-200">
                <Code2 className="w-3.5 h-3.5" />
                <span>Attribute ของรูปภาพ</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2">
                Attribute ที่สำคัญของ <span className="font-mono text-indigo-600">&lt;img&gt;</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-auto">
              {/* src attribute */}
              <div className="bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-200 rounded-2xl p-5 sm:p-6 shadow-xs">
                <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider">
                  src="..." (Source)
                </span>
                <h4 className="font-bold text-slate-900 mt-3 mb-2 text-base sm:text-lg">ที่อยู่ไฟล์รูปภาพ</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  ระบุตำแหน่งหรือ URL ที่อยู่ของไฟล์รูปภาพที่ต้องการให้เบราว์เซอร์ดาวน์โหลดมาแสดงผล เช่น <code className="bg-indigo-100 text-indigo-900 px-1 rounded font-mono">temple.jpg</code>
                </p>
              </div>

              {/* alt attribute */}
              <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 bg-amber-500 text-slate-950 rounded-lg text-xs font-mono font-bold uppercase tracking-wider">
                    alt="..." (Alternative Text)
                  </span>
                  <h4 className="font-bold text-slate-900 mt-3 mb-2 text-base sm:text-lg">ข้อความทดแทนรูปภาพ</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    กำหนดข้อความอธิบายรูปภาพ เพื่อแสดงแทนในกรณีที่รูปภาพโหลดไม่ขึ้น หรือสำหรับโปรแกรมอ่านหน้าจอ (Screen Reader)
                  </p>
                </div>

                {/* Broken Image Interactive Simulation */}
                <div className="mt-4 pt-3 border-t border-amber-200">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-amber-900">ตัวอย่างเมื่อรูปโหลดไม่ขึ้น:</span>
                    <button
                      onClick={() => setSimulateBrokenImage(!simulateBrokenImage)}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded text-xs font-bold text-amber-900 transition cursor-pointer"
                    >
                      {simulateBrokenImage ? 'กดดูรูปปกติ' : 'กดจำลองรูปพัง'}
                    </button>
                  </div>
                  <div className="mt-2 p-2 bg-white border border-slate-300 rounded-lg flex items-center gap-2 text-xs text-slate-700">
                    <span className="text-rose-500">❌🖼️</span>
                    <span>{simulateBrokenImage ? 'วัดไทย (ข้อความ alt แสดงขึ้นมาแทน)' : 'ดอกไม้สีม่วง'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 text-right">
              สไลด์ 4 / {totalSlides}
            </div>
          </div>
        );

      // Slide 5: Code Example <img>
      case 4:
        return (
          <div className="flex flex-col h-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2 border border-indigo-200">
                <Code2 className="w-3.5 h-3.5" />
                <span>ตัวอย่างโค้ดจริง</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2">
                ตัวอย่าง Code <span className="font-mono text-indigo-600">&lt;img&gt;</span>
              </h2>
            </div>

            <div className="my-auto space-y-3">
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-xl">
                <div className="bg-[#252526] px-4 py-2 border-b border-[#2d2d2d] flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-amber-400">index.html</span>
                  </div>
                  <span className="text-[11px] text-slate-500">HTML5</span>
                </div>
                <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
                  <p className="text-slate-500">&lt;!-- 1. รูปภาพในเครื่อง (Local Image ในโฟลเดอร์เดียวกันหรือโฟลเดอร์ image) --&gt;</p>
                  <p className="text-amber-300 bg-amber-500/10 px-2 py-1 rounded my-1 border border-amber-500/30">
                    &lt;<span className="text-rose-400">img</span> <span className="text-amber-400">src</span>=<span className="text-emerald-300">"image/flower.jpg"</span> <span className="text-amber-400">alt</span>=<span className="text-emerald-300">"ดอกไม้สีม่วง"</span> <span className="text-amber-400">width</span>=<span className="text-emerald-300">"300"</span>&gt;
                  </p>
                  <br />
                  <p className="text-slate-500">&lt;!-- 2. รูปภาพออนไลน์ (Online Image URL จากอินเทอร์เน็ต) --&gt;</p>
                  <p className="text-sky-300 bg-sky-500/10 px-2 py-1 rounded my-1 border border-sky-500/30">
                    &lt;<span className="text-rose-400">img</span> <span className="text-amber-400">src</span>=<span className="text-emerald-300">"https://picsum.photos/300/200"</span> <span className="text-amber-400">alt</span>=<span className="text-emerald-300">"ภาพสุ่มตัวอย่าง"</span>&gt;
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 text-right">
              สไลด์ 5 / {totalSlides}
            </div>
          </div>
        );

      // Slide 6: Code Preview <img>
      case 5:
        return (
          <div className="flex flex-col h-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2 border border-emerald-200">
                <Globe className="w-3.5 h-3.5" />
                <span>ผลลัพธ์บนเบราว์เซอร์</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2">
                Code Preview (ผลลัพธ์การแสดงผลรูปภาพ)
              </h2>
            </div>

            <div className="my-auto max-w-xl mx-auto w-full bg-white rounded-2xl border border-slate-300 shadow-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-300 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">แกลเลอรีของฉัน</span>
              </div>
              <div className="p-5 space-y-4 max-h-[300px] overflow-y-auto">
                <h3 className="text-base font-bold text-slate-900">แกลเลอรีของฉัน</h3>
                <p className="text-xs text-slate-500">รวมรูปภาพตัวอย่างที่น่าสนใจ</p>
                
                <div className="border-t pt-3">
                  <p className="text-xs font-bold text-slate-700 mb-1.5">1. รูปภาพในเครื่อง (flower.jpg):</p>
                  <div className="w-48 h-32 bg-purple-100 border border-purple-300 rounded-lg flex flex-col items-center justify-center text-purple-700 text-xs font-bold shadow-xs">
                    <span className="text-2xl mb-1">🌸</span>
                    <span>ดอกไม้สีม่วง</span>
                    <span className="text-[10px] text-purple-500 font-normal">300 x 200 px</span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <p className="text-xs font-bold text-slate-700 mb-1.5">2. รูปภาพออนไลน์ (picsum.photos):</p>
                  <div className="w-48 h-28 bg-sky-100 border border-sky-300 rounded-lg flex flex-col items-center justify-center text-sky-700 text-xs font-bold shadow-xs">
                    <span className="text-2xl mb-1">🌄</span>
                    <span>ภาพวิวทิวทัศน์ธรรมชาติ</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 text-right">
              สไลด์ 6 / {totalSlides}
            </div>
          </div>
        );

      // Slide 7: <a> Tag Introduction
      case 6:
        return (
          <div className="flex flex-col h-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-2 border border-sky-200">
                <LinkIcon className="w-3.5 h-3.5" />
                <span>การสร้างลิงก์</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2">
                การสร้างลิงก์ด้วยแท็ก <span className="font-mono text-sky-600">&lt;a&gt;</span>
              </h2>
            </div>

            <div className="space-y-6 my-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm mb-3">⚓</div>
                  <h4 className="font-bold text-slate-900 mb-1 text-base">แท็ก &lt;a&gt; ย่อมาจาก Anchor</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    ทำหน้าที่เป็นสมอเรือ เชื่อมโยง (Hyperlink) ไปยังหน้าเว็บอื่น, ไฟล์เอกสาร, หรือตำแหน่งอื่นในหน้าเว็บ
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-3">🏷️</div>
                  <h4 className="font-bold text-slate-900 mb-1 text-base">มีทั้งแท็กเปิดและแท็กปิด</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    ต้องครอบข้อความหรือรูปภาพที่ต้องการให้คลิกได้ เช่น <code className="bg-sky-100 text-sky-900 px-1 rounded font-mono text-xs">&lt;a&gt;คลิกที่นี่&lt;/a&gt;</code>
                  </p>
                </div>
              </div>

              {/* Code Banner */}
              <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 text-white border border-slate-800 shadow-md">
                <p className="text-xs text-slate-400 font-mono mb-2 uppercase tracking-wider font-semibold">ลักษณะการเขียน</p>
                <code className="text-sm sm:text-base font-mono block text-sky-300">
                  &lt;<span className="text-rose-400">a</span> <span className="text-amber-400">href</span>=<span className="text-emerald-300">"ชื่อไฟล์หรือลิงก์ปลายทาง"</span>&gt;<span className="text-white">ข้อความที่แสดงบนหน้าเว็บ</span>&lt;/<span className="text-rose-400">a</span>&gt;
                </code>
              </div>
            </div>

            <div className="text-xs text-slate-400 text-right">
              สไลด์ 7 / {totalSlides}
            </div>
          </div>
        );

      // Slide 8: Attribute href of <a>
      case 7:
        return (
          <div className="flex flex-col h-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-2 border border-sky-200">
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Attribute ของลิงก์</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2">
                Attribute ที่สำคัญของ <span className="font-mono text-sky-600">&lt;a&gt;</span>
              </h2>
            </div>

            <div className="my-auto space-y-5">
              <div className="bg-gradient-to-br from-sky-50 to-white border-2 border-sky-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                <span className="px-3.5 py-1 bg-sky-600 text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider">
                  href="..." (Hypertext Reference)
                </span>
                <h4 className="font-bold text-slate-900 mt-4 mb-2 text-lg sm:text-xl">ระบุปลายทางของลิงก์</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  ระบุ URL หรือชื่อไฟล์หน้าเว็บปลายทางที่ต้องการให้เปิดเมื่อผู้ใช้คลิกลิงก์
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-sky-200 rounded-xl">
                    <p className="text-xs font-bold text-sky-900 mb-1">🔗 ลิงก์ภายใน (Internal Link):</p>
                    <code className="text-xs font-mono text-slate-700">href="detail.html"</code>
                  </div>
                  <div className="p-3 bg-white border border-sky-200 rounded-xl">
                    <p className="text-xs font-bold text-sky-900 mb-1">🌐 ลิงก์ภายนอก (External Link):</p>
                    <code className="text-xs font-mono text-slate-700">href="https://google.com"</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 text-right">
              สไลด์ 8 / {totalSlides}
            </div>
          </div>
        );

      // Slide 9: Code Example <a> (Including Clickable Image!)
      case 8:
        return (
          <div className="flex flex-col h-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2 border border-rose-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ไฮไลต์สำคัญประจำใบงาน</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2">
                ตัวอย่าง Code <span className="font-mono text-sky-600">&lt;a&gt;</span> และ <span className="text-rose-600">รูปภาพที่คลิกได้!</span>
              </h2>
            </div>

            <div className="my-auto space-y-3">
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-xl">
                <div className="bg-[#252526] px-4 py-2 border-b border-[#2d2d2d] flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[#d4d4d4]">index.html</span>
                  <span className="text-amber-400 font-bold">เทคนิคสำคัญ</span>
                </div>
                <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed space-y-2">
                  <p className="text-slate-500">&lt;!-- 1. ลิงก์ข้อความธรรมดา --&gt;</p>
                  <p className="text-slate-300">
                    &lt;<span className="text-rose-400">p</span>&gt;&lt;<span className="text-rose-400">a</span> <span className="text-amber-400">href</span>=<span className="text-emerald-300">"about.html"</span>&gt;เกี่ยวกับเรา&lt;/<span className="text-rose-400">a</span>&gt;&lt;/<span className="text-rose-400">p</span>&gt;
                  </p>

                  <p className="text-slate-500 pt-1">&lt;!-- 2. ลิงก์รูปภาพที่คลิกได้ (ใส่ &lt;img&gt; ข้างใน &lt;a&gt; ... &lt;/a&gt;) --&gt;</p>
                  <div className="p-3 bg-amber-500/15 border-2 border-amber-400/50 rounded-xl">
                    <p className="text-sky-300">&lt;<span className="text-rose-400">a</span> <span className="text-amber-400">href</span>=<span className="text-emerald-300">"https://www.youtube.com/"</span>&gt;</p>
                    <p className="pl-4 text-emerald-300">
                      &lt;<span className="text-rose-400">img</span> <span className="text-amber-400">src</span>=<span className="text-emerald-300">"image/youtube.png"</span> <span className="text-amber-400">alt</span>=<span className="text-emerald-300">"YouTube"</span> <span className="text-amber-400">width</span>=<span className="text-emerald-300">"150"</span>&gt;
                    </p>
                    <p className="text-sky-300">&lt;/<span className="text-rose-400">a</span>&gt;</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 text-right">
              สไลด์ 9 / {totalSlides}
            </div>
          </div>
        );

      // Slide 10: Code Preview <a>
      case 9:
        return (
          <div className="flex flex-col h-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2 border border-emerald-200">
                <Globe className="w-3.5 h-3.5" />
                <span>ผลลัพธ์บนเบราว์เซอร์</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2">
                Code Preview (ผลลัพธ์ลิงก์และรูปภาพที่คลิกได้)
              </h2>
            </div>

            <div className="my-auto max-w-xl mx-auto w-full bg-white rounded-2xl border border-slate-300 shadow-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-300 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">ตัวอย่างการสร้างลิงก์</span>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900">ตัวอย่างการสร้างลิงก์</h3>
                <div className="space-y-1 text-sm">
                  <p><a href="#about" onClick={(e) => e.preventDefault()} className="text-blue-600 underline font-medium">เกี่ยวกับเรา</a></p>
                  <p><a href="#google" onClick={(e) => e.preventDefault()} className="text-blue-600 underline font-medium">ไปยัง Google</a></p>
                </div>
                
                <div className="pt-2">
                  <p className="text-xs text-slate-500 mb-2 font-medium">เมื่อนำเมาส์ไปชี้ที่รูปภาพ เคอร์เซอร์จะเปลี่ยนเป็นรูปมือ 👆 (คลิกได้):</p>
                  <div className="inline-block p-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition cursor-pointer shadow-xs">
                    <div className="w-28 h-16 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                      ▶ YouTube
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 text-right">
              สไลด์ 10 / {totalSlides}
            </div>
          </div>
        );

      // Slide 11: Summary Title
      case 10:
        return (
          <div className="flex flex-col items-center justify-center text-center h-full px-6 py-10 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold mb-6 shadow-lg">
              <Layers className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black mb-3">
              สรุปสิ่งที่ได้เรียนรู้ในวันนี้
            </h2>
            <p className="text-base sm:text-xl text-amber-300 font-semibold mb-6">
              การแทรกรูปภาพและสร้างลิงก์เชื่อมโยง
            </p>
            <button
              onClick={nextSlide}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer"
            >
              ดูแผนผังสรุป ➔
            </button>
          </div>
        );

      // Slide 12: Visual Summary Diagram
      case 11:
        return (
          <div className="flex flex-col h-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2 border border-amber-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>สรุปสาระสำคัญ</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2">
                การแทรกรูปภาพและสร้างลิงก์
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-auto">
              {/* Image Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="p-2 bg-indigo-100 text-indigo-700 rounded-lg font-mono font-bold text-sm">&lt;img&gt;</span>
                  <span className="font-bold text-slate-800 text-sm">ใช้แทรกรูปภาพ</span>
                </div>
                <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span><strong>src</strong> : ระบุตำแหน่งไฟล์รูปภาพ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span><strong>alt</strong> : กำหนดข้อความทดแทนรูปภาพ</span>
                  </li>
                </ul>
              </div>

              {/* Link Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="p-2 bg-sky-100 text-sky-700 rounded-lg font-mono font-bold text-sm">&lt;a&gt;</span>
                  <span className="font-bold text-slate-800 text-sm">ใช้สร้างลิงก์เชื่อมโยง</span>
                </div>
                <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600 font-bold">•</span>
                    <span><strong>href</strong> : ระบุปลายทางของลิงก์</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600 font-bold">•</span>
                    <span>ต้องมีแท็กปิด <code className="font-mono text-xs">&lt;/a&gt;</code> เสมอ</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Combined Diagram */}
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center">
              <span className="text-xs font-bold text-emerald-900 block mb-1">เทคนิคหัวใจสำคัญ: "รูปภาพที่คลิกได้"</span>
              <code className="text-xs sm:text-sm font-mono text-emerald-950 font-bold">
                &lt;a href="..."&gt;&lt;img src="..." alt="..."&gt;&lt;/a&gt;
              </code>
            </div>

            <div className="text-xs text-slate-400 text-right">
              สไลด์ 12 / {totalSlides}
            </div>
          </div>
        );

      // Slide 13: Quiz Time!
      case 12:
        return (
          <div className="flex flex-col h-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2 border border-amber-300">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Quiz Time • ทดสอบความจำ</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2">
                คำถามทบทวนบทเรียน
              </h2>
            </div>

            <div className="my-auto space-y-5">
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6">
                <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                  ❓ หากต้องการทำให้ <span className="text-indigo-600">"รูปภาพ"</span> สามารถคลิกแล้วเปิดลิงก์ไปยังเว็บไซต์อื่นได้ ต้องเขียนโครงสร้างแท็ก HTML อย่างไร?
                </p>
              </div>

              {!showQuizAnswer ? (
                <div className="text-center py-2">
                  <button
                    onClick={() => setShowQuizAnswer(true)}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-md cursor-pointer"
                  >
                    💡 คลิกเพื่อดูเฉลยคำตอบ
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 animate-fade-in">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>คำตอบที่ถูกต้อง:</span>
                  </div>
                  <p className="text-sm text-emerald-950 font-semibold mb-2">
                    ใส่แท็ก <code className="font-mono bg-emerald-200/70 px-1.5 py-0.5 rounded">&lt;img&gt;</code> ไว้ระหว่างแท็กเปิด <code className="font-mono bg-emerald-200/70 px-1.5 py-0.5 rounded">&lt;a&gt;</code> และแท็กปิด <code className="font-mono bg-emerald-200/70 px-1.5 py-0.5 rounded">&lt;/a&gt;</code>
                  </p>
                  <code className="block bg-slate-900 text-amber-300 p-3 rounded-xl font-mono text-xs sm:text-sm mt-3">
                    &lt;a href="URL"&gt;&lt;img src="image.jpg" alt="Description"&gt;&lt;/a&gt;
                  </code>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-400 text-right">
              สไลด์ 13 / {totalSlides}
            </div>
          </div>
        );

      // Slide 14: Learning Material & Ready for Exercise
      case 13:
        return (
          <div className="flex flex-col items-center justify-center text-center h-full px-6 py-10 bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 text-white rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-400 text-slate-950 flex items-center justify-center font-bold mb-4 shadow-lg animate-bounce">
              <Laptop className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black mb-2 text-white">
              พร้อมทำแบบฝึกหัดแล้ว!
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg mb-6">
              นำความรู้เรื่องแท็ก <code className="text-amber-400 font-mono font-bold">&lt;img&gt;</code> และ <code className="text-sky-400 font-mono font-bold">&lt;a&gt;</code> ไปลงมือเขียนโค้ดในใบงานที่ 1 ได้เลย
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
              {/* Direct Link to Reference Website */}
              <a
                href="https://petchauisui.github.io/HTML-GuideWeb/lesson3.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white rounded-xl text-xs font-semibold border border-white/20 transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>เปิดอ่านเอกสารบทเรียนฉบับเต็ม (Web Guide)</span>
              </a>
            </div>

            {/* Big Action Button to Exercise */}
            {onGoToExercise && (
              <button
                onClick={onGoToExercise}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl text-base sm:text-lg shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 flex items-center gap-2 cursor-pointer"
              >
                <span>เริ่มทำแบบฝึกหัดใบงานที่ 1</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            <div className="mt-8 text-xs text-slate-400">
              (คุณสามารถกดเปิดสไลด์บทเรียนนี้ขึ้นมาทบทวนได้ตลอดเวลาขณะทำแบบฝึกหัด)
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col ${isModal ? 'max-w-5xl w-full h-[90vh]' : 'min-h-screen'} bg-slate-950 text-slate-100 select-none`}>
      {/* Top Slide Control Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
              สไลด์เอกสารประกอบการสอน: บทเรียนที่ 3
            </h3>
            <p className="text-xs text-slate-400">
              การแทรกรูปภาพและสร้างลิงก์เชื่อมโยงหน้าเว็บเพจ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Slide Indicator */}
          <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono font-semibold text-slate-300">
            {currentSlide + 1} / {totalSlides}
          </div>

          {/* Go to Exercise CTA Button */}
          {onGoToExercise && (
            <button
              onClick={onGoToExercise}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <span>ไปทำแบบฝึกหัด</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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

      {/* Main Slide Presentation Body */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 flex items-center justify-center overflow-y-auto">
        <div className="max-w-4xl w-full h-[520px] sm:h-[580px]">
          {renderSlideContent()}
        </div>
      </main>

      {/* Bottom Navigation Toolbar */}
      <footer className="bg-slate-900 border-t border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 gap-2">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>ก่อนหน้า</span>
        </button>

        {/* Slide Progress Dots */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[50%] py-1">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              title={`ไปที่สไลด์ ${idx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx 
                  ? 'w-7 bg-amber-400 shadow-xs' 
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        {currentSlide < totalSlides - 1 ? (
          <button
            onClick={nextSlide}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <span>ถัดไป</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          onGoToExercise && (
            <button
              onClick={onGoToExercise}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <span>เริ่มทำแบบฝึกหัด</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )
        )}
      </footer>
    </div>
  );
}
