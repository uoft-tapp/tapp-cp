import React from 'react';
import { ApplicantTableMenu } from './applicantTableMenu.js';
import { ApplicantTable } from './applicantTable.js';

class CoursePanel extends React.Component {
    constructor(props) {
        super(props);

        // table/menu configuration
        this.config = [
            {
                header: '',
                // checkbox that is checked if the applicant is currently assigned, unchecked if not
                data: p => {
                    if (p.assigned) {
                        let assignment = props.getAssignmentByApplicant(p.applicantId, p.course);

                        if (assignment.locked) {
                            return (
                                <i
                                    className="fa fa-lock"
                                    onClick={() => {
                                        if (
                                            confirm(
                                                'This will unlock an assignment that has already been exported.\nAre you sure?'
                                            )
                                        ) {
                                            props.unlockAssignment(p.applicantId, assignment.id);
                                        }
                                    }}
                                />
                            );
                        }

                        return (
                            <input
                                type="checkbox"
                                defaultChecked={true}
                                onClick={() => props.deleteAssignment(p.applicantId, assignment.id)}
                            />
                        );
                    } else {
                        return (
                            <input
                                type="checkbox"
                                defaultChecked={false}
                                onClick={() =>
                                    props.createAssignment(
                                        p.applicantId,
                                        p.course,
                                        props.getCourseById(p.course).positionHours
                                    )}
                            />
                        );
                    }
                },

                style: { width: 0.02, textAlign: 'center' },
            },
            {
                header: 'Last Name',
                // clicking last name generates a modal of the applicant's individual page
                // icon is displayed beside last name if applicant has associated notes
                data: p =>
                    <span
                        className="highlightOnHover"
                        onClick={() => props.selectApplicant(p.applicantId)}>
                        {p.applicant.lastName}&nbsp;
                        {p.applicant.notes && <i className="fa fa-paperclip" />}
                    </span>,
                sortData: p => p.applicant.lastName,

                style: { width: 0.15 },
            },
            {
                header: 'First Name',
                data: p => p.applicant.firstName,
                sortData: p => p.applicant.firstName,

                style: { width: 0.15 },
            },
            {
                header: 'Dept.',
                data: p => p.applicant.dept,
                sortData: p => p.applicant.dept,

                filterLabel: 'Dept.',
                filterCategories: ['DCS', 'Other'],
                filterFuncs: [
                    p => p.applicant.dept == 'Computer Science',
                    p => p.applicant.dept != 'Computer Science',
                ],

                style: { width: 0.25 },
            },
            {
                header: 'Prog.',
                data: p => p.applicant.program,
                sortData: p => p.applicant.program,

                filterLabel: 'Prog.',
                filterCategories: ['PostDoc', 'PhD', 'Masters', 'UG'],
                filterFuncs: [
                    p => p.applicant.program == 'PostDoc',
                    p => p.applicant.program == 'PhD',
                    // group masters programs together
                    p => ['MSc', 'MASc', 'MScAC', 'MEng', 'OG'].includes(p.applicant.program),
                    p => p.applicant.program == 'UG',
                ],

                style: { width: 0.10 },
            },
            {
                header: 'Year',
                data: p => p.applicant.year,
                sortData: p => p.applicant.year,

                style: { width: 0.05 },
            },
            {
                header: 'Pref.',
                // checkmark if the applicant has a special preference for this course, nothing otherwise
                data: p =>
                    props.getApplicationPreference(p.applicantId, p.course)
                        ? <i className="fa fa-check" />
                        : '',

                sortData: p => props.getApplicationPreference(p.applicantId, p.course),

                style: { width: 0.05 },
            },
            {
                header: 'Other',
                // comma-separated list of the codes for the (other) courses to which this applicant is assigned
                data: p =>
                    props
                        .getAssignmentsByApplicant(p.applicantId)
                        .reduce(
                            (str, ass) =>
                                ass.positionId == p.course
                                    ? str
                                    : str + props.getCourseCodeById(ass.positionId) + ', ',
                            ''
                        ),

                // unseparated string of the codes for the (other) courses to which this applicant is assigned
                sortData: p =>
                    props
                        .getAssignmentsByApplicant(p.applicantId)
                        .reduce(
                            (str, ass) =>
                                ass.positionId == p.course
                                    ? str
                                    : str + props.getCourseCodeById(ass.positionId),
                            ''
                        ),

                filterLabel: 'Status',
                filterCategories: ['Assigned elsewhere', 'Unassigned'],
                filterFuncs: [
                    // filter corresponding to 'assigned elsewhere'
                    p => props.getAssignmentsByApplicant(p.applicantId).length > 0,

                    // filter corresponding to 'unassigned'
                    p => props.getAssignmentsByApplicant(p.applicantId).length == 0,
                ],
            },
        ];
    }

