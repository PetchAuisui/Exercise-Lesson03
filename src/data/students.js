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

export function authenticateStudent(studentId, password) {
  const cleanId = (studentId || '').trim();
  const cleanPassword = (password || '').trim();

  if (!cleanId) {
    return { success: false, message: 'กรุณากรอกรหัสนักศึกษา' };
  }

  const student = STUDENTS_DATABASE.find(s => s.id === cleanId);
  if (!student) {
    return { success: false, message: 'ไม่พบรหัสนักศึกษานี้ในระบบ' };
  }

  if (cleanPassword !== AUTH_PASSWORD) {
    return { success: false, message: 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' };
  }

  return { 
    success: true, 
    student: {
      id: student.id,
      name: student.name
    }
  };
}
