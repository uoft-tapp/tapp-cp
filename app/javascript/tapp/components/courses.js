import React from 'react';
import ReactDOM from 'react-dom';
import { Grid } from 'react-bootstrap';
import { CourseList } from './courseList.js';
import { CourseForm } from './courseForm.js';

class Courses extends React.Component {
    render() {
        let nullCheck = this.props.isCoursesListNull() || this.props.isInstructorsListNull();
        if (nullCheck) {
            return <div id="loader" />;
        }

        let fetchCheck = this.props.fetchingCourses() || this.props.fetchingInstructors();
        let cursorStyle = { cursor: fetchCheck ? 'progress' : 'auto' };

        return (
            <Grid fluid id="courses-grid">
                <CourseList {...this.props} />
                <CourseForm {...this.props} />
            </Grid>
        );
    }

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
}

export { Courses };
