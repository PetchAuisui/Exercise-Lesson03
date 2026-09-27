import React, { useState } from 'react';
import { LogIn, Key, User, BookOpen, AlertCircle, CheckCircle, HelpCircle, Shield, Mail } from 'lucide-react';
import { STUDENTS_DATABASE, authenticateUser } from '../data/students';
import { recordStudentLogin } from '../utils/adminStorage';

export default function LoginScreen({ onLoginSuccess }) {
  const [loginRole, setLoginRole] = useState('student'); // 'student' | 'admin'
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showStudentList, setShowStudentList] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = authenticateUser(studentId, password);
    if (result.success) {
      if (result.user.role === 'student') {
        recordStudentLogin(result.user.id);
      }
      onLoginSuccess(result.user);
    } else {
      setError(result.message);
    }
  };

  const handleSelectStudent = (id) => {
    setStudentId(id);
    setError('');
  };

  const switchToAdmin = () => {
    setLoginRole('admin');
    setStudentId('siwarpatauisui@gmail.com');
    setPassword('');
    setError('');
  };

  const switchToStudent = () => {
    setLoginRole('student');
    setStudentId('');
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 font-thai">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
        
        {/* Header Banner */}
        <div className={`p-6 text-white text-center relative transition-colors duration-300 ${
          loginRole === 'admin'
            ? 'bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-900'
            : 'bg-gradient-to-r from-indigo-600 to-indigo-800'
        }`}>
          <div className="w-14 h-14 bg-white/10 backdrop-blur-xs rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner border border-white/20">
            {loginRole === 'admin' ? (
              <Shield className="w-7 h-7 text-amber-400" />
            ) : (
              <BookOpen className="w-7 h-7 text-white" />
            )}
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            {loginRole === 'admin' ? 'ระบบผู้ดูแลและตรวจคะแนน (Admin)' : 'เข้าสู่ระบบทำแบบฝึกหัด'}
          </h2>
          <p className="text-indigo-200 text-xs mt-1">
            {loginRole === 'admin' 
              ? 'สำหรับอาจารย์ผู้สอน ตรวจผลงานและดาวน์โหลดคะแนน' 
              : 'ใบงานที่ 1 รูปภาพที่คลิกได้ (Basic Website Design)'}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="px-6 pt-4 pb-1">
          <div className="bg-slate-100 p-1 rounded-xl flex border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={switchToStudent}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                loginRole === 'student'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>นักศึกษา (Student)</span>
            </button>
            <button
              type="button"
              onClick={switchToAdmin}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                loginRole === 'admin'
                  ? 'bg-slate-900 text-amber-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>อาจารย์ / Admin</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 pt-4 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Identifier Input (Student ID or Admin Email) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {loginRole === 'admin' ? 'อีเมลอาจารย์ผู้สอน (Admin Email)' : 'รหัสนักศึกษา (Student ID)'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                {loginRole === 'admin' ? (
                  <Mail className="w-4 h-4 text-indigo-500" />
                ) : (
                  <User className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <input
                type={loginRole === 'admin' ? 'email' : 'text'}
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  setError('');
                }}
                placeholder={loginRole === 'admin' ? 'siwarpatauisui@gmail.com' : 'เช่น 67030180'}
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
                placeholder={loginRole === 'admin' ? 'กรอกรหัสผ่านผู้ดูแลระบบ' : 'กรอกรหัสผ่าน'}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2.5 px-4 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 mt-2 ${
              loginRole === 'admin'
                ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 active:bg-slate-950'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>
              {loginRole === 'admin'
                ? 'เข้าสู่ระบบ Dashboard ตรวจคะแนน'
                : 'เข้าสู่ระบบเพื่อเริ่มทำแบบฝึกหัด'}
            </span>
          </button>

          {/* Student list helper toggle (Only shown for student login) */}
          {loginRole === 'student' && (
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
          )}

        </form>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Basic Website Design • Lesson 03 Exercise System
        </div>
      </div>
    </div>
  );
}
