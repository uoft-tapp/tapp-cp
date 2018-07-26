import React from 'react';
import { ListGroupItem, Badge } from 'react-bootstrap';

class CourseForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
        };
    }

    toggleExpanded = (e) => {
        e.preventDefault();
        this.setState({
            expanded: !this.state.expanded,
        });
    };

    render() {
        let instructors = this.props.getInstructorsList();

        return (
            <ListGroupItem key={this.props.courseId}>
                <a name={this.props.courseId} />
                <table className="form-table">
                    <tbody>
                        <tr>
                            <td className="col-1">
                                <p>
                                    <input
                                        type="text"
                                        value={this.props.course.code}
                                        className="course"
                                        readOnly
                                        disabled
                                    />
                                </p>
                                <p>
                                    <input
                                        type="text"
                                        value={this.props.course.name}
                                        readOnly
                                        disabled
                                    />

                                </p>
                                <p>
                                    <input
                                        type="text"
                                        value={this.props.course.campus}
                                        readOnly
                                        disabled
                                    />
                                </p>
                            </td>
                            <td className="col-2">
                                <p>
                                    <b>Est./Curr. Enrol.: </b>
                                </p>
                                <p>
                                    <b>Enrol. Cap: </b>
                                </p>
                                <p>
                                    <b>Waitlist: </b>
                                </p>
                            </td>
                            <td className="col-3">
                                <Form
                                    type="number"
                                    defaultVal={this.props.course.estimatedEnrol}
                                    update={val => {
                                        if (val != this.props.course.estimatedEnrol) {
                                            this.props.updateCourse(
                                                this.props.courseId,
                                                val,
                                                'estextensionsimatedEnrol'
                                            );
                                        }
                                    }}
                                />
                                <Form
                                    type="number"
                                    defaultVal={this.props.course.cap}
                                    update={val => {
                                        if (val != this.props.course.cap) {
                                            this.props.updateCourse(
                                                this.props.courseId,
                                                val,
                                                'cap'
                                            );
                                        }
                                    }}
                                />
                                <Form
                                    type="number"
                                    defaultVal={this.props.course.waitlist}
                                    update={val => {
                                        if (val != this.props.course.waitlist) {
                                            this.props.updateCourse(
                                                this.props.courseId,
                                                val,
                                                'waitlist'
                                            );
                                        }
                                    }}
                                />
                            </td>
                            <td className="col-4">
                                <p>
                                    <b>Positions: </b>
                                </p>
                                <p>
                                    <b>Hours/Pos.: </b>
                                </p>
                            </td>
                            <td className="col-5">
                                <Form
                                    type="number"
                                    defaultVal={this.props.course.estimatedPositions}
                                    update={val => {
                                        if (val != this.props.course.estimatedPositions) {
                                            this.props.updateCourse(
                                                this.props.courseId,
                                                val,
                                                'estimatedPositions'
                                            );
                                        }
                                    }}
                                />
                                <Form
                                    type="number"
                                    defaultVal={this.props.course.positionHours}
                                    update={val => {
                                        if (val != this.props.course.positionHours) {
                                            this.props.updateCourse(
                                                this.props.courseId,
                                                val,
                                                'positionHours'
                                            );
                                        }
                                    }}
                                />
                            </td>
                            <td className="col-6">
                                <p>
                                    <b>Start Date: </b>
                                </p>
                                <Form
                                    type="date"
                                    defaultVal={
                                        this.props.course.startDate
                                            ? this.props.course.startDate.split('T')[0]
                                            : "hello"
                                    }
                                    update={val => {
                                        if (val != this.props.course.startDate) {
                                            this.props.updateCourse(
                                                this.props.courseId,
                                                val,
                                                'startDate'
                                            );
                                        }
                                    }}
                                />
                                <p>
                                    <b>End Date: </b>
                                </p>
                                <Form
                                    type="date"
                                    defaultVal={
                                        this.props.course.endDate
                                            ? this.props.course.endDate.split('T')[0]
                                            : undefined
                                    }
                                    update={val => {
                                        if (val != this.props.course.endDate) {
                                            this.props.updateCourse(
                                                this.props.courseId,
                                                val,
                                                'endDate'
                                            );
                                        }
                                    }}
                                />
                            </td>

                            <td className="col-7">
                                <p>
                                    <b>Instructors
                                     <i className="fa fa-pencil button icon"
                                      title="Open Instructor Editor"
                                      onClick={()=> this.props.showInstructorModal()}></i>
                                    </b>
                                </p>
                                <InstructorForm
                                    courseId={this.props.courseId}
                                    instructors={this.props.course.instructors}
                                    instructor_data={instructors}
                                    {...this.props}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <ExpandableDescriptions expanded={this.state.expanded}
                                        handleClick={this.toggleExpanded}
                                        {...this.props}
                />
            </ListGroupItem>
        );
    }
}


