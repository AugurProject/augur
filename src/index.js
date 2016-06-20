import selectors from './selectors';
const appElement = document.getElementById('app');
import { App } from './components';

window.selectors = selectors;
console.log('********************************************* \n DEVELOPMENT MODE \n window.selectors available \n ********************************************* \n');

selectors.render = () => App(appElement, selectors); // eslint-disable-line new-cap
selectors.render();
