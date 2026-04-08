'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DateRangePicker from './DateRangePicker';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import HeroImage from './HeroImage';
import HolidayList from './HolidayList';
import { CalendarProps, DateRange } from './types';

export default function Calendar({ heroImage, initialMonth, initialYear }: CalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(initialYear ?? today.getFullYear());
  const [month, setMonth] = useState(initialMonth ?? today.getMonth());
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Default to light mode as requested, removing system preference auto-dark check
    document.documentElement.classList.remove('dark');
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  }, []);

  const handleMonthChange = useCallback((newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
    setDateRange({ start: null, end: null });
    setHoverDate(null);
  }, [setYear, setMonth]);

  const handleDateClick = useCallback((date: Date) => {
    setDateRange((prev) => {
      const clickedDate = new Date(date);
      clickedDate.setHours(0, 0, 0, 0);

      if (!prev.start || (prev.start && prev.end)) {
        return { start: clickedDate, end: null };
      }

      if (clickedDate.getTime() < prev.start.getTime()) {
        return { start: clickedDate, end: prev.start };
      }

      return { start: prev.start, end: clickedDate };
    });
  }, []);

  const handleDateHover = useCallback((date: Date) => {
    if (dateRange.start && !dateRange.end) {
      setHoverDate(new Date(date));
    }
  }, [dateRange.start, dateRange.end]);

  const handleClearSelection = useCallback(() => {
    setDateRange({ start: null, end: null });
    setHoverDate(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClearSelection();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClearSelection]);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-2 sm:p-4 lg:p-8 bg-[var(--background)] lg:origin-top lg:scale-[0.8] transition-colors duration-300 relative font-sans overflow-x-hidden">
      <div className="absolute top-2 right-2 lg:top-8 lg:right-8 z-50">
        <motion.button
          onClick={toggleTheme}
          className="w-12 h-12 flex items-center justify-center rounded-[1rem] neo-out-sm transition-colors duration-300 text-[var(--foreground)] opacity-70 hover:opacity-100 hover:text-[var(--color-neo-accent)] cursor-pointer active:neo-in-sm"
          whileHover={{ scale: 1.05 }}
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="w-full max-w-5xl flex flex-col min-h-[700px] relative pb-6 lg:pb-0">
        <motion.div
          className="neo-out rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden bg-[var(--background)] flex-grow flex flex-col mt-14 lg:mt-4 w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 100 }}
        >
          <div className="flex flex-col lg:flex-row flex-grow">
            <div className="lg:w-2/5 p-3 lg:p-4 lg:pr-2 flex flex-col gap-3">
              <div className="neo-in rounded-[1.5rem] p-2 relative group overflow-hidden h-[180px] sm:h-[220px] lg:h-[calc(100%-240px)] flex-shrink-0">
                <HeroImage heroImage={heroImage} month={month} year={year} />
              </div>
              <div className="flex-grow min-h-[140px] lg:min-h-[160px]">
                <HolidayList month={month} />
              </div>
            </div>

            <div className="lg:w-3/5 p-2 lg:p-3 flex flex-col h-full">
              <div className="flex-shrink-0">
                <DateRangePicker
                  year={year}
                  month={month}
                  dateRange={dateRange}
                  onMonthChange={handleMonthChange}
                />
              </div>
              
              <div className="flex-shrink-0 mt-2">
                <CalendarGrid
                  year={year}
                  month={month}
                  dateRange={dateRange}
                  hoverDate={hoverDate}
                  onDateClick={handleDateClick}
                  onDateHover={handleDateHover}
                />
              </div>

              <div className="flex-grow min-h-[220px] lg:min-h-[260px] mt-2 pb-2 lg:pb-0">
                <NotesPanel dateRange={dateRange} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.footer
          className="flex-shrink-0 mt-4 lg:mt-6 text-center text-[10px] lg:text-xs font-bold opacity-40 uppercase tracking-wider pb-6 lg:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p>Press <kbd className="px-2 py-1 mx-1 neo-out-sm rounded-md text-[10px]">ESC</kbd> to clear selection</p>
        </motion.footer>
      </div>
    </div>
  );
}
