import selectors from './selectors';
const appElement = document.getElementById('app');
import app from './app';

window.selectors = selectors;
console.log('********************************************* \n DEVELOPMENT MODE \n window.selectors available \n ********************************************* \n');

selectors.render = () => app(appElement, selectors);
selectors.render();
