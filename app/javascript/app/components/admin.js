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
        data: p => p.last_name,
        sortData: p => p.last_name,
      },
      {
        header: 'First Name',
        sortField: true,
        data: p => p.first_name,
        sortData: p => p.first_name,
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
        data: p => p.contract_details.position,
        sortData: p => p.contract_details.position,
      },
      {
        header: 'Hours',
        sortField: false,
        data: p => p.contract_details.hours,
        sortData: p => p.contract_details.hours,
      },
      {
        header: 'Status',
        sortField: false,
        data: p => p.contract_statuses.status,
        sortData: p => p.contract_statuses.status,
      },
      {
        header: 'HRIS Status',
        sortField: false,
        data: p =>
          p.contract_statuses.hr_status == undefined ? '-' : p.contract_statuses.hr_status,
        sortData: p => p.contract_statuses.hr_status,
      },
      {
        header: 'DDAH Status',
        sortField: false,
        data: p =>
          p.contract_statuses.ddah_status == undefined ? '-' : p.contract_statuses.ddah_status,
        sortData: p => p.contract_statuses.ddah_status,
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
          config={this.config}
          clearFilters={() => this.component.clearFilters()}
          sortFields={this.config.filter(field => field.sortField)}
          filterFields={this.config.filter(field => !field.sortField)}
          toggleFilters={field => this.component.toggleFilters(field)}
          sort={(field, state) => this.component.toggleSort(field)}
          activeFields={this.component.getSortFields()}
        />

        <AdminTable
          config={this.config}
          getOffers={() => this.component.getOffers()}
          {...this.props}
        />
      </Grid>
    );
  }
}

export { Admin };
