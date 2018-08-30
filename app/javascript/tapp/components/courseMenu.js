import React from 'react';
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap';

class CourseMenu extends React.Component {
    constructor(props) {
        super(props);
        this.courses = [];
    }

    // acquire and sort courses in order of course code
    sortCourses() {
        this.courses = Object.entries(this.props.getCoursesList());
        this.courses.sort(([A, valA], [B, valB]) => (valA.code < valB.code ? -1 : 1));
    }

    componentWillMount() {
        this.sortCourses();
    }

    componentWillUpdate() {
        this.sortCourses();
    }

    render() {
        const list = this.courses.map(([key, val]) => {
            return (
                <ListGroupItem
                    key={'course-' + key}
                    onClick={() => this.props.toggleSelectedCourse(key)}
                    active={this.props.isCourseSelected(key)}>
                    <span className="course-code">
                        {val.code}
                    </span>
                    <span className="counts">
                        {this.props.getCourseAssignmentCount(key)}&nbsp;/{val.estimatedPositions}
                    </span>
                </ListGroupItem>
            );
        });

        return (
            <Panel header="Courses" className="course-list-panel">
                <ListGroup className="course-list-group" fill>
                    {list}
                </ListGroup>
            </Panel>
        );
    }
}

export { CourseMenu };
