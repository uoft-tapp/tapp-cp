import React from 'react';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { rconfig } from '../routeConfig.js';
import { TableMenu } from './tablemenu.js';
import { AdminTable } from './table.js';

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.component = props.proto;
    this.config = [
      {
        header: 'Last Name',
        sortField: true,
        data: p => p.lastName,
        sortData: p => p.lastName,
      },
      {
        header: 'First Name',
        sortField: true,
        data: p => p.firstName,
        sortData: p => p.firstName,
      },
      {
        header: 'Email',
        sortField: true,
        data: p => p.email,
        sortData: p => p.email,
      },
      {
        header: 'Student Number',
        sortField: true,
        data: p => p.student_number,
        sortData: p => p.student_number,
      },
      {
        header: 'Position',
        sortField: true,
      },
      {
        header: 'Hours',
        sortField: false,
      },
      {
        header: 'Status',
        sortField: false,
      },
      {
        header: 'HRIS Status',
        sortField: false,
      },
      {
        header: 'DDAH Status',
        sortField: false,
      },
    ];
  }

  componentWillMount() {
    if (this.component.getCurrentTab() != this.props.navKey) {
      this.component.setCurrentTab(this.props.navKey);
    }
  }

  render() {
    return (
      <Grid fluid id="admin-grid">
        <TableMenu
          sortFields={this.config.filter(field => field.sortField)}
          toggleFields={this.config.filter(field => !field.sortField)}
          sort={(field, state) => this.component.toggleSort(field)}
          activeFields={this.component.getSortState()}
        />

        <AdminTable config={this.config} offers={this.component.getOffers()} />
      </Grid>
    );
  }
}

export { Admin };
