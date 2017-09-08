import React from 'react';
import { Grid, ButtonToolbar, Button } from 'react-bootstrap';

import { DdahForm } from './ddahForm.js';

class InstrControlPanel extends React.Component {
    render() {
        let nullCheck = this.props.appState.isDutiesListNull();
        if (nullCheck) {
            return <div id="loader" />;
        }

        let fetchCheck = this.props.appState.fetchingDuties();
        let cursorStyle = { cursor: fetchCheck ? 'progress' : 'auto' };

        return (
            <Grid fluid id="instr-grid">
                <DdahForm {...this.props} />
                <ButtonToolbar>
                    <Button bsStyle="primary">Save Worksheet</Button>
                    <Button bsStyle="danger" onClick={() => this.props.appState.clearDdah()}>
                        Clear Worksheet
                    </Button>
                </ButtonToolbar>
            </Grid>
        );
    }
}

export { InstrControlPanel };
