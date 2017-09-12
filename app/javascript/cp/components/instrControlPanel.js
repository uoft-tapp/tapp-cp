import React from 'react';
import { Grid, ButtonToolbar, Button, Nav, NavItem, Well } from 'react-bootstrap';

import { DdahForm } from './ddahForm.js';

class InstrControlPanel extends React.Component {
    render() {
        let nullCheck = this.props.appState.instrAnyNull();
        if (nullCheck) {
            return <div id="loader" />;
        }

        let fetchCheck = this.props.appState.instrAnyFetching();
        let cursorStyle = { cursor: fetchCheck ? 'progress' : 'auto' };

        let selectedCourse = this.props.appState.getSelectedCourse();
        let selectedOffer = this.props.appState.getSelectedOffer();

        return (
            <Grid fluid id="instr-grid" style={cursorStyle}>
                <SelectMenu
                    selectedCourse={selectedCourse}
                    selectedOffer={selectedOffer}
                    {...this.props}
                />
                {selectedCourse && selectedOffer
                    ? <div id="ddah-menu-container">
                          <ActionMenu {...this.props} />
                          <DdahForm
                              selectedCourse={selectedCourse}
                              selectedOffer={selectedOffer}
                              {...this.props}
                          />
                      </div>
                    : <Well id="no-selection">
                          <h4>Nothing here yet!</h4>
                          <h5>Select a course and applicant to start, or create a template.</h5>
                      </Well>}
            </Grid>
        );
    }
}

const SelectMenu = props => {
    let courses = props.appState.getCoursesList(),
        templates = props.appState.getTemplatesList();

    return (
        <Nav
            id="select-menu"
            bsStyle="pills"
            stacked
            activeKey={props.selectedCourse}
            onSelect={eventKey => props.appState.selectCourse(eventKey)}>
            <NavItem disabled>Templates</NavItem>
            {templates.map((template, i) =>
                <NavItem eventKey={'template-' + i}>
                    {template.get('name')}
                </NavItem>
            )}
            <NavItem>Create a template</NavItem>
            {courses.map((course, i) =>
                <NavItem eventKey={'course-' + i}>
                    {course.get('code')}
                    {i == props.selectedCourse &&
                        <Nav
                            id="applicant-menu"
                            bsStyle="pills"
                            stacked
                            activeKey={props.selectedOffer}
                            onSelect={eventKey => props.appState.selectOffer(eventKey)}>
                            {props.appState
                                .getOffersForCourse(props.selectedCourse)
                                .map((offer, i) =>
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
