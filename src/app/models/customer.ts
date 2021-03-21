export interface Customer {
  id?: string;
  name: string;
  hasAdvisory: boolean;
  primaryAdvisor?: string;
  supportHours: number;
  isActive?: boolean;
}
