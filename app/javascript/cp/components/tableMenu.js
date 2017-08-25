import React from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Button, DropdownButton, MenuItem, Glyphicon } from 'react-bootstrap';

class TableMenu extends React.Component {
    render() {
        return (
            <div className="table-menu">
                <ButtonGroup>
                    <Button onClick={this.props.clearFilters}>Clear filters</Button>

                    {this.props.config.map(
                        (field, i) =>
                            field.filterLabel &&
                            <DropdownButton
                                title={field.filterLabel}
                                key={field.filterLabel + '-dropdown'}
                                id={field.filterLabel + '-dropdown'}
                                bsStyle={this.props.anyFilterSelected(i) ? 'primary' : 'default'}>
                                {field.filterCategories.map((category, j) =>
                                    <MenuItem
                                        key={'filter-' + category}
                                        eventKey={i + '.' + j}
                                        onSelect={eventKey =>
                                            this.props.toggleFilter(
                                                ...eventKey.split('.').map(Number)
                                            )}
                                        active={this.props.isFilterSelected(i, j)}>
                                        {category}
                                    </MenuItem>
                                )}
                            </DropdownButton>
                    )}
                </ButtonGroup>

                <ButtonGroup style={{ paddingLeft: '1vw' }}>
                    {this.props.getSelectedSortFields().map(([sortField, dir]) => {
                        let name = this.props.config[sortField].header;

                        return (
                            <DropdownButton
                                title={
                                    <span>
                                        {name} {icon[dir]}
                                    </span>
                                }
                                key={'sort-' + sortField}
                                id={'sort-' + sortField}
                                noCaret>
                                <MenuItem onSelect={() => this.props.toggleSortDir(sortField)}>
                                    {name} {icon[-dir]}
                                </MenuItem>

                                <MenuItem onSelect={() => this.props.removeSort(sortField)}>
                                    Clear field
                                </MenuItem>
                            </DropdownButton>
                        );
                    })}

                    <DropdownButton
                        title="Add sort field"
                        id="sort-dropdown"
                        bsStyle="info"
                        noCaret>
                        {this.props.config.map(
                            (field, i) =>
                                field.sortData &&
                                <MenuItem
                                    key={'sort-' + field.header}
                                    onSelect={() => this.props.addSort(i)}>
                                    {field.header}
                                </MenuItem>
                        )}
                    </DropdownButton>
                </ButtonGroup>
            </div>
        );
    }
}

const icon = {
    '1': <Glyphicon style={{ fontSize: '7pt' }} glyph={'menu-up'} />,
    '-1': <Glyphicon style={{ fontSize: '7pt' }} glyph={'menu-down'} />,
};

TableMenu.propTypes = {
    config: PropTypes.arrayOf(
        PropTypes.shape({
            // label for table column, used in table header
            header: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
            // function that produces the data needed for this column, for each row
            data: PropTypes.func.isRequired,

            // function that produces the data by which rows in this column will be sorted
            // eg. sortData might produce a string, for native (lexicographic) string sorting
            sortData: PropTypes.func,

            // label for filter corresponding to this column
            filterLabel: PropTypes.string,
            // categories for filtering on this column
            // eg. for the column containing the applicant's program, categories might include: PostDoc, PhD, etc.
            filterCategories: PropTypes.arrayOf(PropTypes.string),
            // functions corresponding to the filter categories for this column; a function should return false
            // on a row that should *not* be displayed when filtering by its corresponding category
            filterFuncs: PropTypes.arrayOf(PropTypes.func),
        })
    ).isRequired,

    // function that checks whether any of the filter categories for the given filter are selected
    anyFilterSelected: PropTypes.func.isRequired,
    // function that checks whether a given filter category is selected
    isFilterSelected: PropTypes.func.isRequired,
    // function that toggles a given filter category between selected and unselected
    toggleFilter: PropTypes.func.isRequired,
    // function that unselects all filters
    clearFilters: PropTypes.func.isRequired,

    // function that selects a sort field
    addSort: PropTypes.func.isRequired,
    // function that unselects a sort field
    removeSort: PropTypes.func.isRequired,
    // function that changes the sort direction of a currently selected sort field
    toggleSortDir: PropTypes.func.isRequired,
    // function that returns the currently selected sort fields
    getSelectedSortFields: PropTypes.func.isRequired,
};

export { TableMenu };
