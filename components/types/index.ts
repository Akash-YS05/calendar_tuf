export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  holidays?: string[];
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface Note {
  id: string;
  dateKey: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface NoteData {
  [key: string]: Note;
}

export type DayState = 'default' | 'start' | 'end' | 'inRange' | 'hoverRange';

export interface HeroImage {
  src: string;
  alt: string;
  credit?: string;
  creditUrl?: string;
}

export interface CalendarProps {
  heroImage?: HeroImage;
  initialMonth?: number;
  initialYear?: number;
}
