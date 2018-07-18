import React from 'react';
import {
    Grid
} from 'react-bootstrap';

class Contracts extends React.Component {
    constructor(props) {
        super(props);
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
        let offers = this.props.appState.getOffersList();
        console.log(offers);
        if (!offers || (offers && offers.size === 0)) {
            return (
                <Grid>
                    <div>
                       <p>No contracts in record.</p>
                    </div>
                </Grid>
            );
        }
        else if (offers) {
            return (
                <Grid>
                    <div>
                        {offers.map((val, key) =>
                            <p>
                                {val.get('firstName')}
                            </p>
                        )}
                    </div>
                </Grid>
            );
        }
    }
}

export { Contracts };