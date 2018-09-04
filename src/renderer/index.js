import * as React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import { HashRouter, Route } from 'react-router-dom'
import { About } from './about/About'
import AppContainer from './app/containers/app-container'
import { handleEvents } from './handle-events'
// import WebFont from 'webfontloader';

// WebFont.load({
//   google: {
//     families: ['Roboto:300, 400, 500, 600, 700', 'sans-serif']
//   }
// });

const Root = () => {
  return (
    <Provider store={store}>
      <HashRouter>
        <div style={{height: '100%'}}>
          <Route path="/" exact component={AppContainer} />
          <Route path="/about" component={About} />
        </div>
      </HashRouter>
    </Provider>
  )
}

handleEvents()

ReactDOM.render(<Root />, document.getElementById('app'))
