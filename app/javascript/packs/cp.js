/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import 'bootstrap';  // for the js ??
import '../cp-styles';

import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import { Alert } from 'react-bootstrap';

import { appState } from '../cp/appState.js';
import { fetchAuth } from '../cp/fetch.js';

import { routeConfig } from '../cp/routeConfig.js';
import { Navbar } from '../cp/components/navbar.js';
import { AdminControlPanel } from '../cp/components/adminControlPanel.js';
import { DdahControlPanel } from '../cp/components/ddahControlPanel.js';
import { InstrControlPanel } from '../cp/components/instrControlPanel.js';
import { Contracts } from '../cp/components/contracts.js';
import { History } from '../cp/components/history.js';
import { DdahEditor } from '../cp/components/ddahEditor.js';

/*** Main app component ***/

class App extends React.Component {
    constructor(props) {
        super(props);

        // get current user role and username
        // then start fetching data
        fetchAuth().then(() => this.props.appState.fetchAll());
    }

    componentDidMount() {
        this.props.appState.subscribe(this.forceUpdate.bind(this, null));
    }

    render() {
        let role = this.props.appState.getSelectedUserRole(),
            user = this.props.appState.getCurrentUserName();

        // this should only happen before we have fetched the current auth information
        if (user == null) {
            return <div id="loader" />;
        }

        switch (role){
            case 'cp_admin':
                return <AdminRouter {...this.props} />;
            case 'hr_assistant':
                return (
                    <div>
                        <Navbar {...this.props} />
                        <AdminControlPanel {...this.props} />
                        <AlertContainer {...this.props} />
                    </div>
                );
            case 'instructor':
                return <InstrRouter {...this.props} />;
            case 'applicant':
                return <ApplicantRouter {...this.props} />;
        }

        return null;
    }
}

const AdminRouter = props =>
    <Router basename="cp">
        <div>
            <Navbar {...props} />

            <Switch>
                <Route
                    path={routeConfig.controlPanel.route}
                    render={() =>
                        <AdminControlPanel navKey={routeConfig.controlPanel.id} {...props} />}
                />
                <Route
                    path={routeConfig.ddahs.route}
                    render={() => <DdahControlPanel navKey={routeConfig.ddahs.id} {...props} />}
                />
                <Redirect from="/" to="/controlpanel" />
            </Switch>

            <AlertContainer {...props} />
        </div>
    </Router>;

const InstrRouter = props =>(
   <Router basename="cp">
        <div>
            <Navbar {...props} />

            <Switch>
                <Route
                    path={routeConfig.sheet.route}
                    render={() => <DdahEditor navKey={routeConfig.sheet.id} {...props}/>}/>
                <Redirect from="/" to="/sheet" />
            </Switch>

            <AlertContainer {...props} />
        </div>
    </Router>
);

const ApplicantRouter = props =>
    <Router basename="cp">
        <div>
            <Navbar {...props} />

            <Switch>
                <Route
                    path={routeConfig.contracts.route}
                    render={() => <Contracts navKey={routeConfig.contracts.id} {...props} />}
                />
                <Route
                    path={routeConfig.history.route}
                    render={() => <History navKey={routeConfig.history.id} {...props} />}
                />
                <Redirect from="/" to="/contracts" />
            </Switch>
        </div>
    </Router>;

const AlertContainer = props =>
    <div className="container-fluid" id="alert-container">
        {props.appState.getAlerts().map(alert =>
            <Alert
                key={'alert-' + alert.get('id')}
                className="alert alert-danger"
                onDismiss={() => props.appState.dismissAlert(alert.get('id'))}>
                <span dangerouslySetInnerHTML={{ __html: alert.get('text') }} />
            </Alert>
        )}
    </div>;

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App appState={appState} />, document.getElementById('root'));
});
