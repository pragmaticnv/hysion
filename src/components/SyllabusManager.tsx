import { useState, useEffect } from 'react';
import { SYLLABUS_DATA } from '../constants/syllabus';
import { BookOpen, Plus, Edit, Trash2, X } from 'lucide-react';

interface SyllabusManagerProps {
  onClose?: () => void;
  theme?: any;
}

import { useStore } from '../store/useStore';

export function SyllabusManager() {
  const { setIsSyllabusOpen } = useStore();
  const onClose = () => setIsSyllabusOpen(false);
  const [courses, setCourses] = useState(SYLLABUS_DATA);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', curriculum: 'NCERT' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addCourse = () => {
    const id = newCourse.title.replace(/\s+/g, '');
    setCourses({ ...courses, [id]: { ...newCourse, id, modules: [] } });
    setNewCourse({ title: '', description: '', curriculum: 'NCERT' });
  };

  return (
    <div className={`fixed inset-0 z-50 p-6 bg-black text-white ${isMobile ? 'rounded-none' : 'rounded-xl'} overflow-y-auto transition-all duration-200`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold flex items-center gap-2`}>
          <BookOpen className="text-indigo-400" />
          Syllabus Manager
        </h2>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        )}
      </div>

      <div className="bg-black/40 p-4 rounded-lg mb-6 border border-white/5">
        <h3 className="font-bold mb-2">Add New Course</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input placeholder="Title" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target?.value || ''})} className="bg-black/40 p-2 rounded flex-1 border border-white/5 text-base" />
          <input placeholder="Description" value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target?.value || ''})} className="bg-black/40 p-2 rounded flex-1 border border-white/5 text-base" />
          <select value={newCourse.curriculum} onChange={e => setNewCourse({...newCourse, curriculum: e.target?.value || 'NCERT'})} className="bg-black/40 p-2 rounded border border-white/5 text-base">
            <option>NCERT</option>
            <option>ASSEB</option>
            <option>CBSE</option>
          </select>
          <button onClick={addCourse} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={18} />
            Add
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {Object.entries(courses).map(([id, course]: [string, any]) => (
          <div key={id} className="bg-black/40 p-4 rounded-lg border border-white/5 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{course.title} <span className="text-xs bg-zinc-700 px-2 py-1 rounded ml-2">{course.curriculum || 'General'}</span></h3>
              <p className="text-zinc-400 text-sm">{course.description}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-zinc-700 rounded"><Edit size={16} /></button>
              <button className="p-2 hover:bg-red-900/50 text-red-400 rounded"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
