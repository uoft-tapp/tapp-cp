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

import { appState } from '../cp/appState.js';
import { fetchAll, fetchAuth } from '../cp/fetch.js';

import { Navbar } from '../cp/components/navbar.js';
import { ControlPanel } from '../cp/components/controlPanel.js';

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

                {role == 'cp_admin' && <ControlPanel {...this.props} />}
                {role == 'hr_assistant' && <ControlPanel {...this.props} />}
                {role == 'instructor' && null}

                <div className="container-fluid" id="alert-container">
                    {this.props.appState
                        .getAlerts()
                        .map(alert =>
                            <div
                                key={'alert-' + alert.get('id')}
                                className="alert alert-danger"
                                onClick={() => this.props.appState.dismissAlert(alert.get('id'))}
                                onAnimationEnd={() =>
                                    this.props.appState.dismissAlert(alert.get('id'))}
                                dangerouslySetInnerHTML={{ __html: alert.get('text') }}
                            />
                        )}
                </div>
            </div>
        );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App appState={appState} />, document.getElementById('root'));
});
