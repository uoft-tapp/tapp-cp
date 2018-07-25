import React from 'react';
import {
    Grid
} from 'react-bootstrap';

class History extends React.Component {
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
        return (
            <Grid>
                <div>
                    <p>History</p>
                </div>
            </Grid>
        );
    }
}

export { History };