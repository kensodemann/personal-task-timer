import { Project } from '@app/models';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectsState, selectors } from './reducer';

const byDueDate = (p1: Project, p2: Project) => {
  if (p1.dueDate < p2.dueDate) {
    return -1;
  }
  if (p1.dueDate > p2.dueDate) {
    return 1;
  }
  return 0;
};

export const selectProjects = createFeatureSelector('projects');
export const selectProjectEntities = createSelector(
  selectProjects,
  selectors.selectEntities,
);
export const selectAllProjects = createSelector(
  selectProjects,
  selectors.selectAll,
);
export const selectAllProjectsSorted = createSelector(
  selectAllProjects,
  projects => projects.sort(byDueDate),
);
export const selectOpenProjectsSorted = createSelector(
  selectAllProjects,
  projects =>
    projects.filter(project => project.status === 'Open').sort(byDueDate),
);
export const selectOnHoldProjectsSorted = createSelector(
  selectAllProjects,
  projects =>
    projects.filter(project => project.status === 'On Hold').sort(byDueDate),
);
export const selectProjectCount = createSelector(
  selectProjects,
  selectors.selectTotal,
);
export const selectProjectIds = createSelector(
  selectProjects,
  selectors.selectIds,
);
export const selectProjectLoading = createSelector(
  selectProjects,
  (state: ProjectsState) => state.loading,
);
export const selectProjectError = createSelector(
  selectProjects,
  (state: ProjectsState) => state.error,
);
export const selectProject = createSelector(
  selectAllProjects,
  (projects: Array<Project>, props: any) =>
    projects.find(c => c.id === props.projectId),
);
