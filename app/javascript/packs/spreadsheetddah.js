/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import 'bootstrap';  // for the js
import '../spreadsheetddah-styles';  // only for webpacker to watch changes ??..
// import '~bootstrap/dist/css/bootstrap';
// import '../assets/stylesheets/cp';
// import '../assets/stylesheets/spreadsheetddah';  // Nige
// import 'bootstrap/dist/js/bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import { Alert } from 'react-bootstrap';

import { appState } from '../cp/appState.js';
import { fetchAuth } from '../cp/fetch.js';

import { routeConfig } from '../cp/routeConfig.js';
import { Navbar } from '../cp/components/navbar.js';
// import { AdminControlPanel } from '../cp/components/adminControlPanel.js';
// import { DdahControlPanel } from '../cp/components/ddahControlPanel.js';
// import { InstrControlPanel } from '../cp/components/instrControlPanel.js';
import { DdahSpreadsheet } from '../cp/components/ddahSpreadsheet.js';
import { DdahForm } from '../cp/components/ddahForm2.js';

import { mockDdahData } from '../mock_ddah_data.js';  // temporary  .

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
                        <main id="ddah-container">
                            <DdahSpreadsheet {...this.props} mockDdahData={mockDdahData} />
                            <DdahForm {...this.props} mockDdahData={mockDdahData} />
                        </main>
                        <AlertContainer {...this.props} />
                    </div>
                );
            case 'instructor':
                return (
                    <div>
                        <Navbar {...this.props} />
                        <main id="ddah-container">
                            <DdahSpreadsheet {...this.props} mockDdahData={mockDdahData} />
                            <DdahForm {...this.props} mockDdahData={mockDdahData} />
                        </main>
                        <AlertContainer {...this.props} />
                    </div>
                );
        }

        return null;
    }
}

const AdminRouter = props =>
    <Router basename="cp">
        <div>
            <Navbar {...props} />
            <main id="ddah-container">
                <DdahSpreadsheet {...this.props} mockDdahData={mockDdahData} />
                <DdahForm {...this.props} mockDdahData={mockDdahData} />
            </main>
            <AlertContainer {...props} />
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
