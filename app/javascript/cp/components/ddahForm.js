import React from 'react';
import { Table, Button } from 'react-bootstrap';

class DdahForm extends React.Component {
    render() {
        let ddahWorksheet = this.props.appState.getDdahWorksheet();

        // check whether ddah for offer was selected, and if so, get related details
        let hours, offersCount, course, ddah;
        if (this.props.appState.isOfferSelected()) {
            let offer = this.props.appState.getOffersList().get(this.props.selectedDdahId);
            let position = offer.get('position');

            hours = offer.get('hours');
            offersCount = this.props.appState.getOffersForCourse(position).size;
            course = this.props.appState.getCoursesList().get(position.toString());

            ddah = this.props.appState
                .getDdahsList()
                .find(ddah => ddah.get('offer') == this.props.selectedDdahId);
        }

        return (
            <div
                id="ddah-container"
                className={([null,'None', 'Created'].includes(this.props.status) ||
                    this.props.appState.isTemplateSelected()) ? '' : 'disabled'}>
                <h3>Description of Duties and Allocation of Hours Form</h3>
                <Header
                    ddahData={ddahWorksheet}
                    course={course}
                    ddah={ddah}
                    offersCount={offersCount}
                    {...this.props}
                />
                <Allocations ddahData={ddahWorksheet} {...this.props} />
                <Training ddahData={ddahWorksheet} {...this.props} />
                <Summary hours={hours} {...this.props} />
                {this.props.appState.isOfferSelected() &&
                    <Signatures ddahData={ddahWorksheet} ddah={ddah} {...this.props} />}
            </div>
        );
    }
}

const Header = props =>
    <table id="ddah-header">
        <tbody>
            <tr>
                <td>
                    <b>Department:</b>
                </td>
                <td>
                    <input
                        type="text"
                        readOnly
                        value={props.ddah ? props.ddah.get('department') : ''}
                        disabled={props.appState.isTemplateSelected()}
                    />
                </td>
                <td>
                    <b>Supervising Professor:</b>
                </td>
                <td>
                    <select
                        value={
                            props.ddahData.get('supervisor') != null
                                ? props.ddahData.get('supervisor')
                                : ''
                        }
                        disabled={props.appState.isTemplateSelected()}
                        onChange={event =>
                            props.appState.updateDdahWorksheet('supervisor', event.target.value)}>
                        <option />
                        {props.course &&
                            props.course.get('instructors').map(instructor =>
                                <option>
                                    {instructor}
                                </option>
                            )}
                    </select>
                </td>
            </tr>
            <tr>
                <td>
                    <b>Course Code:</b>
                </td>
                <td>
                    <input
                        type="text"
                        readOnly
                        value={props.course ? props.course.get('code') : ''}
                        disabled={props.appState.isTemplateSelected()}
                    />
                </td>
                <td>
                    <b>Est. Enrolment / TA:</b>
                </td>
                <td>
                    <input
                        type="number"
                        readOnly
                        value={
                            props.course && props.course.get('estimatedEnrol') != null
                                ? (props.course.get('estimatedEnrol') / props.offersCount).toFixed()
                                : ''
                        }
                        disabled={props.appState.isTemplateSelected()}
                    />
                </td>
            </tr>
            <tr>
                <td>
                    <b>Course Title:</b>
                </td>
                <td>
                    <input
                        type="text"
                        readOnly
                        value={props.course ? props.course.get('name') : ''}
                        disabled={props.appState.isTemplateSelected()}
                    />
                </td>
                <td>
                    <b>Expected Enrolment:</b>
                </td>
                <td>
                    <input
                        type="number"
                        readOnly
                        value={
                            props.course && props.course.get('estimatedEnrol') != null
                                ? props.course.get('estimatedEnrol')
                                : ''
                        }
                        disabled={props.appState.isTemplateSelected()}
                    />
                </td>
            </tr>
            <tr>
                <td>
                    <b>Tutorial Category:</b>
                </td>
                <td>
                    <input
                        type="text"
                        readOnly
                        value={props.ddah ? props.ddah.get('tutCategory') : ''}
                        disabled={props.appState.isTemplateSelected()}
                    />
                </td>
                <td rowSpan="2">
                    <small>
                        Requires Training for Scaling Learning<br />Activities to Size of Tutorial
                    </small>
                </td>
                <td rowSpan="2">
                    <input
                        type="checkbox"
                        checked={props.ddahData.get('requiresTraining') == true}
                        onChange={event =>
                            props.appState.updateDdahWorksheet(
                                'requiresTraining',
                                event.target.checked
                            )}
                    />
                </td>
            </tr>
            <tr>
                <td />
                <td>
                    <input
                        type="radio"
                        id="optional"
                        name="optional"
                        checked={props.ddahData.get('optional') == true}
                        onChange={event =>
                            props.appState.updateDdahWorksheet('optional', event.target.checked)}
                    />&nbsp;<label htmlFor="optional">Optional</label>&emsp;
                    <input
                        type="radio"
                        id="mandatory"
                        name="optional"
                        checked={props.ddahData.get('optional') == false}
                        onChange={event =>
                            props.appState.updateDdahWorksheet('optional', !event.target.checked)}
                    />&nbsp;<label htmlFor="mandatory">Mandatory</label>
                </td>
            </tr>
        </tbody>
    </table>;

