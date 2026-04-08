export interface Holiday {
  month: number; // 0-indexed
  day: number;
  name: string;
}

export const HOLIDAYS: Holiday[] = [
  // January
  { month: 0, day: 1, name: "New Year's Day" },
  { month: 0, day: 15, name: "Makar Sankranti" },
  { month: 0, day: 26, name: "Republic Day (IN)" },
  // February
  { month: 1, day: 14, name: "Valentine's Day" },
  // March
  { month: 2, day: 8, name: "Maha Shivaratri" },
  { month: 2, day: 25, name: "Holi" },
  { month: 2, day: 29, name: "Good Friday" },
  // April
  { month: 3, day: 11, name: "Eid al-Fitr" },
  { month: 3, day: 14, name: "Ambedkar Jayanti" },
  // May
  { month: 4, day: 1, name: "Labour Day" },
  { month: 4, day: 12, name: "Mother's Day" },
  // June
  { month: 5, day: 16, name: "Father's Day" },
  // July
  { month: 6, day: 4, name: "Independence Day (US)" },
  { month: 6, day: 17, name: "Muharram" },
  // August
  { month: 7, day: 15, name: "Independence Day (IN)" },
  { month: 7, day: 19, name: "Raksha Bandhan" },
  { month: 7, day: 26, name: "Janmashtami" },
  // September
  { month: 8, day: 7, name: "Ganesh Chaturthi" },
  { month: 8, day: 16, name: "Milad un-Nabi" },
  // October
  { month: 9, day: 2, name: "Gandhi Jayanti" },
  { month: 9, day: 12, name: "Dussehra" },
  { month: 9, day: 31, name: "Halloween" },
  { month: 9, day: 31, name: "Diwali" }, // Approximated
  // November
  { month: 10, day: 28, name: "Thanksgiving (US)" },
  // December
  { month: 11, day: 25, name: "Christmas" },
  { month: 11, day: 31, name: "New Year's Eve" },
];
