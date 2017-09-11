import React from 'react';
import { Table, ButtonToolbar, Button } from 'react-bootstrap';

class DdahForm extends React.Component {
    render() {
        let ddah = this.props.appState.getDdahWorksheet();

        return (
            <div>
                <h4>Allocation of Hours Worksheet</h4>
                <Worksheet ddah={ddah} {...this.props} />
                <h4>Allocation of Hours Summary</h4>
                <Summary ddah={ddah} {...this.props} />
                <ButtonToolbar>
                    <Button bsStyle="primary">Save Worksheet</Button>
                    <Button
                        bsStyle="danger"
                        onClick={() => {
                            if (this.props.appState.clearDdah()) {
                                Array.prototype.forEach.call(
                                    document.querySelectorAll(
                                        '#worksheet-table input, #worksheet-table select'
                                    ),
                                    function(input) {
                                        input.value = null;
                                    }
                                );
                            }
                        }}>
                        Clear Worksheet
                    </Button>
                </ButtonToolbar>
            </div>
        );
    }
}

const Worksheet = props =>
    <Table bordered condensed hover id="worksheet-table">
        <thead>
            <tr>
                <th># of Units</th>
                <th>Type of Duties</th>
                <th>
                    Type of Unit<br />
                    <small>(e.g. assignments, tutorials, meetings, etc.)</small>
                </th>
                <th>
                    Time/Task<br />
                    <small>(minutes)</small>
                </th>
                <th>
                    Total Time<br />
                    <small>(hours)</small>
                </th>
            </tr>
        </thead>
        <tbody>
            {props.ddah.map((row, i) =>
                <tr key={'allocation-' + i}>
                    <td>
                        <input
                            type="number"
                            min="0"
                            defaultValue={row.get('units')}
                            onChange={event =>
                                props.appState.updateDdah(i, 'units', event.target.value)}
                        />
                    </td>
                    <td>
                        <select
                            defaultValue={row.duty}
                            onChange={event =>
                                props.appState.updateDdah(i, 'duty', event.target.value)}>
                            <option />
                            {props.appState.getDutiesList().map((duty, id) =>
                                <option value={id}>
                                    {duty}
                                </option>
                            )}
                        </select>
                    </td>
                    <td>
                        <input
                            type="text"
                            autoComplete="on"
                            defaultValue={row.get('type')}
                            onChange={event =>
                                props.appState.updateDdah(i, 'type', event.target.value)}
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            min="0"
                            defaultValue={row.get('time')}
                            onChange={event =>
                                props.appState.updateDdah(i, 'time', event.target.value)}
                        />
                    </td>
                    <td>
                        {(row.get('units') * row.get('time') / 60).toFixed(1)}
                    </td>
                </tr>
            )}

            <tr>
                <td colSpan="5" style={{ backgroundColor: 'white', textAlign: 'left' }}>
                    <Button
                        bsSize="small"
                        bsStyle="info"
                        onClick={() => props.appState.addAllocation()}>
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
                <td>
                    {props.appState.getDdahTotal().toFixed(1)}
                </td>
            </tr>
        </tbody>
    </Table>;

const Summary = props => {
    let duties = props.appState.getDutiesList();

    return (
        <Table bordered condensed id="summary-table">
            <thead>
                <tr>
                    <th>Duties</th>
                    <th>
                        Time<br />
                        <small>(hours)</small>
                    </th>
                </tr>
            </thead>
            <tbody>
                {props.appState.computeDutiesSummary().map((duty, i) =>
                    <tr key={'duty-' + i}>
                        <td>
                            {duties.get(i)}
                        </td>
                        <td>
                            {duty.toFixed(1)}
                        </td>
                    </tr>
                )}
                <tr>
                    <td>
                        <b>Total</b>
                    </td>
                    <td>
                        {props.appState.getDdahTotal().toFixed(1)}
                    </td>
                </tr>
            </tbody>
        </Table>
    );
};

export { DdahForm };
