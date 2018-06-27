import React from 'react';
import {
    Grid,
    ButtonToolbar,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    DropdownButton,
    MenuItem,
    Button,
    ButtonGroup,
} from 'react-bootstrap';

import { TableMenu } from './tableMenu.js';
import { Table } from './table.js';
import { ImportButton } from './importButton.js';

const getCheckboxElements = () => document.getElementsByClassName('offer-checkbox');

const getSelectedOffers = () =>
    Array.prototype.filter
        .call(getCheckboxElements(), box => box.checked == true)
        .map(box => box.id);

class DdahControlPanel extends React.Component {
    constructor(props) {
        super(props);

        // most recently-clicked checkbox, stored to allow range selection
        this.lastClicked = null;
    }

    selectThisTab() {
        if (this.props.appState.getSelectedNavTab() != this.props.navKey) {
            this.props.appState.selectNavTab(this.props.navKey);
        }
    }

    componentWillMount() {
        this.selectThisTab();
    }

    componentWillUpdate() {
        this.selectThisTab();
    }

    render() {
        const role = this.props.appState.getSelectedUserRole();

        let nullCheck =
            this.props.appState.isOffersListNull() ||
            this.props.appState.isSessionsListNull() ||
            this.props.appState.isDdahsListNull()||
            this.props.appState.isCoursesListNull();
        if (nullCheck) {
            return <div id="loader" />;
        }

        let fetchCheck =
            this.props.appState.fetchingOffers() ||
            this.props.appState.fetchingSessions() ||
            this.props.appState.fetchingDdahs()||
            this.props.appState.fetchingCourses();
        let cursorStyle = { cursor: fetchCheck ? 'progress' : 'auto' };

        this.config = [
            {
                header: (
                    <input
                        type="checkbox"
                        defaultChecked={false}
                        id="header-checkbox"
                        onClick={event =>
                            Array.prototype.forEach.call(getCheckboxElements(), box => {
                                box.checked = event.target.checked;
                            })}
                    />
                ),
                data: p =>
                    <input
                        type="checkbox"
                        defaultChecked={false}
                        className="offer-checkbox"
                        id={p.offerId}
                        onClick={event => {
                            // range selection using shift key (range is from current box (offerId) to last-clicked box
                            if (this.lastClicked && event.shiftKey) {
                                let first = false,
                                    last = false;

                                Array.prototype.forEach.call(getCheckboxElements(), box => {
                                    if (
                                        !first &&
                                        (box.id == p.offerId || box.id == this.lastClicked)
                                    ) {
                                        // starting box
                                        first = true;
                                        box.checked = true;
                                    } else if (first && !last) {
                                        // box is in range
                                        if (box.id == p.offerId || box.id == this.lastClicked) {
                                            // ending box
                                            last = true;
                                        }
                                        box.checked = true;
                                    }
                                });
                            }

                            this.lastClicked = p.offerId;
                        }}
                    />,

                style: { width: 0.01, textAlign: 'center' },
            },
            {
                header: 'Last Name',
                data: p => p.offer.get('lastName'),
                sortData: p => p.get('lastName'),

                style: { width: 0.08 },
            },
            {
                header: 'First Name',
                data: p => p.offer.get('firstName'),
                sortData: p => p.get('firstName'),

                style: { width: 0.08 },
            },
            {
                header: 'Email',
                data: p => p.offer.get('email'),
                sortData: p => p.get('email'),

                style: { width: 0.16 },
            },
            {
                header: 'Position',
                data: p => p.offer.get('course'),
                sortData: p => p.get('course'),

                filterLabel: 'Position',
                filterCategories: this.props.appState.getPositions(),
                // filter out offers not to that position
                filterFuncs: this.props.appState
                    .getPositions()
                    .map(position => p => p.get('course') == position),

                style: { width: 0.1 },
            },
            {
                header: 'Offer Status',
                data: p => (p.offer.get('status')? p.offer.get('status'): '-'),
                sortData: p => (p.get('status')? p.get('status'): '-'),
                style: { width: 0.05 },
                filterLabel: 'Offer Status',
                filterCategories: ['Unsent', 'Pending', 'Accepted', 'Rejected', 'Withdrawn'],
                filterFuncs: [
                    'Unsent',
                    'Pending',
                    'Accepted',
                    'Rejected',
                    'Withdrawn',
                ].map(status => p => p.get('status') == status)
            },
            {
                header: 'DDAH Status',
                data: p =>
                    p.offer.get('ddahStatus')
                        ? <span>
                              {p.offer.get('ddahStatus')}&nbsp;
                              {!['None', 'Created'].includes(p.offer.get('ddahStatus')) &&
                                  <i
                                      className="fa fa-search"
                                      style={{ fontSize: '16px', cursor: 'pointer' }}
                                      title="PDF preview"
                                      onClick={() => this.props.appState.previewDdah(p.offerId)}
                                  />}
                          </span>
                        : '-',
                sortData: p => (p.get('ddahStatus') ? p.get('ddahStatus') : ''),

                filterLabel: 'DDAH Status',
                filterCategories: ['-', 'Created', 'Ready', 'Approved', 'Pending', 'Accepted'],
                filterFuncs: [p => p.get('ddahStatus') == undefined].concat(
                    ['Created', 'Ready', 'Approved', 'Pending', 'Accepted'].map(status => p =>
                        p.get('ddahStatus') == status
                    )
                ),
            },
            {
                header: 'Send Date',
                data: p => (p.offer.get('ddahSendDate')? p.offer.get('ddahSendDate'): '-'),
                sortData: p => (p.get('ddahSendDate')? p.get('ddahSendDate'): '-'),
                style: { width: 0.1 },
            },
            {
                header: 'Instructor Nag Count',
                data: p => (p.offer.get('InstructorNagCount')? p.offer.get('InstructorNagCount'): '-'),
                sortData: p => (p.get('InstructorNagCount')? p.get('InstructorNagCount'): '-'),
                style: { width: 0.1 },
            },
            {
                header: 'Applicant Nag Count',
                data: p => (p.offer.get('ddahNagCount')? p.offer.get('ddahNagCount'): '-'),
                sortData: p => (p.get('ddahNagCount')? p.get('ddahNagCount'): '-'),
                style: { width: 0.1 },
            }
        ];

        return (
            <Grid fluid id="ddah-grid" style={cursorStyle}>
                <ButtonToolbar id="dropdown-menu">
                    <ImportButton {...this.props}/>
                    <ExportForm {...this.props} />

                    <DdahsMenu {...this.props} />
                    <CommMenu {...this.props} />
                    <PreviewButton {...this.props} />

                    <TableMenu
                        config={this.config}
                        getSelectedSortFields={() => this.props.appState.getSorts()}
                        anyFilterSelected={field => this.props.appState.anyFilterSelected(field)}
                        isFilterSelected={(field, category) =>
                            this.props.appState.isFilterSelected(field, category)}
                        toggleFilter={(field, category) =>
                            this.props.appState.toggleFilter(field, category)}
                        clearFilters={() => this.props.appState.clearFilters()}
                        addSort={field => this.props.appState.addSort(field)}
                        removeSort={field => this.props.appState.removeSort(field)}
                        toggleSortDir={field => this.props.appState.toggleSortDir(field)}
                    />
                </ButtonToolbar>

                <Table
                    config={this.config}
                    getOffers={() => this.props.appState.getOffersList()}
                    getSelectedSortFields={() => this.props.appState.getSorts()}
                    getSelectedFilters={() => this.props.appState.getFilters()}
                />
            </Grid>
        );
    }
}


