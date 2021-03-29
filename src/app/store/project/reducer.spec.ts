import { Project } from '@app/models';
import {
  addProject,
  addProjectFailure,
  loadProjectsFailure,
  loginChanged,
  updateProject,
  updateProjectFailure,
  projectAdded,
  projectModified,
  projectRemoved,
  projectsAdded,
} from '@app/store/actions';
import { Dictionary } from '@ngrx/entity';
import { initialState, reducer } from './reducer';

let testProjects: Dictionary<Project>;
let testProjectIds: Array<string>;

beforeEach(() => {
  initializeTestData();
});

it('returns the default state', () => {
  expect(reducer(undefined, { type: 'NOOP' })).toEqual(initialState);
});

describe('login changed', () => {
  it('sets loading true, removes any entities, and undefines any error', () => {
    const action = loginChanged({ email: undefined, userId: undefined });
    expect(
      reducer(
        {
          ...initialState,
          ids: [...testProjectIds],
          entities: { ...testProjects },
          error: new Error('the last load failed'),
        },
        action,
      ),
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined,
    });
  });
});

describe('load failure', () => {
  it('sets the error and clears the loading flag', () => {
    const action = loadProjectsFailure({
      error: new Error('Could not load the data'),
    });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not load the data'),
    });
  });
});

describe('create', () => {
  it('sets loading true and undefines any error', () => {
    const action = addProject({ project: undefined });
    expect(
      reducer(
        { ...initialState, error: new Error('the last create failed') },
        action,
      ),
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined,
    });
  });
});

describe('create failure', () => {
  it('sets the error and clears the loading flag', () => {
    const action = addProjectFailure({
      error: new Error('Could not create the data'),
    });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not create the data'),
    });
  });
});

describe('update', () => {
  it('sets loading true and undefines any error', () => {
    const action = updateProject({ project: undefined });
    expect(
      reducer(
        { ...initialState, error: new Error('the last update failed') },
        action,
      ),
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined,
    });
  });
});

describe('update failure', () => {
  it('sets the error and clears the loading flag', () => {
    const action = updateProjectFailure({
      error: new Error('Could not update the data'),
    });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not update the data'),
    });
  });
});

describe('project added', () => {
  it('adds the project to an empty state', () => {
    const project: Project = {
      id: '399r098390',
      name: 'Make Root Beer',
      description: 'It is so damn good!!',
      dueDate: '2021-05-04',
      type: 'Prep Work',
      status: 'Open',
      customerId: '194309fkadsfoi',
      customerName: 'A & W',
    };
    const action = projectAdded({ project });
    expect(reducer(undefined, action)).toEqual({
      ...initialState,
      ids: ['399r098390'],
      entities: {
        '399r098390': {
          id: '399r098390',
          name: 'Make Root Beer',
          description: 'It is so damn good!!',
          dueDate: '2021-05-04',
          type: 'Prep Work',
          status: 'Open',
          customerId: '194309fkadsfoi',
          customerName: 'A & W',
        },
      },
    });
  });

  it('adds the project to the existing ones', () => {
    const project: Project = {
      id: '399r098390',
      name: 'Make Root Beer',
      description: 'It is so damn good!!',
      type: 'Prep Work',
      status: 'Open',
      dueDate: '2021-05-04',
      customerId: '194309fkadsfoi',
      customerName: 'A & W',
    };
    const action = projectAdded({ project });
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
          ids: testProjectIds,
          entities: testProjects,
        },
        action,
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      ids: [...testProjectIds, '399r098390'],
      entities: {
        ...testProjects,
        '399r098390': {
          id: '399r098390',
          name: 'Make Root Beer',
          description: 'It is so damn good!!',
          dueDate: '2021-05-04',
          type: 'Prep Work',
          status: 'Open',
          customerId: '194309fkadsfoi',
          customerName: 'A & W',
        },
      },
    });
  });
});

