import { Project } from '@app/models';
import {
  addProject,
  addProjectFailure,
  projectAdded,
  projectModified,
  projectRemoved,
  projectsAdded,
  loadProjectsFailure,
  loginChanged,
  updateProject,
  updateProjectFailure,
} from '@app/store/actions';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

export interface ProjectsState extends EntityState<Project> {
  loading: boolean;
  error?: Error;
}

const adapter = createEntityAdapter<Project>();

export const initialState = adapter.getInitialState({ loading: false });

const projectReducer = createReducer(
  initialState,
  on(loginChanged, state =>
    adapter.removeAll({ ...state, loading: true, error: undefined }),
  ),
  on(loadProjectsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(addProject, state => ({
    ...state,
    loading: true,
    error: undefined,
  })),
  on(addProjectFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(updateProject, state => ({
    ...state,
    loading: true,
    error: undefined,
  })),
  on(updateProjectFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(projectAdded, (state, { project }) =>
    adapter.addOne(project, { ...state, loading: false }),
  ),
  on(projectsAdded, (state, { projects }) =>
    adapter.addMany(projects, { ...state, loading: false }),
  ),
  on(projectModified, (state, { project }) =>
    adapter.updateOne(
      { id: project.id, changes: project },
      { ...state, loading: false },
    ),
  ),
  on(projectRemoved, (state, { project }) =>
    adapter.removeOne(project.id, { ...state, loading: false }),
  ),
);

export const reducer = (state: ProjectsState | undefined, action: Action) =>
  projectReducer(state, action);

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
export const selectors = {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
};
