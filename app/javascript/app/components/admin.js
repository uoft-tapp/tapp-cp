import React from 'react';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { routeConfig } from '../routeConfig.js';

class Admin extends React.Component {
  render() {
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
    ];

    return <h1> "HERE" </h1>;
  }
}

export { Admin };
