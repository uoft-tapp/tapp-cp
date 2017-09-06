import React from 'react';
import { Grid } from 'react-bootstrap';

import { DdahForm } from './ddahForm.js';

class InstrControlPanel extends React.Component {
    render() {
        let nullCheck = false;
        if (nullCheck) {
            return <div id="loader" />;
        }

        let fetchCheck = false;
        let cursorStyle = { cursor: fetchCheck ? 'progress' : 'auto' };

        return (
            <Grid fluid id="ddah-grid">
                <h4>Allocation of Hours Worksheet</h4>
                <DdahForm {...this.props} />
            </Grid>
        );
    }
}

export { InstrControlPanel };
