import selectors from './selectors';
const appElement = document.getElementById('app');
import components from './components';

window.selectors = selectors;
console.log('********************************************* \n DEVELOPMENT MODE \n window.selectors available \n ********************************************* \n');

selectors.render = () => components.App(appElement, selectors);
selectors.render();