    render() {
        return (
            <div
                className="panel panel-default course-panel"
                style={this.props.panelStyle}
                onDragOver={e => {
                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }
                }}
                onDrop={e => {
                    if (e.stopPropagation) {
                        e.stopPropagation(); // stops the browser from redirecting.
                    }

                    // swap this course with the course that was dragged over it
                    let swap = parseInt(e.dataTransfer.getData('text'));
                    if (swap != this.props.course) {
                        this.props.swapCoursesInLayout(swap, this.props.course);
                    }
                }}>
                <DraggableHeader {...this.props} />
                <div className="panel-body">
                    <AssignedApplicantTable config={this.config} {...this.props} />
                    <ApplicantTableMenu
                        config={this.config}
                        getSelectedSortFields={() =>
                            this.props.getCoursePanelSortsByCourse(this.props.course)}
                        anyFilterSelected={field =>
                            this.props.anyCoursePanelFilterSelected(this.props.course, field)}
                        isFilterSelected={(field, category) =>
                            this.props.isCoursePanelFilterSelected(
                                this.props.course,
                                field,
                                category
                            )}
                        toggleFilter={(field, category) =>
                            this.props.toggleCoursePanelFilter(this.props.course, field, category)}
                        clearFilters={() => this.props.clearCoursePanelFilters(this.props.course)}
                        addSort={field => this.props.addCoursePanelSort(this.props.course, field)}
                        removeSort={field =>
                            this.props.removeCoursePanelSort(this.props.course, field)}
                        toggleSortDir={field =>
                            this.props.toggleCoursePanelSortDir(this.props.course, field)}
                    />
                    <UnassignedApplicantTable config={this.config} {...this.props} />
                </div>
            </div>
        );
    }
}

const DraggableHeader = props => {
    let course = props.getCourseById(props.course);

    return (
        <div
            className="panel-heading"
            title="assignmentCount /[estimatedPositions]  [estimatedEnrolment]"
            draggable={true}
            onDragStart={e => {
                // send this course ID to an element that this panel is dragged over
                e.dataTransfer.setData('text', props.course);
            }}>
            {course.code}&emsp;{props.getCourseAssignmentCount(props.course)}&nbsp;/
            {course.estimatedPositions}&emsp;{course.estimatedEnrol}
            <i
                className="fa fa-close"
                style={{ float: 'right', cursor: 'pointer' }}
                onClick={() => props.toggleSelectedCourse(props.course)}
            />
        </div>
    );
};

const AssignedApplicantTable = props =>
    <ApplicantTable
        config={props.config}
        assigned={true}
        course={props.course}
        getApplicants={() => props.getApplicantsAssignedToCourse(props.course)}
        rowId={p => p.course + '-' + p.applicantId + '-1'}
    />;

const UnassignedApplicantTable = props =>
    <ApplicantTable
        config={props.config}
        assigned={false}
        course={props.course}
        getApplicants={() => props.getApplicantsToCourseUnassigned(props.course)}
        getSelectedSortFields={() => props.getCoursePanelSortsByCourse(props.course)}
        getSelectedFilters={() => props.getCoursePanelFiltersByCourse(props.course)}
        rowId={p => p.course + '-' + p.applicantId + '-0'}
    />;

export { CoursePanel };
