import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

const Theader = props =>
  <thead>
    <tr>
      {props.config.map((field, i) =>
        <th key={'header-' + field.header}>
          {field.header}
        </th>
      )}
    </tr>
  </thead>;

const Tbody = props =>
  <tbody>
    <tr>
      {props.offers.map((field, i) =>
        <td>
          {' '}{field}{' '}
        </td>
      )}
    </tr>
  </tbody>;

class AdminTable extends React.Component {
  render() {
    return (
      <Table striped bordered condensed hover>
        <Theader config={this.props.config} />
        <Tbody offers={this.props.offers} />
      </Table>
    );
  }
}

export { AdminTable };
