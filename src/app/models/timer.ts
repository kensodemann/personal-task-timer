export interface Timer {
  id?: string;
  date: string;
  title: string;
  type: string;
  task?: string;
  bugFound?: boolean;
  minutes: number;
  startTime?: number;
  customer?: string;
  customerId?: string;
  customerName?: string;
}
