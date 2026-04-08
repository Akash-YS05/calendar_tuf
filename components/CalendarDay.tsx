'use client';

import { motion } from 'framer-motion';
import { CalendarDay as CalendarDayType, DayState } from './types';

interface CalendarDayProps {
  day: CalendarDayType;
  state: DayState;
  onClick: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
}

function getStateClasses(state: DayState, isCurrentMonth: boolean): string {
  const baseClasses = 'relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-sm sm:text-base rounded-[1rem] font-bold transition-colors duration-300 cursor-pointer';
  
  if (!isCurrentMonth) {
    return `${baseClasses} text-[var(--foreground)] opacity-20 pointer-events-none`;
  }

  switch (state) {
    case 'start':
    case 'end':
      return `${baseClasses} neo-accent-out z-20 text-white`;
    case 'inRange':
      return `${baseClasses} neo-in-sm text-[var(--color-neo-accent)] opacity-80 z-10`;
    case 'hoverRange':
      return `${baseClasses} neo-in-sm text-[var(--color-neo-accent)] opacity-40 z-10`;
    default:
      return `${baseClasses} neo-out-sm text-[var(--foreground)] hover:neo-in-sm opacity-80 hover:opacity-100 hover:text-[var(--color-neo-accent)] z-10`;
  }
}

export default function CalendarDay({ day, state, onClick, onMouseEnter }: CalendarDayProps) {
  const stateClasses = getStateClasses(state, day.isCurrentMonth);
  
  return (
    <motion.button
      className={stateClasses}
      onClick={() => onClick(day.date)}
      onMouseEnter={() => onMouseEnter(day.date)}
      whileHover={{ scale: 1.1, zIndex: 30 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 20 }}
      title={day.holidays?.join(', ')}
    >
      <span className="relative z-10 flex flex-col items-center">
        {day.day}
        <div className="absolute -bottom-3 flex gap-1">
          {day.isToday && (
            <span className="w-1 h-1 rounded-full bg-[var(--color-neo-accent)]" />
          )}
          {day.holidays && day.holidays.length > 0 && (
            <span className="w-1 h-1 rounded-full bg-blue-500" title={day.holidays.join(', ')} />
          )}
        </div>
      </span>
    </motion.button>
  );
}
