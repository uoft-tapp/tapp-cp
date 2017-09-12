import React from 'react';
import {
    Grid,
    ButtonToolbar,
    Button,
    PanelGroup,
    Panel,
    ListGroup,
    ListGroupItem,
    Well,
} from 'react-bootstrap';

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
        <PanelGroup id="select-menu">
            <Panel header="Templates">
                <ListGroup fill>
                    {templates.map((template, i) =>
                        <ListGroupItem eventKey={'T' + i}>
                            {template.get('name')}
                        </ListGroupItem>
                    )}
                    <ListGroupItem bsStyle="info">Create a new template</ListGroupItem>
                </ListGroup>
            </Panel>

            <Panel header="Applicants">
                <ListGroup fill>
                    {courses.map((course, i) =>
                        <ListGroupItem onClick={() => props.appState.toggleSelectedCourse(i)}>
                            {course.get('code')}
                            {i == props.selectedCourse &&
                                <ListGroup id="applicant-menu" fill>
                                    {props.appState
                                        .getOffersForCourse(props.selectedCourse)
                                        .map((offer, i) =>
                                            <ListGroupItem
                                                active={i == props.selectedOffer}
                                                onClick={event => {
                                                    event.stopPropagation();
                                                    props.appState.toggleSelectedOffer(i);
                                                }}>
                                                {offer.get('lastName')}&nbsp;&middot;&nbsp;{offer.get('utorid')}
                                            </ListGroupItem>
                                        )}
                                </ListGroup>}
                        </ListGroupItem>
                    )}
                </ListGroup>
            </Panel>
        </PanelGroup>
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
