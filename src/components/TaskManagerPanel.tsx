import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckSquare, Plus, Trash2, Edit2, Play, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateTaskBreakdown } from '../services/geminiService';
import { Task } from '../types';

export function TaskManagerPanel() {
  const { isTaskManagerOpen, setIsTaskManagerOpen, tasks, addTask, updateTask, deleteTask, theme } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectDescription, setProjectDescription] = useState('');
  const [sortBy, setSortBy] = useState<'none' | 'dueDate'>('none');

  if (!isTaskManagerOpen) return null;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      description: '',
      status: 'todo',
      priority: 'medium',
      createdAt: Date.now(),
      dueDate: newTaskDueDate || undefined,
    });
    setNewTaskTitle('');
    setNewTaskDueDate('');
  };

  const handleAIBreakdown = async () => {
    if (!projectDescription.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const generatedTasks = await generateTaskBreakdown(projectDescription);
      generatedTasks.forEach((task: Partial<Task>) => {
        addTask({
          id: Math.random().toString(36).substring(7),
          title: task.title || 'New Task',
          description: task.description || '',
          status: 'todo',
          priority: task.priority || 'medium',
          createdAt: Date.now(),
        });
      });
      setProjectDescription('');
    } catch (err) {
      console.error('Failed to generate tasks', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const statusColors = {
    'todo': 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    'in-progress': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    'done': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
  };

  const renderTaskList = (statusFilter: Task['status']) => {
    let filteredTasks = tasks.filter(t => t.status === statusFilter);

    if (sortBy === 'dueDate') {
      filteredTasks = filteredTasks.sort((a, b) => {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return dateA - dateB;
      });
    }

    return (
      <div className="flex flex-col gap-2">
        {filteredTasks.length === 0 && (
          <div className="text-center py-4 text-zinc-500 text-xs font-mono uppercase">Empty</div>
        )}
        <AnimatePresence>
        {filteredTasks.map(task => (
           <motion.div 
            key={task.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-3 rounded-xl border border-white/10 bg-black/20 group hover:border-${theme.primary}/30 transition-all ${task.status === 'done' ? 'opacity-70' : ''}`}
          >
            <div className="flex justify-between items-start gap-2">
              <h4 className={`text-sm text-zinc-200 font-medium ${task.status === 'done' ? 'line-through text-zinc-500' : ''}`}>{task.title}</h4>
              {task.status === 'done' && <CheckCircle size={14} className="text-emerald-500" />}
              <button onClick={() => deleteTask(task.id)} className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={14} />
              </button>
            </div>
            {task.description && <p className="text-xs text-zinc-400 mt-1">{task.description}</p>}
            {task.dueDate && <p className="text-[10px] text-zinc-500 font-mono mt-1">Due: {task.dueDate}</p>}
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <select 
                  value={task.status}
                  onChange={(e) => updateTask(task.id, { status: (e.target?.value as Task['status']) ?? 'todo' })}
                  className={`text-[10px] uppercase font-mono px-2 py-1 rounded-md border appearance-none outline-none cursor-pointer ${statusColors[task.status]}`}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <select
                  value={task.priority}
                  onChange={(e) => updateTask(task.id, { priority: (e.target?.value as Task['priority']) ?? 'medium' })}
                  className={`text-[10px] uppercase font-mono px-2 py-1 rounded-md border appearance-none outline-none cursor-pointer border-white/10 bg-black/40 text-zinc-300`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className={`fixed inset-4 sm:inset-10 z-[60] ${theme.uiBg} backdrop-blur-md border ${theme.border} rounded-3xl shadow-2xl flex flex-col overflow-hidden`}
    >
      {/* Header */}
      <div className={`p-6 border-b ${theme.border} flex items-center justify-between bg-white/5`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-${theme.primary}/20 border border-${theme.primary}/30 flex items-center justify-center text-${theme.primary}`}>
            <CheckSquare size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Developer Tasks</h2>
            <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest font-mono">Project Management & AI Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select value={sortBy} onChange={(e) => setSortBy(e.target?.value as any)} className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-300">
            <option value="none">No Sort</option>
            <option value="dueDate">Sort by Due Date</option>
          </select>
          <button onClick={() => setIsTaskManagerOpen(false)} className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto p-6">
          <div className="flex gap-6 min-w-max h-full">
            {/* TODO COLUMN */}
            <div className="w-80 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-amber-400" />
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">To Do ({tasks.filter(t=>t.status === 'todo').length})</h3>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pt-1 pb-10">
                {renderTaskList('todo')}
              </div>
            </div>

            {/* IN PROGRESS COLUMN */}
            <div className="w-80 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <Play size={16} className="text-blue-400" />
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">In Progress ({tasks.filter(t=>t.status === 'in-progress').length})</h3>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pt-1 pb-10">
                {renderTaskList('in-progress')}
              </div>
            </div>

            {/* DONE COLUMN */}
            <div className="w-80 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={16} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Done ({tasks.filter(t=>t.status === 'done').length})</h3>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pt-1 pb-10">
                {renderTaskList('done')}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / AI Tools */}
        <div className={`w-80 border-l ${theme.border} bg-black/20 p-6 flex flex-col gap-6 overflow-y-auto`}>
          <div>
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Sparkles size={14} /> AI Auto-Breakdown
            </h3>
            <p className="text-xs text-zinc-400 mb-3">Describe a feature or app concept, and the AI will generate a structured task list for you.</p>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target?.value || '')}
              placeholder="e.g. Build a user auth system with social login..."
              className="w-full h-24 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 resize-none mb-3"
            />
            <button 
              onClick={handleAIBreakdown}
              disabled={isGenerating || !projectDescription.trim()}
              className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                isGenerating || !projectDescription.trim() 
                  ? 'bg-white/5 text-zinc-500 cursor-not-allowed'
                  : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Tasks
                </>
              )}
            </button>
          </div>

          <div className={`h-px bg-${theme.border} w-full`} />

          <form onSubmit={handleAddTask}>
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-3">Add Manual Task</h3>
            <div className="flex flex-col gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-2 focus-within:border-white/30 transition-colors">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target?.value || '')}
                placeholder="Task title..."
                className="bg-transparent border-none outline-none text-sm text-zinc-200 placeholder:text-zinc-600"
              />
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target?.value || '')}
                className="bg-transparent border-none outline-none text-xs text-zinc-400"
              />
              <button 
                type="submit"
                disabled={!newTaskTitle.trim()}
                className={`w-full py-1.5 rounded-md transition-colors ${newTaskTitle.trim() ? `bg-${theme.primary}/20 text-${theme.primary} hover:bg-${theme.primary}/30` : 'bg-white/5 text-zinc-600 cursor-not-allowed'}`}
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
