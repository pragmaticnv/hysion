import React, { useState } from 'react';
import { useLabStore } from '../store/useLabStore';
import { LabExperiment, Department } from '../types/lab';
import { Plus, X } from 'lucide-react';

export function ExperimentDesigner({ onClose }: { onClose: () => void }) {
  const addExperiment = useLabStore((state) => state.addExperiment);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<Department>('physics');

  const handleSave = () => {
    const newExperiment: LabExperiment = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      department,
      objective: 'Custom experiment objective',
      estimatedTime: '30 mins',
      difficulty: 'Intermediate',
      safetyNote: 'Follow standard lab safety procedures.',
      apparatus: [],
      steps: [],
      vivaQuestions: [],
    };
    addExperiment(newExperiment);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Custom Experiment</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <input 
          className="w-full p-2 border rounded mb-4"
          placeholder="Experiment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select 
          className="w-full p-2 border rounded mb-4"
          value={department}
          onChange={(e) => setDepartment(e.target.value as Department)}
        >
          <option value="physics">Physics</option>
          <option value="chemistry">Chemistry</option>
          <option value="biology">Biology</option>
          <option value="math">Mathematics</option>
          <option value="circuits">Circuit Design</option>
        </select>
        <button 
          className="w-full bg-blue-600 text-white rounded p-2 font-bold"
          onClick={handleSave}
        >
          Save Experiment
        </button>
      </div>
    </div>
  );
}
