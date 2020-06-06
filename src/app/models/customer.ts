export interface Customer {
  id?: string;
  name: string;
  hasAdvisory: boolean;
  primaryAdvisor?: string;
  supportHours: number;
  hasStencil: boolean;
  hasCapacitor: boolean;
  hasIdentityVault: boolean;
  hasAuthConnect: boolean;
  hasOfflineStorage: boolean;
}
