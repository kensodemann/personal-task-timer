import { ProjectStatus } from './project-status';

export interface Project {
  id?: string;
  name: string;
  description: string;
  type: string;
  status: ProjectStatus;
  dueDate: string;
  customerId?: string;
  customerName?: string;
}
