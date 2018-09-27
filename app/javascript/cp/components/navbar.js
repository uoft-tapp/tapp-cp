import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { adminFetchAll, instructorFetchAll } from '../fetch.js'

import { Link } from 'react-router-dom';
import {
    Navbar,
    Nav,
    NavDropdown,
    MenuItem,
} from 'react-bootstrap';

import { routeConfig } from '../routeConfig.js';
import { DdahAppendix } from './ddahAppendix.js';

/*** Navbar components ***/

const ViewTab = props =>
    <li role="presentation" className={props.activeKey == props.id ? 'active' : ''}>
        <Link to={props.route} className="navbar-link">
            {props.label}
        </Link>
    </li>;

const ViewTabs = props => {
    let activeKey = props.appState.getSelectedNavTab();
    switch (props.appState.getSelectedUserRole()) {
        case 'cp_admin':
            return (
                <ul className="nav navbar-nav navbar-left">
                    <ViewTab activeKey={activeKey} {...routeConfig.controlPanel} />
                    <ViewTab activeKey={activeKey} {...routeConfig.ddahs} />
                </ul>
            );
        case 'applicant':
            return (
                <ul className="nav navbar-nav navbar-left">
                    <ViewTab activeKey={activeKey} {...routeConfig.contracts} />
                    <ViewTab activeKey={activeKey} {...routeConfig.history} />
                </ul>
            );
    }
};

const Session = props => {
    if (!props.appState.fetchingSessions()){
      let sessions = props.appState.getSessionsList();
      if(sessions){
        let selectedId = props.appState.getSelectedSession();
        let selectedSession = props.appState.getSessionName(selectedId);

        return (
          <NavDropdown
            id = "session-drop-down" noCaret
            title ={<span>{selectedSession}</span>}
            onSelect={eventKey => props.appState.selectSession(eventKey)}>
            {sessions.map((_,id)=>
                (parseInt(id) != selectedId) &&
                <MenuItem eventKey={id} key={id}>
                {props.appState.getSessionName(id)}
                </MenuItem>
            )}
          </NavDropdown>
        );
      }
    }
    return null;
};

const Notifications = props => {
    let notifications = props.appState.getUnreadNotifications();

    return (
        <NavDropdown
            noCaret
            disabled={notifications.size == 0}
            title={
                <span>
                    <i className="fa fa-bell-o" style={{ fontSize: '16px' }} />&nbsp;{notifications.size}
                </span>
            }
            id="nav-notif-dropdown"
            onToggle={willOpen => {
                if (!willOpen) {
                    props.appState.readNotifications();
                }
            }}>
            {notifications.map((text, i) =>
                <MenuItem key={'notification-' + i} dangerouslySetInnerHTML={{ __html: text }} />
            )}
        </NavDropdown>
    );
};

const Auth = props => {
    let roles = props.appState.getCurrentUserRoles(),
        role = props.appState.getSelectedUserRole(),
        name = props.appState.getCurrentUserName();

    return (
        <NavDropdown title={role + ':' + name} id="nav-auth-dropdown">
            {roles.map(
                r =>
                    role != r &&
                    <MenuItem
                        key={'switch-' + r}
                        onClick={() => {
                            props.appState.selectUserRole(r);
                            if (r == "instructor") {
                                instructorFetchAll();
                            } else {
                                adminFetchAll();
                            }
                        }}>
                        Switch to {r} role
                    </MenuItem>
            )}
            <MenuItem
                onClick={() => {
                    var form = document.createElement('form');
                    form.action = '/logout';
                    form.method = 'post';
                    document.body.append(form);
                    form.submit();
                }}>
                Logout
            </MenuItem>
        </NavDropdown>
    );
};

/*** Navbar ***/
const NavbarInst = props => {
    let isAdmin = props.appState.getSelectedUserRole() == 'cp_admin';
    let isInstructor = props.appState.getSelectedUserRole() == 'instructor';
    let isApplicant = props.appState.getSelectedUserRole() == 'applicant';

    return (
        <Navbar fixedTop fluid>
            <Navbar.Header id="drop-down">
                <Navbar.Brand>
                    {isApplicant && <span>CP:TAPP</span>}
                    {!isApplicant && <NavDropdown id='1' title={<span>CP:TAPP</span>} noCaret>
                        <MenuItem href="/tapp">
                            TAPP
                        </MenuItem>
                    </NavDropdown>}
                </Navbar.Brand>
            </Navbar.Header>
            {(isAdmin || isApplicant) && <ViewTabs {...props} />}

            <Nav pullRight>
                {isInstructor &&
                <i className="fa fa-question-circle"
                    style={{
                        cursor: 'pointer',
                        fontSize: '20px',
                        float: 'left',
                        padding: '15px 5px',
                        color: '#5bc0de',
                    }}
                    title="List of Suggested Tasks and Teaching Techniques"
                    onClick={() => {
                        let popup = window.open();
                        popup.document.open();
                        popup.document.write(ReactDOMServer.renderToStaticMarkup(<DdahAppendix/>));
                    }}
                />}
                {!isApplicant && <Session {...props}/>}
                {!isApplicant && <Notifications {...props} />}
                {!isApplicant && <Auth {...props} />}
            </Nav>
        </Navbar>
    );
};

export { NavbarInst as Navbar };
