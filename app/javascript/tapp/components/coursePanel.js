import React from 'react';
import { ApplicantTableMenu } from './applicantTableMenu.js';
import { ApplicantTable } from './applicantTable.js';
import { DropdownButton, MenuItem, Glyphicon } from 'react-bootstrap';

class CoursePanel extends React.Component {
    constructor(props) {
        super(props);
        let isInstructor = props.getSelectedUserRole()=='instructor';
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
                                    style={{ cursor: 'pointer' }}
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
                            !isInstructor?
                            <input
                                type="checkbox"
                                defaultChecked={true}
                                onClick={() => props.deleteAssignment(p.applicantId, assignment.id)}
                            />:''
                        );
                    } else {
                        return (
                            !isInstructor?
                            <input
                                type="checkbox"
                                defaultChecked={false}
                                onClick={() =>
                                    props.createAssignment(
                                        p.applicantId,
                                        p.course,
                                        props.getCourseById(p.course).positionHours
                                    )}
                            />:''
                        );
                    }
                },

                style: { width: !isInstructor?0.02:0.001, textAlign: 'center' },
            },
            {
                header: 'Last Name',
                // clicking last name generates a modal of the applicant's individual page
                // icon is displayed beside last name if applicant has associated notes
                data: p =>
                    <span
                        className="highlight"
                        onClick={() => props.selectApplicant(p.applicantId)}>
                        {p.applicant.lastName}&nbsp;
                        {p.applicant.notes && <i className="fa fa-paperclip" />}
                    </span>,
                sortData: p => p.applicant.lastName,

                style: { width: 0.12 },
            },
            {
                header: 'First Name',
                data: p => p.applicant.firstName,
                sortData: p => p.applicant.firstName,

                style: { width: 0.1 },
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

                style: { width: 0.1 },
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

                style: { width: 0.06 },
            },
            {
                header: 'Year',
                data: p => p.applicant.year,
                sortData: p => p.applicant.year,

                style: { width: 0.04 },
            },
            {
                header: 'Pref.',
                // checkmark if the applicant has a special preference for this course, nothing otherwise
                data: p =>
                    props.getApplicationPreference(p.applicantId, p.course)
                        ? <i className="fa fa-check" />
                        : '',

                sortData: p => props.getApplicationPreference(p.applicantId, p.course),

                style: { width: 0.04 },
            },
            {
                header: 'Instructor Pref.',
                data: p => {
                        return (
                          isInstructor?
                          <InstructorPreferenceMenu {...this.props} course={p.course} applicantId={p.applicantId}/>:
                          <Glyphicon glyph={glyphicons[props.getInstructorPref(p.applicantId, p.course)]} />
                        );
                    },

                style: { width: 0.08 },
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

const instructorPrefMenuItems = ['\xa0', 'Unsuitable', 'Preferred', 'Strongly Preferred'];

const glyphicons = ['', 'thumbs-down', 'thumbs-up', 'heart-empty'];

class InstructorPreferenceMenu extends React.Component {
  constructor(props) {
    super(props);

    let defaultValue = props.getInstructorPref(props.applicantId, props.course);
    if (defaultValue === null) defaultValue = 0;
      
    this.state = {
        btnTitle: instructorPrefMenuItems[defaultValue], 
        val: defaultValue
    };
      
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.updateInstructorPref(this.props.applicantId, this.props.course, event);

    var val = instructorPrefMenuItems[event];
      
    this.setState({
      btnTitle: val,
      val: event
    });

    //this.props.selectApplicant(this.props.applicantId);
  }

  render() {
    return (
        <DropdownButton style={{ width: '6vw' }}
            bsStyle={"default"}
            title={
                <div style={{ display: 'inline-block' }}> 
                  <Glyphicon glyph={glyphicons[this.state.val]} />
                </div>
              }
            key={this.props.applicantId}
            id={'dropdown-basic-${this.props.applicantId}'}
            noCaret
            onSelect={e => this.handleChange(e)}>
            {instructorPrefMenuItems.map((item, index) =>
                <MenuItem eventKey={index} key={index}><Glyphicon glyph={glyphicons[index]} /></MenuItem>
            )}
        </DropdownButton>
    );
  }
}

const AssignedApplicantTable = props =>
    <ApplicantTable
        config={props.config}
        assigned={true}
        course={props.course}
        getApplicants={() => props.getApplicantsAssignedToCourse(props.course)}
        rowId={p => p.course + '-' + p.applicantId + '-1'}
        width={
            [2, 3.1, 3.2, 3.3, 3.4, 4].includes(props.getCoursePanelLayout())
                ? '70vw'
                : props.getCoursePanelLayout() == 3 ? '45vw' : '100vw'
        }
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
        width={
            [2, 3.1, 3.2, 3.3, 3.4, 4].includes(props.getCoursePanelLayout())
                ? '70vw'
                : props.getCoursePanelLayout() == 3 ? '45vw' : '100vw'
        }
    />;

export { CoursePanel };
