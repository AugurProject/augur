import selectors from './selectors';
const appElement = document.getElementById('app');
import App from '../app';

selectors.render = () => App(appElement, selectors);
selectors.render();