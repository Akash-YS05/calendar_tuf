'use client';

import { useState, useCallback, useSyncExternalStore, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Note, DateRange } from './types';

interface NotesPanelProps {
  dateRange: DateRange;
}

const STORAGE_KEY = 'calendar-notes';

function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getRangeKey(range: DateRange): string {
  if (!range.start) return '';
  if (!range.end) return getDateKey(range.start);
  const startKey = getDateKey(range.start);
  const endKey = getDateKey(range.end);
  return startKey === endKey ? startKey : `${startKey}_to_${endKey}`;
}

function loadNotes(): Record<string, Note> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveNotes(notes: Record<string, Note>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes:', e);
  }
}

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function NotesPanel({ dateRange }: NotesPanelProps) {
  const isHydrated = useHydrated();
  const [notes, setNotes] = useState<Record<string, Note>>(() => isHydrated ? loadNotes() : {});
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  let currentKey = getRangeKey(dateRange);
  let currentNote = currentKey ? notes[currentKey] : null;

  // If a single date is selected and there's no exact match,
  // check if this date falls within any saved multi-date range.
  if (!currentNote && dateRange.start && (!dateRange.end || dateRange.start.getTime() === dateRange.end.getTime())) {
    const targetTime = dateRange.start.getTime();
    
    // Sort keys to prioritize the most recently created notes in case of overlaps
    const sortedEntries = Object.entries(notes).sort((a, b) => b[1].createdAt - a[1].createdAt);

    for (const [key, note] of sortedEntries) {
      if (key.includes('_to_')) {
        const [startStr, endStr] = key.split('_to_');
        const [sYear, sMonth, sDay] = startStr.split('-').map(Number);
        const [eYear, eMonth, eDay] = endStr.split('-').map(Number);
        
        const startDate = new Date(sYear, sMonth - 1, sDay);
        const endDate = new Date(eYear, eMonth - 1, eDay);
        
        if (targetTime >= startDate.getTime() && targetTime <= endDate.getTime()) {
          currentKey = key;
          currentNote = note;
          break;
        }
      }
    }
  }

  // Automatically cancel editing and clear local textarea when clicking to a different date
  useEffect(() => {
    setIsEditing(false);
    setNoteContent('');
  }, [currentKey]);

  const startEditing = () => {
    setNoteContent(currentNote?.content || '');
    setIsEditing(true);
  };

  const saveNote = useCallback((content: string) => {
    if (!currentKey) return;
    
    setNotes((prev) => {
      const newNotes = { ...prev };
      if (content.trim()) {
        newNotes[currentKey] = {
          id: currentKey,
          dateKey: currentKey,
          content: content.trim(),
          createdAt: currentNote?.createdAt || Date.now(),
          updatedAt: Date.now(),
        };
      } else {
        delete newNotes[currentKey];
      }
      saveNotes(newNotes);
      return newNotes;
    });
  }, [currentKey, currentNote]);

  const handleSave = () => {
    saveNote(noteContent);
    setIsEditing(false);
  };

  const handleClear = () => {
    setNoteContent('');
    saveNote('');
    setIsEditing(false);
  };

  const formatDateRange = (): string => {
    // If we're displaying an overarching multi-day note for a single clicked date, show the note's original range.
    if (currentKey && currentKey.includes('_to_')) {
      const [startStr, endStr] = currentKey.split('_to_');
      const [sYear, sMonth, sDay] = startStr.split('-').map(Number);
      const [eYear, eMonth, eDay] = endStr.split('-').map(Number);
      const sDate = new Date(sYear, sMonth - 1, sDay);
      const eDate = new Date(eYear, eMonth - 1, eDay);
      
      return `${sDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${eDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }

    if (!dateRange.start) return '';
    if (!dateRange.end) {
      return dateRange.start.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    if (getDateKey(dateRange.start) === getDateKey(dateRange.end)) {
      return dateRange.start.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return `${dateRange.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${dateRange.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  if (!isHydrated) {
    return (
      <div className="p-5 lg:p-6 neo-in-sm rounded-[1.5rem] m-4 lg:mx-6 h-full min-h-[160px] animate-pulse">
        <div className="h-3 bg-[var(--color-neo-dark)] opacity-20 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-[var(--color-neo-dark)] opacity-10 rounded"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-4 lg:p-5 mx-4 lg:mx-6 mb-2 neo-in-sm rounded-[1.5rem] h-full flex flex-col min-h-[220px]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2, type: "spring", stiffness: 150 }}
    >
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-[var(--foreground)] opacity-90 drop-shadow-sm">
          Journal Notes
        </h3>
        {currentNote && !isEditing && (
          <motion.button
            onClick={startEditing}
            className="px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[var(--color-neo-accent)] neo-out-sm rounded-[1rem] cursor-pointer active:neo-in-sm"
            whileHover={{ scale: 1.05 }}
          >
            Edit
          </motion.button>
        )}
      </div>

      {dateRange.start ? (
        <div className="flex flex-col min-h-0 flex-grow">
          <p className="text-[10px] sm:text-xs font-bold opacity-50 uppercase tracking-wider text-[var(--foreground)] mb-2 flex-shrink-0">
            {formatDateRange()}
          </p>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col min-h-0 flex-grow"
              >
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Capture your thoughts..."
                  className="w-full flex-grow min-h-[60px] p-3 text-xs sm:text-sm font-medium text-[var(--foreground)] bg-[var(--background)] neo-in rounded-[1rem] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-neo-accent)] transition-colors duration-300 placeholder-opacity-30 custom-scrollbar"
                  autoFocus
                />
                <div className="flex gap-2 mt-3 flex-shrink-0">
                  <motion.button
                    onClick={handleSave}
                    className="flex-1 py-2 neo-accent-out rounded-[1rem] text-[10px] sm:text-xs font-extrabold uppercase tracking-widest cursor-pointer active:neo-accent-in"
                    whileHover={{ scale: 1.02 }}
                  >
                    Save Note
                  </motion.button>
                  {currentNote && (
                    <motion.button
                      onClick={handleClear}
                      className="px-3 py-2 neo-out-sm rounded-[1rem] text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#ef4444] opacity-80 hover:opacity-100 cursor-pointer active:neo-in-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      Clear
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => {
                      setIsEditing(false);
                      setNoteContent(currentNote?.content || '');
                    }}
                    className="px-3 py-2 neo-out-sm rounded-[1rem] text-[10px] sm:text-xs font-extrabold uppercase tracking-widest opacity-60 hover:opacity-100 cursor-pointer active:neo-in-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col min-h-0 flex-grow"
              >
                {currentNote?.content ? (
                  <div className="p-3 lg:p-4 neo-out-sm rounded-[1rem] flex-grow overflow-y-auto custom-scrollbar">
                    <p className="whitespace-pre-wrap text-xs sm:text-sm font-semibold opacity-70 leading-relaxed text-[var(--foreground)]">
                      {currentNote.content}
                    </p>
                  </div>
                ) : (
                  <motion.button
                    onClick={startEditing}
                    className="w-full h-full min-h-[80px] flex items-center justify-center neo-out-sm rounded-[1rem] cursor-pointer group active:neo-in-sm"
                    whileHover={{ scale: 1.01 }}
                  >
                    <p className="font-extrabold text-xs uppercase tracking-widest opacity-30 group-hover:text-[var(--color-neo-accent)] group-hover:opacity-100 transition-colors duration-300">
                      Tap to start writing...
                    </p>
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center neo-out-sm rounded-[1rem]">
          <p className="font-bold uppercase tracking-widest opacity-30 text-[10px] sm:text-xs">
            Select a date to journal
          </p>
        </div>
      )}
    </motion.div>
  );
}
