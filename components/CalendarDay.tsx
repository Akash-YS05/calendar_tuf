'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDay as CalendarDayType, DayState } from './types';

interface CalendarDayProps {
  day: CalendarDayType;
  state: DayState;
  onClick: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
}

function getStateClasses(state: DayState, isCurrentMonth: boolean, dayOfWeek: number): string {
  const baseClasses = 'relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-sm sm:text-base font-bold transition-colors duration-300 cursor-pointer';
  
  if (!isCurrentMonth) {
    return `${baseClasses} rounded-[1rem] text-[var(--foreground)] opacity-20 pointer-events-none`;
  }

  const isLeftEdge = dayOfWeek === 0;
  const isRightEdge = dayOfWeek === 6;

  let roundness = 'rounded-[1rem]';
  if (state === 'start' && !isRightEdge) roundness = 'rounded-l-[1rem] rounded-r-none';
  if (state === 'end' && !isLeftEdge) roundness = 'rounded-r-[1rem] rounded-l-none';
  if (state === 'inRange' || state === 'hoverRange') {
    if (isLeftEdge && isRightEdge) roundness = 'rounded-[1rem]';
    else if (isLeftEdge) roundness = 'rounded-l-[1rem] rounded-r-none';
    else if (isRightEdge) roundness = 'rounded-r-[1rem] rounded-l-none';
    else roundness = 'rounded-none';
  }

  switch (state) {
    case 'start-only':
      return `${baseClasses} rounded-[1rem] neo-accent-out z-20 text-white`;
    case 'start':
    case 'end':
      return `${baseClasses} ${roundness} neo-accent-out z-20 text-white`;
    case 'inRange':
      return `${baseClasses} ${roundness} z-20 text-[var(--color-neo-accent)] font-extrabold scale-105`;
    case 'hoverRange':
      return `${baseClasses} ${roundness} z-20 text-[var(--color-neo-accent)] font-bold opacity-60 scale-105`;
    default:
      return `${baseClasses} rounded-[1rem] neo-out-sm text-[var(--foreground)] hover:neo-in-sm opacity-80 hover:opacity-100 hover:text-[var(--color-neo-accent)] z-10`;
  }
}

export default function CalendarDay({ day, state, onClick, onMouseEnter }: CalendarDayProps) {
  const dayOfWeek = day.date.getDay();
  const isLeftEdge = dayOfWeek === 0;
  const isRightEdge = dayOfWeek === 6;

  const stateClasses = getStateClasses(state, day.isCurrentMonth, dayOfWeek);
  
  const showBackgroundTrack = ['start', 'end', 'inRange', 'hoverRange'].includes(state);
  
  let troughPosition = '';
  let trackClass = '';

  if (state === 'start') {
    troughPosition = `left-1/2 right-0 ${isRightEdge ? 'rounded-r-[1rem]' : 'rounded-none'}`;
    trackClass = isRightEdge ? 'neo-track-full' : 'neo-track-left';
  } else if (state === 'end') {
    troughPosition = `left-0 right-1/2 ${isLeftEdge ? 'rounded-l-[1rem]' : 'rounded-none'}`;
    trackClass = isLeftEdge ? 'neo-track-full' : 'neo-track-right';
  } else if (state === 'inRange' || state === 'hoverRange') {
    troughPosition = 'left-0 right-0';
    if (isLeftEdge && isRightEdge) {
      troughPosition += ' rounded-[1rem]';
      trackClass = 'neo-track-full';
    } else if (isLeftEdge) {
      troughPosition += ' rounded-l-[1rem]';
      trackClass = 'neo-track-left';
    } else if (isRightEdge) {
      troughPosition += ' rounded-r-[1rem]';
      trackClass = 'neo-track-right';
    } else {
      troughPosition += ' rounded-none';
      trackClass = 'neo-track-middle';
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center py-1">
      {/* Continuous Range Background Trough */}
      <AnimatePresence>
        {showBackgroundTrack && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-1 bottom-1 ${trackClass} ${troughPosition}`}
            style={{ 
              opacity: state === 'hoverRange' ? 0.4 : 1,
              zIndex: 0
            }}
          />
        )}
      </AnimatePresence>

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
    </div>
  );
}
