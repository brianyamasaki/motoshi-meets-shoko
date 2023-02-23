export const cweeks = 7;
export const cdayFirstMonday = 83;

export type EntryInfo = {
  dayOfYear: number;
  date: string;
  text: string;
  textImg: string;
};

export type WeekInfo = {
  cdayMonday: number;
  strWeekImg: string;
  strImageAlt: string;
  entries: EntryInfo[];
}
