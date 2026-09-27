import React, { useState } from 'react';
import { LogIn, Key, User, BookOpen, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { STUDENTS_DATABASE, authenticateStudent } from '../data/students';

export default function LoginScreen({ onLoginSuccess }) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showStudentList, setShowStudentList] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = authenticateStudent(studentId, password);
    if (result.success) {
      onLoginSuccess(result.student);
    } else {
      setError(result.message);
    }
  };

  const handleSelectStudent = (id) => {
    setStudentId(id);
    setPassword('koson');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 font-thai">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white text-center relative">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-xs rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner border border-white/20">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">เข้าสู่ระบบทำแบบฝึกหัด</h2>
          <p className="text-indigo-200 text-xs mt-1">
            ใบงานที่ 1 รูปภาพที่คลิกได้ (Basic Website Design)
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Student ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              รหัสนักศึกษา (Student ID)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  setError('');
                }}
                placeholder="เช่น 67030180"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition font-mono"
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Key className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="ใส่รหัสผ่าน (koson)"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-indigo-600 font-medium">
                💡 รหัสผ่านคือ: <code className="bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded font-mono font-bold">koson</code>
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>เข้าสู่ระบบเพื่อเริ่มทำแบบฝึกหัด</span>
          </button>

          {/* Student list helper toggle */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowStudentList(!showStudentList)}
              className="w-full text-center text-xs text-slate-500 hover:text-indigo-600 transition flex items-center justify-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showStudentList ? 'ซ่อนรายชื่อนักศึกษา' : 'ดูรายชื่อนักศึกษาในระบบ (คลิกเพื่อเลือก)'}</span>
            </button>

            {showStudentList && (
              <div className="mt-3 max-h-48 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-2 space-y-1 text-xs">
                {STUDENTS_DATABASE.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => handleSelectStudent(student.id)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition text-slate-700"
                  >
                    <span className="font-mono font-semibold">{student.id}</span>
                    <span className="truncate ml-2">{student.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Basic Website Design • Lesson 03 Exercise System
        </div>
      </div>
    </div>
  );
}
