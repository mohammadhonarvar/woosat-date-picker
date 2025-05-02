export const monthsDaysCount = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

export interface WeekDayInterface {
  name: string;
  shortName: string;
}
export const weekDayList = [
  { name: 'شنبه', shortName: 'ش' },
  { name: 'یک شنبه', shortName: 'ی' },
  { name: 'دوشنبه', shortName: 'د' },
  { name: 'سه شنبه', shortName: 'س' },
  { name: 'چهارشنبه', shortName: 'چ' },
  { name: 'پنجشنبه', shortName: 'پ' },
  { name: 'جمعه', shortName: 'ج' },
];

export interface MonthInterface {
  name: string;
  shortName: string;
  code: number;
}
export const monthList = [
  { name: 'فروردین', shortName: '', code: 0 },
  { name: 'اردیبهشت', shortName: '', code: 3 },
  { name: 'خرداد', shortName: '', code: 3 },
  { name: 'تیر', shortName: '', code: 6 },
  { name: 'مرداد', shortName: '', code: 1 },
  { name: 'شهریور', shortName: '', code: 4 },
  { name: 'مهر', shortName: '', code: 6 },
  { name: 'آبان', shortName: '', code: 2 },
  { name: 'آذر', shortName: '', code: 5 },
  { name: 'دی', shortName: '', code: 0 },
  { name: 'بهمن', shortName: '', code: 3 },
  { name: 'اسفند', shortName: '', code: 5 },
];
