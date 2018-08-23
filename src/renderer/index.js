import * as React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { About } from './about/About'
import { App } from './app/App'

const Root = () => {
  return (
    <HashRouter>
      <div>
        <Route path="/" exact component={App} />
        <Route path="/about" component={About} />
      </div>
    </HashRouter>
  )
}

ReactDOM.render(<Root />, document.getElementById('app'))
