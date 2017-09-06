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
import { Alert } from 'react-bootstrap';

import { appState } from '../cp/appState.js';
import { fetchAuth } from '../cp/fetch.js';

import { Navbar } from '../cp/components/navbar.js';
import { ControlPanel } from '../cp/components/controlPanel.js';
import { InstrControlPanel } from '../cp/components/instrControlPanel.js';

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

        return (
            <div>
                <Navbar {...this.props} />

                {(role == 'cp_admin' || role == 'hr_assistant') && <ControlPanel {...this.props} />}
                {role == 'instructor' && <InstrControlPanel {...this.props} />}

                <div className="container-fluid" id="alert-container">
                    {this.props.appState.getAlerts().map(alert =>
                        <Alert
                            key={'alert-' + alert.get('id')}
                            className="alert alert-danger"
                            onDismiss={() => this.props.appState.dismissAlert(alert.get('id'))}>
                            <span dangerouslySetInnerHTML={{ __html: alert.get('text') }} />
                        </Alert>
                    )}
                </div>
            </div>
        );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App appState={appState} />, document.getElementById('root'));
});
