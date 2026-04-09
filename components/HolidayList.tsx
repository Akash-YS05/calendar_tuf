'use client';

import { motion } from 'framer-motion';
import { HOLIDAYS } from '@/lib/holidays';

interface HolidayListProps {
  month: number;
}

export default function HolidayList({ month }: HolidayListProps) {
  const currentHolidays = HOLIDAYS.filter(h => h.month === month).sort((a, b) => a.day - b.day);

  return (
    <motion.div
      key={`holidays-${month}`}
      className="p-5 lg:p-6 neo-in-sm rounded-[1.5rem] h-full flex flex-col"
      initial={{ opacity: 0, rotateX: 90 }}
      animate={{ opacity: 1, rotateX: 0 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
      style={{ transformOrigin: "bottom", perspective: 1000 }}
    >
      <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-[var(--foreground)] opacity-90 drop-shadow-sm">
        Holidays
      </h3>
      
      {currentHolidays.length > 0 ? (
        <div className="flex flex-col gap-3 overflow-y-auto p-3 custom-scrollbar flex-grow rounded-[1rem]">
          {currentHolidays.map((holiday, idx) => (
            <div 
              key={`${holiday.day}-${idx}`}
              className="flex items-center justify-between p-3 neo-out-sm rounded-[1rem]"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-[0.5rem] neo-in-sm text-sm font-bold text-[var(--color-neo-accent)]">
                  {holiday.day}
                </span>
                <span className="text-sm font-semibold opacity-80 text-[var(--foreground)]">
                  {holiday.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center neo-out-sm rounded-[1rem]">
          <p className="font-bold uppercase tracking-widest opacity-30 text-xs sm:text-sm">
            No holidays this month
          </p>
        </div>
      )}
    </motion.div>
  );
}
