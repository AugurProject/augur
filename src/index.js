import selectors from './selectors';
const appElement = document.getElementById('app');
import App from './app';

window.selectors = selectors;
console.log('********************************************* \n DEVELOPMENT MODE \n window.selectors available \n ********************************************* \n');

selectors.render = () => App(appElement, selectors);
selectors.render();