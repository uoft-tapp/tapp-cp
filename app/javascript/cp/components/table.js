import React from "react";
import PropTypes from "prop-types";
import { Table, Glyphicon } from "react-bootstrap";

function SortButton(props) {
    let iconName = null;
    const direction = +props.direction;
    if (direction === 1) {
        iconName = "sort-by-alphabet";
    } else if (direction === -1) {
        iconName = "sort-by-alphabet-alt";
    }
    if (!iconName) {
        return null;
    }
    return <Glyphicon glyph={iconName} />;
}

const THeader = props => {
    const { selectedSortFields, cycleSort } = props;
    const sortDirs = {};
    for (let [field, dir] of selectedSortFields) {
        sortDirs[field] = dir;
    }

    function cycleSortFactory(i, dummy) {
        if (dummy) {
            return () => {};
        }
        return () => cycleSort(i);
    }

    return (
        <thead>
            <tr>
                {props.config.map((field, i) => (
                    <th
                        key={"header-" + i}
                        onClick={cycleSortFactory(i, field.headerNoSort)}
                        style={{ cursor: "pointer" }}
                        title={"Click to sort column"}
                    >
                        <div style={{ position: "relative" }}>
                            {field.header}
                            {!field.headerNoSort && (
                                <div
                                    style={{
                                        position: "absolute",
                                        right: "2px",
                                        bottom: "0px",
                                        color: "#a0a0a0",
                                        background: "white"
                                    }}
                                >
                                    <SortButton direction={sortDirs[i]} />
                                </div>
                            )}
                        </div>
                    </th>
                ))}
            </tr>
        </thead>
    );
};

const OfferRow = props => (
    <tr key={"offer-" + props.offerId + "-row"}>
        {props.config.map((field, i) => (
            <td
                key={"offer-" + props.offerId + "-row-" + i}
                style={field.style ? Object.assign({}, field.style) : null}
            >
                {field.data({ offer: props.offer, offerId: props.offerId })}
            </td>
        ))}
    </tr>
);

class TableInst extends React.Component {
    // acquire and process list of applicants
    filterOffers() {
        this.offers = this.props.getOffers();

        // apply selected filters
        let selectedFilters = this.props.getSelectedFilters();
        for (var field of selectedFilters.keys()) {
            this.offers = this.offers.filter(offer =>
                // disjointly apply filters within the same field
                selectedFilters
                    .get(field)
                    .reduce(
                        (acc, category) =>
                            acc ||
                            this.props.config[field].filterFuncs[category](
                                offer
                            ),
                        false
                    )
            );
        }

        // apply selected sorts
        let selectedSortFields = this.props.getSelectedSortFields();
        this.offers = this.offers.sort((a, b) =>
            this.sortOffers(a, b, selectedSortFields)
        );
    }

    // sort offers by the list of criteria, in order
    // in accordance with Array.sort, returns -1 if a sorts first, 1 if b sorts first, or 0 otherwise
    sortOffers(a, b, criteria) {
        if (criteria.size == 0) {
            return 0;
        }

        let [field, dir] = [criteria.first().get(0), criteria.first().get(1)];

        let aData = this.props.config[field].sortData(a);
        let bData = this.props.config[field].sortData(b);

        if (aData < bData) {
            return -dir;
        }

        if (aData > bData) {
            return dir;
        }

        // if the offer values for this field are equal, apply the next sort criterion
        return this.sortOffers(a, b, criteria.slice(1));
    }

    componentWillMount() {
        this.filterOffers();
    }

    componentWillUpdate() {
        this.filterOffers();
    }

    render() {
        const selectedSortFields = this.props.getSelectedSortFields();
        const offerRows = this.offers.toArray().map(([key, val]) => {
                                return <OfferRow
                                    key={"offer-" + key}
                                    offerId={key}
                                    offer={val}
                                    {...this.props}
                                />
                            })
        return (
            <div className="table-container">
                <div className="table-body">
                    <Table striped bordered condensed hover>
                        <THeader
                            config={this.props.config}
                            selectedSortFields={selectedSortFields}
                            cycleSort={this.props.cycleSort}
                        />
                        <tbody>
                            {offerRows}
                        </tbody>
                    </Table>
                </div>
                <div id="table-total">Total = {this.offers.size}</div>
            </div>
        );
    }
}

TableInst.propTypes = {
    config: PropTypes.arrayOf(
        PropTypes.shape({
            // label for table column, used in table header
            header: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
                .isRequired,
            // function that produces the data needed for this column, for each row
            data: PropTypes.func.isRequired,

            // function that produces the data by which rows in this column will be sorted
            // eg. sortData might produce a string, for native (lexicographic) string sorting
            sortData: PropTypes.func,

            // label for filter corresponding to this column
            filterLabel: PropTypes.string,
            // categories for filtering on this column
            // eg. for the column containing the offer's program, categories might include: PostDoc, PhD, etc.
            filterCategories: PropTypes.arrayOf(PropTypes.string),
            // functions corresponding to the filter categories for this column; a function should return false
            // on a row that should *not* be displayed when filtering by its corresponding category
            filterFuncs: PropTypes.arrayOf(PropTypes.func),

            // style applied to cells in table column
            style: PropTypes.shape({
                // column width - this should be a number between 0 and 1
                width: PropTypes.number
            })
        })
    ).isRequired,

    // function that returns the offers for this table
    getOffers: PropTypes.func.isRequired,
    // function that returns the currently selected sort fields for this table
    getSelectedSortFields: PropTypes.func,
    // function that returns the currently selected filter fields+categories for this table
    getSelectedFilters: PropTypes.func,

    // course id of the course to which these offers have applied (for the ABC view)
    course: PropTypes.string,
    // whether the offers in this table have been assigned to this course (for the ABC view)
    assigned: PropTypes.bool
};

export { TableInst as Table };
