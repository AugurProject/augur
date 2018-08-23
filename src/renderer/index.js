import * as React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { About } from './about/About'
import { App } from './app/App'

const Root = () => {
  return (
    <BrowserRouter>
      <div>
        <Route path="/" exact component={App} />
        <Route path="/about" component={About} />
      </div>
    </BrowserRouter>
  )
}

ReactDOM.render(<Root />, document.getElementById('app'))
