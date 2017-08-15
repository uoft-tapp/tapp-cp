import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

function THeader(props) {
  return (
    <thead>
      <tr>
        {props.config.map((field, i) =>
          <th key={'header-' + field.header}>
            {field.header}
          </th>
        )}
      </tr>
    </thead>
  );
}

function Row(props) {
  return (
    <tr key={'offer-' + props.offer_id + '-row'}>
      {props.config.map((field, i) =>
        <td key={'offer-' + props.offer_id + '-row-' + i}>
          {field.data(props.offer)}
        </td>
      )}
    </tr>
  );
}

class AdminTable extends React.Component {
  render() {
    return (
      <Table striped bordered condensed hover>
        <THeader config={this.props.config} />
        <tbody>
          this.props.offers().map((offer) =>
          {<Row offer_id={key} offer={value} {...this.props} />})
        </tbody>
      </Table>
    );
  }
}

export { AdminTable };
