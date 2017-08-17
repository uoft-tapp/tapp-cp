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
    <tr key={'offer-' + props.offerID + '-row'} id={'offer-' + props.offerID}>
      {props.config.map((field, i) =>
        <td key={'offer-' + props.offerID + '-row-' + i}>
          {field.data(props.offer)}
        </td>
      )}
    </tr>
  );
}

class AdminTable extends React.Component {
  render() {
    console.log(this.props.offers);
    return (
      <Table striped bordered condensed hover>
        <THeader config={this.props.config} />
        <tbody>
          {Object.entries(this.props.getOffers()).map(([key, value]) =>
            <Row key={'offer-' + key} offerID={key} offer={value} config={this.props.config} />
          )}
        </tbody>
      </Table>
    );
  }
}

export { AdminTable };
