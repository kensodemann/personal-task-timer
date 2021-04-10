'use strict';

const adjNoun = require('adj-noun');
const fs = require('fs');
const dateFns = require('date-fns');
const packageFile = require('./packageFile');
const semver = require('semver');

const versionFile = './src/app/default-data/version.json';

function getBumpType() {
  const lastArg = process.argv[process.argv.length - 1];
  if (
    [
      'prerelease',
      'prepatch',
      'preminor',
      'premajor',
      'patch',
      'minor',
      'major',
    ].includes(lastArg)
  ) {
    return lastArg;
  }
  return 'prerelease';
}

function writeVersionFile(pkg) {
  adjNoun.seed(dateFns.getTime(new Date()));

  const data = {
    tag: adjNoun().join(' '),
    version: pkg.version,
    author: pkg.author,
    date: dateFns.format(new Date(), 'yyyy-MM-dd'),
  };

  fs.writeFileSync(versionFile, JSON.stringify(data));
}

const type = getBumpType();
const pkg = packageFile.read();
pkg.version = semver.inc(pkg.version, type);
packageFile.write(pkg);
writeVersionFile(pkg);
