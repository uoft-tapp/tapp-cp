import React from 'react';
import { Table, Button } from 'react-bootstrap';

class DdahForm extends React.Component {
    render() {
        return (
            <div id="ddah-container">
                <h3>Description of Duties and Allocation of Hours Form</h3>
                <Header {...this.props} />
                <Worksheet {...this.props} />
                <Training {...this.props} />
                <Summary {...this.props} />
            </div>
        );
    }
}

const Header = props => {
    let course = props.appState.getCoursesList().get(props.selectedCourse);

    return (
        <div id="ddah-header">
            <table>
                <tbody>
                    <tr>
                        <td>
                            <b>Department:</b>
                        </td>
                        <td>
                            <input type="text" readOnly value="Computer Science" />
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
                            <input type="text" readOnly value={course ? course.get('code') : ''} />
                        </td>
                        <td>
                            <b>Est. Enrolment / TA:</b>
                        </td>
                        <td>
                            <input
                                type="number"
                                readOnly
                                value={
                                    course
                                        ? course.get('estimatedEnrol') /
                                          props.appState.getOffersForCourse(props.selectedCourse)
                                              .size
                                        : ''
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Course Title:</b>
                        </td>
                        <td>
                            <input type="text" readOnly value={course ? course.get('name') : ''} />
                        </td>
                        <td>
                            <b>Expected Enrolment:</b>
                        </td>
                        <td>
                            <input
                                type="number"
                                readOnly
                                value={course ? course.get('estimatedEnrol') : ''}
                            />
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
                            <input type="radio" name="optional" value={true} />&nbsp;Optional&emsp;
                            <input type="radio" name="optional" value={false} />&nbsp;Mandatory
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

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

const Training = props => {
    let trainings = props.appState.getTrainingsList(),
        categories = props.appState.getCategoriesList();

    return (
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
                            <table className="sub-table">
                                <tbody>
                                    {trainings.map(training =>
                                        <tr>
                                            <td>
                                                <input type="checkbox" />&nbsp;{training}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </td>
                        <td>
                            <table className="sub-table">
                                <tbody>
                                    <tr>
                                        <td>Indicate Tutorial Category (1 primary activity)</td>
                                    </tr>
                                    {categories.map(category =>
                                        <tr>
                                            <td>
                                                <input type="checkbox" />&nbsp;{category}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

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

export { DdahForm };
