import React, { useState } from 'react';
import { ShieldAlert, KeyRound, Lock, Eye, EyeOff, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { setStudentPassword } from '../data/students';

export default function ForcePasswordChangeModal({ student, onPasswordChanged, onLogout }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanNew = newPassword.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanNew) {
      setError('กรุณากรอกรหัสผ่านใหม่');
      return;
    }

    if (cleanNew.toLowerCase() === 'kmitl') {
      setError('⚠️ ไม่อนุญาตให้ใช้รหัสผ่านเป็นคำว่า "kmitl" กรุณาตั้งรหัสผ่านอื่น');
      return;
    }

    if (cleanNew.length < 4) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
      return;
    }

    if (cleanNew !== cleanConfirm) {
      setError('รหัสผ่านทั้ง 2 ช่องไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    const result = await setStudentPassword(student.id, cleanNew);
    if (!result.success) {
      setError(result.message);
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      onPasswordChanged(cleanNew);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-thai select-none">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-amber-500 via-indigo-600 to-indigo-800 p-6 text-white text-center relative">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-xs rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner border border-white/30">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <span className="px-3 py-1 bg-amber-400 text-slate-950 font-bold text-xs rounded-full uppercase tracking-wider shadow-xs inline-block mb-1.5">
            บังคับเปลี่ยนรหัสผ่าน
          </span>
          <h2 className="text-xl font-black tracking-tight">ตั้งรหัสผ่านใหม่ก่อนเริ่มใช้งาน</h2>
          <p className="text-indigo-100 text-xs mt-1">
            เพื่อความปลอดภัยของข้อมูล บัญชีนักเรียนต้องเปลี่ยนรหัสผ่านจากค่าเริ่มต้น
          </p>
        </div>

        {/* Student Identity Display */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">บัญชีผู้ใช้:</span>
            <span className="font-bold text-slate-900">{student.name}</span>
          </div>
          <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-indigo-700">
            {student.id}
          </span>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Forbidden Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">เงื่อนไขสำคัญ:</span> ห้ามตั้งรหัสผ่านเป็นคำว่า <span className="font-mono font-bold text-rose-600 underline">"kmitl"</span> และต้องมีความยาวอย่างน้อย 4 ตัวอักษร
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">เปลี่ยนรหัสผ่านสำเร็จแล้ว! กำลังเข้าสู่บทเรียน...</span>
            </div>
          )}

          {/* New Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              รหัสผ่านใหม่ (ห้ามใช้ kmitl)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
                }}
                disabled={isSuccess}
                placeholder="กรอกรหัสผ่านใหม่ที่ไม่ใช่ kmitl"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ยืนยันรหัสผ่านใหม่อีกครั้ง
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                disabled={isSuccess}
                placeholder="กรอกรหัสผ่านใหม่อีกครั้งให้ตรงกัน"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSuccess}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2 mt-3 cursor-pointer ${
              isSuccess
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white hover:shadow-lg'
            }`}
          >
            {isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>บันทึกสำเร็จ</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>บันทึกรหัสผ่านใหม่</span>
              </>
            )}
          </button>

          {/* Logout Option */}
          {onLogout && (
            <div className="pt-2 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={onLogout}
                className="text-xs text-slate-500 hover:text-rose-600 font-semibold transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>ออกจากระบบ (ยังไม่ตั้งรหัสผ่านตอนนี้)</span>
              </button>
            </div>
          )}

        </form>

      </div>
    </div>
  );
}
