import React from 'react';
import {Route, Switch} from 'react-router-dom';

const MARKET = 'market';
const MARKETS = 'markets';
const REPORTING = 'reporting';
const DISPUTING = 'disputing';
const LANDING_PAGE = 'explore';

const makePath = (paths, match = false) => {
  // Invalid, return root
  if (
    (paths.constructor !== String && paths.constructor !== Array) ||
    (match && paths.constructor !== Array)
  )
    return "/";

  // Matching Regex for Route Component
  if (match) return `^/(${paths.join("|")})/`;

  // String Path for Link from Array
  if (paths.constructor === Array) return `/${paths.join("/")}/`;

  // String Path for Link from String
  return `/${paths}`;
};

export default (
  <Switch>
    <Route path={makePath(MARKETS)} />
    <Route path={makePath(MARKET)} />
    <Route path={makePath(LANDING_PAGE)} />
    <Route path={makePath(DISPUTING)} />
    <Route path={makePath(REPORTING)} />
  </Switch>
);
