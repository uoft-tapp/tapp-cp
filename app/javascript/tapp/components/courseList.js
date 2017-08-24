import React from 'react';
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap';

class CourseList extends React.Component {
    setCourseList(courses) {
        return Object.entries(courses).map((course, key) =>
            <ListGroupItem key={key} href={'#' + course[0]} title={course[1].code}>
                {course[1].code}
            </ListGroupItem>
        );
    }

    render() {
        let courses = this.props.getCoursesList();

        return (
            <Panel className="course-list-panel" header="Courses">
                <ListGroup className="course-list-group" fill>
                    {this.setCourseList(courses)}
                </ListGroup>
            </Panel>
        );
    }
}

export { CourseList };
