import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import { Link } from 'react-router-dom';
import {
    Navbar,
    Nav,
    NavItem,
    NavDropdown,
    MenuItem,
    FormGroup,
    ControlLabel,
    FormControl,
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

    return (
        <ul className="nav navbar-nav navbar-left">
            <ViewTab activeKey={activeKey} {...routeConfig.controlPanel} />
            <ViewTab activeKey={activeKey} {...routeConfig.ddahs} />
        </ul>
    );
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
                            props.appState.fetchAll();
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

const NavbarInst = props =>
    <Navbar fixedTop fluid>
        <Navbar.Header id ="app-drop-down">
          <Navbar.Brand>
            <NavDropdown id='1' title={<span>CP:TAPP</span>} noCaret >
              <MenuItem href="/tapp">
                TAPP
              </MenuItem>
            </NavDropdown>
          </Navbar.Brand>
        </Navbar.Header>
        {props.appState.getSelectedUserRole() == 'cp_admin' && <ViewTabs {...props} />}

        <Nav pullRight>
            {props.appState.getSelectedUserRole() == 'instructor' &&
                <i
                    className="fa fa-question-circle"
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
                        popup.document.write(ReactDOMServer.renderToStaticMarkup(<DdahAppendix />));
                    }}
                />}
            <Session {...props}/>
            <Notifications {...props} />
            <Auth {...props} />
        </Nav>
    </Navbar>;

export { NavbarInst as Navbar };
