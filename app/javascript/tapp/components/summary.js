import React from 'react';
import { Grid, Panel, PanelGroup, Form, Button, Well, Table } from 'react-bootstrap';
import { ExportForm } from './exportForm.js';
import { ImportForm } from './importForm.js';

class Summary extends React.Component {
    render() {
        let nullCheck = this.props.anyNull();
        if (nullCheck) {
            return <div id="loader" />;
        }

        let fetchCheck = this.props.anyFetching();
        let cursorStyle = { cursor: fetchCheck ? 'progress' : 'auto' };

        return (
            <Grid fluid id="summary-grid" style={cursorStyle}>
                <PanelGroup>
                    <Panel header="Utilities" id="utils">
                        <ImportForm {...this.props} />
                        <ExportForm {...this.props} />
                        <ReleaseForm {...this.props} />
                    </Panel>
                    <Stats {...this.props} />
                </PanelGroup>
            </Grid>
        );
    }

    selectThisTab() {
        if (this.props.getSelectedNavTab() != this.props.navKey) {
            this.props.selectNavTab(this.props.navKey);
        }
    }

    componentWillMount() {
        this.selectThisTab();
    }

    componentWillUpdate() {
        this.selectThisTab();
    }
}

const Utilities = props => {
    return (
        <Panel header="Utilities" id="utils">
            <ImportForm {...props} />
            <ExportForm {...props} />
            <ReleaseForm {...props} />
        </Panel>
    );
};

// form for importing data from a file and persisting it to the database
class ImportForm extends React.Component {
    loadFile() {
        let files = document.getElementById('import').files;
        if (files.length > 0) {
            let message =
                'Are you sure you want to import "' + files[0].name + '" into the database?';
            if (files[0].type == 'application/json') {
                if (confirm(message)) {
                    let importChass = data => {
                        this.props.setImporting(true);
                        this.props.importChass(data);
                    };
                    let chassAlert = () => this.props.alert('Error: This is not a CHASS JSON.');
                    let malformedAlert = () => this.props.alert('Error: This JSON is malformed.');
                    this.uploadFile(files[0], importChass, chassAlert, malformedAlert);
                }
            } else {
                this.props.alert('Error: The file you uploaded is not a JSON.');
            }
        } else {
            this.props.alert('Error: No file chosen.');
        }
    }

    uploadFile(file, importChass, chassAlert, malformedAlert) {
        let reader = new FileReader();
        reader.onload = function(event) {
            try {
                let data = JSON.parse(event.target.result);

                if (data['courses'] !== undefined && data['applicants'] !== undefined) {
                    data = { chass_json: data };
                    importChass(data);
                } else {
                    chassAlert();
                }
            } catch (err) {
                malformedAlert();
            }
        };
        reader.readAsText(file);
    }

    render() {
        return (
            <Form inline>
                <FormControl.Static style={{ verticalAlign: 'middle' }}>
                    {this.props.importing()
                        ? <i
                              className="fa fa-spinner fa-spin"
                              style={{ fontSize: '20px', color: 'blue' }}
                          />
                        : <i
                              className="fa fa-upload"
                              style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }}
                              onClick={() => this.loadFile()}
                          />}&emsp;
                </FormControl.Static>
                <FormGroup>
                    <ControlLabel>
                        Import from file:&nbsp;
                        <OverlayTrigger
                            trigger="click"
                            rootClose
                            placement="right"
                            overlay={InfoDialog(chassFormat)}>
                            <i className="fa fa-info-circle" style={{ color: 'blue' }} />
                        </OverlayTrigger>
                    </ControlLabel>
                    <FormControl id="import" type="file" accept="application/json" />
                </FormGroup>
            </Form>
        );
    }
}

const InfoDialog = chassFormat =>
    <Popover id="help" placement="right" title="CHASS JSON format">
        <textarea value={chassFormat} disabled />
    </Popover>;

// form for exporting app data to a file
class ExportForm extends React.Component {
    exportData(data, format) {
        if (data == 'offers') {
            // export offers
            let route;
            if (format == 'csv') {
                // export offers in CSV format
                window.open('/export/offers');
            } else if (
                confirm(
                    'This will lock all exported assignments.\nAre you sure you want to proceed?'
                )
            ) {
                // export offers in JSON format
                this.props.exportOffers();
            }
        } else {
            // export other data in CS
            if (format == 'csv') {
                window.open('/export/' + data);
            } else {
                this.props.alert(
                    '<b>Export JSON</b> This functionality is not currently supported.'
                );
            }
        }
    }

