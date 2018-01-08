import React from 'react';
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap';

class CourseList extends React.Component {
    render() {
        return (
            <Panel className="course-list-panel" header="Courses">
                <ListGroup className="course-list-group" fill>
                    {this.props.courses.map(([key, course]) =>
                        <ListGroupItem key={key} title={course.code}>
                            <a href={'#' + key} style={{width: '100%', float: 'left'}}>
                              {course.code}
                            </a>
                            <a onClick={()=>(alert('heelo'))} style={{style: 'right', border: 'red 1px solid'}}>
                              <i className="fa fa-envelope-o"></i>
                            </a>
                        </ListGroupItem>
                    )}
                </ListGroup>
            </Panel>
        );
    }
}

export { CourseList };
