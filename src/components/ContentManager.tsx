import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, BookOpen, Edit2 } from 'lucide-react';
import { Theme } from '../types';
import { contentService, CourseData, Module, RichSection } from '../services/contentService';

interface ContentManagerProps {
  onClose: () => void;
  theme: Theme;
}

export function ContentManager({ onClose, theme }: ContentManagerProps) {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await contentService.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingCourse || !editingCourse.id) return;
    try {
      const { id, ...courseData } = editingCourse;
      await contentService.saveCourse(id, courseData);
      setEditingCourse(null);
      loadCourses();
    } catch (error) {
      console.error("Failed to save course:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await contentService.deleteCourse(id);
        loadCourses();
      } catch (error) {
        console.error("Failed to delete course:", error);
      }
    }
  };

  const createNewCourse = () => {
    const newId = `course_${Date.now()}`;
    setEditingCourse({
      id: newId,
      title: 'New Course',
      subtitle: '',
      intro: '',
      sections: [],
      modules: []
    });
  };

  const updateField = (field: keyof CourseData, value: any) => {
    if (editingCourse) {
      setEditingCourse({ ...editingCourse, [field]: value });
    }
  };

  const addModule = () => {
    if (editingCourse) {
      const newModule: Module = {
        title: '',
        desc: '',
        completed: false,
        objectives: [''],
        interactiveLabel: '',
        quiz: { question: '', options: [''], correctAnswer: 0 }
      };
      setEditingCourse({ ...editingCourse, modules: [...editingCourse.modules, newModule] });
    }
  };

  const updateModule = (index: number, field: keyof Module, value: any) => {
    if (editingCourse) {
      const updatedModules = [...editingCourse.modules];
      updatedModules[index] = { ...updatedModules[index], [field]: value };
      setEditingCourse({ ...editingCourse, modules: updatedModules });
    }
  };

  const addSection = () => {
    if (editingCourse) {
      const newSection: RichSection = {
        title: '',
        content: '',
        icon: 'BookOpen',
        color: 'text-blue-400'
      };
      setEditingCourse({ ...editingCourse, sections: [...editingCourse.sections, newSection] });
    }
  };

  const updateSection = (index: number, field: keyof RichSection, value: any) => {
    if (editingCourse) {
      const updatedSections = [...editingCourse.sections];
      updatedSections[index] = { ...updatedSections[index], [field]: value };
      setEditingCourse({ ...editingCourse, sections: updatedSections });
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
      <div className="w-full max-w-5xl h-[85vh] bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <BookOpen className={`text-${theme.primary}`} />
            Content Manager
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white"><X size={24} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 flex gap-6">
          {/* Left Sidebar: List of Courses */}
          <div className="w-1/3 border-r border-white/10 pr-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Courses</h3>
              <button onClick={createNewCourse} className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg text-white">
                <Plus size={18} />
              </button>
            </div>
            {loading ? (
              <div className="text-zinc-400">Loading courses...</div>
            ) : (
              <div className="space-y-2 overflow-y-auto flex-1">
                {courses.map(course => (
                  <div key={course.id} className={`p-3 rounded-lg border flex justify-between items-center cursor-pointer ${editingCourse?.id === course.id ? 'bg-zinc-800 border-white/20' : 'bg-zinc-900 border-white/5 hover:bg-zinc-800'}`} onClick={() => setEditingCourse(course)}>
                    <div>
                      <div className="font-bold text-white">{course.title}</div>
                      <div className="text-xs text-zinc-400 truncate">{course.subtitle}</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(course.id!); }} className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {courses.length === 0 && <div className="text-zinc-500 text-sm">No courses found. Create one!</div>}
              </div>
            )}
          </div>

          {/* Right Area: Editor */}
          <div className="w-2/3 flex flex-col">
            {editingCourse ? (
              <div className="space-y-6 overflow-y-auto pr-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2"><Edit2 size={18} /> Edit Course: {editingCourse.id}</h3>
                  <input placeholder="Course Title" value={editingCourse.title} onChange={e => updateField('title', e.target?.value || '')} className="w-full bg-zinc-900 p-3 rounded-lg border border-white/5 text-white" />
                  <input placeholder="Course Subtitle" value={editingCourse.subtitle} onChange={e => updateField('subtitle', e.target?.value || '')} className="w-full bg-zinc-900 p-3 rounded-lg border border-white/5 text-white" />
                  <textarea placeholder="Introduction" value={editingCourse.intro} onChange={e => updateField('intro', e.target?.value || '')} className="w-full bg-zinc-900 p-3 rounded-lg border border-white/5 text-white h-24" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Sections</h3>
                    <button onClick={addSection} className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-lg flex items-center gap-2 text-white text-sm">
                      <Plus size={14} /> Add Section
                    </button>
                  </div>
                  {editingCourse.sections.map((section, index) => (
                    <div key={index} className="bg-zinc-900 p-4 rounded-lg border border-white/5 space-y-2 relative">
                      <button onClick={() => {
                        const newSections = [...editingCourse.sections];
                        newSections.splice(index, 1);
                        updateField('sections', newSections);
                      }} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                      <input placeholder="Section Title" value={section.title} onChange={e => updateSection(index, 'title', e.target?.value || '')} className="w-full bg-black p-2 rounded border border-white/5 text-white" />
                      <textarea placeholder="Section Content" value={section.content} onChange={e => updateSection(index, 'content', e.target?.value || '')} className="w-full bg-black p-2 rounded border border-white/5 text-white h-20" />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Modules & Assessments</h3>
                    <button onClick={addModule} className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-lg flex items-center gap-2 text-white text-sm">
                      <Plus size={14} /> Add Module
                    </button>
                  </div>
                  {editingCourse.modules.map((module, index) => (
                    <div key={index} className="bg-zinc-900 p-4 rounded-lg border border-white/5 space-y-2 relative">
                      <button onClick={() => {
                        const newModules = [...editingCourse.modules];
                        newModules.splice(index, 1);
                        updateField('modules', newModules);
                      }} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                      <input placeholder="Module Title" value={module.title} onChange={e => updateModule(index, 'title', e.target?.value || '')} className="w-full bg-black p-2 rounded border border-white/5 text-white font-bold" />
                      <input placeholder="Module Description" value={module.desc} onChange={e => updateModule(index, 'desc', e.target?.value || '')} className="w-full bg-black p-2 rounded border border-white/5 text-white" />
                      <input placeholder="Interactive Label (e.g., 'Simulate Radar')" value={module.interactiveLabel} onChange={e => updateModule(index, 'interactiveLabel', e.target?.value || '')} className="w-full bg-black p-2 rounded border border-white/5 text-white" />
                      
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <h4 className="text-sm font-bold text-zinc-300 mb-2">Assessment / Quiz</h4>
                        <input placeholder="Quiz Question" value={module.quiz.question} onChange={e => updateModule(index, 'quiz', { ...module.quiz, question: e.target?.value || '' })} className="w-full bg-black p-2 rounded border border-white/5 text-white mb-2" />
                        <div className="grid grid-cols-2 gap-2">
                          {module.quiz.options.map((opt, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <input type="radio" name={`quiz-${index}`} checked={module.quiz.correctAnswer === optIndex} onChange={() => updateModule(index, 'quiz', { ...module.quiz, correctAnswer: optIndex })} />
                              <input placeholder={`Option ${optIndex + 1}`} value={opt} onChange={e => {
                                const newOptions = [...module.quiz.options];
                                newOptions[optIndex] = e.target?.value || '';
                                updateModule(index, 'quiz', { ...module.quiz, options: newOptions });
                              }} className="w-full bg-black p-2 rounded border border-white/5 text-white text-sm" />
                            </div>
                          ))}
                        </div>
                        <button onClick={() => {
                          const newOptions = [...module.quiz.options, ''];
                          updateModule(index, 'quiz', { ...module.quiz, options: newOptions });
                        }} className="text-xs text-blue-400 mt-2 hover:underline">Add Option</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-500">
                Select a course to edit or create a new one.
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-white/10 flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 text-zinc-400 hover:text-white">Close</button>
          {editingCourse && (
            <button onClick={handleSave} className={`bg-${theme.primary} text-white px-6 py-2 rounded-lg flex items-center gap-2`}>
              <Save size={18} /> Save Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