    render() {
        return (
            <Form inline id="export">
                <FormGroup id="data">
                    <ControlLabel>Export&ensp;</ControlLabel>
                    <FormControl
                        id="data"
                        componentClass="select"
                        inputRef={ref => {
                            this.data = ref;
                        }}>
                        <option value="offers">Offers</option>
                        <option value="cdf-info">CDF info</option>
                        <option value="transcript-access">
                            Undergraduate applicants granting access to academic history
                        </option>
                    </FormControl>
                </FormGroup>

                <FormGroup id="format">
                    <ControlLabel>&ensp;to&ensp;</ControlLabel>
                    <FormControl
                        id="format"
                        componentClass="select"
                        inputRef={ref => {
                            this.format = ref;
                        }}>
                        <option value="csv">CSV</option>
                        {this.props.getSelectedRound() && <option value="json">JSON</option>}
                    </FormControl>
                </FormGroup>
                <FormControl.Static style={{ verticalAlign: 'middle' }}>
                    &emsp;<i
                        className="fa fa-download"
                        style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }}
                        onClick={() => this.exportData(this.data.value, this.format.value)}
                    />
                </FormControl.Static>
            </Form>
        );
    }
}

// form for releasing tentative assignments to instructors
const ReleaseForm = props =>
    <Form id="release">
        <Button
            bsStyle="success"
            onClick={() =>
                props.alert(
                    '<b>Release assignments</b> This functionality is not currently supported.'
                )}>
            Release<br />assignments
        </Button>
    </Form>;

const Stats = props => {
    let applicants = Object.entries(props.getApplicantsList());
    let gradApplicants = applicants.filter(([_, app]) =>
        ['MSc', 'MASc', 'MScAC', 'MEng', 'OG', 'PhD'].includes(app.program)
    );
    let dcsGradApplicants = gradApplicants.filter(([_, app]) => app.dept == 'Computer Science');

    let assignments = props.getAssignmentsList();
    let unassGradApplicants = gradApplicants.filter(([id, _]) => !assignments[id]);
    let unassDcsGradApplicants = dcsGradApplicants.filter(([id, _]) => !assignments[id]);

    let courses = props.getCoursesList();
    let orderedCourses = Object.entries(courses);
    orderedCourses.sort(([A, valA], [B, valB]) => (valA.code < valB.code ? -1 : 1));

    let assignmentsList = Object.entries(assignments);
    let applicationsList = Object.entries(props.getApplicationsList());

    return (
        <Panel header="Assignment Statistics" id="stats">
            <Well id="gen-stats">
                <span className="stat">
                    <h2>{applicants.length}</h2> applicants
                </span>
                <span className="divider">/</span>
                <span className="stat">
                    <h2>{gradApplicants.length}</h2> graduate applicants
                </span>
                <span className="divider">/</span>
                <span className="stat">
                    <h2>{unassGradApplicants.length}</h2> unassigned graduate applicants
                </span>
                <span className="divider">/</span>
                <span className="stat">
                    <h2>{dcsGradApplicants.length}</h2> DCS graduate applicants
                </span>
                <span className="divider">/</span>
                <span className="stat">
                    <h2>{unassDcsGradApplicants.length}</h2> unassigned DCS graduate applicants
                </span>
            </Well>

            <Table striped hover condensed id="per-course">
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Cap</th>
                        <th>Enrolment</th>
                        <th>Waitlist</th>
                        <th>Applicants</th>
                        <th>Assignments</th>
                        <th>Assigned hours</th>
                        <th>Density</th>
                    </tr>
                </thead>
                <tbody>
                    {orderedCourses.map(([id, course]) =>
                        <PerCourseStats
                            key={id + '-stats'}
                            course={id}
                            courses={courses}
                            applications={applicationsList}
                            assignments={assignmentsList}
                        />
                    )}
                </tbody>
            </Table>
        </Panel>
    );
};

const PerCourseStats = props => {
    // applications to course
    let applications = props.applications.filter(([_, app]) =>
        app[0].prefs.some(pref => pref.positionId == props.course)
    );

    // assignments to course
    let assignments = props.assignments
        .map(([_, app]) => app.find(ass => ass.positionId == props.course))
        .filter(ass => ass != undefined);

    // total hours assigned to course
    let taHours = assignments.reduce((total, ass) => total + ass.hours, 0);

    return (
        <tr>
            <td>
                {props.courses[props.course].code}
            </td>
            <td>
                {props.courses[props.course].cap}
            </td>
            <td>
                {props.courses[props.course].estimatedEnrol}
            </td>
            <td>
                {props.courses[props.course].waitlist}
            </td>
            <td>
                {applications.length}
            </td>
            <td>
                {assignments.length}
            </td>
            <td>
                {taHours}
            </td>
            {props.courses[props.course].estimatedEnrol == null
                ? <td />
                : <td>
                      {(taHours / props.courses[props.course].estimatedEnrol).toFixed(2)}
                  </td>}
        </tr>
    );
};

export { Summary };
