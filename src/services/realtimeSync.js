import { ref, set, update, onValue, off, get, child } from 'firebase/database';
import { getFirebaseDB } from './firebase';
import { 
  getExercisePermission, 
  setExercisePermission,
  getSolutionPermission,
  setSolutionPermission,
  getStudentSubmission,
  submitStudentWork,
  cancelStudentSubmission,
  recordStudentCodeUpdate,
  recordStudentLogin
} from '../utils/adminStorage';
import { 
  getStudentPassword, 
  setStudentPassword, 
  resetStudentPassword,
  isPasswordChanged,
  STUDENTS_DATABASE
} from '../data/students';
import { hashPassword, DEFAULT_STUDENT_PASSWORD_HASH } from '../utils/crypto';

/**
 * Sync Classroom permissions to Firebase Realtime Database
 */
export async function syncClassroomPermission(key, value) {
  // Always update local cache first
  if (key === 'exerciseEnabled') setExercisePermission(value);
  if (key === 'solutionEnabled') setSolutionPermission(value);

  const db = getFirebaseDB();
  if (!db) return false;

  try {
    const classroomRef = ref(db, `classroom/${key}`);
    await set(classroomRef, value);
    return true;
  } catch (err) {
    console.warn(`Firebase sync failed for ${key}:`, err);
    return false;
  }
}

/**
 * Listen to real-time classroom settings (Exercise lock & Solution toggle)
 */
export function subscribeToClassroom(callback) {
  const db = getFirebaseDB();
  if (!db) {
    // Fallback to local storage
    callback({
      exerciseEnabled: getExercisePermission(),
      solutionEnabled: getSolutionPermission()
    });
    return () => {};
  }

  const classroomRef = ref(db, 'classroom');
  const unsubscribe = onValue(classroomRef, (snapshot) => {
    const data = snapshot.val() || {};
    const exerciseEnabled = data.exerciseEnabled !== undefined ? data.exerciseEnabled : getExercisePermission();
    const solutionEnabled = data.solutionEnabled !== undefined ? data.solutionEnabled : getSolutionPermission();

    // Sync to local cache so offline works
    setExercisePermission(exerciseEnabled);
    setSolutionPermission(solutionEnabled);

    callback({ exerciseEnabled, solutionEnabled });
  }, (err) => {
    console.warn('Realtime classroom subscription error:', err);
    callback({
      exerciseEnabled: getExercisePermission(),
      solutionEnabled: getSolutionPermission()
    });
  });

  return () => off(classroomRef, 'value', unsubscribe);
}

/**
 * Clear test data for a single student (localStorage + Firebase)
 */
export async function clearSingleStudentData(studentId) {
  if (!studentId || studentId === 'admin') return;

  // Clear localStorage keys
  localStorage.removeItem(`ws_code_${studentId}`);
  localStorage.removeItem(`ws_last_login_${studentId}`);
  localStorage.removeItem(`ws_first_login_${studentId}`);
  localStorage.removeItem(`ws_code_updated_${studentId}`);
  localStorage.removeItem(`ws_submitted_${studentId}`);
  localStorage.removeItem(`ws_pwd_${studentId}`);
  localStorage.removeItem(`ws_pwd_changed_${studentId}`);

  // Clear Firebase node
  const db = getFirebaseDB();
  if (db) {
    try {
      const studentRef = ref(db, `students/${studentId}`);
      await set(studentRef, null);
    } catch (err) {
      console.warn(`Failed to clear Firebase data for student ${studentId}:`, err);
    }
  }
}

/**
 * Clear all test data for all students in the classroom (localStorage + Firebase)
 */
export async function clearAllStudentsData() {
  // Clear localStorage keys for all students
  STUDENTS_DATABASE.forEach(s => {
    const id = s.id;
    localStorage.removeItem(`ws_code_${id}`);
    localStorage.removeItem(`ws_last_login_${id}`);
    localStorage.removeItem(`ws_first_login_${id}`);
    localStorage.removeItem(`ws_code_updated_${id}`);
    localStorage.removeItem(`ws_submitted_${id}`);
    localStorage.removeItem(`ws_pwd_${id}`);
    localStorage.removeItem(`ws_pwd_changed_${id}`);
  });

  // Clear Firebase node
  const db = getFirebaseDB();
  if (db) {
    try {
      const studentsRef = ref(db, 'students');
      await set(studentsRef, null);
    } catch (err) {
      console.warn('Failed to clear Firebase students data:', err);
    }
  }
}

