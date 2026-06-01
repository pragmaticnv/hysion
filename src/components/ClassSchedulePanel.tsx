import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const TIMES = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '1:00-2:00', '2:00-3:00', '3:00-4:00'];

export function ClassSchedulePanel() {
  const { setIsClassScheduleOpen, theme, classSchedule, setClassSchedule } = useStore();

  const handleCellChange = (day: string, time: string, value: string) => {
    setClassSchedule({ ...classSchedule, [`${day}-${time}`]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`fixed inset-0 z-[80] ${theme.uiBg} backdrop-blur-md flex flex-col`}
    >
      <div className={`p-6 border-b ${theme.border} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <Calendar className={theme.text} size={24} />
          <h2 className={`text-2xl font-bold ${theme.text}`}>Class Schedule</h2>
        </div>
        <button onClick={() => setIsClassScheduleOpen(false)} className={`p-2 ${theme.textMuted} hover:${theme.text}`}>
          <X size={24} />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-[120px_repeat(5,1fr)] gap-2">
          {/* Header */}
          <div />
          {DAYS.map(day => (
            <div key={day} className={`p-4 font-bold text-center rounded-xl bg-white/5 ${theme.text}`}>
              {day}
            </div>
          ))}
          
          {/* Grid */}
          {TIMES.map(time => (
            <React.Fragment key={time}>
              <div className={`p-4 font-mono text-sm ${theme.textMuted} flex items-center`}>
                {time}
              </div>
              {DAYS.map(day => (
                <input
                  key={`${day}-${time}`}
                  type="text"
                  value={classSchedule[`${day}-${time}`] || ''}
                  onChange={(e) => handleCellChange(day, time, e.target.value)}
                  className={`p-3 rounded-lg border bg-transparent ${theme.border} ${theme.text}`}
                  placeholder="Subject"
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
