# Personal Task Timer

A simple personal application used to track the minutes spent on various tasks. Note that the resolution of time in this app is minutes. Active tracking us handled in millisecnds but time is stored as minutes. For this reason it is not suitable for tasks that start and stop throughout the day. Rather, it is intended for the tracking of longer running tasks.

## Getting started

- clone the repo
- `npm i`
- `npm start`
- `npm run test:watch`

To deploy the application, use `npm run release`

`npm test` will run all of the tests and coverage.

`npm run lint` will run the linting.

Any change pushed to `master` on GitHub must pass both `npm run test:ci` and `npm run lint`. If they do not, the CI build on GitHub will be marked as a failure.
