import { STUDENTS_DATABASE, isPasswordChanged, resetStudentPassword } from '../data/students.js';
import { validateHtmlCode } from './htmlValidator.js';

const safeGetItem = (key) => {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
};

const safeSetItem = (key, val) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, val);
    }
  } catch {}
};

/**
 * Exercise access control (Teacher toggles exercise lock/unlock for students)
 */
export function getExercisePermission() {
  return safeGetItem('ws_exercise_enabled') === 'true';
}

export function setExercisePermission(enabled) {
  safeSetItem('ws_exercise_enabled', enabled ? 'true' : 'false');
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'));
  }
}

/**
 * Solution visibility control (Teacher toggles access for students)
 */
export function getSolutionPermission() {
  return safeGetItem('ws_solution_enabled') === 'true';
}

export function setSolutionPermission(enabled) {
  safeSetItem('ws_solution_enabled', enabled ? 'true' : 'false');
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'));
  }
}

/**
 * Record student login timestamp
 */
export function recordStudentLogin(studentId) {
  if (!studentId || studentId === 'admin') return;
  const now = new Date().toISOString();
  if (!safeGetItem(`ws_first_login_${studentId}`)) {
    safeSetItem(`ws_first_login_${studentId}`, now);
  }
  safeSetItem(`ws_last_login_${studentId}`, now);
}

/**
 * Record student code modification timestamp
 */
export function recordStudentCodeUpdate(studentId, code) {
  if (!studentId || studentId === 'admin') return;
  const now = new Date().toISOString();
  safeSetItem(`ws_code_${studentId}`, code);
  safeSetItem(`ws_code_updated_${studentId}`, now);
}

/**
 * Student Submission control (Lock / Unlock code editor)
 */
export function getStudentSubmission(studentId) {
  if (!studentId || studentId === 'admin') return null;
  return safeGetItem(`ws_submitted_${studentId}`);
}

export function submitStudentWork(studentId) {
  if (!studentId || studentId === 'admin') return;
  const now = new Date().toISOString();
  safeSetItem(`ws_submitted_${studentId}`, now);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'));
  }
}

export function cancelStudentSubmission(studentId) {
  if (!studentId || studentId === 'admin') return;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(`ws_submitted_${studentId}`);
    }
  } catch {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'));
  }
}

/**
 * Get aggregated progress and score for all students
 */
export function getAllStudentsProgress() {
  return STUDENTS_DATABASE.map((student, index) => {
    const rawCode = safeGetItem(`ws_code_${student.id}`);
    const hasLoggedIn = !!safeGetItem(`ws_last_login_${student.id}`) || rawCode !== null;
    const code = rawCode || '';
    const lastLogin = safeGetItem(`ws_last_login_${student.id}`);
    const lastUpdated = safeGetItem(`ws_code_updated_${student.id}`) || lastLogin;
    const submittedAt = safeGetItem(`ws_submitted_${student.id}`);
    const isSubmitted = !!submittedAt;

    const validation = validateHtmlCode(code);
    const passedCount = validation.passedCount;
    const totalCount = validation.totalCount; // 5

    let status = 'ยังไม่เข้าระบบ';
    let statusColor = 'gray';

    if (!hasLoggedIn && !code) {
      status = 'ยังไม่เข้าระบบ';
      statusColor = 'slate';
    } else if (code.trim().length === 0) {
      status = 'ยังไม่ทำ';
      statusColor = 'amber';
    } else if (validation.isAllPassed) {
      status = 'เสร็จสมบูรณ์';
      statusColor = 'emerald';
    } else {
      status = 'กำลังทำ';
      statusColor = 'sky';
    }

    return {
      no: index + 1,
      id: student.id,
      name: student.name,
      code,
      hasLoggedIn,
      lastLogin,
      lastUpdated,
      isSubmitted,
      submittedAt,
      validation,
      passedCount,
      totalCount,
      score: passedCount, // Out of 5
      scorePercent: Math.round((passedCount / totalCount) * 100),
      hasChangedPassword: isPasswordChanged(student.id),
      status,
      statusColor,
    };
  });
}

/**
 * Export students score report to CSV with Thai UTF-8 BOM
 */
export function exportScoresToCSV(studentsProgress) {
  const headers = [
    'ลำดับ',
    'รหัสนักศึกษา',
    'ชื่อ-นามสกุล',
    'สถานะระบบ',
    'สถานะการส่งงาน',
    'เวลาที่ส่งงาน',
    'คะแนน (เต็ม 5)',
    'ร้อยละ (%)',
    'ข้อ 1 (โครงสร้างพื้นฐาน)',
    'ข้อ 2 (ชื่อหน้าเว็บ Title)',
    'ข้อ 3 (แท็กรูปภาพ temple.jpg)',
    'ข้อ 4 (ข้อความทดแทน alt)',
    'ข้อ 5 (ลิงก์รูปภาพคลิกได้ detail.html)',
    'เวลาอัปเดตล่าสุด',
    'โค้ด HTML ที่เขียน'
  ];

  const rows = studentsProgress.map(s => {
    const c = s.validation.criteria;
    const c1 = c[0]?.passed ? 'ผ่าน' : 'ไม่ผ่าน';
    const c2 = c[1]?.passed ? 'ผ่าน' : 'ไม่ผ่าน';
    const c3 = c[2]?.passed ? 'ผ่าน' : 'ไม่ผ่าน';
    const c4 = c[3]?.passed ? 'ผ่าน' : 'ไม่ผ่าน';
    const c5 = c[4]?.passed ? 'ผ่าน' : 'ไม่ผ่าน';
    const dateStr = s.lastUpdated ? new Date(s.lastUpdated).toLocaleString('th-TH') : '-';
    const submitStr = s.submittedAt ? new Date(s.submittedAt).toLocaleString('th-TH') : '-';
    const submissionStatus = s.isSubmitted ? 'ส่งงานแล้ว (ล็อก)' : 'ยังไม่ส่ง';
    // Escape code for CSV by doubling double quotes
    const escapedCode = `"${(s.code || '').replace(/"/g, '""')}"`;

    return [
      s.no,
      `="${s.id}"`, // Preserve leading zeroes in Excel
      `"${s.name}"`,
      `"${s.status}"`,
      `"${submissionStatus}"`,
      `"${submitStr}"`,
      s.score,
      s.scorePercent,
      c1,
      c2,
      c3,
      c4,
      c5,
      `"${dateStr}"`,
      escapedCode
    ].join(',');
  });

  // \uFEFF is UTF-8 Byte Order Mark for Excel compatibility
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `คะแนน_ใบงานที่1_Lesson03_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
