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
import { Radio, DropdownButton, MenuItem, Button, Alert } from 'react-bootstrap'

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
        this.state = {
            roleAndUtoridSet: false,
            isDevelopment: null
        };
        this.handleRoleAndUtoridSet = this.handleRoleAndUtoridSet.bind(this);
        // check to see if in development mode. If in production, fetchAll!
        fetch('/development')
            .then((responseText) => responseText.json())
            .then((response) => {
                this.setState({isDevelopment: response.development === 'development'});
                if (!this.state.isDevelopment) {
                    fetchAuth().then(()=> fetchAll());
                }
            });


    }

    handleRoleAndUtoridSet(role, utorid) {
        this.setState({roleAndUtoridSet: true});
        appState.selectUserRole(role);
        appState.setCurrentUserName(utorid);
        fetch('/development/set_utorid/' + utorid, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).catch(error => {
            console.error(error);
        })
        fetchAuth().then(() => fetchAll());
    }

    componentDidMount() {
        appState.subscribe(this.forceUpdate.bind(this, null));
    }

    render() {
        // if development && role not set:
        //     render login_page
        if (this.state.isDevelopment && !this.state.roleAndUtoridSet) {
            return <DevLoginPage {...appState} handleRoleAndUtoridSet={this.handleRoleAndUtoridSet} />;
        }
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
            return <AssistantRouter {...appState} />;
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
                <Navbar {...props} role='tapp_admin'/>

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
    let selectedApplicant = props.getSelectedApplicant();
    return (
        <Router basename="tapp">
            <div>
                <Navbar {...props} role='instructor'/>
                <Switch>
                    <Route
                        path={routeConfig.instructor.route}
                        render={() => <ABC navKey={routeConfig.instructor.id} {...props} />}
                    />
                    <Redirect from="/" to={routeConfig.instructor.route} />
                </Switch>
                {selectedApplicant && <ApplicantModal applicantId={selectedApplicant} {...props} />}
            </div>
        </Router>
    );
};

const AssistantRouter = props =>{
    return (
      <Router basename="tapp">
          <div>
              <Navbar {...props} role='tapp_assistant'/>
              <Switch>
                  <Route
                      path={routeConfig.assistant.route}
                      render={() => <Assistant navKey={routeConfig.assistant.id} {...props} />}
                  />
                  <Redirect from="/" to={routeConfig.assistant.route} />
              </Switch>
          </div>
      </Router>
    );
}

class DevLoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            adminSelected: false,
            instructorSelected: false,
            assistantSelected: false,
            btnTitle: "select utorid",
            instructorsAdmins: [],
            showAlert: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleSelectRole = this.handleSelectRole.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDismiss = this.handleDismiss.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    handleClick(value) {
        this.setState({btnTitle: value});
    }

    handleSelectRole(event) {
        let val = event.target.value
        if (val === "Admin") {
            this.setState({
                adminSelected: true,
                instructorSelected: false,
                assistantSelected: false
            });
        } else if (val === "Instructor") {
            this.setState({
                adminSelected: false,
                instructorSelected: true,
                assistantSelected: false
            });
        } else if (val === "Assistant") {
            this.setState({
                adminSelected: false,
                instructorSelected: false,
                assistantSelected: true
            });
        }

        if (val === "Instructor") {
            fetch('/instructors')
                .then(responseText => responseText.json())
                .then(response => {
                    let instrs = [];
                    for (var i = 0; i < response.length; i++) {
                        instrs.push(response[i].utorid);
                    }
                    this.setState({instructorsAdmins: instrs});
                })
        }

        if (val === "Admin") {
            fetch('/development/get_admins')
                .then(responseText => responseText.json())
                .then(response => {
                    let admins = [];
                    for (var i = 0; i < response.admins.length; i++) {
                        admins.push(response.admins[i]);
                    }
                    this.setState({instructorsAdmins: admins});
                })
        }
    }

    handleSubmit(event) {
        if (!this.state.adminSelected &&
            !this.state.instructorSelected &&
            !this.state.assistantSelected) {
                this.handleShow();
                return;
            }
        if (this.state.btnTitle === "select utorid" && !this.state.assistantSelected) {
            this.handleShow();
                return;
        }
        let role;
        if (this.state.adminSelected) {
            role = "tapp_admin";
        } else if (this.state.instructorSelected) {
            role = "instructor";
        } else if (this.state.assistantSelected) {
            role = "tapp_assistant";
        }

        this.props.handleRoleAndUtoridSet(role, this.state.btnTitle);

    }

    handleDismiss() {
        this.setState({ showAlert: false });
    }
    
    handleShow() {
        this.setState({ showAlert: true });
    }

    
    render() {
        let roles = ["Admin", "Instructor", "Assistant"];
        return (
            <div>
                <AlertDismissable show={this.state.showAlert} handleDismiss={this.handleDismiss}/>
                <div onChange={this.handleSelectRole}>
                    <form>
                        {roles.map(
                            role =>
                                <Radio name="radioGroup" key={'role-' + role} value={role} onSelect={this.handleSelectRole}>
                                    {role}
                                </Radio>
                        )}
                    </form>
                </div>
                {(this.state.adminSelected || this.state.instructorSelected)?
                    <DropdownButton bsStyle="primary" title={this.state.btnTitle} id="instructors-dropdown">
                        {this.state.instructorsAdmins.map((utorid, i) =>
                            <MenuItem key={i} onSelect={this.handleClick} eventKey={utorid}>
                                {utorid}
                            </MenuItem>
                        )}
                    </DropdownButton>
                    : ""
                }
                <Button type="submit" onClick={this.handleSubmit}>Submit</Button>
            </div>
        );
        
    }
}

class AlertDismissable extends React.Component {
    render() {
        if (this.props.show) {
            return (
                <Alert bsStyle="danger" onClick={this.props.handleDismiss}>
                    <p>
                    Make sure to select a role and an instructor!
                    </p>
                </Alert>
            );
        }
        return (null);
        //return <Button onClick={this.handleShow}>Show Alert</Button>;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.getElementById('root'));
});
