import React from 'react';
import {
    Button,
    Grid,
    Panel
} from 'react-bootstrap';

const ContractPanel = props =>
    //<p>{props.offer.get('course')}</p>;
    <Panel>
        <h3>{props.offer.get('course')}</h3>
        <div>
            <Button>Details</Button>
            <Button>DDAH Form</Button>
        </div>

    </Panel>;


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
                       <h2>Sorry, no contracts in record.</h2>
                    </div>
                </Grid>
            );
        }
        else {
            return (
                <Grid>
                    <div>
                        {offers.map((val, key) =>
                            <ContractPanel offer={val} />
                        )}
                    </div>
                </Grid>
            );
        }
    }
}

export { Contracts };