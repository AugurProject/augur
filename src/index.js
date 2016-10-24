import { App } from 'base/components';
import selectors from 'base/selectors';

const appElement = document.getElementById('app');

window.selectors = selectors;
console.log('********************************************* \n DEVELOPMENT MODE \n window.selectors available \n ********************************************* \n');

selectors.render = () => App(appElement, selectors); // eslint-disable-line new-cap
selectors.render();
