export const cweeks = 7;

export type EntryInfo = {
  dayOfYear: number;
  date: string;
  text: string;
};

export type WeekInfo = {
  cdayMonday: number;
  strWeekImg: string;
  strImageAlt: string;
  entries: EntryInfo[];
}
