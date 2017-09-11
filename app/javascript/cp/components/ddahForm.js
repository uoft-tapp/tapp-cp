import React from 'react';
import { Table, ButtonToolbar, Button } from 'react-bootstrap';

class DdahForm extends React.Component {
    render() {
        return (
            <div>
                <h3>Description of Duties and Allocation of Hours Form</h3>
                <Header {...this.props} />
                <Worksheet {...this.props} />
                <Training {...this.props} />
                <Summary {...this.props} />
                <Menu {...this.props} />
            </div>
        );
    }
}

const Header = props =>
    <div id="ddah-header">
        <table>
            <tbody>
                <tr>
                    <td>
                        <b>Department:</b>
                    </td>
                    <td>
                        <input type="text" />
                    </td>
                    <td>
                        <b>Supervising Professor:</b>
                    </td>
                    <td>
                        <select />
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Course Code:</b>
                    </td>
                    <td>
                        <input type="text" />
                    </td>
                    <td>
                        <b>Est. Enrolment / TA:</b>
                    </td>
                    <td>
                        <input type="number" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Course Title:</b>
                    </td>
                    <td>
                        <input type="text" />
                    </td>
                    <td>
                        <b>Expected Enrolment:</b>
                    </td>
                    <td>
                        <input type="number" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Tutorial Category:</b>
                    </td>
                    <td>
                        <input type="text" />
                    </td>
                    <td rowSpan="2">
                        <small>
                            Requires Training for Scaling Learning<br />Activities to Size of
                            Tutorial
                        </small>
                    </td>
                    <td rowSpan="2">
                        <input type="checkbox" />
                    </td>
                </tr>
                <tr>
                    <td />
                    <td>
                        <input type="radio" name="opt" />&nbsp;Optional&emsp;
                        <input type="radio" name="opt" />&nbsp;Mandatory
                    </td>
                </tr>
            </tbody>
        </table>
    </div>;

const Worksheet = props =>
    <Table condensed hover id="worksheet-table">
        <thead>
            <tr className="title">
                <th colSpan="5">Allocation of Hours Worksheet</th>
            </tr>
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
            {props.appState.getDdahWorksheet().map((row, i) =>
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

const Training = props =>
    <div id="training">
        <table>
            <thead>
                <tr className="title">
                    <th colSpan="2">Training</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <input type="checkbox" />&nbsp;Attending Health and Safety training sessions
                    </td>
                    <td>Indicate Tutorial Category (1 primary activity)</td>
                </tr>
                <tr>
                    <td>
                        <input type="checkbox" />&nbsp;Meetings with supervisor
                    </td>
                    <td>
                        <input type="checkbox" />&nbsp;Discussion-based Tutorial
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="checkbox" />&nbsp;Adaptive Teaching Techniques (ATT)
                    </td>
                    <td>
                        <input type="checkbox" />&nbsp;Skill Development Tutorial
                    </td>
                </tr>
                <tr>
                    <td>(scaling learning activities)</td>
                    <td>
                        <input type="checkbox" />&nbsp;Review and Q&amp;A Session
                    </td>
                </tr>
                <tr>
                    <td />
                    <td>
                        <input type="checkbox" />&nbsp;Laboratory/Practical
                    </td>
                </tr>
            </tbody>
        </table>
    </div>;

const Summary = props => {
    let duties = props.appState.getDutiesList();

    return (
        <Table condensed id="summary-table">
            <thead>
                <tr className="title">
                    <th colSpan="2">Allocation of Hours Summary</th>
                </tr>
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

const Menu = props =>
    <ButtonToolbar>
        <Button bsStyle="success">Submit for Review</Button>
        <Button bsStyle="primary">Save as Template</Button>
        <Button
            bsStyle="danger"
            onClick={() => {
                if (props.appState.clearDdah()) {
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
            Clear
        </Button>
    </ButtonToolbar>;

export { DdahForm };