describe('projects added', () => {
  it('adds the projects to an empty state', () => {
    const projects: Array<Project> = [
      {
        id: '399r098390',
        name: 'Make Root Beer',
        description: 'It is so damn good!!',
        dueDate: '2021-05-04',
        type: 'Prep Work',
        status: 'Open',
        customerId: '194309fkadsfoi',
        customerName: 'A & W',
      },
      {
        id: '388r98r9309',
        name: 'Painting',
        description: 'That is a happy little tree',
        dueDate: '2021-04-30',
        type: 'Art',
        status: 'Open',
        customerId: 'fiiagoie92',
        customerName: 'Amys Arts',
      },
      {
        id: '99r8e993r38',
        name: 'Price Chocolate',
        description: 'If we can get a good price, we can keep costs down.',
        dueDate: '2021-06-01',
        type: 'Purchasing',
        status: 'Open',
        customerId: 'figof003f3',
        customerName: 'Mars Candy',
      },
    ];
    const action = projectsAdded({ projects });
    expect(reducer(undefined, action)).toEqual({
      ...initialState,
      loading: false,
      ids: ['399r098390', '388r98r9309', '99r8e993r38'],
      entities: {
        '399r098390': {
          id: '399r098390',
          name: 'Make Root Beer',
          description: 'It is so damn good!!',
          dueDate: '2021-05-04',
          type: 'Prep Work',
          status: 'Open',
          customerId: '194309fkadsfoi',
          customerName: 'A & W',
        },
        '388r98r9309': {
          id: '388r98r9309',
          name: 'Painting',
          description: 'That is a happy little tree',
          dueDate: '2021-04-30',
          type: 'Art',
          status: 'Open',
          customerId: 'fiiagoie92',
          customerName: 'Amys Arts',
        },
        '99r8e993r38': {
          id: '99r8e993r38',
          name: 'Price Chocolate',
          description: 'If we can get a good price, we can keep costs down.',
          dueDate: '2021-06-01',
          type: 'Purchasing',
          status: 'Open',
          customerId: 'figof003f3',
          customerName: 'Mars Candy',
        },
      },
    });
  });

  it('adds the projects to the existing ones', () => {
    const projects: Array<Project> = [
      {
        id: '399r098390',
        name: 'Make Root Beer',
        description: 'It is so damn good!!',
        dueDate: '2021-05-04',
        type: 'Prep Work',
        status: 'Open',
        customerId: '194309fkadsfoi',
        customerName: 'A & W',
      },
      {
        id: '388r98r9309',
        name: 'Painting',
        description: 'That is a happy little tree',
        dueDate: '2021-04-30',
        type: 'Art',
        status: 'Open',
        customerId: 'fiiagoie92',
        customerName: 'Amys Arts',
      },
      {
        id: '99r8e993r38',
        name: 'Price Chocolate',
        description: 'If we can get a good price, we can keep costs down.',
        dueDate: '2021-06-01',
        type: 'Purchasing',
        status: 'Open',
        customerId: 'figof003f3',
        customerName: 'Mars Candy',
      },
    ];
    const action = projectsAdded({ projects });
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
          ids: testProjectIds,
          entities: testProjects,
        },
        action,
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      ids: [...testProjectIds, '399r098390', '388r98r9309', '99r8e993r38'],
      entities: {
        ...testProjects,
        '399r098390': {
          id: '399r098390',
          name: 'Make Root Beer',
          description: 'It is so damn good!!',
          dueDate: '2021-05-04',
          type: 'Prep Work',
          status: 'Open',
          customerId: '194309fkadsfoi',
          customerName: 'A & W',
        },
        '388r98r9309': {
          id: '388r98r9309',
          name: 'Painting',
          description: 'That is a happy little tree',
          dueDate: '2021-04-30',
          type: 'Art',
          status: 'Open',
          customerId: 'fiiagoie92',
          customerName: 'Amys Arts',
        },
        '99r8e993r38': {
          id: '99r8e993r38',
          name: 'Price Chocolate',
          description: 'If we can get a good price, we can keep costs down.',
          dueDate: '2021-06-01',
          type: 'Purchasing',
          status: 'Open',
          customerId: 'figof003f3',
          customerName: 'Mars Candy',
        },
      },
    });
  });
});

describe('project modified', () => {
  it('modifies the specified project', () => {
    const project: Project = {
      id: 'asdf1234',
      name: 'Clean Brushes',
      description: 'Get that Paint off',
      dueDate: '2021-07-05',
      type: 'Cleanup',
      status: 'Open',
      customerId: 'fiiagoie92',
      customerName: 'Amys Arts',
    };
    const expected = { ...testProjects };
    expected.asdf1234 = project;
    const action = projectModified({ project });
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
          ids: testProjectIds,
          entities: testProjects,
        },
        action,
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      ids: testProjectIds,
      entities: expected,
    });
  });
});

describe('project removed', () => {
  it('deletes the project', () => {
    const project: Project = {
      id: 'ff88t99er',
      name: 'Mix paint',
      description: 'We need better colors',
      dueDate: '2021-04-15',
      type: 'Consulting',
      status: 'Open',
      customerId: 'fiiagoie92',
      customerName: 'Amys Arts',
    };
    const expected = { ...testProjects };
    delete expected.ff88t99er;
    const action = projectRemoved({ project });
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
          ids: testProjectIds,
          entities: testProjects,
        },
        action,
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      ids: [testProjectIds[0], testProjectIds[1], testProjectIds[3]],
      entities: expected,
    });
  });
});

const initializeTestData = () => {
  testProjectIds = ['asdf1234', 'ff898gd', 'ff88t99er', '1849gasdf'];
  testProjects = {
    'asdf1234': {
      id: 'asdf1234',
      name: 'Shell Almonds',
      description: 'I have nuts!',
      dueDate: '2021-07-04',
      type: 'Prep Work',
      status: 'Open',
      customerId: 'figof003f3',
      customerName: 'Mars Candy',
    },
    'ff898gd': {
      id: 'ff898gd',
      name: 'Smash Burgers',
      description: 'They are all too thick. Smash them down!',
      dueDate: '2021-05-12',
      type: 'Prep Work',
      status: 'Open',
      customerId: '194309fkadsfoi',
      customerName: 'A & W',
    },
    'ff88t99er': {
      id: 'ff88t99er',
      name: 'Mix paint',
      description: 'We need better colors',
      dueDate: '2021-04-15',
      type: 'Consulting',
      status: 'Open',
      customerId: 'fiiagoie92',
      customerName: 'Amys Arts',
    },
    '1849gasdf': {
      id: '1849gasdf',
      name: 'Review the calorie count',
      description: 'For whatever reason, the FDA is not happy',
      dueDate: '2021-03-21',
      type: 'Consulting',
      status: 'Open',
      customerId: 'figof003f3',
      customerName: 'Mars Candy',
    },
  };
};