/**
 * Record Student Login in Firebase & LocalStorage
 */
export async function syncStudentLogin(studentId) {
  if (!studentId || studentId === 'admin') return;
  recordStudentLogin(studentId);

  const db = getFirebaseDB();
  if (!db) return;

  const now = new Date().toISOString();
  try {
    const studentRef = ref(db, `students/${studentId}`);
    await update(studentRef, {
      lastLogin: now
    });
  } catch (err) {
    console.warn('Failed to sync student login to Firebase:', err);
  }
}

/**
 * Sync Student Code updates in Firebase (Debounced on caller side)
 */
export async function syncStudentCode(studentId, code) {
  if (!studentId || studentId === 'admin') return;
  recordStudentCodeUpdate(studentId, code);

  const db = getFirebaseDB();
  if (!db) return;

  const now = new Date().toISOString();
  try {
    const studentRef = ref(db, `students/${studentId}`);
    await update(studentRef, {
      code: code,
      lastUpdated: now
    });
  } catch (err) {
    console.warn('Failed to sync student code to Firebase:', err);
  }
}

/**
 * Sync Student Submission (Lock/Unlock) in Firebase
 */
export async function syncStudentSubmission(studentId, isSubmitted) {
  if (!studentId || studentId === 'admin') return;
  
  if (isSubmitted) {
    submitStudentWork(studentId);
  } else {
    cancelStudentSubmission(studentId);
  }

  const db = getFirebaseDB();
  if (!db) return;

  const now = new Date().toISOString();
  try {
    const studentRef = ref(db, `students/${studentId}`);
    await update(studentRef, {
      isSubmitted: isSubmitted,
      submittedAt: isSubmitted ? now : null
    });
  } catch (err) {
    console.warn('Failed to sync submission to Firebase:', err);
  }
}

/**
 * Sync Student Password Change in Firebase (Saved as SHA-256 Hash)
 */
