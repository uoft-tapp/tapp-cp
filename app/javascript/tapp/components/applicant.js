import React from 'react';
import { AssignmentForm } from './assignmentForm.js';
import { Panel, Button } from 'react-bootstrap';

class Applicant extends React.Component {
    constructor(props) {
        super(props);

        // applicant panels and their default expansion state
        this.defaultConfig = [
            { label: 'Notes', expanded: true },
            { label: 'Personal Information', expanded: true },
            { label: 'Current Assignment Status', expanded: true },
            { label: 'Course Preferences', expanded: true },
            { label: 'Course Preferences (Raw Text)', expanded: false },
            { label: 'Teaching Experience', expanded: true },
            { label: 'Academic Qualifications', expanded: true },
            { label: 'Technical Skills', expanded: true },
            { label: 'Availability', expanded: true },
            { label: 'Other Information', expanded: true },
            { label: 'Special Needs Issues', expanded: true },
        ];
    }

    // convert linefeed/carriage return characters to HTML line breaks
    format(text) {
        if (!text) {
            return null;
        }
        return (
            <span style={{ whiteSpace: 'pre-wrap' }}>
                {text.replace(/\\r*\\n/g, <br />)}
            </span>
        );
    }

    addPanelContent(panel) {
        let application = this.props.getApplicationById(this.props.applicantId);

        switch (panel) {
            case 'Personal Information':
                return <PersonalInfo applicant={this.props.applicantId} {...this.props} />;

            case 'Current Assignment Status':
                return <AssignmentForm {...this.props} />;

            case 'Course Preferences':
                return <Prefs applicant={this.props.applicantId} {...this.props} />;

            case 'Course Preferences (Raw Text)':
                return this.format(application.rawPrefs);

            case 'Teaching Experience':
                return this.format(application.exp);

            case 'Academic Qualifications':
                return this.format(application.qual);

            case 'Technical Skills':
                return this.format(application.skills);

            case 'Availability':
                return this.format(application.avail);

            case 'Other Information':
                return this.format(application.other);

            case 'Special Needs Issues':
                return this.format(application.specialNeeds);

            case 'Notes':
                return <NotesForm applicant={this.props.applicantId} {...this.props} />;

            default:
                return null;
        }
    }

    componentWillMount() {
        // initially, create an assignment form with the default panels and expansion state, unless the
        // expansion state is overridden by this.props.config
        // this.props.config should be of the form { <label> : <expanded?> }

        this.props.createAssignmentForm(
            this.defaultConfig.map(
                panel =>
                    this.props.config && panel.label in this.props.config
                        ? { label: panel.label, expanded: this.props.config[panel.label] }
                        : panel
            )
        );
    }

    render() {
        let fetchCheck = this.props.anyFetching();
        let cursorStyle = { cursor: fetchCheck ? 'progress' : 'auto' };

        return (
            <div style={cursorStyle}>
                {this.props.getAssignmentForm().panels.map((panel, index) =>
                    <Panel
                        collapsible
                        expanded={panel.expanded}
                        header={
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    margin: '0',
                                    cursor: 'pointer',
                                }}
                                onClick={() => this.props.togglePanelExpanded(index)}>
                                {panel.label}
                            </div>
                        }
                        key={'panel-' + index}>
                        {this.addPanelContent(panel.label)}
                    </Panel>
                )}
            </div>
        );
    }
}

const PersonalInfo = props => {
    let applicant = props.getApplicantById(props.applicant),
        application = props.getApplicationById(props.applicant);

    // format the address and truncate it at 3 lines with an ellipsis if necessary
    let address;
    if (!applicant.address) {
        address = null;
    } else {
        address = applicant.address.split(/\\r*\\n/);
        if (address.length > 3) {
            address.splice(3);
            address[2] = address[2] + ' [...]';
        }
        address = [
            <tr key="address-0">
                <td>
                    <b>Address:</b>
                </td>
                <td>
                    {address[0]}
                </td>
            </tr>,
            ...address.slice(1).map((line, i) =>
                <tr key={'address-' + i}>
                    <td>
                        {line}
                    </td>
                </tr>
            ),
        ];
    }

    return (
        <table className="panel_table">
            <tbody>
                <tr>
                    <td>
                        <b>Last Name:&ensp;</b>
                        {applicant.lastName}
                    </td>
                    <td>
                        <b>First Name:&ensp;</b>
                        {applicant.firstName}
                    </td>
                    <td rowSpan="3">
                        <table>
                            <tbody>
                                {address}
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>UTORid:&ensp;</b>
                        {applicant.utorid}
                    </td>
                    <td>
                        <b>Student ID:&ensp;</b>
                        {applicant.studentNumber}
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Email Address:&ensp;</b>
                        {applicant.email}
                    </td>
                    <td>
                        <b>Phone Number:&ensp;</b>
                        {applicant.phone}
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Enrolled as a U of T graduate student for the TA session?&ensp;</b>
                        {applicant.fullTime ? 'Yes' : 'No'}
                    </td>
                    <td>
                        <b>Completed a U of T TA training session?&ensp;</b>
                        {application.taTraining ? 'Yes' : 'No'}
                    </td>
                    <td>
                        <b>
                            Grant permission for the TA coordinator to access academic
                            history?&ensp;
                        </b>
                        {application.academicAccess ? 'Yes' : 'No'}
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Department:&ensp;</b>
                        {applicant.dept}
                    </td>
                    <td>
                        <b>Program:&ensp;</b>
                        {applicant.program}
                    </td>
                    <td>
                        <b>Year:&ensp;</b>
                        {applicant.year}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

const Prefs = props => {
    let prefs = props.getApplicationById(props.applicant).prefs;
    let courses = props.getCoursesList();

    let j = 0,
        columns = [],
        size = 4;
    for (let i = 0; i < Math.ceil(prefs.length / size); i++) {
        columns[i] = prefs.slice(j, j + size);
        j = j + size;
    }

    return (
        <table className="panel_table">
            <tbody>
                <tr>
                    {columns.map((column, key) =>
                        <td key={key}>
                            {column.map((item, key) =>
                                <p key={key}>
                                    {courses[item.positionId].code}
                                    &nbsp;{item.preferred
                                        ? <i className="fa fa-star-o" style={{ color: 'orange' }} />
                                        : ''}
                                </p>
                            )}
                        </td>
                    )}
                </tr>
            </tbody>
        </table>
    );
};

const NotesForm = props =>
    <div>
        <textarea
            id="applicant-notes"
            style={{ width: '100%' }}
            defaultValue={props.getApplicantById(props.applicant).notes}
        />
        <br />
        <Button
            bsSize="small"
            onClick={() =>
                props.noteApplicant(
                    props.applicant,
                    document.getElementById('applicant-notes').value
                )}>
            Save
        </Button>
    </div>;

export { Applicant };
