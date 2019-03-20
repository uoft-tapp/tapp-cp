import React from "react";
import {
    Panel,
    Form,
    FormGroup,
    ControlLabel,
    InputGroup,
    FormControl
} from "react-bootstrap";

class SessionsForm extends React.Component {
    render() {
        let session = this.props.appState.getSelectedSession(),
            pay = this.props.appState.getSessionPay(session);
        pay = pay ? pay : "";
        return (
            <Panel className="sessions">
                <Form inline>
                    <FormGroup id="pay">
                        <ControlLabel>Session Pay:</ControlLabel>&ensp;
                        <InputGroup>
                            <InputGroup.Addon>$</InputGroup.Addon>
                            <FormControl
                                type="number"
                                min="0.00"
                                step="0.01"
                                value={pay}
                                disabled={session == "N/A"}
                                onChange={event =>
                                    this.props.appState.updateSessionPay(
                                        session,
                                        event.target.value
                                    )
                                }
                                onBlur={event =>
                                    this.props.appState.updateSessionPay(
                                        session,
                                        event.target.value,
                                        true
                                    )
                                }
                            />
                        </InputGroup>
                    </FormGroup>
                </Form>
            </Panel>
        );
    }
}

export { SessionsForm };
