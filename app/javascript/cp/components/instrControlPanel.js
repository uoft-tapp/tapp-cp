import React from 'react';
import { Grid } from 'react-bootstrap';

import { DdahForm } from './ddahForm.js';

class InstrControlPanel extends React.Component {
    render() {
        let nullCheck =
            this.props.appState.isDutiesListNull() || this.props.appState.isTrainingsListNull();
        if (nullCheck) {
            return <div id="loader" />;
        }

        let fetchCheck =
            this.props.appState.fetchingDuties() || this.props.appState.fetchingTrainings();
        let cursorStyle = { cursor: fetchCheck ? 'progress' : 'auto' };

        return (
            <Grid fluid id="instr-grid">
                <DdahForm {...this.props} />
            </Grid>
        );
    }
}

export { InstrControlPanel };
