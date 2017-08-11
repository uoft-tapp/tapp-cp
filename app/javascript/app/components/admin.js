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
        data: p => p.applicant.lastName,
        sortData: p => p.applicant.lastName,
      },
      {
        header: 'First Name',
        sortField: true,
        data: p => p.applicant.firstName,
        sortData: p => p.applicant.firstName,
      },
      {
        header: 'Email',
        sortField: true,
        data: p => p.applicant.email,
        sortData: p => p.applicant.email,
      },
      {
        header: 'Student Number',
        sortField: true,
        data: p => p.applicant.student_number,
        sortData: p => p.applicant.student_number,
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
    this.offers = [
      {
        id: 1,
        position_id: 1,
        applicant_id: 1,
        objection: false,
        hours: 40,
        year: 2017,
        printed: true,
        accepted: true,
        objection: false,
        nag_count: 0,
        session: 'Winter',
        created_at: '2017-08-10T18:28:44.331Z',
        updated_at: '2017-08-10T18:28:44.331Z',
        sent: false,
        position: 'C4M101H1F',
        applicant: {
          id: 1,
          utorid: 'applicant1',
          app_id: '1',
          student_number: '1342088432',
          first_name: 'Mjolarkark',
          last_name: 'Zedslamares',
          email: 'mjolarkark.zedslamares@mail.utoronto.ca',
          phone: '647628818',
          address: '1 Slamares St.',
          commentary: '',
          created_at: '2017-08-10T17:41:30.725Z',
          updated_at: '2017-08-10T17:41:30.725Z',
          dept: 'Other',
          yip: 1,
          program_id: '8UG',
        },
        instructors: [
          {
            id: 1,
            name: 'Jennifer Campbell',
            email: 'campbell@cs.toronto.edu',
            utorid: 'campb128',
            created_at: '2017-08-10T17:41:29.520Z',
            updated_at: '2017-08-10T17:41:29.520Z',
          },
          {
            id: 2,
            name: 'Michelle Craig',
            email: 'mcraig@cs.toronto.edu',
            utorid: 'craigmic',
            created_at: '2017-08-10T17:41:29.549Z',
            updated_at: '2017-08-10T17:41:29.549Z',
          },
        ],
      },
      {
        id: 2,
        position_id: 38,
        applicant_id: 1,
        objection: false,
        hours: 25,
        year: 2017,
        printed: true,
        accepted: true,
        objection: false,
        nag_count: 0,
        session: 'Winter',
        created_at: '2017-08-10T18:28:44.556Z',
        updated_at: '2017-08-10T18:28:44.556Z',
        sent: false,
        position: 'CSC385H1F',
        applicant: {
          id: 1,
          utorid: 'applicant1',
          app_id: '1',
          student_number: '1342088432',
          first_name: 'Mjolarkark',
          last_name: 'Zedslamares',
          email: 'mjolarkark.zedslamares@mail.utoronto.ca',
          phone: '647628818',
          address: '1 Slamares St.',
          commentary: '',
          created_at: '2017-08-10T17:41:30.725Z',
          updated_at: '2017-08-10T17:41:30.725Z',
          dept: 'Other',
          yip: 1,
          program_id: '8UG',
        },
        instructors: [],
      },
      {
        id: 3,
        position_id: 51,
        applicant_id: 13,
        objection: false,
        hours: 30,
        year: 2017,
        printed: true,
        accepted: true,
        objection: false,
        nag_count: 0,
        session: 'Winter',
        created_at: '2017-08-10T18:28:44.779Z',
        updated_at: '2017-08-10T18:28:44.779Z',
        sent: false,
        position: 'CSC469H1F/2208HF',
        applicant: {
          id: 13,
          utorid: 'applicant13',
          app_id: '13',
          student_number: '1655214415',
          first_name: 'Morslamarmur',
          last_name: 'Mormaracure',
          email: 'morslamarmur.mormaracure@mail.utoronto.ca',
          phone: '6479371767',
          address: '13 Maracure St.',
          commentary: '',
          created_at: '2017-08-10T17:41:30.791Z',
          updated_at: '2017-08-10T17:41:30.791Z',
          dept: 'Engineering',
          yip: 1,
          program_id: '8UG',
        },
        instructors: [
          {
            id: 19,
            name: 'Bogdan Simion',
            email: 'bogdan@cs.toronto.edu',
            utorid: 'simionbo',
            created_at: '2017-08-10T17:41:30.337Z',
            updated_at: '2017-08-10T17:41:30.337Z',
          },
        ],
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

        <AdminTable config={this.config} offers={this.offers} />
      </Grid>
    );
  }
}

export { Admin };
