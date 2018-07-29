import React from 'react';
import {
    Grid,
    Panel,
} from 'react-bootstrap';

const InvalidContract = props => {
    return (
        <Grid>
            <div>
                <h3>Invalid contract</h3>
            </div>
        </Grid>
    );
}

class Contract extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let offers = this.props.appState.getOffersList();
        if (!offers || (offers && offers.size === 0)) {
            return <InvalidContract />;
        }
        // Check if id in route matches any offer in appState
        let invalidContract = true;
        let routeId = this.props.match.params.id;
        let offer = null;
        offers.map((val, id) => {
            if (id === routeId) {
                invalidContract = false;
                offer = val;
            }
        });
        if (invalidContract) {
            return <InvalidContract />;
        }

        return (
            <Grid>
                <Panel>
                    <Panel.Heading>
                        <Panel.Title>{offer.get('course')}</Panel.Title>
                    </Panel.Heading>
                </Panel>
            </Grid>
        );
    }
}

export { Contract };