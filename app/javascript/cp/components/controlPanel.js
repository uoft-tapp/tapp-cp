import React from 'react';
import { Grid, ButtonToolbar, DropdownButton, MenuItem, Button } from 'react-bootstrap';

import { TableMenu } from './tableMenu.js';
import { Table } from './table.js';
import { ImportMenu } from './importMenu.js';
import { SessionsForm } from './sessionsForm.js';

const getCheckboxElements = () => document.getElementsByClassName('offer-checkbox');

const getSelectedOffers = () =>
    Array.prototype.filter
        .call(getCheckboxElements(), box => box.checked == true)
        .map(box => box.id);

class ControlPanel extends React.Component {
    constructor(props) {
        super(props);

        // most recently-clicked checkbox, stored to allow range selection
        this.lastClicked = null;
    }

    render() {
        const role = this.props.appState.getCurrentUserRole();

        let nullCheck =
            role == 'admin'
                ? this.props.appState.anyNull()
                : this.props.appState.isOffersListNull();
        if (nullCheck) {
            return <div id="loader" />;
        }

        let fetchCheck =
            role == 'admin'
                ? this.props.appState.anyFetching()
                : this.props.appState.fetchingOffers();
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
			    // range selection using shift key
			    if (this.lastClicked && event.shiftKey) {
				let first = false, last = false;

				Array.prototype.forEach.call(getCheckboxElements(), box => {
				    if (!first && (box.id == p.offerId || box.id == this.lastClicked)) {
					first = true;
					box.checked = true;
				    }

				    if (first && !last) {
					if (box.id == p.offerId || box.id == this.lastClicked) {
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

                style: { width: 0.09 },
            },
            {
                header: 'First Name',
                data: p => p.offer.get('firstName'),
                sortData: p => p.get('firstName'),

                style: { width: 0.06 },
            },
            {
                header: 'Email',
                data: p => p.offer.get('email'),
                sortData: p => p.get('email'),

                style: { width: 0.13 },
            },
            {
                header: 'Student Number',
                data: p => p.offer.get('studentNumber'),
                sortData: p => p.get('studentNumber'),

                style: { width: 0.06 },
            },
            {
                header: 'Position',
                data: p => p.offer.get('position'),
                sortData: p => p.get('position'),

                filterLabel: 'Position',
                filterCategories: this.props.appState.getPositions(),
                // filter out offers not to that position
                filterFuncs: this.props.appState
                    .getPositions()
                    .map(position => p => p.get('position') == position),

                style: { width: 0.08 },
            },
            {
                header: 'Hours',
                data: p => p.offer.get('hours'),
                sortData: p => p.get('hours'),

                style: { width: 0.03 },
            },
            {
                header: 'Status',
                data: p => p.offer.get('status'),
                sortData: p => p.get('status'),

                filterLabel: 'Status',
                filterCategories: ['Unsent', 'Pending', 'Accepted', 'Rejected', 'Withdrawn'],
                filterFuncs: [
                    'Unsent',
                    'Pending',
                    'Accepted',
                    'Rejected',
                    'Withdrawn',
                ].map(status => p => p.get('status') == status),

                style: { width: 0.05 },
            },
            {
                header: 'Contract Send Date',
                data: p =>
                    p.offer.get('sentAt')
                        ? <span>
                              {new Date(p.offer.get('sentAt')).toLocaleString()}&ensp;
                              <i
                                  className="fa fa-search"
                                  style={{ fontSize: '16px', cursor: 'pointer' }}
                                  title="Applicant View"
                                  onClick={() =>
                                      this.props.appState.showContractApplicant(p.offerId)}
                              />&nbsp;
                              <i
                                  className="fa fa-search-plus"
                                  style={{ fontSize: '16px', cursor: 'pointer' }}
                                  title="Office View"
                                  onClick={() => this.props.appState.showContractHr(p.offerId)}
                              />
                          </span>
                        : '',
                sortData: p => p.get('sentAt'),

                style: { width: 0.08 },
            },
            {
                header: 'Nag Count',
                data: p => (p.offer.get('nagCount') ? p.offer.get('nagCount') : ''),
                sortData: p => p.get('nagCount'),

                style: { width: 0.04 },
            },
            {
                header: 'HRIS Status',
                data: p => (p.offer.get('hrStatus') == undefined ? '-' : p.offer.get('hrStatus')),
                sortData: p => (p.get('hrStatus') == undefined ? '' : p.get('hrStatus')),

                filterLabel: 'HRIS Status',
                filterCategories: ['-', 'Processed', 'Printed'],
                filterFuncs: [p => p.get('hrStatus') == undefined].concat(
                    ['Processed', 'Printed'].map(status => p => p.get('hrStatus') == status)
                ),

                style: { width: 0.05 },
            },
            {
                header: 'Printed Date',
                data: p =>
                    p.offer.get('printedAt')
                        ? new Date(p.offer.get('printedAt')).toLocaleString()
                        : '',
                sortData: p => p.get('printedAt'),

                style: { width: 0.07 },
            },
            {
                header: 'DDAH Status',
                data: p =>
                    p.offer.get('ddahStatus') == undefined ? '-' : p.offer.get('ddahStatus'),
                sortData: p => (p.get('ddahStatus') == undefined ? '' : p.get('ddahStatus')),

                filterLabel: 'DDAH Status',
                filterCategories: ['-', 'Accepted', 'Pending', 'Signed'],
                filterFuncs: [p => p.get('ddahStatus') == undefined].concat(
                    ['Accepted', 'Pending', 'Signed'].map(status => p =>
                        p.get('ddahStatus') == status
                    )
                ),

                style: { width: 0.06 },
            },
        ];

        return (
            <Grid fluid id="offers-grid">
                {role == 'admin' && <SessionsForm {...this.props} />}
            
                <ButtonToolbar id="dropdown-menu">
                    {role == 'admin' && <ImportMenu {...this.props} />}
                    {role == 'admin' && <OffersMenu {...this.props} />}
                    {role == 'admin' && <CommMenu {...this.props} />}

                    <PrintButton {...this.props} />

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
                    className={role == 'admin' ? 'admin-table' : ''}
                    config={this.config}
                    getOffers={() => {
			let session = this.props.appState.getSelectedSession();
			if (session != '') {
			    return this.props.appState.getOffersList()
				.filter(offer => offer.get('session') == session);
			}
			return this.props.appState.getOffersList();
	            }}
                    getSelectedSortFields={() => this.props.appState.getSorts()}
                    getSelectedFilters={() => this.props.appState.getFilters()}
                />
            </Grid>
        );
    }
}

const OffersMenu = props =>
    <DropdownButton bsStyle="primary" title="Update offers" id="offers-dropdown">
        <MenuItem onClick={() => props.appState.sendContracts(getSelectedOffers())}>
            Send contract(s)
        </MenuItem>
        <MenuItem onClick={() => props.appState.withdrawOffers(getSelectedOffers())}>
            Withdraw offer(s)
        </MenuItem>
        <MenuItem onClick={() => props.appState.setHrProcessed(getSelectedOffers())}>
            Set HR processed
        </MenuItem>
        <MenuItem onClick={() => props.appState.setDdahAccepted(getSelectedOffers())}>
            Set DDAH accepted
        </MenuItem>
    </DropdownButton>;

const CommMenu = props =>
    <DropdownButton bsStyle="primary" title="Communicate" id="comm-dropdown">
        <MenuItem onClick={() => props.appState.email(getSelectedOffers())}>Email</MenuItem>
        <MenuItem onClick={() => props.appState.nag(getSelectedOffers())}>Nag</MenuItem>
    </DropdownButton>;

const PrintButton = props =>
    <Button bsStyle="primary" onClick={() => props.appState.print(getSelectedOffers())}>
        Print contracts
    </Button>;

export { ControlPanel };
