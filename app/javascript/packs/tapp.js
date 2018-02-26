/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import '../tapp-styles';

import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { appState } from '../tapp/appState.js';
import { fetchAll, fetchAuth } from '../tapp/fetch.js';
import { routeConfig } from '../tapp/routeConfig.js';

import { Navbar } from '../tapp/components/navbar.js';
import { Courses } from '../tapp/components/courses.js';
import { ABC } from '../tapp/components/abc.js';
import { Assigned } from '../tapp/components/assigned.js';
import { Unassigned } from '../tapp/components/unassigned.js';
import { Summary } from '../tapp/components/summary.js';
import { Assistant } from '../tapp/components/assistant.js';
import { ApplicantModal } from '../tapp/components/applicantModal.js';

/*** Main app component ***/

class App extends React.Component {
    constructor(props) {
        super(props);

        // get current user role and username
        fetchAuth();

        // start fetching data
        fetchAll();
    }

    componentDidMount() {
        appState.subscribe(this.forceUpdate.bind(this, null));
    }

    render() {
        let role = appState.getSelectedUserRole(),
            user = appState.getCurrentUserName();

        // this should only happen before we have fetched the current auth information
        if (user == null) {
            return <div id="loader" />;
        }

        switch (role) {
          case 'tapp_admin':
            return <AdminRouter {...appState} />;
          case 'tapp_assistant':
            return <AssistantRouter {...appState} />:;
          case 'instructor':
            return <InstrRouter {...appState} />;
        }

        return null;
    }
}

/*** Routers ***/

const AdminRouter = props => {
    let selectedApplicant = props.getSelectedApplicant();

    return (
        <Router basename="tapp">
            <div>
                <Navbar {...props} />

                <Switch>
                    <Route
                        path={routeConfig.courses.route}
                        render={() => <Courses navKey={routeConfig.courses.id} {...props} />}
                    />
                    <Route
                        path={routeConfig.abc.route}
                        render={() => <ABC navKey={routeConfig.abc.id} {...props} />}
                    />
                    <Route
                        path={routeConfig.assigned.route}
                        render={() => <Assigned navKey={routeConfig.assigned.id} {...props} />}
                    />
                    <Route
                        path={routeConfig.unassigned.route}
                        render={() => <Unassigned navKey={routeConfig.unassigned.id} {...props} />}
                    />
                    <Route
                        path={routeConfig.summary.route}
                        render={() => <Summary navKey={routeConfig.summary.id} {...props} />}
                    />
                    <Redirect from="/" to={routeConfig.summary.route} />
                </Switch>

                {selectedApplicant && <ApplicantModal applicantId={selectedApplicant} {...props} />}

                <div className="container-fluid" id="alert-container">
                    {props
                        .getAlerts()
                        .map(alert =>
                            <div
                                key={'alert-' + alert.id}
                                className="alert alert-danger"
                                onClick={() => props.dismissAlert(alert.id)}
                                onAnimationEnd={() => props.dismissAlert(alert.id)}
                                dangerouslySetInnerHTML={{ __html: alert.text }}
                            />
                        )}
                </div>
            </div>
        </Router>
    );
};

const InstrRouter = props => {
    return (
        <Router basename="tapp">
            <div>
                <Navbar {...props} />
            </div>
        </Router>
    );
};

const AssistantRouter = props =>{
    return (
      <Router basename="tapp">
          <div>
              <Navbar {...props} />
              <Switch>
                  <Route
                      path={routeConfig.assistant.route}
                      render={() => <Assistant navKey={routeConfig.assistant.id} {...props} />}
                  />
              </Switch>
              <div className="container-fluid" id="alert-container">
                  {props
                      .getAlerts()
                      .map(alert =>
                          <div
                              key={'alert-' + alert.id}
                              className="alert alert-danger"
                              onClick={() => props.dismissAlert(alert.id)}
                              onAnimationEnd={() => props.dismissAlert(alert.id)}
                              dangerouslySetInnerHTML={{ __html: alert.text }}
                          />
                      )}
              </div>
          </div>
      </Router>
    );
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.getElementById('root'));
});
