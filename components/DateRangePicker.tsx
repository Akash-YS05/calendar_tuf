'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateRange } from './types';

interface DateRangePickerProps {
  year: number;
  month: number;
  dateRange: DateRange;
  onMonthChange: (year: number, month: number) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function DateRangePicker({
  year,
  month,
  dateRange,
  onMonthChange,
}: DateRangePickerProps) {
  const [direction, setDirection] = useState(0);
  const monthName = MONTHS[month];

  const goToPrevMonth = () => {
    setDirection(-1);
    if (month === 0) {
      onMonthChange(year - 1, 11);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const goToNextMonth = () => {
    setDirection(1);
    if (month === 11) {
      onMonthChange(year + 1, 0);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setDirection(today.getMonth() > month ? 1 : -1);
    onMonthChange(today.getFullYear(), today.getMonth());
  };

  const formatSelectedRange = (): string => {
    if (!dateRange.start) return 'Select dates';
    if (!dateRange.end) {
      return dateRange.start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
    const startKey = `${dateRange.start.getMonth()}/${dateRange.start.getDate()}`;
    const endKey = `${dateRange.end.getMonth()}/${dateRange.end.getDate()}`;
    if (startKey === endKey) {
      return dateRange.start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
    return `${dateRange.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${dateRange.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const clearSelection = () => {
    onMonthChange(year, month);
  };

  return (
    <div className="bg-[var(--background)] p-3 lg:p-4 rounded-[1.5rem] flex items-center justify-between mx-2 mt-1">
      <div className="flex gap-2 items-center">
        <motion.button
          onClick={goToPrevMonth}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-[1rem] neo-out-sm transition-colors duration-300 text-[var(--foreground)] opacity-70 hover:opacity-100 hover:text-[var(--color-neo-accent)] cursor-pointer active:neo-in-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous month"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        <div className="w-28 sm:w-38 text-center">
          <motion.h2 
            key={`${year}-${month}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm sm:text-base lg:text-lg font-extrabold text-[var(--foreground)] tracking-wide"
          >
            {monthName} {year}
          </motion.h2>
        </div>

        <motion.button
          onClick={goToNextMonth}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-[1rem] neo-out-sm transition-colors duration-300 text-[var(--foreground)] opacity-70 hover:opacity-100 hover:text-[var(--color-neo-accent)] cursor-pointer active:neo-in-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Next month"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      <div className="flex gap-2 sm:gap-4 items-center">
        {!dateRange.start ? (
          <motion.div
            className="px-4 py-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest rounded-[1rem] neo-out-sm transition-colors duration-300 opacity-80 hover:opacity-100 text-[var(--color-neo-accent)] cursor-pointer active:neo-in-sm"
            whileHover={{ scale: 1.02 }}
            onClick={goToToday}
          >
            Today
          </motion.div>
        ) : null}

        <AnimatePresence mode="popLayout">
          {dateRange.start && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 px-3 py-2 rounded-[1rem] neo-in-sm"
            >
              <span className="text-xs font-bold uppercase tracking-wider opacity-80 text-[var(--color-neo-accent)]">
                {formatSelectedRange()}
              </span>
              <motion.button
                onClick={clearSelection}
                className="w-5 h-5 flex items-center justify-center rounded-full neo-out-sm transition-colors ml-1 cursor-pointer active:neo-in-sm"
                whileHover={{ scale: 1.1 }}
                aria-label="Clear selection"
              >
                <svg className="w-3 h-3 text-[var(--color-neo-accent)] opacity-80 hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
