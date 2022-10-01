export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface FirebaseDateRange extends UnixDateRange {}

export interface UnixDateRange {
  startDate?: number;
  endDate?: number;
}