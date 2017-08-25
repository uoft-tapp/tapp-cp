import React from 'react';
import ReactDOM from 'react-dom';

import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

/*** Navbar components ***/

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

const Auth = props =>
    <NavDropdown
        title={props.appState.getCurrentUserRole() + ':' + props.appState.getCurrentUserName()}
        id="nav-auth-dropdown">
        <MenuItem eventKey="switch-admin" onClick={() => props.appState.setCurrentUserRole('admin')}>
            Switch to admin role
        </MenuItem>

        <MenuItem eventKey="switch-hris" onClick={() => props.appState.setCurrentUserRole('hris')}>
            Switch to hris role
        </MenuItem>

        <MenuItem eventKey="switch-inst" onClick={() => props.appState.setCurrentUserRole('inst')}>
            Switch to inst role
        </MenuItem>

        <MenuItem eventKey="logout">
            Logout
        </MenuItem>
    </NavDropdown>;

/*** Navbar ***/

const NavbarInst = props =>
    <Navbar fixedTop fluid>
        <Navbar.Header>
            <Navbar.Brand>TAPP:CP</Navbar.Brand>
        </Navbar.Header>

        <Nav pullRight>
            <Notifications {...props} />
            <Auth {...props} />
        </Nav>
    </Navbar>;

export { NavbarInst as Navbar };
