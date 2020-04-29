// Store and interface with the application's data
import React, { useState } from "react";
import { useStore, useActions } from "easy-peasy";

import { Form, FormGroup, ControlLabel, FormControl } from "react-bootstrap";

function SessionSelector(props) {
    const { sessions, activeSession } = useStore(state => state.data);
    const { setActiveSession } = useActions(state => state.data);
    const activeSessionIndex = sessions.indexOf(activeSession);

    function onSessionChange(e) {
        const newActiveSession = sessions[e.target.value];
        setActiveSession(newActiveSession);
    }

    return (
        <Form>
            <FormGroup>
                <ControlLabel>Select Session</ControlLabel>
                <FormControl
                    componentClass="select"
                    onChange={onSessionChange}
                    value={activeSessionIndex}
                >
                    {sessions.map((p, i) => {
                        return (
                            <option key={p.id} value={i}>
                                {p.semester} {p.year}
                            </option>
                        );
                    })}
                </FormControl>
            </FormGroup>
        </Form>
    );
}

export { SessionSelector };
