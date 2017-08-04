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
    this.offers = this.component.getOffers();
    // table/menu configuration
    this.config = [
      {
        header: 'Last Name',
        data: p => p.applicant.lastName,
        sortData: p => p.applicant.lastName,
      },
      {
        header: 'First Name',
        data: p => p.applicant.firstName,
        sortData: p => p.applicant.firstName,
      },
      {
        header: 'Email',
        data: p => p.applicant.email,
        sortData: p => p.applicant.email,
      },
      {
        header: 'Student Number',
        data: p => p.applicant.student_number,
        sortData: p => p.applicant.student_number,
      },
      {
        header: 'Printed',
      },
      {
        header: 'Accepted',
      },
      {
        header: 'Objection',
      },
      {
        header: 'Nag Count',
      },
    ];
  }

  render() {
    return (
      <Grid fluid id="admin-grid">
        <TableMenu
          config={this.config}
          sort={(field, state) => this.component.toggleSort(field)}
          activeFields={this.component.getSortState()}
        />

        <AdminTable config={this.config} offers={this.component.getOffers()} />
      </Grid>
    );
  }
}

export { Admin };
