import React from 'react';
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap';

class CourseList extends React.Component {
    render() {
        return (
            <Panel className="course-list-panel" header="Courses">
                <ListGroup className="course-list-group" fill>
                    {this.props.courses.map(([key, course]) =>
                        <ListGroupItem key={key} title={course.code} className="course-list-item">
                            <a className="course" href={'#' + key}>
                              {course.code}
                            </a>
                            <a id={"email-"+key}
                              className="email-icon"
                              onClick={()=>(this.props.emailAssignments(course.code, course.round, key))}>
                              <i className="fa fa-envelope-o"></i>
                            </a>
                            <a id={"spinner-"+key}
                              className="spinning-icon">
                              <i className="fa fa-spinner fa-spin"></i>
                            </a>
                        </ListGroupItem>
                    )}
                </ListGroup>
            </Panel>
        );
    }
}

export { CourseList };