const Allocations = props =>
    <Table condensed hover id="allocations-table">
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
            {props.ddahData.get('allocations').map((row, i) =>
                <tr key={'allocation-' + i}>
                    <td>
                        <input
                            type="number"
                            min="0"
                            value={row.get('units') != null ? row.get('units') : ''}
                            onChange={event =>
                                props.appState.updateDdahWorksheetAllocation(
                                    i,
                                    'units',
                                    event.target.value
                                )}
                        />
                    </td>
                    <td>
                        <select
                            value={row.get('duty') != null ? row.get('duty') : ''}
                            onChange={event =>
                                props.appState.updateDdahWorksheetAllocation(
                                    i,
                                    'duty',
                                    event.target.value
                                )}>
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
                            value={row.get('type') != null ? row.get('type') : ''}
                            onChange={event =>
                                props.appState.updateDdahWorksheetAllocation(
                                    i,
                                    'type',
                                    event.target.value
                                )}
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            min="0"
                            value={row.get('time') != null ? row.get('time') : ''}
                            onChange={event =>
                                props.appState.updateDdahWorksheetAllocation(
                                    i,
                                    'time',
                                    event.target.value
                                )}
                        />
                    </td>
                    <td>
                        {(row.get('units') * row.get('time') / 60).toFixed(1)}
                        <i
                            className="fa fa-minus-circle delete-button"
                            title="Delete row"
                            onClick={() => props.appState.removeAllocation(i)}
                        />
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
                    {props.appState.getDdahWorksheetTotal().toFixed(1)}
                </td>
            </tr>
        </tbody>
    </Table>;

const Training = props => {
    let trainings = props.appState.getTrainingsList(),
        categories = props.appState.getCategoriesList();

    return (
        <table id="training">
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
                                {trainings.map((training, i) =>
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                id={'training-' + i}
                                                checked={props.ddahData
                                                    .get('trainings')
                                                    .includes(parseInt(i))}
                                                onChange={event =>
                                                    props.appState.updateDdahWorksheet(
                                                        'trainings',
                                                        i
                                                    )}
                                            />&nbsp;<label htmlFor={'training-' + i}>{training}</label>
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
                                {categories.map((category, i) =>
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                id={'category-' + i}
                                                checked={props.ddahData
                                                    .get('categories')
                                                    .includes(parseInt(i))}
                                                onChange={event =>
                                                    props.appState.updateDdahWorksheet(
                                                        'categories',
                                                        i
                                                    )}
                                            />&nbsp;<label htmlFor={'category-' + i}>{category}</label>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
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
                {props.appState.getDutiesSummary().map((duty, i) =>
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
                        {props.appState.isOfferSelected() &&
                            <span style={{ float: 'right', color: 'blue' }}>
                                Expected: {props.hours.toFixed(1)}
                            </span>}
                    </td>
                    <td>
                        {props.appState.getDdahWorksheetTotal().toFixed(1)}
                    </td>
                </tr>
            </tbody>
        </Table>
    );
};

const Signatures = props => {
    let offer = props.appState.getOffersList().get(props.selectedDdahId);

    return (
        <table id="signatures">
            <tbody>
                <tr>
                    <td>
                        <input
                            type="text"
                            value={
                                props.ddahData.get('supervisor')
                                    ? props.ddahData.get('supervisor')
                                    : ''
                            }
                            readOnly
                        />
                        <br />

                        <span className="input-label">
                            &ensp;Prepared by <i>(Supervisor)</i>
                        </span>
                    </td>

                    <td>
                        <input
                            type="text"
                            readOnly
                            value={
                                props.ddah.get('superSignature')
                                    ? props.ddah.get('superSignature')
                                    : ''
                            }
                        />
                        <br />
                        <span className="input-label">Signature</span>
                    </td>

                    <td>
                        <span className="input-label">Date:</span>&nbsp;
                        <input
                            type="text"
                            readOnly
                            value={
                                props.ddah.get('superSignDate')
                                    ? new Date(props.ddah.get('superSignDate')).toLocaleDateString()
                                    : ''
                            }
                        />
                    </td>
                </tr>

                <tr>
                    <td>
                        <input type="text" readOnly />
                        <br />
                        <span className="input-label">
                            &ensp;Prepared by <i>(Chair/Designated Authority)</i>
                        </span>
                    </td>

                    <td>
                        <input
                            type="text"
                            readOnly
                            value={
                                props.ddah.get('authSignature')
                                    ? props.ddah.get('authSignature')
                                    : ''
                            }
                        />
                        <br />
                        <span className="input-label">Signature</span>
                    </td>

                    <td>
                        <span className="input-label">Date:</span>&nbsp;
                        <input
                            type="text"
                            readOnly
                            value={
                                props.ddah.get('authSignDate')
                                    ? new Date(props.ddah.get('authSignDate')).toLocaleDateString()
                                    : ''
                            }
                        />
                    </td>
                </tr>

                <tr>
                    <td>
                        <input
                            type="text"
                            value={offer.get('lastName') + ', ' + offer.get('firstName')}
                            readOnly
                        />
                        <br />
                        <span className="input-label">
                            &ensp;Accepted by <i>(Teaching Assistant)</i>
                        </span>
                    </td>

                    <td>
                        <input
                            type="text"
                            readOnly
                            value={
                                props.ddah.get('studentSignature')
                                    ? props.ddah.get('studentSignature')
                                    : ''
                            }
                        />
                        <br />
                        <span className="input-label">Signature</span>
                    </td>

                    <td>
                        <span className="input-label">Date:</span>&nbsp;
                        <input
                            type="text"
                            readOnly
                            value={
                                props.ddah.get('studentSignDate')
                                    ? new Date(
                                          props.ddah.get('studentSignDate')
                                      ).toLocaleDateString()
                                    : ''
                            }
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export { DdahForm };
