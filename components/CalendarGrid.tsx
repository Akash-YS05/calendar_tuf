'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HOLIDAYS } from '@/lib/holidays';
import CalendarDay from './CalendarDay';
import { CalendarDay as CalendarDayType, DateRange, DayState } from './types';

interface CalendarGridProps {
  year: number;
  month: number;
  dateRange: DateRange;
  hoverDate: Date | null;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDate(date1: Date, date2: Date | null): boolean {
  if (!date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const time = date.getTime();
  return time > start.getTime() && time < end.getTime();
}

function isDateBetween(date: Date, start: Date, end: Date): boolean {
  const time = date.getTime();
  return time > start.getTime() && time < end.getTime();
}

function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getDayState(
  day: CalendarDayType,
  dateRange: DateRange,
  hoverDate: Date | null
): DayState {
  const { start, end } = dateRange;

  if (start && end) {
    if (isSameDate(day.date, start)) return 'start';
    if (isSameDate(day.date, end)) return 'end';
    if (isDateInRange(day.date, start, end)) return 'inRange';
  }

  if (start && !end) {
    if (!hoverDate) {
      if (isSameDate(day.date, start)) return 'start-only';
    } else {
      const isStartFirst = start.getTime() < hoverDate.getTime();
      const visualStart = isStartFirst ? start : hoverDate;
      const visualEnd = isStartFirst ? hoverDate : start;

      if (isSameDate(day.date, visualStart)) return 'start';
      if (isSameDate(day.date, visualEnd)) return 'end';
      if (isDateBetween(day.date, visualStart, visualEnd)) return 'hoverRange';
    }
  }

  return 'default';
}

export default function CalendarGrid({
  year,
  month,
  dateRange,
  hoverDate,
  onDateClick,
  onDateHover,
}: CalendarGridProps) {
  const days = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysArray: CalendarDayType[] = [];

    // Previous month days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(prevYear, prevMonth, day);
      daysArray.push({
        date,
        day,
        isCurrentMonth: false,
        isToday: false,
        holidays: HOLIDAYS.filter(h => h.month === prevMonth && h.day === day).map(h => h.name)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      daysArray.push({
        date,
        day: i,
        isCurrentMonth: true,
        isToday: isSameDate(date, today),
        holidays: HOLIDAYS.filter(h => h.month === month && h.day === i).map(h => h.name)
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - daysArray.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(nextYear, nextMonth, i);
      daysArray.push({
        date,
        day: i,
        isCurrentMonth: false,
        isToday: false,
        holidays: HOLIDAYS.filter(h => h.month === nextMonth && h.day === i).map(h => h.name)
      });
    }

    return daysArray;
  }, [year, month]);

  return (
    <div className="bg-[var(--background)] rounded-[1.5rem] px-4 lg:px-5">
      <div className="grid grid-cols-7 gap-3 mb-3 neo-in-sm rounded-[1rem] p-3">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[var(--foreground)] opacity-40"
          >
            {day}
          </div>
        ))}
      </div>

      <motion.div
        key={`${year}-${month}`}
        className="grid grid-cols-7 gap-y-3"
        initial={{ opacity: 0, rotateX: -90 }}
        animate={{ opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        style={{ transformOrigin: "top", perspective: 1000 }}
      >
        {days.map((day) => (
          <div key={getDateKey(day.date)} className="flex justify-center relative">
            <CalendarDay
              day={day}
              state={getDayState(day, dateRange, hoverDate)}
              onClick={onDateClick}
              onMouseEnter={onDateHover}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