export async function syncStudentPasswordChange(studentId, newPassword) {
  if (!studentId || studentId === 'admin') return { success: false };
  const res = await setStudentPassword(studentId, newPassword);
  if (!res.success) return res;

  const hash = res.hash || await hashPassword(newPassword);

  const db = getFirebaseDB();
  if (!db) return res;

  try {
    const studentRef = ref(db, `students/${studentId}`);
    await update(studentRef, {
      passwordHash: hash,
      password: null, // Wipe plain-text password from Firebase
      hasChangedPassword: true,
      passwordUpdatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Failed to sync password change to Firebase:', err);
  }

  return { success: true };
}

/**
 * Teacher Reset Student Password in Firebase (Reset to hash of 'kmitl')
 */
export async function syncStudentPasswordReset(studentId) {
  if (!studentId || studentId === 'admin') return { success: false };
  resetStudentPassword(studentId);

  const db = getFirebaseDB();
  if (!db) return { success: true };

  try {
    const studentRef = ref(db, `students/${studentId}`);
    await update(studentRef, {
      passwordHash: DEFAULT_STUDENT_PASSWORD_HASH,
      password: null, // Wipe plain-text password from Firebase
      hasChangedPassword: false,
      passwordResetAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Failed to sync password reset to Firebase:', err);
  }

  return { success: true };
}

/**
 * Listen to all students progress live for Admin Dashboard
 */
export function subscribeToAllStudents(callback) {
  const db = getFirebaseDB();
  if (!db) return () => {};

  const studentsRef = ref(db, 'students');
  const unsubscribe = onValue(studentsRef, (snapshot) => {
    const data = snapshot.val() || {};

    // If student data was deleted or not in Firebase, purge local storage keys so cache does not persist
    STUDENTS_DATABASE.forEach(s => {
      const id = s.id;
      if (!data[id]) {
        localStorage.removeItem(`ws_code_${id}`);
        localStorage.removeItem(`ws_last_login_${id}`);
        localStorage.removeItem(`ws_first_login_${id}`);
        localStorage.removeItem(`ws_code_updated_${id}`);
        localStorage.removeItem(`ws_submitted_${id}`);
        localStorage.removeItem(`ws_pwd_${id}`);
        localStorage.removeItem(`ws_pwd_changed_${id}`);
      }
    });

    // Merge remote student data with localStorage
    Object.keys(data).forEach((id) => {
      const remote = data[id];
      if (!remote) return;
      if (remote.code !== undefined && remote.code !== null) {
        localStorage.setItem(`ws_code_${id}`, remote.code);
      }
      if (remote.lastLogin) {
        localStorage.setItem(`ws_last_login_${id}`, remote.lastLogin);
      }
      if (remote.lastUpdated) {
        localStorage.setItem(`ws_code_updated_${id}`, remote.lastUpdated);
      }
      if (remote.isSubmitted) {
        localStorage.setItem(`ws_submitted_${id}`, remote.submittedAt || new Date().toISOString());
      } else if (remote.isSubmitted === false) {
        localStorage.removeItem(`ws_submitted_${id}`);
      }
      if (remote.passwordHash) {
        localStorage.setItem(`ws_pwd_${id}`, remote.passwordHash);
      } else if (remote.password) {
        // Upgrade legacy plain text password to SHA-256 hash
        hashPassword(remote.password).then(h => {
          localStorage.setItem(`ws_pwd_${id}`, h);
        });
      }
      if (remote.hasChangedPassword !== undefined) {
        if (remote.hasChangedPassword) {
          localStorage.setItem(`ws_pwd_changed_${id}`, 'true');
        } else {
          localStorage.removeItem(`ws_pwd_changed_${id}`);
        }
      }
    });

    callback(data);
  }, (err) => {
    console.warn('Realtime all students subscription error:', err);
  });

  return () => off(studentsRef, 'value', unsubscribe);
}

/**
 * Listen to single student data live (for student client to catch password reset or wipe by teacher)
 */
export function subscribeToStudentSelf(studentId, callback) {
  if (!studentId || studentId === 'admin') return () => {};

  const db = getFirebaseDB();
  if (!db) return () => {};

  const studentRef = ref(db, `students/${studentId}`);
  const unsubscribe = onValue(studentRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      // Remote data was cleared
      localStorage.removeItem(`ws_code_${studentId}`);
      localStorage.removeItem(`ws_last_login_${studentId}`);
      localStorage.removeItem(`ws_first_login_${studentId}`);
      localStorage.removeItem(`ws_code_updated_${studentId}`);
      localStorage.removeItem(`ws_submitted_${studentId}`);
      localStorage.removeItem(`ws_pwd_${studentId}`);
      localStorage.removeItem(`ws_pwd_changed_${studentId}`);
      callback(null);
      return;
    }

    if (data.passwordHash) {
      localStorage.setItem(`ws_pwd_${studentId}`, data.passwordHash);
    } else if (data.password) {
      // Upgrade legacy plain text password to SHA-256 hash
      hashPassword(data.password).then(h => {
        localStorage.setItem(`ws_pwd_${studentId}`, h);
      });
    }
    if (data.hasChangedPassword !== undefined) {
      if (data.hasChangedPassword) {
        localStorage.setItem(`ws_pwd_changed_${studentId}`, 'true');
      } else {
        localStorage.removeItem(`ws_pwd_changed_${studentId}`);
      }
    }
    if (data.isSubmitted !== undefined) {
      if (data.isSubmitted) {
        localStorage.setItem(`ws_submitted_${studentId}`, data.submittedAt || new Date().toISOString());
      } else {
        localStorage.removeItem(`ws_submitted_${studentId}`);
      }
    }

    callback(data);
  }, (err) => {
    console.warn('Realtime student subscription error:', err);
  });

  return () => off(studentRef, 'value', unsubscribe);
}
