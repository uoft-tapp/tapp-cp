import React from 'react';
import { Grid, Panel, ListGroup } from 'react-bootstrap';
import { CourseList } from './courseList.js';
import { CourseForm } from './courseForm.js';
import { InstructorModal } from './instructorModal.js';

class Courses extends React.Component {
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

    render() {
        let nullCheck = this.props.isCoursesListNull() || this.props.isInstructorsListNull();
        if (nullCheck) {
            return <div id="loader" />;
        }

        let fetchCheck = this.props.fetchingCourses() || this.props.fetchingInstructors();
        let cursorStyle = { cursor: fetchCheck ? 'progress' : 'auto' };

        let courses = Object.entries(this.props.getCoursesList());
        courses.sort(([A, valA], [B, valB]) => (valA.code < valB.code ? -1 : 1));

        return (
            <Grid fluid id="courses-grid">
                <CourseList courses={courses}  {...this.props}/>
                <Panel id="course-form">
                    <ListGroup fill>
                        {courses.map(([key, course]) =>
                            <CourseForm key={key}
                                        courseId={key}
                                        course={course}
                                        {...this.props}
                                        />
                        )}
                    </ListGroup>
                </Panel>
                <InstructorModal {...this.props}/>
            </Grid>
        );
    }
}

export { Courses };
