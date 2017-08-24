/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb
import '../cp-styles';

import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

import { appState } from '../cp/appState.js';
import * as data from '../cp/fetch.js';
import { rconfig } from '../cp/routeConfig.js';

import { Admin } from '../cp/components/admin.js';
import { Navigation } from '../cp/components/navbar.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    data.fetcher();
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
    <Router basename="cp">
      <div>
        <Navigation {...props} />
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
