/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb
import '../app-styles';

import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { appState } from '../app/appState.js';
import * as fetch from '../app/fetch.js';
import { rconfig } from '../app/routeConfig.js';

import { Admin } from '../app/components/admin.js';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);

    /// I NEED PROMISEESSSSSS
    fetch.fetchOffers();
  }

  componentDidMount() {
    appState.subscribe(this.forceUpdate.bind(this, null));
  }

  render() {
    return <RouterInst proto={appState} />;
  }
}

function RouterInst(props) {
  return (
    <Router basename="index.html">
      <div>
        <Navbar fixedTop fluid />
        <Switch>
          <Route
            path={rconfig.admin.route}
            render={() => <Admin navKey={rconfig.admin.key} {...props} />}
          />
          <Route
            path={rconfig.cp.route}
            render={() => <Contract navKey={rconfig.cp.key} {...props} />}
          />
        </Switch>
      </div>
    </Router>
  );
}
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});
