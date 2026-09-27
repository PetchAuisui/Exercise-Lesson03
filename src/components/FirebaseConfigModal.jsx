import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, ExternalLink, RefreshCw, KeyRound, Wifi, WifiOff } from 'lucide-react';
import { getFirebaseConfig, saveFirebaseConfig, initFirebase } from '../services/firebase';

export default function FirebaseConfigModal({ isOpen, onClose, onConfigSaved }) {
  const currentConfig = getFirebaseConfig();
  const [configText, setConfigText] = useState(() => {
    if (currentConfig) {
      return JSON.stringify(currentConfig, null, 2);
    }
    return '';
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setError('');
    setSuccess('');

    const clean = configText.trim();
    if (!clean) {
      saveFirebaseConfig(null);
      setSuccess('ล้างการตั้งค่า Firebase เรียบร้อยแล้ว (กลับสู่โหมดออฟไลน์)');
      if (onConfigSaved) onConfigSaved();
      return;
    }

    try {
      let parsed;
      // Handle JS object format (e.g. const firebaseConfig = { ... };)
      if (clean.includes('{') && clean.includes('}')) {
        let jsonStr = clean;
        if (jsonStr.includes('const firebaseConfig =')) {
          jsonStr = jsonStr.replace(/const\s+firebaseConfig\s*=\s*/, '').replace(/;$/, '');
        }
        // Replace unquoted keys if necessary
        try {
          parsed = JSON.parse(jsonStr);
        } catch {
          // Eval as safe JS object
          const fn = new Function(`return (${jsonStr});`);
          parsed = fn();
        }
      } else if (clean.startsWith('http')) {
        // Direct database URL
        parsed = {
          databaseURL: clean
        };
      } else {
        throw new Error('รูปแบบไม่ถูกต้อง กรุณาวาง JSON หรือ object ของ firebaseConfig');
      }

      if (!parsed.databaseURL && !parsed.projectId) {
        throw new Error('กรุณาระบุ databaseURL หรือ projectId');
      }

      // If databaseURL is missing but projectId exists, guess default URL
      if (!parsed.databaseURL && parsed.projectId) {
        parsed.databaseURL = `https://${parsed.projectId}-default-rtdb.firebaseio.com`;
      }

      const ok = saveFirebaseConfig(parsed);
      if (ok) {
        initFirebase();
        setSuccess('บันทึกการตั้งค่า Firebase และเริ่มการเชื่อมต่อเรียบร้อยแล้ว!');
        if (onConfigSaved) onConfigSaved();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError('ไม่สามารถบันทึกการตั้งค่าได้');
      }
    } catch (err) {
      setError(`ข้อผิดพลาด: ${err.message || 'รูปแบบ Config ไม่ถูกต้อง'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-fade-in font-thai select-none">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 rounded-xl font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">ตั้งค่าเชื่อมต่อ Firebase Realtime Database</h2>
              <p className="text-xs text-slate-400">
                ซิงก์ข้อมูลระหว่างหน้าจอครูกับนักเรียนสดๆ แบบ Realtime ข้ามเครื่องผ่านอินเทอร์เน็ต
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Indicator Banner */}
        <div className={`px-6 py-3 border-b flex items-center justify-between text-xs font-semibold ${
          currentConfig && currentConfig.databaseURL
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-amber-50 text-amber-800 border-amber-200'
        }`}>
          <div className="flex items-center gap-2">
            {currentConfig && currentConfig.databaseURL ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-600" />
                <span>สถานะ: เชื่อมต่อ Firebase อยู่ (URL: {currentConfig.databaseURL})</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-600" />
                <span>สถานะ: ยังไม่ได้เชื่อมต่อ Firebase (ทำงานในโหมด LocalStorage เฉพาะเครื่องนี้)</span>
              </>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {/* Quick Guide */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-slate-600">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <span>📖 วิธีสร้าง Firebase Realtime Database ฟรีใน 2 นาที:</span>
            </p>
            <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
              <li>
                เปิดเว็บ <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline inline-flex items-center gap-0.5">Firebase Console <ExternalLink className="w-3 h-3" /></a> แล้วกด <strong>Add project</strong>
              </li>
              <li>
                ไปที่เมนู <strong>Build &gt; Realtime Database</strong> แล้วกด <strong>Create Database</strong> (เลือก Start in test mode เพื่อให้อ่าน/เขียนได้)
              </li>
              <li>
                ไปที่ <strong>Project Settings (ฟันเฟือง) &gt; General &gt; Your apps &gt; Web (ไอคอน &lt;/&gt;)</strong> คัดลอกโค้ด <code>firebaseConfig</code> มาวางในช่องด้านล่างนี้ได้เลย
              </li>
            </ol>
          </div>

          {/* Text Area for Config */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              วาง Firebase Config (JSON / JavaScript Object หรือ Realtime Database URL):
            </label>
            <textarea
              rows={8}
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "my-project.firebaseapp.com",\n  "databaseURL": "https://my-project-default-rtdb.asia-southeast1.firebasedatabase.app",\n  "projectId": "my-project"\n}`}
              className="w-full p-3 font-mono text-xs bg-slate-900 text-amber-300 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setConfigText('')}
            className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
          >
            ล้างการเชื่อมต่อ
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>บันทึกและเชื่อมต่อ</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
