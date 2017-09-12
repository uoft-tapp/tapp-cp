import React from 'react';
import { Grid, ButtonToolbar, Button, Nav, NavItem } from 'react-bootstrap';

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
            <Grid fluid id="instr-grid" style={cursorStyle}>
                <SelectMenu selectedCourse={selectedCourse} offers={offers} {...this.props} />
                <div id="ddah-menu-container">
                    <ActionMenu {...this.props} />
                    <DdahForm selectedCourse={selectedCourse} offers={offers} {...this.props} />
                </div>
            </Grid>
        );
    }
}

const SelectMenu = props => {
    let courses = props.appState.getCoursesList(),
        selectedOffer = props.appState.getSelectedOffer();

    return (
        <Nav
            id="select-menu"
            bsStyle="pills"
            stacked
            activeKey={props.selectedCourse}
            onSelect={eventKey => props.appState.selectCourse(eventKey)}>
            {courses.map((course, i) =>
                <NavItem eventKey={i}>
                    {course.get('code')}
                    {i == props.selectedCourse &&
                        props.offers &&
                        <Nav
                            id="applicant-menu"
                            bsStyle="pills"
                            stacked
                            activeKey={selectedOffer}
                            onSelect={eventKey => props.appState.selectOffer(eventKey)}>
                            {props.offers.map((offer, i) =>
                                <NavItem eventKey={i}>
                                    {offer.get('lastName')}&nbsp;&middot;&nbsp;{offer.get('utorid')}
                                </NavItem>
                            )}
                        </Nav>}
                </NavItem>
            )}
        </Nav>
    );
};

const ActionMenu = props => {
    return (
        <ButtonToolbar id="action-menu">
            <Button bsStyle="success" id="submit">
                Submit for Review
            </Button>
            <Button bsStyle="primary" id="save">
                Save
            </Button>
            <Button bsStyle="warning" id="template">
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
