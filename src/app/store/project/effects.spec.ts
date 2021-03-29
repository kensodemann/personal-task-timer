import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ProjectsService } from '@app/core';
import { createProjectsServiceMock } from '@app/core/mocks';
import { Project } from '@app/models';
import {
  addProject,
  addProjectFailure,
  addProjectSuccess,
  projectAdded,
  projectModified,
  projectRemoved,
  projectsAdded,
  startup,
  updateProject,
  updateProjectFailure,
  updateProjectSuccess,
} from '@app/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ProjectEffects } from './effects';

let actions$: Observable<any>;
let effects: ProjectEffects;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      ProjectEffects,
      { provide: ProjectsService, useFactory: createProjectsServiceMock },
      provideMockActions(() => actions$),
    ],
  });

  effects = TestBed.inject<ProjectEffects>(ProjectEffects);
});

it('exists', () => {
  expect(effects).toBeTruthy();
});

describe('changes$', () => {
  it('observes changes to the projects', () => {
    const projectsService = TestBed.inject(ProjectsService);
    actions$ = of(startup());
    effects.changes$.subscribe(() => {});
    expect(projectsService.observeChanges).toHaveBeenCalledTimes(1);
  });

  describe('added change', () => {
    it('dispaches and added project action', done => {
      const projectsService = TestBed.inject(ProjectsService);
      (projectsService.observeChanges as any).mockReturnValue(
        of([
          {
            type: 'added',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  name: 'new project',
                  description: 'I am a newly added project',
                  type: 'Consulting',
                  status: 'Open',
                  dueDate: '2021-12-31',
                  customerId: '99f00e203s',
                  customerName: 'The Foo Bar',
                }),
              },
            },
          },
        ]),
      );
      actions$ = of(startup());
      effects.changes$.subscribe(action => {
        const expected = projectAdded({
          project: {
            id: '123499dfi',
            name: 'new project',
            description: 'I am a newly added project',
            type: 'Consulting',
            status: 'Open',
            dueDate: '2021-12-31',
            customerId: '99f00e203s',
            customerName: 'The Foo Bar',
          },
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('modified change', () => {
    it('dispaches and modified project action', done => {
      const projectsService = TestBed.inject(ProjectsService);
      (projectsService.observeChanges as any).mockReturnValue(
        of([
          {
            type: 'modified',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  name: 'new project',
                  description: 'I am a modified project',
                  type: 'Bug',
                  status: 'Open',
                  dueDate: '2021-12-15',
                  customerId: '99f00e203s',
                  customerName: 'The Foo Bar',
                }),
              },
            },
          },
        ]),
      );
      actions$ = of(startup());
      effects.changes$.subscribe(action => {
        const expected = projectModified({
          project: {
            id: '123499dfi',
            name: 'new project',
            description: 'I am a modified project',
            type: 'Bug',
            status: 'Open',
            dueDate: '2021-12-15',
            customerId: '99f00e203s',
            customerName: 'The Foo Bar',
          },
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('removed change', () => {
    it('dispaches and removed project action', done => {
      const projectsService = TestBed.inject(ProjectsService);
      (projectsService.observeChanges as any).mockReturnValue(
        of([
          {
            type: 'removed',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  name: 'project',
                  description: 'I am a project',
                  type: 'Consulting',
                  status: 'Open',
                  dueDate: '2021-06-16',
                  customerId: '99f00e203s',
                  customerName: 'The Foo Bar',
                }),
              },
            },
          },
        ]),
      );
      actions$ = of(startup());
      effects.changes$.subscribe(action => {
        const expected = projectRemoved({
          project: {
            id: '123499dfi',
            name: 'project',
            description: 'I am a project',
            type: 'Consulting',
            status: 'Open',
            dueDate: '2021-06-16',
            customerId: '99f00e203s',
            customerName: 'The Foo Bar',
          },
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('multiple changes', () => {
    it('dispaches the adds as a unit', fakeAsync(() => {
      const projectsService = TestBed.inject(ProjectsService);
      (projectsService.observeChanges as any).mockReturnValue(
        of([
          {
            type: 'added',
            payload: {
              doc: {
                id: 'f99g0e9fg',
                data: () => ({
                  name: 'project',
                  description: 'I am a project',
                  type: 'Consulting',
                  status: 'Open',
                  dueDate: '2021-06-16',
                  customerId: '99f00e203s',
                  customerName: 'The Foo Bar',
                }),
              },
            },
          },
          {
            type: 'removed',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  name: 'project',
                  description: 'I am a project',
                  type: 'Consulting',
                  status: 'Open',
                  dueDate: '2021-06-16',
                  customerId: '99f00e203s',
                  customerName: 'The Foo Bar',
                }),
              },
            },
          },
          {
            type: 'added',
            payload: {
              doc: {
                id: 'fkkfig0939r',
                data: () => ({
                  name: 'project',
                  description: 'I am a project',
                  type: 'Consulting',
                  status: 'Open',
                  dueDate: '2021-06-16',
                  customerId: '99f00e203s',
                  customerName: 'The Foo Bar',
                }),
              },
            },
          },
          {
            type: 'added',
            payload: {
              doc: {
                id: 'fiig0939034',
                data: () => ({
                  name: 'project',
                  description: 'I am a project',
                  type: 'Consulting',
                  status: 'Open',
                  dueDate: '2021-06-16',
                  customerId: '99f00e203s',
                  customerName: 'The Foo Bar',
                }),
              },
            },
          },
          {
            type: 'modified',
            payload: {
              doc: {
                id: 'fi38849958392j',
                data: () => ({
                  name: 'project',
                  description: 'I am a project',
                  type: 'Consulting',
                  status: 'Open',
                  dueDate: '2021-06-16',
                  customerId: '99f00e203s',
                  customerName: 'The Foo Bar',
                }),
              },
            },
          },
        ]),
      );
      actions$ = of(startup());
      let calls = 0;
      effects.changes$.subscribe(action => {
        let expected: Action;
        switch (calls) {
          case 0:
            expected = projectRemoved({
              project: {
                id: '123499dfi',
                name: 'project',
                description: 'I am a project',
                type: 'Consulting',
                status: 'Open',
                dueDate: '2021-06-16',
                customerId: '99f00e203s',
                customerName: 'The Foo Bar',
              },
            });
            break;

          case 1:
            expected = projectModified({
              project: {
                id: 'fi38849958392j',
                name: 'project',
                description: 'I am a project',
                type: 'Consulting',
                status: 'Open',
                dueDate: '2021-06-16',
                customerId: '99f00e203s',
                customerName: 'The Foo Bar',
              },
            });
            break;

          case 2:
            expected = projectsAdded({
              projects: [
                {
                  id: 'f99g0e9fg',
                  name: 'project',
                  description: 'I am a project',
                  type: 'Consulting',
                  status: 'Open',
                  dueDate: '2021-06-16',
                  customerId: '99f00e203s',
                  customerName: 'The Foo Bar',
                },
                {
                  id: 'fkkfig0939r',
                  name: 'project',
                  description: 'I am a project',
                  type: 'Consulting',
                  status: 'Open',
                  dueDate: '2021-06-16',
                  customerId: '99f00e203s',
                  customerName: 'The Foo Bar',
                },
                {
                  id: 'fiig0939034',
                  name: 'project',
                  description: 'I am a project',
                  type: 'Consulting',
                  status: 'Open',
                  dueDate: '2021-06-16',
                  customerId: '99f00e203s',
                  customerName: 'The Foo Bar',
                },
              ],
            });
            break;

          default:
            break;
        }
        expect(action).toEqual(expected);
        calls++;
        tick();
      });
      expect(calls).toEqual(3);
    }));
  });

  it('does nothing for other actions', () => {
    const projectsService = TestBed.inject(ProjectsService);
    actions$ = of(updateProject({ project: null }));
    effects.changes$.subscribe(() => {});
    expect(projectsService.observeChanges).not.toHaveBeenCalled();
  });
});

describe('create$', () => {
  let project: Project;
  beforeEach(() => {
    project = {
      id: 'fkkfig0939r',
      name: 'project',
      description: 'I am a project',
      type: 'Consulting',
      status: 'Open',
      dueDate: '2021-06-16',
      customerId: '99f00e203s',
      customerName: 'The Foo Bar',
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(ProjectsService);
    actions$ = of(addProject({ project }));
    effects.create$.subscribe(() => {});
    expect(service.add).toHaveBeenCalledTimes(1);
    expect(service.add).toHaveBeenCalledWith(project);
  });

  it('dispatches create success', done => {
    const dispatched = addProjectSuccess();
    actions$ = of(addProject({ project }));
    effects.create$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('dispatches create errors', done => {
    const service = TestBed.inject(ProjectsService);
    const dispatched = addProjectFailure({
      error: new Error('The create failed'),
    });

    (service.add as any).mockRejectedValue(new Error('The create failed'));
    actions$ = of(addProject({ project }));
    effects.create$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(ProjectsService);
    actions$ = of(updateProject({ project }));
    effects.create$.subscribe(() => {});
    expect(service.add).not.toHaveBeenCalled();
  });
});

describe('update$', () => {
  let project: Project;
  beforeEach(() => {
    project = {
      id: 'fkkfig0939r',
      name: 'project',
      description: 'I am a project',
      type: 'Consulting',
      status: 'Open',
      dueDate: '2021-06-16',
      customerId: '99f00e203s',
      customerName: 'The Foo Bar',
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(ProjectsService);
    actions$ = of(updateProject({ project }));
    effects.update$.subscribe(() => {});
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(service.update).toHaveBeenCalledWith(project);
  });

  it('dispatches update success', done => {
    const dispatched = updateProjectSuccess();
    actions$ = of(updateProject({ project }));
    effects.update$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('dispatches update errors', done => {
    const service = TestBed.inject(ProjectsService);
    const dispatched = updateProjectFailure({
      error: new Error('The update failed'),
    });
    (service.update as any).mockRejectedValue(new Error('The update failed'));
    actions$ = of(updateProject({ project }));
    effects.update$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(ProjectsService);
    actions$ = of(addProject({ project }));
    effects.update$.subscribe(() => {});
    expect(service.update).not.toHaveBeenCalled();
  });
});