class ExpandableDescriptions extends React.Component {
    render () {
        if (this.props.expanded) {
            return (
                <div>
                    <button className="expand-button" onClick={this.props.handleClick}>
                        <span className="glyphicon glyphicon-chevron-up">
                        </span>
                    </button>
                    <Descriptions {...this.props} key={this.props.courseId}/>
                </div>
            );
        } else {
            return (
                <div>
                    <button className="expand-button" onClick={this.props.handleClick}>
                        <span className="glyphicon glyphicon-chevron-down">
                        </span>
                    </button>
                </div>
            );
        }
    }
}

class Descriptions extends React.Component {
    render() {
        return (
            <table className="form-table">
                <tbody>
                <tr>
                    <td className="col-half">
                        <p>
                            <b>Qualifications: </b>
                        </p>
                        <textarea
                            className="long-text"
                            onBlur={event => {
                                if (event.target.value != this.props.course.qual) {
                                    this.props.updateCourse(
                                        this.props.courseId,
                                        event.target.value,
                                        'qual'
                                    );
                                }
                            }}
                            defaultValue={this.props.course.qual}
                        />
                    </td>
                    <td className="col-half">
                        <p>
                            <b>Responsibilities: </b>
                        </p>
                        <textarea
                            className="long-text"
                            onBlur={event => {
                                if (event.target.value != this.props.course.resp) {
                                    this.props.updateCourse(
                                        this.props.courseId,
                                        event.target.value,
                                        'resp'
                                    );
                                }
                            }}
                            defaultValue={this.props.course.resp}
                        />
                    </td>
                </tr>
                </tbody>
            </table>
        );
    }
}

// input that allows form submission
const Form = props =>
    <form
        onSubmit={event => {
            props.update(event.target.elements[0].value);
            event.preventDefault();
        }}>
        <input
            type={props.type}
            defaultValue={props.defaultVal != undefined ? props.defaultVal : ''}
            onBlur={event => props.update(event.target.value)}
        />
    </form>;

class InstructorForm extends React.Component {
    alreadyAddedInstructor(id, instructors) {
        for (let i in instructors) {
            if (instructors[i] == id) {
                return true;
            }
        }
        return false;
    }

    isInstructor(input, course, instructors, instructor_data) {
        for (let i in instructor_data) {
            if (instructor_data[i] == input) {
                if (this.alreadyAddedInstructor(i, instructors)) {
                    this.props.alert("You've already added this instructor.");
                } else {
                    this.props.addInstructor(course, i);
                }
                this.input.value = '';
                break;
            }
        }
    }

    render() {
        return (
            <div className="instructor-form" onClick={() => this.input.focus()}>
                {this.props.instructors.map((instructor, key) =>
                    <Badge key={key}>
                        {this.props.instructor_data[instructor]}
                        <button
                            onClick={() => this.props.removeInstructor(this.props.courseId, key)}>
                            <i className="fa fa-close" />
                        </button>
                    </Badge>
                )}
                <input
                    type="text"
                    list="instructors"
                    defaultValue=""
                    ref={input => {
                        this.input = input;
                    }}
                    onInput={event =>
                        this.isInstructor(
                            event.target.value,
                            this.props.courseId,
                            this.props.instructors,
                            this.props.instructor_data
                        )}
                />
                <datalist id="instructors">
                    {Object.entries(this.props.instructor_data).map((instructor, key) =>
                        <option key={key} value={instructor[1]} />
                    )}
                </datalist>
            </div>
        );
    }
}

export { CourseForm };
