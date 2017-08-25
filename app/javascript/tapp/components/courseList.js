import React from 'react';
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap';

class CourseList extends React.Component {
    render() {
        return (
            <Panel className="course-list-panel" header="Courses">
                <ListGroup className="course-list-group" fill>
                    {this.props.courses.map(([key, course]) =>
                        <ListGroupItem key={key} href={'#' + key} title={course.code}>
                            {course.code}
                        </ListGroupItem>
                    )}
                </ListGroup>
            </Panel>
        );
    }
}

export { CourseList };
