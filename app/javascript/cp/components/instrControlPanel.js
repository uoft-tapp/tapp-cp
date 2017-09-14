import React from 'react';
import {
    Grid,
    ButtonToolbar,
    ButtonGroup,
    Button,
    PanelGroup,
    Panel,
    Well,
    DropdownButton,
    MenuItem,
    Modal,
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

        let selectedDdah = this.props.appState.getSelectedDdah();
        let selectedOffer = this.props.appState.getSelectedOffer();

        return (
            <Grid fluid id="instr-grid" style={cursorStyle}>
                <PanelGroup id="select-menu">
                    <TemplatesMenu selectedDdah={selectedDdah} {...this.props} />
                    <ApplicantsMenu
                        selectedDdah={selectedDdah}
                        selectedOffer={selectedOffer}
                        {...this.props}
                    />
                </PanelGroup>
                {selectedDdah && (selectedDdah.startsWith('T') || selectedOffer)
                    ? <div id="ddah-menu-container">
                          <ActionMenu selectedDdah={selectedDdah} {...this.props} />
                          <DdahForm selectedDdah={selectedDdah} {...this.props} />
                      </div>
                    : <Well id="no-selection">
                          <h4>Nothing here yet!</h4>
                          <h5>Select a course and applicant to start, or create a template.</h5>
                      </Well>}
            </Grid>
        );
    }
}

const TemplatesMenu = props => {
    let templates = props.appState.getTemplatesList();

    return (
        <Panel header={<h4>Templates</h4>}>
            <ul id="templates-menu">
                {templates.map((template, i) =>
                    <li
                        className={'T' + i == props.selectedDdah ? 'active' : ''}
                        onClick={() => props.appState.toggleSelectedDdah('T' + i)}>
                        {template.get('name')}
                    </li>
                )}
                <li id="create">Create a new template</li>
            </ul>
        </Panel>
    );
};

const ApplicantsMenu = props => {
    let courses = props.appState.getCoursesList();

    return (
        <Panel header={<h4>Applicants</h4>}>
            <ul>
                {courses.map((course, i) =>
                    <li
                        className={'C' + i == props.selectedDdah ? 'active' : ''}
                        onClick={() => props.appState.toggleSelectedDdah('C' + i)}>
                        {course.get('code')}
                        <ul className="applicant-menu">
                            {props.appState.getOffersForCourse(i).map((offer, i) =>
                                <li
                                    className={i == props.selectedOffer ? 'active' : ''}
                                    onClick={event => {
                                        event.stopPropagation();
                                        props.appState.toggleSelectedOffer(i);
                                    }}>
                                    {offer.get('lastName')}&nbsp;&middot;&nbsp;{offer.get('utorid')}
                                </li>
                            )}
                        </ul>
                    </li>
                )}
            </ul>
        </Panel>
    );
};

const ActionMenu = props => {
    let templates = props.appState.getTemplatesList(),
        courseSelected = props.selectedDdah.startsWith('C');

    return (
        <ButtonToolbar id="action-menu">
            <DropdownButton bsStyle="warning" title="Apply template" id="templates-dropdown">
                {templates.map((template, i) =>
                    <MenuItem eventKey={i}>
                        {template.get('name')}
                    </MenuItem>
                )}
            </DropdownButton>

            <Button id="clear" bsStyle="danger" onClick={() => props.appState.clearDdah()}>
                Clear
            </Button>

            {courseSelected &&
                <Button bsStyle="success" id="submit">
                    Submit for Review
                </Button>}

            {courseSelected
                ? <ButtonGroup id="save">
                      <Button bsStyle="primary">Save</Button>
                      <Button bsStyle="info">Save as Template</Button>
                  </ButtonGroup>
                : <Button
                      bsStyle="primary"
                      id="save"
                      onClick={() => props.appState.updateTemplate(props.selectedDdah.slice(1))}>
                      Save
                  </Button>}
        </ButtonToolbar>
    );
};

const SaveModal = props =>
    <Modal.Dialog>
        <Modal.Header closeButton />
        <Modal.Body>You have unsaved changes.</Modal.Body>

        <Modal.Footer>
            <Button>Cancel</Button>
            <Button bsStyle="alert">Discard changes</Button>
            <Button bsStyle="primary">Save changes</Button>
        </Modal.Footer>
    </Modal.Dialog>;

export { InstrControlPanel };
