import * as React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import Connect from './exist/Connect'
import Track from './track/Track'
import logo from './logo.svg'
import './App.css'

export default class App extends React.Component<{}, {}> {
  render () {
    return [
      <header className='App-header' key='header'>
        <img src={logo} className='App-logo' alt='logo' />
        <h1 className='App-title'>Welcome to React</h1>
      </header>,
      <Router key='router'>
        <main>
          <ul>
            <li><Link to='/track'>Track</Link></li>
            <li><Link to='/connect'>Connect</Link></li>
          </ul>
          <hr />
          <Route exact path='/' component={Connect} />
          <Route path='/connect' component={Connect} />
          <Route exact path='/track' component={Track} />
        </main>
      </Router>
    ]
  }
}
