/**
 * Student database from Lesson 03 Class List
 * Password for all students: 'koson'
 */

export const STUDENTS_DATABASE = [
  { id: '67030180', name: 'นายภูมิชนะ เทียมแก้ว' },
  { id: '67030195', name: 'นางสาวรุสนีดา กูวิง' },
  { id: '67030215', name: 'นายวิศวะ กำจร' },
  { id: '67030236', name: 'นางสาวสราสินี สิทธิสาร' },
  { id: '67030260', name: 'นางสาวอาทิตยา ผิวขำ' },
  { id: '67030270', name: 'นายกฤษฏิณัช สำราญกิจ' },
  { id: '67030298', name: 'นายธนบดี บุญภมร' },
  { id: '67030311', name: 'นางสาวปภัสสร เอี่ยมสอาด' },
  { id: '67030334', name: 'นางสาวภิญญาพัชญ์ บานบัว' },
  { id: '67030351', name: 'นายศิวาภัทร อุยสุย' },
];

export const AUTH_PASSWORD = 'kmitl';
export const DEFAULT_STUDENT_PASSWORD = 'kmitl';

export const ADMIN_CREDENTIALS = {
  email: 'siwarpatauisui@gmail.com',
  password: 'Struggle40980',
  name: 'อาจารย์ผู้สอน (Admin)',
  role: 'admin'
};

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
 * Get current student password (defaults to 'kmitl')
 */
export function getStudentPassword(studentId) {
  if (!studentId || studentId === 'admin') return DEFAULT_STUDENT_PASSWORD;
  return safeGetItem(`ws_pwd_${studentId}`) || DEFAULT_STUDENT_PASSWORD;
}

/**
 * Check if the student has changed their password from the default 'kmitl'
 */
export function isPasswordChanged(studentId) {
  if (!studentId || studentId === 'admin') return true;
  const isChangedFlag = safeGetItem(`ws_pwd_changed_${studentId}`) === 'true';
  const currentPwd = getStudentPassword(studentId);
  return isChangedFlag && currentPwd.toLowerCase() !== 'kmitl';
}

/**
 * Set a new password for a student (Strictly forbids 'kmitl')
 */
export function setStudentPassword(studentId, newPassword) {
  if (!studentId) return { success: false, message: 'ไม่พบรหัสนักศึกษา' };
  const cleanPassword = (newPassword || '').trim();

  if (!cleanPassword) {
    return { success: false, message: 'กรุณากรอกรหัสผ่านใหม่' };
  }

  if (cleanPassword.toLowerCase() === 'kmitl') {
    return { success: false, message: 'ไม่อนุญาตให้ใช้รหัสผ่านเป็นคำว่า "kmitl" กรุณาตั้งรหัสผ่านอื่น' };
  }

  if (cleanPassword.length < 4) {
    return { success: false, message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร' };
  }

  safeSetItem(`ws_pwd_${studentId}`, cleanPassword);
  safeSetItem(`ws_pwd_changed_${studentId}`, 'true');

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'));
  }

  return { success: true };
}

/**
 * Reset student password back to default 'kmitl' (Teacher action)
 */
export function resetStudentPassword(studentId) {
  if (!studentId) return { success: false, message: 'ไม่พบรหัสนักศึกษา' };

  safeSetItem(`ws_pwd_${studentId}`, DEFAULT_STUDENT_PASSWORD);
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(`ws_pwd_changed_${studentId}`);
    }
  } catch {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'));
  }

  return { success: true };
}

export function authenticateUser(identifier, password) {
  const cleanId = (identifier || '').trim();
  const cleanPassword = (password || '').trim();

  if (!cleanId) {
    return { success: false, message: 'กรุณากรอกรหัสนักศึกษา หรือ อีเมลอาจารย์' };
  }

  // Check Admin Login
  if (cleanId.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase()) {
    if (cleanPassword === ADMIN_CREDENTIALS.password) {
      return {
        success: true,
        user: {
          id: 'admin',
          email: ADMIN_CREDENTIALS.email,
          name: ADMIN_CREDENTIALS.name,
          role: 'admin',
          mustChangePassword: false
        }
      };
    }
    return { success: false, message: 'รหัสผ่านสำหรับผู้ดูแลระบบไม่ถูกต้อง' };
  }

  // Check Student Login
  const student = STUDENTS_DATABASE.find(s => s.id === cleanId);
  if (!student) {
    return { success: false, message: 'ไม่พบรหัสนักศึกษาหรือบัญชีผู้ใช้นี้ในระบบ' };
  }

  const expectedPassword = getStudentPassword(student.id);
  if (cleanPassword !== expectedPassword) {
    return { success: false, message: 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' };
  }

  const mustChange = !isPasswordChanged(student.id);

  return { 
    success: true, 
    user: {
      id: student.id,
      name: student.name,
      role: 'student',
      mustChangePassword: mustChange
    }
  };
}

// Backward-compatible alias
export function authenticateStudent(studentId, password) {
  const res = authenticateUser(studentId, password);
  if (res.success) {
    return { success: true, student: res.user };
  }
  return res;
}
