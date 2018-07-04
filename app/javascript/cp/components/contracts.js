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
        return (
            <Grid>
                <div>
                    <p>Contracts</p>
                </div>
            </Grid>
        );
    }
}

export { Contracts };