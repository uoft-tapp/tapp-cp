import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { rconfig } from '../routeConfig.js';
import { Nav, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';

function Auth(props) {
  return (
    <NavDropdown title={props.role + ':' + props.user} id="nav-auth-dropdown">
      <MenuItem eventKey={rconfig.logout.key}>
        {' '}{rconfig.logout.label}{' '}
      </MenuItem>
    </NavDropdown>
  );
}

function SingleLink(props) {
  return (
    <li className={props.activeKey == props.id ? 'active' : ''}>
      <Link className="navbar-link" to={props.route}>
        {props.label}
      </Link>
    </li>
  );
}

function NavbarLinks(props) {
  switch (props.role) {
    case 'admin':
      return (
        <ul className="nav navbar-nav navbar-left">
          <SingleLink activeKey={props.activeKey} {...rconfig.admin} />
          <SingleLink activeKey={props.activeKey} {...rconfig.cp} />
          <SingleLink activeKey={props.activeKey} {...rconfig.ddah} />
        </ul>
      );
    case 'instructor':
      return (
        <ul className="nav navbar-nav navbar-left">
          <SingleLink activeKey={props.activeKey} {...rconfig.cp} />
          <SingleLink activeKey={props.activeKey} {...rconfig.ddah} />
        </ul>
      );
    default:
      return <ul />;
  }
}

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.component = props.proto;
  }

  render() {
    return (
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>TAPP:CP</Navbar.Brand>
        </Navbar.Header>

        <NavbarLinks
          role={this.component.getCurrentUserRole()}
          activeKey={this.component.getCurrentTab()}
        />

        <Nav pullRight>
          <Auth
            role={this.component.getCurrentUserRole()}
            user={this.component.getCurrentUserName()}
          />
        </Nav>
      </Navbar>
    );
  }
}

export { Navigation };
