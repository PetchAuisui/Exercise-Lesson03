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

export const ADMIN_CREDENTIALS = {
  email: 'siwarpatauisui@gmail.com',
  password: 'Struggle40980',
  name: 'อาจารย์ผู้สอน (Admin)',
  role: 'admin'
};

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
          role: 'admin'
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

  if (cleanPassword !== AUTH_PASSWORD) {
    return { success: false, message: 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' };
  }

  return { 
    success: true, 
    user: {
      id: student.id,
      name: student.name,
      role: 'student'
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
