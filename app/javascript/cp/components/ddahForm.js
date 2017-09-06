import React from 'react';
import { Table, Button } from 'react-bootstrap';

class DdahForm extends React.Component {
    render() {
        return (
            <Table bordered condensed hover>
                <thead>
                    <tr>
                        <th># of Units</th>
                        <th>
                            Type of Unit{' '}
                            <small>(e.g. assignments, tutorials, meetings, etc.)</small>
                        </th>
                        <th>
                            Time/Task <small>(minutes)</small>
                        </th>
                        <th>
                            Total Time <small>(hours)</small>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {[1].map(row =>
                        <tr key={'row-' + row}>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    ref={input => (this[row + '-units'] = input)}
                                />
                            </td>
                            <td>
                                <input type="text" autocomplete="on" />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    ref={input => (this[row + '-time-per-task'] = input)}
                                />
                            </td>
                            <td>
                                {this[row + '-units'] && this[row + '-time-per-task']
                                    ? this[row + '-units'] * this[row + '-time-per-task'] / 60
                                    : ''}
                            </td>
                        </tr>
                    )}

                    <tr>
                        <td colSpan="4" style={{ backgroundColor: 'white' }}>
                            <Button bsSize="small" bsStyle="info">
                                <b>+ Add row</b>
                            </Button>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <b>Total</b>
                        </td>
                        <td />
                        <td />
                        <td />
                    </tr>
                </tbody>
            </Table>
        );
    }
}

export { DdahForm };
