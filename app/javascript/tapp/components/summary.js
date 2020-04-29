import React from "react";
import {
    Grid,
    Panel,
    PanelGroup,
    ButtonGroup,
    Form,
    Button,
    Well,
    Table
} from "react-bootstrap";
import { ImportForm } from "./importForm.js";
import { ExportForm } from "./exportForm.js";

class Summary extends React.Component {
    render() {
        let nullCheck = this.props.anyNull();
        if (nullCheck) {
            return <div id="loader" />;
        }

        let fetchCheck = this.props.anyFetching();
        let cursorStyle = { cursor: fetchCheck ? "progress" : "auto" };

        return (
            <Grid fluid id="summary-grid" style={cursorStyle}>
                <PanelGroup>
                    <Utilities {...this.props} />
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
            <ButtonGroup>
                <Button
                    id="import-btn"
                    onClick={() => {
                        let importForm = document.getElementById(
                            "import-form-container"
                        );
                        if (
                            !importForm.style.display ||
                            importForm.style.display == "none"
                        ) {
                            importForm.style.display = "block";
                            document.getElementById(
                                "export-form-container"
                            ).style.display = "none";
                        } else {
                            importForm.style.display = "none";
                        }
                    }}
                >
                    <i className="fa fa-upload" style={{ fontSize: "20px" }} />
                    <br />
                    <small>Import</small>
                </Button>
                <Button
                    id="export-btn"
                    onClick={() => {
                        let exportForm = document.getElementById(
                            "export-form-container"
                        );
                        if (
                            !exportForm.style.display ||
                            exportForm.style.display == "none"
                        ) {
                            exportForm.style.display = "block";
                            document.getElementById(
                                "import-form-container"
                            ).style.display = "none";
                        } else {
                            exportForm.style.display = "none";
                        }
                    }}
                >
                    <i
                        className="fa fa-download"
                        style={{ fontSize: "20px" }}
                    />
                    <br />
                    <small>Export</small>
                </Button>
                <Button
                    onClick={() =>
                        props.alert(
                            "<b>Release assignments</b> This functionality is not currently supported."
                        )
                    }
                >
                    <i
                        className="fa fa-share-square-o"
                        style={{ fontSize: "20px" }}
                    />
                    <br />
                    <small>Release</small>
                </Button>
            </ButtonGroup>
            <div id="import-form-container">
                <div className="divider" />
                <ImportForm {...props} />
            </div>
            <div id="export-form-container">
                <div className="divider" />
                <ExportForm {...props} />
            </div>
        </Panel>
    );
};

const Stats = props => {
    let applicants = Object.entries(props.getApplicantsList());
    let gradApplicants = applicants.filter(([_, app]) =>
        ["MSc", "MASc", "MScAC", "MEng", "OG", "PhD"].includes(app.program)
    );
    let dcsGradApplicants = gradApplicants.filter(
        ([_, app]) => app.dept == "Computer Science"
    );

    let assignments = props.getAssignmentsList();
    let unassGradApplicants = gradApplicants.filter(
        ([id, _]) => !assignments[id]
    );
    let unassDcsGradApplicants = dcsGradApplicants.filter(
        ([id, _]) => !assignments[id]
    );

    let courses = props.getCoursesList();
    let orderedCourses = Object.entries(courses);
    orderedCourses.sort(([A, valA], [B, valB]) =>
        valA.code < valB.code ? -1 : 1
    );

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
                    <h2>{unassGradApplicants.length}</h2> unassigned graduate
                    applicants
                </span>
                <span className="divider">/</span>
                <span className="stat">
                    <h2>{dcsGradApplicants.length}</h2> DCS graduate applicants
                </span>
                <span className="divider">/</span>
                <span className="stat">
                    <h2>{unassDcsGradApplicants.length}</h2> unassigned DCS
                    graduate applicants
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
                    {orderedCourses.map(([id, course]) => (
                        <PerCourseStats
                            key={id + "-stats"}
                            course={id}
                            courses={courses}
                            applications={applicationsList}
                            assignments={assignmentsList}
                        />
                    ))}
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
            <td>{props.courses[props.course].code}</td>
            <td>{props.courses[props.course].cap}</td>
            <td>{props.courses[props.course].estimatedEnrol}</td>
            <td>{props.courses[props.course].waitlist}</td>
            <td>{applications.length}</td>
            <td>{assignments.length}</td>
            <td>{taHours}</td>
            {props.courses[props.course].estimatedEnrol == null ? (
                <td />
            ) : (
                <td>
                    {(
                        taHours / props.courses[props.course].estimatedEnrol
                    ).toFixed(2)}
                </td>
            )}
        </tr>
    );
};

export { Summary };
