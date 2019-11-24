export interface Timer {
  id?: string;
  date: Date;
  title: string;
  customer: string;
  type: string;
  task?: string;
  bugFound?: boolean;
  minutes: number;
  startTime?: number;
}
