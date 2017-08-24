import React from 'react';
import { Panel, ListGroup, ListGroupItem, Badge } from 'react-bootstrap';

class CourseForm extends React.Component {
    render() {
        let courses = this.props.getCoursesList();
        let instructors = this.props.getInstructorsList();

        return (
            <Panel id="course-form">
                <ListGroup fill>
                    {Object.entries(courses).map(([id, course]) =>
                        <ListGroupItem key={id}>
                            <a name={id} />
                            <table className="form_table">
                                <tbody>
                                    <tr>
                                        <td id="col-1">
                                            <p>
                                                <input
                                                    type="text"
                                                    value={course.code}
                                                    className="course"
                                                    readOnly
                                                    disabled
                                                />
                                            </p>
                                            <p>
                                                <input
                                                    type="text"
                                                    value={course.name}
                                                    readOnly
                                                    disabled
                                                />
                                            </p>
                                            <p>
                                                <input
                                                    type="text"
                                                    value={course.campus}
                                                    readOnly
                                                    disabled
                                                />
                                            </p>
                                        </td>
                                        <td id="col-2">
                                            <p>
                                                <b>Positions: </b>
                                            </p>
                                            <p>
                                                <b>Hours/Position: </b>
                                            </p>
                                            <p>
                                                <b>Estimated Enrollment: </b>
                                            </p>
                                        </td>
                                        <td id="col-3">
                                            <NumForm
                                                defaultVal={
                                                    course.estimatedPositions
                                                        ? course.estimatedPositions
                                                        : ''
                                                }
                                                update={val => {
                                                    if (val != course.estimatedPositions) {
                                                        this.props.updateCourse(
                                                            id,
                                                            val,
                                                            'estimatedPositions'
                                                        );
                                                    }
                                                }}
                                            />
                                            <NumForm
                                                defaultVal={
                                                    course.positionHours ? course.positionHours : ''
                                                }
                                                update={val => {
                                                    if (val != course.positionHours) {
                                                        this.props.updateCourse(
                                                            id,
                                                            val,
                                                            'positionHours'
                                                        );
                                                    }
                                                }}
                                            />
                                            <NumForm
                                                defaultVal={
                                                    course.estimatedEnrol
                                                        ? course.estimatedEnrol
                                                        : ''
                                                }
                                                update={val => {
                                                    if (val != course.estimatedEnrol) {
                                                        this.props.updateCourse(
                                                            id,
                                                            val,
                                                            'estimatedEnrol'
                                                        );
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td id="col-4">
                                            <p>
                                                <b>Instructors: </b>
                                            </p>
                                            <InstructorForm
                                                course={id}
                                                instructors={course.instructors}
                                                instructor_data={instructors}
                                                {...this.props}
                                            />
                                        </td>
                                        <td id="col-5">
                                            <p>
                                                <b>Qualifications: </b>
                                            </p>
                                            <textarea
                                                onBlur={event => {
                                                    if (event.target.value != course.qual) {
                                                        this.props.updateCourse(
                                                            id,
                                                            event.target.value,
                                                            'qual'
                                                        );
                                                    }
                                                }}
                                                defaultValue={course.qual}
                                            />
                                        </td>
                                        <td id="col-6">
                                            <p>
                                                <b>Responsibilities: </b>
                                            </p>
                                            <textarea
                                                onBlur={event => {
                                                    if (event.target.value != course.resp) {
                                                        this.props.updateCourse(
                                                            id,
                                                            event.target.value,
                                                            'resp'
                                                        );
                                                    }
                                                }}
                                                defaultValue={course.resp}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </ListGroupItem>
                    )}
                </ListGroup>
            </Panel>
        );
    }
}

// numerical input that allows submission by pressing enter
const NumForm = props =>
    <form
        onSubmit={event => {
            props.update(event.target.elements[0].value);
            event.preventDefault();
        }}>
        <input
            type="number"
            defaultValue={props.defaultVal}
            min="0"
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
            <div className="instructor_form" onClick={() => this.input.focus()}>
                {this.props.instructors.map((instructor, key) =>
                    <Badge key={key}>
                        {this.props.instructor_data[instructor]}
                        <button onClick={() => this.props.removeInstructor(this.props.course, key)}>
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
                            this.props.course,
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
