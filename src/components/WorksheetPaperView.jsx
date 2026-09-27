import React from 'react';
import { Printer } from 'lucide-react';

export default function WorksheetPaperView({ 
  studentName, 
  setStudentName, 
  studentId, 
  setStudentId, 
  code, 
  onChangeCode 
}) {
  // Split code into array of 14 lines
  const codeLines = code.split('\n');
  const lines = Array.from({ length: 14 }).map((_, i) => codeLines[i] || '');

  const handleLineChange = (index, value) => {
    const updated = [...lines];
    updated[index] = value;
    // Trim trailing empty lines
    let lastNonEmpty = updated.length - 1;
    while (lastNonEmpty >= 0 && updated[lastNonEmpty].trim() === '') {
      lastNonEmpty--;
    }
    const finalCode = updated.slice(0, Math.max(lastNonEmpty + 1, index + 1)).join('\n');
    onChangeCode(finalCode);
  };

  return (
    <div className="max-w-4xl mx-auto my-4 sm:my-8 px-2 sm:px-4">
      {/* Paper Card */}
      <div className="worksheet-container bg-white border border-slate-300 rounded-lg shadow-md p-6 sm:p-12 font-thai text-slate-900 leading-normal relative">
        
        {/* Header: Name and ID */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm sm:text-base font-normal mb-8">
          <div className="flex items-center flex-1 w-full sm:w-auto">
            <span className="font-semibold whitespace-nowrap mr-2">ชื่อ</span>
            <div className="border-b border-slate-700 flex-1 px-2 py-0.5 font-medium text-slate-900">
              {studentName || <span className="text-slate-300">______________________________________</span>}
            </div>
          </div>
          <div className="flex items-center w-full sm:w-72">
            <span className="font-semibold whitespace-nowrap mr-2">รหัสประจำตัว</span>
            <div className="border-b border-slate-700 flex-1 px-2 py-0.5 font-mono font-medium text-slate-900">
              {studentId || <span className="text-slate-300">___________________</span>}
            </div>
          </div>
        </div>

        {/* Worksheet Title */}
        <div className="text-center my-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
            ใบงานที่ 1 รูปภาพที่คลิกได้
          </h2>
        </div>

        {/* Section: สถานการณ์ */}
        <div className="mb-6 text-base sm:text-lg space-y-2">
          <h3 className="font-bold text-slate-950 text-lg sm:text-xl">สถานการณ์</h3>
          <p className="leading-relaxed">
            คุณกำลังสร้างหน้าเว็บแนะนำสถานที่ท่องเที่ยว เขียน HTML ให้หน้าเว็บทำงานตามเงื่อนไขต่อไปนี้
          </p>
          <ol className="list-decimal list-inside space-y-1.5 pl-2 sm:pl-4">
            <li>เขียนหน้าเว็บโดยใช้ โครงสร้างพื้นฐานของเอกสาร HTML ให้ครบถ้วน</li>
            <li>กำหนดชื่อหน้าเว็บว่า "สถานที่ท่องเที่ยว"</li>
            <li>แสดงรูปภาพจากไฟล์ temple.jpg</li>
            <li>กำหนดข้อความทดแทนของรูปภาพว่า "วัดไทย"</li>
            <li>เมื่อคลิกรูปภาพ ให้เปิดหน้า detail.html</li>
          </ol>
        </div>

        {/* Section: คำชี้แจง */}
        <div className="mb-6 text-base sm:text-lg space-y-1">
          <h3 className="font-bold text-slate-950 text-lg sm:text-xl">คำชี้แจง</h3>
          <p className="leading-relaxed">
            เลือกใช้แท็กและ Attribute ที่เหมาะสม แล้วเขียนโค้ดด้วยตนเอง โดยไม่เติมคำลงในโครงสร้างที่เตรียมไว้
          </p>
        </div>

        {/* Section: พื้นที่เขียนโค้ด */}
        <div className="mb-10">
          <h3 className="font-bold text-base sm:text-xl text-slate-950 mb-3">
            พื้นที่เขียนโค้ด
          </h3>

          {/* Box with orange border matching the worksheet */}
          <div className="border-2 border-orange-400 rounded-lg p-5 bg-orange-50/15 space-y-3">
            {lines.map((val, idx) => (
              <div key={idx} className="flex items-center gap-3.5 group">
                <span className="w-6 text-right font-mono text-sm sm:text-base font-bold text-slate-700 select-none shrink-0">
                  {idx + 1}
                </span>
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleLineChange(idx, e.target.value)}
                    className="w-full font-code text-sm sm:text-base border-b border-slate-600 focus:border-indigo-600 outline-none bg-transparent py-1 px-1.5 tracking-normal transition"
                    placeholder=""
                    spellCheck="false"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Worksheet Footer */}
        <div className="pt-6 border-t border-slate-800 flex justify-end text-sm sm:text-base font-medium text-slate-700">
          <span>Basic Website Design</span>
        </div>
      </div>

      {/* Print Action button for easy access */}
      <div className="mt-4 flex justify-center no-print">
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm shadow flex items-center gap-2 transition"
        >
          <Printer className="w-4 h-4" />
          <span>พิมพ์ใบงานนี้ / บันทึกเป็น PDF</span>
        </button>
      </div>
    </div>
  );
}
