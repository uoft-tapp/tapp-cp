import React from 'react';
import { Grid, ButtonToolbar, DropdownButton, MenuItem, Button } from 'react-bootstrap';

import { TableMenu } from './tableMenu.js';
import { Table } from './table.js';
import { ImportMenu } from './importMenu.js';

const getCheckboxElements = () => document.getElementsByClassName('offer-checkbox');

const getSelectedOffers = () =>
    Array.prototype.filter
        .call(getCheckboxElements(), box => box.checked == true)
        .map(box => box.id);

class ControlPanel extends React.Component {
    render() {
        let nullCheck = this.props.appState.isOffersListNull();
        if (nullCheck) {
            return <div id="loader" />;
        }

        let fetchCheck = this.props.appState.fetchingOffers();
        let cursorStyle = { cursor: fetchCheck ? 'progress' : 'auto' };

        const role = this.props.appState.getCurrentUserRole();

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
                    />,

                style: { width: 0.01, textAlign: 'center' },
            },
            {
                header: 'Last Name',
                data: p => p.offer.get('last_name'),
                sortData: p => p.get('last_name'),

                style: { width: 0.09 },
            },
            {
                header: 'First Name',
                data: p => p.offer.get('first_name'),
                sortData: p => p.get('first_name'),

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
                data: p => p.offer.get('student_number'),
                sortData: p => p.get('student_number'),

                style: { width: 0.06 },
            },
            {
                header: 'Position',
                data: p => p.offer.getIn(['contract_details', 'position']),
                sortData: p => p.getIn(['contract_details', 'position']),

                filterLabel: 'Position',
                filterCategories: this.props.appState.getPositions(),
                // filter out offers not to that position
                filterFuncs: this.props.appState
                    .getPositions()
                    .map(position => p => p.getIn(['contract_details', 'position']) == position),

                style: { width: 0.08 },
            },
            {
                header: 'Hours',
                data: p => p.offer.getIn(['contract_details', 'hours']),
                sortData: p => p.getIn(['contract_details', 'hours']),

                style: { width: 0.03 },
            },
            {
                header: 'Status',
                data: p => p.offer.getIn(['contract_statuses', 'status']),
                sortData: p => p.getIn(['contract_statuses', 'status']),

                filterLabel: 'Status',
                filterCategories: ['Unsent', 'Pending', 'Accepted', 'Rejected', 'Withdrawn'],
                filterFuncs: [
                    'Unsent',
                    'Pending',
                    'Accepted',
                    'Rejected',
                    'Withdrawn',
                ].map(status => p => p.getIn(['contract_statuses', 'status']) == status),

                style: { width: 0.05 },
            },
            {
                header: 'Contract Send Date',
                data: p =>
                    p.offer.getIn(['contract_statuses', 'sent_at'])
                        ? <span>
                              {new Date(
                                  p.offer.getIn(['contract_statuses', 'sent_at'])
                              ).toLocaleString()}&ensp;
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
                sortData: p => p.getIn(['contract_statuses', 'sent_at']),

                style: { width: 0.08 },
            },
            {
                header: 'Nag Count',
                data: p =>
                    p.offer.getIn(['contract_statuses', 'nag_count'])
                        ? p.offer.getIn(['contract_statuses', 'nag_count'])
                        : '',
                sortData: p => p.getIn(['contract_statuses', 'nag_count']),

                style: { width: 0.04 },
            },
            {
                header: 'HRIS Status',
                data: p =>
                    p.offer.getIn(['contract_statuses', 'hr_status']) == undefined
                        ? '-'
                        : p.offer.getIn(['contract_statuses', 'hr_status']),
                sortData: p =>
                    p.getIn(['contract_statuses', 'hr_status']) == undefined
                        ? ''
                        : p.getIn(['contract_statuses', 'hr_status']),

                filterLabel: 'HRIS Status',
                filterCategories: ['-', 'Processed', 'Printed'],
                filterFuncs: [p => p.getIn(['contract_statuses', 'hr_status']) == undefined].concat(
                    ['Processed', 'Printed'].map(status => p =>
                        p.getIn(['contract_statuses', 'hr_status']) == status
                    )
                ),

                style: { width: 0.05 },
            },
            {
                header: 'Printed Date',
                data: p =>
                    p.offer.getIn(['contract_statuses', 'printed_at'])
                        ? new Date(
                              p.offer.getIn(['contract_statuses', 'printed_at'])
                          ).toLocaleString()
                        : '',
                sortData: p => p.getIn(['contract_statuses', 'printed_at']),

                style: { width: 0.07 },
            },
            {
                header: 'DDAH Status',
                data: p =>
                    p.offer.getIn(['contract_statuses', 'ddah_status']) == undefined
                        ? '-'
                        : p.offer.getIn(['contract_statuses', 'ddah_status']),
                sortData: p =>
                    p.getIn(['contract_statuses', 'ddah_status']) == undefined
                        ? ''
                        : p.getIn(['contract_statuses', 'ddah_status']),

                filterLabel: 'DDAH Status',
                filterCategories: ['-', 'Accepted', 'Pending', 'Signed'],
                filterFuncs: [
                    p => p.getIn(['contract_statuses', 'ddah_status']) == undefined,
                ].concat(
                    ['Accepted', 'Pending', 'Signed'].map(status => p =>
                        p.getIn(['contract_statuses', 'ddah_status']) == status
                    )
                ),

                style: { width: 0.06 },
            },
        ];

        return (
            <Grid fluid id="offers-grid">
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
                    config={this.config}
                    getOffers={() => this.props.appState.getOffersList()}
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
