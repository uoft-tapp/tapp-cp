import React from 'react';
import { Grid, ButtonToolbar, DropdownButton, MenuItem, Button } from 'react-bootstrap';

import { DdahForm } from './ddahForm.js';

class InstrControlPanel extends React.Component {
    render() {
        let nullCheck =
            this.props.appState.isCategoriesListNull() ||
            this.props.appState.isCoursesListNull() ||
            this.props.appState.isDutiesListNull() ||
            this.props.appState.isOffersListNull() ||
            this.props.appState.isTrainingsListNull();
        if (nullCheck) {
            return <div id="loader" />;
        }

        let fetchCheck =
            this.props.appState.fetchingCategories() ||
            this.props.appState.fetchingCourses() ||
            this.props.appState.fetchingDuties() ||
            this.props.appState.fetchingOffers() ||
            this.props.appState.fetchingTrainings();
        let cursorStyle = { cursor: fetchCheck ? 'progress' : 'auto' };

        let selectedCourse = this.props.appState.getSelectedCourse();
        let offers = selectedCourse ? this.props.appState.getOffersForCourse(selectedCourse) : null;

        return (
            <Grid fluid id="instr-grid">
                <Menu selectedCourse={selectedCourse} offers={offers} {...this.props} />
                <DdahForm selectedCourse={selectedCourse} offers={offers} {...this.props} />
            </Grid>
        );
    }
}

const Menu = props => {
    let courses = props.appState.getCoursesList(),
        selectedOffer = props.appState.getSelectedOffer();

    return (
        <ButtonToolbar id="menu">
            <DropdownButton
                id="courses-dropdown"
                bsStyle="info"
                title={
                    props.selectedCourse ? courses.getIn([props.selectedCourse, 'code']) : 'Course'
                }
                onSelect={eventKey => props.appState.selectCourse(eventKey)}>
                {courses.map((course, i) =>
                    <MenuItem eventKey={i}>
                        {course.get('code')}
                    </MenuItem>
                )}
            </DropdownButton>
            <DropdownButton
                id="offers-dropdown"
                bsStyle="info"
                disabled={props.selectedCourse == null}
                title={
                    selectedOffer && props.offers
                        ? props.offers.getIn([selectedOffer, 'lastName']) +
                          ' · ' +
                          props.offers.getIn([selectedOffer, 'utorid'])
                        : 'Applicant'
                }
                onSelect={eventKey => props.appState.selectOffer(eventKey)}>
                {props.offers &&
                    props.offers.map((offer, i) =>
                        <MenuItem eventKey={i}>
                            {offer.get('lastName')}&nbsp;&middot;&nbsp;{offer.get('utorid')}
                        </MenuItem>
                    )}
            </DropdownButton>

            <Button bsStyle="success" id="submit">
                Submit for Review
            </Button>
            <Button bsStyle="primary" id="save">
                Save as Template
            </Button>
            <Button
                id="clear"
                bsStyle="danger"
                onClick={() => {
                    if (props.appState.clearDdah()) {
                        Array.prototype.forEach.call(
                            document.querySelectorAll('#instr-grid input, #instr-grid select'),
                            function(input) {
                                switch (input.type) {
                                    case 'text':
                                        input.value = null;
                                        break;
                                    case 'checkbox':
                                        input.checked = false;
                                        break;
                                    case 'radio':
                                        break;
                                    default:
                                        input.value = null;
                                }
                            }
                        );
                    }
                }}>
                Clear
            </Button>
        </ButtonToolbar>
    );
};

export { InstrControlPanel };
