import React from 'react';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ApplicantTableMenu } from './applicantTableMenu.js';
import { ApplicantTable } from './applicantTable.js';
import { routeConfig } from '../routeConfig.js';

class Unassigned extends React.Component {
    render() {
        let nullCheck = this.props.anyNull();
        if (nullCheck) {
            return <div id="loader" />;
        }

        let fetchCheck = this.props.anyFetching();
        let cursorStyle = { cursor: fetchCheck ? 'progress' : 'auto' };

        // table/menu configuration
        this.config = [
            {
                header: 'Last Name',
                data: p =>
                    <span
                        className="highlight"
                        onClick={() => this.props.selectApplicant(p.applicantId)}>
                        {p.applicant.lastName}&nbsp;
                        {p.applicant.notes && <i className="fa fa-paperclip" />}
                    </span>,
                sortData: p => p.applicant.lastName,

                style: { width: 0.10 },
            },
            {
                header: 'First Name',
                data: p => p.applicant.firstName,
                sortData: p => p.applicant.firstName,

                style: { width: 0.10 },
            },
            {
                header: 'Dept.',
                data: p => p.applicant.dept,
                sortData: p => p.applicant.dept,

                filterLabel: 'Dept.',
                filterCategories: ['DCS', 'Other'],
                filterFuncs: [
                    p => p.applicant.dept == 'Computer Science',
                    p => p.applicant.dept != 'Computer Science',
                ],

                style: { width: 0.08 },
            },
            {
                header: 'Prog.',
                data: p => p.applicant.program,
                sortData: p => p.applicant.program,

                filterLabel: 'Prog.',
                filterCategories: ['PostDoc', 'PhD', 'Masters', 'UG'],
                filterFuncs: [
                    p => p.applicant.program == 'PostDoc',
                    p => p.applicant.program == 'PhD',
                    p => ['MSc', 'MASc', 'MScAC', 'MEng', 'OG'].includes(p.applicant.program),
                    p => p.applicant.program == 'UG',
                ],

                style: { width: 0.05 },
            },
            {
                header: 'Year',
                data: p => p.applicant.year,
                sortData: p => p.applicant.year,

                style: { width: 0.03 },
            },
            {
                header: 'Email',
                data: p => p.applicant.email,
                sortData: p => p.applicant.email,

                style: { width: 0.20 },
            },
            {
                header: 'Course Preferences',
                data: p =>
                    <ButtonToolbar>
                        {this.props.getApplicationById(p.applicantId).prefs.map(pref =>
                            <Link
                                to={
                                    routeConfig.abc.route +
                                    '#' +
                                    pref.positionId +
                                    '-' +
                                    p.applicantId +
                                    '-0'
                                }
                                key={'link-' + p.applicantId + '-' + pref.positionId}>
                                <Button
                                    bsSize="xsmall"
                                    style={{ borderColor: '#555' }}
                                    onClick={() =>
                                        this.props.selectSingleCourse(pref.positionId)}>
                                    {this.props.getCourseCodeById(pref.positionId)}
                                </Button>
                            </Link>
                        )}
                    </ButtonToolbar>,

                filterLabel: 'Course',
                filterCategories: this.props.getCourseCodes(),
                // for each course, filter out applicants who did not apply to that course
                filterFuncs: Object.keys(this.props.getCoursesList()).map(key => p =>
                    this.props
                        .getApplicationById(p.applicantId)
                        .prefs.some(pref => pref.positionId == key)
                ),
            },
        ];

        return (
            <Grid fluid id="unassigned-grid">
                <ApplicantTableMenu
                    config={this.config}
                    getSelectedSortFields={() => this.props.getSorts()}
                    anyFilterSelected={field => this.props.anyFilterSelected(field)}
                    isFilterSelected={(field, category) =>
                        this.props.isFilterSelected(field, category)}
                    toggleFilter={(field, category) => this.props.toggleFilter(field, category)}
                    clearFilters={() => this.props.clearFilters()}
                    addSort={field => this.props.addSort(field)}
                    removeSort={field => this.props.removeSort(field)}
                    toggleSortDir={field => this.props.toggleSortDir(field)}
                />

                <ApplicantTable
                    config={this.config}
                    getApplicants={() => this.props.getUnassignedApplicants()}
                    rowId={p => 'unassigned-' + p.applicantId}
                    getSelectedSortFields={() => this.props.getSorts()}
                    getSelectedFilters={() => this.props.getFilters()}
                    width="100vw"
                />
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

export { Unassigned };
