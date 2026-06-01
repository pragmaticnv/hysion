import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseService';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, documentId } from 'firebase/firestore';
import { Theme, User, Attendance } from '../types';
import { Check, X, Calendar, Mic } from 'lucide-react';
import { auth, handleFirestoreError, OperationType } from '../services/firebaseService';
import { useStore } from '../store/useStore';

export const AttendancePanel: React.FC = () => {
  const { user, setIsAttendanceOpen, theme, isTranscriptionOpen, setIsTranscriptionOpen } = useStore();
  const onClose = () => setIsAttendanceOpen(false);
  const [students, setStudents] = useState<User[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch students
      let usersQuery;
      if (user.role === 'teacher') {
        usersQuery = query(collection(db, 'users'), where('role', '==', 'student'));
      } else {
        usersQuery = query(collection(db, 'users'), where(documentId(), '==', user.uid));
      }
      let usersSnapshot;
      try {
        usersSnapshot = await getDocs(usersQuery);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'users');
      }
      const studentList = usersSnapshot!.docs.map(doc => ({ ...doc.data(), uid: doc.id } as User));
      setStudents(studentList);

      // Fetch today's attendance
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let attendanceQuery;
      if (user.role === 'teacher') {
        attendanceQuery = query(collection(db, 'attendance'), where('date', '>=', today), orderBy('date', 'desc'));
      } else {
        attendanceQuery = query(collection(db, 'attendance'), where('studentUid', '==', user.uid), where('date', '>=', today), orderBy('date', 'desc'));
      }
      let attendanceSnapshot;
      try {
        attendanceSnapshot = await getDocs(attendanceQuery);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'attendance');
      }
      const records = attendanceSnapshot!.docs.map(doc => ({ ...doc.data(), id: doc.id } as Attendance));
      setAttendanceRecords(records);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  const markAttendance = async (student: User, status: 'present' | 'absent') => {
    try {
      await addDoc(collection(db, 'attendance'), {
        studentUid: student.uid,
        studentName: student.displayName || 'Unknown',
        rollNo: student.rollNo || 'N/A',
        date: serverTimestamp(),
        status
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'attendance');
    }
    // Refresh records
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let attendanceQuery;
    if (user.role === 'teacher') {
      attendanceQuery = query(collection(db, 'attendance'), where('date', '>=', today), orderBy('date', 'desc'));
    } else {
      attendanceQuery = query(collection(db, 'attendance'), where('studentUid', '==', user.uid), where('date', '>=', today), orderBy('date', 'desc'));
    }
    let attendanceSnapshot;
    try {
      attendanceSnapshot = await getDocs(attendanceQuery);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'attendance');
    }
    const records = attendanceSnapshot!.docs.map(doc => ({ ...doc.data(), id: doc.id } as Attendance));
    setAttendanceRecords(records);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm`}>
      <div className={`w-full max-w-2xl ${theme.uiBg} border ${theme.border} rounded-2xl p-6 shadow-2xl`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-indigo-400" /> Attendance Management
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsTranscriptionOpen(!isTranscriptionOpen)}
              className={`p-2 rounded-full ${isTranscriptionOpen ? 'bg-indigo-600' : 'bg-zinc-700'} text-white hover:bg-indigo-500`}
            >
              <Mic size={18} />
            </button>
            <button onClick={onClose} className="text-zinc-400 hover:text-white">Close</button>
          </div>
        </div>

        {loading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : (
          <div className="space-y-4 mt-4">
            {students.map(student => {
              const record = attendanceRecords.find(r => r.studentUid === student.uid);
              return (
                <div key={student.uid} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-semibold text-white">{student.displayName}</p>
                    <p className="text-sm text-zinc-400">Roll No: {student.rollNo || 'N/A'}</p>
                  </div>
                  {user.role === 'teacher' ? (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => markAttendance(student, 'present')}
                        className={`p-2 rounded ${record?.status === 'present' ? 'bg-green-600' : 'bg-zinc-700'} hover:bg-green-500`}
                      >
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={() => markAttendance(student, 'absent')}
                        className={`p-2 rounded ${record?.status === 'absent' ? 'bg-red-600' : 'bg-zinc-700'} hover:bg-red-500`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-sm ${record?.status === 'present' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                      {record?.status || 'Not marked'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
