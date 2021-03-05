import { useEffect } from 'react';
import ReactGA from 'react-ga';
import { MAINNET, PARA_CONFIG } from '../modules/stores/constants';
import { useLocation } from 'react-router';
import parsePath from '../modules/routes/helpers/parse-path';
import parseQuery from '../modules/routes/helpers/parse-query';

const GA_TRACKING_ID = 'G-6REXDMP9F3';
let tracker = null;
const activate = PARA_CONFIG.networkId !== MAINNET;

const getTracker = () => {
  if (!tracker && activate) {
    const userId = genUserId();
    ReactGA.initialize(GA_TRACKING_ID, {
      debug: true,
      titleCase: false,
      gaOptions: {
        name: 'simplified',
        userId: userId,
      }
    });
    tracker = ReactGA;
  }
  return tracker;
}

const pageview = (page: string, data: string[]) => {
  const tracker = getTracker();
  if (tracker) {
    console.log('tracker', page, data);
    tracker.pageview(page, data);
  }
}

export const usePageView = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    const page = parsePath(pathname);
    const data = parseQuery(search)
    pageview(page[0], data);
  }, [pathname, search]);
}

const genUserId = () => {
  let d = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}