const DdahsMenu = props =>
    <DropdownButton bsStyle="primary" title="Update DDAH forms" id="ddahs-dropdown">
        <MenuItem onClick={() => props.appState.sendDdahs(getSelectedOffers())}>
            Send DDAH form(s)
        </MenuItem>
        <MenuItem divider />
        <MenuItem
            onClick={() =>  props.appState.getDdahApprovedSignature(getSelectedOffers())}>
            Approve DDAH form(s)
        </MenuItem>
        <MenuItem divider />
        <MenuItem onClick={() => props.appState.setDdahAccepted(getSelectedOffers())}>
            Set DDAH status to <i>Accepted</i>
        </MenuItem>
    </DropdownButton>;

const ExportForm = props =>
    <Form inline>
        <FormGroup style={{float: "left"}}>
            <ControlLabel>Course:</ControlLabel>&ensp;
            <FormControl
                id="course"
                componentClass="select"
                onChange={event => {
                    let select = event.target;
                    let value = select.options[select.selectedIndex].value;
                    props.appState.selectCourse(value);
                }}>
                <option value='all' key='session-all' defaultValue>
                  All in Current Session
                </option>
                {props.appState.getCoursesList().map((_, course) =>
                    <option value={course} key={course}>
                        {props.appState.getCoursesList().get(course).get('code')}
                    </option>
                )}
            </FormControl>
        </FormGroup>
        <ButtonGroup>
            <Button style={{display: "none"}}></Button>
            <Button style={{marginRight: "5px"}}
                bsStyle="primary"
                onClick={() => props.appState.exportDdahs()}>
                Export
            </Button>
        </ButtonGroup>
    </Form>;

const CommMenu = props =>
    <DropdownButton bsStyle="primary" title="Communicate" id="comm-dropdown">
        <MenuItem onClick={() => props.appState.email(getSelectedOffers())}>
            Email&ensp;[blank]
        </MenuItem>
        <MenuItem onClick={() => props.appState.emailDdah(getSelectedOffers())}>
            Email&ensp;[DDAH form]
        </MenuItem>
        <MenuItem divider />
        <MenuItem onClick={() => props.appState.nagApplicantDdahs(getSelectedOffers())}>
            Nag applicant
        </MenuItem>
        <MenuItem
            onClick={() => props.appState.nagInstructors(getSelectedOffers())}>
            Nag instructor(s)
        </MenuItem>
    </DropdownButton>;

const PreviewButton = props =>
    <Button
        bsStyle="primary"
        onClick={() => props.appState.previewDdahs(getSelectedOffers())}>
        Preview DDAH forms
    </Button>;

export { DdahControlPanel };
