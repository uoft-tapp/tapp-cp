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

        let selectedDdahId = this.props.appState.getSelectedDdahId();

        return (
            <Grid fluid id="instr-grid" style={cursorStyle}>
                <PanelGroup id="select-menu">
                    <TemplateSelectionMenu
                        selectedTemplate={
                            this.props.appState.isTemplateSelected() ? selectedDdahId : null
                        }
                        {...this.props}
                    />
                    <OfferSelectionMenu
                        selectedOffer={
                            this.props.appState.isOfferSelected() ? selectedDdahId : null
                        }
                        {...this.props}
                    />
                </PanelGroup>
                {selectedDdahId != null
                    ? <div id="ddah-menu-container">
                          {this.props.appState.isTemplateSelected() &&
                              <TemplateActionMenu
                                  selectedTemplate={selectedDdahId}
                                  {...this.props}
                              />}
                          {this.props.appState.isOfferSelected() &&
                              (['None', 'Created'].includes(
                                  this.props.appState
                                      .getOffersList()
                                      .getIn([selectedDdahId, 'ddahStatus'])
                              )
                                  ? <OfferActionMenu
                                        selectedOffer={selectedDdahId}
                                        {...this.props}
                                    />
                                  : <SubmittedActionMenu {...this.props} />)}
                          <DdahForm selectedDdahId={selectedDdahId} {...this.props} />
                      </div>
                    : <Well id="no-selection">
                          <h4>Nothing here yet!</h4>
                          <h5>Select a course and applicant to start, or create a template.</h5>
                      </Well>}
            </Grid>
        );
    }
}

const TemplateSelectionMenu = props => {
    let templates = props.appState.getTemplatesList();

    return (
        <Panel
            header={<h4>Templates</h4>}
            footer={
                <span onClick={() => props.appState.createTemplate()}>Create a new template</span>
            }>
            <ul id="templates-menu">
                {templates
                    .sort(
                        (a, b) =>
                            a.get('name').toLowerCase() > b.get('name').toLowerCase() ? 1 : -1
                    )
                    .map((template, i) =>
                        <li
                            className={i == props.selectedTemplate ? 'active' : ''}
                            onClick={() => {
                                if (
                                    !props.appState.anyDdahWorksheetChanges() ||
                                    window.confirm(
                                        'You have unsaved changes. Are you sure you want to leave?'
                                    )
                                ) {
                                    props.appState.toggleSelectedTemplate(i);
                                }
                            }}>
                            {template.get('name')}
                        </li>
                    )}
            </ul>
        </Panel>
    );
};

const OfferSelectionMenu = props => {
    let courses = props.appState.getCoursesList();

    return (
        <Panel header={<h4>Applicants</h4>}>
            <ul id="offers-menu">
                {courses.sort((a, b) => (a.get('code') > b.get('code') ? 1 : -1)).map((course, i) =>
                    <li
                        onClick={() => {
                            let submenu = document.getElementById(i + '-applicant-menu');
                            submenu.style.display =
                                submenu.style.display == 'block' ? 'none' : 'block';
                        }}>
                        {course.get('code')}
                        <ul id={i + '-applicant-menu'} className="applicant-menu">
                            {props.appState.getOffersForCourse(i).map((offer, i) =>
                                <li
                                    id={'offer-' + i}
                                    className={i == props.selectedOffer ? 'active' : ''}
                                    onClick={event => {
                                        event.stopPropagation();

                                        if (
                                            !props.appState.anyDdahWorksheetChanges() ||
                                            window.confirm(
                                                'You have unsaved changes. Are you sure you want to leave?'
                                            )
                                        ) {
                                            props.appState.toggleSelectedOffer(i);
                                        }
                                    }}>
                                    {offer.get('lastName')}&nbsp;&middot;&nbsp;{offer.get('utorid')}&ensp;
                                    {offer.get('ddahStatus') != 'None' &&
                                        offer.get('ddahStatus') != 'Created' &&
                                        <i
                                            className="fa fa-check-circle"
                                            style={{ color: 'green' }}
                                            title="Form submitted"
                                        />}
                                </li>
                            )}
                        </ul>
                    </li>
                )}
            </ul>
        </Panel>
    );
};

const TemplateActionMenu = props => {
    let templates = props.appState.getTemplatesList();

    return (
        <ButtonToolbar id="action-menu">
            <DropdownButton bsStyle="warning" title="Apply template" id="templates-dropdown">
                {templates.map((template, i) =>
                    <MenuItem onClick={() => props.appState.applyTemplate(i)}>
                        {template.get('name')}
                    </MenuItem>
                )}
            </DropdownButton>

            <Button id="clear" bsStyle="danger" onClick={() => props.appState.clearDdah()}>
                Clear
            </Button>

            <Button
                bsStyle="primary"
                id="save"
                disabled={!props.appState.anyDdahWorksheetChanges()}
                onClick={() => props.appState.updateTemplate(props.selectedTemplate)}>
                Save
            </Button>
        </ButtonToolbar>
    );
};

const OfferActionMenu = props => {
    let templates = props.appState.getTemplatesList();

    return (
        <ButtonToolbar id="action-menu">
            <DropdownButton bsStyle="warning" title="Apply template" id="templates-dropdown">
                {templates.map((template, i) =>
                    <MenuItem onClick={() => props.appState.applyTemplate(i)}>
                        {template.get('name')}
                    </MenuItem>
                )}
            </DropdownButton>

            <Button id="clear" bsStyle="danger" onClick={() => props.appState.clearDdah()}>
                Clear
            </Button>

            <Button
                id="submit"
                bsStyle="success"
                disabled={props.appState.anyDdahWorksheetChanges()}
                onClick={() => props.appState.submitDdah(props.selectedOffer)}>
                Submit for Review
            </Button>

            <ButtonGroup id="save">
                <Button
                    bsStyle="primary"
                    disabled={!props.appState.anyDdahWorksheetChanges()}
                    onClick={() => props.appState.updateDdah(props.selectedOffer)}>
                    Save
                </Button>
                <Button
                    bsStyle="info"
                    disabled={props.appState.anyDdahWorksheetChanges()}
                    onClick={() => props.appState.createTemplateFromDdah(props.selectedOffer)}>
                    Save as Template
                </Button>
            </ButtonGroup>
        </ButtonToolbar>
    );
};

const SubmittedActionMenu = props =>
    <ButtonToolbar id="action-menu">
        <ButtonGroup id="submit">
            <Button bsStyle="success" disabled>
                Successfully submitted
            </Button>
            <Button bsStyle="success" onClick={() => null}>
                View PDF
            </Button>
        </ButtonGroup>
    </ButtonToolbar>;

export { InstrControlPanel };
