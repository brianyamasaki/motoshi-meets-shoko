export const cweeks = 7;
export const cdayFirstMonday = 83;

export type PhotoInfo = {
  imgSrc: string;
  label: string;
}

export type EntryInfo = {
  dayOfYear: number;
  date: string;
  text: string;
  textImg: string;
  relatedPhotos: PhotoInfo[];
};

export type WeekInfo = {
  cdayMonday: number;
  strWeekImg: string;
  strImageAlt: string;
  entries: EntryInfo[];
}
